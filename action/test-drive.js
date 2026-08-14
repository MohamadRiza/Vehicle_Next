"use server";

import { CheckUser } from "@/lib/CheckUser";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createPublicTestDriveBooking({ carId, bookingDate, startTime, notes, phone }) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return { success: false, error: "Please sign in to book a test drive." };
    }

    const user = await CheckUser();
    if (!user) {
      return { success: false, error: "User profile not found. Please log in again." };
    }

    if (!carId || !bookingDate || !startTime) {
      return { success: false, error: "Car, date, and preferred time slot are required." };
    }

    // Update phone if provided
    if (phone && phone.trim() !== "") {
      await db.user.update({
        where: { id: user.id },
        data: { phone: phone.trim() },
      });
    }

    const booking = await db.testDriveBooking.create({
      data: {
        userId: user.id,
        carId,
        bookingDate: new Date(bookingDate),
        startTime,
        endTime: startTime,
        status: "PENDING",
        notes: notes || "Public online booking request",
      },
    });

    revalidatePath("/reservations");
    revalidatePath("/admin/test-drive");
    revalidatePath(`/cars/${carId}`);

    return {
      success: true,
      booking: JSON.parse(JSON.stringify(booking)),
    };
  } catch (error) {
    console.error("Error creating public test drive booking:", error);
    return { success: false, error: error.message };
  }
}

export async function getAdminTestDriveBookings(filters = {}) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const adminUser = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!adminUser || adminUser.role !== "ADMIN") {
      throw new Error("Only admins can view bookings");
    }

    const { search, status } = filters;
    const where = {};

    if (status && status !== "ALL") {
      where.status = status;
    }

    if (search && search.trim() !== "") {
      where.OR = [
        { user: { name: { contains: search, mode: "insensitive" } } },
        { user: { email: { contains: search, mode: "insensitive" } } },
        { car: { make: { contains: search, mode: "insensitive" } } },
        { car: { model: { contains: search, mode: "insensitive" } } },
      ];
    }

    const bookings = await db.testDriveBooking.findMany({
      where,
      include: {
        car: true,
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Format formatted ID like TD001, TD002
    const formattedBookings = bookings.map((b, index) => ({
      ...b,
      bookingCode: `TD${String(bookings.length - index).padStart(3, "0")}`,
    }));

    return {
      success: true,
      bookings: JSON.parse(JSON.stringify(formattedBookings)),
    };
  } catch (error) {
    console.error("Error in getAdminTestDriveBookings:", error);
    return { success: false, error: error.message, bookings: [] };
  }
}

export async function updateTestDriveStatus(bookingId, status) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const adminUser = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!adminUser || adminUser.role !== "ADMIN") {
      throw new Error("Only admins can update booking status");
    }

    const updated = await db.testDriveBooking.update({
      where: { id: bookingId },
      data: { status },
    });

    revalidatePath("/admin/test-drive");
    revalidatePath("/admin");

    return { success: true, booking: JSON.parse(JSON.stringify(updated)) };
  } catch (error) {
    console.error("Error in updateTestDriveStatus:", error);
    return { success: false, error: error.message };
  }
}

export async function rescheduleTestDrive(bookingId, { bookingDate, startTime, endTime }) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const adminUser = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!adminUser || adminUser.role !== "ADMIN") {
      throw new Error("Only admins can reschedule bookings");
    }

    const updated = await db.testDriveBooking.update({
      where: { id: bookingId },
      data: {
        bookingDate: new Date(bookingDate),
        startTime,
        endTime: endTime || startTime,
        status: "CONFIRMED",
      },
    });

    revalidatePath("/admin/test-drive");
    revalidatePath("/admin");

    return { success: true, booking: JSON.parse(JSON.stringify(updated)) };
  } catch (error) {
    console.error("Error in rescheduleTestDrive:", error);
    return { success: false, error: error.message };
  }
}

export async function searchCustomers(query = "") {
  try {
    const users = await db.user.findMany({
      where: query.trim()
        ? {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { email: { contains: query, mode: "insensitive" } },
            ],
          }
        : {},
      take: 10,
      orderBy: { createdAt: "desc" },
    });

    return { success: true, users: JSON.parse(JSON.stringify(users)) };
  } catch (error) {
    console.error("Error searching customers:", error);
    return { success: false, users: [] };
  }
}

export async function getAvailableCarsForBooking() {
  try {
    const cars = await db.car.findMany({
      where: { status: "AVAILABLE" },
      orderBy: { make: "asc" },
    });

    return { success: true, cars: JSON.parse(JSON.stringify(cars)) };
  } catch (error) {
    console.error("Error getting cars for booking:", error);
    return { success: false, cars: [] };
  }
}

export async function createManualTestDriveBooking({
  userId: customerId,
  carId,
  bookingDate,
  startTime,
  endTime,
  phone,
  notes,
}) {
  try {
    const { userId: adminClerkId } = await auth();
    if (!adminClerkId) throw new Error("Unauthorized");

    const adminUser = await db.user.findUnique({
      where: { clerkUserId: adminClerkId },
    });

    if (!adminUser || adminUser.role !== "ADMIN") {
      throw new Error("Only admins can create test drives manually");
    }

    if (!customerId || !carId || !bookingDate || !startTime) {
      throw new Error("Please fill in all required fields (Customer, Car, Date, Time)");
    }

    // Update phone if customer phone is missing or updated
    if (phone) {
      await db.user.update({
        where: { id: customerId },
        data: { phone },
      });
    }

    const booking = await db.testDriveBooking.create({
      data: {
        userId: customerId,
        carId,
        bookingDate: new Date(bookingDate),
        startTime,
        endTime: endTime || startTime,
        status: "CONFIRMED",
        notes: notes || "Manually assigned by admin",
      },
    });

    revalidatePath("/admin/test-drive");
    revalidatePath("/admin");

    return { success: true, booking: JSON.parse(JSON.stringify(booking)) };
  } catch (error) {
    console.error("Error creating manual test drive:", error);
    return { success: false, error: error.message };
  }
}
