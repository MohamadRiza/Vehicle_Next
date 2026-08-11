import React from "react";
import TestDriveList from "./_components/test-drive-list";
import { Calendar, CheckCircle2, Clock, Plus, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Test Drive Bookings | Vehicle Admin",
  description: "Manage customer test drive appointments, approve, reject, reschedule or assign manually.",
};

const AdminTestDrivePage = () => {
  return (
    <div className="p-6 md:p-8 space-y-8 bg-slate-50/50 min-h-screen">
      {/* HEADER BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-amber-600 text-xs font-bold tracking-wider uppercase mb-1">
            <Calendar className="w-4 h-4" /> Appointment Management
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            Test Drive Bookings
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Manage customer reservations, approve or reject requests, reschedule slots, or assign test drives manually.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 px-3 py-1 font-semibold text-xs">
            Live Reservation Queue
          </Badge>
        </div>
      </div>

      {/* BOOKINGS TABLE & TOOLBAR */}
      <TestDriveList />
    </div>
  );
};

export default AdminTestDrivePage;
