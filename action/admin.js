"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function getAdmin() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user || user.role !== "ADMIN") {
    return { authorized: false, reason: "not-admin" };
  }

  return { authorized: true, user };
}

export async function getAdminDashboardData() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const adminUser = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!adminUser || adminUser.role !== "ADMIN") {
    return { authorized: false, reason: "not-admin" };
  }

  const [
    totalCars,
    availableCars,
    soldCars,
    unavailableCars,
    totalCustomers,
    totalTestDrives,
    pendingTestDrives,
    confirmedTestDrives,
    completedTestDrives,
    recentCars,
    recentUsers,
    recentBookings,
  ] = await Promise.all([
    db.car.count(),
    db.car.count({ where: { status: "AVAILABLE" } }),
    db.car.count({ where: { status: "SOLD" } }),
    db.car.count({ where: { status: "UNAVAILABLE" } }),
    db.user.count({ where: { role: "USER" } }),
    db.testDriveBooking.count(),
    db.testDriveBooking.count({ where: { status: "PENDING" } }),
    db.testDriveBooking.count({ where: { status: "CONFIRMED" } }),
    db.testDriveBooking.count({ where: { status: "COMPLETED" } }),
    db.car.findMany({ take: 5, orderBy: { createdAt: "desc" } }),
    db.user.findMany({ take: 5, orderBy: { createdAt: "desc" } }),
    db.testDriveBooking.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: { car: true, user: true },
    }),
  ]);

  const activities = [
    ...recentBookings.map((b) => ({
      id: `booking-${b.id}`,
      type: "BOOKING",
      title: "Test Drive Booked",
      description: `${b.user?.name || "Customer"} booked a test drive for ${b.car?.year || ""} ${b.car?.make || ""} ${b.car?.model || "Car"}`.trim(),
      timestamp: b.createdAt,
      status: b.status,
    })),
    ...recentCars.map((c) => ({
      id: `car-${c.id}`,
      type: "CAR",
      title: "New Vehicle Listed",
      description: `${c.year} ${c.make} ${c.model} listed for $${Number(c.price || 0).toLocaleString()}`,
      timestamp: c.createdAt,
      status: c.status,
    })),
    ...recentUsers.map((u) => ({
      id: `user-${u.id}`,
      type: "USER",
      title: "New Customer Registered",
      description: `${u.name || "User"} (${u.email}) joined`,
      timestamp: u.createdAt,
      status: u.role,
    })),
  ]
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 10);

  return {
    authorized: true,
    stats: {
      cars: {
        total: totalCars,
        available: availableCars,
        sold: soldCars,
        unavailable: unavailableCars,
      },
      customers: {
        total: totalCustomers,
      },
      testDrives: {
        total: totalTestDrives,
        pending: pendingTestDrives,
        confirmed: confirmedTestDrives,
        completed: completedTestDrives,
      },
    },
    recentBookings: JSON.parse(JSON.stringify(recentBookings)),
    recentCars: JSON.parse(JSON.stringify(recentCars)),
    recentUsers: JSON.parse(JSON.stringify(recentUsers)),
    activities: JSON.parse(JSON.stringify(activities)),
  };
}

