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

export async function getAdminSettings() {
  try {
    let dealership = await db.dealershipInfo.findFirst({
      include: {
        workingHours: {
          orderBy: { dayOfWeek: "asc" },
        },
      },
    });

    if (!dealership) {
      dealership = await db.dealershipInfo.create({
        data: {
          name: "vehicle motors",
          address: "69 Car Street, Available, SL, 60100",
          phone: "+94 078 797 9131",
          email: "rawufdeenriza@gmail.com",
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
            workingHours: {
              orderBy: { dayOfWeek: "asc" },
            },
          },
        });
      }
    }

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
          name: data.name,
          address: data.address,
          phone: data.phone,
          email: data.email,
        },
      });
    } else {
      updated = await db.dealershipInfo.create({
        data: {
          name: data.name,
          address: data.address,
          phone: data.phone,
          email: data.email,
        },
      });
    }

    revalidatePath("/admin/settings");
    revalidatePath("/admin");

    return {
      success: true,
      dealership: JSON.parse(JSON.stringify(updated)),
    };
  } catch (error) {
    console.error("Error updating dealership info:", error);
    return { success: false, error: error.message };
  }
}

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

    return { success: true };
  } catch (error) {
    console.error("Error updating working hours:", error);
    return { success: false, error: error.message };
  }
}
