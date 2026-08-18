import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Award,
  Building,
  CheckCircle2,
  Cpu,
  Globe,
  HeartHandshake,
  Layers,
  MapPin,
  Phone,
  Rocket,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export const metadata = {
  title: "About Us & Showroom Heritage | Vehiql AI",
  description:
    "Learn more about Vehiql AI, our state-of-the-art vehicle diagnostic intelligence, and our mission to redefine luxury automotive retail.",
};

export default function AboutPage() {
  const stats = [
    { value: "10,000+", label: "Verified Vehicles", icon: Zap },
    { value: "150-Point", label: "AI Diagnostic Inspection", icon: ShieldCheck },
    { value: "99.4%", label: "Customer Satisfaction", icon: Star },
    { value: "24/7", label: "VIP Concierge Hotline", icon: HeartHandshake },
  ];

  const pillars = [
    {
      icon: Cpu,
      title: "AI-Powered Diagnostics",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio praesent libero sed cursus ante dapibus diam sed nisi lacus.",
      color: "bg-blue-100/70 text-blue-600",
    },
    {
      icon: ShieldCheck,
      title: "Certified Transparency",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quis sem at nibh elementum imperdiet duis sagittis ipsum praesent mauris.",
      color: "bg-emerald-100/70 text-emerald-600",
    },
    {
      icon: Sparkles,
      title: "VIP Test Drive Concierge",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sodales ligula in libero sed dignissim lacinia nunc curabitur tortor.",
      color: "bg-purple-100/70 text-purple-600",
    },
    {
      icon: Globe,
      title: "White-Glove Delivery",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce nec tellus sed augue semper porta mauris massa vestibul lacinia arcu.",
      color: "bg-amber-100/70 text-amber-600",
    },
  ];

  const leadership = [
    {
      name: "Marcus Vance",
      role: "Chief Executive Officer & Founder",
      bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum.",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    },
    {
      name: "Elena Rostova",
      role: "Head of AI & Autonomous Intelligence",
      bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ullamcorper ultricies nisi nam eget dui.",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80",
    },
    {
      name: "Darius Sterling",
      role: "VP of VIP Concierge & Showrooms",
      bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam sit amet orci eget eros faucibus tincidunt.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/60">
      {/* ── TOP HERO HEADER (BEHIND NAVBAR) ──────────────────── */}
      <div className="relative overflow-hidden bg-[#030a18] text-white pt-28 sm:pt-32 md:pt-36 pb-24 md:pb-32 border-b border-slate-900 shadow-xl">
        {/* BACKGROUND SHOWROOM ARCHITECTURE IMAGE */}
        <div className="absolute right-0 top-0 bottom-0 w-full lg:w-3/5 h-full pointer-events-none z-0">
          <Image
            src="/about-header.jpg"
            alt="Vehiql AI Luxury Glass Showroom Pavilion"
            fill
            priority
            unoptimized
            className="object-cover object-center lg:object-right opacity-75 lg:opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#030a18] via-[#030a18]/85 via-35% via-[#030a18]/70 via-60% to-transparent to-95% z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#030a18]/60 via-transparent to-[#030a18]/80 z-10" />
        </div>

        {/* HERO CONTENT CONTAINER */}
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="max-w-xl space-y-3.5 text-left">
            <div className="inline-flex items-center gap-1.5 bg-slate-800/90 border border-slate-700/80 text-blue-300 px-3.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider backdrop-blur-sm shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>DISCOVER THE VEHIQL AI HERITAGE</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white drop-shadow-md">
              Pioneering the Next Era of <br />
              <span className="text-sky-400">Automotive Intelligence</span>
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm font-medium leading-relaxed max-w-md drop-shadow">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
            </p>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT CONTAINER ───────────────────────────── */}
      <div className="container mx-auto px-4 max-w-6xl -mt-10 md:-mt-14 relative z-20 space-y-16 pb-24">
        
        {/* ── 4 STATS METRICS STRIP ──────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-lg p-5 sm:p-6 text-center space-y-2 hover:shadow-xl transition-shadow"
              >
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-xs">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                  {s.value}
                </h3>
                <p className="text-[11px] sm:text-xs font-semibold text-slate-500">
                  {s.label}
                </p>
              </div>
            );
          })}
        </div>

        {/* ── 2-COLUMN STORY & SHOWROOM SHOWCASE ─────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* STORY TEXT COLUMN */}
          <div className="lg:col-span-7 space-y-5 text-left">
            <div className="inline-flex items-center gap-1.5 text-blue-600 font-bold text-xs uppercase tracking-wider">
              <Building className="w-4 h-4" />
              <span>Our Vision & Legacy</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-snug">
              Elevating the Modern Supercar & Luxury Automotive Buying Experience
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus imperdiet, nulla et dictum interdum, nisi lorem egestas odio, vitae scelerisque enim ligula venenatis dolor. Maecenas nisl est, ultrices nec congue eget, auctor vitae massa.
            </p>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Integer posuere erat a ante venenatis dapibus posuere velit aliquet.
            </p>

            {/* CHECKPOINTS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>100% Verified Car Histories</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Transparent Valuation Engine</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Instant VIP Test Drive Booking</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>256-Bit Secure Escrow Finance</span>
              </div>
            </div>
          </div>

          {/* SHOWROOM CARD COLUMN */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden p-6 sm:p-7 space-y-6">
              <div className="relative h-56 w-full rounded-2xl overflow-hidden bg-slate-900">
                <Image
                  src="/about-header.jpg"
                  alt="Vehiql AI Showroom"
                  fill
                  unoptimized
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-blue-600 px-2.5 py-0.5 rounded-full">
                    Flagship Studio
                  </span>
                  <h4 className="text-sm font-bold mt-1">69 Car Street Showroom Pavilion</h4>
                </div>
              </div>

              <div className="space-y-3 text-xs text-slate-600">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block">Showroom Address:</strong>
                    <span>69 Car Street, Available, SL, 60100</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block">Concierge Hotline:</strong>
                    <span>+94 078 797 9131 / +1 (555) 123-4567</span>
                  </div>
                </div>
              </div>

              <Button asChild className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold text-xs h-11 shadow-md shadow-blue-600/30 gap-1.5">
                <Link href="/contact">
                  <span>Connect with Showroom Team</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* ── 4 CORE TECHNOLOGICAL PILLARS ───────────────────── */}
        <div className="space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 text-blue-600 font-bold text-xs uppercase tracking-wider">
              <Layers className="w-4 h-4" />
              <span>Core Operational Standards</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Built on Precision, Transparency & Luxury
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {pillars.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-6 space-y-3.5 hover:shadow-xl transition-all group"
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${p.color} transition-transform group-hover:scale-105`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-black text-slate-900">
                    {p.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {p.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── EXECUTIVE LEADERSHIP ─────────────────────────────── */}
        <div className="space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 text-blue-600 font-bold text-xs uppercase tracking-wider">
              <Users className="w-4 h-4" />
              <span>Executive Leadership</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Guided by Automotive & AI Pioneers
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {leadership.map((l, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-6 text-center space-y-4 hover:shadow-xl transition-shadow"
              >
                <div className="relative w-24 h-24 rounded-full mx-auto overflow-hidden ring-4 ring-blue-50">
                  <Image
                    src={l.image}
                    alt={l.name}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-black text-slate-900">{l.name}</h3>
                  <p className="text-xs font-bold text-blue-600">{l.role}</p>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed">
                  {l.bio}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── BOTTOM VIP CTA BANNER ──────────────────────────── */}
        <div className="bg-[#030a18] rounded-3xl p-8 sm:p-12 text-white text-center relative overflow-hidden shadow-2xl space-y-5 border border-slate-900">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 via-indigo-900/20 to-transparent pointer-events-none" />
          <div className="relative z-10 max-w-xl mx-auto space-y-3">
            <span className="text-[11px] font-black uppercase tracking-wider bg-slate-800 text-blue-300 border border-slate-700 px-3.5 py-1 rounded-full">
              EXPERIENCE THE FUTURE
            </span>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black">
              Ready to Explore Our Verified Collection?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Schedule an instant VIP test drive today.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button asChild className="bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold px-8 py-3 shadow-lg shadow-blue-600/30 text-xs gap-1.5">
              <Link href="/cars">
                <span>Browse Available Cars</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-white rounded-full font-bold px-6 py-3 text-xs">
              <Link href="/contact">Contact Our Concierge</Link>
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
