"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Briefcase,
  Building,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Gift,
  Globe,
  MapPin,
  Search,
  Sparkles,
  Users,
} from "lucide-react";
import React, { useState } from "react";
import ApplyJobModal from "./apply-job-modal";

export default function CareersClient({ jobs = [], user = null }) {
  const [selectedDept, setSelectedDept] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedJobId, setExpandedJobId] = useState(null);

  const departments = [
    "ALL",
    "Engineering & AI",
    "Sales & Concierge",
    "Showroom Operations",
    "Marketing & Content",
  ];

  const filteredJobs = jobs.filter((job) => {
    const matchesDept =
      selectedDept === "ALL" ||
      job.department.toLowerCase() === selectedDept.toLowerCase();
    const matchesSearch =
      searchQuery === "" ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  const toggleExpand = (jobId) => {
    setExpandedJobId((prev) => (prev === jobId ? null : jobId));
  };

  return (
    <div className="space-y-8">
      {/* ── SEARCH & DEPARTMENT FILTER BAR ─────────────────── */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
        {/* DEPARTMENT PILLS */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {departments.map((dept) => {
            const isActive = selectedDept.toLowerCase() === dept.toLowerCase();
            return (
              <button
                key={dept}
                type="button"
                onClick={() => setSelectedDept(dept)}
                className={`cursor-pointer px-4 py-2 text-xs rounded-full transition-all font-bold ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 scale-[1.02]"
                    : "bg-slate-100/80 text-slate-700 hover:bg-slate-200 hover:text-slate-900"
                }`}
              >
                {dept === "ALL" ? "All Openings" : dept}
              </button>
            );
          })}
        </div>

        {/* SEARCH INPUT */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search roles, skills, location..."
            className="pl-10 h-11 text-xs bg-slate-50 border-slate-200 rounded-2xl focus-visible:ring-blue-500 w-full"
          />
        </div>
      </div>

      {/* ── JOB LISTINGS ────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-base sm:text-lg font-black text-slate-900">
            Open Positions ({filteredJobs.length})
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            Showing verified career opportunities
          </span>
        </div>

        {filteredJobs.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200/90 shadow-md space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
              <Briefcase className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">No positions found</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                We couldn't find any job openings matching your current filter. Try resetting your search query or department.
              </p>
            </div>
            <Button
              onClick={() => {
                setSelectedDept("ALL");
                setSearchQuery("");
              }}
              className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold"
            >
              View All Positions
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => {
              const isExpanded = expandedJobId === job.id;

              return (
                <div
                  key={job.id}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  {/* MAIN JOB CARD ROW */}
                  <div className="p-6 sm:p-7 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="space-y-2.5 flex-1">
                      {/* DEPARTMENT & TAGS */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="bg-blue-50 text-blue-700 border border-blue-200/70 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                          {job.department}
                        </span>
                        <span className="bg-slate-100 text-slate-700 text-[11px] font-semibold px-2.5 py-1 rounded-full">
                          {job.type}
                        </span>
                        {job.experience && (
                          <span className="bg-slate-100 text-slate-700 text-[11px] font-semibold px-2.5 py-1 rounded-full">
                            {job.experience}
                          </span>
                        )}
                      </div>

                      {/* TITLE */}
                      <h3 className="text-lg sm:text-xl font-black text-slate-900 hover:text-blue-600 transition-colors leading-tight">
                        {job.title}
                      </h3>

                      {/* LOCATION & COMPENSATION */}
                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium pt-0.5">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-blue-600" />
                          {job.location}
                        </span>
                        {job.salary && (
                          <span className="flex items-center gap-1.5 font-bold text-slate-800">
                            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                            {job.salary}
                          </span>
                        )}
                      </div>

                      {/* PREVIEW EXCERPT */}
                      <p className="text-xs text-slate-600 leading-relaxed max-w-3xl line-clamp-2">
                        {job.description}
                      </p>
                    </div>

                    {/* ACTIONS ROW */}
                    <div className="flex items-center gap-3 flex-shrink-0 pt-2 lg:pt-0">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => toggleExpand(job.id)}
                        className="rounded-xl border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 gap-1.5 h-10 px-4 cursor-pointer"
                      >
                        <span>{isExpanded ? "Hide Details" : "View Details"}</span>
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </Button>

                      {/* APPLY MODAL */}
                      <ApplyJobModal job={job} user={user} />
                    </div>
                  </div>

                  {/* EXPANDED DETAILS SECTION */}
                  {isExpanded && (
                    <div className="bg-slate-50/80 border-t border-slate-100 p-6 sm:p-8 space-y-6 animate-in slide-in-from-top-2 duration-300 text-xs">
                      {/* FULL DESCRIPTION */}
                      <div className="space-y-2">
                        <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] text-blue-600">
                          About the Role
                        </h4>
                        <p className="text-slate-700 leading-relaxed whitespace-pre-line text-xs sm:text-sm">
                          {job.description}
                        </p>
                      </div>

                      {/* REQUIREMENTS */}
                      {job.requirements && (
                        <div className="space-y-2 pt-2 border-t border-slate-200/60">
                          <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] text-blue-600">
                            Key Qualifications & Requirements
                          </h4>
                          <p className="text-slate-700 leading-relaxed whitespace-pre-line text-xs">
                            {job.requirements}
                          </p>
                        </div>
                      )}

                      {/* BENEFITS & PERKS */}
                      {job.benefits && (
                        <div className="space-y-2 pt-2 border-t border-slate-200/60">
                          <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] text-emerald-600 flex items-center gap-1.5">
                            <Gift className="w-3.5 h-3.5" /> What We Offer & Benefits
                          </h4>
                          <p className="text-slate-700 leading-relaxed whitespace-pre-line text-xs">
                            {job.benefits}
                          </p>
                        </div>
                      )}

                      {/* BOTTOM MODAL TRIGGER */}
                      <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between">
                        <span className="text-slate-500 font-medium text-[11px]">
                          Position ID: {job.id}
                        </span>
                        <ApplyJobModal job={job} user={user} />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
