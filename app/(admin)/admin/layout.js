import { getAdmin } from "@/action/admin";
import Header from "@/components/Header";
import { notFound } from "next/navigation";
import React from "react";
import Sidebar from "./_components/Sidebar";

const AdminLayout = async ({ children }) => {
  const admin = await getAdmin();

  if (!admin.authorized) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Header isAdminPage={true} />
      <div className="hidden md:flex h-full w-56 flex-col top-20 fixed inset-y-0 z-40">
        <Sidebar />
      </div>
      <div className="md:hidden">
        <Sidebar />
      </div>
      <main className="md:pl-56 pt-[80px] pb-24 md:pb-8 min-h-screen">{children}</main>
    </div>
  );
};

export default AdminLayout;
