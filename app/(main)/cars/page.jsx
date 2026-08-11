import { getCars } from "@/action/cars";
import CarCard from "@/components/Car-Card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { bodyTypes, carMakes, featuredCars } from "@/lib/data";
import {
  Car,
  ChevronRight,
  Filter,
  RefreshCw,
  Search,
  Sparkles,
  SlidersHorizontal,
} from "lucide-react";
import Link from "next/link";
import React from "react";

export const metadata = {
  title: "Explore All Cars | Vehicle AI",
  description: "Browse thousands of verified vehicles, filter by make, body type, and book test drives online.",
};

export default async function PublicCarsPage({ searchParams }) {
  const params = await searchParams;
  const search = params?.search || "";
  const selectedMake = params?.make || "ALL";
  const selectedBodyType = params?.bodyType || "ALL";
  const selectedFuelType = params?.fuelType || "ALL";
  const selectedTransmission = params?.transmission || "ALL";
  const selectedSortBy = params?.sortBy || "newest";

  const res = await getCars({
    search,
    make: selectedMake,
    bodyType: selectedBodyType,
    fuelType: selectedFuelType,
    transmission: selectedTransmission,
    sortBy: selectedSortBy,
  });

  let cars = res.success ? res.cars : [];

  // Fallback to rich sample data if database has no entries matching query
  if (cars.length === 0 && !search && selectedMake === "ALL" && selectedBodyType === "ALL") {
    cars = featuredCars;
  }

  const fuelTypes = ["ALL", "Electric", "Gasoline", "Hybrid", "Diesel"];
  const transmissions = ["ALL", "Automatic", "Manual"];

  const hasActiveFilters =
    search !== "" ||
    selectedMake !== "ALL" ||
    selectedBodyType !== "ALL" ||
    selectedFuelType !== "ALL" ||
    selectedTransmission !== "ALL";

  return (
    <div className="pt-24 pb-16 min-h-screen bg-slate-50/60">
      <div className="container mx-auto px-4 space-y-8">
        {/* HERO BANNER */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center">
            <Car className="w-[500px] h-[500px] text-white" />
          </div>

          <div className="relative z-10 max-w-2xl space-y-4">
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
              Premier Marketplace
            </Badge>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              Explore Our Vehicle Showroom
            </h1>
            <p className="text-blue-100/80 text-sm md:text-base">
              Discover verified cars with complete specs, transparent pricing, and instant online test drive booking.
            </p>
          </div>
        </div>

        {/* SEARCH & FILTER CONTROLS */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-6">
          {/* SEARCH BAR & SORT */}
          <form method="GET" action="/cars" className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-3 h-5 w-5 text-slate-400" />
              <Input
                name="search"
                defaultValue={search}
                placeholder="Search by make, model, year, or keyword..."
                className="pl-11 h-11 text-sm bg-slate-50/50 border-slate-200 rounded-xl"
              />
            </div>
            <div className="flex w-full md:w-auto items-center gap-3">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white h-11 px-6 rounded-xl gap-2 font-medium">
                <Search className="w-4 h-4" /> Search
              </Button>
              {hasActiveFilters && (
                <Button variant="outline" asChild className="h-11 rounded-xl text-slate-600 border-slate-200">
                  <Link href="/cars">Clear Filters</Link>
                </Button>
              )}
            </div>
          </form>

          {/* QUICK CATEGORY CHIPS */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            {/* MAKES FILTER */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-blue-600" /> Browse By Make
              </label>
              <div className="flex flex-wrap items-center gap-2">
                <Link href="/cars">
                  <Badge
                    variant={selectedMake === "ALL" ? "default" : "outline"}
                    className={`cursor-pointer px-3 py-1.5 text-xs rounded-lg transition-all ${
                      selectedMake === "ALL"
                        ? "bg-blue-600 text-white"
                        : "hover:bg-slate-100 text-slate-700 border-slate-200"
                    }`}
                  >
                    All Makes
                  </Badge>
                </Link>
                {carMakes.map((m) => (
                  <Link key={m.name} href={`/cars?make=${encodeURIComponent(m.name)}`}>
                    <Badge
                      variant={selectedMake.toLowerCase() === m.name.toLowerCase() ? "default" : "outline"}
                      className={`cursor-pointer px-3 py-1.5 text-xs rounded-lg transition-all ${
                        selectedMake.toLowerCase() === m.name.toLowerCase()
                          ? "bg-blue-600 text-white"
                          : "hover:bg-slate-100 text-slate-700 border-slate-200"
                      }`}
                    >
                      {m.name}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>

            {/* BODY TYPE FILTER */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600" /> Body Type
              </label>
              <div className="flex flex-wrap items-center gap-2">
                <Link href="/cars">
                  <Badge
                    variant={selectedBodyType === "ALL" ? "default" : "outline"}
                    className={`cursor-pointer px-3 py-1.5 text-xs rounded-lg transition-all ${
                      selectedBodyType === "ALL"
                        ? "bg-indigo-600 text-white"
                        : "hover:bg-slate-100 text-slate-700 border-slate-200"
                    }`}
                  >
                    All Types
                  </Badge>
                </Link>
                {bodyTypes.map((bt) => (
                  <Link key={bt.name} href={`/cars?bodyType=${encodeURIComponent(bt.name)}`}>
                    <Badge
                      variant={selectedBodyType.toLowerCase() === bt.name.toLowerCase() ? "default" : "outline"}
                      className={`cursor-pointer px-3 py-1.5 text-xs rounded-lg transition-all ${
                        selectedBodyType.toLowerCase() === bt.name.toLowerCase()
                          ? "bg-indigo-600 text-white"
                          : "hover:bg-slate-100 text-slate-700 border-slate-200"
                      }`}
                    >
                      {bt.name}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RESULTS HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Available Cars ({cars.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing listed cars in your inventory
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
              <h3 className="text-lg font-bold text-slate-900">No cars found</h3>
              <p className="text-xs text-slate-500 mt-1">
                We couldn't find any vehicles matching your search criteria. Try adjusting your filters.
              </p>
            </div>
            <Button asChild className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl">
              <Link href="/cars">Reset Filters</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
