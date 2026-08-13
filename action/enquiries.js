"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createContactEnquiry(data) {
  try {
    const { name, email, phone, subject, message, carId } = data;

    if (!name || !email || !message) {
      return { success: false, error: "Name, email, and message are required." };
    }

    const enquiry = await db.contactEnquiry.create({
      data: {
        name,
        email,
        phone: phone || null,
        subject: subject || "Vehicle Enquiry",
        message,
        carId: carId || null,
      },
    });

    revalidatePath("/admin/enquiries");
    revalidatePath("/admin");

    return {
      success: true,
      enquiry: JSON.parse(JSON.stringify(enquiry)),
    };
  } catch (error) {
    console.error("Error creating enquiry:", error);
    return { success: false, error: error.message };
  }
}

export async function getAdminEnquiries(filters = {}) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) throw new Error("Unauthorized");

    const adminUser = await db.user.findUnique({
      where: { clerkUserId: clerkId },
    });

    if (!adminUser || adminUser.role !== "ADMIN") {
      throw new Error("Only admins can access enquiries");
    }

    const { search, statusFilter } = filters;
    const where = {};

    if (statusFilter && statusFilter !== "ALL") {
      where.status = statusFilter;
    }

    if (search && search.trim() !== "") {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
        { subject: { contains: search, mode: "insensitive" } },
        { message: { contains: search, mode: "insensitive" } },
      ];
    }

    const [enquiries, total, unread, read, replied] = await Promise.all([
      db.contactEnquiry.findMany({
        where,
        include: { car: true },
        orderBy: { createdAt: "desc" },
      }),
      db.contactEnquiry.count(),
      db.contactEnquiry.count({ where: { status: "UNREAD" } }),
      db.contactEnquiry.count({ where: { status: "READ" } }),
      db.contactEnquiry.count({ where: { status: "REPLIED" } }),
    ]);

    return {
      success: true,
      enquiries: JSON.parse(JSON.stringify(enquiries)),
      stats: {
        total,
        unread,
        read,
        replied,
      },
    };
  } catch (error) {
    console.error("Error fetching admin enquiries:", error);
    return {
      success: false,
      error: error.message,
      enquiries: [],
      stats: { total: 0, unread: 0, read: 0, replied: 0 },
    };
  }
}

export async function updateEnquiryStatus(enquiryId, status) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) throw new Error("Unauthorized");

    const adminUser = await db.user.findUnique({
      where: { clerkUserId: clerkId },
    });

    if (!adminUser || adminUser.role !== "ADMIN") {
      throw new Error("Only admins can update enquiry status");
    }

    const updated = await db.contactEnquiry.update({
      where: { id: enquiryId },
      data: { status },
    });

    revalidatePath("/admin/enquiries");
    revalidatePath("/admin");

    return { success: true, enquiry: JSON.parse(JSON.stringify(updated)) };
  } catch (error) {
    console.error("Error updating enquiry status:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteEnquiry(enquiryId) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) throw new Error("Unauthorized");

    const adminUser = await db.user.findUnique({
      where: { clerkUserId: clerkId },
    });

    if (!adminUser || adminUser.role !== "ADMIN") {
      throw new Error("Only admins can delete enquiries");
    }

    await db.contactEnquiry.delete({
      where: { id: enquiryId },
    });

    revalidatePath("/admin/enquiries");
    revalidatePath("/admin");

    return { success: true };
  } catch (error) {
    console.error("Error deleting enquiry:", error);
    return { success: false, error: error.message };
  }
}
