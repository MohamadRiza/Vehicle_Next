import { getAdminCustomers } from "@/action/customers";
import { Badge } from "@/components/ui/badge";
import { Shield, UserCheck, Users } from "lucide-react";
import React from "react";
import CustomersList from "./_components/customers-list";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Customer Management | Vehicle Admin",
  description: "View registered customer accounts, manage permissions, edit contact numbers, or promote admins.",
};

export default async function AdminCustomersPage() {
  const res = await getAdminCustomers();

  return (
    <div className="p-6 md:p-8 space-y-8 bg-slate-50/50 min-h-screen">
      {/* HEADER BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-purple-600 text-xs font-bold tracking-wider uppercase mb-1">
            <Users className="w-4 h-4" /> User Administration
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            Customer Directory & Accounts
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            View registered customer profiles, track test drive activities, manage user roles, and update phone details.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 px-3 py-1 font-semibold text-xs">
            User Role Control
          </Badge>
        </div>
      </div>

      {/* CUSTOMERS LIST & TOOLBAR */}
      <CustomersList initialStats={res.stats} />
    </div>
  );
}
