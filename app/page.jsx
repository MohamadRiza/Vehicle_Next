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
  ChevronRight,
  Headphones,
  Megaphone,
  Quote,
  ShieldCheck,
  Sparkles,
  Star,
  Tag,
  User,
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
    { name: "Toyota", count: "120+ Cars", image: "https://upload.wikimedia.org/wikipedia/commons/e/e7/Toyota.svg" },
    { name: "Honda", count: "85+ Cars", image: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Honda_Logo.svg" },
    { name: "BMW", count: "60+ Cars", image: "https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg" },
    { name: "Mercedes-Benz", count: "75+ Cars", image: "https://upload.wikimedia.org/wikipedia/commons/9/90/Mercedes-Logo.svg" },
    { name: "Audi", count: "50+ Cars", image: "https://upload.wikimedia.org/wikipedia/commons/9/92/Audi-Logo_2016.svg" },
    { name: "Ford", count: "45+ Cars", image: "https://upload.wikimedia.org/wikipedia/commons/a/a0/Ford_motor_company_logo.svg" },
    { name: "Lexus", count: "30+ Cars", image: "https://upload.wikimedia.org/wikipedia/commons/d/d1/Lexus_division_logo.svg" },
    { name: "Porsche", count: "25+ Cars", image: "https://upload.wikimedia.org/wikipedia/commons/8/8c/Porsche_logo.svg" },
  ];

  return (
    <div className="pt-20 flex flex-col min-h-screen bg-slate-50/50">
      {/* SITE-WIDE ANNOUNCEMENT NOTIFICATION BAR */}
      {content?.isAnnounceActive && content?.announcement && (
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white text-xs md:text-sm font-extrabold py-2.5 px-4 text-center shadow-md flex items-center justify-center gap-2">
          <Megaphone className="w-4 h-4 text-blue-200 flex-shrink-0 animate-pulse" />
          <span>{content.announcement}</span>
        </div>
      )}

      {/* HERO AUTO-SWIPING CAROUSEL WITH FLOATING MULTI-FIELD SEARCH */}
      <HomeHeroCarousel
        slides={content?.slides}
        defaultTitle={content?.heroTitle}
        defaultSubtitle={content?.heroSubtitle}
      />

      {/* FEATURED VEHICLES SECTION */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">
                FEATURED CARS
              </p>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                Featured Vehicles
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Handpicked premium cars just for you.
              </p>
            </div>
            <Button
              variant="ghost"
              className="flex items-center text-slate-700 hover:text-blue-600 font-bold text-xs w-fit gap-1"
              asChild
            >
              <Link href="/cars">
                View all vehicles <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cars.map((car) => {
              return <CarCard key={car.id} car={car} />;
            })}
          </div>
        </div>
      </section>

      {/* BROWSE BY MAKE */}
      <section className="py-16 bg-slate-50/80 border-b border-slate-100">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">
                BROWSE BY MAKE
              </p>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                Browse by Make
              </h2>
            </div>
            <Button variant="ghost" className="flex items-center font-bold text-xs text-slate-700 hover:text-blue-600 gap-1" asChild>
              <Link href="/cars">
                View all brands <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {makesData.map((make) => {
              return (
                <Link
                  key={make.name}
                  href={`/cars?make=${encodeURIComponent(make.name)}`}
                  className="bg-white rounded-2xl border border-slate-200/80 p-4 text-center hover:shadow-xl hover:border-blue-400 transition-all duration-300 group cursor-pointer flex flex-col items-center justify-center space-y-3"
                >
                  <div className="h-12 w-12 relative group-hover:scale-110 transition-transform flex items-center justify-center">
                    <Image
                      src={make.image}
                      alt={make.name}
                      fill
                      unoptimized
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {make.name}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-medium">{make.count}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE OUR PLATFORM? */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="container mx-auto px-4">
          <div className="text-left max-w-2xl mb-12">
            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">
              WHY CHOOSE US
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Why Choose Our Platform?
            </h2>
            <p className="text-slate-500 text-xs mt-1">
              Our commitment to your satisfaction sets us apart.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border border-slate-200/80 shadow-sm rounded-3xl p-6 bg-white hover:shadow-lg transition-all space-y-3">
              <div className="bg-blue-50 text-blue-600 rounded-2xl w-12 h-12 flex items-center justify-center">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Verified Vehicles</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                All cars are inspected and verified for quality and performance.
              </p>
            </Card>

            <Card className="border border-slate-200/80 shadow-sm rounded-3xl p-6 bg-white hover:shadow-lg transition-all space-y-3">
              <div className="bg-indigo-50 text-indigo-600 rounded-2xl w-12 h-12 flex items-center justify-center">
                <Tag className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Best Price Guarantee</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                We offer competitive prices with no hidden charges.
              </p>
            </Card>

            <Card className="border border-slate-200/80 shadow-sm rounded-3xl p-6 bg-white hover:shadow-lg transition-all space-y-3">
              <div className="bg-emerald-50 text-emerald-600 rounded-2xl w-12 h-12 flex items-center justify-center">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Secure Transactions</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Safe and secure buying process with expert support.
              </p>
            </Card>

            <Card className="border border-slate-200/80 shadow-sm rounded-3xl p-6 bg-white hover:shadow-lg transition-all space-y-3">
              <div className="bg-purple-50 text-purple-600 rounded-2xl w-12 h-12 flex items-center justify-center">
                <Headphones className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">24/7 Customer Support</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Our team is always here to help you find the right car.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* BROWSE BY BODY TYPE */}
      <section className="py-16 bg-slate-50/80 border-b border-slate-100">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">
                BROWSE BY BODY TYPE
              </p>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                Browse by Body Type
              </h2>
            </div>
            <Button variant="ghost" className="flex items-center font-bold text-xs text-slate-700 hover:text-blue-600 gap-1" asChild>
              <Link href="/cars">
                View all types <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
            {bodyTypes.map((type) => {
              return (
                <Link
                  key={type.name}
                  href={`/cars?bodyType=${encodeURIComponent(type.name)}`}
                  className="bg-white rounded-3xl border border-slate-200/80 p-5 text-center hover:shadow-xl hover:border-blue-400 transition-all duration-300 group cursor-pointer flex flex-col justify-between h-40"
                >
                  <div className="h-20 w-full relative group-hover:scale-105 transition-transform">
                    <Image
                      src={type.image}
                      alt={type.name}
                      fill
                      unoptimized
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {type.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-medium">100+ Cars</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* METRICS & ACHIEVEMENTS SHOWCASE BANNER */}
      <section className="py-12 bg-slate-950 text-white relative overflow-hidden">
        <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative z-10">
          <div className="space-y-1">
            <h3 className="text-3xl md:text-4xl font-black text-white">2,500+</h3>
            <p className="text-xs text-slate-400 font-semibold">Happy Customers</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl md:text-4xl font-black text-white">1,200+</h3>
            <p className="text-xs text-slate-400 font-semibold">Premium Cars</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl md:text-4xl font-black text-white">50+</h3>
            <p className="text-xs text-slate-400 font-semibold">Car Brands</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl md:text-4xl font-black text-blue-400">98%</h3>
            <p className="text-xs text-slate-400 font-semibold">Satisfaction Rate</p>
          </div>
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="mb-10 text-left">
            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">
              FAQ
            </p>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Find answers to common questions about buying cars.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-3">
            {faqItems.map((faq, index) => {
              return (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-slate-50/70 border border-slate-200/80 rounded-2xl px-5 shadow-sm"
                >
                  <AccordionTrigger className="text-sm font-bold text-slate-900 hover:no-underline py-4">
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
      </section>

      {/* WHAT OUR CUSTOMERS SAY (TESTIMONIALS WITH CUSTOMER AVATAR PHOTOS) */}
      <section className="py-16 bg-slate-50/80 border-b border-slate-100">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-xl mx-auto mb-12">
            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">
              TESTIMONIALS
            </p>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              What Our Customers Say
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Real experiences from our valued customers
            </p>
          </div>

          <TestimonialsCarousel testimonials={testimonials} />
        </div>
      </section>

      {/* BOTTOM PROMO CTA BANNER */}
      <section className="py-20 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-950 text-white relative overflow-hidden">
        <div className="container mx-auto px-4 text-center max-w-3xl relative z-10 space-y-6">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight">
            {content?.promoHeading || "Ready to find your dream car?"}
          </h2>
          <p className="text-base md:text-lg text-blue-100/90 leading-relaxed">
            {content?.promoSubtext || "Explore our collection of premium vehicles and book a test drive today."}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
            <Button size="lg" className="bg-white text-blue-900 hover:bg-slate-100 rounded-2xl font-extrabold px-8 py-6 text-sm shadow-xl gap-2" asChild>
              <Link href="/cars">Browse Cars Now <ArrowRight className="w-4 h-4 text-blue-900" /></Link>
            </Button>
            <SignedOut>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-2xl font-bold px-8 py-6 text-sm" asChild>
                <Link href="/sign-up">Sign Up Now</Link>
              </Button>
            </SignedOut>
          </div>
        </div>
      </section>
    </div>
  );
}
