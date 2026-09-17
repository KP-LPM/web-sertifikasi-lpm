"use client";
import React, { useState, useEffect } from "react";
import {
  Search,
  ArrowLeft,
  CheckCircle,
  Clock,
  Calendar,
  Building,
  MapPin,
  FileText,
  Eye,
  ShieldCheck,
  AlertCircle,
  XCircle,
  X,
  Scale,
  Video,
  Building2,
} from "lucide-react";
import { useAppContext } from "@/context/context";
import { AssessmentItem, HasilAsesmen } from "@/types/types";
import {
  FormFRIA04A,
  FormFRIA04B,
  FormFRIA07,
} from "@/components/forms";
import { getBandingList, verifikasiBanding, getRiwayatAsesmen } from "@/lib/api";

interface BackendBandingRecord {
  id: number;
  tanggal_pengajuan?: string;
  status?: string;
  status_banding?: string;
  alasan?: string;
  penjelasan?: string;
  dijelaskan?: boolean;
  didiskusikan?: boolean;
  melibatkanOrangLain?: boolean;
  hasil_asesmen?: {
    hasil?: string;
    pengajuan_id?: number;
    pengajuan_skema?: {
      id?: number;
      dataPribadi?: {
        namaLengkap?: string;
        nik?: string;
      };
      user?: {
        username?: string;
      };
      skema?: {
        id?: number;
        namaSkema?: string;
        kodeSkema?: string;
      };
    };
    jadwal_asesmen?: {
      tipe_tuk?: string;
      metode?: string;
      alamat?: string;
    };
  };
}

export default function VerifikasiBanding() {
  const [mode, setMode] = useState<"list" | "detail">("list");
  const { setSelectedAsesmen, selectedAsesmen } = useAppContext();

  const handleVerify = (item: AssessmentItem) => {
    setSelectedAsesmen(item);
    setMode("detail");
  };

  const handleBack = () => {
    setSelectedAsesmen(null);
    setMode("list");
  };

  if (mode === "detail" && selectedAsesmen) {
    return <DetailVerifikasiBanding onBack={handleBack} />;
  }

  return <VerifikasiBandingList onVerify={handleVerify} />;
}

function VerifikasiBandingList({
  onVerify,
}: {
  onVerify: (item: AssessmentItem) => void;
}) {
  const { AssessmentItems } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [displayedCount, setDisplayedCount] = useState(10);
  const [realBandingItems, setRealBandingItems] = useState<AssessmentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadBanding() {
      try {
        setIsLoading(true);
        const res = await getBandingList();
        if (Array.isArray(res) && res.length > 0) {
          const mapped: AssessmentItem[] = (res as unknown as BackendBandingRecord[]).map((item) => {
            const pengajuan = item.hasil_asesmen?.pengajuan_skema;
            const jadwal = item.hasil_asesmen?.jadwal_asesmen;
            const asesiName =
              pengajuan?.dataPribadi?.namaLengkap ||
              pengajuan?.user?.username ||
              "Asesi";
            const skemaName =
              pengajuan?.skema?.namaSkema || "Skema Asesmen";
            const tgl = item.tanggal_pengajuan
              ? new Date(item.tanggal_pengajuan).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : "-";

            return {
              id: item.id,
              nik: pengajuan?.dataPribadi?.nik || "",
              nama: asesiName,
              skema: skemaName,
              hasil: (item.hasil_asesmen?.hasil || "Belum Kompeten") as HasilAsesmen,
              isBanding: true,
              statusBanding: item.status || "Menunggu Verifikasi",
              tglAsesmen: tgl,
              waktu: "08:00 WIB",
              metode: jadwal?.tipe_tuk === "Online" ? "Online" : "Offline",
              tipeTuk: jadwal?.tipe_tuk || "Sewaktu",
              alamat: jadwal?.alamat || "TUK Terdaftar",
              catatan: item.penjelasan || item.alasan || "",
              alasanBanding: item.alasan,
              bandingId: item.id,
              pengajuanId: item.hasil_asesmen?.pengajuan_id || pengajuan?.id,
              skemaId: pengajuan?.skema?.id,
            } as AssessmentItem & { bandingId?: number; alasanBanding?: string; pengajuanId?: number; skemaId?: number };
          });
          setRealBandingItems(mapped);
        }
      } catch (err) {
        console.error("Gagal memuat daftar banding:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadBanding();
  }, []);

  // Filter only AssessmentItems that are 'Belum Kompeten' and have been appealed by Asesi
  const sourceAssessments =
    realBandingItems.length > 0
      ? realBandingItems
      : AssessmentItems.filter(
          (item) => item.hasil === "Belum Kompeten" && item.isBanding,
        );

  const filteredAssessments = sourceAssessments.filter((item) => {
    const matchesSearch =
      (item.nama || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.skema || "").toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const displayedAssessments = filteredAssessments.slice(0, displayedCount);

  const handleLoadMore = () => {
    setDisplayedCount((prev) => prev + 10);
  };

  return (
    <div className="space-y-6 pb-24 text-sm text-gray-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center text-[#008BE3] border border-sky-100 shrink-0 shadow-2xs">
            <Scale size={24} className="stroke-[2.5]" />
          </div>
          <div className="min-w-0">
            <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">
              Verifikasi Banding
            </h2>
            <p className="text-[10px] sm:text-xs text-gray-400 font-bold tracking-wider uppercase leading-4">
              Tinjau dan verifikasi pengajuan banding asesmen dari asesi.
            </p>
          </div>
        </div>
      </div>

      {/* Table Section with Filter */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col">
        {/* Table Toolbar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50/50">
          <div className="relative w-full md:max-w-md">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Cari nama asesi atau skema..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-white focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3] outline-none text-xs sm:text-sm transition-all placeholder:text-slate-400"
            />
          </div>
        </div>
        <div className="overflow-x-auto relative">
          <table className="w-full text-left border-collapse min-w-162.5 sm:min-w-200">
            <thead>
              <tr className="bg-[#0F172A] border-b border-[#0F172A]">
                <th className="px-2.5 sm:px-6 py-2.5 sm:py-4 text-[10px] sm:text-xs font-bold text-white/90 uppercase tracking-wider text-center w-16 whitespace-nowrap">
                  No
                </th>
                <th className="px-2.5 sm:px-6 py-2.5 sm:py-4 text-[10px] sm:text-xs font-bold text-white/90 uppercase tracking-wider whitespace-nowrap min-w-50 sm:w-[30%]">
                  Nama Asesi
                </th>
                <th className="px-2.5 sm:px-6 py-2.5 sm:py-4 text-[10px] sm:text-xs font-bold text-white/90 uppercase tracking-wider whitespace-nowrap">
                  TUK
                </th>
                <th className="px-2.5 sm:px-6 py-2.5 sm:py-4 text-[10px] sm:text-xs font-bold text-white/90 uppercase tracking-wider whitespace-nowrap">
                  Skema
                </th>
                <th className="px-2.5 sm:px-6 py-2.5 sm:py-4 text-[10px] sm:text-xs font-bold text-white/90 uppercase tracking-wider text-center whitespace-nowrap">
                  Status Banding
                </th>
                <th className="px-2.5 sm:px-6 py-2.5 sm:py-4 text-[10px] sm:text-xs font-bold text-white/90 uppercase tracking-wider text-center sticky right-0 bg-[#0F172A] z-10 border-l border-white/10 whitespace-nowrap">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="font-medium text-xs sm:text-sm divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-gray-500 font-semibold text-xs">
                    Memuat daftar banding...
                  </td>
                </tr>
              ) : displayedAssessments.length > 0 ? (
                displayedAssessments.map((item, idx) => (
                  <tr
                    key={item.id}
                    className="group/row hover:bg-[#F9FAFC] transition-colors"
                  >
                    <td className="px-2.5 sm:px-6 py-2 sm:py-4 text-[11px] sm:text-sm font-medium text-slate-700 whitespace-nowrap">
                      <div
                        className={`mx-auto w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-xs font-bold text-xs ${
                          idx % 3 === 0
                            ? "bg-[#008BE3]/10 text-[#008BE3]"
                            : idx % 3 === 1
                              ? "bg-[#84CC16]/10 text-[#73B412]"
                              : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {idx + 1}
                      </div>
                    </td>
                    <td className="px-2.5 sm:px-6 py-2 sm:py-4 text-[11px] sm:text-sm font-bold text-slate-900 whitespace-nowrap">
                      {item.nama}
                    </td>
                    <td className="px-2.5 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider border ${
                          item.tipeTuk === "Sewaktu"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : item.tipeTuk === "Tempat Kerja"
                              ? "bg-purple-50 text-purple-700 border-purple-200"
                              : "bg-orange-50 text-orange-700 border-orange-200"
                        }`}
                      >
                        {item.tipeTuk}
                      </span>
                    </td>
                    <td className="px-2.5 sm:px-6 py-2 sm:py-4 text-[11px] sm:text-sm font-bold text-[#008BE3] whitespace-nowrap">
                      {item.skema}
                    </td>
                    <td className="px-2.5 sm:px-6 py-2 sm:py-4 text-center whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        item.statusBanding === 'Disetujui' || item.status === 'Disetujui'
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : item.statusBanding === 'Ditolak' || item.status === 'Ditolak'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                      }`}> {item.statusBanding || item.status || 'Menunggu'} </span>
                    </td>
                    <td className="px-2.5 sm:px-4 py-2 sm:py-4 whitespace-nowrap text-center bg-white group-hover/row:bg-[#F9FAFC] border-l border-gray-100 sticky right-0 z-10">
                      <div className="flex justify-center">
                        {item.statusBanding === 'Disetujui' || item.status === 'Disetujui' || item.statusBanding === 'Ditolak' || item.status === 'Ditolak' ? (
                          <button
                            onClick={() => onVerify(item)}
                            className="bg-green-50 border border-green-200 text-green-700 hover:bg-green-100 px-2.5 sm:px-4 py-1 sm:py-2 rounded-lg font-bold text-[10px] sm:text-xs shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Eye size={12} /> Lihat Detail
                          </button>
                        ) : (
                          <button
                            onClick={() => onVerify(item)}
                            className="bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 px-2.5 sm:px-4 py-1 sm:py-2 rounded-lg font-bold text-[10px] sm:text-xs shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <ShieldCheck size={12} /> Verifikasi Banding
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-16 text-center text-gray-400"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Search
                        className="w-12 h-12 text-gray-300"
                        strokeWidth={1.5}
                      />
                      <span>Tidak ada data pengajuan banding asesmen.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs font-bold text-gray-500">
            Menampilkan {displayedAssessments.length} dari{" "}
            {filteredAssessments.length} asesmen
          </span>
          {displayedCount < filteredAssessments.length && (
            <button
              onClick={handleLoadMore}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-gray-50 hover:text-[#008BE3] transition-colors shadow-xs flex items-center gap-2"
            >
              Muat Lebih Banyak
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailVerifikasiBanding({ onBack }: { onBack: () => void }) {
  const { selectedAsesmen, setSelectedAsesmen, updateAssessmentItem, showNotification } =
    useAppContext();
  const [catatanBaru, setCatatanBaru] = useState("");
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const [previewForm, setPreviewForm] = useState<string | null>(null);
  interface PenyusunValidatorItem {
    nama: string;
    noReg: string;
    tandaTangan?: string;
    noMet: string;
    ttdTanggal: string;
  }
  interface QuestionItem {
    id: string;
    skenario: string;
    pertanyaan: string;
    elemen: string;
    kunci: string;
  }
  interface AnswerItem {
    answer: string;
    achievement: boolean | null;
  }
  interface RiwayatFormData {
    umpanBalik?: string;
    penyusun?: PenyusunValidatorItem[];
    validator?: PenyusunValidatorItem[];
    questions?: QuestionItem[];
    step3Questions?: QuestionItem[];
    answers?: Record<string, AnswerItem>;
    step3Answers?: Record<string, AnswerItem>;
    rekomendasi?: string;
    step4Questions?: QuestionItem[];
    step4Answers?: Record<string, AnswerItem>;
    [key: string]: unknown;
  }

  interface RiwayatItem {
    form_type: string;
    form_data: RiwayatFormData;
    [key: string]: unknown;
  }

  const [riwayatData, setRiwayatData] = useState<RiwayatItem[]>([]);

  useEffect(() => {
    async function loadRiwayat() {
      if (!selectedAsesmen) return;
      const targetId = Number(
        (selectedAsesmen as AssessmentItem & { pengajuanId?: number }).pengajuanId ||
          (selectedAsesmen as AssessmentItem & { bandingId?: number }).bandingId ||
          selectedAsesmen.id
      );
      if (!targetId) return;
      try {
        const data = await getRiwayatAsesmen(targetId);
        if (Array.isArray(data)) setRiwayatData(data);
      } catch (err) {
        console.error("Gagal memuat riwayat", err);
      }
    }
    loadRiwayat();
  }, [selectedAsesmen]);

  if (!selectedAsesmen) return null;

  const handleSubmit = async (action: "approve" | "reject") => {
    if (!selectedAsesmen) return;
    if (!catatanBaru.trim()) {
      showNotification("Catatan asesor tidak boleh kosong", "error");
      return;
    }
    setLoadingSubmit(true);

    try {
      const targetBandingId = Number(
        (selectedAsesmen as AssessmentItem & { bandingId?: number }).bandingId ||
          selectedAsesmen.id,
      );
      if (targetBandingId) {
        await verifikasiBanding(targetBandingId, {
          status: action === "approve" ? "Disetujui" : "Ditolak",
          keputusanAdmin: catatanBaru.trim(),
        });
      }

      const updatedData =
        action === "approve"
          ? {
              hasil: "Kompeten" as HasilAsesmen,
              isBanding: false,
              statusBanding: "Disetujui" as string,
              catatanAsesor: catatanBaru.trim(),
            }
          : {
              hasil: "Belum Kompeten" as HasilAsesmen,
              isBanding: false,
              statusBanding: "Ditolak" as string,
              catatanAsesor: catatanBaru.trim(),
            };

      updateAssessmentItem(selectedAsesmen.id, updatedData);
      setSelectedAsesmen({ ...selectedAsesmen, ...updatedData });
      setLoadingSubmit(false);

      const actionText = action === "approve" ? "Banding Disetujui" : "Banding Ditolak";
      showNotification(
        `Status & keputusan banding berhasil diperbarui: ${actionText}`,
        "success",
      );

      setTimeout(() => {
        onBack();
      }, 1200);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memverifikasi banding";
      showNotification(msg, "error");
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FC]">
      <div className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden">
        {/* Banner/Header Info */}
        <div className="p-4 sm:p-6 border-b border-gray-100 space-y-5">
          {/* Top Title & Badge Row */}
          <div className="flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={onBack}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-[#008BE3] bg-[#008BE3]/10 hover:bg-[#008BE3]/20 transition-colors cursor-pointer shrink-0"
                title="Kembali"
              >
                <ArrowLeft size={18} />
              </button>
              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="text-lg md:text-xl font-black text-slate-900">
                    {selectedAsesmen.nama}
                  </h3>
                  {selectedAsesmen.metode?.toLowerCase() === "online" ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
                      <Video size={13} /> Online
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <Building2 size={13} /> Offline
                    </span>
                  )}
                </div>
                <p className="text-xs md:text-sm text-slate-600 font-semibold">
                  Skema: {selectedAsesmen.skema}
                </p>
              </div>
            </div>

            <div className="shrink-0">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shadow-2xs ${
                  selectedAsesmen.hasil === "Kompeten"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-red-50 text-red-700 border-red-200"
                }`}
              >
                {selectedAsesmen.hasil}
              </span>
            </div>
          </div>

          {/* Grid Metadata Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 pt-3 border-t border-gray-100">
            <div className="min-w-0">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">
                Alamat
              </p>
              <div className="flex items-center gap-1.5 text-slate-700 font-semibold text-xs sm:text-sm">
                <MapPin size={14} className="text-[#008BE3] shrink-0" />
                {selectedAsesmen.alamat}
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">
                TUK
              </p>
              <div className="flex items-center gap-1.5 text-slate-700 font-semibold text-xs sm:text-sm">
                <Building size={14} className="text-[#008BE3] shrink-0" />
                {selectedAsesmen.tipeTuk}
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">
                Tanggal
              </p>
              <div className="flex items-center gap-1.5 text-slate-700 font-semibold text-xs sm:text-sm">
                <Calendar size={14} className="text-[#008BE3] shrink-0" />
                {selectedAsesmen.tglAsesmen}
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">
                Waktu
              </p>
              <div className="flex items-center gap-1.5 text-slate-700 font-semibold text-xs sm:text-sm">
                <Clock size={14} className="text-[#008BE3] shrink-0" />
                {selectedAsesmen.waktu}
              </div>
            </div>
          </div>
        </div>

        {/* Alasan Banding Section */}
        <div className="p-4 sm:p-6 border-b border-gray-100 bg-orange-50/50">
          <h2 className="text-base sm:text-lg font-black text-orange-900 tracking-tight mb-4 flex items-center gap-2">
            <AlertCircle size={20} className="text-orange-600 shrink-0" />{" "}
            Pengajuan Banding Asesi
          </h2>
          <div className="p-4 bg-white rounded-lg border border-orange-200 text-slate-700">
            <p className="font-medium text-xs sm:text-sm leading-relaxed">
              {selectedAsesmen.alasanBanding ||
                "Saya merasa jawaban saya pada saat wawancara teknis sudah sesuai dengan KUK yang diujikan, namun asesor menyatakan belum kompeten."}
            </p>
          </div>
        </div>

        {/* Detail Penilaian (Read-only) */}
        <div className="p-4 sm:p-6">
          <h2 className="text-lg font-black text-slate-900 tracking-tight mb-6 flex items-center gap-2">
            Rekapitulasi Penilaian Asesmen
          </h2>

          <div className="space-y-6">
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-slate-50 p-4 border-b border-slate-200 font-bold text-slate-800">
                FR.AK.04A - Keputusan dan Umpan Balik Asesmen
              </div>
              <div className="p-4 bg-white flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                    <FileText size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-800 text-sm">
                      FR_AK_04A_Signed.pdf
                    </p>
                    <p className="text-xs text-slate-500">
                      Telah diisi oleh Asesi dan Asesor
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreviewForm("FR.IA.04A")}
                    className="flex items-center gap-2 px-4 py-2 bg-[#008BE3] hover:bg-[#0076C2] text-white rounded-lg text-sm font-bold transition-colors"
                  >
                    <Eye size={16} /> Pratinjau
                  </button>
                </div>
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-slate-50 p-4 border-b border-slate-200 font-bold text-slate-800">
                FR.AK.04B - Umpan Balik dan Catatan Asesmen
              </div>
              <div className="p-4 bg-white flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                    <FileText size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-800 text-sm">
                      FR_AK_04B_Signed.pdf
                    </p>
                    <p className="text-xs text-slate-500">
                      Telah diisi oleh Asesi dan Asesor
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreviewForm("FR.IA.04B")}
                    className="flex items-center gap-2 px-4 py-2 bg-[#008BE3] hover:bg-[#0076C2] text-white rounded-lg text-sm font-bold transition-colors"
                  >
                    <Eye size={16} /> Pratinjau
                  </button>
                </div>
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-slate-50 p-4 border-b border-slate-200 font-bold text-slate-800">
                FR.IA.07 - Pertanyaan Lisan
              </div>
              <div className="p-4 bg-white flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                    <FileText size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-800 text-sm">
                      FR_IA_07_Signed.pdf
                    </p>
                    <p className="text-xs text-slate-500">
                      Telah diisi oleh Asesi dan Asesor
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreviewForm("FR.IA.07")}
                    className="flex items-center gap-2 px-4 py-2 bg-[#008BE3] hover:bg-[#0076C2] text-white rounded-lg text-sm font-bold transition-colors"
                  >
                    <Eye size={16} /> Pratinjau
                  </button>
                </div>
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-slate-50 p-4 border-b border-slate-200 font-bold text-slate-800 flex items-center justify-between">
                <span>Rekomendasi / Catatan Asesor</span>
                {Boolean(selectedAsesmen.catatan) && (
                  <span className="text-xs bg-sky-100 text-sky-800 font-bold px-2.5 py-0.5 rounded-full">
                    Diperbarui
                  </span>
                )}
              </div>
              <div className="p-6 bg-white space-y-6">
                <div className="min-w-0">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5 flex items-center justify-between">

                  </label>
                  <textarea
                    rows={4}
                    value={catatanBaru}
                    onChange={(e) => setCatatanBaru(e.target.value)}
                    placeholder="Tuliskan alasan persetujuan atau penolakan banding..."
                    className="w-full p-3.5 bg-gray-50 rounded-lg border border-gray-200 text-slate-800 text-sm font-medium outline-none focus:ring-2 focus:ring-[#008BE3]/20 focus:border-[#008BE3] transition-all leading-relaxed"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => handleSubmit("reject")}
                    disabled={!catatanBaru.trim() || loadingSubmit}
                    className="px-6 py-2.5 bg-white border-2 border-red-200 text-red-600 hover:bg-red-50 rounded-lg font-bold text-xs sm:text-sm shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <XCircle size={18} />
                    Tolak Banding
                  </button>
                  <button
                    onClick={() => handleSubmit("approve")}
                    disabled={!catatanBaru.trim() || loadingSubmit}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs sm:text-sm shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CheckCircle size={18} />
                    Setujui Banding (Ubah ke Kompeten)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Preview Form */}
      {previewForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">
                    Pratinjau Dokumen
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {previewForm}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPreviewForm(null)}
                className="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4 sm:p-8 overflow-y-auto bg-slate-50/50 flex-1">
              <div className="bg-white p-4 sm:p-8 rounded-xl border border-slate-200 shadow-xs">
                {previewForm === "FR.IA.04A" && (() => {
                  const riwayat = riwayatData.find(r => r.form_type === "FR.IA.04A");
                  const dataForm = riwayat?.form_data || {} as RiwayatFormData;
                  return (
                    <FormFRIA04A
                      asesmenData={{
                        nama: selectedAsesmen.nama,
                        skema: selectedAsesmen.skema,
                        noSkema: selectedAsesmen.noSkema || "-",
                        tipeTuk: selectedAsesmen.tipeTuk,
                        tanggal: selectedAsesmen.tglAsesmen,
                        asesor: selectedAsesmen.asesor || "Asesor",
                        asesorReg: selectedAsesmen.asesorReg || "-",
                      }}
                      readOnly={true}
                      umpanBalik={dataForm.umpanBalik}
                      asesiSignature={selectedAsesmen.nama}
                      asesorSignature={selectedAsesmen.asesor || "Asesor"}
                    />
                  );
                })()}
                {previewForm === "FR.IA.04B" && (() => {
                  const riwayat = riwayatData.find(r => r.form_type === "FR.IA.04B");
                  const dataForm = riwayat?.form_data || {} as RiwayatFormData;
                  return (
                    <FormFRIA04B
                      asesmenData={{
                        nama: selectedAsesmen.nama,
                        skema: selectedAsesmen.skema,
                        tipeTuk: selectedAsesmen.tipeTuk,
                        t: selectedAsesmen.tglAsesmen,
                        asesor: selectedAsesmen.asesor || "Asesor",
                        asesorReg: selectedAsesmen.asesorReg || "-",
                      }}
                      readOnly={true}
                      questions={dataForm.questions || dataForm.step3Questions}
                      answers={dataForm.answers || dataForm.step3Answers}
                      rekomendasi={dataForm.rekomendasi}
                      asesiSignature={selectedAsesmen.nama}
                      asesorSignature={selectedAsesmen.asesor || "Asesor"}
                    />
                  );
                })()}
                {previewForm === "FR.IA.07" && (() => {
                  const riwayat = riwayatData.find(r => r.form_type === "FR.IA.07");
                  const dataForm = riwayat?.form_data || {} as RiwayatFormData;
                  return (
                    <FormFRIA07
                      asesmenData={{
                        nama: selectedAsesmen.nama,
                        skema: selectedAsesmen.skema,
                        noSkema: selectedAsesmen.noSkema || "-",
                        tipeTuk: selectedAsesmen.tipeTuk,
                        tanggal: selectedAsesmen.tglAsesmen,
                        asesor: selectedAsesmen.asesor || "Asesor",
                        asesorReg: selectedAsesmen.asesorReg || "-",
                      }}
                      readOnly={true}
                      questions={dataForm.questions || dataForm.step4Questions}
                      answers={dataForm.answers || dataForm.step4Answers}
                      umpanBalik={dataForm.umpanBalik}
                      asesiSignature={selectedAsesmen.nama}
                      asesorSignature={selectedAsesmen.asesor || "Asesor"}
                    />
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
