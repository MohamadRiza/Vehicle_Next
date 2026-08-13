import { getAdminReportsData } from "@/action/reports";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp } from "lucide-react";
import React from "react";
import ReportsClient from "./_components/reports-client";

export const metadata = {
  title: "Reports & Analytics | Vehicle Admin",
  description: "Comprehensive sales, listing, and booking statistics and performance reports.",
};

export default async function AdminReportsPage() {
  const res = await getAdminReportsData();

  return (
    <div className="p-6 md:p-8 space-y-8 bg-slate-50/50 min-h-screen">
      {/* HEADER BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-blue-600 text-xs font-bold tracking-wider uppercase mb-1">
            <BarChart3 className="w-4 h-4" /> Performance Metrics
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            Reports & Analytics
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Real-time breakdown of showroom inventory value, body type distribution, brand metrics, and test drive reservation pipeline.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1 font-semibold text-xs flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> Real-time Analytics
          </Badge>
        </div>
      </div>

      {/* REPORTS CLIENT & CHARTS */}
      <ReportsClient data={res.data} />
    </div>
  );
}
