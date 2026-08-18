"use client";

import { removeSavedCar } from "@/action/reservations";
import CarCard from "@/components/Car-Card";
import { Button } from "@/components/ui/button";
import { Heart, Sparkles, Trash2 } from "lucide-react";
import Link from "next/link";
import React, { useState, useTransition } from "react";
import { toast } from "sonner";

export default function SavedCarsClient({ initialSavedCars = [] }) {
  const [isPending, startTransition] = useTransition();
  const [savedCars, setSavedCars] = useState(initialSavedCars);

  const handleRemoveSaved = async (savedCarId) => {
    startTransition(async () => {
      const res = await removeSavedCar(savedCarId);
      if (res.success) {
        toast.success("Vehicle removed from saved wishlist");
        setSavedCars((prev) => prev.filter((s) => s.id !== savedCarId));
      } else {
        toast.error(res.error || "Failed to remove vehicle");
      }
    });
  };

  if (savedCars.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-16 text-center border border-slate-200/90 shadow-lg space-y-5 max-w-md mx-auto">
        <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
          <Heart className="w-10 h-10" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-xl font-black text-slate-900">
            Your Wishlist is Empty
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
            You haven&apos;t saved any cars yet. Explore our luxury showroom and click the heart icon on any vehicle to save it here.
          </p>
        </div>
        <Button
          asChild
          className="bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold px-8 py-3 shadow-lg shadow-blue-600/30 text-xs"
        >
          <Link href="/cars">Explore Vehicles Now</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
          <span>Showing {savedCars.length} Saved {savedCars.length === 1 ? "Vehicle" : "Vehicles"}</span>
        </div>
        <Link href="/cars" className="text-xs font-bold text-blue-600 hover:underline">
          + Add More Vehicles
        </Link>
      </div>

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
    </div>
  );
}
