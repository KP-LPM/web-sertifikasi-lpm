"use client";
import React, { useState } from "react";
import {
  Search,
  Plus,
  Trash2,
  CheckCircle,
  Clock,
  Eye,
  AlertCircle,
  FileText,
  Upload,
  RefreshCw,
  X,
  FolderCheck,
  Calendar,
  Filter,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PortfolioItem } from "@/types/types";

const AVAILABLE_SCHEMES = [
  "Pemrograman Web",
  "Teknisi Muda Jaringan Komputer",
  "Desain Grafis",
  "Pengelolaan Pinjaman / Pembiayaan",
  "Network Administrator",
  "Kewirausahaan Industri",
];

export default function VerifikasiPortofolio() {
  const [portfolios, setPortfolios] = useState<PortfolioItem[]>([
    {
      id: "PF-001",
      skema: "Pemrograman Web",
      namaDokumen: "Sertifikat Industri Web Developer",
      statusAsesor: "Asesor dari UIN Bandung",
      alamatLsp: "UIN Sunan Gunung Djati Bandung",
      deskripsi:
        "Sertifikat pelatihan intensif Fullstack Web Development dan uji kompetensi aplikasi web.",
      tanggal: "25 Jul 2026",
      fileName: "Sertifikat_Web_Dev.pdf",
      fileSize: "1.8 MB",
      fileType: "application/pdf",
      status: "Terverifikasi",
      catatanAdmin:
        "Dokumen lengkap dan memenuhi persyaratan kualifikasi skema.",
    },
    {
      id: "PF-002",
      skema: "Teknisi Muda Jaringan Komputer",
      namaDokumen: "Portofolio Implementasi Network Topology",
      statusAsesor: "Asesor dari Luar",
      alamatLsp: "LSP Komputer Indonesia, Jl. Gatot Subroto No. 45 Jakarta",
      deskripsi:
        "Laporan dokumentasi hasil proyek perancangan dan instalasi jaringan LAN UIN SGD.",
      tanggal: "26 Jul 2026",
      fileName: "File_Peminjaman_Asesor_Networking.pdf",
      filePeminjamanName: "File_Peminjaman_Asesor_Networking.pdf",
      fileJawabanName: "Konfirmasi_Peminjaman_LSP_Komputer.pdf",
      fileSize: "3.4 MB",
      fileType: "application/pdf",
      status: "Menunggu Verifikasi",
    },
    {
      id: "PF-003",
      skema: "Desain Grafis",
      namaDokumen: "Sertifikat Kompetensi Adobe Illustrator",
      statusAsesor: "Asesor dari UIN Bandung",
      alamatLsp: "UIN Sunan Gunung Djati Bandung",
      deskripsi: "Sertifikat lisensi internasional kemampuan desain vektor.",
      tanggal: "20 Jul 2026",
      fileName: "Sertifikat_Adobe_Illustrator.pdf",
      fileSize: "2.1 MB",
      fileType: "application/pdf",
      status: "Ditolak",
      catatanAdmin:
        "Sertifikat sudah melebihi masa berlaku. Mohon upload sertifikat terbaru yang masih aktif.",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("Semua");

  // Modals
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isReuploadModalOpen, setIsReuploadModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<{
    name: string;
    type?: string;
  } | null>(null);

  const [selectedPortfolio, setSelectedPortfolio] =
    useState<PortfolioItem | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    skema: AVAILABLE_SCHEMES[0],
    namaDokumen: "",
    statusAsesor: "Asesor dari UIN Bandung" as
      | "Asesor dari UIN Bandung"
      | "Asesor dari Luar",
    alamatLsp: "UIN Sunan Gunung Djati Bandung",
    deskripsi: "",
    selectedFile: null as File | null,
    filePeminjaman: null as File | null,
    fileJawaban: null as File | null,
    fileNamePlaceholder: "",
    filePeminjamanPlaceholder: "",
    fileJawabanPlaceholder: "",
  });

  const filteredPortfolios = portfolios.filter((p) => {
    const matchesSearch =
      p.namaDokumen.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.skema.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "Semua" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalCount = portfolios.length;
  const pendingCount = portfolios.filter(
    (p) => p.status === "Menunggu Verifikasi",
  ).length;
  const verifiedCount = portfolios.filter(
    (p) => p.status === "Terverifikasi",
  ).length;
  const rejectedCount = portfolios.filter((p) => p.status === "Ditolak").length;

  const handleSingleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({
        ...prev,
        selectedFile: file,
        fileNamePlaceholder: file.name,
      }));
    }
  };
  const handlePeminjamanFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({
        ...prev,
        filePeminjaman: file,
        filePeminjamanPlaceholder: file.name,
      }));
    }
  };

  const handleJawabanFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({
        ...prev,
        fileJawaban: file,
        fileJawabanPlaceholder: file.name,
      }));
    }
  };
  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.namaDokumen.trim()) {
      alert("Mohon isi nama dokumen portofolio.");
      return;
    }
    const isLuar = formData.statusAsesor === "Asesor dari Luar";

    if (isLuar) {
      if (!formData.alamatLsp.trim()) {
        alert("Mohon isi alamat LSP dari asesor luar.");
        return;
      }
      if (!formData.filePeminjaman && !formData.filePeminjamanPlaceholder) {
        alert("Mohon unggah File Peminjaman Asesor.");
        return;
      }
      if (!formData.fileJawaban && !formData.fileJawabanPlaceholder) {
        alert(
          "Mohon unggah File Jawaban / Konfirmasi Peminjaman dari LSP luar.",
        );
        return;
      }
    } else {
      if (!formData.selectedFile && !formData.fileNamePlaceholder) {
        alert("Mohon unggah file dokumen portofolio.");
        return;
      }
    }

    const generatedId =
      typeof window !== "undefined" && window.crypto?.randomUUID
        ? `PF-${window.crypto.randomUUID().slice(0, 5).toUpperCase()}`
        : `PF-${(portfolios.length + 1).toString().padStart(3, "0")}`;

    const todayStr = new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    const finalAlamatLsp = isLuar
      ? formData.alamatLsp
      : "UIN Sunan Gunung Djati Bandung";

    const newPortfolio: PortfolioItem = {
      id: generatedId,
      skema: formData.skema,
      namaDokumen: formData.namaDokumen,
      statusAsesor: formData.statusAsesor,
      alamatLsp: finalAlamatLsp,
      deskripsi: formData.deskripsi,
      tanggal: todayStr,
      fileName: isLuar
        ? formData.filePeminjaman?.name ||
          formData.filePeminjamanPlaceholder ||
          "File_Peminjaman_Asesor.pdf"
        : formData.selectedFile?.name ||
          formData.fileNamePlaceholder ||
          "Dokumen_Portofolio.pdf",
      filePeminjamanName: isLuar
        ? formData.filePeminjaman?.name ||
          formData.filePeminjamanPlaceholder ||
          "File_Peminjaman_Asesor.pdf"
        : undefined,
      fileJawabanName: isLuar
        ? formData.fileJawaban?.name ||
          formData.fileJawabanPlaceholder ||
          "Konfirmasi_Peminjaman_LSP.pdf"
        : undefined,
      fileSize: "2.0 MB",
      fileType: "application/pdf",
      status: "Menunggu Verifikasi",
    };

    setPortfolios([newPortfolio, ...portfolios]);
    setIsUploadModalOpen(false);
    resetForm();
  };
  const handleReuploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPortfolio) return;

    const isLuar = formData.statusAsesor === "Asesor dari Luar";
    if (isLuar && !formData.alamatLsp.trim()) {
      alert("Mohon isi alamat LSP dari asesor luar.");
      return;
    }

    const todayStr = new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    const finalAlamatLsp = isLuar
      ? formData.alamatLsp
      : "UIN Sunan Gunung Djati Bandung";

    setPortfolios((prev) =>
      prev.map((p) => {
        if (p.id === selectedPortfolio.id) {
          return {
            ...p,
            skema: formData.skema,
            statusAsesor: formData.statusAsesor,
            alamatLsp: finalAlamatLsp,
            namaDokumen: formData.namaDokumen,
            deskripsi: formData.deskripsi,
            tanggal: todayStr,
            fileName: isLuar
              ? formData.filePeminjaman?.name ||
                formData.filePeminjamanPlaceholder ||
                p.filePeminjamanName ||
                p.fileName
              : formData.selectedFile?.name ||
                formData.fileNamePlaceholder ||
                p.fileName,
            filePeminjamanName: isLuar
              ? formData.filePeminjaman?.name ||
                formData.filePeminjamanPlaceholder ||
                p.filePeminjamanName ||
                "File_Peminjaman_Asesor.pdf"
              : undefined,
            fileJawabanName: isLuar
              ? formData.fileJawaban?.name ||
                formData.fileJawabanPlaceholder ||
                p.fileJawabanName ||
                "Konfirmasi_Peminjaman_LSP.pdf"
              : undefined,
            status: "Menunggu Verifikasi",
            catatanAdmin: undefined,
          };
        }
        return p;
      }),
    );

    setIsReuploadModalOpen(false);
    setSelectedPortfolio(null);
    resetForm();
  };

  const handleDeleteConfirm = () => {
    if (selectedPortfolio) {
      setPortfolios((prev) =>
        prev.filter((p) => p.id !== selectedPortfolio.id),
      );
    }
    setIsDeleteModalOpen(false);
    setSelectedPortfolio(null);
  };

  const resetForm = () => {
    setFormData({
      skema: AVAILABLE_SCHEMES[0],
      statusAsesor: "Asesor dari UIN Bandung",
      alamatLsp: "UIN Sunan Gunung Djati Bandung",
      namaDokumen: "",
      deskripsi: "",
      selectedFile: null,
      filePeminjaman: null,
      fileJawaban: null,
      fileNamePlaceholder: "",
      filePeminjamanPlaceholder: "",
      fileJawabanPlaceholder: "",
    });
  };

  const openReuploadModal = (item: PortfolioItem) => {
    setSelectedPortfolio(item);
    const isLuar = item.statusAsesor === "Asesor dari Luar";
    setFormData({
      skema: item.skema,
      statusAsesor: item.statusAsesor || "Asesor dari UIN Bandung",
      alamatLsp:
        item.alamatLsp || (isLuar ? "" : "UIN Sunan Gunung Djati Bandung"),
      namaDokumen: item.namaDokumen,
      deskripsi: item.deskripsi || "",
      selectedFile: null,
      filePeminjaman: null,
      fileJawaban: null,
      fileNamePlaceholder: item.fileName || "",
      filePeminjamanPlaceholder: item.filePeminjamanName || item.fileName || "",
      fileJawabanPlaceholder: item.fileJawabanName || "",
    });
    setIsReuploadModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] p-4 md:p-8 space-y-6 pb-24 text-sm text-gray-700">
      {/* Page Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-sky-50 text-[#008BE3] rounded-xl border border-sky-100 shrink-0 mt-0.5">
            <FolderCheck size={22} />
          </div>
          <div className="min-w-0">
            <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">
              Verifikasi Portofolio
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Upload dan kelola dokumen portofolio Anda untuk diverifikasi oleh
              admin.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            resetForm();
            setIsUploadModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 bg-[#008BE3] hover:bg-[#0076C2] text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-2xs transition-colors cursor-pointer shrink-0"
        >
          <Plus size={18} className="stroke-[2.5]" />
          <span>Upload Portofolio</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-sky-50 text-[#008BE3] flex items-center justify-center font-bold">
            <FileText size={20} />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
              Total Dokumen
            </p>
            <p className="text-xl font-black text-slate-900">{totalCount}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Clock size={20} />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
              Menunggu
            </p>
            <p className="text-xl font-black text-amber-600">{pendingCount}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle size={20} />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
              Terverifikasi
            </p>
            <p className="text-xl font-black text-emerald-600">
              {verifiedCount}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-bold">
            <AlertCircle size={20} />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
              Ditolak
            </p>
            <p className="text-xl font-black text-red-600">{rejectedCount}</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 md:p-5 rounded-xl shadow-xs border border-slate-200">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:max-w-md">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Cari nama dokumen atau skema..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-white focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3] outline-none text-xs sm:text-sm transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full appearance-none pl-9 pr-8 py-2.5 bg-gray-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#008BE3]/20 focus:border-[#008BE3] transition-all cursor-pointer"
              >
                <option value="Semua">Semua Status</option>
                <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                <option value="Terverifikasi">Terverifikasi</option>
                <option value="Ditolak">Ditolak</option>
              </select>
              <Filter
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none shrink-0"
                size={15}
              />
              <ChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none shrink-0"
                size={15}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-162.5 sm:min-w-250">
            <thead>
              <tr className="bg-[#0F172A] border-b border-[#0F172A]">
                <th className="px-2.5 sm:px-6 py-2.5 sm:py-4 text-[10px] sm:text-xs font-bold text-white/90 uppercase tracking-wider whitespace-nowrap">
                  Skema
                </th>
                <th className="px-2.5 sm:px-6 py-2.5 sm:py-4 text-[10px] sm:text-xs font-bold text-white/90 uppercase tracking-wider whitespace-nowrap">
                  Nama Dokumen
                </th>
                <th className="px-2.5 sm:px-6 py-2.5 sm:py-4 text-[10px] sm:text-xs font-bold text-white/90 uppercase tracking-wider whitespace-nowrap">
                  Tanggal Verifikasi
                </th>
                <th className="px-2.5 sm:px-6 py-2.5 sm:py-4 text-[10px] sm:text-xs font-bold text-white/90 uppercase tracking-wider whitespace-nowrap">
                  File
                </th>
                <th className="px-2.5 sm:px-6 py-2.5 sm:py-4 text-[10px] sm:text-xs font-bold text-white/90 uppercase tracking-wider whitespace-nowrap">
                  Status Verifikasi
                </th>
                <th className="px-2.5 sm:px-6 py-2.5 sm:py-4 text-[10px] sm:text-xs font-bold text-white/90 uppercase tracking-wider text-center sticky right-0 bg-[#0F172A] z-10 border-l border-white/10 whitespace-nowrap">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPortfolios.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-slate-400"
                  >
                    <FileText size={40} className="mx-auto mb-3 opacity-30" />
                    <p className="font-bold text-slate-600">
                      Tidak ada portofolio ditemukan
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Coba sesuaikan kata kunci pencarian atau filter status
                      Anda.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredPortfolios.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    {/* Skema */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-bold text-sm text-slate-900 block whitespace-nowrap">
                        {item.skema}
                      </span>
                    </td>

                    {/* Nama Dokumen & Status Asesor */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-900 whitespace-nowrap">
                          {item.namaDokumen}
                        </p>

                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                              item.statusAsesor === "Asesor dari Luar"
                                ? "bg-purple-50 text-purple-700 border-purple-200"
                                : "bg-sky-50 text-sky-700 border-sky-200"
                            }`}
                          >
                            {item.statusAsesor || "Asesor dari UIN Bandung"}
                          </span>

                          {item.alamatLsp && (
                            <span
                              className="text-[11px] text-slate-500 font-medium truncate max-w-45"
                              title={item.alamatLsp}
                            >
                              • {item.alamatLsp}
                            </span>
                          )}
                        </div>

                        {item.deskripsi && (
                          <p className="text-xs text-slate-500 line-clamp-1 mt-1 whitespace-nowrap">
                            {item.deskripsi}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Tanggal Verifikasi */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-slate-600 text-xs font-medium">
                        <Calendar size={14} className="text-slate-400" />
                        <span>{item.tanggal}</span>
                      </div>
                    </td>

                    {/* File */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.statusAsesor === "Asesor dari Luar" ? (
                        <div className="flex flex-col gap-1.5">
                          <button
                            onClick={() =>
                              setPreviewFile({
                                name:
                                  item.filePeminjamanName ||
                                  item.fileName ||
                                  " ",
                                type: item.fileType,
                              })
                            }
                            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#008BE3] hover:text-[#0076C2] bg-sky-50 hover:bg-sky-100 border border-sky-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                            title="File Peminjaman Asesor"
                          >
                            <Eye size={12} />
                            <span className="truncate max-w-32.5">
                              Peminjaman:{" "}
                              {item.filePeminjamanName || item.fileName}
                            </span>
                          </button>

                          <button
                            onClick={() =>
                              setPreviewFile({
                                name:
                                  item.fileJawabanName ||
                                  "Konfirmasi_Peminjaman.pdf",
                                type: item.fileType,
                              })
                            }
                            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                            title="File Jawaban LSP Luar"
                          >
                            <Eye size={12} />
                            <span className="truncate max-w-32.5">
                              Jawaban LSP:{" "}
                              {item.fileJawabanName ||
                                "Konfirmasi_Peminjaman.pdf"}
                            </span>
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() =>
                            setPreviewFile({
                              name: item.fileName || "",
                              type: item.fileType,
                            })
                          }
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#008BE3] hover:text-[#0076C2] bg-sky-50 hover:bg-sky-100 border border-sky-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                        >
                          <Eye size={14} />
                          <span className="truncate max-w-35">
                            {item.fileName}
                          </span>
                        </button>
                      )}
                    </td>

                    {/* Status Verifikasi */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.status === "Terverifikasi" && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1.5">
                          <CheckCircle size={14} className="stroke-[2.5]" />{" "}
                          Terverifikasi
                        </span>
                      )}
                      {item.status === "Menunggu Verifikasi" && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 inline-flex items-center gap-1.5">
                          <Clock size={14} className="stroke-[2.5]" /> Menunggu
                          Verifikasi
                        </span>
                      )}
                      {item.status === "Ditolak" && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200 inline-flex items-center gap-1.5">
                          <AlertCircle size={14} className="stroke-[2.5]" />{" "}
                          Ditolak
                        </span>
                      )}
                    </td>

                    {/* Aksi */}
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-center sticky right-0 bg-white z-10 border-l border-slate-100 shadow-[-6px_0_15px_-4px_rgba(0,0,0,0.04)]">
                      <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                        {/* Lihat Detail */}
                        <button
                          onClick={() => {
                            setSelectedPortfolio(item);
                            setIsDetailModalOpen(true);
                          }}
                          className="p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-bold text-slate-700 hover:text-[#008BE3] hover:bg-sky-50 rounded-lg border border-slate-200 hover:border-sky-200 transition-colors cursor-pointer flex items-center gap-1"
                          title="Lihat Detail"
                        >
                          <Eye size={14} />
                          <span className="hidden sm:inline">Detail</span>
                        </button>

                        {/* Hapus (Hanya bisa kalau Menunggu Verifikasi) */}
                        {item.status === "Menunggu Verifikasi" && (
                          <button
                            onClick={() => {
                              setSelectedPortfolio(item);
                              setIsDeleteModalOpen(true);
                            }}
                            className="p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition-colors cursor-pointer flex items-center gap-1"
                            title="Hapus Portofolio"
                          >
                            <Trash2 size={14} />
                            <span className="hidden sm:inline">Hapus</span>
                          </button>
                        )}

                        {/* Upload Ulang (Hanya jika Ditolak) */}
                        {item.status === "Ditolak" && (
                          <button
                            onClick={() => openReuploadModal(item)}
                            className="p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                            title="Upload Ulang Portofolio"
                          >
                            <RefreshCw size={14} />
                            <span className="hidden sm:inline">
                              Upload Ulang
                            </span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: + Upload Portofolio */}
      <AnimatePresence>
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden my-auto max-h-[90vh] flex flex-col"
            >
              <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-[#008BE3] flex items-center justify-center text-white shrink-0">
                    <Upload size={18} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-extrabold text-sm sm:text-base text-white leading-tight">
                      Upload Portofolio Baru
                    </h3>
                    <p className="text-xs text-slate-300 font-medium">
                      Lengkapi informasi portofolio untuk diajukan.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form
                onSubmit={handleUploadSubmit}
                className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1"
              >
                {/* Status Asesor */}
                <div className="min-w-0">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Status Asesor <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.statusAsesor}
                    onChange={(e) => {
                      const val = e.target.value as
                        | "Asesor dari UIN Bandung"
                        | "Asesor dari Luar";
                      setFormData((prev) => ({
                        ...prev,
                        statusAsesor: val,
                        alamatLsp:
                          val === "Asesor dari UIN Bandung"
                            ? "UIN Sunan Gunung Djati Bandung"
                            : prev.statusAsesor === "Asesor dari Luar"
                              ? prev.alamatLsp
                              : "",
                      }));
                    }}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-medium text-slate-800 bg-white focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3] outline-none cursor-pointer"
                  >
                    <option value="Asesor dari UIN Bandung">
                      Asesor dari UIN Bandung
                    </option>
                    <option value="Asesor dari Luar">Asesor dari Luar</option>
                  </select>
                </div>

                {/* Alamat LSP Asesor */}
                <div className="min-w-0">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Alamat LSP Asesor{" "}
                    {formData.statusAsesor === "Asesor dari Luar" && (
                      <span className="text-red-500">*</span>
                    )}
                  </label>
                  {formData.statusAsesor === "Asesor dari Luar" ? (
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Jl. Raya Padjadjaran No. 12, Bogor (LSP Informatika)"
                      value={formData.alamatLsp}
                      onChange={(e) =>
                        setFormData({ ...formData, alamatLsp: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-medium text-slate-800 focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3] outline-none placeholder:text-slate-400"
                    />
                  ) : (
                    <input
                      type="text"
                      readOnly
                      value="UIN Sunan Gunung Djati Bandung"
                      className="w-full px-3.5 py-2.5 border border-slate-200 bg-slate-100 rounded-xl text-sm font-medium text-slate-600 outline-none cursor-not-allowed"
                    />
                  )}
                  <p className="text-[11px] text-slate-400 font-medium mt-1">
                    {formData.statusAsesor === "Asesor dari UIN Bandung"
                      ? "Otomatis diisi UIN Bandung untuk asesor internal."
                      : "Masukkan alamat lengkap LSP dari asal asesor luar."}
                  </p>
                </div>

                {/* Skema */}
                <div className="min-w-0">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Skema Sertifikasi <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.skema}
                    onChange={(e) =>
                      setFormData({ ...formData, skema: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-medium text-slate-800 bg-white focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3] outline-none cursor-pointer"
                  >
                    {AVAILABLE_SCHEMES.map((scheme, idx) => (
                      <option key={idx} value={scheme}>
                        {scheme}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Nama Dokumen */}
                <div className="min-w-0">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Nama Dokumen / Label <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Sertifikat Pelatihan React & Node.js"
                    value={formData.namaDokumen}
                    onChange={(e) =>
                      setFormData({ ...formData, namaDokumen: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-medium text-slate-800 focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3] outline-none placeholder:text-slate-400"
                  />
                  <p className="text-[11px] text-slate-400 font-medium mt-1">
                    Berikan label judul yang jelas agar mudah diidentifikasi
                    oleh Admin.
                  </p>
                </div>

                {/* Deskripsi/Keterangan */}
                <div className="min-w-0">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Deskripsi / Keterangan{" "}
                    <span className="text-slate-400 font-normal">
                      (opsional)
                    </span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Tambahkan keterangan rincian atau catatan pendukung untuk dokumen ini..."
                    value={formData.deskripsi}
                    onChange={(e) =>
                      setFormData({ ...formData, deskripsi: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-medium text-slate-800 focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3] outline-none placeholder:text-slate-400"
                  />
                </div>

                {/* Upload File Section */}
                {formData.statusAsesor === "Asesor dari Luar" ? (
                  <div className="space-y-3 pt-1 border-t border-slate-200">
                    <p className="text-xs font-extrabold text-purple-900 uppercase tracking-wider">
                      Dokumen Asesor Luar (Wajib 2 File)
                    </p>

                    {/* File 1: File Peminjaman Asesor */}
                    <div className="min-w-0">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        1. File Peminjaman Asesor{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="border-2 border-dashed border-sky-300 rounded-xl p-3 text-center bg-sky-50/40 hover:bg-sky-50 transition-colors relative">
                        <input
                          type="file"
                          accept=".pdf,.png,.jpg,.jpeg"
                          onChange={handlePeminjamanFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <Upload
                          size={24}
                          className="mx-auto text-[#008BE3] mb-1"
                        />
                        {formData.filePeminjaman ? (
                          <p className="text-xs font-bold text-emerald-700 flex items-center justify-center gap-1 break-all">
                            <CheckCircle size={14} className="shrink-0" />{" "}
                            {formData.filePeminjaman.name}
                          </p>
                        ) : formData.filePeminjamanPlaceholder ? (
                          <p className="text-xs font-bold text-slate-700">
                            {formData.filePeminjamanPlaceholder}
                          </p>
                        ) : (
                          <p className="text-xs font-semibold text-slate-600">
                            Klik / tarik File Surat Peminjaman Asesor
                          </p>
                        )}
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Format PDF, PNG, JPG (Maks. 10MB)
                        </p>
                      </div>
                    </div>

                    {/* File 2: File Jawaban LSP Luar */}
                    <div className="min-w-0">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        2. File Jawaban / Konfirmasi Peminjaman dari LSP Luar{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="border-2 border-dashed border-purple-300 rounded-xl p-3 text-center bg-purple-50/40 hover:bg-purple-50 transition-colors relative">
                        <input
                          type="file"
                          accept=".pdf,.png,.jpg,.jpeg"
                          onChange={handleJawabanFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <Upload
                          size={24}
                          className="mx-auto text-purple-600 mb-1"
                        />
                        {formData.fileJawaban ? (
                          <p className="text-xs font-bold text-emerald-700 flex items-center justify-center gap-1 break-all">
                            <CheckCircle size={14} className="shrink-0" />{" "}
                            {formData.fileJawaban.name}
                          </p>
                        ) : formData.fileJawabanPlaceholder ? (
                          <p className="text-xs font-bold text-slate-700">
                            {formData.fileJawabanPlaceholder}
                          </p>
                        ) : (
                          <p className="text-xs font-semibold text-slate-600">
                            Klik / tarik File Surat Konfirmasi / Balasan LSP
                          </p>
                        )}
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Format PDF, PNG, JPG (Maks. 10MB)
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="min-w-0">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Upload File Portofolio (PDF / Gambar){" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center bg-slate-50/50 hover:bg-slate-50 transition-colors relative">
                      <input
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={handleSingleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <Upload
                        size={28}
                        className="mx-auto text-[#008BE3] mb-1.5"
                      />
                      {formData.selectedFile ? (
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-emerald-700 flex items-center justify-center gap-1.5 break-all">
                            <CheckCircle size={16} className="shrink-0" />{" "}
                            {formData.selectedFile.name}
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            {(
                              formData.selectedFile.size /
                              (1024 * 1024)
                            ).toFixed(2)}{" "}
                            MB • Klik untuk mengganti file
                          </p>
                        </div>
                      ) : (
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-700">
                            Klik atau tarik file ke sini
                          </p>
                          <p className="text-[11px] text-slate-400 mt-1">
                            Format PDF, PNG, JPG (Maks. 10MB)
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Footer Buttons */}
                <div className="pt-4 border-t border-slate-200 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3">
                  <button
                    type="button"
                    onClick={() => setIsUploadModalOpen(false)}
                    className="w-full sm:w-auto px-4 py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-bold transition-colors cursor-pointer text-center"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-5 py-2.5 bg-[#008BE3] hover:bg-[#0076C2] text-white rounded-xl text-xs font-bold transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Upload size={14} /> Submit Portofolio
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: Detail Portofolio */}
      <AnimatePresence>
        {isDetailModalOpen && selectedPortfolio && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden my-auto max-h-[90vh] flex flex-col"
            >
              <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-[#008BE3] flex items-center justify-center text-white shrink-0">
                    <FileText size={18} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-extrabold text-sm sm:text-base text-white leading-tight">
                      Detail Portofolio
                    </h3>
                    <p className="text-xs text-slate-300 font-medium">
                      ID: {selectedPortfolio.id}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                    Skema Sertifikasi
                  </p>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">
                    {selectedPortfolio.skema}
                  </p>
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                    Status Asesor & Alamat LSP
                  </p>
                  <div className="mt-1 flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-xs font-bold border ${
                        selectedPortfolio.statusAsesor === "Asesor dari Luar"
                          ? "bg-purple-50 text-purple-700 border-purple-200"
                          : "bg-sky-50 text-sky-700 border-sky-200"
                      }`}
                    >
                      {selectedPortfolio.statusAsesor ||
                        "Asesor dari UIN Bandung"}
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      •{" "}
                      {selectedPortfolio.alamatLsp ||
                        "UIN Sunan Gunung Djati Bandung"}
                    </span>
                  </div>
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                    Nama Dokumen
                  </p>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">
                    {selectedPortfolio.namaDokumen}
                  </p>
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                    Tanggal Verifikasi / Pengajuan
                  </p>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">
                    {selectedPortfolio.tanggal}
                  </p>
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                    Status Verifikasi
                  </p>
                  <div className="mt-1">
                    {selectedPortfolio.status === "Terverifikasi" && (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1.5">
                        <CheckCircle size={14} /> Terverifikasi oleh Admin
                      </span>
                    )}
                    {selectedPortfolio.status === "Menunggu Verifikasi" && (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 inline-flex items-center gap-1.5">
                        <Clock size={14} /> Menunggu Verifikasi Admin
                      </span>
                    )}
                    {selectedPortfolio.status === "Ditolak" && (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200 inline-flex items-center gap-1.5">
                        <AlertCircle size={14} /> Ditolak oleh Admin
                      </span>
                    )}
                  </div>
                </div>

                {selectedPortfolio.deskripsi && (
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                      Deskripsi / Keterangan
                    </p>
                    <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200 mt-1 leading-relaxed">
                      {selectedPortfolio.deskripsi}
                    </p>
                  </div>
                )}

                {selectedPortfolio.catatanAdmin && (
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase text-red-600 tracking-wider">
                      Catatan dari Admin
                    </p>
                    <p className="text-xs text-red-800 bg-red-50 p-3 rounded-lg border border-red-200 mt-1 leading-relaxed font-medium">
                      {selectedPortfolio.catatanAdmin}
                    </p>
                  </div>
                )}

                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-1.5">
                    Dokumen File
                  </p>
                  {selectedPortfolio.statusAsesor === "Asesor dari Luar" ? (
                    <div className="space-y-2">
                      <div className="p-3 bg-sky-50/80 rounded-xl border border-sky-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <FileText
                            size={20}
                            className="text-[#008BE3] shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="text-[10px] font-bold text-sky-800 uppercase">
                              1. File Peminjaman Asesor
                            </p>
                            <p className="text-xs font-bold text-slate-800 truncate">
                              {selectedPortfolio.filePeminjamanName ||
                                selectedPortfolio.fileName}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            setPreviewFile({
                              name:
                                selectedPortfolio.filePeminjamanName ||
                                selectedPortfolio.fileName ||
                                "",
                              type: selectedPortfolio.fileType,
                            })
                          }
                          className="w-full sm:w-auto px-3 py-1.5 bg-[#008BE3] hover:bg-[#0076C2] text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1 shrink-0"
                        >
                          <Eye size={14} /> Tinjau
                        </button>
                      </div>

                      <div className="p-3 bg-purple-50/80 rounded-xl border border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <FileText
                            size={20}
                            className="text-purple-600 shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="text-[10px] font-bold text-purple-800 uppercase">
                              2. File Jawaban LSP Luar
                            </p>
                            <p className="text-xs font-bold text-purple-950 truncate">
                              {selectedPortfolio.fileJawabanName ||
                                "Konfirmasi_Peminjaman.pdf"}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            setPreviewFile({
                              name:
                                selectedPortfolio.fileJawabanName ||
                                "Konfirmasi_Peminjaman.pdf",
                              type: selectedPortfolio.fileType,
                            })
                          }
                          className="w-full sm:w-auto px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1 shrink-0"
                        >
                          <Eye size={14} /> Tinjau
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <FileText
                          size={20}
                          className="text-[#008BE3] shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-800 truncate">
                            {selectedPortfolio.fileName}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {selectedPortfolio.fileSize || "Dokumen PDF"}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          setPreviewFile({
                            name: selectedPortfolio.fileName || "",
                            type: selectedPortfolio.fileType,
                          })
                        }
                        className="w-full sm:w-auto px-3 py-1.5 bg-[#008BE3] hover:bg-[#0076C2] text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1 shrink-0"
                      >
                        <Eye size={14} /> Tinjau
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-200 flex flex-col-reverse sm:flex-row justify-end gap-2 shrink-0">
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="w-full sm:w-auto px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer text-center"
                >
                  Tutup
                </button>
                {selectedPortfolio.status === "Ditolak" && (
                  <button
                    onClick={() => {
                      setIsDetailModalOpen(false);
                      openReuploadModal(selectedPortfolio);
                    }}
                    className="w-full sm:w-auto px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <RefreshCw size={14} /> Upload Ulang
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: Upload Ulang Portofolio */}
      <AnimatePresence>
        {isReuploadModalOpen && selectedPortfolio && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden my-auto max-h-[90vh] flex flex-col"
            >
              <div className="p-4 sm:p-5 bg-amber-600 text-white flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center text-white shrink-0">
                    <RefreshCw size={18} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-extrabold text-sm sm:text-base text-white leading-tight">
                      Upload Ulang Portofolio
                    </h3>
                    <p className="text-xs text-amber-100 font-medium">
                      Perbarui dokumen yang sebelumnya ditolak.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsReuploadModalOpen(false)}
                  className="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form
                onSubmit={handleReuploadSubmit}
                className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1"
              >
                {selectedPortfolio.catatanAdmin && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800">
                    <p className="font-bold text-red-900 mb-1 flex items-center gap-1">
                      <AlertCircle size={14} className="shrink-0" /> Alasan
                      Penolakan Sebelumnya:
                    </p>
                    <p>{selectedPortfolio.catatanAdmin}</p>
                  </div>
                )}

                {/* Status Asesor */}
                <div className="min-w-0">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Status Asesor <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.statusAsesor}
                    onChange={(e) => {
                      const val = e.target.value as
                        | "Asesor dari UIN Bandung"
                        | "Asesor dari Luar";
                      setFormData((prev) => ({
                        ...prev,
                        statusAsesor: val,
                        alamatLsp:
                          val === "Asesor dari UIN Bandung"
                            ? "UIN Sunan Gunung Djati Bandung"
                            : prev.statusAsesor === "Asesor dari Luar"
                              ? prev.alamatLsp
                              : "",
                      }));
                    }}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-medium text-slate-800 bg-white focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3] outline-none cursor-pointer"
                  >
                    <option value="Asesor dari UIN Bandung">
                      Asesor dari UIN Bandung
                    </option>
                    <option value="Asesor dari Luar">Asesor dari Luar</option>
                  </select>
                </div>

                {/* Alamat LSP Asesor */}
                <div className="min-w-0">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Alamat LSP Asesor{" "}
                    {formData.statusAsesor === "Asesor dari Luar" && (
                      <span className="text-red-500">*</span>
                    )}
                  </label>
                  {formData.statusAsesor === "Asesor dari Luar" ? (
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Jl. Raya Padjadjaran No. 12, Bogor (LSP Informatika)"
                      value={formData.alamatLsp}
                      onChange={(e) =>
                        setFormData({ ...formData, alamatLsp: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-medium text-slate-800 focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3] outline-none placeholder:text-slate-400"
                    />
                  ) : (
                    <input
                      type="text"
                      readOnly
                      value="UIN Sunan Gunung Djati Bandung"
                      className="w-full px-3.5 py-2.5 border border-slate-200 bg-slate-100 rounded-xl text-sm font-medium text-slate-600 outline-none cursor-not-allowed"
                    />
                  )}
                  <p className="text-[11px] text-slate-400 font-medium mt-1">
                    {formData.statusAsesor === "Asesor dari UIN Bandung"
                      ? "Otomatis diisi UIN Bandung untuk asesor internal."
                      : "Masukkan alamat lengkap LSP dari asal asesor luar."}
                  </p>
                </div>

                {/* Skema */}
                <div className="min-w-0">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Skema Sertifikasi <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.skema}
                    onChange={(e) =>
                      setFormData({ ...formData, skema: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-medium text-slate-800 bg-white focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3] outline-none"
                  >
                    {AVAILABLE_SCHEMES.map((scheme, idx) => (
                      <option key={idx} value={scheme}>
                        {scheme}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Nama Dokumen */}
                <div className="min-w-0">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Nama Dokumen / Label <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.namaDokumen}
                    onChange={(e) =>
                      setFormData({ ...formData, namaDokumen: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-medium text-slate-800 focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3] outline-none"
                  />
                </div>

                {/* Deskripsi */}
                <div className="min-w-0">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Deskripsi / Keterangan
                  </label>
                  <textarea
                    rows={2}
                    value={formData.deskripsi}
                    onChange={(e) =>
                      setFormData({ ...formData, deskripsi: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-medium text-slate-800 focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3] outline-none"
                  />
                </div>

                {/* Upload File Section */}
                {formData.statusAsesor === "Asesor dari Luar" ? (
                  <div className="space-y-3 pt-1 border-t border-slate-200">
                    <p className="text-xs font-extrabold text-purple-900 uppercase tracking-wider">
                      Dokumen Asesor Luar (Wajib 2 File)
                    </p>

                    {/* File 1: File Peminjaman Asesor */}
                    <div className="min-w-0">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        1. File Peminjaman Asesor{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="border-2 border-dashed border-sky-300 rounded-xl p-3 text-center bg-sky-50/40 hover:bg-sky-50 transition-colors relative">
                        <input
                          type="file"
                          accept=".pdf,.png,.jpg,.jpeg"
                          onChange={handlePeminjamanFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <Upload
                          size={24}
                          className="mx-auto text-[#008BE3] mb-1"
                        />
                        {formData.filePeminjaman ? (
                          <p className="text-xs font-bold text-emerald-700 flex items-center justify-center gap-1 break-all">
                            <CheckCircle size={14} className="shrink-0" />{" "}
                            {formData.filePeminjaman.name}
                          </p>
                        ) : formData.filePeminjamanPlaceholder ? (
                          <p className="text-xs font-bold text-slate-700">
                            {formData.filePeminjamanPlaceholder}
                          </p>
                        ) : (
                          <p className="text-xs font-semibold text-slate-600">
                            File Lama:{" "}
                            {selectedPortfolio.filePeminjamanName ||
                              selectedPortfolio.fileName}
                          </p>
                        )}
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Format PDF, PNG, JPG (Klik untuk ganti)
                        </p>
                      </div>
                    </div>

                    {/* File 2: File Jawaban LSP Luar */}
                    <div className="min-w-0">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        2. File Jawaban / Konfirmasi Peminjaman dari LSP Luar{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="border-2 border-dashed border-purple-300 rounded-xl p-3 text-center bg-purple-50/40 hover:bg-purple-50 transition-colors relative">
                        <input
                          type="file"
                          accept=".pdf,.png,.jpg,.jpeg"
                          onChange={handleJawabanFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <Upload
                          size={24}
                          className="mx-auto text-purple-600 mb-1"
                        />
                        {formData.fileJawaban ? (
                          <p className="text-xs font-bold text-emerald-700 flex items-center justify-center gap-1 break-all">
                            <CheckCircle size={14} className="shrink-0" />{" "}
                            {formData.fileJawaban.name}
                          </p>
                        ) : formData.fileJawabanPlaceholder ? (
                          <p className="text-xs font-bold text-slate-700">
                            {formData.fileJawabanPlaceholder}
                          </p>
                        ) : (
                          <p className="text-xs font-semibold text-purple-900">
                            File Lama:{" "}
                            {selectedPortfolio.fileJawabanName ||
                              "Konfirmasi_Peminjaman.pdf"}
                          </p>
                        )}
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Format PDF, PNG, JPG (Klik untuk ganti)
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="min-w-0">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Upload File Baru (PDF / Gambar){" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 sm:p-5 text-center bg-slate-50/50 hover:bg-slate-50 transition-colors relative">
                      <input
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={handleSingleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <Upload
                        size={32}
                        className="mx-auto text-amber-600 mb-2"
                      />
                      {formData.selectedFile ? (
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-emerald-700 flex items-center justify-center gap-1.5 break-all">
                            <CheckCircle size={16} className="shrink-0" />{" "}
                            {formData.selectedFile.name}
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            File baru terpilih • Klik untuk mengganti
                          </p>
                        </div>
                      ) : (
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-700 break-all">
                            File Lama: {selectedPortfolio.fileName}
                          </p>
                          <p className="text-xs text-amber-700 font-medium mt-1">
                            Klik di sini untuk memilih file baru pengganti
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Footer Buttons */}
                <div className="pt-4 border-t border-slate-200 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3">
                  <button
                    type="button"
                    onClick={() => setIsReuploadModalOpen(false)}
                    className="w-full sm:w-auto px-4 py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-bold transition-colors cursor-pointer text-center"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <RefreshCw size={14} /> Submit Ulang (Menunggu Verifikasi)
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: Hapus Portofolio */}
      <AnimatePresence>
        {isDeleteModalOpen && selectedPortfolio && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-sm relative z-10 overflow-hidden"
            >
              <div className="p-5 sm:p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
                  <Trash2 size={24} />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">
                  Hapus Portofolio
                </h3>
                <p className="text-xs text-slate-500">
                  Apakah Anda yakin ingin menghapus dokumen{" "}
                  <strong className="text-slate-800">
                    {`"${selectedPortfolio?.namaDokumen || ""}"`}
                  </strong>
                  ? Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>
              <div className="p-3.5 sm:p-4 bg-slate-50 flex flex-col-reverse sm:flex-row justify-end gap-2 border-t border-slate-100">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="w-full sm:w-auto px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer text-center"
                >
                  Batal
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="w-full sm:w-auto px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors cursor-pointer text-center"
                >
                  Ya, Hapus
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: Preview File */}
      <AnimatePresence>
        {previewFile && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewFile(null)}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl h-[85vh] sm:h-[80vh] relative z-10 flex flex-col overflow-hidden border border-slate-200"
            >
              <div className="p-3.5 sm:p-4 border-b border-slate-200 flex justify-between items-center bg-slate-900 text-white gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText size={18} className="text-[#008BE3] shrink-0" />
                  <h3 className="font-bold text-xs sm:text-sm text-white truncate">
                    {previewFile.name}
                  </h3>
                </div>
                <button
                  onClick={() => setPreviewFile(null)}
                  className="text-slate-400 hover:text-white font-bold text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                >
                  <X size={14} /> Tutup
                </button>
              </div>
              <div className="flex-1 p-6 bg-slate-100 flex items-center justify-center">
                <div className="w-full h-full bg-white border border-slate-200 rounded-xl shadow-xs flex flex-col items-center justify-center text-slate-400 p-6 text-center">
                  <div className="w-20 h-20 rounded-full bg-sky-50 text-[#008BE3] flex items-center justify-center mb-4 border border-sky-100">
                    <FileText size={40} />
                  </div>
                  <h4 className="font-bold text-slate-800 text-base">
                    {previewFile.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-md">
                    Dokumen portofolio pratinjau berhasil dimuat. Format
                    terverifikasi sebagai berkas bukti asesmen resmi.
                  </p>
                  <div className="mt-6 px-4 py-2 bg-slate-100 rounded-lg text-xs font-mono text-slate-600 border border-slate-200">
                    STATUS: READY_FOR_VERIFICATION
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
