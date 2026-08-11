"use client";

import React from "react";
import { Sidebar } from "@/components/Sidebar";
import BreadcrumbAsesi from "@/components/BreadcrumbAsesi";
import { AppProvider, useAppContext } from "@/context/context";
import { SessionProvider } from "next-auth/react";
import { Header } from "@/components/Header";

// Komponen perantara supaya bisa membaca state sidebarCollapsed
function LayoutInner({ children }: { children: React.ReactNode }) {
  const { sidebarCollapsed } = useAppContext();

  return (
    <div className="flex h-screen bg-[#F8F9FC] overflow-hidden font-sans">
      {/* Sidebar melayang di kiri */}
      <Sidebar />

      <div
        className={`flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300 ${
          sidebarCollapsed ? "md:ml-20" : "md:ml-72"
        }`}
      >
        <Header />

        <main className="flex-1 overflow-y-auto pt-6 pb-8 px-4 md:pt-5 md:pb-12 md:px-8">
          <div className="max-w-7xl mx-auto flex flex-col gap-3 md:gap-6">
            <BreadcrumbAsesi />
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function AsesiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <AppProvider>
        <LayoutInner>{children}</LayoutInner>
      </AppProvider>
    </SessionProvider>
  );
}
