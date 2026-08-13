'use client';

import React, { useState, ReactNode } from 'react';
import {
  Trash2, FileText, Plus, Search, Calendar, ArrowLeft, ArrowRight, 
  Upload, BadgeCheck, CheckCircle, AlertTriangle, Download, X
} from 'lucide-react';

// 1. Path Import disesuaikan dengan struktur folder barumu
import { FormDocumentTable } from '@/components/forms/asesi/FormDocumentTable';
import { FormKompetensiTable } from '@/components/forms/asesi/FormKompetensiTable';
import { EFormApl01 } from '@/components/forms/asesi/FormFRAPL01'; 
import { EFormApl02 } from '@/components/forms/asesi/FormFRAPL02';
import { AVAILABLE_SCHEMES } from '@/data/schemes'; 
import { useAppContext } from '@/context/context';

interface SchemeRequirement {
  name: string;
}

type SchemeRequirementItem = string | SchemeRequirement;

interface SchemeUnit {
  code: string;
  title: string;
  elemen?: {
    title: string;
    kuk: string[];
  }[];
}

interface Scheme {
  name?: string;
  code?: string;
  units?: SchemeUnit[];
  persyaratanDasar?: SchemeRequirementItem[];
  buktiAdministratif?: SchemeRequirementItem[];
  [key: string]: string | string[] | SchemeRequirementItem[] | SchemeUnit[] | undefined;
}

const getPendidikanOptions = (scheme: Scheme | null): string[] => {
  const allOptions = ['SMA', 'D3', 'S1', 'S2', 'S3'];
  if (!scheme) return allOptions;

  let minLevelIndex = 0; // SMA
  const reqString = JSON.stringify(scheme.persyaratanDasar || []).toLowerCase();

  if (reqString.includes('s-2') || reqString.includes('s2') || reqString.includes('strata 2')) {
    if (reqString.includes('ijazah strata 2') || reqString.includes('ijazah s2')) {
       minLevelIndex = 3; // S2
    } else {
       minLevelIndex = 2; // S1
    }
  } else if (reqString.includes('s1') || reqString.includes('s-1') || reqString.includes('strata 1')) {
    minLevelIndex = 2; // S1
  } else if (reqString.includes('d3') || reqString.includes('diploma 3')) {
    minLevelIndex = 1; // D3
  }

  return allOptions.slice(minLevelIndex);
};

interface Submission {
  noHp?: string;
  telepon?: string;
  units?: { code: string; title: string }[];
  penyesuaianWajar?: boolean;
  id: string;
  name: string;
  code: string;
  date: string;
  status: string;
  namaLengkap?: string;
  tempatLahir?: string;
  tanggalLahir?: string;
  jenisKelamin?: string;
  alamat?: string;
  alamatWilayah?: string;
  nik?: string;
  kebangsaan?: string;
  kodePos?: string;
  noTelp?: string;
  pendidikanTerakhir?: string;
  pekerjaan?: string;
  institusiPerusahaan?: string;
  jabatan?: string;
  emailInstitusi?: string;
  kodePosInstitusi?: string;
  alamatInstitusi?: string;
  telpInstitusi?: string;
  faxInstitusi?: string;
  tuk?: string;
  berpengalaman?: boolean;
}

// 2. Wajib menggunakan 'export default' untuk page.tsx di Next.js
export default function PengajuanSkemaPage() {
  const { user, setExtraCrumbs } = useAppContext();
  
  // Navigation states
  const [subView, setSubView] = useState<'list' | 'choose-scheme' | 'apply-form'>('list');
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);

  const [showExitWarning, setShowExitWarning] = useState(false);
  const [exitDestination, setExitDestination] = useState<'list' | 'choose-scheme' | null>(null);

  const handleExitRequest = React.useCallback((destination: 'list' | 'choose-scheme') => {
    if (subView === 'apply-form') {
      setExitDestination(destination);
      setShowExitWarning(true);
    } else {
      setSubView(destination);
    }
  }, [subView]);

  React.useEffect(() => {
    const handleReset = () => setSubView('list');
    window.addEventListener('reset-eform', handleReset);
    return () => {
      window.removeEventListener('reset-eform', handleReset);
      setExtraCrumbs([]); // clear on unmount
    };
  }, [setExtraCrumbs]);

  React.useEffect(() => {
    if (subView === 'list') {
      setExtraCrumbs([]);
    } else if (subView === 'choose-scheme') {
      setExtraCrumbs([
        { label: 'Daftar Skema', path: '#' }
      ]);
    } else if (subView === 'apply-form') {
      setExtraCrumbs([
        { label: 'Daftar Skema', path: '#' },
        { label: 'Ajukan Skema' }
      ]);
    }
  }, [subView, setExtraCrumbs, handleExitRequest]);
  const [step, setStep] = useState(1);
  interface ActiveModalDoc {
    isEForm?: boolean;
    isPreview?: boolean;
    name?: string;
    [key: string]: unknown;
  }

  const [activeModalDoc, setActiveModalDoc] = useState<ActiveModalDoc | null>(null);
  const [tempFiles, setTempFiles] = useState<File[]>([]);
  const [eFormData, setEFormData] = useState<Record<string, unknown>>({});
  const [tempEFormData, setTempEFormData] = useState<Record<string, unknown>>({});
  const [alertMsg, setAlertMsg] = useState('');
  const showAlert = (msg: string) => {
    setAlertMsg(msg);
    setTimeout(() => setAlertMsg(''), 3000);
  };

  React.useEffect(() => {
    if (activeModalDoc && !activeModalDoc.isEForm && !activeModalDoc.isPreview) {
      const key = typeof activeModalDoc.name === 'string' ? activeModalDoc.name : undefined;
      setTempFiles((key ? (eFormData[key] as File[]) : []) || []);
    }
  }, [activeModalDoc, eFormData]);
  const [expandedSchemes, setExpandedSchemes] = useState<string[]>([]);

  const [submissions, setSubmissions] = useState<Submission[]>(() => {
    // Tambahkan pengecekan window ini
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('lsp_submissions');
      if (saved) {
        const parsed = JSON.parse(saved) as Submission[];
        const filtered = parsed.filter((p: Submission) => p.name !== 'Pelayanan Pelanggan');
        if (filtered.length !== parsed.length) {
          localStorage.setItem('lsp_submissions', JSON.stringify(filtered));
          return filtered;
        }
        return parsed;
      }
    }
    return [];
  });
  // Selected submission to show in details modal
  const [selectedDetailSubmission, setSelectedDetailSubmission] = useState<Submission | null>(null);

  // Filters for Submissions List (View 1)
  const [searchSub, setSearchSub] = useState('');
  const [statusSubFilter, setStatusSubFilter] = useState('Semua');
  const [dateSubFilter, setDateSubFilter] = useState('');
  const [subPage, setSubPage] = useState(1);

  // Filters for Available Schemes List (View 2)
  const [searchScheme, setSearchScheme] = useState('');
  const [schemePage, setSchemePage] = useState(1);

  // Form Fields (View 3: Data Pribadi Step 1)
  const [namaLengkap, setNamaLengkap] = useState(user?.name || 'Ahmad Fauzi');
  const [tempatLahir, setTempatLahir] = useState('');
  const [tanggalLahir, setTanggalLahir] = useState('2005-07-31');
  const [jenisKelamin, setJenisKelamin] = useState('Perempuan');
  const [alamat, setAlamat] = useState('');
  const [alamatWilayah, setAlamatWilayah] = useState('CILEUNYI KULON - CILEUNYI - KABUPATEN BANDUNG - JAWA BARAT');
  const [nik, setNik] = useState('');
  const [kebangsaan, setKebangsaan] = useState('WNI');
  const [kodePos, setKodePos] = useState('');
  const [noTelp, setNoTelp] = useState('081234567890');

  // Detail Pendidikan states
  const [pendidikanTerakhir, setPendidikanTerakhir] = useState('SMA');

  // Detail Pekerjaan states
  const [pekerjaan, setPekerjaan] = useState('Pelajar/Mahasiswa');
  const [institusiPerusahaan, setInstitusiPerusahaan] = useState('PNS');
  const [jabatan, setJabatan] = useState('PNS');
  const [emailInstitusi, setEmailInstitusi] = useState('karimaulya13@gmail.com');
  const [kodePosInstitusi, setKodePosInstitusi] = useState('');
  const [alamatInstitusi, setAlamatInstitusi] = useState('Komp. Taman Cileunyi Blok W No 9 RT 03/22, Cileunyi Kulon, Kec. Cileunyi, Kab. Bandung');
  const [telpInstitusi, setTelpInstitusi] = useState('087736454535');
  const [faxInstitusi, setFaxInstitusi] = useState('');

  // Lainnya states
  const [tuk, setTuk] = useState('');
  
  const [berpengalaman, setBerpengalaman] = useState(false);
  const [penyesuaianWajar, setPenyesuaianWajar] = useState(false);

  interface Step1Errors {
    tempatLahir: boolean;
    alamat: boolean;
    nik: boolean;
    kodePos: boolean;
    tuk: boolean;
  }

  // Step 1 Validation Errors
  const [errors, setErrors] = useState<Step1Errors>({
    tempatLahir: false,
    alamat: false,
    nik: false,
    kodePos: false,
    tuk: false,
  });

  const [showStep2Errors, setShowStep2Errors] = useState(false);
  const [showStep3Errors, setShowStep3Errors] = useState(false);

  const handleNext = () => {
    const scrollToTopMobile = () => {
      if (window.innerWidth < 1024) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    if (step === 1) {
      const newErrors: Step1Errors = {
        tempatLahir: tempatLahir.trim() === '',
        alamat: alamat.trim() === '',
        nik: nik.trim() === '',
        kodePos: kodePos.trim() === '',
        tuk: tuk === '',
      };
      setErrors(newErrors);
  
      if (!newErrors.tempatLahir && !newErrors.alamat && !newErrors.nik && !newErrors.kodePos && !newErrors.tuk) {
        setStep(2);
        scrollToTopMobile();
      }
    } else if (step === 2) {
      const reqs = selectedScheme?.persyaratanDasar || [];
      const valid = reqs.every((req: SchemeRequirementItem) => {
        const key = typeof req === 'string' ? req : req.name;
        return Boolean(eFormData[key]);
      });
      if (!valid) {
        setShowStep2Errors(true);
      } else {
        setShowStep2Errors(false);
        setStep(3);
        scrollToTopMobile();
      }
    } else if (step === 3) {
      const reqs = selectedScheme?.buktiAdministratif || [];
      const valid = reqs.every((req: SchemeRequirementItem) => {
        const key = typeof req === 'string' ? req : req.name;
        return Boolean(eFormData[key]);
      });
      if (!valid) {
        setShowStep3Errors(true);
      } else {
        setShowStep3Errors(false);
        setStep(4);
        scrollToTopMobile();
      }
    } else if (step === 5) {
      handleSubmitForm();
    } else {
      setStep(step + 1);
      scrollToTopMobile();
    }
  };

  const handleSubmitForm = () => {
    const newSubmission: Submission = {
      id: String(submissions.length + 1),
      name: selectedScheme?.name || 'Uji Kompetensi Mandiri',
      code: selectedScheme?.code || '001/SKM/LSP-KJN/II/2023',
      date: new Date().toLocaleDateString('en-GB'),
      status: 'Menunggu Persetujuan',
      namaLengkap,
      tempatLahir,
      tanggalLahir,
      jenisKelamin,
      alamat,
      alamatWilayah,
      nik,
      kebangsaan,
      kodePos,
      noTelp,
      pendidikanTerakhir,
      pekerjaan,
      institusiPerusahaan,
      jabatan,
      emailInstitusi,
      kodePosInstitusi,
      alamatInstitusi,
      telpInstitusi,
      faxInstitusi,
      tuk: tuk || 'Mandiri',
      penyesuaianWajar,
      berpengalaman
    };
    
    const updated = [newSubmission, ...submissions];
    setSubmissions(updated);
    localStorage.setItem('lsp_submissions', JSON.stringify(updated));
    
    // Reset Form Fields
    setTempatLahir('');
    setAlamat('');
    setNik('');
    setKodePos('');
    setTuk('');
    
    setBerpengalaman(false);
    setStep(1);
    
    showAlert(`Pengajuan Skema ${newSubmission.name} Berhasil Diajukan!`);
    setSubView('list');
  };

  // Pagination and Filtering calculations
  const filteredSubmissions = submissions.filter((item) => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchSub.toLowerCase()) || 
      item.code.toLowerCase().includes(searchSub.toLowerCase());
    const matchesStatus = statusSubFilter === 'Semua' || item.status === statusSubFilter;
    const matchesDate = !dateSubFilter || (() => {
      // Input date is YYYY-MM-DD
      const [year, month, day] = dateSubFilter.split('-');
      const formattedFilter = `${day}/${month}/${year}`;
      return item.date === formattedFilter || item.date === `${day}-${month}-${year}`; // Support legacy local storage
    })();
    return matchesSearch && matchesStatus && matchesDate;
  });

  const formatTanggal = (tanggal: string) => {
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

  const filteredSchemes = (AVAILABLE_SCHEMES as Scheme[]).filter((item) => {
    const name = item.name?.toLowerCase() ?? '';
    const code = item.code?.toLowerCase() ?? '';
    return name.includes(searchScheme.toLowerCase()) || code.includes(searchScheme.toLowerCase());
  });

  const [itemsPerPage, setItemsPerPage] = useState(5);
  const paginatedSubmissions = filteredSubmissions.slice((subPage - 1) * itemsPerPage, subPage * itemsPerPage);
  const paginatedSchemes = filteredSchemes.slice((schemePage - 1) * itemsPerPage, schemePage * itemsPerPage);

  const totalSubPages = Math.ceil(filteredSubmissions.length / itemsPerPage) || 1;
  const totalSchemePages = Math.ceil(filteredSchemes.length / itemsPerPage) || 1;

  // View 1: List View
  if (subView === 'list') {
    return (
      <>
      {alertMsg && <div className="fixed top-4 right-4 bg-slate-900 text-white p-4 rounded-lg shadow-2xl z-9999 font-medium text-sm max-w-sm animate-in fade-in slide-in-from-top-4">{alertMsg}</div>}
      <div className="w-full space-y-6 pb-12 text-sm text-gray-700">
        {/* Header Block matching mockup */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
           <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-[#008BE3]/10 flex items-center justify-center text-[#008BE3] border border-[#008BE3]/20 shadow-xs shrink-0">
              <FileText size={20} className="stroke-[2.5]" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none mb-1 md:whitespace-nowrap">
                Pengajuan Skema
              </h2>
              <p className="text-xs text-gray-400 font-bold tracking-wider uppercase leading-4 md:whitespace-nowrap">
                Daftar permohonan sertifikasi skema Anda
              </p>
              
            </div>
          </div>
          <button
            onClick={() => {
              setSubView('choose-scheme');
              setSchemePage(1);
              setSearchScheme('');
            }}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#008BE3] hover:bg-[#0076C2] text-white rounded-lg text-xs md:text-sm font-extrabold shadow-md hover:shadow-lg transition-all shrink-0"
          >
            <Plus size={16} className="stroke-3" />
            <span>Ajukan Skema</span>
          </button>
        </div>

        {/* Table representation matching other pages */}
        <section className="bg-white rounded-lg shadow-xs border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="min-w-0">
              <h3 className="text-base font-black text-slate-900">Daftar Permohonan Sertifikasi</h3>
            </div>
            
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 w-full lg:w-auto ml-auto">
              {/* Search Input */}
              <div className="flex items-center gap-2 bg-gray-50/80 rounded-lg px-3 h-10.5 w-full sm:w-68 border border-gray-200/50 focus-within:border-[#008BE3]/40 transition-colors">
                <Search className="text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Cari Skema Sertifikasi..."
                  value={searchSub}
                  onChange={(e) => {
                    setSearchSub(e.target.value);
                    setSubPage(1); setSchemePage(1);
                  }}
                  className="bg-transparent border-none focus:ring-0 text-[14px] w-full outline-none text-gray-700 placeholder-gray-400 font-semibold"
                />
              </div>

              {/* Status Select Filter */}
              <select
                value={statusSubFilter}
                onChange={(e) => {
                  setStatusSubFilter(e.target.value);
                  setSubPage(1); setSchemePage(1);
                }}
                className="bg-gray-50 border border-gray-200/50 text-[14px] rounded-lg px-3 h-10.5 outline-none text-gray-700 cursor-pointer font-bold"
              >
                <option value="Semua">Semua Status</option>
                <option value="Menunggu Persetujuan">Menunggu Persetujuan</option>
                <option value="Disetujui">Disetujui</option>
                <option value="Ditolak">Ditolak</option>
              </select>

              {/* Date Input/Filter */}
              <div className="flex items-center gap-2 bg-gray-50/80 rounded-lg px-3 h-10.5 w-full sm:w-56 border border-gray-200/50 focus-within:border-[#008BE3]/40 transition-colors">
                
                <input
                  type="date"
                  value={dateSubFilter}
                  onChange={(e) => {
                    setDateSubFilter(e.target.value);
                    setSubPage(1); setSchemePage(1);
                  }}
                  className="bg-transparent border-none focus:ring-0 text-xs md:text-sm w-full outline-none text-gray-700 font-semibold"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto relative ">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0F172A] border-b border-[#0F172A]">
                  <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-left whitespace-nowrap w-16 sticky top-0 z-20 bg-[#0F172A]">No</th>
                  <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-left whitespace-nowrap min-w-87.5 max-w-125 sticky top-0 z-20 bg-[#0F172A]">Skema Sertifikasi</th>
                  <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-left whitespace-nowrap min-w-45 sticky top-0 z-20 bg-[#0F172A]">Tanggal Pengajuan</th>
                  <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-left whitespace-nowrap sticky top-0 z-20 bg-[#0F172A]">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-left whitespace-nowrap w-44 sticky right-0 bg-[#0F172A] shadow-[-6px_0_15px_-4px_rgba(0,0,0,0.06)] backdrop-blur-xs z-30 border-l border-white/10 top-0">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/60 font-medium">
                {paginatedSubmissions.length > 0 ? (
                  paginatedSubmissions.map((item, idx) => (
                    <tr key={item.id} className="group/row hover:bg-[#F9FAFC] transition-colors">
                      <td className="px-6 py-4 text-xs md:text-sm font-semibold text-slate-700 w-16">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-xs font-bold text-xs ${
                          idx % 3 === 0 ? 'bg-[#008BE3]/10 text-[#008BE3]' :
                          idx % 3 === 1 ? 'bg-[#84CC16]/10 text-[#73B412]' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {idx + 1}
                        </div>
                      </td>
                      {/* Column 1: Skema Sertifikasi with colorful mockup-themed icon box */}
                      <td className="px-6 py-4 min-w-87.5 max-w-125">
                        <div className="flex items-center gap-4 text-xs md:text-sm font-bold text-gray-900">
                          <div className="min-w-0">
                            <div className="font-bold text-[#008BE3] text-sm line-clamp-2 leading-tight">{item.name}</div>
                            <div className="text-[10px] text-gray-400 font-mono mt-0.5 truncate">{item.code}</div>
                          </div>
                        </div>
                      </td>
                      
                      {/* Column 2: Tanggal Pengajuan */}
                      <td className="px-6 py-4 text-xs md:text-sm text-gray-600 font-medium">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar size={14} className="text-gray-400" />
                          {formatTanggal(item.date)}
                        </span>
                      </td>
                      
                      {/* Column 3: Status Badge */}
                      <td className="px-6 py-4 text-xs md:text-sm whitespace-nowrap">
                        {item.status === 'Disetujui' ? (
                          <span className="inline-flex items-center gap-1.5 text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full text-[10px] uppercase tracking-wider font-bold">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                            Disetujui
                          </span>
                        ) : item.status === 'Ditolak' ? (
                          <span className="inline-flex items-center gap-1.5 text-red-700 bg-red-50 border border-red-200 px-3 py-1.5 rounded-full text-[10px] uppercase tracking-wider font-bold">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                            Ditolak
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full text-[10px] uppercase tracking-wider font-bold">
                            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>
                            {item.status}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center sticky right-0 bg-white z-10 border-l border-gray-100 shadow-[-6px_0_15px_-4px_rgba(0,0,0,0.06)] group-hover/row:bg-[#F9FAFC] transition-colors whitespace-nowrap">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setSelectedDetailSubmission(item); }}
                          className="bg-white hover:bg-slate-50 text-[#008BE3] border border-[#008BE3]/30 px-3 py-1.5 rounded-md text-xs font-bold transition-colors"
                        >
                          Detail
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500 font-medium">
                      Belum ada permohonan sertifikasi.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 font-medium bg-gray-50/50">
            <div className="min-w-0">
              Menampilkan {submissions.length > 0 ? (subPage - 1) * itemsPerPage + 1 : 0} - {Math.min(subPage * itemsPerPage, submissions.length)} dari {submissions.length} permohonan
            </div>
            <div className="flex gap-2">
              <button 
                disabled={subPage === 1}
                onClick={() => setSubPage(p => Math.max(1, p - 1))}
                className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Sebelumnya
              </button>
              <div className="hidden items-center gap-1 sm:flex">
                {Array.from({ length: totalSubPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setSubPage(page)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium transition-colors ${
                      subPage === page
                        ? 'bg-[#008BE3] text-white border border-[#008BE3]'
                        : 'text-slate-700 bg-white border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button 
                disabled={subPage === totalSubPages}
                onClick={() => setSubPage(p => Math.min(totalSubPages, p + 1))}
                className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        </section>

        {/* Beautiful Detail Modal Popup */}
        {selectedDetailSubmission && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-100 p-4 md:p-8 pb-24 w-full">
            <div className="max-w-200 mx-auto animate-in fade-in zoom-in-95 duration-200">
              <div className="mb-4">
                <button 
                  onClick={() => setSelectedDetailSubmission(null)}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-[#008BE3] bg-[#008BE3]/10 hover:bg-[#008BE3]/20 transition-colors cursor-pointer shrink-0 mb-4 mt-0.5"
                  title="Kembali ke Daftar Pengajuan"
                >
                  <ArrowLeft size={18} />
                </button>
              </div>

              <div className="max-w-200 mx-auto bg-white shadow-xl min-h-280.75 relative mb-8 text-slate-800 text-sm flex flex-col">
                
                {/* Modal Header */}
                <div className="p-8 md:p-12 border-b-2 border-slate-800 flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div className="min-w-0">
                      <h1 className="font-serif text-xl font-bold text-slate-900">DETAIL PENGAJUAN</h1>
                      <h2 className="font-serif text-lg font-bold text-slate-800 uppercase">{selectedDetailSubmission.name}</h2>
                    </div>
                    <div className="text-right">
                      <div className="font-serif text-2xl font-bold tracking-tighter text-slate-900">LSP</div>
                      <div className="text-xs text-slate-500 font-sans">Lembaga Sertifikasi Profesi</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 mt-4">
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Status:</span>
                    {selectedDetailSubmission.status === 'Disetujui' ? (
                      <span className="inline-flex items-center gap-1.5 text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full text-xs uppercase tracking-wider font-bold">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        {selectedDetailSubmission.status}
                      </span>
                    ) : selectedDetailSubmission.status === 'Ditolak' ? (
                      <span className="inline-flex items-center gap-1.5 text-red-700 bg-red-50 border border-red-200 px-3 py-1.5 rounded-full text-xs uppercase tracking-wider font-bold">
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        {selectedDetailSubmission.status}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full text-xs uppercase tracking-wider font-bold">
                        <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
                        {selectedDetailSubmission.status}
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Modal Content - Scrollable */}
                <div className="p-8 md:p-12 overflow-y-auto space-y-8 flex-1">
                  
                  {/* Row 1: Data Pribadi */}
                  <div className="min-w-0">
                    <h4 className="font-bold text-sm mb-4 uppercase tracking-wider border-b border-slate-300 pb-2">Data Pribadi & Kontak</h4>
                    
                    <table className="w-full border-collapse border border-slate-300 text-sm">
                      <tbody>
                        <tr>
                          <td className="border border-slate-300 p-2 bg-slate-50 font-semibold w-1/3">Nama Lengkap</td>
                          <td className="border border-slate-300 p-2 font-bold">{selectedDetailSubmission.namaLengkap || '-'}</td>
                        </tr>
                        <tr>
                          <td className="border border-slate-300 p-2 bg-slate-50 font-semibold">NIK</td>
                          <td className="border border-slate-300 p-2">{selectedDetailSubmission.nik || '-'}</td>
                        </tr>
                        <tr>
                          <td className="border border-slate-300 p-2 bg-slate-50 font-semibold">Tempat, Tanggal Lahir</td>
                          <td className="border border-slate-300 p-2">{selectedDetailSubmission.tempatLahir ? `${selectedDetailSubmission.tempatLahir}, ${selectedDetailSubmission.tanggalLahir ? formatTanggal(selectedDetailSubmission.tanggalLahir) : '-'}` : '-'}</td>
                        </tr>
                        <tr>
                          <td className="border border-slate-300 p-2 bg-slate-50 font-semibold">Jenis Kelamin</td>
                          <td className="border border-slate-300 p-2">{selectedDetailSubmission.jenisKelamin || '-'}</td>
                        </tr>
                        <tr>
                          <td className="border border-slate-300 p-2 bg-slate-50 font-semibold">Alamat Wilayah</td>
                          <td className="border border-slate-300 p-2">{selectedDetailSubmission.alamatWilayah || '-'}</td>
                        </tr>
                        <tr>
                          <td className="border border-slate-300 p-2 bg-slate-50 font-semibold">Kontak</td>
                          <td className="border border-slate-300 p-2">
                            {selectedDetailSubmission.noHp ? `HP: ${selectedDetailSubmission.noHp}` : ''} 
                            {selectedDetailSubmission.telepon ? ` | Telp: ${selectedDetailSubmission.telepon}` : ''}
                            {!selectedDetailSubmission.noHp && !selectedDetailSubmission.telepon ? '-' : ''}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Row 2: Pekerjaan */}
                  <div className="min-w-0">
                    <h4 className="font-bold text-sm mb-4 uppercase tracking-wider border-b border-slate-300 pb-2">Data Pekerjaan</h4>
                    
                    <table className="w-full border-collapse border border-slate-300 text-sm">
                      <tbody>
                        <tr>
                          <td className="border border-slate-300 p-2 bg-slate-50 font-semibold w-1/3">Institusi / Perusahaan</td>
                          <td className="border border-slate-300 p-2 font-bold">{selectedDetailSubmission.institusiPerusahaan || '-'}</td>
                        </tr>
                        <tr>
                          <td className="border border-slate-300 p-2 bg-slate-50 font-semibold">Jabatan</td>
                          <td className="border border-slate-300 p-2">{selectedDetailSubmission.jabatan || '-'}</td>
                        </tr>
                        <tr>
                          <td className="border border-slate-300 p-2 bg-slate-50 font-semibold">Alamat Institusi</td>
                          <td className="border border-slate-300 p-2">{selectedDetailSubmission.alamatInstitusi || '-'}</td>
                        </tr>
                        <tr>
                          <td className="border border-slate-300 p-2 bg-slate-50 font-semibold">Kontak Institusi</td>
                          <td className="border border-slate-300 p-2">
                            {selectedDetailSubmission.kodePosInstitusi ? `Pos: ${selectedDetailSubmission.kodePosInstitusi}` : ''} 
                            {selectedDetailSubmission.faxInstitusi ? ` | Fax: ${selectedDetailSubmission.faxInstitusi}` : ''}
                            {!selectedDetailSubmission.kodePosInstitusi && !selectedDetailSubmission.faxInstitusi ? '-' : ''}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Row 3: Detail Skema */}
                  <div className="min-w-0">
                    <h4 className="font-bold text-sm mb-4 uppercase tracking-wider border-b border-slate-300 pb-2">Detail Pelaksanaan Ujian</h4>
                    
                    <table className="w-full border-collapse border border-slate-300 text-sm">
                      <tbody>
                        <tr>
                          <td className="border border-slate-300 p-1.5 sm:p-2 bg-slate-50 font-semibold w-2/5 sm:w-1/3">Kode Skema</td>
                          <td className="border border-slate-300 p-1.5 sm:p-2 font-mono break-all">{selectedDetailSubmission.code}</td>
                        </tr>
                        <tr>
                          <td className="border border-slate-300 p-1.5 sm:p-2 bg-slate-50 font-semibold">Tanggal Pengajuan</td>
                          <td className="border border-slate-300 p-1.5 sm:p-2">{formatTanggal(selectedDetailSubmission.date)}</td>
                        </tr>
                        <tr>
                    <td className="border border-slate-300 p-1.5 sm:p-2 bg-slate-50 font-semibold">TUK</td>
                    <td className="border border-slate-300 p-1.5 sm:p-2">{selectedDetailSubmission.tuk || 'Mandiri (Online)'}</td>
                        </tr>
                        <tr>
                          <td className="border border-slate-300 p-1.5 sm:p-2 bg-slate-50 font-semibold">Penyesuaian Wajar</td>
                          <td className="border border-slate-300 p-1.5 sm:p-2">{selectedDetailSubmission.penyesuaianWajar ? 'Ya' : 'Tidak'}</td>
                        </tr>
                        <tr>
                          <td className="border border-slate-300 p-1.5 sm:p-2 bg-slate-50 font-semibold">Berpengalaman</td>
                          <td className="border border-slate-300 p-1.5 sm:p-2">
                            {selectedDetailSubmission.berpengalaman ? 'Ya' : 'Belum'}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Row 4: Lampiran Dokumen */}
                  <div className="min-w-0">
                    <h4 className="font-bold text-sm mb-4 uppercase tracking-wider border-b border-slate-300 pb-2">Lampiran Dokumen & Persyaratan</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <a 
                        href="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" target="_blank" rel="noopener noreferrer"
                        className="p-4 border border-slate-300 rounded-lg flex flex-col justify-between cursor-pointer hover:border-[#008BE3] hover:bg-slate-50 transition-all group"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded bg-[#008BE3]/10 text-[#008BE3] flex items-center justify-center font-bold shrink-0">
                            <BadgeCheck size={20} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-slate-800 mb-1 group-hover:text-[#008BE3] transition-colors">FR.APL.01 Permohonan Sertifikasi</p>
                            <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                              Lengkap
                            </span>
                          </div>
                        </div>
                      </a>

                      <a 
                        href="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" target="_blank" rel="noopener noreferrer"
                        className="p-4 border border-slate-300 rounded-lg flex flex-col justify-between cursor-pointer hover:border-[#008BE3] hover:bg-slate-50 transition-all group"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded bg-[#008BE3]/10 text-[#008BE3] flex items-center justify-center font-bold shrink-0">
                            <BadgeCheck size={20} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-slate-800 mb-1 group-hover:text-[#008BE3] transition-colors">FR.APL.02 Asesmen Mandiri</p>
                            <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                              Lengkap
                            </span>
                          </div>
                        </div>
                      </a>

                      <a 
                        href="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" target="_blank" rel="noopener noreferrer"
                        className="p-4 border border-slate-300 rounded-lg flex flex-col justify-between cursor-pointer hover:border-[#008BE3] hover:bg-slate-50 transition-all group"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded bg-[#008BE3]/10 text-[#008BE3] flex items-center justify-center font-bold shrink-0">
                            <FileText size={20} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-slate-800 mb-1 group-hover:text-[#008BE3] transition-colors">Fotocopy KTP</p>
                            <span className="text-[10px] font-black uppercase text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                              Terlampir
                            </span>
                          </div>
                        </div>
                      </a>

                      <a 
                        href="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" target="_blank" rel="noopener noreferrer"
                        className="p-4 border border-slate-300 rounded-lg flex flex-col justify-between cursor-pointer hover:border-[#008BE3] hover:bg-slate-50 transition-all group"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded bg-[#008BE3]/10 text-[#008BE3] flex items-center justify-center font-bold shrink-0">
                            <FileText size={20} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-slate-800 mb-1 group-hover:text-[#008BE3] transition-colors">Fotocopy Ijazah Terakhir</p>
                            <span className="text-[10px] font-black uppercase text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                              Terlampir
                            </span>
                          </div>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
                
                {/* Modal Footer */}
                <div className="p-6 md:p-8 border-t border-slate-300 bg-slate-50 flex justify-end gap-3 mt-auto">
                  <button
                    onClick={() => {
                      const printContent = `
                        NAMA SKEMA: ${selectedDetailSubmission.name}
                        KODE SKEMA: ${selectedDetailSubmission.code}
                        NAMA LENGKAP: ${selectedDetailSubmission.namaLengkap || '-'}
                        NIK: ${selectedDetailSubmission.nik || '-'}
                        TEMPAT/TGL LAHIR: ${selectedDetailSubmission.tempatLahir || '-'}, ${selectedDetailSubmission.tanggalLahir || '-'}
                        TUK: ${selectedDetailSubmission.tuk || 'Mandiri (Online)'}
                        STATUS: ${selectedDetailSubmission.status}
                      `;
                      showAlert(`Simulasi Cetak Bukti Pendaftaran:\n\n${printContent}`);
                    }}
                    className="bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-extrabold text-sm px-4 py-2.5 rounded-lg transition-all"
                  >
                    Cetak Bukti
                  </button>
                  <button
                    onClick={() => setSelectedDetailSubmission(null)}
                    className="bg-[#008BE3] hover:bg-[#0076C2] text-white font-extrabold text-sm px-5 py-2.5 rounded-lg transition-all shadow-xs"
                  >
                    Tutup Detail
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
</>
    );
  }
  // View 2: Choose Scheme View
  if (subView === 'choose-scheme') {
    return (
      <>
        {alertMsg && (
          <div className="fixed top-4 right-4 bg-slate-900 text-white p-4 rounded-lg shadow-2xl z-9999 font-medium text-sm max-w-sm animate-in fade-in slide-in-from-top-4">
            {alertMsg}
          </div>
        )}

        <div className="w-full space-y-6 pb-12 text-sm text-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setSubView('list')}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-[#008BE3] bg-[#008BE3]/10 hover:bg-[#008BE3]/20 transition-colors cursor-pointer shrink-0 mt-0.5"
                title="Kembali"
              >
                <ArrowLeft size={18} />
              </button>

              <div className="min-w-0">
                <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none mb-1 md:whitespace-nowrap">
                  Daftar Skema Sertifikasi
                </h2>
                <p className="text-xs text-gray-400 font-bold tracking-wider uppercase leading-4 md:whitespace-nowrap">
                  Pilih skema yang tersedia
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 w-full lg:w-auto ml-auto">
              <div className="flex items-center gap-2 bg-gray-50/80 rounded-lg px-3 h-10.5 w-full sm:w-68 border border-gray-200/50 focus-within:border-[#008BE3]/40 transition-colors">
                <Search className="text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Cari Skema Sertifikasi..."
                  value={searchScheme}
                  onChange={(e) => {
                    setSearchScheme(e.target.value);
                    setSchemePage(1);
                  }}
                  className="bg-transparent border-none focus:ring-0 text-[14px] w-full outline-none text-gray-700 placeholder-gray-400 font-semibold"
                />
              </div>
            </div>
          </div>

          <section className="bg-white rounded-lg shadow-xs border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto relative ">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#0F172A] border-b border-[#0F172A]">
                    <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-left whitespace-nowrap w-16 sticky top-0 z-20 bg-[#0F172A]">No</th>
                    <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-left whitespace-nowrap min-w-87.5 max-w-125 sticky top-0 z-20 bg-[#0F172A]">Skema Sertifikasi</th>
                    <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-left whitespace-nowrap sticky top-0 z-20 bg-[#0F172A]">Kode Skema</th>
                    <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-left whitespace-nowrap w-36 sticky right-0 bg-[#0F172A] shadow-[-6px_0_15px_-4px_rgba(0,0,0,0.06)] backdrop-blur-xs z-30 border-l border-white/10 top-0">Ajukan</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100/60 font-medium">
                  {paginatedSchemes.length > 0 ? (
                    paginatedSchemes.map((scheme, idx) => {
                      const schemeKey = scheme.code ?? `scheme-${idx}`;

                      return (
                        <React.Fragment key={schemeKey}>
                          <tr
                            className="hover:bg-[#F9FAFC] transition-colors cursor-pointer group/row"
                            onClick={() => {
                              setExpandedSchemes((prev) =>
                                prev.includes(schemeKey)
                                  ? prev.filter((c) => c !== schemeKey)
                                  : [...prev, schemeKey]
                              );
                            }}
                          >
                            <td className="px-6 py-4 text-xs md:text-sm font-semibold text-slate-700 w-16">
                              <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-xs font-bold text-xs ${
                                  idx % 3 === 0
                                    ? 'bg-[#008BE3]/10 text-[#008BE3]'
                                    : idx % 3 === 1
                                      ? 'bg-[#84CC16]/10 text-[#73B412]'
                                      : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                {idx + 1}
                              </div>
                            </td>

                            <td className="px-6 py-4 flex items-center gap-3 min-w-87.5 max-w-125">
                              <button
                                className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-[#008BE3] transition-colors shrink-0"
                              >
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className={`transition-transform duration-200 ${expandedSchemes.includes(schemeKey) ? 'rotate-90' : ''}`}
                                >
                                  <path d="M9 18l6-6-6-6" />
                                </svg>
                              </button>

                              <span className="font-bold text-[#008BE3] text-sm line-clamp-2 leading-tight">
                                {scheme.name}
                              </span>
                            </td>

                            <td className="px-6 py-4 text-gray-400 font-mono text-xs">{scheme.code}</td>

                            <td className="px-6 py-4 text-center sticky right-0 bg-white z-10 border-l border-gray-100 shadow-[-6px_0_15px_-4px_rgba(0,0,0,0.06)] group-hover/row:bg-[#F9FAFC] transition-colors whitespace-nowrap">
                              <button
                                onClick={() => {
                                  setSelectedScheme(scheme);
                                  setSubView('apply-form');
                                  setStep(1);
                                }}
                                className="bg-white hover:bg-sky-50 text-[#008BE3] border border-[#008BE3] px-5 py-1.5 rounded-lg text-xs font-extrabold transition-all"
                              >
                                Ajukan
                              </button>
                            </td>
                          </tr>

                          {expandedSchemes.includes(schemeKey) && (
                            <tr className="bg-slate-50/50 border-t border-b border-gray-100">
                              <td colSpan={4} className="px-6 py-4">
                                <div className="pl-10">
                                  <table className="w-full border-collapse text-xs text-slate-600 font-medium">
                                    <tbody>
                                      {(scheme.units ?? []).map((unit, unitIdx) => (
                                        <tr key={`${unit.code}-${unitIdx}`} className="border-b border-slate-100 last:border-0">
                                          <td className="py-2 font-mono text-slate-500">{unit.code}</td>
                                          <td className="py-2">{unit.title}</td>
                                        </tr>
                                      ))}

                                      {!scheme.units?.length && (
                                        <tr>
                                          <td colSpan={2} className="py-2 italic text-slate-400">Tidak ada unit.</td>
                                        </tr>
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-gray-400 font-medium">
                        Tidak ada skema sertifikasi yang ditemukan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-slate-200 flex flex-col sm:flex-row justify-end items-center gap-4 text-xs font-medium text-slate-500 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <button
                  disabled={schemePage === 1}
                  onClick={() => setSchemePage(schemePage - 1)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-50 transition-all font-bold text-slate-700"
                >
                  Sebelumnya
                </button>

                {Array.from({ length: totalSchemePages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSchemePage(idx + 1)}
                    className={`px-3.5 py-1.5 rounded-lg transition-all font-bold ${
                      schemePage === idx + 1
                        ? 'bg-[#008BE3] text-white'
                        : 'border border-slate-200 hover:bg-slate-100 text-slate-700 bg-white'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}

                <button
                  disabled={schemePage === totalSchemePages}
                  onClick={() => setSchemePage(schemePage + 1)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-50 transition-all font-bold text-slate-700"
                >
                  Selanjutnya
                </button>

                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setSubPage(1);
                    setSchemePage(1);
                  }}
                  className="border border-slate-200 rounded-lg px-2.5 py-1.5 outline-none font-bold text-slate-600 bg-white ml-2"
                >
                  <option value={5}>5 / halaman</option>
                  <option value={10}>10 / halaman</option>
                  <option value={20}>20 / halaman</option>
                  <option value={50}>50 / halaman</option>
                </select>
              </div>
            </div>
          </section>
        </div>
      </>
    );
  }

  // View 3: Multi-step submission form
  return (
    <>
      {!activeModalDoc ? (
      <>
{alertMsg && <div className="fixed top-4 right-4 bg-slate-900 text-white p-4 rounded-lg shadow-2xl z-9999 font-medium text-sm max-w-sm animate-in fade-in slide-in-from-top-4">{alertMsg}</div>}
<div className="w-full space-y-6 pb-12 text-sm text-gray-700">
      
      {/* Header exactly like Image 3 */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <button
              onClick={() => handleExitRequest('choose-scheme')}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-[#008BE3] bg-[#008BE3]/10 hover:bg-[#008BE3]/20 transition-colors cursor-pointer shrink-0 mt-1 sm:mt-0"
              title="Kembali ke Daftar Skema"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="flex flex-col gap-1.5">
              <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none">
                {selectedScheme?.name}
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-mono uppercase tracking-wider font-bold leading-none">
                  {selectedScheme?.code}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Area with Side-by-side Tabs and Green "Selanjutnya" button row matching Image 3 */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs p-4 md:p-6">
        
        {/* Navigation Tabs and Selanjutnya Header Block */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-slate-200 mb-6 pb-2 lg:pb-0 gap-4">
          {/* Horizontal Tabs scrollable */}
          <div className="flex items-center gap-1 overflow-x-auto pb-px scrollbar-thin">
            {['Data Pribadi', 'Persyaratan Dasar', 'Bukti Administratif', 'Bukti Kompetensi', 'Persyaratan Pendaftaran'].map((tabLabel, idx) => {
              const tabStep = idx + 1;
              const isActive = step === tabStep;
              return (
                <button
                  key={tabLabel}
                  onClick={() => {
                    // Check validation if moving beyond step 1
                    if (step === 1 && tabStep > 1) {
                      const newErrors: Step1Errors = {
                        tempatLahir: tempatLahir.trim() === '',
                        alamat: alamat.trim() === '',
                        nik: nik.trim() === '',
                        kodePos: kodePos.trim() === '',
                        tuk: tuk === '',
                      };
                      setErrors(newErrors);
                      if (!newErrors.tempatLahir && !newErrors.alamat && !newErrors.nik && !newErrors.kodePos && !newErrors.tuk) {
                        setStep(tabStep);
                        if (window.innerWidth < 1024) window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    } else if (step === 2 && tabStep > 2) {
                      const reqs = (selectedScheme as Scheme)?.persyaratanDasar || [];
                      const valid = reqs.every((req: SchemeRequirementItem) => eFormData[typeof req === 'string' ? req : req.name]);
                      if (!valid) {
                        setShowStep2Errors(true);
                      } else {
                        setShowStep2Errors(false);
                        setStep(tabStep);
                      }
                    } else if (step === 3 && tabStep > 3) {
                      const reqs = (selectedScheme as Scheme)?.buktiAdministratif || [];
                      const valid = reqs.every((req: SchemeRequirementItem) => eFormData[typeof req === 'string' ? req : req.name]);
                      if (!valid) {
                        setShowStep3Errors(true);
                      } else {
                        setShowStep3Errors(false);
                        setStep(tabStep);
                      }
                    } else {
                      setStep(tabStep);
                    }
                  }}
                  className={`px-4 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition-all ${
                    isActive
                      ? 'border-[#008BE3] text-[#008BE3] bg-sky-50/40'
                      : 'border-transparent text-gray-400 hover:text-slate-800 hover:bg-slate-50/50'
                  }`}
                >
                  {tabLabel}
                </button>
              );
            })}
          </div>
        </div>

        {/* STEP 1: DATA PRIBADI (Direct clone of Image 3 layout) */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Data Pribadi</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Nama Lengkap */}
              <div className="min-w-0">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  <span className="text-red-500">*</span> Nama Lengkap
                </label>
                <input
                  type="text"
                  value={namaLengkap}
                  onChange={(e) => setNamaLengkap(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3] font-semibold text-slate-800"
                />
              </div>

              {/* Tempat Lahir */}
              <div className="min-w-0">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  <span className="text-red-500">*</span> Tempat Lahir
                </label>
                <input
                  type="text"
                  placeholder="Masukkan tempat lahir"
                  value={tempatLahir}
                  onChange={(e) => {
                    setTempatLahir(e.target.value);
                    if (errors.tempatLahir) setErrors({ ...errors, tempatLahir: false });
                  }}
                  className={`w-full px-3 py-2 text-xs rounded-lg border outline-none focus:ring-1 font-semibold text-slate-800 transition-all ${
                    errors.tempatLahir
                      ? 'border-red-400 bg-red-50/10 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-slate-300 focus:border-[#008BE3] focus:ring-[#008BE3]'
                  }`}
                />
                {errors.tempatLahir ? (
                  <p className="text-[10px] text-red-500 mt-1 font-bold">Masukkan tempat lahir</p>
                ) : (
                  <p className="text-[10px] text-slate-400 mt-1 font-medium">Masukkan tempat lahir</p>
                )}
              </div>

              {/* Tanggal Lahir */}
              <div className="min-w-0">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  <span className="text-red-500">*</span> Tanggal Lahir
                </label>
                <input
                  type="date"
                  value={tanggalLahir}
                  onChange={(e) => setTanggalLahir(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3] bg-white font-semibold text-slate-800"
                />
              </div>

              {/* Jenis Kelamin */}
              <div className="min-w-0">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  <span className="text-red-500">*</span> Jenis Kelamin
                </label>
                <div className="flex items-center gap-6 py-2">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-slate-700">
                    <input
                      type="radio"
                      name="jenisKelamin"
                      value="Laki-laki"
                      checked={jenisKelamin === 'Laki-laki'}
                      onChange={() => setJenisKelamin('Laki-laki')}
                      className="text-[#008BE3] focus:ring-[#008BE3] w-4 h-4"
                    />
                    Laki-laki
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-slate-700">
                    <input
                      type="radio"
                      name="jenisKelamin"
                      value="Perempuan"
                      checked={jenisKelamin === 'Perempuan'}
                      onChange={() => setJenisKelamin('Perempuan')}
                      className="text-[#008BE3] focus:ring-[#008BE3] w-4 h-4"
                    />
                    Perempuan
                  </label>
                </div>
              </div>

              {/* Alamat */}
              <div className="min-w-0">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  <span className="text-red-500">*</span> Alamat
                </label>
                <textarea
                  placeholder="Masukkan alamat"
                  value={alamat}
                  onChange={(e) => {
                    setAlamat(e.target.value);
                    if (errors.alamat) setErrors({ ...errors, alamat: false });
                  }}
                  className={
                    errors.alamat
                      ? "w-full px-3 py-2 text-xs rounded-lg border outline-none focus:ring-1 font-semibold text-slate-800 h-9.5 resize-none transition-all border-red-400 bg-red-50/10 focus:border-red-500 focus:ring-red-500/20"
                      : "w-full px-3 py-2 text-xs rounded-lg border outline-none focus:ring-1 font-semibold text-slate-800 h-9.5 resize-none transition-all border-slate-300 focus:border-[#008BE3] focus:ring-[#008BE3]"
                  }
                ></textarea>
                {errors.alamat ? (
                  <p className="text-[10px] text-red-500 mt-1 font-bold">Alamat Tidak Boleh Kosong</p>
                ) : (
                  <p className="text-[10px] text-slate-400 mt-1 font-medium">Masukkan alamat</p>
                )}
              </div>

              {/* Alamat Wilayah/Kelurahan */}
              <div className="min-w-0">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  <span className="text-red-500">*</span> Alamat Wilayah/Kelurahan
                </label>
                <input
                  type="text"
                  value={alamatWilayah}
                  onChange={(e) => setAlamatWilayah(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3] bg-white font-semibold text-slate-800"
                />
              </div>

              {/* NIK */}
              <div className="min-w-0">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  <span className="text-red-500">*</span> NIK
                </label>
                <input
                  type="text"
                  placeholder="Masukkan nik"
                  value={nik}
                  onChange={(e) => {
                    setNik(e.target.value.replace(/[^0-9]/g, ''));
                    if (errors.nik) setErrors({ ...errors, nik: false });
                  }}
                  className={`w-full px-3 py-2 text-xs rounded-lg border outline-none focus:ring-1 font-semibold text-slate-800 transition-all ${
                    errors.nik
                      ? 'border-red-400 bg-red-50/10 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-slate-300 focus:border-[#008BE3] focus:ring-[#008BE3]'
                  }`}
                />
                {errors.nik ? (
                  <p className="text-[10px] text-red-500 mt-1 font-bold">Nik tidak boleh kosong</p>
                ) : (
                  <p className="text-[10px] text-slate-400 mt-1 font-medium">Masukkan NIK</p>
                )}
              </div>

              {/* Kebangsaan */}
              <div className="min-w-0">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  <span className="text-red-500">*</span> Kebangsaan
                </label>
                <select
                  value={kebangsaan}
                  onChange={(e) => setKebangsaan(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3] bg-white font-semibold text-slate-800"
                >
                  <option value="WNI">WNI</option>
                  <option value="WNA">WNA</option>
                </select>
              </div>

              {/* Kode POS */}
              <div className="min-w-0">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  <span className="text-red-500">*</span> Kode POS
                </label>
                <input
                  type="text"
                  placeholder="Masukkan kode pos"
                  value={kodePos}
                  onChange={(e) => {
                    setKodePos(e.target.value.replace(/[^0-9]/g, ''));
                    if (errors.kodePos) setErrors({ ...errors, kodePos: false });
                  }}
                  className={`w-full px-3 py-2 text-xs rounded-lg border outline-none focus:ring-1 font-semibold text-slate-800 transition-all ${
                    errors.kodePos
                      ? 'border-red-400 bg-red-50/10 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-slate-300 focus:border-[#008BE3] focus:ring-[#008BE3]'
                  }`}
                />
                {errors.kodePos ? (
                  <p className="text-[10px] text-red-500 mt-1 font-bold">Masukkan kode pos</p>
                ) : (
                  <p className="text-[10px] text-slate-400 mt-1 font-medium">Masukkan kode pos</p>
                )}
              </div>

              {/* No HP / Telepon */}
              <div className="min-w-0">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  <span className="text-red-500">*</span> No HP / Telepon
                </label>
                <input
                  type="text"
                  placeholder="Masukkan nomor telepon/HP"
                  value={noTelp}
                  onChange={(e) => setNoTelp(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3] bg-white font-semibold text-slate-800"
                />
              </div>

            </div>

            {/* Detail Pendidikan Section */}
            <div className="relative flex py-2 items-center">
              <div className="grow border-t border-slate-200"></div>
              <span className="shrink mx-4 text-xs font-black text-slate-800 uppercase tracking-wider">Detail Pendidikan</span>
              <div className="grow border-t border-slate-200"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Pendidikan Terakhir */}
              <div className="min-w-0">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  <span className="text-red-500">*</span> Pendidikan Terakhir
                </label>
                <select
                  value={pendidikanTerakhir}
                  onChange={(e) => setPendidikanTerakhir(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3] bg-white font-semibold text-slate-800"
                >
                  {getPendidikanOptions(selectedScheme).map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Detail Pekerjaan Section */}
            <div className="relative flex py-2 items-center">
              <div className="grow border-t border-slate-200"></div>
              <span className="shrink mx-4 text-xs font-black text-slate-800 uppercase tracking-wider">Detail Pekerjaan</span>
              <div className="grow border-t border-slate-200"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Pekerjaan */}
              <div className="min-w-0">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  <span className="text-red-500">*</span> Pekerjaan
                </label>
                <select
                  value={pekerjaan}
                  onChange={(e) => setPekerjaan(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3] bg-white font-semibold text-slate-800"
                >
                  <option value="Pelajar/Mahasiswa">Pelajar/Mahasiswa</option>
                  <option value="PNS">PNS</option>
                  <option value="Swasta">Swasta</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              {/* Institusi/Perusahaan */}
              <div className="min-w-0">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  <span className="text-red-500">*</span> Institusi/Perusahaan
                </label>
                <input
                  type="text"
                  placeholder="Masukkan Institusi/Perusahaan"
                  value={institusiPerusahaan}
                  onChange={(e) => setInstitusiPerusahaan(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3] bg-white font-semibold text-slate-800"
                />
              </div>

              {/* Jabatan */}
              <div className="min-w-0">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  <span className="text-red-500">*</span> Jabatan
                </label>
                <input
                  type="text"
                  placeholder="Masukkan Jabatan"
                  value={jabatan}
                  onChange={(e) => setJabatan(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3] bg-white font-semibold text-slate-800"
                />
              </div>

              {/* Email Institusi/Perusahaan */}
              <div className="min-w-0">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  <span className="text-red-500">*</span> Email Institusi/Perusahaan
                </label>
                <input
                  type="email"
                  placeholder="Masukkan Email Institusi"
                  value={emailInstitusi}
                  onChange={(e) => setEmailInstitusi(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3] bg-white font-semibold text-slate-800"
                />
              </div>

              {/* Kode Pos Institusi/Perusahaan */}
              <div className="min-w-0">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Kode Pos Institusi/Perusahaan
                </label>
                <input
                  type="text"
                  placeholder="Masukkan kode pos"
                  value={kodePosInstitusi}
                  onChange={(e) => setKodePosInstitusi(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3] bg-white font-semibold text-slate-800"
                />
              </div>

              {/* Nomor Telepon Institusi/Perusahaan */}
              <div className="min-w-0">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  <span className="text-red-500">*</span> Nomor Telepon Institusi/Perusahaan
                </label>
                <input
                  type="text"
                  placeholder="Masukkan nomor telepon"
                  value={telpInstitusi}
                  onChange={(e) => setTelpInstitusi(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3] bg-white font-semibold text-slate-800"
                />
              </div>

              {/* Alamat Institusi/Perusahaan */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  <span className="text-red-500">*</span> Alamat Institusi/Perusahaan
                </label>
                <textarea
                  placeholder="Masukkan Alamat Institusi/Perusahaan"
                  value={alamatInstitusi}
                  onChange={(e) => setAlamatInstitusi(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3] bg-white font-semibold text-slate-800 h-9.5 resize-none"
                />
              </div>

              {/* Fax Institusi/Perusahaan */}
              <div className="min-w-0">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Fax Institusi/Perusahaan
                </label>
                <input
                  type="text"
                  placeholder="Masukkan Nomor fax Institusi/Perusahaan"
                  value={faxInstitusi}
                  onChange={(e) => setFaxInstitusi(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3] bg-white font-semibold text-slate-800"
                />
              </div>
            </div>

            {/* Lainnya Section */}
            <div className="relative flex py-2 items-center">
              <div className="grow border-t border-slate-200"></div>
              <span className="shrink mx-4 text-xs font-black text-slate-800 uppercase tracking-wider">Lainnya</span>
              <div className="grow border-t border-slate-200"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* TUK */}
              <div className="min-w-0">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  <span className="text-red-500">*</span> TUK
                </label>
                <select
                  value={tuk}
                  onChange={(e) => {
                    setTuk(e.target.value);
                    if (errors.tuk) setErrors({ ...errors, tuk: false });
                  }}
                  className={`w-full px-3 py-2 text-xs rounded-lg border outline-none focus:ring-1 font-semibold text-slate-800 transition-all ${
                    errors.tuk
                      ? 'border-red-400 bg-red-50/10 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-slate-300 focus:border-[#008BE3] focus:ring-[#008BE3] bg-white'
                  }`}
                >
                  <option value="">Pilih TUK</option>
                  <option value="Mandiri (Online)">Mandiri (Online)</option>
                  <option value="Sewaktu">Sewaktu</option>
                </select>
                {errors.tuk && (
                  <p className="text-[10px] text-red-500 mt-1 font-bold">Pilih TUK</p>
                )}
              </div>

              {/* Penyesuaian Wajar */}
              <div className="col-span-full">
                <label className="flex items-start gap-3 cursor-pointer p-4 border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={penyesuaianWajar}
                    onChange={(e) => setPenyesuaianWajar(e.target.checked)}
                    className="mt-0.5 w-4 h-4 text-[#008BE3] rounded border-slate-300 focus:ring-[#008BE3]"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800">Memerlukan Penyesuaian Wajar (FR.AK.07)</p>
                    <p className="text-[11px] text-slate-500 mt-1">Centang jika Anda memiliki kondisi tertentu (keterbatasan fisik, bahasa, kelelahan, dll) yang memerlukan penyesuaian saat asesmen.</p>
                  </div>
                </label>
              </div>

              {/* Berpengalaman pada Skema yang Diajukan */}
              <div className="col-span-full flex flex-col gap-2">
                <label className="block text-xs font-bold text-slate-700">
                  Berpengalaman pada Skema yang Diajukan
                </label>
                <button
                  type="button"
                  onClick={() => setBerpengalaman(!berpengalaman)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    berpengalaman ? 'bg-[#005C46]' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                      berpengalaman ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

          </div>
        )}        {/* STEP 2: PERSYARATAN DASAR */}
        {step === 2 && (
          <FormDocumentTable
            onAction={(doc: ActiveModalDoc) => { setActiveModalDoc(doc); if (doc.isEForm && doc.name) setTempEFormData((eFormData[doc.name] as Record<string, unknown> | undefined) ?? ({} as Record<string, unknown>)); }}
            title="Persyaratan Dasar"
            infoText="File Persyaratan Dasar akan ditampilkan pada Form APL - 01"
            documents={((selectedScheme as Scheme)?.persyaratanDasar || []).map((req: SchemeRequirementItem) => ({
              required: true,
              name: typeof req === 'string' ? req : req.name,
              description: typeof req === 'string' ? '' : ('description' in req ? req.description : ''),
              type: 'File Upload'
            }))}
            eFormData={eFormData}
            showErrors={showStep2Errors}
          />
        )}

        {/* STEP 3: BUKTI ADMINISTRATIF */}
        {step === 3 && (
          <FormDocumentTable
            onAction={(doc: ActiveModalDoc) => { setActiveModalDoc(doc); if (doc.isEForm && doc.name) setTempEFormData((eFormData[doc.name] as Record<string, unknown> | undefined) || ({} as Record<string, unknown>)); }}
            title="Bukti Administratif"
            infoText="File Bukti Administratif akan ditampilkan pada Form APL - 01"
            documents={((selectedScheme as Scheme)?.buktiAdministratif || []).map((req: SchemeRequirementItem) => ({
              required: true,
              name: typeof req === 'string' ? req : req.name,
              type: 'File Upload'
            }))}
            eFormData={eFormData}
            showErrors={showStep3Errors}
          />
        )}

        {/* STEP 4: BUKTI KOMPETENSI */}
        {step === 4 && (
          <FormKompetensiTable
            onAction={(doc: ActiveModalDoc) => { setActiveModalDoc(doc); if (doc.isEForm && doc.name) setTempEFormData((eFormData[doc.name] as Record<string, unknown> | undefined) || ({} as Record<string, unknown>)); }}
            eFormData={eFormData}
            title="Bukti Kompetensi"
            infoText="File Bukti Kompetensi akan ditampilkan pada Form APL - 02"
            kompetensiList={((selectedScheme as Scheme)?.units || []).flatMap((unit: SchemeUnit, uIdx: number) => 
              (unit.elemen || []).map((el: { title: string; kuk: string[] }, eIdx: number) => ({
                  id: `u${uIdx}e${eIdx}`,
                  unitTitle: unit.title,
                  unitCode: unit.code,
                  elemen: el.title,
                  kuk: el.kuk || [],
                  idx: eIdx + 1
                }))
            )}
          />
        )}

        {/* STEP 5: PERSYARATAN PENDAFTARAN */}
        {step === 5 && (
          <div className="space-y-4">
            <FormDocumentTable
              onAction={(doc: ActiveModalDoc) => { setActiveModalDoc(doc); if (doc.isEForm && doc.name) setTempEFormData((eFormData[doc.name] as Record<string, unknown> | undefined) || ({} as Record<string, unknown>)); }}
              title="Persyaratan Pendaftaran"
              infoText="Lengkapi formulir permohonan sertifikasi mandiri di bawah ini"
              documents={[
                { required: true, name: '01. FR.APL.01 Permohonan Sertifikasi', type: 'E-Form', isEForm: true },
                { required: true, name: '02. FR.APL.02 Asesmen Mandiri', type: 'E-Form', isEForm: true },
              ]}
              eFormData={eFormData}
            />

            {(!eFormData['01. FR.APL.01 Permohonan Sertifikasi'] || !eFormData['02. FR.APL.02 Asesmen Mandiri']) && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex gap-3 text-amber-800 text-xs shadow-sm">
                <AlertTriangle size={16} className="shrink-0 text-amber-500 mt-0.5" />
                <div className="min-w-0">
                  <span className="font-bold block mb-1">Perhatian</span>
                  Anda harus mengisi dan menyimpan (<span className="font-semibold text-amber-900">Simpan Data</span>) kedua E-Form di atas sebelum dapat men-submit pengajuan skema ini.
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Bottom Navigation */}
        <div className="mt-6 flex justify-end border-t border-slate-200 pt-4">
          <button
            onClick={handleNext}
            disabled={step === 5 && (!eFormData['01. FR.APL.01 Permohonan Sertifikasi'] || !eFormData['02. FR.APL.02 Asesmen Mandiri'])}
            className={`px-5 py-2.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs w-full justify-center sm:w-auto ${
              step === 5 && (!eFormData['01. FR.APL.01 Permohonan Sertifikasi'] || !eFormData['02. FR.APL.02 Asesmen Mandiri'])
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : 'bg-[#008BE3] hover:bg-[#0076C2] text-white'
            }`}
          >
            {step === 5 ? 'Ajukan' : 'Selanjutnya'}
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
      </div>
</>
      ) : activeModalDoc && activeModalDoc.isEForm ? (
        <>
{alertMsg && <div className="fixed top-4 right-4 bg-slate-900 text-white p-4 rounded-lg shadow-2xl z-9999 font-medium text-sm max-w-sm animate-in fade-in slide-in-from-top-4">{alertMsg}</div>}
<div className="min-h-screen bg-slate-100 p-4 md:p-8 pb-24 w-full">
          <div className="max-w-200 mx-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="mb-4">
              <button 
                onClick={() => setActiveModalDoc(null)}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-[#008BE3] bg-[#008BE3]/10 hover:bg-[#008BE3]/20 transition-colors cursor-pointer shrink-0 mb-4 mt-0.5"
                title="Kembali ke Pengajuan Skema"
              >
                <ArrowLeft size={18} />
              </button>
            </div>
            
            <div className="max-w-200 mx-auto bg-white shadow-xl p-8 md:p-12 min-h-280.75 space-y-8 relative mb-0 text-slate-800 text-sm rounded-t-lg">
                {activeModalDoc?.name?.includes('APL.01') ? (
                  <EFormApl01 
                    formData={{
                      namaLengkap, tempatLahir, tanggalLahir, jenisKelamin, alamat: alamatWilayah, nik, 
                      pendidikanTerakhir, institusiPerusahaan, jabatan,
                      skema: selectedScheme?.name || '',
                      nomorSkema: selectedScheme?.code || '',
                      schemeDetail: selectedScheme,
                      signature: user?.avatar,
                      readOnly: activeModalDoc.isPreview,
                      ...(tempEFormData || {})
                    }} 
                    onChange={(val) => setTempEFormData(val)}
                      onSave={() => {
                        
                        {
                          const key = String(activeModalDoc?.name ?? '');
                          setEFormData({...eFormData, [key]: tempEFormData});
                        }
                        showAlert('Data berhasil disimpan!');
                        setActiveModalDoc(null);
                        setTempFiles([]);
                      }}
                   
                  />
                ) : activeModalDoc?.name?.includes('APL.02') ? (
                  <EFormApl02 allData={eFormData} 
                    formData={{
                      namaLengkap,
                      skema: selectedScheme?.name || '',
                      nomorSkema: selectedScheme?.code || '',
                      schemeDetail: selectedScheme,
                      signature: user?.avatar,
                      readOnly: activeModalDoc.isPreview,
                      ...(tempEFormData || {})
                    }} 
                    onChange={(val) => setTempEFormData(val)}
                      onSave={() => {
                        
                        {
                          const key = String(activeModalDoc?.name ?? '');
                          setEFormData({...eFormData, [key]: tempEFormData});
                        }
                        showAlert('Data berhasil disimpan!');
                        setActiveModalDoc(null);
                        setTempFiles([]);
                      }}
                   
                  />
                ) : (
                  <>
                    <div className="bg-sky-50 border border-sky-100 text-sky-800 text-xs p-3 rounded-lg mb-4 font-medium">
                      Silakan isi form elektronik ini dengan data yang benar.
                    </div>
                    <div className="min-w-0">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Keterangan <span className="text-red-500">*</span>
                      </label>
                      <textarea 
                        className="w-full text-xs p-3 border border-slate-200 rounded-lg outline-none focus:border-[#008BE3] min-h-25"
                        value={(eFormData[activeModalDoc?.name ?? ''] as string) || ''}
                        onChange={(e) => setEFormData({...eFormData, [activeModalDoc?.name ?? '']: e.target.value})}
                      ></textarea>
                    </div>
                  </>
                )}
            </div>
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 shadow-xl max-w-200 mx-auto rounded-b-lg mb-8">
              <button
                onClick={() => {
                  setActiveModalDoc(null);
                  setTempFiles([]);
                }}
                className="px-4 py-2 bg-white text-slate-700 border border-slate-300 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors"
              >
                {activeModalDoc.isPreview ? 'Tutup' : 'Batal'}
              </button>
              {!activeModalDoc.isPreview && (
                <button
                  onClick={() => {
                    if (activeModalDoc?.name?.includes('APL.01')) {
                      if (!tempEFormData.tujuan) {
                        showAlert('Harap isi Tujuan Asesmen');
                        return;
                      }
                    } else if (activeModalDoc?.name?.includes('APL.02')) {
                      let firstUnfilled: string | null = null;
                      const elements: string[] = selectedScheme?.units?.flatMap((u: SchemeUnit, uIdx: number) => 
                        (u.elemen || []).map((e: { title: string; kuk: string[] }, eIdx: number) => {
                          const key = `u${uIdx}e${eIdx}`;
                          if (!(tempEFormData.kompetensi as Record<string, unknown>)?.[key] && !firstUnfilled) {
                            firstUnfilled = key;
                          }
                          return key;
                        })
                      ) || [];
                      const isAllChecked: boolean = elements.every((k: string) => (tempEFormData.kompetensi as Record<string, unknown>)?.[k]);
                      if (!isAllChecked) {
                        showAlert('Harap beri tanda K atau BK pada seluruh kriteria!');
                        if (firstUnfilled) {
                          window.dispatchEvent(new CustomEvent('scroll-to-unfilled', { detail: firstUnfilled }));
                        }
                        return;
                      }
                    }
                    setEFormData({...eFormData, [activeModalDoc.name || '']: tempEFormData});
                    showAlert('Data berhasil disimpan!');
                    setActiveModalDoc(null);
                    setTempFiles([]);
                  }}
                  className="px-5 py-2 bg-[#008BE3] text-white rounded-lg text-sm font-bold hover:bg-[#0076C2] transition-colors shadow-xs"
                >
                  Simpan Data
                </button>
              )}
            </div>
          </div>
        </div>
</>
      ) : activeModalDoc && !activeModalDoc.isEForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-sm">
                {activeModalDoc.isPreview ? 'Pratinjau Dokumen: ' : 'Lampirkan File: '}
                {(activeModalDoc.name as ReactNode) || (activeModalDoc.unit as ReactNode)}
              </h3>
              <button 
                onClick={() => {
                  setActiveModalDoc(null);
                  setTempFiles([]);
                }}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              {activeModalDoc.isPreview ? (
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="w-full rounded-lg overflow-hidden border border-slate-200 shadow-sm bg-slate-50 relative aspect-4/3 flex items-center justify-center">
                    <div className="text-center p-6 opacity-60">
                      <FileText size={48} className="mx-auto text-slate-400 mb-3" />
                      <p className="font-bold text-slate-500">Pratinjau Dokumen</p>
                      <p className="text-xs text-slate-400 mt-1">{activeModalDoc.name}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 justify-center mt-2 w-full">
                    <button onClick={() => showAlert('Mengunduh dokumen...')} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 font-bold rounded-lg text-sm hover:bg-slate-50 transition-colors shadow-xs">
                      <Download size={16} /> Unduh
                    </button>
                    <button onClick={() => {
                        const newEFormData = { ...eFormData };
                        if (typeof activeModalDoc.name === 'string') {
                          delete newEFormData[activeModalDoc.name];
                        }
                        setEFormData(newEFormData);
                        setActiveModalDoc(null);
                        setTempFiles([]);
                    }} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-500 font-bold rounded-lg text-sm hover:bg-red-50 transition-colors shadow-xs">
                      <Trash2 size={16} /> Hapus File
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {activeModalDoc.isBuktiKompetensi && (
                    <div className="mb-4">
                      <p className="text-sm font-bold text-slate-800 mb-2">Pilih dari Dokumen Persyaratan Dasar:</p>
                      <select 
                        className="w-full text-sm border border-slate-300 rounded-lg p-2.5 bg-white text-slate-700"
                        onChange={(e) => {
                           if (e.target.value) {
                             const docName = e.target.value;
                             const files = (eFormData[docName] as File[]) || [];
                             setTempFiles([...tempFiles, ...(Array.isArray(files) ? files : [])]);
                             e.target.value = "";
                           }
                        }}
                      >
                        <option value="">-- Pilih Dokumen --</option>
                        {[
                          ...(selectedScheme?.persyaratanDasar || []).map((req: SchemeRequirementItem) => typeof req === 'string' ? req : req.name),
                          ...(selectedScheme?.buktiAdministratif || []).map((req: SchemeRequirementItem) => typeof req === 'string' ? req : req.name)
                        ].filter((docName: string) => (eFormData[docName] as File[]) && (eFormData[docName] as File[]).length > 0).map((docName: string, idx: number) => (
                          <option key={idx} value={docName}>{docName}</option>
                        ))}
                      </select>
                      <div className="flex items-center gap-3 my-4">
                        <div className="h-px bg-slate-200 flex-1"></div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Atau</span>
                        <div className="h-px bg-slate-200 flex-1"></div>
                      </div>
                    </div>
                  )}
                  <label className="relative bg-slate-50 border border-slate-200 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-100 transition-colors">
                    <Upload size={32} className="text-[#008BE3] mb-3" />
                    <p className="text-sm font-bold text-slate-800 mb-1">Klik atau seret file ke sini</p>
                    <p className="text-xs text-slate-500 font-medium">Mendukung file PDF, JPG, PNG (Maks 5MB)</p>
                    <input 
                      type="file"
                      multiple
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          const newFiles = Array.from(e.target.files);
                          setTempFiles([...tempFiles, ...newFiles]);
                        }
                      }}
                    />
                  </label>
                  {tempFiles.length > 0 && (
                    <div className="mt-4 space-y-2 max-h-40 overflow-y-auto pr-2">
                      {tempFiles.map((file, idx) => (
                        <div key={idx} className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between">
                          <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold">
                            <CheckCircle size={16} className="text-emerald-600 shrink-0" />
                            <span className="truncate max-w-50 sm:max-w-xs">{file.name || 'Telah diunggah'}</span>
                          </div>
                          <button
                            onClick={() => {
                              const newFiles = tempFiles.filter((_, i) => i !== idx);
                              setTempFiles(newFiles);
                            }}
                            className="p-1.5 text-red-500 hover:bg-red-100 rounded-md transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 rounded-b-xl">
              <button
                onClick={() => {
                  setActiveModalDoc(null);
                  setTempFiles([]);
                }}
                className="px-4 py-2 bg-white text-slate-700 border border-slate-300 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors"
              >
                {activeModalDoc.isPreview ? 'Tutup' : 'Batal'}
              </button>
              {!activeModalDoc.isPreview && (
                <button
                  onClick={() => {
                    if (tempFiles.length === 0) {
                      showAlert('Harap pilih file terlebih dahulu.');
                      return;
                    }
                    if (typeof activeModalDoc.name === 'string') {
                      setEFormData({...eFormData, [activeModalDoc.name]: tempFiles});
                      showAlert('Data berhasil disimpan!');
                      setActiveModalDoc(null);
                      setTempFiles([]);
                    }
                  }}
                  className="px-4 py-2 bg-[#008BE3] text-white rounded-lg text-sm font-bold hover:bg-[#0076C2] transition-colors"
                >
                  Simpan File
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      {showExitWarning && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-black text-slate-800 text-lg">Peringatan</h3>
              <button 
                onClick={() => setShowExitWarning(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-5 flex flex-col items-center justify-center text-center bg-white">
              <AlertTriangle size={48} className="text-orange-500 mb-4" />
              <p className="text-slate-600 font-medium">
                Apakah Anda yakin ingin kembali? Draf pengajuan skema Anda akan hilang dan tidak dapat dikembalikan.
              </p>
            </div>
            <div className="p-5 border-t border-slate-100 flex justify-end gap-3 bg-gray-50">
              <button
                onClick={() => setShowExitWarning(false)}
                className="px-4 py-2 font-bold text-sm text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  setShowExitWarning(false);
                  if (exitDestination) setSubView(exitDestination);
                }}
                className="px-4 py-2 font-bold text-sm text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-xs transition-colors"
              >
                Ya, Kembali
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}