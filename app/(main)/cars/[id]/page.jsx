import { getCarById } from "@/action/cars";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  Sparkles,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const res = await getCarById(id);
  const car = res.car || featuredCars.find((c) => String(c.id) === String(id));

  if (!car) {
    return { title: "Vehicle Not Found | Vehicle AI" };
  }

  return {
    title: `${car.year} ${car.make} ${car.model} | Vehicle AI`,
    description: car.description || `View details and book a test drive for this ${car.year} ${car.make} ${car.model}.`,
  };
}

export default async function CarDetailsPage({ params }) {
  const { id } = await params;
  const res = await getCarById(id);
  let car = res.car;

  // Fallback to sample data if matching ID or string
  if (!car) {
    car = featuredCars.find((c) => String(c.id) === String(id));
  }

  if (!car) {
    return (
      <div className="pt-32 pb-20 container mx-auto px-4 text-center space-y-4">
        <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
          <Car className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Vehicle Not Found</h1>
        <p className="text-slate-500 text-sm max-w-md mx-auto">
          The requested vehicle listing could not be found or may have been removed.
        </p>
        <Button asChild className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl">
          <Link href="/cars">Back to Showroom</Link>
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

  const images = car.image && car.image.length > 0 ? car.image : [];

  return (
    <div className="pt-24 pb-16 min-h-screen bg-slate-50/60">
      <div className="container mx-auto px-4 space-y-8 max-w-6xl">
        {/* BREADCRUMB / BACK LINK */}
        <div className="flex items-center justify-between">
          <Link
            href="/cars"
            className="inline-flex items-center text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors gap-1.5 bg-white px-3.5 py-2 rounded-xl border border-slate-200/80 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Showroom
          </Link>

          <div className="flex items-center gap-2">
            {car.status === "AVAILABLE" && (
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 px-3 py-1 font-semibold text-xs">
                Available for Purchase
              </Badge>
            )}
            {car.status === "SOLD" && (
              <Badge className="bg-slate-100 text-slate-700 border-slate-200 px-3 py-1 font-semibold text-xs">
                Sold Out
              </Badge>
            )}
          </div>
        </div>

        {/* HERO TITLE & PRICE */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
              <span>{car.year}</span>
              <span>•</span>
              <span className="capitalize">{car.bodyType}</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900">
              {car.make} {car.model}
            </h1>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
              <span>Color: <strong className="text-slate-700 capitalize">{car.color || "N/A"}</strong></span>
              <span>•</span>
              <span>Transmission: <strong className="text-slate-700 capitalize">{car.transmission}</strong></span>
            </p>
          </div>

          <div className="text-left md:text-right">
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Listed Price
            </div>
            <div className="text-3xl md:text-4xl font-black text-blue-600 tracking-tight">
              ${formattedPrice}
            </div>
          </div>
        </div>

        {/* MAIN SHOWCASE & SPECS SPLIT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT 2 COLS: GALLERY & DESCRIPTION */}
          <div className="lg:col-span-2 space-y-8">
            {/* GALLERY CARD */}
            <Card className="overflow-hidden border-slate-200/80 shadow-sm rounded-3xl bg-white p-0">
              <div className="relative h-72 md:h-96 w-full bg-slate-100">
                {images.length > 0 ? (
                  <Image
                    src={images[0]}
                    alt={`${car.make} ${car.model}`}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                    <Car className="w-16 h-16 stroke-[1.5]" />
                    <span className="text-sm font-medium">No Images Available</span>
                  </div>
                )}
              </div>
            </Card>

            {/* KEY SPECS GRID */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                Vehicle Specifications
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
                  <div className="text-slate-400 text-xs flex items-center gap-1">
                    <Gauge className="w-3.5 h-3.5 text-blue-500" /> Mileage
                  </div>
                  <div className="font-bold text-slate-900 text-sm">{formattedMileage} mi</div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
                  <div className="text-slate-400 text-xs flex items-center gap-1">
                    <Fuel className="w-3.5 h-3.5 text-indigo-500" /> Fuel Type
                  </div>
                  <div className="font-bold text-slate-900 text-sm">{car.fuelType}</div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
                  <div className="text-slate-400 text-xs flex items-center gap-1">
                    <Car className="w-3.5 h-3.5 text-purple-500" /> Transmission
                  </div>
                  <div className="font-bold text-slate-900 text-sm">{car.transmission}</div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
                  <div className="text-slate-400 text-xs flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-amber-500" /> Seats
                  </div>
                  <div className="font-bold text-slate-900 text-sm">{car.seats || "5"} Seats</div>
                </div>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
              <h2 className="text-lg font-bold text-slate-900">Vehicle Description</h2>
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                {car.description ||
                  `Experience luxury and performance with this ${car.year} ${car.make} ${car.model}. Impeccably maintained with ${formattedMileage} miles, finished in stunning ${car.color || "exterior"}. Schedule a test drive today to experience it firsthand.`}
              </p>
            </div>
          </div>

          {/* RIGHT 1 COL: BOOK TEST DRIVE & DEALERSHIP CARD */}
          <div className="space-y-6">
            {/* BOOK TEST DRIVE ACTION CARD */}
            <Card className="border-blue-100 bg-gradient-to-br from-blue-900 to-indigo-900 text-white rounded-3xl p-6 shadow-xl space-y-6">
              <div className="space-y-2">
                <Badge className="bg-blue-500/30 text-blue-200 border-blue-400/40 text-xs">
                  Instant Schedule
                </Badge>
                <h3 className="text-2xl font-bold">Book a Test Drive</h3>
                <p className="text-blue-100/80 text-xs leading-relaxed">
                  Experience this {car.make} {car.model} on the road. Select a convenient time slot and get verified.
                </p>
              </div>

              <div className="space-y-3">
                <Button className="w-full bg-blue-500 hover:bg-blue-400 text-white h-12 rounded-2xl font-bold shadow-lg shadow-blue-500/30 gap-2 text-sm">
                  <Calendar className="w-4 h-4" /> Book Test Drive Now
                </Button>
                <p className="text-[11px] text-blue-200/70 text-center flex items-center justify-center gap-1">
                  <Shield className="w-3 h-3 text-emerald-400" /> Free & No Obligation
                </p>
              </div>
            </Card>

            {/* DEALERSHIP CONTACT CARD */}
            <Card className="border-slate-200/80 bg-white rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                Dealership Location
              </h3>

              <div className="space-y-3 text-xs text-slate-600">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                  <span>69 Car Street, Available, SL, 60100</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span className="font-semibold text-slate-800">+94 078 797 9131</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <MessageSquare className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span>rawufdeenriza@gmail.com</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 p-3 rounded-xl font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Verified Trusted Seller</span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
