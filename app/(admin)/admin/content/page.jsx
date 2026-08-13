import { getHomepageContent } from "@/action/content";
import { Badge } from "@/components/ui/badge";
import { Layout, Sparkles } from "lucide-react";
import React from "react";
import ContentForm from "./_components/content-form";

export const metadata = {
  title: "Homepage Content Management | Vehicle Admin",
  description: "Customize homepage banners, hero titles, announcement bar messages, and promo headers.",
};

export default async function AdminContentPage() {
  const res = await getHomepageContent();

  return (
    <div className="p-6 md:p-8 space-y-8 bg-slate-50/50 min-h-screen">
      {/* HEADER BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-blue-600 text-xs font-bold tracking-wider uppercase mb-1">
            <Layout className="w-4 h-4" /> Site Branding & Banners
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            Homepage Content Management
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Customize main hero headers, announcement notification bars, and promotional call-to-action banners.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1 font-semibold text-xs flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Live Banner Control
          </Badge>
        </div>
      </div>

      {/* CONTENT FORM & LIVE PREVIEW */}
      <ContentForm initialContent={res.content} />
    </div>
  );
}
