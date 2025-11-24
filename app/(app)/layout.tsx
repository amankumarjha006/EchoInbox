import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col ">
      <Navbar />
      <div className="grow pt-16">
        {children}
      </div>
      <Footer />
    </div>
  );
}
