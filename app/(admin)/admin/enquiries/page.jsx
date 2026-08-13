import { getAdminEnquiries } from "@/action/enquiries";
import { Badge } from "@/components/ui/badge";
import { Inbox, MessageSquare } from "lucide-react";
import React from "react";
import EnquiriesList from "./_components/enquiries-list";

export const metadata = {
  title: "Customer Enquiries | Vehicle Admin",
  description: "View customer messages, vehicle inquiries, questions, and contact requests.",
};

export default async function AdminEnquiriesPage() {
  const res = await getAdminEnquiries();

  return (
    <div className="p-6 md:p-8 space-y-8 bg-slate-50/50 min-h-screen">
      {/* HEADER BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-blue-600 text-xs font-bold tracking-wider uppercase mb-1">
            <MessageSquare className="w-4 h-4" /> Inbox & Messages
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            Customer Enquiries & Messages
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Review customer inquiries, vehicle questions, contact requests, and reply directly via email or phone.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1 font-semibold text-xs">
            Live Customer Inbox
          </Badge>
        </div>
      </div>

      {/* ENQUIRIES LIST & TOOLBAR */}
      <EnquiriesList initialStats={res.stats} />
    </div>
  );
}
