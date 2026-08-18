import { getAdminJobs } from "@/action/careers";
import { CheckUser } from "@/lib/CheckUser";
import { redirect } from "next/navigation";
import React from "react";
import AdminCareersClient from "./_components/admin-careers-client";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Careers & Job Openings Management | Admin",
  description: "Create and manage job postings, review applicant profiles, and update hiring statuses.",
};

export default async function AdminCareersPage() {
  const user = await CheckUser();

  if (!user || user.role !== "ADMIN") {
    redirect("/sign-in");
  }

  const res = await getAdminJobs();
  const jobs = res.jobs || [];

  return (
    <div className="p-6 md:p-8 space-y-6">
      <AdminCareersClient initialJobs={jobs} />
    </div>
  );
}
