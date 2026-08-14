"use client";

import { createPublicTestDriveBooking } from "@/action/test-drive";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, Phone, RefreshCw, Shield, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";
import { toast } from "sonner";

export default function BookTestDriveModal({ car }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Get tomorrow's date string formatted as YYYY-MM-DD
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    bookingDate: minDate,
    startTime: "10:00 AM",
    phone: "",
    notes: "",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.bookingDate || !formData.startTime) {
      toast.error("Please select a date and preferred time slot.");
      return;
    }

    startTransition(async () => {
      const res = await createPublicTestDriveBooking({
        carId: car.id,
        bookingDate: formData.bookingDate,
        startTime: formData.startTime,
        phone: formData.phone,
        notes: formData.notes,
      });

      if (res.success) {
        toast.success("Test Drive Requested Successfully!", {
          description: `Your test drive booking for ${car.year} ${car.make} ${car.model} is reserved.`,
        });
        setOpen(false);
        router.push("/reservations");
      } else {
        toast.error(res.error || "Failed to book test drive. Please log in.");
      }
    });
  };

  const timeSlots = [
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "01:00 PM",
    "01:30 PM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
    "04:30 PM",
    "05:00 PM",
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-blue-500 hover:bg-blue-400 text-white h-12 rounded-2xl font-extrabold shadow-lg shadow-blue-500/30 gap-2 text-sm">
          <Calendar className="w-4 h-4" /> Book Test Drive Now
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg rounded-3xl p-6">
        <DialogHeader className="text-left space-y-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-black text-slate-900">
                Book VIP Test Drive
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                {car.year} {car.make} {car.model} (${typeof car.price === "number" ? car.price.toLocaleString() : car.price})
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2 text-xs">
          {/* DATE PICKER */}
          <div className="space-y-1.5">
            <Label className="font-bold text-slate-700 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-blue-600" /> Preferred Test Drive Date *
            </Label>
            <Input
              type="date"
              min={minDate}
              value={formData.bookingDate}
              onChange={(e) => handleChange("bookingDate", e.target.value)}
              className="text-xs rounded-xl bg-slate-50"
              required
            />
          </div>

          {/* TIME SLOT SELECTOR */}
          <div className="space-y-1.5">
            <Label className="font-bold text-slate-700 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-indigo-600" /> Preferred Time Slot *
            </Label>
            <Select
              value={formData.startTime}
              onValueChange={(val) => handleChange("startTime", val)}
            >
              <SelectTrigger className="text-xs rounded-xl bg-slate-50">
                <SelectValue placeholder="Select Time" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* PHONE NUMBER */}
          <div className="space-y-1.5">
            <Label className="font-bold text-slate-700 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-emerald-600" /> Contact Phone Number (Optional)
            </Label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="+94 77 123 4567"
              className="text-xs rounded-xl bg-slate-50"
            />
          </div>

          {/* SPECIAL NOTES */}
          <div className="space-y-1.5">
            <Label className="font-bold text-slate-700">Special Requests / Notes</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="e.g. Please arrange doorstep test drive or bring vehicle history reports..."
              className="text-xs rounded-xl bg-slate-50 min-h-[80px]"
            />
          </div>

          <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200/70 text-[11px] text-blue-700 flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span>Free & No Obligation. Confirmation will be sent to your account dashboard.</span>
          </div>

          <DialogFooter className="pt-2 gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="text-xs rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs rounded-xl font-bold gap-2 shadow-md"
            >
              {isPending ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Confirming...
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4" /> Confirm Test Drive Booking
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
