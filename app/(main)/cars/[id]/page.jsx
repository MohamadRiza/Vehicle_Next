import { getCarById } from "@/action/cars";
import { getUserSavedCarIds } from "@/action/reservations";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { featuredCars } from "@/lib/data";
import {
  ArrowLeft,
  Award,
  Calendar,
  Car,
  CheckCircle2,
  ChevronRight,
  Clock,
  Cpu,
  Fuel,
  Gauge,
  Heart,
  MapPin,
  MessageSquare,
  Palette,
  Phone,
  Settings,
  Shield,
  ShieldCheck,
  Sparkles,
  Tag,
  User,
  Users,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import BookTestDriveModal from "./_components/book-test-drive-modal";
import CarDetailsClient from "./_components/car-details-client";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const res = await getCarById(id);
  const car = res.car || featuredCars.find((c) => String(c.id) === String(id));

  if (!car) {
    return { title: "Vehicle Not Found | Vehiql AI" };
  }

  return {
    title: `${car.year} ${car.make} ${car.model} | Vehiql AI Showroom`,
    description:
      car.description ||
      `Explore full specifications, detailed gallery, and book an instant test drive for this ${car.year} ${car.make} ${car.model}.`,
  };
}

export default async function CarDetailsPage({ params }) {
  const { id } = await params;
  const [res, savedRes] = await Promise.all([
    getCarById(id),
    getUserSavedCarIds(),
  ]);
  let car = res.car;

  // Fallback to sample data if matching ID or string
  if (!car) {
    car = featuredCars.find((c) => String(c.id) === String(id));
  }

  const savedCarIds = savedRes.savedCarIds || [];
  const isWishlisted = car ? savedCarIds.includes(car.id) : false;

  if (!car) {
    return (
      <div className="pt-36 pb-24 container mx-auto px-4 text-center space-y-6 max-w-md">
        <div className="w-20 h-20 bg-rose-50 text-rose-600 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
          <Car className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-black text-slate-900">Vehicle Not Found</h1>
          <p className="text-slate-500 text-xs md:text-sm leading-relaxed">
            The requested vehicle listing could not be found or may have been removed from our showroom inventory.
          </p>
        </div>
        <Button asChild className="bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold px-6">
          <Link href="/cars">Explore All Vehicles</Link>
        </Button>
      </div>
    );
  }

  const formattedPrice =
    typeof car.price === "number"
      ? car.price.toLocaleString()
      : Number(car.price || 0).toLocaleString();

  const formattedMileage =
    typeof car.mileage === "number"
      ? car.mileage.toLocaleString()
      : Number(car.mileage || 0).toLocaleString();

  const estMonthly = Math.round(Number(car.price || 0) / 48);

  const keyFeatures = [
    "Adaptive Cruise Control",
    "Apple CarPlay & Android Auto",
    "Panoramic Sunroof",
    "Premium Sound System",
    "Lane Keep Assist & Blind Spot",
    "Heated & Ventilated Front Seats",
    "360° Surround View Camera",
    "Wireless Smartphone Charging",
  ];

  return (
    <div className="min-h-screen bg-slate-50/60 pt-24 md:pt-28 pb-24">
      <div className="container mx-auto px-4 max-w-6xl space-y-8">
        
        {/* ── BREADCRUMB & STATUS BAR ────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/cars"
            className="inline-flex items-center text-xs font-bold text-slate-700 hover:text-blue-600 transition-colors gap-2 bg-white px-4 py-2 rounded-full border border-slate-200/80 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-blue-600" /> Back to Showroom
          </Link>

          <div className="flex items-center gap-2.5">
            {car.featured && (
              <span className="bg-amber-500 text-white text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Featured
              </span>
            )}
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Available for Test Drive
            </span>
          </div>
        </div>

        {/* ── VEHICLE HEADER SHOWCASE CARD ───────────────────── */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-widest">
              <span>{car.year}</span>
              <span>•</span>
              <span className="capitalize">{car.bodyType}</span>
              <span>•</span>
              <span>{car.make}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              {car.make} {car.model}
            </h1>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-600 font-medium">
              <span className="bg-slate-100/90 text-slate-700 px-3 py-1 rounded-full font-semibold">
                Color: <strong className="text-slate-900 capitalize">{car.color || "N/A"}</strong>
              </span>
              <span className="bg-slate-100/90 text-slate-700 px-3 py-1 rounded-full font-semibold">
                Gearbox: <strong className="text-slate-900 capitalize">{car.transmission}</strong>
              </span>
              <span className="bg-slate-100/90 text-slate-700 px-3 py-1 rounded-full font-semibold">
                Fuel: <strong className="text-slate-900 capitalize">{car.fuelType}</strong>
              </span>
            </div>
          </div>

          {/* PRICE BLOCK */}
          <div className="bg-blue-50/70 p-5 sm:p-6 rounded-2xl border border-blue-100/80 min-w-[220px] text-left md:text-right flex flex-col justify-center">
            <span className="text-[10px] text-blue-600 font-black uppercase tracking-widest">
              Showroom Price
            </span>
            <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-0.5">
              ${formattedPrice}
            </div>
            <span className="text-[11px] text-slate-500 font-medium mt-1">
              Est. ${estMonthly.toLocaleString()}/mo • 48 mo term
            </span>
          </div>
        </div>

        {/* ── MAIN SHOWCASE & SIDEBAR SPLIT ──────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ── LEFT 7 COLS: GALLERY, SPECS, OVERVIEW, HIGHLIGHTS ── */}
          <div className="lg:col-span-7 space-y-8">
            {/* GALLERY COMPONENT WITH WISHLIST HEART & THUMBNAILS */}
            <CarDetailsClient car={car} initialSaved={isWishlisted} />

            {/* 8-SPECIFICATION METRICS GRID */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4">
                <Sparkles className="w-4 h-4 text-blue-600" /> Key Vehicle Specifications
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                {/* 1. MILEAGE */}
                <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100 space-y-1">
                  <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Gauge className="w-3.5 h-3.5 text-blue-600" /> Mileage
                  </div>
                  <div className="font-extrabold text-slate-900 text-sm">{formattedMileage} mi</div>
                </div>

                {/* 2. TRANSMISSION */}
                <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100 space-y-1">
                  <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Settings className="w-3.5 h-3.5 text-purple-600" /> Gearbox
                  </div>
                  <div className="font-extrabold text-slate-900 text-sm">{car.transmission}</div>
                </div>

                {/* 3. FUEL TYPE */}
                <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100 space-y-1">
                  <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Fuel className="w-3.5 h-3.5 text-emerald-600" /> Fuel
                  </div>
                  <div className="font-extrabold text-slate-900 text-sm">{car.fuelType}</div>
                </div>

                {/* 4. BODY TYPE */}
                <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100 space-y-1">
                  <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Car className="w-3.5 h-3.5 text-indigo-600" /> Body Style
                  </div>
                  <div className="font-extrabold text-slate-900 text-sm capitalize">{car.bodyType}</div>
                </div>

                {/* 5. YEAR */}
                <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100 space-y-1">
                  <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-sky-600" /> Model Year
                  </div>
                  <div className="font-extrabold text-slate-900 text-sm">{car.year}</div>
                </div>

                {/* 6. COLOR */}
                <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100 space-y-1">
                  <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-pink-600" /> Exterior
                  </div>
                  <div className="font-extrabold text-slate-900 text-sm capitalize">{car.color || "N/A"}</div>
                </div>

                {/* 7. SEATS */}
                <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100 space-y-1">
                  <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-amber-600" /> Seating
                  </div>
                  <div className="font-extrabold text-slate-900 text-sm">{car.seats || "5"} Seats</div>
                </div>

                {/* 8. INSPECTION */}
                <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100 space-y-1">
                  <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-600" /> Inspection
                  </div>
                  <div className="font-extrabold text-emerald-700 text-sm">150-pt Passed</div>
                </div>
              </div>
            </div>

            {/* VEHICLE OVERVIEW & DESCRIPTION */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <h2 className="text-lg font-extrabold text-slate-900">Vehicle Overview & Description</h2>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                {car.description ||
                  `Experience the ultimate driving thrill and luxury with this verified ${car.year} ${car.make} ${car.model}. Maintained in showroom condition with ${formattedMileage} miles on the odometer. Finished in premium ${car.color || "exterior"} with advanced powertrain engineering. Schedule your VIP test drive today to inspect and drive this vehicle.`}
              </p>
            </div>

            {/* KEY FEATURES & EQUIPMENT CHIPS */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <h2 className="text-lg font-extrabold text-slate-900">Features & Premium Equipment</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {keyFeatures.map((feat) => (
                  <div
                    key={feat}
                    className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50/70 border border-slate-100 text-xs font-semibold text-slate-700"
                  >
                    <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT 5 COLS: TEST DRIVE MODAL & SHOWROOM INFO SIDEBAR ── */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            
            {/* VIP TEST DRIVE BOOKING CARD */}
            <div className="bg-gradient-to-br from-[#030a18] via-[#051329] to-[#081b3a] text-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 border border-slate-800/80 relative overflow-hidden">
              <div className="space-y-2 relative z-10">
                <div className="inline-flex items-center gap-1.5 bg-blue-500/20 border border-blue-400/30 text-blue-300 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                  <Sparkles className="w-3 h-3" />
                  <span>Instant Showroom Reservation</span>
                </div>
                <h3 className="text-2xl font-black text-white">Book a VIP Test Drive</h3>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Experience this {car.year} {car.make} {car.model} firsthand. Choose your preferred date & time slot with instant status confirmation.
                </p>
              </div>

              {/* BOOK TEST DRIVE MODAL TRIGGER */}
              <div className="relative z-10">
                <BookTestDriveModal car={car} />
              </div>

              <div className="pt-4 border-t border-slate-800/80 space-y-2.5 text-[11px] text-slate-300 relative z-10">
                <p className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>100% Free & No Obligation Test Drive</span>
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>Live booking status tracking on My Reservations</span>
                </p>
                <p className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span>Verified 150-point mechanical inspection</span>
                </p>
              </div>
            </div>

            {/* SHOWROOM LOCATION & CONTACT CARD */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" /> Showroom Contact Details
              </h3>

              <div className="space-y-3 text-xs text-slate-600">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block font-bold">Physical Location</strong>
                    <span>69 Car Street, Available, SL, 60100</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <Phone className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block font-bold">Direct Hotline</strong>
                    <span className="font-bold text-slate-900">+94 078 797 9131</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <MessageSquare className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block font-bold">Concierge Email</strong>
                    <span>rawufdeenriza@gmail.com</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200/60 p-3 rounded-2xl font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Verified Dealership Certified Inventory</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
