"use client";

import { cancelUserTestDrive, removeSavedCar } from "@/action/reservations";
import CarCard from "@/components/Car-Card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Car,
  CheckCircle2,
  Clock,
  Heart,
  MapPin,
  Phone,
  ShieldCheck,
  Trash2,
  User,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

export default function ReservationsClient({ user, initialBookings = [], initialSavedCars = [] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [bookings, setBookings] = useState(initialBookings);
  const [savedCars, setSavedCars] = useState(initialSavedCars);

  const handleCancelBooking = async (bookingId) => {
    if (!confirm("Are you sure you want to cancel this test drive appointment?")) return;

    startTransition(async () => {
      const res = await cancelUserTestDrive(bookingId);
      if (res.success) {
        toast.success("Test drive appointment cancelled");
        setBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? { ...b, status: "CANCELLED" } : b))
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
        toast.success("Car removed from saved list");
        setSavedCars((prev) => prev.filter((s) => s.id !== savedCarId));
      } else {
        toast.error(res.error || "Failed to remove car");
      }
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            Pending Confirmation
          </Badge>
        );
      case "CONFIRMED":
        return (
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
            Confirmed Appointment
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Completed Test Drive
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200">
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2 text-blue-300 text-xs font-semibold uppercase tracking-wider">
            <User className="w-4 h-4" /> Account Reservations
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            My Reservations & Saved Vehicles
          </h1>
          <p className="text-blue-100/80 text-xs md:text-sm max-w-xl">
            Welcome, <strong className="text-white">{user?.name || "Customer"}</strong> ({user?.email}). Track your test drive schedules and wishlisted cars.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <Button asChild className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-600/30 text-xs">
            <Link href="/cars">Explore Showroom</Link>
          </Button>
        </div>
      </div>

      {/* TABS FOR TEST DRIVES & SAVED CARS */}
      <Tabs defaultValue="test-drives" className="w-full space-y-6">
        <TabsList className="bg-white border border-slate-200/80 p-1.5 rounded-2xl h-auto gap-2 shadow-sm">
          <TabsTrigger
            value="test-drives"
            className="rounded-xl px-4 py-2.5 text-xs font-bold data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all gap-2"
          >
            <Calendar className="w-4 h-4" /> Test Drive Appointments ({bookings.length})
          </TabsTrigger>
          <TabsTrigger
            value="saved-cars"
            className="rounded-xl px-4 py-2.5 text-xs font-bold data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all gap-2"
          >
            <Heart className="w-4 h-4" /> Saved Cars ({savedCars.length})
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: TEST DRIVE APPOINTMENTS */}
        <TabsContent value="test-drives" className="space-y-6">
          {bookings.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 text-center border border-slate-200/80 shadow-sm space-y-4 max-w-md mx-auto">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                <Calendar className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">No test drive appointments</h3>
                <p className="text-xs text-slate-500 mt-1">
                  You haven't booked any test drives yet. Browse our inventory and schedule your test drive today.
                </p>
              </div>
              <Button asChild className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl">
                <Link href="/cars">Browse Vehicles</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bookings.map((b) => (
                <Card
                  key={b.id}
                  className="overflow-hidden border border-slate-200/80 rounded-2xl shadow-sm bg-white hover:shadow-md transition-shadow p-0 flex flex-col justify-between"
                >
                  <div className="p-6 space-y-4">
                    {/* CARD HEADER */}
                    <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
                      <Badge variant="outline" className="bg-slate-100 text-slate-700 font-mono text-[11px]">
                        {b.bookingCode || `TD${b.id.slice(0, 4).toUpperCase()}`}
                      </Badge>
                      <div>{getStatusBadge(b.status)}</div>
                    </div>

                    {/* VEHICLE SNAPSHOT */}
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-24 relative rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                        {b.car?.image?.[0] ? (
                          <Image
                            src={b.car.image[0]}
                            alt={b.car.model}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <Car className="w-8 h-8 m-auto text-slate-400" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-base font-bold text-slate-900 truncate">
                          {b.car ? `${b.car.year} ${b.car.make} ${b.car.model}` : "Vehicle"}
                        </h4>
                        <p className="text-xs font-extrabold text-blue-600">
                          ${Number(b.car?.price || 0).toLocaleString()}
                        </p>
                        <p className="text-[11px] text-slate-400 capitalize">
                          {b.car?.bodyType} • {b.car?.transmission}
                        </p>
                      </div>
                    </div>

                    {/* APPOINTMENT SCHEDULE INFO */}
                    <div className="bg-slate-50 p-4 rounded-xl space-y-2 border border-slate-100 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-medium flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-blue-600" /> Reserved Date:
                        </span>
                        <strong className="text-slate-900">{formatDateDisplay(b.bookingDate)}</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-medium flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-indigo-600" /> Time Slot:
                        </span>
                        <strong className="text-slate-900">{formatTimeDisplay(b.startTime)}</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-medium flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-emerald-600" /> Contact Phone:
                        </span>
                        <strong className="text-slate-900">{b.user?.phone || user?.phone || "+94 078 797 9131"}</strong>
                      </div>
                    </div>

                    {/* DEALERSHIP LOCATION */}
                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span>69 Car Street, Available, SL, 60100</span>
                    </div>
                  </div>

                  {/* ACTIONS FOOTER */}
                  <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/cars/${b.carId}`)}
                      className="text-xs rounded-xl border-slate-200 text-slate-700"
                    >
                      View Car Details
                    </Button>

                    {b.status !== "CANCELLED" && b.status !== "COMPLETED" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancelBooking(b.id)}
                        disabled={isPending}
                        className="text-xs rounded-xl border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Cancel Booking
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* TAB 2: SAVED VEHICLES */}
        <TabsContent value="saved-cars" className="space-y-6">
          {savedCars.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 text-center border border-slate-200/80 shadow-sm space-y-4 max-w-md mx-auto">
              <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
                <Heart className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">No saved vehicles</h3>
                <p className="text-xs text-slate-500 mt-1">
                  You haven't added any vehicles to your saved list yet.
                </p>
              </div>
              <Button asChild className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl">
                <Link href="/cars">Explore Cars</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedCars.map((item) => {
                if (!item.car) return null;
                return (
                  <div key={item.id} className="relative group">
                    <CarCard car={{ ...item.car, wishlisted: true }} />
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveSaved(item.id);
                      }}
                      className="absolute top-3 left-3 h-8 w-8 rounded-full shadow-md bg-rose-600 hover:bg-rose-700 text-white z-20"
                      title="Remove from saved"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
