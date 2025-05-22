import { db } from "@/lib/prisma";
import { createClient } from "@/lib/Supabase";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

// function to convert file to base64
async function fileToBase64(file) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  return buffer.toString("base64");
}

export async function processCarImageWithAI(file) {
  try {
    //check the api key is available?
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI API key is not found...");
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const base64Image = await fileToBase64(file);

    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: file.type,
      },
    };

    const prompt = `Analyze this car image and extract the following information:
    1. make (manufacturer)
    2. model
    3. year (approximately)
    4. color
    5. body type (SUV, Sedan, Hatchback, etc.)
    6. mileage
    7. fuel type (your best guess)
    8. transmission type (your best guess)
    9. price (your best guess)
    10. short description as to be added to a car listing

    format your respond as a clean JSON object with thase fields:
    {
        "make": "",
        "model": "",
        "year": 0000,
        "color": "",
        "price": "",
        "mileage": "",
        "bodytype: "",
        "fueltype": "",
        "transmission": "",
        "description": "",
        "confidence": 0.0
    }

    for confidence, provide a value between 0 and 1 representing how confident you are in your ovarall identification. only respond with the JSON object, nothing else.
    `;

    const result = await model.generateContent([imagePart, prompt]);
    const response = await result.response;
    const text = response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

    try {
      const carDetails = JSON.parse(cleanedText);

      const requiredFields = [
        "make",
        "model",
        "year",
        "color",
        "bodytype",
        "price",
        "mileage",
        "fueltype",
        "transmission",
        "description",
        "confidence",
      ];

      const missingFields = requiredFields.filter(
        (field) => !(field in carDetails)
      );

      if (missingFields.length > 0) {
        throw new Error(
          `AI response missing required fields: ${missingFields.join(", ")}`
        );
      }

      return {
        success: true,
        data: carDetails,
      };
    } catch (error) {
      console.error("failled to parse AI response: ", parseError);
      return {
        success: false,
        error: "failled to parse AI response",
      };
    }
  } catch (error) {
    throw new Error("GEMINI API error" + error.message);
  }
}

export async function addCar({ carData, images }) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    const carId = uuidv4();
    const folderPath = `cars/${carId}`;

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const imageUrls = [];

    for (let i = 0; i < images.length; i++) {
      const base64Data = images[i];

      //skip if image data is not valid
      if (!base64Data || !base64Data.starstWith("data.image/")) {
        console.warn("Skipping invalid image data");
        continue;
      }
      //extract the base part
      const base64 = base64Data.split(",")[1];
      const imageBuffer = Buffer.from(base64, "base64");

      //determine file extentions from the URL
      const mineMatch = base64Data.match(/data:image\/([a-zA-Z0-9]+);/);
      const fileExtentions = mineMatch ? mineMatch[1] : "jpeg";

      //create file name
      const fileName = `image-${Date.now()}-${fileExtentions}`;
      const filePath = `${folderPath}/${fileName}`;

      const { data, error } = await supabase.storage
        .from("car-images")
        .upload(filePath, imageBuffer, {
          contentType: `image/${fileExtentions}`,
        });

      if (error) {
        console.error("Error Uploading Image: ", error);
        throw new Error(`Failled to uplaod image: ${error.message}`);
      }

      const publicURL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/car-images/${filePath}`; //disable catch in config

      imageUrls.push(publicURL);
    }

    if (imageUrls.length === 0) {
      throw new Error("No valid images where uploaded");
    }

    const car = await db.car.create({
      data: {
        id: carId,
        make: carData.make,
        model: carData.model,
        year: carData.year,
        price: carData.price,
        mileage: carData.mileage,
        color: carData.color,
        fuelType: carData.fuelType,
        transmission: carData.transmission,
        bodyType: carData.bodyType,
        seats: carData.seats,
        description: carData.description,
        status: carData.status,
        feautured: carData.feautured,
        image: imageUrls, //store arrays of image urls
      },
    });

    revalidatePath("/admin/cars");

    return {
      success: true,
    };
  } catch (error) {
    throw new Error("error adding car: " + error.message);
  }
}
