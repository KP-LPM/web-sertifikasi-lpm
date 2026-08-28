"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppContext } from "@/context/context";
import logoLsp from "../../public/logo-lsp.png";
import {
  LayoutList,
  LayoutDashboard,
  FolderTree,
  CalendarDays,
  Users,
  Scale,
  History,
  FileText,
  LogOut,
  GraduationCap,
  Menu,
  FileEdit,
  Building2,
  ClipboardList,
  FolderCheck,
  FileCheck2,
} from "lucide-react";
import Image from "next/image";

export function Sidebar() {
  const { user, logout, sidebarCollapsed, setSidebarCollapsed } =
    useAppContext();
  const pathname = usePathname();

  if (!user) return null;

  const navItems = getNavItems(user.role);

  return (
    <>
      {/* Mobile overlay */}
      {!sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-[#0F172A]/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}
      <aside
        className={`fixed left-0 top-0 h-screen ${sidebarCollapsed ? "-translate-x-full md:translate-x-0 w-72 md:w-20 px-4 md:px-2" : "translate-x-0 w-72 px-4"} flex flex-col bg-[#0F172A] border-r border-[#0F172A]/80 shadow-xs z-50 py-6 transition-all duration-300`}
      >
        {/* Top Brand Logo & Toggle Header */}
        <div
          className={`mb-6 flex ${sidebarCollapsed ? "flex-col items-center gap-4" : "items-center justify-between px-2"}`}
        >
          {!sidebarCollapsed ? (
            <>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-[#008BE3]/10 flex items-center justify-center text-[#008BE3] shrink-0 border border-[#008BE3]/20 shadow-xs">
                  <Image
                    src={logoLsp}
                    alt="Logo LSP"
                    width={33}
                    height={33}
                    className="object-contain"
                  />
                </div>
                <div className="transition-all duration-300 overflow-hidden whitespace-nowrap">
                  <h2 className="text-base font-black text-white tracking-tight leading-none mb-1">
                    LSP UIN SGD
                  </h2>
                  <p className="text-[10px] text-white/60 font-bold tracking-wider uppercase leading-none">
                    Sertifikasi Profesi
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSidebarCollapsed(true)}
                className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                title="Kecilkan Menu"
              >
                <Menu size={18} />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setSidebarCollapsed(false)}
                className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                title="Perbesar Menu"
              >
                <Menu size={18} />
              </button>
              <div className="w-9 h-9 rounded-lg bg-[#008BE3]/10 flex items-center justify-center text-[#008BE3] shrink-0 border border-[#008BE3]/20 shadow-xs">
                <GraduationCap size={20} className="stroke-[2.5]" />
              </div>
            </>
          )}
        </div>

        <nav className="flex-1 flex flex-col justify-between">
          <div className="space-y-1">
            {navItems.map((item) => {
              // Aktif jika path saat ini sama atau merupakan sub-halaman dari item ini
              const isActive =
                pathname === item.path ||
                (pathname.startsWith(item.path) && item.path !== "/dashboard");
              return (
                <Link
                  key={item.id}
                  href={item.path}
                  onClick={() => {
                    if (window.innerWidth < 1024) setSidebarCollapsed(true);
                  }}
                  title={sidebarCollapsed ? item.label : undefined}
                  className={`w-full flex items-center ${sidebarCollapsed ? "justify-center px-0 h-11" : "px-3 py-3.5 gap-3"} rounded-lg transition-all group ${
                    isActive
                      ? "bg-[#008BE3] text-white font-black shadow-md"
                      : "text-white/60 hover:bg-white/5 hover:text-white border-l-2 border-transparent"
                  }`}
                >
                  <item.icon
                    size={18}
                    className={
                      isActive
                        ? "text-white"
                        : "text-white/40 group-hover:text-white/70"
                    }
                  />
                  {!sidebarCollapsed && (
                    <span className="text-[12px] font-bold tracking-tight transition-all duration-300 overflow-hidden whitespace-nowrap">
                      {item.label}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="pt-4 border-t border-white/10">
            {/* Logout Button */}
            <button
              onClick={logout}
              title={sidebarCollapsed ? "Logout" : undefined}
              className={`w-full flex items-center ${sidebarCollapsed ? "justify-center px-0 h-11" : "px-3 py-3.5 gap-3"} rounded-lg transition-all text-rose-400 hover:bg-rose-500/10 hover:text-rose-300`}
            >
              <LogOut size={18} />
              {!sidebarCollapsed && (
                <span className="text-[12px] font-bold">Logout</span>
              )}
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
}

function getNavItems(role: string | null | undefined) {
  switch (role) {
    case "direktur":
    case "manajer":
      return [
        {
          id: "dashboard",
          label: "Dashboard",
          icon: LayoutDashboard,
          path: "/dashboard",
        },
        { id: "users", label: "Daftar Pengguna", icon: Users, path: "/users" },
        {
          id: "schemes",
          label: "Skema Sertifikasi",
          icon: FolderTree,
          path: "/schemes",
        },
        {
          id: "schedules",
          label: "Jadwal & Penugasan",
          icon: CalendarDays,
          path: "/schedules",
        },
        { id: "tuk", label: "Manajemen TUK", icon: Building2, path: "/tuk" },
        {
          id: "reports",
          label: "Laporan",
          icon: ClipboardList,
          path: "/reports",
        },
      ];
    case "admin":
      return [
        {
          id: "overview",
          label: "Dashboard",
          icon: LayoutDashboard,
          path: "/admin/overview",
        },
        {
          id: "kelolapengguna",
          label: "Kelola Pengguna",
          icon: Users,
          path: "/admin/kelolapengguna",
        },
        {
          id: "kelolasurat",
          label: "Kelola Surat",
          icon: FileCheck2,
          path: "/admin/kelolasurat",
        },
        {
          id: "verifikasiberkas",
          label: "Verifikasi Berkas",
          icon: FolderCheck,
          path: "/admin/verifikasiberkas",
        },
        {
          id: "schemes",
          label: "Skema Sertifikasi",
          icon: FolderTree,
          path: "/admin/schemes",
        },
        {
          id: "schedule",
          label: "Jadwal & Penugasan",
          icon: CalendarDays,
          path: "/admin/schedule",
        },
        {
          id: "sidangpleno",
          label: "Sidang Pleno",
          icon: Scale,
          path: "/admin/sidangpleno",
        },
        {
          id: "riwayatasesmenadmin",
          label: "Riwayat Asesmen",
          icon: History,
          path: "/admin/riwayatasesmenadmin",
        },
        {
          id: "uploadsertifikat",
          label: "Upload Sertifikat",
          icon: FileEdit,
          path: "/admin/uploadsertifikat",
        },
        {
          id: "tuk",
          label: "Manajemen TUK",
          icon: Building2,
          path: "/admin/tuk",
        },
        {
          id: "reports",
          label: "Laporan",
          icon: ClipboardList,
          path: "/admin/reports",
        },
      ];
    case "asesor":
      return [
        {
          id: "dashboard",
          label: "Dashboard",
          icon: LayoutDashboard,
          path: "/assessor/overview",
        },
        {
          id: "candidates",
          label: "Daftar Asesmen",
          icon: LayoutList,
          path: "/assessor/candidates",
        },
        {
          id: "history-asesmen",
          label: "Riwayat Asesmen",
          icon: History,
          path: "/assessor/riwayatasesmen",
        },
        {
          id: "verifikasi-portofolio",
          label: "Verifikasi Portofolio",
          icon: FolderCheck,
          path: "/assessor/verifikasiportofolio",
        },
        {
          id: "verifikasi-banding",
          label: "Verifikasi Banding",
          icon: Scale,
          path: "/assessor/verifikasibanding",
        },
        {
          id: "konfigurasi-pertanyaan",
          label: "Konfigurasi Pertanyaan",
          icon: FileEdit,
          path: "/assessor/konfigurasipertanyaan",
        },
      ];
    case "asesi":
      return [
        {
          id: "overview",
          label: "Dashboard",
          icon: LayoutDashboard,
          path: "/asesi/overview",
        },
        {
          id: "pengajuanskema",
          label: "Pengajuan Skema",
          icon: FileText,
          path: "/asesi/pengajuanskema",
        },
        {
          id: "riwayatasesmen",
          label: "Riwayat Asesmen",
          icon: History,
          path: "/asesi/riwayatasesmen",
        },
        {
          id: "banding",
          label: "Banding Asesmen",
          icon: Scale,
          path: "/asesi/banding",
        },
      ];
    default:
      return [];
  }
}
