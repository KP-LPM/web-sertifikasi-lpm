import React, { useState, useEffect } from "react";
import {
  Scale,
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  FileText,
  Download,
  Printer,
  Save,
  ArrowLeft,
  ExternalLink,
  Link2,
  FileCheck,
  AlertCircle,
  Sparkles,
  Search,
  Filter,
  Check,
  MapPin,
  Eye,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAppContext } from "@/context/context";
import { AsesiPlenoItem, PlenoDetailData } from "@/types/types";

const DEFAULT_PLENO_SESSIONS: PlenoDetailData[] = [
  {
    id: "PLN-2026-001",
    batchCode: "BATCH-IT-2026-001",
    title: "Sidang Pleno Penetapan Uji Kompetensi Batch 1 Auditor Halal",
    skema: "Auditor Halal",
    noSK: "SK/LSP-UIN/PLN/2026/001",
    notulis: "Siti Rahmawati, S.T.",
    tanggal: "16-18 Oktober 2026",
    waktu: "09:00 - 11:00 WIB",
    lokasi: "Ruang Rapat Utama Gedung A, Lantai 2",
    linkSuratBeritaPleno:
      "https://drive.google.com/file/d/berita-pleno-001/view?usp=sharing",
    linkSuratKeputusanDirektur:
      "https://drive.google.com/file/d/sk-direktur-001/view?usp=sharing",
    linkSuratBlankoBNSP:
      "https://drive.google.com/file/d/blanko-bnsp-001/view?usp=sharing",
    linkSuratHasil:
      "https://drive.google.com/file/d/sk-direktur-001/view?usp=sharing",
    status: "Belum Ditetapkan",
    plenoAttendees: [
      { role: "Direktur", nama: "Prof. Dr. H. Ahmad" },
      { role: "Dewan Pengarah", nama: "Dr. Ir. H. Muhammad Zulkifli, M.T." },
      { role: "Notulis", nama: "Siti Rahmawati, S.T." },
      { role: "Komite Skema", nama: "Asep Abdul Sahid, M.T." },
    ],
    asesiList: [
      {
        id: "1",
        nim: "1217050001",
        nama: "Ahmad Hidayat",
        skema: "Auditor Halal",
        asesor: "Ichsan Taufik, M.T.",
        rekomendasiAsesor: "K",
        statusPleno: "K",
        catatan: "Dokumen portofolio lengkap dan valid",
      },
      {
        id: "2",
        nim: "1217050002",
        nama: "Budi Pratama",
        skema: "Auditor Halal",
        asesor: "Aceng Abdul Kodir, M.Kom.",
        rekomendasiAsesor: "K",
        statusPleno: "K",
        catatan: "Memenuhi seluruh elemen kriteria kerja",
      },
      {
        id: "3",
        nim: "1217050003",
        nama: "Dina Larasati",
        skema: "Auditor Halal",
        asesor: "Susanti Ainul Fitri, M.T.",
        rekomendasiAsesor: "BK",
        statusPleno: "BK",
        catatan: "Belum melengkapi bukti kerja unit 3",
      },
      {
        id: "4",
        nim: "1217050004",
        nama: "Eko Prasetyo",
        skema: "Auditor Halal",
        asesor: "M Sandi Marta, M.T.",
        rekomendasiAsesor: "K",
        statusPleno: "K",
        catatan: "Hasil wawancara dan observasi memuaskan",
      },
      {
        id: "5",
        nim: "1217050005",
        nama: "Fitri Handayani",
        skema: "Auditor Halal",
        asesor: "Gina Sakinah, M.T.",
        rekomendasiAsesor: "K",
        statusPleno: "K",
        catatan: "Seluruh unit kompetensi terpenuhi",
      },
      {
        id: "6",
        nim: "1217050006",
        nama: "Gitarja Nugraha",
        skema: "Auditor Halal",
        asesor: "Elis Ratna Wulan, M.Si.",
        rekomendasiAsesor: "BK",
        statusPleno: "K",
        catatan: "Direvisi saat pleno berdasarkan kelengkapan berkas banding",
      },
    ],
  },
  {
    id: "PLN-2026-002",
    batchCode: "BATCH-NET-2026-002",
    title: "Sidang Pleno Penetapan Hasil Kewirausahaan Industri Gelombang 2",
    skema: "Jenjang 5 Bidang Kewirausahaan Industri",
    noSK: "SK/LSP-UIN/PLN/2026/002",
    notulis: "Ahmad Syahputra, S.E., M.M.",
    tanggal: "21-23 Oktober 2026",
    waktu: "13:00 - 15:00 WIB",
    lokasi: "Zoom Meeting Room 1 (Online)",
    linkSuratBeritaPleno: "",
    linkSuratHasil: "",
    status: "Belum Ditetapkan",
    plenoAttendees: [
      { role: "Direktur", nama: "Prof. Dr. H. Ahmad" },
      { role: "Notulis", nama: "Ahmad Syahputra, S.E., M.M." },
      { role: "Komite Skema", nama: "Siti Alia, M.T." },
    ],
    asesiList: [
      {
        id: "7",
        nim: "1217050007",
        nama: "Hendra Setiawan",
        skema: "Jenjang 5 Bidang Kewirausahaan Industri",
        asesor: "Asep Abdul Sahid, M.T.",
        rekomendasiAsesor: "K",
        statusPleno: "K",
      },
      {
        id: "8",
        nim: "1217050008",
        nama: "Indah Permata",
        skema: "Jenjang 5 Bidang Kewirausahaan Industri",
        asesor: "Siti Alia, M.T.",
        rekomendasiAsesor: "K",
        statusPleno: "K",
      },
      {
        id: "9",
        nim: "1217050009",
        nama: "Joko Susilo",
        skema: "Jenjang 5 Bidang Kewirausahaan Industri",
        asesor: "Azmi Fasa, M.Kom.",
        rekomendasiAsesor: "BK",
        statusPleno: "BK",
      },
      {
        id: "10",
        nim: "1217050010",
        nama: "Kurnia Putri",
        skema: "Jenjang 5 Bidang Kewirausahaan Industri",
        asesor: "Cucu Susilawati, M.Pd.",
        rekomendasiAsesor: "K",
        statusPleno: "K",
      },
    ],
  },
  {
    id: "PLN-2026-003",
    batchCode: "BATCH-PRG-2026-003",
    title: "Sidang Pleno Skema Komunikasi Pemangku Kepentingan",
    skema: "Melaksanakan Komunikasi Dengan Pemangku Kepentingan",
    noSK: "SK/LSP-UIN/PLN/2026/003",
    notulis: "Rina Fitriani, S.Kom., M.T.",
    tanggal: "25-27 Oktober 2026",
    waktu: "10:00 - 12:00 WIB",
    lokasi: "Ruang Sidang Lt. 3 Gedung Rektorat",
    linkSuratBeritaPleno:
      "https://drive.google.com/file/d/berita-pleno-003/view",
    linkSuratHasil: "https://drive.google.com/file/d/3x4y5z/view",
    status: "Selesai",
    plenoAttendees: [
      { role: "Direktur", nama: "Prof. Dr. H. Ahmad" },
      { role: "Notulis", nama: "Rina Fitriani, S.Kom., M.T." },
      { role: "Dewan Pengarah", nama: "Dr. Ir. H. Muhammad Zulkifli, M.T." },
    ],
    asesiList: [
      {
        id: "11",
        nim: "1217050011",
        nama: "Lani Wijaya",
        skema: "Melaksanakan Komunikasi Dengan Pemangku Kepentingan",
        asesor: "Fitri Pebriani Wahyu, M.T.",
        rekomendasiAsesor: "K",
        statusPleno: "K",
      },
      {
        id: "12",
        nim: "1217050012",
        nama: "Muhammad Rizky",
        skema: "Melaksanakan Komunikasi Dengan Pemangku Kepentingan",
        asesor: "Tina Dewi Rosahdi, M.T.",
        rekomendasiAsesor: "K",
        statusPleno: "K",
      },
    ],
  },
];

export function SidangPleno() {
  const { user } = useAppContext();
  const readOnly = user?.role !== "admin";

  // List State
  const [sessions, setSessions] = useState<PlenoDetailData[]>(
    DEFAULT_PLENO_SESSIONS,
  );
  const [selectedPlenoId, setSelectedPlenoId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");

  // Detail Form State
  const [activeSession, setActiveSession] = useState<PlenoDetailData | null>(
    null,
  );
  const [formData, setFormData] = useState<PlenoDetailData | null>(null);

  // Dirty & Saved State Management for Save / Generate requirements
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [hasSavedAtLeastOnce, setHasSavedAtLeastOnce] = useState<boolean>(true);
  const [showSaveToast, setShowSaveToast] = useState<boolean>(false);
  const [toastText, setToastText] = useState<{ title: string; desc: string }>({
    title: "Data Sidang Pleno Berhasil Disimpan!",
    desc: "Tombol Generate Surat kini aktif dan siap digunakan.",
  });

  // Modal Input states for document generation
  const [isBeritaAcaraModalOpen, setIsBeritaAcaraModalOpen] =
    useState<boolean>(false);
  const [isSKDirekturModalOpen, setIsSKDirekturModalOpen] =
    useState<boolean>(false);
  const [isBlankoBNSPModalOpen, setIsBlankoBNSPModalOpen] =
    useState<boolean>(false);

  const [beritaAcaraKota, setBeritaAcaraKota] = useState<string>("Bandung");
  const [skDirekturNomor, setSkDirekturNomor] = useState<string>("");
  const [skDirekturKota, setSkDirekturKota] = useState<string>("Bandung");
  const [blankoBNSPKota, setBlankoBNSPKota] = useState<string>("Bandung");

  // Preview Document Modal state
  const [isGenerateModalOpen, setIsGenerateModalOpen] =
    useState<boolean>(false);
  const [activeDocType, setActiveDocType] = useState<
    "berita_acara" | "sk_direktur" | "blanko_bnsp"
  >("sk_direktur");

  const handleOpenBeritaAcaraModal = () => {
    setBeritaAcaraKota("Bandung");
    setIsBeritaAcaraModalOpen(true);
  };

  const handleOpenSKDirekturModal = () => {
    setSkDirekturNomor(formData?.noSK || "SK/LSP-UIN/PLN/2026/001");
    setSkDirekturKota("Bandung");
    setIsSKDirekturModalOpen(true);
  };

  const handleOpenBlankoBNSPModal = () => {
    setBlankoBNSPKota("Bandung");
    setIsBlankoBNSPModalOpen(true);
  };

  const handleConfirmBeritaAcara = (e: React.FormEvent) => {
    e.preventDefault();
    if (!beritaAcaraKota.trim()) {
      alert("Mohon masukkan Kota Ditetapkan terlebih dahulu.");
      return;
    }
    setIsBeritaAcaraModalOpen(false);
    setActiveDocType("berita_acara");
    setIsGenerateModalOpen(true);
  };

  const handleConfirmSKDirektur = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skDirekturNomor.trim() || !skDirekturKota.trim()) {
      alert("Mohon lengkapi Nomor Surat dan Kota Ditetapkan.");
      return;
    }
    if (formData) {
      setFormData((prev) => (prev ? { ...prev, noSK: skDirekturNomor } : null));
    }
    setIsSKDirekturModalOpen(false);
    setActiveDocType("sk_direktur");
    setIsGenerateModalOpen(true);
  };

  const handleConfirmBlankoBNSP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blankoBNSPKota.trim()) {
      alert("Mohon masukkan Kota Ditetapkan terlebih dahulu.");
      return;
    }
    setIsBlankoBNSPModalOpen(false);
    setActiveDocType("blanko_bnsp");
    setIsGenerateModalOpen(true);
  };

  // Load session into formData when selectedPlenoId changes
  useEffect(() => {
    if (selectedPlenoId) {
      const found = sessions.find((s) => s.id === selectedPlenoId);
      if (found) {
        const clone = JSON.parse(JSON.stringify(found));
        setActiveSession(clone);
        setFormData(clone);
        setIsDirty(false);
        setHasSavedAtLeastOnce(true);
      }
    } else {
      setActiveSession(null);
      setFormData(null);
      setIsDirty(false);
    }
  }, [selectedPlenoId, sessions]);

  // Handle Form Inputs Change
  const handleInputChange = <K extends keyof PlenoDetailData>(
    field: K,
    value: PlenoDetailData[K],
  ) => {
    if (!formData) return;
    setFormData((prev) => {
      if (!prev) return null;
      return { ...prev, [field]: value };
    });
    setIsDirty(true);
    setHasSavedAtLeastOnce(false);
  };

  // Handle Changing Candidate Status (K / BK)
  const handleAsesiStatusChange = (asesiId: string, newStatus: "K" | "BK") => {
    if (!formData) return;
    setFormData((prev) => {
      if (!prev) return null;
      const currentList: AsesiPlenoItem[] = (prev.asesiList || []).map(
        (item, idx) => {
          if (typeof item === "object" && item !== null) {
            return item as AsesiPlenoItem;
          }
          return {
            id: String(item),
            nim: `121705${1000 + idx}`,
            nama: `Asesi ${idx + 1}`,
            skema: prev.skema || "",
            asesor: "Asesor LSP",
            rekomendasiAsesor: "K",
            statusPleno: "K",
          };
        },
      );
      const updatedList = currentList.map((a) =>
        a.id === asesiId ? { ...a, statusPleno: newStatus } : a,
      );
      return { ...prev, asesiList: updatedList };
    });
    setIsDirty(true);
    setHasSavedAtLeastOnce(false);
  };

  // Save Functionality
  const handleSave = () => {
    if (!formData) return;

    // Update session list
    const updatedSessions = sessions.map((s) =>
      s.id === formData.id ? { ...formData } : s,
    );
    setSessions(updatedSessions);
    setActiveSession(JSON.parse(JSON.stringify(formData)));

    setIsDirty(false);
    setHasSavedAtLeastOnce(true);

    // Show Toast
    setToastText({
      title: "Data Sidang Pleno Berhasil Disimpan!",
      desc: "Tombol Generate Surat kini aktif dan siap digunakan.",
    });
    setShowSaveToast(true);
    setTimeout(() => setShowSaveToast(false), 3500);
  };

  // Quick Action to complete plenary session directly from table
  const handleCompletePlenoSession = (sessionId: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, status: "Selesai" } : s)),
    );
    setToastText({
      title: "Sidang Pleno Berhasil Diselesaikan!",
      desc: "Status sidang pleno telah diperbarui menjadi Selesai.",
    });
    setShowSaveToast(true);
    setTimeout(() => setShowSaveToast(false), 3500);
  };

  // Filtered Sessions for Table List
  const filteredSessions = sessions.filter((s) => {
    const matchesSearch =
      s.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.batchCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.noSK?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.skema.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterStatus === "Semua") return matchesSearch;
    return matchesSearch && s.status === filterStatus;
  });

  const normalizedAsesiList: AsesiPlenoItem[] = (formData?.asesiList || []).map(
    (item, idx) => {
      if (typeof item === "object" && item !== null) {
        return item as AsesiPlenoItem;
      }
      return {
        id: String(item),
        nim: `121705${1000 + idx}`,
        nama: `Asesi ${idx + 1}`,
        skema: formData?.skema || "",
        asesor: "Asesor LSP",
        rekomendasiAsesor: "K",
        statusPleno: "K",
      };
    },
  );

  return (
    <div className="min-h-screen bg-[#F8F9FC] p-3 sm:p-6 md:p-8 space-y-4 sm:space-y-6 pb-24 text-sm text-gray-700">
      <AnimatePresence>
        {showSaveToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-5 py-3.5 rounded-xl shadow-xl flex items-center gap-3 border border-emerald-500"
          >
            <CheckCircle size={20} className="shrink-0" />
            <div>
              <p className="text-sm font-bold">{toastText.title}</p>
              <p className="text-xs text-emerald-100">{toastText.desc}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* VIEW 1: TABLE DAFTAR SIDANG PLENO */}
      {!selectedPlenoId && (
        <div className="space-y-4 sm:space-y-6">
          {/* Header Title - Aligned with other pages */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-[#008BE3]/10 flex items-center justify-center text-[#008BE3] border border-[#008BE3]/20 shadow-xs shrink-0">
                <Scale size={20} className="stroke-[2.5]" />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">
                  Sidang Pleno
                </h2>
                <p className="text-xs text-gray-500 font-medium tracking-wider uppercase leading-[16px]">
                  Pelaksanaan & Hasil Sidang Pleno Komite Teknis
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-gray-100 text-xs font-bold text-slate-700 shadow-2xs shrink-0">
              <FileCheck size={16} className="text-[#008BE3]" />
              <span>Total: {sessions.length} Pelaksanaan Pleno</span>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="relative w-full sm:w-80">
              <Search
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                size={17}
              />
              <input
                type="text"
                placeholder="Cari Batch, SK, atau Skema..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3] outline-none transition-all"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <Filter size={16} className="text-slate-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-700 outline-none focus:border-[#008BE3] cursor-pointer"
              >
                <option value="Semua">Semua Status</option>
                <option value="Belum Ditetapkan">Belum Ditetapkan</option>
                <option value="Selesai">Selesai</option>
              </select>
            </div>
          </div>

          {/* Tabel Sidang Pleno */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="bg-slate-900 text-white whitespace-nowrap">
                    <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider min-w-[200px]">
                      Nama Sidang Pleno
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider min-w-[180px]">
                      Tanggal Pelaksanaan
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider min-w-[180px]">
                      TUK
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider min-w-[120px]">
                      Total Asesi
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider min-w-[140px]">
                      Status Sidang
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-center min-w-[160px] sticky right-0 bg-slate-900">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredSessions.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-12 text-center text-slate-400"
                      >
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Scale
                            size={36}
                            className="text-slate-300 stroke-[1.5]"
                          />
                          <p className="text-sm font-bold text-slate-600">
                            Tidak ada data Sidang Pleno ditemukan
                          </p>
                          <p className="text-xs text-slate-400">
                            Coba ubah kata kunci pencarian atau filter status
                            Anda.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredSessions.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50/80 transition-colors group"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-slate-900 group-hover:text-[#008BE3] transition-colors">
                            {item.title}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs md:text-sm font-semibold text-slate-600">
                          <div className="flex items-center gap-1.5">
                            <Calendar
                              size={13}
                              className="text-slate-400 shrink-0"
                            />
                            {item.tanggal}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs md:text-sm font-medium text-slate-700">
                          <div className="flex items-center gap-1.5">
                            <MapPin
                              size={14}
                              className="text-slate-400 shrink-0"
                            />
                            <span>{item.lokasi}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs md:text-sm font-bold text-slate-700">
                          <span>{item.asesiList?.length || 0} Asesi</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs font-bold">
                          {item.status === "Selesai" ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Sudah Selesai
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                              Belum Selesai
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center whitespace-nowrap sticky right-0 bg-white group-hover:bg-slate-50/80 border-l border-slate-100">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() =>
                                setSelectedPlenoId(String(item.id))
                              }
                              className="px-3 py-1.5 text-xs font-bold text-[#008BE3] bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-2xs"
                              title="Detail Sidang Pleno"
                            >
                              <Eye size={14} />
                              <span>Detail</span>
                            </button>
                            {!readOnly &&
                              (item.status === "Selesai" ? (
                                <button
                                  disabled
                                  className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-lg font-bold text-xs inline-flex items-center gap-1.5 cursor-default opacity-85"
                                >
                                  <CheckCircle
                                    size={13}
                                    className="text-emerald-600"
                                  />
                                  <span>Selesai</span>
                                </button>
                              ) : (
                                <button
                                  onClick={() =>
                                    handleCompletePlenoSession(String(item.id))
                                  }
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-600 px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-2xs"
                                  title="Tandai Sidang Pleno sebagai Selesai"
                                >
                                  <CheckCircle size={13} />
                                  <span>Selesaikan</span>
                                </button>
                              ))}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: DETAIL SIDANG PLENO */}
      {selectedPlenoId && formData && (
        <div className="space-y-6">
          {/* Header Sidang Pleno with Back Button & Title */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center gap-3.5 min-w-0">
              <button
                onClick={() => setSelectedPlenoId(null)}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-[#008BE3] bg-[#008BE3]/10 hover:bg-[#008BE3]/20 transition-colors cursor-pointer shrink-0"
                title="Kembali ke Daftar Pleno"
              >
                <ArrowLeft size={18} />
              </button>
              <h2 className="text-lg md:text-xl font-black text-slate-900 truncate">
                {formData.title}
              </h2>
            </div>
          </div>

          {/* Section 1: Informasi Keputusan & Jadwal Sidang (Include Field Link Surat Berita Pleno) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Scale size={18} className="text-[#008BE3]" />
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                Informasi Keputusan & Jadwal Sidang
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Nama Sidang
                </label>
                <input
                  type="text"
                  value={formData.title}
                  readOnly
                  disabled
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 bg-slate-100/80 cursor-not-allowed outline-none select-none truncate"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Rentang Tanggal Pelaksanaan
                </label>
                <input
                  type="text"
                  value={formData.tanggal}
                  readOnly
                  disabled
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 bg-slate-100/80 cursor-not-allowed outline-none select-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  TUK
                </label>
                <input
                  type="text"
                  value={formData.lokasi}
                  readOnly
                  disabled
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 bg-slate-100/80 cursor-not-allowed outline-none select-none"
                />
              </div>
            </div>

            {/* Peserta Sidang (Direktur, Dewan Pengarah, Komite & Notulis) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Peserta Sidang (Direktur, Pengarah &amp; Komite)
              </label>
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl min-h-[44px] flex flex-wrap gap-2 items-center">
                {(() => {
                  const attendees =
                    formData.plenoAttendees &&
                    formData.plenoAttendees.length > 0
                      ? formData.plenoAttendees.filter(
                          (a) =>
                            a.nama.trim() !== "" &&
                            a.role !== "Pimpinan Sidang",
                        )
                      : [
                          { role: "Direktur", nama: "Prof. Dr. H. Ahmad" },
                          {
                            role: "Dewan Pengarah",
                            nama: "Dr. Ir. H. Muhammad Zulkifli, M.T.",
                          },
                          {
                            role: "Notulis",
                            nama: formData.notulis || "Siti Rahmawati, S.T.",
                          },
                          {
                            role: "Komite Skema",
                            nama: "Asep Abdul Sahid, M.T.",
                          },
                        ];
                  return attendees.map((att, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200/80 text-slate-800 rounded-lg text-xs font-bold shadow-2xs"
                    >
                      <span className="text-[#008BE3] font-semibold">
                        [{att.role}]
                      </span>
                      <span>{att.nama}</span>
                    </span>
                  ));
                })()}
              </div>
            </div>
          </div>

          {/* Section 2: 3 Link Surat Dokumen Keputusan & Tombol Generate Surat */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold">
                <Link2 size={18} className="text-[#008BE3]" />
                <span className="text-sm font-black uppercase tracking-wider">
                  Dokumen Keputusan & Surat Hasil Pleno
                </span>
              </div>
              <span className="text-[11px] font-bold text-[#008BE3] bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
                Dokumen Penetapan Resmi
              </span>
            </div>

            <div className="space-y-4">
              {/* Field 1: Link Surat Berita Acara Pleno */}
              <div className="flex flex-col md:flex-row items-stretch md:items-end gap-3 p-4 bg-slate-50/80 rounded-xl border border-slate-200/80">
                <div className="flex-1 space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800">
                    <span>
                      1. Link Surat Berita Acara Pleno{" "}
                      <span className="text-slate-400 font-normal">
                        (URL Google Drive)
                      </span>
                    </span>
                  </label>
                  <input
                    type="url"
                    readOnly={readOnly}
                    value={formData.linkSuratBeritaPleno || ""}
                    onChange={(e) =>
                      handleInputChange("linkSuratBeritaPleno", e.target.value)
                    }
                    placeholder={
                      readOnly
                        ? "Belum ada link surat"
                        : "https://drive.google.com/file/d/..."
                    }
                    className={`w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 transition-all ${
                      readOnly
                        ? "bg-slate-100/80 cursor-not-allowed outline-none select-none"
                        : "bg-white focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3] outline-none"
                    }`}
                  />
                </div>

                <div className="shrink-0 flex items-center gap-2 justify-end">
                  {formData.linkSuratBeritaPleno && (
                    <a
                      href={formData.linkSuratBeritaPleno}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-xl bg-[#008BE3] hover:bg-[#0076C2] text-white flex items-center justify-center transition-all cursor-pointer shadow-2xs shrink-0"
                      title="Buka Link Surat Berita Acara Pleno"
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}
                  {!readOnly && (
                    <button
                      type="button"
                      onClick={handleOpenBeritaAcaraModal}
                      disabled={isDirty || !hasSavedAtLeastOnce}
                      className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs ${
                        !isDirty && hasSavedAtLeastOnce
                          ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-600/20"
                          : "bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300"
                      }`}
                      title={
                        isDirty
                          ? "Simpan perubahan terlebih dahulu untuk melakukan Generate Surat"
                          : "Generate Surat Berita Acara Pleno"
                      }
                    >
                      <Sparkles size={15} />
                      <span>Generate Surat</span>
                    </button>
                  )}
                  {readOnly && !formData.linkSuratBeritaPleno && (
                    <span className="px-3 py-2 rounded-xl font-bold text-xs bg-slate-100 text-slate-400 border border-slate-200 flex items-center justify-center">
                      Belum Ada Link
                    </span>
                  )}
                </div>
              </div>

              {/* Field 2: Link Surat Keputusan Direktur */}
              <div className="flex flex-col md:flex-row items-stretch md:items-end gap-3 p-4 bg-slate-50/80 rounded-xl border border-slate-200/80">
                <div className="flex-1 space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800">
                    <span>
                      2. Link Surat Keputusan Direktur{" "}
                      <span className="text-slate-400 font-normal">
                        (URL Google Drive)
                      </span>
                    </span>
                  </label>
                  <input
                    type="url"
                    readOnly={readOnly}
                    value={
                      formData.linkSuratKeputusanDirektur ||
                      formData.linkSuratHasil ||
                      ""
                    }
                    onChange={(e) => {
                      handleInputChange(
                        "linkSuratKeputusanDirektur",
                        e.target.value,
                      );
                      handleInputChange("linkSuratHasil", e.target.value);
                    }}
                    placeholder={
                      readOnly
                        ? "Belum ada link surat"
                        : "https://drive.google.com/file/d/..."
                    }
                    className={`w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 transition-all ${
                      readOnly
                        ? "bg-slate-100/80 cursor-not-allowed outline-none select-none"
                        : "bg-white focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3] outline-none"
                    }`}
                  />
                </div>

                <div className="shrink-0 flex items-center gap-2 justify-end">
                  {(formData.linkSuratKeputusanDirektur ||
                    formData.linkSuratHasil) && (
                    <a
                      href={
                        formData.linkSuratKeputusanDirektur ||
                        formData.linkSuratHasil
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-xl bg-[#008BE3] hover:bg-[#0076C2] text-white flex items-center justify-center transition-all cursor-pointer shadow-2xs shrink-0"
                      title="Buka Link Surat Keputusan Direktur"
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}
                  {!readOnly && (
                    <button
                      type="button"
                      onClick={handleOpenSKDirekturModal}
                      disabled={isDirty || !hasSavedAtLeastOnce}
                      className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs ${
                        !isDirty && hasSavedAtLeastOnce
                          ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-600/20"
                          : "bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300"
                      }`}
                      title={
                        isDirty
                          ? "Simpan perubahan terlebih dahulu untuk melakukan Generate Surat"
                          : "Generate Surat Keputusan Direktur"
                      }
                    >
                      <Sparkles size={15} />
                      <span>Generate Surat</span>
                    </button>
                  )}
                  {readOnly &&
                    !(
                      formData.linkSuratKeputusanDirektur ||
                      formData.linkSuratHasil
                    ) && (
                      <span className="px-3 py-2 rounded-xl font-bold text-xs bg-slate-100 text-slate-400 border border-slate-200 flex items-center justify-center">
                        Belum Ada Link
                      </span>
                    )}
                </div>
              </div>

              {/* Field 3: Link Surat Blanko BNSP */}
              <div className="flex flex-col md:flex-row items-stretch md:items-end gap-3 p-4 bg-slate-50/80 rounded-xl border border-slate-200/80">
                <div className="flex-1 space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800">
                    <span>
                      3. Link Surat Blanko BNSP{" "}
                      <span className="text-slate-400 font-normal">
                        (URL Google Drive)
                      </span>
                    </span>
                  </label>
                  <input
                    type="url"
                    readOnly={readOnly}
                    value={formData.linkSuratBlankoBNSP || ""}
                    onChange={(e) =>
                      handleInputChange("linkSuratBlankoBNSP", e.target.value)
                    }
                    placeholder={
                      readOnly
                        ? "Belum ada link surat"
                        : "https://drive.google.com/file/d/..."
                    }
                    className={`w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 transition-all ${
                      readOnly
                        ? "bg-slate-100/80 cursor-not-allowed outline-none select-none"
                        : "bg-white focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3] outline-none"
                    }`}
                  />
                </div>

                <div className="shrink-0 flex items-center gap-2 justify-end">
                  {formData.linkSuratBlankoBNSP && (
                    <a
                      href={formData.linkSuratBlankoBNSP}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-xl bg-[#008BE3] hover:bg-[#0076C2] text-white flex items-center justify-center transition-all cursor-pointer shadow-2xs shrink-0"
                      title="Buka Link Surat Blanko BNSP"
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}
                  {!readOnly && (
                    <button
                      type="button"
                      onClick={handleOpenBlankoBNSPModal}
                      disabled={isDirty || !hasSavedAtLeastOnce}
                      className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs ${
                        !isDirty && hasSavedAtLeastOnce
                          ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-600/20"
                          : "bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300"
                      }`}
                      title={
                        isDirty
                          ? "Simpan perubahan terlebih dahulu untuk melakukan Generate Surat"
                          : "Generate Surat Blanko BNSP"
                      }
                    >
                      <Sparkles size={15} />
                      <span>Generate Surat</span>
                    </button>
                  )}
                  {readOnly && !formData.linkSuratBlankoBNSP && (
                    <span className="px-3 py-2 rounded-xl font-bold text-xs bg-slate-100 text-slate-400 border border-slate-200 flex items-center justify-center">
                      Belum Ada Link
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Warning Message if isDirty */}
            {isDirty && (
              <p className="text-[11px] font-bold text-amber-700 bg-amber-50 p-2.5 rounded-lg border border-amber-200 flex items-center gap-2">
                <AlertCircle size={14} className="shrink-0 text-amber-600" />
                <span>
                  Tombol Generate Surat dinonaktifkan sementara karena terdapat
                  perubahan data. Klik <strong>Simpan Perubahan</strong> di
                  akhir form untuk mengaktifkan kembali.
                </span>
              </p>
            )}
          </div>

          {/* Section 3: TABEL ASESI & PERUBAHAN STATUS K / BK */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden space-y-4 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Users size={18} className="text-[#008BE3]" />
                  Daftar Asesi & Penetapan Status Kelulusan
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Ubah status hasil pleno Kompeten atau Belum Kompeten untuk
                  setiap asesi yang didaftarkan.
                </p>
              </div>

              {/* Badge Data Tersimpan / Ada Perubahan */}
              <div className="flex items-center gap-3 shrink-0">
                {isDirty ? (
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3.5 py-2 rounded-xl flex items-center gap-1.5">
                    <AlertCircle size={15} className="shrink-0" />
                    Ada Perubahan Belum Disimpan
                  </span>
                ) : (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-xl flex items-center gap-1.5">
                    <CheckCircle
                      size={15}
                      className="shrink-0 text-emerald-600"
                    />
                    Data Tersimpan
                  </span>
                )}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 border-y border-slate-200">
                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">
                      No
                    </th>
                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">
                      NIM / ID
                    </th>
                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">
                      Nama Asesi
                    </th>
                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">
                      Asesor Penguji
                    </th>
                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-center">
                      Rekomendasi Asesor
                    </th>
                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-center">
                      Status Sidang Pleno
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-medium">
                  {normalizedAsesiList.map((asesi, idx) => (
                    <tr
                      key={asesi.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="px-4 py-3 font-bold text-slate-500">
                        {idx + 1}
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-slate-700">
                        {asesi.nim}
                      </td>
                      <td className="px-4 py-3 font-bold text-slate-900">
                        {asesi.nama}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {asesi.asesor}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`px-2.5 py-0.5 rounded font-bold text-[11px] ${
                            asesi.rekomendasiAsesor === "K"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {asesi.rekomendasiAsesor === "K"
                            ? "Kompeten"
                            : "Belum Kompeten"}
                        </span>
                      </td>

                      {/* TOGGLE STATUS K / BK PER ASESI */}
                      <td className="px-4 py-3 text-center">
                        {!readOnly ? (
                          <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 gap-1">
                            <button
                              type="button"
                              onClick={() =>
                                handleAsesiStatusChange(asesi.id, "K")
                              }
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                                asesi.statusPleno === "K"
                                  ? "bg-emerald-600 text-white shadow-2xs"
                                  : "text-slate-600 hover:text-slate-900"
                              }`}
                            >
                              <Check size={13} />
                              Kompeten
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handleAsesiStatusChange(asesi.id, "BK")
                              }
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                                asesi.statusPleno === "BK"
                                  ? "bg-rose-600 text-white shadow-2xs"
                                  : "text-slate-600 hover:text-slate-900"
                              }`}
                            >
                              <XCircle size={13} />
                              Belum Kompeten
                            </button>
                          </div>
                        ) : (
                          <span
                            className={`px-3 py-1 rounded-lg text-xs font-bold ${
                              asesi.statusPleno === "K"
                                ? "bg-emerald-600 text-white"
                                : "bg-rose-600 text-white"
                            }`}
                          >
                            {asesi.statusPleno === "K"
                              ? "Kompeten"
                              : "Belum Kompeten"}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 4: BOTTOM FORM ACTION BAR (CRITICAL REQUIREMENT: Tombol simpan perubahan di akhir form) */}
          {!readOnly && (
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                {isDirty ? (
                  <span className="text-amber-700 font-bold flex items-center gap-1.5">
                    <AlertCircle size={16} className="text-amber-600" />
                    Terdapat perubahan data yang belum disimpan.
                  </span>
                ) : (
                  <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                    <CheckCircle size={16} className="text-emerald-600" />
                    Seluruh data telah tersimpan dengan aman.
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedPlenoId(null)}
                  className="px-4 py-2.5 rounded-xl font-bold text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Batal
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={!isDirty}
                  className={`px-6 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs ${
                    isDirty
                      ? "bg-[#008BE3] text-white hover:bg-[#0076C2] shadow-md shadow-[#008BE3]/20"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300"
                  }`}
                  title={
                    !isDirty
                      ? "Tidak ada perubahan untuk disimpan"
                      : "Klik untuk menyimpan perubahan"
                  }
                >
                  <Save size={16} />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL INPUT 1: SURAT BERITA ACARA PLENO */}
      <AnimatePresence>
        {isBeritaAcaraModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBeritaAcaraModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-md w-full relative z-10 overflow-hidden"
            >
              <form onSubmit={handleConfirmBeritaAcara}>
                <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                      <FileText size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900">
                        Generate Surat Berita Acara Pleno
                      </h3>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Lengkapi data penetapan sebelum surat digenerate.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsBeritaAcaraModalOpen(false)}
                    className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  >
                    <XCircle size={18} />
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Kota Ditetapkan <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={beritaAcaraKota}
                      onChange={(e) => setBeritaAcaraKota(e.target.value)}
                      placeholder="Contoh: Bandung"
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3] outline-none"
                    />
                    <p className="text-[11px] text-slate-400 mt-1 font-medium">
                      Nama kota ini akan ditampilkan pada bagian penandatanganan
                      dokumen Berita Acara.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsBeritaAcaraModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles size={14} />
                    <span>Generate Surat</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL INPUT 2: SURAT KEPUTUSAN DIREKTUR */}
      <AnimatePresence>
        {isSKDirekturModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSKDirekturModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-md w-full relative z-10 overflow-hidden"
            >
              <form onSubmit={handleConfirmSKDirektur}>
                <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                      <FileText size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900">
                        Generate Surat Keputusan Direktur
                      </h3>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Lengkapi nomor surat dan kota penetapan.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsSKDirekturModalOpen(false)}
                    className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  >
                    <XCircle size={18} />
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Nomor Surat Keputusan{" "}
                      <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={skDirekturNomor}
                      onChange={(e) => setSkDirekturNomor(e.target.value)}
                      placeholder="Contoh: SK/LSP-UIN/PLN/2026/001"
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Kota Ditetapkan <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={skDirekturKota}
                      onChange={(e) => setSkDirekturKota(e.target.value)}
                      placeholder="Contoh: Bandung"
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3] outline-none"
                    />
                    <p className="text-[11px] text-slate-400 mt-1 font-medium">
                      Ditampilkan pada baris Ditetapkan di pada Surat Keputusan
                      Direktur.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsSKDirekturModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles size={14} />
                    <span>Generate Surat</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL INPUT 3: SURAT BLANKO BNSP */}
      <AnimatePresence>
        {isBlankoBNSPModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBlankoBNSPModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-md w-full relative z-10 overflow-hidden"
            >
              <form onSubmit={handleConfirmBlankoBNSP}>
                <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                      <FileText size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900">
                        Generate Surat Blanko BNSP
                      </h3>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Lengkapi kota penetapan sebelum surat digenerate.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsBlankoBNSPModalOpen(false)}
                    className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  >
                    <XCircle size={18} />
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Kota Ditetapkan <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={blankoBNSPKota}
                      onChange={(e) => setBlankoBNSPKota(e.target.value)}
                      placeholder="Contoh: Bandung"
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3] outline-none"
                    />
                    <p className="text-[11px] text-slate-400 mt-1 font-medium">
                      Ditampilkan pada dokumen permohonan pengajuan blanko
                      sertifikat BNSP.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsBlankoBNSPModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles size={14} />
                    <span>Generate Surat</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* GENERATE SURAT MODAL PREVIEW */}
      <AnimatePresence>
        {isGenerateModalOpen && formData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsGenerateModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-3xl w-full relative z-10 overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-2xs">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      {activeDocType === "berita_acara" &&
                        "Surat Berita Acara Pleno"}
                      {activeDocType === "sk_direktur" &&
                        "Surat Keputusan Direktur LSP"}
                      {activeDocType === "blanko_bnsp" &&
                        "Surat Pengajuan Blanko BNSP"}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Nomor SK: {formData.noSK || "-"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsGenerateModalOpen(false)}
                  className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
                >
                  Tutup
                </button>
              </div>

              {/* Modal Printable Document Content */}
              <div className="p-6 md:p-8 overflow-y-auto space-y-6 bg-slate-50 text-slate-900">
                <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-2xs space-y-6 font-serif">
                  {/* Kop Surat Header */}
                  <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1">
                    <h2 className="text-lg font-black uppercase tracking-wider text-slate-900">
                      LSP UIN SUNAN GUNUNG DJATI BANDUNG
                    </h2>
                    <p className="text-xs font-semibold text-slate-600">
                      Lembaga Sertifikasi Profesi Pihak Pertama (LSP-P1)
                    </p>
                    <p className="text-[10px] text-slate-500 font-sans">
                      Jl. A.H. Nasution No. 105, Cipadung, Cibiru, Kota Bandung,
                      Jawa Barat 40614
                    </p>
                  </div>

                  {/* Judul Surat */}
                  <div className="text-center space-y-1 font-sans">
                    <h3 className="text-base font-black uppercase text-slate-900 underline">
                      {activeDocType === "berita_acara" &&
                        "BERITA ACARA SIDANG PLENO PENETAPAN HASIL UJI KOMPETENSI"}
                      {activeDocType === "sk_direktur" &&
                        "SURAT KEPUTUSAN DIREKTUR LSP UIN SUNAN GUNUNG DJATI BANDUNG"}
                      {activeDocType === "blanko_bnsp" &&
                        "SURAT PENGAJUAN BLANKO SERTIFIKAT BNSP"}
                    </h3>
                    <p className="text-xs font-bold text-slate-700 font-mono">
                      Nomor: {formData.noSK || "SK/LSP-UIN/PLN/2026/001"}
                    </p>
                  </div>

                  {/* Body Text */}
                  <div className="text-xs space-y-3 leading-relaxed font-sans text-slate-800">
                    <p>
                      Pada hari ini tanggal <strong>{formData.tanggal}</strong>,
                      telah ditetapkan dokumen hasil Sidang Pleno Penetapan
                      Hasil Uji Kompetensi dengan rincian sebagai berikut:
                    </p>
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <strong>Nama Batch / Pleno:</strong> {formData.title}
                      </div>
                      <div>
                        <strong>Skema Sertifikasi:</strong> {formData.skema}
                      </div>
                      <div>
                        <strong>Notulis Sidang:</strong> {formData.notulis}
                      </div>
                      <div>
                        <strong>Waktu & Tempat:</strong> {formData.waktu},{" "}
                        {formData.lokasi}
                      </div>
                      <div className="col-span-2">
                        <strong>Link Dokumen:</strong>{" "}
                        {activeDocType === "berita_acara" &&
                          (formData.linkSuratBeritaPleno || "-")}
                        {activeDocType === "sk_direktur" &&
                          (formData.linkSuratKeputusanDirektur ||
                            formData.linkSuratHasil ||
                            "-")}
                        {activeDocType === "blanko_bnsp" &&
                          (formData.linkSuratBlankoBNSP || "-")}
                      </div>
                    </div>

                    <p className="font-bold pt-2">
                      {activeDocType === "blanko_bnsp"
                        ? "Daftar peserta yang dinyatakan KOMPETEN (K) dan diajukan penerbitan blanko sertifikat BNSP:"
                        : "Berdasarkan hasil verifikasi dan sidang pleno, diputuskan daftar peserta sebagai berikut:"}
                    </p>

                    {/* Table Asesi Hasil Pleno */}
                    <table className="w-full text-left border-collapse border border-slate-300 text-[11px] font-sans">
                      <thead>
                        <tr className="bg-slate-100 text-slate-800 border-b border-slate-300">
                          <th className="p-2 border-r border-slate-300">No</th>
                          <th className="p-2 border-r border-slate-300">NIM</th>
                          <th className="p-2 border-r border-slate-300">
                            Nama Asesi
                          </th>
                          <th className="p-2 border-r border-slate-300">
                            Asesor Penguji
                          </th>
                          <th className="p-2 text-center">
                            Hasil Sidang Pleno
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {(activeDocType === "blanko_bnsp"
                          ? normalizedAsesiList.filter(
                              (a) => a.statusPleno === "K",
                            )
                          : normalizedAsesiList
                        ).map((a, i) => (
                          <tr key={a.id} className="border-b border-slate-200">
                            <td className="p-2 border-r border-slate-300 text-center">
                              {i + 1}
                            </td>
                            <td className="p-2 border-r border-slate-300 font-mono">
                              {a.nim}
                            </td>
                            <td className="p-2 border-r border-slate-300 font-bold">
                              {a.nama}
                            </td>
                            <td className="p-2 border-r border-slate-300">
                              {a.asesor}
                            </td>
                            <td className="p-2 text-center font-bold">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] ${a.statusPleno === "K" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}
                              >
                                {a.statusPleno === "K"
                                  ? "KOMPETEN (K)"
                                  : "BELUM KOMPETEN (BK)"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div className="pt-2 flex justify-between font-bold text-xs">
                      <span>
                        Total Peserta: {normalizedAsesiList.length} Asesi
                      </span>
                      <span>
                        Kompeten (K):{" "}
                        {
                          normalizedAsesiList.filter(
                            (a) => a.statusPleno === "K",
                          ).length
                        }{" "}
                        | Belum Kompeten (BK):{" "}
                        {
                          normalizedAsesiList.filter(
                            (a) => a.statusPleno === "BK",
                          ).length
                        }
                      </span>
                    </div>
                  </div>

                  {/* Tanda Tangan Dynamic based on doc type */}
                  <div className="pt-8 text-center font-sans text-xs">
                    {activeDocType === "berita_acara" && (
                      <div className="grid grid-cols-2 gap-8">
                        <div>
                          <p className="font-bold">
                            Ditetapkan di: {beritaAcaraKota}
                          </p>
                          <p className="font-bold text-slate-600 mb-2">
                            Pada tanggal: {formData.tanggal}
                          </p>
                          <p className="font-bold">Notulis Sidang Pleno</p>
                          <div className="h-16 flex items-center justify-center italic text-slate-400">
                            [ Tanda Tangan Digital ]
                          </div>
                          <p className="font-bold underline">
                            {formData.notulis}
                          </p>
                        </div>
                        <div>
                          <p className="font-bold">
                            Ditetapkan di: {beritaAcaraKota}
                          </p>
                          <p className="font-bold text-slate-600 mb-2">
                            Pada tanggal: {formData.tanggal}
                          </p>
                          <p className="font-bold">
                            Direktur LSP UIN Sunan Gunung Djati Bandung
                          </p>
                          <div className="h-16 flex items-center justify-center italic text-slate-400">
                            [ Tanda Tangan Digital ]
                          </div>
                          <p className="font-bold underline">
                            Prof. Dr. H. Ahmad Zaki, M.Ag.
                          </p>
                        </div>
                      </div>
                    )}

                    {activeDocType === "sk_direktur" && (
                      <div className="flex flex-col items-end text-right pr-6">
                        <p className="font-bold">
                          Ditetapkan di: {skDirekturKota}
                        </p>
                        <p className="font-bold text-slate-600 mb-2">
                          Pada tanggal: {formData.tanggal}
                        </p>
                        <p className="font-bold">
                          Direktur LSP UIN Sunan Gunung Djati Bandung
                        </p>
                        <div className="h-20 flex items-center justify-center italic text-slate-400 w-64">
                          [ Tanda Tangan & Cap Digital ]
                        </div>
                        <p className="font-bold underline">
                          Prof. Dr. H. Ahmad Zaki, M.Ag.
                        </p>
                      </div>
                    )}

                    {activeDocType === "blanko_bnsp" && (
                      <div className="flex flex-col items-end text-right pr-6">
                        <p className="font-bold">
                          Ditetapkan di: {blankoBNSPKota}
                        </p>
                        <p className="font-bold text-slate-600 mb-2">
                          Pada tanggal: {formData.tanggal}
                        </p>
                        <p className="font-bold">
                          Manajer Sertifikasi LSP UIN Sunan Gunung Djati Bandung
                        </p>
                        <div className="h-20 flex items-center justify-center italic text-slate-400 w-64">
                          [ Tanda Tangan & Cap Digital ]
                        </div>
                        <p className="font-bold underline">
                          Dr. Ir. H. Muhammad Zulkifli, M.T.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between shrink-0">
                <span className="text-xs text-slate-500 font-medium">
                  Dokumen siap diunduh & dicetak.
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Printer size={15} />
                    <span>Cetak PDF</span>
                  </button>
                  <button
                    onClick={() => {
                      alert("Dokumen berhasil di-generate.");
                      setIsGenerateModalOpen(false);
                    }}
                    className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Download size={15} />
                    <span>Download Dokumen</span>
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
