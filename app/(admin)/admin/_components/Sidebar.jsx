"use client";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Briefcase,
  Calendar,
  Car,
  ChevronRight,
  Cog,
  Layout,
  LayoutDashboard,
  Menu,
  MessageSquare,
  MoreHorizontal,
  Quote,
  Sparkles,
  Star,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin",
    description: "Overview & metrics",
    color: "text-blue-600 bg-blue-50",
  },
  {
    label: "Cars",
    icon: Car,
    href: "/admin/cars",
    description: "Vehicle inventory",
    color: "text-sky-600 bg-sky-50",
  },
  {
    label: "Test Drive",
    icon: Calendar,
    href: "/admin/test-drive",
    description: "Customer bookings",
    color: "text-emerald-600 bg-emerald-50",
  },
  {
    label: "Careers",
    icon: Briefcase,
    href: "/admin/careers",
    description: "Job vacancies & CVs",
    color: "text-purple-600 bg-purple-50",
  },
  {
    label: "Customers",
    icon: Users,
    href: "/admin/customers",
    description: "Accounts & members",
    color: "text-indigo-600 bg-indigo-50",
  },
  {
    label: "Enquiries",
    icon: MessageSquare,
    href: "/admin/enquiries",
    description: "Client messages",
    color: "text-amber-600 bg-amber-50",
  },
  {
    label: "Reviews",
    icon: Star,
    href: "/admin/reviews",
    description: "Car ratings & feedback",
    color: "text-yellow-600 bg-yellow-50",
  },
  {
    label: "Testimonials",
    icon: Quote,
    href: "/admin/testimonials",
    description: "Homepage client quotes",
    color: "text-rose-600 bg-rose-50",
  },
  {
    label: "Reports",
    icon: BarChart3,
    href: "/admin/reports",
    description: "Analytics & export",
    color: "text-cyan-600 bg-cyan-50",
  },
  {
    label: "Content",
    icon: Layout,
    href: "/admin/content",
    description: "Hero & promo banners",
    color: "text-violet-600 bg-violet-50",
  },
  {
    label: "Settings",
    icon: Cog,
    href: "/admin/settings",
    description: "Hours & showroom info",
    color: "text-slate-600 bg-slate-100",
  },
];

// Primary bottom tabs for mobile
const primaryMobileRoutes = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { label: "Cars", icon: Car, href: "/admin/cars" },
  { label: "Test Drive", icon: Calendar, href: "/admin/test-drive" },
  { label: "Careers", icon: Briefcase, href: "/admin/careers" },
];

const Sidebar = () => {
  const pathname = usePathname();
  const [sheetOpen, setSheetOpen] = useState(false);

  // Check if current route is one of the secondary routes inside the "More" drawer
  const isPrimaryActive = primaryMobileRoutes.some((r) => r.href === pathname);
  const activeSecondaryRoute = routes.find(
    (r) => r.href === pathname && !primaryMobileRoutes.some((p) => p.href === r.href)
  );

  return (
    <>
      {/* ── DESKTOP SIDEBAR (UNCHANGED, STRICTLY PRESERVED) ── */}
      <div className="hidden md:flex h-full flex-col overflow-y-auto bg-white shadow-sm border-r">
        {routes.map((route) => {
          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-x-2 text-slate-500 text-sm font-medium pl-6 transition-all hover:text-slate-600 hover:bg-slate-100/50 h-12",
                pathname === route.href
                  ? "text-blue-700 bg-blue-100/50 hover:bg-blue-100 hover:text-blue-700"
                  : ""
              )}
            >
              <route.icon className="h-5 w-5" />
              {route.label}
            </Link>
          );
        })}
      </div>

      {/* ── MOBILE TOUCH-FRIENDLY BOTTOM NAVIGATION BAR ───── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-2xl px-2 py-1.5 flex items-center justify-around">
        {primaryMobileRoutes.map((route) => {
          const isActive = pathname === route.href;
          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex flex-col items-center justify-center text-[10px] font-bold transition-all py-1.5 px-2 rounded-2xl flex-1 active:scale-95",
                isActive
                  ? "text-blue-600 bg-blue-50/90 font-black"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              <route.icon
                className={cn(
                  "h-5 w-5 mb-0.5 transition-transform",
                  isActive ? "scale-110 text-blue-600" : "text-slate-500"
                )}
              />
              <span className="truncate max-w-[65px]">{route.label}</span>
            </Link>
          );
        })}

        {/* 5TH TAB: ALL TOOLS / MORE DRAWER TRIGGER */}
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              className={cn(
                "flex flex-col items-center justify-center text-[10px] font-bold transition-all py-1.5 px-2 rounded-2xl flex-1 active:scale-95 cursor-pointer",
                activeSecondaryRoute
                  ? "text-blue-600 bg-blue-50/90 font-black"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              <div className="relative">
                <Menu
                  className={cn(
                    "h-5 w-5 mb-0.5",
                    activeSecondaryRoute ? "text-blue-600 scale-110" : "text-slate-500"
                  )}
                />
                {activeSecondaryRoute && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-blue-600" />
                )}
              </div>
              <span className="truncate max-w-[65px]">
                {activeSecondaryRoute ? activeSecondaryRoute.label : "More"}
              </span>
            </button>
          </SheetTrigger>

          <SheetContent
            side="bottom"
            className="rounded-t-3xl p-6 bg-white max-h-[85vh] overflow-y-auto space-y-5"
          >
            <SheetHeader className="text-left space-y-1 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Admin Portal</span>
              </div>
              <SheetTitle className="text-lg font-black text-slate-900">
                All Admin Modules & Tools
              </SheetTitle>
              <SheetDescription className="text-xs text-slate-500">
                Select any management section below to navigate.
              </SheetDescription>
            </SheetHeader>

            {/* 2-COLUMN TOUCH-FRIENDLY GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {routes.map((route) => {
                const isActive = pathname === route.href;
                const Icon = route.icon;

                return (
                  <Link
                    key={route.href}
                    href={route.href}
                    onClick={() => setSheetOpen(false)}
                    className={cn(
                      "flex items-center justify-between p-3.5 rounded-2xl border transition-all active:scale-98",
                      isActive
                        ? "bg-blue-50 border-blue-300 text-blue-700 shadow-sm"
                        : "bg-slate-50/70 border-slate-200/80 hover:bg-slate-100/80 text-slate-800"
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                          route.color || "bg-blue-50 text-blue-600"
                        )}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold truncate leading-tight">
                          {route.label}
                        </h4>
                        <p className="text-[10px] text-slate-500 truncate mt-0.5">
                          {route.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {isActive && (
                        <span className="text-[9px] font-black bg-blue-600 text-white px-2 py-0.5 rounded-full">
                          ACTIVE
                        </span>
                      )}
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default Sidebar;
