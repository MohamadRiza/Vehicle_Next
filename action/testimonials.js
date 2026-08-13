"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const initialDefaultTestimonials = [
  {
    name: "Sarah Johnson",
    role: "BMW M5 Owner",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    rating: 5,
    content: "Amazing experience! The car was in perfect condition and the test drive booking process was so smooth and effortless. Highly recommended!",
    isFeatured: true,
  },
  {
    name: "Michael Chen",
    role: "Mercedes AMG GT Owner",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    rating: 5,
    content: "Great customer service and transparent pricing. Found my dream supercar fast with direct showroom verification!",
    isFeatured: true,
  },
  {
    name: "Emily Davis",
    role: "Audi Q7 Owner",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    rating: 5,
    content: "Professional and trustworthy platform. Smooth reservation and top quality vehicle. Will definitely purchase again!",
    isFeatured: true,
  },
];

export async function getAdminTestimonials() {
  try {
    let items = await db.testimonial.findMany({
      orderBy: { createdAt: "desc" },
    });

    if (!items || items.length === 0) {
      await db.testimonial.createMany({
        data: initialDefaultTestimonials,
      });
      items = await db.testimonial.findMany({
        orderBy: { createdAt: "desc" },
      });
    }

    return {
      success: true,
      testimonials: JSON.parse(JSON.stringify(items)),
    };
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return {
      success: false,
      error: error.message,
      testimonials: [],
    };
  }
}

export async function getFeaturedTestimonials() {
  try {
    let items = await db.testimonial.findMany({
      where: { isFeatured: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    });

    if (!items || items.length === 0) {
      await db.testimonial.createMany({
        data: initialDefaultTestimonials,
      });
      items = await db.testimonial.findMany({
        where: { isFeatured: true },
        orderBy: { createdAt: "desc" },
        take: 6,
      });
    }

    return {
      success: true,
      testimonials: JSON.parse(JSON.stringify(items)),
    };
  } catch (error) {
    console.error("Error fetching public testimonials:", error);
    return { success: false, testimonials: [] };
  }
}

export async function createTestimonial(data) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) throw new Error("Unauthorized");

    const adminUser = await db.user.findUnique({
      where: { clerkUserId: clerkId },
    });

    if (!adminUser || adminUser.role !== "ADMIN") {
      throw new Error("Only admins can manage testimonials");
    }

    const { name, role, avatar, rating, content, isFeatured } = data;

    if (!name || !content) {
      return { success: false, error: "Customer name and review content are required." };
    }

    const item = await db.testimonial.create({
      data: {
        name,
        role: role || null,
        avatar: avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80",
        rating: parseInt(rating || 5, 10),
        content,
        isFeatured: isFeatured ?? true,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/testimonials");

    return {
      success: true,
      testimonial: JSON.parse(JSON.stringify(item)),
    };
  } catch (error) {
    console.error("Error creating testimonial:", error);
    return { success: false, error: error.message };
  }
}

export async function updateTestimonialStatus(id, isFeatured) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) throw new Error("Unauthorized");

    const adminUser = await db.user.findUnique({
      where: { clerkUserId: clerkId },
    });

    if (!adminUser || adminUser.role !== "ADMIN") {
      throw new Error("Only admins can update testimonials");
    }

    const updated = await db.testimonial.update({
      where: { id },
      data: { isFeatured },
    });

    revalidatePath("/");
    revalidatePath("/admin/testimonials");

    return { success: true, testimonial: JSON.parse(JSON.stringify(updated)) };
  } catch (error) {
    console.error("Error updating testimonial:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteTestimonial(id) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) throw new Error("Unauthorized");

    const adminUser = await db.user.findUnique({
      where: { clerkUserId: clerkId },
    });

    if (!adminUser || adminUser.role !== "ADMIN") {
      throw new Error("Only admins can delete testimonials");
    }

    await db.testimonial.delete({
      where: { id },
    });

    revalidatePath("/");
    revalidatePath("/admin/testimonials");

    return { success: true };
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    return { success: false, error: error.message };
  }
}
