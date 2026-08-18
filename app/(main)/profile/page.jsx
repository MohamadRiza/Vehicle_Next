import { getUserProfile } from "@/action/user";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SignInButton } from "@clerk/nextjs";
import {
  ArrowRight,
  Building,
  Calendar,
  CheckCircle2,
  Globe,
  Heart,
  Lock,
  Mail,
  MapPin,
  Phone,
  Shield,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import ProfileForm from "./_components/profile-form";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Personal Information & Profile | Vehiql AI",
  description:
    "Manage your personal contact details, mobile phone number, and residential address for test drive bookings.",
};

export default async function ProfilePage() {
  const res = await getUserProfile();

  if (!res.success) {
    return (
      <div className="min-h-screen bg-slate-50/60 pt-36 pb-24 flex items-center justify-center">
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/90 shadow-xl text-center space-y-6 max-w-md mx-4">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-slate-900">Sign In Required</h1>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
              Please sign in to view and manage your personal contact details and residential address.
            </p>
          </div>
          <SignInButton forceRedirectUrl="/profile">
            <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-full font-extrabold h-12 shadow-lg shadow-blue-600/30 text-xs sm:text-sm">
              Sign In to Your Account
            </Button>
          </SignInButton>
        </div>
      </div>
    );
  }

  const { user } = res;

  return (
    <div className="min-h-screen bg-slate-50/60">
      {/* ── TOP HERO HEADER (BEHIND NAVBAR) ──────────────────── */}
      <div className="relative overflow-hidden bg-[#030a18] text-white pt-28 sm:pt-32 md:pt-36 pb-24 md:pb-32 border-b border-slate-900 shadow-xl">
        {/* BACKGROUND VEHICLE IMAGE ON RIGHT */}
        <div className="absolute right-0 top-0 bottom-0 w-full lg:w-3/5 h-full pointer-events-none z-0">
          <Image
            src="/promo-banner.jpg"
            alt="Customer profile background"
            fill
            priority
            unoptimized
            className="object-cover object-center lg:object-right opacity-70 lg:opacity-90"
          />
          {/* SMOOTH HORIZONTAL GRADIENT BLEND TO SOLID DARK NAVY ON LEFT */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#030a18] via-[#030a18]/85 via-35% via-[#030a18]/70 via-60% to-transparent to-95% z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#030a18]/60 via-transparent to-[#030a18]/80 z-10" />
        </div>

        {/* HERO CONTENT CONTAINER */}
        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-xl space-y-3 text-left">
              <div className="inline-flex items-center gap-1.5 bg-slate-800/90 border border-slate-700/80 text-blue-300 px-3.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider backdrop-blur-sm shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>CUSTOMER ACCOUNT PROFILE</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight drop-shadow-md">
                Personal Information
              </h1>

              <p className="text-slate-300 text-xs sm:text-sm font-medium leading-relaxed max-w-md drop-shadow">
                Manage your verified mobile phone number, contact info, and residential address for test drive bookings.
              </p>
            </div>

            {/* USER PROFILE AVATAR CHIP */}
            <div className="flex items-center gap-3.5 bg-slate-900/80 backdrop-blur-md p-4 rounded-3xl border border-slate-700/80 shadow-xl max-w-sm">
              <div className="h-12 w-12 rounded-2xl relative overflow-hidden border-2 border-blue-500/50 flex-shrink-0 shadow-md">
                {user.imageUrl ? (
                  <Image src={user.imageUrl} alt={user.name} fill className="object-cover" unoptimized />
                ) : (
                  <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white font-black text-lg">
                    {user.name?.charAt(0) || "U"}
                  </div>
                )}
              </div>
              <div className="text-left overflow-hidden">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs sm:text-sm font-black text-white truncate max-w-[160px]">
                    {user.name}
                  </p>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                </div>
                <p className="text-[11px] text-slate-300 truncate max-w-[160px]">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN UNIFIED CONTENT CARD ────────────────────────── */}
      <div className="container mx-auto px-4 max-w-5xl -mt-12 md:-mt-16 relative z-20 pb-24 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ── LEFT 4 COLS: ACCOUNT BADGES & QUICK LINKS ── */}
          <div className="lg:col-span-4 space-y-6">
            {/* ACCOUNT OVERVIEW CARD */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-lg p-6 space-y-6">
              <div className="text-center space-y-3 pb-4 border-b border-slate-100">
                <div className="h-20 w-20 rounded-3xl relative overflow-hidden border-4 border-blue-100 mx-auto shadow-md">
                  {user.imageUrl ? (
                    <Image src={user.imageUrl} alt={user.name} fill className="object-cover" unoptimized />
                  ) : (
                    <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white font-black text-2xl">
                      {user.name?.charAt(0) || "U"}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">{user.name}</h3>
                  <p className="text-xs text-slate-500 font-medium break-all">{user.email}</p>
                </div>
                <div className="pt-1">
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[11px] font-extrabold px-3 py-1 rounded-full inline-flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Verified Customer
                  </span>
                </div>
              </div>

              {/* QUICK NAVIGATION */}
              <div className="space-y-2 pt-1">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Quick Showroom Links
                </p>

                <Link
                  href="/reservations"
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-blue-50 border border-slate-200/70 hover:border-blue-200 text-xs font-bold text-slate-800 hover:text-blue-700 transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span>My Reservations</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </Link>

                <Link
                  href="/reservations"
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-rose-50 border border-slate-200/70 hover:border-rose-200 text-xs font-bold text-slate-800 hover:text-rose-700 transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <Heart className="w-4 h-4 text-rose-500" />
                    <span>Saved Vehicles</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </Link>

                <Link
                  href="/cars"
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-indigo-50 border border-slate-200/70 hover:border-indigo-200 text-xs font-bold text-slate-800 hover:text-indigo-700 transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span>Explore Cars</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              {/* DATA SECURITY BADGE */}
              <div className="p-3.5 rounded-2xl bg-[#0a1936] text-white space-y-1 border border-blue-900/60 shadow-sm">
                <div className="flex items-center gap-1.5 text-blue-300 text-xs font-bold">
                  <Shield className="w-4 h-4 text-blue-400" />
                  <span>256-Bit SSL Encrypted</span>
                </div>
                <p className="text-[10px] text-slate-300 leading-relaxed">
                  Your personal data is encrypted and strictly accessible only for your test drive reservations.
                </p>
              </div>
            </div>
          </div>

          {/* ── RIGHT 8 COLS: PROFILE EDIT FORM ── */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-lg p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" /> Contact & Address Details
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    All updates are automatically synchronized to your customer profile database.
                  </p>
                </div>
              </div>

              {/* FORM COMPONENT */}
              <ProfileForm user={user} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
