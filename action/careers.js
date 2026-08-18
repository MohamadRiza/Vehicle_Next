"use server";

import { CheckUser } from "@/lib/CheckUser";
import { db } from "@/lib/prisma";
import { createClient } from "@/lib/Supabase";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

// Initial seed jobs
const sampleJobs = [
  {
    id: "job-1",
    title: "Senior AI Computer Vision Engineer",
    department: "Engineering & AI",
    location: "Colombo, Sri Lanka / Hybrid",
    type: "Full-time",
    experience: "Senior Level (4+ yrs)",
    salary: "$90,000 - $130,000 / yr",
    description:
      "Lead the development of our automated computer vision model for real-time bodywork scanning, tire wear detection, and automated vehicle inspection diagnostics.",
    requirements:
      "• 4+ years of Python, PyTorch/TensorFlow, and OpenCV experience.\n• Deep understanding of object detection, edge AI models, and real-time video stream processing.\n• Experience deploying models into cloud production architectures (AWS / GCP / Docker).",
    benefits:
      "• Comprehensive health & dental insurance\n• Annual technology & learning allowance\n• Performance bonus & equity incentives\n• Flexible working hours and hybrid policy",
    status: "OPEN",
    createdAt: new Date(),
  },
  {
    id: "job-2",
    title: "VIP Luxury Showroom Concierge & Sales Manager",
    department: "Sales & Concierge",
    location: "Colombo, Sri Lanka",
    type: "Full-time",
    experience: "Mid-Senior (3+ yrs)",
    salary: "$60,000 + Uncapped Commission",
    description:
      "Provide bespoke consultation and test drive experiences for high-net-worth clients exploring exotic supercars, electric vehicles, and verified luxury SUVs.",
    requirements:
      "• 3+ years of experience in luxury automotive retail, high-end hospitality, or VIP wealth concierge.\n• Exceptional interpersonal communication and negotiation skills.\n• Valid driving license with clean record.",
    benefits:
      "• Competitive base salary plus uncapped commission\n• Vehicle allowance and test drive perks\n• Premium health benefits\n• Annual luxury team retreats",
    status: "OPEN",
    createdAt: new Date(),
  },
  {
    id: "job-3",
    title: "Automotive Master Diagnostics Technician",
    department: "Showroom Operations",
    location: "Colombo, Sri Lanka",
    type: "Full-time",
    experience: "Experienced (5+ yrs)",
    salary: "$50,000 - $75,000 / yr",
    description:
      "Conduct our rigorous 150-point certified vehicle inspections, electrical diagnostics, ECU tuning verifications, and performance dynamometer testing.",
    requirements:
      "• Certified Automotive Master Technician or equivalent degree.\n• In-depth expertise in modern European luxury brands (BMW, Porsche, Mercedes, Audi).\n• Proficiency with OBD-II diagnostic scanners and EV battery testing equipment.",
    benefits:
      "• State-of-the-art climate-controlled workshop\n• Tool allowance & manufacturer certification sponsorships\n• Full medical coverage and retirement savings match",
    status: "OPEN",
    createdAt: new Date(),
  },
  {
    id: "job-4",
    title: "Automotive Digital Content & Media Specialist",
    department: "Marketing & Content",
    location: "Colombo, Sri Lanka / Remote",
    type: "Full-time",
    experience: "Mid-Level (2+ yrs)",
    salary: "$45,000 - $65,000 / yr",
    description:
      "Capture cinema-grade 4K cinematography, automotive photography, and write editorial reviews for The Vehiql Magazine and social media channels.",
    requirements:
      "• Strong portfolio in automotive photography and video production.\n• Proficiency in Adobe Premiere Pro, After Effects, DaVinci Resolve, and Lightroom.\n• Passion for sports cars, supercars, and futuristic EV technology.",
    benefits:
      "• Access to the latest cinema camera gear and drones\n• Press vehicle access for track days and editorial reviews\n• Creative autonomy and flexible work structure",
    status: "OPEN",
    createdAt: new Date(),
  },
];

/**
 * PUBLIC: Fetch all active job postings
 */
export async function getPublicJobs(filters = {}) {
  try {
    const { department = "ALL", type = "ALL" } = filters;

    const where = {
      status: "OPEN",
    };

    if (department !== "ALL") {
      where.department = department;
    }
    if (type !== "ALL") {
      where.type = type;
    }

    let jobs = await db.jobPosting.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { applications: true },
        },
      },
    });

    // If database is empty, seed with sample jobs
    if (jobs.length === 0 && department === "ALL" && type === "ALL") {
      for (const sample of sampleJobs) {
        await db.jobPosting.create({
          data: {
            title: sample.title,
            department: sample.department,
            location: sample.location,
            type: sample.type,
            experience: sample.experience,
            salary: sample.salary,
            description: sample.description,
            requirements: sample.requirements,
            benefits: sample.benefits,
            status: "OPEN",
          },
        });
      }

      jobs = await db.jobPosting.findMany({
        where: { status: "OPEN" },
        orderBy: { createdAt: "desc" },
        include: {
          _count: {
            select: { applications: true },
          },
        },
      });
    }

    return {
      success: true,
      jobs: JSON.parse(JSON.stringify(jobs)),
    };
  } catch (error) {
    console.error("Error fetching public jobs:", error);
    return {
      success: true,
      jobs: sampleJobs,
    };
  }
}

/**
 * PUBLIC: Submit job application (supports PDF, Word docs, Images upload or URL link)
 */
export async function submitJobApplication(data) {
  try {
    const { jobId, name, email, phone, resumeUrl, resumeFile, coverLetter } = data;

    if (!jobId || !name?.trim() || !email?.trim()) {
      return { success: false, error: "Please provide your name, email, and select a job position." };
    }

    // Ensure Job exists in database
    let existingJob = await db.jobPosting.findUnique({ where: { id: jobId } });
    if (!existingJob) {
      const sample = sampleJobs.find((s) => s.id === jobId);
      if (sample) {
        existingJob = await db.jobPosting.create({
          data: {
            title: sample.title,
            department: sample.department,
            location: sample.location,
            type: sample.type,
            experience: sample.experience,
            salary: sample.salary,
            description: sample.description,
            requirements: sample.requirements,
            benefits: sample.benefits,
            status: "OPEN",
          },
        });
      } else {
        const firstJob = await db.jobPosting.findFirst();
        if (firstJob) {
          existingJob = firstJob;
        } else {
          return { success: false, error: "Selected job position is not available." };
        }
      }
    }

    const actualJobId = existingJob.id;
    let finalResumeUrl = resumeUrl ? resumeUrl.trim() : null;
    let resumeName = null;
    let resumeType = null;

    // Handle File Upload (PDF, Word, or Image)
    if (resumeFile && resumeFile.base64) {
      resumeName = resumeFile.name || `resume-${Date.now()}`;
      resumeType = resumeFile.type || "application/pdf";

      try {
        const cookieStore = await cookies();
        const supabase = createClient(cookieStore);

        try {
          await supabase.storage.createBucket("resumes", { public: true });
        } catch {
          // Bucket may already exist
        }

        const base64Data = resumeFile.base64.includes(",")
          ? resumeFile.base64.split(",")[1]
          : resumeFile.base64;
        const fileBuffer = Buffer.from(base64Data, "base64");
        const fileExt = resumeFile.name ? resumeFile.name.split(".").pop() : "pdf";
        const filePath = `resumes/${uuidv4()}-${Date.now()}.${fileExt}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("resumes")
          .upload(filePath, fileBuffer, {
            contentType: resumeType,
            upsert: true,
          });

        if (uploadError) {
          console.warn("Supabase storage upload fallback used:", uploadError.message);
          finalResumeUrl = resumeFile.base64; // Store base64 data URI fallback
        } else {
          finalResumeUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/resumes/${filePath}`;
        }
      } catch (uploadErr) {
        console.warn("File storage exception, using data url fallback:", uploadErr.message);
        finalResumeUrl = resumeFile.base64;
      }
    }

    let userId = null;
    try {
      const { userId: clerkId } = await auth();
      if (clerkId) {
        const user = await db.user.findUnique({ where: { clerkUserId: clerkId } });
        userId = user?.id || null;
      }
    } catch {
      // Guest application
    }

    const application = await db.jobApplication.create({
      data: {
        jobId: actualJobId,
        userId,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone ? phone.trim() : null,
        resumeUrl: finalResumeUrl,
        resumeName,
        resumeType,
        coverLetter: coverLetter ? coverLetter.trim() : null,
        status: "PENDING",
      },
    });

    revalidatePath("/careers");
    revalidatePath("/admin/careers");

    return {
      success: true,
      applicationId: application.id,
      message: "Application submitted successfully! Our recruitment team will review your CV.",
    };
  } catch (error) {
    console.error("Error submitting job application:", error);
    return {
      success: false,
      error: error.message || "Failed to submit application. Please try again.",
    };
  }
}

/**
 * ADMIN: Fetch all job postings with full applications
 */
export async function getAdminJobs() {
  try {
    const user = await CheckUser();
    if (!user || user.role !== "ADMIN") {
      return { success: false, error: "Admin authorization required." };
    }

    let jobs = await db.jobPosting.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        applications: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    // If database has no jobs yet, seed initial postings so admin sees them immediately
    if (jobs.length === 0) {
      for (const sample of sampleJobs) {
        await db.jobPosting.create({
          data: {
            title: sample.title,
            department: sample.department,
            location: sample.location,
            type: sample.type,
            experience: sample.experience,
            salary: sample.salary,
            description: sample.description,
            requirements: sample.requirements,
            benefits: sample.benefits,
            status: "OPEN",
          },
        });
      }

      jobs = await db.jobPosting.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          applications: {
            orderBy: { createdAt: "desc" },
          },
        },
      });
    }

    return {
      success: true,
      jobs: JSON.parse(JSON.stringify(jobs)),
    };
  } catch (error) {
    console.error("Error fetching admin jobs:", error);
    return { success: false, error: error.message };
  }
}

/**
 * ADMIN: Create new job posting
 */
export async function createAdminJob(data) {
  try {
    const user = await CheckUser();
    if (!user || user.role !== "ADMIN") {
      return { success: false, error: "Admin authorization required." };
    }

    const {
      title,
      department,
      location,
      type,
      experience,
      salary,
      description,
      requirements,
      benefits,
      status,
    } = data;

    if (!title?.trim() || !department?.trim() || !description?.trim()) {
      return { success: false, error: "Job title, department, and description are required." };
    }

    const job = await db.jobPosting.create({
      data: {
        title: title.trim(),
        department: department.trim(),
        location: location ? location.trim() : "Colombo, Sri Lanka",
        type: type || "Full-time",
        experience: experience ? experience.trim() : "Mid-Level",
        salary: salary ? salary.trim() : "Competitive",
        description: description.trim(),
        requirements: requirements ? requirements.trim() : null,
        benefits: benefits ? benefits.trim() : null,
        status: status || "OPEN",
      },
      include: {
        applications: true,
      },
    });

    revalidatePath("/careers");
    revalidatePath("/admin/careers");

    return {
      success: true,
      job: JSON.parse(JSON.stringify(job)),
    };
  } catch (error) {
    console.error("Error creating job posting:", error);
    return { success: false, error: error.message };
  }
}

/**
 * ADMIN: Update existing job posting
 */
export async function updateAdminJob(jobId, data) {
  try {
    const user = await CheckUser();
    if (!user || user.role !== "ADMIN") {
      return { success: false, error: "Admin authorization required." };
    }

    const {
      title,
      department,
      location,
      type,
      experience,
      salary,
      description,
      requirements,
      benefits,
      status,
    } = data;

    if (!title?.trim() || !department?.trim() || !description?.trim()) {
      return { success: false, error: "Job title, department, and description are required." };
    }

    const updatedJob = await db.jobPosting.update({
      where: { id: jobId },
      data: {
        title: title.trim(),
        department: department.trim(),
        location: location ? location.trim() : "Colombo, Sri Lanka",
        type: type || "Full-time",
        experience: experience ? experience.trim() : "Mid-Level",
        salary: salary ? salary.trim() : "Competitive",
        description: description.trim(),
        requirements: requirements ? requirements.trim() : null,
        benefits: benefits ? benefits.trim() : null,
        status: status || "OPEN",
      },
      include: {
        applications: true,
      },
    });

    revalidatePath("/careers");
    revalidatePath("/admin/careers");

    return {
      success: true,
      job: JSON.parse(JSON.stringify(updatedJob)),
    };
  } catch (error) {
    console.error("Error updating job posting:", error);
    return { success: false, error: error.message };
  }
}

/**
 * ADMIN: Delete job posting
 */
export async function deleteAdminJob(jobId) {
  try {
    const user = await CheckUser();
    if (!user || user.role !== "ADMIN") {
      return { success: false, error: "Admin authorization required." };
    }

    await db.jobPosting.delete({
      where: { id: jobId },
    });

    revalidatePath("/careers");
    revalidatePath("/admin/careers");

    return { success: true };
  } catch (error) {
    console.error("Error deleting job posting:", error);
    return { success: false, error: error.message };
  }
}

/**
 * ADMIN: Update Application Status
 */
export async function updateApplicationStatus(applicationId, status) {
  try {
    const user = await CheckUser();
    if (!user || user.role !== "ADMIN") {
      return { success: false, error: "Admin authorization required." };
    }

    await db.jobApplication.update({
      where: { id: applicationId },
      data: { status },
    });

    revalidatePath("/admin/careers");
    return { success: true };
  } catch (error) {
    console.error("Error updating application status:", error);
    return { success: false, error: error.message };
  }
}
