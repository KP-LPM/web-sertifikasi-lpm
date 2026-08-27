"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  FileDown,
  Clock,
  Calendar,
  Building,
  MapPin,
  FileText,
  Eye,
  X,
  Video,
  Building2,
} from "lucide-react";
import { useAppContext } from "@/context/context";
import {
  FormFRAK07,
  FormFRIA04A,
  FormFRIA04B,
  FormFRIA07,
  FormFRAPL02,
} from "@/components/forms";
import { AssessmentItem } from "@/types/types";

export default function DetailRiwayatAsesmen() {
  const router = useRouter();
  const { selectedAsesmen } = useAppContext();
  const [previewForm, setPreviewForm] = useState<
    "FR.APL.02" | "FR.AK.07" | "FR.IA.04A" | "FR.IA.04B" | "FR.IA.07" | null
  >(null);

  if (!selectedAsesmen) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] flex flex-col items-center justify-center">
        <p className="text-gray-500 mb-4">
          Tidak ada data asesmen yang dipilih.
        </p>
        <button
          onClick={() => router.push("/assessor/riwayatasesmen")}
          className="text-blue-500 font-bold hover:underline"
        >
          Kembali ke Riwayat Asesmen
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC] p-4 md:p-8 space-y-6 pb-24 text-sm text-gray-700">
      <div className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden">
        {/* Banner/Header Info */}
        <div className="p-4 sm:p-6 border-b border-gray-100 space-y-5">
          {/* Top Title & Badge Row */}
          <div className="flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => router.push("/assessor/riwayatasesmen")}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-[#008BE3] bg-[#008BE3]/10 hover:bg-[#008BE3]/20 transition-colors cursor-pointer shrink-0"
                title="Kembali"
              >
                <ArrowLeft size={18} />
              </button>
              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="text-lg md:text-xl font-black text-slate-900">
                    {selectedAsesmen.nama}
                  </h3>
                  {selectedAsesmen.metode?.toLowerCase() === "online" ? (
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
                Alamat
              </p>
              <div className="flex items-center gap-1.5 text-slate-700 font-semibold text-xs sm:text-sm">
                <MapPin size={14} className="text-[#008BE3] shrink-0" />
                {selectedAsesmen.alamat}
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">
                TUK
              </p>
              <div className="flex items-center gap-1.5 text-slate-700 font-semibold text-xs sm:text-sm">
                <Building size={14} className="text-[#008BE3] shrink-0" />
                {selectedAsesmen.tipeTuk}
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">
                Tanggal
              </p>
              <div className="flex items-center gap-1.5 text-slate-700 font-semibold text-xs sm:text-sm">
                <Calendar size={14} className="text-[#008BE3] shrink-0" />
                {selectedAsesmen.tglAsesmen}
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">
                Waktu
              </p>
              <div className="flex items-center gap-1.5 text-slate-700 font-semibold text-xs sm:text-sm">
                <Clock size={14} className="text-[#008BE3] shrink-0" />
                {selectedAsesmen.waktu}
              </div>
            </div>
          </div>
        </div>

        {/* Info Banding */}
        {selectedAsesmen.hasil === "Belum Kompeten" && (
          <div className="bg-orange-50 border-b border-orange-100 p-4 px-8 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                <Clock size={16} />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-orange-900 text-sm">
                  Status Banding
                </p>
                <p className="text-orange-700 text-xs">
                  Belum ada pengajuan banding untuk asesmen ini.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Detail Penilaian (Read-only) */}
        <div className="p-8">
          <h2 className="text-lg font-black text-slate-900 tracking-tight mb-6 flex items-center gap-2">
            Rekapitulasi Penilaian Asesmen
          </h2>

          <div className="space-y-8">
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-slate-50 p-4 border-b border-slate-200 font-bold text-slate-800">
                FR.APL.02 - Asesmen Mandiri
              </div>
              <div className="p-4 bg-white flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                    <FileText size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-800 text-sm">
                      FR_APL_02_Signed.pdf
                    </p>
                    <p className="text-xs text-slate-500">
                      Telah diisi oleh Asesi dan Diverifikasi Asesor
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreviewForm("FR.APL.02")}
                    className="flex items-center gap-2 px-4 py-2 bg-[#008BE3] hover:bg-[#0076C2] text-white rounded-lg text-sm font-bold transition-colors cursor-pointer"
                  >
                    <Eye size={16} /> Pratinjau
                  </button>
                </div>
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-slate-50 p-4 border-b border-slate-200 font-bold text-slate-800">
                FR.AK.07 - Ceklis Penyesuaian yang Wajar dan Beralasan
              </div>
              <div className="p-4 bg-white flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                    <FileText size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-800 text-sm">
                      FR_AK_07_Signed.pdf
                    </p>
                    <p className="text-xs text-slate-500">
                      Telah diisi oleh Asesi dan Asesor
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreviewForm("FR.AK.07")}
                    className="flex items-center gap-2 px-4 py-2 bg-[#008BE3] hover:bg-[#0076C2] text-white rounded-lg text-sm font-bold transition-colors cursor-pointer"
                  >
                    <Eye size={16} /> Pratinjau
                  </button>
                  <button
                    onClick={() =>
                      alert("Mengunduh dokumen: FR_AK_07_Signed.pdf")
                    }
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-bold transition-colors cursor-pointer"
                  >
                    <FileDown size={16} /> Unduh
                  </button>
                </div>
              </div>
            </div>
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-slate-50 p-4 border-b border-slate-200 font-bold text-slate-800">
                FR.IA.04A - Penjelasan Proyek Singkat / Kegiatan Terstruktur
              </div>
              <div className="p-4 bg-white flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                    <FileText size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-800 text-sm">
                      FR_IA_04A_Signed.pdf
                    </p>
                    <p className="text-xs text-slate-500">
                      Telah diisi oleh Asesi dan Asesor
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreviewForm("FR.IA.04A")}
                    className="flex items-center gap-2 px-4 py-2 bg-[#008BE3] hover:bg-[#0076C2] text-white rounded-lg text-sm font-bold transition-colors cursor-pointer"
                  >
                    <Eye size={16} /> Pratinjau
                  </button>
                  <button
                    onClick={() =>
                      alert("Mengunduh dokumen: FR_IA_04A_Signed.pdf")
                    }
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-bold transition-colors cursor-pointer"
                  >
                    <FileDown size={16} /> Unduh
                  </button>
                </div>
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-slate-50 p-4 border-b border-slate-200 font-bold text-slate-800">
                FR.IA.04B - Penilaian Proyek Singkat / Kegiatan Terstruktur
              </div>
              <div className="p-4 bg-white flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                    <FileText size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-800 text-sm">
                      FR_IA_04B_Signed.pdf
                    </p>
                    <p className="text-xs text-slate-500">
                      Telah diisi oleh Asesi dan Asesor
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreviewForm("FR.IA.04B")}
                    className="flex items-center gap-2 px-4 py-2 bg-[#008BE3] hover:bg-[#0076C2] text-white rounded-lg text-sm font-bold transition-colors cursor-pointer"
                  >
                    <Eye size={16} /> Pratinjau
                  </button>
                  <button
                    onClick={() =>
                      alert("Mengunduh dokumen: FR_IA_04B_Signed.pdf")
                    }
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-bold transition-colors cursor-pointer"
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
                    onClick={() => setPreviewForm("FR.IA.07")}
                    className="flex items-center gap-2 px-4 py-2 bg-[#008BE3] hover:bg-[#0076C2] text-white rounded-lg text-sm font-bold transition-colors cursor-pointer"
                  >
                    <Eye size={16} /> Pratinjau
                  </button>
                  <button
                    onClick={() =>
                      alert("Mengunduh dokumen: FR_IA_07_Signed.pdf")
                    }
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-bold transition-colors cursor-pointer"
                  >
                    <FileDown size={16} /> Unduh
                  </button>
                </div>
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-slate-50 p-4 border-b border-slate-200 font-bold text-slate-800">
                Rekomendasi / Catatan Asesor
              </div>
              <div className="p-6 bg-white space-y-4 pointer-events-none">
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">
                    Catatan Observasi
                  </p>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-slate-700 min-h-15">
                    Kandidat mampu menyelesaikan tugas praktik dengan baik,
                    meskipun ada sedikit kendala di bagian awal. Keseluruhan
                    proses berjalan lancar.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal Overlay */}
      {previewForm && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex flex-col items-center justify-start p-2 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl my-auto overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0 border-b border-slate-800">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-[#008BE3] flex items-center justify-center text-white font-black text-sm">
                  <FileText size={18} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-extrabold text-base leading-tight text-white flex items-center gap-2">
                    Pratinjau Form:{" "}
                    <span className="text-[#008BE3]">{previewForm}</span>
                  </h3>
                  <p className="text-xs text-slate-300 font-medium">
                    Asesi: {selectedAsesmen.nama} • Skema:{" "}
                    {selectedAsesmen.skema}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={() => setPreviewForm(null)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600/90 hover:bg-red-600 text-white rounded-lg text-xs font-bold transition-colors shadow-sm cursor-pointer"
                >
                  <X size={16} />{" "}
                  <span className="hidden sm:inline">Tutup</span>
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-8 overflow-y-auto bg-slate-50/50 flex-1">
              <div className="bg-white p-4 sm:p-8 rounded-xl border border-slate-200 shadow-xs">
                {previewForm === "FR.APL.02" && (
                  <FormFRAPL02
                    readOnly={true}
                    asesmenData={
                      {
                        nama: selectedAsesmen.nama,
                        skema: selectedAsesmen.skema,
                        noSkema: "006/SKM/LSP-KJN/II/2023",
                        tuk: selectedAsesmen.tipeTuk,
                        tanggal: selectedAsesmen.tglAsesmen,
                        asesor: "Dr. Aris Thorne",
                      } as unknown as AssessmentItem
                    }
                  />
                )}
                {previewForm === "FR.AK.07" && (
                  <FormFRAK07
                    readOnly={true}
                    asesmenData={
                      {
                        nama: selectedAsesmen.nama,
                        skema: selectedAsesmen.skema,
                        noSkema: "SKM-2024-001",
                        tuk: selectedAsesmen.tipeTuk,
                        tanggal: selectedAsesmen.tglAsesmen,
                        asesor: "Dr. Aris Thorne",
                      } as unknown as AssessmentItem
                    }
                  />
                )}
                {previewForm === "FR.IA.04A" && (
                  <FormFRIA04A
                    readOnly={true}
                    asesmenData={
                      {
                        nama: selectedAsesmen.nama,
                        skema: selectedAsesmen.skema,
                        noSkema: "SKM-2024-001",
                        tuk: selectedAsesmen.tipeTuk,
                        tanggal: selectedAsesmen.tglAsesmen,
                        asesor: "Dr. Aris Thorne",
                      } as unknown as AssessmentItem
                    }
                  />
                )}
                {previewForm === "FR.IA.04B" && (
                  <FormFRIA04B
                    readOnly={true}
                    asesmenData={
                      {
                        nama: selectedAsesmen.nama,
                        skema: selectedAsesmen.skema,
                        noSkema: "SKM-2024-001",
                        tuk: selectedAsesmen.tipeTuk,
                        tanggal: selectedAsesmen.tglAsesmen,
                        asesor: "Dr. Aris Thorne",
                      } as unknown as AssessmentItem
                    }
                    rekomendasi={selectedAsesmen.hasil}
                  />
                )}
                {previewForm === "FR.IA.07" && (
                  <FormFRIA07
                    readOnly={true}
                    asesmenData={
                      {
                        nama: selectedAsesmen.nama,
                        skema: selectedAsesmen.skema,
                        noSkema: "SKM-2024-001",
                        tuk: selectedAsesmen.tipeTuk,
                        tanggal: selectedAsesmen.tglAsesmen,
                        asesor: "Dr. Aris Thorne",
                      } as unknown as AssessmentItem
                    }
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
