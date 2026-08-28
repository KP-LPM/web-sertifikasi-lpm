"use client";
import React, { useState, useMemo } from "react";
import {
  FileText,
  Search,
  Plus,
  Download,
  ExternalLink,
  CheckCircle2,
  Award,
  FileCheck2,
  Inbox,
  Send,
  X,
  Printer,
  Copy,
  Calendar,
  FileSpreadsheet,
} from "lucide-react";
import { SuratItem, KategoriSurat, SubJenisSurat } from "@/types/types";
import { useAppContext } from "@/context/context";

// Initial Mock Data for Generated Documents & Certificates
const INITIAL_SURAT_DATA: SuratItem[] = [
  {
    id: "DOC-2026-001",
    nomorSurat: "BA/014/PLENO-LSP/VIII/2026",
    judul: "Berita Acara Sidang Pleno Penetapan Asesmen Gelombang VIII 2026",
    kategori: "surat_masuk",
    jenisSurat: "berita_acara_pleno",
    namaJenisSurat: "Surat Berita Acara Pleno",
    tanggalDibuat: "2026-08-25",
    tanggalTerbit: "2026-08-25",
    penerbit: "Komite Teknis Sidang Pleno LSP",
    penerima: "Direktur LSP UIN Sunan Gunung Djati",
    skemaSertifikasi: "Pemrogram Mobil Pertama (Mobile Developer)",
    jumlahAsesi: 12,
    status: "Terbit",
    pimpinanSidang: "Dr. H. Ahmad Fauzi, M.Kom.",
    notulis: "Rahmat Hidayat, S.T.",
    lokasi: "Ruang Rapat Utama LSP UIN Sunan Gunung Djati Bandung",
    catatan: "Berita Acara Penetapan 12 Asesi Kompeten.",
    urlGdrive: "https://drive.google.com/file/d/BA_Pleno_Aug2026/view",
  },
  {
    id: "DOC-2026-002",
    nomorSurat: "SK/088/DIR-LSP/VIII/2026",
    judul:
      "Surat Keputusan Direktur LSP tentang Hasil Kelulusan Asesmen Sertifikasi Periode Agustus 2026",
    kategori: "surat_masuk",
    jenisSurat: "keputusan_pleno",
    namaJenisSurat: "Surat Hasil Keputusan Pleno",
    tanggalDibuat: "2026-08-26",
    tanggalTerbit: "2026-08-26",
    penerbit: "Direktur LSP UIN Sunan Gunung Djati",
    penerima: "Ketua Komite Sertifikasi & Arsip Internal",
    skemaSertifikasi:
      "Multi Skema (Mobile Developer, Web Developer, Auditor Halal)",
    jumlahAsesi: 28,
    status: "Terbit",
    noSK: "SK-DIR/088/LSP-SGD/VIII/2026",
    pimpinanSidang: "Dr. H. Ahmad Fauzi, M.Kom.",
    catatan: "Keputusan resmi kelulusan pleno 28 asesi.",
    urlGdrive: "https://drive.google.com/file/d/SK_Hasil_Pleno_2026/view",
  },
  {
    id: "DOC-2026-003",
    nomorSurat: "BA/012/PLENO-LSP/VII/2026",
    judul:
      "Berita Acara Sidang Pleno Hasil Rekomendasi Asesmen Gelombang VII 2026",
    kategori: "surat_masuk",
    jenisSurat: "berita_acara_pleno",
    namaJenisSurat: "Surat Berita Acara Pleno",
    tanggalDibuat: "2026-07-20",
    tanggalTerbit: "2026-07-20",
    penerbit: "Komite Teknis Pleno",
    penerima: "Direktur LSP UIN Sunan Gunung Djati",
    skemaSertifikasi: "Network Administrator",
    jumlahAsesi: 15,
    status: "Terbit",
    pimpinanSidang: "Drs. H. Hendra Wijaya, M.T.",
    notulis: "Siti Aminah, S.Kom.",
    urlGdrive: "https://drive.google.com/file/d/BA_Pleno_Jul2026/view",
  },
  {
    id: "DOC-2026-004",
    nomorSurat: "ST/105/LSP-SGD/VIII/2026",
    judul: "Surat Penugasan Asesor Kompetensi Uji Sertifikasi Mobile Developer",
    kategori: "surat_keluar",
    jenisSurat: "penugasan_asesor",
    namaJenisSurat: "Surat Penugasan Asesor",
    tanggalDibuat: "2026-08-10",
    tanggalTerbit: "2026-08-10",
    penerbit: "Ketua LSP UIN Sunan Gunung Djati",
    penerima: "Drs. Ir. M. Nurhadi, M.T. (Asesor MET.000.003412)",
    namaAsesor: "Drs. Ir. M. Nurhadi, M.T.",
    noMetAsesor: "MET.000.003412",
    skemaSertifikasi: "Pemrogram Mobil Pertama (Mobile Developer)",
    jumlahAsesi: 8,
    status: "Terbit",
    lokasi: "TUK Lab Komputer Terpadu Saintek",
    urlGdrive: "https://drive.google.com/file/d/ST_Asesor_Nurhadi_Aug2026/view",
  },
  {
    id: "DOC-2026-005",
    nomorSurat: "BNSP/410/LSP-SGD/VIII/2026",
    judul:
      "Surat Permohonan & Laporan Permintaan Blanko Sertifikat BNSP Gelombang VIII",
    kategori: "surat_keluar",
    jenisSurat: "blanko_bnsp",
    namaJenisSurat: "Surat Blanko BNSP",
    tanggalDibuat: "2026-08-27",
    tanggalTerbit: "2026-08-27",
    penerbit: "Manajer Operasional LSP UIN Sunan Gunung Djati",
    penerima: "Ketua Badan Nasional Sertifikasi Profesi (BNSP) Jakarta",
    skemaSertifikasi: "Pemrogram Mobil Pertama & Junior Web Developer",
    jumlahAsesi: 25,
    status: "Disetujui",
    catatan: "Permohonan 25 lembar blanko sertifikat BNSP.",
    urlGdrive: "https://drive.google.com/file/d/BNSP_Blanko_Req_Aug2026/view",
  },
  {
    id: "DOC-2026-006",
    nomorSurat: "ST/098/LSP-SGD/VII/2026",
    judul: "Surat Penugasan Asesor Asesmen Kompetensi Auditor Halal",
    kategori: "surat_keluar",
    jenisSurat: "penugasan_asesor",
    namaJenisSurat: "Surat Penugasan Asesor",
    tanggalDibuat: "2026-07-15",
    tanggalTerbit: "2026-07-15",
    penerbit: "Ketua LSP UIN Sunan Gunung Djati",
    penerima: "Dr. Hj. Fitriani, M.Ag. (Asesor MET.000.004891)",
    namaAsesor: "Dr. Hj. Fitriani, M.Ag.",
    noMetAsesor: "MET.000.004891",
    skemaSertifikasi: "Auditor Halal",
    jumlahAsesi: 10,
    status: "Terbit",
    urlGdrive:
      "https://drive.google.com/file/d/ST_Asesor_Fitriani_Jul2026/view",
  },
  {
    id: "DOC-2026-006B",
    nomorSurat: "SP/042/LSP-SGD/VIII/2026",
    judul:
      "Surat Permohonan Peminjaman Asesor Kompetensi Bidang Pemrograman Mobil",
    kategori: "surat_keluar",
    jenisSurat: "peminjaman_asesor",
    namaJenisSurat: "Surat Peminjaman Asesor",
    tanggalDibuat: "2026-08-20",
    tanggalTerbit: "2026-08-20",
    penerbit: "Direktur LSP UIN Sunan Gunung Djati",
    penerima: "Ketua LSP P1 Politeknik Negeri Bandung",
    namaAsesor: "Drs. Ir. M. Nurhadi, M.T.",
    skemaSertifikasi: "Pemrogram Mobil Pertama (Mobile Developer)",
    status: "Terbit",
    urlGdrive:
      "https://drive.google.com/file/d/SP_Peminjaman_Asesor_Aug2026/view",
  },
  {
    id: "DOC-2026-007",
    nomorSurat: "50012/LSP-SGD/VIII/2026",
    judul: "Sertifikat Kompetensi BNSP - Ahmad Rizki",
    kategori: "sertifikat",
    jenisSurat: "sertifikat_kompetensi",
    namaJenisSurat: "Sertifikat Kompetensi BNSP",
    tanggalDibuat: "2026-08-16",
    tanggalTerbit: "2026-08-16",
    penerbit: "LSP UIN Sunan Gunung Djati & BNSP",
    penerima: "Ahmad Rizki (NIM: 1197050001)",
    skemaSertifikasi: "Pemrogram Mobil Pertama (Mobile Developer)",
    status: "Terbit",
    urlGdrive:
      "https://drive.google.com/file/d/1A2b3C4d5E6f7G8h9I0j_Cert1/view",
    catatan: "Telah terverifikasi BNSP",
  },
  {
    id: "DOC-2026-008",
    nomorSurat: "50013/LSP-SGD/VIII/2026",
    judul: "Sertifikat Kompetensi BNSP - Siti Nurhaliza",
    kategori: "sertifikat",
    jenisSurat: "sertifikat_kompetensi",
    namaJenisSurat: "Sertifikat Kompetensi BNSP",
    tanggalDibuat: "2026-08-16",
    tanggalTerbit: "2026-08-16",
    penerbit: "LSP UIN Sunan Gunung Djati & BNSP",
    penerima: "Siti Nurhaliza (NIM: 1197050012)",
    skemaSertifikasi: "Junior Web Developer",
    status: "Terbit",
    urlGdrive:
      "https://drive.google.com/file/d/2B3c4D5e6F7g8H9i0J1k_Cert2/view",
    catatan: "Dokumen diunggah ke GDrive LSP",
  },
  {
    id: "DOC-2026-009",
    nomorSurat: "50014/LSP-SGD/VIII/2026",
    judul: "Sertifikat Kompetensi BNSP - Dewi Anggraini",
    kategori: "sertifikat",
    jenisSurat: "sertifikat_kompetensi",
    namaJenisSurat: "Sertifikat Kompetensi BNSP",
    tanggalDibuat: "2026-08-16",
    tanggalTerbit: "2026-08-16",
    penerbit: "LSP UIN Sunan Gunung Djati & BNSP",
    penerima: "Dewi Anggraini (NIM: 1197050031)",
    skemaSertifikasi: "Junior Web Developer",
    status: "Terbit",
    urlGdrive:
      "https://drive.google.com/file/d/3C4d5E6f7G8h9I0j1K2l_Cert3/view",
  },
  {
    id: "DOC-2026-010",
    nomorSurat: "50020/LSP-SGD/VIII/2026",
    judul: "Sertifikat Kompetensi BNSP - Dewi Lestari",
    kategori: "sertifikat",
    jenisSurat: "sertifikat_kompetensi",
    namaJenisSurat: "Sertifikat Kompetensi BNSP",
    tanggalDibuat: "2026-08-18",
    tanggalTerbit: "2026-08-18",
    penerbit: "LSP UIN Sunan Gunung Djati & BNSP",
    penerima: "Dewi Lestari (NIM: 1197050044)",
    skemaSertifikasi: "Junior Web Developer",
    status: "Terbit",
    urlGdrive:
      "https://drive.google.com/file/d/4D5e6F7g8H9i0J1k2L3m_Cert4/view",
    catatan: "Lulus Sidang Pleno",
  },
  {
    id: "DOC-2026-011",
    nomorSurat: "50021/LSP-SGD/VIII/2026",
    judul: "Sertifikat Kompetensi BNSP - Hendra Wijaya",
    kategori: "sertifikat",
    jenisSurat: "sertifikat_kompetensi",
    namaJenisSurat: "Sertifikat Kompetensi BNSP",
    tanggalDibuat: "2026-08-18",
    tanggalTerbit: "2026-08-18",
    penerbit: "LSP UIN Sunan Gunung Djati & BNSP",
    penerima: "Hendra Wijaya (NIM: 1197050070)",
    skemaSertifikasi: "Auditor Halal",
    status: "Terbit",
    urlGdrive:
      "https://drive.google.com/file/d/5E6f7G8h9I0j1K2l3M4n_Cert5/view",
  },
];

export default function KelolaSurat() {
  const { user } = useAppContext();
  const readOnly = user?.role !== "admin";

  const [documents, setDocuments] = useState<SuratItem[]>(INITIAL_SURAT_DATA);
  const [activeCategory, setActiveCategory] = useState<"all" | KategoriSurat>(
    "all",
  );
  const [selectedSubJenis, setSelectedSubJenis] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Modal States
  const [selectedDocForPreview, setSelectedDocForPreview] =
    useState<SuratItem | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State for creating new document
  const [formData, setFormData] = useState<Partial<SuratItem>>({
    nomorSurat: "",
    judul: "",
    kategori: "surat_masuk",
    jenisSurat: "berita_acara_pleno",
    tanggalDibuat: new Date().toISOString().split("T")[0],
    tanggalTerbit: new Date().toISOString().split("T")[0],
    penerbit: "LSP UIN Sunan Gunung Djati Bandung",
    penerima: "",
    skemaSertifikasi: "Pemrogram Mobil Pertama (Mobile Developer)",
    status: "Terbit",
    urlGdrive: "",
    catatan: "",
  });

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Filtered Documents
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      // Category Filter
      if (activeCategory !== "all" && doc.kategori !== activeCategory) {
        return false;
      }
      // Sub-type Filter
      if (selectedSubJenis !== "all" && doc.jenisSurat !== selectedSubJenis) {
        return false;
      }
      // Status Filter
      if (statusFilter !== "all" && doc.status !== statusFilter) {
        return false;
      }
      // Search Query
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matchesNo = doc.nomorSurat.toLowerCase().includes(q);
        const matchesJudul = doc.judul.toLowerCase().includes(q);
        const matchesPenerbit = doc.penerbit.toLowerCase().includes(q);
        const matchesPenerima = doc.penerima.toLowerCase().includes(q);
        const matchesSkema = (doc.skemaSertifikasi || "")
          .toLowerCase()
          .includes(q);
        const matchesTanggal = (doc.tanggalDibuat || "")
          .toLowerCase()
          .includes(q);
        return (
          matchesNo ||
          matchesJudul ||
          matchesPenerbit ||
          matchesPenerima ||
          matchesSkema ||
          matchesTanggal
        );
      }
      return true;
    });
  }, [documents, activeCategory, selectedSubJenis, statusFilter, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const total = documents.length;
    const suratMasuk = documents.filter(
      (d) => d.kategori === "surat_masuk",
    ).length;
    const suratKeluar = documents.filter(
      (d) => d.kategori === "surat_keluar",
    ).length;
    const sertifikat = documents.filter(
      (d) => d.kategori === "sertifikat",
    ).length;
    return { total, suratMasuk, suratKeluar, sertifikat };
  }, [documents]);

  const handleCreateDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nomorSurat) {
      alert("Mohon isi Nomor Surat terlebih dahulu.");
      return;
    }

    let namaJenis = "Surat Berita Acara Pleno";
    if (formData.jenisSurat === "keputusan_pleno")
      namaJenis = "Surat Hasil Keputusan Pleno";
    if (formData.jenisSurat === "blanko_bnsp") namaJenis = "Surat Blanko BNSP";
    if (formData.jenisSurat === "penugasan_asesor")
      namaJenis = "Surat Penugasan Asesor";
    if (formData.jenisSurat === "peminjaman_asesor")
      namaJenis = "Surat Peminjaman Asesor";
    if (formData.jenisSurat === "sertifikat_kompetensi")
      namaJenis = "Sertifikat Kompetensi BNSP";

    const newDoc: SuratItem = {
      id: `DOC-2026-${String(documents.length + 1).padStart(3, "0")}`,
      nomorSurat: formData.nomorSurat,
      judul: namaJenis,
      kategori: formData.kategori || "surat_masuk",
      jenisSurat: formData.jenisSurat || "berita_acara_pleno",
      namaJenisSurat: namaJenis,
      tanggalDibuat:
        formData.tanggalDibuat || new Date().toISOString().split("T")[0],
      tanggalTerbit:
        formData.tanggalTerbit || new Date().toISOString().split("T")[0],
      penerbit: formData.penerbit || "LSP UIN Sunan Gunung Djati",
      penerima: formData.penerima || "Umum",
      skemaSertifikasi: formData.skemaSertifikasi || "-",
      status: formData.status || "Terbit",
      urlGdrive: formData.urlGdrive || "",
      catatan: formData.catatan || "",
    };

    setDocuments([newDoc, ...documents]);
    setIsCreateModalOpen(false);
    showNotification(
      `Dokumen "${newDoc.nomorSurat}" berhasil didaftarkan dan disimpan.`,
    );
    setFormData({
      nomorSurat: "",
      judul: "",
      kategori: "surat_masuk",
      jenisSurat: "berita_acara_pleno",
      tanggalDibuat: new Date().toISOString().split("T")[0],
      tanggalTerbit: new Date().toISOString().split("T")[0],
      penerbit: "LSP UIN Sunan Gunung Djati Bandung",
      penerima: "",
      skemaSertifikasi: "Pemrogram Mobil Pertama (Mobile Developer)",
      status: "Terbit",
      urlGdrive: "",
      catatan: "",
    });
  };

  const handleCopyLink = (url?: string, nomor?: string) => {
    const link =
      url ||
      `https://drive.google.com/file/d/verify/${encodeURIComponent(nomor || "")}`;
    navigator.clipboard.writeText(link);
    showNotification(`Tautan GDrive (${nomor}) berhasil disalin.`);
  };

  const handleSimulateDownload = (doc: SuratItem) => {
    showNotification(`Mengunduh file PDF untuk ${doc.nomorSurat}...`);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] p-4 md:p-8 space-y-6 pb-24 text-sm text-gray-700">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-200 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="text-emerald-400 shrink-0" size={20} />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Page Title Section matching Admin Overview & Manage pages */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-[#008BE3]/10 flex items-center justify-center text-[#008BE3] border border-[#008BE3]/20 shadow-xs shrink-0">
            <FileCheck2 size={20} className="stroke-[2.5]" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">
              Kelola Surat & Sertifikat
            </h1>
            <p className="text-xs text-gray-500 font-medium tracking-wider uppercase leading-4">
              Arsip Terpusat Surat Masuk, Surat Keluar, dan Sertifikat LSP
            </p>
          </div>
        </div>

        {!readOnly && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-[#008BE3] hover:bg-[#0076C2] text-white px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-sm w-full sm:w-auto justify-center"
          >
            <Plus size={18} />
            Buat / Register Surat Baru
          </button>
        )}
      </div>

      {/* Overview Stat Cards matching Admin Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => {
            setActiveCategory("all");
            setSelectedSubJenis("all");
          }}
          className={`p-5 rounded-xl border transition-all cursor-pointer ${
            activeCategory === "all"
              ? "bg-linear-to-br from-slate-900 to-slate-800 text-white border-slate-900 shadow-sm scale-[1.01]"
              : "bg-white border-gray-100 text-slate-900 hover:border-gray-200 shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span
              className={`text-xs font-bold uppercase tracking-wider ${activeCategory === "all" ? "text-slate-300" : "text-slate-500"}`}
            >
              Total Dokumen
            </span>
            <div
              className={`p-2 rounded-lg ${activeCategory === "all" ? "bg-white/10 text-white" : "bg-slate-100 text-slate-700"}`}
            >
              <FileSpreadsheet size={18} />
            </div>
          </div>
          <div className="text-2xl font-black mb-0.5">{stats.total}</div>
          <p
            className={`text-[11px] font-medium ${activeCategory === "all" ? "text-slate-300" : "text-slate-400"}`}
          >
            Arsip terpusat disistem
          </p>
        </div>

        <div
          onClick={() => {
            setActiveCategory("surat_masuk");
            setSelectedSubJenis("all");
          }}
          className={`p-5 rounded-xl border transition-all cursor-pointer ${
            activeCategory === "surat_masuk"
              ? "bg-emerald-600 text-white border-emerald-600 shadow-sm scale-[1.01]"
              : "bg-white border-gray-100 text-slate-900 hover:border-emerald-200 shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span
              className={`text-xs font-bold uppercase tracking-wider ${activeCategory === "surat_masuk" ? "text-emerald-100" : "text-emerald-600"}`}
            >
              Surat Masuk
            </span>
            <div
              className={`p-2 rounded-lg ${activeCategory === "surat_masuk" ? "bg-white/20 text-white" : "bg-emerald-50 text-emerald-600"}`}
            >
              <Inbox size={18} />
            </div>
          </div>
          <div className="text-2xl font-black mb-0.5">{stats.suratMasuk}</div>
          <p
            className={`text-[11px] font-medium ${activeCategory === "surat_masuk" ? "text-emerald-100" : "text-slate-400"}`}
          >
            Berita Acara & SK Pleno
          </p>
        </div>

        <div
          onClick={() => {
            setActiveCategory("surat_keluar");
            setSelectedSubJenis("all");
          }}
          className={`p-5 rounded-xl border transition-all cursor-pointer ${
            activeCategory === "surat_keluar"
              ? "bg-sky-600 text-white border-sky-600 shadow-sm scale-[1.01]"
              : "bg-white border-gray-100 text-slate-900 hover:border-sky-200 shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span
              className={`text-xs font-bold uppercase tracking-wider ${activeCategory === "surat_keluar" ? "text-sky-100" : "text-sky-600"}`}
            >
              Surat Keluar
            </span>
            <div
              className={`p-2 rounded-lg ${activeCategory === "surat_keluar" ? "bg-white/20 text-white" : "bg-sky-50 text-sky-600"}`}
            >
              <Send size={18} />
            </div>
          </div>
          <div className="text-2xl font-black mb-0.5">{stats.suratKeluar}</div>
          <p
            className={`text-[11px] font-medium ${activeCategory === "surat_keluar" ? "text-sky-100" : "text-slate-400"}`}
          >
            Surat BNSP & Tugas Asesor
          </p>
        </div>

        <div
          onClick={() => {
            setActiveCategory("sertifikat");
            setSelectedSubJenis("all");
          }}
          className={`p-5 rounded-xl border transition-all cursor-pointer ${
            activeCategory === "sertifikat"
              ? "bg-amber-600 text-white border-amber-600 shadow-sm scale-[1.01]"
              : "bg-white border-gray-100 text-slate-900 hover:border-amber-200 shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span
              className={`text-xs font-bold uppercase tracking-wider ${activeCategory === "sertifikat" ? "text-amber-100" : "text-amber-600"}`}
            >
              Sertifikat
            </span>
            <div
              className={`p-2 rounded-lg ${activeCategory === "sertifikat" ? "bg-white/20 text-white" : "bg-amber-50 text-amber-600"}`}
            >
              <Award size={18} />
            </div>
          </div>
          <div className="text-2xl font-black mb-0.5">{stats.sertifikat}</div>
          <p
            className={`text-[11px] font-medium ${activeCategory === "sertifikat" ? "text-amber-100" : "text-slate-400"}`}
          >
            Sertifikat BNSP Terbit
          </p>
        </div>
      </div>

      {/* Navigation Tabs: Category Pill Switcher */}
      <div className="bg-white p-1.5 rounded-xl shadow-xs border border-gray-100 flex flex-wrap items-center gap-1.5">
        <button
          onClick={() => {
            setActiveCategory("all");
            setSelectedSubJenis("all");
          }}
          className={`py-2.5 px-4 text-xs font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
            activeCategory === "all"
              ? "bg-[#008BE3] text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          <FileSpreadsheet size={15} />
          <span>Semua Dokumen ({stats.total})</span>
        </button>

        <button
          onClick={() => {
            setActiveCategory("surat_masuk");
            setSelectedSubJenis("all");
          }}
          className={`py-2.5 px-4 text-xs font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
            activeCategory === "surat_masuk"
              ? "bg-[#008BE3] text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          <Inbox size={15} />
          <span>Surat Masuk ({stats.suratMasuk})</span>
        </button>

        <button
          onClick={() => {
            setActiveCategory("surat_keluar");
            setSelectedSubJenis("all");
          }}
          className={`py-2.5 px-4 text-xs font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
            activeCategory === "surat_keluar"
              ? "bg-[#008BE3] text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          <Send size={15} />
          <span>Surat Keluar ({stats.suratKeluar})</span>
        </button>

        <button
          onClick={() => {
            setActiveCategory("sertifikat");
            setSelectedSubJenis("all");
          }}
          className={`py-2.5 px-4 text-xs font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
            activeCategory === "sertifikat"
              ? "bg-[#008BE3] text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          <Award size={15} />
          <span>Sertifikat ({stats.sertifikat})</span>
        </button>
      </div>

      {/* Filter and Table Section */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-xs overflow-hidden">
        {/* Filter Inputs Bar */}
        <div className="p-4 border-b border-gray-100 bg-white grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-6 relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Cari tanggal, nomor surat / sertifikat, perihal, atau ditujukan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-slate-800 outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40 transition-all"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={selectedSubJenis}
              onChange={(e) => setSelectedSubJenis(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-slate-800 outline-none focus:border-[#008BE3]"
            >
              <option value="all">Semua Jenis Surat</option>
              {(activeCategory === "all" ||
                activeCategory === "surat_masuk") && (
                <>
                  <option value="berita_acara_pleno">
                    Surat Berita Acara Pleno (Masuk)
                  </option>
                  <option value="keputusan_pleno">
                    Surat Hasil Keputusan Pleno (Masuk)
                  </option>
                </>
              )}
              {(activeCategory === "all" ||
                activeCategory === "surat_keluar") && (
                <>
                  <option value="blanko_bnsp">
                    Surat Blanko BNSP (Keluar)
                  </option>
                  <option value="penugasan_asesor">
                    Surat Penugasan Asesor (Keluar)
                  </option>
                  <option value="peminjaman_asesor">
                    Surat Peminjaman Asesor (Keluar)
                  </option>
                </>
              )}
              {(activeCategory === "all" ||
                activeCategory === "sertifikat") && (
                <option value="sertifikat_kompetensi">
                  Sertifikat Kompetensi BNSP
                </option>
              )}
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-slate-800 outline-none focus:border-[#008BE3]"
            >
              <option value="all">Semua Status</option>
              <option value="Terbit">Terbit</option>
              <option value="Disetujui">Disetujui</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
        </div>

        {/* Tabel Data (Tanggal, Nomor Surat, Perihal, Ditujukan Kepada, Link GDrive Suratnya) */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">Nomor Surat / Sertifikat</th>
                <th className="py-3 px-4">Perihal</th>
                <th className="py-3 px-4">Ditujukan Kepada</th>
                <th className="py-3 px-4 text-center">Link Gdrive Surat</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs font-medium text-slate-800">
              {filteredDocuments.length > 0 ? (
                filteredDocuments.map((doc) => (
                  <tr
                    key={doc.id}
                    className="hover:bg-slate-50/70 transition-colors whitespace-nowrap"
                  >
                    {/* 1. Tanggal (Tanggal Dibuat / Terbit) */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                        <Calendar size={13} className="text-[#008BE3]" />
                        <span>{doc.tanggalDibuat || doc.tanggalTerbit}</span>
                      </div>
                    </td>

                    {/* 2. Nomor Surat / Nomor Sertifikat */}
                    <td className="py-3.5 px-4 font-bold text-slate-900 font-mono text-[11px] whitespace-nowrap">
                      {doc.nomorSurat}
                    </td>

                    {/* 3. Perihal (Diambil dari jenis suratnya saja) */}
                    <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                      {doc.namaJenisSurat}
                    </td>

                    {/* 4. Ditujukan Kepada */}
                    <td className="py-3.5 px-4 font-bold text-slate-800 whitespace-nowrap">
                      {doc.penerima}
                    </td>

                    {/* 5. Link GDrive Surat */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      {doc.urlGdrive ? (
                        <div className="inline-flex items-center gap-1.5">
                          <a
                            href={doc.urlGdrive}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 hover:text-sky-800 font-bold text-[11px] border border-sky-200/80 transition-colors"
                          >
                            <ExternalLink size={13} />
                            <span>Buka GDrive</span>
                          </a>
                          <button
                            onClick={() =>
                              handleCopyLink(doc.urlGdrive, doc.nomorSurat)
                            }
                            title="Salin Tautan GDrive"
                            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                          >
                            <Copy size={13} />
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-[11px] italic">
                          Tautan belum tersedia
                        </span>
                      )}
                    </td>

                    {/* Aksi Tambahan (Unduh PDF) */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => handleSimulateDownload(doc)}
                          title="Unduh PDF"
                          className="p-1.5 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        >
                          <Download size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="py-12 px-6 text-center text-gray-400 font-medium"
                  >
                    Tidak ditemukan surat atau sertifikat yang cocok dengan
                    pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DOCUMENT PREVIEW MODAL */}
      {selectedDocForPreview && (
        <DocumentPreviewModal
          doc={selectedDocForPreview}
          onClose={() => setSelectedDocForPreview(null)}
          onDownload={() => handleSimulateDownload(selectedDocForPreview)}
          onCopyLink={() =>
            handleCopyLink(
              selectedDocForPreview.urlGdrive,
              selectedDocForPreview.nomorSurat,
            )
          }
        />
      )}

      {/* CREATE NEW DOCUMENT MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-150 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-xl border border-gray-200 shadow-2xl w-full max-w-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck2 className="text-[#008BE3]" size={20} />
                <h3 className="font-bold text-base">
                  Buat / Register Surat Baru
                </h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={handleCreateDocument}
              className="p-6 space-y-4 text-slate-800 text-xs font-medium"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Kategori */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                    Kategori Dokumen <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.kategori}
                    onChange={(e) => {
                      const cat = e.target.value as KategoriSurat;
                      let defaultSub: SubJenisSurat = "berita_acara_pleno";
                      if (cat === "surat_keluar")
                        defaultSub = "penugasan_asesor";
                      if (cat === "sertifikat")
                        defaultSub = "sertifikat_kompetensi";
                      setFormData({
                        ...formData,
                        kategori: cat,
                        jenisSurat: defaultSub,
                      });
                    }}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-slate-800 outline-none focus:border-[#008BE3]"
                  >
                    <option value="surat_masuk">Surat Masuk</option>
                    <option value="surat_keluar">Surat Keluar</option>
                    <option value="sertifikat">Sertifikat</option>
                  </select>
                </div>

                {/* Sub Jenis */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                    Jenis Surat <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.jenisSurat}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        jenisSurat: e.target.value as SubJenisSurat,
                      })
                    }
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-slate-800 outline-none focus:border-[#008BE3]"
                  >
                    {formData.kategori === "surat_masuk" && (
                      <>
                        <option value="berita_acara_pleno">
                          Surat Berita Acara Pleno
                        </option>
                        <option value="keputusan_pleno">
                          Surat Hasil Keputusan Pleno
                        </option>
                      </>
                    )}
                    {formData.kategori === "surat_keluar" && (
                      <>
                        <option value="penugasan_asesor">
                          Surat Penugasan Asesor
                        </option>
                        <option value="peminjaman_asesor">
                          Surat Peminjaman Asesor
                        </option>
                        <option value="blanko_bnsp">Surat Blanko BNSP</option>
                      </>
                    )}
                    {formData.kategori === "sertifikat" && (
                      <option value="sertifikat_kompetensi">
                        Sertifikat Kompetensi BNSP
                      </option>
                    )}
                  </select>
                </div>
              </div>

              {/* Nomor Surat & Tanggal */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                    Nomor Surat / Sertifikat{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: BA/015/PLENO-LSP/VIII/2026 atau 50025/LSP-SGD/VIII/2026"
                    value={formData.nomorSurat}
                    onChange={(e) =>
                      setFormData({ ...formData, nomorSurat: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-slate-800 outline-none focus:border-[#008BE3]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                    Tanggal (Tanggal Dibuat){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.tanggalDibuat}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tanggalDibuat: e.target.value,
                        tanggalTerbit: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-slate-800 outline-none focus:border-[#008BE3]"
                  />
                </div>
              </div>

              {/* Ditujukan Kepada */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                    Ditujukan Kepada (Penerima){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Direktur LSP / Ahmad Rizki (NIM: 1197050001)"
                    value={formData.penerima}
                    onChange={(e) =>
                      setFormData({ ...formData, penerima: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-slate-800 outline-none focus:border-[#008BE3]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                    Penerbit / Instansi Asal
                  </label>
                  <input
                    type="text"
                    placeholder="LSP UIN Sunan Gunung Djati Bandung"
                    value={formData.penerbit}
                    onChange={(e) =>
                      setFormData({ ...formData, penerbit: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-slate-800 outline-none focus:border-[#008BE3]"
                  />
                </div>
              </div>

              {/* Tautan File Drive */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                  Link Google Drive Surat
                </label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/file/d/..."
                  value={formData.urlGdrive}
                  onChange={(e) =>
                    setFormData({ ...formData, urlGdrive: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-slate-800 outline-none focus:border-[#008BE3]"
                />
              </div>

              {/* Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-bold text-xs transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#008BE3] hover:bg-[#0076C2] text-white rounded-lg font-bold text-xs shadow-sm transition-all"
                >
                  Simpan Dokumen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// DOCUMENT PREVIEW MODAL COMPONENT
// ============================================================================
interface DocumentPreviewModalProps {
  doc: SuratItem;
  onClose: () => void;
  onDownload: () => void;
  onCopyLink: () => void;
}

function DocumentPreviewModal({
  doc,
  onClose,
  onDownload,
}: DocumentPreviewModalProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-160 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-2 md:p-6 overflow-y-auto">
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-4xl overflow-hidden my-auto flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95">
        {/* Modal Bar */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <FileText className="text-[#008BE3]" size={20} />
            <div>
              <h3 className="font-bold text-base leading-tight">
                Pratinjau Dokumen Resmi
              </h3>
              <p className="text-xs text-slate-400 font-normal">
                {doc.nomorSurat}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {doc.urlGdrive && (
              <a
                href={doc.urlGdrive}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-sky-400 hover:text-sky-300 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold"
                title="Buka Link GDrive"
              >
                <ExternalLink size={15} />
                <span className="hidden sm:inline">GDrive</span>
              </a>
            )}
            <button
              onClick={handlePrint}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold"
              title="Cetak Dokumen"
            >
              <Printer size={15} />
              <span className="hidden sm:inline">Cetak</span>
            </button>
            <button
              onClick={onDownload}
              className="p-2 text-emerald-400 hover:text-emerald-300 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold"
              title="Unduh PDF"
            >
              <Download size={15} />
              <span className="hidden sm:inline">Unduh PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-2"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable View Container */}
        <div className="p-4 md:p-8 overflow-y-auto bg-slate-100/70 flex justify-center">
          <div className="bg-white p-6 md:p-10 rounded-xl shadow-lg border border-slate-200 text-slate-900 w-full max-w-3xl font-serif leading-relaxed">
            {/* Format Renderer depends on doc.jenisSurat */}
            {doc.jenisSurat === "sertifikat_kompetensi" ? (
              /* SERTIFIKAT KOMPETENSI FORMAT */
              <div className="border-8 border-double border-amber-600/60 p-6 md:p-8 text-center bg-linear-to-b from-amber-50/20 to-white relative">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-2xl shadow-md">
                    BNSP
                  </div>
                </div>
                <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-amber-800 mb-1">
                  BADAN NASIONAL SERTIFIKASI PROFESI (BNSP)
                </h4>
                <h2 className="text-2xl md:text-3xl font-black font-sans text-slate-900 tracking-tight uppercase mb-2">
                  SERTIFIKAT KOMPETENSI
                </h2>
                <p className="text-xs font-mono text-slate-500 mb-6">
                  No. Sertifikat:{" "}
                  <span className="font-bold text-slate-800">
                    {doc.nomorSurat}
                  </span>
                </p>

                <p className="text-sm font-sans text-slate-700 italic mb-4">
                  Dengan ini menyatakan bahwa:
                </p>

                <div className="text-2xl md:text-3xl font-bold font-sans text-amber-900 border-b-2 border-amber-500/40 inline-block px-8 py-1 mb-4">
                  {doc.penerima.replace(/ \(.*?\)/, "")}
                </div>

                <p className="text-sm font-sans text-slate-700 mb-2">
                  Telah Kompeten pada Skema Sertifikasi Profesi:
                </p>

                <div className="text-lg md:text-xl font-bold font-sans text-slate-900 bg-amber-100/60 py-2.5 px-4 rounded-xl mb-6 inline-block max-w-xl">
                  {doc.skemaSertifikasi}
                </div>

                <p className="text-xs font-sans text-slate-600 max-w-md mx-auto mb-8">
                  Sertifikat ini diterbitkan oleh Lembaga Sertifikasi Profesi
                  UIN Sunan Gunung Djati Bandung berdasarkan Sidang Pleno
                  Penetapan dan berlaku selama 3 (tiga) tahun.
                </p>

                {/* Signatures */}
                <div className="grid grid-cols-2 gap-8 pt-6 border-t border-amber-200 text-xs font-sans">
                  <div>
                    <p className="text-slate-500 mb-8">Ketua LSP UIN SGD</p>
                    <p className="font-bold text-slate-900 underline">
                      Dr. H. Ahmad Fauzi, M.Kom.
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500 mb-8">
                      Bandung, {doc.tanggalTerbit}
                    </p>
                    <p className="font-bold text-slate-900 underline">
                      Ketua Komite Sertifikasi
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* REGULAR SURAT FORMAT (Berita Acara, SK Keputusan, Surat Tugas, Blanko) */
              <div className="font-sans text-slate-800 text-sm space-y-6">
                {/* Kop Surat Header */}
                <div className="flex items-center gap-4 pb-4 border-b-4 border-double border-slate-900">
                  <div className="w-16 h-16 bg-[#008BE3] rounded-full flex items-center justify-center text-white font-bold text-xl shrink-0">
                    LSP
                  </div>
                  <div className="text-center flex-1 space-y-0.5">
                    <h3 className="font-extrabold text-base md:text-lg text-slate-900 uppercase tracking-wide">
                      LEMBAGA SERTIFIKASI PROFESI (LSP) UIN SUNAN GUNUNG DJATI
                    </h3>
                    <p className="text-xs font-medium text-slate-600">
                      Jl. A.H. Nasution No. 105, Cipadung, Cibiru, Kota Bandung,
                      Jawa Barat 40614
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono">
                      Website: lsp.uin.ac.id | Email: lsp@uin.ac.id
                    </p>
                  </div>
                </div>

                {/* Judul & Nomor Surat */}
                <div className="text-center space-y-1 pt-2">
                  <h2 className="text-lg font-bold text-slate-900 uppercase underline tracking-wide">
                    {doc.namaJenisSurat}
                  </h2>
                  <p className="text-xs font-mono font-semibold text-slate-600">
                    Nomor: {doc.nomorSurat}
                  </p>
                </div>

                {/* Detail Informasi Surat */}
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs space-y-2">
                  <div className="grid grid-cols-3">
                    <span className="font-bold text-slate-600">
                      Perihal / Judul:
                    </span>
                    <span className="col-span-2 font-medium text-slate-900">
                      {doc.judul}
                    </span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="font-bold text-slate-600">
                      Tanggal Dibuat:
                    </span>
                    <span className="col-span-2 font-medium text-slate-900">
                      {doc.tanggalDibuat}
                    </span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="font-bold text-slate-600">
                      Ditujukan Kepada:
                    </span>
                    <span className="col-span-2 font-medium text-slate-900">
                      {doc.penerima}
                    </span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="font-bold text-slate-600">
                      Instansi / Penerbit:
                    </span>
                    <span className="col-span-2 font-medium text-slate-900">
                      {doc.penerbit}
                    </span>
                  </div>
                  {doc.skemaSertifikasi && (
                    <div className="grid grid-cols-3">
                      <span className="font-bold text-slate-600">
                        Skema Sertifikasi:
                      </span>
                      <span className="col-span-2 font-medium text-slate-900">
                        {doc.skemaSertifikasi}
                      </span>
                    </div>
                  )}
                  {doc.urlGdrive && (
                    <div className="grid grid-cols-3">
                      <span className="font-bold text-slate-600">
                        Link File GDrive:
                      </span>
                      <a
                        href={doc.urlGdrive}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="col-span-2 font-semibold text-[#008BE3] hover:underline flex items-center gap-1"
                      >
                        <ExternalLink size={12} />
                        {doc.urlGdrive}
                      </a>
                    </div>
                  )}
                </div>

                {/* Body Content Paragraf */}
                <div className="space-y-3 text-xs text-slate-700 leading-relaxed pt-2">
                  <p>
                    Menindaklanjuti pelaksanaan asesmen uji kompetensi yang
                    diselenggarakan oleh LSP UIN Sunan Gunung Djati Bandung,
                    bersama ini disampaikan dokumen resmi{" "}
                    <span className="font-bold">{doc.judul}</span> untuk dapat
                    dipergunakan sebagaimana mestinya.
                  </p>
                  <p>
                    Seluruh penetapan keputusan dan verifikasi berkas pendukung
                    telah ditinjau dan dinyatakan sah oleh Pengurus dan Komite
                    Sertifikasi LSP UIN Sunan Gunung Djati Bandung.
                  </p>
                </div>

                {/* Tanda Tangan */}
                <div className="pt-8 flex justify-between items-end text-xs">
                  <div className="space-y-1">
                    <p className="text-slate-500">Stempel Sah LSP:</p>
                    <div className="w-20 h-20 border-2 border-dashed border-[#008BE3] rounded-full flex items-center justify-center text-[#008BE3] font-bold text-[10px] uppercase text-center p-1">
                      LSP UIN SGD BANDUNG
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-slate-600">
                      Bandung, {doc.tanggalTerbit || doc.tanggalDibuat}
                    </p>
                    <p className="font-bold text-slate-900 pb-12">
                      Ketua LSP UIN Sunan Gunung Djati
                    </p>
                    <p className="font-bold text-slate-900 underline">
                      Dr. H. Ahmad Fauzi, M.Kom.
                    </p>
                    <p className="text-[10px] text-slate-500">
                      NIP. 197804122005011003
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
