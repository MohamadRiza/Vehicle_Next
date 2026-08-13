"use client";

import { updateHomepageContent } from "@/action/content";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  Heading,
  Image as ImageIcon,
  Layout,
  Megaphone,
  Plus,
  RefreshCw,
  Save,
  Sparkles,
  Trash2,
  Upload,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

export default function ContentForm({ initialContent }) {
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState({
    heroTitle: initialContent?.heroTitle || "Find your dream car with vehicle AI",
    heroSubtitle: initialContent?.heroSubtitle || "Advanced AI Car Search and Test Drive from thousands of vehicles",
    promoHeading: initialContent?.promoHeading || "Ready to find your dream car?",
    promoSubtext: initialContent?.promoSubtext || "Join thousands of satisfied customers who found their perfect vehicle through our platform",
    announcement: initialContent?.announcement || "🔥 Special Offer: Free Home Delivery on All Verified Vehicles!",
    isAnnounceActive: initialContent?.isAnnounceActive ?? true,
    slides: Array.isArray(initialContent?.slides) && initialContent.slides.length > 0
      ? initialContent.slides
      : [
          {
            id: "slide-1",
            image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1400&q=80",
            title: "Find your dream car with vehicle AI",
            subtitle: "Advanced AI Car Search and Test Drive from thousands of vehicles",
            ctaText: "Explore Inventory",
            ctaLink: "/cars",
          },
          {
            id: "slide-2",
            image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=80",
            title: "Premium Luxury & Supercars Available",
            subtitle: "Book an instant VIP test drive for top luxury brands",
            ctaText: "Book Test Drive",
            ctaLink: "/cars",
          },
        ],
  });

  // Carousel Live Preview State
  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  // Auto-swipe effect every 4 seconds
  useEffect(() => {
    if (!autoPlay || formData.slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlideIdx((prev) => (prev + 1) % formData.slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [autoPlay, formData.slides.length]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSlideChange = (index, field, value) => {
    setFormData((prev) => {
      const newSlides = [...prev.slides];
      newSlides[index] = { ...newSlides[index], [field]: value };
      return { ...prev, slides: newSlides };
    });
  };

  const handleAddSlide = () => {
    if (formData.slides.length >= 5) {
      toast.error("Maximum 5 slides allowed!");
      return;
    }
    const newSlide = {
      id: `slide-${Date.now()}`,
      image: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1400&q=80",
      title: "New Banner Slide Title",
      subtitle: "Add custom description or subtitle for this slide banner.",
      ctaText: "View Details",
      ctaLink: "/cars",
    };
    setFormData((prev) => ({ ...prev, slides: [...prev.slides, newSlide] }));
    setCurrentSlideIdx(formData.slides.length);
    toast.success("New slide added!");
  };

  const handleDeleteSlide = (index) => {
    if (formData.slides.length <= 1) {
      toast.error("At least 1 slide is required!");
      return;
    }
    setFormData((prev) => {
      const newSlides = prev.slides.filter((_, i) => i !== index);
      return { ...prev, slides: newSlides };
    });
    setCurrentSlideIdx(0);
    toast.success("Slide removed.");
  };

  const handleImageUpload = (index, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      toast.error("Image file size must be less than 4MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      handleSlideChange(index, "image", reader.result);
      toast.success(`Image uploaded for Slide ${index + 1}`);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await updateHomepageContent(formData);
      if (res.success) {
        toast.success("Homepage carousel banners & content updated successfully!");
      } else {
        toast.error(res.error || "Failed to update content");
      }
    });
  };

  const activeSlide = formData.slides[currentSlideIdx] || formData.slides[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* FORM & CAROUSEL SLIDE EDITOR */}
      <div className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* HEADER SAVE ACTION */}
          <Card className="border-slate-200/80 shadow-sm rounded-3xl bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Layout className="w-4 h-4 text-blue-600" /> Homepage Carousel & Banners
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage up to 5 auto-swiping banner slides with custom images and text.
                </p>
              </div>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs gap-2 font-bold shadow-md"
              >
                {isPending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Changes
              </Button>
            </div>
          </Card>

          {/* ANNOUNCEMENT BAR */}
          <Card className="border-slate-200/80 shadow-sm rounded-3xl bg-white p-6 space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-amber-600" /> Top Announcement Bar
              </Label>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-500 font-medium">
                  {formData.isAnnounceActive ? "Active" : "Disabled"}
                </span>
                <button
                  type="button"
                  onClick={() => handleChange("isAnnounceActive", !formData.isAnnounceActive)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.isAnnounceActive ? "bg-amber-500" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.isAnnounceActive ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            <Input
              value={formData.announcement}
              onChange={(e) => handleChange("announcement", e.target.value)}
              placeholder="e.g. 🔥 Special Offer: Free Home Delivery on All Verified Vehicles!"
              className="text-xs rounded-xl bg-slate-50"
            />
          </Card>

          {/* SLIDES MANAGER (UP TO 5 SLIDES) */}
          <Card className="border-slate-200/80 shadow-sm rounded-3xl bg-white p-6 space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-indigo-600" /> Hero Carousel Banners (
                  {formData.slides.length}/5)
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Each slide can have its own banner image, custom text, and button link.
                </p>
              </div>

              {formData.slides.length < 5 && (
                <Button
                  type="button"
                  onClick={handleAddSlide}
                  variant="outline"
                  className="text-xs rounded-xl border-indigo-200 text-indigo-700 hover:bg-indigo-50 gap-1.5 font-bold"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Slide
                </Button>
              )}
            </div>

            {/* SLIDE ITEMS EDITORS */}
            <div className="space-y-6">
              {formData.slides.map((slide, idx) => (
                <div
                  key={slide.id || idx}
                  className={`p-4 rounded-2xl border transition-all ${
                    currentSlideIdx === idx
                      ? "border-blue-500 bg-blue-50/20 ring-2 ring-blue-500/20"
                      : "border-slate-200 bg-slate-50/50"
                  }`}
                  onClick={() => setCurrentSlideIdx(idx)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline" className="bg-white text-slate-800 font-bold text-[11px]">
                      Slide {idx + 1}
                    </Badge>
                    <div className="flex items-center gap-2">
                      {formData.slides.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSlide(idx);
                          }}
                          className="h-7 text-xs text-rose-600 hover:bg-rose-50 rounded-lg gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Remove
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {/* IMAGE PREVIEW & UPLOAD */}
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-bold text-slate-700">
                        Banner Image (Upload or URL)
                      </Label>
                      <div className="flex items-center gap-3">
                        <div className="h-16 w-28 relative rounded-xl bg-slate-200 overflow-hidden border border-slate-300 flex-shrink-0">
                          {slide.image ? (
                            <Image src={slide.image} alt="Banner" fill unoptimized className="object-cover" />
                          ) : (
                            <ImageIcon className="w-6 h-6 m-auto text-slate-400" />
                          )}
                        </div>
                        <div className="flex-1 space-y-2">
                          <Input
                            value={slide.image || ""}
                            onChange={(e) => handleSlideChange(idx, "image", e.target.value)}
                            placeholder="https://images.unsplash.com/..."
                            className="text-xs rounded-xl bg-white"
                          />
                          <div className="relative">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(idx, e)}
                              className="hidden"
                              id={`file-upload-${idx}`}
                            />
                            <Label
                              htmlFor={`file-upload-${idx}`}
                              className="cursor-pointer inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
                            >
                              <Upload className="w-3 h-3" /> Upload Image File
                            </Label>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* TITLE */}
                    <div className="space-y-1">
                      <Label className="text-[11px] font-bold text-slate-700">Slide Main Title</Label>
                      <Input
                        value={slide.title || ""}
                        onChange={(e) => handleSlideChange(idx, "title", e.target.value)}
                        placeholder="Banner title..."
                        className="text-xs rounded-xl bg-white"
                      />
                    </div>

                    {/* SUBTITLE */}
                    <div className="space-y-1">
                      <Label className="text-[11px] font-bold text-slate-700">Slide Subtitle / Subtext</Label>
                      <Input
                        value={slide.subtitle || ""}
                        onChange={(e) => handleSlideChange(idx, "subtitle", e.target.value)}
                        placeholder="Banner subtitle..."
                        className="text-xs rounded-xl bg-white"
                      />
                    </div>

                    {/* CTA TEXT & LINK */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label className="text-[11px] font-bold text-slate-700">Button Text</Label>
                        <Input
                          value={slide.ctaText || ""}
                          onChange={(e) => handleSlideChange(idx, "ctaText", e.target.value)}
                          placeholder="e.g. Explore Showroom"
                          className="text-xs rounded-xl bg-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[11px] font-bold text-slate-700">Button Link</Label>
                        <Input
                          value={slide.ctaLink || ""}
                          onChange={(e) => handleSlideChange(idx, "ctaLink", e.target.value)}
                          placeholder="e.g. /cars"
                          className="text-xs rounded-xl bg-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* BOTTOM PROMO BANNER */}
          <Card className="border-slate-200/80 shadow-sm rounded-3xl bg-white p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Bottom Call-to-Action Banner
            </h3>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">Promo Heading</Label>
              <Input
                value={formData.promoHeading}
                onChange={(e) => handleChange("promoHeading", e.target.value)}
                placeholder="Ready to find your dream car?"
                className="text-xs rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">Promo Subtext</Label>
              <Textarea
                value={formData.promoSubtext}
                onChange={(e) => handleChange("promoSubtext", e.target.value)}
                placeholder="Join thousands of satisfied customers..."
                className="text-xs rounded-xl min-h-[70px]"
              />
            </div>
          </Card>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs gap-2 font-bold py-3 shadow-lg shadow-blue-600/20"
          >
            {isPending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save & Publish All Banners
          </Button>
        </form>
      </div>

      {/* AUTO-SWIPING LIVE PREVIEW PANEL */}
      <div className="space-y-6 lg:sticky lg:top-8 self-start">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Eye className="w-4 h-4 text-blue-600" /> Auto-Swiping Live Hero Preview
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500 font-medium">Auto-swipe (4s)</span>
            <button
              type="button"
              onClick={() => setAutoPlay(!autoPlay)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                autoPlay ? "bg-emerald-500" : "bg-slate-300"
              }`}
            >
              <span
                className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                  autoPlay ? "translate-x-5" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        {/* ANNOUNCEMENT BAR PREVIEW */}
        {formData.isAnnounceActive && (
          <div className="bg-amber-500 text-white text-xs font-bold px-4 py-2 rounded-xl text-center shadow-md animate-pulse">
            {formData.announcement || "Announcement text..."}
          </div>
        )}

        {/* CAROUSEL PREVIEW DISPLAY */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl h-96 border border-slate-800 bg-slate-950 text-white flex items-center justify-center text-center p-8 group">
          {/* CAROUSEL BACKGROUND IMAGE WITH GRADIENT OVERLAY */}
          {activeSlide?.image && (
            <Image
              key={activeSlide.id || currentSlideIdx}
              src={activeSlide.image}
              alt="Slide"
              fill
              unoptimized
              className="object-cover transition-opacity duration-700 opacity-60 group-hover:scale-105 transition-transform"
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* SLIDE CONTENT PREVIEW */}
          <div className="relative z-10 space-y-4 max-w-md mx-auto">
            <Badge className="bg-blue-600/80 text-white border-blue-400/40 text-xs px-3 py-1 font-bold">
              Slide {currentSlideIdx + 1} of {formData.slides.length}
            </Badge>

            <h1 className="text-2xl md:text-3xl font-black tracking-tight leading-tight drop-shadow-md">
              {activeSlide?.title || "Slide Title Preview"}
            </h1>

            <p className="text-slate-200 text-xs leading-relaxed drop-shadow">
              {activeSlide?.subtitle || "Slide Subtitle Preview"}
            </p>

            <div className="pt-2">
              <Button className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold px-6 shadow-lg shadow-blue-600/40">
                {activeSlide?.ctaText || "Explore Inventory"} →
              </Button>
            </div>
          </div>

          {/* LEFT & RIGHT ARROWS */}
          {formData.slides.length > 1 && (
            <>
              <button
                type="button"
                onClick={() =>
                  setCurrentSlideIdx(
                    (prev) => (prev - 1 + formData.slides.length) % formData.slides.length
                  )
                }
                className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center z-20 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() =>
                  setCurrentSlideIdx((prev) => (prev + 1) % formData.slides.length)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center z-20 transition-all"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}

          {/* DOT INDICATORS */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
            {formData.slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentSlideIdx(i)}
                className={`h-2 rounded-full transition-all ${
                  currentSlideIdx === i ? "w-6 bg-blue-500" : "w-2 bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>

        {/* BOTTOM PROMO BANNER PREVIEW */}
        <div className="bg-blue-600 text-white p-6 rounded-3xl text-center space-y-2 shadow-lg">
          <h2 className="text-lg font-bold">{formData.promoHeading}</h2>
          <p className="text-blue-100 text-xs max-w-sm mx-auto">{formData.promoSubtext}</p>
        </div>
      </div>
    </div>
  );
}
