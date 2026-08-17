"use client";
import React, { useState } from "react";
import {
  Search,
  ArrowLeft,
  CheckCircle,
  Clock,
  Calendar,
  Building,
  MapPin,
  FileText,
  Eye,
  FileDown,
  ShieldCheck,
  AlertCircle,
  XCircle,
  X,
  Scale,
} from "lucide-react";
import { useAppContext } from "@/context/context";
import { Assessment } from "@/types/types";

export default function VerifikasiBanding() {
  const [mode, setMode] = useState<"list" | "detail">("list");
  const { setSelectedAsesmen, selectedAsesmen } = useAppContext();

  const handleVerify = (item: Assessment) => {
    setSelectedAsesmen(item);
    setMode("detail");
  };

  const handleBack = () => {
    setSelectedAsesmen(null);
    setMode("list");
  };

  if (mode === "detail" && selectedAsesmen) {
    return <DetailVerifikasiBanding onBack={handleBack} />;
  }

  return <VerifikasiBandingList onVerify={handleVerify} />;
}

function VerifikasiBandingList({
  onVerify,
}: {
  onVerify: (item: Assessment) => void;
}) {
  const { assessments } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [displayedCount, setDisplayedCount] = useState(10);

  // Filter only assessments that are 'Belum Kompeten' and have been appealed by Asesi
  const filteredAssessments = assessments.filter((item) => {
    if (item.hasil !== "Belum Kompeten" || !item.isBanding) return false;

    const matchesSearch =
      (item.nama || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.skema || "").toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const displayedAssessments = filteredAssessments.slice(0, displayedCount);

  const handleLoadMore = () => {
    setDisplayedCount((prev) => prev + 10);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] p-4 md:p-8 space-y-6 pb-24 text-sm text-gray-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center text-[#008BE3] border border-sky-100 shrink-0 shadow-2xs">
            <Scale size={24} className="stroke-[2.5]" />
          </div>
          <div className="min-w-0">
            <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">
              Verifikasi Banding
            </h2>
            <p className="text-[10px] sm:text-xs text-gray-400 font-bold tracking-wider uppercase leading-4">
              Tinjau dan verifikasi pengajuan banding asesmen dari asesi.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Cari nama asesi atau skema..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#008BE3]/20 focus:border-[#008BE3] transition-all"
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0F172A] border-b border-[#0F172A]">
                <th className="px-2.5 sm:px-6 py-2.5 sm:py-4 text-[10px] sm:text-xs font-bold text-white/90 uppercase tracking-wider whitespace-nowrap">
                  Nama Asesi
                </th>
                <th className="px-2.5 sm:px-6 py-2.5 sm:py-4 text-[10px] sm:text-xs font-bold text-white/90 uppercase tracking-wider whitespace-nowrap">
                  TUK
                </th>
                <th className="px-2.5 sm:px-6 py-2.5 sm:py-4 text-[10px] sm:text-xs font-bold text-white/90 uppercase tracking-wider whitespace-nowrap">
                  Skema
                </th>
                <th className="px-2.5 sm:px-6 py-2.5 sm:py-4 text-[10px] sm:text-xs font-bold text-white/90 uppercase tracking-wider whitespace-nowrap text-left sticky right-0 bg-[#0F172A] z-20 border-l border-white/10 shadow-[-6px_0_15px_-4px_rgba(0,0,0,0.06)]">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="font-medium text-xs sm:text-sm divide-y divide-gray-100">
              {displayedAssessments.length > 0 ? (
                displayedAssessments.map((item) => (
                  <tr
                    key={item.id}
                    className="group/row hover:bg-[#F9FAFC] transition-colors"
                  >
                    <td className="px-2.5 sm:px-6 py-2 sm:py-4 text-[11px] sm:text-sm font-medium text-slate-700 whitespace-nowrap">
                      {item.nama}
                    </td>
                    <td className="px-2.5 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider border ${
                          item.tuk === "Sewaktu"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : item.tuk === "Tempat Kerja"
                              ? "bg-purple-50 text-purple-700 border-purple-200"
                              : "bg-orange-50 text-orange-700 border-orange-200"
                        }`}
                      >
                        {item.tuk}
                      </span>
                    </td>
                    <td className="px-2.5 sm:px-6 py-2 sm:py-4 text-[11px] sm:text-sm font-bold text-slate-900 whitespace-nowrap">
                      {item.skema}
                    </td>
                    <td className="px-2.5 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-center bg-white group-hover/row:bg-[#F9FAFC] border-l border-gray-100 sticky right-0 z-10">
                      <div className="flex justify-center">
                        <button
                          onClick={() => onVerify(item)}
                          className="bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 px-2.5 sm:px-4 py-1 sm:py-2 rounded-lg font-bold text-[10px] sm:text-xs shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <ShieldCheck size={12} /> Verifikasi Banding
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-16 text-center text-gray-400"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Search
                        className="w-12 h-12 text-gray-300"
                        strokeWidth={1.5}
                      />
                      <span>Tidak ada data pengajuan banding asesmen.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs font-bold text-gray-500">
            Menampilkan {displayedAssessments.length} dari{" "}
            {filteredAssessments.length} asesmen
          </span>
          {displayedCount < filteredAssessments.length && (
            <button
              onClick={handleLoadMore}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-gray-50 hover:text-[#008BE3] transition-colors shadow-xs flex items-center gap-2"
            >
              Muat Lebih Banyak
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailVerifikasiBanding({ onBack }: { onBack: () => void }) {
  const { selectedAsesmen, setSelectedAsesmen, updateAssessment } =
    useAppContext();
  const [modalAction, setModalAction] = useState<"approve" | "reject" | null>(
    null,
  );
  const [catatanBaru, setCatatanBaru] = useState("");
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!selectedAsesmen) return null;

  const previousNote =
    selectedAsesmen.catatanAsesor ||
    "asesi masih perlu pendalaman pada aspek praktik lanjutan";

  const openModal = (action: "approve" | "reject") => {
    setModalAction(action);
    if (action === "approve") {
      setCatatanBaru("asesi sudah memenuhi kriteria");
    } else {
      setCatatanBaru("alasan banding masih kurang cukup kuat untuk disetujui");
    }
  };

  const handleConfirmModal = () => {
    if (!catatanBaru.trim()) return;
    setLoadingSubmit(true);

    setTimeout(() => {
      const updatedData =
        modalAction === "approve"
          ? {
              hasil: "Kompeten",
              isBanding: false,
              statusBanding: "Disetujui",
              catatanAsesor: catatanBaru.trim(),
            }
          : {
              isBanding: false,
              statusBanding: "Ditolak",
              catatanAsesor: catatanBaru.trim(),
            };

      updateAssessment(selectedAsesmen.id, updatedData);
      setSelectedAsesmen({ ...selectedAsesmen, ...updatedData });
      setLoadingSubmit(false);
      setModalAction(null);

      const actionText =
        modalAction === "approve" ? "Banding Disetujui" : "Banding Ditolak";
      setToastMessage(
        `Status & catatan asesor berhasil diperbarui: ${actionText}`,
      );

      setTimeout(() => {
        onBack();
      }, 1200);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] p-4 md:p-8 space-y-6 pb-24 text-sm text-gray-700 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-200 border border-slate-700">
          <CheckCircle size={18} className="text-emerald-400" />
          <span className="font-bold text-xs md:text-sm">{toastMessage}</span>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden">
        {/* Banner/Header Info */}
        <div className="p-4 sm:p-6 border-b border-gray-100 space-y-5">
          {/* Top Title & Badge Row */}
          <div className="flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={onBack}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-[#008BE3] bg-[#008BE3]/10 hover:bg-[#008BE3]/20 transition-colors cursor-pointer shrink-0"
                title="Kembali"
              >
                <ArrowLeft size={18} />
              </button>
              <div className="flex flex-col min-w-0">
                <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                  {selectedAsesmen.nama}
                </h1>
                <p className="text-xs md:text-sm text-gray-500 font-medium">
                  Skema: {selectedAsesmen.skema}
                </p>
              </div>
            </div>

            <div className="shrink-0">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shadow-2xs ${
                  selectedAsesmen.hasil === "Kompeten"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-red-50 text-red-700 border-red-200"
                }`}
              >
                {selectedAsesmen.hasil}
              </span>
            </div>
          </div>

          {/* Grid Metadata Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 pt-3 border-t border-gray-100">
            <div className="min-w-0">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">
                TUK
              </p>
              <div className="flex items-center gap-1.5 text-slate-700 font-semibold text-xs sm:text-sm">
                <MapPin size={14} className="text-slate-400 shrink-0" />
                {selectedAsesmen.tuk}
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">
                Pelaksanaan
              </p>
              <div className="flex items-center gap-1.5 text-slate-700 font-semibold text-xs sm:text-sm">
                <Building size={14} className="text-slate-400 shrink-0" />
                {selectedAsesmen.tuk}
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">
                Tanggal
              </p>
              <div className="flex items-center gap-1.5 text-slate-700 font-semibold text-xs sm:text-sm">
                <Calendar size={14} className="text-slate-400 shrink-0" />
                {selectedAsesmen.tglAsesmen}
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">
                Waktu
              </p>
              <div className="flex items-center gap-1.5 text-slate-700 font-semibold text-xs sm:text-sm">
                <Clock size={14} className="text-slate-400 shrink-0" />
                {selectedAsesmen.waktu}
              </div>
            </div>
          </div>
        </div>

        {/* Alasan Banding Section */}
        <div className="p-4 sm:p-8 border-b border-gray-100 bg-orange-50/50">
          <h2 className="text-base sm:text-lg font-black text-orange-900 tracking-tight mb-4 flex items-center gap-2">
            <AlertCircle size={20} className="text-orange-600 shrink-0" />{" "}
            Pengajuan Banding Asesi
          </h2>
          <div className="p-4 bg-white rounded-lg border border-orange-200 text-slate-700">
            <p className="font-medium text-xs sm:text-sm leading-relaxed">
              {selectedAsesmen.alasanBanding ||
                "Saya merasa jawaban saya pada saat wawancara teknis sudah sesuai dengan KUK yang diujikan, namun asesor menyatakan belum kompeten."}
            </p>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => openModal("reject")}
              className="px-6 py-2.5 bg-white border-2 border-red-200 text-red-600 hover:bg-red-50 rounded-lg font-bold text-xs sm:text-sm shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <XCircle size={18} />
              Tolak Banding
            </button>
            <button
              onClick={() => openModal("approve")}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs sm:text-sm shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle size={18} />
              Setujui Banding (Ubah ke Kompeten)
            </button>
          </div>
        </div>

        {/* Detail Penilaian (Read-only) */}
        <div className="p-8">
          <h2 className="text-lg font-black text-slate-900 tracking-tight mb-6 flex items-center gap-2">
            Rekapitulasi Penilaian Asesmen
          </h2>

          <div className="space-y-6">
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-slate-50 p-4 border-b border-slate-200 font-bold text-slate-800">
                FR.AK.04A - Keputusan dan Umpan Balik Asesmen
              </div>
              <div className="p-4 bg-white flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                    <FileText size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-800 text-sm">
                      FR_AK_04A_Signed.pdf
                    </p>
                    <p className="text-xs text-slate-500">
                      Telah diisi oleh Asesi dan Asesor
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      alert("Pratinjau dokumen: FR_AK_04A_Signed.pdf")
                    }
                    className="flex items-center gap-2 px-4 py-2 bg-[#008BE3] hover:bg-[#0076C2] text-white rounded-lg text-sm font-bold transition-colors"
                  >
                    <Eye size={16} /> Pratinjau
                  </button>
                  <button
                    onClick={() =>
                      alert("Mengunduh dokumen: FR_AK_04A_Signed.pdf")
                    }
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-bold transition-colors"
                  >
                    <FileDown size={16} /> Unduh
                  </button>
                </div>
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-slate-50 p-4 border-b border-slate-200 font-bold text-slate-800">
                FR.AK.04B - Umpan Balik dan Catatan Asesmen
              </div>
              <div className="p-4 bg-white flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                    <FileText size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-800 text-sm">
                      FR_AK_04B_Signed.pdf
                    </p>
                    <p className="text-xs text-slate-500">
                      Telah diisi oleh Asesi dan Asesor
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      alert("Pratinjau dokumen: FR_AK_04B_Signed.pdf")
                    }
                    className="flex items-center gap-2 px-4 py-2 bg-[#008BE3] hover:bg-[#0076C2] text-white rounded-lg text-sm font-bold transition-colors"
                  >
                    <Eye size={16} /> Pratinjau
                  </button>
                  <button
                    onClick={() =>
                      alert("Mengunduh dokumen: FR_AK_04B_Signed.pdf")
                    }
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-bold transition-colors"
                  >
                    <FileDown size={16} /> Unduh
                  </button>
                </div>
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-slate-50 p-4 border-b border-slate-200 font-bold text-slate-800">
                FR.IA.07 - Pertanyaan Lisan
              </div>
              <div className="p-4 bg-white flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                    <FileText size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-800 text-sm">
                      FR_IA_07_Signed.pdf
                    </p>
                    <p className="text-xs text-slate-500">
                      Telah diisi oleh Asesi dan Asesor
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      alert("Pratinjau dokumen: FR_IA_07_Signed.pdf")
                    }
                    className="flex items-center gap-2 px-4 py-2 bg-[#008BE3] hover:bg-[#0076C2] text-white rounded-lg text-sm font-bold transition-colors"
                  >
                    <Eye size={16} /> Pratinjau
                  </button>
                  <button
                    onClick={() =>
                      alert("Mengunduh dokumen: FR_IA_07_Signed.pdf")
                    }
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-bold transition-colors"
                  >
                    <FileDown size={16} /> Unduh
                  </button>
                </div>
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-slate-50 p-4 border-b border-slate-200 font-bold text-slate-800 flex items-center justify-between">
                <span>Rekomendasi / Catatan Asesor</span>
                {Boolean(selectedAsesmen.catatanAsesor) && (
                  <span className="text-xs bg-sky-100 text-sky-800 font-bold px-2.5 py-0.5 rounded-full">
                    Diperbarui
                  </span>
                )}
              </div>
              <div className="p-6 bg-white space-y-4">
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">
                    Catatan Observasi
                  </p>
                  <div className="p-3.5 bg-gray-50 rounded-lg border border-gray-200 text-slate-800 text-sm font-medium min-h-15 leading-relaxed">
                    {String(
                      selectedAsesmen.catatanAsesor ||
                        "asesi masih perlu pendalaman pada aspek praktik lanjutan",
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Dialog Catatan Asesor */}
      {modalAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div
              className={`p-5 border-b flex items-center justify-between ${
                modalAction === "approve"
                  ? "bg-emerald-50/80 border-emerald-100"
                  : "bg-red-50/80 border-red-100"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`p-2 rounded-xl ${
                    modalAction === "approve"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {modalAction === "approve" ? (
                    <CheckCircle size={22} />
                  ) : (
                    <XCircle size={22} />
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="font-black text-slate-900 text-base">
                    {modalAction === "approve"
                      ? "Setujui Banding Asesi"
                      : "Tolak Banding Asesi"}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500">
                    Isi catatan asesor untuk memperbarui hasil verifikasi
                    banding.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalAction(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/50 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-xs md:text-sm">
              {/* Catatan Asesor Sebelumnya */}
              <div className="min-w-0">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Catatan Asesor Sebelumnya
                </label>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 font-medium italic text-xs leading-relaxed">
                  {`"${String(previousNote || "-")}"`}
                </div>
              </div>

              {/* Catatan Asesor Baru */}
              <div className="min-w-0">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5 flex items-center justify-between">
                  <span>
                    Catatan Asesor Baru <span className="text-red-500">*</span>
                  </span>
                  <span className="text-[11px] text-slate-400 font-normal">
                    Dapat disesuaikan kembali
                  </span>
                </label>
                <textarea
                  rows={4}
                  value={catatanBaru}
                  onChange={(e) => setCatatanBaru(e.target.value)}
                  placeholder="Tuliskan catatan asesor yang baru..."
                  className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-[#008BE3]/20 focus:border-[#008BE3] font-medium text-slate-800 text-xs md:text-sm leading-relaxed"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setModalAction(null)}
                disabled={loadingSubmit}
                className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold rounded-lg text-xs md:text-sm transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmModal}
                disabled={loadingSubmit || !catatanBaru.trim()}
                className={`px-5 py-2 text-white font-bold rounded-lg text-xs md:text-sm transition-colors flex items-center gap-2 shadow-xs disabled:opacity-50 ${
                  modalAction === "approve"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {loadingSubmit ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : modalAction === "approve" ? (
                  "Simpan & Setujui"
                ) : (
                  "Simpan & Tolak"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
