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
import { bodyTypes, carMakes, featuredCars } from "@/lib/data";
import {
  ArrowLeft,
  ArrowRight,
  Car,
  ChevronLeft,
  ChevronRight,
  Filter,
  Grid,
  ListFilter,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export const metadata = {
  title: "Browse All Cars | Vehicle AI Showroom",
  description: "Browse verified cars, filter by make, body type, fuel, price range, and book an instant test drive online.",
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

  // Fallback to sample data if database has no entries matching default query
  if (cars.length === 0 && !search && selectedMake === "ALL" && selectedBodyType === "ALL" && selectedPriceRange === "ALL") {
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

  // Helper to build URL params
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
    <div className="pt-24 pb-20 min-h-screen bg-slate-50/60">
      <div className="container mx-auto px-4 space-y-8 max-w-7xl">
        {/* HERO HEADER */}
        <div className="bg-gradient-to-r from-blue-950 via-indigo-900 to-slate-950 text-white rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center">
            <Car className="w-[500px] h-[500px] text-white" />
          </div>

          <div className="relative z-10 max-w-3xl space-y-3">
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30 px-3.5 py-1 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-300 inline" /> Showroom Inventory
            </Badge>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
              Explore All Vehicles ({total})
            </h1>
            <p className="text-blue-100/80 text-xs md:text-sm leading-relaxed max-w-xl">
              Browse our verified luxury cars, electric vehicles, and supercars. Filter by make, body type, transmission, or price range to find your perfect ride.
            </p>
          </div>
        </div>

        {/* COMPREHENSIVE FILTERS & SORTING TOOLBAR */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-6">
          <form method="GET" action="/cars" className="space-y-4">
            {/* TOP SEARCH & SORT ROW */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              {/* SEARCH INPUT */}
              <div className="md:col-span-6 relative">
                <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                <Input
                  name="search"
                  defaultValue={search}
                  placeholder="Search make, model, year, color, or keyword..."
                  className="pl-11 h-11 text-xs bg-slate-50/70 border-slate-200 rounded-2xl focus-visible:ring-blue-600"
                />
              </div>

              {/* SORT BY DROPDOWN */}
              <div className="md:col-span-4">
                <Select name="sortBy" defaultValue={selectedSortBy}>
                  <SelectTrigger className="h-11 text-xs rounded-2xl bg-slate-50/70 border-slate-200">
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
              </div>

              {/* SUBMIT BUTTON */}
              <div className="md:col-span-2 flex gap-2">
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white h-11 rounded-2xl text-xs font-bold gap-2 shadow-md shadow-blue-600/20"
                >
                  <Search className="w-4 h-4" /> Filter
                </Button>
              </div>
            </div>

            {/* DETAILED FILTER DROPDOWNS */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-2">
              {/* MAKE */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Make</label>
                <Select name="make" defaultValue={selectedMake}>
                  <SelectTrigger className="h-10 text-xs rounded-xl bg-slate-50/50 border-slate-200">
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
                  </SelectContent>
                </Select>
              </div>

              {/* BODY TYPE */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Body Type</label>
                <Select name="bodyType" defaultValue={selectedBodyType}>
                  <SelectTrigger className="h-10 text-xs rounded-xl bg-slate-50/50 border-slate-200">
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
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Price Range</label>
                <Select name="priceRange" defaultValue={selectedPriceRange}>
                  <SelectTrigger className="h-10 text-xs rounded-xl bg-slate-50/50 border-slate-200">
                    <SelectValue placeholder="Any Price" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Any Price</SelectItem>
                    <SelectItem value="under_20k">Under $20,000</SelectItem>
                    <SelectItem value="20k_50k">$20,000 - $50,000</SelectItem>
                    <SelectItem value="50k_100k">$50,000 - $100,000</SelectItem>
                    <SelectItem value="above_100k">Above $100,000</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* FUEL TYPE */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Fuel Type</label>
                <Select name="fuelType" defaultValue={selectedFuelType}>
                  <SelectTrigger className="h-10 text-xs rounded-xl bg-slate-50/50 border-slate-200">
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
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Transmission</label>
                <Select name="transmission" defaultValue={selectedTransmission}>
                  <SelectTrigger className="h-10 text-xs rounded-xl bg-slate-50/50 border-slate-200">
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

          {/* ACTIVE FILTER BADGES BAR */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-500 mr-1">Active Filters:</span>

              {search && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs gap-1 py-1 px-2.5 rounded-xl">
                  Search: "{search}"
                  <Link href={createFilterUrl({ search: "" })}>
                    <X className="w-3 h-3 hover:text-blue-900" />
                  </Link>
                </Badge>
              )}

              {selectedMake !== "ALL" && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs gap-1 py-1 px-2.5 rounded-xl">
                  Make: {selectedMake}
                  <Link href={createFilterUrl({ make: "ALL" })}>
                    <X className="w-3 h-3 hover:text-blue-900" />
                  </Link>
                </Badge>
              )}

              {selectedBodyType !== "ALL" && (
                <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 text-xs gap-1 py-1 px-2.5 rounded-xl">
                  Body: {selectedBodyType}
                  <Link href={createFilterUrl({ bodyType: "ALL" })}>
                    <X className="w-3 h-3 hover:text-indigo-900" />
                  </Link>
                </Badge>
              )}

              {selectedPriceRange !== "ALL" && (
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs gap-1 py-1 px-2.5 rounded-xl">
                  Price: {selectedPriceRange.replace("_", " ")}
                  <Link href={createFilterUrl({ priceRange: "ALL" })}>
                    <X className="w-3 h-3 hover:text-emerald-900" />
                  </Link>
                </Badge>
              )}

              {selectedFuelType !== "ALL" && (
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs gap-1 py-1 px-2.5 rounded-xl">
                  Fuel: {selectedFuelType}
                  <Link href={createFilterUrl({ fuelType: "ALL" })}>
                    <X className="w-3 h-3 hover:text-amber-900" />
                  </Link>
                </Badge>
              )}

              {selectedTransmission !== "ALL" && (
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-xs gap-1 py-1 px-2.5 rounded-xl">
                  Gearbox: {selectedTransmission}
                  <Link href={createFilterUrl({ transmission: "ALL" })}>
                    <X className="w-3 h-3 hover:text-purple-900" />
                  </Link>
                </Badge>
              )}

              <Link href="/cars" className="text-xs text-rose-600 font-bold hover:underline ml-2">
                Clear All Filters
              </Link>
            </div>
          )}
        </div>

        {/* RESULTS BAR */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Showing Results ({total} Vehicles Found)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Page {currentPage} of {totalPages}
            </p>
          </div>
        </div>

        {/* CARS GRID */}
        {cars.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200/80 shadow-sm space-y-4 max-w-lg mx-auto">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
              <Car className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">No matching cars found</h3>
              <p className="text-xs text-slate-500 mt-1">
                We couldn't find any vehicles matching your filter criteria. Try adjusting your make, body type, or search keywords.
              </p>
            </div>
            <Button asChild className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold">
              <Link href="/cars">Reset All Filters</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}

        {/* PAGINATION CONTROLS */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-6">
            {/* PREV PAGE BUTTON */}
            {currentPage > 1 ? (
              <Button variant="outline" asChild className="h-10 px-4 rounded-xl border-slate-200 text-xs font-bold gap-1">
                <Link href={createFilterUrl({ page: currentPage - 1 })}>
                  <ChevronLeft className="w-4 h-4" /> Previous
                </Link>
              </Button>
            ) : (
              <Button variant="outline" disabled className="h-10 px-4 rounded-xl border-slate-200 text-xs font-bold gap-1 opacity-50">
                <ChevronLeft className="w-4 h-4" /> Previous
              </Button>
            )}

            {/* PAGE NUMBERS */}
            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => (
                <Link key={pNum} href={createFilterUrl({ page: pNum })}>
                  <Button
                    variant={currentPage === pNum ? "default" : "outline"}
                    className={`h-10 w-10 p-0 rounded-xl text-xs font-bold ${
                      currentPage === pNum
                        ? "bg-blue-600 text-white"
                        : "border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {pNum}
                  </Button>
                </Link>
              ))}
            </div>

            {/* NEXT PAGE BUTTON */}
            {currentPage < totalPages ? (
              <Button variant="outline" asChild className="h-10 px-4 rounded-xl border-slate-200 text-xs font-bold gap-1">
                <Link href={createFilterUrl({ page: currentPage + 1 })}>
                  Next <ChevronRight className="w-4 h-4" />
                </Link>
              </Button>
            ) : (
              <Button variant="outline" disabled className="h-10 px-4 rounded-xl border-slate-200 text-xs font-bold gap-1 opacity-50">
                Next <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
