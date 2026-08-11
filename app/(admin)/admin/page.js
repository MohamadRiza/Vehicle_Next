import { getAdminDashboardData } from "@/action/admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Activity,
  ArrowUpRight,
  Calendar,
  Car,
  CheckCircle2,
  Clock,
  Plus,
  ShieldCheck,
  UserCheck,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

function formatRelativeTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getStatusBadge(status) {
  switch (status) {
    case "PENDING":
      return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Pending</Badge>;
    case "CONFIRMED":
      return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Confirmed</Badge>;
    case "COMPLETED":
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Completed</Badge>;
    case "CANCELLED":
      return <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200">Cancelled</Badge>;
    case "AVAILABLE":
      return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Available</Badge>;
    case "SOLD":
      return <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-200">Sold</Badge>;
    case "UNAVAILABLE":
      return <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200">Unavailable</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}

const AdminDashboardPage = async () => {
  const data = await getAdminDashboardData();

  if (!data.authorized) {
    return notFound();
  }

  const { stats, activities, recentBookings, recentCars } = data;

  return (
    <div className="p-6 md:p-8 space-y-8 bg-slate-50/50 min-h-screen">
      {/* HEADER BANNER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 md:p-8 rounded-2xl shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <Car className="w-96 h-96 text-white" />
        </div>

        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2 text-blue-300 text-sm font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span>Admin Control Center</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Vehicle AI Dashboard
          </h1>
          <p className="text-blue-100/80 text-sm max-w-xl">
            Real-time overview of inventory, customer signups, and test drive reservations.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <Link href="/admin/cars/new">
            <Button className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 gap-2">
              <Plus className="w-4 h-4" />
              Add New Car
            </Button>
          </Link>
          <Link href="/admin/cars">
            <Button variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/20">
              Manage Inventory
            </Button>
          </Link>
        </div>
      </div>

      {/* METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* CARS STAT CARD */}
        <Card className="hover:shadow-md transition-all duration-300 border-slate-200/80">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-600">
              Total Cars Currently Showing
            </CardTitle>
            <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Car className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{stats.cars.total}</div>
            <div className="flex items-center gap-2 mt-3 text-xs text-slate-500 font-medium">
              <span className="inline-flex items-center text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                {stats.cars.available} Available
              </span>
              <span className="inline-flex items-center text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                {stats.cars.sold} Sold
              </span>
            </div>
          </CardContent>
        </Card>

        {/* CUSTOMERS STAT CARD */}
        <Card className="hover:shadow-md transition-all duration-300 border-slate-200/80">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-600">
              Customers Logged In / Registered
            </CardTitle>
            <div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
              <Users className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{stats.customers.total}</div>
            <p className="text-xs text-slate-500 mt-3 font-medium flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-purple-500" />
              Verified User Accounts
            </p>
          </CardContent>
        </Card>

        {/* TEST DRIVES STAT CARD */}
        <Card className="hover:shadow-md transition-all duration-300 border-slate-200/80">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-600">
              Test Drives Booked
            </CardTitle>
            <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Calendar className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{stats.testDrives.total}</div>
            <div className="flex items-center gap-2 mt-3 text-xs text-slate-500 font-medium">
              <span className="inline-flex items-center text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                {stats.testDrives.pending} Pending
              </span>
              <span className="inline-flex items-center text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                {stats.testDrives.confirmed} Confirmed
              </span>
            </div>
          </CardContent>
        </Card>

        {/* INVENTORY HEALTH CARD */}
        <Card className="hover:shadow-md transition-all duration-300 border-slate-200/80">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-600">
              Inventory Availability
            </CardTitle>
            <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Activity className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              {stats.cars.total > 0
                ? `${Math.round((stats.cars.available / stats.cars.total) * 100)}%`
                : "100%"}
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{
                  width: `${
                    stats.cars.total > 0
                      ? (stats.cars.available / stats.cars.total) * 100
                      : 100
                  }%`,
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* TWO COLUMN CONTENT SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* RECENT ACTIVITIES FEED (Left 2 cols) */}
        <Card className="lg:col-span-2 border-slate-200/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                Recent Activities
              </CardTitle>
              <CardDescription className="text-slate-500 text-xs mt-1">
                Latest updates across bookings, customer signups, and vehicle inventory.
              </CardDescription>
            </div>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-semibold">
              Live Feed
            </Badge>
          </CardHeader>
          <CardContent className="pt-6">
            {activities.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-sm">
                No recent activity recorded yet.
              </div>
            ) : (
              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {activities.map((act) => {
                  let IconComponent = Activity;
                  let iconBg = "bg-slate-100 text-slate-600";

                  if (act.type === "BOOKING") {
                    IconComponent = Calendar;
                    iconBg = "bg-amber-100 text-amber-600";
                  } else if (act.type === "CAR") {
                    IconComponent = Car;
                    iconBg = "bg-blue-100 text-blue-600";
                  } else if (act.type === "USER") {
                    IconComponent = UserCheck;
                    iconBg = "bg-purple-100 text-purple-600";
                  }

                  return (
                    <div key={act.id} className="relative flex items-start gap-4 group">
                      <div
                        className={`absolute -left-6 top-0.5 h-5 w-5 rounded-full ${iconBg} flex items-center justify-center ring-4 ring-white text-[10px] font-bold shadow-sm`}
                      >
                        <IconComponent className="w-3 h-3" />
                      </div>
                      <div className="flex-1 bg-white p-4 rounded-xl border border-slate-100 shadow-sm group-hover:border-blue-100 group-hover:shadow-md transition-all">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h4 className="text-sm font-semibold text-slate-900">
                            {act.title}
                          </h4>
                          <span className="text-xs text-slate-400 font-medium">
                            {formatRelativeTime(act.timestamp)}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600">
                          {act.description}
                        </p>
                        {act.status && (
                          <div className="mt-2">
                            {getStatusBadge(act.status)}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* RECENT BOOKINGS & SHORTCUTS (Right 1 col) */}
        <div className="space-y-8">
          {/* RECENT TEST DRIVE BOOKINGS */}
          <Card className="border-slate-200/80 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100">
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-600" />
                Latest Bookings
              </CardTitle>
              <Link href="/admin/test-drive" className="text-xs text-blue-600 hover:underline font-medium flex items-center">
                View All <ArrowUpRight className="w-3 h-3 ml-0.5" />
              </Link>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {recentBookings.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-6">
                  No test drives booked yet.
                </p>
              ) : (
                recentBookings.map((b) => (
                  <div
                    key={b.id}
                    className="p-3 rounded-lg border border-slate-100 bg-white hover:bg-slate-50/80 transition-colors flex items-center justify-between gap-3"
                  >
                    <div className="space-y-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {b.user?.name || "Customer"}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {b.car ? `${b.car.year} ${b.car.make} ${b.car.model}` : "Car"}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {new Date(b.bookingDate).toLocaleDateString()} at {b.startTime}
                      </p>
                    </div>
                    <div>{getStatusBadge(b.status)}</div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* RECENT CAR INVENTORY PREVIEW */}
          <Card className="border-slate-200/80 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100">
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Car className="w-4 h-4 text-blue-600" />
                Recent Cars
              </CardTitle>
              <Link href="/admin/cars" className="text-xs text-blue-600 hover:underline font-medium flex items-center">
                Manage Cars <ArrowUpRight className="w-3 h-3 ml-0.5" />
              </Link>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              {recentCars.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-6">
                  No cars added yet.
                </p>
              ) : (
                recentCars.map((c) => (
                  <div
                    key={c.id}
                    className="p-3 rounded-lg border border-slate-100 bg-white hover:bg-slate-50/80 transition-colors flex items-center gap-3"
                  >
                    <div className="h-10 w-12 relative rounded bg-slate-100 overflow-hidden flex-shrink-0">
                      {c.image?.[0] ? (
                        <Image
                          src={c.image[0]}
                          alt={c.model}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <Car className="w-6 h-6 m-auto text-slate-400" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {c.year} {c.make} {c.model}
                      </p>
                      <p className="text-[11px] text-blue-600 font-semibold">
                        ${Number(c.price || 0).toLocaleString()}
                      </p>
                    </div>
                    <div>{getStatusBadge(c.status)}</div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
