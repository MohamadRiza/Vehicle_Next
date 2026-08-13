import { getAdminTestimonials } from "@/action/testimonials";
import { Badge } from "@/components/ui/badge";
import { Quote, Sparkles } from "lucide-react";
import React from "react";
import TestimonialsList from "./_components/testimonials-list";

export const metadata = {
  title: "Customer Testimonials | Vehicle Admin",
  description: "Create, edit, feature, or delete customer testimonial quotes and profile photos.",
};

export default async function AdminTestimonialsPage() {
  const res = await getAdminTestimonials();

  return (
    <div className="p-6 md:p-8 space-y-8 bg-slate-50/50 min-h-screen">
      {/* HEADER BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-blue-600 text-xs font-bold tracking-wider uppercase mb-1">
            <Quote className="w-4 h-4" /> Customer Reviews & Proof
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            Customer Testimonials Directory
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Create custom customer review quotes, upload profile avatars, and select featured testimonials to highlight on the homepage.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1 font-semibold text-xs flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Homepage Showcase
          </Badge>
        </div>
      </div>

      {/* TESTIMONIALS MANAGER */}
      <TestimonialsList initialItems={res.testimonials} />
    </div>
  );
}
