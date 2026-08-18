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
  Briefcase,
  Calendar,
  CarFront,
  ChevronRight,
  Compass,
  Heart,
  Home,
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
              href="/careers"
              className={`text-xs font-bold transition-all relative py-1 ${
                pathname.startsWith("/careers")
                  ? "text-blue-600 after:absolute after:bottom-[-2px] after:left-0 after:right-0 after:h-[2.5px] after:bg-blue-600 after:rounded-full"
                  : "text-slate-600 hover:text-blue-600"
              }`}
            >
              Careers
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
        <div className="flex items-center gap-2 md:gap-3">
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
                {!isAdmin ? (
                  <Link href="/reservations">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white rounded-full text-xs font-extrabold px-5 py-2 shadow-md shadow-blue-600/30 gap-1.5 flex items-center">
                      <span>My Reservations</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                ) : (
                  <Link href="/admin">
                    <Button size="sm" className="bg-slate-900 hover:bg-slate-800 text-white rounded-full text-xs font-extrabold px-5 py-2 shadow-md gap-1.5 flex items-center">
                      <Layout className="w-3.5 h-3.5" />
                      <span>Admin Portal</span>
                    </Button>
                  </Link>
                )}
              </SignedIn>

              <SignedOut>
                <SignInButton forceRedirectUrl="/">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white rounded-full text-xs font-extrabold px-6 py-2 shadow-md shadow-blue-600/30 gap-1.5 flex items-center">
                    <span>Sign In</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </SignInButton>
              </SignedOut>
            </div>
          )}

          {/* CLERK USER BUTTON WITH CUSTOM MENU ITEMS */}
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-9 w-9 border-2 border-blue-100 rounded-full shadow-xs hover:scale-105 transition-transform cursor-pointer",
                },
              }}
            >
              <UserButton.MenuItems>
                <UserButton.Link
                  label="Personal Information"
                  href="/profile"
                  labelIcon={<User className="w-4 h-4 text-blue-600" />}
                />
                <UserButton.Link
                  label="My Reservations"
                  href="/reservations"
                  labelIcon={<Calendar className="w-4 h-4 text-indigo-600" />}
                />
                {isAdmin && (
                  <UserButton.Link
                    label="Admin Portal"
                    href="/admin"
                    labelIcon={<Layout className="w-4 h-4 text-amber-600" />}
                  />
                )}
              </UserButton.MenuItems>
            </UserButton>
          </SignedIn>

          {/* MOBILE HAMBURGER MENU SHEET */}
          <div className="flex md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full text-slate-700 hover:bg-slate-100"
                  aria-label="Toggle Mobile Navigation"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>

              <SheetContent side="right" className="w-[300px] sm:w-[360px] p-6 bg-white flex flex-col justify-between rounded-l-3xl">
                <div>
                  {/* MOBILE SHEET HEADER */}
                  <SheetHeader className="text-left border-b pb-4 mb-4">
                    <SheetTitle className="flex items-center gap-2">
                      <Image
                        src="/logo.png"
                        alt="Vehiql Logo"
                        width={140}
                        height={40}
                        priority
                        unoptimized
                        className="h-8 w-auto object-contain"
                      />
                    </SheetTitle>
                    <p className="text-[11px] text-slate-500 font-medium mt-1">
                      Premium AI Auto Marketplace & Test Drive
                    </p>
                  </SheetHeader>

                  {/* MOBILE NAVIGATION LINKS */}
                  <div className="space-y-2 py-2">
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3 mb-1">
                      Navigation Menu
                    </p>

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
                      href="/careers"
                      onClick={() => setOpen(false)}
                      className={`flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-all ${
                        pathname.startsWith("/careers")
                          ? "bg-blue-50 text-blue-700 border border-blue-200/60"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-purple-100/60 text-purple-600">
                          <Briefcase className="w-4 h-4" />
                        </div>
                        <span>Careers & Openings</span>
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
                          <div className="p-2 rounded-xl bg-blue-100/60 text-blue-600">
                            <User className="w-4 h-4" />
                          </div>
                          <span>Personal Info</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </Link>

                      {!isAdmin ? (
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
                            <span>My Reservations</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        </Link>
                      ) : (
                        <Link
                          href="/admin"
                          onClick={() => setOpen(false)}
                          className={`flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-all ${
                            pathname.startsWith("/admin")
                              ? "bg-slate-900 text-white"
                              : "text-slate-700 hover:bg-slate-50"
                          }`}
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
                  <SignedIn>
                    <Link
                      href="/profile"
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-blue-50/60 hover:border-blue-200 transition-all group"
                    >
                      <div className="flex items-center gap-2.5">
                        <UserButton
                          appearance={{
                            elements: {
                              avatarBox: "h-8 w-8",
                            },
                          }}
                        />
                        <div className="text-left">
                          <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors flex items-center gap-1">
                            {user?.name || "Account"} <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                          </p>
                          <p className="text-[10px] text-slate-500 truncate max-w-[130px]">{user?.email}</p>
                        </div>
                      </div>
                      {isAdmin && (
                        <span className="text-[10px] font-extrabold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                          ADMIN
                        </span>
                      )}
                    </Link>
                  </SignedIn>

                  <SignedOut>
                    <SignInButton forceRedirectUrl="/">
                      <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-full text-xs font-extrabold py-3 shadow-md gap-1.5">
                        <span>Sign In / Register</span>
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </SignInButton>
                  </SignedOut>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
