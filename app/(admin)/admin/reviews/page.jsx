import { getAdminReviews } from "@/action/reviews";
import { Badge } from "@/components/ui/badge";
import { Star, ThumbsUp } from "lucide-react";
import React from "react";
import ReviewsList from "./_components/reviews-list";

export const metadata = {
  title: "Customer Reviews Moderation | Vehicle Admin",
  description: "Approve, reject, or remove customer vehicle reviews and rating submissions.",
};

export default async function AdminReviewsPage() {
  const res = await getAdminReviews();

  return (
    <div className="p-6 md:p-8 space-y-8 bg-slate-50/50 min-h-screen">
      {/* HEADER BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-amber-600 text-xs font-bold tracking-wider uppercase mb-1">
            <Star className="w-4 h-4 fill-amber-400" /> Review Moderation
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            Customer Reviews Management
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Moderate customer rating feedback, approve authentic reviews, reject spam, or permanently remove reviews.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 px-3 py-1 font-semibold text-xs">
            Review Approval Queue
          </Badge>
        </div>
      </div>

      {/* REVIEWS LIST & TOOLBAR */}
      <ReviewsList initialStats={res.stats} />
    </div>
  );
}
