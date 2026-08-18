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
  Mail,
  Search,
  Share2,
  Sparkles,
  TrendingUp,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export const metadata = {
  title: "The Vehiql Magazine | Automotive News & Expert Insights",
  description:
    "Explore in-depth luxury vehicle reviews, electric supercar performance analyses, AI inspection technology, and collector car market trends.",
};

const blogPosts = [
  {
    id: "blog-1",
    slug: "future-of-electric-supercars-2026",
    title: "2026 Electric Supercars: The Future of High-Performance Driving",
    excerpt:
      "How next-generation solid-state battery tech and instant quad-motor torque vectoring are redefining 0-60 acceleration and track dynamics.",
    category: "EV & Tech",
    readTime: "5 min read",
    date: "Aug 16, 2026",
    author: {
      name: "Marcus Vance",
      role: "Chief Automotive Editor",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    },
    image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1400&q=80",
    featured: true,
  },
  {
    id: "blog-2",
    slug: "top-10-luxury-suvs-to-buy",
    title: "Top 10 Luxury SUVs to Consider Before Booking Your Test Drive",
    excerpt:
      "A comprehensive breakdown of ride comfort, horsepower, interior technology, and long-term resale value across top luxury SUV models.",
    category: "Buying Guides",
    readTime: "6 min read",
    date: "Aug 14, 2026",
    author: {
      name: "Elena Rostova",
      role: "Senior Test Driver",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    },
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
    featured: false,
  },
  {
    id: "blog-3",
    slug: "how-ai-is-transforming-car-inspection",
    title: "How Computer Vision AI is Revolutionizing Used Car Inspections",
    excerpt:
      "Discover how automated machine learning vision scans vehicle body panels, mechanical wear, and tire tread depth with sub-millimeter precision.",
    category: "AI & Innovations",
    readTime: "4 min read",
    date: "Aug 11, 2026",
    author: {
      name: "Dr. Aris Thorne",
      role: "AI Mobility Researcher",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    },
    image: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80",
    featured: false,
  },
  {
    id: "blog-4",
    slug: "essential-maintenance-tips-for-sports-cars",
    title: "Essential Maintenance Habits to Preserve High-Performance Engines",
    excerpt:
      "Crucial fluid replacement schedules, ceramic brake maintenance, and climate-controlled storage best practices to maintain optimal engine health.",
    category: "Maintenance",
    readTime: "7 min read",
    date: "Aug 08, 2026",
    author: {
      name: "Lucas Sterling",
      role: "Lead Master Technician",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    },
    image: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1200&q=80",
    featured: false,
  },
  {
    id: "blog-5",
    slug: "understanding-car-depreciation-and-resale-value",
    title: "Understanding Vehicle Depreciation: Cars That Hold Their Value Best",
    excerpt:
      "An insider look into luxury automobile depreciation curves, rare factory options, and modern classic vehicles forecasted to appreciate.",
    category: "Market Trends",
    readTime: "5 min read",
    date: "Aug 04, 2026",
    author: {
      name: "Sophia Martinez",
      role: "Automotive Market Analyst",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    },
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80",
    featured: false,
  },
  {
    id: "blog-6",
    slug: "the-evolution-of-autonomous-driving-tech",
    title: "Level 4 Autonomous Driving: What to Expect in Consumer Vehicles",
    excerpt:
      "Examining solid-state LiDAR sensor suites, edge AI spatial mapping, and safety regulations guiding hands-free highway cruising.",
    category: "EV & Tech",
    readTime: "6 min read",
    date: "Jul 30, 2026",
    author: {
      name: "Marcus Vance",
      role: "Chief Automotive Editor",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    },
    image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80",
    featured: false,
  },
];

export default async function BlogsPage({ searchParams }) {
  const params = await searchParams;
  const selectedCategory = params?.category || "ALL";
  const searchQuery = params?.search || "";

  const categories = [
    "ALL",
    "EV & Tech",
    "Buying Guides",
    "AI & Innovations",
    "Maintenance",
    "Market Trends",
  ];

  const featuredPost = blogPosts.find((p) => p.featured) || blogPosts[0];

  const filteredPosts = blogPosts.filter((p) => {
    const matchesCat =
      selectedCategory === "ALL" ||
      p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      searchQuery === "" ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50/60">
      {/* ── TOP HERO HEADER (BEHIND NAVBAR) ──────────────────── */}
      <div className="relative overflow-hidden bg-[#030a18] text-white pt-28 sm:pt-32 md:pt-36 pb-24 md:pb-32 border-b border-slate-900 shadow-xl">
        {/* CLEAR & VIBRANT BACKGROUND IMAGE */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <Image
            src="/blogs-header.jpg"
            alt="Editorial hypercar cover"
            fill
            priority
            unoptimized
            className="object-cover object-center brightness-105 contrast-105"
          />
          {/* DELICATE SUBTLE LIGHT VIGNETTE SO CAR AND SPOTLIGHT ARE PROMINENT */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#030a18] via-black/30 to-[#030a18]/60 z-10" />
          <div className="absolute inset-0 bg-black/20 z-10" />
        </div>

        {/* HERO TITLE CONTAINER WITH CLEAR GLASS BACKDROP */}
        <div className="container mx-auto px-4 max-w-6xl relative z-20 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 bg-slate-900/80 border border-slate-700/80 text-blue-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-lg mx-auto">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Automotive Journal & Editorial</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] max-w-3xl mx-auto">
            The Vehiql Magazine
          </h1>

          <p className="text-blue-50 text-xs sm:text-sm md:text-base font-medium leading-relaxed max-w-2xl mx-auto drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
            Discover in-depth supercar road tests, electric vehicle intelligence, AI computer vision breakthroughs, and collector car market valuations.
          </p>
        </div>
      </div>

      {/* ── MAIN EDITORIAL CONTENT CONTAINER ─────────────────── */}
      <div className="container mx-auto px-4 max-w-6xl -mt-8 md:-mt-10 relative z-20 space-y-12 pb-24">
        {/* ── FEATURED STORY HERO CARD ───────────────────────── */}
        {featuredPost && (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 group transition-all duration-300 hover:shadow-2xl">
            {/* FEATURED IMAGE */}
            <div className="lg:col-span-7 h-72 sm:h-96 lg:h-[440px] relative overflow-hidden bg-slate-950">
              <Image
                src={featuredPost.image}
                alt={featuredPost.title}
                fill
                priority
                unoptimized
                className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
              />
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                <span className="bg-blue-600 text-white text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> Featured Story
                </span>
                <span className="bg-slate-900/85 backdrop-blur-md text-slate-200 text-[11px] font-bold px-3 py-1 rounded-full shadow-md">
                  {featuredPost.category}
                </span>
              </div>
            </div>

            {/* FEATURED STORY DETAILS */}
            <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-3.5">
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    {featuredPost.date}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-indigo-600" />
                    {featuredPost.readTime}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
                  {featuredPost.title}
                </h2>

                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  {featuredPost.excerpt}
                </p>
              </div>

              {/* AUTHOR ROW & ACTION */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full relative overflow-hidden border border-slate-200 shadow-sm flex-shrink-0">
                    <Image
                      src={featuredPost.author.avatar}
                      alt={featuredPost.author.name}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{featuredPost.author.name}</h4>
                    <p className="text-[11px] text-slate-400 font-medium">{featuredPost.author.role}</p>
                  </div>
                </div>

                <Button className="bg-blue-600 hover:bg-blue-500 text-white rounded-full text-xs font-extrabold px-5 py-2.5 shadow-md shadow-blue-600/30 gap-1.5" asChild>
                  <Link href={`#`}>
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ── FILTER & SEARCH TOOLBAR ────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          {/* CATEGORY CHIPS */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {categories.map((cat) => {
              const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();
              return (
                <Link
                  key={cat}
                  href={`/blogs?category=${encodeURIComponent(cat)}${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ""}`}
                >
                  <span
                    className={`cursor-pointer px-3.5 py-1.5 text-xs rounded-full transition-all font-bold inline-block ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900"
                    }`}
                  >
                    {cat === "ALL" ? "All Articles" : cat}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* SEARCH INPUT */}
          <form method="GET" action="/blogs" className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            <input type="hidden" name="category" value={selectedCategory} />
            <Input
              name="search"
              defaultValue={searchQuery}
              placeholder="Search magazine articles..."
              className="pl-9 h-9 text-xs bg-slate-50 border-slate-200 rounded-xl focus-visible:ring-blue-500 w-full"
            />
          </form>
        </div>

        {/* ── ARTICLES GRID ──────────────────────────────────── */}
        {filteredPosts.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200/80 shadow-sm space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
              <BookOpen className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">No articles found</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                We couldn't find any articles matching your search criteria. Try browsing another category or clearing your search.
              </p>
            </div>
            <Button asChild className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold">
              <Link href="/blogs">View All Articles</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <Card
                key={post.id}
                className="border border-slate-200/80 shadow-sm rounded-3xl overflow-hidden bg-white flex flex-col justify-between hover:shadow-xl hover:border-blue-300 transition-all duration-300 group"
              >
                <div className="space-y-4">
                  {/* THUMBNAIL */}
                  <div className="h-52 w-full relative overflow-hidden bg-slate-950">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    />
                    <div className="absolute top-3.5 left-3.5">
                      <span className="bg-slate-900/90 backdrop-blur-md text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="p-6 pt-2 space-y-2.5">
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 font-semibold">
                      <span className="flex items-center gap-1 text-slate-500">
                        <Calendar className="w-3 h-3 text-blue-500" />
                        {post.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <Clock className="w-3 h-3 text-indigo-500" />
                        {post.readTime}
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                {/* AUTHOR & LINK FOOTER */}
                <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full relative overflow-hidden border border-slate-200 flex-shrink-0 shadow-xs">
                      <Image
                        src={post.author.avatar}
                        alt={post.author.name}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-bold text-slate-900 leading-tight">
                        {post.author.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-medium leading-none">
                        {post.author.role}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`#`}
                    className="inline-flex items-center gap-1 text-xs font-black text-blue-600 hover:text-blue-700 transition-colors group/link"
                  >
                    <span>Read</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* ── NEWSLETTER SUBSCRIPTION CARD ───────────────────── */}
        <div className="bg-gradient-to-r from-[#030b1b] via-[#051329] to-[#081b3a] text-white rounded-3xl md:rounded-[2.25rem] p-8 sm:p-12 text-center max-w-4xl mx-auto space-y-6 shadow-2xl border border-slate-800/80 relative overflow-hidden">
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-1.5 bg-blue-500/20 border border-blue-400/30 text-blue-300 px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mx-auto">
              <Mail className="w-3 h-3" />
              <span>VIP Automotive Digest</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white">
              Stay Ahead of the Auto World
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed font-medium">
              Join 12,000+ car collectors and driving enthusiasts. Get weekly supercar reviews, market valuation insights, and VIP test drive alerts delivered to your inbox.
            </p>
          </div>

          <form
            action="#"
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto relative z-10"
          >
            <Input
              type="email"
              placeholder="Enter your email address..."
              className="bg-slate-900/80 border-slate-700 text-white placeholder:text-slate-400 text-xs rounded-full h-12 px-5 focus-visible:ring-blue-500"
            />
            <Button
              type="button"
              className="bg-blue-600 hover:bg-blue-500 text-white rounded-full text-xs font-extrabold h-12 px-8 shadow-lg shadow-blue-600/30 flex-shrink-0"
            >
              Subscribe
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
