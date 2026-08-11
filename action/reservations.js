"use server";

import { CheckUser } from "@/lib/CheckUser";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function getUserReservations() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return { success: false, error: "Unauthorized", bookings: [], savedCars: [] };
    }

    const user = await CheckUser();
    if (!user) {
      return { success: false, error: "User not found", bookings: [], savedCars: [] };
    }

    const [bookings, savedCars] = await Promise.all([
      db.testDriveBooking.findMany({
        where: { userId: user.id },
        include: { car: true },
        orderBy: { createdAt: "desc" },
      }),
      db.userSavedCar.findMany({
        where: { userId: user.id },
        include: { car: true },
        orderBy: { SavedAt: "desc" },
      }),
    ]);

    const formattedBookings = bookings.map((b, idx) => ({
      ...b,
      bookingCode: `TD${String(bookings.length - idx).padStart(3, "0")}`,
    }));

    return {
      success: true,
      user: JSON.parse(JSON.stringify(user)),
      bookings: JSON.parse(JSON.stringify(formattedBookings)),
      savedCars: JSON.parse(JSON.stringify(savedCars)),
    };
  } catch (error) {
    console.error("Error fetching user reservations:", error);
    return { success: false, error: error.message, bookings: [], savedCars: [] };
  }
}

export async function cancelUserTestDrive(bookingId) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: clerkId },
    });

    if (!user) throw new Error("User not found");

    const booking = await db.testDriveBooking.findUnique({
      where: { id: bookingId },
    });

    if (!booking || booking.userId !== user.id) {
      throw new Error("Booking not found or not authorized");
    }

    const updated = await db.testDriveBooking.update({
      where: { id: bookingId },
      data: { status: "CANCELLED" },
    });

    revalidatePath("/reservations");
    revalidatePath("/admin/test-drive");
    revalidatePath("/admin");

    return { success: true, booking: JSON.parse(JSON.stringify(updated)) };
  } catch (error) {
    console.error("Error cancelling test drive:", error);
    return { success: false, error: error.message };
  }
}

export async function removeSavedCar(savedCarId) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) throw new Error("Unauthorized");

    await db.userSavedCar.delete({
      where: { id: savedCarId },
    });

    revalidatePath("/reservations");
    revalidatePath("/saved-cars");

    return { success: true };
  } catch (error) {
    console.error("Error removing saved car:", error);
    return { success: false, error: error.message };
  }
}
