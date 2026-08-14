"use client";

import {
  createManualTestDriveBooking,
  getAdminTestDriveBookings,
  getAvailableCarsForBooking,
  rescheduleTestDrive,
  searchCustomers,
  updateTestDriveStatus,
} from "@/action/test-drive";
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
import { Label } from "@/components/ui/label";
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
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Filter,
  MessageSquare,
  MoreVertical,
  Phone,
  Plus,
  RefreshCw,
  Search,
  StickyNote,
  User,
  UserCheck,
  X,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

function formatDateDisplay(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTimeDisplay(timeString) {
  if (!timeString) return "N/A";
  if (timeString.includes("AM") || timeString.includes("PM")) return timeString;
  const [hours, minutes] = timeString.split(":");
  const h = parseInt(hours, 10);
  if (isNaN(h)) return timeString;
  const period = h >= 12 ? "PM" : "AM";
  const formattedHours = h % 12 || 12;
  return `${formattedHours}:${minutes || "00"} ${period}`;
}

export default function TestDriveList() {
  const [isPending, startTransition] = useTransition();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // View Notes Modal state
  const [notesModalOpen, setNotesModalOpen] = useState(false);
  const [selectedBookingForNotes, setSelectedBookingForNotes] = useState(null);

  // Reschedule Modal state
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [selectedBookingForReschedule, setSelectedBookingForReschedule] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newStartTime, setNewStartTime] = useState("14:00");
  const [newEndTime, setNewEndTime] = useState("15:00");

  // Manual Add Test Drive Modal state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [customerSearch, setCustomerSearch] = useState("");
  const [customerResults, setCustomerResults] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [availableCars, setAvailableCars] = useState([]);
  const [selectedCarId, setSelectedCarId] = useState("");
  const [addBookingDate, setAddBookingDate] = useState("");
  const [addStartTime, setAddStartTime] = useState("14:00");
  const [addEndTime, setAddEndTime] = useState("15:00");
  const [addPhone, setAddPhone] = useState("");
  const [addNotes, setAddNotes] = useState("");
  const [submittingAdd, setSubmittingAdd] = useState(false);

  const fetchBookingsList = async () => {
    setLoading(true);
    const res = await getAdminTestDriveBookings({
      search,
      status: statusFilter,
    });
    if (res.success) {
      setBookings(res.bookings);
    } else {
      toast.error(res.error || "Failed to load test drive bookings");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBookingsList();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchBookingsList();
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    startTransition(async () => {
      const res = await updateTestDriveStatus(bookingId, newStatus);
      if (res.success) {
        toast.success(`Booking status updated to ${newStatus}`);
        setBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
        );
      } else {
        toast.error(res.error || "Failed to update status");
      }
    });
  };

  const openNotesModal = (booking) => {
    setSelectedBookingForNotes(booking);
    setNotesModalOpen(true);
  };

  const openRescheduleModal = (booking) => {
    setSelectedBookingForReschedule(booking);
    const d = booking.bookingDate ? new Date(booking.bookingDate).toISOString().split("T")[0] : "";
    setNewDate(d);
    setNewStartTime(booking.startTime || "14:00");
    setNewEndTime(booking.endTime || "15:00");
    setRescheduleModalOpen(true);
  };

  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBookingForReschedule || !newDate || !newStartTime) {
      toast.error("Please provide valid date and time");
      return;
    }

    startTransition(async () => {
      const res = await rescheduleTestDrive(selectedBookingForReschedule.id, {
        bookingDate: newDate,
        startTime: newStartTime,
        endTime: newEndTime,
      });

      if (res.success) {
        toast.success("Test drive rescheduled & confirmed!");
        setRescheduleModalOpen(false);
        fetchBookingsList();
      } else {
        toast.error(res.error || "Failed to reschedule test drive");
      }
    });
  };

  // Open Add Modal & fetch available cars & customers
  const openAddModal = async () => {
    setAddModalOpen(true);
    // Fetch available cars
    const carRes = await getAvailableCarsForBooking();
    if (carRes.success) {
      setAvailableCars(carRes.cars);
      if (carRes.cars.length > 0) setSelectedCarId(carRes.cars[0].id);
    }
    // Initial customers fetch
    const custRes = await searchCustomers("");
    if (custRes.success) {
      setCustomerResults(custRes.users);
      if (custRes.users.length > 0) {
        setSelectedCustomer(custRes.users[0]);
        setAddPhone(custRes.users[0].phone || "");
      }
    }
    setAddBookingDate(new Date().toISOString().split("T")[0]);
  };

  const handleCustomerSearch = async (val) => {
    setCustomerSearch(val);
    const custRes = await searchCustomers(val);
    if (custRes.success) {
      setCustomerResults(custRes.users);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCustomer || !selectedCarId || !addBookingDate || !addStartTime) {
      toast.error("Please select customer, vehicle, date and time");
      return;
    }

    setSubmittingAdd(true);
    const res = await createManualTestDriveBooking({
      userId: selectedCustomer.id,
      carId: selectedCarId,
      bookingDate: addBookingDate,
      startTime: addStartTime,
      endTime: addEndTime,
      phone: addPhone,
      notes: addNotes,
    });

    setSubmittingAdd(false);

    if (res.success) {
      toast.success("Test drive manually assigned & created!");
      setAddModalOpen(false);
      fetchBookingsList();
    } else {
      toast.error(res.error || "Failed to create manual test drive");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            Pending
          </Badge>
        );
      case "CONFIRMED":
        return (
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
            Confirmed
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Completed
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200">
            Cancelled
          </Badge>
        );
      case "NO_SHOW":
        return (
          <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-200">
            No Show
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* TOOLBAR */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-3">
          <Button
            onClick={openAddModal}
            className="bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-2 shadow-md shadow-blue-600/20 rounded-xl text-xs font-semibold"
          >
            <Plus className="h-4 w-4" /> + Assign Test Drive
          </Button>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] text-xs rounded-xl">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="CONFIRMED">Confirmed</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={fetchBookingsList}
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
              placeholder="Search customer, vehicle..."
            />
          </div>
          <Button type="submit" variant="secondary" className="text-xs rounded-xl">
            Search
          </Button>
        </form>
      </div>

      {/* BOOKINGS TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-slate-500 space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-600" />
            <p className="text-sm font-medium">Loading test drive bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
              <Calendar className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">No test drive bookings found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                No bookings match your current search or filter. Assign a manual test drive or check back later.
              </p>
            </div>
            <Button onClick={openAddModal} className="bg-blue-600 hover:bg-blue-500 text-white gap-2 rounded-xl">
              <Plus className="w-4 h-4" /> + Assign Test Drive
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/80">
                <TableRow>
                  <TableHead className="w-[90px]">Booking ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Special Notes</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id} className="hover:bg-slate-50/50">
                    {/* BOOKING ID */}
                    <TableCell>
                      <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-300 font-mono text-[11px]">
                        {booking.bookingCode || `TD${booking.id.slice(0, 4).toUpperCase()}`}
                      </Badge>
                    </TableCell>

                    {/* CUSTOMER */}
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {booking.user?.name ? booking.user.name.charAt(0).toUpperCase() : "C"}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">
                            {booking.user?.name || "Customer"}
                          </p>
                          <p className="text-[11px] text-slate-500 truncate">
                            {booking.user?.email || "No email"}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* VEHICLE */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-9 w-12 relative rounded bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                          {booking.car?.image?.[0] ? (
                            <Image
                              src={booking.car.image[0]}
                              alt={booking.car.model}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <Calendar className="w-4 h-4 m-auto text-slate-400" />
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 truncate">
                            {booking.car ? `${booking.car.year} ${booking.car.make} ${booking.car.model}` : "Vehicle"}
                          </p>
                          <p className="text-[10px] text-slate-500 capitalize">
                            {booking.car?.bodyType || ""}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* DATE */}
                    <TableCell className="text-xs font-semibold text-slate-800">
                      {formatDateDisplay(booking.bookingDate)}
                    </TableCell>

                    {/* TIME */}
                    <TableCell className="text-xs font-semibold text-slate-800">
                      {formatTimeDisplay(booking.startTime)}
                    </TableCell>

                    {/* PHONE */}
                    <TableCell className="text-xs text-slate-600 font-medium">
                      {booking.user?.phone || booking.phone || "07XXXXXXXX"}
                    </TableCell>

                    {/* SPECIAL NOTES COLUMN */}
                    <TableCell className="max-w-[200px]">
                      {booking.notes ? (
                        <button
                          type="button"
                          onClick={() => openNotesModal(booking)}
                          className="flex items-center gap-1.5 text-xs text-amber-900 bg-amber-50 border border-amber-200/80 p-1.5 px-2.5 rounded-xl hover:bg-amber-100 transition-colors w-full text-left group"
                          title="Click to view full notes"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 group-hover:scale-110 transition-transform" />
                          <span className="truncate font-medium">{booking.notes}</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">No notes</span>
                      )}
                    </TableCell>

                    {/* STATUS */}
                    <TableCell>{getStatusBadge(booking.status)}</TableCell>

                    {/* QUICK ACTION BUTTONS [Approve] [Reject] [Reschedule] */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* APPROVE BUTTON */}
                        {booking.status !== "CONFIRMED" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusUpdate(booking.id, "CONFIRMED")}
                            className="h-8 text-xs bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 border-emerald-200 gap-1 px-2.5 rounded-lg"
                            title="Approve Booking"
                          >
                            <Check className="w-3.5 h-3.5" /> Approve
                          </Button>
                        )}

                        {/* REJECT BUTTON */}
                        {booking.status !== "CANCELLED" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusUpdate(booking.id, "CANCELLED")}
                            className="h-8 text-xs bg-rose-50 text-rose-700 hover:bg-rose-100 hover:text-rose-800 border-rose-200 gap-1 px-2.5 rounded-lg"
                            title="Reject Booking"
                          >
                            <X className="w-3.5 h-3.5" /> Reject
                          </Button>
                        )}

                        {/* RESCHEDULE BUTTON */}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openRescheduleModal(booking)}
                          className="h-8 text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 border-blue-200 gap-1 px-2.5 rounded-lg"
                          title="Reschedule Booking"
                        >
                          <Clock className="w-3.5 h-3.5" /> Reschedule
                        </Button>

                        {/* MORE DROPDOWN */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                              <MoreVertical className="h-4 w-4 text-slate-500" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            {booking.notes && (
                              <DropdownMenuItem
                                onClick={() => openNotesModal(booking)}
                                className="text-xs gap-2 text-amber-700"
                              >
                                <StickyNote className="w-3.5 h-3.5 text-amber-600" />
                                View Special Notes
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => handleStatusUpdate(booking.id, "COMPLETED")}
                              className="text-xs gap-2"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                              Mark Completed
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleStatusUpdate(booking.id, "NO_SHOW")}
                              className="text-xs gap-2 text-slate-600"
                            >
                              <XCircle className="w-3.5 h-3.5 text-slate-400" />
                              Mark No Show
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

      {/* VIEW SPECIAL NOTES MODAL DIALOG */}
      <Dialog open={notesModalOpen} onOpenChange={setNotesModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg text-amber-900">
              <MessageSquare className="w-5 h-5 text-amber-600" /> Special Requests & Notes
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Submitted by customer {selectedBookingForNotes?.user?.name || "Customer"} for test drive appointment.
            </DialogDescription>
          </DialogHeader>

          <div className="py-3">
            <div className="bg-amber-50/80 border border-amber-200 p-4 rounded-2xl space-y-2 text-xs text-slate-800">
              <p className="font-semibold text-amber-900 text-xs">Customer Message / Instructions:</p>
              <p className="whitespace-pre-line leading-relaxed text-slate-700 font-medium">
                {selectedBookingForNotes?.notes || "No additional notes provided."}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              onClick={() => setNotesModalOpen(false)}
              className="text-xs rounded-xl bg-slate-900 hover:bg-slate-800 text-white w-full"
            >
              Close Notes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* RESCHEDULE MODAL DIALOG */}
      <Dialog open={rescheduleModalOpen} onOpenChange={setRescheduleModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Clock className="w-5 h-5 text-blue-600" /> Reschedule Test Drive
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Select a new date and time for {selectedBookingForReschedule?.user?.name}'s test drive of{" "}
              {selectedBookingForReschedule?.car ? `${selectedBookingForReschedule.car.make} ${selectedBookingForReschedule.car.model}` : "vehicle"}.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleRescheduleSubmit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">New Booking Date</Label>
              <Input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="text-xs rounded-xl"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">Start Time</Label>
                <Input
                  type="time"
                  value={newStartTime}
                  onChange={(e) => setNewStartTime(e.target.value)}
                  className="text-xs rounded-xl"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">End Time</Label>
                <Input
                  type="time"
                  value={newEndTime}
                  onChange={(e) => setNewEndTime(e.target.value)}
                  className="text-xs rounded-xl"
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setRescheduleModalOpen(false)}
                className="text-xs rounded-xl"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending} className="bg-blue-600 text-white text-xs rounded-xl">
                Confirm Reschedule
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MANUAL ASSIGN TEST DRIVE MODAL DIALOG */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="sm:max-w-lg rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <UserCheck className="w-5 h-5 text-blue-600" /> Manually Assign Test Drive
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Search and select a customer, choose an available vehicle, and assign a test drive slot.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddSubmit} className="space-y-4 py-2">
            {/* STEP 1: SELECT CUSTOMER */}
            <div className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
              <Label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                <span>1. Select Customer</span>
                {selectedCustomer && (
                  <span className="text-blue-600 font-medium">Selected: {selectedCustomer.name}</span>
                )}
              </Label>

              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <Input
                  value={customerSearch}
                  onChange={(e) => handleCustomerSearch(e.target.value)}
                  placeholder="Search customer by name or email..."
                  className="pl-8 text-xs bg-white rounded-lg"
                />
              </div>

              {/* CUSTOMER SEARCH RESULTS LIST */}
              <div className="max-h-32 overflow-y-auto space-y-1 pt-1">
                {customerResults.length === 0 ? (
                  <p className="text-[11px] text-slate-400 text-center py-2">No customers found</p>
                ) : (
                  customerResults.map((cust) => (
                    <div
                      key={cust.id}
                      onClick={() => {
                        setSelectedCustomer(cust);
                        setAddPhone(cust.phone || "");
                      }}
                      className={`p-2 rounded-lg text-xs cursor-pointer flex items-center justify-between transition-colors ${
                        selectedCustomer?.id === cust.id
                          ? "bg-blue-600 text-white font-medium shadow-sm"
                          : "bg-white hover:bg-slate-100 text-slate-800 border border-slate-100"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <User className="w-3.5 h-3.5 flex-shrink-0" />
                        <div className="truncate">
                          <span className="font-bold">{cust.name}</span>
                          <span className="ml-1 opacity-80 text-[11px]">({cust.email})</span>
                        </div>
                      </div>
                      {selectedCustomer?.id === cust.id && <Check className="w-3.5 h-3.5" />}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* STEP 2: SELECT VEHICLE */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">2. Select Available Vehicle</Label>
              <Select value={selectedCarId} onValueChange={setSelectedCarId}>
                <SelectTrigger className="text-xs rounded-xl">
                  <SelectValue placeholder="Select vehicle" />
                </SelectTrigger>
                <SelectContent>
                  {availableCars.length === 0 ? (
                    <SelectItem value="none" disabled>No available cars</SelectItem>
                  ) : (
                    availableCars.map((car) => (
                      <SelectItem key={car.id} value={car.id}>
                        {car.year} {car.make} {car.model} — ${Number(car.price || 0).toLocaleString()}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* STEP 3: SCHEDULE DETAILS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">Booking Date</Label>
                <Input
                  type="date"
                  value={addBookingDate}
                  onChange={(e) => setAddBookingDate(e.target.value)}
                  className="text-xs rounded-xl"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">Start Time</Label>
                <Input
                  type="time"
                  value={addStartTime}
                  onChange={(e) => setAddStartTime(e.target.value)}
                  className="text-xs rounded-xl"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">End Time</Label>
                <Input
                  type="time"
                  value={addEndTime}
                  onChange={(e) => setAddEndTime(e.target.value)}
                  className="text-xs rounded-xl"
                />
              </div>
            </div>

            {/* PHONE & NOTES */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">Customer Phone Number</Label>
              <Input
                value={addPhone}
                onChange={(e) => setAddPhone(e.target.value)}
                placeholder="e.g. 0771234567"
                className="text-xs rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">Admin Notes (Optional)</Label>
              <Textarea
                value={addNotes}
                onChange={(e) => setAddNotes(e.target.value)}
                placeholder="Add special requests or notes..."
                className="text-xs rounded-xl h-20"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setAddModalOpen(false)}
                className="text-xs rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submittingAdd || !selectedCustomer || !selectedCarId}
                className="bg-blue-600 text-white text-xs rounded-xl gap-2"
              >
                {submittingAdd ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                Assign Test Drive
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
