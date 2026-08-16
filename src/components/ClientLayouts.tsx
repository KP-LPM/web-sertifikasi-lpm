"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Headset, AlertTriangle } from "lucide-react";
import { useAppContext } from "../context/context";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { Breadcrumb } from "./Breadcrumb";
import { useRouter } from "next/navigation";

const AUTH_ROUTES = ["/login", "/register"];

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const {
    user,
    sidebarCollapsed,
    pendingNavigation,
    setPendingNavigation,
    setIsFormDirty,
    isLoggingOut,
  } = useAppContext();
  const router = useRouter();
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname?.startsWith(route));

  if (isLoggingOut) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FC]">
        <p className="text-sm text-slate-500 font-bold">Keluar dari akun...</p>
      </div>
    );
  }

  if (isAuthRoute || !user) {
    return <>{children}</>;
  }

  // SEMUA ROLE (Asesi, Asesor, Admin) AKAN MENGGUNAKAN LAYOUT INI
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FC]">
      <div className="flex flex-1">
        
        <Sidebar />

        <div
          className={`flex-1 flex flex-col min-h-screen min-w-0 md:ml-20 ${
            sidebarCollapsed ? "lg:ml-20" : "lg:ml-72"
          } transition-all duration-300`}
        >
          <Header />


          <main className="flex-1 flex flex-col min-w-0 px-4 md:px-8 pt-6 pb-12">
            
            <div className="empty:hidden -mt-2 md:-mt-2 pb-5">
              <Breadcrumb />
            </div>
            
            <div className="flex-1 min-w-0">{children}</div>
          </main>
        </div>
      </div>

      {/* Floating Help Button */}
      <a
        href="https://wa.me/628123456789"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-[100] flex items-center justify-center w-14 h-14 bg-[#007A55] hover:bg-[#006044] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
      >
        <Headset size={24} />
        <span className="absolute right-16 px-3 py-2 bg-gray-900 text-white text-xs font-bold rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md">
          Butuh bantuan?
        </span>
        <span className="absolute right-[60px] top-1/2 -translate-y-1/2 border-8 border-transparent border-l-gray-900 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity"></span>
      </a>

      {/* Warning Modal */}
      {pendingNavigation && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setPendingNavigation(null)}
          ></div>
          <div className="bg-white rounded-2xl p-6 shadow-xl w-full max-w-sm relative z-10 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                <AlertTriangle className="text-red-500" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  Tinggalkan Halaman?
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Perubahan yang belum disimpan akan hilang. Lanjutkan?
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setPendingNavigation(null)}
                className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  setIsFormDirty(false);
                  if (pendingNavigation.type === "view") {
                    router.push(String(pendingNavigation.target || ""));
                  } else if (typeof pendingNavigation.target === "function") {
                    pendingNavigation.target();
                  }
                  setPendingNavigation(null);
                }}
                className="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Tinggalkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}