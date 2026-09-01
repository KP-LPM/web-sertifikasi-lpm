"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Plus,
  FileEdit,
  Archive,
  Edit,
  Eye,
  Trash2,
  Calendar,
} from "lucide-react";
import { useAppContext } from "@/context/context";
import { motion, AnimatePresence } from "framer-motion";

export default function KonfigurasiPertanyaan() {
  const router = useRouter();
  const {
    konfigurasiPertanyaan,
    deleteKonfigurasiPertanyaan,
    setSelectedKonfigurasiId,
  } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const konfigurasiData = konfigurasiPertanyaan;

  return (
    <div className="space-y-6 pb-24 text-sm text-gray-700">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-[#008BE3]/10 flex items-center justify-center text-[#008BE3] border border-[#008BE3]/20 shadow-xs shrink-0">
            <FileEdit size={20} className="stroke-[2.5]" />
          </div>
          <div className="min-w-0">
            <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">
              Konfigurasi Pertanyaan
            </h2>
            <p className="text-xs text-gray-400 font-bold tracking-wider uppercase leading-4">
              Kelola daftar pertanyaan asesmen
            </p>
          </div>
        </div>
        <button
          onClick={() => router.push("/assessor/tambahkonfigurasipertanyaan")}
          className="bg-[#008BE3] hover:bg-[#0076C2] text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm flex items-center gap-2 transition-colors shrink-0"
        >
          <Plus size={16} strokeWidth={2} /> Tambah Data
        </button>
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-lg shadow-xs border border-gray-100 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
            <div className="min-w-0">
              <h3 className="text-base font-black text-slate-900 shrink-0">
                Daftar Konfigurasi
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto xl:justify-end">
              {/* Search Input */}
              <div className="flex items-center gap-2 bg-gray-50/80 rounded-lg px-3 h-10.5 w-full sm:w-64 border border-gray-200/50 focus-within:border-[#008BE3]/40 transition-colors">
                <Search className="text-gray-400 shrink-0" size={16} />
                <input
                  type="text"
                  placeholder="Cari Konfigurasi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent border-none focus:ring-0 text-xs md:text-sm w-full outline-none text-gray-700 placeholder-gray-400 font-semibold"
                />
              </div>

              {/* Status Select Filter */}
              <select className="bg-gray-50 border border-gray-200/50 text-xs md:text-sm rounded-lg px-3 h-10.5 outline-none text-gray-700 cursor-pointer font-bold">
                <option value="">Semua Status</option>
                <option value="Terbit">Terbit</option>
                <option value="Draft">Draft</option>
              </select>

              {/* Date Input/Filter */}
              <div className="flex items-center gap-2 bg-gray-50/80 rounded-lg px-3 h-10.5 w-full sm:w-52 border border-gray-200/50 focus-within:border-[#008BE3]/40 transition-colors">
                <Calendar className="text-gray-400 shrink-0" size={16} />
                <input
                  type="text"
                  placeholder="Pilih Tanggal Dibuat..."
                  className="bg-transparent border-none focus:ring-0 text-xs md:text-sm w-full outline-none text-gray-700 placeholder-gray-400 font-semibold"
                />
              </div>
            </div>
          </div>
          <div className="overflow-x-auto relative">
            <table className="w-full text-left border-collapse min-w-162.5 sm:min-w-250">
              <thead>
                <tr className="bg-[#0F172A] border-b border-[#0F172A]">
                  <th className="px-2.5 sm:px-6 py-2.5 sm:py-4 text-[10px] sm:text-xs font-bold text-white/90 uppercase tracking-wider text-center w-16 whitespace-nowrap">
                    No
                  </th>
                  <th className="px-2.5 sm:px-6 py-2.5 sm:py-4 text-[10px] sm:text-xs font-bold text-white/90 uppercase tracking-wider whitespace-nowrap">
                    Nama Konfigurasi
                  </th>
                  <th className="px-2.5 sm:px-6 py-2.5 sm:py-4 text-[10px] sm:text-xs font-bold text-white/90 uppercase tracking-wider whitespace-nowrap">
                    Skema Sertifikasi
                  </th>
                  <th className="px-2.5 sm:px-6 py-2.5 sm:py-4 text-[10px] sm:text-xs font-bold text-white/90 uppercase tracking-wider whitespace-nowrap">
                    Status
                  </th>
                  <th className="px-2.5 sm:px-6 py-2.5 sm:py-4 text-[10px] sm:text-xs font-bold text-white/90 uppercase tracking-wider whitespace-nowrap">
                    Penyusun
                  </th>
                  <th className="px-2.5 sm:px-6 py-2.5 sm:py-4 text-[10px] sm:text-xs font-bold text-white/90 uppercase tracking-wider whitespace-nowrap">
                    Validator
                  </th>
                  <th className="px-2.5 sm:px-6 py-2.5 sm:py-4 text-[10px] sm:text-xs font-bold text-white/90 uppercase tracking-wider text-center whitespace-nowrap sticky right-0 bg-[#0F172A] z-10 border-l border-white/10 shadow-[-6px_0_15px_-4px_rgba(0,0,0,0.06)] backdrop-blur-xs">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="font-medium text-xs sm:text-sm divide-y divide-gray-100">
                {konfigurasiData.length > 0 ? (
                  konfigurasiData.map((item, idx) => (
                    <tr
                      key={item.id}
                      className="group/row hover:bg-[#F9FAFC] transition-colors"
                    >
                      <td className="px-2.5 sm:px-6 py-2 sm:py-4 text-[11px] sm:text-sm font-medium text-slate-700 whitespace-nowrap">
                        <div
                          className={`mx-auto w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-xs font-bold text-xs ${
                            idx % 3 === 0
                              ? "bg-[#008BE3]/10 text-[#008BE3]"
                              : idx % 3 === 1
                                ? "bg-[#84CC16]/10 text-[#73B412]"
                                : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {idx + 1}
                        </div>
                      </td>
                      <td className="px-2.5 sm:px-6 py-2 sm:py-4 text-[11px] sm:text-sm text-slate-700 font-semibold whitespace-nowrap">
                        {item.nama}
                      </td>
                      <td className="px-2.5 sm:px-6 py-2 sm:py-4 text-[11px] sm:text-sm text-[#008BE3] font-bold whitespace-nowrap">
                        {item.skema}
                      </td>
                      <td className="px-2.5 sm:px-6 py-2 sm:py-4 text-[11px] sm:text-sm whitespace-nowrap">
                        {item.status === "draft" ? (
                          <span className="bg-amber-100 text-amber-800 border border-amber-300/60 font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                            Draft
                          </span>
                        ) : (
                          <span className="bg-emerald-100 text-emerald-800 border border-emerald-300/60 font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                            Terbit
                          </span>
                        )}
                      </td>

                      <td className="px-2.5 sm:px-6 py-2 sm:py-4 text-[11px] sm:text-sm text-slate-700 whitespace-nowrap">
                        {item.penyusun
                          ?.map((p) =>
                            typeof p === "string" ? p : p.value || "",
                          )
                          .filter(Boolean)
                          .join(", ") || "-"}
                      </td>
                      <td className="px-2.5 sm:px-6 py-2 sm:py-4 text-[11px] sm:text-sm text-slate-700 whitespace-nowrap">
                        {item.validator
                          ?.map((v) =>
                            typeof v === "string" ? v : v.value || "",
                          )
                          .filter(Boolean)
                          .join(", ") || "-"}
                      </td>
                      <td className="px-2.5 sm:px-6 py-2 sm:py-4 text-xs md:text-sm text-center sticky right-0 bg-white group-hover/row:bg-[#F9FAFC] z-10 border-l border-gray-100 shadow-[-6px_0_15px_-4px_rgba(0,0,0,0.06)] transition-colors">
                        <div className="flex items-center justify-center gap-1 sm:gap-2">
                          <button
                            onClick={() => {
                              setSelectedKonfigurasiId(item.id);
                              router.push(
                                `/assessor/tambahkonfigurasipertanyaan?id=${item.id}&mode=edit`,
                              );
                            }}
                            className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-medium transition-colors inline-flex items-center gap-1 whitespace-nowrap shadow-xs cursor-pointer"
                          >
                            <Edit size={12} /> Ubah
                          </button>
                          <button
                            onClick={() => {
                              setSelectedKonfigurasiId(item.id);
                              router.push(
                                `/assessor/tambahkonfigurasipertanyaan?id=${item.id}&mode=view`,
                              );
                            }}
                            className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-medium transition-colors inline-flex items-center gap-1 whitespace-nowrap shadow-xs cursor-pointer"
                          >
                            <Eye size={12} /> Detail
                          </button>
                          <button
                            onClick={() => {
                              setItemToDelete(item.id);
                              setIsDeleteModalOpen(true);
                            }}
                            className="bg-white border border-gray-200 hover:bg-red-50 text-red-600 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-medium transition-colors inline-flex items-center gap-1 whitespace-nowrap shadow-xs cursor-pointer"
                          >
                            <Trash2 size={12} /> Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-20 text-center text-gray-500"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <Archive
                          size={48}
                          className="text-gray-200 mb-4"
                          strokeWidth={1}
                        />
                        <p>Tidak ada data</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Delete Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-sm relative z-10 overflow-hidden"
            >
              <div className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
                  <Trash2 size={24} />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">
                  Hapus Konfigurasi
                </h3>
                <p className="text-sm text-gray-500">
                  Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak
                  dapat dibatalkan.
                </p>
              </div>
              <div className="p-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    if (itemToDelete) {
                      deleteKonfigurasiPertanyaan(itemToDelete);
                    }
                    setIsDeleteModalOpen(false);
                  }}
                  className="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                  Hapus
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
