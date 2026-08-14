"use server";

import { db } from "@/lib/prisma";
import { createClient } from "@/lib/Supabase";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import {v4 as uuidv4} from "uuid";

// function to convert file to base64
async function fileToBase64(file) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  return buffer.toString("base64");
}

export async function processCarImageWithAI(file) {
  try {
    // ── Local AI Server Integration with fallback ─────────
    if (process.env.USE_LOCAL_AI === "true") {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("http://localhost:8000/predict", {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          const result = await res.json();
          if (result.success) {
            return {
              success: true,
              data: result.data,
            };
          }
        }
      } catch (localError) {
        console.warn("Local AI server unavailable, falling back to Gemini AI:", localError.message);
      }
    }


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
    and give me price in USD without ($)symbol,
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
    } catch (parseError) {
      console.error("failed to parse AI response: ", parseError);
      return {
        success: false,
        error: "failed to parse AI response",
      };
    }
  } catch (error) {
    throw new Error("AI prediction error: " + error.message);
  }
}

export async function addCar({ carData, image }) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized: Please log in");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User record not found in database");

    const carId = uuidv4();
    const folderPath = `cars/${carId}`;

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    try {
      await supabase.storage.createBucket("car-images", { public: true });
    } catch (bErr) {
      // Bucket may already exist or creation prevented by RLS
    }

    const imageUrls = [];

    for (let i = 0; i < image.length; i++) {
      const base64Data = image[i];

      // skip if image data is not valid 
      if (!base64Data || !base64Data.startsWith("data:image/")) {
        console.warn("Skipping invalid image data");
        continue;
      }

      const base64 = base64Data.split(",")[1];
      const imageBuffer = Buffer.from(base64, "base64");

      const mineMatch = base64Data.match(/data:image\/([a-zA-Z0-9]+);/);
      const fileExtentions = mineMatch ? mineMatch[1] : "jpeg";

      const fileName = `image-${Date.now()}-${i}.${fileExtentions}`;
      const filePath = `${folderPath}/${fileName}`;

      const { data, error } = await supabase.storage
        .from("car-images")
        .upload(filePath, imageBuffer, {
          contentType: `image/${fileExtentions}`,
          upsert: true,
        });

      if (error) {
        console.warn("Supabase storage upload fallback used:", error.message);
        // Fallback: If Supabase Storage bucket fails or is missing, use base64 image data URL so car creation ALWAYS succeeds in DB!
        imageUrls.push(base64Data);
      } else {
        const publicURL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/car-images/${filePath}`;
        imageUrls.push(publicURL);
      }
    }

    if (imageUrls.length === 0) {
      throw new Error("No valid images were provided for this car");
    }

    const car = await db.car.create({
      data: {
        id: carId,
        make: carData.make,
        model: carData.model,
        year: parseInt(carData.year),
        price: parseFloat(carData.price),
        mileage: parseInt(carData.mileage),
        color: carData.color,
        fuelType: carData.fuelType,
        transmission: carData.transmission,
        bodyType: carData.bodyType,
        seats: carData.seats ? parseInt(carData.seats) : null,
        description: carData.description,
        status: carData.status || "AVAILABLE",
        feautured: Boolean(carData.feautured),
        image: imageUrls,
      },
    });

    revalidatePath("/admin/cars");
    revalidatePath("/cars");
    revalidatePath("/admin");

    return {
      success: true,
      car: JSON.parse(JSON.stringify(car)),
    };
  } catch (error) {
    console.error("Error adding car:", error);
    throw new Error(error.message || "Failed to add car");
  }
}

export async function getCars(filters = {}) {
  try {
    const {
      search,
      make,
      bodyType,
      fuelType,
      transmission,
      priceRange,
      status,
      sortBy = "newest",
      page = 1,
      limit = 9,
    } = filters;

    const where = {};

    if (status && status !== "ALL") {
      where.status = status;
    }

    if (make && make !== "ALL") {
      where.make = { equals: make, mode: "insensitive" };
    }

    if (bodyType && bodyType !== "ALL") {
      where.bodyType = { equals: bodyType, mode: "insensitive" };
    }

    if (fuelType && fuelType !== "ALL") {
      where.fuelType = { equals: fuelType, mode: "insensitive" };
    }

    if (transmission && transmission !== "ALL") {
      where.transmission = { equals: transmission, mode: "insensitive" };
    }

    if (priceRange && priceRange !== "ALL") {
      if (priceRange === "under_20k") where.price = { lte: 20000 };
      else if (priceRange === "20k_50k") where.price = { gte: 20000, lte: 50000 };
      else if (priceRange === "50k_100k") where.price = { gte: 50000, lte: 100000 };
      else if (priceRange === "above_100k") where.price = { gte: 100000 };
    }

    if (search && search.trim() !== "") {
      where.OR = [
        { make: { contains: search, mode: "insensitive" } },
        { model: { contains: search, mode: "insensitive" } },
        { color: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    let orderBy = { createdAt: "desc" };
    if (sortBy === "price_asc") orderBy = { price: "asc" };
    else if (sortBy === "price_desc") orderBy = { price: "desc" };
    else if (sortBy === "year_desc") orderBy = { year: "desc" };
    else if (sortBy === "mileage_asc") orderBy = { mileage: "asc" };

    const pageNum = parseInt(page || 1, 10);
    const limitNum = parseInt(limit || 9, 10);
    const skip = (pageNum - 1) * limitNum;

    const [total, cars] = await Promise.all([
      db.car.count({ where }),
      db.car.findMany({
        where,
        orderBy,
        skip,
        take: limitNum,
      }),
    ]);

    const totalPages = Math.ceil(total / limitNum) || 1;

    return {
      success: true,
      cars: JSON.parse(JSON.stringify(cars)),
      total,
      totalPages,
      currentPage: pageNum,
    };
  } catch (error) {
    console.error("Error fetching cars:", error);
    return { success: false, error: error.message, cars: [], total: 0, totalPages: 1, currentPage: 1 };
  }
}

export async function updateCarStatus(carId, status) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user || user.role !== "ADMIN") {
      throw new Error("Only admins can update car status");
    }

    const updatedCar = await db.car.update({
      where: { id: carId },
      data: { status },
    });

    revalidatePath("/admin/cars");
    revalidatePath("/cars");
    revalidatePath("/admin");

    return { success: true, car: JSON.parse(JSON.stringify(updatedCar)) };
  } catch (error) {
    console.error("Error updating car status:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteCar(carId) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user || user.role !== "ADMIN") {
      throw new Error("Only admins can delete cars");
    }

    await db.car.delete({
      where: { id: carId },
    });

    revalidatePath("/admin/cars");
    revalidatePath("/cars");
    revalidatePath("/admin");

    return { success: true };
  } catch (error) {
    console.error("Error deleting car:", error);
    return { success: false, error: error.message };
  }
}

export async function getCarById(id) {
  try {
    const car = await db.car.findUnique({
      where: { id },
    });

    if (car) {
      return { success: true, car: JSON.parse(JSON.stringify(car)) };
    }

    return { success: false, error: "Car not found" };
  } catch (error) {
    console.error("Error fetching car by id:", error);
    return { success: false, error: error.message };
  }
}

export async function getFeaturedCars() {
  try {
    let cars = await db.car.findMany({
      where: {
        feautured: true,
        status: "AVAILABLE",
      },
      take: 6,
      orderBy: { createdAt: "desc" },
    });

    if (cars.length < 3) {
      const additionalCars = await db.car.findMany({
        where: {
          status: "AVAILABLE",
          id: { notIn: cars.map((c) => c.id) },
        },
        take: 6 - cars.length,
        orderBy: { createdAt: "desc" },
      });
      cars = [...cars, ...additionalCars];
    }

    return {
      success: true,
      cars: JSON.parse(JSON.stringify(cars)),
    };
  } catch (error) {
    console.error("Error fetching featured cars:", error);
    return { success: false, cars: [] };
  }
}
