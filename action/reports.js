"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function getAdminReportsData() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) throw new Error("Unauthorized");

    const adminUser = await db.user.findUnique({
      where: { clerkUserId: clerkId },
    });

    if (!adminUser || adminUser.role !== "ADMIN") {
      throw new Error("Only admins can access analytics reports");
    }

    const [
      allCars,
      totalCarsCount,
      availableCarsCount,
      soldCarsCount,
      allBookings,
      totalUsersCount,
      totalSavedCarsCount,
      totalEnquiriesCount,
      allReviews,
    ] = await Promise.all([
      db.car.findMany({
        orderBy: { createdAt: "desc" },
      }),
      db.car.count(),
      db.car.count({ where: { status: "AVAILABLE" } }),
      db.car.count({ where: { status: "SOLD" } }),
      db.testDriveBooking.findMany({
        include: { car: true, user: true },
        orderBy: { createdAt: "desc" },
      }),
      db.user.count(),
      db.userSavedCar.count(),
      db.contactEnquiry.count(),
      db.carReview.findMany(),
    ]);

    // Financial calculation: Inventory value sum
    const totalInventoryValue = allCars.reduce(
      (acc, c) => acc + (c.status === "AVAILABLE" ? Number(c.price) : 0),
      0
    );

    const averageCarPrice =
      totalCarsCount > 0
        ? (allCars.reduce((acc, c) => acc + Number(c.price), 0) / totalCarsCount).toFixed(2)
        : "0.00";

    // Test drive status distribution
    const testDriveStats = {
      total: allBookings.length,
      pending: allBookings.filter((b) => b.status === "PENDING").length,
      confirmed: allBookings.filter((b) => b.status === "CONFIRMED").length,
      completed: allBookings.filter((b) => b.status === "COMPLETED").length,
      cancelled: allBookings.filter((b) => b.status === "CANCELLED").length,
    };

    // Body Type Breakdown
    const bodyTypeCounts = {};
    allCars.forEach((car) => {
      const type = car.bodyType || "Other";
      bodyTypeCounts[type] = (bodyTypeCounts[type] || 0) + 1;
    });

    const bodyTypeBreakdown = Object.entries(bodyTypeCounts).map(([type, count]) => ({
      type,
      count,
      percentage: totalCarsCount > 0 ? Math.round((count / totalCarsCount) * 100) : 0,
    }));

    // Brand/Make Breakdown
    const makeCounts = {};
    allCars.forEach((car) => {
      const make = car.make || "Unknown";
      makeCounts[make] = (makeCounts[make] || 0) + 1;
    });

    const brandBreakdown = Object.entries(makeCounts)
      .map(([make, count]) => ({
        make,
        count,
        percentage: totalCarsCount > 0 ? Math.round((count / totalCarsCount) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    // Reviews summary
    const totalReviews = allReviews.length;
    const avgRating =
      totalReviews > 0
        ? (allReviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
        : "0.0";

    return {
      success: true,
      data: {
        financials: {
          totalInventoryValue,
          averageCarPrice,
          totalCarsCount,
          availableCarsCount,
          soldCarsCount,
        },
        testDrives: testDriveStats,
        users: {
          totalUsersCount,
          totalSavedCarsCount,
          totalEnquiriesCount,
        },
        breakdowns: {
          bodyTypes: bodyTypeBreakdown,
          brands: brandBreakdown,
        },
        reviews: {
          total: totalReviews,
          avgRating,
        },
        recentBookings: JSON.parse(JSON.stringify(allBookings.slice(0, 5))),
      },
    };
  } catch (error) {
    console.error("Error fetching reports data:", error);
    return {
      success: false,
      error: error.message,
      data: null,
    };
  }
}
