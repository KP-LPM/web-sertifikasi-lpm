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
  "/asesi/pengajuanskema": [{ label: "Dashboard", path: "/asesi/overview" }],
  "/asesi/riwayatasesmen": [
    { label: "Dashboard", path: "/asesi/overview" },
    // Label disesuaikan dengan kode asesi lama
    { label: "Riwayat & Sertifikat", path: "/asesi/riwayatasesmen" },
  ],
  "/asesi/banding": [
    { label: "Dashboard", path: "/asesi/overview" },
    { label: "Banding Asesmen", path: "/asesi/banding" },
  ],
  // Tambahan rute Ujian Online yang sebelumnya hilang
  "/asesi/ujian": [
    { label: "Dashboard", path: "/asesi/overview" },
    { label: "Ujian Online", path: "/asesi/ujian" },
  ],

  // ---------------- ADMIN / DIREKTUR / MANAJER ----------------
  "/admin/overview": [{ label: "Dashboard" }],
  "/direktur/dashboard": [{ label: "Dashboard" }],
  "/admin/kelolapengguna": [
    { label: "Dashboard", path: "/admin/overview" },
    { label: "Kelola Pengguna" },
  ],
  "/admin/kelolasurat": [
    { label: "Dashboard", path: "/admin/overview" },
    { label: "Kelola Surat" },
  ],
  "/admin/schemes": [
    { label: "Dashboard", path: "/admin/overview" },
    { label: "Skema Sertifikasi" },
  ],
  "/admin/schedule": [
    { label: "Dashboard", path: "/admin/overview" },
    { label: "Jadwal & Penugasan" },
  ],
  "/admin/riwayatasesmenadmin": [
    { label: "Dashboard", path: "/admin/overview" },
    { label: "Riwayat Asesmen" },
  ],
  "/admin/sidangpleno": [
    { label: "Dashboard", path: "/admin/overview" },
    { label: "Sidang Pleno" },
  ],
  "/admin/tuk": [
    { label: "Dashboard", path: "/admin/overview" },
    { label: "Manajemen TUK" },
  ],
  "/admin/uploadsertifikat": [
    { label: "Dashboard", path: "/admin/overview" },
    { label: "Upload Sertifikat" },
  ],
  "/admin/users": [
    { label: "Dashboard", path: "/admin/overview" },
    { label: "Daftar Pengguna" },
  ],
  "/admin/reports": [
    { label: "Dashboard", path: "/admin/overview" },
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

  // Gabungkan rute dasar dengan rute tambahan dari form/state
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

            {isLast ? (
              // Jika ini langkah terakhir, tampilkan teks tebal berwarna biru
              <span className="text-[#008BE3] font-black">{crumb.label}</span>
            ) : "onClick" in crumb && crumb.onClick ? (
              // type-narrow: extraCrumbs from context can have different shape,
              // so ensure safe check for onClick
              // Jika ini rute state (seperti saat klik kembali ke Daftar Skema), gunakan tombol
              <button
                onClick={
                  crumb.onClick as React.MouseEventHandler<HTMLButtonElement>
                }
                className="text-slate-500 hover:text-[#008BE3] transition-colors cursor-pointer uppercase font-bold"
              >
                {crumb.label}
              </button>
            ) : crumb.path ? (
              // Jika ini rute URL normal, gunakan Link Next.js
              <Link
                href={crumb.path}
                className="text-slate-500 hover:text-[#008BE3] transition-colors cursor-pointer uppercase font-bold"
              >
                {crumb.label}
              </Link>
            ) : (
              // Jika tidak ada onClick dan tidak ada path, jadikan teks biasa
              <span className="text-slate-500">{crumb.label}</span>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
