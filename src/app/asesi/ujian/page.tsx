"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import {
  FileEdit,
  CheckCircle,
  Video,
  Eye,
  AlertCircle,
  ArrowLeft,
  Calendar,
  User,
  ExternalLink,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppContext } from "@/context/context";
import { getPengajuanDetail, getPengajuanList, selesaikanUjian } from "@/lib/api";
import { JenisMetode } from "@/types/types";

import { FormFRIA04A } from "@/components/forms/FormFRIA04A";
import { FormFRAK07 } from "@/components/forms/FormFRAK07";
import { FormFRAPL02 } from "@/components/forms/FormFRAPL02";

interface ExamItem {
  id: string;
  name: string;
  actionType: string;
  canPreview: boolean;
}

const formatDateIndo = (dateVal: string | Date | undefined | null) => {
  if (!dateVal) return "Menunggu Jadwal";
  try {
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return "Menunggu Jadwal";
    const months = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  } catch {
    return "Menunggu Jadwal";
  }
};

const formatDateNumeric = (dateVal: string | Date | undefined | null) => {
  if (!dateVal) return "-";
  try {
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return "-";
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
  } catch {
    return "-";
  }
};

interface JadwalPeserta {
  jadwal_asesmen?: {
    tanggal?: string | Date;
    waktu_mulai?: string | Date;
    tipe_tuk?: string;
    alamat?: string;
    link_video?: string;
    users?: {
      username?: string;
      profil?: { namaLengkap?: string };
    };
    master_tuk?: { nama?: string; alamat?: string };
  };
}

interface PengajuanDetailType {
  id: number;
  nomorPengajuan?: string;
  tuk?: string;
  status?: string;
  tglPengajuan?: string | Date;
  skema?: {
    id?: number;
    namaSkema?: string;
    kodeSkema?: string;
    unitKompetensi?: Array<{
      kodeUnit: string;
      judulUnit: string;
      elemenKompetensi?: Array<{
        namaElemen: string;
        kriteriaUnjukKerja: string;
      }>;
    }>;
  };
  dataPribadi?: {
    namaLengkap?: string;
    nik?: string;
    tandaTangan?: string;
  };
  master_tuk?: { nama?: string; alamat?: string; tipe?: string };
  hasil_asesmen?: { id?: number; hasil?: string; link_video?: string };
  apl02_penilaian?: {
    rekomendasi_apl02?: string;
    nama_asesor?: string;
    ttd_asesor?: string;
    ttd_asesi?: string;
  };
  jadwal_asesmen_peserta?: JadwalPeserta[];
}

function UjianAsesiContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, showNotification } = useAppContext();

  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [showConfirmFinish, setShowConfirmFinish] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [pengajuan, setPengajuan] = useState<PengajuanDetailType | null>(null);
  const [isFinishing, setIsFinishing] = useState<boolean>(false);

  const examItems: ExamItem[] = [
    {
      id: "apl02",
      name: "Asesmen Mandiri (FR-APL-02)",
      actionType: "form_apl02",
      canPreview: true,
    },
    {
      id: "penyesuaian",
      name: "Penyesuaian Wajar dan Beralasan (FR-AK-07)",
      actionType: "form_penyesuaian",
      canPreview: true,
    },
    {
      id: "proyek_a",
      name: "Penilaian Proyek Singkat (FR-IA-04A)",
      actionType: "form_proyek_a",
      canPreview: true,
    },
    {
      id: "lisan",
      name: "Pertanyaan Lisan / Wawancara",
      actionType: "form_lisan",
      canPreview: false,
    },
  ];

  const loadPengajuan = useCallback(async () => {
    setIsLoading(true);
    try {
      const queryId = searchParams.get("pengajuanId") || searchParams.get("id");
      if (queryId) {
        const detail = await getPengajuanDetail(Number(queryId));
        if (detail) {
          setPengajuan(detail as PengajuanDetailType);
          setIsLoading(false);
          return;
        }
      }

      // Jika tidak ada parameter ID, cari pengajuan berstatus "Terjadwal" atau terbaru
      const list = await getPengajuanList();
      if (Array.isArray(list) && list.length > 0) {
        const scheduled =
          list.find((p: { status?: string }) => p.status === "Terjadwal") ||
          list[0];
        if (scheduled?.id) {
          const detail = await getPengajuanDetail(scheduled.id);
          setPengajuan(detail as PengajuanDetailType);
        }
      }
    } catch (error) {
      console.error("Gagal memuat data ujian pengajuan:", error);
    } finally {
      setIsLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    loadPengajuan();
  }, [loadPengajuan]);

  const handleCloseRequest = () => {
    setActiveModal(null);
  };

  const confirmFinishExam = async () => {
    setIsFinishing(true);
    try {
      if (pengajuan?.id) {
        await selesaikanUjian(pengajuan.id);
      }
      showNotification("Sesi ujian asesmen Anda berhasil diselesaikan!", "success");
      setShowConfirmFinish(false);
      router.push("/asesi/riwayatasesmen");
    } catch (error) {
      console.error("Gagal menyelesaikan ujian:", error);
      showNotification("Terjadi kesalahan saat menyelesaikan ujian", "error");
    } finally {
      setIsFinishing(false);
    }
  };

  const activeExam = examItems.find((item) => item.actionType === activeModal);
  const activeExamName = activeExam?.name || "Pratinjau Dokumen";

  function requestNavigation(destination: string): void {
    setActiveModal(null);
    setShowConfirmFinish(false);

    if (destination === "dashboard") {
      router.push("/asesi/overview");
    } else {
      router.push(`/asesi/${destination}`);
    }
  }

  // Data terolah dari backend
  const jadwal = pengajuan?.jadwal_asesmen_peserta?.[0]?.jadwal_asesmen;
  const skemaName = pengajuan?.skema?.namaSkema || "Skema Sertifikasi Kompetensi";
  const skemaCode = pengajuan?.skema?.kodeSkema || "SKM-001";
  const asesiName =
    pengajuan?.dataPribadi?.namaLengkap || user?.username || "Asesi";
  const asesiNik = pengajuan?.dataPribadi?.nik || "";
  const asesorName =
    jadwal?.users?.profil?.namaLengkap ||
    jadwal?.users?.username ||
    pengajuan?.apl02_penilaian?.nama_asesor ||
    "Asesor Ditugaskan";

  const rawDate = jadwal?.tanggal || pengajuan?.tglPengajuan;
  const jadwalTanggalStr = formatDateIndo(rawDate);
  const numericDate = formatDateNumeric(rawDate);
  const linkMeeting =
    jadwal?.link_video || pengajuan?.hasil_asesmen?.link_video || "";

  const tukName =
    jadwal?.master_tuk?.nama ||
    pengajuan?.master_tuk?.nama ||
    jadwal?.tipe_tuk ||
    pengajuan?.tuk ||
    "TUK Mandiri";

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="w-8 h-8 border-3 border-[#008BE3] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-slate-600">
          Memuat informasi ujian Anda...
        </p>
      </div>
    );
  }

  if (!pengajuan) {
    return (
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-8 text-center max-w-lg mx-auto mt-12 space-y-4">
        <div className="w-16 h-16 rounded-full bg-sky-50 text-[#008BE3] flex items-center justify-center mx-auto">
          <AlertCircle size={32} />
        </div>
        <h3 className="text-lg font-bold text-slate-900">
          Tidak Ada Jadwal Ujian Aktif
        </h3>
        <p className="text-sm text-slate-600">
          Saat ini belum ada jadwal ujian yang terdaftar untuk akun Anda. Silakan
          ajukan skema sertifikasi baru atau pantau status di dashboard.
        </p>
        <button
          onClick={() => router.push("/asesi/overview")}
          className="px-6 py-2.5 bg-[#008BE3] text-white text-sm font-bold rounded-lg hover:bg-[#0076C2] transition-colors"
        >
          Kembali ke Dashboard
        </button>
      </div>
    );
  }

  return (
    <>
      {!activeModal ? (
        <div className="space-y-6 pb-24 text-sm text-gray-700">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => requestNavigation("dashboard")}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-[#008BE3] bg-[#008BE3]/10 hover:bg-[#008BE3]/20 transition-colors cursor-pointer shrink-0 mt-0.5"
                title="Kembali ke Dashboard"
              >
                <ArrowLeft size={18} />
              </button>
              <div className="w-10 h-10 rounded-lg bg-[#008BE3]/10 flex items-center justify-center text-[#008BE3] border border-[#008BE3]/20 shadow-xs shrink-0">
                <FileEdit size={20} className="stroke-[2.5]" />
              </div>
              <div className="min-w-0">
                <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none mb-1 md:whitespace-nowrap">
                  Ujian & Dokumen Asesmen
                </h2>
                <p className="text-xs text-gray-400 font-bold tracking-wider uppercase leading-4 md:whitespace-nowrap">
                  Skema: {skemaName}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-[#008BE3]/10 text-[#008BE3] rounded-full flex items-center justify-center shrink-0">
                <Video size={24} />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-lg text-slate-900">
                  Virtual Meeting Ujian Asesmen
                </h3>
                <p className="text-sm text-slate-600">
                  Silakan bergabung ke virtual meeting pada jadwal yang telah
                  ditentukan bersama asesor.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 flex items-center gap-3">
                <Calendar className="text-slate-400" size={20} />
                <div className="min-w-0">
                  <p className="text-xs text-slate-500 font-semibold mb-1 uppercase">
                    Jadwal Ujian
                  </p>
                  <p className="text-sm font-bold text-slate-900">
                    {jadwalTanggalStr}
                  </p>
                </div>
              </div>
              <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 flex items-center gap-3">
                <User className="text-slate-400" size={20} />
                <div className="min-w-0">
                  <p className="text-xs text-slate-500 font-semibold mb-1 uppercase">
                    Nama Asesor
                  </p>
                  <p className="text-sm font-bold text-slate-900">
                    {asesorName}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              {linkMeeting && linkMeeting !== "-" ? (
                <a
                  href={
                    linkMeeting.startsWith("http")
                      ? linkMeeting
                      : `https://${linkMeeting}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2.5 bg-[#008BE3] text-white rounded-lg font-bold text-sm hover:bg-[#0076C2] transition-colors flex items-center gap-2 shadow-xs"
                >
                  <Video size={16} /> Bergabung ke Meeting
                  <ExternalLink size={14} />
                </a>
              ) : (
                <span className="text-xs text-gray-500 italic bg-gray-100 px-4 py-2 rounded-lg">
                  Tautan virtual meeting belum disediakan oleh asesor
                </span>
              )}
            </div>
          </div>

          <div className="bg-[#FFFBE6] border border-[#FFE58F] rounded-lg p-3 flex items-center gap-3 text-amber-900 shadow-3xs">
            <AlertCircle size={20} className="text-amber-500 shrink-0" />
            <p className="text-sm leading-relaxed font-semibold">
              Sebelum mengikuti ujian, pastikan Anda telah membaca dokumen yang
              wajib dibaca.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-200 space-y-3">
              <h3 className="font-bold text-lg text-slate-900">Daftar Dokumen Ujian</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-150">
                <thead>
                  <tr className="bg-[#0F172A] border-b border-[#0F172A]">
                    <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-left w-16">
                      No
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider">
                      Nama Dokumen
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-right whitespace-nowrap sticky right-0 bg-[#0F172A] z-10 border-l border-white/10 shadow-[-6px_0_15px_-4px_rgba(0,0,0,0.06)]">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {examItems.map((item, idx) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50 transition-colors group"
                    >
                      <td className="px-6 py-4 text-xs md:text-sm text-center font-semibold text-slate-700">
                        {idx + 1}
                      </td>
                      <td className="px-6 py-4 text-xs md:text-sm font-bold text-slate-900">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 text-right sticky right-0 bg-white group-hover:bg-slate-50 z-10 border-l border-gray-100 shadow-[-6px_0_15px_-4px_rgba(0,0,0,0.02)] transition-colors">
                        {item.canPreview ? (
                          <button
                            onClick={() => setActiveModal(item.actionType)}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 transition-colors bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 shadow-xs cursor-pointer"
                          >
                            <Eye size={14} /> Lihat Dokumen
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400 font-medium italic">
                            Diujikan saat meeting
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={() => setShowConfirmFinish(true)}
              className="w-full sm:w-auto px-8 py-3 bg-[#008BE3] text-white rounded-xl font-bold hover:bg-[#0076C2] transition-colors shadow-sm cursor-pointer"
            >
              Selesaikan Ujian
            </button>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-white flex flex-col">
          <div className="w-full border-b border-slate-200 rounded-xl shadow-md overflow-hidden animate-in fade-in duration-300 flex flex-col mx-auto">
          <div className="w-full bg-white border-b border-slate-200 rounded-t-xl px-6 py-4 flex items-center gap-4 sticky top-0 z-20">
            <button
              onClick={handleCloseRequest}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-[#008BE3] bg-[#008BE3]/10 hover:bg-[#008BE3]/20 transition-colors cursor-pointer shrink-0 mt-0.5"
              title="Kembali"
            >
              <ArrowLeft size={18} />
            </button>
            <h3 className="font-bold text-slate-800 text-lg">
              {activeExamName}
            </h3>
          </div>

          <div className="w-full bg-[#FFFBE6] border-b border-[#FFE58F] px-6 py-3 flex items-center gap-3 text-amber-900">
            <AlertCircle size={20} className="text-amber-500 shrink-0" />
            <p className="text-sm leading-relaxed font-semibold">
              {activeModal === "form_apl02"
                ? "Dokumen ini diperiksa oleh asesor pada saat meeting evaluasi mandiri."
                : "Baca dokumen ini sebelum melakukan verifikasi dan presentasi bersama asesor."}
            </p>
          </div>

          <div className="w-full bg-white flex-1 overflow-hidden rounded-b-xl">
            <div className="p-6 md:p-10">
              <>
                {activeModal === "form_apl02" && (
                  <FormFRAPL02
                    asesmenData={{
                      id: pengajuan.id,
                      nama: asesiName,
                      skema: skemaName,
                      noSkema: skemaCode,
                      tuk: tukName,
                      tanggal: numericDate,
                      metode: jadwal?.tipe_tuk || "Mandiri",
                      status: pengajuan.status || "Preview",
                    }}
                    readOnly={true}
                    asesiSignature={
                      pengajuan.dataPribadi?.tandaTangan
                        ? "Telah Ditandatangani"
                        : "-"
                    }
                    asesorSignature={
                      pengajuan.apl02_penilaian?.ttd_asesor
                        ? "Telah Ditandatangani"
                        : "Telah Ditandatangani"
                    }
                    asesiDate={numericDate}
                    asesorDate={numericDate}
                  />
                )}
                {activeModal === "form_penyesuaian" && (
                  <FormFRAK07
                    asesmenData={{
                      id: pengajuan.id,
                      nama: asesiName,
                      skema: skemaName,
                      noSkema: skemaCode,
                      tuk: tukName,
                      tanggal: numericDate,
                      metode: (jadwal?.tipe_tuk as JenisMetode) || "Offline",
                      status: pengajuan.status || "Preview",
                    }}
                    readOnly={true}
                    asesiSignature={"Telah Ditandatangani"}
                    asesorSignature={"Telah Ditandatangani"}
                    asesorName={asesorName}
                    asesiName={asesiName}
                    asesiDate={numericDate}
                    asesorDate={numericDate}
                  />
                )}
                {activeModal === "form_proyek_a" && (
                  <FormFRIA04A
                    asesmenData={{
                      id: String(pengajuan.id),
                      nama: asesiName,
                      nik: asesiNik,
                      skema: skemaName,
                      tipeTuk: tukName,
                      waktu: "08:00 WIB",
                      hasil: pengajuan.hasil_asesmen?.hasil || "Kompeten",
                      tglAsesmen: numericDate,
                      metode: jadwal?.tipe_tuk || "Mandiri",
                      status: pengajuan.status || "Preview",
                    }}
                    readOnly={true}
                    asesiSignature={"Telah Ditandatangani"}
                    asesorSignature={"Telah Ditandatangani"}
                  />
                )}
                <div className="mt-8 pt-6 border-t border-slate-200 flex justify-end gap-3">
                  <button
                    onClick={handleCloseRequest}
                    className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-bold transition-colors cursor-pointer"
                  >
                    Tutup Pratinjau
                  </button>
                </div>
              </>
            </div>
          </div>
          </div>
        </div>

      )}

      {/* Confirm Finish All Modal */}
      {showConfirmFinish && (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0 mx-auto mb-4">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Selesaikan Ujian?
              </h3>
              <p className="text-slate-600 text-sm">
                Apakah Anda yakin telah mengikuti seluruh tahapan ujian dengan
                asesor? Setelah ini Anda akan diarahkan ke halaman Riwayat
                Asesmen.
              </p>
            </div>
            <div className="p-4 bg-slate-50 flex gap-3 justify-end border-t border-slate-100">
              <button
                disabled={isFinishing}
                onClick={() => setShowConfirmFinish(false)}
                className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                disabled={isFinishing}
                onClick={confirmFinishExam}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-700 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isFinishing ? "Menyelesaikan..." : "Ya, Selesaikan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function UjianAsesi() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="w-8 h-8 border-3 border-[#008BE3] border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <UjianAsesiContent />
    </Suspense>
  );
}
