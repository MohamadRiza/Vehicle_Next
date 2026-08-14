"use server";

import { CheckUser } from "@/lib/CheckUser";
import { db } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function getUserProfile() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return { success: false, error: "Unauthorized" };
    }

    let user = await db.user.findUnique({
      where: { clerkUserId: clerkId },
    });

    if (!user) {
      user = await CheckUser();
    }

    const clerkUser = await currentUser();

    const email = user?.email || clerkUser?.emailAddresses?.[0]?.emailAddress || "";
    const name = user?.name || `${clerkUser?.firstName || ""} ${clerkUser?.lastName || ""}`.trim();

    return {
      success: true,
      user: {
        id: user.id,
        name: name,
        email: email,
        phone: user?.phone || "",
        country: user?.country || "Sri Lanka",
        address: user?.address || "",
        city: user?.city || "",
        postalCode: user?.postalCode || "",
        imageUrl: user?.imageUrl || clerkUser?.imageUrl || "",
      },
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return { success: false, error: error.message };
  }
}

export async function updateUserProfile(data) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return { success: false, error: "Please sign in to update your profile." };
    }

    let user = await db.user.findUnique({
      where: { clerkUserId: clerkId },
    });

    if (!user) {
      user = await CheckUser();
    }

    const { name, phone, country, address, city, postalCode } = data;

    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: {
        name: name || user.name,
        phone: phone ? phone.trim() : null,
        country: country ? country.trim() : null,
        address: address ? address.trim() : null,
        city: city ? city.trim() : null,
        postalCode: postalCode ? postalCode.trim() : null,
      },
    });

    revalidatePath("/profile");
    revalidatePath("/reservations");

    return {
      success: true,
      user: JSON.parse(JSON.stringify(updatedUser)),
    };
  } catch (error) {
    console.error("Error updating user profile:", error);
    return { success: false, error: error.message };
  }
}
