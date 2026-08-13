"use client";

import { Card } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Quote, Star, User } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

export default function TestimonialsCarousel({ testimonials = [] }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const items = testimonials && testimonials.length > 0 ? testimonials : [
    {
      id: "demo-1",
      name: "Sarah Johnson",
      role: "BMW M5 Owner",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      rating: 5,
      content: "Amazing experience! The car was in perfect condition and the test drive booking process was so smooth and effortless. Highly recommended!",
    },
    {
      id: "demo-2",
      name: "Michael Chen",
      role: "Mercedes AMG GT Owner",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      rating: 5,
      content: "Great customer service and transparent pricing. Found my dream supercar fast with direct showroom verification!",
    },
    {
      id: "demo-3",
      name: "Emily Davis",
      role: "Audi Q7 Owner",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
      rating: 5,
      content: "Professional and trustworthy platform. Smooth reservation and top quality vehicle. Will definitely purchase again!",
    },
    {
      id: "demo-4",
      name: "David Miller",
      role: "Porsche 911 Owner",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
      rating: 5,
      content: "Outstanding VIP test drive experience! The platform made finding my exact specification car effortless.",
    },
  ];

  // Number of visible cards per view: 3 on desktop, 1 on mobile
  const itemsPerPage = 3;
  const totalPages = Math.ceil(items.length / itemsPerPage);

  // Auto-swipe effect every 4 seconds when more than 3 testimonials exist
  useEffect(() => {
    if (isPaused || items.length <= itemsPerPage) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % totalPages);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused, items.length, totalPages]);

  const prevSlide = () => {
    setCurrentIdx((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const nextSlide = () => {
    setCurrentIdx((prev) => (prev + 1) % totalPages);
  };

  // Slice items for current slide
  const startIndex = currentIdx * itemsPerPage;
  const visibleItems = items.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div
      className="space-y-8"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* TESTIMONIAL CARDS GRID SLIDE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-500">
        {visibleItems.map((item) => (
          <Card
            key={item.id}
            className="border border-slate-200/80 shadow-sm rounded-3xl p-6 bg-white flex flex-col justify-between space-y-4 hover:shadow-xl hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="space-y-3">
              {/* GOLD STAR RATING */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= (item.rating || 5) ? "fill-amber-400 text-amber-400" : "text-slate-200"
                      }`}
                    />
                  ))}
                </div>
                <Quote className="w-5 h-5 text-blue-200" />
              </div>

              {/* QUOTE TEXT */}
              <p className="text-xs text-slate-600 leading-relaxed italic">
                "{item.content}"
              </p>
            </div>

            {/* CUSTOMER PROFILE AVATAR & NAME */}
            <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
              <div className="h-11 w-11 rounded-full bg-slate-100 border border-slate-200 relative overflow-hidden flex-shrink-0 shadow-sm">
                {item.avatar ? (
                  <Image
                    src={item.avatar}
                    alt={item.name}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <User className="w-5 h-5 m-auto text-slate-400" />
                )}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">{item.name}</h4>
                <p className="text-[11px] text-slate-400 font-medium">{item.role || "Verified Customer"}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* CAROUSEL AUTO-SWIPE CONTROLS & DOT INDICATORS */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          {/* DOT INDICATORS */}
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentIdx(i)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  currentIdx === i ? "w-8 bg-blue-600" : "w-2.5 bg-slate-300 hover:bg-slate-400"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          {/* ARROW BUTTONS */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={prevSlide}
              className="h-10 w-10 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 flex items-center justify-center transition-all shadow-sm"
              aria-label="Previous testimonials"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={nextSlide}
              className="h-10 w-10 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 flex items-center justify-center transition-all shadow-sm"
              aria-label="Next testimonials"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
