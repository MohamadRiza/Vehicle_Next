"use client";

import { cancelUserTestDrive, removeSavedCar } from "@/action/reservations";
import CarCard from "@/components/Car-Card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Calendar,
  Car,
  CheckCircle2,
  Clock,
  Heart,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Trash2,
  User,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useTransition } from "react";
import { toast } from "sonner";

function formatDateDisplay(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTimeDisplay(timeString) {
  if (!timeString) return "N/A";
  if (timeString.includes("AM") || timeString.includes("PM")) return timeString;
  const [hours, minutes] = timeString.split(":");
  const h = parseInt(hours, 10);
  if (isNaN(h)) return timeString;
  const period = h >= 12 ? "PM" : "AM";
  const formattedHours = h % 12 || 12;
  return `${formattedHours}:${minutes || "00"} ${period}`;
}

export default function ReservationsClient({
  user,
  initialBookings = [],
  initialSavedCars = [],
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(
    activeTabParam === "saved-cars" ? "saved-cars" : "test-drives"
  );
  const [isPending, startTransition] = useTransition();
  const [bookings, setBookings] = useState(initialBookings);
  const [savedCars, setSavedCars] = useState(initialSavedCars);

  const handleCancelBooking = async (bookingId) => {
    if (!confirm("Are you sure you want to cancel this test drive appointment?"))
      return;

    startTransition(async () => {
      const res = await cancelUserTestDrive(bookingId);
      if (res.success) {
        toast.success("Test drive appointment cancelled");
        setBookings((prev) =>
          prev.map((b) =>
            b.id === bookingId ? { ...b, status: "CANCELLED" } : b
          )
        );
      } else {
        toast.error(res.error || "Failed to cancel appointment");
      }
    });
  };

  const handleRemoveSaved = async (savedCarId) => {
    startTransition(async () => {
      const res = await removeSavedCar(savedCarId);
      if (res.success) {
        toast.success("Vehicle removed from saved list");
        setSavedCars((prev) => prev.filter((s) => s.id !== savedCarId));
      } else {
        toast.error(res.error || "Failed to remove vehicle");
      }
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            Pending Confirmation
          </span>
        );
      case "CONFIRMED":
        return (
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Confirmed Appointment
          </span>
        );
      case "COMPLETED":
        return (
          <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
            Completed Test Drive
          </span>
        );
      case "CANCELLED":
        return (
          <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
            <XCircle className="w-3.5 h-3.5 text-rose-500" />
            Cancelled
          </span>
        );
      default:
        return (
          <Badge variant="secondary" className="text-xs">
            {status}
          </Badge>
        );
    }
  };

  return (
    <div>
      {/* ── TOP HERO HEADER WITH DYNAMIC BACKGROUND IMAGE CROSS-FADE ── */}
      <div className="relative overflow-hidden bg-[#030a18] text-white pt-28 sm:pt-32 md:pt-36 pb-24 md:pb-32 border-b border-slate-900 shadow-xl transition-all duration-700">
        
        {/* BACKGROUND IMAGE 1: TEST DRIVES (DARK BLUE BMW SPORTS CAR) */}
        <div
          className={`absolute right-0 top-0 bottom-0 w-full lg:w-3/5 h-full pointer-events-none z-0 transition-opacity duration-700 ease-in-out ${
            activeTab === "test-drives" ? "opacity-85 lg:opacity-95" : "opacity-0"
          }`}
        >
          <Image
            src="/cars-header.jpg"
            alt="Test Drives Header"
            fill
            priority
            unoptimized
            className="object-cover object-center lg:object-right"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#030a18] via-[#030a18]/85 via-35% via-[#030a18]/70 via-60% to-transparent to-95% z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#030a18]/60 via-transparent to-[#030a18]/80 z-10" />
        </div>

        {/* BACKGROUND IMAGE 2: SAVED CARS (CRIMSON RED LUXURY HYPERCAR) */}
        <div
          className={`absolute right-0 top-0 bottom-0 w-full lg:w-3/5 h-full pointer-events-none z-0 transition-opacity duration-700 ease-in-out ${
            activeTab === "saved-cars" ? "opacity-85 lg:opacity-95" : "opacity-0"
          }`}
        >
          <Image
            src="/saved-cars-header.jpg"
            alt="Saved Cars Wishlist Header"
            fill
            priority
            unoptimized
            className="object-cover object-center lg:object-right"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#030a18] via-[#030a18]/85 via-35% via-[#030a18]/70 via-60% to-transparent to-95% z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#030a18]/60 via-transparent to-[#030a18]/80 z-10" />
        </div>

        {/* HERO TITLE CONTAINER */}
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-xl space-y-3 text-left">
              {/* DYNAMIC BADGE */}
              {activeTab === "test-drives" ? (
                <div className="inline-flex items-center gap-1.5 bg-slate-800/90 border border-slate-700/80 text-blue-300 px-3.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider backdrop-blur-sm shadow-sm transition-all duration-300">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>CUSTOMER SHOWROOM CONCIERGE</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 bg-slate-800/90 border border-slate-700/80 text-rose-300 px-3.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider backdrop-blur-sm shadow-sm transition-all duration-300">
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                  <span>SAVED VEHICLES & WISHLIST</span>
                </div>
              )}

              {/* DYNAMIC HEADING */}
              {activeTab === "test-drives" ? (
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight drop-shadow-md transition-all duration-300">
                  My Reservations <br className="hidden sm:inline" />
                  <span className="text-sky-400">& Test Drive Appointments</span>
                </h1>
              ) : (
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight drop-shadow-md transition-all duration-300">
                  My Saved Vehicles <br className="hidden sm:inline" />
                  <span className="text-rose-400">& Dream Car Collection ({savedCars.length})</span>
                </h1>
              )}

              {/* DYNAMIC SUBTITLE */}
              {activeTab === "test-drives" ? (
                <p className="text-slate-300 text-xs sm:text-sm font-medium leading-relaxed max-w-md drop-shadow transition-all duration-300">
                  Track your booked test drive appointments, live confirmation statuses, and showroom reservations in real time.
                </p>
              ) : (
                <p className="text-slate-300 text-xs sm:text-sm font-medium leading-relaxed max-w-md drop-shadow transition-all duration-300">
                  Keep track of your favorite vehicles, monitor showroom pricing, and book instant VIP test drives for saved cars.
                </p>
              )}
            </div>

            {/* ACTION PILL */}
            <div className="flex items-center gap-3">
              <Button asChild className="bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold px-6 py-2.5 shadow-lg shadow-blue-600/30 text-xs gap-1.5">
                <Link href="/cars">
                  <span>Explore Showroom</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT CONTAINER WITH INTERACTIVE TAB PILL ── */}
      <div className="container mx-auto px-4 max-w-6xl -mt-8 md:-mt-10 relative z-20 pb-24 space-y-8">
        
        {/* DUAL PILL TAB SELECTOR */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-2 max-w-md mx-auto flex justify-center">
          <div className="bg-slate-100/90 p-1.5 rounded-2xl h-auto gap-2 w-full grid grid-cols-2">
            {/* TAB 1: TEST DRIVES */}
            <button
              type="button"
              onClick={() => setActiveTab("test-drives")}
              className={`rounded-xl py-3 text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === "test-drives"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 scale-[1.02]"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Test Drives ({bookings.length})</span>
            </button>

            {/* TAB 2: SAVED CARS */}
            <button
              type="button"
              onClick={() => setActiveTab("saved-cars")}
              className={`rounded-xl py-3 text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === "saved-cars"
                  ? "bg-rose-600 text-white shadow-md shadow-rose-600/30 scale-[1.02]"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
              }`}
            >
              <Heart className={`w-4 h-4 ${activeTab === "saved-cars" ? "fill-white" : ""}`} />
              <span>Saved Cars ({savedCars.length})</span>
            </button>
          </div>
        </div>

        {/* ── CONTENT AREA 1: TEST DRIVE APPOINTMENTS ────────── */}
        {activeTab === "test-drives" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {bookings.length === 0 ? (
              <div className="bg-white rounded-3xl p-16 text-center border border-slate-200/90 shadow-sm space-y-5 max-w-md mx-auto">
                <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
                  <Calendar className="w-10 h-10" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-xl font-black text-slate-900">
                    No Test Drive Bookings Yet
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                    You haven&apos;t booked any showroom test drives yet. Browse our inventory to schedule an instant VIP test drive.
                  </p>
                </div>
                <Button
                  asChild
                  className="bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold px-8 py-3 shadow-lg shadow-blue-600/30 text-xs"
                >
                  <Link href="/cars">Explore Available Cars</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {bookings.map((b) => (
                  <div
                    key={b.id}
                    className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
                  >
                    <div className="p-6 sm:p-7 space-y-5">
                      {/* CARD HEADER */}
                      <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
                        <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                          {b.bookingCode || `TD${b.id.slice(0, 4).toUpperCase()}`}
                        </span>
                        <div>{getStatusBadge(b.status)}</div>
                      </div>

                      {/* VEHICLE SNAPSHOT ROW */}
                      <div className="flex items-center gap-4">
                        <div className="h-20 w-28 sm:h-24 sm:w-32 relative rounded-2xl bg-slate-900 overflow-hidden flex-shrink-0 border border-slate-200 shadow-xs">
                          {b.car?.image?.[0] ? (
                            <Image
                              src={b.car.image[0]}
                              alt={b.car.model}
                              fill
                              unoptimized
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <Car className="w-8 h-8 m-auto text-slate-400" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1 space-y-1">
                          <h4 className="text-base sm:text-lg font-black text-slate-900 truncate">
                            {b.car
                              ? `${b.car.year} ${b.car.make} ${b.car.model}`
                              : "Showroom Vehicle"}
                          </h4>
                          <p className="text-lg font-black text-blue-600">
                            ${Number(b.car?.price || 0).toLocaleString()}
                          </p>
                          <p className="text-[11px] text-slate-500 capitalize font-medium">
                            {b.car?.bodyType} • {b.car?.transmission} • {b.car?.fuelType}
                          </p>
                        </div>
                      </div>

                      {/* APPOINTMENT SCHEDULE INFO BOX */}
                      <div className="bg-slate-50/80 p-4 rounded-2xl space-y-2.5 border border-slate-100 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 font-semibold flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-blue-600" />
                            Reserved Date:
                          </span>
                          <strong className="text-slate-900 font-bold">
                            {formatDateDisplay(b.bookingDate)}
                          </strong>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 font-semibold flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-indigo-600" />
                            Time Slot:
                          </span>
                          <strong className="text-slate-900 font-bold">
                            {formatTimeDisplay(b.startTime)}
                          </strong>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 font-semibold flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-emerald-600" />
                            Contact Phone:
                          </span>
                          <strong className="text-slate-900 font-bold">
                            {b.phone || user?.phone || "+94 078 797 9131"}
                          </strong>
                        </div>
                      </div>

                      {/* SHOWROOM LOCATION */}
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                        <span>Showroom Location: 69 Car Street, Available, SL, 60100</span>
                      </div>
                    </div>

                    {/* CARD ACTIONS FOOTER */}
                    <div className="p-4 sm:p-5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/cars/${b.carId}`)}
                        className="text-xs font-bold rounded-xl border-slate-200 text-slate-700 hover:bg-white hover:border-blue-300 gap-1"
                      >
                        <span>View Vehicle</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>

                      {b.status !== "CANCELLED" && b.status !== "COMPLETED" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCancelBooking(b.id)}
                          disabled={isPending}
                          className="text-xs font-bold rounded-xl text-rose-600 hover:bg-rose-50 hover:text-rose-700 gap-1 cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Cancel Booking</span>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── CONTENT AREA 2: SAVED CARS WISHLIST ────────────── */}
        {activeTab === "saved-cars" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {savedCars.length === 0 ? (
              <div className="bg-white rounded-3xl p-16 text-center border border-slate-200/90 shadow-sm space-y-5 max-w-md mx-auto">
                <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
                  <Heart className="w-10 h-10" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-xl font-black text-slate-900">
                    No Saved Cars in Wishlist
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                    Click the heart icon on any vehicle in our showroom to save it here for instant comparison.
                  </p>
                </div>
                <Button
                  asChild
                  className="bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold px-8 py-3 shadow-lg shadow-blue-600/30 text-xs"
                >
                  <Link href="/cars">Explore Cars Now</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedCars.map((item) => {
                  if (!item.car) return null;
                  return (
                    <div key={item.id} className="relative group">
                      <CarCard car={{ ...item.car, wishlisted: true }} />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveSaved(item.id);
                        }}
                        disabled={isPending}
                        className="absolute top-4 left-4 h-9 w-9 rounded-full shadow-lg bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center z-20 cursor-pointer transition-transform hover:scale-110"
                        title="Remove from saved vehicles"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
