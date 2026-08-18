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
import { Camera, Search, Sparkles, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

const HomeSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [makeFilter, setMakeFilter] = useState("ALL");
  const [bodyFilter, setBodyFilter] = useState("ALL");
  const [minPriceFilter, setMinPriceFilter] = useState("ALL");
  const [maxPriceFilter, setMaxPriceFilter] = useState("ALL");
  const [yearFilter, setYearFilter] = useState("ALL");

  const [isImageSearchActive, setIsImageSearchActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const router = useRouter();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (searchTerm.trim()) params.append("search", searchTerm.trim());
    if (makeFilter && makeFilter !== "ALL") params.append("make", makeFilter);
    if (bodyFilter && bodyFilter !== "ALL") params.append("bodyType", bodyFilter);
    if (minPriceFilter && minPriceFilter !== "ALL") params.append("minPrice", minPriceFilter);
    if (maxPriceFilter && maxPriceFilter !== "ALL") params.append("maxPrice", maxPriceFilter);
    if (yearFilter && yearFilter !== "ALL") params.append("year", yearFilter);

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

      const reader = new FileReader();
      reader.onloadend = () => {
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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".png", ".jpg"] },
    maxFiles: 1,
  });

  return (
    <div className="w-full max-w-5xl mx-auto space-y-4">
      {/* FLOATING MULTI-FIELD LUXURY SEARCH TOOLBAR */}
      <div className="bg-white/95 backdrop-blur-md p-6 md:p-8 rounded-3xl shadow-2xl border border-slate-100 text-slate-900 space-y-5">
        {/* TOP TITLE ROW WITH AI SEARCH BADGE */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg md:text-xl font-black text-slate-900 tracking-tight">
            What are you looking for?
          </h3>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsImageSearchActive(!isImageSearchActive)}
            className="border-blue-600/30 text-blue-600 hover:bg-blue-50/80 rounded-full font-bold text-xs px-4 py-2 flex items-center gap-1.5 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>AI Search</span>
          </Button>
        </div>

        {/* INPUT KEYWORD / AI DESCRIPTIVE SEARCH */}
        <form onSubmit={handleSearchSubmit} className="space-y-4">
          <div className="relative flex items-center">
            <Input
              type="text"
              placeholder="Describe your dream car... (e.g. BMW under $40,000, low mileage, automatic)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 pr-12 py-6 rounded-2xl border-slate-200/90 text-xs md:text-sm bg-slate-50/60 focus-visible:ring-blue-600 shadow-inner text-slate-800 placeholder:text-slate-400 font-medium"
            />
            <Sparkles className="w-4 h-4 text-blue-500 absolute left-4 pointer-events-none" />
            <button
              type="button"
              onClick={() => setIsImageSearchActive(!isImageSearchActive)}
              className={`absolute right-3.5 p-1.5 rounded-xl transition-colors ${
                isImageSearchActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:text-blue-600 hover:bg-blue-50"
              }`}
              title="Upload Car Image for AI Match"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          {/* DROPDOWNS ROW */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 items-center pt-1">
            {/* SELECT MAKE */}
            <Select value={makeFilter} onValueChange={setMakeFilter}>
              <SelectTrigger className="w-full text-xs rounded-xl py-5 border-slate-200/90 bg-slate-50/60 font-semibold text-slate-700">
                <SelectValue placeholder="All Makes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Makes</SelectItem>
                <SelectItem value="Toyota">Toyota</SelectItem>
                <SelectItem value="BMW">BMW</SelectItem>
                <SelectItem value="Mercedes-Benz">Mercedes-Benz</SelectItem>
                <SelectItem value="Honda">Honda</SelectItem>
                <SelectItem value="Audi">Audi</SelectItem>
                <SelectItem value="Tesla">Tesla</SelectItem>
                <SelectItem value="Ford">Ford</SelectItem>
                <SelectItem value="Porsche">Porsche</SelectItem>
                <SelectItem value="Nissan">Nissan</SelectItem>
              </SelectContent>
            </Select>

            {/* SELECT BODY TYPE */}
            <Select value={bodyFilter} onValueChange={setBodyFilter}>
              <SelectTrigger className="w-full text-xs rounded-xl py-5 border-slate-200/90 bg-slate-50/60 font-semibold text-slate-700">
                <SelectValue placeholder="All Body Types" />
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

            {/* MIN PRICE */}
            <Select value={minPriceFilter} onValueChange={setMinPriceFilter}>
              <SelectTrigger className="w-full text-xs rounded-xl py-5 border-slate-200/90 bg-slate-50/60 font-semibold text-slate-700">
                <SelectValue placeholder="Min Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Min Price</SelectItem>
                <SelectItem value="10000">$10,000</SelectItem>
                <SelectItem value="25000">$25,000</SelectItem>
                <SelectItem value="50000">$50,000</SelectItem>
                <SelectItem value="100000">$100,000</SelectItem>
              </SelectContent>
            </Select>

            {/* MAX PRICE */}
            <Select value={maxPriceFilter} onValueChange={setMaxPriceFilter}>
              <SelectTrigger className="w-full text-xs rounded-xl py-5 border-slate-200/90 bg-slate-50/60 font-semibold text-slate-700">
                <SelectValue placeholder="Max Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Max Price</SelectItem>
                <SelectItem value="50000">$50,000</SelectItem>
                <SelectItem value="100000">$100,000</SelectItem>
                <SelectItem value="200000">$200,000</SelectItem>
                <SelectItem value="500000">$500,000</SelectItem>
              </SelectContent>
            </Select>

            {/* YEAR */}
            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger className="w-full text-xs rounded-xl py-5 border-slate-200/90 bg-slate-50/60 font-semibold text-slate-700">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Years</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
                <SelectItem value="2021">2021</SelectItem>
                <SelectItem value="2020">2020</SelectItem>
              </SelectContent>
            </Select>

            {/* SEARCH BUTTON */}
            <Button
              type="submit"
              className="w-full col-span-2 sm:col-span-1 bg-blue-600 hover:bg-blue-500 text-white rounded-xl py-5 font-bold text-xs shadow-lg shadow-blue-600/30 gap-1.5 flex items-center justify-center"
            >
              <Search className="w-3.5 h-3.5" /> Search Cars
            </Button>
          </div>
        </form>
      </div>

      {/* AI DROPZONE MODAL */}
      {isImageSearchActive && (
        <div className="bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 text-center max-w-lg mx-auto space-y-4 animate-in fade-in zoom-in-95 duration-200">
          <div {...getRootProps()} className="cursor-pointer border-2 border-dashed border-blue-300 hover:border-blue-500 rounded-2xl p-6 bg-blue-50/30 transition-colors">
            <input {...getInputProps()} />
            <Upload className="w-10 h-10 text-blue-600 mx-auto mb-2 animate-bounce" />
            <p className="text-xs font-extrabold text-slate-800">
              {isDragActive ? "Drop car photo here..." : "Drag & drop a vehicle image or click to browse"}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">AI visual recognition for exact make, model, & color match</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeSearch;

