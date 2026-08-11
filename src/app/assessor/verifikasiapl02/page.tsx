"use client";
import React, { useState } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  CheckCircle,
  Calendar,
  ChevronLeft,
  ShieldCheck,
} from "lucide-react";
import { useAppContext } from "@/context/context";
import { Assessment } from "@/types/types";
import { FormFRAPL02 } from "@/components/forms";

export default function VerifikasiAPL02() {
  const [mode, setMode] = useState<"list" | "form">("list");
  const { setSelectedAsesmen } = useAppContext();

  const handleVerify = (item: Assessment) => {
    setSelectedAsesmen(item);
    setMode("form");
  };

  const handleBack = () => {
    setSelectedAsesmen(null);
    setMode("list");
  };

  if (mode === "form") {
    return <VerifikasiForm onBack={handleBack} />;
  }

  return <VerifikasiAPL02List onVerify={handleVerify} />;
}

function VerifikasiAPL02List({
  onVerify,
}: {
  onVerify: (item: Assessment) => void;
}) {
  const { assessments } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [jenisFilter, setJenisFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [displayedCount, setDisplayedCount] = useState(10);

  // Using context data
  // removed hasOnlineMode
  const parseIndonesianDate = (dateString: string) => {
    const months: Record<string, number> = {
      Jan: 0,
      Feb: 1,
      Mar: 2,
      Apr: 3,
      Mei: 4,
      Jun: 5,
      Jul: 6,
      Agt: 7,
      Sep: 8,
      Okt: 9,
      Nov: 10,
      Des: 11,
    };
    const parts = dateString.split(" ");
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = months[parts[1]];
      const year = parseInt(parts[2], 10);
      return new Date(year, month, day);
    }
    return new Date(0);
  };

  const filteredAssessments = assessments.filter((item) => {
    // Only show active assessments (not done)
    if (item.status === "Selesai") return false;
    let matchesDate = true;
    if (startDate || endDate) {
      const itemDate = parseIndonesianDate(item.tglAsesmen || "");
      itemDate.setHours(0, 0, 0, 0);

      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        if (itemDate < start) matchesDate = false;
      }

      if (endDate) {
        const end = new Date(endDate);
        end.setHours(0, 0, 0, 0);
        if (itemDate > end) matchesDate = false;
      }
    }

    const matchesSearch =
      (item.nama || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.skema || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesJenis =
      jenisFilter === "" ||
      (item.jenis_asesmen || "").toLowerCase() === jenisFilter.toLowerCase();

    return matchesSearch && matchesJenis && matchesDate;
  });

  const displayedAssessments = filteredAssessments.slice(0, displayedCount);

  const handleLoadMore = () => {
    setDisplayedCount((prev) => prev + 10);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] p-4 md:p-8 space-y-6 pb-24 text-sm text-gray-700">
      {/* Header Section */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">
          Verifikasi Berkas APL 02
        </h2>
        <p className="text-xs sm:text-sm font-medium text-slate-600">
          Tinjau dan verifikasi dokumen permohonan asesmen mandiri (FR.APL.02)
          dari asesi.
        </p>
      </div>

      {/* Filter Section */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-3 sm:gap-4">
        <div className="flex-1 relative w-full">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 shrink-0"
            size={18}
          />
          <input
            type="text"
            placeholder="Cari nama asesi atau skema..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 sm:py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#008BE3]/20 focus:border-[#008BE3] transition-all"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-2 w-full md:w-auto">
          <div className="relative w-full sm:w-auto">
            <select
              value={jenisFilter}
              onChange={(e) => setJenisFilter(e.target.value)}
              className="w-full appearance-none pl-9 pr-8 py-2 sm:py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#008BE3]/20 focus:border-[#008BE3] transition-all cursor-pointer"
            >
              <option value="">Semua Jenis</option>
              <option value="Sertifikasi">Sertifikasi</option>
              <option value="Sertifikasi Ulang">Sertifikasi Ulang</option>
              <option value="PKL">PKL</option>
            </select>
            <Filter
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none shrink-0"
              size={15}
            />
            <ChevronDown
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none shrink-0"
              size={15}
            />
          </div>

          <div className="flex items-center justify-between sm:justify-start gap-1 sm:gap-2 bg-gray-50 border border-gray-200 rounded-xl px-2.5 sm:px-3 py-1.5 w-full sm:w-auto overflow-hidden">
            <Calendar size={15} className="text-gray-400 shrink-0" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-transparent text-xs sm:text-sm border-none focus:ring-0 p-0.5 text-gray-600 cursor-pointer w-26.25 sm:w-auto min-w-0"
            />
            <span className="text-gray-400 text-xs shrink-0">s/d</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-transparent text-xs sm:text-sm border-none focus:ring-0 p-0.5 text-gray-600 cursor-pointer w-26.25 sm:w-auto min-w-0"
            />
          </div>
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
                <th className="px-2.5 sm:px-6 py-2.5 sm:py-4 text-[10px] sm:text-xs font-bold text-white/90 uppercase tracking-wider whitespace-nowrap">
                  Jenis
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
                    <td className="px-2.5 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                      <div className="inline-flex items-center gap-1 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-xs font-medium border bg-slate-50 text-slate-700 border-slate-200 shadow-3xs">
                        {item.jenis_asesmen}
                      </div>
                    </td>
                    <td className="px-2.5 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-center bg-white group-hover/row:bg-[#F9FAFC] border-l border-gray-100 sticky right-0 z-10">
                      <div className="flex justify-center">
                        <button
                          onClick={() => onVerify(item)}
                          className="bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 px-2.5 sm:px-4 py-1 sm:py-2 rounded-lg font-bold text-[10px] sm:text-xs shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <ShieldCheck size={12} /> Verifikasi Berkas
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-16 text-center text-gray-400"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Search
                        className="w-12 h-12 text-gray-300"
                        strokeWidth={1.5}
                      />
                      <span>
                        Tidak ada data asesmen yang sesuai dengan filter.
                      </span>
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

function VerifikasiForm({ onBack }: { onBack: () => void }) {
  const { selectedAsesmen, updateAssessment } = useAppContext();
  const [loading, setLoading] = React.useState(false);
  const [successToast, setSuccessToast] = React.useState(false);

  const [rekomendasi, setRekomendasi] = React.useState<
    "Dapat dilanjutkan" | "Tidak dapat dilanjutkan" | ""
  >("Dapat dilanjutkan");
  const [asesorSignature, setAsesorSignature] =
    React.useState("Dr. Aris Thorne");
  const [answers, setAnswers] = React.useState<Record<string, "K" | "BK">>({
    u0e0: "K",
    u0e1: "K",
    u1e0: "K",
  });

  if (!selectedAsesmen) return null;

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (selectedAsesmen) {
        updateAssessment(selectedAsesmen.id, {
          status: "Terverifikasi (APL 02)",
        });
      }
      setSuccessToast(true);
      setTimeout(() => {
        onBack();
      }, 1200);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] p-4 md:p-8 space-y-6 pb-24 text-sm text-gray-700">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top duration-300">
          <CheckCircle size={20} />
          <div className="min-w-0">
            <p className="font-bold text-sm">Verifikasi Berhasil Disimpan!</p>
            <p className="text-xs text-emerald-100">
              Form FR.APL.02 milik {selectedAsesmen.nama} telah diverifikasi.
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs transition-colors cursor-pointer shrink-0"
            title="Kembali"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="min-w-0">
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              Verifikasi Form FR.APL.02
            </h1>
            <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">
              Asesi:{" "}
              <span className="font-bold text-slate-800">
                {selectedAsesmen.nama}
              </span>{" "}
              • Skema:{" "}
              <span className="font-bold text-slate-800">
                {selectedAsesmen.skema}
              </span>
            </p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className="px-6 py-2.5 bg-[#008BE3] hover:bg-[#0076C2] text-white rounded-xl font-bold text-xs sm:text-sm shadow-2xs flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <CheckCircle size={18} />
              Simpan Verifikasi
            </>
          )}
        </button>
      </div>

      {/* Interactive Form Component */}
      <div className="bg-white shadow-sm border border-slate-200/80 overflow-hidden p-4 sm:p-8 rounded-2xl">
        <FormFRAPL02
          asesmenData={
            {
              nama: selectedAsesmen.nama,
              skema: selectedAsesmen.skema,
              noSkema: selectedAsesmen.noSkema || "006/SKM/LSP-KJN/II/2023",
              tuk: selectedAsesmen.tuk,
              tanggal: selectedAsesmen.tglAsesmen,
              asesor: "Dr. Aris Thorne",
            } as unknown as Assessment
          }
          answers={answers}
          onAnswerChange={(key, val) =>
            setAnswers((prev) => ({ ...prev, [key]: val }))
          }
          rekomendasi={rekomendasi}
          onRekomendasiChange={setRekomendasi}
          asesiName={selectedAsesmen.nama}
          asesiSignature={selectedAsesmen.nama}
          asesiDate={selectedAsesmen.tglAsesmen}
          asesorName="Dr. Aris Thorne"
          asesorReg="MET.000.001234 2021"
          asesorSignature={asesorSignature}
          onAsesorSignatureChange={setAsesorSignature}
        />
      </div>
    </div>
  );
}
