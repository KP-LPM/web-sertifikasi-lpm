"use client";

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
  Clock,
  FileCheck,
  AlertCircle,
  Sparkles,
  Search,
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
    tanggal: "16-10-2026 s/d 18-10-2026",
    waktu: "09:00 - 11:00 WIB",
    alamat: "Ruang Rapat Utama (Offline)",
    detailAlamat: "Ruang Rapat Utama Gedung A, Lantai 2",
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
      { role: "direktur", nama: "Prof. Dr. H. Ahmad" },
      { role: "dewan pengarah", nama: "Dr. Ir. H. Muhammad Zulkifli, M.T." },
      { role: "komite skema", nama: "Asep Abdul Sahid, M.T." },
    ],
    asesiList: [
      {
        id: "1",
        nik: "1217050001",
        nama: "Ahmad Hidayat",
        skema: "Auditor Halal",
        asesor: "Ichsan Taufik, M.T.",
        rekomendasiAsesor: "K",
        statusPleno: "K",
        catatan: "Dokumen portofolio lengkap dan valid",
      },
      {
        id: "2",
        nik: "1217050002",
        nama: "Budi Pratama",
        skema: "Auditor Halal",
        asesor: "Aceng Abdul Kodir, M.Kom.",
        rekomendasiAsesor: "K",
        statusPleno: "K",
        catatan: "Memenuhi seluruh elemen kriteria kerja",
      },
      {
        id: "3",
        nik: "1217050003",
        nama: "Dina Larasati",
        skema: "Auditor Halal",
        asesor: "Susanti Ainul Fitri, M.T.",
        rekomendasiAsesor: "BK",
        statusPleno: "BK",
        catatan: "Belum melengkapi bukti kerja unit 3",
      },
      {
        id: "4",
        nik: "1217050004",
        nama: "Eko Prasetyo",
        skema: "Auditor Halal",
        asesor: "M Sandi Marta, M.T.",
        rekomendasiAsesor: "K",
        statusPleno: "K",
        catatan: "Hasil wawancara dan observasi memuaskan",
      },
      {
        id: "5",
        nik: "1217050005",
        nama: "Fitri Handayani",
        skema: "Auditor Halal",
        asesor: "Gina Sakinah, M.T.",
        rekomendasiAsesor: "K",
        statusPleno: "K",
        catatan: "Seluruh unit kompetensi terpenuhi",
      },
      {
        id: "6",
        nik: "1217050006",
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
    tanggal: "21-23 Oktober 2026",
    waktu: "13:00 - 15:00 WIB",
    alamat: "Zoom Meeting Room 1 (Online)",
    detailAlamat: "https://zoom.us/j/123456789",

    linkSuratBeritaPleno: "",
    linkSuratHasil: "",
    status: "Belum Ditetapkan",
    plenoAttendees: [
      { role: "direktur", nama: "Prof. Dr. H. Ahmad" },
      { role: "komite skema", nama: "Siti Alia, M.T." },
    ],
    asesiList: [
      {
        id: "7",
        nik: "1217050007",
        nama: "Hendra Setiawan",
        skema: "Jenjang 5 Bidang Kewirausahaan Industri",
        asesor: "Asep Abdul Sahid, M.T.",
        rekomendasiAsesor: "K",
        statusPleno: "K",
      },
      {
        id: "8",
        nik: "1217050008",
        nama: "Indah Permata",
        skema: "Jenjang 5 Bidang Kewirausahaan Industri",
        asesor: "Siti Alia, M.T.",
        rekomendasiAsesor: "K",
        statusPleno: "K",
      },
      {
        id: "9",
        nik: "1217050009",
        nama: "Joko Susilo",
        skema: "Jenjang 5 Bidang Kewirausahaan Industri",
        asesor: "Azmi Fasa, M.Kom.",
        rekomendasiAsesor: "BK",
        statusPleno: "BK",
      },
      {
        id: "10",
        nik: "1217050010",
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
    tanggal: "25 10 2026",
    waktu: "10:00 - 12:00 WIB",
    alamat: "Ruang Rapat Utama (Offline)",

    detailAlamat: "Ruang Sidang Lt. 3 Gedung Rektorat",
    linkSuratBeritaPleno:
      "https://drive.google.com/file/d/berita-pleno-003/view",
    linkSuratHasil: "https://drive.google.com/file/d/3x4y5z/view",
    status: "Selesai",
    plenoAttendees: [
      { role: "direktur", nama: "Prof. Dr. H. Ahmad" },
      { role: "dewan pengarah", nama: "Dr. Ir. H. Muhammad Zulkifli, M.T." },
    ],
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
  },
];

export default function SidangPleno() {
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activeSession, setActiveSession] = useState<PlenoDetailData | null>(
    null,
  );
  const [formData, setFormData] = useState<PlenoDetailData | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
  const [activeDocType] = useState<
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
    handleDownloadBerita();
  };

  const handleDownloadSkPdf = async () => {
    try {
      setIsLoading(true);

      // Data payload (dapat diambil dari state tabel atau form input admin)
      const payload = {
        nomorSk: "001/SKKL/LSPP1UINSGD/XII/2025",
        tanggalPelaksanaan: "16-19 Desember 2025",
        tempatUji: "Kantor LSP P1 UIN Sunan Gunung Djati Bandung",
        lokasiDitetapkan: "Bandung",
        tanggalDitetapkan: "22 Desember 2025",
        namaDirektur: "Prof. Dr. H. Ija Suntana, M. Ag., CLA",
        asesiList: [
          {
            no: 1,
            nama: "Intan Tania",
            skema: "Melaksanakan Komunikasi dengan Pemangku Kepentingan",
            isKompeten: true,
          },
          {
            no: 2,
            nama: "Anggita Firdayanti",
            skema: "Melaksanakan Komunikasi dengan Pemangku Kepentingan",
            isKompeten: true,
          },
          {
            no: 3,
            nama: "Mila Fajariah",
            skema: "Auditor Halal",
            isKompeten: true,
          },
        ],
      };

      const response = await fetch("/api/surat/hasilsidangpleno", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Gagal mendownload PDF");

      // Convert response stream menjadi blob file dan picu browser download
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `SK_Hasil_Uji_Kompetensi_${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Error saat download SK:", error);
      alert("Terjadi kesalahan saat membuat dokumen PDF.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadBerita = async () => {
    try {
      setIsLoading(true);

      // Data fallback jika tidak dipassing lewat props
      const payloadBeritaAcara = {
        tanggalPleno: "22 Desember tahun 2025",
        tanggalPelaksanaan: "16-19 Desember 2025",
        totalAsesi: 30,
        totalKompeten: 29,
        totalBelumKompeten: 1,
        kotaPleno: "Bandung",
        tanggalSurat: "22 Desember 2025",
        asesiList: [
          // Skema 1: Melaksanakan Komunikasi dengan Pemangku Kepentingan (11 Asesi)
          {
            no: 1,
            nama: "Intan Tania",
            skema: "Melaksanakan Komunikasi dengan Pemangku Kepentingan",
            isKompeten: true,
          },
          {
            no: 2,
            nama: "Anggita Firdayanti",
            skema: "Melaksanakan Komunikasi dengan Pemangku Kepentingan",
            isKompeten: true,
          },
          {
            no: 3,
            nama: "Hasna Zahra Annabilah",
            skema: "Melaksanakan Komunikasi dengan Pemangku Kepentingan",
            isKompeten: true,
          },
          {
            no: 4,
            nama: "Ananda Anggunistiani",
            skema: "Melaksanakan Komunikasi dengan Pemangku Kepentingan",
            isKompeten: true,
          },
          {
            no: 5,
            nama: "Nurul Hasanah",
            skema: "Melaksanakan Komunikasi dengan Pemangku Kepentingan",
            isKompeten: true,
          },
          {
            no: 6,
            nama: "Anisa Sapitri",
            skema: "Melaksanakan Komunikasi dengan Pemangku Kepentingan",
            isKompeten: true,
          },
          {
            no: 7,
            nama: "Nurul Aini",
            skema: "Melaksanakan Komunikasi dengan Pemangku Kepentingan",
            isKompeten: true,
          },
          {
            no: 8,
            nama: "Puji Anggraeni",
            skema: "Melaksanakan Komunikasi dengan Pemangku Kepentingan",
            isKompeten: true,
          },
          {
            no: 9,
            nama: "Ira Dian Nurmala",
            skema: "Melaksanakan Komunikasi dengan Pemangku Kepentingan",
            isKompeten: true,
          },
          {
            no: 10,
            nama: "Sara Magdi Mamdouh Salama",
            skema: "Melaksanakan Komunikasi dengan Pemangku Kepentingan",
            isKompeten: true,
          },
          {
            no: 11,
            nama: "Raisha Srikandi Sekartaji",
            skema: "Melaksanakan Komunikasi dengan Pemangku Kepentingan",
            isKompeten: true,
          },

          // Skema 2: Penerjemah Teks Umum (9 Asesi)
          {
            no: 12,
            nama: "Tri Ramadani",
            skema: "Penerjemah Teks Umum",
            isKompeten: true,
          },
          {
            no: 13,
            nama: "Intan Permata Sari",
            skema: "Penerjemah Teks Umum",
            isKompeten: true,
          },
          {
            no: 14,
            nama: "Zuvika Amoret Syarifatul Ainiyyah",
            skema: "Penerjemah Teks Umum",
            isKompeten: true,
          },
          {
            no: 15,
            nama: "Muhammad Aditia",
            skema: "Penerjemah Teks Umum",
            isKompeten: true,
          },
          {
            no: 16,
            nama: "Khadijah",
            skema: "Penerjemah Teks Umum",
            isKompeten: true,
          },
          {
            no: 17,
            nama: "Rr. Ririh Widowati",
            skema: "Penerjemah Teks Umum",
            isKompeten: true,
          },
          {
            no: 18,
            nama: "Khoerul Amin",
            skema: "Penerjemah Teks Umum",
            isKompeten: true,
          },
          {
            no: 19,
            nama: "Anwar Sudirja",
            skema: "Penerjemah Teks Umum",
            isKompeten: true,
          },
          {
            no: 20,
            nama: "Nur Irmandi",
            skema: "Penerjemah Teks Umum",
            isKompeten: true,
          },

          // Skema 3: Penyelia Halal (8 Asesi)
          {
            no: 21,
            nama: "Gisna Maulida Qurosyiyah",
            skema: "Penyelia Halal",
            isKompeten: true,
          },
          {
            no: 22,
            nama: "Irfan Muhammad Ihsanuddin",
            skema: "Penyelia Halal",
            isKompeten: true,
          },
          {
            no: 23,
            nama: "Annisa Hakim",
            skema: "Penyelia Halal",
            isKompeten: true,
          },
          {
            no: 24,
            nama: "Mayang Sri Rahayu",
            skema: "Penyelia Halal",
            isKompeten: true,
          },
          {
            no: 25,
            nama: "Hanny Aurelya",
            skema: "Penyelia Halal",
            isKompeten: true,
          },
          {
            no: 26,
            nama: "Zulfa Ayu Zahra",
            skema: "Penyelia Halal",
            isKompeten: true,
          },
          {
            no: 27,
            nama: "Falama Fauzia",
            skema: "Penyelia Halal",
            isKompeten: false,
          }, // Contoh asesi Belum Kompeten (BK)
          {
            no: 28,
            nama: "Milatul Afifah",
            skema: "Penyelia Halal",
            isKompeten: true,
          },

          // Skema 4: Auditor Halal (2 Asesi)
          {
            no: 29,
            nama: "Asep Andri",
            skema: "Auditor Halal",
            isKompeten: true,
          },
          {
            no: 30,
            nama: "Muhammad Algi Al Hanafi",
            skema: "Auditor Halal",
            isKompeten: true,
          },
        ],
        anggotaKomiteList: [
          { nama: "Prof. Dr. H. Ija Suntana, M. Ag., CLA" },
          { nama: "Ichsan Taufik, M.T." },
          { nama: "Dr. Elis Ratna Wulan, S. Si., MT" },
        ],
      };

      const res = await fetch("/api/surat/beritasidangpleno", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadBeritaAcara),
      });

      if (!res.ok) {
        throw new Error("Gagal menghasilkan dokumen Berita Acara");
      }

      const blob = await res.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `Berita_Acara_Pleno_${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Download error:", error);
      alert("Terjadi kesalahan saat mengunduh Berita Acara.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadBlankoBnsp = async () => {
    try {
      setIsLoading(true);

      const payload = {
        kotaSurat: "Bandung",
        tanggalSurat: "22 Desember 2025",
        nomorSurat: "003/SP/LSPP1UINSGD/XII/2025",
        lampiran: "1 (Satu) berkas",
        tujuanYth: "Ketua Badan Nasional Sertifikasi Profesi (BNSP)",
        kotaTujuan: "Jakarta",
        jumlahPeserta: 44,
        kompetenBnsp: "-",
        kompetenKementerian: "-",
        kompetenMandiri: 43,
        kompetenRcc: "-",
        belumKompeten: 1,
        totalJumlah: 44,
        jumlahLembarBlanko: 43,
        terbilangLembarBlanko: "empat puluh tiga",
        namaKetua: "Prof. Dr. H. Ija Suntana, M. Ag., CLA",
      };

      const res = await fetch("/api/surat/blankobnsp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Gagal menghasilkan file PDF.");

      const blob = await res.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `Surat_Permohonan_Blanko_${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat mengunduh surat permohonan blanko.");
    } finally {
      setIsLoading(false);
    }
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
    handleDownloadSkPdf();
  };

  const handleConfirmBlankoBNSP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blankoBNSPKota.trim()) {
      alert("Mohon masukkan Kota Ditetapkan terlebih dahulu.");
      return;
    }
    setIsBlankoBNSPModalOpen(false);
    handleDownloadBlankoBnsp();
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
            nik: `121705${1000 + idx}`,
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
        nik: `121705${1000 + idx}`,
        nama: `Asesi ${idx + 1}`,
        skema: formData?.skema || "",
        asesor: "Asesor LSP",
        rekomendasiAsesor: "K",
        statusPleno: "K",
      };
    },
  );

  return (
    <div className="space-y-6 pb-24 text-sm text-gray-700">
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
        <div className="space-y-6">
          {/* Header Title - Aligned with other pages */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-[#008BE3]/10 flex items-center justify-center text-[#008BE3] border border-[#008BE3]/20 shadow-xs shrink-0">
                <Scale size={20} className="stroke-[2.5]" />
              </div>
              <div className="min-w-0">
                <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none mb-1 md:whitespace-nowrap">
                  Sidang Pleno
                </h2>
                <p className="text-xs text-gray-400 font-bold tracking-wider uppercase leading-4 md:whitespace-nowrap">
                  Pelaksanaan & Hasil Sidang Pleno Komite Teknis
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-lg border border-gray-100 text-sm font-bold text-slate-700 shadow-xs shrink-0">
              <FileCheck size={16} className="text-[#008BE3]" />
              <span>Total: {sessions.length} Pelaksanaan Pleno</span>
            </div>
          </div>

          {/* Search & Filter Bar and Tabel Sidang Pleno Container */}
          <div className="bg-white rounded-lg shadow-xs border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="min-w-0">
                <h3 className="text-base font-black text-slate-900">
                  Cari Sidang Pleno
                </h3>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 w-full lg:w-auto ml-auto">
                <div className="flex items-center gap-2 bg-gray-50/80 rounded-lg px-3 h-10.5 w-full sm:w-68 border border-gray-200/50 focus-within:border-[#008BE3]/40 transition-colors">
                  <Search className="text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Cari Batch, SK, atau Skema..."
                    className="bg-transparent border-none focus:ring-0 text-[14px] w-full outline-none text-gray-700 placeholder-gray-400 font-semibold"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="relative z-50 flex items-center gap-2">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="bg-gray-50 border border-gray-200/50 text-[14px] rounded-lg px-3 h-10.5 outline-none text-gray-700 cursor-pointer font-bold"
                  >
                    <option value="Semua">Semua Status</option>
                    <option value="Belum Ditetapkan">Belum Ditetapkan</option>
                    <option value="Selesai">Selesai</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto relative">
              <table className="w-full text-left border-collapse min-w-[1200px]">
                <thead>
                  <tr className="bg-[#0F172A] border-b border-[#0F172A]">
                    <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-left whitespace-nowrap min-w-[150px] sticky top-0 z-20 bg-[#0F172A]">
                      Batch
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-left whitespace-nowrap min-w-[200px] sticky top-0 z-20 bg-[#0F172A]">
                      Nama Sidang Pleno
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-left whitespace-nowrap min-w-[200px] sticky top-0 z-20 bg-[#0F172A]">
                      Tanggal Pelaksanaan
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-left whitespace-nowrap min-w-[100px] sticky top-0 z-20 bg-[#0F172A]">
                      TUK
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-left whitespace-nowrap min-w-[200px] sticky top-0 z-20 bg-[#0F172A]">
                      Alamat TUK
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-left whitespace-nowrap min-w-[150px] sticky top-0 z-20 bg-[#0F172A]">
                      Total Asesi
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-left whitespace-nowrap min-w-[180px] sticky top-0 z-20 bg-[#0F172A]">
                      Status Sidang
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-center whitespace-nowrap sticky right-0 bg-[#0F172A] z-30 border-l border-white/10 shadow-[-6px_0_15px_-4px_rgba(0,0,0,0.06)] backdrop-blur-xs min-w-40 top-0">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredSessions.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
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
                        className="group/row hover:bg-[#F9FAFC] transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-[14px] font-bold text-slate-900">
                            {item.batchCode || item.id}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-[14px] font-bold text-slate-900 group-hover/row:text-[#008BE3] transition-colors leading-snug">
                            {item.title || `Sidang Pleno ${item.skema}`}
                          </div>
                          {item.skema && (
                            <div className="text-xs text-slate-500 font-medium mt-0.5 truncate max-w-[250px]">
                              {item.skema}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-[14px] font-semibold text-slate-600">
                          <div className="flex items-center gap-1.5">
                            <Calendar
                              size={14}
                              className="text-slate-400 shrink-0"
                            />
                            {item.tanggal}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-block text-[11px] font-bold px-3 py-1 rounded-full border tracking-wider uppercase ${
                              item.jenisTuk === "Sewaktu" || !item.jenisTuk
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : item.jenisTuk === "Mandiri"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : "bg-blue-50 text-blue-700 border-blue-200"
                            }`}
                          >
                            {item.jenisTuk || "Sewaktu"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-[14px] font-medium text-slate-700">
                          <div className="flex items-center gap-1.5">
                            <MapPin
                              size={16}
                              className="text-slate-400 shrink-0"
                            />
                            <span>{item.alamat}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-[14px] font-bold text-slate-700">
                          <span>{item.asesiList?.length || 0} Asesi</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.status === "Selesai" ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle size={12} /> Sudah Selesai
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
                              <Clock size={12} /> Belum Selesai
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center sticky right-0 bg-white group-hover/row:bg-[#F9FAFC] z-10 border-l border-gray-100 shadow-[-6px_0_15px_-4px_rgba(0,0,0,0.06)] transition-colors">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() =>
                                setSelectedPlenoId(String(item.id))
                              }
                              className="px-3 py-1.5 text-xs font-bold text-[#008BE3] bg-sky-50 hover:bg-[#008BE3] hover:text-white border border-sky-200 rounded-lg transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-2xs"
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
          {/* Header Sidang Pleno with Back Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <button
              onClick={() => setSelectedPlenoId(null)}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-[#008BE3] bg-[#008BE3]/10 hover:bg-[#008BE3]/20 transition-colors cursor-pointer shrink-0"
              title="Kembali ke Daftar Pleno"
            >
              <ArrowLeft size={18} className="stroke-[2.5]" />
            </button>
          </div>

          {/* Header Info Pleno */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <span className="font-mono text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-lg">
                BATCH-{formData.id}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${
                  formData.status === "Selesai"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-amber-50 text-amber-700 border-amber-200"
                }`}
              >
                {formData.status === "Selesai" ? (
                  <CheckCircle size={12} />
                ) : (
                  <Clock size={12} />
                )}
                Status: {formData.status}
              </span>
            </div>
            <h2 className="text-lg md:text-xl font-black text-slate-900">
              Sidang Pleno {formData.skema}
            </h2>
            <p className="text-xs text-slate-600 font-medium">
              Skema Sertifikasi:{" "}
              <span className="font-bold text-slate-800">
                {formData.skema}
              </span>
            </p>
          </div>

          {/* Section 1: Informasi Keputusan & Jadwal Sidang (Include Field Link Surat Berita Pleno) */}
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
                  value={formData.id}
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
                  value={formData.tanggal}
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
                  value={formData.alamat}
                  readOnly
                  disabled
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-[13px] font-bold text-slate-800 bg-slate-50 cursor-not-allowed outline-none select-none"
                />
              </div>
            </div>

            {/* Peserta Sidang (Direktur, Dewan Pengarah, Komite & Notulis) */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                Peserta Sidang (Direktur, Pengarah &amp; Komite)
              </label>
              <div className="p-3.5 bg-slate-50/50 border border-slate-200/80 rounded-xl min-h-[52px] flex flex-wrap gap-2 items-center">
                {(() => {
                  const attendees =
                    formData.plenoAttendees &&
                    formData.plenoAttendees.length > 0
                      ? formData.plenoAttendees.filter(
                          (a) => a.nama.trim() !== "" && a.role !== "direktur",
                        )
                      : [
                          { role: "direktur", nama: "Prof. Dr. H. Ahmad" },
                          {
                            role: "dewan pengarah",
                            nama: "Dr. Ir. H. Muhammad Zulkifli, M.T.",
                          },
                          {
                            role: "komite skema",
                            nama: "Asep Abdul Sahid, M.T.",
                          },
                        ];
                  return attendees.map((att, idx) => (
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

          {/* Section 2: 3 Link Surat Dokumen Keputusan & Tombol Generate Surat */}
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
                    className={`w-full border border-slate-200 rounded-xl px-3.5 py-2 text-[13px] font-semibold text-slate-800 transition-all ${
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
                    className={`w-full border border-slate-200 rounded-xl px-3.5 py-2 text-[13px] font-semibold text-slate-800 transition-all ${
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
                    className={`w-full border border-slate-200 rounded-xl px-3.5 py-2 text-[13px] font-semibold text-slate-800 transition-all ${
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
                  Klik <strong>Simpan Perubahan</strong> sebelum melakukan generate surat.
                </span>
              </p>
            )}
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

            <div className="overflow-x-auto relative">
              <table className="w-full text-left border-collapse min-w-175">
                <thead>
                  <tr className="bg-[#0F172A] border-b border-[#0F172A]">
                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-left whitespace-nowrap text-white/90 sticky top-0 z-20 bg-[#0F172A]">
                      No
                    </th>
                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-left whitespace-nowrap text-white/90 sticky top-0 z-20 bg-[#0F172A]">
                      nik / ID
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
                  {normalizedAsesiList.map((asesi, idx) => (
                    <tr
                      key={asesi.id}
                      className="group/row hover:bg-[#F9FAFC] transition-colors"
                    >
                      <td className="px-4 py-3 text-[14px] font-medium text-slate-700">
                        {idx + 1}
                      </td>
                      <td className="px-4 py-3 text-[14px] font-medium text-slate-700">
                        {asesi.nik}
                      </td>
                      <td className="px-4 py-3 text-[14px] font-medium text-slate-900 group-hover/row:text-[#008BE3] transition-colors">
                        {asesi.nama}
                      </td>
                      <td className="px-4 py-3 text-[14px] font-medium text-slate-600">
                        {asesi.asesor}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${
                            asesi.rekomendasiAsesor === "K"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-red-50 text-red-700 border-red-200"
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
                              className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
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
                              className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
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
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${
                              asesi.statusPleno === "K"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-red-50 text-red-700 border-red-200"
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
                        <strong>Waktu & Tempat:</strong> {formData.waktu},{" "}
                        {formData.alamat}
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
                          <th className="p-2 border-r border-slate-300">nik</th>
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
                              {a.nik}
                            </td>
                            <td className="p-2 border-r border-slate-300 font-bold">
                              {a.nama}
                            </td>
                            <td className="p-2 border-r border-slate-300">
                              {a.asesor}
                            </td>
                            <td className="p-2 text-center font-bold">
                              <span
                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${
                                  a.statusPleno === "K"
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : "bg-red-50 text-red-700 border-red-200"
                                }`}
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
