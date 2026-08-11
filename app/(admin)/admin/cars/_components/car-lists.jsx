"use client";

import { deleteCar, getCars, updateCarStatus } from "@/action/cars";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Car,
  CheckCircle2,
  ChevronDown,
  Fuel,
  Gauge,
  MoreVertical,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Trash2,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

export default function CarsList() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const fetchCarsList = async () => {
    setLoading(true);
    const res = await getCars({
      search,
      status: statusFilter,
    });
    if (res.success) {
      setCars(res.cars);
    } else {
      toast.error(res.error || "Failed to load cars");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCarsList();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCarsList();
  };

  const handleStatusChange = async (carId, newStatus) => {
    startTransition(async () => {
      const res = await updateCarStatus(carId, newStatus);
      if (res.success) {
        toast.success(`Car status updated to ${newStatus}`);
        setCars((prev) =>
          prev.map((c) => (c.id === carId ? { ...c, status: newStatus } : c))
        );
      } else {
        toast.error(res.error || "Failed to update status");
      }
    });
  };

  const handleDelete = async (carId) => {
    if (!confirm("Are you sure you want to delete this car listing?")) return;

    startTransition(async () => {
      const res = await deleteCar(carId);
      if (res.success) {
        toast.success("Car deleted successfully");
        setCars((prev) => prev.filter((c) => c.id !== carId));
      } else {
        toast.error(res.error || "Failed to delete car");
      }
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "AVAILABLE":
        return (
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
            Available
          </Badge>
        );
      case "SOLD":
        return (
          <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-200">
            Sold
          </Badge>
        );
      case "UNAVAILABLE":
        return (
          <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200">
            Unavailable
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* TOOLBAR */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-3">
          <Button
            onClick={() => router.push("/admin/cars/create")}
            className="bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-2 shadow-md shadow-blue-600/20"
          >
            <Plus className="h-4 w-4" /> Add Car
          </Button>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] text-xs">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="AVAILABLE">Available</SelectItem>
              <SelectItem value="SOLD">Sold</SelectItem>
              <SelectItem value="UNAVAILABLE">Unavailable</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={fetchCarsList}
            title="Refresh"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>

        <form onSubmit={handleSearchSubmit} className="flex w-full sm:w-auto gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              className="pl-9 text-xs"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="search"
              placeholder="Search make, model, color..."
            />
          </div>
          <Button type="submit" variant="secondary" className="text-xs">
            Search
          </Button>
        </form>
      </div>

      {/* CARS TABLE / CARDS */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-slate-500 space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-600" />
            <p className="text-sm font-medium">Loading inventory...</p>
          </div>
        ) : cars.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
              <Car className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">No cars found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                No vehicles match your current search or filter criteria. Try clearing filters or add a new vehicle listing.
              </p>
            </div>
            <Button
              onClick={() => router.push("/admin/cars/create")}
              className="bg-blue-600 hover:bg-blue-500 text-white gap-2"
            >
              <Plus className="w-4 h-4" /> Add Car
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/80">
                <TableRow>
                  <TableHead className="w-[80px]">Vehicle</TableHead>
                  <TableHead>Make & Model</TableHead>
                  <TableHead>Year & Body</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Specs</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cars.map((car) => (
                  <TableRow key={car.id} className="hover:bg-slate-50/50">
                    <TableCell>
                      <div className="h-12 w-16 relative rounded-md overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                        {car.image?.[0] ? (
                          <Image
                            src={car.image[0]}
                            alt={car.model}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <Car className="w-6 h-6 m-auto text-slate-400" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-bold text-slate-900 text-sm">
                        {car.make} {car.model}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="capitalize">{car.color || "Color unlisted"}</span>
                        {car.feautured && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                            <Sparkles className="w-2.5 h-2.5" /> Featured
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs font-semibold text-slate-700">
                        {car.year}
                      </div>
                      <div className="text-[11px] text-slate-500 capitalize">
                        {car.bodyType}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-bold text-blue-700">
                        ${Number(car.price || 0).toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs text-slate-600 space-y-0.5">
                        <div className="flex items-center gap-1">
                          <Gauge className="w-3 h-3 text-slate-400" />
                          <span>{Number(car.mileage || 0).toLocaleString()} mi</span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500">
                          <Fuel className="w-3 h-3 text-slate-400" />
                          <span>{car.fuelType} • {car.transmission}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(car.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4 text-slate-500" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(car.id, "AVAILABLE")}
                            className="text-xs gap-2"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Mark Available
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(car.id, "SOLD")}
                            className="text-xs gap-2"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-slate-600" />
                            Mark Sold
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(car.id, "UNAVAILABLE")}
                            className="text-xs gap-2"
                          >
                            <XCircle className="w-3.5 h-3.5 text-rose-600" />
                            Mark Unavailable
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(car.id)}
                            className="text-xs text-rose-600 focus:text-rose-600 gap-2 border-t mt-1 pt-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete Listing
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
