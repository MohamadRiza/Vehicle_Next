"use client";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Camera, Search, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

const HomeSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [makeFilter, setMakeFilter] = useState("ALL");
  const [bodyFilter, setBodyFilter] = useState("ALL");
  const [priceFilter, setPriceFilter] = useState("ALL");

  const [isImageSearchActive, setIsImageSearchActive] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [searchImage, setSearchImage] = useState(null);
  const [isImageUploading, setIsUploading] = useState(false);

  const router = useRouter();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (searchTerm.trim()) params.append("search", searchTerm.trim());
    if (makeFilter && makeFilter !== "ALL") params.append("make", makeFilter);
    if (bodyFilter && bodyFilter !== "ALL") params.append("bodyType", bodyFilter);
    if (priceFilter && priceFilter !== "ALL") params.append("priceRange", priceFilter);

    router.push(`/cars?${params.toString()}`);
  };

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];

    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size exceeds 5MB");
        return;
      }
      setIsUploading(true);
      setSearchImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setIsUploading(false);
        toast.success("AI Image loaded. Searching showroom...");
        router.push(`/cars?search=ai_image_search`);
      };
      reader.onerror = () => {
        setIsUploading(false);
        toast.error("Error reading image file");
      };
      reader.readAsDataURL(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".png", ".jpg"] },
    maxFiles: 1,
  });

  return (
    <div className="w-full max-w-5xl mx-auto space-y-4">
      {/* FLOATING MULTI-FIELD LUXURY SEARCH TOOLBAR */}
      <form
        onSubmit={handleSearchSubmit}
        className="bg-white/95 backdrop-blur-md p-3 md:p-4 rounded-3xl md:rounded-full shadow-2xl border border-white/20 text-slate-900 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-center"
      >
        {/* INPUT KEYWORD WITH CAMERA AI ICON */}
        <div className="relative flex items-center lg:col-span-2">
          <Input
            type="text"
            placeholder="Search make, model, or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-4 pr-10 py-5 rounded-2xl md:rounded-full border-slate-200 text-xs bg-slate-50/50 focus-visible:ring-blue-600"
          />
          <button
            type="button"
            onClick={() => setIsImageSearchActive(!isImageSearchActive)}
            className={`absolute right-3 p-1.5 rounded-xl transition-colors ${
              isImageSearchActive
                ? "bg-blue-600 text-white"
                : "text-slate-400 hover:text-blue-600 hover:bg-blue-50"
            }`}
            title="AI Image Search"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>

        {/* SELECT MAKE */}
        <Select value={makeFilter} onValueChange={setMakeFilter}>
          <SelectTrigger className="w-full text-xs rounded-2xl md:rounded-full py-5 border-slate-200 bg-slate-50/50">
            <SelectValue placeholder="Select Make" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Makes</SelectItem>
            <SelectItem value="Toyota">Toyota</SelectItem>
            <SelectItem value="BMW">BMW</SelectItem>
            <SelectItem value="Mercedes-Benz">Mercedes-Benz</SelectItem>
            <SelectItem value="Honda">Honda</SelectItem>
            <SelectItem value="Audi">Audi</SelectItem>
            <SelectItem value="Tesla">Tesla</SelectItem>
            <SelectItem value="Hyundai">Hyundai</SelectItem>
            <SelectItem value="Ford">Ford</SelectItem>
            <SelectItem value="Porsche">Porsche</SelectItem>
          </SelectContent>
        </Select>

        {/* SELECT BODY TYPE */}
        <Select value={bodyFilter} onValueChange={setBodyFilter}>
          <SelectTrigger className="w-full text-xs rounded-2xl md:rounded-full py-5 border-slate-200 bg-slate-50/50">
            <SelectValue placeholder="Body Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Body Types</SelectItem>
            <SelectItem value="SUV">SUV</SelectItem>
            <SelectItem value="Sedan">Sedan</SelectItem>
            <SelectItem value="Hatchback">Hatchback</SelectItem>
            <SelectItem value="Coupe">Coupe</SelectItem>
            <SelectItem value="Convertible">Convertible</SelectItem>
            <SelectItem value="Truck">Truck</SelectItem>
          </SelectContent>
        </Select>

        {/* SEARCH BUTTON */}
        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-2xl md:rounded-full py-5 font-bold text-xs shadow-lg shadow-blue-600/30 gap-2"
        >
          <Search className="w-4 h-4" /> Search Cars
        </Button>
      </form>

      {/* AI DROPZONE MODAL */}
      {isImageSearchActive && (
        <div className="bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 text-center max-w-lg mx-auto space-y-4">
          <div {...getRootProps()} className="cursor-pointer border-2 border-dashed border-blue-200 hover:border-blue-500 rounded-2xl p-6 bg-blue-50/30 transition-colors">
            <input {...getInputProps()} />
            <Upload className="w-10 h-10 text-blue-500 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-800">
              {isDragActive ? "Drop car photo here..." : "Drag & drop a vehicle image or click to browse"}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">Supports JPG, PNG (Max 5MB)</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeSearch;
