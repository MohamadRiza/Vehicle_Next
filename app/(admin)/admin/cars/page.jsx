import React from "react";
import CarsList from "./_components/car-lists";
import { Car, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Car Inventory Management | Vehicle Admin",
  description: "Manage, update, and search vehicle listings in your marketplace",
};

const CarsPage = () => {
  return (
    <div className="p-6 md:p-8 space-y-8 bg-slate-50/50 min-h-screen">
      {/* HEADER BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-blue-600 text-xs font-bold tracking-wider uppercase mb-1">
            <Car className="w-4 h-4" /> Inventory Management
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            Vehicle Fleet Catalog
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            View, search, update availability status, or add new vehicles to your showroom.
          </p>
        </div>

        <Link href="/admin/cars/create">
          <Button className="bg-blue-600 hover:bg-blue-500 text-white gap-2 shadow-lg shadow-blue-600/20">
            <Plus className="w-4 h-4" /> Add New Car
          </Button>
        </Link>
      </div>

      {/* CARS LIST TABLE & TOOLBAR */}
      <CarsList />
    </div>
  );
};

export default CarsPage;
