"use client";

import HomeSearch from "@/components/Home-search";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Play, Sparkles, UserCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function HomeHeroCarousel({ slides = [], defaultTitle, defaultSubtitle }) {
  const [currentIdx, setCurrentIdx] = useState(0);

  const heroSlides = Array.isArray(slides) && slides.length > 0
    ? slides
    : [
        {
          id: "default-1",
          image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1600&q=80",
          title: defaultTitle || "Premium Luxury & Supercars Available",
          subtitle: defaultSubtitle || "Discover exceptional vehicles from leading brands at the best prices.",
          ctaText: "Explore Cars",
          ctaLink: "/cars",
        },
      ];

  // Auto-swipe effect every 4.5 seconds
  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % heroSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const activeSlide = heroSlides[currentIdx] || heroSlides[0];

  return (
    <section className="relative min-h-[540px] md:min-h-[640px] bg-slate-950 text-white flex flex-col justify-between overflow-hidden shadow-2xl">
      {/* BACKGROUND CAROUSEL IMAGE WITH OVERLAY */}
      {activeSlide.image && (
        <Image
          key={activeSlide.id || currentIdx}
          src={activeSlide.image}
          alt={activeSlide.title || "Showroom Hero"}
          fill
          priority
          unoptimized
          className="object-cover opacity-50 transition-opacity duration-1000 scale-105"
        />
      )}

      {/* GRADIENT OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/30 z-10" />

      {/* HERO SLIDE CONTENT */}
      <div className="relative z-20 container mx-auto px-4 pt-24 md:pt-32 pb-8 flex-1 flex flex-col justify-center max-w-5xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
          <div className="space-y-4 max-w-2xl text-left">
            <Badge className="bg-blue-600/90 text-white border-blue-400/40 text-xs px-3.5 py-1 font-bold shadow-lg inline-flex items-center gap-1.5 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-blue-300" /> Premium Collection
            </Badge>

            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight text-white drop-shadow-lg">
              {activeSlide.title}
            </h1>

            <p className="text-base md:text-lg text-slate-200 font-medium leading-relaxed drop-shadow max-w-xl">
              {activeSlide.subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button
                asChild
                size="lg"
                className="bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold px-8 py-6 shadow-xl shadow-blue-600/40 text-sm"
              >
                <Link href={activeSlide.ctaLink || "/cars"}>
                  {activeSlide.ctaText || "Explore Cars"} →
                </Link>
              </Button>

              <Button
                size="lg"
                onClick={() => window.scrollTo({ top: 800, behavior: "smooth" })}
                className="bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-2xl px-6 py-6 text-sm gap-2 shadow-xl border border-white/40 flex items-center"
              >
                <Play className="w-4 h-4 text-blue-600 fill-blue-600" /> Watch Showcase
              </Button>
            </div>
          </div>

          {/* TRUSTED CUSTOMERS CHIP */}
          <div className="hidden md:flex items-center gap-3 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 shadow-lg">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center font-bold text-xs text-white">R</div>
              <div className="w-8 h-8 rounded-full bg-indigo-500 border-2 border-white flex items-center justify-center font-bold text-xs text-white">N</div>
              <div className="w-8 h-8 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center font-bold text-xs text-white">S</div>
            </div>
            <div className="text-left text-xs">
              <p className="font-extrabold text-white">Trusted by 2,500+</p>
              <p className="text-blue-200 text-[11px]">Happy Showroom Customers</p>
            </div>
          </div>
        </div>

        {/* FLOATING MULTI-FIELD SEARCH TOOLBAR */}
        <div className="w-full mt-4">
          <HomeSearch />
        </div>
      </div>

      {/* CAROUSEL NAVIGATION ARROWS & DOTS */}
      {heroSlides.length > 1 && (
        <div className="relative z-30 container mx-auto px-4 pb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentIdx(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentIdx === i ? "w-8 bg-blue-500" : "w-2.5 bg-white/40 hover:bg-white/70"
                }`}
                aria-label={`Jump to slide ${i + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentIdx((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
              className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/30 backdrop-blur-md text-white flex items-center justify-center transition-colors"
              aria-label="Previous slide"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setCurrentIdx((prev) => (prev + 1) % heroSlides.length)}
              className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/30 backdrop-blur-md text-white flex items-center justify-center transition-colors"
              aria-label="Next slide"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
