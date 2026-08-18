import { getCars } from "@/action/cars";
import CarCard from "@/components/Car-Card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { featuredCars } from "@/lib/data";
import {
  ArrowRight,
  Car,
  ChevronLeft,
  ChevronRight,
  Filter,
  Gauge,
  Search,
  Settings,
  Sparkles,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export const metadata = {
  title: "Explore All Vehicles | Vehiql AI Showroom",
  description:
    "Browse verified cars, filter by make, body type, fuel, price range, and book an instant test drive online.",
};

export default async function PublicCarsPage({ searchParams }) {
  const params = await searchParams;
  const search = params?.search || "";
  const selectedMake = params?.make || "ALL";
  const selectedBodyType = params?.bodyType || "ALL";
  const selectedFuelType = params?.fuelType || "ALL";
  const selectedTransmission = params?.transmission || "ALL";
  const selectedPriceRange = params?.priceRange || "ALL";
  const selectedSortBy = params?.sortBy || "newest";
  const currentPage = parseInt(params?.page || "1", 10);
  const limit = 9;

  const res = await getCars({
    search,
    make: selectedMake,
    bodyType: selectedBodyType,
    fuelType: selectedFuelType,
    transmission: selectedTransmission,
    priceRange: selectedPriceRange,
    sortBy: selectedSortBy,
    page: currentPage,
    limit,
  });

  let cars = res.success ? res.cars : [];
  let total = res.total || 0;
  let totalPages = res.totalPages || 1;

  if (
    cars.length === 0 &&
    !search &&
    selectedMake === "ALL" &&
    selectedBodyType === "ALL" &&
    selectedPriceRange === "ALL"
  ) {
    cars = featuredCars;
    total = featuredCars.length;
    totalPages = 1;
  }

  const hasActiveFilters =
    search !== "" ||
    selectedMake !== "ALL" ||
    selectedBodyType !== "ALL" ||
    selectedFuelType !== "ALL" ||
    selectedTransmission !== "ALL" ||
    selectedPriceRange !== "ALL";

  const createFilterUrl = (overrides = {}) => {
    const p = new URLSearchParams();
    const currentObj = {
      search,
      make: selectedMake,
      bodyType: selectedBodyType,
      fuelType: selectedFuelType,
      transmission: selectedTransmission,
      priceRange: selectedPriceRange,
      sortBy: selectedSortBy,
      page: currentPage,
      ...overrides,
    };
    Object.entries(currentObj).forEach(([key, val]) => {
      if (val && val !== "ALL" && val !== 1 && val !== "newest" && val !== "") {
        p.append(key, val);
      }
    });
    return `/cars?${p.toString()}`;
  };

  return (
    <div className="min-h-screen bg-slate-50/60">
      {/* ── FULL-BLEED TOP HERO SECTION BEHIND NAVBAR ──────────── */}
      <div className="relative overflow-hidden bg-[#030a18] text-white pt-28 sm:pt-32 md:pt-36 pb-20 md:pb-28 border-b border-slate-900/60 shadow-xl">
        {/* BACKGROUND LUXURY SPORTS CAR ON RIGHT */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <Image
            src="/cars-header.jpg"
            alt="Showroom header car"
            fill
            priority
            unoptimized
            className="object-cover object-right md:object-[80%_center] opacity-85 lg:opacity-95"
          />
          {/* SMOOTH HORIZONTAL GRADIENT BLEND TO SOLID DARK NAVY ON LEFT */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#030a18] via-[#030a18] via-35% via-[#030a18]/75 via-60% to-transparent to-95% z-10" />
          {/* AMBIENT LIGHTING VIGNETTES */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#030a18]/70 via-transparent to-[#030a18]/80 z-10" />
        </div>

        {/* HERO TEXT CONTENT */}
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="max-w-xl space-y-3.5 text-left">
            <div className="inline-flex items-center gap-1.5 bg-slate-800/90 border border-slate-700/80 text-slate-300 px-3.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider backdrop-blur-sm shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>SHOWROOM INVENTORY</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-white drop-shadow-md">
              Explore All Vehicles{" "}
              <span className="text-blue-500">({total})</span>
            </h1>

            <p className="text-slate-300 text-xs md:text-sm font-medium leading-relaxed max-w-md drop-shadow">
              Browse our verified luxury cars, electric vehicles, and supercars.
              Filter by make, body type, transmission, or price range to find
              your perfect ride.
            </p>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT CONTAINER WITH FLOATING FILTER CARD ── */}
      <div className="container mx-auto px-4 max-w-6xl -mt-8 md:-mt-10 relative z-20 space-y-8 pb-20">

        {/* ── FILTER TOOLBAR CARD ─────────────────────────────── */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 space-y-4">
          <form method="GET" action="/cars">
            {/* TOP ROW: search + sort + filter button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 border-b border-slate-100">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <Input
                  name="search"
                  defaultValue={search}
                  placeholder="Search make, model, year, color, or keyword..."
                  className="pl-10 h-11 text-xs bg-slate-50 border-slate-200 rounded-xl focus-visible:ring-blue-500 w-full"
                />
              </div>

              {/* Sort By */}
              <Select name="sortBy" defaultValue={selectedSortBy}>
                <SelectTrigger className="h-11 text-xs rounded-xl bg-slate-50 border-slate-200 w-full sm:w-48">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Recently Added</SelectItem>
                  <SelectItem value="price_asc">Price: Low to High</SelectItem>
                  <SelectItem value="price_desc">Price: High to Low</SelectItem>
                  <SelectItem value="year_desc">Model Year: Newest</SelectItem>
                  <SelectItem value="mileage_asc">Mileage: Lowest</SelectItem>
                </SelectContent>
              </Select>

              {/* Filter submit */}
              <Button
                type="submit"
                className="h-11 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold px-6 gap-2 shadow-md shadow-blue-600/20 flex-shrink-0"
              >
                <Filter className="w-4 h-4" />
                Filter
              </Button>
            </div>

            {/* BOTTOM ROW: detail filters */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4">
              {/* MAKE */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Make</label>
                <Select name="make" defaultValue={selectedMake}>
                  <SelectTrigger className="h-10 text-xs rounded-xl bg-white border-slate-200">
                    <SelectValue placeholder="All Makes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Makes</SelectItem>
                    <SelectItem value="Toyota">Toyota</SelectItem>
                    <SelectItem value="BMW">BMW</SelectItem>
                    <SelectItem value="Mercedes-Benz">Mercedes-Benz</SelectItem>
                    <SelectItem value="Honda">Honda</SelectItem>
                    <SelectItem value="Audi">Audi</SelectItem>
                    <SelectItem value="Tesla">Tesla</SelectItem>
                    <SelectItem value="Hyundai">Hyundai</SelectItem>
                    <SelectItem value="Ford">Ford</SelectItem>
                    <SelectItem value="Porsche">Porsche</SelectItem>
                    <SelectItem value="Nissan">Nissan</SelectItem>
                    <SelectItem value="Range Rover">Range Rover</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* BODY TYPE */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Body Type</label>
                <Select name="bodyType" defaultValue={selectedBodyType}>
                  <SelectTrigger className="h-10 text-xs rounded-xl bg-white border-slate-200">
                    <SelectValue placeholder="All Body Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Body Types</SelectItem>
                    <SelectItem value="SUV">SUV</SelectItem>
                    <SelectItem value="Sedan">Sedan</SelectItem>
                    <SelectItem value="Hatchback">Hatchback</SelectItem>
                    <SelectItem value="Coupe">Coupe</SelectItem>
                    <SelectItem value="Convertible">Convertible</SelectItem>
                    <SelectItem value="Truck">Truck</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* PRICE RANGE */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Price Range</label>
                <Select name="priceRange" defaultValue={selectedPriceRange}>
                  <SelectTrigger className="h-10 text-xs rounded-xl bg-white border-slate-200">
                    <SelectValue placeholder="Any Price" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Any Price</SelectItem>
                    <SelectItem value="under_20k">Under $20,000</SelectItem>
                    <SelectItem value="20k_50k">$20,000 – $50,000</SelectItem>
                    <SelectItem value="50k_100k">$50,000 – $100,000</SelectItem>
                    <SelectItem value="above_100k">Above $100,000</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* FUEL TYPE */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Fuel Type</label>
                <Select name="fuelType" defaultValue={selectedFuelType}>
                  <SelectTrigger className="h-10 text-xs rounded-xl bg-white border-slate-200">
                    <SelectValue placeholder="All Fuel Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Fuel Types</SelectItem>
                    <SelectItem value="Electric">Electric</SelectItem>
                    <SelectItem value="Gasoline">Gasoline</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                    <SelectItem value="Diesel">Diesel</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* TRANSMISSION */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Transmission</label>
                <Select name="transmission" defaultValue={selectedTransmission}>
                  <SelectTrigger className="h-10 text-xs rounded-xl bg-white border-slate-200">
                    <SelectValue placeholder="All Transmissions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Transmissions</SelectItem>
                    <SelectItem value="Automatic">Automatic</SelectItem>
                    <SelectItem value="Manual">Manual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </form>

          {/* ACTIVE FILTER CHIPS */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 px-4 pb-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active:</span>
              {search && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-[11px] gap-1 px-2.5 py-1 rounded-full">
                  &ldquo;{search}&rdquo;
                  <Link href={createFilterUrl({ search: "" })}><X className="w-3 h-3 hover:text-blue-900" /></Link>
                </Badge>
              )}
              {selectedMake !== "ALL" && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-[11px] gap-1 px-2.5 py-1 rounded-full">
                  {selectedMake}
                  <Link href={createFilterUrl({ make: "ALL" })}><X className="w-3 h-3 hover:text-blue-900" /></Link>
                </Badge>
              )}
              {selectedBodyType !== "ALL" && (
                <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 text-[11px] gap-1 px-2.5 py-1 rounded-full">
                  {selectedBodyType}
                  <Link href={createFilterUrl({ bodyType: "ALL" })}><X className="w-3 h-3" /></Link>
                </Badge>
              )}
              {selectedPriceRange !== "ALL" && (
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[11px] gap-1 px-2.5 py-1 rounded-full">
                  {selectedPriceRange.replace(/_/g, " ")}
                  <Link href={createFilterUrl({ priceRange: "ALL" })}><X className="w-3 h-3" /></Link>
                </Badge>
              )}
              {selectedFuelType !== "ALL" && (
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-[11px] gap-1 px-2.5 py-1 rounded-full">
                  {selectedFuelType}
                  <Link href={createFilterUrl({ fuelType: "ALL" })}><X className="w-3 h-3" /></Link>
                </Badge>
              )}
              {selectedTransmission !== "ALL" && (
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-[11px] gap-1 px-2.5 py-1 rounded-full">
                  {selectedTransmission}
                  <Link href={createFilterUrl({ transmission: "ALL" })}><X className="w-3 h-3" /></Link>
                </Badge>
              )}
              <Link href="/cars" className="text-[11px] text-rose-600 font-bold hover:underline ml-1">
                Clear All
              </Link>
            </div>
          )}
        </div>

        {/* ── RESULTS HEADER ─────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base md:text-lg font-black text-slate-900">
              Showing Results ({total} Vehicles Found)
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
              Page {currentPage} of {totalPages}
            </p>
          </div>
        </div>

        {/* ── CARS LIST ──────────────────────────────────────── */}
        {cars.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center border border-slate-200/80 shadow-sm space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
              <Car className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">No matching cars found</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Try adjusting your make, body type, or search keywords.
              </p>
            </div>
            <Button asChild className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold">
              <Link href="/cars">Reset All Filters</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {cars.map((car) => {
              const formattedPrice = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0,
              }).format(car.price);
              const formattedMileage = new Intl.NumberFormat("en-US").format(car.mileage || 0);
              const carImage = Array.isArray(car.image) ? car.image[0] : car.image;

              return (
                <div
                  key={car.id}
                  className="bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col sm:flex-row group"
                >
                  {/* CAR IMAGE */}
                  <div className="relative w-full sm:w-72 md:w-80 h-52 sm:h-auto flex-shrink-0 overflow-hidden bg-slate-100">
                    {carImage ? (
                      <Image
                        src={carImage}
                        alt={`${car.make} ${car.model}`}
                        fill
                        unoptimized
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-100">
                        <Car className="w-16 h-16 text-slate-300" />
                      </div>
                    )}
                    {/* FEATURED BADGE */}
                    {car.featured && (
                      <span className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wide shadow">
                        Featured
                      </span>
                    )}
                  </div>

                  {/* CAR DETAILS */}
                  <div className="flex flex-col justify-between p-5 flex-1 gap-3">
                    <div className="space-y-1">
                      {/* TITLE ROW */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-base md:text-lg font-black text-slate-900 leading-tight">
                            {car.make} {car.model}
                          </h3>
                          <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                            {car.year}
                            {car.mileage ? ` • ${formattedMileage} km` : ""}
                            {car.fuelType ? ` • ${car.fuelType}` : ""}
                          </p>
                        </div>
                      </div>

                      {/* PRICE */}
                      <p className="text-xl md:text-2xl font-black text-blue-600 mt-1">
                        {formattedPrice}
                      </p>
                    </div>

                    {/* SPEC BADGES */}
                    <div className="flex flex-wrap items-center gap-2">
                      {car.transmission && (
                        <span className="flex items-center gap-1.5 bg-slate-100 text-slate-700 text-[11px] font-semibold px-3 py-1.5 rounded-full">
                          <Settings className="w-3 h-3 text-blue-500" />
                          {car.transmission}
                        </span>
                      )}
                      {car.mileage && (
                        <span className="flex items-center gap-1.5 bg-slate-100 text-slate-700 text-[11px] font-semibold px-3 py-1.5 rounded-full">
                          <Gauge className="w-3 h-3 text-indigo-500" />
                          {formattedMileage} mi
                        </span>
                      )}
                      {car.color && (
                        <span className="flex items-center gap-1.5 bg-slate-100 text-slate-700 text-[11px] font-semibold px-3 py-1.5 rounded-full capitalize">
                          {car.color}
                        </span>
                      )}
                    </div>

                    {/* VIEW DETAILS LINK */}
                    <div>
                      <Link
                        href={`/cars/${car.id}`}
                        className="inline-flex items-center gap-1.5 text-xs font-black text-blue-600 hover:text-blue-700 group/link transition-colors"
                      >
                        View Details
                        <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── PAGINATION ─────────────────────────────────────── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4 pb-8">
            {currentPage > 1 ? (
              <Button variant="outline" asChild className="h-10 px-4 rounded-xl border-slate-200 text-xs font-bold gap-1">
                <Link href={createFilterUrl({ page: currentPage - 1 })}>
                  <ChevronLeft className="w-4 h-4" /> Previous
                </Link>
              </Button>
            ) : (
              <Button variant="outline" disabled className="h-10 px-4 rounded-xl border-slate-200 text-xs font-bold gap-1 opacity-40">
                <ChevronLeft className="w-4 h-4" /> Previous
              </Button>
            )}

            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => (
                <Link key={pNum} href={createFilterUrl({ page: pNum })}>
                  <Button
                    variant={currentPage === pNum ? "default" : "outline"}
                    className={`h-10 w-10 p-0 rounded-xl text-xs font-bold ${
                      currentPage === pNum
                        ? "bg-blue-600 text-white shadow-md"
                        : "border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {pNum}
                  </Button>
                </Link>
              ))}
            </div>

            {currentPage < totalPages ? (
              <Button variant="outline" asChild className="h-10 px-4 rounded-xl border-slate-200 text-xs font-bold gap-1">
                <Link href={createFilterUrl({ page: currentPage + 1 })}>
                  Next <ChevronRight className="w-4 h-4" />
                </Link>
              </Button>
            ) : (
              <Button variant="outline" disabled className="h-10 px-4 rounded-xl border-slate-200 text-xs font-bold gap-1 opacity-40">
                Next <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
