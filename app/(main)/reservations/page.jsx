import { getUserReservations } from "@/action/reservations";
import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/nextjs";
import { Lock } from "lucide-react";
import React from "react";
import ReservationsClient from "./_components/reservations-client";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "My Reservations & Saved Vehicles | Vehiql AI",
  description:
    "Track your scheduled vehicle test drives, confirmed showroom bookings, and wishlisted vehicles.",
};

export default async function MyReservationsPage() {
  const res = await getUserReservations();

  if (!res.success && res.error === "Unauthorized") {
    return (
      <div className="min-h-screen bg-slate-50/60 pt-36 pb-24 flex items-center justify-center">
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/90 shadow-xl text-center space-y-6 max-w-md mx-4">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-slate-900">Sign In to View Reservations</h1>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
              Please sign in to access your test drive schedules, confirmed appointments, and saved wishlist.
            </p>
          </div>
          <SignInButton forceRedirectUrl="/reservations">
            <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-full font-extrabold h-12 shadow-lg shadow-blue-600/30 text-xs sm:text-sm">
              Sign In to Your Account
            </Button>
          </SignInButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60">
      <ReservationsClient
        user={res.user}
        initialBookings={res.bookings}
        initialSavedCars={res.savedCars}
      />
    </div>
  );
}
