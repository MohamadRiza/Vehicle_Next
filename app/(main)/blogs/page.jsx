"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  ChevronRight,
  Clock,
  Compass,
  Filter,
  Search,
  Sparkles,
  Tag,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const blogPosts = [
  {
    id: "blog-1",
    slug: "future-of-electric-supercars-2026",
    title: "2026 Electric Supercars: The Future of High-Performance Driving",
    excerpt: "How next-generation battery technology and instant torque vectoring are redefining modern supercar performance standards worldwide.",
    category: "EV & Tech",
    readTime: "5 min read",
    date: "Aug 12, 2026",
    author: {
      name: "Marcus Vance",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    },
    image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80",
    featured: true,
  },
  {
    id: "blog-2",
    slug: "top-10-luxury-suvs-to-buy",
    title: "Top 10 Luxury SUVs to Consider Before Booking Your Test Drive",
    excerpt: "A comprehensive breakdown of ride comfort, horsepower, interior technology, and resale value across top tier luxury SUV models.",
    category: "Buying Guides",
    readTime: "6 min read",
    date: "Aug 10, 2026",
    author: {
      name: "Elena Rostova",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    },
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
    featured: false,
  },
  {
    id: "blog-3",
    slug: "how-ai-is-transforming-car-inspection",
    title: "How Computer Vision AI is Revolutionizing Used Car Inspections",
    excerpt: "Discover how automated machine learning vision scans vehicle body panels, mechanical components, and tire tread depth instantly.",
    category: "Automotive Trends",
    readTime: "4 min read",
    date: "Aug 08, 2026",
    author: {
      name: "Dr. Aris Thorne",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    },
    image: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80",
    featured: false,
  },
  {
    id: "blog-4",
    slug: "essential-maintenance-tips-for-sports-cars",
    title: "Essential Maintenance Habits to Preserve High-Performance Engines",
    excerpt: "Crucial fluid replacement schedules, ceramic brake care, and storage best practices to maintain optimal engine health.",
    category: "Maintenance Tips",
    readTime: "7 min read",
    date: "Aug 05, 2026",
    author: {
      name: "Lucas Sterling",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    },
    image: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1200&q=80",
    featured: false,
  },
  {
    id: "blog-5",
    slug: "understanding-car-depreciation-and-resale-value",
    title: "Understanding Vehicle Depreciation: Cars That Hold Their Value Best",
    excerpt: "An insider look into luxury automobile depreciation curves, rare specification models, and future collector car investments.",
    category: "Buying Guides",
    readTime: "5 min read",
    date: "Aug 02, 2026",
    author: {
      name: "Sophia Martinez",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    },
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80",
    featured: false,
  },
  {
    id: "blog-6",
    slug: "the-evolution-of-autonomous-driving-tech",
    title: "Level 4 Autonomous Driving: What to Expect in Consumer Vehicles",
    excerpt: "Examining LiDAR sensor suites, real-time AI spatial mapping, and safety regulations guiding hands-free highway cruising.",
    category: "EV & Tech",
    readTime: "6 min read",
    date: "Jul 28, 2026",
    author: {
      name: "Marcus Vance",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    },
    image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80",
    featured: false,
  },
];

export default async function BlogsPage({ searchParams }) {
  const params = await searchParams;
  const selectedCategory = params?.category || "ALL";

  const categories = [
    "ALL",
    "EV & Tech",
    "Supercars & Luxury",
    "Buying Guides",
    "Automotive Trends",
    "Maintenance Tips",
  ];

  const featuredPost = blogPosts.find((p) => p.featured) || blogPosts[0];
  const regularPosts = blogPosts.filter(
    (p) =>
      !p.featured &&
      (selectedCategory === "ALL" || p.category.toLowerCase() === selectedCategory.toLowerCase())
  );

  return (
    <div className="pt-24 pb-20 min-h-screen bg-slate-50/60">
      <div className="container mx-auto px-4 max-w-7xl space-y-12">
        {/* HERO BANNER */}
        <div className="bg-gradient-to-r from-blue-950 via-indigo-900 to-slate-950 text-white rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden text-center max-w-4xl mx-auto space-y-4">
          <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30 px-3.5 py-1 text-xs font-bold uppercase tracking-wider mx-auto">
            <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-300 inline" /> Automotive Journal & Insights
          </Badge>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            The Vehiql Magazine
          </h1>

          <p className="text-blue-100/80 text-xs md:text-sm max-w-xl mx-auto leading-relaxed">
            Discover the latest luxury supercar reviews, electric vehicle buying guides, AI inspection tech, and collector car trends.
          </p>
        </div>

        {/* FEATURED STORY HERO BANNER CARD */}
        {featuredPost && (
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 bg-slate-900 text-white grid grid-cols-1 lg:grid-cols-12 items-center group">
            <div className="lg:col-span-7 h-72 lg:h-[420px] relative overflow-hidden">
              <Image
                src={featuredPost.image}
                alt={featuredPost.title}
                fill
                unoptimized
                className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent lg:hidden" />
            </div>

            <div className="lg:col-span-5 p-8 lg:p-10 space-y-5">
              <div className="flex items-center gap-3">
                <Badge className="bg-blue-600 text-white text-xs font-bold px-3 py-1">
                  {featuredPost.category}
                </Badge>
                <span className="text-xs text-slate-300 flex items-center gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5 text-blue-400" /> {featuredPost.readTime}
                </span>
              </div>

              <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-tight text-white group-hover:text-blue-300 transition-colors">
                {featuredPost.title}
              </h2>

              <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
                {featuredPost.excerpt}
              </p>

              <div className="pt-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full relative overflow-hidden border border-slate-600">
                    <Image
                      src={featuredPost.author.avatar}
                      alt={featuredPost.author.name}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{featuredPost.author.name}</p>
                    <p className="text-[11px] text-slate-400">{featuredPost.date}</p>
                  </div>
                </div>

                <Button className="bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-bold gap-1 px-5 shadow-lg shadow-blue-600/30" asChild>
                  <Link href={`/blogs`}>Read Article →</Link>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* CATEGORY FILTER CHIPS */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
          {categories.map((cat) => (
            <Link key={cat} href={`/blogs?category=${encodeURIComponent(cat)}`}>
              <Badge
                variant={selectedCategory.toLowerCase() === cat.toLowerCase() ? "default" : "outline"}
                className={`cursor-pointer px-4 py-2 text-xs rounded-full transition-all font-bold ${
                  selectedCategory.toLowerCase() === cat.toLowerCase()
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {cat === "ALL" ? "All Articles" : cat}
              </Badge>
            </Link>
          ))}
        </div>

        {/* REGULAR BLOG POSTS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularPosts.map((post) => (
            <Card
              key={post.id}
              className="border border-slate-200/80 shadow-sm rounded-3xl overflow-hidden bg-white flex flex-col justify-between hover:shadow-xl hover:border-blue-300 transition-all duration-300 group"
            >
              <div className="space-y-4">
                {/* THUMBNAIL IMAGE */}
                <div className="h-52 w-full relative overflow-hidden bg-slate-100">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white/90 backdrop-blur-md text-slate-900 border-none text-[11px] font-bold shadow-md">
                      {post.category}
                    </Badge>
                  </div>
                </div>

                {/* CONTENT BODY */}
                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-blue-500" /> {post.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-indigo-500" /> {post.readTime}
                    </span>
                  </div>

                  <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              {/* CARD FOOTER */}
              <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between mt-4">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-full relative overflow-hidden border border-slate-200 flex-shrink-0">
                    <Image
                      src={post.author.avatar}
                      alt={post.author.name}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-800">{post.author.name}</span>
                </div>

                <Button variant="ghost" size="sm" className="text-xs font-bold text-blue-600 hover:text-blue-700 gap-1" asChild>
                  <Link href="/blogs">
                    Read Story <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* NEWSLETTER CTA BANNER */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-950 text-white rounded-3xl p-8 md:p-12 text-center max-w-4xl mx-auto space-y-6 shadow-2xl">
          <h2 className="text-2xl md:text-4xl font-black tracking-tight">
            Stay Ahead of the Auto World
          </h2>
          <p className="text-xs md:text-sm text-blue-100/90 max-w-lg mx-auto leading-relaxed">
            Subscribe to our weekly automotive digest for exclusive luxury supercar reviews, market valuation reports, and test drive insights.
          </p>

          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email address..."
              className="bg-white/10 border-white/20 text-white placeholder:text-blue-200 text-xs rounded-2xl h-11"
            />
            <Button className="bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-extrabold h-11 px-6 shadow-lg shadow-blue-600/30">
              Subscribe
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
