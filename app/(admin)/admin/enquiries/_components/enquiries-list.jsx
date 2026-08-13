"use client";

import {
  deleteEnquiry,
  getAdminEnquiries,
  updateEnquiryStatus,
} from "@/action/enquiries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Archive,
  Calendar,
  Car,
  CheckCircle,
  Clock,
  Eye,
  Inbox,
  Mail,
  MessageSquare,
  MoreVertical,
  Phone,
  RefreshCw,
  Reply,
  Search,
  Trash2,
  User,
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
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function EnquiriesList({ initialStats = { total: 0, unread: 0, read: 0, replied: 0 } }) {
  const [isPending, startTransition] = useTransition();
  const [enquiries, setEnquiries] = useState([]);
  const [stats, setStats] = useState(initialStats);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // View / Reply Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [replyText, setReplyText] = useState("");

  const fetchEnquiriesList = async () => {
    setLoading(true);
    const res = await getAdminEnquiries({
      search,
      statusFilter,
    });
    if (res.success) {
      setEnquiries(res.enquiries);
      setStats(res.stats);
    } else {
      toast.error(res.error || "Failed to load customer enquiries");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEnquiriesList();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchEnquiriesList();
  };

  const handleOpenModal = async (enquiry) => {
    setSelectedEnquiry(enquiry);
    setReplyText("");
    setModalOpen(true);

    // Automatically mark as READ if currently UNREAD
    if (enquiry.status === "UNREAD") {
      const res = await updateEnquiryStatus(enquiry.id, "READ");
      if (res.success) {
        setEnquiries((prev) =>
          prev.map((e) => (e.id === enquiry.id ? { ...e, status: "READ" } : e))
        );
        setStats((prev) => ({
          ...prev,
          unread: Math.max(0, prev.unread - 1),
          read: prev.read + 1,
        }));
      }
    }
  };

  const handleStatusChange = async (enquiryId, newStatus) => {
    startTransition(async () => {
      const res = await updateEnquiryStatus(enquiryId, newStatus);
      if (res.success) {
        toast.success(`Enquiry marked as ${newStatus}`);
        setEnquiries((prev) =>
          prev.map((e) => (e.id === enquiryId ? { ...e, status: newStatus } : e))
        );
      } else {
        toast.error(res.error || "Failed to update status");
      }
    });
  };

  const handleDeleteEnquiry = async (enquiryId) => {
    if (!confirm("Are you sure you want to delete this customer enquiry?")) return;

    startTransition(async () => {
      const res = await deleteEnquiry(enquiryId);
      if (res.success) {
        toast.success("Enquiry deleted");
        setEnquiries((prev) => prev.filter((e) => e.id !== enquiryId));
      } else {
        toast.error(res.error || "Failed to delete enquiry");
      }
    });
  };

  const handleMarkReplied = async () => {
    if (!selectedEnquiry) return;
    const res = await updateEnquiryStatus(selectedEnquiry.id, "REPLIED");
    if (res.success) {
      toast.success("Enquiry status updated to REPLIED");
      setEnquiries((prev) =>
        prev.map((e) => (e.id === selectedEnquiry.id ? { ...e, status: "REPLIED" } : e))
      );
      setModalOpen(false);
    } else {
      toast.error(res.error || "Failed to update status");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "UNREAD":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 font-bold animate-pulse">
            Unread
          </Badge>
        );
      case "READ":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-semibold">
            Read
          </Badge>
        );
      case "REPLIED":
        return (
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold">
            Replied
          </Badge>
        );
      case "ARCHIVED":
        return (
          <Badge variant="outline" className="bg-slate-100 text-slate-600 border-slate-200">
            Archived
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Total Received</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{stats.total}</p>
          </div>
          <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <Inbox className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Unread Enquiries</p>
            <p className="text-2xl font-black text-amber-600 mt-1">{stats.unread}</p>
          </div>
          <div className="h-10 w-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Read Messages</p>
            <p className="text-2xl font-black text-blue-600 mt-1">{stats.read}</p>
          </div>
          <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <Eye className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Replied</p>
            <p className="text-2xl font-black text-emerald-600 mt-1">{stats.replied}</p>
          </div>
          <div className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <CheckCircle className="w-5 h-5" />
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
              <SelectItem value="ALL">All Enquiries</SelectItem>
              <SelectItem value="UNREAD">Unread Only</SelectItem>
              <SelectItem value="READ">Read Only</SelectItem>
              <SelectItem value="REPLIED">Replied Only</SelectItem>
              <SelectItem value="ARCHIVED">Archived</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={fetchEnquiriesList}
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
              placeholder="Search customer, subject, message..."
            />
          </div>
          <Button type="submit" variant="secondary" className="text-xs rounded-xl">
            Search
          </Button>
        </form>
      </div>

      {/* ENQUIRIES TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-slate-500 space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-600" />
            <p className="text-sm font-medium">Loading customer enquiries...</p>
          </div>
        ) : enquiries.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
              <Inbox className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">No customer enquiries</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                No customer messages or vehicle enquiries match your search or filter.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/80">
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Subject & Preview</TableHead>
                  <TableHead>Vehicle Ref</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Received Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enquiries.map((item) => (
                  <TableRow
                    key={item.id}
                    className={`hover:bg-slate-50/50 cursor-pointer ${
                      item.status === "UNREAD" ? "bg-amber-50/30 font-medium" : ""
                    }`}
                    onClick={() => handleOpenModal(item)}
                  >
                    {/* CUSTOMER INFO */}
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-blue-600" /> {item.name}
                        </p>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-400" /> {item.email}
                        </p>
                        {item.phone && (
                          <p className="text-[11px] text-slate-500 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-emerald-600" /> {item.phone}
                          </p>
                        )}
                      </div>
                    </TableCell>

                    {/* SUBJECT & PREVIEW */}
                    <TableCell className="max-w-xs">
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {item.subject || "General Customer Enquiry"}
                        </p>
                        <p className="text-[11px] text-slate-500 line-clamp-2">
                          {item.message}
                        </p>
                      </div>
                    </TableCell>

                    {/* VEHICLE REFERENCE */}
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      {item.car ? (
                        <div className="flex items-center gap-2">
                          <div className="h-9 w-12 relative rounded bg-slate-100 overflow-hidden border flex-shrink-0">
                            {item.car.image?.[0] ? (
                              <Image
                                src={item.car.image[0]}
                                alt={item.car.model}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <Car className="w-5 h-5 m-auto text-slate-400" />
                            )}
                          </div>
                          <div className="text-[11px]">
                            <p className="font-bold text-slate-900 truncate">
                              {item.car.year} {item.car.make} {item.car.model}
                            </p>
                            <p className="text-blue-600 font-semibold">
                              ${Number(item.car.price).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400">General Contact</span>
                      )}
                    </TableCell>

                    {/* STATUS */}
                    <TableCell>{getStatusBadge(item.status)}</TableCell>

                    {/* RECEIVED DATE */}
                    <TableCell className="text-xs text-slate-600">
                      {formatDateDisplay(item.createdAt)}
                    </TableCell>

                    {/* ACTIONS */}
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                            <MoreVertical className="h-4 w-4 text-slate-500" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuItem
                            onClick={() => handleOpenModal(item)}
                            className="text-xs gap-2"
                          >
                            <Eye className="w-3.5 h-3.5 text-blue-600" /> View & Reply
                          </DropdownMenuItem>

                          {item.status !== "REPLIED" && (
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(item.id, "REPLIED")}
                              className="text-xs gap-2"
                            >
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Mark Replied
                            </DropdownMenuItem>
                          )}

                          {item.status !== "ARCHIVED" && (
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(item.id, "ARCHIVED")}
                              className="text-xs gap-2"
                            >
                              <Archive className="w-3.5 h-3.5 text-slate-500" /> Archive
                            </DropdownMenuItem>
                          )}

                          <DropdownMenuItem
                            onClick={() => handleDeleteEnquiry(item.id)}
                            className="text-xs text-rose-600 focus:text-rose-600 gap-2 border-t mt-1 pt-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete Message
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

      {/* VIEW & REPLY DIALOG */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <MessageSquare className="w-5 h-5 text-blue-600" /> Customer Message & Enquiry
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Received on {formatDateDisplay(selectedEnquiry?.createdAt)}
            </DialogDescription>
          </DialogHeader>

          {selectedEnquiry && (
            <div className="space-y-4 py-2 text-xs">
              {/* CUSTOMER CONTACT CARD */}
              <div className="bg-slate-50 p-4 rounded-xl space-y-2 border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{selectedEnquiry.name}</span>
                  <div>{getStatusBadge(selectedEnquiry.status)}</div>
                </div>
                <div className="flex flex-wrap gap-4 text-slate-600 pt-1">
                  <a
                    href={`mailto:${selectedEnquiry.email}`}
                    className="flex items-center gap-1.5 text-blue-600 hover:underline"
                  >
                    <Mail className="w-3.5 h-3.5" /> {selectedEnquiry.email}
                  </a>
                  {selectedEnquiry.phone && (
                    <a
                      href={`tel:${selectedEnquiry.phone}`}
                      className="flex items-center gap-1.5 text-emerald-600 hover:underline"
                    >
                      <Phone className="w-3.5 h-3.5" /> {selectedEnquiry.phone}
                    </a>
                  )}
                </div>
              </div>

              {/* VEHICLE REF IF ANY */}
              {selectedEnquiry.car && (
                <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100 flex items-center gap-3">
                  <Car className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-slate-900">
                      Inquiry for: {selectedEnquiry.car.year} {selectedEnquiry.car.make} {selectedEnquiry.car.model}
                    </p>
                    <p className="text-blue-600 font-semibold">
                      Listed at ${Number(selectedEnquiry.car.price).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}

              {/* SUBJECT & FULL MESSAGE */}
              <div className="space-y-1 bg-white p-4 rounded-xl border border-slate-200">
                <p className="font-extrabold text-slate-900 text-sm">
                  {selectedEnquiry.subject || "No Subject"}
                </p>
                <p className="text-slate-700 whitespace-pre-wrap leading-relaxed pt-2">
                  {selectedEnquiry.message}
                </p>
              </div>

              {/* QUICK REPLY ACTIONS */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <Button
                  asChild
                  className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs gap-2 flex-1"
                >
                  <a href={`mailto:${selectedEnquiry.email}?subject=RE: ${selectedEnquiry.subject || "Vehicle Enquiry"}`}>
                    <Mail className="w-4 h-4" /> Reply via Email
                  </a>
                </Button>

                {selectedEnquiry.phone && (
                  <Button
                    asChild
                    variant="outline"
                    className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 rounded-xl text-xs gap-2 flex-1"
                  >
                    <a href={`tel:${selectedEnquiry.phone}`}>
                      <Phone className="w-4 h-4" /> Call Phone
                    </a>
                  </Button>
                )}

                <Button
                  variant="secondary"
                  onClick={handleMarkReplied}
                  className="text-xs rounded-xl gap-1.5"
                >
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Mark Replied
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
