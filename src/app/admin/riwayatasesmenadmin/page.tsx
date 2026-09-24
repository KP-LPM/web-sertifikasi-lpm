"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  History,
  CheckCircle,
  FileText,
  Calendar,
  X,
  XCircle,
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
  AlertTriangle,
} from "lucide-react";
import { useAppContext } from "@/context/context";
import {
  FormFRAPL02,
  FormFRAK07,
  FormFRIA04A,
  FormFRIA04B,
  FormFRIA07,
} from "@/components/forms";
import { EFormApl01 } from "@/components/forms/asesi/FormFRAPL01";
import { getJadwalCompleted, getBatchCompleted, getCandidatesList, getPengajuanDetail } from "@/lib/api";
import {
  CompletedBatchAsesi,
  CompletedBatchItem,
  AsesiPlenoItem,
  PlenoDetailData,
  AssessmentItem,
  TipeTuk,
  JenisMetode,
  Apl01FormData,
} from "@/types/types";

interface CandidateCandidateItem {
  pengajuanId: number;
  nik?: string;
  namaLengkap?: string;
  namaSkema?: string;
  kodeSkema?: string;
  namaAsesor?: string;
  asesorReg?: string;
  hasilAsesmen?: string;
  statusPengajuan?: string;
  tanggalJadwal?: string;
  waktuMulai?: string;
  tipeTuk?: string;
  metode?: string;
  alamat?: string;
  namaTuk?: string;
  skemaId?: number;
}

export default function RiwayatAsesmenAdmin() {
  const { setExtraCrumbs } = useAppContext();

  const [mainTab, setMainTab] = useState<"asesmen" | "batch" | "pleno">("asesmen");
  const [assessmentList, setAssessmentList] = useState<AssessmentItem[]>([]);
  const [completedBatches, setCompletedBatches] = useState<CompletedBatchItem[]>([]);
  const [completedPleno, setCompletedPleno] = useState<PlenoDetailData[]>([]);
  const [riwayatDetails, setRiwayatDetails] = useState<{ form_type: string;[key: string]: string | number | boolean | null | undefined }[]>([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Asesmen Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [hasilFilter, setHasilFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [tanggalFilter, setTanggalFilter] = useState("");
  const [selectedAsesmen, setSelectedAsesmen] = useState<AssessmentItem | null>(null);
  const [previewForm, setPreviewForm] = useState<
    "FR.APL.01" | "FR.APL.02" | "FR.AK.07" | "FR.IA.04A" | "FR.IA.04B" | "FR.IA.07" | null
  >(null);
  const [apl01FormData, setApl01FormData] = useState<Apl01FormData | null>(null);

  // Batch Detail Modal State
  const [selectedBatch, setSelectedBatch] = useState<CompletedBatchItem | null>(null);
  const [batchTypeFilter, setBatchTypeFilter] = useState<"Semua" | "Offline" | "Online">("Semua");
  const [batchSearchTerm, setBatchSearchTerm] = useState("");

  // Pleno Detail / Preview Modal State
  const [selectedPleno, setSelectedPleno] = useState<PlenoDetailData | null>(null);
  const [previewPlenoDoc, setPreviewPlenoDoc] = useState<PlenoDetailData | null>(null);

  // ==========================================
  // PENGATURAN BREADCRUMB EXTRA DARI CONTEXT
  // ==========================================
  useEffect(() => {
    if (setExtraCrumbs) {
      if (selectedAsesmen) {
        setExtraCrumbs([{ label: "Detail Asesmen" }]);
      } else if (selectedBatch) {
        setExtraCrumbs([{ label: "Detail Batch" }]);
      } else if (selectedPleno) {
        setExtraCrumbs([{ label: "Detail Sidang Pleno" }]);
      } else {
        setExtraCrumbs([]);
      }
    }

    // Cleanup saat pindah halaman
    return () => {
      if (setExtraCrumbs) {
        setExtraCrumbs([]);
      }
    };
  }, [selectedAsesmen, selectedBatch, selectedPleno, setExtraCrumbs]);

  // Tangkap event breadcrumb klik untuk tutup modal/detail
  useEffect(() => {
    const handleResetModal = () => {
      setSelectedAsesmen(null);
      setSelectedBatch(null);
      setSelectedPleno(null);
      setPreviewForm(null);
      setPreviewPlenoDoc(null);
    };

    window.addEventListener("BREADCRUMB_RESET_MODAL", handleResetModal);
    return () => {
      window.removeEventListener("BREADCRUMB_RESET_MODAL", handleResetModal);
    };
  }, []);

  useEffect(() => {
    fetchHistoryData();
  }, []);

  const fetchHistoryData = async () => {
    setIsLoading(true);
    try {
      const [candidatesData, batchData, plenoData] = await Promise.all([
        getCandidatesList(),
        getJadwalCompleted(),
        getBatchCompleted(),
      ]);

      if (Array.isArray(candidatesData)) {
        const completed = (candidatesData as unknown as CandidateCandidateItem[]).filter(
          (c) =>
            (c.hasilAsesmen && c.hasilAsesmen !== "Belum Dinilai") ||
            c.statusPengajuan === "Selesai" ||
            c.statusPengajuan === "Menunggu Pleno",
        );
        const mapped: AssessmentItem[] = completed.map((c) => ({
          id: c.pengajuanId,
          nik: c.nik || "-",
          nama: c.namaLengkap || c.nik || "Asesi",
          skema: c.namaSkema || "Skema Sertifikasi",
          tipeTuk: (c.tipeTuk || "Sewaktu") as TipeTuk,
          metode: (c.metode || "Online") as JenisMetode,
          skemaId: c.skemaId,
          waktu: c.waktuMulai || "",
          tglAsesmen: c.tanggalJadwal
            ? new Date(c.tanggalJadwal).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })
            : "-",
          hasil: c.hasilAsesmen === "Kompeten" ? "Kompeten" : "Belum Kompeten",
          status: c.statusPengajuan === "Menunggu Pleno" ? "Menunggu Pleno" : "Selesai",
          alamat: c.alamat || "UIN Sunan Gunung Djati Bandung",
          noSkema: c.kodeSkema || "-",
          tuk: c.namaTuk || "Lab Komputer Terpadu",
          metodeAsesmen: (c.metode as JenisMetode) || "Online",
          asesor: c.namaAsesor || "Asesor Penguji",
          asesorReg: c.asesorReg || "",
        }));
        setAssessmentList(mapped);
      } else {
        setAssessmentList([]);
      }

      const batchList = Array.isArray(batchData) ? batchData : (batchData?.data && Array.isArray(batchData.data) ? batchData.data : []);
      const plenoList = Array.isArray(plenoData) ? plenoData : (plenoData?.data && Array.isArray(plenoData.data) ? plenoData.data : []);

      setCompletedBatches(batchList);
      setCompletedPleno(plenoList);
    } catch (error) {
      console.error("Error fetching history data:", error);
      setAssessmentList([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to parse string dates
  const parseDateToISO = (dateStr: string): string => {
    if (!dateStr) return "";
    const trimmed = dateStr.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;

    const months: Record<string, string> = {
      Jan: "01", Feb: "02", Mar: "03", Apr: "04", Mei: "05", Jun: "06",
      Jul: "07", Agt: "08", Sep: "09", Okt: "10", Nov: "11", Des: "12",
      Januari: "01", Februari: "02", Maret: "03", April: "04", Juni: "06",
      Juli: "07", Agustus: "08", September: "09", Oktober: "10", November: "11", Desember: "12",
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
  const filteredAssessments = assessmentList.filter((item: AssessmentItem) => {
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
  const filteredBatches = completedBatches.filter((batch) => {
    const matchType =
      batchTypeFilter === "Semua" || batch.metode === batchTypeFilter;
    const matchSearch =
      batch.kode?.toLowerCase().includes(batchSearchTerm.toLowerCase()) ||
      batch.nama?.toLowerCase().includes(batchSearchTerm.toLowerCase()) ||
      batch.skema?.toLowerCase().includes(batchSearchTerm.toLowerCase()) ||
      batch.asesor?.toLowerCase().includes(batchSearchTerm.toLowerCase());
    return matchType && matchSearch;
  });

  const filteredPleno = completedPleno.filter((pleno) => {
    const matchSearch =
      pleno.batchCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pleno.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pleno.skema?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchSearch;
  });

  // If detail view of individual assessment is open
  useEffect(() => {
    if (selectedAsesmen?.id) {
      setIsLoadingDetails(true);
      Promise.all([
        fetch(`/api/pengajuanskema/${selectedAsesmen.id}/riwayat-asesmen`).then((res) => res.json()),
        getPengajuanDetail(selectedAsesmen.id)
      ])
        .then(([riwayatRes, pengajuanDetail]) => {
          if (riwayatRes.data) {
            setRiwayatDetails(riwayatRes.data);
          }
          if (pengajuanDetail) {
            const dp = pengajuanDetail.dataPribadi as Record<string, unknown> | undefined;
            setApl01FormData({
              isAdmin: true,
              hidePaymentFields: true,
              rekomendasi: pengajuanDetail.rekomendasi || "Diterima",
              catatan: pengajuanDetail.catatan || "",
              statusPembayaran: pengajuanDetail.statusPembayaran || "Sudah",
              sumberAnggaran: pengajuanDetail.sumberAnggaran || "Sumber Anggaran Biaya Mandiri",
              namaAdmin: "Admin LSP",
              ttdAsesi: (dp?.tandaTangan as string) || null,
              namaSkema: pengajuanDetail.skema?.namaSkema || "",
              kodeSkema: pengajuanDetail.skema?.kodeSkema || "",
              tuk: pengajuanDetail.tuk || "",
              tujuan: pengajuanDetail.tujuanAsesmen || "Sertifikasi",
              ...dp,
              schemeDetail: {
                ...pengajuanDetail.skema,
                buktiAdministratif: pengajuanDetail.skema?.master_bukti_administratif || pengajuanDetail.skema?.buktiAdministratif || [],
                persyaratanDasar: pengajuanDetail.skema?.persyaratanDasar || [],
                buktiKompetensi: pengajuanDetail.skema?.buktiKompetensi || [],
              },
              checklist: pengajuanDetail.checklist || {},
              onPreview: (docName: string) => {
                const docs = (pengajuanDetail.dokumen as Array<{ namaDokumen: string; fileUrl: string }>) || [];
                const doc = docs.find((d) => d.namaDokumen === docName);
                if (doc && doc.fileUrl) {
                  window.open(doc.fileUrl, "_blank");
                } else {
                  alert(`File untuk dokumen "${docName}" belum diunggah oleh asesi.`);
                }
              }
            });
          }
        })
        .catch((err) => console.error("Error fetching riwayat details:", err))
        .finally(() => setIsLoadingDetails(false));
    } else {
      setRiwayatDetails([]);
      setApl01FormData(null);
    }
  }, [selectedAsesmen]);

  if (selectedAsesmen) {
    return (
      <div className="space-y-6 pb-24 text-sm text-gray-700">
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
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border shadow-2xs ${selectedAsesmen.hasil === "Kompeten"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : selectedAsesmen.hasil === "Belum Kompeten"
                      ? "bg-red-50 text-red-700 border-red-200"
                      : "bg-slate-100 text-slate-600 border-slate-200"
                    }`}
                >
                  {selectedAsesmen.hasil === "Kompeten" ? (
                    <CheckCircle size={12} />
                  ) : selectedAsesmen.hasil === "Belum Kompeten" ? (
                    <AlertTriangle size={12} />
                  ) : (
                    <Clock size={12} />
                  )}
                  {selectedAsesmen.hasil || "-"}
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border shadow-2xs ${selectedAsesmen.status === "Selesai"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : selectedAsesmen.status === "Terjadwal"
                      ? "bg-amber-50 text-amber-700 border-amber-200"
                      : "bg-slate-50 text-slate-700 border-slate-200"
                    }`}
                >
                  {selectedAsesmen.status === "Selesai" && (
                    <CheckCircle size={12} />
                  )}
                  {selectedAsesmen.status === "Terjadwal" && (
                    <Clock size={12} />
                  )}
                  {selectedAsesmen.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 sm:gap-6 pt-3 border-t border-gray-100">
              <div className="min-w-0">
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-1">
                  Asesor Penguji
                </p>
                <p className="text-slate-800 font-bold text-xs sm:text-sm">
                  {selectedAsesmen.asesor || "Dr. Aris Thorne"}
                </p>
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-1">
                  Tipe TUK
                </p>
                <div className="flex items-center gap-1.5 text-slate-700 font-semibold text-xs sm:text-sm">
                  <MapPin size={14} className="text-slate-400 shrink-0" />
                  {selectedAsesmen.tipeTuk}
                </div>
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-1">
                  Pelaksanaan
                </p>
                <div className="flex items-center gap-1.5 text-slate-700 font-semibold text-xs sm:text-sm">
                  <Building size={14} className="text-slate-400 shrink-0" />
                  {selectedAsesmen.metode}
                </div>
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-1">
                  Tanggal
                </p>
                <div className="flex items-center gap-1.5 text-slate-700 font-semibold text-xs sm:text-sm">
                  <Calendar size={14} className="text-slate-400 shrink-0" />
                  {selectedAsesmen.tglAsesmen}
                </div>
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-1">
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
              {isLoadingDetails ? (
                <div className="text-center py-6 text-slate-500 text-sm font-semibold">
                  Memuat detail berkas...
                </div>
              ) : riwayatDetails.length > 0 ? (
                riwayatDetails.map((detail, idx) => (
                  <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden">
                    <div className="bg-slate-50 p-4 border-b border-slate-200 font-bold text-slate-800 flex items-center justify-between">
                      <span>{detail.form_type} - Dokumen Asesmen</span>
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
                            {detail.form_type.replace(/\./g, "_")}_Signed.pdf
                          </p>
                          <p className="text-xs text-slate-500">
                            Data form telah direkam oleh sistem
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setPreviewForm(detail.form_type as "FR.APL.01" | "FR.APL.02" | "FR.AK.07" | "FR.IA.04A" | "FR.IA.04B" | "FR.IA.07")}
                        className="flex items-center gap-2 px-4 py-2 bg-[#008BE3] hover:bg-[#0076C2] text-white rounded-lg text-sm font-bold transition-colors cursor-pointer"
                      >
                        <Eye size={16} /> Pratinjau
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-slate-500 text-sm font-medium">
                  Belum ada dokumen form asesmen yang tersimpan untuk pengajuan ini.
                </div>
              )}
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
                {(() => {
                  const activeDetail = riwayatDetails.find((d) => d.form_type === previewForm);
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const formData: any = activeDetail?.form_data || {};
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const penilaian: any = activeDetail?.penilaian || {};

                  return (
                    <>
                      {previewForm === "FR.APL.01" && apl01FormData && (
                        <div className="bg-white p-4 rounded-xl shadow-xs border border-gray-100">
                          <EFormApl01
                            formData={apl01FormData}
                            onChange={() => { }}
                          />
                        </div>
                      )}
                      {previewForm === "FR.APL.02" && (
                        <FormFRAPL02
                          asesmenData={{
                            nama: selectedAsesmen.nama,
                            skema: selectedAsesmen.skema,
                            noSkema: selectedAsesmen.noSkema || "-",
                            tipeTuk: selectedAsesmen.tipeTuk,
                            tanggal: selectedAsesmen.tglAsesmen,
                            asesor: selectedAsesmen.asesor || "Dr. Aris Thorne",
                            asesorReg: selectedAsesmen.asesorReg || "-",
                          }}
                          skemaId={selectedAsesmen.skemaId}
                          pengajuanId={selectedAsesmen.id}
                          answers={formData.kompetensi || penilaian}
                          rekomendasi={formData.rekomendasi || "Dapat dilanjutkan"}
                          asesiName={selectedAsesmen.nama}
                          asesiSignature={formData.asesiSignature || selectedAsesmen.nama}
                          asesiDate={formData.asesiDate || selectedAsesmen.tglAsesmen}
                          asesorName={selectedAsesmen.asesor || "Dr. Aris Thorne"}
                          asesorReg={selectedAsesmen.asesorReg || "-"}
                          asesorSignature={formData.asesorSignature || selectedAsesmen.asesor || "Dr. Aris Thorne"}
                          asesorDate={formData.asesorDate || selectedAsesmen.tglAsesmen}
                          readOnly={true}
                        />
                      )}
                      {previewForm === "FR.AK.07" && (
                        <FormFRAK07
                          asesmenData={{
                            nama: selectedAsesmen.nama,
                            skema: selectedAsesmen.skema,
                            noSkema: selectedAsesmen.noSkema || "-",
                            tipeTuk: selectedAsesmen.tipeTuk,
                            tanggal: selectedAsesmen.tglAsesmen,
                            asesor: selectedAsesmen.asesor || "Dr. Aris Thorne",
                            asesorReg: selectedAsesmen.asesorReg || "-",
                          }}
                          potensiAsesi={formData.potensiAsesi}
                          noAdjustment={formData.noAdjustment}
                          adjustments={formData.adjustments}
                          acuanPembanding={formData.acuanPembanding}
                          metodeAsesmen={formData.metodeAsesmen}
                          instrumenAsesmen={formData.instrumenAsesmen}
                          asesiName={selectedAsesmen.nama}
                          asesiSignature={formData.asesiSignature || selectedAsesmen.nama}
                          asesiDate={formData.asesiDate || selectedAsesmen.tglAsesmen}
                          asesorName={selectedAsesmen.asesor || "Dr. Aris Thorne"}
                          asesorSignature={formData.asesorSignature || selectedAsesmen.asesor || "Dr. Aris Thorne"}
                          asesorDate={formData.asesorDate || selectedAsesmen.tglAsesmen}
                          readOnly={true}
                        />
                      )}
                      {previewForm === "FR.IA.04A" && (
                        <FormFRIA04A
                          asesmenData={{
                            nama: selectedAsesmen.nama,
                            skema: selectedAsesmen.skema,
                            noSkema: selectedAsesmen.noSkema || "-",
                            tipeTuk: selectedAsesmen.tipeTuk,
                            tanggal: selectedAsesmen.tglAsesmen,
                            asesor: selectedAsesmen.asesor || "Dr. Aris Thorne",
                            asesorReg: selectedAsesmen.asesorReg || "-",
                          }}
                          umpanBalik={formData.umpanBalik || formData.umpanBalikStep2 || ""}
                          supervisorName={formData.supervisorName || ""}
                          supervisorSignature={formData.supervisorSignature || ""}
                          asesiSignature={formData.asesiSignature || selectedAsesmen.nama}
                          asesorSignature={formData.asesorSignature || selectedAsesmen.asesor || "Dr. Aris Thorne"}
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
                            asesorReg: selectedAsesmen.asesorReg || "-",
                          }}
                          skemaId={selectedAsesmen.skemaId}
                          answers={formData.answers || penilaian}
                          rekomendasi={formData.rekomendasi}
                          asesiName={selectedAsesmen.nama}
                          asesiSignature={formData.asesiSignature || selectedAsesmen.nama}
                          asesiDate={formData.asesiDate || selectedAsesmen.tglAsesmen}
                          asesorName={selectedAsesmen.asesor || "Dr. Aris Thorne"}
                          asesorReg={selectedAsesmen.asesorReg || "-"}
                          asesorSignature={formData.asesorSignature || selectedAsesmen.asesor || "Dr. Aris Thorne"}
                          asesorDate={formData.asesorDate || selectedAsesmen.tglAsesmen}
                          readOnly={true}
                        />
                      )}
                      {previewForm === "FR.IA.07" && (
                        <FormFRIA07
                          asesmenData={{
                            nama: selectedAsesmen.nama,
                            skema: selectedAsesmen.skema,
                            noSkema: selectedAsesmen.noSkema || "-",
                            tipeTuk: selectedAsesmen.tipeTuk,
                            tanggal: selectedAsesmen.tglAsesmen,
                            asesor: selectedAsesmen.asesor || "Dr. Aris Thorne",
                            asesorReg: selectedAsesmen.asesorReg || "-",
                          }}
                          skemaId={selectedAsesmen.skemaId}
                          answers={formData.answers || penilaian}
                          umpanBalik={formData.umpanBalik || formData.umpanBalikStep4 || ""}
                          asesiName={selectedAsesmen.nama}
                          asesiSignature={formData.asesiSignature || selectedAsesmen.nama}
                          asesiDate={formData.asesiDate || selectedAsesmen.tglAsesmen}
                          asesorName={selectedAsesmen.asesor || "Dr. Aris Thorne"}
                          asesorReg={selectedAsesmen.asesorReg || "-"}
                          asesorSignature={formData.asesorSignature || selectedAsesmen.asesor || "Dr. Aris Thorne"}
                          asesorDate={formData.asesorDate || selectedAsesmen.tglAsesmen}
                          readOnly={true}
                        />
                      )}
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24 text-sm text-gray-700">
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
          className={`flex-1 py-2.5 px-4 text-xs md:text-sm font-bold rounded-lg transition-all text-center cursor-pointer ${mainTab === "asesmen"
            ? "bg-[#008BE3] text-white shadow-xs"
            : "text-slate-500 hover:text-slate-800"
            }`}
        >
          Asesmen
        </button>

        <button
          onClick={() => setMainTab("batch")}
          className={`flex-1 py-2.5 px-4 text-xs md:text-sm font-bold rounded-lg transition-all text-center cursor-pointer ${mainTab === "batch"
            ? "bg-[#008BE3] text-white shadow-xs"
            : "text-slate-500 hover:text-slate-800"
            }`}
        >
          Batch
        </button>

        <button
          onClick={() => setMainTab("pleno")}
          className={`flex-1 py-2.5 px-4 text-xs md:text-sm font-bold rounded-lg transition-all text-center cursor-pointer ${mainTab === "pleno"
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
                    className="bg-transparent border-none focus:ring-0 text-[14px] w-full outline-none text-gray-700 placeholder-gray-400 font-semibold"
                  />
                </div>

                <select
                  value={hasilFilter}
                  onChange={(e) => setHasilFilter(e.target.value)}
                  className="bg-gray-50 border border-gray-200/50 text-[14px] rounded-lg px-3 h-10.5 outline-none text-gray-700 cursor-pointer font-bold"
                >
                  <option value="">Semua Hasil</option>
                  <option value="Kompeten">Kompeten</option>
                  <option value="Belum Kompeten">Belum Kompeten</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-gray-50 border border-gray-200/50 text-[14px] rounded-lg px-3 h-10.5 outline-none text-gray-700 cursor-pointer font-bold"
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
                    className="bg-transparent border-none focus:ring-0 text-[14px] w-full outline-none text-gray-700 cursor-pointer font-semibold"
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
                    <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider whitespace-nowrap">
                      Nama Asesi
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider whitespace-nowrap">
                      Skema Sertifikasi
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider whitespace-nowrap">
                      Asesor Penguji
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider whitespace-nowrap">
                      TUK
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider whitespace-nowrap">
                      Metode
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider whitespace-nowrap">
                      Tanggal
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider whitespace-nowrap">
                      Waktu
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider whitespace-nowrap">
                      Hasil
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider whitespace-nowrap">
                      Status
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-center whitespace-nowrap w-36 sticky right-0 bg-[#0F172A] z-20 border-l border-white/10 shadow-[-6px_0_15px_-4px_rgba(0,0,0,0.06)]">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="font-medium text-xs sm:text-sm divide-y divide-gray-100">
                  {isLoading ? (
                    <tr>
                      <td colSpan={9} className="px-6 py-16 text-center text-slate-400">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <div className="w-8 h-8 border-4 border-[#008BE3] border-t-transparent rounded-full animate-spin"></div>
                          <span className="font-medium text-sm text-slate-500">
                            Memuat riwayat asesmen...
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : filteredAssessments.length > 0 ? (
                    filteredAssessments.map((item: AssessmentItem) => (
                      <tr
                        key={item.id}
                        className="group/row hover:bg-[#F9FAFC] transition-colors"
                      >
                        <td className="px-6 py-4 text-[14px] text-slate-800 font-bold whitespace-nowrap">
                          {item.nama}
                        </td>
                        <td className="px-6 py-4 text-[14px] text-slate-800 font-semibold whitespace-nowrap">
                          {item.skema}
                        </td>
                        <td className="px-6 py-4 text-[14px] text-slate-600 font-medium whitespace-nowrap">
                          {item.asesor || "Dr. Aris Thorne"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${item.tipeTuk === "Sewaktu"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : item.tipeTuk === "Tempat Kerja"
                                ? "bg-purple-50 text-purple-700 border-purple-200"
                                : "bg-orange-50 text-orange-700 border-orange-200"
                              }`}
                          >
                            {item.tipeTuk}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-[11px] text-slate-500 font-medium bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                            {item.metode}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-slate-700 font-medium text-[14px]">
                            {item.tglAsesmen}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-[11px] text-slate-400 font-semibold">
                            {item.waktu}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${item.hasil === "Kompeten"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : item.hasil === "Belum Kompeten"
                                ? "bg-red-50 text-red-700 border-red-200"
                                : "bg-slate-100 text-slate-600 border-slate-200"
                              }`}
                          >
                            {item.hasil === "Kompeten" ? (
                              <CheckCircle size={12} />
                            ) : item.hasil === "Belum Kompeten" ? (
                              <AlertTriangle size={12} />
                            ) : (
                              <Clock size={12} />
                            )}
                            {item.hasil || "-"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${item.status === "Selesai"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                              }`}
                          >
                            <CheckCircle size={12} /> {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center bg-white group-hover/row:bg-[#F9FAFC] border-l border-gray-100 sticky right-0 z-10">
                          <button
                            onClick={() => setSelectedAsesmen(item)}
                            className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-3 py-1.5 rounded-lg font-bold text-[12px] shadow-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                          >
                            <FileText size={14} className="text-[#008BE3]" />{" "}
                            Detail
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="px-6 py-16 text-center">
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
                      className="bg-transparent border-none focus:ring-0 text-[14px] w-full outline-none text-slate-800 placeholder-gray-400 font-medium"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto relative">
                  <table className="w-full text-left border-collapse min-w-175">
                    <thead>
                      <tr className="bg-[#0F172A] border-b border-[#0F172A]">
                        <th className="px-4 py-4 text-xs font-bold text-white/90 uppercase tracking-wider w-12 text-center">
                          No
                        </th>
                        <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider">
                          Nama Asesi &amp; NIK
                        </th>
                        <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider">
                          Hasil Asesmen
                        </th>
                        <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider">
                          Status Asesmen
                        </th>
                        <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-center sticky right-0 bg-[#0F172A] z-10 w-32 border-l border-white/10">
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
                            <td className="px-4 py-4 text-center font-bold text-[14px] text-slate-500">
                              {idx + 1}
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-[14px] font-bold text-slate-900">
                                {asesi.nama}
                              </div>
                              <div className="text-[12px] text-slate-500 font-mono font-medium">
                                NIK: {asesi.nik}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${asesi.hasil === "Kompeten"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : asesi.hasil === "Belum Kompeten"
                                    ? "bg-red-50 text-red-700 border-red-200"
                                    : "bg-slate-100 text-slate-600 border-slate-200"
                                  }`}
                              >
                                {asesi.hasil === "Kompeten" ? (
                                  <CheckCircle size={12} />
                                ) : asesi.hasil === "Belum Kompeten" ? (
                                  <AlertTriangle size={12} />
                                ) : (
                                  <Clock size={12} />
                                )}
                                {asesi.hasil || "-"}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border bg-emerald-50 text-emerald-700 border-emerald-200">
                                <CheckCircle size={12} /> Selesai
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center sticky right-0 bg-white group-hover:bg-slate-50/80 border-l border-gray-100">
                              <button
                                onClick={() => {
                                  const found = assessmentList.find(
                                    (a: AssessmentItem) =>
                                      a.nama?.toLowerCase() ===
                                      asesi.nama.toLowerCase(),
                                  ) || {
                                    id: 999,
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
                                  setSelectedAsesmen({
                                    ...found,
                                    noSkema: selectedBatch.noSkema,
                                    asesorReg: selectedBatch.asesorReg,
                                    skema: selectedBatch.skema,
                                    asesor: selectedBatch.asesor,
                                  });
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
                      Semua Batch ({completedBatches.length})
                    </option>
                    <option value="Offline">
                      Offline Batch (
                      {
                        completedBatches.filter(
                          (b) => b.metode.toLowerCase() === "offline",
                        ).length
                      }
                      )
                    </option>
                    <option value="Online">
                      Online Batch (
                      {
                        completedBatches.filter(
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
                    className="bg-transparent border-none focus:ring-0 text-[14px] w-full outline-none text-slate-800 placeholder-gray-400 font-medium"
                  />
                </div>
              </div>

              {/* BATCH GRID CARDS */}
              {isLoading ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 font-medium shadow-2xs">
                  Memuat data batch...
                </div>
              ) : filteredBatches.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBatches.map((batch) => {
                    const isOnline = batch.metode.toLowerCase() === "online";

                    return (
                      <div
                        key={batch.id}
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
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border bg-emerald-50 text-emerald-700 border-emerald-200">
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
      )}
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
                    className="bg-transparent border-none focus:ring-0 text-[14px] w-full outline-none text-gray-700 placeholder-gray-400 font-medium"
                  />
                </div>
              </div>

              <div className="overflow-x-auto relative">
                <table className="w-full text-left border-collapse min-w-225">
                  <thead>
                    <tr className="bg-[#0F172A] border-b border-[#0F172A]">
                      <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider whitespace-nowrap">
                        Nama Sidang Pleno
                      </th>

                      <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider whitespace-nowrap">
                        Tanggal
                      </th>

                      <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider whitespace-nowrap">
                        Alamat
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider whitespace-nowrap text-center">
                        Jumlah Asesi
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider whitespace-nowrap">
                        Status
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-center whitespace-nowrap w-32 sticky right-0 bg-[#0F172A] z-20 border-l border-white/10 shadow-[-6px_0_15px_-4px_rgba(0,0,0,0.06)]">
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
                            <div className="text-[14px] font-bold text-slate-900 group-hover/row:text-[#008BE3] transition-colors leading-snug">
                              {item.title || `Sidang Pleno ${item.skema}`}
                            </div>
                            {item.skema && (
                              <div className="text-xs text-slate-500 font-medium mt-0.5 truncate max-w-62.5">
                                {item.skema}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-1.5 text-[14px] font-bold text-slate-800">
                              <Calendar size={13} className="text-[#008BE3]" />
                              {item.tanggal}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-start gap-1.5 text-[14px] font-medium text-slate-700">
                              <MapPin
                                size={13}
                                className="text-[#008BE3] shrink-0 mt-0.5"
                              />
                              <div>
                                <span className="truncate max-w-50 block">
                                  {item.alamat}
                                </span>
                                {item.alamat && item.alamat !== "-" && !item.alamat.toLowerCase().includes("online") && (
                                  <span className="text-[10px] text-gray-400 block mt-0.5">Gedung Rektorat Lt. 1, Jl. AH. Nasution No.105</span>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4 text-center whitespace-nowrap">
                            <span className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-full font-bold text-[11px] inline-flex items-center gap-1">
                              <Users size={12} className="text-[#008BE3]" />
                              {item.asesiList?.length || 0} Asesi
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 border bg-teal-50 text-teal-700 border-teal-200">
                              <CheckCircle size={12} className="stroke-[2.5]" />
                              Selesai
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center whitespace-nowrap bg-white group-hover/row:bg-[#F9FAFC] border-l border-gray-100 sticky right-0 z-10">
                            <button
                              onClick={() => setSelectedPleno(item)}
                              className="px-3 py-1.5 text-xs font-bold text-[#008BE3] bg-sky-50 hover:bg-[#008BE3] hover:text-white border border-sky-200 rounded-lg transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-2xs"
                            >
                              <Eye size={14} />
                              <span>Detail</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={10} className="px-6 py-16 text-center">
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

              {/* Header Sidang Pleno with Back Button & Title */}
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 min-w-0">
                  <button
                    onClick={() => setSelectedPleno(null)}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-[#008BE3] bg-[#008BE3]/10 hover:bg-[#008BE3]/20 transition-colors cursor-pointer shrink-0"
                    title="Kembali ke Daftar Pleno"
                  >
                    <ArrowLeft size={18} />
                  </button>

                  <div className="min-w-0">
                    <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none mb-1 truncate">
                      Detail Sidang Pleno
                    </h2>
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border bg-emerald-50 text-emerald-700 border-emerald-200"
                    >
                      <CheckCircle size={12} />
                      Status: Selesai
                    </span>
                  </div>
                </div>
              </div>

              {/* Section 1: Informasi Keputusan & Jadwal Sidang */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Scale size={20} className="text-[#008BE3]" />
                  </div>
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                    Informasi Keputusan & Jadwal Sidang
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                      Nama Sidang
                    </label>
                    <input
                      type="text"
                      value={selectedPleno.title || "-"}
                      readOnly
                      disabled
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-[13px] font-bold text-slate-800 bg-slate-50 cursor-not-allowed outline-none select-none truncate"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                      Tanggal Pelaksanaan
                    </label>
                    <input
                      type="text"
                      value={selectedPleno.tanggal || "-"}
                      readOnly
                      disabled
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-[13px] font-bold text-slate-800 bg-slate-50 cursor-not-allowed outline-none select-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                      TUK
                    </label>
                    <input
                      type="text"
                      value={selectedPleno.alamat || "-"}
                      readOnly
                      disabled
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-[13px] font-bold text-slate-800 bg-slate-50 cursor-not-allowed outline-none select-none"
                    />
                  </div>
                </div>

                {/* Peserta Sidang */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                    Peserta Sidang (Direktur, Pengarah &amp; Komite)
                  </label>
                  <div className="p-3.5 bg-slate-50/50 border border-slate-200/80 rounded-xl min-h-13 flex flex-wrap gap-2 items-center">
                    {(() => {
                      const attendees =
                        selectedPleno.plenoAttendees &&
                          selectedPleno.plenoAttendees.length > 0
                          ? selectedPleno.plenoAttendees.filter(
                            (a: { nama: string, role: string }) => a.nama.trim() !== "" && a.role !== "direktur",
                          )
                          : [
                            { role: "direktur", nama: "Prof. Dr. H. Ahmad" },
                            {
                              role: "dewan_pengarah",
                              nama: "Dr. Ir. H. Muhammad Zulkifli, M.T.",
                            },
                            {
                              role: "komite_skema",
                              nama: "Asep Abdul Sahid, M.T.",
                            },
                          ];
                      return attendees.map((att: { nama: string, role: string }, idx: number) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs shadow-sm hover:border-[#008BE3]/30 transition-colors"
                        >
                          <span className="text-[#008BE3] font-bold uppercase tracking-wider text-[10px] bg-blue-50 px-1.5 py-0.5 rounded-md">
                            {att.role}
                          </span>
                          <span className="font-bold text-[12px]">{att.nama}</span>
                        </span>
                      ));
                    })()}
                  </div>
                </div>
              </div>

              {/* Section 2: 3 Link Surat Dokumen Keputusan */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3 text-slate-800">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Link2 size={20} className="text-[#008BE3]" />
                    </div>
                    <span className="text-sm font-black uppercase tracking-wider">
                      Dokumen Keputusan & Surat Hasil Pleno
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#008BE3] bg-blue-50 px-3.5 py-1.5 rounded-lg border border-blue-100/50 shrink-0">
                    Dokumen Penetapan Resmi
                  </span>
                </div>

                <div className="space-y-4">
                  {/* Field 1: Link Surat Berita Acara Pleno */}
                  <div className="flex flex-col md:flex-row items-stretch md:items-end gap-3 p-4 bg-slate-50/80 rounded-xl border border-slate-200/80">
                    <div className="flex-1 space-y-1.5">
                      <label className="block text-[12px] font-bold text-slate-700">
                        <span>
                          1. Link Surat Berita Acara Pleno{" "}
                          <span className="text-slate-400 font-normal">
                            (URL Google Drive)
                          </span>
                        </span>
                      </label>
                      <input
                        type="url"
                        readOnly
                        value={selectedPleno.linkSuratBeritaPleno || ""}
                        placeholder="Belum ada link surat"
                        className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-[13px] font-semibold text-slate-800 transition-all bg-slate-100/80 cursor-not-allowed outline-none select-none"
                      />
                    </div>
                    <div className="shrink-0 flex items-center gap-2 justify-end">
                      {selectedPleno.linkSuratBeritaPleno ? (
                        <a
                          href={selectedPleno.linkSuratBeritaPleno}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-xl bg-[#008BE3] hover:bg-[#0076C2] text-white flex items-center justify-center transition-all cursor-pointer shadow-2xs shrink-0"
                          title="Buka Link Surat Berita Acara Pleno"
                        >
                          <ExternalLink size={16} />
                        </a>
                      ) : (
                        <span className="px-3 py-2 rounded-xl font-bold text-xs bg-slate-100 text-slate-400 border border-slate-200 flex items-center justify-center">
                          Belum Ada Link
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Field 2: Link Surat Keputusan Direktur */}
                  <div className="flex flex-col md:flex-row items-stretch md:items-end gap-3 p-4 bg-slate-50/80 rounded-xl border border-slate-200/80">
                    <div className="flex-1 space-y-1.5">
                      <label className="block text-[12px] font-bold text-slate-700">
                        <span>
                          2. Link Surat Keputusan Direktur{" "}
                          <span className="text-slate-400 font-normal">
                            (URL Google Drive)
                          </span>
                        </span>
                      </label>
                      <input
                        type="url"
                        readOnly
                        value={selectedPleno.linkSuratKeputusanDirektur || selectedPleno.linkSuratHasil || ""}
                        placeholder="Belum ada link surat"
                        className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-[13px] font-semibold text-slate-800 transition-all bg-slate-100/80 cursor-not-allowed outline-none select-none"
                      />
                    </div>
                    <div className="shrink-0 flex items-center gap-2 justify-end">
                      {selectedPleno.linkSuratKeputusanDirektur || selectedPleno.linkSuratHasil ? (
                        <a
                          href={selectedPleno.linkSuratKeputusanDirektur || selectedPleno.linkSuratHasil}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-xl bg-[#008BE3] hover:bg-[#0076C2] text-white flex items-center justify-center transition-all cursor-pointer shadow-2xs shrink-0"
                          title="Buka Link Surat Keputusan Direktur"
                        >
                          <ExternalLink size={16} />
                        </a>
                      ) : (
                        <span className="px-3 py-2 rounded-xl font-bold text-xs bg-slate-100 text-slate-400 border border-slate-200 flex items-center justify-center">
                          Belum Ada Link
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Field 3: Link Surat Blanko BNSP */}
                  <div className="flex flex-col md:flex-row items-stretch md:items-end gap-3 p-4 bg-slate-50/80 rounded-xl border border-slate-200/80">
                    <div className="flex-1 space-y-1.5">
                      <label className="block text-[12px] font-bold text-slate-700">
                        <span>
                          3. Link Surat Blanko BNSP{" "}
                          <span className="text-slate-400 font-normal">
                            (URL Google Drive)
                          </span>
                        </span>
                      </label>
                      <input
                        type="url"
                        readOnly
                        value={selectedPleno.linkSuratBlankoBNSP || ""}
                        placeholder="Belum ada link surat"
                        className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-[13px] font-semibold text-slate-800 transition-all bg-slate-100/80 cursor-not-allowed outline-none select-none"
                      />
                    </div>
                    <div className="shrink-0 flex items-center gap-2 justify-end">
                      {selectedPleno.linkSuratBlankoBNSP ? (
                        <a
                          href={selectedPleno.linkSuratBlankoBNSP}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-xl bg-[#008BE3] hover:bg-[#0076C2] text-white flex items-center justify-center transition-all cursor-pointer shadow-2xs shrink-0"
                          title="Buka Link Surat Blanko BNSP"
                        >
                          <ExternalLink size={16} />
                        </a>
                      ) : (
                        <span className="px-3 py-2 rounded-xl font-bold text-xs bg-slate-100 text-slate-400 border border-slate-200 flex items-center justify-center">
                          Belum Ada Link
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: TABEL ASESI & PERUBAHAN STATUS K / BK */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-5 p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg shrink-0">
                      <Users size={20} className="text-[#008BE3]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                        Daftar Asesi & Penetapan Status Kelulusan
                      </h3>
                      <p className="text-xs text-slate-500 font-medium mt-1">
                        Ubah status hasil pleno Kompeten atau Belum Kompeten untuk
                        setiap asesi yang didaftarkan.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold flex items-center gap-2">
                      <CheckCircle size={14} />
                      K:{" "}
                      {selectedPleno.asesiList?.filter(
                        (a: AsesiPlenoItem | string | number) =>
                          typeof a === "object" && a !== null && a.statusPleno === "K"
                      ).length || 0}
                    </span>
                    <span className="px-3 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold flex items-center gap-2">
                      <XCircle size={14} />
                      BK:{" "}
                      {selectedPleno.asesiList?.filter(
                        (a: AsesiPlenoItem | string | number) =>
                          typeof a === "object" && a !== null && a.statusPleno === "BK"
                      ).length || 0}
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto relative">
                  <table className="w-full text-left border-collapse min-w-175">
                    <thead>
                      <tr className="bg-[#0F172A] border-b border-[#0F172A]">
                        <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-left whitespace-nowrap text-white/90 sticky top-0 z-20 bg-[#0F172A]">
                          No
                        </th>
                        <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-left whitespace-nowrap text-white/90 sticky top-0 z-20 bg-[#0F172A]">
                          Skema
                        </th>
                        <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-left whitespace-nowrap text-white/90 sticky top-0 z-20 bg-[#0F172A]">
                          Nama Asesi
                        </th>
                        <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-left whitespace-nowrap text-white/90 sticky top-0 z-20 bg-[#0F172A]">
                          Asesor Penguji
                        </th>
                        <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-center whitespace-nowrap text-white/90 sticky top-0 z-20 bg-[#0F172A]">
                          Rekomendasi Asesor
                        </th>
                        <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-center whitespace-nowrap text-white/90 sticky top-0 z-20 bg-[#0F172A]">
                          Status Sidang Pleno
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(selectedPleno.asesiList || []).map(
                        (
                          asesiItem: AsesiPlenoItem | string | number,
                          idx: number,
                        ) => {
                          const asesi: AsesiPlenoItem =
                            typeof asesiItem === "string" ||
                              typeof asesiItem === "number"
                              ? {
                                id: idx + 1,
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
                              className="group/row hover:bg-[#F9FAFC] transition-colors"
                            >
                              <td className="px-4 py-3 text-[14px] font-medium text-slate-700">
                                {idx + 1}
                              </td>
                              <td className="px-4 py-3 text-[14px] font-medium text-slate-700">
                                {asesi.skema || selectedPleno.skema}
                              </td>
                              <td className="px-4 py-3 text-[14px] font-medium text-slate-900 group-hover/row:text-[#008BE3] transition-colors">
                                {asesi.nama}
                              </td>
                              <td className="px-4 py-3 text-[14px] font-medium text-slate-600">
                                {asesi.asesor}
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span
                                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${asesi.rekomendasiAsesor === "K"
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : "bg-red-50 text-red-700 border-red-200"
                                    }`}
                                >
                                  {asesi.rekomendasiAsesor === "K"
                                    ? "Kompeten"
                                    : "Belum Kompeten"}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span
                                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${asesi.statusPleno === "K"
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : "bg-red-50 text-red-700 border-red-200"
                                    }`}
                                >
                                  {asesi.statusPleno === "K"
                                    ? "Kompeten"
                                    : "Belum Kompeten"}
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