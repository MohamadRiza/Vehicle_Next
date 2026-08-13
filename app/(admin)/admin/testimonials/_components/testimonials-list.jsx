"use client";

import {
  createTestimonial,
  deleteTestimonial,
  getAdminTestimonials,
  updateTestimonialStatus,
} from "@/action/testimonials";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
  CheckCircle2,
  Eye,
  EyeOff,
  Plus,
  Quote,
  RefreshCw,
  Star,
  Trash2,
  Upload,
  User,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

export default function TestimonialsList({ initialItems = [] }) {
  const [isPending, startTransition] = useTransition();
  const [items, setItems] = useState(initialItems);
  const [loading, setLoading] = useState(false);

  // Add Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    rating: "5",
    content: "",
    isFeatured: true,
  });

  const fetchItems = async () => {
    setLoading(true);
    const res = await getAdminTestimonials();
    if (res.success) {
      setItems(res.testimonials);
    } else {
      toast.error(res.error || "Failed to load testimonials");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!initialItems || initialItems.length === 0) {
      fetchItems();
    }
  }, []);

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      toast.error("Avatar image size must be less than 4MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({ ...prev, avatar: reader.result }));
      toast.success("Profile photo loaded");
    };
    reader.readAsDataURL(file);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await createTestimonial(formData);
      if (res.success) {
        toast.success("New customer testimonial created!");
        setModalOpen(false);
        setFormData({
          name: "",
          role: "",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
          rating: "5",
          content: "",
          isFeatured: true,
        });
        fetchItems();
      } else {
        toast.error(res.error || "Failed to create testimonial");
      }
    });
  };

  const handleToggleFeatured = async (item) => {
    const newStatus = !item.isFeatured;
    startTransition(async () => {
      const res = await updateTestimonialStatus(item.id, newStatus);
      if (res.success) {
        toast.success(newStatus ? "Testimonial published on Homepage!" : "Testimonial hidden");
        setItems((prev) =>
          prev.map((t) => (t.id === item.id ? { ...t, isFeatured: newStatus } : t))
        );
      } else {
        toast.error(res.error || "Failed to update status");
      }
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this customer testimonial?")) return;

    startTransition(async () => {
      const res = await deleteTestimonial(id);
      if (res.success) {
        toast.success("Testimonial deleted");
        setItems((prev) => prev.filter((t) => t.id !== id));
      } else {
        toast.error(res.error || "Failed to delete testimonial");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* TOOLBAR */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Quote className="w-4 h-4 text-blue-600" /> Customer Testimonials ({items.length})
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage customer review quotes and profile avatars displayed on the homepage.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={fetchItems}
            title="Refresh"
            disabled={loading}
            className="rounded-xl"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>

          <Button
            onClick={() => setModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs gap-2 font-bold shadow-md"
          >
            <Plus className="w-4 h-4" /> Add New Testimonial
          </Button>
        </div>
      </div>

      {/* TESTIMONIALS GRID */}
      {loading ? (
        <div className="py-20 text-center text-slate-500 space-y-3 bg-white rounded-3xl border border-slate-200/80">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-600" />
          <p className="text-sm font-medium">Loading testimonials...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="py-20 text-center space-y-4 bg-white rounded-3xl border border-slate-200/80">
          <Quote className="w-12 h-12 text-slate-300 mx-auto" />
          <div>
            <h3 className="text-base font-bold text-slate-900">No testimonials yet</h3>
            <p className="text-xs text-slate-500 mt-1">Create your first customer testimonial to showcase on the homepage.</p>
          </div>
          <Button onClick={() => setModalOpen(true)} className="bg-blue-600 text-white rounded-xl text-xs">
            Add Testimonial
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((t) => (
            <Card
              key={t.id}
              className="border border-slate-200/80 shadow-sm rounded-3xl p-6 bg-white flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="space-y-4">
                {/* HEADER AVATAR & NAME */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-slate-100 border border-slate-200 relative overflow-hidden flex-shrink-0">
                      {t.avatar ? (
                        <Image
                          src={t.avatar}
                          alt={t.name}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      ) : (
                        <User className="w-6 h-6 m-auto text-slate-400" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{t.name}</h4>
                      <p className="text-xs text-slate-500 font-medium">{t.role || "Verified Buyer"}</p>
                    </div>
                  </div>

                  <Badge
                    variant="outline"
                    className={
                      t.isFeatured
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 text-[11px]"
                        : "bg-slate-100 text-slate-600 border-slate-200 text-[11px]"
                    }
                  >
                    {t.isFeatured ? "Featured" : "Hidden"}
                  </Badge>
                </div>

                {/* STARS RATING */}
                <div className="flex items-center gap-1 text-amber-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= (t.rating || 5) ? "fill-amber-400 text-amber-400" : "text-slate-200"
                      }`}
                    />
                  ))}
                </div>

                {/* QUOTE CONTENT */}
                <p className="text-xs text-slate-600 leading-relaxed italic">
                  "{t.content}"
                </p>
              </div>

              {/* CARD ACTIONS */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleFeatured(t)}
                  disabled={isPending}
                  className="text-xs rounded-xl gap-1 border-slate-200 text-slate-700"
                >
                  {t.isFeatured ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5 text-slate-500" /> Hide from Homepage
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5 text-emerald-600" /> Feature on Homepage
                    </>
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(t.id)}
                  className="h-8 w-8 text-rose-600 hover:bg-rose-50 rounded-xl"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ADD TESTIMONIAL MODAL DIALOG */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Quote className="w-5 h-5 text-blue-600" /> Add Customer Testimonial
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Create a new customer review quote with profile avatar photo to display on the homepage.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleFormSubmit} className="space-y-4 py-2 text-xs">
            <div className="space-y-1.5">
              <Label className="font-bold text-slate-700">Customer Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="e.g. Sarah Johnson"
                className="text-xs rounded-xl"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="font-bold text-slate-700">Role / Car Owned</Label>
              <Input
                value={formData.role}
                onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value }))}
                placeholder="e.g. BMW M5 Owner"
                className="text-xs rounded-xl"
              />
            </div>

            {/* AVATAR UPLOAD OR URL */}
            <div className="space-y-1.5">
              <Label className="font-bold text-slate-700">Profile Photo (Upload or URL)</Label>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-slate-100 border border-slate-300 relative overflow-hidden flex-shrink-0">
                  {formData.avatar ? (
                    <Image src={formData.avatar} alt="Avatar" fill unoptimized className="object-cover" />
                  ) : (
                    <User className="w-6 h-6 m-auto text-slate-400" />
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <Input
                    value={formData.avatar}
                    onChange={(e) => setFormData((prev) => ({ ...prev, avatar: e.target.value }))}
                    placeholder="https://images.unsplash.com/..."
                    className="text-xs rounded-xl"
                  />
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                      id="avatar-file-upload"
                    />
                    <Label
                      htmlFor="avatar-file-upload"
                      className="cursor-pointer inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
                    >
                      <Upload className="w-3 h-3" /> Upload Profile Image
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            {/* RATING */}
            <div className="space-y-1.5">
              <Label className="font-bold text-slate-700">Rating (1 to 5 Stars)</Label>
              <Select
                value={formData.rating}
                onValueChange={(val) => setFormData((prev) => ({ ...prev, rating: val }))}
              >
                <SelectTrigger className="text-xs rounded-xl">
                  <SelectValue placeholder="Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">⭐⭐⭐⭐⭐ 5 Stars</SelectItem>
                  <SelectItem value="4">⭐⭐⭐⭐ 4 Stars</SelectItem>
                  <SelectItem value="3">⭐⭐⭐ 3 Stars</SelectItem>
                  <SelectItem value="2">⭐⭐ 2 Stars</SelectItem>
                  <SelectItem value="1">⭐ 1 Star</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* REVIEW QUOTE CONTENT */}
            <div className="space-y-1.5">
              <Label className="font-bold text-slate-700">Testimonial Quote Content</Label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                placeholder="Write customer review quote..."
                className="text-xs rounded-xl min-h-[90px]"
                required
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setModalOpen(false)}
                className="text-xs rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs rounded-xl gap-2 font-bold"
              >
                {isPending ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : "Save Testimonial"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
