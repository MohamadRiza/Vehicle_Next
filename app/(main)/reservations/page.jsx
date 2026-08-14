import { getUserReservations } from "@/action/reservations";
import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/nextjs";
import { Calendar, Car, Lock } from "lucide-react";
import React from "react";
import ReservationsClient from "./_components/reservations-client";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "My Reservations & Test Drives | Vehicle AI",
  description: "Track your booked vehicle test drives, scheduled appointments, and saved vehicles.",
};

export default async function MyReservationsPage() {
  const res = await getUserReservations();

  if (!res.success && res.error === "Unauthorized") {
    return (
      <div className="pt-32 pb-20 container mx-auto px-4 text-center space-y-6">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-900">Sign In to View Reservations</h1>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            Please sign in to access your test drive schedules, reserved vehicles, and saved wishlist.
          </p>
        </div>
        <SignInButton forceRedirectUrl="/reservations">
          <Button className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl px-6">
            Sign In Now
          </Button>
        </SignInButton>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-slate-50/60">
      <div className="container mx-auto px-4 max-w-6xl">
        <ReservationsClient
          user={res.user}
          initialBookings={res.bookings}
          initialSavedCars={res.savedCars}
        />
      </div>
    </div>
  );
}
