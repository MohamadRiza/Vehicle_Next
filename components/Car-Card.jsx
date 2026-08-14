"use client";

import { toggleSaveCar } from "@/action/reservations";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { CarIcon, Fuel, Gauge, Heart, Sparkles } from "lucide-react";
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
      <div className="relative h-52 w-full bg-slate-100 overflow-hidden">
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
          {car.status === "SOLD" && (
            <Badge className="bg-slate-900/90 text-white font-semibold text-[10px] px-2.5 py-0.5 rounded-md shadow">
              SOLD
            </Badge>
          )}
          {car.feautured && (
            <Badge className="bg-amber-500 text-white font-semibold text-[10px] px-2 py-0.5 rounded-md shadow flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Featured
            </Badge>
          )}
        </div>

        {/* WISHLIST HEART BUTTON */}
        <Button
          variant="ghost"
          size="icon"
          disabled={isPending}
          className={`absolute top-3 right-3 bg-white/80 backdrop-blur-md hover:bg-white rounded-full h-9 w-9 shadow-md transition-all z-10 ${
            isSaved
              ? "text-rose-500 hover:text-rose-600 bg-white"
              : "text-slate-600 hover:text-slate-900"
          }`}
          onClick={handleToggleSave}
          title={isSaved ? "Remove from saved cars" : "Save car for future"}
        >
          <Heart className={isSaved ? "fill-rose-500 text-rose-500 w-4 h-4" : "w-4 h-4"} />
        </Button>

        {/* GRADIENT OVERLAY */}
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
        <div className="absolute bottom-2 left-3 text-white text-xs font-medium drop-shadow z-10">
          {car.year} • {car.bodyType}
        </div>
      </div>

      {/* CARD CONTENT */}
      <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
              {car.make} {car.model}
            </h3>
          </div>

          <div className="text-2xl font-extrabold text-blue-600 tracking-tight">
            ${formattedPrice}
          </div>
        </div>

        {/* SPECS BADGES */}
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-lg">
            <Gauge className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
            <span className="font-medium truncate">{formattedMileage} mi</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-lg">
            <Fuel className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
            <span className="font-medium truncate">{car.fuelType}</span>
          </div>
        </div>

        {/* ACTION BUTTON */}
        <Button
          className="w-full bg-slate-900 hover:bg-blue-600 text-white font-semibold rounded-xl shadow-sm transition-all duration-200"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/cars/${car.id}`);
          }}
        >
          View Car Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default CarCard;
