"use client";

import { toggleSaveCar } from "@/action/reservations";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { CarIcon, Fuel, Gauge, Heart, Settings, Sparkles } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";
import { toast } from "sonner";

const CarCard = ({ car }) => {
  const [isSaved, setIsSaved] = useState(car.wishlisted || false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleToggleSave = async (e) => {
    e.stopPropagation();

    startTransition(async () => {
      const res = await toggleSaveCar(car.id);
      if (res.success) {
        setIsSaved(res.saved);
        toast.success(res.message, {
          description: res.saved ? "You can view all saved vehicles under My Reservations." : "",
        });
      } else {
        toast.error(res.error || "Please sign in to save vehicles.");
      }
    });
  };

  const formattedPrice = typeof car.price === "number"
    ? car.price.toLocaleString()
    : Number(car.price || 0).toLocaleString();

  const formattedMileage = typeof car.mileage === "number"
    ? car.mileage.toLocaleString()
    : Number(car.mileage || 0).toLocaleString();

  return (
    <Card
      onClick={() => router.push(`/cars/${car.id}`)}
      className="overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer border border-slate-200/80 rounded-2xl bg-white flex flex-col py-0"
    >
      {/* VEHICLE IMAGE CONTAINER */}
      <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
        {car.image && car.image.length > 0 ? (
          <Image
            src={car.image[0]}
            alt={`${car.make} ${car.model}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-slate-100 flex flex-col items-center justify-center text-slate-400 gap-1">
            <CarIcon className="h-12 w-12 stroke-[1.5]" />
            <span className="text-xs font-medium">No Image Available</span>
          </div>
        )}

        {/* STATUS / FEATURED BADGES */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          <Badge className="bg-blue-600 text-white font-extrabold text-[10px] px-2.5 py-0.5 rounded-md shadow">
            Featured
          </Badge>
          {car.status === "SOLD" && (
            <Badge className="bg-slate-900/90 text-white font-semibold text-[10px] px-2.5 py-0.5 rounded-md shadow">
              SOLD
            </Badge>
          )}
        </div>

        {/* WISHLIST HEART BUTTON */}
        <Button
          variant="ghost"
          size="icon"
          disabled={isPending}
          className={`absolute top-3 right-3 bg-white/90 backdrop-blur-md hover:bg-white rounded-full h-8 w-8 shadow-sm transition-all z-10 ${
            isSaved
              ? "text-rose-500 hover:text-rose-600 bg-white"
              : "text-slate-500 hover:text-slate-900"
          }`}
          onClick={handleToggleSave}
          title={isSaved ? "Remove from saved cars" : "Save car for future"}
        >
          <Heart className={isSaved ? "fill-rose-500 text-rose-500 w-3.5 h-3.5" : "w-3.5 h-3.5"} />
        </Button>
      </div>

      {/* CARD CONTENT */}
      <CardContent className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 className="text-base font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
            {car.make} {car.model}
          </h3>

          <p className="text-[11px] text-slate-400 font-medium mt-0.5">
            {car.year || 2023} • {formattedMileage} km • {car.fuelType || "Petrol"}
          </p>

          <div className="text-xl font-black text-blue-600 tracking-tight mt-2">
            ${formattedPrice}
          </div>
        </div>

        {/* SPECS BADGES */}
        <div className="flex items-center gap-2 text-[11px] text-slate-600 pt-1">
          <span className="flex items-center gap-1.5 bg-slate-100/80 px-2.5 py-1 rounded-md font-semibold text-slate-700">
            <Settings className="w-3 h-3 text-blue-600 flex-shrink-0" />
            <span>{car.transmission || "Automatic"}</span>
          </span>
          <span className="flex items-center gap-1.5 bg-slate-100/80 px-2.5 py-1 rounded-md font-semibold text-slate-700">
            <Gauge className="w-3 h-3 text-indigo-600 flex-shrink-0" />
            <span>{formattedMileage} mi</span>
          </span>
        </div>

        {/* VIEW DETAILS LINK */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
          <span>View Details</span>
          <span>→</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default CarCard;
