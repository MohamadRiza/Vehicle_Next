import { getAdminSettings } from "@/action/settings";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Building,
  Clock,
  Headphones,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import React from "react";
import ContactForm from "./_components/contact-form";

export const metadata = {
  title: "Contact Us | Vehicle AI Showroom",
  description: "Get in touch with our showroom managers, ask questions about vehicles, test drives, or financing options.",
};

export default async function ContactPage() {
  const settingsRes = await getAdminSettings();
  const dealership = settingsRes.dealership || {
    name: "vehicle motors",
    address: "69 Car Street, Available, SL, 60100",
    phone: "+94 078 797 9131",
    email: "rawufdeenriza@gmail.com",
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-slate-50/60">
      <div className="container mx-auto px-4 max-w-6xl space-y-12">
        {/* HERO BANNER */}
        <div className="bg-gradient-to-r from-blue-950 via-indigo-900 to-slate-950 text-white rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden text-center max-w-4xl mx-auto space-y-4">
          <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30 px-3.5 py-1 text-xs font-bold uppercase tracking-wider mx-auto">
            <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-300 inline" /> Customer Concierge
          </Badge>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Contact Our Showroom Team
          </h1>

          <p className="text-blue-100/80 text-xs md:text-sm max-w-xl mx-auto leading-relaxed">
            Have questions about a car listing, VIP test drive booking, or financing options? Send us a message and our dealership experts will get back to you promptly.
          </p>
        </div>

        {/* CONTENT GRID: CONTACT INFO & CONTACT FORM */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT SIDE: DEALERSHIP INFO */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="border border-slate-200/80 shadow-sm rounded-3xl p-6 md:p-8 bg-white space-y-6">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  <Building className="w-5 h-5 text-blue-600" /> Showroom Information
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Visit our physical location or get in touch directly via phone or email.
                </p>
              </div>

              <div className="space-y-5 text-xs">
                {/* ADDRESS */}
                <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60">
                  <div className="p-2.5 rounded-xl bg-blue-100/70 text-blue-600 flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">Physical Location</h4>
                    <p className="text-slate-600 mt-0.5 leading-relaxed">{dealership.address}</p>
                  </div>
                </div>

                {/* PHONE */}
                <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60">
                  <div className="p-2.5 rounded-xl bg-indigo-100/70 text-indigo-600 flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">Direct Support Hotline</h4>
                    <p className="text-slate-600 mt-0.5 font-medium">{dealership.phone}</p>
                  </div>
                </div>

                {/* EMAIL */}
                <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60">
                  <div className="p-2.5 rounded-xl bg-emerald-100/70 text-emerald-600 flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">Official Email Inbox</h4>
                    <p className="text-slate-600 mt-0.5 font-medium">{dealership.email}</p>
                  </div>
                </div>

                {/* WORKING HOURS */}
                <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60">
                  <div className="p-2.5 rounded-xl bg-amber-100/70 text-amber-600 flex-shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">Showroom Hours</h4>
                    <p className="text-slate-600 mt-0.5 font-medium">Monday - Saturday: 09:00 AM - 06:00 PM</p>
                    <p className="text-slate-400 text-[11px]">Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* TRUST BADGE CARD */}
            <Card className="border border-blue-200 shadow-sm rounded-3xl p-6 bg-gradient-to-br from-blue-50 to-indigo-50/50 space-y-2">
              <div className="flex items-center gap-2 text-blue-700 font-bold text-xs">
                <ShieldCheck className="w-4 h-4" /> Guaranteed Response within 24 Hours
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                All submitted enquiries are directly routed to our showroom admin dashboard for quick response.
              </p>
            </Card>
          </div>

          {/* RIGHT SIDE: INTERACTIVE CONTACT FORM */}
          <div className="lg:col-span-7">
            <Card className="border border-slate-200/80 shadow-sm rounded-3xl p-6 md:p-8 bg-white space-y-6">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-600" /> Send Us a Message
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Fill in your details below and our team will get back to you.
                </p>
              </div>

              <ContactForm />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
