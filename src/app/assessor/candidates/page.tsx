"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  LayoutList,
  Filter,
  ChevronDown,
  CheckCircle,
  Video,
  Clock,
  Calendar,
  CheckSquare,
  ArrowLeft,
  ArrowRight,
  Building2,
  MapPin,
  Users,
  ExternalLink,
  Layers,
  UserCheck,
  ShieldCheck,
  Globe,
  Mail,
  X,
} from "lucide-react";
import { AssessmentItem, BatchDetail, JenisMetode } from "@/types/types";
import { useAppContext } from "@/context/context";

export default function AsesiList() {
  const router = useRouter();
  const {
    setSelectedAsesmen,
    selectedAsesmen,
    AssessmentItems,
    deleteBatchAssessmentItems,
    completedBatchCodes,
  } = useAppContext();

  // State
  const [activeTab, setActiveTab] = useState<"Semua" | "Offline" | "Online">(
    "Semua",
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBatchCode, setSelectedBatchCode] = useState<string | null>(
    () => {
      return selectedAsesmen?.kodeBatch || null;
    },
  );
  const [candidateSearchTerm, setCandidateSearchTerm] = useState("");
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [successNotification, setSuccessNotification] = useState<string | null>(
    null,
  );

  // 1. Group assessments into Batches
  const batchMap = new Map<string, BatchDetail>();
  AssessmentItems.forEach((item: AssessmentItem) => {
    const skemaNama = item.skema || "Skema Asesmen";
    const batchKey = `${item.kodeBatch || skemaNama}-${item.tglAsesmen}`;

    if (!batchMap.has(batchKey)) {
      batchMap.set(batchKey, {
        id: item.kodeBatch || batchKey, // tambahkan — bisa pakai kodeBatch item, atau batchKey itu sendiri
        status: item.status || "Terjadwal", // tambahkan — sesuaikan default/sumbernya
        kodeBatch: item.kodeBatch,
        namaBatch: skemaNama,
        skema: skemaNama,
        tipeTuk: item.tipeTuk || "-",
        metode: (item.metode || "") as JenisMetode,
        tanggal: item.tglAsesmen || "05 Okt 2026",
        waktuMulai: item.waktu || "09:00 WIB",
        alamat: (item.alamat || "-") as string,
        linkVideo: item.linkVideo,
        candidates: [],
      });
    }
    const batch = batchMap.get(batchKey)!;
    batch.candidates.push({
      ...item,
      nik: item.nik || `32730128${(1000 + Number(item.id)).toString()}0001`,
      statusAPL02: item.statusApl || "APL-01 & APL-02 Terverifikasi",
    });
  });

  const allBatches = Array.from(batchMap.values()).filter(
    (b) => !completedBatchCodes.includes((b.kodeBatch) as string),
  );

  // 2. Filter batches according to active tab and search query
  const filteredBatches = allBatches.filter((batch) => {
    // Tab filter
    if (activeTab === "Offline" && batch.metode?.toLowerCase() !== "offline")
      return false;
    if (activeTab === "Online" && batch.metode?.toLowerCase() !== "online")
      return false;

    // Search query matches Batch Code, Batch Name, Scheme Name, or Candidate Name
    if (!searchTerm.trim()) return true;

    const query = searchTerm.toLowerCase();
    const matchBatchCode = batch.kodeBatch?.toLowerCase().includes(query);
    const matchBatchName = batch.namaBatch?.toLowerCase().includes(query);
    const matchSkema = batch.skema?.toLowerCase().includes(query);
    const matchCandidateName = batch.candidates.some((c) =>
      c.nama?.toLowerCase().includes(query),
    );

    return matchBatchCode || matchBatchName || matchSkema || matchCandidateName;
  });

  // Selected Batch for Level 2 View
  const currentSelectedBatch = allBatches.find(
    (b) => b.kodeBatch === selectedBatchCode,
  );

  const isAllCandidatesFinished = currentSelectedBatch
    ? currentSelectedBatch.candidates.length > 0 &&
      currentSelectedBatch.candidates.every((c) => c.status === "Selesai")
    : false;

  // Filter candidates inside Level 2 view
  const filteredCandidates = currentSelectedBatch
    ? currentSelectedBatch.candidates.filter(
        (c) =>
          c.nama?.toLowerCase().includes(candidateSearchTerm.toLowerCase()) ||
          c.nik?.toLowerCase().includes(candidateSearchTerm.toLowerCase()),
      )
    : [];

  return (
    <div className="min-h-screen bg-[#F8F9FC] p-4 md:p-8 space-y-6 pb-24 text-sm text-gray-700">
      {/* Header Banner */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-sky-50 flex items-center justify-center text-[#008BE3] border border-sky-100 shrink-0 shadow-2xs mt-0.5 sm:mt-0">
            <LayoutList size={22} className="sm:w-6 sm:h-6 stroke-[2.5]" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-tight mb-1">
              Daftar Asesmen
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium sm:max-w-md leading-relaxed">
              Kelola dan pantau proses asesmen kandidat asesi yang terkelompok
              berdasarkan Batch Penugasan.
            </p>
          </div>
        </div>

        {/* Top High-Level Metrics */}
        <div className="grid grid-cols-3 gap-2 w-full sm:w-auto shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 mt-1 sm:mt-0">
          <div className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-center">
            <span className="block text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Total
            </span>
            <span className="text-xs sm:text-sm font-black text-slate-900">
              {allBatches.length}
            </span>
          </div>
          <div className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-center">
            <span className="block text-[9px] sm:text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
              Offline
            </span>
            <span className="text-xs sm:text-sm font-black text-emerald-800">
              {
                allBatches.filter((b) => b.metode?.toLowerCase() === "offline")
                  .length
              }
            </span>
          </div>
          <div className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-purple-50 border border-purple-200 text-center">
            <span className="block text-[9px] sm:text-[10px] font-bold text-purple-600 uppercase tracking-wider">
              Online
            </span>
            <span className="text-xs sm:text-sm font-black text-purple-800">
              {
                allBatches.filter((b) => b.metode?.toLowerCase() === "online")
                  .length
              }
            </span>
          </div>
        </div>

        {/* Success Notification Banner */}
        {successNotification && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-4 rounded-xl flex items-center justify-between gap-3 shadow-2xs ">
            <div className="flex items-center gap-2.5">
              <CheckCircle size={20} className="text-emerald-600 shrink-0" />
              <span className="text-xs sm:text-sm font-bold">
                {successNotification}
              </span>
            </div>
            <button
              onClick={() => setSuccessNotification(null)}
              className="text-emerald-700 hover:text-emerald-900 p-1 rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>

      {/* VIEW SWITCHER: LEVEL 1 (Batch List) vs LEVEL 2 (Candidates inside selected Batch) */}
      {!selectedBatchCode ? (
        /* ==================== LEVEL 1 VIEW: BATCH LIST ==================== */
        <div className="space-y-6">
          {/* Filters & Search Row */}
          <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
            {/* Filter Dropdown */}
            <div className="relative w-full md:w-64">
              <Filter
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                size={16}
              />
              <select
                value={activeTab}
                onChange={(e) =>
                  setActiveTab(e.target.value as "Semua" | "Offline" | "Online")
                }
                className="w-full appearance-none pl-10 pr-9 py-2.5 bg-gray-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#008BE3]/20 focus:border-[#008BE3] transition-all cursor-pointer"
              >
                {" "}
                <option value="Semua">Semua Batch ({allBatches.length})</option>
                <option value="Offline">
                  Offline Batch (
                  {
                    allBatches.filter(
                      (b) => b.metode?.toLowerCase() === "offline",
                    ).length
                  }
                  )
                </option>
                <option value="Online">
                  {" "}
                  Online Batch (
                  {
                    allBatches.filter(
                      (b) => b.metode?.toLowerCase() === "online",
                    ).length
                  }
                  )
                </option>
              </select>
              <ChevronDown
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                size={16}
              />
            </div>

            {/* Search Input */}
            <div className="flex items-center gap-2 bg-gray-50/80 rounded-xl px-3.5 h-10.5 w-full md:w-80 border border-gray-200 focus-within:border-[#008BE3] focus-within:ring-1 focus-within:ring-[#008BE3]/30 transition-all">
              <Search className="text-gray-400 shrink-0" size={18} />
              <input
                type="text"
                placeholder="Cari Batch, Skema, atau Candidate..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none focus:ring-0 text-xs md:text-sm w-full outline-none text-slate-800 placeholder-gray-400 font-semibold"
              />
            </div>
          </div>

          {/* Batch Cards Grid */}
          {filteredBatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBatches.map((batch) => {
                const isOnline = batch.metode?.toLowerCase() === "online";
                const completedCount = batch.candidates.filter(
                  (c) => c.status === "Selesai",
                ).length;
                const totalCount = batch.candidates.length;
                const progressPercent = Math.round(
                  (completedCount / (totalCount || 1)) * 100,
                );

                return (
                  <div
                    key={batch.kodeBatch}
                    className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-[#008BE3]/50 transition-all flex flex-col justify-between overflow-hidden group"
                  >
                    {/* Card Top Header */}
                    <div className="p-5 space-y-3.5">
                      <div className="flex items-center justify-between gap-2">
                        {/* Batch Code Badge */}
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-black tracking-wide border border-slate-200">
                          <Layers size={13} className="text-slate-500" />
                          {batch.kodeBatch}
                        </div>

                        {/* AssessmentItem Type Badge */}
                        {isOnline ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                            <Video size={12} className="stroke-[2.5]" />
                            Online
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <Building2 size={12} className="stroke-[2.5]" />
                            Offline
                          </span>
                        )}
                      </div>

                      {/* Batch Name & Scheme */}
                      <div className="min-w-0">
                        <h3 className="text-base font-black text-slate-900 group-hover:text-[#008BE3] transition-colors leading-snug">
                          {batch.namaBatch}
                        </h3>
                        <p className="text-xs font-semibold text-slate-500 mt-0.5 leading-snug">
                          {batch.skema}
                        </p>
                      </div>

                      {/* Meta Information */}
                      <div className="pt-2 border-t border-slate-100 space-y-2 text-xs font-medium text-slate-600">
                        {/* Date & Time */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="flex items-center gap-1.5">
                            <Calendar
                              size={14}
                              className="text-slate-400 shrink-0"
                            />
                            <span>{batch.tanggal}</span>
                          </div>
                          <span className="text-slate-300">•</span>
                          <div className="flex items-center gap-1.5">
                            <Clock
                              size={14}
                              className="text-slate-400 shrink-0"
                            />
                            <span className="font-semibold text-slate-700">
                              {batch.waktuMulai}
                            </span>
                          </div>
                        </div>

                        {/* Location / TUK / Meeting Link */}
                        <div className="flex items-start gap-2">
                          {isOnline ? (
                            <>
                              <Globe
                                size={14}
                                className="text-purple-500 shrink-0 mt-0.5"
                              />
                              <span className="text-purple-700 font-semibold wrap-break-word leading-snug">
                                {batch.alamat}
                              </span>
                            </>
                          ) : (
                            <>
                              <MapPin
                                size={14}
                                className="text-[#008BE3] shrink-0 mt-0.5"
                              />
                              <span className="text-slate-700 font-semibold wrap-break-word leading-snug">
                                {batch.alamat}
                              </span>
                            </>
                          )}
                        </div>

                        {/* Total Candidates & Progress */}
                        <div className="flex items-center justify-between gap-2 pt-1">
                          <div className="flex items-center gap-2 flex-wrap text-slate-700 font-bold">
                            <div className="flex items-center gap-1.5">
                              <Users size={14} className="text-slate-400" />
                              <span>{totalCount} Asesi</span>
                            </div>
                          </div>

                          <span className="text-[11px] font-bold text-slate-500 shrink-0">
                            {completedCount}/{totalCount} Selesai (
                            {progressPercent}%)
                          </span>
                        </div>

                        {/* Mini Progress Bar */}
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 ${
                              progressPercent === 100
                                ? "bg-emerald-500"
                                : "bg-[#008BE3]"
                            }`}
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Card Footer Action */}
                    <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => setSelectedBatchCode((batch.kodeBatch as string))}
                        className="bg-[#008BE3] hover:bg-[#0076C2] text-white px-3.5 py-1.5 rounded-lg font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 ml-auto cursor-pointer"
                      >
                        Lihat Detail
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 shadow-2xs">
              <div className="flex flex-col items-center justify-center gap-3">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <Search size={28} />
                </div>
                <h4 className="text-base font-bold text-slate-800">
                  Batch Tidak Ditemukan
                </h4>
                <p className="text-xs text-slate-500 max-w-md">
                  Tidak ada Batch Penugasan yang sesuai dengan filter atau kata
                  kunci pencarian Anda.
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ==================== LEVEL 2 VIEW: CANDIDATE DETAIL IN BATCH ==================== */
        <div className="space-y-6">
          {/* Selected Batch Summary Banner */}
          {currentSelectedBatch && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-2xs space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-start gap-3">
                  {/* Navigation Back Button */}
                  <button
                    onClick={() => {
                      setSelectedBatchCode(null);
                      setSelectedAsesmen(null);
                      setCandidateSearchTerm("");
                    }}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-[#008BE3] bg-[#008BE3]/10 hover:bg-[#008BE3]/20 transition-colors cursor-pointer shrink-0 mt-0.5"
                    title="Kembali ke Daftar Batch"
                  >
                    <ArrowLeft size={18} />
                  </button>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="text-lg md:text-xl font-black text-slate-900">
                        {currentSelectedBatch.namaBatch}
                      </h3>
                      {currentSelectedBatch.metode?.toLowerCase() ===
                      "online" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
                          <Video size={13} /> Online
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <Building2 size={13} /> Offline
                        </span>
                      )}
                    </div>
                    <p className="text-xs md:text-sm text-slate-600 font-semibold">
                      Skema: {currentSelectedBatch.skema}
                    </p>
                  </div>
                </div>

                {/* Direct "Buka Link Meeting" Quick Button for Online Batches */}
                {currentSelectedBatch.metode?.toLowerCase() === "online" && (
                  <div className="shrink-0">
                    {currentSelectedBatch.linkVideo !== "-" ? (
                      <a
                        href={currentSelectedBatch.linkVideo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs md:text-sm px-4 py-2.5 rounded-xl shadow-xs transition-colors"
                      >
                        <Video size={18} />
                        Buka Link Meeting
                        <ExternalLink size={14} />
                      </a>
                    ) : (
                      <span className="text-xs text-slate-500 font-medium italic">
                        Link Meeting Belum Dikonfigurasi
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Batch Metadata Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <Calendar size={16} className="text-[#008BE3] shrink-0" />
                  <div className="min-w-0">
                    <span className="block text-[10px] text-slate-400 uppercase font-bold">
                      Tanggal & Waktu
                    </span>
                    <span className="font-bold text-slate-900">
                      {currentSelectedBatch.tanggal} (
                      {currentSelectedBatch.waktuMulai})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <MapPin size={16} className="text-[#008BE3] shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="block text-[10px] text-slate-400 uppercase font-bold">
                      Alamat & TUK
                    </span>
                    <span className="font-bold text-slate-900 wrap-break-word leading-snug block">
                      {currentSelectedBatch.alamat} (
                      {currentSelectedBatch.tipeTuk})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2  text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <UserCheck size={16} className="text-[#008BE3] shrink-0" />
                  <div className="min-w-0">
                    <span className="block text-[10px] text-slate-400 uppercase font-bold">
                      Jumlah Peserta
                    </span>
                    <span className="font-bold text-slate-900">
                      {currentSelectedBatch.candidates.length} Candidate Asesi
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <Mail size={16} className="text-[#008BE3] shrink-0" />
                  <div className="min-w-0">
                    <span className="block text-[10px] text-slate-400 uppercase font-bold">
                      Surat Penugasan
                    </span>
                    <a
                      href="https://drive.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#008BE3] hover:text-[#0070B8] hover:underline transition-colors mt-0.5"
                      title="Buka Surat Penugasan (Google Drive)"
                    >
                      <span>Lihat File</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* KODE BARU: BANNER & TOMBOL AKSI SELESAIKAN ASESMEN BATCH                  */}
          {/* Lokasi: src/pages/assessor/Candidates.tsx                                 */}
          {/* ========================================================================= */}
          {currentSelectedBatch && (
            <div
              className={`rounded-2xl border p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xs ${
                isAllCandidatesFinished
                  ? "bg-linear-to-r from-emerald-50 via-white to-emerald-50/60 border-emerald-300"
                  : "bg-white border-slate-200"
              }`}
            >
              <div className="flex items-start md:items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xs transition-colors ${
                    isAllCandidatesFinished
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-100 text-slate-400 border border-slate-200"
                  }`}
                >
                  <ShieldCheck size={26} className="stroke-[2.2]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-black text-slate-900">
                      Aksi Penyelesaian Batch Asesmen
                    </h4>
                    {isAllCandidatesFinished ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300 uppercase tracking-wide">
                        Siap Diseleksikan
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 uppercase tracking-wide">
                        Dalam Proses (
                        {
                          currentSelectedBatch.candidates.filter(
                            (c) => c.status === "Selesai",
                          ).length
                        }
                        /{currentSelectedBatch.candidates.length} Selesai)
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
                    {isAllCandidatesFinished
                      ? `Seluruh ${currentSelectedBatch.candidates.length} asesi pada batch ini sudah selesai dinilai. Klik tombol di kanan untuk menyelesaikan batch.`
                      : `Selesaikan penilaian untuk semua asesi pada batch ini untuk mengaktifkan tombol penyelesaian batch.`}
                  </p>
                </div>
              </div>

              <div className="shrink-0 w-full md:w-auto">
                <button
                  disabled={!isAllCandidatesFinished}
                  onClick={() => setShowCompleteModal(true)}
                  className={`w-full md:w-auto px-5 py-3 rounded-xl font-black text-xs md:text-sm flex items-center justify-center gap-2.5 transition-all shadow-xs ${
                    isAllCandidatesFinished
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-emerald-600/20 hover:shadow-md"
                      : "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                  }`}
                >
                  <ShieldCheck size={18} />
                  <span>Selesaikan Asesmen Batch</span>
                </button>
              </div>
            </div>
          )}
          {/* Candidate Table Section */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="min-w-0">
                <h3 className="text-base font-black text-slate-900">
                  Daftar Asesi dalam Batch
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Lakukan pemeriksaan berkas APL dan berikan penilaian
                  kompetensi untuk masing-masing asesi.
                </p>
              </div>

              {/* Candidate Search Input */}
              <div className="flex items-center gap-2 bg-gray-50/80 rounded-xl px-3 h-9.5 w-full sm:w-64 border border-gray-200 focus-within:border-[#008BE3] transition-colors">
                <Search className="text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Cari Nama Asesi..."
                  value={candidateSearchTerm}
                  onChange={(e) => setCandidateSearchTerm(e.target.value)}
                  className="bg-transparent border-none focus:ring-0 text-xs w-full outline-none text-gray-700 font-medium placeholder-gray-400"
                />
              </div>
            </div>

            <div className="overflow-x-auto relative">
              <table className="w-full text-left border-collapse min-w-150">
                <thead>
                  <tr className="bg-[#0F172A] border-b border-[#0F172A]">
                    <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider">
                      Nama Asesi
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider">
                      Status Asesmen
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-center">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="font-medium text-xs sm:text-sm divide-y divide-slate-100">
                  {filteredCandidates.length > 0 ? (
                    filteredCandidates.map((candidate) => (
                      <tr
                        key={candidate.id}
                        className="hover:bg-slate-50/80 transition-colors"
                      >
                        {/* Candidate Name */}
                        <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-900">
                          {candidate.nama}
                        </td>

                        {/* AssessmentItem Status */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${
                              candidate.status === "Selesai"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                            }`}
                          >
                            {candidate.status === "Selesai" ? (
                              <CheckCircle size={12} />
                            ) : (
                              <Clock size={12} />
                            )}
                            {candidate.status === "Selesai"
                              ? "Selesai"
                              : "Belum Selesai"}
                          </span>
                        </td>

                        {/* Action Column */}
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {candidate.status === "Selesai" ? (
                            <button
                              disabled
                              className="bg-slate-100 text-slate-400 px-3.5 py-1.5 rounded-lg font-bold text-xs shadow-xs cursor-not-allowed inline-flex items-center gap-1.5"
                            >
                              <CheckCircle size={14} /> Selesai
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setSelectedAsesmen(candidate);
                                router.push("/assessor/assessmentform");
                              }}
                              className="bg-slate-900 text-white hover:bg-slate-800 px-3.5 py-1.5 rounded-lg font-bold text-xs shadow-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                            >
                              <CheckSquare size={14} /> Beri Penilaian
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-6 py-12 text-center text-slate-400 font-medium"
                      >
                        Tidak ada candidate asesi ditemukan dalam batch ini.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500">
              <span>
                Menampilkan {filteredCandidates.length} dari{" "}
                {currentSelectedBatch
                  ? currentSelectedBatch.candidates.length
                  : 0}{" "}
                Asesi
              </span>
            </div>
          </div>
        </div>
      )}
      {showCompleteModal && currentSelectedBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 border border-slate-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-emerald-50/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                  <ShieldCheck size={18} />
                </div>
                <h3 className="font-black text-slate-900 text-base">
                  Konfirmasi Selesaikan Asesmen
                </h3>
              </div>
              <button
                onClick={() => setShowCompleteModal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 flex flex-col items-center justify-center text-center bg-white space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-1">
                <CheckCircle size={32} className="stroke-[2.5]" />
              </div>
              <h4 className="text-base font-bold text-slate-900">
                Selesaikan & Hapus Batch Asesmen Ini?
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed max-w-sm">
                Seluruh{" "}
                <strong className="text-slate-800">
                  {currentSelectedBatch.candidates.length} asesi
                </strong>{" "}
                pada batch{" "}
                <span className="font-bold text-slate-900">
                  {currentSelectedBatch.namaBatch}
                </span>{" "}
                telah selesai dinilai.
                <br />
                <br />
                Setelah dikonfirmasi, batch ini akan diselesaikan secara resmi
                dan <strong>dihapus dari daftar asesmen aktif</strong> Anda.
              </p>
            </div>

            <div className="p-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50">
              <button
                onClick={() => setShowCompleteModal(false)}
                className="px-4 py-2 font-bold text-xs text-slate-600 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  const name = currentSelectedBatch.namaBatch;
                  deleteBatchAssessmentItems((currentSelectedBatch.kodeBatch) as string);
                  setSelectedBatchCode(null);
                  setSelectedAsesmen(null);
                  setShowCompleteModal(false);
                  setSuccessNotification(
                    `Batch "${name}" telah berhasil diselesaikan dan dihapus dari daftar asesmen Anda.`,
                  );
                }}
                className="px-4 py-2.5 font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ShieldCheck size={15} />
                Ya, Selesaikan Asesmen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
