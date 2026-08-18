"use client";

import { createContactEnquiry } from "@/action/enquiries";
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
import { Textarea } from "@/components/ui/textarea";
import { RefreshCw, Send } from "lucide-react";
import React, { useState, useTransition } from "react";
import { toast } from "sonner";

export default function ContactForm() {
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "General Enquiry",
    message: "",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error("Please fill in your name, email, and message.");
      return;
    }

    startTransition(async () => {
      const res = await createContactEnquiry(formData);

      if (res.success) {
        toast.success("Message Sent Successfully!", {
          description: "Our showroom team received your message and will get back to you shortly.",
        });
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "General Enquiry",
          message: "",
        });
      } else {
        toast.error(res.error || "Failed to send message. Please try again.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-1">
      {/* NAME & EMAIL ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="font-bold text-slate-800 text-xs">Full Name *</Label>
          <Input
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="John Doe"
            className="text-xs rounded-xl bg-slate-50/70 border-slate-200 h-11 focus-visible:ring-blue-500"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label className="font-bold text-slate-800 text-xs">Email Address *</Label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="john@example.com"
            className="text-xs rounded-xl bg-slate-50/70 border-slate-200 h-11 focus-visible:ring-blue-500"
            required
          />
        </div>
      </div>

      {/* PHONE & SUBJECT ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="font-bold text-slate-800 text-xs">Phone Number (Optional)</Label>
          <Input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="+94 77 123 4567"
            className="text-xs rounded-xl bg-slate-50/70 border-slate-200 h-11 focus-visible:ring-blue-500"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="font-bold text-slate-800 text-xs">Topic / Subject</Label>
          <Select
            value={formData.subject}
            onValueChange={(val) => handleChange("subject", val)}
          >
            <SelectTrigger className="text-xs rounded-xl bg-slate-50/70 border-slate-200 h-11">
              <SelectValue placeholder="Select Subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="General Enquiry">General Enquiry</SelectItem>
              <SelectItem value="Test Drive Booking Question">Test Drive Booking Question</SelectItem>
              <SelectItem value="Car Buying & Pricing">Car Buying & Pricing</SelectItem>
              <SelectItem value="Vehicle Trade-In">Vehicle Trade-In</SelectItem>
              <SelectItem value="Financing & Loans">Financing & Loans</SelectItem>
              <SelectItem value="Other Query">Other Query</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* MESSAGE TEXTAREA */}
      <div className="space-y-1.5">
        <Label className="font-bold text-slate-800 text-xs">Your Message *</Label>
        <Textarea
          value={formData.message}
          onChange={(e) => handleChange("message", e.target.value)}
          placeholder="Write your message or question here..."
          className="text-xs rounded-xl bg-slate-50/70 border-slate-200 min-h-[140px] focus-visible:ring-blue-500"
          required
        />
      </div>

      {/* SUBMIT BUTTON */}
      <div className="pt-2">
        <Button
          type="submit"
          disabled={isPending}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs sm:text-sm font-extrabold h-12 shadow-lg shadow-blue-600/25 gap-2 transition-all hover:scale-[1.01]"
        >
          {isPending ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" /> Sending Message...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" /> Send Message
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
