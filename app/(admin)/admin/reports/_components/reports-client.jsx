"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart3,
  Calendar,
  Car,
  CheckCircle2,
  Clock,
  DollarSign,
  Download,
  Flame,
  Heart,
  Inbox,
  Layers,
  PieChart,
  Shield,
  Sparkles,
  Star,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
import Image from "next/image";
import React from "react";
import { toast } from "sonner";

export default function ReportsClient({ data }) {
  if (!data) {
    return (
      <div className="p-12 text-center text-slate-500 bg-white rounded-3xl border border-slate-200">
        <BarChart3 className="w-12 h-12 m-auto text-blue-600 mb-2" />
        <p className="font-bold">No analytics data available.</p>
      </div>
    );
  }

  const { financials, testDrives, users, breakdowns, reviews, recentBookings } = data;

  const handleExportCSV = () => {
    const csvRows = [
      ["Metric Category", "Metric Name", "Value"],
      ["Inventory Financials", "Total Available Inventory Value ($)", financials.totalInventoryValue],
      ["Inventory Financials", "Average Listing Price ($)", financials.averageCarPrice],
      ["Inventory Financials", "Total Listed Vehicles", financials.totalCarsCount],
      ["Inventory Financials", "Active Available Vehicles", financials.availableCarsCount],
      ["Inventory Financials", "Sold Vehicles", financials.soldCarsCount],
      ["Test Drive Analytics", "Total Bookings Received", testDrives.total],
      ["Test Drive Analytics", "Confirmed Reservations", testDrives.confirmed],
      ["Test Drive Analytics", "Completed Test Drives", testDrives.completed],
      ["Test Drive Analytics", "Pending Approvals", testDrives.pending],
      ["Test Drive Analytics", "Cancelled Appointments", testDrives.cancelled],
      ["Customer Engagement", "Total Registered Accounts", users.totalUsersCount],
      ["Customer Engagement", "Total Saved Vehicles (Wishlist)", users.totalSavedCarsCount],
      ["Customer Engagement", "Total Contact Enquiries", users.totalEnquiriesCount],
      ["Reviews Moderation", "Total Submitted Reviews", reviews.total],
      ["Reviews Moderation", "Average Showroom Rating", reviews.avgRating],
    ];

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Vehicle_Analytics_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Analytics CSV report downloaded!");
  };

  return (
    <div className="space-y-8">
      {/* EXPORT ACTION TOOLBAR */}
      <div className="flex justify-end">
        <Button
          onClick={handleExportCSV}
          className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs gap-2 font-bold shadow-sm"
        >
          <Download className="w-4 h-4" /> Export CSV Report
        </Button>
      </div>

      {/* TOP FINANCIAL & INVENTORY STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border border-slate-200/80 shadow-sm rounded-2xl bg-white p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Showroom Value</span>
            <div className="h-9 w-9 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              ${financials.totalInventoryValue.toLocaleString()}
            </h3>
            <p className="text-[11px] text-slate-500 mt-1">
              Active available vehicles total worth
            </p>
          </div>
        </Card>

        <Card className="border border-slate-200/80 shadow-sm rounded-2xl bg-white p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Average Vehicle Price</span>
            <div className="h-9 w-9 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              ${Number(financials.averageCarPrice).toLocaleString()}
            </h3>
            <p className="text-[11px] text-slate-500 mt-1">
              Across {financials.totalCarsCount} total listings
            </p>
          </div>
        </Card>

        <Card className="border border-slate-200/80 shadow-sm rounded-2xl bg-white p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Test Drive Bookings</span>
            <div className="h-9 w-9 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              {testDrives.total}
            </h3>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">
              {testDrives.confirmed} Confirmed • {testDrives.completed} Completed
            </p>
          </div>
        </Card>

        <Card className="border border-slate-200/80 shadow-sm rounded-2xl bg-white p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Registered Accounts</span>
            <div className="h-9 w-9 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              {users.totalUsersCount}
            </h3>
            <p className="text-[11px] text-slate-500 mt-1">
              {users.totalSavedCarsCount} saved wishlist cars
            </p>
          </div>
        </Card>
      </div>

      {/* ANALYTICS VISUAL BREAKDOWNS SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* BODY TYPE DISTRIBUTION */}
        <Card className="border border-slate-200/80 shadow-sm rounded-3xl bg-white p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" /> Vehicle Body Type Inventory
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Breakdown of listed cars by vehicle category
              </p>
            </div>
            <Badge variant="outline" className="text-xs font-semibold">
              {financials.totalCarsCount} Total Cars
            </Badge>
          </div>

          <div className="space-y-4">
            {breakdowns.bodyTypes.map((item) => (
              <div key={item.type} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="capitalize text-slate-700">{item.type}</span>
                  <span className="text-slate-500">
                    {item.count} cars ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(item.percentage, 5)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* TOP BRAND / MAKE BREAKDOWN */}
        <Card className="border border-slate-200/80 shadow-sm rounded-3xl bg-white p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-500" /> Top Automotive Manufacturers
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Most featured vehicle brands in your showroom
              </p>
            </div>
            <Badge variant="outline" className="text-xs font-semibold">
              Brands Breakdown
            </Badge>
          </div>

          <div className="space-y-4">
            {breakdowns.brands.map((item) => (
              <div key={item.make} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-800 font-bold">{item.make}</span>
                  <span className="text-slate-500">
                    {item.count} models ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(item.percentage, 5)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* TEST DRIVE APPOINTMENTS STATUS DISTRIBUTION */}
      <Card className="border border-slate-200/80 shadow-sm rounded-3xl bg-white p-6 space-y-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-emerald-600" /> Test Drive Booking Funnel & Status
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Reservation conversion pipeline tracking customer appointment lifecycle
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-100 space-y-1">
            <span className="text-amber-700 text-xs font-semibold">Pending Approval</span>
            <p className="text-2xl font-black text-amber-800">{testDrives.pending}</p>
          </div>

          <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-100 space-y-1">
            <span className="text-emerald-700 text-xs font-semibold">Confirmed</span>
            <p className="text-2xl font-black text-emerald-800">{testDrives.confirmed}</p>
          </div>

          <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-100 space-y-1">
            <span className="text-blue-700 text-xs font-semibold">Completed</span>
            <p className="text-2xl font-black text-blue-800">{testDrives.completed}</p>
          </div>

          <div className="bg-rose-50/70 p-4 rounded-2xl border border-rose-100 space-y-1">
            <span className="text-rose-700 text-xs font-semibold">Cancelled</span>
            <p className="text-2xl font-black text-rose-800">{testDrives.cancelled}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
