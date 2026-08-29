"use client";

import React, { useState } from "react";
import {
  Award,
  Search,
  Filter,
  ExternalLink,
  Copy,
  Check,
  Edit2,
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
  Calendar,
  X,
  ArrowRight,
  ArrowLeft,
  Users,
  Clock,
  Layers,
  MapPin,
  Globe,
  ChevronDown,
  Sparkles,
  Eye,
} from "lucide-react";
import { useAppContext } from "@/context/context";
import { AsesiPlenoRecord, PlenoGroup } from "@/types/types";

export type { AsesiPlenoRecord };

export default function UploadSertifikat() {
  const { user } = useAppContext();
  const readOnly = user?.role !== "admin";
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleDownloadSertifikat = async () => {
    try {
      setIsLoading(true);

      const samplePayload = {
        nomorSertifikat: "70203 2432 0000000 2025",
        nomorRegistrasi: "HMS 001 00000 2025",
        namaPemegang: "Intan Tania",
        bidangId: "Kehumasan",
        bidangEn: "Public Relation",
        kualifikasiId:
          "Klaster Melaksanakan Komunikasi dengan Pemangku Kepentingan",
        kualifikasiEn: "Cluster Implementing Communication with Stakeholders",
        kotaTerbit: "Bandung",
        tanggalTerbitId: "22 Desember 2025",
        tanggalTerbitEn: "December 22, 2025",
        namaDirektur: "Prof. Dr. H. Ija Suntana, M.Ag., CLA.",
        namaManajerSertifikasi: "Ichsan Taufik, MT., CIQA",
        unitList: [
          {
            no: 1,
            kodeUnit: "M.70HMS00.031.3",
            judulUnitId: "Melaksanakan Media Relations",
            judulUnitEn: "Implementing Media Relations",
          },
          {
            no: 2,
            kodeUnit: "M.70HMS00.032.2",
            judulUnitId: "Melaksanakan Community Relations",
            judulUnitEn: "Implementing Community Relations",
          },
          {
            no: 3,
            kodeUnit: "M.70HMS00.033.3",
            judulUnitId: "Melaksanakan Corporate Social Responsibility (CSR)",
            judulUnitEn: "Implementing Corporate Social Responsibility (CSR)",
          },
          {
            no: 4,
            kodeUnit: "M.70HMS00.034.1",
            judulUnitId: "Melaksanakan Industrial Relations",
            judulUnitEn: "Implementing Industrial Relations",
          },
          {
            no: 5,
            kodeUnit: "M.70HMS00.035.3",
            judulUnitId: "Melaksanakan Government Relations",
            judulUnitEn: "Implementing Government Relations",
          },
          {
            no: 6,
            kodeUnit: "M.70HMS00.036.1",
            judulUnitId: "Melaksanakan Institusional Relations",
            judulUnitEn: "Implementing Institutional Relations",
          },
          {
            no: 7,
            kodeUnit: "M.70HMS00.037.3",
            judulUnitId: "Melaksanakan Internal Relations",
            judulUnitEn: "Implementing Internal Relations",
          },
          {
            no: 8,
            kodeUnit: "M.70HMS00.038.3",
            judulUnitId: "Melaksanakan Marketing Public Relations",
            judulUnitEn: "Implementing Marketing Public Relations",
          },
          {
            no: 9,
            kodeUnit: "M.70HMS00.039.1",
            judulUnitId: "Melaksanakan Customer Relations",
            judulUnitEn: "Implementing Customer Relations",
          },
          {
            no: 10,
            kodeUnit: "M.70HMS00.040.3",
            judulUnitId: "Melaksanakan Investor Relations",
            judulUnitEn: "Implementing Investor Relations",
          },
        ],
      };

      const res = await fetch("/api/surat/sertifikat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(samplePayload),
      });

      if (!res.ok) throw new Error("Gagal download sertifikat");

      const blob = await res.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `Sertifikat_${samplePayload.namaPemegang}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat mengunduh sertifikat.");
    } finally {
      setIsLoading(false);
    }
  };

  // State for Pleno Sessions and their Asesi lists
  const [plenoGroups, setPlenoGroups] = useState<PlenoGroup[]>([
    {
      plenoId: "PLENO-2026-001",
      plenoTitle: "Sidang Pleno Hasil Asesmen Batch 1",
      skemaList: [
        "Pemrogram Mobil Pertama (Mobile Developer)",
        "Junior Web Developer",
      ],
      tanggal: "15 Agt 2026",
      waktu: "09:00 - 12:00 WIB",
      lokasi: "Ruang Sidang Utama Gedung Rektorat",
      isOnline: false,
      status: "Selesai",
      asesiList: [
        {
          id: "AS-001",
          nama: "Ahmad Rizki",
          nik: "1197050001",
          skema: "Pemrogram Mobil Pertama (Mobile Developer)",
          noSertifikat: "50012/LSP-SGD/VIII/2026",
          issueDate: "2026-08-16",
          gdriveUrl:
            "https://drive.google.com/file/d/1A2b3C4d5E6f7G8h9I0j_Cert1/view",
          status: "Terbit",
          notes: "Telah terverifikasi BNSP",
        },
        {
          id: "AS-002",
          nama: "Siti Nurhaliza",
          nik: "1197050012",
          skema: "Junior Web Developer",
          noSertifikat: "50013/LSP-SGD/VIII/2026",
          issueDate: "2026-08-16",
          gdriveUrl:
            "https://drive.google.com/file/d/2B3c4D5e6F7g8H9i0J1k_Cert2/view",
          status: "Terbit",
          notes: "Dokumen diunggah ke GDrive LSP",
        },
        {
          id: "AS-003",
          nama: "Budi Santoso",
          nik: "1197050025",
          skema: "Pemrogram Mobil Pertama (Mobile Developer)",
          noSertifikat: "",
          issueDate: "",
          gdriveUrl: "",
          status: "Belum Upload",
          notes: "",
        },
        {
          id: "AS-004",
          nama: "Dewi Anggraini",
          nik: "1197050031",
          skema: "Junior Web Developer",
          noSertifikat: "50014/LSP-SGD/VIII/2026",
          issueDate: "2026-08-16",
          gdriveUrl:
            "https://drive.google.com/file/d/3C4d5E6f7G8h9I0j1K2l_Cert3/view",
          status: "Terbit",
          notes: "",
        },
        {
          id: "AS-005",
          nama: "Muhammad Farhan",
          nik: "1197050042",
          skema: "Pemrogram Mobil Pertama (Mobile Developer)",
          noSertifikat: "",
          issueDate: "",
          gdriveUrl: "",
          status: "Belum Upload",
          notes: "",
        },
      ],
    },
    {
      plenoId: "PLENO-2026-002",
      plenoTitle: "Sidang Pleno Kelulusan Asesmen Batch 2",
      skemaList: ["Junior Web Developer", "Auditor Halal"],
      tanggal: "18 Agt 2026",
      waktu: "13:00 - 15:30 WIB",
      lokasi: "Zoom Meeting (Online)",
      isOnline: true,
      status: "Selesai",
      asesiList: [
        {
          id: "AS-006",
          nama: "Dewi Lestari",
          nik: "1197050044",
          skema: "Junior Web Developer",
          noSertifikat: "50020/LSP-SGD/VIII/2026",
          issueDate: "2026-08-18",
          gdriveUrl:
            "https://drive.google.com/file/d/4D5e6F7g8H9i0J1k2L3m_Cert4/view",
          status: "Terbit",
          notes: "Lulus Sidang Pleno",
        },
        {
          id: "AS-007",
          nama: "Eko Prasetyo",
          nik: "1197050058",
          skema: "Auditor Halal",
          noSertifikat: "",
          issueDate: "",
          gdriveUrl: "",
          status: "Belum Upload",
          notes: "",
        },
        {
          id: "AS-008",
          nama: "Rina Marlina",
          nik: "1197050063",
          skema: "Junior Web Developer",
          noSertifikat: "",
          issueDate: "",
          gdriveUrl: "",
          status: "Belum Upload",
          notes: "",
        },
        {
          id: "AS-009",
          nama: "Hendra Wijaya",
          nik: "1197050070",
          skema: "Auditor Halal",
          noSertifikat: "50021/LSP-SGD/VIII/2026",
          issueDate: "2026-08-18",
          gdriveUrl:
            "https://drive.google.com/file/d/5E6f7G8h9I0j1K2l3M4n_Cert5/view",
          status: "Terbit",
          notes: "",
        },
      ],
    },
    {
      plenoId: "PLENO-2026-003",
      plenoTitle: "Sidang Pleno Terpadu Batch 3",
      skemaList: [
        "Auditor Halal",
        "Pemrogram Mobil Pertama (Mobile Developer)",
        "Network Administrator",
      ],
      tanggal: "22 Agt 2026",
      waktu: "09:30 - 11:30 WIB",
      lokasi: "Gedung PTIPD Lantai 2",
      isOnline: false,
      status: "Terjadwal",
      asesiList: [
        {
          id: "AS-010",
          nama: "Bambang Hermanto",
          nik: "1197050081",
          skema: "Auditor Halal",
          noSertifikat: "",
          issueDate: "",
          gdriveUrl: "",
          status: "Belum Upload",
          notes: "",
        },
        {
          id: "AS-011",
          nama: "Nina Zatulini",
          nik: "1197050095",
          skema: "Pemrogram Mobil Pertama (Mobile Developer)",
          noSertifikat: "",
          issueDate: "",
          gdriveUrl: "",
          status: "Belum Upload",
          notes: "",
        },
        {
          id: "AS-012",
          nama: "Dian Sastrowardoyo",
          nik: "1197050102",
          skema: "Network Administrator",
          noSertifikat: "",
          issueDate: "",
          gdriveUrl: "",
          status: "Belum Upload",
          notes: "",
        },
      ],
    },
  ]);

  // Level 1 vs Level 2 state
  const [selectedPlenoId, setSelectedPlenoId] = useState<string | null>(null);

  // Search and Filter states
  const [plenoSearchTerm, setPlenoSearchTerm] = useState("");
  const [plenoFilterStatus, setPlenoFilterStatus] = useState<
    "Semua" | "Selesai" | "Terjadwal"
  >("Semua");
  const [candidateSearchTerm, setCandidateSearchTerm] = useState("");
  const [candidateFilterStatus, setCandidateFilterStatus] = useState<
    "Semua" | "Terbit" | "Belum Upload"
  >("Semua");

  // Copy notification state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modal State for inputting/editing GDrive link for an asesi
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAsesi, setEditingAsesi] = useState<{
    plenoId: string;
    asesi: AsesiPlenoRecord;
  } | null>(null);
  const [inputForm, setInputForm] = useState({
    n: "",
    issueDate: "",
    gdriveUrl: "",
    notes: "",
  });

  // Handle copying GDrive URL
  const handleCopy = (url: string, id: string) => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Open modal to input/edit GDrive link for a specific asesi
  const handleOpenInputModal = (plenoId: string, asesi: AsesiPlenoRecord) => {
    setEditingAsesi({ plenoId, asesi });
    const defaultCertNo =
      asesi.noSertifikat ||
      `50${Math.floor(100 + Math.random() * 900)}/LSP-SGD/VIII/2026`;
    const defaultDate =
      asesi.issueDate || new Date().toISOString().split("T")[0];

    setInputForm({
      n: defaultCertNo,
      issueDate: defaultDate,
      gdriveUrl: asesi.gdriveUrl || "",
      notes: asesi.notes || "",
    });
    setIsModalOpen(true);
  };

  // Save GDrive link and info for asesi
  const handleSaveGDriveLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAsesi) return;

    if (!inputForm.gdriveUrl.trim()) {
      alert("Tautan Google Drive sertifikat wajib diisi.");
      return;
    }

    const { plenoId, asesi } = editingAsesi;

    setPlenoGroups((prev) =>
      prev.map((group) => {
        if (group.plenoId === plenoId) {
          return {
            ...group,
            // Hapus .length, langsung gunakan .map() pada array
            asesiList: group.asesiList.map((item) => {
              if (item.id === asesi.id) {
                return {
                  ...item,
                  n: inputForm.n, // Catatan: Pastikan 'n' memang ada di interface AsesiPlenoRecord Anda (atau gunakan noSertifikat)
                  issueDate: inputForm.issueDate,
                  gdriveUrl: inputForm.gdriveUrl.trim(),
                  status: "Terbit",
                  notes: inputForm.notes,
                };
              }
              return item;
            }),
          };
        }
        return group;
      }),
    );

    setIsModalOpen(false);
    setEditingAsesi(null);
  };

  // Filtered Pleno Groups for Level 1
  const filteredPlenoGroups = plenoGroups.filter((group) => {
    if (plenoFilterStatus === "Selesai" && group.status !== "Selesai")
      return false;
    if (plenoFilterStatus === "Terjadwal" && group.status !== "Terjadwal")
      return false;

    if (plenoSearchTerm.trim()) {
      const q = plenoSearchTerm.toLowerCase();
      const matchId = group.plenoId.toLowerCase().includes(q);
      const matchTitle = group.plenoTitle.toLowerCase().includes(q);

      // skemaList berisi string[], bukan objek — langsung compare string
      const matchSkema = group.skemaList.some((s) =>
        s.toLowerCase().includes(q),
      );

      const matchAsesi = group.asesiList.some(
        (a) =>
          a.nama?.toLowerCase().includes(q) || a.nik?.toLowerCase().includes(q),
      );

      if (!matchId && !matchTitle && !matchSkema && !matchAsesi) return false;
    }

    return true;
  });

  // Selected Pleno Group for Level 2
  const selectedPlenoGroup = plenoGroups.find(
    (g) => g.plenoId === selectedPlenoId,
  );

  // Filtered Candidates inside Level 2
  const filteredCandidates = selectedPlenoGroup
    ? selectedPlenoGroup.asesiList.filter((candidate) => {
        if (candidateFilterStatus === "Terbit" && candidate.status !== "Terbit")
          return false;
        if (
          candidateFilterStatus === "Belum Upload" &&
          candidate.status !== "Belum Upload"
        )
          return false;

        if (candidateSearchTerm.trim()) {
          const q = candidateSearchTerm.toLowerCase();
          const matchName = candidate.nama.toLowerCase().includes(q);
          const matchNim = candidate.nik.toLowerCase().includes(q);
          if (!matchName && !matchNim) return false;
        }

        return true;
      })
    : [];

  // Totals for overall header summary
  const totalPlenoCount = plenoGroups.length;
  const totalAsesiAll = plenoGroups.reduce(
    (acc, g) => acc + g.asesiList.length,
    0,
  );
  const totalCertUploadedAll = plenoGroups.reduce(
    (acc, g) => acc + g.asesiList.filter((a) => a.status === "Terbit").length,
    0,
  );

  return (
    <div className="min-h-screen bg-[#F8F9FC] p-4 md:p-8 space-y-6 pb-24 text-sm text-gray-700">
      {/* Header Title - Aligned with standard admin page headers */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-[#008BE3]/10 flex items-center justify-center text-[#008BE3] border border-[#008BE3]/20 shadow-xs shrink-0">
            <Award size={20} className="stroke-[2.5]" />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">
              Upload Sertifikat (Link GDrive)
            </h2>
            <p className="text-xs text-gray-500 font-medium tracking-wider uppercase leading-4">
              Pengelolaan & pengunggahan tautan sertifikat per Sidang Pleno
            </p>
          </div>
        </div>

        {/* High-Level Metrics Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-gray-100 text-xs font-bold text-slate-700 shadow-2xs">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
              Sidang Pleno:
            </span>
            <span className="text-slate-900 font-black">{totalPlenoCount}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-gray-100 text-xs font-bold text-slate-700 shadow-2xs">
            <span className="text-[10px] uppercase tracking-wider text-[#008BE3] font-bold">
              Total Asesi:
            </span>
            <span className="text-[#008BE3] font-black">{totalAsesiAll}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-gray-100 text-xs font-bold text-slate-700 shadow-2xs">
            <span className="text-[10px] uppercase tracking-wider text-emerald-600 font-bold">
              Terbit GDrive:
            </span>
            <span className="text-emerald-700 font-black">
              {totalCertUploadedAll}/{totalAsesiAll}
            </span>
          </div>
        </div>
      </div>

      {/* VIEW SWITCHER: LEVEL 1 (Daftar Sidang Pleno) vs LEVEL 2 (Daftar Asesi dalam Sidang Pleno) */}
      {!selectedPlenoId ? (
        /* ==================== LEVEL 1 VIEW: DAFTAR SIDANG PLENO (GRID CARDS) ==================== */
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
                value={plenoFilterStatus}
                onChange={(e) =>
                  setPlenoFilterStatus(
                    e.target.value as "Semua" | "Selesai" | "Terjadwal",
                  )
                }
                className="w-full appearance-none pl-10 pr-9 py-2.5 bg-gray-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#008BE3]/20 focus:border-[#008BE3] transition-all cursor-pointer"
              >
                <option value="Semua">
                  Semua Status Pleno ({plenoGroups.length})
                </option>
                <option value="Selesai">
                  Selesai Sidang (
                  {plenoGroups.filter((g) => g.status === "Selesai").length})
                </option>
                <option value="Terjadwal">
                  Terjadwal (
                  {plenoGroups.filter((g) => g.status === "Terjadwal").length})
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
                placeholder="Cari Sidang Pleno, Skema, atau Asesi..."
                value={plenoSearchTerm}
                onChange={(e) => setPlenoSearchTerm(e.target.value)}
                className="bg-transparent border-none focus:ring-0 text-xs md:text-sm w-full outline-none text-slate-800 placeholder-gray-400 font-semibold"
              />
            </div>
          </div>

          {/* Grid Cards per Sidang Pleno */}
          {filteredPlenoGroups.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlenoGroups.map((pleno) => {
                const totalAsesi = pleno.asesiList.length;
                const uploadedCount = pleno.asesiList.filter(
                  (a) => a.status === "Terbit",
                ).length;
                const progressPercent =
                  totalAsesi > 0
                    ? Math.round((uploadedCount / totalAsesi) * 100)
                    : 0;

                return (
                  <div
                    key={pleno.plenoId}
                    className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-[#008BE3]/50 transition-all flex flex-col justify-between overflow-hidden group"
                  >
                    {/* Card Body */}
                    <div className="p-5 space-y-3.5">
                      <div className="flex items-center justify-between gap-2">
                        {/* Pleno ID Badge */}
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-black tracking-wide border border-slate-200">
                          <Layers size={13} className="text-slate-500" />
                          {pleno.plenoId}
                        </div>

                        {/* Online / Offline / Status Badge */}
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                            pleno.status === "Selesai"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          <CheckCircle2 size={12} className="stroke-[2.5]" />
                          {pleno.status}
                        </span>
                      </div>

                      {/* Pleno Title */}
                      <div className="min-w-0">
                        <h3 className="text-base font-black text-slate-900 group-hover:text-[#008BE3] transition-colors leading-snug">
                          {pleno.plenoTitle}
                        </h3>
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
                            <span>{pleno.tanggal}</span>
                          </div>
                          <span className="text-slate-300">•</span>
                          <div className="flex items-center gap-1.5">
                            <Clock
                              size={14}
                              className="text-slate-400 shrink-0"
                            />
                            <span className="font-semibold text-slate-700">
                              {pleno.waktu}
                            </span>
                          </div>
                        </div>

                        {/* Location */}
                        <div className="flex items-start gap-2">
                          {pleno.isOnline ? (
                            <Globe
                              size={14}
                              className="text-purple-500 shrink-0 mt-0.5"
                            />
                          ) : (
                            <MapPin
                              size={14}
                              className="text-[#008BE3] shrink-0 mt-0.5"
                            />
                          )}
                          <span className="text-slate-700 font-semibold wrap-break-word leading-snug">
                            {pleno.lokasi}
                          </span>
                        </div>

                        {/* Progress Stats */}
                        <div className="flex items-center justify-between gap-2 pt-1">
                          <div className="flex items-center gap-1.5 text-slate-700 font-bold">
                            <Users size={14} className="text-slate-400" />
                            <span>{totalAsesi} Asesi Disidangkan</span>
                          </div>

                          <span className="text-[11px] font-bold text-slate-500 shrink-0">
                            {uploadedCount}/{totalAsesi} Link GDrive (
                            {progressPercent}%)
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 ${
                              progressPercent === 100
                                ? "bg-emerald-500"
                                : "bg-[#008BE3]"
                            }`}
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Card Footer Action */}
                    <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
                      <span className="text-[11px] text-slate-500 font-medium">
                        {uploadedCount === totalAsesi
                          ? "Sertifikat Lengkap"
                          : `${totalAsesi - uploadedCount} Asesi Belum Memiliki Link`}
                      </span>

                      <button
                        onClick={() => setSelectedPlenoId(pleno.plenoId)}
                        className="bg-[#008BE3] hover:bg-[#0076C2] text-white px-3.5 py-1.5 rounded-lg font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 ml-auto cursor-pointer"
                      >
                        Lihat Daftar Asesi
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
                  Sidang Pleno Tidak Ditemukan
                </h4>
                <p className="text-xs text-slate-500 max-w-md">
                  Tidak ada data Sidang Pleno yang sesuai dengan kata kunci
                  pencarian atau filter yang dipilih.
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ==================== LEVEL 2 VIEW: DAFTAR ASESI DALAM SIDANG PLENO ==================== */
        <div className="space-y-6">
          {/* Header Card Info for Selected Pleno */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-slate-100 space-y-4">
              {/* Back Button & Title */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    onClick={() => {
                      setSelectedPlenoId(null);
                      setCandidateSearchTerm("");
                      setCandidateFilterStatus("Semua");
                    }}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-[#008BE3] bg-[#008BE3]/10 hover:bg-[#008BE3]/20 transition-colors cursor-pointer shrink-0"
                    title="Kembali ke Daftar Sidang Pleno"
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800 text-xs font-black border border-slate-200">
                        {selectedPlenoGroup?.plenoId}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                        {selectedPlenoGroup?.status}
                      </span>
                    </div>
                    <h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                      {selectedPlenoGroup?.plenoTitle}
                    </h2>
                  </div>
                </div>
              </div>

              {/* Meta Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-100 text-xs">
                <div>
                  <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    Rentang Waktu
                  </p>
                  <p className="font-bold text-slate-800 text-xs sm:text-sm mt-0.5">
                    {selectedPlenoGroup?.tanggal} ({selectedPlenoGroup?.waktu})
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    TUK
                  </p>
                  <p className="font-bold text-slate-800 text-xs sm:text-sm mt-0.5">
                    {selectedPlenoGroup?.lokasi}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    Progres Sertifikat
                  </p>
                  <p className="font-black text-[#008BE3] text-xs sm:text-sm mt-0.5">
                    {
                      selectedPlenoGroup?.asesiList.filter(
                        (a) => a.status === "Terbit",
                      ).length
                    }{" "}
                    dari {selectedPlenoGroup?.asesiList.length} Asesi Terbit (
                    {selectedPlenoGroup &&
                    selectedPlenoGroup.asesiList.length > 0
                      ? Math.round(
                          (selectedPlenoGroup.asesiList.filter(
                            (a) => a.status === "Terbit",
                          ).length /
                            selectedPlenoGroup.asesiList.length) *
                            100,
                        )
                      : 0}
                    %)
                  </p>
                </div>
              </div>
            </div>

            {/* Candidate List Controls & Filters */}
            <div className="p-4 sm:p-5 bg-slate-50/50 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Users size={18} className="text-[#008BE3]" />
                <h3 className="font-bold text-slate-800 text-sm sm:text-base">
                  Daftar Asesi Disidangkan (
                  {selectedPlenoGroup?.asesiList.length})
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                {/* Search Input */}
                <div className="flex items-center gap-2 bg-white rounded-xl px-3 h-9.25 w-full sm:w-64 border border-slate-200 focus-within:border-[#008BE3] transition-colors shadow-2xs">
                  <Search className="text-slate-400 shrink-0" size={15} />
                  <input
                    type="text"
                    placeholder="Cari Asesi, No. Sertifikat..."
                    value={candidateSearchTerm}
                    onChange={(e) => setCandidateSearchTerm(e.target.value)}
                    className="bg-transparent border-none focus:ring-0 text-xs w-full outline-none text-slate-800 placeholder-slate-400 font-semibold"
                  />
                </div>

                {/* Status Filter */}
                <select
                  value={candidateFilterStatus}
                  onChange={(e) =>
                    setCandidateFilterStatus(
                      e.target.value as "Semua" | "Terbit" | "Belum Upload",
                    )
                  }
                  className="bg-white border border-slate-200 text-xs rounded-xl px-3 h-9.25 outline-none font-bold text-slate-700 cursor-pointer shadow-2xs"
                >
                  <option value="Semua">Semua Status Link</option>
                  <option value="Terbit">Sudah Ada Link GDrive</option>
                  <option value="Belum Upload">Belum Ada Link GDrive</option>
                </select>
              </div>
            </div>

            {/* Table of Candidates with SEPARATED COLUMNS (1 Data per Column, Single-line Rows) */}
            <div className="overflow-x-auto relative">
              <table className="w-full text-left border-collapse min-w-max">
                <thead>
                  <tr className="bg-[#0F172A] border-b border-[#0F172A]">
                    <th className="px-3 py-3.5 text-xs font-bold text-white/90 uppercase tracking-wider text-center whitespace-nowrap">
                      No
                    </th>
                    <th className="px-4 py-3.5 text-xs font-bold text-white/90 uppercase tracking-wider whitespace-nowrap">
                      Nama Asesi
                    </th>
                    <th className="px-4 py-3.5 text-xs font-bold text-white/90 uppercase tracking-wider whitespace-nowrap">
                      Skema Sertifikasi
                    </th>
                    <th className="px-4 py-3.5 text-xs font-bold text-white/90 uppercase tracking-wider whitespace-nowrap">
                      Nomor Sertifikat
                    </th>
                    <th className="px-4 py-3.5 text-xs font-bold text-white/90 uppercase tracking-wider whitespace-nowrap">
                      Tanggal Terbit
                    </th>
                    <th className="px-4 py-3.5 text-xs font-bold text-white/90 uppercase tracking-wider whitespace-nowrap">
                      Status Sertifikat
                    </th>
                    <th className="px-4 py-3.5 text-xs font-bold text-white/90 uppercase tracking-wider whitespace-nowrap">
                      Tautan Google Drive
                    </th>
                    <th className="px-4 py-3.5 text-xs font-bold text-white/90 uppercase tracking-wider text-center sticky right-0 bg-[#0F172A] z-20 border-l border-white/10 whitespace-nowrap">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                  {filteredCandidates.length > 0 ? (
                    filteredCandidates.map((candidate, index) => (
                      <tr
                        key={candidate.id}
                        className="hover:bg-slate-50/80 transition-colors group"
                      >
                        {/* No */}
                        <td className="px-3 py-4 align-middle text-center whitespace-nowrap">
                          <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 font-bold text-xs inline-flex items-center justify-center">
                            {index + 1}
                          </span>
                        </td>

                        {/* Nama Asesi */}
                        <td className="px-4 py-4 align-middle whitespace-nowrap">
                          <p className="font-bold text-slate-900 text-sm whitespace-nowrap">
                            {candidate.nama}
                          </p>
                        </td>

                        {/* Skema Sertifikasi */}
                        <td className="px-4 py-4 align-middle whitespace-nowrap">
                          <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200 whitespace-nowrap">
                            {candidate.skema}
                          </span>
                        </td>

                        {/* Nomor Sertifikat */}
                        <td className="px-4 py-4 align-middle whitespace-nowrap">
                          {candidate.noSertifikat ? (
                            <p className="font-mono font-bold text-slate-800 text-xs whitespace-nowrap">
                              {candidate.noSertifikat}
                            </p>
                          ) : (
                            <span className="text-slate-400 italic text-xs whitespace-nowrap">
                              -
                            </span>
                          )}
                        </td>

                        {/* Tanggal Terbit */}
                        <td className="px-4 py-4 align-middle whitespace-nowrap">
                          {candidate.issueDate ? (
                            <p className="font-medium text-slate-700 text-xs whitespace-nowrap">
                              {candidate.issueDate}
                            </p>
                          ) : (
                            <span className="text-slate-400 italic text-xs whitespace-nowrap">
                              -
                            </span>
                          )}
                        </td>

                        {/* Status Sertifikat */}
                        <td className="px-4 py-4 align-middle whitespace-nowrap">
                          {candidate.status === "Terbit" ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
                              <CheckCircle2 size={12} /> Terbit
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 whitespace-nowrap">
                              <AlertCircle size={12} /> Belum Upload
                            </span>
                          )}
                        </td>

                        {/* Tautan Google Drive */}
                        <td className="px-4 py-4 align-middle whitespace-nowrap">
                          {candidate.status === "Terbit" &&
                          candidate.gdriveUrl ? (
                            <div className="flex items-center gap-1.5 whitespace-nowrap">
                              <a
                                href={candidate.gdriveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs font-bold text-[#008BE3] hover:underline bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200 transition-colors whitespace-nowrap"
                                title={candidate.gdriveUrl}
                              >
                                <ExternalLink size={12} className="shrink-0" />
                                <span className="truncate max-w-[200px]">
                                  {candidate.gdriveUrl}
                                </span>
                              </a>
                              <button
                                onClick={() =>
                                  handleCopy(candidate.gdriveUrl, candidate.id)
                                }
                                className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors cursor-pointer shrink-0"
                                title="Salin Link Google Drive"
                              >
                                {copiedId === candidate.id ? (
                                  <Check
                                    size={14}
                                    className="text-emerald-600"
                                  />
                                ) : (
                                  <Copy size={14} />
                                )}
                              </button>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic text-xs whitespace-nowrap">
                              -
                            </span>
                          )}
                        </td>

                        {/* ACTION COLUMN ON THE RIGHT */}
                        <td className="px-4 py-4 align-middle text-center bg-white group-hover:bg-slate-50/80 sticky right-0 z-10 border-l border-slate-100 whitespace-nowrap">
                          {readOnly ? (
                            <button
                              onClick={() =>
                                selectedPlenoGroup &&
                                handleOpenInputModal(
                                  selectedPlenoGroup.plenoId,
                                  candidate,
                                )
                              }
                              className="bg-sky-50 hover:bg-sky-100 text-[#008BE3] border border-sky-200 px-3 py-1.5 rounded-lg font-bold text-xs shadow-2xs transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                              title="Lihat Detail Sertifikat Asesi"
                            >
                              <Eye size={14} /> Detail
                            </button>
                          ) : candidate.status === "Terbit" ? (
                            <button
                              onClick={() =>
                                selectedPlenoGroup &&
                                handleOpenInputModal(
                                  selectedPlenoGroup.plenoId,
                                  candidate,
                                )
                              }
                              className="bg-[#008BE3] hover:bg-[#0076C2] text-white px-3 py-1.5 rounded-lg font-bold text-xs shadow-2xs transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                              title="Edit Link Sertifikat GDrive"
                            >
                              <Edit2 size={13} /> Edit
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                selectedPlenoGroup &&
                                handleOpenInputModal(
                                  selectedPlenoGroup.plenoId,
                                  candidate,
                                )
                              }
                              className="bg-[#008BE3] hover:bg-[#0076C2] text-white px-3 py-1.5 rounded-lg font-bold text-xs shadow-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                            >
                              <LinkIcon size={14} /> Input
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-6 py-12 text-center text-slate-400 font-medium"
                      >
                        Tidak ada data asesi yang cocok dengan kriteria
                        pencarian.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL INPUT / EDIT LINK GDRIVE SANGAT SPESIFIK DENGAN PILIHAN PER ASESI */}
      {isModalOpen && editingAsesi && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
              <div className="flex items-center gap-2">
                <Award size={18} className="text-[#008BE3]" />
                <h3 className="font-bold text-sm">
                  {readOnly
                    ? "Detail Sertifikat Asesi"
                    : "Input Link Sertifikat (GDrive)"}{" "}
                  - {editingAsesi.asesi.nama}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingAsesi(null);
                }}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!readOnly) handleSaveGDriveLink(e);
                else {
                  setIsModalOpen(false);
                  setEditingAsesi(null);
                }
              }}
              className="p-6 space-y-4"
            >
              {/* Asesi Identity Display */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Asesi Disidangkan
                </p>
                <p className="font-black text-slate-900 text-sm">
                  {editingAsesi.asesi.nama}
                </p>
                <p className="text-xs text-slate-600 font-medium">
                  Skema: {editingAsesi.asesi.skema}
                </p>
              </div>

              {/* Cert Number & Issue Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tanggal Terbit {!readOnly && "*"}
                  </label>
                  <input
                    type="date"
                    required={!readOnly}
                    readOnly={readOnly}
                    value={inputForm.issueDate}
                    onChange={(e) =>
                      setInputForm({ ...inputForm, issueDate: e.target.value })
                    }
                    className={`w-full border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold outline-none transition-all ${
                      readOnly
                        ? "bg-slate-100 text-slate-700 cursor-not-allowed"
                        : "bg-slate-50 focus:border-[#008BE3] focus:bg-white"
                    }`}
                  />
                </div>
              </div>

              {/* Google Drive Link Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Tautan Google Drive Sertifikat {!readOnly && "*"}</span>
                  <span className="text-[10px] text-[#008BE3] font-bold">
                    PDF / Google Drive URL
                  </span>
                </label>
                <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
                  <div className="relative flex-1 flex items-center">
                    <LinkIcon
                      size={16}
                      className="absolute left-3 text-slate-400 shrink-0"
                    />
                    <input
                      type="url"
                      required={!readOnly}
                      readOnly={readOnly}
                      placeholder={
                        readOnly
                          ? "Belum ada link sertifikat"
                          : "https://drive.google.com/file/d/.../view"
                      }
                      value={inputForm.gdriveUrl}
                      onChange={(e) =>
                        setInputForm({
                          ...inputForm,
                          gdriveUrl: e.target.value,
                        })
                      }
                      className={`w-full border border-sky-200 rounded-xl pl-9 pr-3 py-2.5 text-xs sm:text-sm font-semibold outline-none transition-all ${
                        readOnly
                          ? "bg-slate-100 text-slate-700 cursor-not-allowed"
                          : "bg-sky-50/50 text-slate-800 focus:border-[#008BE3] focus:bg-white"
                      }`}
                    />
                  </div>
                  {!readOnly && (
                    <button
                      type="button"
                      onClick={() => handleDownloadSertifikat()}
                      className="px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shrink-0 flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
                      title="Generate otomatis tautan Google Drive sertifikat"
                    >
                      <Sparkles size={14} />
                      <span>Generate Sertifikat</span>
                    </button>
                  )}
                </div>
                {!readOnly && (
                  <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                    Pastikan tautan Google Drive telah diset izin aksesnya
                    menjadi{" "}
                    <strong>Siapa saja yang memiliki link (Public View)</strong>{" "}
                    agar dapat diakses oleh Asesi.
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                {readOnly ? (
                  <>
                    {inputForm.gdriveUrl && (
                      <a
                        href={inputForm.gdriveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 text-xs font-bold text-white bg-[#008BE3] hover:bg-[#0076C2] rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
                      >
                        <ExternalLink size={14} /> Buka Link GDrive
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setIsModalOpen(false);
                        setEditingAsesi(null);
                      }}
                      className="px-5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                    >
                      Tutup
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setIsModalOpen(false);
                        setEditingAsesi(null);
                      }}
                      className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 text-xs font-bold text-white bg-[#008BE3] hover:bg-[#0076C2] rounded-xl transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <Check size={16} /> Simpan Link Sertifikat
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
