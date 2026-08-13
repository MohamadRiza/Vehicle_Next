"use server";

import { CheckUser } from "@/lib/CheckUser";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createCarReview(data) {
  try {
    const { carId, rating, title, comment, authorName, authorEmail } = data;

    if (!rating || !comment || !authorName) {
      return { success: false, error: "Rating, comment, and your name are required." };
    }

    const user = await CheckUser();

    const review = await db.carReview.create({
      data: {
        carId: carId || null,
        userId: user?.id || null,
        authorName,
        authorEmail: authorEmail || user?.email || null,
        rating: parseInt(rating, 10),
        title: title || null,
        comment,
        status: "PENDING",
      },
    });

    revalidatePath("/admin/reviews");
    revalidatePath("/cars");

    return {
      success: true,
      review: JSON.parse(JSON.stringify(review)),
    };
  } catch (error) {
    console.error("Error creating review:", error);
    return { success: false, error: error.message };
  }
}

export async function getAdminReviews(filters = {}) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) throw new Error("Unauthorized");

    const adminUser = await db.user.findUnique({
      where: { clerkUserId: clerkId },
    });

    if (!adminUser || adminUser.role !== "ADMIN") {
      throw new Error("Only admins can access reviews");
    }

    const { search, statusFilter } = filters;
    const where = {};

    if (statusFilter && statusFilter !== "ALL") {
      where.status = statusFilter;
    }

    if (search && search.trim() !== "") {
      where.OR = [
        { authorName: { contains: search, mode: "insensitive" } },
        { authorEmail: { contains: search, mode: "insensitive" } },
        { title: { contains: search, mode: "insensitive" } },
        { comment: { contains: search, mode: "insensitive" } },
      ];
    }

    const [reviews, total, pending, approved, rejected, avgAggregate] = await Promise.all([
      db.carReview.findMany({
        where,
        include: {
          car: true,
          user: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      db.carReview.count(),
      db.carReview.count({ where: { status: "PENDING" } }),
      db.carReview.count({ where: { status: "APPROVED" } }),
      db.carReview.count({ where: { status: "REJECTED" } }),
      db.carReview.aggregate({
        _avg: { rating: true },
      }),
    ]);

    const avgRating = avgAggregate._avg.rating ? avgAggregate._avg.rating.toFixed(1) : "0.0";

    return {
      success: true,
      reviews: JSON.parse(JSON.stringify(reviews)),
      stats: {
        total,
        pending,
        approved,
        rejected,
        avgRating,
      },
    };
  } catch (error) {
    console.error("Error fetching admin reviews:", error);
    return {
      success: false,
      error: error.message,
      reviews: [],
      stats: { total: 0, pending: 0, approved: 0, rejected: 0, avgRating: "0.0" },
    };
  }
}

export async function updateReviewStatus(reviewId, status) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) throw new Error("Unauthorized");

    const adminUser = await db.user.findUnique({
      where: { clerkUserId: clerkId },
    });

    if (!adminUser || adminUser.role !== "ADMIN") {
      throw new Error("Only admins can update review status");
    }

    const updated = await db.carReview.update({
      where: { id: reviewId },
      data: { status },
    });

    revalidatePath("/admin/reviews");
    revalidatePath("/admin");
    revalidatePath("/cars");

    return { success: true, review: JSON.parse(JSON.stringify(updated)) };
  } catch (error) {
    console.error("Error updating review status:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteReview(reviewId) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) throw new Error("Unauthorized");

    const adminUser = await db.user.findUnique({
      where: { clerkUserId: clerkId },
    });

    if (!adminUser || adminUser.role !== "ADMIN") {
      throw new Error("Only admins can delete reviews");
    }

    await db.carReview.delete({
      where: { id: reviewId },
    });

    revalidatePath("/admin/reviews");
    revalidatePath("/admin");
    revalidatePath("/cars");

    return { success: true };
  } catch (error) {
    console.error("Error deleting review:", error);
    return { success: false, error: error.message };
  }
}
