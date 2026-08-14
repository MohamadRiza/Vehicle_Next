import { getUserProfile } from "@/action/user";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SignInButton } from "@clerk/nextjs";
import {
  Building,
  CheckCircle2,
  Globe,
  Lock,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";
import Image from "next/image";
import React from "react";
import ProfileForm from "./_components/profile-form";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Personal Information | Vehiql AI",
  description: "Manage your contact details, mobile number, and residential address for showroom reservations.",
};

export default async function ProfilePage() {
  const res = await getUserProfile();

  if (!res.success) {
    return (
      <div className="pt-32 pb-20 container mx-auto px-4 text-center space-y-6">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-slate-900">Sign In Required</h1>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            Please sign in to view and update your personal information and contact details.
          </p>
        </div>
        <SignInButton forceRedirectUrl="/profile">
          <Button className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl px-6 font-bold">
            Sign In Now
          </Button>
        </SignInButton>
      </div>
    );
  }

  const { user } = res;

  return (
    <div className="pt-24 pb-20 min-h-screen bg-slate-50/60">
      <div className="container mx-auto px-4 max-w-4xl space-y-8">
        {/* HERO HEADER BANNER */}
        <div className="bg-gradient-to-r from-blue-950 via-indigo-900 to-slate-950 text-white rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30 px-3.5 py-1 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-300 inline" /> Customer Account Profile
            </Badge>

            <h1 className="text-3xl md:text-4xl font-black tracking-tight">
              Personal Information
            </h1>

            <p className="text-blue-100/80 text-xs md:text-sm max-w-xl leading-relaxed">
              Update your contact number, residential address, and location for test drive appointments.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15">
            <div className="h-12 w-12 rounded-full relative overflow-hidden border-2 border-blue-300 flex-shrink-0">
              {user.imageUrl ? (
                <Image src={user.imageUrl} alt={user.name} fill className="object-cover" unoptimized />
              ) : (
                <User className="w-6 h-6 m-auto text-blue-200" />
              )}
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-white truncate max-w-[160px]">{user.name}</p>
              <p className="text-[11px] text-blue-200 truncate max-w-[160px]">{user.email}</p>
            </div>
          </div>
        </div>

        {/* MAIN PROFILE FORM CARD */}
        <Card className="border border-slate-200/80 shadow-sm rounded-3xl p-6 md:p-10 bg-white space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" /> Contact & Address Details
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                All changes are saved directly to your account database.
              </p>
            </div>

            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 gap-1.5 px-3 py-1 font-bold text-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified Account
            </Badge>
          </div>

          <ProfileForm user={user} />
        </Card>
      </div>
    </div>
  );
}
