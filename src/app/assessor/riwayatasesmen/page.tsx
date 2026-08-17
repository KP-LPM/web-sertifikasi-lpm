"use client";
import React, { useState } from "react";
import {
  Search,
  History,
  CheckCircle,
  FileText,
  Inbox,
  Calendar,
} from "lucide-react";
import { useAppContext } from "@/context/context";
import { useRouter } from "next/navigation";

export default function RiwayatAsesmen() {
  const router = useRouter();
  const { setSelectedAsesmen, assessments } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [hasilFilter, setHasilFilter] = useState("");

  // Dummy data - we filter only 'Selesai'

  const filteredAssessments = assessments.filter((item) => {
    if (item.status !== "Selesai") return false;
    if (hasilFilter && item.hasil !== hasilFilter) return false;
    if (
      searchTerm &&
      !item.skema?.toLowerCase().includes(searchTerm.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F8F9FC] p-4 md:p-8 space-y-6 pb-24 text-sm text-gray-700">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-[#008BE3]/10 flex items-center justify-center text-[#008BE3] border border-[#008BE3]/20 shadow-xs shrink-0">
            <History size={20} className="stroke-[2.5]" />
          </div>
          <div className="min-w-0">
            <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">
              Riwayat Asesmen
            </h2>
            <p className="text-xs text-gray-400 font-bold tracking-wider uppercase leading-4">
              Daftar histori asesmen yang telah selesai dilakukan
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-xs border border-gray-100 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
            <div className="min-w-0">
              <h3 className="text-base font-black text-slate-900 shrink-0">
                Riwayat Asesmen
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto xl:justify-end">
              {/* Search Input */}
              <div className="flex items-center gap-2 bg-gray-50/80 rounded-lg px-3 h-[42px] w-full sm:w-64 border border-gray-200/50 focus-within:border-[#008BE3]/40 transition-colors">
                <Search className="text-gray-400 shrink-0" size={16} />
                <input
                  type="text"
                  placeholder="Cari Skema Sertifikasi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent border-none focus:ring-0 text-xs md:text-sm w-full outline-none text-gray-700 placeholder-gray-400 font-semibold"
                />
              </div>

              {/* Hasil Select Filter */}
              <select
                value={hasilFilter}
                onChange={(e) => setHasilFilter(e.target.value)}
                className="bg-gray-50 border border-gray-200/50 text-xs md:text-sm rounded-lg px-3 h-10.5 outline-none text-gray-700 cursor-pointer font-bold"
              >
                <option value="">Semua Hasil</option>
                <option value="Kompeten">Kompeten</option>
                <option value="Belum Kompeten">Belum Kompeten</option>
              </select>

              {/* Date Input/Filter */}
              <div className="flex items-center gap-2 bg-gray-50/80 rounded-lg px-3 h-[42px] w-full sm:w-52 border border-gray-200/50 focus-within:border-[#008BE3]/40 transition-colors">
                <Calendar className="text-gray-400 shrink-0" size={16} />
                <input
                  type="text"
                  placeholder="Pilih Tanggal ..."
                  className="bg-transparent border-none focus:ring-0 text-xs md:text-sm w-full outline-none text-gray-700 placeholder-gray-400 font-semibold"
                />
              </div>
            </div>
          </div>
          <div className="overflow-x-auto relative">
            <table className="w-full text-left border-collapse min-w-162.5 sm:min-w-250">
              <thead>
                <tr className="bg-[#0F172A] border-b border-[#0F172A]">
                  <th className="px-2.5 sm:px-6 py-2.5 sm:py-4 text-[10px] sm:text-xs font-bold text-white/90 uppercase tracking-wider whitespace-nowrap">
                    Nama Asesi
                  </th>
                  <th className="px-2.5 sm:px-6 py-2.5 sm:py-4 text-[10px] sm:text-xs font-bold text-white/90 uppercase tracking-wider whitespace-nowrap">
                    TUK
                  </th>
                  <th className="px-2.5 sm:px-6 py-2.5 sm:py-4 text-[10px] sm:text-xs font-bold text-white/90 uppercase tracking-wider whitespace-nowrap">
                    Skema Sertifikasi
                  </th>
                  <th className="px-2.5 sm:px-6 py-2.5 sm:py-4 text-[10px] sm:text-xs font-bold text-white/90 uppercase tracking-wider whitespace-nowrap">
                    Jenis Asesmen
                  </th>
                  <th className="px-2.5 sm:px-6 py-2.5 sm:py-4 text-[10px] sm:text-xs font-bold text-white/90 uppercase tracking-wider whitespace-nowrap">
                    Waktu
                  </th>
                  <th className="px-2.5 sm:px-6 py-2.5 sm:py-4 text-[10px] sm:text-xs font-bold text-white/90 uppercase tracking-wider whitespace-nowrap">
                    Tanggal Asesmen
                  </th>
                  <th className="px-2.5 sm:px-6 py-2.5 sm:py-4 text-[10px] sm:text-xs font-bold text-white/90 uppercase tracking-wider whitespace-nowrap">
                    Hasil
                  </th>
                  <th className="px-2.5 sm:px-6 py-2.5 sm:py-4 text-[10px] sm:text-xs font-bold text-white/90 uppercase tracking-wider whitespace-nowrap">
                    Status Asesmen
                  </th>
                  <th className="px-2.5 sm:px-6 py-2.5 sm:py-4 text-[10px] sm:text-xs font-bold text-white/90 uppercase tracking-wider text-left whitespace-nowrap w-28 sm:w-44 sticky right-0 bg-[#0F172A] z-20 border-l border-white/10 shadow-[-6px_0_15px_-4px_rgba(0,0,0,0.06)]">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="font-medium text-xs sm:text-sm divide-y divide-gray-100">
                {filteredAssessments.length > 0 ? (
                  filteredAssessments.map((item) => (
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
                          {item.tuk}
                        </div>
                      </td>
                      <td className="px-2.5 sm:px-6 py-2 sm:py-4 text-[11px] sm:text-sm font-medium text-gray-500 whitespace-nowrap">
                        {item.waktu}
                      </td>
                      <td className="px-2.5 sm:px-6 py-2 sm:py-4 text-[11px] sm:text-sm font-medium text-gray-500 whitespace-nowrap">
                        {item.tglAsesmen}
                      </td>
                      <td className="px-2.5 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider border ${
                            item.hasil === "Kompeten"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-red-50 text-red-700 border-red-200"
                          }`}
                        >
                          {item.hasil}
                        </span>
                      </td>
                      <td className="px-2.5 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider border bg-emerald-50 text-emerald-700 border-emerald-200">
                          <CheckCircle size={10} /> {item.status}
                        </span>
                      </td>
                      <td className="px-2.5 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-center bg-white group-hover/row:bg-[#F9FAFC] border-l border-gray-100 sticky right-0 z-10">
                        <div className="flex justify-center">
                          <button
                            onClick={() => {
                              setSelectedAsesmen(item);
                              router.push("/assessor/detailriwayatasesmen");
                            }}
                            className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-2 sm:px-4 py-1 sm:py-2 rounded-lg font-bold text-[10px] sm:text-xs shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <FileText size={12} /> Detail
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="px-6 py-24 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <Inbox
                          size={48}
                          strokeWidth={1}
                          className="mb-4 text-gray-300"
                        />
                        <span className="text-sm font-medium">
                          Tidak ada data
                        </span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
