"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function getAdminCustomers(filters = {}) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) throw new Error("Unauthorized");

    const adminUser = await db.user.findUnique({
      where: { clerkUserId: clerkId },
    });

    if (!adminUser || adminUser.role !== "ADMIN") {
      throw new Error("Only admins can manage customers");
    }

    const { search, roleFilter } = filters;
    const where = {};

    if (roleFilter && roleFilter !== "ALL") {
      where.role = roleFilter;
    }

    if (search && search.trim() !== "") {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ];
    }

    const [users, totalCount, usersCount, adminCount] = await Promise.all([
      db.user.findMany({
        where,
        include: {
          _count: {
            select: {
              testDriveCars: true,
              savedCars: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      db.user.count(),
      db.user.count({ where: { role: "USER" } }),
      db.user.count({ where: { role: "ADMIN" } }),
    ]);

    return {
      success: true,
      users: JSON.parse(JSON.stringify(users)),
      stats: {
        total: totalCount,
        users: usersCount,
        admins: adminCount,
      },
    };
  } catch (error) {
    console.error("Error fetching customers:", error);
    return {
      success: false,
      error: error.message,
      users: [],
      stats: { total: 0, users: 0, admins: 0 },
    };
  }
}

export async function updateUserRole(targetUserId, newRole) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) throw new Error("Unauthorized");

    const adminUser = await db.user.findUnique({
      where: { clerkUserId: clerkId },
    });

    if (!adminUser || adminUser.role !== "ADMIN") {
      throw new Error("Only admins can change user roles");
    }

    const updated = await db.user.update({
      where: { id: targetUserId },
      data: { role: newRole },
    });

    revalidatePath("/admin/customers");
    revalidatePath("/admin");

    return { success: true, user: JSON.parse(JSON.stringify(updated)) };
  } catch (error) {
    console.error("Error updating user role:", error);
    return { success: false, error: error.message };
  }
}

export async function updateUserPhone(targetUserId, phone) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) throw new Error("Unauthorized");

    const adminUser = await db.user.findUnique({
      where: { clerkUserId: clerkId },
    });

    if (!adminUser || adminUser.role !== "ADMIN") {
      throw new Error("Only admins can update customer contact details");
    }

    const updated = await db.user.update({
      where: { id: targetUserId },
      data: { phone },
    });

    revalidatePath("/admin/customers");
    revalidatePath("/admin");

    return { success: true, user: JSON.parse(JSON.stringify(updated)) };
  } catch (error) {
    console.error("Error updating user phone:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteUserAccount(targetUserId) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) throw new Error("Unauthorized");

    const adminUser = await db.user.findUnique({
      where: { clerkUserId: clerkId },
    });

    if (!adminUser || adminUser.role !== "ADMIN") {
      throw new Error("Only admins can delete customer accounts");
    }

    // Protect against self-deletion
    if (adminUser.id === targetUserId) {
      throw new Error("You cannot delete your own admin account");
    }

    await db.user.delete({
      where: { id: targetUserId },
    });

    revalidatePath("/admin/customers");
    revalidatePath("/admin");

    return { success: true };
  } catch (error) {
    console.error("Error deleting user account:", error);
    return { success: false, error: error.message };
  }
}
