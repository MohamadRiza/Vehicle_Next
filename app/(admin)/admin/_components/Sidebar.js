"use client";

import { Calendar, Car, Cog, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import React from "react";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin",
  },
  {
    label: "Cars",
    icon: Car,
    href: "/admin/cars",
  },
  {
    label: "Test Drive",
    icon: Calendar,
    href: "/admin/test-drive",
  },
  {
    label: "Settings",
    icon: Cog,
    href: "/admin/settings",
  },
];

const Sidebar = () => {
  return (
    <>
      <div className="hidden md:flex h-full flex-col overflow-y-auto bg-white shadow-sm border-r">
        {routes.map((route) => {
          return (
            <Link key={route.href} href={route.href}>
              <route.icon className="h-5 w-5" />
              {route.label}
            </Link>
          );
        })}
      </div>
      <div></div>
    </>
  );
};

export default Sidebar;
