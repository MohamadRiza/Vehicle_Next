import { getAdminSettings } from "@/action/settings";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Clock,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import React from "react";
import ContactForm from "./_components/contact-form";

export const metadata = {
  title: "Contact Our Showroom Team | Vehiql AI",
  description:
    "Get in touch with our showroom managers, ask questions about vehicles, VIP test drives, or financing options.",
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
    <div className="min-h-screen bg-slate-50/60">
      {/* ── TOP HERO HEADER (BEHIND NAVBAR) ──────────────────── */}
      <div className="relative overflow-hidden bg-[#030a18] text-white pt-28 sm:pt-32 md:pt-36 pb-28 md:pb-36 border-b border-slate-900 shadow-xl">
        {/* BACKGROUND LUXURY VEHICLE ON RIGHT */}
        <div className="absolute right-0 top-0 bottom-0 w-full lg:w-3/5 h-full pointer-events-none z-0">
          <Image
            src="/promo-banner.jpg"
            alt="Customer concierge car"
            fill
            priority
            unoptimized
            className="object-cover object-center lg:object-right opacity-80 lg:opacity-95"
          />
          {/* HORIZONTAL GRADIENT BLEND TO SOLID DARK NAVY ON LEFT */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#030a18] via-[#030a18]/85 via-35% via-[#030a18]/70 via-60% to-transparent to-95% z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#030a18]/60 via-transparent to-[#030a18]/80 z-10" />
        </div>

        {/* HERO TITLE CONTAINER */}
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="max-w-xl space-y-3.5 text-left">
            <div className="inline-flex items-center gap-1.5 bg-slate-800/90 border border-slate-700/80 text-blue-300 px-3.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider backdrop-blur-sm shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>CUSTOMER CONCIERGE</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white drop-shadow-md">
              Contact Our <br />
              <span className="text-sky-400">Showroom Team</span>
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm font-medium leading-relaxed max-w-md drop-shadow">
              Have questions about a car listing, VIP test drive booking, or financing options? Send us a message and our dealership experts will get back to you promptly.
            </p>
          </div>
        </div>
      </div>

      {/* ── UNIFIED MAIN WHITE CARD CONTAINER ────────────────── */}
      <div className="container mx-auto px-4 max-w-6xl -mt-16 md:-mt-24 relative z-20 pb-24">
        <div className="bg-white rounded-3xl md:rounded-[2.5rem] border border-slate-200/90 shadow-2xl p-6 sm:p-10 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            
            {/* ── LEFT COLUMN: SHOWROOM INFORMATION ── */}
            <div className="lg:col-span-5 space-y-6">
              {/* SECTION TITLE */}
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-600/30">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug">
                    Showroom Information
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    Visit our physical location or get in touch directly via phone or email.
                  </p>
                </div>
              </div>

              {/* 4 INFO ITEM CARDS */}
              <div className="space-y-3.5 pt-2">
                {/* 1. LOCATION */}
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 hover:border-blue-300 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-xs">Physical Location</h4>
                    <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed font-medium">
                      {dealership.address}
                    </p>
                  </div>
                </div>

                {/* 2. PHONE */}
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 hover:border-purple-300 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-xs">Direct Support Hotline</h4>
                    <p className="text-slate-600 text-[11px] mt-0.5 font-medium">
                      {dealership.phone}
                    </p>
                  </div>
                </div>

                {/* 3. EMAIL */}
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 hover:border-emerald-300 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-xs">Official Email Inbox</h4>
                    <p className="text-slate-600 text-[11px] mt-0.5 font-medium break-all">
                      {dealership.email}
                    </p>
                  </div>
                </div>

                {/* 4. HOURS */}
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 hover:border-amber-300 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-xs">Showroom Hours</h4>
                    <p className="text-slate-600 text-[11px] mt-0.5 font-medium">
                      Monday – Saturday: 09:00 AM – 06:00 PM
                    </p>
                    <p className="text-slate-400 text-[10px] font-semibold">Sunday: Closed</p>
                  </div>
                </div>
              </div>

              {/* GUARANTEED RESPONSE BLUE BANNER */}
              <div className="bg-[#0a1b3f] text-white p-4.5 rounded-2xl border border-blue-900/60 flex items-center gap-3.5 shadow-md">
                <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-500/30 text-blue-400 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-blue-300">
                    Guaranteed Response within 24 Hours
                  </h4>
                  <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                    All submitted enquiries are directly routed to our showroom admin dashboard for quick response.
                  </p>
                </div>
              </div>
            </div>

            {/* ── RIGHT COLUMN: SEND US A MESSAGE FORM ── */}
            <div className="lg:col-span-7 space-y-6">
              {/* SECTION TITLE */}
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-600/30">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug">
                    Send Us a Message
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    Fill in your details below and our team will get back to you.
                  </p>
                </div>
              </div>

              {/* INTERACTIVE FORM */}
              <ContactForm />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
