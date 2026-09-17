"use client";

import React, { useState, useEffect } from "react";
import {
  FileEdit,
  Trash2,
  Eye,
  Calendar,
  MapPin,
  Search,
  Plus,
  Filter,
  CheckSquare,
  Edit,
  Clock,
  ArrowLeft,
  CheckCircle,
  X,
  FileText,
  Sparkles,
  Printer,
  Loader2,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAppContext } from "@/context/context";
import {
  ScheduleItem,
  AsesiPlenoItem,
  PlenoDetailData,
  PlenoAttendee,
  Role,
  AssessmentItem,
} from "@/types/types";
import {
  getJadwalList,
  createJadwal,
  updateJadwal,
  deleteJadwal,
  getSkemaList,
  getTukList,
  getAllUsers,
  getPengajuanList,
  downloadSuratTugas,
  addPesertaJadwal,
  createPleno,
  updatePleno,
  addPlenoAsesi,
  addPlenoAttendee,
  getPlenoList,
} from "@/lib/api";



const getDocumentPreviewUrl = (name?: string, url?: string) => {
  if (url && url.trim().length > 0) return url;
  const safeName = name ? encodeURIComponent(name) : "Surat_Sidang_Pleno.pdf";
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800" fill="none"><rect width="600" height="800" fill="white" rx="16"/><rect x="40" y="40" width="520" height="720" fill="%23F8FAFC" stroke="%23E2E8F0" stroke-width="2" rx="12"/><rect x="70" y="70" width="100" height="36" fill="%23008BE3" rx="6"/><text x="185" y="93" font-family="sans-serif" font-weight="bold" font-size="18" fill="%230F172A">SURAT KEPUTUSAN SIDANG PLENO</text><text x="185" y="115" font-family="sans-serif" font-size="13" fill="%2364748B">LSP SERTIFIKASI PROFESI INDONESIA</text><line x1="70" y1="135" x2="530" y2="135" stroke="%23008BE3" stroke-width="2"/><text x="70" y="180" font-family="sans-serif" font-weight="bold" font-size="15" fill="%231E293B">BERITA ACARA &amp; HASIL KEPUTUSAN SIDANG</text><text x="70" y="210" font-family="sans-serif" font-size="13" fill="%23008BE3">Lampiran Dokumen: ${safeName}</text><rect x="70" y="235" width="460" height="150" fill="%23F1F5F9" rx="8" stroke="%23CBD5E1"/><text x="90" y="270" font-family="sans-serif" font-weight="bold" font-size="13" fill="%23334155">Detail Pengesahan Hasil Asesmen:</text><text x="90" y="300" font-family="sans-serif" font-size="12" fill="%23475569">1. Penetapan Keputusan Sertifikasi Asesi Terdaftar</text><text x="90" y="325" font-family="sans-serif" font-size="12" fill="%23475569">2. Verifikasi Berkas Rekam Jejak Asesmen Asesor</text><text x="90" y="350" font-family="sans-serif" font-size="12" fill="%23475569">3. Persetujuan dewan_pengarah dan komite_skema</text><rect x="70" y="415" width="460" height="1" fill="%23E2E8F0"/><text x="70" y="450" font-family="sans-serif" font-weight="bold" font-size="13" fill="%23059669">STATUS DOKUMEN: RESMI, SAH &amp; TERVERIFIKASI</text><rect x="70" y="520" width="180" height="90" fill="%23F0F9FF" rx="8" stroke="%23008BE3"/><text x="85" y="555" font-family="sans-serif" font-weight="bold" font-size="12" fill="%23008BE3">LSP SERTIFIKASI PROFESI</text><text x="85" y="580" font-family="sans-serif" font-size="11" fill="%230284C7">[ CAP STAMPEL &amp; TTD ]</text><text x="340" y="555" font-family="sans-serif" font-size="11" fill="%2364748B">Ketua Komite Sidang Pleno</text><line x1="340" y1="590" x2="510" y2="590" stroke="%2394A3B8" stroke-dasharray="2 2"/></svg>`;
};

export default function AssessmentSchedule() {
  const {
    user,
    AssessmentItems,
    deletePlenoSession,
    showNotification,
  } = useAppContext();
  const [plenoSessions, setPlenoSessions] = useState<PlenoDetailData[]>([]);
  const isPlenoOnlyRole =
    user?.role === "direktur" ||
    user?.role === "manajer" ||
    user?.role === "dewan_pengarah" ||
    user?.role === "komite_skema";
  const readOnly = user?.role !== "admin";

  const [confirmAsesmenId, setConfirmAsesmenId] = useState<number | null>(null);

  // Pleno State
  const [isPlenoModalOpen, setIsPlenoModalOpen] = useState(false);
  const [isGeneratePenugasanModalOpen, setIsGeneratePenugasanModalOpen] =
    useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [, setIsSubmitting] = useState(false);

  const handlePreviewAsesmen = (item: ScheduleItem) => {
    setIsPreviewMode(true);
    setEditId(item.id);
    setFormData({
      namaBatch: item.namaBatch || "",
      nomorSurat: item.nomorSurat || "",
      skema: item.skema || "",
      metode: item.metode || "Offline",
      tipeTuk: item.tipeTuk || "Sewaktu",
      tuk: item.tuk || "TUK Sewaktu Kantor LSP",
      alamat: item.alamat || "UIN Sunan Gunung Djati Bandung",
      tanggal: item.tanggal || "",
      waktuMulai: item.waktuMulai || "",
      linkVideo: item.linkVideo || "",
      namaAsesor: item.namaAsesor || "",
      suratTugasUrl: item.suratTugasUrl || "",
      totalKandidat: item.totalKandidat || 0,
      status: item.status || "Terjadwal",
    });

    setSelectedAsesiForJadwal(item.asesiList || []);
    setIsModalOpen(true);
  };

  const handleDownloadSuratTugas = async (selectedSchedule: ScheduleItem) => {
    try {
      const asesorInfo = availableAsesors.find(
        (a) =>
          a.profil?.namaLengkap === selectedSchedule.namaAsesor ||
          a.username === selectedSchedule.namaAsesor,
      );

      const currentAsesiList = selectedSchedule.asesiList?.length
        ? selectedSchedule.asesiList
        : selectedAsesiForJadwal;
      const direkturInfo = availableUsers.find(
        (u) => u.role === "direktur" || u.role === "Direktur",
      );
      const namaDirektur =
        direkturInfo?.profil?.namaLengkap ||
        direkturInfo?.nama ||
        direkturInfo?.username ||
        "Direktur LSP";

      const payload = {
        nomorSurat: selectedSchedule.nomorSurat || "-",
        namaAsesor: selectedSchedule.namaAsesor || "-",
        noRegMet: asesorInfo?.profil?.nomorRegistrasiMet || "-",
        bidangSkema: selectedSchedule.skema || "-",
        namaTuk: selectedSchedule.tipeTuk || "-",
        alamatTuk: selectedSchedule.alamat || "-",
        hariTanggal: selectedSchedule.tanggal || "-",
        jam: selectedSchedule.waktuMulai || "-",
        jumlahPeserta:
          currentAsesiList?.length || selectedSchedule.totalKandidat || 0,
        jumlahSkema: 1,
        namaAsesi:
          currentAsesiList
            ?.map((asesiId) => {
              const asesiData = AssessmentItems?.find((a) => a.id === asesiId);
              return asesiData?.nama || asesiId;
            })
            .join(", ") || "-",
        spesifikasiRuangTuk: selectedSchedule.tuk || "-",
        kegiatanPengujian: "Uji Kompetensi",
        kotaSurat: "Bandung",
        tanggalSurat: selectedSchedule.tanggal || "-",
        namaDirektur: namaDirektur,
      };

      await downloadSuratTugas(payload);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditAsesmen = (item: ScheduleItem) => {
    setIsEditMode(true);
    setEditId(item.id);
    setFormData({
      namaBatch: item.namaBatch || "",
      nomorSurat: item.nomorSurat || "",
      skema: item.skema || "",
      metode: item.metode || "Offline",
      tipeTuk: item.tipeTuk || "Sewaktu",
      tuk: item.tuk || "TUK Sewaktu Kantor LSP",
      alamat: item.alamat || "UIN Sunan Gunung Djati Bandung",
      tanggal: item.tanggal || "",
      waktuMulai: item.waktuMulai || "",
      linkVideo: item.linkVideo || "",
      namaAsesor: item.namaAsesor || "",
      suratTugasUrl: item.suratTugasUrl || "",
      totalKandidat: item.totalKandidat || 0,
      status: item.status || "Terjadwal",
    });

    setSelectedAsesiForJadwal(item.asesiList || []);
    setIsModalOpen(true);
  };
  const handleEditPleno = (item: PlenoDetailData) => {
    setIsPreviewMode(false);
    setIsEditMode(true);
    setEditId(item.id);
    setPlenoForm({
      id: item.id,
      batchCode: item.batchCode || `PLN-${item.id}`,
      title: item.title,
      tanggal: item.tanggal,
      waktu: item.waktu?.split(" s.d ")[0] || "",
      skema: item.skema,
      alamat: item.alamat,
      deskripsi: item.deskripsi || "",
      plenoAttendees: item.plenoAttendees || [],
      suratPlenoName: item.suratPlenoName || "",
      suratPlenoUrl: item.suratPlenoUrl || "",
    });
    setSelectedAsesiForPleno(item.asesiList as AsesiPlenoItem[]);
    setIsPlenoModalOpen(true);
  };

  const handleDeletePleno = (id: number) => {
    deletePlenoSession(id);
  };

  const handleDeleteSchedule = async (id: number) => {
    try {
      await deleteJadwal(id);
      await fetchJadwalData();
    } catch (err) {
      console.error("Gagal menghapus jadwal:", err);
      setSchedules((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const handleSelesaiSchedule = async () => {
    if (confirmAsesmenId !== null) {
      try {
        await updateJadwal(confirmAsesmenId, { status: "Selesai" });
        await fetchJadwalData();
      } catch (err) {
        console.error("Gagal menyelesaikan jadwal:", err);
        setSchedules((prev) =>
          prev.map((s) =>
            s.id === confirmAsesmenId ? { ...s, status: "Selesai" } : s,
          ),
        );
      }
      setConfirmAsesmenId(null);
    }
  };
  const [activeTab, setActiveTab] = useState<"asesmen" | "pleno">(
    isPlenoOnlyRole ? "pleno" : "asesmen",
  );

  useEffect(() => {
    if (isPlenoOnlyRole) {
      setActiveTab("pleno");
    }
  }, [isPlenoOnlyRole]);

  const [searchQuery, setSearchQuery] = useState("");

  // const formattanggal = (tanggalStr: string) => {
  //   if (!tanggalStr) return "-";
  //   try {
  //     const date = new Date(tanggalStr); // Gunakan D kapital
  //     if (isNaN(date.getTime())) return tanggalStr;
  //     return new Intl.DateTimeFormat("id-ID", {
  //       weekday: "long",
  //       day: "numeric",
  //       month: "long",
  //       year: "numeric",
  //     }).format(date);
  //   } catch {
  //     return tanggalStr;
  //   }
  // };

  // Asesmen Interfaces & State
  interface BackendPesertaJadwal {
    id?: number;
    pengajuan_id: number;
  }

  interface BackendJadwalItem {
    id: number;
    nama_batch?: string;
    nomor_surat?: string;
    metode?: string;
    tanggal?: string | Date;
    waktu_mulai?: string | Date;
    tipe_tuk?: string;
    alamat?: string;
    nama_asesor?: string;
    link_video?: string;
    surat_tugas_url?: string;
    status?: string;
    master_skema?: { namaSkema?: string };
    master_tuk?: { nama?: string };
    users?: {
      username?: string;
      profil?: { namaLengkap?: string };
    };
    jadwal_asesmen_peserta?: BackendPesertaJadwal[];
  }

  interface AvailableSkemaOption {
    id: number;
    namaSkema?: string;
    nama_skema?: string;
    nama?: string;
    kodeSkema?: string;
  }

  interface AvailableTukOption {
    id: number;
    nama: string;
    kapasitas?: number | null;
  }

  interface AvailableAsesorOption {
    id: number;
    username: string;
    role: string;
    nama?: string;
    noRegMet?: string;
    profil?: { namaLengkap?: string; nomorRegistrasiMet?: string };
  }

  interface BackendPengajuanItem {
    id: number;
    jenisMetode?: string;
    metode?: string;
    nama?: string;
    nik?: string;
    skema?: AssessmentItem;
    user?: {
      id: number;
      username?: string;
      email?: string;
      profil?: {
        namaLengkap?: string;
        nik?: string;
      };
    };
    dataPribadi?: {
      namaLengkap?: string;
      nik?: string;
    };
    statusPembayaran?: string;
  }

  const [isJadwalLoading, setIsJadwalLoading] = useState<boolean>(true);
  const [apiCompletedAsesis, setApiCompletedAsesis] = useState<
    BackendPengajuanItem[]
  >([]);
  const [availableSkemas, setAvailableSkemas] = useState<
    AvailableSkemaOption[]
  >([]);
  const [availableTuks, setAvailableTuks] = useState<AvailableTukOption[]>([]);
  const [availableAsesors, setAvailableAsesors] = useState<
    AvailableAsesorOption[]
  >([]);
  const [availableUsers, setAvailableUsers] = useState<AvailableAsesorOption[]>(
    [],
  );
  const [apiAvailableAsesis, setApiAvailableAsesis] = useState<
    BackendPengajuanItem[]
  >([]);

  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);

  const mapBackendJadwal = (item: BackendJadwalItem): ScheduleItem => {
    const asesorName =
      item.users?.profil?.namaLengkap ||
      item.users?.username ||
      item.nama_asesor ||
      "Asesor LSP";
    const initials = asesorName
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();

    return {
      id: item.id,
      nomorSurat: item.nomor_surat || "-",
      skema: item.master_skema?.namaSkema || "Skema Sertifikasi",
      metode: item.metode === "Daring" || item.metode === "Online" ? "Online" : "Offline",
      tanggal: item.tanggal
        ? new Date(item.tanggal).toISOString().split("T")[0]
        : "",
      waktuMulai: item.waktu_mulai
        ? new Date(item.waktu_mulai).toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        })
        : "08:00",
      linkVideo: item.link_video || "",
      tipeTuk: item.tipe_tuk || "Sewaktu",
      tuk: item.master_tuk?.nama || item.alamat || "TUK Kantor LSP",
      alamat: item.alamat || "UIN Sunan Gunung Djati Bandung",
      totalKandidat: item.jadwal_asesmen_peserta?.length || 0,
      namaAsesor: asesorName,
      inisialAsesor: initials,
      suratTugasUrl: item.surat_tugas_url || "",
      status: item.status || "Terjadwal",
      asesiList:
        item.jadwal_asesmen_peserta?.map(
          (p: BackendPesertaJadwal) => p.pengajuan_id,
        ) || [],
    };
  };

  const fetchJadwalData = async () => {
    try {
      setIsJadwalLoading(true);
      const [
        jadwalRes,
        skemaRes,
        tukRes,
        usersRes,
        pengajuanRes,
        completedPengajuanRes,
        plenoRes,
      ] = await Promise.allSettled([
        getJadwalList(),
        getSkemaList(),
        getTukList("all"),
        getAllUsers(),
        getPengajuanList({ status: "Terverifikasi" }),
        getPengajuanList({ status: "Menunggu Pleno" }),
        getPlenoList(),
      ]);

      if (
        jadwalRes.status === "fulfilled" &&
        Array.isArray(jadwalRes.value) &&
        jadwalRes.value.length > 0
      ) {
        setSchedules(
          (jadwalRes.value as BackendJadwalItem[]).map(mapBackendJadwal),
        );
      }

      if (skemaRes.status === "fulfilled" && Array.isArray(skemaRes.value)) {
        setAvailableSkemas(skemaRes.value as AvailableSkemaOption[]);
      }

      if (tukRes.status === "fulfilled" && Array.isArray(tukRes.value)) {
        setAvailableTuks(tukRes.value as AvailableTukOption[]);
      }

      if (usersRes.status === "fulfilled" && Array.isArray(usersRes.value)) {
        const users = usersRes.value as AvailableAsesorOption[];
        setAvailableUsers(users);
        const asesors = users.filter((u) => u.role === "asesor");
        setAvailableAsesors(asesors);
      }

      if (
        pengajuanRes.status === "fulfilled" &&
        Array.isArray(pengajuanRes.value)
      ) {
        const asesis = pengajuanRes.value as BackendPengajuanItem[];
        setApiAvailableAsesis(asesis.filter(a => a.statusPembayaran === "Sudah"));
      }

      if (
        completedPengajuanRes.status === "fulfilled" &&
        Array.isArray(completedPengajuanRes.value)
      ) {
        setApiCompletedAsesis(completedPengajuanRes.value);
      }

      console.log("plenoRes:", plenoRes);
      if (
        plenoRes.status === "fulfilled" &&
        Array.isArray(plenoRes.value)
      ) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mappedPleno = plenoRes.value.map((p: any) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const asesiList: AsesiPlenoItem[] = p.pleno_asesi?.map((a: any) => ({
            id: a.pengajuan_skema?.id || a.id,
            nik: a.pengajuan_skema?.dataPribadi?.nik || `121705${a.id}`,
            nama: a.pengajuan_skema?.dataPribadi?.namaLengkap || "Asesi",
            skema: a.pengajuan_skema?.skema?.namaSkema || "Skema Sertifikasi",
            statusPleno: a.status_pleno || "Belum",
            rekomendasiAsesor: a.rekomendasi_asesor || "Belum",
          })) || [];
          return {
            id: p.id,
            batchCode: `PLN-${p.id}`,
            title: p.title || "Sidang Pleno",
            tanggal: p.tanggal ? (p.tanggal.includes("T") && !isNaN(Date.parse(p.tanggal)) ? new Date(p.tanggal).toISOString().split("T")[0] : p.tanggal) : "",
            waktu: p.waktu ? (p.waktu.includes("T") && !isNaN(Date.parse(p.waktu)) ? new Date(p.waktu).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : p.waktu) : "",
            skema: Array.isArray(p.skema) ? p.skema.join(", ") : p.skema || "Multi Skema",
            jenisTuk: p.jenisTuk || "Sewaktu",
            alamat: p.alamat || "Ruang Rapat",
            jumlahAsesi: p.pleno_asesi?.length || 0,
            status: p.status || "Terjadwal",
            deskripsi: p.deskripsi || "",
            asesiList: asesiList,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            plenoAttendees: p.pleno_attendee?.map((att: any) => ({
              role: att.role,
              nama: att.nama,
            })) || []
          };
        });
        setPlenoSessions(mappedPleno);
      }
    } catch (err: unknown) {
      console.error("Gagal memuat data jadwal:", err);
    } finally {
      setIsJadwalLoading(false);
    }
  };

  useEffect(() => {
    fetchJadwalData();
  }, []);

  const [selectedAsesiForJadwal, setSelectedAsesiForJadwal] = useState<
    number[]
  >([]);
  const [formData, setFormData] = useState({
    namaBatch: "",
    nomorSurat: "",
    skema: "",
    metode: "Offline",
    tipeTuk: "Sewaktu",
    alamat: "UIN Sunan Gunung Djati Bandung",
    tanggal: "",
    waktuMulai: "08:00",
    tuk: "",
    namaAsesor: "",
    suratTugasUrl: "",
    totalKandidat: 0,
    status: "Terjadwal",
    linkVideo: "",
  });

  const handleAddSchedule = async () => {
    if (
      !formData.namaBatch ||
      !formData.skema ||
      !formData.tanggal ||
      !formData.namaAsesor
    )
      return;

    try {
      const matchedSkema = availableSkemas.find(
        (s) => s.namaSkema === formData.skema || s.kodeSkema === formData.skema,
      );
      const matchedTuk = availableTuks.find((t) => t.nama === formData.tuk);
      const matchedAsesor = availableAsesors.find(
        (u) =>
          u.profil?.namaLengkap === formData.namaAsesor ||
          u.username === formData.namaAsesor,
      );

      const parsedDate = new Date(formData.tanggal);
      const validDate = isNaN(parsedDate.getTime()) ? new Date() : parsedDate;

      const payload = {
        nama_batch: formData.namaBatch,
        nomor_surat: formData.nomorSurat || undefined,
        skema_id: matchedSkema?.id || undefined,
        metode: formData.metode,
        tipe_tuk: formData.tipeTuk,
        tuk_id: matchedTuk?.id || undefined,
        alamat: formData.alamat,
        tanggal: validDate.toISOString(),
        waktu_mulai: formData.waktuMulai
          ? new Date(`1970-01-01T${formData.waktuMulai}:00.000Z`).toISOString()
          : undefined,
        link_video: formData.metode === "Online" ? formData.linkVideo || undefined : undefined,
        asesor_id: matchedAsesor?.id || undefined,
        surat_tugas_url: formData.suratTugasUrl || undefined,
        status: formData.status || "Terjadwal",
      };

      if (isEditMode && editId) {
        await updateJadwal(editId, payload);
        await addPesertaJadwal(editId, selectedAsesiForJadwal);
      } else {
        const newJadwal: ScheduleItem = await createJadwal(payload);
        if (newJadwal?.id) {
          await addPesertaJadwal(newJadwal.id, selectedAsesiForJadwal);
        }
      }

      await fetchJadwalData();
    } catch (err) {
      console.error("Gagal menyimpan jadwal asesmen:", err);
      // Fallback local update
      if (isEditMode) {
        setSchedules(
          schedules.map((s) =>
            s.id === editId
              ? {
                ...s,
                ...formData,
                waktu_mulai: formData.waktuMulai
                  ? new Date(`1970-01-01T${formData.waktuMulai}:00.000Z`)
                  : undefined,
                link_video:
                  formData.metode === "Online"
                    ? formData.linkVideo || undefined
                    : undefined,
                inisialAsesor: formData.namaAsesor
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .substring(0, 2)
                  .toUpperCase(),
                totalKandidat: selectedAsesiForJadwal.length,
                asesiList: selectedAsesiForJadwal,
              }
              : s,
          ),
        );
      } else {
        const newSchedule = {
          id: schedules.length + 1,
          ...formData,
          inisialAsesor: formData.namaAsesor
            .split(" ")
            .map((n) => n[0])
            .join("")
            .substring(0, 2)
            .toUpperCase(),
          totalKandidat: selectedAsesiForJadwal.length,
          asesiList: selectedAsesiForJadwal,
        };
        setSchedules([newSchedule as ScheduleItem, ...schedules]);
      }
    }

    setIsModalOpen(false);
    setFormData({
      namaBatch: "",
      nomorSurat: "",
      skema: "",
      metode: "Offline",
      tipeTuk: "Sewaktu",
      alamat: "UIN Sunan Gunung Djati Bandung",
      tanggal: "",
      waktuMulai: "08:00",
      tuk: "",
      namaAsesor: "",
      suratTugasUrl: "",
      totalKandidat: 0,
      status: "Terjadwal",
      linkVideo: "",
    });
    setSelectedAsesiForJadwal([]);
  };

  const filteredSchedules = schedules.filter(
    (item) =>
      (String(item.namaBatch)
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
        String(item.skema).toLowerCase().includes(searchQuery.toLowerCase())) &&
      (filterStatus === "Semua" || item.status === filterStatus),
  );

  // Used to map apiCompletedAsesis into AsesiPlenoItem format
  const mappedCompletedAssessments: AsesiPlenoItem[] = apiCompletedAsesis.map(
    (p) => ({
      id: p.id,
      nik: p.dataPribadi?.nik || p.user?.profil?.nik || p.nik || "-",
      nama:
        p.user?.profil?.namaLengkap ||
        "Asesi",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      skema: (p.skema as any)?.namaSkema || "Skema Tersertifikasi",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      skemaId: (p.skema as any)?.id || 0,
      asesor: "Asesor LSP",
      rekomendasiAsesor: "K",
      statusPleno: "K",
    }),
  );
  const uniqueskemas =
    availableSkemas.length > 0
      ? availableSkemas.map((s) => s.namaSkema || s.nama_skema || s.nama || "")
      : [
        "Auditor Halal",
        "Jenjang 5 Bidang Kewirausahaan Industri",
        "Melaksanakan Komunikasi Dengan Pemangku Kepentingan",
        "Penerjemah Teks Umum",
        "Penyelia Halal",
      ];

  const [selectedPlenoRole, setSelectedPlenoRole] = useState<string>("Asesor");
  const [previewDocModal, setPreviewDocModal] = useState<{
    name: string;
    url: string;
  } | null>(null);

  const [plenoForm, setPlenoForm] = useState<{
    id?: number;
    batchCode?: string;
    title?: string;
    tanggal: string;
    waktu: string; // diperbaiki dari "waktu" jadi 2 field terpisah
    skema: string;
    alamat: string;
    detailAlamat?: string;
    deskripsi: string;
    plenoAttendees: PlenoAttendee[]; // pakai interface yang sudah ada, bukan inline type
    suratPlenoName?: string;
    suratPlenoUrl?: string;
    linkSuratBeritaPleno?: string;
    linkSuratHasil?: string;
    status?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    asesiList?: any[];
  }>({
    id: undefined,
    batchCode: "",
    title: "",
    tanggal: "",
    waktu: "",
    skema: "",
    alamat: "Ruang Rapat Utama (Offline)",
    detailAlamat: "",
    deskripsi: "",
    plenoAttendees: [],
    suratPlenoName: "",
    suratPlenoUrl: "",
    linkSuratBeritaPleno: "",
    linkSuratHasil: "",
    status: "Terjadwal",
    asesiList: [],
  });

  const isAttendeeSelected = (nama: string, role: Role) => {
    return plenoForm.plenoAttendees.some(
      (a) => a.nama === nama && a.role === role,
    );
  };

  const toggleAttendeeSelection = (userObj: { nama: string; role: Role }) => {
    if (isPreviewMode) return;
    const isSelected = isAttendeeSelected(userObj.nama, userObj.role);
    if (isSelected) {
      setPlenoForm((prev) => ({
        ...prev,
        plenoAttendees: prev.plenoAttendees.filter(
          (a) => !(a.nama === userObj.nama && a.role === userObj.role),
        ),
      }));
    } else {
      setPlenoForm((prev) => ({
        ...prev,
        plenoAttendees: [
          ...prev.plenoAttendees.filter((a) => a.nama.trim() !== ""),
          { role: userObj.role, nama: userObj.nama },
        ],
      }));
    }
  };

  const [selectedAsesiForPleno, setSelectedAsesiForPleno] = useState<
    AsesiPlenoItem[]
  >([]);

  // Available Candidates for plenary session (all completed assessments awaiting decision)
  const availableAsesiForPleno = mappedCompletedAssessments;

  const handleAddPleno = async (e: React.FormEvent) => {
    e.preventDefault();
    if (plenoForm.plenoAttendees.some((a) => a.role === "" || a.nama === "")) {
      alert("Pastikan semua form peserta pleno (Role & Nama) telah diisi.");
      return;
    }
    if (selectedAsesiForPleno.length === 0) {
      alert("Pilih minimal satu asesi untuk disidangkan.");
      return;
    }

    try {
      setIsSubmitting(true);
      const uniqueSkemaIds = [
        ...new Set(
          selectedAsesiForPleno
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .map((a) => Number((a as any).skemaId || 0))
            .filter((id) => id > 0),
        ),
      ];

      const selectedAsesiObjects = mappedCompletedAssessments.filter((a) =>
        selectedAsesiForPleno.some(
          (item) => item.id === a.id || item.nama === a.nama,
        ),
      );

      const selectedskemas = Array.from(
        new Set(selectedAsesiObjects.map((a) => a.skema).filter(Boolean)),
      );

      const skemaLabel =
        selectedskemas.length > 0
          ? selectedskemas.join(", ")
          : plenoForm.skema || "Multi Skema";

      const payload = {
        title: plenoForm.title || `Sidang Pleno ${skemaLabel}`,
        tanggal: plenoForm.tanggal || new Date().toISOString(),
        waktu: plenoForm.waktu
          ? new Date(`1970-01-01T${plenoForm.waktu}:00Z`)
          : new Date(),
        alamat: plenoForm.alamat,
        deskripsi: plenoForm.deskripsi,
        status: "Terjadwal",
        skema_ids: uniqueSkemaIds,
      };

      if (isEditMode && editId !== null) {
        await updatePleno(editId, payload);
        showNotification("Berhasil memperbarui sidang pleno", "success");
      } else {
        const result = await createPleno(payload);
        const newPlenoId = result.id;

        // Add asesi
        if (selectedAsesiForPleno.length > 0) {
          await addPlenoAsesi(
            newPlenoId,
            selectedAsesiForPleno.map((a) => a.id),
          );
        }

        // Add attendees
        for (const attendee of plenoForm.plenoAttendees) {
          if (attendee.nama.trim() !== "") {
            await addPlenoAttendee(newPlenoId, {
              role: attendee.role,
              nama: attendee.nama,
            });
          }
        }
        showNotification(
          "Berhasil membuat jadwal sidang pleno baru",
          "success",
        );
      }

      await fetchJadwalData();
      setIsPlenoModalOpen(false);
      setPlenoForm({
        id: undefined,
        batchCode: "",
        title: "",
        tanggal: "",
        waktu: "",
        skema: "",
        alamat: "Ruang Rapat Utama (Offline)",
        detailAlamat: "",
        deskripsi: "",
        plenoAttendees: [],
        suratPlenoName: "",
        suratPlenoUrl: "",
        linkSuratBeritaPleno: "",
        linkSuratHasil: "",
        status: "Terjadwal",
        asesiList: [],
      });
      setSelectedAsesiForPleno([]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      showNotification(
        error.message || "Gagal menyimpan jadwal pleno",
        "error",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredPleno = plenoSessions.filter(
    (item) =>
      (String(item.id).toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.skema.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (filterStatus === "Semua" || item.status === filterStatus),
  );

  if (isModalOpen) {
    const availableAsesi = apiAvailableAsesis
      .filter((a) => {
        const namaSkema =
          typeof a.skema === "object" ? a.skema?.namaSkema || a.skema?.nama || "" : a.skema || "";
        const matchskema = !formData.skema || namaSkema === formData.skema;
        return matchskema;
      })
      .map((a) => ({
        id: a.id,
        nama:
          (a.user?.profil?.namaLengkap && a.user.profil.namaLengkap.trim() !== "")
            ? a.user.profil.namaLengkap
            : (a.dataPribadi?.namaLengkap && a.dataPribadi.namaLengkap.trim() !== "")
              ? a.dataPribadi.namaLengkap
              : a.user?.username || a.nama || "Asesi",
        skema:
          typeof a.skema === "object" ? a.skema?.namaSkema || a.skema?.nama || "" : a.skema || "",
        metode: a.jenisMetode || a.metode || "Offline",
        nik: a.user?.profil?.nik || a.nik || "",
      }))
      .sort((a, b) => a.nama.localeCompare(b.nama));
    const selectedTuk = availableTuks.find((t) => t.id === Number(formData.tuk) || t.nama === formData.tuk);
    const kapasitas = selectedTuk?.kapasitas || 0;

    return (
      <div className="pt-4 sm:pt-6 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsModalOpen(false)}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-[#008BE3] bg-[#008BE3]/10 hover:bg-[#008BE3]/20 transition-colors cursor-pointer shrink-0"
            title="Kembali"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="min-w-0">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Buat Jadwal Baru
            </h1>
            <p className="text-sm text-slate-500 mt-1 font-medium">
              Buat jadwal asesmen baru untuk batch asesi
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden">
          <div className="p-8 space-y-8">
            <h2 className="text-base font-black text-slate-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-sky-50 text-[#008BE3] flex items-center justify-center shrink-0">
                1
              </span>
              Jadwal Asesmen
            </h2>
            {/* 1. Nama Batch, 2. Skema Sertifikasi, 3. Metode Pelaksanaan */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="min-w-0">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  1. Judul Pleno
                </label>
                <input
                  type="text"
                  placeholder="Contoh: BATCH-IT-2026-005"
                  value={formData.namaBatch}
                  onChange={(e) =>
                    setFormData({ ...formData, namaBatch: e.target.value })
                  }
                  disabled={isPreviewMode}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40 font-medium text-slate-900"
                />
              </div>
              <div className="min-w-0">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  2. Skema Sertifikasi
                </label>
                <select
                  value={formData.skema}
                  disabled={isPreviewMode}
                  onChange={(e) => {
                    setFormData({ ...formData, skema: e.target.value });
                    setSelectedAsesiForJadwal([]); // Reset selected asesi on skema change
                  }}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40 bg-white font-medium text-slate-900"
                >
                  <option value="">Pilih Skema</option>
                  {uniqueskemas.map((skema: string) => (
                    <option key={skema} value={skema}>
                      {skema}
                    </option>
                  ))}
                </select>
              </div>
              <div className="min-w-0">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  3. Metode Pelaksanaan
                </label>
                <select
                  value={formData.metode || "Offline"}
                  disabled={isPreviewMode}
                  onChange={(e) => {
                    setFormData({ ...formData, metode: e.target.value });
                    setSelectedAsesiForJadwal([]); // Reset selected asesi on metode change
                  }}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40 bg-white font-bold text-[#008BE3]"
                >
                  <option value="Offline">Offline (TUK Fisik)</option>
                  <option value="Online">Online (Daring)</option>
                </select>
              </div>

              {formData.metode === "Online" && (
                <div className="min-w-0 md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Link Meeting Online (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: https://zoom.us/j/..."
                    value={formData.linkVideo || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, linkVideo: e.target.value })
                    }
                    disabled={isPreviewMode}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40 font-medium text-slate-900"
                  />
                </div>
              )}

              {/* 4. Jenis TUK & 5. Alamat TUK */}
              <div className="min-w-0">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  4. Jenis TUK
                </label>
                <select
                  value={formData.tipeTuk}
                  disabled={isPreviewMode}
                  onChange={(e) =>
                    setFormData({ ...formData, tipeTuk: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40 bg-white font-medium text-slate-900"
                >
                  1  <option value="">Pilih Jenis TUK</option>
                  <option value="Sewaktu">Sewaktu</option>
                  <option value="Mandiri">Mandiri</option>
                  <option value="Tempat Kerja">Tempat Kerja</option>
                </select>
              </div>
              <div className="min-w-0">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  5. Alamat TUK
                </label>
                <input
                  type="text"
                  placeholder="Contoh: UIN Sunan Gunung Djati Bandung"
                  value={formData.alamat}
                  onChange={(e) =>
                    setFormData({ ...formData, alamat: e.target.value })
                  }
                  disabled={isPreviewMode}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40 bg-white font-medium text-slate-900"
                />
              </div>

              {/* 6. Tanggal Uji & 7. Jam Pelaksanaan */}
              <div className="min-w-0">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  6. Tanggal Uji
                </label>
                <input
                  type="date"
                  value={formData.tanggal}
                  onChange={(e) =>
                    setFormData({ ...formData, tanggal: e.target.value })
                  }
                  disabled={isPreviewMode}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40 font-medium text-slate-900"
                />
              </div>
              <div className="min-w-0">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  7. Jam Pelaksanaan (Mulai)
                </label>
                <input
                  type="time"
                  value={formData.waktuMulai || "08:00"}
                  onChange={(e) => {
                    const newStart = e.target.value;
                    setFormData({
                      ...formData,
                      waktuMulai: newStart,
                    });
                  }}
                  disabled={isPreviewMode}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40 font-medium text-slate-900 bg-white"
                />
              </div>

              {/* 8. Spesifikasi Ruang TUK & 9. Asesor Ditugaskan */}
              <div className="min-w-0">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  8. Spesifikasi Ruang TUK
                </label>
                <select
                  value={formData.tuk}
                  disabled={isPreviewMode}
                  onChange={(e) =>
                    setFormData({ ...formData, tuk: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40 bg-white font-medium text-slate-900"
                >
                  <option value="">Pilih Gedung / Spesifikasi Ruangan</option>
                  {availableTuks.map((tuk) => (
                    <option key={tuk.id} value={tuk.nama}>
                      {tuk.nama}
                    </option>
                  ))}
                </select>
              </div>
              <div className="min-w-0">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  9. Asesor Ditugaskan
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User size={18} className="text-slate-400" />
                  </div>
                  <select
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40 bg-white font-medium text-slate-900 shadow-sm appearance-none cursor-pointer"
                    value={formData.namaAsesor}
                    disabled={isPreviewMode}
                    onChange={(e) =>
                      setFormData({ ...formData, namaAsesor: e.target.value })
                    }
                  >
                    <option value="">Pilih Asesor</option>
                    {availableAsesors.map((asesor) => (
                      <option key={asesor.id} value={asesor.profil?.namaLengkap || asesor.username}>
                        {asesor.profil?.namaLengkap || asesor.username}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="min-w-0">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  10. Nomor Surat
                </label>
                <input
                  type="text"
                  placeholder="Contoh: 001/LSP/P1/2026"
                  value={formData.nomorSurat || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, nomorSurat: e.target.value })
                  }
                  disabled={isPreviewMode}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40 font-medium text-slate-900"
                />
              </div>
            </div>

            {/* Field Tautan Link Google Drive Surat Penugasan Asesor */}
            <div className="min-w-0">
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Tautan / Link Google Drive Surat Penugasan Asesor{" "}
                <span className="text-slate-400 font-normal text-xs">
                  (Opsional)
                </span>
              </label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <div className="relative flex-1 flex items-center min-w-0">
                  <input
                    type="url"
                    placeholder="Contoh: https://drive.google.com/file/d/.../view"
                    value={formData.suratTugasUrl || ""}
                    disabled={isPreviewMode}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        suratTugasUrl: e.target.value,
                      })
                    }
                    className="w-full pl-4 pr-28 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40 bg-white placeholder:text-slate-400 font-medium text-slate-900 disabled:bg-slate-50 disabled:text-slate-600"
                  />
                  {formData.suratTugasUrl ? (
                    <a
                      href={formData.suratTugasUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="absolute right-2 px-3.5 py-1.5 bg-[#008BE3] hover:bg-[#0076C2] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shrink-0 shadow-xs"
                    >
                      Buka Link
                    </a>
                  ) : null}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    handleDownloadSuratTugas(
                      formData as unknown as ScheduleItem,
                    )
                  }
                  className="px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 shrink-0 shadow-xs cursor-pointer active:scale-95"
                  title="Generate dan cetak dokumen Surat Penugasan Asesor"
                >
                  <Sparkles size={16} />
                  <span>Generate Surat</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5 font-medium">
                Masukkan tautan/link file dokumen Surat Penugasan Asesor dari
                Google Drive atau klik tombol <strong>Generate Surat</strong> di
                sebelah kanan.
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="min-w-0">
                  <label className="block text-sm font-bold text-slate-700">
                    Pilih Asesi
                  </label>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Menampilkan asesi untuk skema{" "}
                    <span className="font-bold text-slate-900">
                      {formData.skema || "-"}
                    </span>{" "}
                    dengan metode{" "}
                    <span className="font-bold text-[#008BE3]">
                      {formData.metode || "Offline"}
                    </span>
                  </p>
                  {formData.tuk && (
                    <p className="text-xs text-slate-500 mt-0.5">
                      Kapasitas TUK:{" "}
                      <span className="font-bold text-slate-900">
                        {kapasitas}
                      </span>{" "}
                      orang
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    onClick={() => {
                      if (isPreviewMode) return;
                      if (availableAsesi.length > 0 && formData.tuk) {
                        const maxAllowed = Math.min(
                          availableAsesi.length,
                          kapasitas,
                        );
                        setSelectedAsesiForJadwal(
                          availableAsesi.slice(0, maxAllowed).map((a) => a.id),
                        );
                      }
                    }}
                    className="text-xs font-bold text-[#008BE3] hover:text-[#0076C2] transition-colors"
                  >
                    Pilih Maksimal (
                    {kapasitas > 0
                      ? Math.min(availableAsesi.length, kapasitas)
                      : 0}
                    )
                  </button>
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-md ${selectedAsesiForJadwal.length > kapasitas && kapasitas > 0 ? "bg-red-50 text-red-600" : "bg-slate-100 text-slate-500"}`}
                  >
                    {selectedAsesiForJadwal.length} asesi terpilih
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-75 overflow-y-auto pr-2 pb-2">
                {!formData.skema ? (
                  <div className="col-span-1 md:col-span-2 text-center py-8 text-slate-500 text-sm border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                    Pilih skema sertifikasi terlebih dahulu.
                  </div>
                ) : availableAsesi.length === 0 ? (
                  <div className="col-span-1 md:col-span-2 text-center py-8 text-slate-500 text-sm border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                    Tidak ada asesi yang tersedia untuk skema{" "}
                    <span className="font-bold text-slate-800">
                      {formData.skema}
                    </span>{" "}
                    dengan metode{" "}
                    <span className="font-bold text-[#008BE3]">
                      {formData.metode || "Offline"}
                    </span>
                    .
                  </div>
                ) : (
                  availableAsesi.map((asesi) => {
                    const isSelected = selectedAsesiForJadwal.some(
                      (id) => String(id) === String(asesi.id),
                    );
                    const isDisabled =
                      !isSelected &&
                      selectedAsesiForJadwal.length >= kapasitas &&
                      kapasitas > 0;
                    const asesiMethod = asesi.metode || "Offline";

                    return (
                      <div
                        key={asesi.id}
                        onClick={() => {
                          if (isPreviewMode) return;
                          if (isDisabled || isPreviewMode) return;
                          const newIds = isSelected
                            ? selectedAsesiForJadwal.filter(
                              (id) => String(id) !== String(asesi.id),
                            )
                            : [...selectedAsesiForJadwal, asesi.id];
                          setSelectedAsesiForJadwal(newIds);
                        }}
                        className={`p-4 rounded-xl border transition-all flex items-center gap-4 ${isDisabled
                          ? "opacity-50 cursor-not-allowed bg-slate-50 border-gray-200"
                          : "cursor-pointer"
                          } ${isSelected
                            ? "border-[#008BE3] bg-[#008BE3]/5 ring-1 ring-[#008BE3]/20"
                            : isDisabled
                              ? ""
                              : "border-gray-200 hover:border-[#008BE3]/40 hover:bg-slate-50"
                          }`}
                      >
                        <div
                          className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 ${isSelected
                            ? "bg-[#008BE3] border-[#008BE3] text-white"
                            : isDisabled
                              ? "bg-slate-200 border-slate-300"
                              : "border-gray-300"
                            }`}
                        >
                          {isSelected && (
                            <CheckSquare size={14} className="stroke-3" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="font-bold text-slate-900 text-sm truncate">
                              {asesi.nama}
                            </h4>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 border ${asesiMethod === "Online"
                                ? "bg-purple-50 text-purple-700 border-purple-200"
                                : "bg-sky-50 text-[#008BE3] border-sky-200"
                                }`}
                            >
                              {asesiMethod}
                            </span>
                          </div>
                          {asesi.nik && (
                            <p className="text-xs text-slate-500 mt-0.5">
                              NIK: {asesi.nik}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
          <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50/50">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-2.5 text-sm font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer"
            >
              {isPreviewMode ? "Kembali" : "Batal"}
            </button>
            {!isPreviewMode && (
              <button
                onClick={handleAddSchedule}
                disabled={
                  !formData.namaBatch ||
                  !formData.skema ||
                  !formData.tanggal ||
                  !formData.namaAsesor ||
                  !formData.tuk ||
                  selectedAsesiForJadwal.length === 0
                }
                className="px-6 py-2.5 text-sm font-bold text-white bg-[#008BE3] hover:bg-[#0076C2] rounded-xl transition-colors shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Simpan Jadwal
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (isPlenoModalOpen) {
    return (
      <div className="pt-4 sm:pt-6 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsPlenoModalOpen(false)}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-[#008BE3] bg-[#008BE3]/10 hover:bg-[#008BE3]/20 transition-colors cursor-pointer shrink-0"
            title="Kembali"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="min-w-0">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Jadwalkan Sidang Pleno
            </h1>
            <p className="text-sm text-slate-500 mt-1 font-medium">
              Buat jadwal sidang pleno baru untuk penetapan kelulusan
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden">
          <div className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="min-w-0">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Nama Batch/Grup
                </label>
                <input
                  type="text"
                  value={plenoForm.title || ""}
                  onChange={(e) =>
                    setPlenoForm({ ...plenoForm, title: e.target.value })
                  }
                  disabled={isPreviewMode}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40 font-medium text-slate-900"
                  placeholder="Contoh: BATCH-IT-2026-005"
                />
              </div>
              <div className="min-w-0">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Tanggal Pelaksanaan Pleno
                </label>
                <input
                  type="text"
                  value={plenoForm.tanggal}
                  onChange={(e) =>
                    setPlenoForm({ ...plenoForm, tanggal: e.target.value })
                  }
                  disabled={isPreviewMode}
                  placeholder="Contoh: 25 - 27 Februari 2026"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40 font-medium text-slate-900"
                />
              </div>
              <div className="min-w-0">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Alamat Sidang Pleno
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Gedung Al-Jamiah / Lab Komputer / Online"
                  value={plenoForm.alamat}
                  onChange={(e) =>
                    setPlenoForm({ ...plenoForm, alamat: e.target.value })
                  }
                  disabled={isPreviewMode}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40 font-medium text-slate-900"
                />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <label className="block text-sm font-bold text-slate-800">
                    Pilih Asesi Sidang Pleno
                  </label>
                  <p className="text-xs text-slate-500">
                    Menampilkan seluruh asesi dengan status pengajuan menunggu
                    sidang pleno
                  </p>
                </div>
                <span className="text-xs font-bold text-[#008BE3] bg-[#008BE3]/10 px-2.5 py-1 rounded-md self-start sm:self-auto shrink-0">
                  {selectedAsesiForPleno.length} asesi terpilih
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-75 overflow-y-auto pr-2 pb-2">
                {availableAsesiForPleno.length === 0 ? (
                  <div className="col-span-full text-center py-8 text-slate-500 text-sm border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                    Tidak ada asesi dengan status pengajuan menunggu pleno.
                  </div>
                ) : (
                  availableAsesiForPleno.map((asesi) => {
                    const isSelected = selectedAsesiForPleno.some(
                      (a) => a.id === asesi.id || a.nama === asesi.nama,
                    );
                    return (
                      <div
                        key={asesi.id}
                        onClick={() => {
                          if (isPreviewMode) return;

                          const newItems: AsesiPlenoItem[] = isSelected
                            ? selectedAsesiForPleno.filter(
                              (item) =>
                                item.id !== asesi.id &&
                                item.nama !== asesi.nama,
                            )
                            : [
                              ...selectedAsesiForPleno,
                              {
                                id: asesi.id,
                                nik:
                                  (asesi as { nik?: string }).nik ||
                                  asesi.nik ||
                                  "-",
                                nama: asesi.nama,
                                skema: asesi.skema,
                                asesor:
                                  typeof asesi.asesor === "string"
                                    ? asesi.asesor
                                    : (
                                      asesi.asesor as unknown as {
                                        nama?: string;
                                      }
                                    )?.nama || "Asesor LSP",
                                rekomendasiAsesor:
                                  asesi.statusPleno === "Kompeten"
                                    ? "K"
                                    : "BK",
                                statusPleno:
                                  asesi.statusPleno === "Kompeten"
                                    ? "K"
                                    : "BK",
                              },
                            ];

                          setSelectedAsesiForPleno(newItems);
                        }}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center gap-3.5 ${isSelected
                          ? "border-[#008BE3] bg-[#008BE3]/5 ring-1 ring-[#008BE3]/20"
                          : "border-gray-200 hover:border-[#008BE3]/40 hover:bg-slate-50"
                          }`}
                      >
                        <div
                          className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 ${isSelected
                            ? "bg-[#008BE3] border-[#008BE3] text-white"
                            : "border-gray-300"
                            }`}
                        >
                          {isSelected && (
                            <CheckSquare size={14} className="stroke-3" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="font-bold text-slate-900 text-sm truncate">
                              {asesi.nama}
                            </h4>
                            {asesi.statusPleno && (
                              <span
                                className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${asesi.statusPleno === "Kompeten"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-amber-100 text-amber-700"
                                  }`}
                              >
                                {asesi.statusPleno}
                              </span>
                            )}
                          </div>
                          <p
                            className="text-xs text-[#008BE3] font-semibold truncate mt-0.5"
                            title={asesi.skema}
                          >
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
                  <label className="block text-sm font-bold text-slate-800">
                    Daftar Peserta Sidang Pleno
                  </label>
                  <p className="text-xs text-slate-500">
                    Pilih peran/jabatan lalu centang nama user yang bertugas
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-slate-600 shrink-0">
                    Filter Peran:
                  </label>
                  <select
                    value={selectedPlenoRole}
                    onChange={(e) => setSelectedPlenoRole(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-xs font-bold outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40 bg-white"
                  >
                    <option value="Asesor">Asesor</option>
                    <option value="Direktur">Direktur</option>
                    <option value="dewan_pengarah">dewan_pengarah</option>
                    <option value="komite_skema">komite_skema</option>
                    <option value="Manajer Administrasi dan Keuangan">
                      Manajer Administrasi dan Keuangan
                    </option>
                    <option value="Manajer Standardisasi">
                      Manajer Standardisasi
                    </option>
                    <option value="Manajer Manajemen Mutu">
                      Manajer Manajemen Mutu
                    </option>
                    <option value="Manajer Sertifikasi">
                      Manajer Sertifikasi
                    </option>
                    <option value="Semua Peran">Semua Peran</option>
                  </select>
                </div>
              </div>

              {/* Selected attendees tags */}
              {plenoForm.plenoAttendees.filter((a) => a.nama.trim() !== "")
                .length > 0 && (
                  <div className="p-3 bg-sky-50/50 border border-sky-100 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">
                        Peserta Terpilih (
                        {
                          plenoForm.plenoAttendees.filter(
                            (a) => a.nama.trim() !== "",
                          ).length
                        }
                        ):
                      </span>
                      {!isPreviewMode && (
                        <button
                          type="button"
                          onClick={() =>
                            setPlenoForm((prev) => ({
                              ...prev,
                              plenoAttendees: [],
                            }))
                          }
                          className="text-[11px] text-red-500 hover:underline font-semibold cursor-pointer"
                        >
                          Hapus Semua
                        </button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {plenoForm.plenoAttendees
                        .filter((a) => a.nama.trim() !== "")
                        .map((att, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#008BE3]/30 text-[#008BE3] rounded-lg text-xs font-bold shadow-2xs"
                          >
                            <span className="text-slate-500 font-normal">
                              [{att.role}]
                            </span>{" "}
                            {att.nama}
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

              {/* Checkbox grid of user Candidates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-65 overflow-y-auto pr-1">
                {(() => {
                  const mergedUsers = availableUsers.map((u) => {
                    let mappedRole = u.role;
                    if (mappedRole) {
                      const lower = mappedRole.toLowerCase();
                      if (lower === "asesor") mappedRole = "Asesor";
                      else if (lower === "direktur") mappedRole = "Direktur";
                      else if (lower === "dewan_pengarah")
                        mappedRole = "dewan_pengarah";
                      else if (lower === "komite_skema")
                        mappedRole = "komite_skema";
                      else if (lower === "manajer")
                        mappedRole = "Manajer Administrasi dan Keuangan";
                      else
                        mappedRole =
                          mappedRole.charAt(0).toUpperCase() +
                          mappedRole.slice(1);
                    }
                    return {
                      id: `usr-${u.id}`,
                      nama:
                        u.profil?.namaLengkap || u.nama || u.username || "-",
                      role: (mappedRole || "Asesor") as Role,
                    };
                  });
                  plenoForm.plenoAttendees.forEach((att) => {
                    if (
                      att.nama.trim() &&
                      !mergedUsers.some(
                        (u) => u.nama === att.nama && u.role === att.role,
                      )
                    ) {
                      mergedUsers.push({
                        id: `custom-${att.role}-${att.nama}`,
                        nama: att.nama,
                        role: att.role as Role,
                      });
                    }
                  });

                  const filtered =
                    selectedPlenoRole === "Semua Peran"
                      ? mergedUsers
                      : mergedUsers.filter((u) => u.role === selectedPlenoRole);

                  if (filtered.length === 0) {
                    return (
                      <div className="col-span-full text-center py-6 text-slate-500 text-xs border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                        Tidak ada user terdaftar untuk peran {selectedPlenoRole}
                        .
                      </div>
                    );
                  }

                  return filtered.map((usr) => {
                    const selected = isAttendeeSelected(
                      usr.nama,
                      usr.role as Role,
                    );
                    return (
                      <div
                        key={usr.id}
                        onClick={() => toggleAttendeeSelection(usr)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${selected
                          ? "border-[#008BE3] bg-[#008BE3]/5 ring-1 ring-[#008BE3]/20"
                          : "border-gray-200 hover:border-[#008BE3]/40 hover:bg-slate-50"
                          }`}
                      >
                        <div
                          className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 ${selected
                            ? "bg-[#008BE3] border-[#008BE3] text-white"
                            : "border-gray-300"
                            }`}
                        >
                          {selected && (
                            <CheckSquare size={14} className="stroke-3" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-slate-900 text-sm truncate">
                            {usr.nama}
                          </h4>
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
            <button
              onClick={() => setIsPlenoModalOpen(false)}
              className="px-6 py-2.5 text-sm font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition-colors"
            >
              {isPreviewMode ? "Kembali" : "Batal"}
            </button>
            {!isPreviewMode && (
              <button
                onClick={handleAddPleno}
                disabled={
                  selectedAsesiForPleno.length === 0 || !plenoForm.tanggal
                }
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
    <div className="space-y-6 pb-24 text-sm text-gray-700">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-[#008BE3]/10 flex items-center justify-center text-[#008BE3] border border-[#008BE3]/20 shadow-xs shrink-0">
            <Calendar size={20} className="stroke-[2.5]" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none mb-1 md:whitespace-nowrap">
              {isPlenoOnlyRole ? "Jadwal Sidang Pleno" : "Jadwal & Penugasan"}
            </h1>
            <p className="text-xs text-gray-400 font-bold tracking-wider uppercase leading-4 md:whitespace-nowrap">
              {isPlenoOnlyRole
                ? "Melihat jadwal sidang pleno penetapan kelulusan yang dijadwalkan oleh admin"
                : "Kelola jadwal asesmen dan sidang pleno penetapan kelulusan"}
            </p>
          </div>
        </div>
      </div>

      {!isPlenoOnlyRole && (
        <div className="bg-white p-1 rounded-xl shadow-xs border border-gray-100 flex items-center w-full max-w-sm">
          <button
            onClick={() => setActiveTab("asesmen")}
            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === "asesmen" ? "bg-[#008BE3] text-white shadow-xs" : "text-slate-500 hover:text-slate-800"}`}
          >
            Jadwal Asesmen
          </button>
          <button
            onClick={() => setActiveTab("pleno")}
            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === "pleno" ? "bg-[#008BE3] text-white shadow-xs" : "text-slate-500 hover:text-slate-800"}`}
          >
            Sidang Pleno
          </button>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-xs border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="min-w-0">
            <h3 className="text-base font-black text-slate-900">Cari Jadwal</h3>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 w-full lg:w-auto ml-auto">
            <div className="flex items-center gap-2 bg-gray-50/80 rounded-lg px-3 h-10.5 w-full sm:w-68 border border-gray-200/50 focus-within:border-[#008BE3]/40 transition-colors">
              <Search className="text-gray-400" size={16} />
              <input
                type="text"
                placeholder={
                  activeTab === "asesmen" ? "Cari batch..." : "Cari skema..."
                }
                className="bg-transparent border-none focus:ring-0 text-[14px] w-full outline-none text-gray-700 placeholder-gray-400 font-semibold"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="relative z-50">
              <button
                onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                className="items-center justify-center gap-2 px-3 h-10.5 sm:px-4 bg-gray-50 border border-gray-200/50 text-gray-700 rounded-lg text-[14px] font-bold cursor-pointer hover:bg-gray-100 transition-colors flex shrink-0"
              >
                <Filter size={16} />{" "}
                <span className="hidden sm:inline">Filter</span>{" "}
                {filterStatus !== "Semua" && (
                  <span className="bg-[#008BE3] text-white text-[10px] px-1.5 py-0.5 rounded-full">
                    {filterStatus}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {isFilterDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50"
                  >
                    <div className="p-2 space-y-1">
                      {["Semua", "Terjadwal", "Dikonfirmasi"].map((status) => (
                        <button
                          key={status}
                          onClick={() => {
                            setFilterStatus(status);
                            setIsFilterDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === status ? "bg-[#008BE3]/10 text-[#008BE3]" : "text-gray-700 hover:bg-gray-50"}`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {activeTab === "asesmen" && !readOnly && (
              <button
                onClick={() => {
                  setIsPreviewMode(false);
                  setIsEditMode(false);
                  setFormData({
                    namaBatch: "",
                    nomorSurat: "",
                    skema: "",
                    metode: "Offline",
                    tipeTuk: "Sewaktu",
                    alamat: "UIN Sunan Gunung Djati Bandung",
                    tanggal: "",
                    linkVideo: "",
                    waktuMulai: "08:00",
                    tuk: "",
                    totalKandidat: 0,
                    namaAsesor: "",
                    suratTugasUrl: "",
                    status: "Terjadwal",
                  });
                  setSelectedAsesiForJadwal([]);
                  setIsModalOpen(true);
                }}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 sm:px-4 sm:gap-2 bg-[#008BE3] text-white rounded-lg text-sm font-bold shadow-xs hover:bg-[#0076C2] transition-colors shrink-0 cursor-pointer"
              >
                <Plus size={16} className="stroke-[2.5]" />{" "}
                <span className="hidden sm:inline">Buat Jadwal Baru</span>
                <span className="sm:hidden">Baru</span>
              </button>
            )}
            {activeTab === "pleno" && !readOnly && (
              <button
                onClick={() => {
                  setIsPreviewMode(false);
                  setIsEditMode(false);
                  setPlenoForm({
                    id: undefined,
                    batchCode: "",
                    tanggal: "",
                    waktu: "",
                    skema: "",
                    alamat: "Ruang Rapat Utama (Offline)",
                    deskripsi: "",
                    plenoAttendees: [{ role: "", nama: "" }],
                    suratPlenoName: "",
                  });
                  setSelectedAsesiForPleno([]);
                  setIsPlenoModalOpen(true);
                }}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 sm:px-4 sm:gap-2 bg-[#008BE3] text-white rounded-lg text-sm font-bold shadow-xs hover:bg-[#0076C2] transition-colors shrink-0 cursor-pointer"
              >
                <Plus size={16} className="stroke-[2.5]" />{" "}
                <span className="hidden sm:inline">Buat Sidang Pleno</span>
                <span className="sm:hidden">Pleno</span>
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto relative ">
          {activeTab === "asesmen" && (
            <table className="w-full text-left border-collapse min-w-[1600px]">
              <thead>
                <tr className="bg-[#0F172A] border-b border-[#0F172A]">
                  <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-left min-w-87.5 max-w-125 sticky top-0 z-20 bg-[#0F172A]">
                    Skema Sertifikasi
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-left min-w-30 sticky top-0 z-20 bg-[#0F172A]">
                    Metode
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-left min-w-30 sticky top-0 z-20 bg-[#0F172A]">
                    TUK
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-left min-w-75 sticky top-0 z-20 bg-[#0F172A]">
                    Alamat TUK
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-left min-w-45 sticky top-0 z-20 bg-[#0F172A]">
                    Tanggal Uji
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-left min-w-48 sticky top-0 z-20 bg-[#0F172A]">
                    Jam Pelaksanaan
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-left min-w-50 sticky top-0 z-20 bg-[#0F172A]">
                    Spesifikasi Ruang TUK
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-left min-w-62.5 sticky top-0 z-20 bg-[#0F172A]">
                    Asesor Ditugaskan
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-left min-w-50 sticky top-0 z-20 bg-[#0F172A]">
                    Surat Penugasan
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-left min-w-40 sticky top-0 z-20 bg-[#0F172A]">
                    Total Asesi
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-left sticky right-0 bg-[#0F172A] z-30 border-l border-white/10 shadow-[-6px_0_15px_-4px_rgba(0,0,0,0.06)] backdrop-blur-xs min-w-40 top-0">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/60">
                {isJadwalLoading ? (
                  <tr>
                    <td
                      colSpan={12}
                      className="px-6 py-16 text-center text-slate-400"
                    >
                      <div className="flex flex-col items-center justify-center gap-3">
                        <Loader2
                          className="animate-spin text-[#008BE3]"
                          size={32}
                        />
                        <p className="text-sm font-semibold text-slate-600">
                          Memuat data jadwal asesmen...
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <>
                    {filteredSchedules
                      .filter(
                        (s) =>
                          s.status !== "Menunggu Pleno" &&
                          s.status !== "Selesai",
                      )
                      .map((item) => (
                        <tr
                          key={item.id}
                          className="group/row hover:bg-[#F9FAFC] transition-colors"
                        >

                          {/* 2. Skema Sertifikasi */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-[14px] font-semibold text-slate-700 whitespace-nowrap">
                              {item.skema || "-"}
                            </div>
                          </td>

                          {/* 2.5 Metode */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-block text-[11px] font-bold px-2.5 py-1 rounded-md border ${(item.metode || item.metode) === "Online"
                                ? "bg-purple-50 text-purple-700 border-purple-200"
                                : "bg-sky-50 text-[#008BE3] border-sky-200"
                                }`}
                            >
                              {item.metode || item.metode || "Offline"}
                            </span>
                          </td>

                          {/* 3. Jenis TUK */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[13px] font-bold bg-slate-100 text-slate-700 border border-slate-200/80 whitespace-nowrap">
                              {item.tipeTuk || "Sewaktu"}
                            </span>
                          </td>

                          {/* 4. Alamat TUK */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-1.5 text-[14px] font-medium text-slate-700 whitespace-nowrap">
                              <MapPin
                                size={16}
                                className="text-slate-400 shrink-0"
                              />
                              <span className="whitespace-nowrap">
                                {item.alamat ||
                                  "UIN Sunan Gunung Djati Bandung"}
                              </span>
                            </div>
                          </td>

                          {/* 5. Tanggal Uji */}
                          <td className="px-6 py-4 whitespace-nowrap text-[14px] font-semibold text-slate-600">
                            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                              <Calendar
                                size={14}
                                className="text-slate-400 shrink-0"
                              />
                              {item.tanggal}
                            </span>
                          </td>

                          {/* 6. Jam Pelaksanaan */}
                          <td className="px-6 py-4 whitespace-nowrap text-[14px] font-semibold text-slate-700">
                            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                              <Clock
                                size={14}
                                className="text-slate-400 shrink-0"
                              />
                              {item.waktuMulai
                                ? `${item.waktuMulai} WIB`
                                : item.waktuMulai || "08:00 WIB"}
                            </span>
                          </td>

                          {/* 7. Spesifikasi Ruang TUK */}
                          <td className="px-6 py-4 whitespace-nowrap text-[14px] font-medium text-slate-700">
                            <div className="font-medium text-slate-900 truncate">
                              {item.alamat}
                            </div>
                          </td>

                          {/* 8. Asesor Ditugaskan */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2 whitespace-nowrap">
                              <span className="text-[14px] font-bold text-slate-800 whitespace-nowrap">
                                {item.namaAsesor || "-"}
                              </span>
                            </div>
                          </td>

                          {/* 9. Surat Penugasan */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.suratTugasUrl ? (
                              item.suratTugasUrl.startsWith("http") ? (
                                <a
                                  href={item.suratTugasUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-bold text-[#008BE3] bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg transition-colors whitespace-nowrap"
                                  title="Buka Link Google Drive Penugasan"
                                >
                                  <FileText
                                    size={14}
                                    className="shrink-0 text-[#008BE3]"
                                  />
                                  <span className="whitespace-nowrap">
                                    Link Drive
                                  </span>
                                </a>
                              ) : (
                                <a
                                  href={item.suratTugasUrl.startsWith("/") ? item.suratTugasUrl : `/${item.suratTugasUrl}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg whitespace-nowrap cursor-pointer transition-colors"
                                >
                                  <FileText size={14} className="shrink-0" />
                                  <span className="whitespace-nowrap truncate max-w-xs" title={item.suratTugasUrl}>
                                    Buka File
                                  </span>
                                </a>
                              )
                            ) : (
                              <span className="text-[14px] text-slate-400 italic whitespace-nowrap">
                                Belum Ada
                              </span>
                            )}
                          </td>

                          {/* 10. Total Asesi */}
                          <td className="px-6 py-4 whitespace-nowrap text-[14px] font-bold text-slate-700">
                            <span className="whitespace-nowrap">
                              {item.totalKandidat ||
                                item.asesiList?.length ||
                                0}{" "}
                              Asesi
                            </span>
                          </td>

                          {/* 11. Aksi (Detail, Edit, Hapus) */}
                          <td className="px-6 py-4 text-center sticky right-0 bg-white group-hover/row:bg-[#F9FAFC] z-10 border-l border-gray-100 shadow-[-6px_0_15px_-4px_rgba(0,0,0,0.06)] transition-colors">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handlePreviewAsesmen(item)}
                                className="px-3 py-1.5 text-xs font-bold text-[#008BE3] bg-sky-50 hover:bg-[#008BE3] hover:text-white border border-sky-200 rounded-lg transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-2xs"
                                title="Detail"
                              >
                                <Eye size={14} />
                                <span>Detail</span>
                              </button>
                              {!readOnly && (
                                <>
                                  <button
                                    onClick={() => handleEditAsesmen(item)}
                                    className="px-3 py-1.5 text-xs font-bold text-amber-600 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                                    title="Edit"
                                  >
                                    <FileEdit size={14} />
                                    <span>Edit</span>
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeleteSchedule(item.id)
                                    }
                                    className="px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                                    title="Hapus"
                                  >
                                    <Trash2 size={14} />
                                    <span>Hapus</span>
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    {filteredSchedules.filter(
                      (s) =>
                        s.status !== "Menunggu Pleno" && s.status !== "Selesai",
                    ).length === 0 && (
                        <tr>
                          <td
                            colSpan={11}
                            className="px-6 py-12 text-center text-xs md:text-sm text-gray-400 font-medium"
                          >
                            Tidak ada jadwal asesmen aktif.
                          </td>
                        </tr>
                      )}
                  </>
                )}
              </tbody>
            </table>
          )}

          {activeTab === "pleno" && (
            <table className="w-full text-left border-collapse min-w-300">
              <thead>
                <tr className="bg-[#0F172A] border-b border-[#0F172A]">
                  <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-left whitespace-nowrap min-w-75 sticky top-0 z-20 bg-[#0F172A]">
                    Nama Sidang Pleno
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-left whitespace-nowrap min-w-45 sticky top-0 z-20 bg-[#0F172A]">
                    Tanggal Pelaksanaan
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-left whitespace-nowrap min-w-30 sticky top-0 z-20 bg-[#0F172A]">
                    TUK
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-left whitespace-nowrap min-w-50 sticky top-0 z-20 bg-[#0F172A]">
                    Alamat TUK
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-left whitespace-nowrap min-w-30 sticky top-0 z-20 bg-[#0F172A]">
                    Total Asesi
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-left whitespace-nowrap min-w-35 sticky top-0 z-20 bg-[#0F172A]">
                    Status Sidang
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-left whitespace-nowrap sticky right-0 bg-[#0F172A] z-30 border-l border-white/10 shadow-[-6px_0_15px_-4px_rgba(0,0,0,0.06)] backdrop-blur-xs min-w-40 top-0">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/60">
                {filteredPleno.length > 0 ? (
                  filteredPleno.map((item) => (
                    <tr
                      key={item.id}
                      className="group/row hover:bg-[#F9FAFC] transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-[14px] font-bold text-slate-900 leading-snug">
                          {item.title ||
                            `Sidang Pleno ${item.skema || item.id}`}
                        </div>
                        {item.skema && (
                          <div className="text-xs text-slate-500 font-medium mt-0.5 truncate max-w-62.5">
                            {item.skema}
                          </div>
                        )}
                        {item.suratPlenoName && (
                          <button
                            type="button"
                            onClick={() =>
                              setPreviewDocModal({
                                name:
                                  item.suratPlenoName || "Surat Sidang Pleno",
                                url: getDocumentPreviewUrl(
                                  item.suratPlenoName,
                                  item.suratPlenoUrl,
                                ),
                              })
                            }
                            className="text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 px-2.5 py-1 rounded-lg inline-flex items-center gap-1.5 mt-1.5 transition-colors cursor-pointer group/doc"
                            title="Klik untuk melihat foto/isi surat"
                          >
                            <FileText
                              size={13}
                              className="shrink-0 text-emerald-600"
                            />
                            <span className="whitespace-nowrap">
                              {item.suratPlenoName}
                            </span>
                            <Eye
                              size={12}
                              className="shrink-0 text-emerald-600 group-hover/doc:scale-110 transition-transform"
                            />
                          </button>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs md:text-sm font-semibold text-gray-600 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar
                            size={13}
                            className="text-gray-400 shrink-0"
                          />
                          {item.tanggal || "-"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-block text-[11px] font-bold px-3 py-1 rounded-full border tracking-wider uppercase ${item.jenisTuk === "Sewaktu"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : item.jenisTuk === "Mandiri"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-blue-50 text-blue-700 border-blue-200"
                            }`}
                        >
                          {item.jenisTuk || "Sewaktu"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs md:text-sm font-medium text-gray-700 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin
                            size={14}
                            className="text-gray-400 shrink-0"
                          />
                          {item.alamat}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs md:text-sm font-bold text-gray-700 text-center">
                        <span>
                          {item.asesiList?.length || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-bold">
                        {item.status === "Selesai" ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle size={12} /> Selesai
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock size={12} /> Terjadwal
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center sticky right-0 bg-white group-hover/row:bg-[#F9FAFC] z-10 border-l border-gray-100 shadow-[-6px_0_15px_-4px_rgba(0,0,0,0.06)] transition-colors">
                        <div className="flex items-center justify-center gap-2">
                          {!readOnly && (
                            <>
                              <button
                                onClick={() => handleEditPleno(item as unknown as PlenoDetailData)}
                                className="px-3 py-1.5 text-xs font-bold text-amber-600 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                                title="Edit"
                              >
                                <Edit size={14} />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => handleDeletePleno(item.id)}
                                className="px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                                title="Hapus"
                              >
                                <Trash2 size={14} />
                                <span>Hapus</span>
                              </button>

                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-xs md:text-sm text-gray-400 font-medium"
                    >
                      Tidak ada jadwal sidang pleno.
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmAsesmenId(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-sm relative z-10 overflow-hidden"
            >
              <div className="p-6">
                <h3 className="font-bold text-slate-900 text-lg mb-2">
                  Konfirmasi Asesmen
                </h3>
                <p className="text-sm text-slate-500">
                  Apakah anda yakin asesmen telah selesai?
                </p>
              </div>
              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50/50">
                <button
                  onClick={() => setConfirmAsesmenId(null)}
                  className="px-4 py-2 text-sm font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleSelesaiSchedule}
                  className="px-4 py-2 text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors shadow-xs"
                >
                  Ya, Selesai
                </button>
              </div>
            </motion.div>
          </div>
        )}



        {/* Lightbox / Preview Modal Surat Sidang Pleno */}
        {previewDocModal !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
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
                    <h3 className="font-bold text-slate-900 text-sm truncate">
                      {previewDocModal.name}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Pratinjau Dokumen / Foto Surat Sidang Pleno
                    </p>
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
              <div className="p-6 overflow-y-auto flex-1 bg-slate-100/80 flex justify-center items-center min-h-75">
                {previewDocModal.url.startsWith("data:image") ||
                  previewDocModal.url.startsWith("http") ? (
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
                <span className="text-xs text-slate-500 font-medium truncate max-w-62.5">
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

        {/* Printable / Generated Modal Surat Penugasan Asesor */}
        {isGeneratePenugasanModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsGeneratePenugasanModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full relative z-10 overflow-hidden flex flex-col max-h-[92vh]"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">
                      Pratinjau Surat Penugasan Asesor
                    </h3>
                    <p className="text-xs text-slate-500">
                      Dokumen Penugasan Resmi Uji Kompetensi
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsGeneratePenugasanModalOpen(false)}
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
                    <h2 className="text-lg font-black uppercase tracking-wider text-slate-900 font-sans">
                      LSP UIN SUNAN GUNUNG DJATI BANDUNG
                    </h2>
                    <p className="text-xs font-semibold text-slate-600 font-sans">
                      Lembaga Sertifikasi Profesi Pihak Pertama (LSP-P1)
                    </p>
                    <p className="text-[10px] text-slate-500 font-sans">
                      Jl. A.H. Nasution No. 105, Cipadung, Cibiru, Kota Bandung,
                      Jawa Barat 40614
                    </p>
                  </div>

                  {/* Judul Surat */}
                  <div className="text-center space-y-1 font-sans">
                    <h3 className="text-base font-black uppercase text-slate-900 underline tracking-wide">
                      SURAT TUGAS ASESOR KOMPETENSI
                    </h3>
                    <p className="text-xs font-bold text-slate-700 font-mono">
                      Nomor: ST/LSP-P1/{formData.namaBatch || "BATCH-01"}/2026
                    </p>
                  </div>

                  {/* Body Text */}
                  <div className="text-xs space-y-4 leading-relaxed font-sans text-slate-800">
                    <p>
                      Ketua Lembaga Sertifikasi Profesi (LSP-P1) UIN Sunan
                      Gunung Djati Bandung dengan ini memberikan tugas penuh
                      kepada Asesor Kompetensi berikut:
                    </p>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                      <div className="grid grid-cols-3 gap-2">
                        <span className="font-bold text-slate-600">
                          Nama Asesor
                        </span>
                        <span className="col-span-2 font-black text-slate-900">
                          {formData.namaAsesor || "Ichsan Taufik"}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <span className="font-bold text-slate-600">
                          Skema Sertifikasi
                        </span>
                        <span className="col-span-2 font-bold text-slate-800">
                          {formData.skema || "Skema Sertifikasi"}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <span className="font-bold text-slate-600">
                          Nama Batch / Asesmen
                        </span>
                        <span className="col-span-2 font-bold text-slate-800">
                          {formData.namaBatch || "-"}
                        </span>
                      </div>
                    </div>

                    <p>
                      Untuk bertugas melaksanakan Uji Kompetensi / Asesmen
                      Mandiri dan Asesmen Lapangan terhadap para peserta (asesi)
                      terdaftar dengan rincian jadwal sebagai berikut:
                    </p>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                      <div className="grid grid-cols-3 gap-2">
                        <span className="font-bold text-slate-600">
                          Tanggal Pelaksanaan
                        </span>
                        <span className="col-span-2 font-bold text-slate-800">
                          {formData.tanggal || "-"}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <span className="font-bold text-slate-600">
                          Waktu Asesmen
                        </span>
                        <span className="col-span-2 font-bold text-slate-800">
                          Pukul {formData.waktuMulai || "08:00"} WIB
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <span className="font-bold text-slate-600">
                          Tempat Uji Kompetensi
                        </span>
                        <span className="col-span-2 font-bold text-slate-800">
                          {formData.tuk || "-"}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <span className="font-bold text-slate-600">
                          Jumlah Asesi
                        </span>
                        <span className="col-span-2 font-bold text-slate-800">
                          {formData.totalKandidat || 0} Orang Asesi
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-600 italic pt-1">
                      Demikian Surat Tugas ini dibuat untuk dilaksanakan
                      sebagaimana mestinya dan penuh tanggung jawab.
                    </p>
                  </div>

                  {/* Tanda Tangan */}
                  <div className="grid grid-cols-2 gap-8 pt-6 text-center font-sans text-xs">
                    <div>
                      <p className="font-bold text-slate-500">
                        Asesor Penerima Tugas
                      </p>
                      <div className="h-16 flex items-center justify-center italic text-slate-400">
                        [ TTD Digital Asesor ]
                      </div>
                      <p className="font-bold underline text-slate-900">
                        {formData.namaAsesor || "Ichsan Taufik"}
                      </p>
                    </div>
                    <div>
                      <p className="font-bold text-slate-500">
                        Direktur / Ketua LSP-P1
                      </p>
                      <div className="h-16 flex items-center justify-center italic text-slate-400">
                        [ CAP STAMPEL & TTD ]
                      </div>
                      <p className="font-bold underline text-slate-900">
                        Gitarja, S.T., M.T.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between shrink-0">
                <span className="text-xs text-slate-500 font-medium">
                  Dokumen Surat Penugasan siap dicetak.
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
                    onClick={() => setIsGeneratePenugasanModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors cursor-pointer"
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
