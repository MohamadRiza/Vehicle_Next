import { getCarById } from "@/action/cars";
import { getUserSavedCarIds } from "@/action/reservations";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { featuredCars } from "@/lib/data";
import {
  ArrowLeft,
  Calendar,
  Car,
  CheckCircle2,
  ChevronRight,
  Clock,
  Fuel,
  Gauge,
  Heart,
  MapPin,
  MessageSquare,
  Phone,
  Shield,
  ShieldCheck,
  Sparkles,
  Tag,
  User,
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
    title: `${car.year} ${car.make} ${car.model} | Vehiql AI`,
    description: car.description || `View full specifications, gallery, and book an instant test drive for this ${car.year} ${car.make} ${car.model}.`,
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
      <div className="pt-32 pb-20 container mx-auto px-4 text-center space-y-4">
        <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
          <Car className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">Vehicle Not Found</h1>
        <p className="text-slate-500 text-sm max-w-md mx-auto">
          The requested vehicle listing could not be found or may have been removed from our showroom database.
        </p>
        <Button asChild className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl">
          <Link href="/cars">Explore All Cars</Link>
        </Button>
      </div>
    );
  }

  const formattedPrice = typeof car.price === "number"
    ? car.price.toLocaleString()
    : Number(car.price || 0).toLocaleString();

  const formattedMileage = typeof car.mileage === "number"
    ? car.mileage.toLocaleString()
    : Number(car.mileage || 0).toLocaleString();

  return (
    <div className="pt-24 pb-20 min-h-screen bg-slate-50/60">
      <div className="container mx-auto px-4 space-y-8 max-w-6xl">
        {/* BREADCRUMB & STATUS BAR */}
        <div className="flex items-center justify-between">
          <Link
            href="/cars"
            className="inline-flex items-center text-xs font-bold text-slate-700 hover:text-blue-600 transition-colors gap-2 bg-white px-4 py-2.5 rounded-2xl border border-slate-200/80 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Showroom
          </Link>

          <div className="flex items-center gap-2">
            {car.status === "AVAILABLE" && (
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 px-3.5 py-1.5 font-bold text-xs">
                Available for Test Drive
              </Badge>
            )}
            {car.status === "SOLD" && (
              <Badge className="bg-slate-100 text-slate-700 border-slate-200 px-3.5 py-1.5 font-bold text-xs">
                Sold Out
              </Badge>
            )}
          </div>
        </div>

        {/* HERO TITLE & PRICE CARD */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">
              <span>{car.year}</span>
              <span>•</span>
              <span className="capitalize">{car.bodyType}</span>
              {car.feautured && (
                <>
                  <span>•</span>
                  <span className="text-amber-600 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" /> Featured Supercar
                  </span>
                </>
              )}
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
              {car.make} {car.model}
            </h1>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-3 font-medium">
              <span>Color: <strong className="text-slate-800 capitalize">{car.color || "N/A"}</strong></span>
              <span>•</span>
              <span>Transmission: <strong className="text-slate-800 capitalize">{car.transmission}</strong></span>
              <span>•</span>
              <span>Fuel: <strong className="text-slate-800 capitalize">{car.fuelType}</strong></span>
            </p>
          </div>

          <div className="text-left md:text-right bg-blue-50/60 p-4 md:p-6 rounded-2xl border border-blue-100 min-w-[200px]">
            <div className="text-[11px] text-blue-600 font-extrabold uppercase tracking-wider">
              Showroom Price
            </div>
            <div className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mt-0.5">
              ${formattedPrice}
            </div>
          </div>
        </div>

        {/* MAIN SHOWCASE & BOOKING SPLIT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT 7 COLS: GALLERY & SPECIFICATIONS */}
          <div className="lg:col-span-7 space-y-8">
            {/* GALLERY CLIENT COMPONENT */}
            <CarDetailsClient car={car} initialSaved={isWishlisted} />

            {/* KEY SPECIFICATIONS GRID */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2 border-b pb-4">
                <Sparkles className="w-5 h-5 text-blue-600" /> Vehicle Specifications
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
                  <div className="text-slate-400 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <Gauge className="w-3.5 h-3.5 text-blue-500" /> Mileage
                  </div>
                  <div className="font-extrabold text-slate-900 text-sm">{formattedMileage} mi</div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
                  <div className="text-slate-400 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <Fuel className="w-3.5 h-3.5 text-indigo-500" /> Fuel Type
                  </div>
                  <div className="font-extrabold text-slate-900 text-sm">{car.fuelType}</div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
                  <div className="text-slate-400 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <Car className="w-3.5 h-3.5 text-purple-500" /> Transmission
                  </div>
                  <div className="font-extrabold text-slate-900 text-sm">{car.transmission}</div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
                  <div className="text-slate-400 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-amber-500" /> Seats
                  </div>
                  <div className="font-extrabold text-slate-900 text-sm">{car.seats || "5"} Seats</div>
                </div>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <h2 className="text-lg font-extrabold text-slate-900">Vehicle Overview & Features</h2>
              <p className="text-slate-600 text-xs md:text-sm leading-relaxed whitespace-pre-line">
                {car.description ||
                  `Experience luxury and performance with this ${car.year} ${car.make} ${car.model}. Impeccably maintained with ${formattedMileage} miles, finished in stunning ${car.color || "exterior"}. Schedule a test drive today to experience it firsthand.`}
              </p>
            </div>
          </div>

          {/* RIGHT 5 COLS: BOOK TEST DRIVE MODAL & DEALERSHIP INFO */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            {/* BOOK TEST DRIVE ACTION CARD */}
            <Card className="border-blue-100 bg-gradient-to-br from-blue-950 via-indigo-900 to-slate-950 text-white rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
              <div className="space-y-2">
                <Badge className="bg-blue-500/30 text-blue-200 border-blue-400/40 text-xs px-3 py-1 font-bold">
                  Instant Showroom Booking
                </Badge>
                <h3 className="text-2xl font-black">Book a Test Drive</h3>
                <p className="text-blue-100/80 text-xs leading-relaxed">
                  Experience this {car.year} {car.make} {car.model} in person. Pick a date, time slot, and get instant status confirmation.
                </p>
              </div>

              {/* BOOK TEST DRIVE MODAL DIALOG BUTTON */}
              <BookTestDriveModal car={car} />

              <div className="pt-2 border-t border-white/10 space-y-2 text-[11px] text-blue-200/80">
                <p className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Free & No Obligation Test Drive</span>
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>Instant status updates on My Reservations</span>
                </p>
              </div>
            </Card>

            {/* DEALERSHIP LOCATION CARD */}
            <Card className="border-slate-200/80 bg-white rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" /> Showroom Contact Details
              </h3>

              <div className="space-y-3 text-xs text-slate-600">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                  <span>69 Car Street, Available, SL, 60100</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span className="font-bold text-slate-900">+94 078 797 9131</span>
                </div>
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span>rawufdeenriza@gmail.com</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 p-3 rounded-2xl font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Verified Dealership Listing</span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
