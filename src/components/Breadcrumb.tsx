"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppContext } from "@/context/context";

interface Crumb {
  label: string;
  path?: string; // undefined = bukan link (misal breadcrumb terakhir/aktif)
}

function getDashboardPath(role: string | null | undefined): string {
  switch (role) {
    case "asesor":
      return "/assessor/overview";
    case "asesi":
      return "/asesi/overview";
    case "admin":
      return "/admin/overview";
    case "direktur":
      return "/direktur/dashboard";
    case "manajer":
      return "/manajer/dashboard";
    default:
      return "/";
  }
}

// ==========================================================================
// PETA RUTE -> BREADCRUMB
// Key = path (tanpa trailing slash). Value = rantai breadcrumb dari root.
// Tambahkan entri baru di sini setiap kali ada halaman baru.
// ==========================================================================
const ROUTE_CRUMBS: Record<string, Crumb[]> = {
  // ---------------- ASESOR ----------------
  "/assessor/overview": [{ label: "Dashboard" }],
  "/assessor/candidates": [
    { label: "Dashboard", path: "/assessor/overview" },
    { label: "Daftar Asesmen" },
  ],
  "/assessor/asessmentform": [
    { label: "Dashboard", path: "/assessor/overview" },
    { label: "Daftar Asesmen", path: "/assessor/candidates" },
    { label: "Form Asesmen" },
  ],
  "/assessor/jadwalkanonline": [
    { label: "Dashboard", path: "/assessor/overview" },
    { label: "Daftar Asesmen", path: "/assessor/candidates" },
    { label: "Jadwalkan Online" },
  ],
  "/assessor/penilaianonline": [
    { label: "Dashboard", path: "/assessor/overview" },
    { label: "Daftar Asesmen", path: "/assessor/candidates" },
    { label: "Penilaian Online" },
  ],
  "/assessor/finalization": [
    { label: "Dashboard", path: "/assessor/overview" },
    { label: "Daftar Asesmen", path: "/assessor/candidates" },
    { label: "Finalisasi" },
  ],
  "/assessor/riwayatasesmen": [
    { label: "Dashboard", path: "/assessor/overview" },
    { label: "Riwayat Asesmen" },
  ],
  "/assessor/detailriwayatasesmen": [
    { label: "Dashboard", path: "/assessor/overview" },
    { label: "Riwayat Asesmen", path: "/assessor/riwayatasesmen" },
    { label: "Detail Riwayat" },
  ],
  "/assessor/verifikasiapl02": [
    { label: "Dashboard", path: "/assessor/overview" },
    { label: "Verifikasi Berkas" },
  ],
  "/assessor/verifikasiportofolio": [
    { label: "Dashboard", path: "/assessor/overview" },
    { label: "Verifikasi Portofolio" },
  ],
  "/assessor/verifikasibanding": [
    { label: "Dashboard", path: "/assessor/overview" },
    { label: "Verifikasi Banding" },
  ],
  "/assessor/konfigurasipertanyaan": [
    { label: "Dashboard", path: "/assessor/overview" },
    { label: "Konfigurasi Pertanyaan" },
  ],
  "/assessor/tambahkonfigurasipertanyaan": [
    { label: "Dashboard", path: "/assessor/overview" },
    {
      label: "Konfigurasi Pertanyaan",
      path: "/assessor/konfigurasipertanyaan",
    },
    { label: "Buat Paket Soal" },
  ],
  "/assessor/detailkonfigurasipertanyaan": [
    { label: "Dashboard", path: "/assessor/overview" },
    {
      label: "Konfigurasi Pertanyaan",
      path: "/assessor/konfigurasipertanyaan",
    },
    { label: "Detail Paket Soal" },
  ],

  // ---------------- ASESI ----------------
  "/asesi/overview": [{ label: "Dashboard" }],
  "/asesi/pengajuanskema": [
    { label: "Dashboard", path: "/asesi/overview" },
    { label: "Pengajuan Skema" },
  ],
  "/asesi/riwayatasesmen": [
    { label: "Dashboard", path: "/asesi/overview" },
    { label: "Riwayat & Sertifikat" },
  ],
  "/asesi/banding": [
    { label: "Dashboard", path: "/asesi/overview" },
    { label: "Banding Asesmen" },
  ],

  // ---------------- ADMIN / DIREKTUR / MANAJER ----------------
  "/admin/overview": [{ label: "Dashboard" }],
  "/direktur/dashboard": [{ label: "Dashboard" }],
  "/schemes": [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Skema Sertifikasi" },
  ],
  "/schedules": [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Jadwal & Penugasan" },
  ],
  "/users": [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Daftar Pengguna" },
  ],
  "/tuk": [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Manajemen TUK" },
  ],
  "/reports": [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Laporan" },
  ],
};

export function Breadcrumb({ className = "" }: { className?: string }) {
  const { user, extraCrumbs } = useAppContext();
  const pathname = usePathname();

  if (!user || !pathname) return null;

  let baseCrumbs: Crumb[] | undefined;
  if (pathname === "/profile") {
    baseCrumbs = [
      { label: "Dashboard", path: getDashboardPath(user.role) },
      { label: "Profil Saya" },
    ];
  } else {
    baseCrumbs = ROUTE_CRUMBS[pathname];
  }

  if (!baseCrumbs) return null;

  const crumbs = [...baseCrumbs, ...(extraCrumbs || [])];

  if (crumbs.length <= 1) return null;

  return (
    <div
      className={`flex items-center gap-2 flex-wrap text-[13px] font-bold text-slate-500 uppercase tracking-wide ${className}`}
    >
      {crumbs.map((crumb, idx) => {
        const isLast = idx === crumbs.length - 1;
        return (
          <React.Fragment key={idx}>
            {idx > 0 && <span className="text-slate-400 mx-1">/</span>}
            {isLast || !crumb.path ? (
              <span
                className={
                  isLast ? "text-[#008BE3] font-black" : "text-slate-500"
                }
              >
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.path}
                className="text-slate-500 hover:text-[#008BE3] transition-colors cursor-pointer uppercase"
              >
                {crumb.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
