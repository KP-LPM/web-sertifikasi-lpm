import React, { useState } from 'react';
import { Search, History, CheckCircle, FileText, Calendar, X, ArrowLeft, MapPin, Building, Clock, Eye, AlertCircle, Filter } from 'lucide-react';
import { useAppContext } from '../../context';
import { FormFRAPL02, FormFRAK07, FormFRIA04A, FormFRIA04B, FormFRIA07 } from '../../components/forms';

export function RiwayatAsesmenAdmin() {
  const { assessments } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [hasilFilter, setHasilFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [tanggalFilter, setTanggalFilter] = useState('');
  const [selectedAsesmen, setSelectedAsesmen] = useState<any>(null);
  const [previewForm, setPreviewForm] = useState<'FR.APL.02' | 'FR.AK.07' | 'FR.IA.04A' | 'FR.IA.04B' | 'FR.IA.07' | null>(null);

  // Helper to parse string dates
  const parseDateToISO = (dateStr: string): string => {
    if (!dateStr) return '';
    const trimmed = dateStr.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;

    const months: Record<string, string> = {
      'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 'Mei': '05', 'Jun': '06',
      'Jul': '07', 'Agt': '08', 'Sep': '09', 'Okt': '10', 'Nov': '11', 'Des': '12',
      'Januari': '01', 'Februari': '02', 'Maret': '03', 'April': '04', 'Juni': '06',
      'Juli': '07', 'Agustus': '08', 'September': '09', 'Oktober': '10', 'November': '11', 'Desember': '12'
    };

    const parts = trimmed.split(' ');
    if (parts.length === 3) {
      const day = parts[0].padStart(2, '0');
      const month = months[parts[1]] || '01';
      const year = parts[2];
      return `${year}-${month}-${day}`;
    }

    try {
      const d = new Date(trimmed);
      if (!isNaN(d.getTime())) {
        return d.toISOString().split('T')[0];
      }
    } catch {
      // ignore
    }
    return '';
  };

  const filteredAssessments = assessments.filter(item => {
    if (hasilFilter && item.hasil !== hasilFilter) return false;
    if (statusFilter && item.status !== statusFilter) return false;
    if (searchTerm) {
      const query = searchTerm.toLowerCase();
      const matchName = item.nama?.toLowerCase().includes(query);
      const matchSkema = item.skema?.toLowerCase().includes(query);
      const matchAsesor = item.asesor?.toLowerCase().includes(query);
      if (!matchName && !matchSkema && !matchAsesor) return false;
    }
    if (tanggalFilter) {
      const itemIso = parseDateToISO(item.tglAsesmen);
      if (itemIso && itemIso !== tanggalFilter) return false;
    }
    return true;
  });

  // If detail view is open
  if (selectedAsesmen) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] p-4 md:p-8 space-y-6 pb-24 text-sm text-gray-700">
        <div className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden">
          {/* Banner/Header Info */}
          <div className="p-4 sm:p-6 border-b border-gray-100 space-y-5">
            {/* Top Title & Badge Row */}
            <div className="flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
              <div className="flex items-center gap-3 min-w-0">
                <button 
                  onClick={() => setSelectedAsesmen(null)}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-[#008BE3] bg-[#008BE3]/10 hover:bg-[#008BE3]/20 transition-colors cursor-pointer shrink-0"
                  title="Kembali ke Daftar Riwayat"
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

              <div className="shrink-0 flex items-center gap-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shadow-2xs ${
                  selectedAsesmen.hasil === 'Kompeten' 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : 'bg-red-50 text-red-700 border-red-200'
                }`}>
                  {selectedAsesmen.hasil}
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border bg-emerald-50 text-emerald-700 border-emerald-200">
                  <CheckCircle size={12} /> {selectedAsesmen.status}
                </span>
              </div>
            </div>

            {/* Grid Metadata Row */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 sm:gap-6 pt-3 border-t border-gray-100">
              <div className="min-w-0">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Asesor Penguji</p>
                <p className="text-slate-800 font-bold text-xs sm:text-sm">{selectedAsesmen.asesor || 'Dr. Aris Thorne'}</p>
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">TUK</p>
                <div className="flex items-center gap-1.5 text-slate-700 font-semibold text-xs sm:text-sm">
                  <MapPin size={14} className="text-slate-400 shrink-0" />
                  {selectedAsesmen.tuk}
                </div>
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Pelaksanaan</p>
                <div className="flex items-center gap-1.5 text-slate-700 font-semibold text-xs sm:text-sm">
                  <Building size={14} className="text-slate-400 shrink-0" />
                  {selectedAsesmen.jenis_asesmen}
                </div>
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Tanggal</p>
                <div className="flex items-center gap-1.5 text-slate-700 font-semibold text-xs sm:text-sm">
                  <Calendar size={14} className="text-slate-400 shrink-0" />
                  {selectedAsesmen.tglAsesmen}
                </div>
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Waktu</p>
                <div className="flex items-center gap-1.5 text-slate-700 font-semibold text-xs sm:text-sm">
                  <Clock size={14} className="text-slate-400 shrink-0" />
                  {selectedAsesmen.waktu}
                </div>
              </div>
            </div>
          </div>

          {/* Detail Penilaian (Read-only) */}
          <div className="p-4 sm:p-8">
            <h2 className="text-lg font-black text-slate-900 tracking-tight mb-6 flex items-center gap-2">
              Rekapitulasi Penilaian & Berkas Asesmen LSP
            </h2>

            <div className="space-y-4 sm:space-y-6">
              {/* Form FR.APL.02 */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-50 p-4 border-b border-slate-200 font-bold text-slate-800 flex items-center justify-between">
                  <span>FR.APL.02 - Asesmen Mandiri</span>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">Terverifikasi</span>
                </div>
                <div className="p-4 bg-white flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2.5 bg-red-50 text-red-600 rounded-lg shrink-0">
                      <FileText size={20} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-800 text-sm">FR_APL_02_Signed.pdf</p>
                      <p className="text-xs text-slate-500">Telah diisi oleh Asesi dan Diverifikasi Asesor</p>
                    </div>
                  </div>
                  <button onClick={() => setPreviewForm('FR.APL.02')} className="flex items-center gap-2 px-4 py-2 bg-[#008BE3] hover:bg-[#0076C2] text-white rounded-lg text-sm font-bold transition-colors cursor-pointer">
                    <Eye size={16} /> Pratinjau
                  </button>
                </div>
              </div>

              {/* Form FR.AK.07 */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-50 p-4 border-b border-slate-200 font-bold text-slate-800 flex items-center justify-between">
                  <span>FR.AK.07 - Ceklis Penyesuaian yang Wajar dan Beralasan</span>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">Terverifikasi</span>
                </div>
                <div className="p-4 bg-white flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2.5 bg-red-50 text-red-600 rounded-lg shrink-0">
                      <FileText size={20} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-800 text-sm">FR_AK_07_Signed.pdf</p>
                      <p className="text-xs text-slate-500">Telah diisi oleh Asesi dan Asesor</p>
                    </div>
                  </div>
                  <button onClick={() => setPreviewForm('FR.AK.07')} className="flex items-center gap-2 px-4 py-2 bg-[#008BE3] hover:bg-[#0076C2] text-white rounded-lg text-sm font-bold transition-colors cursor-pointer">
                    <Eye size={16} /> Pratinjau
                  </button>
                </div>
              </div>

              {/* Form FR.IA.04A */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-50 p-4 border-b border-slate-200 font-bold text-slate-800 flex items-center justify-between">
                  <span>FR.IA.04A - Penilaian Praktik/Observasi</span>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">Terverifikasi</span>
                </div>
                <div className="p-4 bg-white flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2.5 bg-red-50 text-red-600 rounded-lg shrink-0">
                      <FileText size={20} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-800 text-sm">FR_IA_04A_Signed.pdf</p>
                      <p className="text-xs text-slate-500">Lembar Observasi Demonstrasi Praktik</p>
                    </div>
                  </div>
                  <button onClick={() => setPreviewForm('FR.IA.04A')} className="flex items-center gap-2 px-4 py-2 bg-[#008BE3] hover:bg-[#0076C2] text-white rounded-lg text-sm font-bold transition-colors cursor-pointer">
                    <Eye size={16} /> Pratinjau
                  </button>
                </div>
              </div>

              {/* Form FR.IA.04B */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-50 p-4 border-b border-slate-200 font-bold text-slate-800 flex items-center justify-between">
                  <span>FR.IA.04B - Penilaian Daftar Periksa Tugas Praktik (DPT)</span>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">Terverifikasi</span>
                </div>
                <div className="p-4 bg-white flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2.5 bg-red-50 text-red-600 rounded-lg shrink-0">
                      <FileText size={20} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-800 text-sm">FR_IA_04B_Signed.pdf</p>
                      <p className="text-xs text-slate-500">Lembar Penilaian Hasil Tugas Praktik</p>
                    </div>
                  </div>
                  <button onClick={() => setPreviewForm('FR.IA.04B')} className="flex items-center gap-2 px-4 py-2 bg-[#008BE3] hover:bg-[#0076C2] text-white rounded-lg text-sm font-bold transition-colors cursor-pointer">
                    <Eye size={16} /> Pratinjau
                  </button>
                </div>
              </div>

              {/* Form FR.IA.07 */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-50 p-4 border-b border-slate-200 font-bold text-slate-800 flex items-center justify-between">
                  <span>FR.IA.07 - Pertanyaan Lisan Pendukung Observasi</span>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">Terverifikasi</span>
                </div>
                <div className="p-4 bg-white flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2.5 bg-red-50 text-red-600 rounded-lg shrink-0">
                      <FileText size={20} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-800 text-sm">FR_IA_07_Signed.pdf</p>
                      <p className="text-xs text-slate-500">Lembar Hasil Wawancara / Pertanyaan Lisan</p>
                    </div>
                  </div>
                  <button onClick={() => setPreviewForm('FR.IA.07')} className="flex items-center gap-2 px-4 py-2 bg-[#008BE3] hover:bg-[#0076C2] text-white rounded-lg text-sm font-bold transition-colors cursor-pointer">
                    <Eye size={16} /> Pratinjau
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Modal Preview Form */}
        {previewForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden my-auto">
              <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white shrink-0">
                <div className="flex items-center gap-2">
                  <FileText className="text-[#008BE3]" size={20} />
                  <span className="font-bold text-sm">Pratinjau Dokumen {previewForm}</span>
                  <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded">Read-Only</span>
                </div>
                <button onClick={() => setPreviewForm(null)} className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 overflow-y-auto flex-1 bg-slate-50">
                {previewForm === 'FR.APL.02' && (
                  <FormFRAPL02
                    asesmenData={{
                      nama: selectedAsesmen.nama,
                      skema: selectedAsesmen.skema,
                      noSkema: '04/SKM/LSP P1 UIN SGD/V/2022',
                      tuk: selectedAsesmen.tuk,
                      tanggal: selectedAsesmen.tglAsesmen,
                      asesor: selectedAsesmen.asesor || 'Dr. Aris Thorne',
                      asesorReg: 'MET.000.001234 2021'
                    }}
                    answers={{ u0e0: 'K', u0e1: 'K', u1e0: 'K' }}
                    rekomendasi="Dapat dilanjutkan"
                    asesiName={selectedAsesmen.nama}
                    asesiSignature={selectedAsesmen.nama}
                    asesiDate={selectedAsesmen.tglAsesmen}
                    asesorName={selectedAsesmen.asesor || 'Dr. Aris Thorne'}
                    asesorReg="MET.000.001234 2021"
                    asesorSignature={selectedAsesmen.asesor || 'Dr. Aris Thorne'}
                    readOnly={true}
                  />
                )}
                {previewForm === 'FR.AK.07' && (
                  <FormFRAK07
                    asesmenData={{
                      nama: selectedAsesmen.nama,
                      skema: selectedAsesmen.skema,
                      noSkema: '04/SKM/LSP P1 UIN SGD/V/2022',
                      tuk: selectedAsesmen.tuk,
                      tanggal: selectedAsesmen.tglAsesmen,
                      asesor: selectedAsesmen.asesor || 'Dr. Aris Thorne',
                      asesorReg: 'MET.000.001234 2021'
                    }}
                    readOnly={true}
                  />
                )}
                {previewForm === 'FR.IA.04A' && (
                  <FormFRIA04A
                    asesmenData={{
                      nama: selectedAsesmen.nama,
                      skema: selectedAsesmen.skema,
                      noSkema: '04/SKM/LSP P1 UIN SGD/V/2022',
                      tuk: selectedAsesmen.tuk,
                      tanggal: selectedAsesmen.tglAsesmen,
                      asesor: selectedAsesmen.asesor || 'Dr. Aris Thorne',
                      asesorReg: 'MET.000.001234 2021'
                    }}
                    readOnly={true}
                  />
                )}
                {previewForm === 'FR.IA.04B' && (
                  <FormFRIA04B
                    asesmenData={{
                      nama: selectedAsesmen.nama,
                      skema: selectedAsesmen.skema,
                      noSkema: '04/SKM/LSP P1 UIN SGD/V/2022',
                      tuk: selectedAsesmen.tuk,
                      tanggal: selectedAsesmen.tglAsesmen,
                      asesor: selectedAsesmen.asesor || 'Dr. Aris Thorne',
                      asesorReg: 'MET.000.001234 2021'
                    }}
                    readOnly={true}
                  />
                )}
                {previewForm === 'FR.IA.07' && (
                  <FormFRIA07
                    asesmenData={{
                      nama: selectedAsesmen.nama,
                      skema: selectedAsesmen.skema,
                      noSkema: '04/SKM/LSP P1 UIN SGD/V/2022',
                      tuk: selectedAsesmen.tuk,
                      tanggal: selectedAsesmen.tglAsesmen,
                      asesor: selectedAsesmen.asesor || 'Dr. Aris Thorne',
                      asesorReg: 'MET.000.001234 2021'
                    }}
                    readOnly={true}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC] p-4 md:p-8 space-y-6 pb-24 text-sm text-gray-700">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-[#008BE3]/10 flex items-center justify-center text-[#008BE3] border border-[#008BE3]/20 shadow-xs shrink-0">
            <History size={20} className="stroke-[2.5]" />
          </div>
          <div className="min-w-0">
            <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">
              Riwayat Asesmen LSP
            </h2>
            <p className="text-xs text-gray-400 font-bold tracking-wider uppercase leading-[16px]">
              Seluruh riwayat asesmen yang tercatat di sistem LSP
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden">
          {/* Header Controls & Filters */}
          <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
            <h3 className="text-base font-black text-slate-900 shrink-0">Daftar Histori Asesmen</h3>
            
            <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto xl:justify-end">
              {/* Search Input */}
              <div className="flex items-center gap-2 bg-gray-50/80 rounded-lg px-3 h-[42px] w-full sm:w-64 border border-gray-200/50 focus-within:border-[#008BE3]/40 transition-colors">
                <Search className="text-gray-400 shrink-0" size={16} />
                <input
                  type="text"
                  placeholder="Cari Asesi, Skema, Asesor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent border-none focus:ring-0 text-xs md:text-sm w-full outline-none text-gray-700 placeholder-gray-400 font-semibold"
                />
              </div>

              {/* Hasil Select Filter */}
              <select
                value={hasilFilter}
                onChange={(e) => setHasilFilter(e.target.value)}
                className="bg-gray-50 border border-gray-200/50 text-xs md:text-sm rounded-lg px-3 h-[42px] outline-none text-gray-700 cursor-pointer font-bold"
              >
                <option value="">Semua Hasil</option>
                <option value="Kompeten">Kompeten</option>
                <option value="Belum Kompeten">Belum Kompeten</option>
              </select>

              {/* Status Select Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-gray-50 border border-gray-200/50 text-xs md:text-sm rounded-lg px-3 h-[42px] outline-none text-gray-700 cursor-pointer font-bold"
              >
                <option value="">Semua Status</option>
                <option value="Selesai">Selesai</option>
                <option value="Proses">Proses</option>
              </select>

              {/* Date Input Filter */}
              <div className="flex items-center gap-2 bg-gray-50/80 rounded-lg px-3 h-[42px] w-full sm:w-52 border border-gray-200/50 focus-within:border-[#008BE3]/40 transition-colors">
                <Calendar className="text-gray-400 shrink-0" size={16} />
                <input
                  type="date"
                  value={tanggalFilter}
                  onChange={(e) => setTanggalFilter(e.target.value)}
                  className="bg-transparent border-none focus:ring-0 text-xs md:text-sm w-full outline-none text-gray-700 cursor-pointer font-semibold"
                />
                {tanggalFilter && (
                  <button
                    onClick={() => setTanggalFilter('')}
                    className="text-gray-400 hover:text-gray-600 p-0.5 rounded-full shrink-0"
                    title="Reset Tanggal"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto relative">
            <table className="w-full text-left border-collapse min-w-[700px] sm:min-w-[1000px]">
              <thead>
                <tr className="bg-[#0F172A] border-b border-[#0F172A]">
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-bold text-white/90 uppercase tracking-wider whitespace-nowrap">Nama Asesi</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-bold text-white/90 uppercase tracking-wider whitespace-nowrap">Skema Sertifikasi</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-bold text-white/90 uppercase tracking-wider whitespace-nowrap">Asesor Penguji</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-bold text-white/90 uppercase tracking-wider whitespace-nowrap">TUK / Jenis</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-bold text-white/90 uppercase tracking-wider whitespace-nowrap">Tanggal & Waktu</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-bold text-white/90 uppercase tracking-wider whitespace-nowrap">Hasil</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-bold text-white/90 uppercase tracking-wider whitespace-nowrap">Status</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-bold text-white/90 uppercase tracking-wider text-center whitespace-nowrap w-28 sm:w-36 sticky right-0 bg-[#0F172A] z-20 border-l border-white/10 shadow-[-6px_0_15px_-4px_rgba(0,0,0,0.06)]">Aksi</th>
                </tr>
              </thead>
              <tbody className="font-medium text-xs sm:text-sm divide-y divide-gray-100">
                {filteredAssessments.length > 0 ? (
                  filteredAssessments.map((item) => (
                    <tr key={item.id} className="group/row hover:bg-[#F9FAFC] transition-colors">
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-slate-800 font-bold whitespace-nowrap">{item.nama}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-slate-800 font-semibold whitespace-nowrap">{item.skema}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-slate-600 font-medium whitespace-nowrap">{item.asesor || 'Dr. Aris Thorne'}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            item.tuk === 'Sewaktu' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            item.tuk === 'Tempat Kerja' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                            'bg-orange-50 text-orange-700 border-orange-200'
                          }`}>
                            {item.tuk}
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                            {item.jenis_asesmen}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <div className="text-slate-700 font-medium">{item.tglAsesmen}</div>
                        <div className="text-[11px] text-slate-400 font-semibold">{item.waktu}</div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          item.hasil === 'Kompeten' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'
                        }`}>
                          {item.hasil}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          item.status === 'Selesai' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          <CheckCircle size={10} /> {item.status}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-center bg-white group-hover/row:bg-[#F9FAFC] border-l border-gray-100 sticky right-0 z-10">
                        <button 
                          onClick={() => setSelectedAsesmen(item)}
                          className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-3 py-1.5 rounded-lg font-bold text-xs shadow-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <FileText size={14} className="text-[#008BE3]" /> Detail
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <History size={36} className="mb-2 text-slate-300" />
                        <p className="font-bold text-slate-700 text-base">Tidak ada riwayat asesmen ditemukan</p>
                        <p className="text-xs text-slate-400 mt-1">Coba sesuaikan kata kunci pencarian atau filter Anda.</p>
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
