"use client";

import { submitJobApplication } from "@/action/careers";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Briefcase,
  CheckCircle2,
  FileCheck,
  FileText,
  FileType,
  Globe,
  ImageIcon,
  Link as LinkIcon,
  Mail,
  Paperclip,
  Phone,
  RefreshCw,
  Send,
  Sparkles,
  Trash2,
  UploadCloud,
  User,
  X,
} from "lucide-react";
import React, { useRef, useState, useTransition } from "react";
import { toast } from "sonner";

export default function ApplyJobModal({ job, user = null }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    resumeUrl: "",
    coverLetter: "",
  });

  const [uploadedFile, setUploadedFile] = useState(null); // { name, size, type, base64 }

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit: 10MB
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be under 10MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setUploadedFile({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
        type: file.type,
        base64: reader.result,
      });
      toast.success(`Attached "${file.name}"`);
    };
    reader.onerror = () => {
      toast.error("Failed to read file.");
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error("Please fill in your name and email address.");
      return;
    }

    if (!uploadedFile && !formData.resumeUrl.trim()) {
      toast.error("Please upload your CV/Resume (PDF, Word, Image) or provide a profile link.");
      return;
    }

    startTransition(async () => {
      const res = await submitJobApplication({
        jobId: job.id,
        ...formData,
        resumeFile: uploadedFile
          ? {
              name: uploadedFile.name,
              type: uploadedFile.type,
              base64: uploadedFile.base64,
            }
          : null,
      });

      if (res.success) {
        toast.success("Application Submitted Successfully!", {
          description: `Your application for "${job.title}" has been received. Our recruitment team will review your CV.`,
        });
        setOpen(false);
        setUploadedFile(null);
        setFormData({
          name: user?.name || "",
          email: user?.email || "",
          phone: user?.phone || "",
          resumeUrl: "",
          coverLetter: "",
        });
      } else {
        toast.error(res.error || "Failed to submit application. Please try again.");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold px-6 py-2.5 shadow-md shadow-blue-600/25 gap-1.5 cursor-pointer">
          <span>Apply Now</span>
          <Send className="w-3.5 h-3.5" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg rounded-3xl p-6 sm:p-8 bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-left space-y-2 border-b pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-100/70 text-blue-600 flex-shrink-0">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-black text-slate-900 leading-snug">
                Apply for {job.title}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 font-medium mt-0.5">
                {job.department} • {job.location} • {job.type}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2 text-xs">
          {/* APPLICANT NAME & EMAIL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="font-bold text-slate-800 text-xs">Full Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="e.g. Alex Morgan"
                className="text-xs rounded-xl bg-slate-50 border-slate-200 h-11 focus-visible:ring-blue-500"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="font-bold text-slate-800 text-xs">Email Address *</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="alex@example.com"
                className="text-xs rounded-xl bg-slate-50 border-slate-200 h-11 focus-visible:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* PHONE & PORTFOLIO / RESUME LINK */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="font-bold text-slate-800 text-xs">Phone Number</Label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="+94 77 123 4567"
                className="text-xs rounded-xl bg-slate-50 border-slate-200 h-11 focus-visible:ring-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="font-bold text-slate-800 text-xs">
                LinkedIn / Portfolio URL
              </Label>
              <Input
                type="url"
                value={formData.resumeUrl}
                onChange={(e) => handleChange("resumeUrl", e.target.value)}
                placeholder="https://linkedin.com/in/..."
                className="text-xs rounded-xl bg-slate-50 border-slate-200 h-11 focus-visible:ring-blue-500"
              />
            </div>
          </div>

          {/* ── UPLOAD CV / RESUME (PDF, WORD, IMAGE) ──────────── */}
          <div className="space-y-2">
            <Label className="font-bold text-slate-800 text-xs flex items-center justify-between">
              <span>Upload CV / Resume (PDF, Word, or Image) *</span>
              <span className="text-[10px] text-slate-400 font-normal">Max 10MB</span>
            </Label>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp"
              onChange={handleFileChange}
              className="hidden"
            />

            {!uploadedFile ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50/80 hover:bg-blue-50/40 rounded-2xl p-4 text-center cursor-pointer transition-all space-y-1.5"
              >
                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    Click to browse or drop your resume
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Supports PDF, DOCX, DOC, JPG, PNG
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3.5 bg-blue-50/80 rounded-2xl border border-blue-200/80">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {uploadedFile.name}
                    </p>
                    <p className="text-[10px] text-blue-700 font-medium">
                      {uploadedFile.size} • Attached
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-100 hover:text-rose-700 transition-colors cursor-pointer"
                  title="Remove file"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* COVER LETTER / REASON FOR APPLYING */}
          <div className="space-y-1.5">
            <Label className="font-bold text-slate-800 text-xs">
              Brief Introduction / Why You'd Be a Great Fit
            </Label>
            <Textarea
              value={formData.coverLetter}
              onChange={(e) => handleChange("coverLetter", e.target.value)}
              placeholder="Tell us about your relevant automotive, technical, or concierge experience..."
              className="text-xs rounded-xl bg-slate-50 border-slate-200 min-h-[90px] focus-visible:ring-blue-500"
            />
          </div>

          {/* TRUST BADGE */}
          <div className="p-3 bg-blue-50/80 rounded-2xl border border-blue-200/60 text-[11px] text-blue-700 flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span>Open to all applicants (guests & registered members). Your data is private.</span>
          </div>

          {/* ACTIONS */}
          <DialogFooter className="pt-2 gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="text-xs rounded-xl border-slate-200"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl px-6 shadow-md gap-2 cursor-pointer"
            >
              {isPending ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" /> Submit Application
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
