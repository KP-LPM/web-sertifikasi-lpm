"use client";
import React, { useState, useMemo } from "react";
import {
  Search,
  Plus,
  ExternalLink,
  CheckCircle2,
  Award,
  FileCheck2,
  Inbox,
  Send,
  X,
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

  return (
    <div className="space-y-6 pb-24 text-sm text-gray-700">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-200 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="text-emerald-400 shrink-0" size={20} />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Page Title Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-[#008BE3]/10 flex items-center justify-center text-[#008BE3] border border-[#008BE3]/20 shadow-xs shrink-0">
            <FileCheck2 size={20} className="stroke-[2.5]" />
          </div>
          <div className="min-w-0">
            <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none mb-1 md:whitespace-nowrap">
              Kelola Surat & Sertifikat
            </h2>
            <p className="text-xs text-gray-400 font-bold tracking-wider uppercase leading-4 md:whitespace-nowrap">
              Arsip Terpusat Surat Masuk, Surat Keluar, dan Sertifikat LSP
            </p>
          </div>
        </div>

        {!readOnly && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#008BE3] hover:bg-[#0076C2] text-white rounded-lg text-xs md:text-sm font-extrabold shadow-md hover:shadow-lg transition-all shrink-0"
          >
            <Plus size={16} className="stroke-3" />
            <span>Buat / Register Surat Baru</span>
          </button>
        )}
      </div>

      {/* Overview Stat Cards Section */}
      <div className="space-y-2">
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">
          Overview
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => {
              setActiveCategory("all");
              setSelectedSubJenis("all");
            }}
            className={`p-4 rounded-lg border flex flex-col justify-center shadow-2xs group hover:scale-[1.01] transition-all duration-200 cursor-pointer ${
              activeCategory === "all"
                ? "bg-[#E6F4FF] border-[#008BE3] ring-2 ring-offset-1 ring-[#008BE3]/30"
                : "bg-[#E6F4FF] border-[#BCE0FD]"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-black text-sky-800 uppercase tracking-wider block">
                Total Dokumen
              </span>
              <div className="w-10 h-10 rounded-lg bg-[#008BE3] text-white flex items-center justify-center shrink-0 shadow-xs">
                <FileSpreadsheet size={18} />
              </div>
            </div>
            <div className="space-y-0.5">
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-slate-900 tracking-tight">
                  {stats.total}
                </span>
              </div>
              <p className="text-[11px] font-bold text-sky-600">
                Arsip terpusat disistem
              </p>
            </div>
          </div>

          <div
            onClick={() => {
              setActiveCategory("surat_masuk");
              setSelectedSubJenis("all");
            }}
            className={`p-4 rounded-lg border flex flex-col justify-center shadow-2xs group hover:scale-[1.01] transition-all duration-200 cursor-pointer ${
              activeCategory === "surat_masuk"
                ? "bg-[#F4FBF7] border-[#84CC16] ring-2 ring-offset-1 ring-[#84CC16]/30"
                : "bg-[#F4FBF7] border-[#A7F3D0]"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-black text-emerald-800 uppercase tracking-wider block">
                Surat Masuk
              </span>
              <div className="w-10 h-10 rounded-lg bg-[#84CC16] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Inbox size={18} />
              </div>
            </div>
            <div className="space-y-0.5">
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-slate-900 tracking-tight">
                  {stats.suratMasuk}
                </span>
              </div>
              <p className="text-[11px] font-bold text-emerald-600">
                Berita Acara & SK Pleno
              </p>
            </div>
          </div>

          <div
            onClick={() => {
              setActiveCategory("surat_keluar");
              setSelectedSubJenis("all");
            }}
            className={`p-4 rounded-lg border flex flex-col justify-center shadow-2xs group hover:scale-[1.01] transition-all duration-200 cursor-pointer ${
              activeCategory === "surat_keluar"
                ? "bg-[#F1F5F9] border-slate-500 ring-2 ring-offset-1 ring-slate-500/30"
                : "bg-[#F1F5F9] border-[#CBD5E1]"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-black text-slate-800 uppercase tracking-wider block">
                Surat Keluar
              </span>
              <div className="w-10 h-10 rounded-lg bg-slate-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Send size={18} />
              </div>
            </div>
            <div className="space-y-0.5">
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-slate-900 tracking-tight">
                  {stats.suratKeluar}
                </span>
              </div>
              <p className="text-[11px] font-bold text-slate-500">
                Surat BNSP & Tugas Asesor
              </p>
            </div>
          </div>

          <div
            onClick={() => {
              setActiveCategory("sertifikat");
              setSelectedSubJenis("all");
            }}
            className={`p-4 rounded-lg border flex flex-col justify-center shadow-2xs group hover:scale-[1.01] transition-all duration-200 cursor-pointer ${
              activeCategory === "sertifikat"
                ? "bg-[#FFFBEB] border-amber-500 ring-2 ring-offset-1 ring-amber-500/30"
                : "bg-[#FFFBEB] border-[#FDE68A]"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-black text-amber-800 uppercase tracking-wider block">
                Sertifikat
              </span>
              <div className="w-10 h-10 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Award size={18} />
              </div>
            </div>
            <div className="space-y-0.5">
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-slate-900 tracking-tight">
                  {stats.sertifikat}
                </span>
              </div>
              <p className="text-[11px] font-bold text-amber-600">
                Sertifikat BNSP Terbit
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Container - Styled inline with the cards above */}
      <div className="bg-white p-1.5 rounded-xl shadow-xs border border-gray-100 flex flex-wrap items-center gap-1.5">
        <button
          onClick={() => {
            setActiveCategory("all");
            setSelectedSubJenis("all");
          }}
          className={`py-2 px-4 text-xs font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
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
          className={`py-2 px-4 text-xs font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
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
          className={`py-2 px-4 text-xs font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
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
          className={`py-2 px-4 text-xs font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
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
      <section className="bg-white rounded-lg shadow-xs border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="min-w-0">
            <h3 className="text-base font-black text-slate-900">
              Daftar Dokumen
            </h3>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 w-full lg:w-auto ml-auto">
            <div className="flex items-center gap-2 bg-gray-50/80 rounded-lg px-3 h-10.5 w-full sm:w-68 border border-gray-200/50 focus-within:border-[#008BE3]/40 transition-colors">
              <Search className="text-gray-400 shrink-0" size={16} />
              <input
                type="text"
                placeholder="Cari surat atau sertifikat..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none focus:ring-0 text-[14px] w-full outline-none text-gray-700 placeholder-gray-400 font-semibold"
              />
            </div>

            <select
              value={selectedSubJenis}
              onChange={(e) => setSelectedSubJenis(e.target.value)}
              className="bg-gray-50 border border-gray-200/50 text-[14px] rounded-lg px-3 h-10.5 outline-none text-gray-700 cursor-pointer font-bold w-full sm:w-auto"
            >
              <option value="all">Semua Jenis Surat</option>
              {(activeCategory === "all" ||
                activeCategory === "surat_masuk") && (
                <>
                  <option value="berita_acara_pleno">
                    Surat Berita Acara Pleno
                  </option>
                  <option value="keputusan_pleno">
                    Surat Hasil Keputusan Pleno
                  </option>
                </>
              )}
              {(activeCategory === "all" ||
                activeCategory === "surat_keluar") && (
                <>
                  <option value="blanko_bnsp">Surat Blanko BNSP</option>
                  <option value="penugasan_asesor">
                    Surat Penugasan Asesor
                  </option>
                  <option value="peminjaman_asesor">
                    Surat Peminjaman Asesor
                  </option>
                </>
              )}
              {(activeCategory === "all" || activeCategory === "sertifikat") && (
                <option value="sertifikat_kompetensi">
                  Sertifikat Kompetensi BNSP
                </option>
              )}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-50 border border-gray-200/50 text-[14px] rounded-lg px-3 h-10.5 outline-none text-gray-700 cursor-pointer font-bold w-full sm:w-auto"
            >
              <option value="all">Semua Status</option>
              <option value="Terbit">Terbit</option>
              <option value="Disetujui">Disetujui</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto relative">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0F172A] border-b border-[#0F172A]">
                <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-left sticky top-0 z-20 bg-[#0F172A] min-w-35">
                  Tanggal
                </th>
                <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-left sticky top-0 z-20 bg-[#0F172A] min-w-50">
                  Nomor Surat / Sertifikat
                </th>
                <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-left sticky top-0 z-20 bg-[#0F172A] min-w-50">
                  Perihal
                </th>
                <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-left sticky top-0 z-20 bg-[#0F172A] min-w-50">
                  Ditujukan Kepada
                </th>
                <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-center sticky right-0 bg-[#0F172A] z-30 border-l border-white/10 shadow-[-6px_0_15px_-4px_rgba(0,0,0,0.06)] min-w-37.5 top-0">
                  Link GDrive
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/60">
              {filteredDocuments.length > 0 ? (
                filteredDocuments.map((doc) => (
                  <tr
                    key={doc.id}
                    className="group/row hover:bg-[#F9FAFC] transition-colors"
                  >
                    <td className="px-6 py-4 text-xs md:text-sm font-semibold text-gray-600 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar size={14} className="text-[#008BE3]" />
                        {doc.tanggalDibuat || doc.tanggalTerbit}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs md:text-sm font-bold text-slate-900 font-mono tracking-tight whitespace-nowrap">
                      {doc.nomorSurat}
                    </td>
                    <td className="px-6 py-4 text-xs md:text-sm font-bold text-slate-800 whitespace-nowrap">
                      {doc.namaJenisSurat}
                    </td>
                    <td className="px-6 py-4 text-xs md:text-sm font-bold text-slate-700 whitespace-nowrap overflow-hidden text-ellipsis">
                      {doc.penerima}
                    </td>
                    <td className="px-6 py-4 text-center sticky right-0 bg-white group-hover/row:bg-[#F9FAFC] z-10 border-l border-gray-100 shadow-[-6px_0_15px_-4px_rgba(0,0,0,0.06)] transition-colors">
                      <div className="flex items-center justify-center gap-2">
                        {doc.urlGdrive ? (
                          <>
                            <a
                              href={doc.urlGdrive}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-2xs border bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-[#008BE3] hover:border-[#008BE3]/30"
                            >
                              <ExternalLink size={14} />
                              <span>Buka GDrive</span>
                            </a>
                            <button
                              onClick={() =>
                                handleCopyLink(doc.urlGdrive, doc.nomorSurat)
                              }
                              title="Salin Tautan GDrive"
                              className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                            >
                              <Copy size={14} />
                            </button>
                          </>
                        ) : (
                          <span className="text-gray-400 text-xs font-semibold px-2">
                            -
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-xs md:text-sm text-gray-400 font-medium"
                  >
                    Tidak ditemukan surat atau sertifikat yang cocok dengan
                    pencarian Anda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* CREATE NEW DOCUMENT MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-150 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden my-8 flex flex-col animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <FileCheck2 className="text-[#008BE3]" size={20} />
                <h3 className="font-black text-slate-800 text-lg">
                  Buat / Register Surat Baru
                </h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={handleCreateDocument}
              className="p-6 space-y-4 text-sm font-medium"
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
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200/50 rounded-lg text-xs md:text-sm font-semibold text-slate-800 outline-none focus:border-[#008BE3]/40"
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
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200/50 rounded-lg text-xs md:text-sm font-semibold text-slate-800 outline-none focus:border-[#008BE3]/40"
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
                    placeholder="Contoh: BA/015/PLENO-LSP/VIII/2026"
                    value={formData.nomorSurat}
                    onChange={(e) =>
                      setFormData({ ...formData, nomorSurat: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200/50 rounded-lg text-xs md:text-sm font-semibold text-slate-800 outline-none focus:border-[#008BE3]/40"
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
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200/50 rounded-lg text-xs md:text-sm font-semibold text-slate-800 outline-none focus:border-[#008BE3]/40"
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
                    placeholder="Contoh: Direktur LSP / Ahmad Rizki"
                    value={formData.penerima}
                    onChange={(e) =>
                      setFormData({ ...formData, penerima: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200/50 rounded-lg text-xs md:text-sm font-semibold text-slate-800 outline-none focus:border-[#008BE3]/40"
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
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200/50 rounded-lg text-xs md:text-sm font-semibold text-slate-800 outline-none focus:border-[#008BE3]/40"
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
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200/50 rounded-lg text-xs md:text-sm font-semibold text-slate-800 outline-none focus:border-[#008BE3]/40"
                />
              </div>

              {/* Buttons */}
              <div className="pt-5 flex items-center justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg font-bold text-xs md:text-sm transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#008BE3] hover:bg-[#0076C2] text-white rounded-lg font-bold text-xs md:text-sm shadow-md hover:shadow-lg transition-all"
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