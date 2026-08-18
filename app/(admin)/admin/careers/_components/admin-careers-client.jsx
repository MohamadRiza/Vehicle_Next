"use client";

import {
  createAdminJob,
  deleteAdminJob,
  updateAdminJob,
  updateApplicationStatus,
} from "@/action/careers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Briefcase,
  Building,
  CheckCircle2,
  Clock,
  DollarSign,
  Download,
  Edit3,
  ExternalLink,
  Eye,
  FileCheck,
  FileText,
  Filter,
  Globe,
  ImageIcon,
  Mail,
  MapPin,
  Phone,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Trash2,
  User,
  Users,
  XCircle,
} from "lucide-react";
import React, { useState, useTransition } from "react";
import { toast } from "sonner";

export default function AdminCareersClient({ initialJobs = [] }) {
  const [jobs, setJobs] = useState(initialJobs);
  const [isPending, startTransition] = useTransition();

  // Dialog States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [viewingJob, setViewingJob] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [deptFilter, setDeptFilter] = useState("ALL");

  // New Job Form State
  const [newJob, setNewJob] = useState({
    title: "",
    department: "Sales & Concierge",
    location: "Colombo, Sri Lanka",
    type: "Full-time",
    experience: "Mid-Level (2-4 yrs)",
    salary: "$60,000 - $85,000 / yr",
    description: "",
    requirements: "",
    benefits: "",
    status: "OPEN",
  });

  const handleCreateJob = async (e) => {
    e.preventDefault();
    if (!newJob.title.trim() || !newJob.description.trim()) {
      toast.error("Please enter a job title and description.");
      return;
    }

    startTransition(async () => {
      const res = await createAdminJob(newJob);
      if (res.success) {
        toast.success("New Job Posting Created!");
        setJobs((prev) => [res.job, ...prev]);
        setIsCreateOpen(false);
        setNewJob({
          title: "",
          department: "Sales & Concierge",
          location: "Colombo, Sri Lanka",
          type: "Full-time",
          experience: "Mid-Level (2-4 yrs)",
          salary: "$60,000 - $85,000 / yr",
          description: "",
          requirements: "",
          benefits: "",
          status: "OPEN",
        });
      } else {
        toast.error(res.error || "Failed to create job posting.");
      }
    });
  };

  const handleUpdateJob = async (e) => {
    e.preventDefault();
    if (!editingJob.title.trim() || !editingJob.description.trim()) {
      toast.error("Please enter a job title and description.");
      return;
    }

    startTransition(async () => {
      const res = await updateAdminJob(editingJob.id, editingJob);
      if (res.success) {
        toast.success("Job Posting Updated Successfully!");
        setJobs((prev) =>
          prev.map((j) => (j.id === editingJob.id ? res.job : j))
        );
        setEditingJob(null);
      } else {
        toast.error(res.error || "Failed to update job posting.");
      }
    });
  };

  const handleDeleteJob = async (jobId) => {
    if (
      !confirm(
        "Are you sure you want to delete this job posting? All attached candidate applications will also be permanently deleted."
      )
    )
      return;

    startTransition(async () => {
      const res = await deleteAdminJob(jobId);
      if (res.success) {
        toast.success("Job posting deleted.");
        setJobs((prev) => prev.filter((j) => j.id !== jobId));
        if (viewingJob?.id === jobId) setViewingJob(null);
        if (editingJob?.id === jobId) setEditingJob(null);
      } else {
        toast.error(res.error || "Failed to delete job.");
      }
    });
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    startTransition(async () => {
      const res = await updateApplicationStatus(applicationId, newStatus);
      if (res.success) {
        toast.success("Application status updated.");
        // Update state in both jobs array and viewingJob dialog
        setJobs((prev) =>
          prev.map((j) => ({
            ...j,
            applications: j.applications
              ? j.applications.map((app) =>
                  app.id === applicationId ? { ...app, status: newStatus } : app
                )
              : [],
          }))
        );

        if (viewingJob) {
          setViewingJob((prev) => ({
            ...prev,
            applications: prev.applications.map((app) =>
              app.id === applicationId ? { ...app, status: newStatus } : app
            ),
          }));
        }
      } else {
        toast.error("Failed to update application status.");
      }
    });
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      searchQuery === "" ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || job.status === statusFilter;

    const matchesDept =
      deptFilter === "ALL" ||
      job.department.toLowerCase() === deptFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesDept;
  });

  const totalApplications = jobs.reduce(
    (acc, job) => acc + (job.applications?.length || 0),
    0
  );

  return (
    <div className="space-y-8">
      {/* ── TOP HEADER & ACTIONS ROW ─────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-blue-600 font-bold text-xs uppercase tracking-wider">
            <Briefcase className="w-4 h-4" />
            <span>Recruitment & Talent Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Careers & Job Postings Management
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Create, edit, and manage company job vacancies and review candidate CV submissions.
          </p>
        </div>

        {/* POST JOB TRIGGER */}
        <div className="flex items-center gap-3">
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-bold gap-2 px-5 py-2.5 shadow-md shadow-blue-600/25 cursor-pointer">
                <Plus className="w-4 h-4" />
                <span>Post New Job Opening</span>
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-2xl rounded-3xl p-6 sm:p-8 bg-white max-h-[90vh] overflow-y-auto">
              <DialogHeader className="text-left space-y-2 border-b pb-4">
                <DialogTitle className="text-xl font-black text-slate-900">
                  Create New Job Posting
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500">
                  Fill in the vacancy details to publish live on the public careers page.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleCreateJob} className="space-y-4 py-2 text-xs">
                {/* JOB TITLE */}
                <div className="space-y-1.5">
                  <Label className="font-bold text-slate-800">Job Title *</Label>
                  <Input
                    value={newJob.title}
                    onChange={(e) =>
                      setNewJob((prev) => ({ ...prev, title: e.target.value }))
                    }
                    placeholder="e.g. Senior Automotive AI Engineer"
                    className="text-xs rounded-xl bg-slate-50 border-slate-200 h-11"
                    required
                  />
                </div>

                {/* DEPARTMENT & LOCATION */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="font-bold text-slate-800">Department *</Label>
                    <Select
                      value={newJob.department}
                      onValueChange={(val) =>
                        setNewJob((prev) => ({ ...prev, department: val }))
                      }
                    >
                      <SelectTrigger className="text-xs rounded-xl bg-slate-50 border-slate-200 h-11">
                        <SelectValue placeholder="Select Department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Engineering & AI">
                          Engineering & AI
                        </SelectItem>
                        <SelectItem value="Sales & Concierge">
                          Sales & Concierge
                        </SelectItem>
                        <SelectItem value="Showroom Operations">
                          Showroom Operations
                        </SelectItem>
                        <SelectItem value="Marketing & Content">
                          Marketing & Content
                        </SelectItem>
                        <SelectItem value="Finance & Legal">
                          Finance & Legal
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="font-bold text-slate-800">Location *</Label>
                    <Input
                      value={newJob.location}
                      onChange={(e) =>
                        setNewJob((prev) => ({
                          ...prev,
                          location: e.target.value,
                        }))
                      }
                      placeholder="e.g. Colombo, Sri Lanka / Remote"
                      className="text-xs rounded-xl bg-slate-50 border-slate-200 h-11"
                      required
                    />
                  </div>
                </div>

                {/* TYPE, EXPERIENCE & SALARY */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label className="font-bold text-slate-800">Job Type</Label>
                    <Select
                      value={newJob.type}
                      onValueChange={(val) =>
                        setNewJob((prev) => ({ ...prev, type: val }))
                      }
                    >
                      <SelectTrigger className="text-xs rounded-xl bg-slate-50 border-slate-200 h-11">
                        <SelectValue placeholder="Job Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Full-time">Full-time</SelectItem>
                        <SelectItem value="Part-time">Part-time</SelectItem>
                        <SelectItem value="Contract">Contract</SelectItem>
                        <SelectItem value="Remote">Remote</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="font-bold text-slate-800">Experience</Label>
                    <Input
                      value={newJob.experience}
                      onChange={(e) =>
                        setNewJob((prev) => ({
                          ...prev,
                          experience: e.target.value,
                        }))
                      }
                      placeholder="e.g. Mid-Level (2-4 yrs)"
                      className="text-xs rounded-xl bg-slate-50 border-slate-200 h-11"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="font-bold text-slate-800">Salary / Comp</Label>
                    <Input
                      value={newJob.salary}
                      onChange={(e) =>
                        setNewJob((prev) => ({
                          ...prev,
                          salary: e.target.value,
                        }))
                      }
                      placeholder="e.g. $80k - $120k / yr"
                      className="text-xs rounded-xl bg-slate-50 border-slate-200 h-11"
                    />
                  </div>
                </div>

                {/* DESCRIPTION */}
                <div className="space-y-1.5">
                  <Label className="font-bold text-slate-800">Job Description *</Label>
                  <Textarea
                    value={newJob.description}
                    onChange={(e) =>
                      setNewJob((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Describe the primary responsibilities and impact of this role..."
                    className="text-xs rounded-xl bg-slate-50 border-slate-200 min-h-[90px]"
                    required
                  />
                </div>

                {/* REQUIREMENTS */}
                <div className="space-y-1.5">
                  <Label className="font-bold text-slate-800">
                    Qualifications & Requirements
                  </Label>
                  <Textarea
                    value={newJob.requirements}
                    onChange={(e) =>
                      setNewJob((prev) => ({
                        ...prev,
                        requirements: e.target.value,
                      }))
                    }
                    placeholder="List required skills (e.g. • 3+ years in React / Python)..."
                    className="text-xs rounded-xl bg-slate-50 border-slate-200 min-h-[90px]"
                  />
                </div>

                {/* BENEFITS */}
                <div className="space-y-1.5">
                  <Label className="font-bold text-slate-800">Benefits & Perks</Label>
                  <Textarea
                    value={newJob.benefits}
                    onChange={(e) =>
                      setNewJob((prev) => ({
                        ...prev,
                        benefits: e.target.value,
                      }))
                    }
                    placeholder="List employee perks (e.g. • Health insurance, vehicle test drive allowance)..."
                    className="text-xs rounded-xl bg-slate-50 border-slate-200 min-h-[80px]"
                  />
                </div>

                <DialogFooter className="pt-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateOpen(false)}
                    className="text-xs rounded-xl"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl px-6 gap-2"
                  >
                    {isPending ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" /> Publishing...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" /> Publish Job Posting
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* ── METRICS OVERVIEW ─────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
              Total Job Openings
            </p>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">{jobs.length}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Briefcase className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
              Total Applications
            </p>
            <h3 className="text-2xl font-black text-emerald-600 mt-0.5">
              {totalApplications}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
              Active Vacancies
            </p>
            <h3 className="text-2xl font-black text-indigo-600 mt-0.5">
              {jobs.filter((j) => j.status === "OPEN").length}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Building className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* ── FILTER & SEARCH BAR ──────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* SEARCH */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search job title, location..."
              className="pl-10 h-10 text-xs bg-slate-50 border-slate-200 rounded-xl"
            />
          </div>

          {/* STATUS FILTER */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36 h-10 text-xs rounded-xl bg-slate-50 border-slate-200">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="OPEN">Open Only</SelectItem>
              <SelectItem value="CLOSED">Closed Only</SelectItem>
            </SelectContent>
          </Select>

          {/* DEPARTMENT FILTER */}
          <Select value={deptFilter} onValueChange={setDeptFilter}>
            <SelectTrigger className="w-44 h-10 text-xs rounded-xl bg-slate-50 border-slate-200">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Departments</SelectItem>
              <SelectItem value="Engineering & AI">Engineering & AI</SelectItem>
              <SelectItem value="Sales & Concierge">Sales & Concierge</SelectItem>
              <SelectItem value="Showroom Operations">Showroom Operations</SelectItem>
              <SelectItem value="Marketing & Content">Marketing & Content</SelectItem>
              <SelectItem value="Finance & Legal">Finance & Legal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <span className="text-xs text-slate-500 font-medium">
          Showing <strong>{filteredJobs.length}</strong> of {jobs.length} postings
        </span>
      </div>

      {/* ── JOB POSTINGS LIST ─────────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-black text-slate-900">
            Posted Positions ({filteredJobs.length})
          </h2>
        </div>

        {filteredJobs.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-800 text-sm">No matching job postings</h4>
            <p className="text-xs text-slate-500">
              Try adjusting your search query or status filter.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredJobs.map((job) => {
              const appCount = job.applications?.length || 0;

              return (
                <div
                  key={job.id}
                  className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-slate-50/60 transition-colors"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="bg-blue-50 text-blue-700 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        {job.department}
                      </span>
                      <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {job.type}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          job.status === "OPEN"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-rose-50 text-rose-700 border border-rose-200"
                        }`}
                      >
                        {job.status}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-black text-slate-900">
                      {job.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-blue-600" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                        {job.salary || "Competitive"}
                      </span>
                      {job.experience && (
                        <span>• {job.experience}</span>
                      )}
                    </div>
                  </div>

                  {/* ACTION BUTTONS (VIEW APPLICATIONS, EDIT, DELETE) */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setViewingJob(job)}
                      className="rounded-xl border-slate-200 text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 gap-1.5 h-10 px-4 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-blue-600" />
                      <span>Applications ({appCount})</span>
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingJob(job)}
                      className="rounded-xl border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 h-10 px-3.5 cursor-pointer gap-1"
                      title="Edit Job Posting"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Edit</span>
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteJob(job.id)}
                      disabled={isPending}
                      className="text-xs font-bold rounded-xl text-rose-600 hover:bg-rose-50 h-10 px-3 cursor-pointer"
                      title="Delete Job"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── EDIT JOB DIALOG ──────────────────────────────────── */}
      {editingJob && (
        <Dialog open={!!editingJob} onOpenChange={() => setEditingJob(null)}>
          <DialogContent className="sm:max-w-2xl rounded-3xl p-6 sm:p-8 bg-white max-h-[90vh] overflow-y-auto">
            <DialogHeader className="text-left space-y-2 border-b pb-4">
              <DialogTitle className="text-xl font-black text-slate-900">
                Edit Job Posting
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Update job details, compensation, requirements, or vacancy status.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleUpdateJob} className="space-y-4 py-2 text-xs">
              {/* JOB TITLE */}
              <div className="space-y-1.5">
                <Label className="font-bold text-slate-800">Job Title *</Label>
                <Input
                  value={editingJob.title}
                  onChange={(e) =>
                    setEditingJob((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="text-xs rounded-xl bg-slate-50 border-slate-200 h-11"
                  required
                />
              </div>

              {/* DEPARTMENT, LOCATION & STATUS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label className="font-bold text-slate-800">Department</Label>
                  <Select
                    value={editingJob.department}
                    onValueChange={(val) =>
                      setEditingJob((prev) => ({ ...prev, department: val }))
                    }
                  >
                    <SelectTrigger className="text-xs rounded-xl bg-slate-50 border-slate-200 h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Engineering & AI">
                        Engineering & AI
                      </SelectItem>
                      <SelectItem value="Sales & Concierge">
                        Sales & Concierge
                      </SelectItem>
                      <SelectItem value="Showroom Operations">
                        Showroom Operations
                      </SelectItem>
                      <SelectItem value="Marketing & Content">
                        Marketing & Content
                      </SelectItem>
                      <SelectItem value="Finance & Legal">
                        Finance & Legal
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="font-bold text-slate-800">Location</Label>
                  <Input
                    value={editingJob.location}
                    onChange={(e) =>
                      setEditingJob((prev) => ({
                        ...prev,
                        location: e.target.value,
                      }))
                    }
                    className="text-xs rounded-xl bg-slate-50 border-slate-200 h-11"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="font-bold text-slate-800">Status</Label>
                  <Select
                    value={editingJob.status}
                    onValueChange={(val) =>
                      setEditingJob((prev) => ({ ...prev, status: val }))
                    }
                  >
                    <SelectTrigger className="text-xs rounded-xl bg-slate-50 border-slate-200 h-11 font-bold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OPEN">OPEN (Accepting Applications)</SelectItem>
                      <SelectItem value="CLOSED">CLOSED (Archived)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* TYPE, EXPERIENCE & SALARY */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label className="font-bold text-slate-800">Job Type</Label>
                  <Select
                    value={editingJob.type}
                    onValueChange={(val) =>
                      setEditingJob((prev) => ({ ...prev, type: val }))
                    }
                  >
                    <SelectTrigger className="text-xs rounded-xl bg-slate-50 border-slate-200 h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Remote">Remote</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="font-bold text-slate-800">Experience</Label>
                  <Input
                    value={editingJob.experience || ""}
                    onChange={(e) =>
                      setEditingJob((prev) => ({
                        ...prev,
                        experience: e.target.value,
                      }))
                    }
                    className="text-xs rounded-xl bg-slate-50 border-slate-200 h-11"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="font-bold text-slate-800">Salary</Label>
                  <Input
                    value={editingJob.salary || ""}
                    onChange={(e) =>
                      setEditingJob((prev) => ({
                        ...prev,
                        salary: e.target.value,
                      }))
                    }
                    className="text-xs rounded-xl bg-slate-50 border-slate-200 h-11"
                  />
                </div>
              </div>

              {/* DESCRIPTION */}
              <div className="space-y-1.5">
                <Label className="font-bold text-slate-800">Description *</Label>
                <Textarea
                  value={editingJob.description}
                  onChange={(e) =>
                    setEditingJob((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="text-xs rounded-xl bg-slate-50 border-slate-200 min-h-[90px]"
                  required
                />
              </div>

              {/* REQUIREMENTS */}
              <div className="space-y-1.5">
                <Label className="font-bold text-slate-800">Requirements</Label>
                <Textarea
                  value={editingJob.requirements || ""}
                  onChange={(e) =>
                    setEditingJob((prev) => ({
                      ...prev,
                      requirements: e.target.value,
                    }))
                  }
                  className="text-xs rounded-xl bg-slate-50 border-slate-200 min-h-[90px]"
                />
              </div>

              {/* BENEFITS */}
              <div className="space-y-1.5">
                <Label className="font-bold text-slate-800">Benefits & Perks</Label>
                <Textarea
                  value={editingJob.benefits || ""}
                  onChange={(e) =>
                    setEditingJob((prev) => ({
                      ...prev,
                      benefits: e.target.value,
                    }))
                  }
                  className="text-xs rounded-xl bg-slate-50 border-slate-200 min-h-[80px]"
                />
              </div>

              <DialogFooter className="pt-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingJob(null)}
                  className="text-xs rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl px-6 gap-2"
                >
                  {isPending ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" /> Save Changes
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* ── CANDIDATE APPLICATIONS VIEWER DIALOG ─────────────── */}
      {viewingJob && (
        <Dialog open={!!viewingJob} onOpenChange={() => setViewingJob(null)}>
          <DialogContent className="sm:max-w-3xl rounded-3xl p-6 sm:p-8 bg-white max-h-[90vh] overflow-y-auto">
            <DialogHeader className="text-left space-y-1.5 border-b pb-4">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-lg sm:text-xl font-black text-slate-900">
                  Applications for {viewingJob.title}
                </DialogTitle>
                <Badge className="bg-blue-600 text-white font-bold text-xs">
                  {viewingJob.applications?.length || 0} Applicants
                </Badge>
              </div>
              <DialogDescription className="text-xs text-slate-500">
                {viewingJob.department} • {viewingJob.location} • {viewingJob.type}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              {!viewingJob.applications || viewingJob.applications.length === 0 ? (
                <div className="p-12 text-center space-y-2">
                  <Users className="w-10 h-10 text-slate-300 mx-auto" />
                  <h4 className="font-bold text-slate-800 text-sm">
                    No applications received yet
                  </h4>
                  <p className="text-xs text-slate-500">
                    Candidates who apply from the careers page will appear here with their CV attachments.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {viewingJob.applications.map((app) => (
                    <div
                      key={app.id}
                      className="bg-slate-50/80 rounded-2xl border border-slate-200/80 p-5 space-y-3.5 text-xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
                        <div className="space-y-0.5">
                          <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                            {app.name}
                          </h4>
                          <p className="text-slate-500 text-[11px] font-medium flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3 text-blue-600" />
                              {app.email}
                            </span>
                            {app.phone && (
                              <span className="flex items-center gap-1">
                                <Phone className="w-3 h-3 text-emerald-600" />
                                {app.phone}
                              </span>
                            )}
                          </p>
                        </div>

                        {/* STATUS SELECTOR */}
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">
                            Status:
                          </span>
                          <Select
                            defaultValue={app.status}
                            onValueChange={(newVal) =>
                              handleStatusChange(app.id, newVal)
                            }
                          >
                            <SelectTrigger className="h-8 text-xs rounded-xl bg-white border-slate-200 w-36 font-bold">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="PENDING">Pending Review</SelectItem>
                              <SelectItem value="REVIEWED">Reviewed</SelectItem>
                              <SelectItem value="SHORTLISTED">
                                Shortlisted ⭐
                              </SelectItem>
                              <SelectItem value="REJECTED">Rejected</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* ── UPLOADED CV / RESUME ATTACHMENT OR URL ── */}
                      {app.resumeUrl && (
                        <div className="flex flex-wrap items-center gap-2">
                          <a
                            href={app.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            download={app.resumeName || "Candidate_Resume"}
                            className="inline-flex items-center gap-2 text-xs font-bold text-blue-700 hover:text-blue-800 bg-blue-100/70 hover:bg-blue-100 px-3.5 py-2 rounded-xl border border-blue-200 transition-colors cursor-pointer shadow-xs"
                          >
                            <FileCheck className="w-4 h-4 text-blue-600" />
                            <span>
                              {app.resumeName
                                ? `Download / View CV: ${app.resumeName}`
                                : "View Candidate CV / Portfolio"}
                            </span>
                            <Download className="w-3.5 h-3.5 ml-1 opacity-70" />
                          </a>
                        </div>
                      )}

                      {/* COVER LETTER */}
                      {app.coverLetter && (
                        <div className="space-y-1">
                          <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                            Cover Letter / Introduction:
                          </span>
                          <p className="text-slate-700 leading-relaxed whitespace-pre-line bg-white p-3 rounded-xl border border-slate-200/60">
                            {app.coverLetter}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                onClick={() => setViewingJob(null)}
                className="bg-slate-900 text-white text-xs font-bold rounded-xl"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
