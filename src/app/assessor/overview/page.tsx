"use client";
import React from "react";
import {
  ChevronRight,
  CheckCircle,
  Users,
  Scale,
  LayoutDashboard,
  Calendar,
  ArrowRight,
  AlertCircle,
  Layers,
} from "lucide-react";

import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/context";
import {
  AssessmentItem,
  BatchDetail,
  JenisMetode,
  TipeTuk,
  StatCardProps,
  Candidate,
} from "@/types/types";

export default function AssessorOverview() {
  const router = useRouter(); // Gunakan router jika nanti untuk navigasi, atau hapus jika benar-benar tidak dipakai
  const { AssessmentItems, setSelectedAsesmen } = useAppContext();

  // Tambahkan state ini jika belum ada untuk menghindari error "completedBatchCodes is not defined"
  const completedBatchCodes: string[] = [];

  const batchMap = new Map<string, BatchDetail>();

  (AssessmentItems || []).forEach((item: AssessmentItem) => {
    // Berikan fallback string kosong '' untuk mencegah error undefined pada substring
    const skemaVal = item.skema || "Umum";
    const code =
      item.kodeBatch ||
      `BATCH-${skemaVal.substring(0, 3).toUpperCase()}-${item.id}`;

    const name = item.namaBatch || `Batch Asesmen ${skemaVal}`;

    if (!batchMap.has(code)) {
      batchMap.set(code, {
        id: item.id,
        status: item.status || "",
        kodeBatch: code,
        namaBatch: name,
        skema: skemaVal, // Pastikan tipe data string aman
        metode: item.metode as JenisMetode,
        tipeTuk: item.tipeTuk as TipeTuk,
        alamat: item.alamat || "Gedung UIN SGD",
        tanggal: item.tglAsesmen || "05 Okt 2023",
        waktuMulai: item.waktu || "08:00 - 12:00 WIB",
        linkVideo: item.linkVideo || "-",
        candidates: [],
      });
    }
    const batch = batchMap.get(code)!;
    batch.candidates.push({ ...item });
  });

  const availableBatches = Array.from(batchMap.values()).filter(
    (b) => !completedBatchCodes.includes(b.kodeBatch as string),
  );

  // 2. Perbaiki tipe 'any' menjadi 'AssessmentItem'
  const bandingItems = (AssessmentItems || []).filter(
    (item: AssessmentItem) => item.hasil === "Belum Kompeten" && item.isBanding,
  );

  return (
    <div className="min-h-screen bg-[#F8F9FC] p-4 md:p-8 space-y-6 pb-24 text-sm text-gray-700">
      {/* Title Section */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-lg bg-[#008BE3]/10 flex items-center justify-center text-[#008BE3] border border-[#008BE3]/20 shadow-xs shrink-0">
          <LayoutDashboard size={20} className="stroke-[2.5]" />
        </div>
        <div className="min-w-0">
          <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">
            Dashboard Asesor
          </h2>
          <p className="text-xs text-gray-400 font-bold tracking-wider uppercase leading-4">
            Sistem Manajemen Asesmen & Verifikasi Banding
          </p>
        </div>
      </div>

      {/* Welcome Banner */}
      <div className="bg-[#E6F4FF] rounded-lg border border-sky-200 p-4 md:p-6 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-6 overflow-hidden relative shadow-2xs">
        <div className="space-y-2 z-10 max-w-xl">
          <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none">
            Selamat Datang, Dr. Aris Thorne
          </h2>
          <p className="text-slate-700 text-xs md:text-sm font-medium leading-relaxed">
            Kelola daftar batch asesmen aktif yang siap dinilai dan pantau
            pengajuan banding dari asesi di bawah ini.
          </p>
          <div className="pt-0.5">
            <span className="inline-flex items-center gap-1.5 bg-[#008BE3] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg shadow-xs">
              ID Asesor: ASESOR-10824
            </span>
          </div>
        </div>

        <div className="absolute right-0 top-0 w-64 h-64 bg-linear-to-bl from-sky-200/50 to-transparent rounded-full -translate-y-1/2 translate-x-1/3 opacity-70"></div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard
          title="Batch Asesmen Tersedia"
          value={availableBatches.length.toString().padStart(2, "0")}
          icon={Layers}
          theme="sky"
          subtext="Siap Dinilai & Dikelola"
          onClick={() => router.push("/assessor/candidates")}
        />
        <StatCard
          title="Pengajuan Banding Asesi"
          value={bandingItems.length.toString().padStart(2, "0")}
          icon={Scale}
          theme="amber"
          subtext="Membutuhkan Verifikasi"
          onClick={() => router.push("/assessor/verifikasibanding")}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Panel 1: Daftar Asesmen (Batch Tersedia) */}
        <div className="bg-white rounded-lg shadow-xs border border-gray-100 overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-[#F9FAFC]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-sky-50 text-[#008BE3] border border-sky-100 flex items-center justify-center">
                <Layers size={18} />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 leading-tight">
                  Daftar Asesmen (Batch Tersedia)
                </h3>
                <p className="text-[11px] text-gray-400 font-medium">
                  Batch uji kompetensi yang dapat dinilai
                </p>
              </div>
            </div>
            <button
              onClick={() => router.push("/assessor/candidates")}
              className="text-xs font-bold text-[#008BE3] hover:underline flex items-center gap-1 cursor-pointer shrink-0"
            >
              Lihat Semua <ArrowRight size={14} />
            </button>
          </div>

          <div className="p-4 space-y-3 flex-1">
            {availableBatches.length > 0 ? (
              availableBatches.slice(0, 2).map((batch: BatchDetail) => {
                const completedCount = batch.candidates.filter(
                  (c: Candidate) => c.statusAsesmen === "Selesai",
                ).length;
                const totalCount = batch.candidates.length;
                return (
                  <div
                    key={batch.kodeBatch}
                    onClick={() => router.push("/assessor/candidates")}
                    className="p-3.5 border border-gray-100 rounded-lg hover:border-sky-200 hover:bg-sky-50/40 transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-bold text-sky-700 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-md uppercase">
                          {batch.kodeBatch}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase ${
                            batch.metode?.toLowerCase() === "online"
                              ? "bg-purple-50 text-purple-700 border-purple-200"
                              : "bg-emerald-50 text-emerald-700 border-emerald-200"
                          }`}
                        >
                          {batch.metode}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm group-hover:text-[#008BE3] transition-colors truncate">
                        {batch.namaBatch}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium truncate">
                        {batch.skema}
                      </p>
                      <div className="flex items-center gap-3 text-[11px] text-gray-400 pt-1">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} /> {batch.tanggal}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Users size={12} /> {completedCount}/{totalCount}{" "}
                          Asesi Selesai
                        </span>
                      </div>
                    </div>
                    <div className="shrink-0 flex items-center justify-end sm:justify-center">
                      <span className="text-xs font-bold text-[#008BE3] group-hover:translate-x-1 transition-transform flex items-center gap-1 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs">
                        Buka Batch <ChevronRight size={14} />
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 flex items-center justify-center">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200 shadow-2xs">
                  <AlertCircle size={14} className="text-slate-400" /> Tidak ada
                  batch asesmen yang tersedia
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Panel 2: Daftar Banding Diajukan Asesi */}
        <div className="bg-white rounded-lg shadow-xs border border-gray-100 overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-[#F9FAFC]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center">
                <Scale size={18} />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 leading-tight">
                  Daftar Banding Diajukan Asesi
                </h3>
                <p className="text-[11px] text-gray-400 font-medium">
                  Verifikasi pengajuan banding hasil asesmen
                </p>
              </div>
            </div>
            <button
              onClick={() => router.push("/assessor/verifikasi-banding")}
              className="text-xs font-bold text-[#008BE3] hover:underline flex items-center gap-1 cursor-pointer shrink-0"
            >
              Lihat Semua <ArrowRight size={14} />
            </button>
          </div>

          <div className="p-4 space-y-3 flex-1">
            {bandingItems.length > 0 ? (
              bandingItems.slice(0, 2).map((item: AssessmentItem) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedAsesmen(item);
                    router.push("/assessor/verifikasibanding");
                  }}
                  className="p-3.5 border border-gray-100 rounded-lg hover:border-amber-200 hover:bg-amber-50/30 transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md uppercase flex items-center gap-1">
                        <AlertCircle size={10} /> Banding Diajukan
                      </span>
                      <span className="text-xs text-gray-400 font-medium">
                        • {item.tglAsesmen}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm group-hover:text-amber-700 transition-colors truncate">
                      {item.nama}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium truncate">
                      {item.skema}
                    </p>
                    <p className="text-[11px] text-gray-400">
                      TUK:{" "}
                      <span className="font-semibold text-slate-700">
                        {item.tipeTuk}
                      </span>
                    </p>
                  </div>
                  <div className="shrink-0 flex items-center justify-end sm:justify-center">
                    <span className="text-xs font-bold text-amber-700 group-hover:translate-x-1 transition-transform flex items-center gap-1 bg-white border border-amber-200 px-3 py-1.5 rounded-lg shadow-2xs">
                      Verifikasi <ChevronRight size={14} />
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 flex items-center justify-center">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 shadow-2xs">
                  <CheckCircle size={14} className="text-amber-500" /> Tidak ada
                  pengajuan banding saat ini
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, theme, subtext, onClick }: StatCardProps) {
  let containerClass = "";
  let titleClass = "";
  let subtextClass = "";
  let iconClass = "";

  if (theme === "amber") {
    containerClass =
      "bg-[#FFFBEB] border border-[#FDE68A] hover:border-amber-300";
    titleClass = "text-amber-800";
    subtextClass = "text-amber-600";
    iconClass = "bg-amber-500 text-white";
  } else if (theme === "emerald") {
    containerClass =
      "bg-[#F4FBF7] border border-[#A7F3D0] hover:border-emerald-300";
    titleClass = "text-emerald-800";
    subtextClass = "text-emerald-600";
    iconClass = "bg-[#84CC16] text-white";
  } else {
    // sky
    containerClass =
      "bg-[#E6F4FF] border border-[#BCE0FD] hover:border-sky-300";
    titleClass = "text-sky-800";
    subtextClass = "text-sky-600";
    iconClass = "bg-[#008BE3] text-white";
  }

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-lg flex items-center justify-between shadow-2xs group hover:scale-[1.01] transition-all duration-200 cursor-pointer ${containerClass}`}
    >
      <div className="space-y-0.5">
        <span
          className={`text-[10px] font-black uppercase tracking-wider block ${titleClass}`}
        >
          {title}
        </span>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-black text-slate-900 tracking-tight">
            {value}
          </span>
        </div>
        <p className={`text-[11px] font-bold ${subtextClass}`}>{subtext}</p>
      </div>
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 shadow-xs ${iconClass}`}
      ></div>
    </div>
  );
}
