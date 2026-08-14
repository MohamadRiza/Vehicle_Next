"use client";

import { updateUserProfile } from "@/action/user";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building,
  CheckCircle2,
  Globe,
  Lock,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  Save,
  User,
} from "lucide-react";
import React, { useState, useTransition } from "react";
import { toast } from "sonner";

export default function ProfileForm({ user }) {
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    country: user?.country || "Sri Lanka",
    address: user?.address || "",
    city: user?.city || "",
    postalCode: user?.postalCode || "",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    startTransition(async () => {
      const res = await updateUserProfile(formData);

      if (res.success) {
        toast.success("Personal Information Updated!", {
          description: "Your contact, address, and mobile details have been saved.",
        });
      } else {
        toast.error(res.error || "Failed to update profile. Please try again.");
      }
    });
  };

  const countries = [
    "Sri Lanka",
    "United States",
    "United Kingdom",
    "Australia",
    "Canada",
    "United Arab Emirates",
    "Germany",
    "Japan",
    "Singapore",
    "India",
    "Other",
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-xs">
      {/* SECTION 1: PERSONAL CONTACT INFORMATION */}
      <div className="space-y-4">
        <p className="text-xs font-extrabold uppercase tracking-wider text-blue-600 flex items-center gap-1.5">
          <User className="w-4 h-4" /> Personal & Contact Info
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* FULL NAME */}
          <div className="space-y-1.5">
            <Label className="font-bold text-slate-700">Full Name *</Label>
            <Input
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="John Doe"
              className="text-xs rounded-xl bg-slate-50/50"
              required
            />
          </div>

          {/* AUTO-FILLED EMAIL */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="font-bold text-slate-700">Email Address (Auto-Detected)</Label>
              <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-[10px] font-bold px-2 py-0.2">
                Verified
              </Badge>
            </div>
            <div className="relative">
              <Input
                type="email"
                value={formData.email}
                disabled
                className="text-xs rounded-xl bg-slate-100/80 font-medium text-slate-600 cursor-not-allowed pr-10"
              />
              <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3" />
            </div>
          </div>
        </div>

        {/* MOBILE PHONE NUMBER */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="font-bold text-slate-700 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-emerald-600" /> Mobile Phone Number *
            </Label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="+94 77 123 4567"
              className="text-xs rounded-xl bg-slate-50/50"
              required
            />
          </div>

          {/* COUNTRY */}
          <div className="space-y-1.5">
            <Label className="font-bold text-slate-700 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-indigo-600" /> Country *
            </Label>
            <Select
              value={formData.country}
              onValueChange={(val) => handleChange("country", val)}
            >
              <SelectTrigger className="text-xs rounded-xl bg-slate-50/50">
                <SelectValue placeholder="Select Country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* SECTION 2: RESIDENTIAL LOCATION ADDRESS */}
      <div className="space-y-4 pt-4 border-t border-slate-100">
        <p className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
          <MapPin className="w-4 h-4" /> Residential Location Address
        </p>

        {/* STREET ADDRESS */}
        <div className="space-y-1.5">
          <Label className="font-bold text-slate-700">Street Address</Label>
          <Input
            value={formData.address}
            onChange={(e) => handleChange("address", e.target.value)}
            placeholder="e.g. 69 Car Street, Available"
            className="text-xs rounded-xl bg-slate-50/50"
          />
        </div>

        {/* CITY & POSTAL CODE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="font-bold text-slate-700 flex items-center gap-1">
              <Building className="w-3.5 h-3.5 text-slate-500" /> City / District
            </Label>
            <Input
              value={formData.city}
              onChange={(e) => handleChange("city", e.target.value)}
              placeholder="e.g. Colombo"
              className="text-xs rounded-xl bg-slate-50/50"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="font-bold text-slate-700">Postal Code / ZIP</Label>
            <Input
              value={formData.postalCode}
              onChange={(e) => handleChange("postalCode", e.target.value)}
              placeholder="e.g. 60100"
              className="text-xs rounded-xl bg-slate-50/50"
            />
          </div>
        </div>
      </div>

      {/* SAVE BUTTON */}
      <div className="pt-4 border-t border-slate-100 flex justify-end">
        <Button
          type="submit"
          disabled={isPending}
          className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold px-8 py-3 shadow-lg shadow-blue-600/20 gap-2"
        >
          {isPending ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" /> Saving Changes...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> Save Personal Information
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
