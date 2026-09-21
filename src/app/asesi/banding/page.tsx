'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, Scale, AlertTriangle, Eye, ArrowLeft, CheckCircle, XCircle, Clock
} from 'lucide-react';

// IMPORT DARI types.ts
import type { AppealRecord } from '@/types/types';
import { getAsesiBandingList } from '@/lib/api';

export default function AsesiAppeals() {
  const [appeals, setAppeals] = useState<AppealRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [dateFilter, setDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [selectedAppeal, setSelectedAppeal] = useState<AppealRecord | null>(null);
  
  useEffect(() => {
    async function loadBanding() {
      setIsLoading(true);
      try {
        const data = await getAsesiBandingList();
        if (Array.isArray(data)) {
          interface BandingApiResponse {
            id: number;
            tanggal_pengajuan?: string;
            status_banding?: "Menunggu Verifikasi" | "Disetujui" | "Ditolak" | "Dalam Penyelidikan";
            status?: "Menunggu Verifikasi" | "Disetujui" | "Ditolak" | "Dalam Penyelidikan";
            alasan?: string;
            penjelasan?: string;
            keputusan_admin?: string;
            keputusanAdmin?: string;
            dijelaskan?: boolean;
            didiskusikan?: boolean;
            melibatkanOrangLain?: boolean;
            hasil_asesmen?: {
              jadwal_asesmen?: {
                metode?: string;
                users?: {
                  username?: string;
                  profil?: { namaLengkap?: string };
                };
              };
              pengajuan_skema?: {
                dataPribadi?: {
                  namaLengkap?: string;
                };
                skema?: {
                  namaSkema?: string;
                  kodeSkema?: string;
                };
                user?: {
                  username?: string;
                };
                apl02_penilaian?: {
                  nama_asesor?: string;
                };
              };
            };
          }

          // Map backend data to AppealRecord shape
          const mapped: AppealRecord[] = data.map((item: BandingApiResponse) => ({
            id: item.id,
            tanggalPengajuan: item.tanggal_pengajuan
              ? new Date(item.tanggal_pengajuan).toLocaleDateString('en-GB')
              : '-',
            namaAsesi: item.hasil_asesmen?.pengajuan_skema?.dataPribadi?.namaLengkap || '-',
            asesmen: item.hasil_asesmen?.jadwal_asesmen?.metode || 'Uji Kompetensi',
            skemaSertifikasi: item.hasil_asesmen?.pengajuan_skema?.skema?.namaSkema || '-',
            kodeSkema: item.hasil_asesmen?.pengajuan_skema?.skema?.kodeSkema || '-',
            status: item.status_banding || item.status || 'Dalam Penyelidikan',
            alasan: item.alasan || item.penjelasan || '-',
            penjelasan: item.penjelasan || '-',
            keputusanAdmin: item.keputusan_admin || item.keputusanAdmin || undefined,
            dijelaskan: item.dijelaskan ?? true,
            didiskusikan: item.didiskusikan ?? true,
            melibatkanOrangLain: item.melibatkanOrangLain ?? false,
            ttdAsesi: true,
            namaAsesor:
              item.hasil_asesmen?.jadwal_asesmen?.users?.profil?.namaLengkap ||
              item.hasil_asesmen?.jadwal_asesmen?.users?.username ||
              item.hasil_asesmen?.pengajuan_skema?.apl02_penilaian?.nama_asesor ||
              '-',
          }));
          setAppeals(mapped);
        } else {
          setAppeals([]);
        }
      } catch (error) {
        console.error("Gagal memuat banding dari API:", error);
        setAppeals([]);
      } finally {
        setIsLoading(false);
      }
    }
    loadBanding();
  }, []);



  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Disetujui':
        return <span className="bg-green-50 text-green-700 border border-green-200 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider whitespace-nowrap">Disetujui</span>;
      case 'Ditolak':
        return <span className="bg-red-50 text-red-700 border border-red-200 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider whitespace-nowrap">Ditolak</span>;
      case 'Dalam Penyelidikan':
        return <span className="bg-purple-50 text-purple-700 border border-purple-200 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider whitespace-nowrap">Dalam Penyelidikan</span>;
      default:
        return <span className="bg-gray-50 text-gray-700 border border-gray-200 text-xs px-2.5 py-1 rounded-full font-semibold whitespace-nowrap">{status}</span>;
    }
  };

  // Filter
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, dateFilter]);

  const filteredRecords = appeals.filter((rec) => {
    const matchesSearch = 
      rec.asesmen.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.skemaSertifikasi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.alasan.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'Semua' || rec.status === statusFilter;
    const matchesDate = !dateFilter || rec.tanggalPengajuan === dateFilter.split('-').reverse().join('/');
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const formatTanggal = (tanggal: string): string => {
    if (!tanggal) return '-';
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(tanggal)) return tanggal;
    const parts = tanggal.split(' ');
    if (parts.length === 3) {
      const months: Record<string, string> = {
        'jan': '01', 'feb': '02', 'mar': '03', 'apr': '04', 'mei': '05', 'may': '05', 'jun': '06', 
        'jul': '07', 'agt': '08', 'aug': '08', 'sep': '09', 'okt': '10', 'oct': '10', 'nov': '11', 'des': '12', 'dec': '12'
      };
      const d = parts[0].padStart(2, '0');
      const m = months[parts[1].toLowerCase()] || '01';
      const y = parts[2];
      return `${d}/${m}/${y}`;
    }
    const dateObj = new Date(tanggal);
    if (!isNaN(dateObj.getTime())) return dateObj.toLocaleDateString('en-GB');
    return tanggal;
  };

  const totalPages = Math.ceil((filteredRecords?.length || 0) / itemsPerPage);
  const currentRecords = filteredRecords.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (selectedAppeal) {
    return (
      <div className="space-y-6 pb-24 w-full">
        <div className="w-full animate-in fade-in zoom-in-95 duration-200">
            <div className="mb-4">
              <button 
                onClick={() => setSelectedAppeal(null)}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-[#008BE3] bg-[#008BE3]/10 hover:bg-[#008BE3]/20 transition-colors cursor-pointer shrink-0"
                title="Kembali"
              >
                <ArrowLeft size={18} />
              </button>
            </div>
            
            <div className="w-full bg-white rounded-lg border border-gray-100 shadow-xs p-6 md:p-8 space-y-6 text-slate-800 text-sm">
              <div className="flex items-center justify-between p-3.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-xs font-bold text-slate-500">Status Tindak Lanjut</span>
                {getStatusBadge(selectedAppeal.status)}
              </div>

              <table className="w-full border-collapse border border-slate-300">
                <tbody>
                  <tr>
                    <td className="border border-slate-300 p-2 font-semibold bg-white w-48">Nama Asesi:</td>
                    <td className="border border-slate-300 p-2" colSpan={2}>{selectedAppeal.namaAsesi}</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 p-2 font-semibold bg-white">Nama Asesor:</td>
                    <td className="border border-slate-300 p-2" colSpan={2}>{selectedAppeal.namaAsesor || '-'}</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 p-2 font-semibold bg-white">Tanggal Asesmen:</td>
                    <td className="border border-slate-300 p-2" colSpan={2}>{formatTanggal(selectedAppeal.tanggalPengajuan)}</td>
                  </tr>
                  <tr className="bg-slate-50 font-bold">
                    <td className="border border-slate-300 p-2">Jawablah dengan Ya atau Tidak pertanyaan-pertanyaan berikut ini :</td>
                    <td className="border border-slate-300 p-2 text-center w-16">YA</td>
                    <td className="border border-slate-300 p-2 text-center w-16">TIDAK</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 p-2">Apakah Proses Banding telah dijelaskan kepada Anda?</td>
                    <td className="border border-slate-300 p-2 text-center align-middle">
                      <input type="checkbox" checked={selectedAppeal.dijelaskan === true} readOnly className="w-4 h-4 cursor-default" />
                    </td>
                    <td className="border border-slate-300 p-2 text-center align-middle">
                      <input type="checkbox" checked={selectedAppeal.dijelaskan === false} readOnly className="w-4 h-4 cursor-default" />
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 p-2">Apakah Anda telah mendiskusikan Banding dengan Asesor?</td>
                    <td className="border border-slate-300 p-2 text-center align-middle">
                      <input type="checkbox" checked={selectedAppeal.didiskusikan === true} readOnly className="w-4 h-4 cursor-default" />
                    </td>
                    <td className="border border-slate-300 p-2 text-center align-middle">
                      <input type="checkbox" checked={selectedAppeal.didiskusikan === false} readOnly className="w-4 h-4 cursor-default" />
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 p-2">Apakah Anda mau melibatkan &quot;orang lain&quot; membantu Anda dalam Proses Banding?</td>
                    <td className="border border-slate-300 p-2 text-center align-middle">
                      <input type="checkbox" checked={selectedAppeal.melibatkanOrangLain === true} readOnly className="w-4 h-4 cursor-default" />
                    </td>
                    <td className="border border-slate-300 p-2 text-center align-middle">
                      <input type="checkbox" checked={selectedAppeal.melibatkanOrangLain === false} readOnly className="w-4 h-4 cursor-default" />
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 p-4" colSpan={3}>
                      <div className="mb-2">Banding ini diajukan atas Keputusan Asesmen yang dibuat terhadap Skema Sertifikasi (Kualifikasi/Klaster/Okupasi) berikut :</div>
                      <div className="flex mb-1">
                        <div className="w-40 font-semibold">Skema Sertifikasi</div>
                        <div className="min-w-0">: {selectedAppeal.skemaSertifikasi}</div>
                      </div>
                      <div className="flex">
                        <div className="w-40 font-semibold">No. Skema Sertifikasi</div>
                        <div className="min-w-0">: {selectedAppeal.kodeSkema && selectedAppeal.kodeSkema !== '-' ? selectedAppeal.kodeSkema : '-'}</div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 p-4" colSpan={3}>
                      <div className="font-semibold mb-2">Banding ini diajukan atas alasan sebagai berikut :</div>
                      <div className="w-full min-h-32 p-3 border border-slate-300 rounded-lg bg-white text-slate-700 whitespace-pre-wrap">
                        {selectedAppeal.alasan}
                      </div>
                      <div className="text-xs text-slate-500 mt-2 italic">
                        Anda mempunyai hak mengajukan banding jika Anda menilai Proses Asesmen tidak sesuai SOP dan tidak memenuhi Prinsip Asesmen.
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 p-4" colSpan={3}>
                      <div className="flex flex-col sm:flex-row gap-8 mt-2">
                        <div className="min-w-0">
                          <span className="font-semibold mb-2 block">Tanda tangan Asesi :</span>
                          <div className="p-3 border border-slate-200 rounded-lg bg-white text-slate-700 font-medium italic">
                            {selectedAppeal.ttdAsesi !== false ? 'Ditandatangani secara elektronik' : 'Belum ditandatangani'}
                          </div>
                        </div>
                        <div className="min-w-0">
                          <span className="font-semibold mb-2 block">Tanggal :</span>
                          <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium">
                            {formatTanggal(selectedAppeal.tanggalPengajuan)}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>

              {selectedAppeal.keputusanAdmin ? (
                <div className={`p-4 rounded-lg space-y-2 mt-4 border ${
                  selectedAppeal.status === 'Disetujui'
                    ? 'bg-green-50 border-green-200'
                    : selectedAppeal.status === 'Ditolak'
                    ? 'bg-red-50 border-red-200'
                    : 'bg-blue-50 border-blue-200'
                }`}>
                  <div className="flex items-center gap-2">
                    {selectedAppeal.status === 'Disetujui' ? (
                      <CheckCircle size={18} className="text-green-600 shrink-0" />
                    ) : selectedAppeal.status === 'Ditolak' ? (
                      <XCircle size={18} className="text-red-600 shrink-0" />
                    ) : (
                      <Clock size={18} className="text-blue-600 shrink-0" />
                    )}
                    <span className={`font-bold uppercase tracking-wider text-sm ${
                      selectedAppeal.status === 'Disetujui' ? 'text-green-800'
                      : selectedAppeal.status === 'Ditolak' ? 'text-red-800'
                      : 'text-blue-800'
                    }`}>
                      Keputusan Asesor / LSP — {selectedAppeal.status}
                    </span>
                  </div>
                  <p className="font-semibold text-slate-800 leading-relaxed">
                    {selectedAppeal.keputusanAdmin}
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg mt-4 flex items-center gap-3">
                  <Clock size={18} className="text-amber-600 shrink-0" />
                  <p className="text-amber-800 font-semibold text-sm">Banding Anda sedang dalam proses penyelidikan. Keputusan akan muncul di sini setelah asesor memberikan penilaian.</p>
                </div>
              )}
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24 text-sm text-gray-700">
      
      {/* Top Title Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
         <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-[#008BE3]/10 flex items-center justify-center text-[#008BE3] border border-[#008BE3]/20 shadow-xs shrink-0">
            <Scale size={20} className="stroke-[2.5]" />
          </div>
          <div className="min-w-0">
            <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none mb-1 md:whitespace-nowrap">
              Banding Asesmen
            </h2>
            <p className="text-xs text-gray-400 font-bold tracking-wider uppercase leading-4 md:whitespace-nowrap">
              Daftar pengajuan banding hasil asesmen Anda
            </p>
            
          </div>
        </div>
      </div>

      {/* Info Warning banner */}
      <div className="bg-[#FFFBE6] border border-[#FFE58F] rounded-lg p-4 flex gap-3 text-amber-900 shadow-3xs">
        <AlertTriangle size={20} className="text-amber-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-extrabold text-xs uppercase tracking-wider text-amber-800">Kebijakan Banding Asesmen</h4>
          <p className="text-xs leading-relaxed font-semibold">
            Asesi memiliki hak untuk mengajukan banding jika merasa hasil penilaian dari asesor tidak objektif atau terdapat kekeliruan sistematis. Pengajuan banding harus disertai alasan kuat dan penjelasan kronologis yang detail. Banding akan diproses oleh Komite Teknis LSP dalam waktu maksimal 7 hari kerja.
          </p>
        </div>
      </div>

      {/* Main Panel Content with Table */}
      <section className="bg-white rounded-lg shadow-xs border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="min-w-0">
            <h3 className="text-base font-black text-slate-900">Daftar Banding Hasil Asesmen</h3>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 w-full lg:w-auto ml-auto">
            <div className="flex items-center gap-2 bg-gray-50/80 rounded-lg px-3 h-10.5 w-full sm:w-68 border border-gray-200/50 focus-within:border-[#008BE3]/40 transition-colors">
              <Search className="text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Cari asesi, skema, dll..."
                className="bg-transparent border-none outline-none text-[14px] w-full text-slate-700 placeholder-gray-400"
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              className="bg-gray-50/80 border border-gray-200/50 text-slate-700 text-[14px] rounded-lg px-3 h-10.5 outline-none focus:border-[#008BE3]/40 transition-colors font-semibold appearance-none cursor-pointer"
              value={statusFilter}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value)}
            >
              <option value="Semua">Semua Status</option>
              <option value="Dalam Penyelidikan">Dalam Penyelidikan</option>
              <option value="Disetujui">Disetujui</option>
              <option value="Ditolak">Ditolak</option>
            </select>
            {/* Date Filter */}
            <div className="flex items-center gap-2 bg-gray-50/80 rounded-lg px-3 h-10.5 w-full sm:w-44 border border-gray-200/50 focus-within:border-[#008BE3]/40 transition-colors">
              <input
                type="date"
                value={dateFilter}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDateFilter(e.target.value)}
                className="bg-transparent border-none focus:ring-0 text-xs md:text-sm w-full outline-none text-gray-700 font-semibold"
              />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto ">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0F172A] border-b border-[#0F172A]">
                <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-left whitespace-nowrap min-w-15 sticky top-0 z-20 bg-[#0F172A]">No</th>
                <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-left whitespace-nowrap min-w-87.5 max-w-125 sticky top-0 z-20 bg-[#0F172A]">Skema Sertifikasi</th>
                <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-left whitespace-nowrap min-w-30 sticky top-0 z-20 bg-[#0F172A]">Tanggal</th>
                <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-left whitespace-nowrap min-w-50 sticky top-0 z-20 bg-[#0F172A]">Alasan Utama</th>
                <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-left whitespace-nowrap sticky top-0 z-20 bg-[#0F172A]">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-left whitespace-nowrap min-w-40 sticky right-0 top-0 bg-[#0F172A] shadow-[-6px_0_15px_-4px_rgba(0,0,0,0.06)] z-30 border-l border-white/10">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center gap-3 text-slate-500">
                      <div className="w-5 h-5 border-2 border-slate-300 border-t-[#008BE3] rounded-full animate-spin" />
                      <span className="text-sm font-medium">Memuat data banding...</span>
                    </div>
                  </td>
                </tr>
              ) : currentRecords.length > 0 ? (
                currentRecords.map((rec, idx) => (
                  <tr key={rec.id} className="group/row hover:bg-[#F9FAFC] transition-colors">
                    <td className="px-6 py-4 text-xs md:text-sm text-center font-semibold text-slate-700">
                      <div className={`mx-auto w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-xs font-bold text-xs ${
                        idx % 3 === 0 ? 'bg-[#008BE3]/10 text-[#008BE3]' :
                        idx % 3 === 1 ? 'bg-[#84CC16]/10 text-[#73B412]' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {(currentPage - 1) * itemsPerPage + idx + 1}
                      </div>
                    </td>
                    <td className="px-6 py-4 min-w-87.5 max-w-125">
                      <div className="text-sm font-bold text-[#008BE3] line-clamp-2">{rec.skemaSertifikasi}</div>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-600 whitespace-nowrap">
                      {formatTanggal(rec.tanggalPengajuan)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-slate-600 line-clamp-1 max-w-50 font-medium" title={rec.alasan}>
                        {rec.alasan}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(rec.status)}
                    </td>
                    <td className="px-6 py-4 text-center sticky right-0 bg-white group-hover/row:bg-[#F9FAFC] z-10 border-l border-gray-100 shadow-[-6px_0_15px_-4px_rgba(0,0,0,0.06)] whitespace-nowrap">
                      <button
                        onClick={() => setSelectedAppeal(rec)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-50 hover:text-[#008BE3] hover:border-[#008BE3]/30 transition-all shadow-2xs"
                      >
                        <Eye size={14} />
                        Detail
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-xs md:text-sm text-gray-400 font-medium">
                    Tidak ada pengajuan banding yang cocok dengan kriteria filter Anda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages >= 1 && (
          <div className="p-4 px-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 font-medium bg-gray-50/50 rounded-b-xl">
            <span>
              Menampilkan <span className="font-semibold text-slate-700">{(currentPage - 1) * itemsPerPage + 1}</span> hingga <span className="font-semibold text-slate-700">{Math.min(currentPage * itemsPerPage, filteredRecords.length)}</span> dari <span className="font-semibold text-slate-700">{filteredRecords.length}</span> entri
            </span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Sebelumnya
              </button>
              <div className="hidden sm:flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium transition-colors ${
                      currentPage === page
                        ? 'bg-[#008BE3] text-white border border-[#008BE3]'
                        : 'text-slate-700 bg-white border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}