"use client";
import React, { useState } from "react";
import {
  Video,
  FileText,
  CheckCircle,
  ArrowLeft,
  ExternalLink,
  Calendar,
} from "lucide-react";
import { useAppContext } from "@/context/context";

export default function PenilaianOnline() {
  const { setCurrentView, selectedAsesmen } = useAppContext();
  const [keputusan, setKeputusan] = useState("");

  const [pencapaian, setPencapaian] = useState<Record<string, string>>({});

  const handleSimpan = () => {
    alert(`Penilaian akhir berhasil disimpan.\nKeputusan: ${keputusan}`);
    setCurrentView("candidates");
  };

  const handlePencapaian = (code: string, value: string) => {
    setPencapaian((prev) => ({ ...prev, [code]: value }));
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] p-4 md:p-8 space-y-6 pb-24 text-sm text-gray-700">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setCurrentView("candidates")}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-[#008BE3] bg-[#008BE3]/10 hover:bg-[#008BE3]/20 transition-colors cursor-pointer shrink-0"
            title="Kembali"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="min-w-0">
            <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">
              Penilaian Asesmen Online
            </h2>
            <p className="text-xs text-gray-400 font-bold tracking-wider uppercase leading-4">
              Asesi: {selectedAsesmen?.nama} | {selectedAsesmen?.skema}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Meeting & Presentation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-[#E6F4FF] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-sky-800">
              <Video size={18} />
              <h3 className="font-bold text-base">Live Presentation</h3>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => setCurrentView("jadwalkan-online")}
                className="flex-1 sm:flex-none px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-md text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <Calendar size={14} /> Reschedule
              </button>
              <a
                href={
                  selectedAsesmen?.linkVideo || "https://meet.google.com/test"
                }
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none px-4 py-2 bg-[#008BE3] hover:bg-[#0076C2] text-white rounded-md text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                Join Meeting <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>

        {/* Form Penilaian Asesor */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-[#F9FAFC] flex items-center gap-3">
            <CheckCircle className="text-emerald-500" size={18} />
            <h3 className="font-bold text-slate-900">Keputusan Penilaian</h3>
          </div>

          <div className="p-5 flex flex-col items-center justify-center text-center space-y-4">
            <p className="text-sm text-slate-500 mb-2">
              Beralih ke form penilaian lengkap untuk mengisi pencapaian unit
              kompetensi asesi.
            </p>
            <button
              onClick={() => setCurrentView("assessment-form")}
              className="w-full sm:w-auto px-8 bg-[#008BE3] hover:bg-[#0076C2] text-white py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <FileText size={18} /> Beri Penilaian
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
