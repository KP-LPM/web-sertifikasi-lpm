'use client';

import React, { useState } from 'react';
import { 
  Search, Award, Download, History, CheckCircle, Clock, AlertTriangle, Eye, X, Scale, ArrowLeft
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/context';

interface AssessmentHistory {
  id: string;
  asesmen: string;
  skemaSertifikasi: string;
  tuk: string;
  metodePelaksanaan: 'Online' | 'Offline';
  jenisBukti: string;
  noSertifikat: string;
  tanggalBerlaku: string;
  rekomendasi: string;
  statusAsesmen: string;
  tanggalPenilaian?: string;
}

const ASSESSMENT_HISTORY_DATA: AssessmentHistory[] = [
  {
    id: '1',
    asesmen: 'Uji Kompetensi',
    skemaSertifikasi: 'Jenjang 5 Bidang Kewirausahaan Industri',
    tuk: 'Mandiri',
    metodePelaksanaan: 'Offline',
    jenisBukti: 'Portofolio & Praktik',
    noSertifikat: 'SER/2026/07/0423',
    tanggalBerlaku: '15/07/2029',
    rekomendasi: 'Kompeten',
    statusAsesmen: 'Selesai',
    tanggalPenilaian: '02/08/2026',
  },
  {
    id: '2',
    asesmen: 'Uji Teori & Praktik',
    skemaSertifikasi: 'Melaksanakan Komunikasi Dengan Pemangku Kepentingan',
    tuk: 'Sewaktu',
    metodePelaksanaan: 'Offline',
    jenisBukti: 'Praktik & Tes Lisan',
    noSertifikat: '-',
    tanggalBerlaku: '-',
    rekomendasi: 'Belum Kompeten',
    statusAsesmen: 'Selesai',
    tanggalPenilaian: '05/08/2026' 
  },
  {
    id: '3',
    asesmen: 'Asesmen Mandiri',
    skemaSertifikasi: 'Penerjemah Teks Umum',
    tuk: 'Mandiri',
    metodePelaksanaan: 'Online',
    jenisBukti: 'Portofolio',
    noSertifikat: 'Menunggu Terbit',
    tanggalBerlaku: 'Menunggu Terbit',
    rekomendasi: 'Kompeten',
    statusAsesmen: 'Selesai',
    tanggalPenilaian: '04/08/2026'
  },
  {
    id: '4',
    asesmen: 'Asesmen Mandiri',
    skemaSertifikasi: 'Auditor Halal',
    tuk: 'Mandiri B',
    metodePelaksanaan: 'Offline',
    jenisBukti: 'Praktik',
    noSertifikat: '-',
    tanggalBerlaku: '-',
    rekomendasi: 'Belum Kompeten',
    statusAsesmen: 'Selesai',
    tanggalPenilaian: '05/08/2026' 
  },
  {
    id: '5',
    asesmen: 'Asesmen Mandiri',
    skemaSertifikasi: 'Penyelia Halal',
    tuk: 'Mandiri',
    metodePelaksanaan: 'Online',
    jenisBukti: 'Portofolio',
    noSertifikat: '-',
    tanggalBerlaku: '-',
    rekomendasi: 'Belum Kompeten',
    statusAsesmen: 'Selesai',
    tanggalPenilaian: '04/08/2026'
  },
  {
    id: '6',
    asesmen: 'Asesmen Mandiri',
    skemaSertifikasi: 'Jenjang 5 Bidang Kewirausahaan Industri',
    tuk: 'Mandiri B',
    metodePelaksanaan: 'Offline',
    jenisBukti: 'Portofolio',
    noSertifikat: 'Menunggu Terbit',
    tanggalBerlaku: 'Menunggu Terbit',
    rekomendasi: 'Kompeten',
    statusAsesmen: 'Selesai',
    tanggalPenilaian: '05/08/2026'
  }
];

export default function AsesiHistoryPage() {
  const { user, setExtraCrumbs } = useAppContext(); 
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [dateFilter, setDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentHistory | null>(null);

  const [isBandingFormOpen, setIsBandingFormOpen] = useState(false);

  const [bandingForm, setBandingForm] = useState({
    dijelaskan: null as boolean | null,
    didiskusikan: null as boolean | null,
    melibatkanOrangLain: null as boolean | null,
    alasan: '',
    ttdAsesi: false,
    namaAsesor: 'Asesor Budi'
  });

  const [showSubmitModal, setShowSubmitModal] = useState(false);

  React.useEffect(() => {
    if (isBandingFormOpen) {
      setExtraCrumbs([{
        label: 'Form Ajukan Banding'
      }]);
    } else {
      setExtraCrumbs([]);
    }
    return () => setExtraCrumbs([]);
  }, [isBandingFormOpen, setExtraCrumbs]);

  React.useEffect(() => {
    const handleReset = () => {
       if (isBandingFormOpen) {
          setIsBandingFormOpen(false);
          setSelectedAssessment(null);
          setExtraCrumbs([]);
       }
    };
    window.addEventListener('reset-history', handleReset);
    return () => window.removeEventListener('reset-history', handleReset);
  }, [isBandingFormOpen, setExtraCrumbs]);

  const [certificatePreview, setCertificatePreview] = useState<AssessmentHistory | null>(null);

  // Filter logic
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, dateFilter]);

  const filteredHistory = ASSESSMENT_HISTORY_DATA.filter((item) => {
    const matchesSearch = 
      item.asesmen.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.skemaSertifikasi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tuk.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.noSertifikat.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = statusFilter === 'Semua' || item.statusAsesmen === statusFilter;
    const matchesDate = !dateFilter || item.tanggalPenilaian === dateFilter.split('-').reverse().join('/');
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const totalPages = Math.ceil((filteredHistory?.length || 0) / itemsPerPage);
  const currentRecords = filteredHistory.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getRekomendasiBadge = (rek: string) => {
    if (rek === 'Kompeten') {
      return (
        <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider whitespace-nowrap border border-green-200">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
          K (Kompeten)
        </span>
      );
    }
    if (rek === 'Belum Kompeten') {
      return (
        <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider whitespace-nowrap border border-red-200">
          <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
          BK (Belum Kompeten)
        </span>
      );
    }
    return <span className="text-gray-400 text-xs font-semibold px-2 whitespace-nowrap">-</span>;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Selesai':
        return <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200 text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider whitespace-nowrap"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>Selesai</span>;
      case 'Terjadwal':
        return <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200 text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider whitespace-nowrap"><span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>Terjadwal</span>;
      case 'Belum Mulai':
        return <span className="inline-flex items-center gap-1.5 bg-gray-50 text-gray-600 border border-gray-200 text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider whitespace-nowrap"><span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>Belum Mulai</span>;
      case 'Menunggu Verifikasi':
        return <span className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-700 border border-purple-200 text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider whitespace-nowrap"><span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>Menunggu Verifikasi</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 bg-gray-50 text-gray-700 border border-gray-200 text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider whitespace-nowrap"><span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>{status}</span>;
    }
  };

  // Metrics specifically for the history view
  const totalSertifikat = ASSESSMENT_HISTORY_DATA.filter(item => item.noSertifikat !== '-' && item.noSertifikat !== 'Menunggu Terbit').length;
  const totalAsesmenSelesai = ASSESSMENT_HISTORY_DATA.filter(item => item.statusAsesmen === 'Selesai').length;

  const handleSubmitBanding = () => {
    const savedAppeals = JSON.parse(localStorage.getItem('appeals') || '[]');
    const newAppeal = {
      id: `APP-${Date.now().toString().slice(-4)}`,
      tanggalPengajuan: new Date().toLocaleDateString('en-GB'),
      namaAsesi: user?.name || 'Asesi',
      asesmen: selectedAssessment?.asesmen,
      skemaSertifikasi: selectedAssessment?.skemaSertifikasi,
      status: 'Menunggu Verifikasi',
      alasan: bandingForm.alasan,
      penjelasan: bandingForm.alasan,
      dijelaskan: bandingForm.dijelaskan,
      didiskusikan: bandingForm.didiskusikan,
      melibatkanOrangLain: bandingForm.melibatkanOrangLain,
      namaAsesor: bandingForm.namaAsesor,
      ttdAsesi: bandingForm.ttdAsesi
    };
    localStorage.setItem('appeals', JSON.stringify([newAppeal, ...savedAppeals]));
    
    alert('Banding berhasil diajukan!');
    setShowSubmitModal(false);
    setIsBandingFormOpen(false);
    setSelectedAssessment(null);
    router.push('/asesi/banding');
  };

  if (selectedAssessment && isBandingFormOpen) {
    return (
      <>
        {/* Submit Modal */}
        {showSubmitModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-6">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-4 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Kirim Pengajuan Banding?</h3>
                <p className="text-slate-600 text-sm">Pastikan semua data yang Anda isi sudah benar. Pengajuan ini akan diteruskan kepada tim Asesor untuk diverifikasi.</p>
              </div>
              <div className="bg-slate-50 px-6 py-4 flex gap-3 justify-end">
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2 rounded-lg text-sm font-bold text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleSubmitBanding}
                  className="px-4 py-2 rounded-lg text-sm font-bold text-white bg-[#008BE3] hover:bg-[#0076C2] transition-colors"
                >
                  Ya, Kirim
                </button>
              </div>
            </div>
          </div>
        )}

      <div className="w-full space-y-6 text-sm text-gray-700">
        <div className="max-w-200 mx-auto animate-in fade-in zoom-in-95 duration-200">
              <button 
                onClick={() => {
                  setIsBandingFormOpen(false);
                  setSelectedAssessment(null);
                  setExtraCrumbs([]);
                }}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-[#008BE3] bg-[#008BE3]/10 hover:bg-[#008BE3]/20 transition-colors cursor-pointer shrink-0 mb-4 mt-0.5"
                title="Kembali"
              >
                <ArrowLeft size={18} />
              </button>
            <div className="max-w-200 mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12 space-y-8 relative mb-8 text-slate-800 text-sm">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                        <Scale className="text-[#008BE3]" size={20} /> Form Ajukan Banding
                    </h3>
                </div>
                <table className="w-full border-collapse border border-slate-300">
                <tbody>
                  <tr>
                    <td className="border border-slate-300 p-2 font-semibold bg-white w-48">Nama Asesi:</td>
                    <td className="border border-slate-300 p-2" colSpan={2}>{user?.name || 'Ahmad Fauzi'}</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 p-2 font-semibold bg-white">Nama Asesor:</td>
                    <td className="border border-slate-300 p-2" colSpan={2}>
                      <input 
                        type="text"
                        className="w-full bg-transparent outline-none focus:bg-slate-50 p-1 border border-transparent focus:border-slate-300 rounded"
                        placeholder="Ketik nama asesor jika tahu, atau biarkan kosong"
                        value={bandingForm.namaAsesor || ''}
                        onChange={(e) => setBandingForm({...bandingForm, namaAsesor: e.target.value})}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 p-2 font-semibold bg-white">Tanggal Asesmen:</td>
                    <td className="border border-slate-300 p-2" colSpan={2}>{selectedAssessment.tanggalPenilaian}</td>
                  </tr>
                  <tr className="bg-slate-100 font-bold">
                    <td className="border border-slate-300 p-2">Jawablah dengan Ya atau Tidak pertanyaan-pertanyaan berikut ini :</td>
                    <td className="border border-slate-300 p-2 text-center w-16">YA</td>
                    <td className="border border-slate-300 p-2 text-center w-16">TIDAK</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 p-2">Apakah Proses Banding telah dijelaskan kepada Anda?</td>
                    <td className="border border-slate-300 p-2 text-center align-middle">
                      <input type="checkbox" className="w-4 h-4 cursor-pointer" checked={bandingForm.dijelaskan === true} onChange={() => setBandingForm({...bandingForm, dijelaskan: true})} />
                    </td>
                    <td className="border border-slate-300 p-2 text-center align-middle">
                      <input type="checkbox" className="w-4 h-4 cursor-pointer" checked={bandingForm.dijelaskan === false} onChange={() => setBandingForm({...bandingForm, dijelaskan: false})} />
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 p-2">Apakah Anda telah mendiskusikan Banding dengan Asesor?</td>
                    <td className="border border-slate-300 p-2 text-center align-middle">
                      <input type="checkbox" className="w-4 h-4 cursor-pointer" checked={bandingForm.didiskusikan === true} onChange={() => setBandingForm({...bandingForm, didiskusikan: true})} />
                    </td>
                    <td className="border border-slate-300 p-2 text-center align-middle">
                      <input type="checkbox" className="w-4 h-4 cursor-pointer" checked={bandingForm.didiskusikan === false} onChange={() => setBandingForm({...bandingForm, didiskusikan: false})} />
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 p-2">Apakah Anda mau melibatkan &quot;orang lain&quot; membantu Anda dalam Proses Banding?</td>
                    <td className="border border-slate-300 p-2 text-center align-middle">
                      <input type="checkbox" className="w-4 h-4 cursor-pointer" checked={bandingForm.melibatkanOrangLain === true} onChange={() => setBandingForm({...bandingForm, melibatkanOrangLain: true})} />
                    </td>
                    <td className="border border-slate-300 p-2 text-center align-middle">
                      <input type="checkbox" className="w-4 h-4 cursor-pointer" checked={bandingForm.melibatkanOrangLain === false} onChange={() => setBandingForm({...bandingForm, melibatkanOrangLain: false})} />
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 p-4" colSpan={3}>
                      <div className="mb-2">Banding ini diajukan atas Keputusan Asesmen yang dibuat terhadap Skema Sertifikasi (Kualifikasi/Klaster/Okupasi) berikut :</div>
                      <div className="flex mb-1">
                        <div className="w-40 font-semibold">Skema Sertifikasi</div>
                        <div className="min-w-0">: {selectedAssessment.skemaSertifikasi}</div>
                      </div>
                      <div className="flex">
                        <div className="w-40 font-semibold">No. Skema Sertifikasi</div>
                        <div className="min-w-0">: -</div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 p-4" colSpan={3}>
                      <div className="font-semibold mb-2">Banding ini diajukan atas alasan sebagai berikut :</div>
                      <textarea
                        className="w-full h-32 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#008BE3] focus:border-transparent outline-none resize-none"
                        placeholder="Tuliskan alasan Anda..."
                        value={bandingForm.alasan}
                        onChange={(e) => setBandingForm({...bandingForm, alasan: e.target.value})}
                      ></textarea>
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
                          <label className="flex items-center gap-2 cursor-pointer p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                            <input type="checkbox" className="w-4 h-4" checked={bandingForm.ttdAsesi} onChange={(e) => setBandingForm({...bandingForm, ttdAsesi: e.target.checked})} />
                            <span className="font-medium text-xs">Gunakan tanda tangan dari profil</span>
                          </label>
                        </div>
                        <div className="min-w-0">
                          <span className="font-semibold mb-2 block">Tanggal :</span>
                          <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium">
                            {new Date().toLocaleDateString('en-GB')}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="pt-8 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsBandingFormOpen(false);
                  setSelectedAssessment(null);
                  setExtraCrumbs([]);
                }}
                className="px-6 py-2 rounded-lg text-sm font-bold bg-white text-slate-600 border border-slate-300 hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  if (bandingForm.dijelaskan === null || bandingForm.didiskusikan === null || bandingForm.melibatkanOrangLain === null) {
                    alert('Harap jawab semua pertanyaan Ya/Tidak.');
                    return;
                  }
                  if (!bandingForm.alasan.trim()) {
                    alert('Harap isi alasan banding.');
                    return;
                  }
                  if (!bandingForm.ttdAsesi) {
                    alert('Harap centang tanda tangan.');
                    return;
                  }
                  
                  setShowSubmitModal(true);
                }}
                className="px-6 py-2 rounded-lg text-sm font-bold bg-[#008BE3] hover:bg-[#0076C2] text-white transition-colors"
              >
                Kirim Banding
              </button>
            </div>
            </div>
        </div>
      </div>
      </>
    );
  }

  return (
    <div className="w-full space-y-6 text-sm text-gray-700">
      
      {/* Header Title with History Theme Icon */}
       <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-lg bg-[#008BE3]/10 flex items-center justify-center text-[#008BE3] border border-[#008BE3]/20 shadow-xs shrink-0">
          <History size={20} className="stroke-[2.5]" />
        </div>
        <div className="min-w-0">
          <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none mb-1 md:whitespace-nowrap">
            Riwayat Asesmen
          </h2>
          <p className="text-xs text-gray-400 font-bold tracking-wider uppercase leading-4 md:whitespace-nowrap">
            Daftar Portofolio & Kelulusan Sertifikasi Anda
          </p>
          
        </div>
      </div>

      {/* Overview stats for History page */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Metric 1 */}
        <div className="bg-[#E6F4FF] p-4 rounded-lg border border-[#BCE0FD] flex items-center justify-between shadow-2xs group hover:scale-[1.01] transition-transform duration-200">
          <div className="space-y-0.5">
            <span className="text-[10px] font-black text-sky-800 uppercase tracking-wider block">Total Selesai</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-slate-900 tracking-tight">{totalAsesmenSelesai}</span>
              <span className="text-base font-bold text-sky-700 ml-0.75">Asesmen</span>
            </div>
            <p className="text-[11px] font-bold text-sky-600">Selesai Evaluasi</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#008BE3] text-white flex items-center justify-center shrink-0 shadow-xs">
            <CheckCircle size={18} />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#F4FBF7] p-4 rounded-lg border border-[#A7F3D0] flex items-center justify-between shadow-2xs group hover:scale-[1.01] transition-transform duration-200">
          <div className="space-y-0.5">
            <span className="text-[10px] font-black text-emerald-800 uppercase tracking-wider block">Sertifikat Aktif</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-slate-900 tracking-tight">{totalSertifikat}</span>
              <span className="text-base font-bold text-emerald-700 ml-0.75">Diterbitkan</span>
            </div>
            <p className="text-[11px] font-bold text-emerald-600">Lembaga Sertifikasi</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#84CC16] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Award size={18} />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex items-center justify-between shadow-2xs group hover:scale-[1.01] transition-transform duration-200">
          <div className="space-y-0.5">
            <span className="text-[10px] font-black text-slate-700 uppercase tracking-wider block">Total Kegiatan</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-slate-900 tracking-tight">{ASSESSMENT_HISTORY_DATA.length}</span>
              <span className="text-base font-bold text-slate-600 ml-0.75">Terdaftar</span>
            </div>
            <p className="text-[11px] font-bold text-slate-500">Semua Sesi Aktif & Selesai</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-slate-500 text-white flex items-center justify-center shrink-0 shadow-xs">
            <History size={18} />
          </div>
        </div>
      </div>

      {/* Main Table Card Panel */}
      <section className="bg-white rounded-lg shadow-xs border border-gray-100 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
          <div className="min-w-0">
            <h3 className="text-base font-black text-slate-900 shrink-0">Filter & Cari Riwayat</h3>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto xl:justify-end">
            {/* Search */}
            <div className="flex items-center gap-2 bg-gray-50/80 rounded-lg px-3 h-10.5 w-full sm:w-68 border border-gray-200/50 focus-within:border-[#008BE3]/40 transition-colors">
              <Search className="text-gray-400 shrink-0" size={16} />
              <input 
                type="text" 
                placeholder="Cari asesmen, skema, atau sertifikat..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none focus:ring-0 text-[14px] w-full outline-none text-gray-700 placeholder-gray-400"
              />
            </div>
            
            {/* Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-50 border border-gray-200/50 text-[14px] rounded-lg px-3 h-10.5 outline-none text-gray-700 cursor-pointer font-bold"
            >
              <option value="Semua">Semua Status</option>
              <option value="Selesai">Selesai</option>
            </select>

            {/* Date Filter */}
            <div className="flex items-center gap-2 bg-gray-50/80 rounded-lg px-3 h-10.5 w-full sm:w-44 border border-gray-200/50 focus-within:border-[#008BE3]/40 transition-colors">
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="bg-transparent border-none focus:ring-0 text-xs md:text-sm w-full outline-none text-gray-700 font-semibold"
              />
            </div>
          </div>
        </div>

        {/* Table representation matching exact overview layout */}
        <div className="overflow-x-auto relative ">
          <table className="w-full text-left border-collapse min-w-[1600px]">
            <thead>
              <tr className="bg-[#0F172A] border-b border-[#0F172A]">
                <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-left whitespace-nowrap min-w-15 sticky top-0 z-20 bg-[#0F172A]">No</th>
                <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-left whitespace-nowrap min-w-87.5 max-w-125 sticky top-0 z-20 bg-[#0F172A]">Skema Sertifikasi</th>
                <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-left whitespace-nowrap min-w-37.5 sticky top-0 z-20 bg-[#0F172A]">TUK</th>
                <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-left whitespace-nowrap min-w-45 sticky top-0 z-20 bg-[#0F172A]">Metode Pelaksanaan</th>
                <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-left whitespace-nowrap min-w-55 sticky top-0 z-20 bg-[#0F172A]">Nomor Sertifikat</th>
                <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-left whitespace-nowrap min-w-45 sticky top-0 z-20 bg-[#0F172A]">Tanggal Berlaku</th>
                <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-left whitespace-nowrap min-w-40 sticky top-0 z-20 bg-[#0F172A]">Hasil</th>
                <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-left sticky right-0 bg-[#0F172A] z-30 border-l border-white/10 shadow-[-6px_0_15px_-4px_rgba(0,0,0,0.06)] backdrop-blur-xs whitespace-nowrap min-w-40 top-0">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/60">
              {filteredHistory.length > 0 ? (
                currentRecords.map((item, idx) => (
                  <tr key={item.id} className="group/row hover:bg-[#F9FAFC] transition-colors">
                    <td className="px-6 py-4 text-xs md:text-sm text-center font-semibold text-slate-700">
                      <div className={`mx-auto w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-xs font-bold text-xs ${
                        idx % 3 === 0 ? 'bg-[#008BE3]/10 text-[#008BE3]' :
                        idx % 3 === 1 ? 'bg-[#84CC16]/10 text-[#73B412]' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {(currentPage - 1) * itemsPerPage + idx + 1}
                      </div>
                    </td>
                    {/* Column 2: Skema Sertifikasi */}
                    <td className="px-6 py-4 min-w-87.5 max-w-125">
                      <div className="flex items-center gap-4 text-xs md:text-sm font-semibold text-[#008BE3]">
                        <span className="line-clamp-2 leading-tight">{item.skemaSertifikasi}</span>
                      </div>
                    </td>
                    
                    {/* Column 3: TUK */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        item.tuk.includes('Sewaktu') ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        item.tuk.includes('Tempat Kerja') ? 'bg-purple-50 text-purple-700 border-purple-200' :
                        item.tuk.includes('Virtual') || item.tuk.includes('Online') ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        'bg-orange-50 text-orange-700 border-orange-200'
                      }`}>
                        {item.tuk}
                      </span>
                    </td>
                    
                    {/* Column 4: Metode Pelaksanaan */}
                    <td className="px-6 py-4 text-xs md:text-sm whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold text-xs border ${
                        item.metodePelaksanaan === 'Online'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-stone-50 text-stone-700 border-stone-200'
                      }`}>
                        {item.metodePelaksanaan === 'Online' ? 'Online (Virtual)' : 'Offline (Luring)'}
                      </span>
                    </td>
                    {/* Column 6: Nomor Sertifikat */}
                    <td className="px-6 py-4 text-xs md:text-sm whitespace-nowrap">
                      {item.noSertifikat !== '-' ? (
                        <span className="font-mono text-[#008BE3] font-semibold bg-[#008BE3]/5 px-2 py-1 rounded">{item.noSertifikat}</span>
                      ) : (
                        <span className="text-gray-400 font-semibold">-</span>
                      )}
                    </td>
                    
                    {/* Column 7: Tanggal Berlaku */}
                    <td className="px-6 py-4 text-xs md:text-sm whitespace-nowrap font-medium text-slate-700">
                      {item.tanggalBerlaku !== '-' ? item.tanggalBerlaku : <span className="text-gray-400 font-semibold">-</span>}
                    </td>

                    {/* Column 8: Status */}
                    <td className="px-6 py-4 text-xs md:text-sm whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        item.rekomendasi === 'Kompeten' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                        item.rekomendasi === 'Belum Kompeten' ? 'bg-red-50 text-red-700 border-red-200' :
                        'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        {item.rekomendasi === 'Kompeten' ? <CheckCircle size={12} /> : item.rekomendasi === 'Belum Kompeten' ? <AlertTriangle size={12} /> : <Clock size={12} />}
                        {item.rekomendasi}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 text-center whitespace-nowrap sticky right-0 bg-white group-hover/row:bg-[#F9FAFC] z-10 border-l border-gray-100 shadow-[-6px_0_15px_-4px_rgba(0,0,0,0.06)]">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelectedAssessment(item)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-50 hover:text-[#008BE3] hover:border-[#008BE3]/30 transition-all shadow-2xs"
                        >
                          <Eye size={14} />
                          Detail
                        </button>
                        {item.statusAsesmen === 'Selesai' && item.rekomendasi === 'Kompeten' && item.noSertifikat !== '-' && item.noSertifikat !== 'Menunggu Terbit' && (
                          <button
                            onClick={() => setCertificatePreview(item)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#008BE3] border border-[#008BE3] text-white rounded-lg text-xs font-bold hover:bg-[#007AC9] transition-all shadow-2xs"
                          >
                            <Download size={14} />
                            Unduh Sertifikat
                          </button>
                        )}
                        {item.statusAsesmen === 'Selesai' && item.rekomendasi === 'Belum Kompeten' && (
                          <button
                            onClick={() => {
                              setSelectedAssessment(item);
                              setIsBandingFormOpen(true);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 border border-rose-200 text-rose-600 rounded-lg text-xs font-bold hover:bg-rose-100 hover:text-rose-700 transition-all shadow-2xs"
                          >
                            <Scale size={14} />
                            Ajukan Banding
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-xs md:text-sm text-gray-400 font-medium">
                    Tidak ada riwayat asesmen yang cocok.
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
              Menampilkan <span className="font-semibold text-slate-700">{(currentPage - 1) * itemsPerPage + 1}</span> hingga <span className="font-semibold text-slate-700">{Math.min(currentPage * itemsPerPage, filteredHistory.length)}</span> dari <span className="font-semibold text-slate-700">{filteredHistory.length}</span> entri
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

    
      {/* Detail Asesmen Modal */}
      {selectedAssessment && !isBandingFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-black text-slate-800 text-lg">Detail Asesmen</h3>
              <button 
                onClick={() => setSelectedAssessment(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-5 space-y-4 font-medium text-sm">
              <div className="grid grid-cols-3 gap-2">
                <span className="text-slate-500 font-semibold">Skema Sertifikasi</span>
                <span className="col-span-2 font-bold text-slate-900">{selectedAssessment.skemaSertifikasi}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-slate-500 font-semibold">Asesmen</span>
                <span className="col-span-2 font-bold text-slate-900">{selectedAssessment.asesmen}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-slate-500 font-semibold">TUK</span>
                <span className="col-span-2 font-bold text-slate-900">{selectedAssessment.tuk}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-slate-500 font-semibold">Metode</span>
                <span className="col-span-2 text-slate-900">{selectedAssessment.metodePelaksanaan === 'Online' ? 'Online (Virtual)' : 'Offline (Luring)'}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-slate-500 font-semibold">Jenis Bukti</span>
                <span className="col-span-2 text-slate-900">{selectedAssessment.jenisBukti}</span>
              </div>              <div className="grid grid-cols-3 gap-2 items-center">
                <span className="text-slate-500 font-semibold">Status</span>
                <span className="col-span-2">{getStatusBadge(selectedAssessment.statusAsesmen)}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 items-center">
                <span className="text-slate-500 font-semibold">Rekomendasi</span>
                <span className="col-span-2">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                    selectedAssessment.rekomendasi === 'Kompeten' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                    selectedAssessment.rekomendasi === 'Belum Kompeten' ? 'bg-red-50 text-red-700 border-red-200' :
                    'bg-slate-100 text-slate-600 border-slate-200'
                  }`}>
                    {selectedAssessment.rekomendasi === 'Kompeten' ? <CheckCircle size={12} /> : selectedAssessment.rekomendasi === 'Belum Kompeten' ? <AlertTriangle size={12} /> : <Clock size={12} />}
                    {selectedAssessment.rekomendasi}
                  </span>
                </span>
              </div>
              {selectedAssessment.noSertifikat !== '-' && (
                <>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-slate-500 font-semibold">No. Sertifikat</span>
                    <span className="col-span-2 text-slate-900">{selectedAssessment.noSertifikat}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-slate-500 font-semibold">Tanggal Berlaku</span>
                    <span className="col-span-2 text-slate-900">{selectedAssessment.tanggalBerlaku}</span>
                  </div>
                </>
              )}
            </div>
            {selectedAssessment.rekomendasi === 'Belum Kompeten' && (() => {
              let diffDays = 0;
              if (selectedAssessment.tanggalPenilaian && selectedAssessment.tanggalPenilaian !== '-') {
                const parts = selectedAssessment.tanggalPenilaian.split('/');
                if (parts.length === 3) {
                   const asDate = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
                   const diffTime = Math.abs(new Date().getTime() - asDate.getTime());
                   diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
                }
              }
              if (diffDays <= 2) {
                return (
                  <div className="p-5 border-t border-slate-100 bg-red-50">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                      <div className="text-xs text-red-700 font-medium">
                        Anda mendapat hasil <span className="font-bold">Belum Kompeten</span>. 
                        Anda dapat mengajukan banding maksimal 2x24 jam sejak penilaian.
                      </div>
                      <button 
                        onClick={() => setIsBandingFormOpen(true)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold whitespace-nowrap shadow-xs transition-colors shrink-0"
                      >
                        Ajukan Banding
                      </button>
                    </div>
                  </div>
                );
              }
              return null;
            })()}
          </div>
        </div>
      )}

      {/* Certificate Preview Modal */}
      {certificatePreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-black text-slate-800 text-lg">Pratinjau Sertifikat</h3>
              <button 
                onClick={() => setCertificatePreview(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors"
              >
                X
              </button>
            </div>
            <div className="p-8 space-y-4 flex flex-col items-center justify-center bg-slate-50 relative">
              <div className="w-full max-w-md aspect-[1.414] bg-white border-8 border-slate-100 rounded-sm shadow-md p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute inset-0 border-2 border-[#008BE3]/10 m-2"></div>
                <Award size={48} className="text-[#008BE3] mb-4" />
                <h2 className="text-xl font-black text-slate-800 tracking-widest uppercase">Sertifikat Kompetensi</h2>
                <p className="text-xs text-slate-500 font-medium mt-1">Diberikan kepada</p>
                <h3 className="text-lg font-bold text-slate-900 mt-2 mb-2">{user?.name || 'Peserta'}</h3>
                <p className="text-[10px] text-slate-500 max-w-[80%]">Telah dinyatakan KOMPETEN dalam bidang <span className="font-bold text-slate-700">{certificatePreview.skemaSertifikasi}</span></p>
                <div className="mt-6 flex justify-between w-full px-4 items-end">
                  <div className="text-left">
                    <p className="text-[8px] font-bold text-slate-400">No. Sertifikat</p>
                    <p className="text-[10px] font-semibold text-slate-800">{certificatePreview.noSertifikat}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] font-bold text-slate-400">Berlaku Hingga</p>
                    <p className="text-[10px] font-semibold text-slate-800">{certificatePreview.tanggalBerlaku}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-5 border-t border-slate-100 flex justify-end gap-3 bg-white">
              <button
                onClick={() => setCertificatePreview(null)}
                className="px-4 py-2 font-bold text-sm text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  alert(`Mengunduh Sertifikat Resmi:\nNo: ${certificatePreview.noSertifikat}\nSkema: ${certificatePreview.skemaSertifikasi}`);
                  setCertificatePreview(null);
                }}
                className="px-4 py-2 font-bold text-sm text-white bg-[#008BE3] hover:bg-[#007AC9] rounded-lg shadow-xs transition-colors flex items-center gap-2"
              >
                <Download size={16} /> Unduh Sertifikat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}