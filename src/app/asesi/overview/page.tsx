"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Clock,
  CheckCircle,
  Search,
  FileText,
  Calendar,
  User,
  Plus,
  LayoutDashboard,
  Eye,
  FileEdit,
} from "lucide-react";
import { useAppContext } from "@/context/context";

// IMPORT DARI types.ts
import type { RegisteredAssessment } from "@/types/types";

const REGISTERED_ASSESSMENTS: RegisteredAssessment[] = [
  {
    id: "1",
    asesmen: "Uji Kompetensi",
    skemaSertifikasi: "Jenjang 5 Bidang Kewirausahaan Industri",
    tipeTuk: "Mandiri",
    alamat: "Jl. Ahmad Yani No. 123, Bandung",
    tanggalAsesmen: "13/07/2026",
    linkVirtualMeeting: "-",
    asesor: "Dr. Hendra",
    jenisBukti: "Portofolio & Praktik",
    rekomendasi: "Kompeten",
    statusAsesmen: "Selesai",
  },
  {
    id: "2",
    asesmen: "Uji Teori & Praktik",
    skemaSertifikasi: "Melaksanakan Komunikasi Dengan Pemangku Kepentingan",
    tipeTuk: "Sewaktu",
    alamat: "Gedung A, Lt. 2, Kampus Utama",
    tanggalAsesmen: "05/08/2026",
    linkVirtualMeeting: "-",
    asesor: "Asesor Budi",
    jenisBukti: "Praktik & Tes Lisan",
    rekomendasi: "Belum Kompeten",
    statusAsesmen: "Selesai",
  },
  {
    id: "3",
    asesmen: "Asesmen Mandiri",
    skemaSertifikasi: "Penerjemah Teks Umum",
    tipeTuk: "Mandiri",
    alamat: "Online",
    tanggalAsesmen: "22/10/2026",
    linkVirtualMeeting: "https://meet.google.com/abc-defg-hij",
    asesor: "Asesor Siti",
    jenisBukti: "Portofolio",
    rekomendasi: "-",
    statusAsesmen: "Terjadwal",
  },
  {
    id: "4",
    asesmen: "Asesmen Mandiri",
    skemaSertifikasi: "Auditor Halal",
    tipeTuk: "Mandiri",
    alamat: "Online",
    tanggalAsesmen: "24/10/2026",
    linkVirtualMeeting: "https://meet.google.com/xyz-abcd-efg",
    asesor: "Asesor Anton",
    jenisBukti: "Portofolio",
    rekomendasi: "-",
    statusAsesmen: "Terjadwal",
  },
  {
    id: "5",
    asesmen: "Asesmen Mandiri",
    skemaSertifikasi: "Penyelia Halal",
    tipeTuk: "Mandiri",
    alamat: "Online",
    tanggalAsesmen: "-",
    linkVirtualMeeting: "-",
    asesor: "Belum Ditugaskan",
    jenisBukti: "Portofolio",
    rekomendasi: "-",
    statusAsesmen: "Menunggu Verifikasi",
  },
];

export default function AsesiOverviewPage() {
  const { user } = useAppContext();
  const router = useRouter();

  // 1. Siapkan state untuk menampung nama dan ID
  const [namaLengkap, setNamaLengkap] = useState<string>("Asesi");
  const [asesiId, setAsesiId] = useState<string>("ASESI-0000");

  // 2. Pasang Radar buat narik data dari database
  React.useEffect(() => {
    const fetchProfil = async () => {
      try {
        const response = await fetch("/api/profil");
        if (response.ok) {
          // Type assertion untuk menghindari 'any' type
          const data = (await response.json()) as {
            namaLengkap?: string;
            id?: string;
            userId?: string | number;
          };

          // Set Nama: Prioritas dari database (namaLengkap) -> Session (name/email) -> "Asesi"
          if (data.namaLengkap) {
            setNamaLengkap(data.namaLengkap);
          } else if (user?.username) {
            setNamaLengkap(user.username);
          } else if (user?.email) {
            setNamaLengkap(user.email);
          }

          // Set ID: Ambil dari database.
          if (data.id && data.userId) {
            setAsesiId(`ASESI-${String(data.userId).padStart(4, "0")}`);
          } else if (user?.id) {
            const numericId = String(user.id).replace(/[^0-9]/g, "");
            setAsesiId(`ASESI-${numericId.padStart(4, "0")}`);
          }
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(
            "Gagal mengambil profil untuk dashboard:",
            error.message,
          );
        } else {
          console.error("Gagal mengambil profil untuk dashboard:", error);
        }
      }
    };

    fetchProfil();
  }, [user]);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [dateFilter, setDateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [selectedAssessment, setSelectedAssessment] =
    useState<RegisteredAssessment | null>(null);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, dateFilter]);

  const filteredAssessments = REGISTERED_ASSESSMENTS.filter((item) => {
    const matchesSearch =
      item.asesmen.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.skemaSertifikasi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.asesor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tipeTuk.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "Semua" || item.statusAsesmen === statusFilter;
    const matchesDate =
      !dateFilter ||
      item.tanggalAsesmen === dateFilter.split("-").reverse().join("/");

    return matchesSearch && matchesStatus && matchesDate;
  });

  const totalPages = Math.ceil(
    (filteredAssessments?.length || 0) / itemsPerPage,
  );
  const currentRecords = filteredAssessments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const getRekomendasiBadge = (rek: string) => {
    if (rek === "Kompeten") {
      return (
        <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider whitespace-nowrap border border-green-200">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>K
          (Kompeten)
        </span>
      );
    }
    if (rek === "Belum Kompeten") {
      return (
        <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider whitespace-nowrap border border-red-200">
          <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
          BK (Belum Kompeten)
        </span>
      );
    }
    return <span className="text-gray-400 text-xs font-semibold px-2">-</span>;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Selesai":
        return (
          <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200 text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider whitespace-nowrap">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
            Selesai
          </span>
        );
      case "Terjadwal":
        return (
          <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200 text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider whitespace-nowrap">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
            Terjadwal
          </span>
        );
      case "Belum Mulai":
        return (
          <span className="inline-flex items-center gap-1.5 bg-gray-50 text-gray-600 border border-gray-200 text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider whitespace-nowrap">
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>Belum
            Mulai
          </span>
        );
      case "Menunggu Verifikasi":
        return (
          <span className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-700 border border-purple-200 text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider whitespace-nowrap">
            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
            Menunggu Verifikasi
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 bg-gray-50 text-gray-700 border border-gray-200 text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider whitespace-nowrap">
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
            {status}
          </span>
        );
    }
  };

  const totalAsesmen = REGISTERED_ASSESSMENTS.length;
  const selesaiCount = REGISTERED_ASSESSMENTS.filter(
    (a) => a.statusAsesmen === "Selesai",
  ).length;
  const inProgressCount = totalAsesmen - selesaiCount;

  return (
    <div className="space-y-6 pb-24 text-sm text-gray-700">
      {/* Page Title Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-[#008BE3]/10 flex items-center justify-center text-[#008BE3] border border-[#008BE3]/20 shadow-xs shrink-0">
            <LayoutDashboard size={20} className="stroke-[2.5]" />
          </div>
          <div className="min-w-0">
            <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none mb-1 md:whitespace-nowrap">
              Dashboard Asesi
            </h2>
            <p className="text-xs text-gray-400 font-bold tracking-wider uppercase leading-4 md:whitespace-nowrap">
              Pusat Informasi dan Status Sertifikasi Kompetensi Anda
            </p>
          </div>
        </div>
        <button
          onClick={() => router.push("/asesi/pengajuanskema")}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#008BE3] hover:bg-[#0076C2] text-white rounded-lg text-xs md:text-sm font-extrabold shadow-md hover:shadow-lg transition-all shrink-0"
        >
          <Plus size={16} className="stroke-3" />
          <span>Ajukan Sertifikasi Baru</span>
        </button>
      </div>

      {/* Greeting Banner */}
      <div className="bg-[#E6F4FF] rounded-lg border border-sky-200 p-4 md:p-6 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-6 overflow-hidden relative shadow-2xs">
        <div className="space-y-2 z-10 max-w-xl">
          <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none capitalize">
            Selamat Datang, {namaLengkap}
          </h2>
          <p className="text-slate-700 text-xs md:text-sm font-medium leading-relaxed">
            Sudah siap untuk melangkah lebih dekat menuju kompetensi
            bersertifikasi? Pantau status ujian mandiri Anda di bawah ini.
          </p>
          <div className="pt-0.5">
            <span className="inline-flex items-center gap-1.5 bg-[#008BE3] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg shadow-xs">
              ID Asesi: {asesiId}
            </span>
          </div>
        </div>

        <div className="hidden md:flex shrink-0 self-center">
          <svg viewBox="0 0 240 140" className="w-48 h-auto" fill="none">
            <path
              d="M20 120 L220 120"
              stroke="#008BE3"
              strokeWidth="4"
              strokeLinecap="round"
              opacity="0.3"
            />
            <path
              d="M165 80 L185 115"
              stroke="#003865"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M150 90 L185 90"
              stroke="#003865"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <path
              d="M140 120 C140 95 152 75 162 75 C172 75 174 95 174 120"
              fill="#008BE3"
            />
            <path
              d="M135 98 L152 90"
              stroke="#F5C754"
              strokeWidth="4.5"
              strokeLinecap="round"
            />
            <circle cx="157" cy="52" r="11" fill="#F5C754" />
            <path
              d="M148 48 C148 40 166 40 166 48 C166 52 161 56 157 56 C153 56 148 52 148 48 Z"
              fill="#003865"
            />
            <path
              d="M146 50 L144 64"
              stroke="#003865"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M100 120 L125 88 L150 88"
              stroke="#003865"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path d="M125 88 L142 112" stroke="#008BE3" strokeWidth="3" />
            <circle
              cx="45"
              cy="40"
              r="5"
              fill="#84CC16"
              className="animate-pulse"
            />
            <circle cx="215" cy="55" r="7" fill="#84CC16" />
            <circle cx="95" cy="30" r="4" fill="#008BE3" opacity="0.5" />
            <path
              d="M35 85 L50 85"
              stroke="#84CC16"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M42.5 77.5 L42.5 92.5"
              stroke="#84CC16"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* Overview Section */}
      <div className="space-y-2">
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">
          Overview
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#E6F4FF] p-4 rounded-lg border border-[#BCE0FD] flex items-center justify-between shadow-2xs group hover:scale-[1.01] transition-transform duration-200">
            <div className="space-y-0.5">
              <span className="text-[10px] font-black text-sky-800 uppercase tracking-wider block">
                Total Terdaftar
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-slate-900 tracking-tight">
                  {totalAsesmen}
                </span>
                <span className="text-base font-bold text-sky-700 ml-0.75">
                  Asesmen
                </span>
              </div>
              <p className="text-[11px] font-bold text-sky-600">
                Kegiatan Terjadwal
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#008BE3] text-white flex items-center justify-center shrink-0 shadow-xs">
              <FileText size={18} />
            </div>
          </div>
          <div className="bg-[#F4FBF7] p-4 rounded-lg border border-[#A7F3D0] flex items-center justify-between shadow-2xs group hover:scale-[1.01] transition-transform duration-200">
            <div className="space-y-0.5">
              <span className="text-[10px] font-black text-emerald-800 uppercase tracking-wider block">
                Selesai
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-slate-900 tracking-tight">
                  {selesaiCount}
                </span>
                <span className="text-base font-bold text-emerald-700 ml-0.75">
                  Kompeten
                </span>
              </div>
              <p className="text-[11px] font-bold text-emerald-600">
                Uji Mandiri Lulus
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#84CC16] text-white flex items-center justify-center shrink-0 shadow-xs">
              <CheckCircle size={18} />
            </div>
          </div>
          <div className="bg-[#F1F5F9] p-4 rounded-lg border border-[#CBD5E1] flex items-center justify-between shadow-2xs group hover:scale-[1.01] transition-transform duration-200">
            <div className="space-y-0.5">
              <span className="text-[10px] font-black text-slate-800 uppercase tracking-wider block">
                Berjalan
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-slate-900 tracking-tight">
                  {inProgressCount}
                </span>
                <span className="text-base font-bold text-slate-700 ml-0.75">
                  Evaluasi
                </span>
              </div>
              <p className="text-[11px] font-bold text-slate-500">
                Dalam Penilaian
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-slate-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Clock size={18} />
            </div>
          </div>
        </div>
      </div>

      {/* Search & Live Assessments Section */}
      <section className="bg-white rounded-lg shadow-xs border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="min-w-0">
            <h3 className="text-base font-black text-slate-900">
              Cari Asesmen Anda
            </h3>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 w-full lg:w-auto ml-auto">
            <div className="flex items-center gap-2 bg-gray-50/80 rounded-lg px-3 h-10.5 w-full sm:w-68 border border-gray-200/50 focus-within:border-[#008BE3]/40 transition-colors">
              <Search className="text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Cari asesmen, skema, atau TUK..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none focus:ring-0 text-[14px] w-full outline-none text-gray-700 placeholder-gray-400 font-semibold"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-50 border border-gray-200/50 text-[14px] rounded-lg px-3 h-10.5 outline-none text-gray-700 cursor-pointer font-bold"
            >
              <option value="Semua">Semua Status</option>
              <option value="Belum Mulai">Belum Mulai</option>
              <option value="Terjadwal">Terjadwal</option>
              <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
              <option value="Selesai">Selesai</option>
            </select>
            <div className="flex items-center gap-2 bg-gray-50/80 rounded-lg px-3 h-10.5 w-full sm:w-44 border border-gray-200/50 focus-within:border-[#008BE3]/40 transition-colors">
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="bg-transparent border-none focus:ring-0 text-xs md:text-sm w-full outline-none text-gray-700 font-semibold"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto relative ">
          <table className="w-full text-left border-collapse min-w-[1600px]">
            <thead>
              <tr className="bg-[#0F172A] border-b border-[#0F172A]">
                <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-left min-w-15 sticky top-0 z-20 bg-[#0F172A]">
                  No
                </th>
                <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-left min-w-87.5 max-w-125 sticky top-0 z-20 bg-[#0F172A]">
                  Skema Sertifikasi
                </th>
                <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-left min-w-37.5 sticky top-0 z-20 bg-[#0F172A]">
                  TUK
                </th>
                <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-left min-w-75 sticky top-0 z-20 bg-[#0F172A]">
                  Alamat
                </th>
                <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-left min-w-45 sticky top-0 z-20 bg-[#0F172A]">
                  Tanggal Asesmen
                </th>
                <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-left min-w-62.5 sticky top-0 z-20 bg-[#0F172A]">
                  Asesor
                </th>
                <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-left min-w-50 sticky top-0 z-20 bg-[#0F172A]">
                  Virtual Meeting
                </th>
                <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-left min-w-45 sticky top-0 z-20 bg-[#0F172A]">
                  Hasil
                </th>
                <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-left min-w-40 sticky top-0 z-20 bg-[#0F172A]">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-left sticky right-0 bg-[#0F172A] z-30 border-l border-white/10 shadow-[-6px_0_15px_-4px_rgba(0,0,0,0.06)] backdrop-blur-xs min-w-40 top-0">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/60">
              {filteredAssessments.length > 0 ? (
                currentRecords.map((item, idx) => (
                  <tr
                    key={item.id}
                    className="group/row hover:bg-[#F9FAFC] transition-colors"
                  >
                    <td className="px-6 py-4 text-xs md:text-sm text-center font-semibold text-slate-700">
                      <div
                        className={`mx-auto w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-xs font-bold text-xs ${
                          idx % 3 === 0
                            ? "bg-[#008BE3]/10 text-[#008BE3]"
                            : idx % 3 === 1
                              ? "bg-[#84CC16]/10 text-[#73B412]"
                              : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {(currentPage - 1) * itemsPerPage + idx + 1}
                      </div>
                    </td>
                    <td className="px-6 py-4 min-w-87.5 max-w-125">
                      <div className="flex items-center gap-4 text-xs md:text-sm font-semibold text-[#008BE3]">
                        <span className="line-clamp-2 leading-tight">
                          {item.skemaSertifikasi}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          item.tipeTuk.includes("Sewaktu")
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : item.tipeTuk.includes("Tempat Kerja")
                              ? "bg-purple-50 text-purple-700 border-purple-200"
                              : item.tipeTuk.includes("Virtual") ||
                                  item.tipeTuk.includes("Online")
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-orange-50 text-orange-700 border-orange-200"
                        }`}
                      >
                        {item.tipeTuk}
                      </span>
                    </td>
                    <td
                      className="px-6 py-4 text-xs text-gray-500 font-medium"
                      title={item.alamat}
                    >
                      {item.alamat}
                    </td>
                    <td className="px-6 py-4 text-xs md:text-sm font-semibold text-gray-600">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar size={14} className="text-gray-400" />
                        {item.tanggalAsesmen}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs md:text-sm text-gray-800 font-semibold">
                      <span className="inline-flex items-center gap-1.5">
                        <User size={14} className="text-gray-400" />
                        {item.asesor}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs md:text-sm">
                      {item.linkVirtualMeeting &&
                      item.linkVirtualMeeting !== "-" ? (
                        <span className="inline-flex items-center gap-1 bg-[#008BE3]/10 text-[#008BE3] border border-[#008BE3]/20 text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider whitespace-nowrap ">
                          <span className="w-1.5 h-1.5 bg-[#008BE3] rounded-full"></span>
                          Tersedia
                        </span>
                      ) : item.alamat === "Online" ||
                        item.tipeTuk.includes("Virtual") ||
                        item.tipeTuk.includes("Online") ? (
                        <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-50 border border-slate-200 text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider whitespace-nowrap ">
                          <span className="w-1.5 h-1.5 bg-slate-400 rounded-full"></span>
                          Belum Tersedia
                        </span>
                      ) : (
                        <span className="text-gray-400 font-semibold px-2">
                          -
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs md:text-sm">
                      {getRekomendasiBadge(item.rekomendasi)}
                    </td>
                    <td className="px-6 py-4 text-xs md:text-sm">
                      {getStatusBadge(item.statusAsesmen)}
                    </td>

                    <td className="px-6 py-4 text-center sticky right-0 bg-white group-hover/row:bg-[#F9FAFC] z-10 border-l border-gray-100 shadow-[-6px_0_15px_-4px_rgba(0,0,0,0.06)] transition-colors">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            if (
                              item.tipeTuk === "Mandiri" &&
                              item.statusAsesmen === "Terjadwal"
                            ) {
                              router.push("/asesi/ujian");
                            } else {
                              setSelectedAssessment(item);
                            }
                          }}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-2xs border ${
                            item.tipeTuk === "Mandiri" &&
                            item.statusAsesmen === "Terjadwal"
                              ? "bg-[#008BE3] text-white border-transparent hover:bg-[#0076C2]"
                              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-[#008BE3] hover:border-[#008BE3]/30"
                          }`}
                        >
                          {item.tipeTuk === "Mandiri" &&
                          item.statusAsesmen === "Terjadwal" ? (
                            <>
                              <FileEdit size={14} /> Mulai Ujian
                            </>
                          ) : (
                            <>
                              <Eye size={14} /> Detail
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={10}
                    className="px-6 py-12 text-center text-xs md:text-sm text-gray-400 font-medium"
                  >
                    Tidak ada kegiatan asesmen yang cocok dengan pencarian atau
                    filter Anda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages >= 1 && (
          <div className="p-4 px-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 font-medium bg-gray-50/50 rounded-b-xl">
            <span>
              Menampilkan{" "}
              <span className="font-semibold text-slate-700">
                {(currentPage - 1) * itemsPerPage + 1}
              </span>{" "}
              hingga{" "}
              <span className="font-semibold text-slate-700">
                {Math.min(
                  currentPage * itemsPerPage,
                  filteredAssessments.length,
                )}
              </span>{" "}
              dari{" "}
              <span className="font-semibold text-slate-700">
                {filteredAssessments.length}
              </span>{" "}
              entri
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Sebelumnya
              </button>
              <div className="hidden sm:flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium transition-colors ${
                        currentPage === page
                          ? "bg-[#008BE3] text-white border border-[#008BE3]"
                          : "text-slate-700 bg-white border border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}
              </div>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Detail Modal */}
      {selectedAssessment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-black text-slate-800 text-lg">
                Detail Asesmen
              </h3>
              <button
                onClick={() => setSelectedAssessment(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors"
              >
                X
              </button>
            </div>
            <div className="p-5 space-y-4 font-medium text-sm">
              <div className="grid grid-cols-3 gap-2">
                <span className="text-slate-500 font-semibold">
                  Skema Sertifikasi
                </span>
                <span className="col-span-2 font-bold text-slate-900">
                  {selectedAssessment.skemaSertifikasi}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-slate-500 font-semibold">Asesmen</span>
                <span className="col-span-2 font-bold text-slate-900">
                  {selectedAssessment.asesmen}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-slate-500 font-semibold">TUK</span>
                <span className="col-span-2 font-bold text-slate-900">
                  {selectedAssessment.tipeTuk}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-slate-500 font-semibold">Alamat</span>
                <span className="col-span-2 text-slate-900">
                  {selectedAssessment.alamat}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-slate-500 font-semibold">
                  Tanggal Asesmen
                </span>
                <span className="col-span-2 text-slate-900">
                  {selectedAssessment.tanggalAsesmen}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-slate-500 font-semibold">Asesor</span>
                <span className="col-span-2 text-slate-900">
                  {selectedAssessment.asesor}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-slate-500 font-semibold">
                  Virtual Meeting
                </span>
                <span className="col-span-2 text-slate-900">
                  {selectedAssessment.linkVirtualMeeting &&
                  selectedAssessment.linkVirtualMeeting !== "-" ? (
                    <a
                      href={selectedAssessment.linkVirtualMeeting}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#008BE3] hover:underline"
                    >
                      {selectedAssessment.linkVirtualMeeting}
                    </a>
                  ) : (
                    "-"
                  )}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 items-center">
                <span className="text-slate-500 font-semibold">Status</span>
                <span className="col-span-2">
                  {getStatusBadge(selectedAssessment.statusAsesmen)}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 items-center">
                <span className="text-slate-500 font-semibold">
                  Rekomendasi
                </span>
                <span className="col-span-2">
                  {selectedAssessment.rekomendasi !== "-"
                    ? getRekomendasiBadge(selectedAssessment.rekomendasi)
                    : "-"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
