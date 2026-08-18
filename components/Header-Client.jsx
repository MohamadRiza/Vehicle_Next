"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Building2,
  Calendar,
  CarFront,
  ChevronRight,
  Compass,
  Heart,
  Home,
  Info,
  Layout,
  Menu,
  PhoneCall,
  Sparkles,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

export default function HeaderClient({ user, isAdminPage = false }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isAdmin = user?.role === "ADMIN";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-3 md:px-6 pt-3 pb-1 transition-all">
      {/* FLOATING PILL NAVBAR CONTAINER */}
      <div className="max-w-7xl mx-auto bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-xl shadow-slate-200/50 rounded-full px-4 md:px-6 py-2.5 flex items-center justify-between">
        
        {/* LEFT: BRAND LOGO */}
        <Link href={isAdminPage ? "/admin" : "/"} className="flex items-center gap-2 group">
          <Image
            src="/logo.png"
            alt="Vehiql Logo"
            width={160}
            height={45}
            priority
            unoptimized
            className="h-8 md:h-9 w-auto object-contain group-hover:scale-105 transition-transform"
          />
          {isAdminPage && (
            <span className="text-[10px] font-black bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full uppercase tracking-wider">
              Admin
            </span>
          )}
        </Link>

        {/* CENTER: DESKTOP NAVIGATION LINKS WITH ACTIVE HIGHLIGHT LINE */}
        {!isAdminPage && (
          <div className="hidden md:flex items-center gap-7">
            <Link
              href="/"
              className={`text-xs font-bold transition-all relative py-1 ${
                pathname === "/"
                  ? "text-blue-600 after:absolute after:bottom-[-2px] after:left-0 after:right-0 after:h-[2.5px] after:bg-blue-600 after:rounded-full"
                  : "text-slate-600 hover:text-blue-600"
              }`}
            >
              Home
            </Link>

            <Link
              href="/cars"
              className={`text-xs font-bold transition-all relative py-1 ${
                pathname.startsWith("/cars")
                  ? "text-blue-600 after:absolute after:bottom-[-2px] after:left-0 after:right-0 after:h-[2.5px] after:bg-blue-600 after:rounded-full"
                  : "text-slate-600 hover:text-blue-600"
              }`}
            >
              Explore Cars
            </Link>

            <Link
              href="/about"
              className={`text-xs font-bold transition-all relative py-1 ${
                pathname === "/about"
                  ? "text-blue-600 after:absolute after:bottom-[-2px] after:left-0 after:right-0 after:h-[2.5px] after:bg-blue-600 after:rounded-full"
                  : "text-slate-600 hover:text-blue-600"
              }`}
            >
              About Us
            </Link>

            <Link
              href="/blogs"
              className={`text-xs font-bold transition-all relative py-1 ${
                pathname.startsWith("/blogs")
                  ? "text-blue-600 after:absolute after:bottom-[-2px] after:left-0 after:right-0 after:h-[2.5px] after:bg-blue-600 after:rounded-full"
                  : "text-slate-600 hover:text-blue-600"
              }`}
            >
              Blogs
            </Link>

            <Link
              href="/contact"
              className={`text-xs font-bold transition-all relative py-1 ${
                pathname === "/contact"
                  ? "text-blue-600 after:absolute after:bottom-[-2px] after:left-0 after:right-0 after:h-[2.5px] after:bg-blue-600 after:rounded-full"
                  : "text-slate-600 hover:text-blue-600"
              }`}
            >
              Contact Us
            </Link>
          </div>
        )}

        {/* RIGHT: DESKTOP & MOBILE ACTIONS */}
        <div className="flex items-center gap-2 md:gap-2.5">
          {/* DESKTOP ACTION BUTTONS */}
          {isAdminPage ? (
            <Link href="/" className="hidden md:block">
              <Button variant="outline" size="sm" className="rounded-full text-xs font-bold gap-2 border-slate-200">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to App</span>
              </Button>
            </Link>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <SignedIn>
                {/* MY PROFILE DESKTOP QUICK LINK */}
                <Link href="/profile">
                  <Button
                    variant="outline"
                    size="sm"
                    className={`rounded-full text-xs font-bold px-3.5 py-2 border-slate-200 hover:bg-slate-50 gap-1.5 flex items-center transition-all ${
                      pathname === "/profile"
                        ? "bg-blue-50 text-blue-700 border-blue-200 shadow-xs"
                        : "text-slate-700 hover:text-blue-600"
                    }`}
                  >
                    <User className="w-3.5 h-3.5 text-blue-600" />
                    <span>My Profile</span>
                  </Button>
                </Link>

                {/* MY RESERVATIONS OR ADMIN BUTTON */}
                {!isAdmin ? (
                  <Link href="/reservations">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white rounded-full text-xs font-extrabold px-4.5 py-2 shadow-md shadow-blue-600/30 gap-1.5 flex items-center cursor-pointer">
                      <span>My Reservations</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                ) : (
                  <Link href="/admin">
                    <Button size="sm" className="bg-slate-900 hover:bg-slate-800 text-white rounded-full text-xs font-extrabold px-4.5 py-2 shadow-md gap-1.5 flex items-center cursor-pointer">
                      <Layout className="w-3.5 h-3.5" />
                      <span>Admin Portal</span>
                    </Button>
                  </Link>
                )}
              </SignedIn>

              <SignedOut>
                <SignInButton mode="modal">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white rounded-full text-xs font-extrabold px-5 py-2 shadow-md shadow-blue-600/30 gap-1.5 flex items-center cursor-pointer">
                    <span>Sign In</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </SignInButton>
              </SignedOut>
            </div>
          )}

          {/* CLERK USER BUTTON WITH CUSTOM DROPDOWN ITEMS */}
          <SignedIn>
            <div className="flex items-center">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8 rounded-full border border-slate-200 shadow-sm",
                  },
                }}
              >
                <UserButton.MenuItems>
                  <UserButton.Link
                    label="My Profile"
                    labelIcon={<User className="w-4 h-4" />}
                    href="/profile"
                  />
                  <UserButton.Link
                    label="My Reservations"
                    labelIcon={<Calendar className="w-4 h-4" />}
                    href="/reservations"
                  />
                  <UserButton.Link
                    label="Saved Cars"
                    labelIcon={<Heart className="w-4 h-4" />}
                    href="/reservations?tab=saved-cars"
                  />
                  {isAdmin && (
                    <UserButton.Link
                      label="Admin Portal"
                      labelIcon={<Layout className="w-4 h-4" />}
                      href="/admin"
                    />
                  )}
                </UserButton.MenuItems>
              </UserButton>
            </div>
          </SignedIn>

          {/* MOBILE SHEET MENU TRIGGER */}
          <div className="md:hidden flex items-center">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full w-9 h-9 text-slate-700 hover:bg-slate-100 cursor-pointer"
                  aria-label="Open Menu"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>

              <SheetContent
                side="right"
                className="w-[85vw] max-w-sm rounded-l-3xl p-6 bg-white flex flex-col justify-between"
              >
                <div className="space-y-6">
                  {/* SHEET HEADER */}
                  <SheetHeader className="text-left border-b pb-4">
                    <div className="flex items-center gap-2">
                      <Image
                        src="/logo.png"
                        alt="Vehiql Logo"
                        width={140}
                        height={40}
                        unoptimized
                        className="h-7 w-auto object-contain"
                      />
                    </div>
                    <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                  </SheetHeader>

                  {/* MOBILE NAVIGATION LINKS */}
                  <div className="space-y-1.5">
                    <Link
                      href="/"
                      onClick={() => setOpen(false)}
                      className={`flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-all ${
                        pathname === "/"
                          ? "bg-blue-50 text-blue-700 border border-blue-200/60"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-blue-100/60 text-blue-600">
                          <Home className="w-4 h-4" />
                        </div>
                        <span>Home Page</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </Link>

                    <Link
                      href="/cars"
                      onClick={() => setOpen(false)}
                      className={`flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-all ${
                        pathname.startsWith("/cars")
                          ? "bg-blue-50 text-blue-700 border border-blue-200/60"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-indigo-100/60 text-indigo-600">
                          <Compass className="w-4 h-4" />
                        </div>
                        <span>Explore Showroom Cars</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </Link>

                    <Link
                      href="/about"
                      onClick={() => setOpen(false)}
                      className={`flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-all ${
                        pathname === "/about"
                          ? "bg-blue-50 text-blue-700 border border-blue-200/60"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-emerald-100/60 text-emerald-600">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <span>About Us & Heritage</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </Link>

                    <Link
                      href="/blogs"
                      onClick={() => setOpen(false)}
                      className={`flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-all ${
                        pathname.startsWith("/blogs")
                          ? "bg-blue-50 text-blue-700 border border-blue-200/60"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-sky-100/60 text-sky-600">
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <span>The Vehiql Magazine</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </Link>

                    <Link
                      href="/contact"
                      onClick={() => setOpen(false)}
                      className={`flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-all ${
                        pathname === "/contact"
                          ? "bg-blue-50 text-blue-700 border border-blue-200/60"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-amber-100/60 text-amber-600">
                          <PhoneCall className="w-4 h-4" />
                        </div>
                        <span>Contact Showroom</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </Link>

                    <SignedIn>
                      <Link
                        href="/profile"
                        onClick={() => setOpen(false)}
                        className={`flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-all ${
                          pathname === "/profile"
                            ? "bg-blue-50 text-blue-700 border border-blue-200/60"
                            : "text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-rose-100/60 text-rose-600">
                            <User className="w-4 h-4" />
                          </div>
                          <span>My Account Profile</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </Link>

                      <Link
                        href="/reservations"
                        onClick={() => setOpen(false)}
                        className={`flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-all ${
                          pathname === "/reservations"
                            ? "bg-blue-50 text-blue-700 border border-blue-200/60"
                            : "text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-emerald-100/60 text-emerald-600">
                            <Calendar className="w-4 h-4" />
                          </div>
                          <span>Test Drive Reservations</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </Link>

                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setOpen(false)}
                          className="flex items-center justify-between p-3 rounded-2xl text-xs font-bold bg-slate-900 text-white"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-slate-800 text-blue-400">
                              <Layout className="w-4 h-4" />
                            </div>
                            <span>Admin Portal</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        </Link>
                      )}
                    </SignedIn>
                  </div>
                </div>

                {/* MOBILE SHEET FOOTER */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <SignedOut>
                    <SignInButton mode="modal">
                      <Button
                        onClick={() => setOpen(false)}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl text-xs h-11 shadow-md shadow-blue-600/30 gap-2 cursor-pointer"
                      >
                        <span>Sign In / Create Account</span>
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </SignInButton>
                  </SignedOut>

                  <p className="text-[10px] text-slate-400 text-center font-medium">
                    Vehiql AI © {new Date().getFullYear()} • Luxury Automotive
                  </p>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

      </div>
    </header>
  );
}
