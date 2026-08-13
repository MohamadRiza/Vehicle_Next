import { getAdminSettings } from "@/action/settings";
import { Badge } from "@/components/ui/badge";
import { Cog, ShieldCheck } from "lucide-react";
import React from "react";
import SettingsForm from "./_components/settings-form";

export const metadata = {
  title: "Admin Settings | Vehicle Admin",
  description: "Manage dealership details, showroom location, working hours, and platform configurations.",
};

export default async function AdminSettingsPage() {
  const res = await getAdminSettings();

  return (
    <div className="p-6 md:p-8 space-y-8 bg-slate-50/50 min-h-screen">
      {/* HEADER BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-blue-600 text-xs font-bold tracking-wider uppercase mb-1">
            <Cog className="w-4 h-4" /> System Settings
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            Admin Settings & Dealership Profile
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Manage showroom contact details, physical address, opening/closing schedules, and test drive platform preferences.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1 font-semibold text-xs flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Dealership Settings
          </Badge>
        </div>
      </div>

      {/* SETTINGS FORM & TABS */}
      <SettingsForm initialDealership={res.dealership} />
    </div>
  );
}
