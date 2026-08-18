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
  CheckCircle2,
  Clock,
  Cog,
  ExternalLink,
  Globe,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  Save,
  Shield,
  Sliders,
  Sparkles,
} from "lucide-react";
import React, { useState, useTransition } from "react";
import { toast } from "sonner";

export default function SettingsForm({ initialDealership }) {
  const [isPending, startTransition] = useTransition();

  // Profile Form state
  const [profileData, setProfileData] = useState({
    name: initialDealership?.name || "Vehicle Motors",
    address: initialDealership?.address || "69 Car Street, Available, SL, 60100",
    phone: initialDealership?.phone || "+94 078 797 9131",
    email: initialDealership?.email || "rawufdeenriza@gmail.com",
    mapUrl: initialDealership?.mapUrl || "https://maps.google.com/?q=69+Car+Street+Available+SL",
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
        toast.success("Dealership settings & location updated successfully!", {
          description: "All customer pages, footer, and contact maps are now synchronized.",
        });
      } else {
        toast.error(res.error || "Failed to update settings");
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
        toast.success("Showroom working schedule updated successfully!", {
          description: "Customer contact page and booking calendars are updated.",
        });
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
          className="rounded-xl px-4 py-2.5 text-xs font-bold data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all gap-2 cursor-pointer"
        >
          <Building className="w-4 h-4" /> Dealership Profile & Location
        </TabsTrigger>
        <TabsTrigger
          value="hours"
          className="rounded-xl px-4 py-2.5 text-xs font-bold data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all gap-2 cursor-pointer"
        >
          <Clock className="w-4 h-4" /> Working Hours & Schedule
        </TabsTrigger>
        <TabsTrigger
          value="system"
          className="rounded-xl px-4 py-2.5 text-xs font-bold data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all gap-2 cursor-pointer"
        >
          <Sliders className="w-4 h-4" /> System Preferences
        </TabsTrigger>
      </TabsList>

      {/* TAB 1: DEALERSHIP PROFILE & LOCATION */}
      <TabsContent value="profile">
        <Card className="border-slate-200/80 shadow-sm rounded-3xl bg-white p-6 sm:p-8 max-w-2xl">
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div className="border-b pb-4">
              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <Building className="w-5 h-5 text-blue-600" /> Dealership Contact Details & Map Link
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Update public contact details, physical address, and Google Maps URL shown on the customer site, footer, and contact page.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              {/* DEALERSHIP NAME */}
              <div className="space-y-1.5">
                <Label className="font-bold text-slate-800">Dealership Brand Name</Label>
                <Input
                  value={profileData.name}
                  onChange={(e) => setProfileData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Vehicle Motors"
                  className="rounded-xl text-xs h-11 bg-slate-50 border-slate-200"
                  required
                />
              </div>

              {/* STREET ADDRESS */}
              <div className="space-y-1.5">
                <Label className="font-bold text-slate-800">Physical Showroom Address</Label>
                <Input
                  value={profileData.address}
                  onChange={(e) => setProfileData((prev) => ({ ...prev, address: e.target.value }))}
                  placeholder="69 Car Street, Available, SL, 60100"
                  className="rounded-xl text-xs h-11 bg-slate-50 border-slate-200"
                  required
                />
                <p className="text-[11px] text-slate-400">
                  This address is displayed in the footer, contact showroom page, and about page.
                </p>
              </div>

              {/* GOOGLE MAPS LOCATION URL */}
              <div className="space-y-1.5">
                <Label className="font-bold text-slate-800 flex items-center justify-between">
                  <span>Google Maps Location Link / URL</span>
                  {profileData.mapUrl && (
                    <a
                      href={profileData.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-bold text-blue-600 hover:underline inline-flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" /> Test Map Link
                    </a>
                  )}
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-500" />
                  <Input
                    type="url"
                    value={profileData.mapUrl}
                    onChange={(e) => setProfileData((prev) => ({ ...prev, mapUrl: e.target.value }))}
                    placeholder="https://maps.google.com/?q=69+Car+Street..."
                    className="pl-10 rounded-xl text-xs h-11 bg-slate-50 border-slate-200"
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  When provided, users can click the address or map marker in the footer to open this exact Google Maps location.
                </p>
              </div>

              {/* PHONE & EMAIL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="space-y-1.5">
                  <Label className="font-bold text-slate-800">Showroom Phone / Mobile</Label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
                    <Input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, phone: e.target.value }))}
                      placeholder="+94 078 797 9131"
                      className="pl-10 rounded-xl text-xs h-11 bg-slate-50 border-slate-200"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="font-bold text-slate-800">Support / Contact Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-600" />
                    <Input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="rawufdeenriza@gmail.com"
                      className="pl-10 rounded-xl text-xs h-11 bg-slate-50 border-slate-200"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs gap-2 font-bold px-8 py-3 shadow-md shadow-blue-600/30 cursor-pointer"
            >
              {isPending ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Saving Settings...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Save Dealership Settings
                </>
              )}
            </Button>
          </form>
        </Card>
      </TabsContent>

      {/* TAB 2: WORKING HOURS & SCHEDULE */}
      <TabsContent value="hours">
        <Card className="border-slate-200/80 shadow-sm rounded-3xl bg-white p-6 sm:p-8 max-w-3xl">
          <form onSubmit={handleWorkingHoursSubmit} className="space-y-6">
            <div className="border-b pb-4">
              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" /> Showroom Opening & Closing Hours
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Configure opening and closing schedules for test drive booking availability and customer contact pages.
              </p>
            </div>

            <div className="space-y-3">
              {workingHours.map((item, idx) => (
                <div
                  key={item.dayOfWeek || idx}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/70"
                >
                  <div className="flex items-center gap-3 w-40">
                    <button
                      type="button"
                      onClick={() => handleWorkingHourChange(idx, "isOpen", !item.isOpen)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                        item.isOpen ? "bg-emerald-500" : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          item.isOpen ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                    <span className="text-xs font-black text-slate-900 capitalize">
                      {item.dayOfWeek.toLowerCase()}
                    </span>
                  </div>

                  {item.isOpen ? (
                    <div className="flex items-center gap-3 text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-500 font-semibold">Open:</span>
                        <Input
                          type="time"
                          value={item.openTime || "09:00"}
                          onChange={(e) => handleWorkingHourChange(idx, "openTime", e.target.value)}
                          className="w-28 text-xs rounded-xl bg-white h-9 border-slate-200 font-bold"
                        />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-500 font-semibold">Close:</span>
                        <Input
                          type="time"
                          value={item.closeTime || "18:00"}
                          onChange={(e) => handleWorkingHourChange(idx, "closeTime", e.target.value)}
                          className="w-28 text-xs rounded-xl bg-white h-9 border-slate-200 font-bold"
                        />
                      </div>
                    </div>
                  ) : (
                    <Badge variant="outline" className="bg-slate-200 text-slate-600 font-bold text-[11px] px-3 py-1">
                      Closed Today
                    </Badge>
                  )}
                </div>
              ))}
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs gap-2 font-bold px-8 py-3 shadow-md shadow-blue-600/30 cursor-pointer"
            >
              {isPending ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Saving Schedule...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Save Working Hours
                </>
              )}
            </Button>
          </form>
        </Card>
      </TabsContent>

      {/* TAB 3: SYSTEM PREFERENCES */}
      <TabsContent value="system">
        <Card className="border-slate-200/80 shadow-sm rounded-3xl bg-white p-6 sm:p-8 max-w-2xl space-y-6">
          <div className="border-b pb-4">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-blue-600" /> Platform & Showroom Preferences
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              System defaults for currency formatting and reservation windows.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <Label className="font-bold text-slate-800">Default Currency</Label>
              <Input value="USD ($)" disabled className="rounded-xl text-xs bg-slate-100 font-bold h-11" />
            </div>

            <div className="space-y-1.5">
              <Label className="font-bold text-slate-800">Test Drive Slot Interval</Label>
              <Input value="30 Minutes" disabled className="rounded-xl text-xs bg-slate-100 font-bold h-11" />
            </div>

            <div className="space-y-1.5">
              <Label className="font-bold text-slate-800">Database & Storage Engine</Label>
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-200 flex items-center gap-2 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Supabase PostgreSQL & Cloud Storage Synced</span>
              </div>
            </div>
          </div>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
