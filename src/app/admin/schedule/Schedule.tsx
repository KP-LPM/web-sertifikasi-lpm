import React, { useState } from 'react';
import { FileEdit, Trash2, Eye, Calendar, Users, MapPin, Search, Plus, Filter, CheckSquare, Square, Clock, ArrowRight, ArrowLeft, X, Upload, FileText, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../../context';
import { PlenoSession } from '../../types';


const TUK_LIST = [
  { id: 'GD-001', nama: 'Gedung C: Gedung Fak. Ilmu Sosial dan Ilmu Politik', kapasitas: 50 },
  { id: 'GD-002', nama: 'Gedung D: Gedung Abjan Soelaiman (Auditorium)', kapasitas: 200 }
];

const getDocumentPreviewUrl = (name?: string, url?: string) => {
  if (url && url.trim().length > 0) return url;
  const safeName = name ? encodeURIComponent(name) : 'Surat_Sidang_Pleno.pdf';
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800" fill="none"><rect width="600" height="800" fill="white" rx="16"/><rect x="40" y="40" width="520" height="720" fill="%23F8FAFC" stroke="%23E2E8F0" stroke-width="2" rx="12"/><rect x="70" y="70" width="100" height="36" fill="%23008BE3" rx="6"/><text x="185" y="93" font-family="sans-serif" font-weight="bold" font-size="18" fill="%230F172A">SURAT KEPUTUSAN SIDANG PLENO</text><text x="185" y="115" font-family="sans-serif" font-size="13" fill="%2364748B">LSP SERTIFIKASI PROFESI INDONESIA</text><line x1="70" y1="135" x2="530" y2="135" stroke="%23008BE3" stroke-width="2"/><text x="70" y="180" font-family="sans-serif" font-weight="bold" font-size="15" fill="%231E293B">BERITA ACARA &amp; HASIL KEPUTUSAN SIDANG</text><text x="70" y="210" font-family="sans-serif" font-size="13" fill="%23008BE3">Lampiran Dokumen: ${safeName}</text><rect x="70" y="235" width="460" height="150" fill="%23F1F5F9" rx="8" stroke="%23CBD5E1"/><text x="90" y="270" font-family="sans-serif" font-weight="bold" font-size="13" fill="%23334155">Detail Pengesahan Hasil Asesmen:</text><text x="90" y="300" font-family="sans-serif" font-size="12" fill="%23475569">1. Penetapan Keputusan Sertifikasi Asesi Terdaftar</text><text x="90" y="325" font-family="sans-serif" font-size="12" fill="%23475569">2. Verifikasi Berkas Rekam Jejak Asesmen Asesor</text><text x="90" y="350" font-family="sans-serif" font-size="12" fill="%23475569">3. Persetujuan Dewan Pengarah dan Komite Skema</text><rect x="70" y="415" width="460" height="1" fill="%23E2E8F0"/><text x="70" y="450" font-family="sans-serif" font-weight="bold" font-size="13" fill="%23059669">STATUS DOKUMEN: RESMI, SAH &amp; TERVERIFIKASI</text><rect x="70" y="520" width="180" height="90" fill="%23F0F9FF" rx="8" stroke="%23008BE3"/><text x="85" y="555" font-family="sans-serif" font-weight="bold" font-size="12" fill="%23008BE3">LSP SERTIFIKASI PROFESI</text><text x="85" y="580" font-family="sans-serif" font-size="11" fill="%230284C7">[ CAP STAMPEL &amp; TTD ]</text><text x="340" y="555" font-family="sans-serif" font-size="11" fill="%2364748B">Ketua Komite Sidang Pleno</text><line x1="340" y1="590" x2="510" y2="590" stroke="%2394A3B8" stroke-dasharray="2 2"/></svg>`;
};

const ALL_PLENO_USERS = [
  // Asesor
  { id: 'p-usr-1', nama: 'Ichsan Taufik', role: 'Asesor' },
  { id: 'p-usr-2', nama: 'Aceng Abdul Kodir', role: 'Asesor' },
  { id: 'p-usr-3', nama: 'Susanti Ainul Fitri', role: 'Asesor' },
  { id: 'p-usr-4', nama: 'M Sandi Marta', role: 'Asesor' },
  { id: 'p-usr-5', nama: 'Gina Sakinah', role: 'Asesor' },
  { id: 'p-usr-6', nama: 'Elis Ratna Wulan', role: 'Asesor' },
  { id: 'p-usr-7', nama: 'Asep Abdul Sahid', role: 'Asesor' },
  { id: 'p-usr-8', nama: 'Siti Alia', role: 'Asesor' },
  { id: 'p-usr-9', nama: 'Azmi Fasa', role: 'Asesor' },
  { id: 'p-usr-10', nama: 'Cucu Susilawati', role: 'Asesor' },
  { id: 'p-usr-11', nama: 'Fitri Pebriani Wahyu', role: 'Asesor' },
  { id: 'p-usr-12', nama: 'Tina Dewi Rosahdi', role: 'Asesor' },
  { id: 'p-usr-13', nama: 'Ucu Julita', role: 'Asesor' },
  { id: 'p-usr-14', nama: 'Acep Muslim', role: 'Asesor' },
  { id: 'p-usr-15', nama: 'Izzah Faizah Siti Rusydati Khaerani', role: 'Asesor' },
  { id: 'p-usr-16', nama: 'Muhammad Alfan', role: 'Asesor' },
  { id: 'p-usr-17', nama: 'Erlan Aditya Ardiansyah', role: 'Asesor' },
  { id: 'p-usr-18', nama: 'Dian Rachmat Gumelar', role: 'Asesor' },
  { id: 'p-usr-19', nama: 'Reza Fauzi Nazar', role: 'Asesor' },
  { id: 'p-usr-20', nama: 'Rini Sulastri', role: 'Asesor' },
  { id: 'p-usr-21', nama: 'Yadi Mardiansyah', role: 'Asesor' },
  { id: 'p-usr-22', nama: 'Dayudin', role: 'Asesor' },
  { id: 'p-usr-23', nama: 'Wisnu Uriawan', role: 'Asesor' },
  { id: 'p-usr-24', nama: 'M. Ridha Taufiq Rahman', role: 'Asesor' },

  // Direktur
  { id: 'p-usr-25', nama: 'Gitarja, S.T., M.T.', role: 'Direktur' },

  // Dewan Pengarah
  { id: 'p-usr-26', nama: 'Dr. Ir. H. Muhammad Zulkifli, M.T.', role: 'Dewan Pengarah' },
  { id: 'p-usr-27', nama: 'Prof. Dr. Ir. Hj. Endang Suhartini', role: 'Dewan Pengarah' },

  // Komite Skema
  { id: 'p-usr-28', nama: 'Drs. Hendra Gunawan, M.Kom.', role: 'Komite Skema' },
  { id: 'p-usr-29', nama: 'Rina Fitriani, S.Kom., M.T.', role: 'Komite Skema' },

  // Manajer Administrasi dan Keuangan
  { id: 'p-usr-30', nama: 'Ahmad Syahputra, S.E., M.M.', role: 'Manajer Administrasi dan Keuangan' },

  // Manajer Standardisasi
  { id: 'p-usr-31', nama: 'Budi Santoso, S.T., M.Eng.', role: 'Manajer Standardisasi' },

  // Manajer Manajemen Mutu
  { id: 'p-usr-32', nama: 'Dr. Hj. Nurhayati, M.Pd.', role: 'Manajer Manajemen Mutu' },

  // Manajer Sertifikasi
  { id: 'p-usr-33', nama: 'Dedi Kurniawan, S.T., M.T.', role: 'Manajer Sertifikasi' },
];
export function AssessmentSchedule() {
  const { user, plenoSessions, addPlenoSession, assessments, updatePlenoSession, deletePlenoSession } = useAppContext();
  const readOnly = user?.role === 'direktur' || user?.role === 'manajer';

  const [confirmAsesmenId, setConfirmAsesmenId] = useState<number | null>(null);
  const [confirmPlenoId, setConfirmPlenoId] = useState<string | null>(null);

  // Pleno State
  const [isPlenoModalOpen, setIsPlenoModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [editId, setEditId] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  const handlePreviewAsesmen = (item: any) => {
    setIsPreviewMode(true);
    setEditId(item.id);
    setFormData({
      batchName: item.batchName,
      scheme: item.scheme,
      date: item.date,
      startTime: item.startTime || "",
      endTime: item.endTime || "",
      tuk: item.tuk || "",
      tukType: item.tukType || "",
      assessorName: item.assessorName,
      suratPenugasanName: item.suratPenugasanName || "",
      candidatesCount: item.candidatesCount,
      status: item.status,
    });
    setSelectedAsesiForJadwal(item.asesiList || []);
    setIsModalOpen(true);
  };

  const handleEditAsesmen = (item: any) => {
    setIsEditMode(true);
    setEditId(item.id);
    setFormData({
      batchName: item.batchName,
      scheme: item.scheme,
      date: item.date,
      startTime: item.startTime || '',
      endTime: item.endTime || '',
      tuk: item.tuk || '',
      tukType: item.tukType || '',
      assessorName: item.assessorName,
      suratPenugasanName: item.suratPenugasanName || '',
      candidatesCount: item.candidatesCount,
      status: item.status,
    });
     
    setSelectedAsesiForJadwal(item.asesiList || []);
    setIsModalOpen(true);
  };
  const handlePreviewPleno = (item: any) => {
    setIsPreviewMode(true);
    setEditId(item.id);
    setPlenoForm({
      id: item.id,
      tanggal: item.tanggal,
      waktuMulai: item.waktu?.split(" s.d ")[0] || "",
      waktuSelesai: item.waktu?.split(" s.d ")[1] || "",
      skema: item.skema,
      lokasi: item.lokasi,
      detailLokasi: item.detailLokasi || "",
      deskripsi: item.deskripsi || "",
      plenoAttendees: item.plenoAttendees || [],
      suratPlenoName: item.suratPlenoName || "",
      suratPlenoUrl: item.suratPlenoUrl || ""
    });
    setSelectedAsesiForPleno(item.asesiList || []);
    setIsPlenoModalOpen(true);
  };

  const handleEditPleno = (item: any) => {
    setIsEditMode(true);
    setEditId(item.id);
    setPlenoForm({
      id: item.id,
      tanggal: item.tanggal,
      waktuMulai: item.waktu.split(' s.d ')[0],
      waktuSelesai: item.waktu.split(' s.d ')[1],
      skema: item.skema,
      lokasi: item.lokasi,
      detailLokasi: item.detailLokasi || '',
      deskripsi: item.deskripsi || '',
      plenoAttendees: item.plenoAttendees || [],
      suratPlenoName: item.suratPlenoName || '',
      suratPlenoUrl: item.suratPlenoUrl || ''
    });
    setSelectedAsesiForPleno(item.asesiList || []);
    setIsPlenoModalOpen(true);
  };
  const handleDeletePleno = (id: string) => {
    deletePlenoSession(id);
  };
  
  const handleDeleteSchedule = (id: number) => {
    setSchedules(schedules.filter(s => s.id !== id));
  };

  const handleSelesaiSchedule = () => {
    if (confirmAsesmenId !== null) {
      setSchedules(schedules.map(s => s.id === confirmAsesmenId ? { ...s, status: 'Selesai' } : s));
      setConfirmAsesmenId(null);
    }
  };
  const handleSelesaiPleno = () => {
    if (confirmPlenoId !== null) {
      updatePlenoSession(confirmPlenoId, { status: 'Selesai' });
      setConfirmPlenoId(null);
    }
  };

  const [activeTab, setActiveTab] = useState<'asesmen' | 'pleno'>('asesmen');

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedRiwayat, setSelectedRiwayat] = useState<any>(null);
  
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const [searchQuery, setSearchQuery] = useState('');

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(date);
    } catch(e) {
      return dateStr;
    }
  };
  
  // Asesmen State
  const [schedules, setSchedules] = useState([
    {
      id: 1,
      batchName: 'BATCH-IT-2026-001',
      scheme: 'Auditor Halal',
      date: '15 Okt 2026',
      startTime: '08:00',
      endTime: '12:00',
      tuk: '1',
      tukType: 'Sewaktu',
      candidatesCount: 20,
      assessorName: 'Dr. Aris Thorne',
      assessorInitial: 'AT',
      suratPenugasanName: 'Surat_Penugasan_Dr_Aris.pdf',
      status: 'Dikonfirmasi',
      asesiList: [1, 5]
    },
    {
      id: 2,
      batchName: 'BATCH-NET-2026-002',
      scheme: 'Jenjang 5 Bidang Kewirausahaan Industri',
      date: '18 Okt 2026',
      startTime: '13:00',
      endTime: '17:00',
      tuk: '2',
      tukType: 'Mandiri',
      candidatesCount: 15,
      assessorName: 'Budi Santoso, M.Kom',
      assessorInitial: 'BS',
      suratPenugasanName: 'Surat_Penugasan_Budi_Santoso.pdf',
      status: 'Terjadwal',
      asesiList: [2, 4]
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAsesiForJadwal, setSelectedAsesiForJadwal] = useState<number[]>([]);
  const [formData, setFormData] = useState({
    batchName: '',
    scheme: '',
    date: '',
    startTime: '',
    endTime: '',
    candidatesCount: 0,
    assessorName: '',
    suratPenugasanName: '',
    tuk: '',
    tukType: '',
    status: 'Terjadwal'
  });

  const handleAddSchedule = () => {
    if (!formData.batchName || !formData.scheme || !formData.date || !formData.assessorName || !formData.tuk || !formData.tukType || selectedAsesiForJadwal.length === 0) return;
    if (isEditMode) {
      setSchedules(schedules.map(s => s.id === editId ? { ...s, ...formData, assessorInitial: formData.assessorName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase(), candidatesCount: selectedAsesiForJadwal.length,
      asesiList: selectedAsesiForJadwal } : s));
    } else {
      const newSchedule = {
        id: schedules.length + 1,
        ...formData,
        assessorInitial: formData.assessorName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
        candidatesCount: selectedAsesiForJadwal.length,
        asesiList: selectedAsesiForJadwal
      };
      setSchedules([newSchedule, ...schedules]);
    }
    setIsModalOpen(false);
    setFormData({ 
      batchName: '', scheme: '', date: '',
      startTime: '',
      endTime: '', candidatesCount: 0, assessorName: '', suratPenugasanName: '', tuk: '', tukType: '', status: 'Terjadwal'
    });
    setSelectedAsesiForJadwal([]);
  };

  const filteredSchedules = schedules.filter(item => 
    (item.batchName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.scheme.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (filterStatus === 'Semua' || item.status === filterStatus)
  );

  // Get unique schemes from completed assessments
  const completedAssessments = assessments.filter(a => a.status === 'Selesai');
  const uniqueSchemes = [
    'Auditor Halal',
    'Jenjang 5 Bidang Kewirausahaan Industri',
    'Melaksanakan Komunikasi Dengan Pemangku Kepentingan',
    'Penerjemah Teks Umum',
    'Penyelia Halal'
  ];
  
  const generateNextPlenoId = () => {
    if (plenoSessions.length === 0) return 'PLN-001';
    const ids = plenoSessions.map(session => {
      const match = session.id.match(/PLN-(\d+)/);
      return match ? parseInt(match[1], 10) : 0;
    });
    const maxId = Math.max(...ids, 0);
    return `PLN-${String(maxId + 1).padStart(3, '0')}`;
  };

  const [selectedPlenoRole, setSelectedPlenoRole] = useState<string>('Asesor');
  const [previewDocModal, setPreviewDocModal] = useState<{ name: string; url: string } | null>(null);
  const plenoFileInputRef = React.useRef<HTMLInputElement>(null);

  const [plenoForm, setPlenoForm] = useState<{
    id: string;
    tanggal: string;
    waktuMulai: string;
    waktuSelesai: string;
    skema: string;
    lokasi: string;
    detailLokasi: string;
    deskripsi: string;
    plenoAttendees: { role: string; nama: string }[];
    suratPlenoName?: string;
    suratPlenoUrl?: string;
  }>({
    id: '',
    tanggal: '',
    waktuMulai: '',
    waktuSelesai: '',
    skema: '',
    lokasi: 'Ruang Rapat Utama (Offline)',
    detailLokasi: '',
    deskripsi: '',
    plenoAttendees: [],
    suratPlenoName: '',
    suratPlenoUrl: ''
  });

  const isAttendeeSelected = (nama: string, role: string) => {
    return plenoForm.plenoAttendees.some(a => a.nama === nama && a.role === role);
  };

  const toggleAttendeeSelection = (userObj: { nama: string; role: string }) => {
    if (isPreviewMode) return;
    const isSelected = isAttendeeSelected(userObj.nama, userObj.role);
    if (isSelected) {
      setPlenoForm(prev => ({
        ...prev,
        plenoAttendees: prev.plenoAttendees.filter(a => !(a.nama === userObj.nama && a.role === userObj.role))
      }));
    } else {
      setPlenoForm(prev => ({
        ...prev,
        plenoAttendees: [...prev.plenoAttendees.filter(a => a.nama.trim() !== ''), { role: userObj.role, nama: userObj.nama }]
      }));
    }
  };
  
  const [selectedAsesiForPleno, setSelectedAsesiForPleno] = useState<string[]>([]);

  // Available candidates for plenary session (all completed assessments awaiting decision)
  const availableAsesiForPleno = completedAssessments;

  const handleAddPleno = () => {
    if(!plenoForm.tanggal || selectedAsesiForPleno.length === 0) return;
    
    const selectedAsesiObjects = completedAssessments.filter(a => selectedAsesiForPleno.includes(a.id) || selectedAsesiForPleno.includes(a.nama));
    const selectedSchemes = Array.from(new Set(selectedAsesiObjects.map(a => a.skema).filter(Boolean)));
    const skemaLabel = selectedSchemes.length > 0 ? selectedSchemes.join(', ') : (plenoForm.skema || 'Multi Skema');

    const { waktuMulai, waktuSelesai, ...restPlenoForm } = plenoForm;
    const newPleno: PlenoSession = {
      ...restPlenoForm,
      skema: skemaLabel,
      waktu: `${waktuMulai || '-'} s.d ${waktuSelesai || '-'}`,
      jumlahAsesi: selectedAsesiForPleno.length,
      status: 'Terjadwal',
      asesiList: selectedAsesiForPleno,
      plenoAttendees: plenoForm.plenoAttendees.filter(a => a.nama.trim() !== '')
    };
    
    if (isEditMode) {
      updatePlenoSession(editId, newPleno);
    } else {
      addPlenoSession(newPleno);
    }
    setIsPlenoModalOpen(false);
    setPlenoForm({
      id: '', // Will be updated on next open
      tanggal: '',
      waktuMulai: '',
      waktuSelesai: '',
      skema: '',
      lokasi: 'Ruang Rapat Utama (Offline)',
      detailLokasi: '',
      deskripsi: '',
      plenoAttendees: [],
      suratPlenoName: '',
      suratPlenoUrl: ''
    });
    setSelectedAsesiForPleno([]);
  };

  const toggleAsesiSelection = (nama: string) => {
    if(selectedAsesiForPleno.includes(nama)) {
      setSelectedAsesiForPleno(prev => prev.filter(n => n !== nama));
    } else {
      setSelectedAsesiForPleno(prev => [...prev, nama]);
    }
  };

  const filteredPleno = plenoSessions.filter(item => 
    (item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.skema.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (filterStatus === 'Semua' || item.status === filterStatus)
  );

  if (isModalOpen) {
    const availableSchemes = Array.from(new Set(assessments.map((a: any) => a.skema)));
    const availableAsesi = assessments
      .filter((a: any) => a.skema === formData.scheme)
      .filter((a: any) => formData.tuk ? a.metode_pelaksanaan === 'Offline' : true)
      .sort((a: any, b: any) => a.nama.localeCompare(b.nama));
    const selectedTuk = TUK_LIST.find(t => t.id === formData.tuk);
    const kapasitas = selectedTuk ? selectedTuk.kapasitas : 0;

    return (
      <div className="p-8 pb-24 max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsModalOpen(false)} 
            className="w-10 h-10 rounded-xl flex items-center justify-center text-[#008BE3] bg-[#008BE3]/10 hover:bg-[#008BE3]/20 transition-colors cursor-pointer shrink-0"
            title="Kembali"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="min-w-0">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Buat Jadwal Baru</h1>
            <p className="text-sm text-slate-500 mt-1 font-medium">Buat jadwal asesmen baru untuk batch asesi</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden">
          <div className="p-8 space-y-8">
            <h2 className="text-base font-black text-slate-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-sky-50 text-[#008BE3] flex items-center justify-center shrink-0">1</span>
              Jadwal Asesmen
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="min-w-0">
                <label className="block text-sm font-bold text-slate-700 mb-2">Nama Batch/Grup</label>
                <input type="text" placeholder="Contoh: BATCH-IT-2026-005" value={formData.batchName} onChange={(e) => setFormData({...formData, batchName: e.target.value})} disabled={isPreviewMode} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40" />
              </div>
              <div className="min-w-0">
                <label className="block text-sm font-bold text-slate-700 mb-2">Skema Sertifikasi</label>
                <select 
                  value={formData.scheme} 
                  disabled={isPreviewMode} onChange={(e) => {
                    setFormData({...formData, scheme: e.target.value});
                    setSelectedAsesiForJadwal([]); // Reset selected asesi on scheme change
                  }} 
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40 bg-white"
                >
                  <option value="">Pilih Skema</option>
                  {uniqueSchemes.map((skema: any) => (
                    <option key={skema} value={skema}>{skema}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="min-w-0">
                <label className="block text-sm font-bold text-slate-700 mb-2">Tanggal Uji</label>
                <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} disabled={isPreviewMode} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40" />
              </div>
              <div className="min-w-0">
                <label className="block text-sm font-bold text-slate-700 mb-2">Gedung/Alamat</label>
                <select 
                  value={formData.tuk} 
                  disabled={isPreviewMode} onChange={(e) => setFormData({...formData, tuk: e.target.value})} 
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40 bg-white"
                >
                  <option value="">Pilih Gedung/Alamat</option>
                  {TUK_LIST.map((tuk) => (
                    <option key={tuk.id} value={tuk.id}>{tuk.nama}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="min-w-0">
                <label className="block text-sm font-bold text-slate-700 mb-2">Waktu Mulai</label>
                <input type="time" value={formData.startTime} onChange={(e) => setFormData({...formData, startTime: e.target.value})} disabled={isPreviewMode} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40" />
              </div>
              <div className="min-w-0">
                <label className="block text-sm font-bold text-slate-700 mb-2">Waktu Selesai</label>
                <input type="time" value={formData.endTime} onChange={(e) => setFormData({...formData, endTime: e.target.value})} disabled={isPreviewMode} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="min-w-0">
                <label className="block text-sm font-bold text-slate-700 mb-2">TUK</label>
                <select 
                  value={formData.tukType} 
                  disabled={isPreviewMode} onChange={(e) => setFormData({...formData, tukType: e.target.value})} 
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40 bg-white"
                >
                  <option value="">Pilih TUK</option>
                  <option value="Sewaktu">Sewaktu</option>
                  <option value="Mandiri">Mandiri</option>
                </select>
              </div>
              <div className="min-w-0">
                <label className="block text-sm font-bold text-slate-700 mb-2">Asesor Ditugaskan</label>
                <select 
                  value={formData.assessorName} 
                  disabled={isPreviewMode} onChange={(e) => setFormData({...formData, assessorName: e.target.value})} 
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40 bg-white"
                >
                  <option value="">Pilih Asesor</option>
                  {ALL_PLENO_USERS.filter(u => u.role === 'Asesor').map(a => (
                    <option key={a.id} value={a.nama}>{a.nama}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Field Upload Surat Penugasan Asesor */}
            <div className="min-w-0">
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Surat Penugasan Asesor <span className="text-[#008BE3] font-semibold text-xs">(PDF / Gambar, Maks. 10MB)</span>
              </label>
              <div className="border-2 border-dashed border-gray-200 hover:border-[#008BE3] rounded-xl p-4 text-center bg-slate-50/50 hover:bg-sky-50/30 transition-colors relative">
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  disabled={isPreviewMode}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFormData({ ...formData, suratPenugasanName: file.name });
                    }
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                />
                <div className="flex items-center justify-center gap-3">
                  <Upload size={22} className="text-[#008BE3] shrink-0" />
                  {formData.suratPenugasanName ? (
                    <div className="text-left min-w-0">
                      <p className="text-sm font-bold text-emerald-700 flex items-center gap-1.5 truncate">
                        <CheckCircle size={16} className="shrink-0 text-emerald-600" /> {formData.suratPenugasanName}
                      </p>
                      {!isPreviewMode && <p className="text-xs text-slate-400 mt-0.5">Klik di sini untuk mengganti file surat penugasan</p>}
                    </div>
                  ) : (
                    <div className="text-left min-w-0">
                      <p className="text-sm font-bold text-slate-700">Upload Surat Penugasan Asesor</p>
                      <p className="text-xs text-slate-400">Pilih atau unggah file dokumen penugasan (PDF/JPG/PNG)</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <label className="block text-sm font-bold text-slate-700">Pilih Asesi</label>
                  {formData.tuk && (
                    <p className="text-xs text-slate-500 mt-1">
                      Kapasitas TUK: <span className="font-bold text-slate-900">{kapasitas}</span> orang
                    </p>
                  )}
                </div>
                 <div className="flex items-center gap-3 min-w-0">
                  <button 
                    onClick={() => {
                        if (isPreviewMode) return;
                      if (availableAsesi.length > 0 && formData.tuk) {
                        const maxAllowed = Math.min(availableAsesi.length, kapasitas);
                        setSelectedAsesiForJadwal(availableAsesi.slice(0, maxAllowed).map((a: any) => a.id));
                      }
                    }}
                    className="text-xs font-bold text-[#008BE3] hover:text-[#0076C2] transition-colors"
                  >
                    Pilih Maksimal ({kapasitas > 0 ? Math.min(availableAsesi.length, kapasitas) : 0})
                  </button>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-md ${selectedAsesiForJadwal.length > kapasitas && kapasitas > 0 ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-500'}`}>
                    {selectedAsesiForJadwal.length} asesi terpilih
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 pb-2">
                {!formData.scheme ? (
                  <div className="col-span-1 md:col-span-2 text-center py-8 text-slate-500 text-sm border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                    Pilih skema sertifikasi terlebih dahulu.
                  </div>
                ) : availableAsesi.length === 0 ? (
                  <div className="col-span-1 md:col-span-2 text-center py-8 text-slate-500 text-sm border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                    Tidak ada asesi yang tersedia untuk skema ini.
                  </div>
                ) : (
                  availableAsesi.map((asesi: any) => {
                    const isSelected = selectedAsesiForJadwal.includes(asesi.id);
                    const isDisabled = !isSelected && selectedAsesiForJadwal.length >= kapasitas && kapasitas > 0;
                    
                    return (
                      <div 
                        key={asesi.id} 
                        onClick={() => {
                        if (isPreviewMode) return;
                          if (isDisabled || isPreviewMode) return;
                          const newIds = isSelected 
                            ? selectedAsesiForJadwal.filter(id => id !== asesi.id)
                            : [...selectedAsesiForJadwal, asesi.id];
                          setSelectedAsesiForJadwal(newIds);
                        }}
                        className={`p-4 rounded-xl border transition-all flex items-center gap-4 ${
                          isDisabled ? 'opacity-50 cursor-not-allowed bg-slate-50 border-gray-200' : 'cursor-pointer'
                        } ${
                          isSelected
                            ? 'border-[#008BE3] bg-[#008BE3]/5 ring-1 ring-[#008BE3]/20'
                            : isDisabled ? '' : 'border-gray-200 hover:border-[#008BE3]/40 hover:bg-slate-50'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-[#008BE3] border-[#008BE3] text-white'
                            : isDisabled ? 'bg-slate-200 border-slate-300' : 'border-gray-300'
                        }`}>
                          {isSelected && <CheckSquare size={14} className="stroke-[3]" />}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-900 text-sm">{asesi.nama}</h4>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
          <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50/50">
            <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 text-sm font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer">{isPreviewMode ? "Kembali" : "Batal"}</button>
            {!isPreviewMode && <button onClick={handleAddSchedule} disabled={!formData.batchName || !formData.scheme || !formData.date || !formData.assessorName || !formData.tuk || selectedAsesiForJadwal.length === 0} className="px-6 py-2.5 text-sm font-bold text-white bg-[#008BE3] hover:bg-[#0076C2] rounded-xl transition-colors shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">Simpan Jadwal</button>}
          </div>
        </div>
      </div>
    );
  }

    if (isPlenoModalOpen) {
    return (
      <div className="p-8 pb-24 max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsPlenoModalOpen(false)} 
            className="w-10 h-10 rounded-xl flex items-center justify-center text-[#008BE3] bg-[#008BE3]/10 hover:bg-[#008BE3]/20 transition-colors cursor-pointer shrink-0"
            title="Kembali"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="min-w-0">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Jadwalkan Sidang Pleno</h1>
            <p className="text-sm text-slate-500 mt-1 font-medium">Buat jadwal sidang pleno baru untuk penetapan kelulusan</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden">
          <div className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="min-w-0">
                <label className="block text-sm font-bold text-slate-700 mb-2">Nama Batch/Grup</label>
                <input type="text" value={plenoForm.id} onChange={(e) => setPlenoForm({...plenoForm, id: e.target.value})} disabled={isPreviewMode} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40" placeholder="Contoh: BATCH-IT-2026-005" />
              </div>
              <div className="min-w-0">
                <label className="block text-sm font-bold text-slate-700 mb-2">Lokasi / Tautan Pertemuan</label>
                <input type="text" placeholder="Contoh: Ruang Rapat Lt. 2 atau Link Zoom/Meet" value={plenoForm.lokasi} onChange={(e) => setPlenoForm({...plenoForm, lokasi: e.target.value})} disabled={isPreviewMode} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="min-w-0">
                <label className="block text-sm font-bold text-slate-700 mb-2">Tanggal Sidang</label>
                <input type="date" value={plenoForm.tanggal} onChange={(e) => setPlenoForm({...plenoForm, tanggal: e.target.value})} disabled={isPreviewMode} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40" />
              </div>
              <div className="min-w-0">
                <label className="block text-sm font-bold text-slate-700 mb-2">Waktu Mulai</label>
                <input type="time" value={plenoForm.waktuMulai} onChange={(e) => setPlenoForm({...plenoForm, waktuMulai: e.target.value})} disabled={isPreviewMode} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40" />
              </div>
              <div className="min-w-0">
                <label className="block text-sm font-bold text-slate-700 mb-2">Waktu Selesai</label>
                <input type="time" value={plenoForm.waktuSelesai} onChange={(e) => setPlenoForm({...plenoForm, waktuSelesai: e.target.value})} disabled={isPreviewMode} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Surat Sidang Pleno <span className="text-[#008BE3] font-semibold text-xs">(PDF / Gambar, Maks. 10MB)</span>
              </label>
              
              <input
                ref={plenoFileInputRef}
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                disabled={isPreviewMode}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setPlenoForm(prev => ({
                        ...prev,
                        suratPlenoName: file.name,
                        suratPlenoUrl: reader.result as string
                      }));
                    };
                    reader.readAsDataURL(file);
                  }
                  e.target.value = '';
                }}
                className="hidden"
              />

              {plenoForm.suratPlenoName ? (
                <div className="border border-emerald-200 bg-emerald-50/70 rounded-xl p-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold">
                      <FileText size={20} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate flex items-center gap-1.5">
                        <CheckCircle size={15} className="shrink-0 text-emerald-600" /> {plenoForm.suratPlenoName}
                      </p>
                      {!isPreviewMode && (
                        <button
                          type="button"
                          onClick={() => plenoFileInputRef.current?.click()}
                          className="text-xs font-semibold text-[#008BE3] hover:underline mt-0.5 inline-block cursor-pointer"
                        >
                          Ganti File Surat
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Preview Button: Eye Icon Only */}
                    <button
                      type="button"
                      title="Lihat Pratinjau Surat / Foto"
                      onClick={() => {
                        setPreviewDocModal({
                          name: plenoForm.suratPlenoName || 'Surat Sidang Pleno',
                          url: getDocumentPreviewUrl(plenoForm.suratPlenoName, plenoForm.suratPlenoUrl)
                        });
                      }}
                      className="p-2.5 bg-[#008BE3] hover:bg-[#0076C2] text-white rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center"
                    >
                      <Eye size={18} />
                    </button>

                    {/* Delete Button: Trash Icon Only */}
                    {!isPreviewMode && (
                      <button
                        type="button"
                        title="Hapus Surat"
                        onClick={() => {
                          setPlenoForm(prev => ({
                            ...prev,
                            suratPlenoName: '',
                            suratPlenoUrl: ''
                          }));
                        }}
                        className="p-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 rounded-xl border border-rose-200 transition-colors cursor-pointer flex items-center justify-center"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => !isPreviewMode && plenoFileInputRef.current?.click()}
                  className={`border-2 border-dashed border-gray-200 hover:border-[#008BE3] rounded-xl p-4 text-center bg-slate-50/50 hover:bg-sky-50/30 transition-colors flex items-center justify-center gap-3 ${
                    isPreviewMode ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                >
                  <Upload size={22} className="text-[#008BE3] shrink-0" />
                  <div className="text-left min-w-0">
                    <p className="text-sm font-bold text-slate-700">Upload Surat Sidang Pleno</p>
                    <p className="text-xs text-slate-400">Pilih atau unggah file dokumen surat sidang pleno (PDF/JPG/PNG)</p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <label className="block text-sm font-bold text-slate-800">Pilih Asesi Sidang Pleno</label>
                  <p className="text-xs text-slate-500">Menampilkan seluruh asesi yang sudah selesai dinilai oleh asesor dan siap disidangkan</p>
                </div>
                <span className="text-xs font-bold text-[#008BE3] bg-[#008BE3]/10 px-2.5 py-1 rounded-md self-start sm:self-auto shrink-0">
                  {selectedAsesiForPleno.length} asesi terpilih
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 pb-2">
                {availableAsesiForPleno.length === 0 ? (
                  <div className="col-span-full text-center py-8 text-slate-500 text-sm border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                    Tidak ada asesi yang selesai dinilai dan siap untuk disidangkan.
                  </div>
                ) : (
                  availableAsesiForPleno.map(asesi => {
                    const isSelected = selectedAsesiForPleno.includes(asesi.id) || selectedAsesiForPleno.includes(asesi.nama);
                    return (
                      <div 
                        key={asesi.id} 
                        onClick={() => {
                          if (isPreviewMode) return;
                          const newIds = isSelected
                            ? selectedAsesiForPleno.filter(id => id !== asesi.id && id !== asesi.nama)
                            : [...selectedAsesiForPleno, asesi.id];
                          setSelectedAsesiForPleno(newIds);
                        }}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center gap-3.5 ${
                          isSelected
                            ? 'border-[#008BE3] bg-[#008BE3]/5 ring-1 ring-[#008BE3]/20'
                            : 'border-gray-200 hover:border-[#008BE3]/40 hover:bg-slate-50'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-[#008BE3] border-[#008BE3] text-white'
                            : 'border-gray-300'
                        }`}>
                          {isSelected && <CheckSquare size={14} className="stroke-[3]" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="font-bold text-slate-900 text-sm truncate">{asesi.nama}</h4>
                            {asesi.hasil && (
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                                asesi.hasil === 'Kompeten' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                              }`}>
                                {asesi.hasil}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#008BE3] font-semibold truncate mt-0.5" title={asesi.skema}>
                            {asesi.skema}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <label className="block text-sm font-bold text-slate-800">Daftar Peserta Sidang Pleno</label>
                  <p className="text-xs text-slate-500">Pilih peran/jabatan lalu centang nama user yang bertugas</p>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-slate-600 shrink-0">Filter Peran:</label>
                  <select 
                    value={selectedPlenoRole}
                    onChange={(e) => setSelectedPlenoRole(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-xs font-bold outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40 bg-white"
                  >
                    <option value="Asesor">Asesor</option>
                    <option value="Direktur">Direktur</option>
                    <option value="Dewan Pengarah">Dewan Pengarah</option>
                    <option value="Komite Skema">Komite Skema</option>
                    <option value="Manajer Administrasi dan Keuangan">Manajer Administrasi dan Keuangan</option>
                    <option value="Manajer Standardisasi">Manajer Standardisasi</option>
                    <option value="Manajer Manajemen Mutu">Manajer Manajemen Mutu</option>
                    <option value="Manajer Sertifikasi">Manajer Sertifikasi</option>
                    <option value="Semua Peran">Semua Peran</option>
                  </select>
                </div>
              </div>

              {/* Selected attendees tags */}
              {plenoForm.plenoAttendees.filter(a => a.nama.trim() !== '').length > 0 && (
                <div className="p-3 bg-sky-50/50 border border-sky-100 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">
                      Peserta Terpilih ({plenoForm.plenoAttendees.filter(a => a.nama.trim() !== '').length}):
                    </span>
                    {!isPreviewMode && (
                      <button 
                        type="button" 
                        onClick={() => setPlenoForm(prev => ({ ...prev, plenoAttendees: [] }))}
                        className="text-[11px] text-red-500 hover:underline font-semibold cursor-pointer"
                      >
                        Hapus Semua
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {plenoForm.plenoAttendees.filter(a => a.nama.trim() !== '').map((att, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#008BE3]/30 text-[#008BE3] rounded-lg text-xs font-bold shadow-2xs">
                        <span className="text-slate-500 font-normal">[{att.role}]</span> {att.nama}
                        {!isPreviewMode && (
                          <button 
                            type="button" 
                            onClick={() => toggleAttendeeSelection(att)}
                            className="hover:text-red-500 ml-1 cursor-pointer"
                          >
                            <X size={12} />
                          </button>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Checkbox grid of user candidates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[260px] overflow-y-auto pr-1">
                {(() => {
                  const mergedUsers = [...ALL_PLENO_USERS];
                  plenoForm.plenoAttendees.forEach(att => {
                    if (att.nama.trim() && !mergedUsers.some(u => u.nama === att.nama && u.role === att.role)) {
                      mergedUsers.push({
                        id: `custom-${att.role}-${att.nama}`,
                        nama: att.nama,
                        role: att.role
                      });
                    }
                  });

                  const filtered = selectedPlenoRole === 'Semua Peran'
                    ? mergedUsers
                    : mergedUsers.filter(u => u.role === selectedPlenoRole);

                  if (filtered.length === 0) {
                    return (
                      <div className="col-span-full text-center py-6 text-slate-500 text-xs border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                        Tidak ada user terdaftar untuk peran {selectedPlenoRole}.
                      </div>
                    );
                  }

                  return filtered.map(usr => {
                    const selected = isAttendeeSelected(usr.nama, usr.role);
                    return (
                      <div
                        key={usr.id}
                        onClick={() => toggleAttendeeSelection(usr)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                          selected
                            ? 'border-[#008BE3] bg-[#008BE3]/5 ring-1 ring-[#008BE3]/20'
                            : 'border-gray-200 hover:border-[#008BE3]/40 hover:bg-slate-50'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 ${
                          selected
                            ? 'bg-[#008BE3] border-[#008BE3] text-white'
                            : 'border-gray-300'
                        }`}>
                          {selected && <CheckSquare size={14} className="stroke-[3]" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-slate-900 text-sm truncate">{usr.nama}</h4>
                          <span className="text-[11px] font-semibold text-[#008BE3] bg-[#008BE3]/10 px-2 py-0.5 rounded-md inline-block mt-1">
                            {usr.role}
                          </span>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </div>
          
          <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50/50">
            <button onClick={() => setIsPlenoModalOpen(false)} className="px-6 py-2.5 text-sm font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition-colors">{isPreviewMode ? "Kembali" : "Batal"}</button>
            {!isPreviewMode && (
              <button 
                onClick={handleAddPleno} 
                disabled={selectedAsesiForPleno.length === 0 || !plenoForm.tanggal}
                className="px-6 py-2.5 text-sm font-bold text-white bg-[#008BE3] hover:bg-[#0076C2] rounded-xl transition-colors shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Jadwalkan Sidang Pleno
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC] p-4 md:p-8 space-y-6 pb-24 text-sm text-gray-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-[#008BE3]/10 flex items-center justify-center text-[#008BE3] border border-[#008BE3]/20 shadow-xs shrink-0">
            <Calendar size={20} className="stroke-[2.5]" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">
              Jadwal & Penugasan
            </h1>
            <p className="text-xs text-gray-500 font-medium tracking-wider uppercase leading-[16px]">
              Kelola jadwal asesmen dan sidang pleno penetapan kelulusan
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-1 rounded-xl shadow-xs border border-gray-100 flex items-center w-full max-w-sm">
        <button
          onClick={() => setActiveTab('asesmen')}
          className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'asesmen' ? 'bg-[#008BE3] text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
        >
          Jadwal Asesmen
        </button>
        <button
          onClick={() => setActiveTab('pleno')}
          className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'pleno' ? 'bg-[#008BE3] text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
        >
          Sidang Pleno
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden">
        <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
          <div className="flex-1 min-w-0 order-1">
            <div className="flex items-center gap-2 bg-gray-50/80 rounded-lg px-2 sm:px-3 h-[42px] w-full border border-gray-200/50 focus-within:border-[#008BE3]/40 transition-colors">
              <Search size={16} className="text-gray-400 shrink-0" />
              <input 
                type="text" 
                placeholder={activeTab === 'asesmen' ? "Cari batch..." : "Cari skema..."} 
                className="bg-transparent border-none outline-none text-[13px] sm:text-sm w-full font-medium placeholder:text-gray-400 min-w-0"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 shrink-0 order-2">
            <div className="relative">
              <button 
                onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                className="items-center justify-center gap-2 px-3 py-2.5 sm:px-4 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-bold shadow-xs hover:bg-gray-50 transition-colors flex shrink-0"
              >
                <Filter size={16} /> <span className="hidden sm:inline">Filter</span> {filterStatus !== 'Semua' && <span className="bg-[#008BE3] text-white text-[10px] px-1.5 py-0.5 rounded-full">{filterStatus}</span>}
              </button>
              
              <AnimatePresence>
                {isFilterDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-20"
                  >
                    <div className="p-2 space-y-1">
                      {['Semua', 'Terjadwal', 'Dikonfirmasi', 'Selesai'].map((status) => (
                        <button
                          key={status}
                          onClick={() => {
                            setFilterStatus(status);
                            setIsFilterDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === status ? 'bg-[#008BE3]/10 text-[#008BE3]' : 'text-gray-700 hover:bg-gray-50'}`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {activeTab === 'asesmen' && !readOnly && (
              <button 
                onClick={() => {
                  setIsPreviewMode(false);
                  setIsEditMode(false);
                  setFormData({
                    batchName: '',
                    scheme: '',
                    date: '',
                    startTime: '',
                    endTime: '',
                    candidatesCount: 0,
                    assessorName: '',
                    suratPenugasanName: '',
                    tuk: '',
                    tukType: '',
                    status: 'Terjadwal'
                  });
                  setSelectedAsesiForJadwal([]);
                  setIsModalOpen(true);
                }}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 sm:px-4 sm:gap-2 bg-[#008BE3] text-white rounded-lg text-sm font-bold shadow-xs hover:bg-[#0076C2] transition-colors shrink-0 cursor-pointer"
              >
                <Plus size={16} className="stroke-[2.5]" /> <span className="hidden sm:inline">Buat Jadwal Baru</span><span className="sm:hidden">Baru</span>
              </button>
            )}
            {activeTab === 'pleno' && !readOnly && (
              <button 
                onClick={() => {
                  setIsPreviewMode(false);
                  setIsEditMode(false);
                  setPlenoForm({
                    id: '',
                    tanggal: '',
                    waktuMulai: '',
                    waktuSelesai: '',
                    skema: '',
                    lokasi: 'Ruang Rapat Utama (Offline)',
                    detailLokasi: '',
                    deskripsi: '',
                    plenoAttendees: [{ role: '', nama: '' }],
                    suratPlenoName: ''
                  });
                  setSelectedAsesiForPleno([]);
                  setIsPlenoModalOpen(true);
                }}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 sm:px-4 sm:gap-2 bg-[#008BE3] text-white rounded-lg text-sm font-bold shadow-xs hover:bg-[#0076C2] transition-colors shrink-0 cursor-pointer"
              >
                <Plus size={16} className="stroke-[2.5]" /> <span className="hidden sm:inline">Buat Sidang Pleno</span><span className="sm:hidden">Pleno</span>
              </button>
            )}
          </div>
        </div>
        
        <div className="overflow-x-auto">
          {activeTab === 'asesmen' && (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0F172A] border-b border-[#0F172A]">
                  <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider min-w-[200px]">Nama Batch/Grup</th>
                  <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider min-w-[150px]">Tanggal Uji</th>
                  <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider min-w-[150px]">Jumlah Asesi</th>
                  <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider min-w-[200px]">Asesor Ditugaskan</th>
                  {!readOnly && (
                    <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider min-w-[150px] text-left sticky right-0 bg-[#0F172A] z-10 border-l border-white/10 shadow-[-6px_0_15px_-4px_rgba(0,0,0,0.06)]">Aksi</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/60">
                {filteredSchedules.filter(s => s.status !== 'Selesai').map(item => (
                  <tr key={item.id} className="group/row hover:bg-[#F9FAFC] transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-slate-900">{item.batchName}</div>
                      <div className="text-xs text-gray-500 font-medium">{item.scheme}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-700 font-medium">{formatDate(item.date)}</div>
                      <div className="text-[10px] text-gray-500 font-bold mt-1 inline-block bg-slate-100 px-2 py-0.5 rounded uppercase tracking-wider">
                        {item.startTime || "08:00"} - {item.endTime || "12:00"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700 font-medium">{item.candidatesCount} Asesi</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-[#E6F4FF] text-[#008BE3] flex items-center justify-center text-[10px] font-bold border border-[#BCE0FD] shrink-0">{item.assessorInitial}</div>
                        <div className="min-w-0">
                          <span className="text-sm font-bold text-slate-700 block truncate">{item.assessorName}</span>
                          {item.suratPenugasanName && (
                            <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 mt-0.5" title={item.suratPenugasanName}>
                              <FileText size={12} className="shrink-0" />
                              <span className="truncate max-w-[140px]">{item.suratPenugasanName}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    {!readOnly && (
                    <td className="px-6 py-4 sticky right-0 bg-white group-hover/row:bg-[#F9FAFC] z-10 border-l border-gray-100 shadow-[-6px_0_15px_-4px_rgba(0,0,0,0.02)]">
                      <div className="flex items-center gap-2"><button onClick={() => setConfirmAsesmenId(item.id)} className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">Selesai?</button><button onClick={() => handlePreviewAsesmen(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Eye size={16} /></button><button onClick={() => handleEditAsesmen(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><FileEdit size={16} /></button><button onClick={() => handleDeleteSchedule(item.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button></div>
                    </td>
                    )}
                  </tr>
                ))}
                {filteredSchedules.filter(s => s.status !== 'Selesai').length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-xs md:text-sm text-gray-400 font-medium">
                      Tidak ada jadwal asesmen aktif.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
          
          {activeTab === 'pleno' && (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0F172A]">
                  <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider min-w-[200px]">Nama Batch/Grup</th>
                  <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider min-w-[180px]">Jadwal</th>
                  <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider min-w-[180px]">Lokasi</th>
                  <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider min-w-[120px]">Jml Asesi</th>
                  {!readOnly && (
                    <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider min-w-[150px] text-left sticky right-0 bg-[#0F172A] z-10 border-l border-white/10 shadow-[-6px_0_15px_-4px_rgba(0,0,0,0.06)]">Aksi</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/60">
                {filteredPleno.filter(p => p.status !== 'Selesai').length > 0 ? (
                  filteredPleno.filter(p => p.status !== 'Selesai').map((item) => (
                    <tr key={item.id} className="group/row hover:bg-[#F9FAFC] transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-slate-900">{item.id}</div>
                        <div className="text-xs text-gray-500 font-medium">{item.skema}</div>
                        {item.suratPlenoName && (
                          <button
                            type="button"
                            onClick={() => setPreviewDocModal({
                              name: item.suratPlenoName || 'Surat Sidang Pleno',
                              url: getDocumentPreviewUrl(item.suratPlenoName, item.suratPlenoUrl)
                            })}
                            className="text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 px-2.5 py-1 rounded-lg inline-flex items-center gap-1.5 mt-1.5 transition-colors cursor-pointer group/doc"
                            title="Klik untuk melihat foto/isi surat"
                          >
                            <FileText size={13} className="shrink-0 text-emerald-600" />
                            <span className="truncate max-w-[130px]">{item.suratPlenoName}</span>
                            <Eye size={12} className="shrink-0 text-emerald-600 group-hover/doc:scale-110 transition-transform" />
                          </button>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs md:text-sm font-semibold text-gray-600">
                        <div className="flex flex-col gap-1">
                          <span className="inline-flex items-center gap-1.5"><Calendar size={13} className="text-gray-400" /> {formatDate(item.tanggal)}</span>
                          <span className="inline-flex items-center gap-1.5"><Clock size={13} className="text-gray-400" /> {item.waktu}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs md:text-sm font-medium text-gray-700">
                        <div className="flex flex-col gap-1">
                          <span className="inline-flex items-center gap-1.5"><MapPin size={14} className="text-gray-400" /> {item.lokasi}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs md:text-sm font-bold text-gray-700">
                        <div className="flex flex-col gap-1">
                          <span>{item.jumlahAsesi} Orang</span>
                        </div>
                      </td>
                      {!readOnly && (
                      <td className="px-6 py-4 sticky right-0 bg-white group-hover/row:bg-[#F9FAFC] z-10 border-l border-gray-100 shadow-[-6px_0_15px_-4px_rgba(0,0,0,0.02)]">
                        <div className="flex items-center gap-2"><button onClick={() => setConfirmPlenoId(item.id)} className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">Selesai?</button><button onClick={() => handleEditPleno(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><FileEdit size={16} /></button><button onClick={() => handlePreviewPleno(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Eye size={16} /></button><button onClick={() => handleDeletePleno(item.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button></div>
                      </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-xs md:text-sm text-gray-400 font-medium">
                      Tidak ada jadwal sidang pleno aktif.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}


        </div>
      </div>

      

      {/* Modals for Confirmation */}
      <AnimatePresence>
        {confirmAsesmenId !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setConfirmAsesmenId(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-sm relative z-10 overflow-hidden"
            >
              <div className="p-6">
                <h3 className="font-bold text-slate-900 text-lg mb-2">Konfirmasi Asesmen</h3>
                <p className="text-sm text-slate-500">Apakah anda yakin asesmen telah selesai?</p>
              </div>
              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50/50">
                <button onClick={() => setConfirmAsesmenId(null)} className="px-4 py-2 text-sm font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors">Batal</button>
                <button onClick={handleSelesaiSchedule} className="px-4 py-2 text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors shadow-xs">Ya, Selesai</button>
              </div>
            </motion.div>
          </div>
        )}

        {confirmPlenoId !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setConfirmPlenoId(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-sm relative z-10 overflow-hidden"
            >
              <div className="p-6">
                <h3 className="font-bold text-slate-900 text-lg mb-2">Konfirmasi Sidang Pleno</h3>
                <p className="text-sm text-slate-500">Apakah anda yakin sidang pleno telah selesai?</p>
              </div>
              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50/50">
                <button onClick={() => setConfirmPlenoId(null)} className="px-4 py-2 text-sm font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors">Batal</button>
                <button onClick={handleSelesaiPleno} className="px-4 py-2 text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors shadow-xs">Ya, Selesai</button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Lightbox / Preview Modal Surat Sidang Pleno */}
        {previewDocModal !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setPreviewDocModal(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full relative z-10 overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[#008BE3]/10 text-[#008BE3] flex items-center justify-center shrink-0 font-bold">
                    <FileText size={18} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-900 text-sm truncate">{previewDocModal.name}</h3>
                    <p className="text-xs text-slate-500">Pratinjau Dokumen / Foto Surat Sidang Pleno</p>
                  </div>
                </div>
                <button
                  onClick={() => setPreviewDocModal(null)}
                  className="w-8 h-8 rounded-full hover:bg-gray-200/60 flex items-center justify-center text-gray-500 hover:text-slate-800 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto flex-1 bg-slate-100/80 flex justify-center items-center min-h-[300px]">
                {previewDocModal.url.startsWith('data:image') || previewDocModal.url.startsWith('http') ? (
                  <img
                    src={previewDocModal.url}
                    alt={previewDocModal.name}
                    className="max-h-[65vh] w-auto max-w-full rounded-xl shadow-md border border-slate-200 object-contain bg-white"
                  />
                ) : (
                  <iframe
                    src={previewDocModal.url}
                    title={previewDocModal.name}
                    className="w-full h-[60vh] rounded-xl shadow-md border border-slate-200 bg-white"
                  />
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-3.5 border-t border-gray-100 flex items-center justify-between bg-white">
                <span className="text-xs text-slate-500 font-medium truncate max-w-[250px]">
                  {previewDocModal.name}
                </span>
                <div className="flex items-center gap-2">
                  <a
                    href={previewDocModal.url}
                    download={previewDocModal.name}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors inline-flex items-center gap-1.5"
                  >
                    Buka / Unduh File
                  </a>
                  <button
                    onClick={() => setPreviewDocModal(null)}
                    className="px-4 py-2 text-xs font-bold text-white bg-[#008BE3] hover:bg-[#0076C2] rounded-xl transition-colors cursor-pointer"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
