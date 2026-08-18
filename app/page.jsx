import { getFeaturedCars } from "@/action/cars";
import { getHomepageContent } from "@/action/content";
import { getFeaturedTestimonials } from "@/action/testimonials";
import CarCard from "@/components/Car-Card";
import HomeHeroCarousel from "@/components/Home-Hero-Carousel";
import TestimonialsCarousel from "@/components/Testimonials-Carousel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { bodyTypes, carMakes, faqItems, featuredCars } from "@/lib/data";
import { SignedOut } from "@clerk/nextjs";
import {
  ArrowRight,
  Award,
  Calendar,
  Car,
  CheckCircle2,
  ChevronRight,
  Headphones,
  Megaphone,
  Quote,
  ShieldCheck,
  Smile,
  Sparkles,
  Star,
  Tag,
  User,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const revalidate = 60; // Refresh home page every 60s

export default async function Home() {
  const [featuredRes, contentRes, testimonialsRes] = await Promise.all([
    getFeaturedCars(),
    getHomepageContent(),
    getFeaturedTestimonials(),
  ]);

  const content = contentRes.success && contentRes.content ? contentRes.content : null;
  const testimonials = testimonialsRes.success ? testimonialsRes.testimonials : [];

  let cars = featuredRes.success && featuredRes.cars.length > 0
    ? featuredRes.cars
    : featuredCars;

  const makesData = [
    { name: "Toyota", image: "/toyota.jpg" },
    { name: "Honda", image: "/Honda.svg.webp" },
    { name: "BMW", image: "/bmw-logo.jpg" },
    { name: "Mercedes-Benz", image: "/mbenz.png" },
    { name: "Audi", image: "/audi-logo-2.png" },
    { name: "Ford", image: "/ford.png" },
    { name: "Lexus", image: "/lexus.png" },
    { name: "Porsche", image: "/porche.png" },
  ];

  const bodyTypesData = [
    { name: "SUV", count: "100+ Cars", image: "/suv.webp" },
    { name: "Sedan", count: "120+ Cars", image: "/sedan.webp" },
    { name: "Hatchback", count: "80+ Cars", image: "/hatchback.webp" },
    { name: "Convertible", count: "60+ Cars", image: "/convertible.webp" },
  ];

  return (
    <div className="pt-0 flex flex-col min-h-screen bg-slate-50/50">
      {/* SITE-WIDE ANNOUNCEMENT NOTIFICATION BAR — sits flush below the fixed 72px floating navbar */}
      <div className="mt-[72px] bg-blue-600 text-white text-xs md:text-sm font-extrabold py-2.5 px-4 text-center flex items-center justify-center gap-2 relative z-30 cursor-pointer hover:bg-blue-700 transition-colors">
        <span className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-blue-200 flex-shrink-0" />
          <span>{content?.announcement || "Special Offer: Free Home Delivery on All Verified Vehicles!"}</span>
        </span>
        <ChevronRight className="w-3.5 h-3.5 text-blue-200 flex-shrink-0" />
      </div>

      {/* HERO AUTO-SWIPING CAROUSEL WITH FLOATING MULTI-FIELD SEARCH */}
      <HomeHeroCarousel
        slides={content?.slides}
        defaultTitle={content?.heroTitle}
        defaultSubtitle={content?.heroSubtitle}
      />

      {/* FEATURED VEHICLES SECTION */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <p className="text-xs font-extrabold text-blue-600 uppercase tracking-widest mb-1">
                FEATURED VEHICLES
              </p>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                Featured Vehicles
              </h2>
            </div>
            <Button
              variant="ghost"
              className="flex items-center text-slate-700 hover:text-blue-600 font-bold text-xs w-fit gap-1"
              asChild
            >
              <Link href="/cars">
                View all vehicles <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
              </Link>
            </Button>
          </div>

          {/* 4-COLUMN CARDS GRID MATCHING REFERENCE IMAGE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cars.slice(0, 4).map((car) => {
              return <CarCard key={car.id} car={car} />;
            })}
          </div>
        </div>
      </section>

      {/* EXPLORE BY BRAND */}
      <section className="py-16 bg-slate-50/80 border-b border-slate-100">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex justify-between items-end mb-10">
            <div>
              <p className="text-xs font-extrabold text-blue-600 uppercase tracking-widest mb-1">
                EXPLORE BY BRAND
              </p>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                Explore by Brand
              </h2>
            </div>
            <Button variant="ghost" className="flex items-center font-bold text-xs text-slate-700 hover:text-blue-600 gap-1" asChild>
              <Link href="/cars">
                View all brands <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {makesData.map((make) => {
              return (
                <Link
                  key={make.name}
                  href={`/cars?make=${encodeURIComponent(make.name)}`}
                  className="bg-white rounded-2xl border border-slate-200/80 p-4 text-center hover:shadow-xl hover:border-blue-500 transition-all duration-300 group cursor-pointer flex flex-col items-center justify-center space-y-2.5 min-h-[110px]"
                >
                  <div className="h-11 w-11 relative group-hover:scale-110 transition-transform flex items-center justify-center">
                    <Image
                      src={make.image}
                      alt={`${make.name} logo`}
                      fill
                      unoptimized
                      style={{ objectFit: "contain" }}
                      className="transition-transform"
                    />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {make.name}
                    </h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE VEHIQL? */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-left mb-10">
            <p className="text-xs font-extrabold text-blue-600 uppercase tracking-widest mb-1">
              WHY CHOOSE VEHIQL?
            </p>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              Why Choose Vehiql?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border border-slate-200/80 shadow-sm rounded-3xl p-6 bg-white hover:shadow-lg transition-all space-y-3">
              <div className="bg-blue-50 text-blue-600 rounded-2xl w-12 h-12 flex items-center justify-center">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Verified Vehicles</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                All cars are inspected and verified for quality and performance.
              </p>
            </Card>

            <Card className="border border-slate-200/80 shadow-sm rounded-3xl p-6 bg-white hover:shadow-lg transition-all space-y-3">
              <div className="bg-indigo-50 text-indigo-600 rounded-2xl w-12 h-12 flex items-center justify-center">
                <Tag className="h-6 w-6" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Best Price Guarantee</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                We offer competitive prices with no hidden charges.
              </p>
            </Card>

            <Card className="border border-slate-200/80 shadow-sm rounded-3xl p-6 bg-white hover:shadow-lg transition-all space-y-3">
              <div className="bg-emerald-50 text-emerald-600 rounded-2xl w-12 h-12 flex items-center justify-center">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Secure Transactions</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Safe and secure buying process with expert support.
              </p>
            </Card>

            <Card className="border border-slate-200/80 shadow-sm rounded-3xl p-6 bg-white hover:shadow-lg transition-all space-y-3">
              <div className="bg-purple-50 text-purple-600 rounded-2xl w-12 h-12 flex items-center justify-center">
                <Headphones className="h-6 w-6" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">24/7 Customer Support</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Our team is always here to help you find the right car.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* BROWSE BY BODY TYPE */}
      <section className="py-16 bg-slate-50/80 border-b border-slate-100">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex justify-between items-end mb-10">
            <div>
              <p className="text-xs font-extrabold text-blue-600 uppercase tracking-widest mb-1">
                BROWSE BY BODY TYPE
              </p>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                Browse by Body Type
              </h2>
            </div>
            <Button variant="ghost" className="flex items-center font-bold text-xs text-slate-700 hover:text-blue-600 gap-1" asChild>
              <Link href="/cars">
                View all types <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {bodyTypesData.map((type) => {
              return (
                <Link
                  key={type.name}
                  href={`/cars?bodyType=${encodeURIComponent(type.name)}`}
                  className="bg-white rounded-3xl border border-slate-200/80 p-5 text-center hover:shadow-xl hover:border-blue-500 transition-all duration-300 group cursor-pointer flex flex-col justify-between h-44"
                >
                  <div className="h-24 w-full relative group-hover:scale-105 transition-transform flex items-center justify-center">
                    <Image
                      src={type.image}
                      alt={`${type.name} body style`}
                      fill
                      unoptimized
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                  <div className="pt-2">
                    <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {type.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-medium">{type.count}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* METRICS & ACHIEVEMENTS SHOWCASE BANNER */}
      <section className="py-14 bg-slate-950 text-white relative overflow-hidden border-y border-slate-900">
        <div className="container mx-auto px-4 max-w-6xl grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative z-10">
          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-1">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-white">2,500+</h3>
            <p className="text-xs text-slate-400 font-semibold">Happy Customers</p>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-1">
              <Car className="w-6 h-6" />
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-white">1,200+</h3>
            <p className="text-xs text-slate-400 font-semibold">Premium Cars</p>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-1">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-white">50+</h3>
            <p className="text-xs text-slate-400 font-semibold">Car Brands</p>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-1">
              <Smile className="w-6 h-6" />
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-blue-400">98%</h3>
            <p className="text-xs text-slate-400 font-semibold">Satisfaction Rate</p>
          </div>
        </div>
      </section>

      {/* DUAL-COLUMN SECTION: FREQUENTLY ASKED QUESTIONS & WHAT OUR CUSTOMERS SAY */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* LEFT COLUMN: FAQ */}
            <div className="space-y-6">
              <div>
                <p className="text-xs font-extrabold text-blue-600 uppercase tracking-widest mb-1">
                  FREQUENTLY ASKED QUESTIONS
                </p>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  Frequently Asked Questions
                </h2>
              </div>

              <Accordion type="single" collapsible className="w-full space-y-3">
                {faqItems.map((faq, index) => {
                  return (
                    <AccordionItem
                      key={index}
                      value={`item-${index}`}
                      className="bg-slate-50/70 border border-slate-200/80 rounded-2xl px-5 shadow-sm"
                    >
                      <AccordionTrigger className="text-xs md:text-sm font-bold text-slate-900 hover:no-underline py-4 text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-xs text-slate-600 pb-4 leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </div>

            {/* RIGHT COLUMN: TESTIMONIALS */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-extrabold text-blue-600 uppercase tracking-widest mb-1">
                    WHAT OUR CUSTOMERS SAY
                  </p>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                    What Our Customers Say
                  </h2>
                </div>
                <Button variant="ghost" className="flex items-center font-bold text-xs text-slate-700 hover:text-blue-600 gap-1" asChild>
                  <Link href="/blogs">
                    View all reviews <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
                  </Link>
                </Button>
              </div>

              <TestimonialsCarousel testimonials={testimonials} />
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM PROMO CTA BANNER */}
      <section className="relative overflow-hidden bg-[#031338] text-white py-16 md:py-24 border-t border-blue-950">
        {/* FULL-WIDTH BACKGROUND IMAGE WITH ULTRA-SMOOTH GRADIENT BLEND */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <Image
            src="/promo-banner.jpg"
            alt="Luxury vehicle showcase"
            fill
            priority
            unoptimized
            className="object-cover object-right md:object-[80%_center]"
          />
          {/* MULTI-STOP SEAMLESS HORIZONTAL GRADIENT - ZERO HARD EDGES */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#031338] via-[#031338] via-35% via-[#031338]/70 via-60% to-transparent to-90% z-10" />
          {/* SUBTLE VERTICAL AMBIENT VIGNETTES */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#031338]/40 via-transparent to-[#031338]/60 z-10" />
        </div>

        {/* LEFT-ALIGNED TEXT CONTENT */}
        <div className="container mx-auto px-4 max-w-6xl relative z-20">
          <div className="max-w-xl space-y-4 text-left">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight drop-shadow-md">
              {content?.promoHeading || "Ready to find your dream car?"}
            </h2>
            <p className="text-sm md:text-base text-blue-100/90 font-medium leading-relaxed drop-shadow max-w-lg">
              {content?.promoSubtext || "Join thousands of satisfied customers who found their perfect vehicle through our platform"}
            </p>
            <div className="pt-2">
              <Button
                size="lg"
                className="bg-white text-blue-700 hover:bg-slate-100 hover:text-blue-800 rounded-full font-extrabold px-8 py-6 text-xs md:text-sm shadow-2xl gap-2 hover:scale-105 transition-all inline-flex items-center"
                asChild
              >
                <Link href="/cars">
                  <span>Browse Cars Now</span>
                  <ArrowRight className="w-4 h-4 text-blue-700" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
