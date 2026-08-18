import { getPublicJobs } from "@/action/careers";
import { getUserProfile } from "@/action/user";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Award,
  Briefcase,
  Building2,
  CheckCircle2,
  Cpu,
  Gift,
  Globe,
  HeartHandshake,
  Rocket,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import CareersClient from "./_components/careers-client";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Careers & Open Positions | Vehiql AI",
  description:
    "Join the Vehiql AI team. Explore high-growth opportunities in automotive computer vision, VIP sales concierge, and showroom operations.",
};

export default async function CareersPage() {
  const [jobsRes, userRes] = await Promise.all([
    getPublicJobs(),
    getUserProfile(),
  ]);

  const jobs = jobsRes.jobs || [];
  const user = userRes.success ? userRes.user : null;

  const perks = [
    {
      icon: Cpu,
      title: "Pioneering AI Technology",
      description:
        "Build world-class computer vision and real-time vehicle inspection models applied to real luxury supercars.",
      color: "text-blue-600 bg-blue-100/70",
    },
    {
      icon: Rocket,
      title: "High-Growth Compensation",
      description:
        "Competitive top-tier base salaries, annual performance bonuses, equity incentives, and commission structures.",
      color: "text-indigo-600 bg-indigo-100/70",
    },
    {
      icon: Globe,
      title: "Flexible & Hybrid Structure",
      description:
        "Work from our state-of-the-art showroom studio or remotely with flexible working schedules and home-office stipends.",
      color: "text-emerald-600 bg-emerald-100/70",
    },
    {
      icon: HeartHandshake,
      title: "Comprehensive Wellness",
      description:
        "Premium health, dental, and vision coverage, continuous learning allowances, and luxury vehicle test drive perks.",
      color: "text-amber-600 bg-amber-100/70",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/60">
      {/* ── TOP HERO HEADER (BEHIND NAVBAR) ──────────────────── */}
      <div className="relative overflow-hidden bg-[#030a18] text-white pt-28 sm:pt-32 md:pt-36 pb-24 md:pb-32 border-b border-slate-900 shadow-xl">
        {/* BACKGROUND VEHICLE STUDIO IMAGE */}
        <div className="absolute right-0 top-0 bottom-0 w-full lg:w-3/5 h-full pointer-events-none z-0">
          <Image
            src="/careers-header.jpg"
            alt="Vehiql AI Engineering & Showroom Studio"
            fill
            priority
            unoptimized
            className="object-cover object-center lg:object-right opacity-75 lg:opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#030a18] via-[#030a18]/85 via-35% via-[#030a18]/70 via-60% to-transparent to-95% z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#030a18]/60 via-transparent to-[#030a18]/80 z-10" />
        </div>

        {/* HERO TITLE CONTAINER */}
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="max-w-xl space-y-3.5 text-left">
            <div className="inline-flex items-center gap-1.5 bg-slate-800/90 border border-slate-700/80 text-blue-300 px-3.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider backdrop-blur-sm shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>CAREERS & TALENT ACQUISITION</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white drop-shadow-md">
              Shape the Future of <br />
              <span className="text-sky-400">Automotive Intelligence</span>
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm font-medium leading-relaxed max-w-md drop-shadow">
              Join a team of elite automotive specialists, AI researchers, and luxury concierge managers redefining the global car marketplace.
            </p>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT CONTAINER ───────────────────────────── */}
      <div className="container mx-auto px-4 max-w-6xl -mt-10 md:-mt-14 relative z-20 space-y-12 pb-24">
        
        {/* ── COMPANY PERKS & CULTURE CARDS ──────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {perks.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-lg p-6 space-y-3 hover:shadow-xl transition-shadow"
              >
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${p.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-black text-slate-900 leading-snug">
                  {p.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {p.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* ── OPEN POSITIONS CLIENT (SEARCH, FILTER & MODAL) ─── */}
        <CareersClient jobs={jobs} user={user} />

      </div>
    </div>
  );
}
