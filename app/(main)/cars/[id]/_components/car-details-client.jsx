"use client";

import { toggleSaveCar } from "@/action/reservations";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, Car, Heart, Sparkles } from "lucide-react";
import Image from "next/image";
import React, { useState, useTransition } from "react";
import { toast } from "sonner";

export default function CarDetailsClient({ car, initialSaved = false }) {
  const images = car.image && car.image.length > 0 ? car.image : [];
  const [selectedImgIdx, setSelectedImgIdx] = useState(0);
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();

  const activeImage = images[selectedImgIdx] || images[0];

  const handleToggleSave = async () => {
    startTransition(async () => {
      const res = await toggleSaveCar(car.id);
      if (res.success) {
        setIsSaved(res.saved);
        toast.success(res.message, {
          description: res.saved ? "You can view your saved cars under My Reservations." : "",
        });
      } else {
        toast.error(res.error || "Please sign in to save vehicles.");
      }
    });
  };

  return (
    <div className="space-y-4">
      {/* MAIN GALLERY DISPLAY */}
      <div className="overflow-hidden border border-slate-200/90 shadow-lg rounded-3xl bg-slate-950 p-0 group relative">
        <div className="relative h-72 sm:h-96 md:h-[480px] w-full overflow-hidden">
          {activeImage ? (
            <Image
              key={selectedImgIdx}
              src={activeImage}
              alt={`${car.make} ${car.model}`}
              fill
              unoptimized
              className="object-cover transition-all duration-700 group-hover:scale-105"
              priority
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-2">
              <Car className="w-16 h-16 stroke-[1.5]" />
              <span className="text-sm font-medium">No Images Available</span>
            </div>
          )}
        </div>

        {/* SAVE CAR HEART BUTTON */}
        <button
          type="button"
          disabled={isPending}
          onClick={handleToggleSave}
          className={`absolute top-4 left-4 z-20 h-11 w-11 rounded-full shadow-xl transition-all flex items-center justify-center cursor-pointer ${
            isSaved
              ? "bg-white text-rose-500 hover:scale-110 shadow-rose-500/20"
              : "bg-slate-900/75 backdrop-blur-md text-white hover:bg-slate-900 hover:scale-110"
          }`}
          title={isSaved ? "Remove from saved cars" : "Save car to favorites"}
        >
          <Heart className={isSaved ? "fill-rose-500 text-rose-500 w-5 h-5" : "w-5 h-5"} />
        </button>

        {/* IMAGE COUNTER BADGE */}
        {images.length > 1 && (
          <div className="absolute top-4 right-4 z-10">
            <span className="bg-slate-900/80 backdrop-blur-md text-white border border-white/20 text-xs px-3 py-1.5 rounded-full font-bold flex items-center gap-1.5 shadow-lg">
              <Camera className="w-3.5 h-3.5 text-blue-400" />
              {selectedImgIdx + 1} of {images.length}
            </span>
          </div>
        )}
      </div>

      {/* THUMBNAIL SELECTOR BAR */}
      {images.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 scrollbar-none">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedImgIdx(idx)}
              className={`h-20 w-28 sm:h-24 sm:w-32 relative rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                selectedImgIdx === idx
                  ? "border-blue-600 ring-4 ring-blue-500/25 scale-105 shadow-md"
                  : "border-slate-200 opacity-70 hover:opacity-100 hover:border-slate-400"
              }`}
            >
              <Image src={img} alt="Thumbnail" fill unoptimized className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
