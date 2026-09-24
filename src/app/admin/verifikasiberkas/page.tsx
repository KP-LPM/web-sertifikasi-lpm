"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Trash2,
  CheckCircle,
  Eye,
  Users,
  ArrowLeft,
  CreditCard,
  XCircle,
  FileCheck,
  GraduationCap,
  Award,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import { EFormApl01 } from "@/components/forms/asesi/FormFRAPL01";
import { useAppContext } from "@/context/context";
import { UserItem, Apl01FormData, Apl02FormData } from "@/types/types";
import {
  getPengajuanList,
  getAllUsers,
  verifyPengajuanApl01,
  updatePaymentStatus,
  verifyUserAdmin,
  getPengajuanDetail,
} from "@/lib/api";

export default function UsersManagement() {
  const { user: userContext, registeredProfile, setExtraCrumbs } = useAppContext();
  const readOnly = userContext?.role === "direktur" || userContext?.role === "manajer";

  const [mainTab, setMainTab] = useState<"asesi" | "asesor" | "selesai">("asesi");
  const [selesaiTabFilter, setSelesaiTabFilter] = useState<"semua" | "asesi" | "asesor">("semua");

  const [users, setUsers] = useState<UserItem[]>([
    {
      id: 1,
      username: "ahmad_h",
      namaLengkap: "Ahmad Hidayat",
      email: "ahmad.h@student.uin.ac.id",
      role: "asesi",
      status: "Menunggu Verifikasi",
      verificationData: {
        rekomendasi: "Diterima",
        catatan: "",
        statusPembayaran: "Belum",
        sumberAnggaran: "Sumber Anggaran Biaya Mandiri",
      },
    },
    {
      id: 2,
      username: "budi_p",
      namaLengkap: "Budi Pratama",
      email: "budi.p@student.uin.ac.id",
      role: "asesi",
      status: "Menunggu Verifikasi",
      verificationData: {
        rekomendasi: "Diterima",
        catatan: "",
        statusPembayaran: "Sudah",
        sumberAnggaran: "Sumber Anggaran dari APBN",
      },
    },
    {
      id: 3,
      username: "dewi_l",
      namaLengkap: "Dewi Lestari",
      email: "dewi.l@student.uin.ac.id",
      role: "asesi",
      status: "Terverifikasi",
      verificationData: {
        rekomendasi: "Diterima",
        catatan: "Dokumen APL 01 & APL 02 telah terverifikasi secara sah.",
        statusPembayaran: "Sudah",
        sumberAnggaran: "Sumber Anggaran dari APBN",
      },
    },
    {
      id: 4,
      username: "rahmat_h",
      namaLengkap: "Rahmat Hidayat",
      email: "rahmat.h@student.uin.ac.id",
      role: "asesi",
      status: "Terverifikasi",
      verificationData: {
        rekomendasi: "Diterima",
        catatan: "Persyaratan dasar dan dokumen administrasi lengkap.",
        statusPembayaran: "Sudah",
        sumberAnggaran: "Sumber Anggaran Biaya Mandiri",
      },
    },
    {
      id: 5,
      username: "siti_r",
      namaLengkap: "Dr. Siti Rohmah",
      email: "siti.r@lecturer.uin.ac.id",
      role: "asesor",
      status: "Terverifikasi",
      verificationData: {
        rekomendasi: "Diterima",
        catatan: "",
        asalAsesor: "Internal",
        instansi: "LSP UIN SGD",
        skema: "Rekayasa Perangkat Lunak",
        noReg: "MET.000.12345.2023",
      }
    },
    {
      id: 6,
      username: "ichsan_t",
      namaLengkap: "Ichsan Taufik",
      email: "ichsan.taufik@lsp.uin.ac.id",
      role: "asesor",
      status: "Menunggu Verifikasi",
      verificationData: {
        rekomendasi: "Diterima",
        catatan: "",
        asalAsesor: "Eksternal",
        instansi: "LSP Teknologi Informasi & Komunikasi Indonesia",
        skema: "Teknisi Muda Jaringan Komputer",
        noReg: "MET.000.98765.2025",
      }
    },
    {
      id: 7,
      username: "aceng_k",
      namaLengkap: "Aceng Abdul Kodir",
      email: "aceng.kodir@lsp.uin.ac.id",
      role: "asesor",
      status: "Terverifikasi",
      verificationData: {
        rekomendasi: "Diterima",
        catatan: "",
        asalAsesor: "Internal",
        instansi: "LSP UIN SGD",
        skema: "Rekayasa Perangkat Lunak",
        noReg: "MET.000.54321.2024",
      }
    },
  ]);

  interface BackendDataPribadi {
    nik?: string;
    namaLengkap?: string;
    namaInstitusi?: string;
    jabatan?: string;
  }

  interface BackendVerifikasiPengajuan {
    rekomendasi?: string | null;
    catatan?: string | null;
    status_pembayaran?: string | null;
    sumber_anggaran?: string | null;
    admin_signature_url?: string | null;
    lsp_signature_url?: string | null;
    assigned_asesor_id?: number | null;
  }

  interface BackendPengajuanItem {
    id: number;
    status?: string;
    statusPembayaran?: string;
    sumberAnggaran?: string;
    namaInstitusi?: string;
    jabatan?: string;
    versiKonfigurasi?: string;
    user?: { username?: string; email?: string; signature?: string };
    dataPribadi?: BackendDataPribadi[] | BackendDataPribadi;
    skema?: { namaSkema?: string; kodeSkema?: string };
    verifikasi_pengajuan?: BackendVerifikasiPengajuan;
    apl02_penilaian?: { rekomendasi_apl02?: string | null };
    dokumen?: { id: number; namaDokumen: string; fileUrl: string }[];
  }

  interface BackendProfilPengguna {
    namaLengkap?: string;
    namaInstitusi?: string;
  }

  interface BackendUserRecord {
    id: number;
    username: string;
    email?: string;
    role: string;
    isVerified?: boolean;
    nomor_registrasi_met?: string;
    profil?: BackendProfilPengguna[] | BackendProfilPengguna;
    portfolio_asesor?: {
      id: number;
      nama_dokumen: string;
      link_portfolio?: string;
      link_surat_peminjaman?: string;
      link_surat_jawaban?: string;
      status_asesor?: string;
      master_skema?: { namaSkema: string };
    }[];
  }

  // Backend Integration State
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);

  const fetchUsersData = async () => {
    try {
      setIsDataLoading(true);
      const [pengajuanRes, usersRes] = await Promise.allSettled([
        getPengajuanList(),
        getAllUsers(),
      ]);

      const rawPengajuan =
        pengajuanRes.status === "fulfilled" && Array.isArray(pengajuanRes.value)
          ? (pengajuanRes.value as BackendPengajuanItem[])
          : [];
      const rawUsers =
        usersRes.status === "fulfilled" && Array.isArray(usersRes.value)
          ? (usersRes.value as BackendUserRecord[])
          : [];

      const mappedAsesi: UserItem[] = rawPengajuan.map((p) => {
        const dp = Array.isArray(p.dataPribadi)
          ? p.dataPribadi[0]
          : p.dataPribadi;
        const namaLengkap =
          dp?.namaLengkap || p.user?.username || `Asesi #${p.id}`;
        const email = p.user?.email || "-";

        let rawStatus = p.status || "Menunggu Verifikasi";
        if (rawStatus === "Ditolak/Revisi" || rawStatus === "Ditolak") {
          rawStatus = "Revisi";
        } else if (rawStatus === "Terverifikasi" || rawStatus === "Disetujui" || rawStatus === "Selesai") {
          // Status asesi tampil "Terverifikasi" setelah disetujui admin
          rawStatus = "Terverifikasi";
        }

        return {
          id: p.id,
          username: p.user?.username || `asesi_${p.id}`,
          namaLengkap,
          email,
          role: "asesi",
          status: rawStatus,
          namaInstitusi: p.namaInstitusi || dp?.namaInstitusi || "",
          jabatan: p.jabatan || dp?.jabatan || "",
          versiKonfigurasi: p.versiKonfigurasi || "-",
          verificationData: {
            rekomendasi: p.verifikasi_pengajuan?.rekomendasi || "Diterima",
            catatan: p.verifikasi_pengajuan?.catatan || "",
            statusPembayaran:
              (p.statusPembayaran as "Sudah" | "Belum") ||
              (p.verifikasi_pengajuan?.status_pembayaran as "Sudah" | "Belum") ||
              "Belum",
            sumberAnggaran:
              p.sumberAnggaran ||
              p.verifikasi_pengajuan?.sumber_anggaran ||
              "Sumber Anggaran Biaya Mandiri",
            adminSignatureUrl:
              p.verifikasi_pengajuan?.admin_signature_url || null,
            lspSignatureUrl: p.verifikasi_pengajuan?.lsp_signature_url || null,
            rekomendasiApl02:
              p.apl02_penilaian?.rekomendasi_apl02 || "Dapat dilanjutkan",
            assignedAsesorId:
              p.verifikasi_pengajuan?.assigned_asesor_id || undefined,
            namaSkema: p.skema?.namaSkema || "-",
            kodeSkema: p.skema?.kodeSkema || "-",
            dokumen: p.dokumen || [],
          },
        };
      });

      const asesorUsersRaw = rawUsers.filter((u) => u.role === "asesor");
      const mappedAsesor: UserItem[] = asesorUsersRaw.map((u) => {
        const profil = Array.isArray(u.profil) ? u.profil[0] : u.profil;
        const namaLengkap = profil?.namaLengkap || u.username;

        const dokumen = u.portfolio_asesor?.flatMap((port) => {
          const docs = [];

          const getUrl = (path: string) => path.startsWith('http') ? path : `/uploads/${path}`;

          if (port.link_portfolio) {
            docs.push({
              id: port.id * 10 + 1,
              namaDokumen: port.nama_dokumen,
              fileUrl: getUrl(port.link_portfolio),
              fileName: port.link_portfolio,
            });
          }
          if (port.link_surat_peminjaman) {
            docs.push({
              id: port.id * 10 + 2,
              namaDokumen: `Surat Peminjaman Asesor (${port.nama_dokumen})`,
              fileUrl: getUrl(port.link_surat_peminjaman),
              fileName: port.link_surat_peminjaman,
            });
          }
          if (port.link_surat_jawaban) {
            docs.push({
              id: port.id * 10 + 3,
              namaDokumen: `Surat Jawaban LSP (${port.nama_dokumen})`,
              fileUrl: getUrl(port.link_surat_jawaban),
              fileName: port.link_surat_jawaban,
            });
          }
          return docs;
        }) || [];

        const hasInternalPortfolio = u.portfolio_asesor?.some(
          (p) => p.status_asesor === "Internal"
        );
        const isInternalProfil = profil?.namaInstitusi?.toLowerCase().includes("uin");
        const asalAsesor = hasInternalPortfolio || isInternalProfil ? "Internal" : "Eksternal";

        const listSkema = u.portfolio_asesor?.map(p => p.master_skema?.namaSkema).filter(Boolean);
        const skemaText = listSkema && listSkema.length > 0 ? Array.from(new Set(listSkema)).join(", ") : "Belum Ada";

        return {
          id: u.id,
          username: u.username,
          namaLengkap,
          email: u.email || "-",
          role: "asesor",
          status: u.isVerified ? "Terverifikasi" : "Menunggu Verifikasi",
          verificationData: {
            rekomendasi: "Diterima",
            catatan: "",
            asalAsesor: asalAsesor,
            instansi: profil?.namaInstitusi || "LSP UIN SGD",
            skema: skemaText,
            noReg: u.nomor_registrasi_met || "MET.000.12345.2024",
            dokumen: dokumen,
          },
        };
      });

      setUsers([...mappedAsesi, ...mappedAsesor]);

    } catch (err) {
      console.error("Gagal memuat data verifikasi berkas:", err);
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersData();
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [userToVerify, setUserToVerify] = useState<UserItem | null>(null);
  const [activeVerifyTab] = useState<string>("apl01");


  const [verificationForm, setVerificationForm] = useState({
    rekomendasi: "Diterima",
    catatan: "",
  });
  const [apl01FormData, setApl01FormData] = useState<Apl01FormData>({
    isAdmin: true,
    hidePaymentFields: true,
  });
  const [apl02FormData] = useState<Apl02FormData>({} as Apl02FormData);

  const [selectedAsesorId, setSelectedAsesorId] = useState<string>("");

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [userToEditPayment, setUserToEditPayment] = useState<UserItem | null>(
    null,
  );
  const [paymentFormData, setPaymentFormData] = useState({
    statusPembayaran: "Belum" as "Sudah" | "Belum",
    sumberAnggaran: "Sumber Anggaran Biaya Mandiri",
  });

  useEffect(() => {
    const handleCloseModals = () => {
      setIsVerifyModalOpen(false);
      setUserToVerify(null);
    };
    window.addEventListener("BREADCRUMB_RESET_MODAL", handleCloseModals);
    return () => window.removeEventListener("BREADCRUMB_RESET_MODAL", handleCloseModals);
  }, []);

  useEffect(() => {
    if (setExtraCrumbs) {
      if (isVerifyModalOpen && userToVerify) {
        setExtraCrumbs([{ label: "Tinjauan Verifikasi Berkas" }]);
      } else {
        setExtraCrumbs([]);
      }
    }

    return () => {
      if (setExtraCrumbs) setExtraCrumbs([]);
    };
  }, [isVerifyModalOpen, userToVerify, setExtraCrumbs]);

  const openPaymentModal = (userItem: UserItem) => {
    setUserToEditPayment(userItem);
    setPaymentFormData({
      statusPembayaran:
        (userItem.verificationData?.statusPembayaran as "Sudah" | "Belum") ||
        "Belum",
      sumberAnggaran:
        userItem.verificationData?.sumberAnggaran ||
        "Sumber Anggaran Biaya Mandiri",
    });
    setIsPaymentModalOpen(true);
  };

  const handleSavePayment = async () => {
    if (!userToEditPayment) return;

    try {
      await updatePaymentStatus(userToEditPayment.id!, {
        statusPembayaran: paymentFormData.statusPembayaran,
        sumberAnggaran: paymentFormData.sumberAnggaran,
      });
    } catch (err) {
      console.error("Gagal menyimpan pembayaran ke backend:", err);
    }

    setUsers(
      users.map((u) =>
        u.id === userToEditPayment.id
          ? {
            ...u,
            verificationData: {
              rekomendasi: u.verificationData?.rekomendasi || "Diterima",
              catatan: u.verificationData?.catatan || "",
              adminSignatureUrl: u.verificationData?.adminSignatureUrl,
              lspSignatureUrl: u.verificationData?.lspSignatureUrl,
              rekomendasiApl02: u.verificationData?.rekomendasiApl02,
              ttdAsesor: u.verificationData?.ttdAsesor,
              asesorName: u.verificationData?.asesorName,
              asesorReg: u.verificationData?.asesorReg,
              penyusun: u.verificationData?.penyusun,
              validator: u.verificationData?.validator,
              assignedAsesorId: u.verificationData?.assignedAsesorId,
              statusPembayaran: paymentFormData.statusPembayaran,
              sumberAnggaran: paymentFormData.sumberAnggaran,
            },
          }
          : u,
      ),
    );
    setIsPaymentModalOpen(false);
    setUserToEditPayment(null);
  };

  const asesiUsers = users.filter((user) => {
    if (user.role !== "asesi") return false;
    const isVerifiedOrSelesai = user.status === "Selesai" || user.status === "Terverifikasi";
    const isPaid = user.verificationData?.statusPembayaran === "Sudah";
    // Pindah ke tab selesai hanya jika statusnya Selesai/Terverifikasi DAN sudah bayar
    return !(isVerifiedOrSelesai && isPaid);
  });

  const asesorUsers = users.filter((user) => user.role === "asesor" && user.status !== "Terverifikasi");

  const selesaiUsers = users.filter((user) => {
    if (user.role === "asesi") {
      const isVerifiedOrSelesai = user.status === "Selesai" || user.status === "Terverifikasi";
      const isPaid = user.verificationData?.statusPembayaran === "Sudah";
      const match = isVerifiedOrSelesai && isPaid;
      return (selesaiTabFilter === "asesi" || selesaiTabFilter === "semua") ? match : false;
    }
    if (user.role === "asesor") {
      const match = user.status === "Terverifikasi";
      return (selesaiTabFilter === "asesor" || selesaiTabFilter === "semua") ? match : false;
    }
    return false;
  });

  const currentList = mainTab === "asesi" ? asesiUsers : mainTab === "asesor" ? asesorUsers : selesaiUsers;

  const filteredUsers = currentList.filter(
    (user) =>
      user.namaLengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleDeleteUser = () => {
    if (selectedUser) {
      setUsers(users.filter((u) => u.id !== selectedUser.id));
    }
    setIsDeleteModalOpen(false);
    setSelectedUser(null);
  };

  const confirmRevisi = async () => {
    if (userToVerify) {
      if (userToVerify.role === "asesi") {
        const rawAdminUrl = apl01FormData.ttdAdmin || userToVerify.verificationData?.adminSignatureUrl || null;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const currentAdminUrl = typeof rawAdminUrl === "object" && rawAdminUrl !== null ? (rawAdminUrl as any).url || (rawAdminUrl as any).fileUrl || null : rawAdminUrl;
        const currentLspUrl = userToVerify.verificationData?.lspSignatureUrl || null;

        try {
          // Hapus checklist: apl01FormData.checklist di sini
          await verifyPengajuanApl01(userToVerify.id!, {
            rekomendasi: "Ditolak",
            catatan: apl01FormData.catatan || "",
            statusPembayaran: (apl01FormData.statusPembayaran ||
              userToVerify.verificationData?.statusPembayaran ||
              "Belum") as "Sudah" | "Belum",
            sumberAnggaran:
              apl01FormData.sumberAnggaran ||
              userToVerify.verificationData?.sumberAnggaran ||
              "Sumber Anggaran Biaya Mandiri",
            adminSignatureUrl: currentAdminUrl || undefined,
            lspSignatureUrl: currentLspUrl || undefined,
            assignedAsesorId: selectedAsesorId
              ? Number(selectedAsesorId)
              : undefined,
          });
        } catch (err) {
          console.error("Gagal mengirim revisi pengajuan asesi:", err);
        }

        const newVerificationData = {
          ...userToVerify.verificationData,
          rekomendasi: "Ditolak",
          catatan: apl01FormData.catatan || "",
          statusPembayaran:
            apl01FormData.statusPembayaran ||
            userToVerify.verificationData?.statusPembayaran ||
            "Belum",
          sumberAnggaran:
            apl01FormData.sumberAnggaran ||
            userToVerify.verificationData?.sumberAnggaran ||
            "Sumber Anggaran Biaya Mandiri",
          adminSignatureUrl: currentAdminUrl,
          lspSignatureUrl: currentLspUrl,
          rekomendasiApl02: userToVerify.verificationData?.rekomendasiApl02,
          ttdAsesor: userToVerify.verificationData?.ttdAsesor,
          asesorName: userToVerify.verificationData?.asesorName,
          asesorReg: userToVerify.verificationData?.asesorReg,
          penyusun: userToVerify.verificationData?.penyusun,
          validator: userToVerify.verificationData?.validator,
          assignedAsesorId: selectedAsesorId
            ? Number(selectedAsesorId)
            : userToVerify.verificationData?.assignedAsesorId,
        };

        setUsers(
          users.map((u) =>
            u.id === userToVerify.id
              ? ({
                ...u,
                status: "Revisi",
                verificationData: newVerificationData,
              } as UserItem)
              : u,
          ),
        );
      }
    }
    setIsVerifyModalOpen(false);
    setUserToVerify(null);
  };

  const confirmVerify = async () => {
    if (userToVerify) {
      if (userToVerify.role === "asesor") {
        try {
          await verifyUserAdmin(userToVerify.id!, "Setuju");
        } catch (err) {
          console.error("Gagal memverifikasi user asesor:", err);
        }
      } else {
        const rawAdminUrl = apl01FormData.ttdAdmin || userToVerify.verificationData?.adminSignatureUrl || null;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const currentAdminUrl = typeof rawAdminUrl === "object" && rawAdminUrl !== null ? (rawAdminUrl as any).url || (rawAdminUrl as any).fileUrl || null : rawAdminUrl;
        const currentLspUrl =
          userToVerify.verificationData?.lspSignatureUrl || null;

        try {
          // Hapus checklist: apl01FormData.checklist di sini
          await verifyPengajuanApl01(userToVerify.id!, {
            rekomendasi: (apl01FormData.rekomendasi || "Diterima") as "Diterima" | "Ditolak",
            catatan: apl01FormData.catatan || "",
            statusPembayaran: (apl01FormData.statusPembayaran ||
              userToVerify.verificationData?.statusPembayaran ||
              "Sudah") as "Sudah" | "Belum",
            sumberAnggaran:
              apl01FormData.sumberAnggaran ||
              userToVerify.verificationData?.sumberAnggaran ||
              "Sumber Anggaran Biaya Mandiri",
            adminSignatureUrl: currentAdminUrl || undefined,
            lspSignatureUrl: currentLspUrl || undefined,
            assignedAsesorId: selectedAsesorId
              ? Number(selectedAsesorId)
              : undefined,
          });
        } catch (err) {
          console.error("Gagal memverifikasi pengajuan asesi:", err);
        }
      }

      const rawAdminUrl = apl01FormData.ttdAdmin || userToVerify.verificationData?.adminSignatureUrl || null;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const currentAdminUrl = typeof rawAdminUrl === "object" && rawAdminUrl !== null ? (rawAdminUrl as any).url || (rawAdminUrl as any).fileUrl || null : rawAdminUrl;
      const currentLspUrl =
        userToVerify.verificationData?.lspSignatureUrl || null;

      const newVerificationData = {
        ...userToVerify.verificationData,
        rekomendasi: apl01FormData.rekomendasi || "Diterima",
        catatan: apl01FormData.catatan || "",
        statusPembayaran:
          apl01FormData.statusPembayaran ||
          userToVerify.verificationData?.statusPembayaran ||
          "Sudah",
        sumberAnggaran:
          apl01FormData.sumberAnggaran ||
          userToVerify.verificationData?.sumberAnggaran ||
          "Sumber Anggaran Biaya Mandiri",
        adminSignatureUrl: currentAdminUrl,
        lspSignatureUrl: currentLspUrl,
        rekomendasiApl02: userToVerify.verificationData?.rekomendasiApl02,
        ttdAsesor: userToVerify.verificationData?.ttdAsesor,
        asesorName: userToVerify.verificationData?.asesorName,
        asesorReg: userToVerify.verificationData?.asesorReg,
        penyusun: userToVerify.verificationData?.penyusun,
        validator: userToVerify.verificationData?.validator,
        assignedAsesorId: selectedAsesorId
          ? Number(selectedAsesorId)
          : userToVerify.verificationData?.assignedAsesorId,
      };

      setUsers(
        users.map((u) =>
          u.id === userToVerify.id
            ? ({
              ...u,
              status: "Terverifikasi",
              verificationData: newVerificationData,
            } as UserItem)
            : u,
        ),
      );
    }
    setIsVerifyModalOpen(false);
    setUserToVerify(null);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleAssignAsesor = async () => {
    if (!userToVerify || !selectedAsesorId) return;

    const rawAdminUrl = apl01FormData.ttdAdmin || userToVerify.verificationData?.adminSignatureUrl || null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const currentAdminUrl = typeof rawAdminUrl === "object" && rawAdminUrl !== null ? (rawAdminUrl as any).url || (rawAdminUrl as any).fileUrl || null : rawAdminUrl;
    const currentLspUrl =
      userToVerify.verificationData?.lspSignatureUrl || null;

    try {
      await verifyPengajuanApl01(userToVerify.id!, {
        rekomendasi: (apl01FormData.rekomendasi || "Diterima") as "Diterima" | "Ditolak",
        assignedAsesorId: Number(selectedAsesorId),
      });
    } catch (err) {
      console.error("Gagal assign asesor ke pengajuan:", err);
    }

    const newVerificationData = {
      ...userToVerify.verificationData,
      rekomendasi: apl01FormData.rekomendasi || "Diterima",
      catatan: apl01FormData.catatan || "",
      statusPembayaran:
        apl01FormData.statusPembayaran ||
        userToVerify.verificationData?.statusPembayaran ||
        "Sudah",
      sumberAnggaran:
        apl01FormData.sumberAnggaran ||
        userToVerify.verificationData?.sumberAnggaran ||
        "Sumber Anggaran Biaya Mandiri",
      adminSignatureUrl: currentAdminUrl,
      lspSignatureUrl: currentLspUrl,
      rekomendasiApl02: userToVerify.verificationData?.rekomendasiApl02,
      ttdAsesor: userToVerify.verificationData?.ttdAsesor,
      asesorName: userToVerify.verificationData?.asesorName,
      asesorReg: userToVerify.verificationData?.asesorReg,
      penyusun: userToVerify.verificationData?.penyusun,
      validator: userToVerify.verificationData?.validator,
      assignedAsesorId: selectedAsesorId
        ? Number(selectedAsesorId)
        : undefined,
    };

    setUsers(
      users.map((u) =>
        u.id === userToVerify.id
          ? {
            ...u,
            status: "Terverifikasi",
            verificationData: newVerificationData,
          }
          : u,
      ),
    );

    setIsVerifyModalOpen(false);
    setUserToVerify(null);
  };

  const openVerifyModal = async (user: UserItem) => {
    setUserToVerify(user);
    setSelectedAsesorId(user.verificationData?.assignedAsesorId ? String(user.verificationData.assignedAsesorId) : "");

    if (user.verificationData) {
      setVerificationForm({
        rekomendasi: user.verificationData.rekomendasi,
        catatan: user.verificationData.catatan,
      });
    } else {
      setVerificationForm({ rekomendasi: "Diterima", catatan: "" });
    }

    setIsVerifyModalOpen(true);

    if (user.role === "asesi") {
      setIsModalLoading(true);
      try {
        const detail = await getPengajuanDetail(user.id!);
        const dp = detail.dataPribadi as Record<string, unknown> | undefined;

        let parsedChecklist = {};

        // Pengecekan Checklist Secara Menyeluruh (Robust)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let rawChecklist = detail.checklist || (detail.dataPribadi as any)?.checklist;

        // Jika tidak ada di root, cari di dalam riwayat_asesmen_peserta
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const riwayatList = (detail as any).riwayat_asesmen_peserta || (detail as any).riwayatAsesmen;
        if (!rawChecklist && Array.isArray(riwayatList)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const apl01 = riwayatList.find((r: any) => r.form_type === "FR.APL.01" || r.formType === "FR.APL.01");
          if (apl01 && apl01.form_data) {
            let fd = apl01.form_data;
            if (typeof fd === "string") {
              try { fd = JSON.parse(fd); } catch (e) { console.error(e); }
            }
            rawChecklist = fd?.checklist;
          }
        }

        if (typeof rawChecklist === "string") {
          try {
            parsedChecklist = JSON.parse(rawChecklist);
          } catch (e) {
            console.error("Gagal parse checklist string:", e);
          }
        } else if (typeof rawChecklist === "object" && rawChecklist !== null) {
          parsedChecklist = rawChecklist;
        }

        const newApl01: Apl01FormData = {
          isAdmin: true,
          hidePaymentFields: true,
          readOnly: user.status === "Terverifikasi" || user.status === "Selesai",
          rekomendasi: user.verificationData?.rekomendasi || "Diterima",
          catatan: user.verificationData?.catatan || "",
          statusPembayaran: user.verificationData?.statusPembayaran || "Sudah",
          sumberAnggaran: user.verificationData?.sumberAnggaran || "Sumber Anggaran Biaya Mandiri",
          ttdAdmin: user.verificationData?.adminSignatureUrl || (registeredProfile as Record<string, unknown>)?.tandaTangan as string || null,
          namaAdmin: (registeredProfile as Record<string, unknown>)?.namaLengkap as string || userContext?.username || "Admin LSP",

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ttdAsesi: (dp?.tandaTangan as string) || ((detail as any)?.tandaTangan as string) || ((detail as any)?.user?.signature as string) || null,

          namaSkema: detail.skema?.namaSkema || "",
          kodeSkema: detail.skema?.kodeSkema || "",
          tuk: detail.tuk || "",
          tujuan: detail.tujuanAsesmen || "Sertifikasi",
          ...dp,
          schemeDetail: {
            ...detail.skema,
            buktiAdministratif:
              (detail.skema?.master_bukti_administratif && detail.skema.master_bukti_administratif.length > 0)
                ? detail.skema.master_bukti_administratif
                : (detail.skema?.buktiAdministratif && detail.skema.buktiAdministratif.length > 0)
                  ? detail.skema.buktiAdministratif
                  : [
                    {
                      id: 1,
                      namaDokumen: "Salinan KTP dan KTM",
                      isWajib: true,
                      isAktif: true,
                    },
                    {
                      id: 2,
                      namaDokumen: "Pasfoto berwarna ukuran 3 x 4 sebanyak 2 (dua) lembar",
                      isWajib: true,
                      isAktif: true,
                    },
                  ],
            persyaratanDasar: detail.skema?.persyaratanDasar || [],
            buktiKompetensi: detail.skema?.buktiKompetensi || [],
          },
          checklist: parsedChecklist,
          onPreview: (docName: string) => {
            const docs = detail.dokumen as Array<{ namaDokumen: string; fileUrl: string }> || [];
            const doc = docs.find((d) => d.namaDokumen === docName);
            if (doc && doc.fileUrl) {
              const cacheBuster = new Date().getTime();
              const freshUrl = `${doc.fileUrl}?t=${cacheBuster}`;
              window.open(freshUrl, "_blank");
            } else {
              alert(`File untuk dokumen "${docName}" belum diunggah oleh asesi.`);
            }
          }
        };

        setApl01FormData(newApl01);
      } catch (e) {
        console.error("Gagal load detail pengajuan untuk verifikasi", e);
      } finally {
        setIsModalLoading(false);
      }
    }
  };

  const handleSaveVerifyDraft = () => {
    if (!userToVerify) return;

    let currentAdminUrl = userToVerify.verificationData?.adminSignatureUrl || null;
    const currentLspUrl = userToVerify.verificationData?.lspSignatureUrl || null;

    if (activeVerifyTab === "apl01") {
      const rawUrl = apl01FormData.ttdAdmin || null;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      currentAdminUrl = typeof rawUrl === "object" && rawUrl !== null ? (rawUrl as any).url || (rawUrl as any).fileUrl || null : rawUrl;
    }

    const newVerificationData = {
      ...userToVerify.verificationData,
      rekomendasi:
        activeVerifyTab === "apl01"
          ? apl01FormData.rekomendasi || "Diterima"
          : verificationForm.rekomendasi,
      catatan:
        activeVerifyTab === "apl01"
          ? apl01FormData.catatan || ""
          : verificationForm.catatan,
      statusPembayaran:
        apl01FormData.statusPembayaran ||
        userToVerify.verificationData?.statusPembayaran ||
        "Sudah",
      sumberAnggaran:
        apl01FormData.sumberAnggaran ||
        userToVerify.verificationData?.sumberAnggaran ||
        "Sumber Anggaran Biaya Mandiri",
      adminSignatureUrl: currentAdminUrl,
      lspSignatureUrl: currentLspUrl,
      ...(activeVerifyTab === "apl02"
        ? {
          rekomendasiApl02: apl02FormData.rekomendasiApl02,
          ttdAsesor: apl02FormData.ttdAsesor,
          asesorName: apl02FormData.asesorName,
          asesorReg: apl02FormData.asesorReg,
          penyusun: apl02FormData.penyusun,
          validator: apl02FormData.validator,
          assignedAsesorId: selectedAsesorId,
        }
        : {
          rekomendasiApl02: userToVerify.verificationData?.rekomendasiApl02,
          ttdAsesor: userToVerify.verificationData?.ttdAsesor,
          asesorName: userToVerify.verificationData?.asesorName,
          asesorReg: userToVerify.verificationData?.asesorReg,
          penyusun: userToVerify.verificationData?.penyusun,
          validator: userToVerify.verificationData?.validator,
          assignedAsesorId: userToVerify.verificationData?.assignedAsesorId,
        }),
    };

    const updatedUser = {
      ...userToVerify,
      verificationData: newVerificationData,
    };

    setUsers(
      users.map((u) =>
        u.id === userToVerify.id ? (updatedUser as UserItem) : u,
      ),
    );
    setIsVerifyModalOpen(false);
    setUserToVerify(null);
  };

  const getRoleBadgeStyle = (role: string) => {
    if (role.toLowerCase() === "asesor") return "bg-sky-50 text-[#008BE3] border-sky-200";
    return "bg-slate-100 text-slate-700 border-slate-200";
  };

  if (isVerifyModalOpen && isModalLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-32 space-y-4">
        <Loader2 className="w-8 h-8 text-[#008BE3] animate-spin" />
        <p className="text-gray-500 font-medium">Memuat data pengajuan...</p>
      </div>
    );
  }

  if (isVerifyModalOpen && userToVerify) {
    const totalReqs = [
      ...(apl01FormData.schemeDetail?.persyaratanDasar || []),
      ...(apl01FormData.schemeDetail?.buktiAdministratif || []),
      ...(apl01FormData.schemeDetail?.buktiKompetensi || []),
    ].length;
    const checkedReqs = Object.keys(apl01FormData.checklist || {}).length;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const isApl01Valid =
      !!apl01FormData.ttdAdmin && (totalReqs === 0 || checkedReqs === totalReqs);

    return (
      <div className="w-full space-y-6 text-sm text-gray-700">
        <div className="w-full animate-in fade-in zoom-in-95 duration-200">

          {/* Header & Back Button */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => {
                setIsVerifyModalOpen(false);
                setUserToVerify(null);
              }}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-[#008BE3] bg-[#008BE3]/10 hover:bg-[#008BE3]/20 transition-colors cursor-pointer shrink-0 mt-0.5"
              title="Kembali"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="min-w-0">
              <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                Tinjauan Verifikasi Berkas
              </h2>
              <p className="text-xs text-gray-500 font-medium mt-1">
                Periksa detail dokumen {userToVerify.namaLengkap} sebelum menyetujui.
              </p>
            </div>
          </div>

          <div className="w-full space-y-6 relative mb-8 text-slate-800 text-sm">

            {userToVerify.role === "asesi" && (
              <div className="flex items-center justify-between p-4 rounded-xl bg-white border border-slate-200 shadow-sm mb-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="min-w-0">
                    <p className="text-sm md:text-base font-bold text-slate-900">
                      {userToVerify.namaLengkap}
                    </p>
                    <p className="text-[11px] md:text-xs text-gray-500 font-medium mt-0.5">
                      <span className="text-[#008BE3]">@{userToVerify.username}</span> • {userToVerify.email}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="w-full">
              {userToVerify.role === "asesi" ? (
                <div className="space-y-6">
                  <EFormApl01
                    formData={apl01FormData}
                    onChange={setApl01FormData}
                  />
                </div>
              ) : (
                <div className="w-full bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden flex flex-col">
                  <div className="border-b border-slate-200 bg-slate-50 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex flex-col min-w-0 gap-1 items-start">
                      {userToVerify.verificationData?.asalAsesor === "Eksternal" ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200">
                          Eksternal
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Internal
                        </span>
                      )}
                      <p className="text-sm md:text-base font-bold text-slate-900">
                        {userToVerify.namaLengkap}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 border ${userToVerify.status === "Menunggu Verifikasi" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"}`}>
                        {userToVerify.status === "Menunggu Verifikasi" ? (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                        ) : (
                          <CheckCircle size={14} />
                        )}
                        {userToVerify.status}
                      </span>
                    </div>
                  </div>

                  <div className="px-6 py-6">
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col md:flex-row gap-4 md:gap-8">
                      <div className="flex-1">
                        <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Skema Keahlian</p>
                        <p className="text-sm font-bold text-slate-800">{userToVerify.verificationData?.skema as string || "Rekayasa Perangkat Lunak"}</p>
                      </div>
                      <div className="flex-1">
                        <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">No. Registrasi MET</p>
                        <p className="text-sm font-bold text-slate-800">{userToVerify.verificationData?.noReg as string || "MET.000.12345.2023"}</p>
                      </div>
                      <div className="flex-1">
                        <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Asal LSP / Instansi</p>
                        <p className="text-sm font-bold text-slate-800">{userToVerify.verificationData?.instansi as string || "LSP UIN SGD"}</p>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Berkas Surat Asesor</h4>
                      <div className="space-y-3">
                        {userToVerify.verificationData?.dokumen && userToVerify.verificationData.dokumen.length > 0 ? (
                          userToVerify.verificationData.dokumen.map((doc, index) => (
                            <div key={doc.id} className={`flex items-center justify-between p-3 border border-slate-200 rounded-xl bg-white transition-colors ${doc.namaDokumen.toLowerCase().includes("jawaban") ? "hover:border-purple-300" : "hover:border-[#008BE3]/30"}`}>
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${doc.namaDokumen.toLowerCase().includes("jawaban") ? "bg-purple-50 text-purple-600" : "bg-sky-50 text-[#008BE3]"}`}>
                                  <FileCheck size={20} />
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-slate-800">{index + 1}. {doc.namaDokumen}</p>
                                </div>
                              </div>
                              <a href={doc.fileUrl || "#"} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-bold transition-colors shadow-2xs ${doc.namaDokumen.toLowerCase().includes("jawaban") ? "text-purple-600" : "text-[#008BE3]"}`}>
                                <Eye size={14} /> Lihat File
                              </a>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-6 bg-slate-50 border border-slate-100 rounded-xl text-slate-400">
                            <FileCheck size={32} className="mx-auto mb-2 opacity-50" />
                            <p className="text-sm font-medium">Belum ada berkas terunggah.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-6 flex justify-end gap-3 mt-8 border-t border-slate-200">
              <button
                onClick={() => {
                  setIsVerifyModalOpen(false);
                  setUserToVerify(null);
                }}
                className="px-4 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-bold transition-colors shadow-xs mr-auto cursor-pointer"
              >
                {(userToVerify.status === "Terverifikasi" || userToVerify.status === "Selesai") ? "Tutup" : "Batal"}
              </button>

              {userToVerify.status !== "Terverifikasi" && userToVerify.status !== "Selesai" && (
                <>
                  {userToVerify.role !== "asesor" && (
                    <button
                      onClick={handleSaveVerifyDraft}
                      className="px-4 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-bold transition-colors shadow-xs cursor-pointer"
                    >
                      Simpan Draft
                    </button>
                  )}

                  {userToVerify.role === "asesi" ? (
                    <>
                      <button
                        onClick={confirmRevisi}
                        className="px-6 py-2 bg-orange-500 text-white hover:bg-orange-600 rounded-lg text-sm font-bold transition-colors shadow-xs"
                      >
                        Revisi
                      </button>
                      <button
                        onClick={confirmVerify}
                        disabled={!apl01FormData.ttdAdmin}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-colors shadow-xs ${!apl01FormData.ttdAdmin ? "bg-slate-200 text-slate-400 cursor-not-allowed" : "bg-green-600 text-white hover:bg-green-700"}`}
                      >
                        Verifikasi Form APL-01
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={confirmVerify}
                      className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-bold transition-colors shadow-xs"
                    >
                      Verifikasi Akun
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24 text-sm text-gray-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-[#008BE3]/10 flex items-center justify-center text-[#008BE3] border border-[#008BE3]/20 shadow-xs shrink-0">
            <Users size={20} className="stroke-[2.5]" />
          </div>
          <div className="min-w-0">
            <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none mb-1 md:whitespace-nowrap">
              Verifikasi Berkas
            </h2>
            <p className="text-xs text-gray-400 font-bold tracking-wider uppercase leading-4 md:whitespace-nowrap">
              {mainTab === "asesi"
                ? "Daftar dokumen & berkas pendaftaran APL.01 & APL.02 Asesi."
                : mainTab === "asesor"
                  ? "Daftar berkas & data kualifikasi Asesor."
                  : "Daftar asesi yang telah selesai diverifikasi dan melakukan pembayaran."}
            </p>
          </div>
        </div>
      </div>

      <section className="bg-white rounded-lg shadow-xs border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex flex-col lg:flex-row items-center gap-4 w-full lg:w-auto">
            <div className="bg-slate-100 p-1 rounded-lg flex items-center w-full lg:w-auto shrink-0">
              <button
                onClick={() => setMainTab("asesi")}
                className={`flex-1 py-2 px-3 text-xs md:text-sm font-bold rounded-md transition-all flex items-center justify-center gap-2 cursor-pointer ${mainTab === "asesi"
                  ? "bg-white text-[#008BE3] shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
                  }`}
              >
                Asesi
              </button>
              <button
                onClick={() => setMainTab("asesor")}
                className={`flex-1 py-2 px-3 text-xs md:text-sm font-bold rounded-md transition-all flex items-center justify-center gap-2 cursor-pointer ${mainTab === "asesor"
                  ? "bg-white text-[#008BE3] shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
                  }`}
              >
                Asesor
              </button>
              <button
                onClick={() => setMainTab("selesai")}
                className={`flex-1 py-2 px-3 text-xs md:text-sm font-bold rounded-md transition-all flex items-center justify-center gap-2 cursor-pointer ${mainTab === "selesai"
                  ? "bg-white text-[#008BE3] shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
                  }`}
              >
                Selesai
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3 w-full lg:w-auto lg:ml-auto">
            {mainTab === "selesai" && (
              <select
                value={selesaiTabFilter}
                onChange={(e) => setSelesaiTabFilter(e.target.value as "semua" | "asesi" | "asesor")}
                className="bg-gray-50/80 border border-gray-200/50 text-gray-700 text-[14px] font-semibold rounded-lg focus:ring-[#008BE3]/40 focus:border-[#008BE3]/40 block w-full md:w-auto p-2.5 outline-none cursor-pointer"
              >
                <option value="semua">Semua Selesai</option>
                <option value="asesi">Asesi Selesai</option>
                <option value="asesor">Asesor Selesai</option>
              </select>
            )}

            <div className="flex items-center gap-2 bg-gray-50/80 rounded-lg px-3 h-10.5 w-full md:w-72 border border-gray-200/50 focus-within:border-[#008BE3]/40 transition-colors">
              <Search className="text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Cari nama, email atau peran..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none focus:ring-0 text-[14px] w-full outline-none text-gray-700 placeholder-gray-400 font-semibold"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto relative">
          <table className="w-full text-left border-collapse min-w-225">
            <thead>
              <tr className="bg-[#0F172A] border-b border-[#0F172A]">
                <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-center min-w-15 sticky top-0 z-20 bg-[#0F172A]">
                  No
                </th>
                <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider whitespace-nowrap min-w-64 sticky top-0 z-20 bg-[#0F172A]">
                  Nama Pengguna
                </th>
                <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider whitespace-nowrap sticky top-0 z-20 bg-[#0F172A]">
                  Email
                </th>
                <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-center whitespace-nowrap sticky top-0 z-20 bg-[#0F172A]">
                  Peran
                </th>
                <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-center whitespace-nowrap sticky top-0 z-20 bg-[#0F172A]">
                  Versi Skema
                </th>
                <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-center whitespace-nowrap sticky top-0 z-20 bg-[#0F172A]">
                  Status Verifikasi
                </th>
                {(mainTab === "asesi" || (mainTab === "selesai" && (selesaiTabFilter === "asesi" || selesaiTabFilter === "semua"))) && (
                  <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-center whitespace-nowrap sticky top-0 z-20 bg-[#0F172A]">
                    Status Pembayaran
                  </th>
                )}
                {(mainTab === "asesor" || (mainTab === "selesai" && (selesaiTabFilter === "asesor" || selesaiTabFilter === "semua"))) && (
                  <>
                    <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-center whitespace-nowrap sticky top-0 z-20 bg-[#0F172A]">
                      Asal Asesor
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-center whitespace-nowrap sticky top-0 z-20 bg-[#0F172A]">
                      Skema Sertifikasi
                    </th>
                  </>
                )}
                <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-center sticky right-0 bg-[#0F172A] z-30 border-l border-white/10 shadow-[-6px_0_15px_-4px_rgba(0,0,0,0.06)] min-w-32 top-0">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/60">
              {isDataLoading ? (
                <tr>
                  <td
                    colSpan={(mainTab === "asesi" || mainTab === "selesai") ? 8 : 8}
                    className="px-6 py-16 text-center text-slate-400"
                  >
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Loader2 className="animate-spin text-[#008BE3]" size={32} />
                      <p className="text-sm font-semibold text-slate-600">
                        Memuat data verifikasi berkas...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={(mainTab === "asesi" || mainTab === "selesai") ? 8 : 8}
                    className="px-6 py-12 text-center text-slate-400"
                  >
                    <div className="flex flex-col items-center justify-center gap-2.5">
                      {mainTab === "asesi" || (mainTab === "selesai" && selesaiTabFilter === "asesi") ? (
                        <>
                          <GraduationCap size={38} className="text-slate-300 stroke-[1.5]" />
                          <p className="text-sm font-bold text-slate-700">
                            {mainTab === "selesai" ? "Tidak ada data Asesi yang Terverifikasi" : "Tidak ada data Asesi ditemukan"}
                          </p>
                          <p className="text-xs text-slate-400">
                            {mainTab === "selesai" ? "Belum ada asesi yang telah selesai diverifikasi dan melakukan pembayaran." : "Belum ada asesi terdaftar atau tidak ada data pencarian yang cocok."}
                          </p>
                        </>
                      ) : mainTab === "asesor" || (mainTab === "selesai" && selesaiTabFilter === "asesor") ? (
                        <>
                          <Award size={38} className="text-slate-300 stroke-[1.5]" />
                          <p className="text-sm font-bold text-slate-700">
                            {mainTab === "selesai" ? "Tidak ada data Asesor yang Terverifikasi" : "Tidak ada data Asesor ditemukan"}
                          </p>
                          <p className="text-xs text-slate-400">
                            {mainTab === "selesai" ? "Belum ada asesor yang telah selesai diverifikasi." : "Belum ada asesor terdaftar atau tidak ada data pencarian yang cocok."}
                          </p>
                        </>
                      ) : (
                        <>
                          <CheckCircle size={38} className="text-slate-300 stroke-[1.5]" />
                          <p className="text-sm font-bold text-slate-700">Tidak ada data Selesai</p>
                          <p className="text-xs text-slate-400">Belum ada asesi atau asesor yang telah selesai diverifikasi.</p>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, index) => (
                  <tr key={user.id} className="group/row hover:bg-[#F9FAFC] transition-colors">
                    <td className="px-6 py-4 text-xs md:text-sm text-center font-semibold text-slate-700">
                      <div
                        className={`mx-auto w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-xs font-bold text-xs ${index % 3 === 0
                          ? "bg-[#008BE3]/10 text-[#008BE3]"
                          : index % 3 === 1
                            ? "bg-[#84CC16]/10 text-[#73B412]"
                            : "bg-slate-100 text-slate-600"
                          }`}
                      >
                        {index + 1}
                      </div>
                    </td>

                    <td className="px-6 py-4 align-middle whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-xs md:text-sm font-bold text-slate-900 whitespace-nowrap">
                          {user.namaLengkap}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-500 whitespace-nowrap mt-0.5">
                          @{user.username}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 align-middle whitespace-nowrap">
                      <span className="text-xs md:text-sm text-slate-600 font-medium whitespace-nowrap">
                        {user.email}
                      </span>
                    </td>

                    <td className="px-6 py-4 align-middle text-center whitespace-nowrap">
                      <span className={`inline-block px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold border whitespace-nowrap ${getRoleBadgeStyle(user.role)}`}>
                        {user.role}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-xs md:text-sm text-center font-bold text-slate-700 whitespace-nowrap">
                      v{user.versiKonfigurasi || "1.0"}
                    </td>

                    <td className="px-6 py-4 align-middle text-center whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold inline-flex items-center gap-1.5 border whitespace-nowrap ${user.status === "Terverifikasi" || user.status === "Selesai"
                          ? "bg-teal-50 text-teal-700 border-teal-200"
                          : user.status === "Perlu Perbaikan" || user.status === "Revisi"
                            ? "bg-orange-50 text-orange-700 border-orange-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                      >
                        {user.status === "Terverifikasi" || user.status === "Selesai" ? (
                          <span className="w-1.5 h-1.5 bg-teal-500 rounded-full"></span>
                        ) : user.status === "Perlu Perbaikan" || user.status === "Revisi" ? (
                          <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                        ) : (
                          <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                        )}
                        {user.status}
                      </span>
                    </td>

                    {(mainTab === "asesi" || (mainTab === "selesai" && (selesaiTabFilter === "asesi" || selesaiTabFilter === "semua"))) && (
                      <td className="px-6 py-4 align-middle text-center whitespace-nowrap">
                        {user.role === "asesor" ? (
                          <span className="text-gray-400">-</span>
                        ) : user.verificationData?.statusPembayaran == "Sudah" ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 bg-green-50 text-green-700 border border-green-200 whitespace-nowrap">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                            Sudah Bayar
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 bg-rose-50 text-rose-700 border border-rose-200 whitespace-nowrap">
                            <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
                            Belum Bayar
                          </span>
                        )}
                      </td>
                    )}

                    {(mainTab === "asesor" || (mainTab === "selesai" && (selesaiTabFilter === "asesor" || selesaiTabFilter === "semua"))) && (
                      <>
                        <td className="px-6 py-4 align-middle text-center whitespace-nowrap">
                          {user.role === "asesi" ? (
                            <span className="text-gray-400">-</span>
                          ) : (
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${user.verificationData?.asalAsesor === "Eksternal" ? "bg-purple-50 text-purple-700 border-purple-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"}`}>
                              {user.verificationData?.asalAsesor === "Eksternal" ? "Eksternal" : "Internal"}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 align-middle text-center whitespace-nowrap">
                          {user.role === "asesi" ? (
                            <span className="text-gray-400">-</span>
                          ) : (
                            <span className="text-xs md:text-sm font-semibold text-slate-700 max-w-[200px] truncate inline-block" title={user.verificationData?.skema as string}>
                              {(user.verificationData?.skema as string) || "Belum Ada"}
                            </span>
                          )}
                        </td>
                      </>
                    )}

                    <td className="px-6 py-4 align-middle text-center sticky right-0 bg-white group-hover/row:bg-[#F9FAFC] z-10 border-l border-gray-100 shadow-[-6px_0_15px_-4px_rgba(0,0,0,0.06)] transition-colors whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        {readOnly ? (
                          <button
                            onClick={() => openVerifyModal(user)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-sky-50 text-[#008BE3] border border-slate-200 hover:border-[#008BE3]/30 rounded-lg text-xs font-bold transition-all shadow-2xs shrink-0 cursor-pointer"
                            title="Lihat Detail Berkas"
                          >
                            <Eye size={14} /> <span>Detail</span>
                          </button>
                        ) : (
                          <>
                            <button
                              data-bypass-confirm="true"
                              onClick={() => {
                                setSelectedUser(user);
                                setIsDeleteModalOpen(true);
                              }}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200 cursor-pointer"
                              title="Hapus"
                            >
                              <Trash2 size={16} />
                            </button>

                            {(mainTab === "asesi" || (mainTab === "selesai" && (selesaiTabFilter === "asesi" || selesaiTabFilter === "semua"))) && user.role === "asesi" && (
                              <button
                                onClick={() => openPaymentModal(user)}
                                className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-transparent hover:border-indigo-200 cursor-pointer"
                                title="Ubah Status Pembayaran"
                              >
                                <CreditCard size={16} />
                              </button>
                            )}

                            {mainTab === "asesi" ? (
                              <button
                                onClick={() => openVerifyModal(user)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#008BE3] text-white hover:bg-[#0076C2] rounded-lg text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
                              >
                                <FileCheck size={14} /> Verifikasi Berkas
                              </button>
                            ) : (
                              <button
                                onClick={() => openVerifyModal(user)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-bold transition-all shadow-2xs shrink-0 cursor-pointer"
                              >
                                <Eye size={14} /> Lihat Berkas
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
            className="bg-white rounded-xl shadow-xl w-full max-w-sm relative z-10 overflow-hidden"
          >
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
                <Trash2 size={24} />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Hapus Pengguna</h3>
              <p className="text-xs text-gray-500">
                Apakah Anda yakin ingin menghapus {selectedUser?.namaLengkap}?
                Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            <div className="p-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                data-bypass-confirm="true"
                onClick={handleDeleteUser}
                className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-xs cursor-pointer"
              >
                Hapus
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {isPaymentModalOpen && userToEditPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setIsPaymentModalOpen(false);
              setUserToEditPayment(null);
            }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-md w-full relative z-10 overflow-hidden"
          >
            <div className="p-5 border-b border-slate-100 bg-linear-to-r from-sky-50 to-blue-50/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#008BE3]/10 text-[#008BE3] flex items-center justify-center font-bold">
                  <CreditCard size={20} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Ubah Status Pembayaran
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Asesi: {userToEditPayment.namaLengkap}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsPaymentModalOpen(false);
                  setUserToEditPayment(null);
                }}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <XCircle size={18} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Status Pembayaran <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setPaymentFormData({
                        ...paymentFormData,
                        statusPembayaran: "Sudah",
                      })
                    }
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${paymentFormData.statusPembayaran === "Sudah"
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                      }`}
                  >
                    <CheckCircle size={16} />
                    Sudah Bayar
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setPaymentFormData({
                        ...paymentFormData,
                        statusPembayaran: "Belum",
                      })
                    }
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${paymentFormData.statusPembayaran === "Belum"
                      ? "bg-rose-500 text-white border-rose-500 shadow-xs"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                      }`}
                  >
                    <XCircle size={16} />
                    Belum Bayar
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Sumber Anggaran <span className="text-red-500">*</span>
                </label>
                <select
                  value={paymentFormData.sumberAnggaran}
                  onChange={(e) =>
                    setPaymentFormData({
                      ...paymentFormData,
                      sumberAnggaran: e.target.value,
                    })
                  }
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800 bg-slate-50/80 outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/30 transition-all cursor-pointer"
                >
                  <option value="Sumber Anggaran Biaya Mandiri">
                    Sumber Anggaran Biaya Mandiri
                  </option>
                  <option value="Sumber Anggaran dari APBN">
                    Sumber Anggaran dari APBN
                  </option>
                  <option value="Sumber Anggaran dari APBD">
                    Sumber Anggaran dari APBD
                  </option>
                  <option value="Sumber Anggaran Biaya dari Perusahaan">
                    Sumber Anggaran Biaya dari Perusahaan
                  </option>
                </select>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2.5">
              <button
                onClick={() => {
                  setIsPaymentModalOpen(false);
                  setUserToEditPayment(null);
                }}
                className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleSavePayment}
                className="px-4 py-2 text-xs font-bold text-white bg-[#008BE3] hover:bg-[#0076C2] rounded-xl transition-colors shadow-xs cursor-pointer"
              >
                Simpan Perubahan
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}