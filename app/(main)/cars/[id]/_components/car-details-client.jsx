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
    <div className="space-y-6">
      {/* MAIN GALLERY DISPLAY */}
      <Card className="overflow-hidden border-slate-200/80 shadow-md rounded-3xl bg-white p-0 group relative">
        <div className="relative h-80 md:h-[450px] w-full bg-slate-900 overflow-hidden">
          {activeImage ? (
            <Image
              key={selectedImgIdx}
              src={activeImage}
              alt={`${car.make} ${car.model}`}
              fill
              unoptimized
              className="object-cover transition-all duration-500 group-hover:scale-105"
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
        <Button
          variant="ghost"
          size="icon"
          disabled={isPending}
          onClick={handleToggleSave}
          className={`absolute top-4 left-4 z-20 h-10 w-10 rounded-full shadow-lg transition-all ${
            isSaved
              ? "bg-white text-rose-500 hover:bg-slate-100"
              : "bg-black/40 backdrop-blur-md text-white hover:bg-black/60"
          }`}
          title={isSaved ? "Remove from saved cars" : "Save car to favorites"}
        >
          <Heart className={isSaved ? "fill-rose-500 text-rose-500 w-5 h-5" : "w-5 h-5"} />
        </Button>

        {/* IMAGE COUNTER BADGE */}
        {images.length > 1 && (
          <div className="absolute top-4 right-4 z-10">
            <Badge className="bg-black/60 backdrop-blur-md text-white border-white/20 text-xs px-3 py-1 font-bold gap-1.5">
              <Camera className="w-3.5 h-3.5 text-blue-400" />
              {selectedImgIdx + 1} of {images.length}
            </Badge>
          </div>
        )}
      </Card>

      {/* THUMBNAIL SELECTOR BAR */}
      {images.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedImgIdx(idx)}
              className={`h-20 w-28 relative rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                selectedImgIdx === idx
                  ? "border-blue-600 ring-4 ring-blue-500/20 scale-105"
                  : "border-slate-200 opacity-70 hover:opacity-100"
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
