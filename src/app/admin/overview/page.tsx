"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  Clock,
  LayoutDashboard,
  FileCheck,
  ChevronRight,
  Eye,
  FileText
} from "lucide-react";
import { useAppContext } from "@/context/context";

export default function AdminOverview() {
  const router = useRouter();
  const { user } = useAppContext();
  
  const adminName = user?.username || user?.username || "Administrator LSP";

  const pendingVerificationList = [
    {
      id: "1",
      asesiName: "Ahmad Hidayat",
      email: "ahmad.h@student.uin.ac.id",
      skema: "Software Quality Assurance",
      berkas: [
        "FR.APL.01 Permohonan",
        "FR.APL.02 Asesmen Mandiri",
        "Pasfoto 3x4",
        "KTP / KTM",
        "Transkrip Nilai",
      ],
      waktu: "5 menit yang lalu",
      status: "Menunggu Verifikasi",
      pembayaran: "Belum Bayar",
    },
    {
      id: "2",
      asesiName: "Budi Pratama",
      email: "budi.p@student.uin.ac.id",
      skema: "Data Science Professional",
      berkas: [
        "FR.APL.01 Permohonan",
        "FR.APL.02 Asesmen Mandiri",
        "Bukti Pembayaran APBN",
        "Ijazah Terakhir",
      ],
      waktu: "25 menit yang lalu",
      status: "Menunggu Verifikasi",
      pembayaran: "Sudah Bayar",
    },
    {
      id: "3",
      asesiName: "Siti Nurhaliza",
      email: "siti.n@student.uin.ac.id",
      skema: "Network Administrator",
      berkas: [
        "FR.APL.01 Permohonan",
        "Sertifikat Pelatihan Jaringan",
        "KTP",
        "Pasfoto",
      ],
      waktu: "1 jam yang lalu",
      status: "Menunggu Verifikasi",
      pembayaran: "Belum Bayar",
    },
  ];

  return (
    // Memakai pembungkus yang sama persis dengan Asesi (tanpa padding berlebih)
    <div className="space-y-6 pb-24 text-sm text-gray-700">
      
      {/* Page Title Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-[#008BE3]/10 flex items-center justify-center text-[#008BE3] border border-[#008BE3]/20 shadow-xs shrink-0">
            <LayoutDashboard size={20} className="stroke-[2.5]" />
          </div>
          <div className="min-w-0">
            <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none mb-1 md:whitespace-nowrap">
              Dashboard Admin
            </h2>
            <p className="text-xs text-gray-400 font-bold tracking-wider uppercase leading-4 md:whitespace-nowrap">
              Sistem Administrasi dan Pengelolaan Sertifikasi Kompetensi
            </p>
          </div>
        </div>
      </div>

      {/* Greeting Banner persis seperti Asesi */}
      <div className="bg-[#E6F4FF] rounded-lg border border-sky-200 p-4 md:p-6 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-6 overflow-hidden relative shadow-2xs">
        <div className="space-y-2 z-10 max-w-xl">
          <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none capitalize">
            Selamat Datang, {adminName}
          </h2>
          <p className="text-slate-700 text-xs md:text-sm font-medium leading-relaxed">
            Kelola pengguna, skema sertifikasi, verifikasi berkas asesi, jadwal
            uji kompetensi, dan sidang pleno dalam satu panel terpusat.
          </p>
          <div className="pt-0.5">
            <span className="inline-flex items-center gap-1.5 bg-[#008BE3] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg shadow-xs">
              ID Admin: ADMIN-001
            </span>
          </div>
        </div>

        {/* SVG Graphic agar tidak kosong */}
        <div className="hidden md:flex shrink-0 self-center z-10">
          <svg viewBox="0 0 240 140" className="w-48 h-auto" fill="none">
            <path d="M20 120 L220 120" stroke="#008BE3" strokeWidth="4" strokeLinecap="round" opacity="0.3" />
            <path d="M165 80 L185 115" stroke="#003865" strokeWidth="4" strokeLinecap="round" />
            <path d="M150 90 L185 90" stroke="#003865" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M140 120 C140 95 152 75 162 75 C172 75 174 95 174 120" fill="#008BE3" />
            <path d="M135 98 L152 90" stroke="#F5C754" strokeWidth="4.5" strokeLinecap="round" />
            <circle cx="157" cy="52" r="11" fill="#F5C754" />
            <path d="M148 48 C148 40 166 40 166 48 C166 52 161 56 157 56 C153 56 148 52 148 48 Z" fill="#003865" />
            <path d="M146 50 L144 64" stroke="#003865" strokeWidth="3" strokeLinecap="round" />
            <path d="M100 120 L125 88 L150 88" stroke="#003865" strokeWidth="4" strokeLinecap="round" />
            <path d="M125 88 L142 112" stroke="#008BE3" strokeWidth="3" />
            <circle cx="45" cy="40" r="5" fill="#84CC16" className="animate-pulse" />
            <circle cx="215" cy="55" r="7" fill="#84CC16" />
            <circle cx="95" cy="30" r="4" fill="#008BE3" opacity="0.5" />
            <path d="M35 85 L50 85" stroke="#84CC16" strokeWidth="3" strokeLinecap="round" />
            <path d="M42.5 77.5 L42.5 92.5" stroke="#84CC16" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* Overview Cards Section meniru Asesi */}
      <div className="space-y-2">
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">
          Overview
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Card 1: Sky */}
          <div className="bg-[#E6F4FF] p-4 rounded-lg border border-[#BCE0FD] flex items-center justify-between shadow-2xs group hover:scale-[1.01] transition-transform duration-200 cursor-pointer">
            <div className="space-y-0.5">
              <span className="text-[10px] font-black text-sky-800 uppercase tracking-wider block">
                Perlu Diverifikasi
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-slate-900 tracking-tight">
                  5
                </span>
                <span className="text-base font-bold text-sky-700 ml-0.75">
                  Berkas
                </span>
              </div>
              <p className="text-[11px] font-bold text-sky-600">
                Menunggu Tindakan Admin
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#008BE3] text-white flex items-center justify-center shrink-0 shadow-xs">
              <FileText size={18} />
            </div>
          </div>

          {/* Card 2: Emerald */}
          <div className="bg-[#F4FBF7] p-4 rounded-lg border border-[#A7F3D0] flex items-center justify-between shadow-2xs group hover:scale-[1.01] transition-transform duration-200 cursor-pointer">
            <div className="space-y-0.5">
              <span className="text-[10px] font-black text-emerald-800 uppercase tracking-wider block">
                Total Disetujui
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-slate-900 tracking-tight">
                  845
                </span>
                <span className="text-base font-bold text-emerald-700 ml-0.75">
                  Berkas
                </span>
              </div>
              <p className="text-[11px] font-bold text-emerald-600">
                Telah Diverifikasi Sah
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#84CC16] text-white flex items-center justify-center shrink-0 shadow-xs">
              <CheckCircle size={18} />
            </div>
          </div>

          {/* Card 3: Slate */}
          <div className="bg-[#F1F5F9] p-4 rounded-lg border border-[#CBD5E1] flex items-center justify-between shadow-2xs group hover:scale-[1.01] transition-transform duration-200 cursor-pointer">
            <div className="space-y-0.5">
              <span className="text-[10px] font-black text-slate-800 uppercase tracking-wider block">
                Sidang Pleno
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-slate-900 tracking-tight">
                  5
                </span>
                <span className="text-base font-bold text-slate-700 ml-0.75">
                  Jadwal
                </span>
              </div>
              <p className="text-[11px] font-bold text-slate-500">
                Menunggu Pelaksanaan
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-slate-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Clock size={18} />
            </div>
          </div>
        </div>
      </div>

      {/* Aktivitas Terbaru Section */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden flex flex-col">
        <div className="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
          <div>
            <h3 className="text-sm md:text-base font-black text-slate-900 flex items-center gap-2">
              <FileCheck className="text-[#008BE3]" size={18} />
              Aktivitas Terbaru: Berkas Perlu Diverifikasi
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Daftar dokumen berkas pendaftaran APL.01 & APL.02 asesi terbaru
              yang memerlukan tinjauan verifikasi admin.
            </p>
          </div>
          <button
            onClick={() => router.push("/admin/verifikasiberkas")}
            className="px-3.5 py-2 bg-[#008BE3] hover:bg-[#0076C2] text-white rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95 self-start sm:self-auto"
          >
            <span>Lihat Semua Berkas</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="overflow-x-auto relative">
          <table className="w-full text-left border-collapse min-w-200">
            <thead>
              <tr className="bg-[#0F172A] border-b border-[#0F172A]">
                <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-center min-w-15 sticky top-0 z-20 bg-[#0F172A]">
                  No
                </th>
                <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-left min-w-64 sticky top-0 z-20 bg-[#0F172A]">
                  Nama Asesi
                </th>
                <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-left min-w-87.5 sticky top-0 z-20 bg-[#0F172A]">
                  Skema Sertifikasi
                </th>
                <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-center min-w-40 sticky top-0 z-20 bg-[#0F172A]">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-center sticky right-0 bg-[#0F172A] z-30 border-l border-white/10 shadow-[-6px_0_15px_-4px_rgba(0,0,0,0.06)] min-w-32 top-0">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/60">
              {pendingVerificationList.map((item, index) => (
                <tr
                  key={item.id}
                  className="group/row hover:bg-[#F9FAFC] transition-colors"
                >
                  {/* Kolom No (dengan kotak warna-warni ala Asesi) */}
                  <td className="px-6 py-4 text-xs md:text-sm text-center font-semibold text-slate-700">
                    <div
                      className={`mx-auto w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-xs font-bold text-xs ${
                        index % 3 === 0
                          ? "bg-[#008BE3]/10 text-[#008BE3]"
                          : index % 3 === 1
                            ? "bg-[#84CC16]/10 text-[#73B412]"
                            : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {index + 1}
                    </div>
                  </td>

                  {/* Kolom Nama */}
                  <td className="px-6 py-4 align-middle">
                    <p className="font-bold text-slate-900 text-xs md:text-sm truncate">
                      {item.asesiName}
                    </p>
                  </td>

                  {/* Kolom Skema */}
                  <td className="px-6 py-4 align-middle">
                    <p className="text-xs md:text-sm font-bold text-[#008BE3] truncate">
                      {item.skema}
                    </p>
                  </td>

                  {/* Kolom Status (Dengan bullet point) */}
                  <td className="px-6 py-4 text-center align-middle">
                    <span className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-700 border border-purple-200 text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider whitespace-nowrap">
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                      {item.status}
                    </span>
                  </td>

                  {/* Kolom Aksi (Bisa shadow pas di-scroll ke kanan) */}
                  <td className="px-6 py-4 text-center align-middle sticky right-0 bg-white group-hover/row:bg-[#F9FAFC] z-10 border-l border-gray-100 shadow-[-6px_0_15px_-4px_rgba(0,0,0,0.06)] transition-colors">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => router.push("/admin/verifikasiberkas")}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-sky-50 text-[#008BE3] border border-slate-200 hover:border-[#008BE3]/30 rounded-lg text-xs font-bold transition-all shadow-2xs shrink-0"
                      >
                        <Eye size={14} />
                        <span>Tinjau</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}