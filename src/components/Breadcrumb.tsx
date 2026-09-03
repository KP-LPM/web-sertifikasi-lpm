"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppContext } from "@/context/context";
import { CrumbItem } from "@/types/types";

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
const ROUTE_CRUMBS: Record<string, CrumbItem[]> = {
  // ---------------- ASESOR ----------------
  "/assessor/overview": [{ label: "Dashboard" }],
  "/assessor/candidates": [
    { label: "Dashboard", href: "/assessor/overview" },
    { label: "Daftar Asesmen" },
  ],
  "/assessor/asessmentform": [
    { label: "Dashboard", href: "/assessor/overview" },
    { label: "Daftar Asesmen", href: "/assessor/candidates" },
    { label: "Form Asesmen" },
  ],
  "/assessor/jadwalkanonline": [
    { label: "Dashboard", href: "/assessor/overview" },
    { label: "Daftar Asesmen", href: "/assessor/candidates" },
    { label: "Jadwalkan Online" },
  ],
  "/assessor/penilaianonline": [
    { label: "Dashboard", href: "/assessor/overview" },
    { label: "Daftar Asesmen", href: "/assessor/candidates" },
    { label: "Penilaian Online" },
  ],
  "/assessor/finalization": [
    { label: "Dashboard", href: "/assessor/overview" },
    { label: "Daftar Asesmen", href: "/assessor/candidates" },
    { label: "Finalisasi" },
  ],
  "/assessor/riwayatasesmen": [
    { label: "Dashboard", href: "/assessor/overview" },
    { label: "Riwayat Asesmen" },
  ],
  "/assessor/detailriwayatasesmen": [
    { label: "Dashboard", href: "/assessor/overview" },
    { label: "Riwayat Asesmen", href: "/assessor/riwayatasesmen" },
    { label: "Detail Riwayat" },
  ],
  "/assessor/verifikasiapl02": [
    { label: "Dashboard", href: "/assessor/overview" },
    { label: "Verifikasi Berkas" },
  ],
  "/assessor/verifikasiportofolio": [
    { label: "Dashboard", href: "/assessor/overview" },
    { label: "Verifikasi Portofolio" },
  ],
  "/assessor/verifikasibanding": [
    { label: "Dashboard", href: "/assessor/overview" },
    { label: "Verifikasi Banding" },
  ],
  "/assessor/konfigurasipertanyaan": [
    { label: "Dashboard", href: "/assessor/overview" },
    { label: "Konfigurasi Pertanyaan" },
  ],
  "/assessor/tambahkonfigurasipertanyaan": [
    { label: "Dashboard", href: "/assessor/overview" },
    {
      label: "Konfigurasi Pertanyaan",
      href: "/assessor/konfigurasipertanyaan",
    },
    { label: "Buat Paket Soal" },
  ],
  "/assessor/detailkonfigurasipertanyaan": [
    { label: "Dashboard", href: "/assessor/overview" },
    {
      label: "Konfigurasi Pertanyaan",
      href: "/assessor/konfigurasipertanyaan",
    },
    { label: "Detail Paket Soal" },
  ],

  // ---------------- ASESI ----------------
  "/asesi/overview": [{ label: "Dashboard" }],
  "/asesi/pengajuanskema": [{ label: "Dashboard", href: "/asesi/overview" }],
  "/asesi/riwayatasesmen": [
    { label: "Dashboard", href: "/asesi/overview" },
    // Label disesuaikan dengan kode asesi lama
    { label: "Riwayat & Sertifikat", href: "/asesi/riwayatasesmen" },
  ],
  "/asesi/banding": [
    { label: "Dashboard", href: "/asesi/overview" },
    { label: "Banding Asesmen", href: "/asesi/banding" },
  ],
  // Tambahan rute Ujian Online yang sebelumnya hilang
  "/asesi/ujian": [
    { label: "Dashboard", href: "/asesi/overview" },
    { label: "Ujian Online", href: "/asesi/ujian" },
  ],

  // ---------------- ADMIN / DIREKTUR / MANAJER ----------------
  "/admin/overview": [{ label: "Dashboard" }],
  "/direktur/dashboard": [{ label: "Dashboard" }],
  "/admin/kelolapengguna": [
    { label: "Dashboard", href: "/admin/overview" },
    { label: "Kelola Pengguna" },
  ],
  "/admin/kelolasurat": [
    { label: "Dashboard", href: "/admin/overview" },
    { label: "Kelola Surat" },
  ],
  "/admin/schemes": [
    { label: "Dashboard", href: "/admin/overview" },
    { label: "Skema Sertifikasi" },
  ],
  "/admin/schedule": [
    { label: "Dashboard", href: "/admin/overview" },
    { label: "Jadwal & Penugasan" },
  ],
  "/admin/riwayatasesmenadmin": [
    { label: "Dashboard", href: "/admin/overview" },
    { label: "Riwayat Asesmen" },
  ],
  "/admin/sidangpleno": [
    { label: "Dashboard", href: "/admin/overview" },
    { label: "Sidang Pleno" },
  ],
  "/admin/tuk": [
    { label: "Dashboard", href: "/admin/overview" },
    { label: "Manajemen TUK" },
  ],
  "/admin/uploadsertifikat": [
    { label: "Dashboard", href: "/admin/overview" },
    { label: "Upload Sertifikat" },
  ],
  "/admin/verifikasiberkas": [
    { label: "Dashboard", href: "/admin/overview" },
    { label: "Daftar Pengguna" },
  ],
  "/admin/reports": [
    { label: "Dashboard", href: "/admin/overview" },
    { label: "Laporan" },
  ],
};

export function Breadcrumb({ className = "" }: { className?: string }) {
  const { user, extraCrumbs } = useAppContext();
  const pathname = usePathname();

  if (!user || !pathname) return null;

  let baseCrumbs: CrumbItem[] | undefined;
  if (pathname === "/profile") {
    baseCrumbs = [
      { label: "Dashboard", href: getDashboardPath(user.role) },
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
            ) : crumb.href ? (
              // Jika ini rute URL normal, gunakan Link Next.js
              <Link
                href={crumb.href}
                className="text-slate-500 hover:text-[#008BE3] transition-colors cursor-pointer uppercase font-bold"
              >
                {crumb.label}
              </Link>
            ) : (
              // Jika tidak ada onClick dan tidak ada href, jadikan teks biasa
              <span className="text-slate-500">{crumb.label}</span>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
