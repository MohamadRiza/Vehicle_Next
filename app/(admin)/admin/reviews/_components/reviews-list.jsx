"use client";

import {
  deleteReview,
  getAdminReviews,
  updateReviewStatus,
} from "@/action/reviews";
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
  Clock,
  Mail,
  MessageSquare,
  MoreVertical,
  RefreshCw,
  Search,
  Star,
  StarHalf,
  ThumbsDown,
  ThumbsUp,
  Trash2,
  User,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

function formatDateDisplay(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5 text-amber-400">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-3.5 h-3.5 ${
            star <= rating ? "fill-amber-400 text-amber-400" : "text-slate-200 fill-slate-100"
          }`}
        />
      ))}
    </div>
  );
}

export default function ReviewsList({ initialStats = { total: 0, pending: 0, approved: 0, rejected: 0, avgRating: "0.0" } }) {
  const [isPending, startTransition] = useTransition();
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(initialStats);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const fetchReviewsList = async () => {
    setLoading(true);
    const res = await getAdminReviews({
      search,
      statusFilter,
    });
    if (res.success) {
      setReviews(res.reviews);
      setStats(res.stats);
    } else {
      toast.error(res.error || "Failed to load customer reviews");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReviewsList();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchReviewsList();
  };

  const handleStatusUpdate = async (reviewId, newStatus) => {
    startTransition(async () => {
      const res = await updateReviewStatus(reviewId, newStatus);
      if (res.success) {
        toast.success(`Review ${newStatus.toLowerCase()} successfully`);
        setReviews((prev) =>
          prev.map((r) => (r.id === reviewId ? { ...r, status: newStatus } : r))
        );
      } else {
        toast.error(res.error || "Failed to update review status");
      }
    });
  };

  const handleDeleteReview = async (reviewId) => {
    if (!confirm("Are you sure you want to permanently delete this customer review?")) return;

    startTransition(async () => {
      const res = await deleteReview(reviewId);
      if (res.success) {
        toast.success("Review permanently deleted");
        setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      } else {
        toast.error(res.error || "Failed to delete review");
      }
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 font-bold animate-pulse">
            Pending Approval
          </Badge>
        );
      case "APPROVED":
        return (
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold">
            Approved & Published
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 font-semibold">
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Total Reviews</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{stats.total}</p>
          </div>
          <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <Star className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Pending Approval</p>
            <p className="text-2xl font-black text-amber-600 mt-1">{stats.pending}</p>
          </div>
          <div className="h-10 w-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Approved Reviews</p>
            <p className="text-2xl font-black text-emerald-600 mt-1">{stats.approved}</p>
          </div>
          <div className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Average Rating</p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-2xl font-black text-slate-900">{stats.avgRating}</span>
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            </div>
          </div>
          <div className="h-10 w-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
            <Star className="w-5 h-5 fill-amber-400" />
          </div>
        </div>
      </div>

      {/* FILTER TOOLBAR */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] text-xs rounded-xl">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Reviews</SelectItem>
              <SelectItem value="PENDING">Pending Only</SelectItem>
              <SelectItem value="APPROVED">Approved Only</SelectItem>
              <SelectItem value="REJECTED">Rejected Only</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={fetchReviewsList}
            title="Refresh"
            disabled={loading}
            className="rounded-xl"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>

        <form onSubmit={handleSearchSubmit} className="flex w-full sm:w-auto gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              className="pl-9 text-xs rounded-xl"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="search"
              placeholder="Search author, title, comment..."
            />
          </div>
          <Button type="submit" variant="secondary" className="text-xs rounded-xl">
            Search
          </Button>
        </form>
      </div>

      {/* REVIEWS TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-slate-500 space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-600" />
            <p className="text-sm font-medium">Loading customer reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
              <Star className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">No reviews found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                No customer reviews match your current search or status filter.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/80">
                <TableRow>
                  <TableHead>Reviewer</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Review Content</TableHead>
                  <TableHead>Vehicle Ref</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviews.map((r) => (
                  <TableRow key={r.id} className="hover:bg-slate-50/50">
                    {/* REVIEWER INFO */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-slate-100 border border-slate-200 relative overflow-hidden flex-shrink-0 flex items-center justify-center font-bold text-slate-600 text-xs">
                          {r.user?.imageUrl ? (
                            <Image
                              src={r.user.imageUrl}
                              alt={r.authorName}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          ) : (
                            r.authorName.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">{r.authorName}</p>
                          {r.authorEmail && (
                            <p className="text-[11px] text-slate-500 flex items-center gap-1 truncate">
                              <Mail className="w-3 h-3 text-slate-400" /> {r.authorEmail}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    {/* RATING */}
                    <TableCell>
                      <div className="space-y-1">
                        <StarRating rating={r.rating} />
                        <span className="text-[11px] font-bold text-slate-700">{r.rating} / 5</span>
                      </div>
                    </TableCell>

                    {/* REVIEW CONTENT */}
                    <TableCell className="max-w-xs">
                      <div className="space-y-1">
                        {r.title && (
                          <p className="text-xs font-extrabold text-slate-900 truncate">{r.title}</p>
                        )}
                        <p className="text-[11px] text-slate-600 line-clamp-3 leading-relaxed">
                          "{r.comment}"
                        </p>
                      </div>
                    </TableCell>

                    {/* VEHICLE REF */}
                    <TableCell>
                      {r.car ? (
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-11 relative rounded bg-slate-100 overflow-hidden border flex-shrink-0">
                            {r.car.image?.[0] ? (
                              <Image
                                src={r.car.image[0]}
                                alt={r.car.model}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <Car className="w-4 h-4 m-auto text-slate-400" />
                            )}
                          </div>
                          <div className="text-[11px]">
                            <p className="font-bold text-slate-900 truncate">
                              {r.car.year} {r.car.make} {r.car.model}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400">Showroom General</span>
                      )}
                    </TableCell>

                    {/* STATUS */}
                    <TableCell>{getStatusBadge(r.status)}</TableCell>

                    {/* SUBMITTED DATE */}
                    <TableCell className="text-xs text-slate-600">
                      {formatDateDisplay(r.createdAt)}
                    </TableCell>

                    {/* QUICK ACTIONS */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {r.status !== "APPROVED" && (
                          <Button
                            size="sm"
                            onClick={() => handleStatusUpdate(r.id, "APPROVED")}
                            disabled={isPending}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs h-8 px-2.5 rounded-lg gap-1"
                            title="Approve Review"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" /> Approve
                          </Button>
                        )}

                        {r.status !== "REJECTED" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusUpdate(r.id, "REJECTED")}
                            disabled={isPending}
                            className="border-rose-200 text-rose-600 hover:bg-rose-50 text-xs h-8 px-2 rounded-lg gap-1"
                            title="Reject Review"
                          >
                            <ThumbsDown className="w-3.5 h-3.5" /> Reject
                          </Button>
                        )}

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                              <MoreVertical className="h-4 w-4 text-slate-500" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem
                              onClick={() => handleDeleteReview(r.id)}
                              className="text-xs text-rose-600 focus:text-rose-600 gap-2"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Remove Review
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
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
