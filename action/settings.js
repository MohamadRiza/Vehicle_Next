"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const defaultDays = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

const dayOrder = {
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
  SUNDAY: 7,
};

/**
 * PUBLIC: Fetch live dealership info, location link, and working schedule
 */
export async function getPublicDealershipInfo() {
  try {
    let dealership = await db.dealershipInfo.findFirst({
      include: {
        workingHours: true,
      },
    });

    if (!dealership) {
      return {
        name: "Vehicle Motors",
        address: "69 Car Street, Available, SL, 60100",
        phone: "+94 078 797 9131",
        email: "rawufdeenriza@gmail.com",
        mapUrl: "https://maps.google.com/?q=69+Car+Street+Available+SL",
        workingHours: defaultDays.map((day) => ({
          dayOfWeek: day,
          openTime: "09:00",
          closeTime: "18:00",
          isOpen: day !== "SUNDAY",
        })),
      };
    }

    // Sort working hours MONDAY -> SUNDAY
    const sortedHours = (dealership.workingHours || []).sort(
      (a, b) => (dayOrder[a.dayOfWeek] || 0) - (dayOrder[b.dayOfWeek] || 0)
    );

    return {
      id: dealership.id,
      name: dealership.name || "Vehicle Motors",
      address: dealership.address || "69 Car Street, Available, SL, 60100",
      phone: dealership.phone || "+94 078 797 9131",
      email: dealership.email || "rawufdeenriza@gmail.com",
      mapUrl: dealership.mapUrl || "https://maps.google.com/?q=69+Car+Street+Available+SL",
      workingHours: JSON.parse(JSON.stringify(sortedHours)),
    };
  } catch (error) {
    console.error("Error fetching public dealership info:", error);
    return {
      name: "Vehicle Motors",
      address: "69 Car Street, Available, SL, 60100",
      phone: "+94 078 797 9131",
      email: "rawufdeenriza@gmail.com",
      mapUrl: "https://maps.google.com/?q=69+Car+Street+Available+SL",
      workingHours: defaultDays.map((day) => ({
        dayOfWeek: day,
        openTime: "09:00",
        closeTime: "18:00",
        isOpen: day !== "SUNDAY",
      })),
    };
  }
}

/**
 * ADMIN: Get dealership settings and working hours
 */
export async function getAdminSettings() {
  try {
    let dealership = await db.dealershipInfo.findFirst({
      include: {
        workingHours: true,
      },
    });

    if (!dealership) {
      dealership = await db.dealershipInfo.create({
        data: {
          name: "Vehicle Motors",
          address: "69 Car Street, Available, SL, 60100",
          phone: "+94 078 797 9131",
          email: "rawufdeenriza@gmail.com",
          mapUrl: "https://maps.google.com/?q=69+Car+Street+Available+SL",
        },
        include: { workingHours: true },
      });
    }

    // Ensure working hours exist for all 7 days
    if (!dealership.workingHours || dealership.workingHours.length < 7) {
      const existingDays = dealership.workingHours?.map((w) => w.dayOfWeek) || [];
      const missingDays = defaultDays.filter((d) => !existingDays.includes(d));

      if (missingDays.length > 0) {
        await db.workingHours.createMany({
          data: missingDays.map((day) => ({
            dealershipId: dealership.id,
            dayOfWeek: day,
            openTime: "09:00",
            closeTime: "18:00",
            isOpen: day !== "SUNDAY",
          })),
        });

        dealership = await db.dealershipInfo.findFirst({
          include: {
            workingHours: true,
          },
        });
      }
    }

    const sortedHours = (dealership.workingHours || []).sort(
      (a, b) => (dayOrder[a.dayOfWeek] || 0) - (dayOrder[b.dayOfWeek] || 0)
    );

    dealership.workingHours = sortedHours;

    return {
      success: true,
      dealership: JSON.parse(JSON.stringify(dealership)),
    };
  } catch (error) {
    console.error("Error fetching admin settings:", error);
    return {
      success: false,
      error: error.message,
      dealership: null,
    };
  }
}

/**
 * ADMIN: Update Dealership Contact Info & Map Location URL
 */
export async function updateDealershipSettings(data) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) throw new Error("Unauthorized");

    const adminUser = await db.user.findUnique({
      where: { clerkUserId: clerkId },
    });

    if (!adminUser || adminUser.role !== "ADMIN") {
      throw new Error("Only admins can update settings");
    }

    let existing = await db.dealershipInfo.findFirst();

    let updated;
    if (existing) {
      updated = await db.dealershipInfo.update({
        where: { id: existing.id },
        data: {
          name: data.name?.trim() || "Vehicle Motors",
          address: data.address?.trim() || "69 Car Street, Available, SL, 60100",
          phone: data.phone?.trim() || "+94 078 797 9131",
          email: data.email?.trim() || "rawufdeenriza@gmail.com",
          mapUrl: data.mapUrl?.trim() || null,
        },
      });
    } else {
      updated = await db.dealershipInfo.create({
        data: {
          name: data.name?.trim() || "Vehicle Motors",
          address: data.address?.trim() || "69 Car Street, Available, SL, 60100",
          phone: data.phone?.trim() || "+94 078 797 9131",
          email: data.email?.trim() || "rawufdeenriza@gmail.com",
          mapUrl: data.mapUrl?.trim() || null,
        },
      });
    }

    revalidatePath("/admin/settings");
    revalidatePath("/admin");
    revalidatePath("/");
    revalidatePath("/contact");
    revalidatePath("/about");

    return {
      success: true,
      dealership: JSON.parse(JSON.stringify(updated)),
    };
  } catch (error) {
    console.error("Error updating dealership info:", error);
    return { success: false, error: error.message };
  }
}

/**
 * ADMIN: Update Showroom Working Hours Schedule
 */
export async function updateWorkingHours(workingHoursArray) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) throw new Error("Unauthorized");

    const adminUser = await db.user.findUnique({
      where: { clerkUserId: clerkId },
    });

    if (!adminUser || adminUser.role !== "ADMIN") {
      throw new Error("Only admins can update working hours");
    }

    const dealership = await db.dealershipInfo.findFirst();
    if (!dealership) throw new Error("Dealership profile not found");

    for (const item of workingHoursArray) {
      await db.workingHours.upsert({
        where: {
          dealershipId_dayOfWeek: {
            dealershipId: dealership.id,
            dayOfWeek: item.dayOfWeek,
          },
        },
        update: {
          openTime: item.openTime,
          closeTime: item.closeTime,
          isOpen: item.isOpen,
        },
        create: {
          dealershipId: dealership.id,
          dayOfWeek: item.dayOfWeek,
          openTime: item.openTime,
          closeTime: item.closeTime,
          isOpen: item.isOpen,
        },
      });
    }

    revalidatePath("/admin/settings");
    revalidatePath("/admin");
    revalidatePath("/");
    revalidatePath("/contact");
    revalidatePath("/about");

    return { success: true };
  } catch (error) {
    console.error("Error updating working hours:", error);
    return { success: false, error: error.message };
  }
}
