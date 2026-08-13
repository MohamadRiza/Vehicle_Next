"use client";

import {
  deleteUserAccount,
  getAdminCustomers,
  updateUserPhone,
  updateUserRole,
} from "@/action/customers";
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
import {
  Calendar,
  CheckCircle2,
  Heart,
  Mail,
  MoreVertical,
  Phone,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  Trash2,
  User,
  UserCheck,
  UserCog,
  Users,
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

export default function CustomersList({ initialStats = { total: 0, users: 0, admins: 0 } }) {
  const [isPending, startTransition] = useTransition();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(initialStats);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  // Edit Phone Modal state
  const [editPhoneModalOpen, setEditPhoneModalOpen] = useState(false);
  const [selectedUserForPhone, setSelectedUserForPhone] = useState(null);
  const [phoneInput, setPhoneInput] = useState("");
  const [submittingPhone, setSubmittingPhone] = useState(false);

  const fetchCustomersList = async () => {
    setLoading(true);
    const res = await getAdminCustomers({
      search,
      roleFilter,
    });
    if (res.success) {
      setUsers(res.users);
      setStats(res.stats);
    } else {
      toast.error(res.error || "Failed to load customer list");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCustomersList();
  }, [roleFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCustomersList();
  };

  const handleRoleToggle = async (targetUser) => {
    const newRole = targetUser.role === "ADMIN" ? "USER" : "ADMIN";
    const confirmMsg = targetUser.role === "ADMIN"
      ? `Demote ${targetUser.name || targetUser.email} to regular USER?`
      : `Promote ${targetUser.name || targetUser.email} to ADMIN?`;

    if (!confirm(confirmMsg)) return;

    startTransition(async () => {
      const res = await updateUserRole(targetUser.id, newRole);
      if (res.success) {
        toast.success(`Role updated to ${newRole}`);
        setUsers((prev) =>
          prev.map((u) => (u.id === targetUser.id ? { ...u, role: newRole } : u))
        );
      } else {
        toast.error(res.error || "Failed to update role");
      }
    });
  };

  const openPhoneModal = (user) => {
    setSelectedUserForPhone(user);
    setPhoneInput(user.phone || "");
    setEditPhoneModalOpen(true);
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUserForPhone) return;

    setSubmittingPhone(true);
    const res = await updateUserPhone(selectedUserForPhone.id, phoneInput);
    setSubmittingPhone(false);

    if (res.success) {
      toast.success("Phone number updated");
      setEditPhoneModalOpen(false);
      setUsers((prev) =>
        prev.map((u) => (u.id === selectedUserForPhone.id ? { ...u, phone: phoneInput } : u))
      );
    } else {
      toast.error(res.error || "Failed to update phone number");
    }
  };

  const handleDeleteUser = async (targetUser) => {
    if (!confirm(`Are you sure you want to permanently delete account for ${targetUser.name || targetUser.email}?`)) {
      return;
    }

    startTransition(async () => {
      const res = await deleteUserAccount(targetUser.id);
      if (res.success) {
        toast.success("Customer account deleted");
        setUsers((prev) => prev.filter((u) => u.id !== targetUser.id));
      } else {
        toast.error(res.error || "Failed to delete account");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Total Registered</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{stats.total}</p>
          </div>
          <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Customers (Users)</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{stats.users}</p>
          </div>
          <div className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Admins</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{stats.admins}</p>
          </div>
          <div className="h-10 w-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* FILTER TOOLBAR */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-3">
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[140px] text-xs rounded-xl">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Roles</SelectItem>
              <SelectItem value="USER">User Only</SelectItem>
              <SelectItem value="ADMIN">Admin Only</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={fetchCustomersList}
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
              placeholder="Search name, email, phone..."
            />
          </div>
          <Button type="submit" variant="secondary" className="text-xs rounded-xl">
            Search
          </Button>
        </form>
      </div>

      {/* CUSTOMERS TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-slate-500 space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-600" />
            <p className="text-sm font-medium">Loading customers...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
              <Users className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">No customers found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                No accounts match your current search or role filter.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/80">
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact Phone</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Activity</TableHead>
                  <TableHead>Registered Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((cust) => (
                  <TableRow key={cust.id} className="hover:bg-slate-50/50">
                    {/* CUSTOMER NAME & EMAIL */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-slate-100 border border-slate-200 relative overflow-hidden flex-shrink-0 flex items-center justify-center font-bold text-slate-600 text-sm">
                          {cust.imageUrl ? (
                            <Image
                              src={cust.imageUrl}
                              alt={cust.name || "User"}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          ) : (
                            (cust.name || cust.email || "U").charAt(0).toUpperCase()
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">
                            {cust.name || "Unnamed Customer"}
                          </p>
                          <p className="text-[11px] text-slate-500 flex items-center gap-1 truncate">
                            <Mail className="w-3 h-3 text-slate-400" /> {cust.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* PHONE */}
                    <TableCell className="text-xs font-medium text-slate-700">
                      {cust.phone ? (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-emerald-600" /> {cust.phone}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Not provided</span>
                      )}
                    </TableCell>

                    {/* ROLE BADGE */}
                    <TableCell>
                      {cust.role === "ADMIN" ? (
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 font-semibold text-[11px] gap-1">
                          <Shield className="w-3 h-3 text-purple-600" /> Admin
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-medium text-[11px]">
                          Customer
                        </Badge>
                      )}
                    </TableCell>

                    {/* ACTIVITY COUNTS */}
                    <TableCell>
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded text-[11px] font-medium">
                          <Calendar className="w-3 h-3" /> {cust._count?.testDriveCars || 0} Drives
                        </span>
                        <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 px-2 py-0.5 rounded text-[11px] font-medium">
                          <Heart className="w-3 h-3" /> {cust._count?.savedCars || 0} Saved
                        </span>
                      </div>
                    </TableCell>

                    {/* REGISTERED DATE */}
                    <TableCell className="text-xs text-slate-600 font-medium">
                      {formatDateDisplay(cust.createdAt)}
                    </TableCell>

                    {/* ACTIONS DROPDOWN */}
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                            <MoreVertical className="h-4 w-4 text-slate-500" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuItem
                            onClick={() => handleRoleToggle(cust)}
                            className="text-xs gap-2"
                          >
                            <UserCog className="w-3.5 h-3.5 text-blue-600" />
                            {cust.role === "ADMIN" ? "Demote to User" : "Promote to Admin"}
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => openPhoneModal(cust)}
                            className="text-xs gap-2"
                          >
                            <Phone className="w-3.5 h-3.5 text-emerald-600" />
                            Edit Phone
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => handleDeleteUser(cust)}
                            className="text-xs text-rose-600 focus:text-rose-600 gap-2 border-t mt-1 pt-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete Account
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

      {/* EDIT PHONE MODAL DIALOG */}
      <Dialog open={editPhoneModalOpen} onOpenChange={setEditPhoneModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Phone className="w-5 h-5 text-emerald-600" /> Edit Contact Phone Number
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Update phone number for {selectedUserForPhone?.name || selectedUserForPhone?.email}.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handlePhoneSubmit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">Phone Number</Label>
              <Input
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="e.g. 0771234567"
                className="text-xs rounded-xl"
                required
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditPhoneModalOpen(false)}
                className="text-xs rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submittingPhone}
                className="bg-blue-600 text-white text-xs rounded-xl gap-2"
              >
                {submittingPhone ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : "Save Phone"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
