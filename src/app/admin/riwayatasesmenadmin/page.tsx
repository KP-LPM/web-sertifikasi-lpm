"use client";

import React, { useState } from "react";
import {
  Search,
  History,
  CheckCircle,
  FileText,
  Calendar,
  X,
  ArrowLeft,
  MapPin,
  Building,
  Clock,
  Eye,
  Filter,
  Users,
  Layers,
  Award,
  Video,
  Building2,
  Globe,
  ArrowRight,
  UserCheck,
  ChevronDown,
  Scale,
  Link2,
  ExternalLink,
} from "lucide-react";
import { useAppContext } from "@/context/context";
import {
  FormFRAPL02,
  FormFRAK07,
  FormFRIA04A,
  FormFRIA04B,
  FormFRIA07,
} from "@/components/forms";
import {
  CompletedBatchAsesi,
  CompletedBatchItem,
  AsesiPlenoItem,
  PlenoDetailData,
  AssessmentItem,
} from "@/types/types";

const initialCompletedBatches: CompletedBatchItem[] = [
  {
    kode: "BATCH-IT-2025-089",
    nama: "Batch 89 - Auditor Halal Gelombang 3",
    skema: "Auditor Halal",
    asesor: "Dr. Aris Thorne",
    tipeTuk: "Gedung L PTIPD Lab 1 (Sewaktu)",
    metode: "Offline",
    tanggal: "12 Sep 2025",
    waktu: "08:00 - 12:00 WIB",
    totalAsesi: 20,
    kompetenCount: 18,
    belumKompetenCount: 2,
    status: "Selesai",
    suratPenugasan: "ST_Penugasan_Batch89.pdf",
    asesiList: [
      { nama: "Ahmad Hidayat", nik: "3273012810010001", hasil: "Kompeten" },
      { nama: "Siti Rohmah", nik: "3273012810020001", hasil: "Kompeten" },
      {
        nama: "Budi Pratama",
        nik: "3273012810030001",
        hasil: "Belum Kompeten",
      },
      { nama: "Dewi Lestari", nik: "3273012810040001", hasil: "Kompeten" },
      { nama: "Rahmat Hidayat", nik: "3273012810050001", hasil: "Kompeten" },
    ],
  },
  {
    kode: "BATCH-NET-2025-090",
    nama: "Batch 90 - Kewirausahaan Industri Online",
    skema: "Jenjang 5 Bidang Kewirausahaan Industri",
    asesor: "Budi Santoso, M.Kom",
    tipeTuk: "Online Meeting (Google Meet)",
    metode: "Online",
    tanggal: "20 Sep 2025",
    waktu: "13:00 - 17:00 WIB",
    totalAsesi: 15,
    kompetenCount: 15,
    belumKompetenCount: 0,
    status: "Selesai",
    suratPenugasan: "ST_Penugasan_Batch90.pdf",
    asesiList: [
      { nama: "Eko Prasetyo", nik: "3273012810060001", hasil: "Kompeten" },
      { nama: "Fitriani", nik: "3273012810070001", hasil: "Kompeten" },
      { nama: "Gitarja", nik: "3273012810080001", hasil: "Kompeten" },
    ],
  },
  {
    kode: "BATCH-PRG-2025-091",
    nama: "Batch 91 - Pemangku Kepentingan",
    skema: "Melaksanakan Komunikasi Dengan Pemangku Kepentingan",
    asesor: "Ichsan Taufik, M.T.",
    tipeTuk: "Ruang Rapat Utama (Tempat Kerja)",
    metode: "Offline",
    tanggal: "05 Okt 2025",
    waktu: "09:00 - 13:00 WIB",
    totalAsesi: 12,
    kompetenCount: 11,
    belumKompetenCount: 1,
    status: "Selesai",
    suratPenugasan: "ST_Penugasan_Batch91.pdf",
    asesiList: [
      { nama: "Hendra Gunawan", nik: "3273012810090001", hasil: "Kompeten" },
      {
        nama: "Iwan Setiawan",
        nik: "3273012810100001",
        hasil: "Belum Kompeten",
      },
    ],
  },
  {
    kode: "BATCH-SEC-2025-092",
    nama: "Batch 92 - Penerjemah Teks Umum",
    skema: "Penerjemah Teks Umum",
    asesor: "Susanti Ainul Fitri, M.Pd.",
    tipeTuk: "Gedung C FISIP Lab Bahasa",
    metode: "Offline",
    tanggal: "18 Nov 2025",
    waktu: "08:30 - 12:30 WIB",
    totalAsesi: 18,
    kompetenCount: 17,
    belumKompetenCount: 1,
    status: "Selesai",
    suratPenugasan: "ST_Penugasan_Batch92.pdf",
    asesiList: [
      { nama: "Joko Widodo", nik: "3273012810110001", hasil: "Kompeten" },
      { nama: "Kartika Sari", nik: "3273012810120001", hasil: "Kompeten" },
    ],
  },
];

const initialCompletedPleno: PlenoDetailData[] = [
  {
    id: "PLN-2026-003",
    batchCode: "BATCH-PRG-2026-003",
    title: "Sidang Pleno Skema Komunikasi Pemangku Kepentingan",
    skema: "Melaksanakan Komunikasi Dengan Pemangku Kepentingan",
    noSK: "SK/LSP-UIN/PLN/2026/003",
    tanggal: "2026-10-25",
    waktu: "10:00 - 12:00 WIB",
    alamat: "Ruang Rapat Utama (Offline)",
    detailAlamat: "Ruang Sidang Lt. 3 Gedung Rektorat",
    linkSuratBeritaPleno:
      "https://drive.google.com/file/d/berita-pleno-003/view",
    linkSuratHasil: "https://drive.google.com/file/d/3x4y5z/view",
    status: "Selesai",
    asesiList: [
      {
        id: "11",
        nik: "1217050011",
        nama: "Lani Wijaya",
        skema: "Melaksanakan Komunikasi Dengan Pemangku Kepentingan",
        asesor: "Fitri Pebriani Wahyu, M.T.",
        rekomendasiAsesor: "K",
        statusPleno: "K",
      },
      {
        id: "12",
        nik: "1217050012",
        nama: "Muhammad Rizky",
        skema: "Melaksanakan Komunikasi Dengan Pemangku Kepentingan",
        asesor: "Tina Dewi Rosahdi, M.T.",
        rekomendasiAsesor: "K",
        statusPleno: "K",
      },
    ],
    deskripsi:
      "Sidang Pleno penetapan kelulusan skema Komunikasi Pemangku Kepentingan.",
    suratPlenoName: "SK_Pleno_Komunikasi_2026.pdf",
  },
  {
    id: "PLN-2025-001",
    batchCode: "BATCH-IT-2025-089",
    title:
      "Sidang Pleno Penetapan Hasil Uji Kompetensi Auditor Halal Gelombang 3",
    skema: "Auditor Halal",
    noSK: "012/SK-PLENO/LSP-UIN/IX/2025",
    tanggal: "2025-09-25",
    waktu: "09:00 - 11:30 WIB",
    alamat: "Ruang Rapat Utama (OfflinedetailA",
    detailAlamat: "Ruang Rapat Utama Gedung Rektorat Lt. 2",
    linkSuratBeritaPleno:
      "https://drive.google.com/file/d/berita-pleno-001/view",
    linkSuratHasil: "https://drive.google.com/file/d/1a2b3c4d5e6f7g8h9/view",

    status: "Selesai",
    asesiList: [
      {
        id: "1",
        nik: "3273012810010001",
        nama: "Ahmad Hidayat",
        skema: "Auditor Halal",
        asesor: "Dr. Aris Thorne",
        rekomendasiAsesor: "K",
        statusPleno: "K",
        catatan: "Dokumen portofolio lengkap",
      },
      {
        id: "2",
        nik: "3273012810020001",
        nama: "Siti Rohmah",
        skema: "Auditor Halal",
        asesor: "Dr. Aris Thorne",
        rekomendasiAsesor: "K",
        statusPleno: "K",
      },
      {
        id: "3",
        nik: "3273012810030001",
        nama: "Budi Pratama",
        skema: "Auditor Halal",
        asesor: "Dr. Aris Thorne",
        rekomendasiAsesor: "BK",
        statusPleno: "BK",
        catatan: "Belum melengkapi berkas unit 2",
      },
    ],
    deskripsi:
      "Sidang Pleno penetapan dan pengesahan hasil uji kompetensi skema Auditor Halal Gelombang 3.",
    suratPlenoName: "SK_Pleno_Auditor_Halal_2025.pdf",
  },
  {
    id: "PLN-2025-002",
    batchCode: "BATCH-NET-2025-090",
    title: "Sidang Pleno Penetapan Hasil Kewirausahaan Industri Gelombang 1",
    skema: "Jenjang 5 Bidang Kewirausahaan Industri",
    noSK: "015/SK-PLENO/LSP-UIN/X/2025",
    tanggal: "2025-10-02",
    waktu: "13:30 - 15:30 WIB",
    alamat: "Ruang Rapat Utama (Offline)",
    detailAlamat: "Zoom Meeting Room 1 (Online)",
    linkSuratBeritaPleno:
      "https://drive.google.com/file/d/berita-pleno-002/view",
    linkSuratHasil: "https://drive.google.com/file/d/sk-pleno-002/view",

    status: "Selesai",
    asesiList: [
      {
        id: "7",
        nik: "3273012810060001",
        nama: "Eko Prasetyo",
        skema: "Jenjang 5 Bidang Kewirausahaan Industri",
        asesor: "Budi Santoso, M.Kom",
        rekomendasiAsesor: "K",
        statusPleno: "K",
      },
      {
        id: "8",
        nik: "3273012810070001",
        nama: "Fitriani",
        skema: "Jenjang 5 Bidang Kewirausahaan Industri",
        asesor: "Budi Santoso, M.Kom",
        rekomendasiAsesor: "K",
        statusPleno: "K",
      },
    ],
    deskripsi:
      "Pengesahan hasil asesmen skema Kewirausahaan Industri Angkatan 2025.",
    suratPlenoName: "SK_Pleno_Kewirausahaan_2025.pdf",
  },
];

export default function RiwayatAsesmenAdmin() {
  const { AssessmentItems, plenoSessions } = useAppContext();

  // Page Option Tab State
  const [mainTab, setMainTab] = useState<"asesmen" | "batch" | "pleno">(
    "asesmen",
  );

  // Asesmen Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [hasilFilter, setHasilFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [tanggalFilter, setTanggalFilter] = useState("");
  const [selectedAsesmen, setSelectedAsesmen] = useState<AssessmentItem | null>(
    null,
  );
  const [previewForm, setPreviewForm] = useState<
    "FR.APL.02" | "FR.AK.07" | "FR.IA.04A" | "FR.IA.04B" | "FR.IA.07" | null
  >(null);

  // Batch Detail Modal State
  const [selectedBatch, setSelectedBatch] = useState<CompletedBatchItem | null>(
    null,
  );
  const [batchTypeFilter, setBatchTypeFilter] = useState<
    "Semua" | "Offline" | "Online"
  >("Semua");
  const [batchSearchTerm, setBatchSearchTerm] = useState("");

  // Pleno Detail / Preview Modal State
  const [selectedPleno, setSelectedPleno] = useState<PlenoDetailData | null>(
    null,
  );
  const [previewPlenoDoc, setPreviewPlenoDoc] =
    useState<PlenoDetailData | null>(null);

  // Helper to parse string dates
  const parseDateToISO = (dateStr: string): string => {
    if (!dateStr) return "";
    const trimmed = dateStr.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;

    const months: Record<string, string> = {
      Jan: "01",
      Feb: "02",
      Mar: "03",
      Apr: "04",
      Mei: "05",
      Jun: "06",
      Jul: "07",
      Agt: "08",
      Sep: "09",
      Okt: "10",
      Nov: "11",
      Des: "12",
      Januari: "01",
      Februari: "02",
      Maret: "03",
      April: "04",
      Juni: "06",
      Juli: "07",
      Agustus: "08",
      September: "09",
      Oktober: "10",
      November: "11",
      Desember: "12",
    };

    const parts = trimmed.split(" ");
    if (parts.length === 3) {
      const day = parts[0].padStart(2, "0");
      const month = months[parts[1]] || "01";
      const year = parts[2];
      return `${year}-${month}-${day}`;
    }

    try {
      const d = new Date(trimmed);
      if (!isNaN(d.getTime())) {
        return d.toISOString().split("T")[0];
      }
    } catch {
      // ignore
    }
    return "";
  };

  // Filtered Assessments
  const filteredAssessments = AssessmentItems.filter((item: AssessmentItem) => {
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

  // Filtered Batches
  const filteredBatches = initialCompletedBatches.filter((b) => {
    if (batchTypeFilter !== "Semua" && b.metode !== batchTypeFilter)
      return false;
    if (!searchTerm) return true;
    const query = searchTerm.toLowerCase();
    return (
      b.kode.toLowerCase().includes(query) ||
      b.nama.toLowerCase().includes(query) ||
      b.skema.toLowerCase().includes(query) ||
      b.asesor.toLowerCase().includes(query)
    );
  });

  // Filtered Pleno Sessions (Only Completed/Selesai)
  const completedPlenoList: PlenoDetailData[] = [
    ...initialCompletedPleno,
    ...plenoSessions
      .filter(
        (p) =>
          p.status === "Selesai" &&
          !initialCompletedPleno.some((i) => i.id === p.id),
      )
      .map((p) => ({
        id: String(p.id), // pastikan string, sesuai interface
        batchCode: `BATCH-${p.id}`,
        title: `Sidang Pleno ${p.skema}`,
        skema: p.skema,
        noSK: `SK-${p.id}`,
        // "notulis" DIHAPUS — field ini tidak ada di interface PlenoDetailData
        tanggal: p.tanggal,
        waktu: p.waktu,
        alamat: p.alamat,
        detailAlamat: p.detailAlamat,
        linkSuratBeritaPleno:
          p.suratPlenoUrl ||
          "https://drive.google.com/file/d/berita-pleno/view",
        linkSuratHasil:
          p.suratPlenoUrl || "https://drive.google.com/file/d/hasil-pleno/view",
        status: "Selesai" as const,
        asesiList: (p.asesiList || []).map((name: string, idx: number) => ({
          id: `asesi-${idx}`,
          nik: `121705${1000 + idx}`,
          nama:
            typeof name === "string"
              ? name
              : (name as { nama?: string }).nama || `Asesi ${idx + 1}`,
          skema: p.skema,
          asesor: "Asesor LSP", // ← diganti dari "asesor" jadi "asesor"
          rekomendasiAsesor: "K" as const,
          statusPleno: "K" as const,
        })),
        deskripsi:
          p.deskripsi || "Sidang pleno pengesahan hasil uji kompetensi.",
        suratPlenoName: p.suratPlenoName || "SK_Pleno_Hasil.pdf",
      })),
  ];

  const filteredPleno = completedPlenoList.filter((p) => {
    if (p.status !== "Selesai") return false;
    if (!searchTerm) return true;
    const query = searchTerm.toLowerCase();
    return (
      (p.title && p.title.toLowerCase().includes(query)) ||
      String(p.id).toLowerCase().includes(query)
    );
  });

  // If detail view of individual assessment is open
  if (selectedAsesmen) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] p-4 md:p-8 space-y-6 pb-24 text-sm text-gray-700">
        <div className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden">
          {/* Banner/Header Info */}
          <div className="p-4 sm:p-6 border-b border-gray-100 space-y-5">
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
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shadow-2xs ${
                    selectedAsesmen.hasil === "Kompeten"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-red-50 text-red-700 border-red-200"
                  }`}
                >
                  {selectedAsesmen.hasil}
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border bg-emerald-50 text-emerald-700 border-emerald-200">
                  <CheckCircle size={12} /> {selectedAsesmen.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 sm:gap-6 pt-3 border-t border-gray-100">
              <div className="min-w-0">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">
                  Asesor Penguji
                </p>
                <p className="text-slate-800 font-bold text-xs sm:text-sm">
                  {selectedAsesmen.asesor || "Dr. Aris Thorne"}
                </p>
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">
                  tipeTuk
                </p>
                <div className="flex items-center gap-1.5 text-slate-700 font-semibold text-xs sm:text-sm">
                  <MapPin size={14} className="text-slate-400 shrink-0" />
                  {selectedAsesmen.tipeTuk}
                </div>
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">
                  Pelaksanaan
                </p>
                <div className="flex items-center gap-1.5 text-slate-700 font-semibold text-xs sm:text-sm">
                  <Building size={14} className="text-slate-400 shrink-0" />
                  {selectedAsesmen.metode}
                </div>
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">
                  Tanggal
                </p>
                <div className="flex items-center gap-1.5 text-slate-700 font-semibold text-xs sm:text-sm">
                  <Calendar size={14} className="text-slate-400 shrink-0" />
                  {selectedAsesmen.tglAsesmen}
                </div>
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">
                  Waktu
                </p>
                <div className="flex items-center gap-1.5 text-slate-700 font-semibold text-xs sm:text-sm">
                  <Clock size={14} className="text-slate-400 shrink-0" />
                  {selectedAsesmen.waktu}
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-8">
            <h2 className="text-lg font-black text-slate-900 tracking-tight mb-6 flex items-center gap-2">
              Rekapitulasi Penilaian & Berkas Asesmen LSP
            </h2>

            <div className="space-y-4 sm:space-y-6">
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-50 p-4 border-b border-slate-200 font-bold text-slate-800 flex items-center justify-between">
                  <span>FR.APL.02 - Asesmen Mandiri</span>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                    Terverifikasi
                  </span>
                </div>
                <div className="p-4 bg-white flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2.5 bg-red-50 text-red-600 rounded-lg shrink-0">
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
                  <button
                    onClick={() => setPreviewForm("FR.APL.02")}
                    className="flex items-center gap-2 px-4 py-2 bg-[#008BE3] hover:bg-[#0076C2] text-white rounded-lg text-sm font-bold transition-colors cursor-pointer"
                  >
                    <Eye size={16} /> Pratinjau
                  </button>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-50 p-4 border-b border-slate-200 font-bold text-slate-800 flex items-center justify-between">
                  <span>
                    FR.AK.07 - Ceklis Penyesuaian yang Wajar dan Beralasan
                  </span>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                    Terverifikasi
                  </span>
                </div>
                <div className="p-4 bg-white flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2.5 bg-red-50 text-red-600 rounded-lg shrink-0">
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
                  <button
                    onClick={() => setPreviewForm("FR.AK.07")}
                    className="flex items-center gap-2 px-4 py-2 bg-[#008BE3] hover:bg-[#0076C2] text-white rounded-lg text-sm font-bold transition-colors cursor-pointer"
                  >
                    <Eye size={16} /> Pratinjau
                  </button>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-50 p-4 border-b border-slate-200 font-bold text-slate-800 flex items-center justify-between">
                  <span>FR.IA.04A - Penilaian Praktik/Observasi</span>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                    Terverifikasi
                  </span>
                </div>
                <div className="p-4 bg-white flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2.5 bg-red-50 text-red-600 rounded-lg shrink-0">
                      <FileText size={20} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-800 text-sm">
                        FR_IA_04A_Signed.pdf
                      </p>
                      <p className="text-xs text-slate-500">
                        Lembar Observasi Demonstrasi Praktik
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setPreviewForm("FR.IA.04A")}
                    className="flex items-center gap-2 px-4 py-2 bg-[#008BE3] hover:bg-[#0076C2] text-white rounded-lg text-sm font-bold transition-colors cursor-pointer"
                  >
                    <Eye size={16} /> Pratinjau
                  </button>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-50 p-4 border-b border-slate-200 font-bold text-slate-800 flex items-center justify-between">
                  <span>
                    FR.IA.04B - Penilaian Daftar Periksa Tugas Praktik (DPT)
                  </span>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                    Terverifikasi
                  </span>
                </div>
                <div className="p-4 bg-white flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2.5 bg-red-50 text-red-600 rounded-lg shrink-0">
                      <FileText size={20} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-800 text-sm">
                        FR_IA_04B_Signed.pdf
                      </p>
                      <p className="text-xs text-slate-500">
                        Lembar Penilaian Hasil Tugas Praktik
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setPreviewForm("FR.IA.04B")}
                    className="flex items-center gap-2 px-4 py-2 bg-[#008BE3] hover:bg-[#0076C2] text-white rounded-lg text-sm font-bold transition-colors cursor-pointer"
                  >
                    <Eye size={16} /> Pratinjau
                  </button>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-50 p-4 border-b border-slate-200 font-bold text-slate-800 flex items-center justify-between">
                  <span>FR.IA.07 - Pertanyaan Lisan Pendukung Observasi</span>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                    Terverifikasi
                  </span>
                </div>
                <div className="p-4 bg-white flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2.5 bg-red-50 text-red-600 rounded-lg shrink-0">
                      <FileText size={20} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-800 text-sm">
                        FR_IA_07_Signed.pdf
                      </p>
                      <p className="text-xs text-slate-500">
                        Lembar Hasil Wawancara / Pertanyaan Lisan
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setPreviewForm("FR.IA.07")}
                    className="flex items-center gap-2 px-4 py-2 bg-[#008BE3] hover:bg-[#0076C2] text-white rounded-lg text-sm font-bold transition-colors cursor-pointer"
                  >
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
                  <span className="font-bold text-sm">
                    Pratinjau Dokumen {previewForm}
                  </span>
                  <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                    Read-Only
                  </span>
                </div>
                <button
                  onClick={() => setPreviewForm(null)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 overflow-y-auto flex-1 bg-slate-50">
                {previewForm === "FR.APL.02" && (
                  <FormFRAPL02
                    asesmenData={{
                      nama: selectedAsesmen.nama,
                      skema: selectedAsesmen.skema,
                      noSkema: "04/SKM/LSP P1 UIN SGD/V/2022",
                      tipeTuk: selectedAsesmen.tipeTuk,
                      tanggal: selectedAsesmen.tglAsesmen,
                      asesor: selectedAsesmen.asesor || "Dr. Aris Thorne",
                      asesorReg: "MET.000.001234 2021",
                    }}
                    answers={{ u0e0: "K", u0e1: "K", u1e0: "K" }}
                    rekomendasi="Dapat dilanjutkan"
                    asesiName={selectedAsesmen.nama}
                    asesiSignature={selectedAsesmen.nama}
                    asesiDate={selectedAsesmen.tglAsesmen}
                    asesorName={selectedAsesmen.asesor || "Dr. Aris Thorne"}
                    asesorReg="MET.000.001234 2021"
                    asesorSignature={
                      selectedAsesmen.asesor || "Dr. Aris Thorne"
                    }
                    readOnly={true}
                  />
                )}
                {previewForm === "FR.AK.07" && (
                  <FormFRAK07
                    asesmenData={{
                      nama: selectedAsesmen.nama,
                      skema: selectedAsesmen.skema,
                      noSkema: "04/SKM/LSP P1 UIN SGD/V/2022",
                      tipeTuk: selectedAsesmen.tipeTuk,
                      tanggal: selectedAsesmen.tglAsesmen,
                      asesor: selectedAsesmen.asesor || "Dr. Aris Thorne",
                      asesorReg: "MET.000.001234 2021",
                    }}
                    readOnly={true}
                  />
                )}
                {previewForm === "FR.IA.04A" && (
                  <FormFRIA04A
                    asesmenData={{
                      nama: selectedAsesmen.nama,
                      skema: selectedAsesmen.skema,
                      noSkema: "04/SKM/LSP P1 UIN SGD/V/2022",
                      tipeTuk: selectedAsesmen.tipeTuk,
                      tanggal: selectedAsesmen.tglAsesmen,
                      asesor: selectedAsesmen.asesor || "Dr. Aris Thorne",
                      asesorReg: "MET.000.001234 2021",
                    }}
                    readOnly={true}
                  />
                )}
                {previewForm === "FR.IA.04B" && (
                  <FormFRIA04B
                    asesmenData={{
                      nama: selectedAsesmen.nama,
                      skema: selectedAsesmen.skema,
                      tipeTuk: selectedAsesmen.tipeTuk,
                      t: selectedAsesmen.tglAsesmen,
                      asesor: selectedAsesmen.asesor || "Dr. Aris Thorne",
                      asesorReg: "MET.000.001234 2021",
                    }}
                    readOnly={true}
                  />
                )}
                {previewForm === "FR.IA.07" && (
                  <FormFRIA07
                    asesmenData={{
                      nama: selectedAsesmen.nama,
                      skema: selectedAsesmen.skema,
                      noSkema: "04/SKM/LSP P1 UIN SGD/V/2022",
                      tipeTuk: selectedAsesmen.tipeTuk,
                      tanggal: selectedAsesmen.tglAsesmen,
                      asesor: selectedAsesmen.asesor || "Dr. Aris Thorne",
                      asesorReg: "MET.000.001234 2021",
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
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-[#008BE3]/10 flex items-center justify-center text-[#008BE3] border border-[#008BE3]/20 shadow-xs shrink-0">
            <History size={20} className="stroke-[2.5]" />
          </div>
          <div className="min-w-0">
            <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">
              Riwayat
            </h2>
            <p className="text-xs text-gray-400 font-bold tracking-wider uppercase leading-4">
              Arsip dan riwayat asesmen, batch jadwal, dan sidang pleno yang
              telah selesai
            </p>
          </div>
        </div>
      </div>
      {/* Page Option Tabs (Text Only) */}
      <div className="bg-white p-1 rounded-xl shadow-xs border border-gray-100 flex items-center w-full max-w-md">
        <button
          onClick={() => setMainTab("asesmen")}
          className={`flex-1 py-2.5 px-4 text-xs md:text-sm font-bold rounded-lg transition-all text-center cursor-pointer ${
            mainTab === "asesmen"
              ? "bg-[#008BE3] text-white shadow-xs"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Asesmen
        </button>

        <button
          onClick={() => setMainTab("batch")}
          className={`flex-1 py-2.5 px-4 text-xs md:text-sm font-bold rounded-lg transition-all text-center cursor-pointer ${
            mainTab === "batch"
              ? "bg-[#008BE3] text-white shadow-xs"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Batch
        </button>

        <button
          onClick={() => setMainTab("pleno")}
          className={`flex-1 py-2.5 px-4 text-xs md:text-sm font-bold rounded-lg transition-all text-center cursor-pointer ${
            mainTab === "pleno"
              ? "bg-[#008BE3] text-white shadow-xs"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Sidang Pleno
        </button>
      </div>
      {/* TAB 1: ASESMEN */}
      {mainTab === "asesmen" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden">
            {/* Header Controls & Filters */}
            <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
              <h3 className="text-base font-black text-slate-900 shrink-0">
                Daftar Riwayat Asesmen Asesi
              </h3>

              <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto xl:justify-end">
                <div className="flex items-center gap-2 bg-gray-50/80 rounded-lg px-3 h-10.5 w-full sm:w-64 border border-gray-200/50 focus-within:border-[#008BE3]/40 transition-colors">
                  <Search className="text-gray-400 shrink-0" size={16} />
                  <input
                    type="text"
                    placeholder="Cari Asesi, Skema, Asesor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-transparent border-none focus:ring-0 text-xs md:text-sm w-full outline-none text-gray-700 placeholder-gray-400 font-semibold"
                  />
                </div>

                <select
                  value={hasilFilter}
                  onChange={(e) => setHasilFilter(e.target.value)}
                  className="bg-gray-50 border border-gray-200/50 text-xs md:text-sm rounded-lg px-3 h-10.5 outline-none text-gray-700 cursor-pointer font-bold"
                >
                  <option value="">Semua Hasil</option>
                  <option value="Kompeten">Kompeten</option>
                  <option value="Belum Kompeten">Belum Kompeten</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-gray-50 border border-gray-200/50 text-xs md:text-sm rounded-lg px-3 h-10.5 outline-none text-gray-700 cursor-pointer font-bold"
                >
                  <option value="">Semua Status</option>
                  <option value="Selesai">Selesai</option>
                  <option value="Belum Selesai">Belum Selesai</option>
                </select>

                <div className="flex items-center gap-2 bg-gray-50/80 rounded-lg px-3 h-10.5 w-full sm:w-52 border border-gray-200/50 focus-within:border-[#008BE3]/40 transition-colors">
                  <Calendar className="text-gray-400 shrink-0" size={16} />
                  <input
                    type="date"
                    value={tanggalFilter}
                    onChange={(e) => setTanggalFilter(e.target.value)}
                    className="bg-transparent border-none focus:ring-0 text-xs md:text-sm w-full outline-none text-gray-700 cursor-pointer font-semibold"
                  />
                  {tanggalFilter && (
                    <button
                      onClick={() => setTanggalFilter("")}
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
              <table className="w-full text-left border-collapse min-w-175 sm:min-w-250">
                <thead>
                  <tr className="bg-[#0F172A] border-b border-[#0F172A]">
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-bold text-white/90 uppercase tracking-wider whitespace-nowrap">
                      Nama Asesi
                    </th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-bold text-white/90 uppercase tracking-wider whitespace-nowrap">
                      Skema Sertifikasi
                    </th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-bold text-white/90 uppercase tracking-wider whitespace-nowrap">
                      Asesor Penguji
                    </th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-bold text-white/90 uppercase tracking-wider whitespace-nowrap">
                      tipeTuk / Jenis
                    </th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-bold text-white/90 uppercase tracking-wider whitespace-nowrap">
                      Tanggal & Waktu
                    </th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-bold text-white/90 uppercase tracking-wider whitespace-nowrap">
                      Hasil
                    </th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-bold text-white/90 uppercase tracking-wider whitespace-nowrap">
                      Status
                    </th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-bold text-white/90 uppercase tracking-wider text-center whitespace-nowrap w-28 sm:w-36 sticky right-0 bg-[#0F172A] z-20 border-l border-white/10 shadow-[-6px_0_15px_-4px_rgba(0,0,0,0.06)]">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="font-medium text-xs sm:text-sm divide-y divide-gray-100">
                  {filteredAssessments.length > 0 ? (
                    filteredAssessments.map((item: AssessmentItem) => (
                      <tr
                        key={item.id}
                        className="group/row hover:bg-[#F9FAFC] transition-colors"
                      >
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-slate-800 font-bold whitespace-nowrap">
                          {item.nama}
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-slate-800 font-semibold whitespace-nowrap">
                          {item.skema}
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-slate-600 font-medium whitespace-nowrap">
                          {item.asesor || "Dr. Aris Thorne"}
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                item.tipeTuk === "Sewaktu"
                                  ? "bg-blue-50 text-blue-700 border-blue-200"
                                  : item.tipeTuk === "Tempat Kerja"
                                    ? "bg-purple-50 text-purple-700 border-purple-200"
                                    : "bg-orange-50 text-orange-700 border-orange-200"
                              }`}
                            >
                              {item.tipeTuk}
                            </span>
                            <span className="text-[10px] text-slate-500 font-medium bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                              {item.metode}
                            </span>
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                          <div className="text-slate-700 font-medium">
                            {item.tglAsesmen}
                          </div>
                          <div className="text-[11px] text-slate-400 font-semibold">
                            {item.waktu}
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                              item.hasil === "Kompeten"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-red-50 text-red-700 border-red-200"
                            }`}
                          >
                            {item.hasil}
                          </span>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                              item.status === "Selesai"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                            }`}
                          >
                            <CheckCircle size={10} /> {item.status}
                          </span>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-center bg-white group-hover/row:bg-[#F9FAFC] border-l border-gray-100 sticky right-0 z-10">
                          <button
                            onClick={() => setSelectedAsesmen(item)}
                            className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-3 py-1.5 rounded-lg font-bold text-xs shadow-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                          >
                            <FileText size={14} className="text-[#008BE3]" />{" "}
                            Detail
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-400">
                          <History size={36} className="mb-2 text-slate-300" />
                          <p className="font-bold text-slate-700 text-base">
                            Tidak ada riwayat asesmen ditemukan
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            Coba sesuaikan kata kunci pencarian atau filter
                            Anda.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {/* TAB 2: BATCH */}
      {mainTab === "batch" && (
        <div className="space-y-6">
          {selectedBatch ? (
            /* LEVEL 2: DETAIL ASESI IN SELECTED BATCH */
            <div className="space-y-6">
              {/* Selected Batch Summary Banner */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => {
                        setSelectedBatch(null);
                        setBatchSearchTerm("");
                      }}
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-[#008BE3] bg-[#008BE3]/10 hover:bg-[#008BE3]/20 transition-colors cursor-pointer shrink-0 mt-0.5"
                      title="Kembali ke Daftar Batch"
                    >
                      <ArrowLeft size={18} />
                    </button>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h3 className="text-lg md:text-xl font-black text-slate-900">
                          {selectedBatch.nama}
                        </h3>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800 text-xs font-black border border-slate-200">
                          <Layers size={12} className="text-slate-500" />
                          {selectedBatch.kode}
                        </span>
                        {selectedBatch.metode === "Online" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                            <Video size={11} className="stroke-[2.5]" />
                            Online
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <Building2 size={11} className="stroke-[2.5]" />
                            Offline
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-slate-500">
                        {selectedBatch.skema}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle size={14} />
                      Batch Selesai
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1 text-xs font-medium text-slate-600">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Waktu Pelaksanaan
                    </span>
                    <div className="flex items-center gap-1.5 text-slate-800 font-bold">
                      <Calendar size={14} className="text-slate-400 shrink-0" />
                      <span>
                        {selectedBatch.tanggal} ({selectedBatch.waktu})
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Lokasi / tipeTuk
                    </span>
                    <div className="flex items-center gap-1.5 text-slate-800 font-bold">
                      {selectedBatch.metode === "Online" ? (
                        <Globe size={14} className="text-purple-500 shrink-0" />
                      ) : (
                        <MapPin size={14} className="text-[#008BE3] shrink-0" />
                      )}
                      <span className="truncate">{selectedBatch.tipeTuk}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Asesor Penguji
                    </span>
                    <div className="flex items-center gap-1.5 text-slate-800 font-bold">
                      <UserCheck
                        size={14}
                        className="text-slate-400 shrink-0"
                      />
                      <span className="truncate">{selectedBatch.asesor}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Total Peserta Asesi
                    </span>
                    <div className="flex items-center gap-1.5 text-slate-800 font-bold">
                      <Users size={14} className="text-slate-400 shrink-0" />
                      <span>
                        {selectedBatch.totalAsesi} Asesi (
                        {selectedBatch.kompetenCount} K,{" "}
                        {selectedBatch.belumKompetenCount} BK)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* CANDIDATE TABLE IN BATCH */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
                <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      Daftar Asesi / Peserta Batch ({selectedBatch.totalAsesi}{" "}
                      Asesi)
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Seluruh asesmen dalam batch ini telah selesai dilaksanakan
                    </p>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50/80 rounded-xl px-3.5 h-10.5 w-full sm:w-72 border border-gray-200 focus-within:border-[#008BE3] focus-within:ring-1 focus-within:ring-[#008BE3]/30 transition-all">
                    <Search className="text-gray-400 shrink-0" size={18} />
                    <input
                      type="text"
                      placeholder="Cari nama asesi atau NIK..."
                      value={batchSearchTerm}
                      onChange={(e) => setBatchSearchTerm(e.target.value)}
                      className="bg-transparent border-none focus:ring-0 text-xs md:text-sm w-full outline-none text-slate-800 placeholder-gray-400 font-semibold"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto relative">
                  <table className="w-full text-left border-collapse min-w-175">
                    <thead>
                      <tr className="bg-[#0F172A] border-b border-[#0F172A]">
                        <th className="px-4 py-3.5 text-xs font-bold text-white/90 uppercase tracking-wider w-12 text-center">
                          No
                        </th>
                        <th className="px-6 py-3.5 text-xs font-bold text-white/90 uppercase tracking-wider">
                          Nama Asesi &amp; NIK
                        </th>
                        <th className="px-6 py-3.5 text-xs font-bold text-white/90 uppercase tracking-wider">
                          Hasil Asesmen
                        </th>
                        <th className="px-6 py-3.5 text-xs font-bold text-white/90 uppercase tracking-wider">
                          Status Asesmen
                        </th>
                        <th className="px-6 py-3.5 text-xs font-bold text-white/90 uppercase tracking-wider text-center sticky right-0 bg-[#0F172A] z-10 w-32 border-l border-white/10">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-xs sm:text-sm font-medium">
                      {selectedBatch.asesiList
                        .filter((a: CompletedBatchAsesi) => {
                          if (!batchSearchTerm) return true;
                          const q = batchSearchTerm.toLowerCase();
                          return (
                            a.nama.toLowerCase().includes(q) ||
                            a.nik.includes(q)
                          );
                        })
                        .map((asesi: CompletedBatchAsesi, idx: number) => (
                          <tr
                            key={idx}
                            className="hover:bg-slate-50/80 transition-colors"
                          >
                            <td className="px-4 py-4 text-center font-bold text-slate-400">
                              {idx + 1}
                            </td>
                            <td className="px-6 py-4">
                              <div className="font-extrabold text-slate-900">
                                {asesi.nama}
                              </div>
                              <div className="text-xs text-slate-500 font-mono">
                                NIK: {asesi.nik}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${
                                  asesi.hasil === "Kompeten"
                                    ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                    : "bg-red-100 text-red-800 border border-red-200"
                                }`}
                              >
                                {asesi.hasil}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <CheckCircle size={12} /> Selesai
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center sticky right-0 bg-white group-hover:bg-slate-50/80 border-l border-gray-100">
                              <button
                                onClick={() => {
                                  const found = AssessmentItems.find(
                                    (a: AssessmentItem) =>
                                      a.nama?.toLowerCase() ===
                                      asesi.nama.toLowerCase(),
                                  ) || {
                                    id: asesi.id || "999",
                                    nama: asesi.nama,
                                    nik: asesi.nik,
                                    skema: selectedBatch.skema,
                                    asesor: selectedBatch.asesor,
                                    tipeTuk: selectedBatch.tipeTuk,
                                    metode: selectedBatch.metode,
                                    tglAsesmen: selectedBatch.tanggal,
                                    waktu: selectedBatch.waktu,
                                    status: "Selesai",
                                    hasil: asesi.hasil,
                                    apl01: { status: "Disetujui", catatan: "" },
                                    apl02: { status: "Disetujui", catatan: "" },
                                  };
                                  setSelectedAsesmen(found);
                                }}
                                className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-bold transition-all shadow-2xs inline-flex items-center gap-1.5 cursor-pointer"
                              >
                                <Eye size={14} className="text-[#008BE3]" />{" "}
                                Detail
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            /* LEVEL 1: BATCH CARDS GRID (MIRRORING asesor DAFTAR ASESMEN) */
            <div className="space-y-6">
              {/* Filters & Search Row */}
              <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
                {/* Filter Dropdown */}
                <div className="relative w-full md:w-64">
                  <Filter
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    size={16}
                  />
                  <select
                    value={batchTypeFilter}
                    onChange={(e) =>
                      setBatchTypeFilter(
                        e.target.value as "Semua" | "Offline" | "Online",
                      )
                    }
                    className="w-full appearance-none pl-10 pr-9 py-2.5 bg-gray-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#008BE3]/20 focus:border-[#008BE3] transition-all cursor-pointer"
                  >
                    <option value="Semua">
                      Semua Batch ({initialCompletedBatches.length})
                    </option>
                    <option value="Offline">
                      Offline Batch (
                      {
                        initialCompletedBatches.filter(
                          (b) => b.metode.toLowerCase() === "offline",
                        ).length
                      }
                      )
                    </option>
                    <option value="Online">
                      Online Batch (
                      {
                        initialCompletedBatches.filter(
                          (b) => b.metode.toLowerCase() === "online",
                        ).length
                      }
                      )
                    </option>
                  </select>
                  <ChevronDown
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    size={16}
                  />
                </div>

                {/* Search Input */}
                <div className="flex items-center gap-2 bg-gray-50/80 rounded-xl px-3.5 h-10.5 w-full md:w-80 border border-gray-200 focus-within:border-[#008BE3] focus-within:ring-1 focus-within:ring-[#008BE3]/30 transition-all">
                  <Search className="text-gray-400 shrink-0" size={18} />
                  <input
                    type="text"
                    placeholder="Cari Batch, Skema, atau Asesor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-transparent border-none focus:ring-0 text-xs md:text-sm w-full outline-none text-slate-800 placeholder-gray-400 font-semibold"
                  />
                </div>
              </div>

              {/* BATCH GRID CARDS */}
              {filteredBatches.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBatches.map((batch) => {
                    const isOnline = batch.metode.toLowerCase() === "online";

                    return (
                      <div
                        key={batch.kode}
                        className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-[#008BE3]/50 transition-all flex flex-col justify-between overflow-hidden group"
                      >
                        {/* Card Top Header */}
                        <div className="p-5 space-y-3.5">
                          <div className="flex items-center justify-between gap-2">
                            {/* Batch Code Badge */}
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-black tracking-wide border border-slate-200">
                              <Layers size={13} className="text-slate-500" />
                              {batch.kode}
                            </div>

                            {/* Assessment Type Badge */}
                            {isOnline ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                                <Video size={12} className="stroke-[2.5]" />
                                Online
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <Building2 size={12} className="stroke-[2.5]" />
                                Offline
                              </span>
                            )}
                          </div>

                          {/* Batch Name & Scheme */}
                          <div className="min-w-0">
                            <h3 className="text-base font-black text-slate-900 group-hover:text-[#008BE3] transition-colors leading-snug">
                              {batch.nama}
                            </h3>
                            <p className="text-xs font-semibold text-slate-500 mt-0.5 leading-relaxed line-clamp-1">
                              {batch.skema}
                            </p>
                          </div>

                          {/* Meta Information */}
                          <div className="pt-2 border-t border-slate-100 space-y-2 text-xs font-medium text-slate-600">
                            {/* Date & Time */}
                            <div className="flex items-center gap-2 flex-wrap">
                              <div className="flex items-center gap-1.5">
                                <Calendar
                                  size={14}
                                  className="text-slate-400 shrink-0"
                                />
                                <span>{batch.tanggal}</span>
                              </div>
                              <span className="text-slate-300">•</span>
                              <div className="flex items-center gap-1.5">
                                <Clock
                                  size={14}
                                  className="text-slate-400 shrink-0"
                                />
                                <span className="font-semibold text-slate-700">
                                  {batch.waktu}
                                </span>
                              </div>
                            </div>

                            {/* Location / tipeTuk */}
                            <div className="flex items-start gap-2">
                              {isOnline ? (
                                <>
                                  <Globe
                                    size={14}
                                    className="text-purple-500 shrink-0 mt-0.5"
                                  />
                                  <span className="text-purple-700 font-semibold wrap-break-word leading-snug">
                                    {batch.tipeTuk}
                                  </span>
                                </>
                              ) : (
                                <>
                                  <MapPin
                                    size={14}
                                    className="text-[#008BE3] shrink-0 mt-0.5"
                                  />
                                  <span className="text-slate-700 font-semibold wrap-break-word leading-snug">
                                    {batch.tipeTuk}
                                  </span>
                                </>
                              )}
                            </div>

                            {/* Asesor */}
                            <div className="flex items-center gap-1.5">
                              <UserCheck
                                size={14}
                                className="text-slate-400 shrink-0"
                              />
                              <span className="text-slate-700 font-semibold">
                                Asesor: {batch.asesor}
                              </span>
                            </div>

                            {/* Total Candidates & Progress */}
                            <div className="flex items-center justify-between gap-2 pt-1">
                              <div className="flex items-center gap-1.5 text-slate-700 font-bold">
                                <Users size={14} className="text-slate-400" />
                                <span>{batch.totalAsesi} Asesi</span>
                              </div>

                              <span className="text-[11px] font-bold text-slate-500 shrink-0">
                                Selesai ({batch.kompetenCount} K,{" "}
                                {batch.belumKompetenCount} BK)
                              </span>
                            </div>

                            {/* Mini Progress Bar */}
                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                                style={{ width: "100%" }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Card Footer Action */}
                        <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
                          <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                            <CheckCircle size={12} /> Batch Selesai
                          </span>

                          <button
                            onClick={() => setSelectedBatch(batch)}
                            className="bg-[#008BE3] hover:bg-[#0076C2] text-white px-3.5 py-1.5 rounded-lg font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 ml-auto cursor-pointer"
                          >
                            Lihat Detail Asesi
                            <ArrowRight size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 shadow-2xs">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                      <Search size={28} />
                    </div>
                    <h4 className="text-base font-bold text-slate-800">
                      Batch Tidak Ditemukan
                    </h4>
                    <p className="text-xs text-slate-500 max-w-md">
                      Tidak ada Batch Penugasan yang sesuai dengan filter atau
                      kata kunci pencarian Anda.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}{" "}
      {/* TAB 3: SIDANG PLENO */}
      {mainTab === "pleno" && (
        <div className="space-y-6">
          {!selectedPleno ? (
            <div className="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-base font-black text-slate-900 shrink-0">
                    Daftar Riwayat Sidang Pleno Selesai
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Sidang pleno penetapan kelulusan yang telah dilaksanakan dan
                    berstatus Selesai
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-gray-50/80 rounded-xl px-3 h-10.5 w-full sm:w-72 border border-gray-200/50 focus-within:border-[#008BE3]/40 transition-colors">
                  <Search className="text-gray-400 shrink-0" size={16} />
                  <input
                    type="text"
                    placeholder="Cari Batch, Title, No. SK, atau Skema..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-transparent border-none focus:ring-0 text-xs md:text-sm w-full outline-none text-gray-700 placeholder-gray-400 font-semibold"
                  />
                </div>
              </div>

              <div className="overflow-x-auto relative">
                <table className="w-full text-left border-collapse min-w-225">
                  <thead>
                    <tr className="bg-[#0F172A] border-b border-[#0F172A]">
                      <th className="px-6 py-3.5 text-xs font-bold text-white/90 uppercase tracking-wider whitespace-nowrap">
                        Batch &amp; Nama Pleno
                      </th>
                      <th className="px-6 py-3.5 text-xs font-bold text-white/90 uppercase tracking-wider whitespace-nowrap">
                        No. SK Keputusan
                      </th>
                      <th className="px-6 py-3.5 text-xs font-bold text-white/90 uppercase tracking-wider whitespace-nowrap">
                        Tanggal
                      </th>
                      <th className="px-6 py-3.5 text-xs font-bold text-white/90 uppercase tracking-wider whitespace-nowrap">
                        Tempat
                      </th>
                      <th className="px-6 py-3.5 text-xs font-bold text-white/90 uppercase tracking-wider whitespace-nowrap">
                        Waktu
                      </th>
                      <th className="px-6 py-3.5 text-xs font-bold text-white/90 uppercase tracking-wider whitespace-nowrap text-center">
                        Jumlah Asesi
                      </th>
                      <th className="px-6 py-3.5 text-xs font-bold text-white/90 uppercase tracking-wider whitespace-nowrap">
                        Status
                      </th>
                      <th className="px-6 py-3.5 text-xs font-bold text-white/90 uppercase tracking-wider text-center whitespace-nowrap w-28 sm:w-32 sticky right-0 bg-[#0F172A] z-20 border-l border-white/10 shadow-[-6px_0_15px_-4px_rgba(0,0,0,0.06)]">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="font-medium text-xs sm:text-sm divide-y divide-gray-100">
                    {filteredPleno.length > 0 ? (
                      filteredPleno.map((item) => (
                        <tr
                          key={item.id}
                          className="group/row hover:bg-[#F9FAFC] transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2.5">
                              <span className="font-bold text-slate-900 group-hover/row:text-[#008BE3] transition-colors">
                                {item.title || `Sidang Pleno ${item.skema}`}
                              </span>
                              <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                                {item.batchCode || item.id}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="font-mono font-bold text-slate-700 bg-sky-50 ] border border-sky-100 px-2.5 py-1 rounded-md">
                              {item.noSK}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-1.5 font-bold text-slate-800">
                              <Calendar size={13} className="text-[#008BE3]" />
                              {item.tanggal}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-1.5 text-slate-700 font-medium text-xs">
                              <MapPin
                                size={13}
                                className="text-[#008BE3] shrink-0"
                              />
                              <span className="truncate max-w-50">
                                {item.alamat}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-1.5 text-slate-600 font-medium text-xs">
                              <Clock
                                size={13}
                                className="text-[#008BE3] shrink-0"
                              />
                              {item.waktu}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center whitespace-nowrap">
                            <span className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-full font-bold text-[11px] inline-flex items-center gap-1">
                              <Users size={12} className="text-[#008BE3]" />
                              {item.asesiList?.length || 0} Asesi
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 border bg-emerald-50 text-emerald-700 border-emerald-200">
                              <CheckCircle size={12} className="stroke-[2.5]" />
                              Selesai
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center whitespace-nowrap bg-white group-hover/row:bg-[#F9FAFC] border-l border-gray-100 sticky right-0 z-10">
                            <button
                              onClick={() => setSelectedPleno(item)}
                              className="bg-sky-50 text-[#008BE3] border border-sky-200 hover:bg-[#008BE3] hover:text-white px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-2xs"
                            >
                              <span>Detail</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="px-6 py-16 text-center">
                          <div className="flex flex-col items-center justify-center text-gray-400">
                            <Award size={36} className="mb-2 text-slate-300" />
                            <p className="font-bold text-slate-700 text-base">
                              Tidak ada riwayat sidang pleno selesai ditemukan
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                              Coba kata kunci pencarian lain.
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* DETAIL VIEW SIDANG PLENO SELESAI */
            <div className="space-y-6">
              {/* Back button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedPleno(null)}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-[#008BE3] bg-[#008BE3]/10 hover:bg-[#008BE3]/20 transition-colors cursor-pointer shrink-0"
                    title="Kembali ke Daftar Riwayat Pleno"
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <span className="text-sm font-bold text-slate-800">
                    Kembali ke Daftar Riwayat Pleno
                  </span>
                </div>

                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-xl flex items-center gap-1.5">
                  <CheckCircle
                    size={15}
                    className="shrink-0 text-emerald-600"
                  />
                  Status Sidang: Selesai
                </span>
              </div>

              {/* Header Info Pleno */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <span className="font-mono text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-lg">
                    {selectedPleno.batchCode || selectedPleno.id}
                  </span>
                  <span className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border bg-emerald-50 text-emerald-700 border-emerald-200">
                    Status: Selesai
                  </span>
                </div>
                <h2 className="text-lg md:text-xl font-black text-slate-900">
                  {selectedPleno.title || `Sidang Pleno ${selectedPleno.skema}`}
                </h2>
                <p className="text-xs text-slate-600 font-medium">
                  Skema Sertifikasi:{" "}
                  <span className="font-bold text-slate-800">
                    {selectedPleno.skema}
                  </span>
                </p>
              </div>

              {/* Section 1: Informasi Keputusan & Jadwal Sidang */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-5">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Scale size={18} className="text-[#008BE3]" />
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                    Informasi Keputusan &amp; Jadwal Sidang
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">
                      Nama Sidang
                    </label>
                    <div className="font-bold text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 truncate">
                      {selectedPleno.title || "-"}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">
                      Rentang Tanggal Pelaksanaan
                    </label>
                    <div className="font-bold text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5">
                      {selectedPleno.tanggal || "-"}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">
                      tipeTuk
                    </label>
                    <div className="font-bold text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5">
                      {selectedPleno.alamat || "-"}
                    </div>
                  </div>
                </div>

                {/* Peserta Sidang (Direktur, dewan_pengarah, Komite & Notulis) */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">
                    Peserta Sidang (Direktur, Pengarah &amp; Komite)
                  </label>
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl min-h-11 flex flex-wrap gap-2 items-center">
                    {(() => {
                      const attendees =
                        selectedPleno.plenoAttendees &&
                        selectedPleno.plenoAttendees.length > 0
                          ? selectedPleno.plenoAttendees.filter(
                              (a) =>
                                a.nama.trim() !== "" &&
                                a.role !== "Pimpinan Sidang",
                            )
                          : [
                              { role: "Direktur", nama: "Prof. Dr. H. Ahmad" },
                              {
                                role: "dewan_pengarah",
                                nama: "Dr. Ir. H. Muhammad Zulkifli, M.T.",
                              },

                              {
                                role: "komite_skema",
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

              {/* Section 2: Dokumen Keputusan & Surat Hasil Pleno */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2 text-slate-900 font-bold">
                    <Link2 size={18} className="text-[#008BE3]" />
                    <span className="text-sm font-black uppercase tracking-wider">
                      Dokumen Keputusan &amp; Surat Hasil Pleno
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-[#008BE3] bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
                    Dokumen Penetapan Resmi
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Link 1: Surat Berita Acara Pleno */}
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                    <span className="text-xs font-bold text-slate-700 block">
                      1. Surat Berita Acara Pleno
                    </span>
                    {selectedPleno.linkSuratBeritaPleno ? (
                      <a
                        href={selectedPleno.linkSuratBeritaPleno}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#008BE3] hover:underline truncate max-w-full"
                      >
                        <ExternalLink size={14} className="shrink-0" />
                        <span className="truncate">Buka Link</span>
                      </a>
                    ) : (
                      <p className="text-xs text-slate-400 font-medium">
                        Belum dilampirkan
                      </p>
                    )}
                  </div>

                  {/* Link 2: Surat Keputusan Direktur */}
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                    <span className="text-xs font-bold text-slate-700 block">
                      2. Surat Keputusan Direktur
                    </span>
                    {selectedPleno.linkSuratKeputusanDirektur ||
                    selectedPleno.linkSuratHasil ? (
                      <a
                        href={
                          selectedPleno.linkSuratKeputusanDirektur ||
                          selectedPleno.linkSuratHasil
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#008BE3] hover:underline truncate max-w-full"
                      >
                        <ExternalLink size={14} className="shrink-0" />
                        <span className="truncate">Buka Link</span>
                      </a>
                    ) : (
                      <p className="text-xs text-slate-400 font-medium">
                        Belum dilampirkan
                      </p>
                    )}
                  </div>

                  {/* Link 3: Surat Blanko BNSP */}
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                    <span className="text-xs font-bold text-slate-700 block">
                      3. Surat Blanko BNSP
                    </span>
                    {selectedPleno.linkSuratBlankoBNSP ? (
                      <a
                        href={selectedPleno.linkSuratBlankoBNSP}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#008BE3] hover:underline truncate max-w-full"
                      >
                        <ExternalLink size={14} className="shrink-0" />
                        <span className="truncate">Buka Link</span>
                      </a>
                    ) : (
                      <p className="text-xs text-slate-400 font-medium">
                        Belum dilampirkan
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 3: Tabel Asesi & Status K / BK */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden space-y-4 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <Users size={18} className="text-[#008BE3]" />
                      Daftar Asesi &amp; Penetapan Status Kelulusan (K / BK)
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Hasil kelulusan rekomendasi asesor dan keputusan sidang
                      pleno.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold">
                      K:{" "}
                      {selectedPleno.asesiList?.filter(
                        (a: AsesiPlenoItem | string | number) =>
                          typeof a === "object" &&
                          a !== null &&
                          a.statusPleno === "K",
                      ).length || 0}
                    </span>
                    <span className="px-3 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold">
                      BK:{" "}
                      {selectedPleno.asesiList?.filter(
                        (a: AsesiPlenoItem | string | number) =>
                          typeof a === "object" &&
                          a !== null &&
                          a.statusPleno === "BK",
                      ).length || 0}
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-175 ">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 border-y border-slate-200">
                        <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">
                          No
                        </th>
                        <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">
                          nik / ID
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
                          Status Sidang Pleno (K/BK)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs font-medium">
                      {(selectedPleno.asesiList || []).map(
                        (
                          asesiItem: AsesiPlenoItem | string | number,
                          idx: number,
                        ) => {
                          const asesi: AsesiPlenoItem =
                            typeof asesiItem === "string" ||
                            typeof asesiItem === "number"
                              ? {
                                  id: `asesi-${idx}`,
                                  nik: `121705${1000 + idx}`,
                                  nama: String(asesiItem),
                                  skema: selectedPleno.skema,
                                  asesor: "Asesor LSP",
                                  rekomendasiAsesor: "K",
                                  statusPleno: "K",
                                }
                              : asesiItem;

                          return (
                            <tr
                              key={asesi.id || idx}
                              className="hover:bg-slate-50/80 transition-colors"
                            >
                              <td className="px-4 py-3 font-bold text-slate-500">
                                {idx + 1}
                              </td>
                              <td className="px-4 py-3 font-mono font-bold text-slate-700">
                                {asesi.nik}
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
                                    ? "Kompeten (K)"
                                    : "Belum Kompeten (BK)"}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span
                                  className={`px-3 py-1 rounded-lg text-xs font-bold ${
                                    asesi.statusPleno === "K"
                                      ? "bg-emerald-600 text-white"
                                      : "bg-rose-600 text-white"
                                  }`}
                                >
                                  {asesi.statusPleno === "K"
                                    ? "Kompeten (K)"
                                    : "Belum Kompeten (BK)"}
                                </span>
                              </td>
                            </tr>
                          );
                        },
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {/* MODAL PREVIEW SURAT SK PLENO */}
      {previewPlenoDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden my-auto">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white shrink-0">
              <div className="flex items-center gap-2">
                <FileText className="text-[#008BE3]" size={20} />
                <span className="font-bold text-sm">
                  Dokumen SK Pleno: {previewPlenoDoc.noSK}
                </span>
              </div>
              <button
                onClick={() => setPreviewPlenoDoc(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 bg-slate-100 flex items-center justify-center">
              <div className="bg-white p-8 rounded-xl shadow-md border border-slate-300 max-w-2xl w-full text-slate-800 space-y-6">
                <div className="text-center border-b pb-4 border-slate-300 space-y-1">
                  <h2 className="text-lg font-black text-slate-900 tracking-wider">
                    LSP SERTIFIKASI PROFESI INDONESIA
                  </h2>
                  <p className="text-xs font-bold text-[#008BE3]">
                    SURAT KEPUTUSAN SIDANG PLENO
                  </p>
                  <p className="text-xs text-slate-500 font-semibold">
                    Nomor SK: {previewPlenoDoc.noSK}
                  </p>
                </div>

                <div className="space-y-3 text-xs leading-relaxed">
                  <p className="font-bold text-slate-900">
                    Tentang: Penetapan dan Pengesahan Hasil Uji Kompetensi Asesi
                  </p>
                  <p>
                    Pada hari ini <strong>{previewPlenoDoc.tanggal}</strong>{" "}
                    bertempat di {previewPlenoDoc.alamat}, Komite Sidang Pleno
                    LSP telah melakukan peninjauan rekam jejak asesmen untipeTuk
                    skema:
                  </p>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg font-bold text-[#008BE3]">
                    {previewPlenoDoc.skema}
                  </div>
                  <p>
                    Dengan total peserta sebanyak{" "}
                    <strong>{previewPlenoDoc.asesiList.length} Asesi</strong>.
                    Seluruh proses asesmen dinyatakan sah dan memenuhi standar
                    mutu sertifikasi BNSP.
                  </p>
                </div>

                <div className="border-t pt-4 border-slate-200 flex justify-between items-end text-xs">
                  <div className="text-right">
                    <p className="text-slate-400 text-[10px] font-bold uppercase">
                      Status Pengesahan
                    </p>
                    <span className="inline-block mt-2 px-3 py-1 bg-emerald-100 text-emerald-800 font-bold rounded">
                      RESMI &amp; TERVERIFIKASI
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
