"use client";

import { updateDealershipSettings, updateWorkingHours } from "@/action/settings";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building,
  Calendar,
  Clock,
  Cog,
  Globe,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  Save,
  Shield,
  Sliders,
} from "lucide-react";
import React, { useState, useTransition } from "react";
import { toast } from "sonner";

export default function SettingsForm({ initialDealership }) {
  const [isPending, startTransition] = useTransition();

  // Profile Form state
  const [profileData, setProfileData] = useState({
    name: initialDealership?.name || "vehicle motors",
    address: initialDealership?.address || "69 Car Street, Available, SL, 60100",
    phone: initialDealership?.phone || "+94 078 797 9131",
    email: initialDealership?.email || "rawufdeenriza@gmail.com",
  });

  // Working Hours state
  const [workingHours, setWorkingHours] = useState(
    initialDealership?.workingHours || [
      { dayOfWeek: "MONDAY", openTime: "09:00", closeTime: "18:00", isOpen: true },
      { dayOfWeek: "TUESDAY", openTime: "09:00", closeTime: "18:00", isOpen: true },
      { dayOfWeek: "WEDNESDAY", openTime: "09:00", closeTime: "18:00", isOpen: true },
      { dayOfWeek: "THURSDAY", openTime: "09:00", closeTime: "18:00", isOpen: true },
      { dayOfWeek: "FRIDAY", openTime: "09:00", closeTime: "18:00", isOpen: true },
      { dayOfWeek: "SATURDAY", openTime: "09:00", closeTime: "17:00", isOpen: true },
      { dayOfWeek: "SUNDAY", openTime: "10:00", closeTime: "16:00", isOpen: false },
    ]
  );

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await updateDealershipSettings(profileData);
      if (res.success) {
        toast.success("Dealership profile updated successfully!");
      } else {
        toast.error(res.error || "Failed to update profile");
      }
    });
  };

  const handleWorkingHourChange = (idx, field, value) => {
    setWorkingHours((prev) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [field]: value };
      return updated;
    });
  };

  const handleWorkingHoursSubmit = async (e) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await updateWorkingHours(workingHours);
      if (res.success) {
        toast.success("Showroom working hours updated!");
      } else {
        toast.error(res.error || "Failed to update working hours");
      }
    });
  };

  return (
    <Tabs defaultValue="profile" className="w-full space-y-6">
      <TabsList className="bg-white border border-slate-200/80 p-1.5 rounded-2xl h-auto gap-2 shadow-sm">
        <TabsTrigger
          value="profile"
          className="rounded-xl px-4 py-2.5 text-xs font-bold data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all gap-2"
        >
          <Building className="w-4 h-4" /> Dealership Profile
        </TabsTrigger>
        <TabsTrigger
          value="hours"
          className="rounded-xl px-4 py-2.5 text-xs font-bold data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all gap-2"
        >
          <Clock className="w-4 h-4" /> Working Hours & Schedule
        </TabsTrigger>
        <TabsTrigger
          value="system"
          className="rounded-xl px-4 py-2.5 text-xs font-bold data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all gap-2"
        >
          <Sliders className="w-4 h-4" /> System Preferences
        </TabsTrigger>
      </TabsList>

      {/* TAB 1: DEALERSHIP PROFILE */}
      <TabsContent value="profile">
        <Card className="border-slate-200/80 shadow-sm rounded-3xl bg-white p-6 max-w-2xl">
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div className="border-b pb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Building className="w-4 h-4 text-blue-600" /> Dealership Contact Details
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Update public dealership contact information displayed on car details pages.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <Label className="font-bold text-slate-700">Dealership Name</Label>
                <Input
                  value={profileData.name}
                  onChange={(e) => setProfileData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="vehicle motors"
                  className="rounded-xl text-xs"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="font-bold text-slate-700">Street Address</Label>
                <Input
                  value={profileData.address}
                  onChange={(e) => setProfileData((prev) => ({ ...prev, address: e.target.value }))}
                  placeholder="69 Car Street, Available, SL, 60100"
                  className="rounded-xl text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="font-bold text-slate-700">Contact Phone Number</Label>
                  <Input
                    value={profileData.phone}
                    onChange={(e) => setProfileData((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder="+94 078 797 9131"
                    className="rounded-xl text-xs"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="font-bold text-slate-700">Official Contact Email</Label>
                  <Input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="rawufdeenriza@gmail.com"
                    className="rounded-xl text-xs"
                    required
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs gap-2 font-bold px-6 py-2.5"
            >
              {isPending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Profile Settings
            </Button>
          </form>
        </Card>
      </TabsContent>

      {/* TAB 2: WORKING HOURS */}
      <TabsContent value="hours">
        <Card className="border-slate-200/80 shadow-sm rounded-3xl bg-white p-6 max-w-3xl">
          <form onSubmit={handleWorkingHoursSubmit} className="space-y-6">
            <div className="border-b pb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" /> Showroom Opening & Closing Hours
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Configure opening and closing schedules for test drive booking availability.
              </p>
            </div>

            <div className="space-y-4">
              {workingHours.map((item, idx) => (
                <div
                  key={item.dayOfWeek || idx}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/70"
                >
                  <div className="flex items-center gap-3 w-36">
                    <button
                      type="button"
                      onClick={() => handleWorkingHourChange(idx, "isOpen", !item.isOpen)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        item.isOpen ? "bg-emerald-500" : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                          item.isOpen ? "translate-x-5" : "translate-x-1"
                        }`}
                      />
                    </button>
                    <span className="text-xs font-bold text-slate-900 capitalize">
                      {item.dayOfWeek.toLowerCase()}
                    </span>
                  </div>

                  {item.isOpen ? (
                    <div className="flex items-center gap-3 text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-500 font-medium">Open:</span>
                        <Input
                          type="time"
                          value={item.openTime || "09:00"}
                          onChange={(e) => handleWorkingHourChange(idx, "openTime", e.target.value)}
                          className="w-28 text-xs rounded-xl bg-white"
                        />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-500 font-medium">Close:</span>
                        <Input
                          type="time"
                          value={item.closeTime || "18:00"}
                          onChange={(e) => handleWorkingHourChange(idx, "closeTime", e.target.value)}
                          className="w-28 text-xs rounded-xl bg-white"
                        />
                      </div>
                    </div>
                  ) : (
                    <Badge variant="outline" className="bg-slate-200 text-slate-600 font-medium text-[11px]">
                      Closed Today
                    </Badge>
                  )}
                </div>
              ))}
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs gap-2 font-bold px-6 py-2.5"
            >
              {isPending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Working Hours
            </Button>
          </form>
        </Card>
      </TabsContent>

      {/* TAB 3: SYSTEM PREFERENCES */}
      <TabsContent value="system">
        <Card className="border-slate-200/80 shadow-sm rounded-3xl bg-white p-6 max-w-2xl space-y-6">
          <div className="border-b pb-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-600" /> Platform & Showroom Preferences
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              System defaults for currency formatting and reservation windows.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <Label className="font-bold text-slate-700">Default Currency</Label>
              <Input value="USD ($)" disabled className="rounded-xl text-xs bg-slate-100" />
            </div>

            <div className="space-y-1.5">
              <Label className="font-bold text-slate-700">Test Drive Slot Interval</Label>
              <Input value="30 Minutes" disabled className="rounded-xl text-xs bg-slate-100" />
            </div>

            <div className="space-y-1.5">
              <Label className="font-bold text-slate-700">Database Synchronization</Label>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold">
                Supabase PostgreSQL Connected
              </Badge>
            </div>
          </div>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
