import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
  Youtube,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 pt-16 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* MAIN FOOTER GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-900">
          {/* BRAND COLUMN */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <Image
                src="/logo-white.png"
                alt="Vehiql AI Logo"
                width={140}
                height={40}
                className="h-9 w-auto object-contain"
              />
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Advanced AI Car Search and Test Drive from thousands of verified vehicles. Discover exceptional performance and luxury at transparent market prices.
            </p>

            {/* SOCIAL ICONS */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 rounded-full bg-slate-900 hover:bg-blue-600 hover:text-white flex items-center justify-center text-slate-400 transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter / X"
                className="w-8 h-8 rounded-full bg-slate-900 hover:bg-sky-500 hover:text-white flex items-center justify-center text-slate-400 transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full bg-slate-900 hover:bg-pink-600 hover:text-white flex items-center justify-center text-slate-400 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-8 h-8 rounded-full bg-slate-900 hover:bg-red-600 hover:text-white flex items-center justify-center text-slate-400 transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/cars" className="hover:text-blue-400 transition-colors">
                  Explore Cars
                </Link>
              </li>
              <li>
                <Link href="/cars?make=BMW" className="hover:text-blue-400 transition-colors">
                  Browse by Make
                </Link>
              </li>
              <li>
                <Link href="/cars?bodyType=SUV" className="hover:text-blue-400 transition-colors">
                  Browse by Body Type
                </Link>
              </li>
              <li>
                <Link href="/reservations" className="hover:text-blue-400 transition-colors">
                  Saved Cars
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-blue-400 transition-colors">
                  Personal Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* COMPANY */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/about" className="hover:text-blue-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blogs" className="hover:text-blue-400 transition-colors">
                  Our Blog
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-blue-400 transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-400 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* SUPPORT & CONTACT */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">
              Contact Us
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-start gap-2 text-slate-300">
                <Phone className="w-3.5 h-3.5 text-blue-500 mt-0.5 flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300">
                <Mail className="w-3.5 h-3.5 text-blue-500 mt-0.5 flex-shrink-0" />
                <span className="break-all">support@vehiql.ai</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-blue-500 mt-0.5 flex-shrink-0" />
                <span>123 Auto Boulevard, New York, NY 10001, USA</span>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT ROW */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p>© {new Date().getFullYear()} Vehiql AI. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/contact" className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/contact" className="hover:text-slate-300 transition-colors">
              Terms of Service
            </Link>
            <Link href="/contact" className="hover:text-slate-300 transition-colors">
              Security
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
