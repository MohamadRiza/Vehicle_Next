"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const defaultInitialSlides = [
  {
    id: "slide-1",
    image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1400&q=80",
    title: "Find your dream car with vehicle AI",
    subtitle: "Advanced AI Car Search and Test Drive from thousands of vehicles",
    ctaText: "Explore Showroom",
    ctaLink: "/cars",
  },
  {
    id: "slide-2",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=80",
    title: "Premium Luxury & Supercars Available",
    subtitle: "Book an instant VIP test drive for top luxury brands",
    ctaText: "Book Test Drive",
    ctaLink: "/cars",
  },
];

export async function getHomepageContent() {
  try {
    let content = await db.homepageContent.findFirst();

    if (!content) {
      content = await db.homepageContent.create({
        data: {
          heroTitle: "Find your dream car with vehicle AI",
          heroSubtitle: "Advanced AI Car Search and Test Drive from thousands of vehicles",
          promoHeading: "Ready to find your dream car?",
          promoSubtext: "Join thousands of satisfied customers who found their perfect vehicle through our platform",
          announcement: "🔥 Special Offer: Free Home Delivery on All Verified Vehicles!",
          isAnnounceActive: true,
          slides: defaultInitialSlides,
        },
      });
    } else if (!content.slides || (Array.isArray(content.slides) && content.slides.length === 0)) {
      content = await db.homepageContent.update({
        where: { id: content.id },
        data: { slides: defaultInitialSlides },
      });
    }

    return {
      success: true,
      content: JSON.parse(JSON.stringify(content)),
    };
  } catch (error) {
    console.error("Error fetching homepage content:", error);
    return {
      success: false,
      error: error.message,
      content: null,
    };
  }
}

export async function updateHomepageContent(data) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) throw new Error("Unauthorized");

    const adminUser = await db.user.findUnique({
      where: { clerkUserId: clerkId },
    });

    if (!adminUser || adminUser.role !== "ADMIN") {
      throw new Error("Only admins can manage homepage content");
    }

    // Limit slides to maximum 5
    const sanitizedSlides = Array.isArray(data.slides) ? data.slides.slice(0, 5) : [];

    let existing = await db.homepageContent.findFirst();

    let updated;
    if (existing) {
      updated = await db.homepageContent.update({
        where: { id: existing.id },
        data: {
          heroTitle: data.heroTitle,
          heroSubtitle: data.heroSubtitle,
          bannerImage: data.bannerImage || null,
          promoHeading: data.promoHeading,
          promoSubtext: data.promoSubtext,
          announcement: data.announcement,
          isAnnounceActive: data.isAnnounceActive,
          slides: sanitizedSlides,
        },
      });
    } else {
      updated = await db.homepageContent.create({
        data: {
          heroTitle: data.heroTitle,
          heroSubtitle: data.heroSubtitle,
          bannerImage: data.bannerImage || null,
          promoHeading: data.promoHeading,
          promoSubtext: data.promoSubtext,
          announcement: data.announcement,
          isAnnounceActive: data.isAnnounceActive,
          slides: sanitizedSlides,
        },
      });
    }

    revalidatePath("/");
    revalidatePath("/admin/content");

    return {
      success: true,
      content: JSON.parse(JSON.stringify(updated)),
    };
  } catch (error) {
    console.error("Error updating homepage content:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}
