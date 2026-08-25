import React, { useState } from "react";
import {
  Search,
  Trash2,
  CheckCircle,
  Clock,
  Eye,
  Users,
  ArrowLeft,
  CreditCard,
  XCircle,
  FileCheck,
  GraduationCap,
  Award,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import SignatureCanvas from "react-signature-canvas";
import { useRef } from "react";
import { EFormApl01 } from "@/components/forms/asesi/FormFRAPL01";
import { EFormApl02 } from "@/components/forms/asesi/FormFRAPL02";
import { useAppContext } from "@/context/context";
import { UserItem, Apl01FormData, Apl02FormData } from "@/types/types";

export function UsersManagement() {
  const { user } = useAppContext();
  const readOnly = user?.role === "direktur" || user?.role === "manajer";

  const [mainTab, setMainTab] = useState<"asesi" | "asesor">("asesi");

  const [users, setUsers] = useState<UserItem[]>([
    {
      id: "1",
      initial: "AH",
      name: "Ahmad Hidayat",
      email: "ahmad.h@student.uin.ac.id",
      role: "Asesi",
      status: "Menunggu Verifikasi",
      verificationData: {
        rekomendasi: "Diterima",
        catatan: "",
        statusPembayaran: "Belum",
        sumberAnggaran: "Sumber Anggaran Biaya Mandiri",
      },
    },
    {
      id: "2",
      initial: "BP",
      name: "Budi Pratama",
      email: "budi.p@student.uin.ac.id",
      role: "Asesi",
      status: "Menunggu Verifikasi",
      verificationData: {
        rekomendasi: "Diterima",
        catatan: "",
        statusPembayaran: "Sudah",
        sumberAnggaran: "Sumber Anggaran dari APBN",
      },
    },
    {
      id: "3",
      initial: "DL",
      name: "Dewi Lestari",
      email: "dewi.l@student.uin.ac.id",
      role: "Asesi",
      status: "Terverifikasi",
      verificationData: {
        rekomendasi: "Diterima",
        catatan: "Dokumen APL 01 & APL 02 telah terverifikasi secara sah.",
        statusPembayaran: "Sudah",
        sumberAnggaran: "Sumber Anggaran dari APBN",
      },
    },
    {
      id: "4",
      initial: "RH",
      name: "Rahmat Hidayat",
      email: "rahmat.h@student.uin.ac.id",
      role: "Asesi",
      status: "Terverifikasi",
      verificationData: {
        rekomendasi: "Diterima",
        catatan: "Persyaratan dasar dan dokumen administrasi lengkap.",
        statusPembayaran: "Sudah",
        sumberAnggaran: "Sumber Anggaran Biaya Mandiri",
      },
    },
    {
      id: "5",
      initial: "SR",
      name: "Dr. Siti Rohmah",
      email: "siti.r@lecturer.uin.ac.id",
      role: "Asesor",
      status: "Terverifikasi",
    },
    {
      id: "asr-1",
      initial: "IT",
      name: "Ichsan Taufik",
      email: "ichsan.taufik@lsp.uin.ac.id",
      role: "Asesor",
      status: "Terverifikasi",
    },
    {
      id: "asr-2",
      initial: "AK",
      name: "Aceng Abdul Kodir",
      email: "aceng.kodir@lsp.uin.ac.id",
      role: "Asesor",
      status: "Terverifikasi",
    },
    {
      id: "asr-3",
      initial: "SF",
      name: "Susanti Ainul Fitri",
      email: "susanti.fitri@lsp.uin.ac.id",
      role: "Asesor",
      status: "Terverifikasi",
    },
    {
      id: "asr-4",
      initial: "SM",
      name: "M Sandi Marta",
      email: "sandi.marta@lsp.uin.ac.id",
      role: "Asesor",
      status: "Terverifikasi",
    },
    {
      id: "asr-5",
      initial: "GS",
      name: "Gina Sakinah",
      email: "gina.sakinah@lsp.uin.ac.id",
      role: "Asesor",
      status: "Terverifikasi",
    },
    {
      id: "asr-6",
      initial: "EW",
      name: "Elis Ratna Wulan",
      email: "elis.wulan@lsp.uin.ac.id",
      role: "Asesor",
      status: "Terverifikasi",
    },
    {
      id: "asr-7",
      initial: "AS",
      name: "Asep Abdul Sahid",
      email: "asep.sahid@lsp.uin.ac.id",
      role: "Asesor",
      status: "Terverifikasi",
    },
    {
      id: "asr-8",
      initial: "SA",
      name: "Siti Alia",
      email: "siti.alia@lsp.uin.ac.id",
      role: "Asesor",
      status: "Terverifikasi",
    },
    {
      id: "asr-9",
      initial: "AF",
      name: "Azmi Fasa",
      email: "azmi.fasa@lsp.uin.ac.id",
      role: "Asesor",
      status: "Terverifikasi",
    },
    {
      id: "asr-10",
      initial: "CS",
      name: "Cucu Susilawati",
      email: "cucu.susilawati@lsp.uin.ac.id",
      role: "Asesor",
      status: "Terverifikasi",
    },
    {
      id: "asr-11",
      initial: "FW",
      name: "Fitri Pebriani Wahyu",
      email: "fitri.wahyu@lsp.uin.ac.id",
      role: "Asesor",
      status: "Terverifikasi",
    },
    {
      id: "asr-12",
      initial: "TR",
      name: "Tina Dewi Rosahdi",
      email: "tina.rosahdi@lsp.uin.ac.id",
      role: "Asesor",
      status: "Terverifikasi",
    },
    {
      id: "asr-13",
      initial: "UJ",
      name: "Ucu Julita",
      email: "ucu.julita@lsp.uin.ac.id",
      role: "Asesor",
      status: "Terverifikasi",
    },
    {
      id: "asr-14",
      initial: "AM",
      name: "Acep Muslim",
      email: "acep.muslim@lsp.uin.ac.id",
      role: "Asesor",
      status: "Terverifikasi",
    },
    {
      id: "asr-15",
      initial: "IK",
      name: "Izzah Faizah Siti Rusydati Khaerani",
      email: "izzah.faizah@lsp.uin.ac.id",
      role: "Asesor",
      status: "Terverifikasi",
    },
    {
      id: "asr-16",
      initial: "MA",
      name: "Muhammad Alfan",
      email: "muhammad.alfan@lsp.uin.ac.id",
      role: "Asesor",
      status: "Terverifikasi",
    },
    {
      id: "asr-17",
      initial: "EA",
      name: "Erlan Aditya Ardiansyah",
      email: "erlan.ardiansyah@lsp.uin.ac.id",
      role: "Asesor",
      status: "Terverifikasi",
    },
    {
      id: "asr-18",
      initial: "DG",
      name: "Dian Rachmat Gumelar",
      email: "dian.gumelar@lsp.uin.ac.id",
      role: "Asesor",
      status: "Terverifikasi",
    },
    {
      id: "asr-19",
      initial: "RN",
      name: "Reza Fauzi Nazar",
      email: "reza.nazar@lsp.uin.ac.id",
      role: "Asesor",
      status: "Terverifikasi",
    },
    {
      id: "asr-20",
      initial: "RS",
      name: "Rini Sulastri",
      email: "rini.sulastri@lsp.uin.ac.id",
      role: "Asesor",
      status: "Terverifikasi",
    },
    {
      id: "asr-21",
      initial: "YM",
      name: "Yadi Mardiansyah",
      email: "yadi.mardiansyah@lsp.uin.ac.id",
      role: "Asesor",
      status: "Terverifikasi",
    },
    {
      id: "asr-22",
      initial: "DY",
      name: "Dayudin",
      email: "dayudin@lsp.uin.ac.id",
      role: "Asesor",
      status: "Terverifikasi",
    },
    {
      id: "asr-23",
      initial: "WU",
      name: "Wisnu Uriawan",
      email: "wisnu.uriawan@lsp.uin.ac.id",
      role: "Asesor",
      status: "Terverifikasi",
    },
    {
      id: "asr-24",
      initial: "MR",
      name: "M. Ridha Taufiq Rahman",
      email: "ridha.rahman@lsp.uin.ac.id",
      role: "Asesor",
      status: "Terverifikasi",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [userToVerify, setUserToVerify] = useState<UserItem | null>(null);
  const [activeVerifyTab, setActiveVerifyTab] = useState<"apl01" | "apl02">(
    "apl01",
  );
  const [adminSignature, setAdminSignature] = useState(false);
  const signatureRef = useRef<SignatureCanvas | null>(null);
  const [lspSignature, setLspSignature] = useState(false);
  const lspSignatureRef = useRef<SignatureCanvas | null>(null);
  const [verificationForm, setVerificationForm] = useState({
    rekomendasi: "Diterima",
    catatan: "",
  });
  const [apl01FormData, setApl01FormData] = useState<Apl01FormData>({
    isAdmin: true,
    hidePaymentFields: true,
  });
  const [apl02FormData, setApl02FormData] = useState<Apl02FormData>({
    isAdmin: true,
  });
  const [selectedAsesorId, setSelectedAsesorId] = useState<string>("");

  // Payment Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [userToEditPayment, setUserToEditPayment] = useState<UserItem | null>(
    null,
  );
  const [paymentFormData, setPaymentFormData] = useState({
    statusPembayaran: "Belum" as "Sudah" | "Belum",
    sumberAnggaran: "Sumber Anggaran Biaya Mandiri",
  });

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

  const handleSavePayment = () => {
    if (!userToEditPayment) return;
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

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Asesor",
  });

  // Filtered Lists for Asesi vs Asesor
  const asesiUsers = users.filter((user) => user.role === "Asesi");
  const asesorUsers = users.filter((user) => user.role === "Asesor");

  const currentList = mainTab === "asesi" ? asesiUsers : asesorUsers;

  const filteredUsers = currentList.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleAddUser = () => {
    const newUser: UserItem = {
      id: Date.now().toString(),
      initial: formData.name.substring(0, 2).toUpperCase() || "U",
      name: formData.name || "User Baru",
      email: formData.email || "user@example.com",
      role: formData.role,
      status: "Terverifikasi",
    };
    setUsers([...users, newUser]);
    setIsModalOpen(false);
    setFormData({ name: "", email: "", role: "Asesor" });
  };

  const handleEditUser = () => {
    if (selectedUser) {
      setUsers(
        users.map((u) =>
          u.id === selectedUser.id
            ? {
                ...u,
                name: formData.name,
                email: formData.email,
                role: formData.role,
                initial: formData.name.substring(0, 2).toUpperCase() || "U",
              }
            : u,
        ),
      );
    }
    setIsEditModalOpen(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = () => {
    if (selectedUser) {
      setUsers(users.filter((u) => u.id !== selectedUser.id));
    }
    setIsDeleteModalOpen(false);
    setSelectedUser(null);
  };

  const confirmVerify = () => {
    if (userToVerify) {
      let currentAdminUrl =
        userToVerify.verificationData?.adminSignatureUrl || null;
      const currentLspUrl =
        userToVerify.verificationData?.lspSignatureUrl || null;

      if (activeVerifyTab === "apl01") {
        currentAdminUrl = apl01FormData.ttdAdmin || null;
      }

      const newVerificationData = {
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

      setUsers(
        users.map((u) =>
          u.id === userToVerify.id
            ? {
                ...u,
                status: "Siap Ujian Sertifikasi",
                verificationData: newVerificationData,
              }
            : u,
        ),
      );
    }
    setIsVerifyModalOpen(false);
    setUserToVerify(null);
  };

  const handleAssignAsesor = () => {
    if (!userToVerify || !selectedAsesorId) return;

    let currentAdminUrl =
      userToVerify.verificationData?.adminSignatureUrl || null;
    const currentLspUrl =
      userToVerify.verificationData?.lspSignatureUrl || null;

    if (activeVerifyTab === "apl01") {
      currentAdminUrl = apl01FormData.ttdAdmin || null;
    }

    const newVerificationData = {
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
      rekomendasiApl02: userToVerify.verificationData?.rekomendasiApl02,
      ttdAsesor: userToVerify.verificationData?.ttdAsesor,
      asesorName: userToVerify.verificationData?.asesorName,
      asesorReg: userToVerify.verificationData?.asesorReg,
      penyusun: userToVerify.verificationData?.penyusun,
      validator: userToVerify.verificationData?.validator,
      assignedAsesorId: selectedAsesorId,
    };

    setUsers(
      users.map((u) =>
        u.id === userToVerify.id
          ? {
              ...u,
              status: "Menunggu Penilaian Asesor",
              verificationData: newVerificationData,
            }
          : u,
      ),
    );

    setIsVerifyModalOpen(false);
    setUserToVerify(null);
  };

  const openVerifyModal = (user: UserItem) => {
    setUserToVerify(user);
    setActiveVerifyTab("apl01");
    setSelectedAsesorId(user.verificationData?.assignedAsesorId || "");
    setApl01FormData({
      isAdmin: true,
      namaLengkap: user.name,
      rekomendasi: user.verificationData?.rekomendasi || "Diterima",
      catatan: user.verificationData?.catatan || "",
      statusPembayaran: user.verificationData?.statusPembayaran || "Sudah",
      sumberAnggaran:
        user.verificationData?.sumberAnggaran ||
        "Sumber Anggaran Biaya Mandiri",
      ttdAdmin: user.verificationData?.adminSignatureUrl,
      tujuan: "Sertifikasi",
      ttdAsesi: { type: "auto" },
      onPreview: (fileName: string) => setPreviewFile(fileName),
      schemeDetail: {
        persyaratanDasar: [
          { name: "Scan KTP", type: "File Upload", required: true },
          { name: "Ijazah Terakhir", type: "File Upload", required: true },
          { name: "Transkrip Nilai", type: "File Upload", required: true },
          { name: "Pasfoto", type: "File Upload", required: true },
        ],
        buktiAdministratif: [
          "Sertifikat Pelatihan Tambahan",
          "Surat Keterangan Kerja",
        ],
        buktiKompetensi: [
          "Portofolio Proyek",
          "Sertifikat Kompetensi Sebelumnya",
        ],
      },
    });
    setApl02FormData({
      isAdmin: true,
      namaLengkap: user.name,
      rekomendasiApl02:
        user.verificationData?.rekomendasiApl02 || "Dapat dilanjutkan",
      ttdAsesi: { type: "auto" },
      kompetensi: { u0e0: "K", u0e1: "K", u1e0: "K" },
      ttdAsesor: user.verificationData?.ttdAsesor || null,
      asesorName: user.verificationData?.asesorName || "",
      asesorReg: user.verificationData?.asesorReg || "",
      penyusun: user.verificationData?.penyusun || [
        { nama: "", noMet: "", ttdTanggal: "" },
        { nama: "", noMet: "", ttdTanggal: "" },
      ],
      validator: user.verificationData?.validator || [
        { nama: "", noMet: "", ttdTanggal: "" },
        { nama: "", noMet: "", ttdTanggal: "" },
      ],
    });

    if (user.verificationData) {
      setVerificationForm({
        rekomendasi: user.verificationData.rekomendasi,
        catatan: user.verificationData.catatan,
      });
      setAdminSignature(!!user.verificationData.adminSignatureUrl);
      setLspSignature(!!user.verificationData.lspSignatureUrl);
      setTimeout(() => {
        if (user.verificationData?.adminSignatureUrl && signatureRef.current) {
          signatureRef.current.fromDataURL(
            user.verificationData.adminSignatureUrl,
          );
        }
        if (user.verificationData?.lspSignatureUrl && lspSignatureRef.current) {
          lspSignatureRef.current.fromDataURL(
            user.verificationData.lspSignatureUrl,
          );
        }
      }, 50);
    } else {
      setVerificationForm({ rekomendasi: "Diterima", catatan: "" });
      setAdminSignature(false);
      setLspSignature(false);
      setTimeout(() => {
        if (signatureRef.current) signatureRef.current.clear();
        if (lspSignatureRef.current) lspSignatureRef.current.clear();
      }, 50);
    }
    setIsVerifyModalOpen(true);
  };

  const handleSaveVerifyDraft = () => {
    if (!userToVerify) return;

    let currentAdminUrl =
      userToVerify.verificationData?.adminSignatureUrl || null;
    const currentLspUrl = userToVerify.verificationData?.lspSignatureUrl || null;

    if (activeVerifyTab === "apl01") {
      currentAdminUrl = apl01FormData.ttdAdmin || null;
    }

    const newVerificationData = {
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

    setUsers(users.map((u) => (u.id === userToVerify.id ? updatedUser : u)));
    setIsVerifyModalOpen(false);
    setUserToVerify(null);
  };

  if (isVerifyModalOpen && userToVerify) {
    const totalReqs = [
      ...(apl01FormData.schemeDetail?.persyaratanDasar || []),
      ...(apl01FormData.schemeDetail?.buktiAdministratif || []),
      ...(apl01FormData.schemeDetail?.buktiKompetensi || []),
    ].length;
    const checkedReqs = Object.keys(apl01FormData.checklist || {}).length;
    const isApl01Valid =
      !!apl01FormData.ttdAdmin &&
      (totalReqs === 0 || checkedReqs === totalReqs);

    return (
      <div className="min-h-screen bg-[#F8F9FC] p-4 md:p-8 pb-24 text-sm text-gray-700">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setIsVerifyModalOpen(false);
                setUserToVerify(null);
              }}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-[#008BE3] bg-[#008BE3]/10 hover:bg-[#008BE3]/20 transition-colors cursor-pointer shrink-0"
              title="Kembali"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="min-w-0">
              <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                Tinjauan Verifikasi Berkas
              </h2>
              <p className="text-xs text-gray-500 font-medium mt-1">
                Periksa detail dokumen {userToVerify.name} sebelum menyetujui.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden flex flex-col">
            {userToVerify.role === "Asesi" && (
              <div className="border-b border-gray-100 bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-sky-50 text-[#008BE3] flex items-center justify-center font-bold text-sm border border-sky-100">
                      {userToVerify.initial}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900">
                        {userToVerify.name}
                      </p>
                      <p className="text-xs text-gray-500 font-medium">
                        {userToVerify.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${activeVerifyTab === "apl01" ? "bg-[#008BE3] text-white shadow-sm" : "bg-slate-200 text-slate-500"}`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${activeVerifyTab === "apl01" ? "bg-white text-[#008BE3]" : "bg-slate-300 text-slate-500"}`}
                      >
                        1
                      </span>
                      FR.APL.01
                    </div>
                    <div className="w-8 h-px bg-slate-300"></div>
                    <div
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${activeVerifyTab === "apl02" ? "bg-[#008BE3] text-white shadow-sm" : "bg-slate-200 text-slate-500"}`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${activeVerifyTab === "apl02" ? "bg-white text-[#008BE3]" : "bg-slate-300 text-slate-500"}`}
                      >
                        2
                      </span>
                      FR.APL.02
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="p-6 space-y-4">
              {userToVerify.role === "Asesi" ? (
                <>
                  {activeVerifyTab === "apl01" ? (
                    <div className="space-y-6">
                      <EFormApl01
                        formData={apl01FormData}
                        onChange={setApl01FormData}
                      />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <EFormApl02
                        formData={apl02FormData}
                        onChange={setApl02FormData}
                        allData={{
                          "UK.01 - Menyiapkan pemeriksaan dokumen": {
                            name: "Ijazah.pdf",
                          },
                          "UK.01 - Melakukan pemeriksaan kesesuaian bukti": {
                            name: "Portofolio.pdf",
                          },
                          "UK.02 - Menyusun ringkasan bukti": {
                            name: "Transkrip.pdf",
                          },
                        }}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="grid gap-3">
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase font-bold text-slate-500 mb-0.5">
                      Bidang Keahlian / Skema
                    </p>
                    <p className="text-sm font-bold text-slate-800">
                      Rekayasa Perangkat Lunak
                    </p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase font-bold text-slate-500 mb-0.5">
                      No. Registrasi / NIP
                    </p>
                    <p className="text-sm font-bold text-slate-800">
                      MET.000.12345.2023
                    </p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase font-bold text-slate-500 mb-0.5">
                      Sertifikat Asesor
                    </p>
                    <p className="text-xs font-bold text-green-700 flex items-center gap-1.5">
                      <CheckCircle size={14} /> Terlampir
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 mt-auto">
              <button
                onClick={() => {
                  setIsVerifyModalOpen(false);
                  setUserToVerify(null);
                }}
                className="px-4 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-bold transition-colors shadow-xs mr-auto"
              >
                Batal
              </button>

              <button
                onClick={handleSaveVerifyDraft}
                className="px-4 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-bold transition-colors shadow-xs"
              >
                Simpan Draft
              </button>

              {userToVerify.role === "Asesi" && activeVerifyTab === "apl01" ? (
                <button
                  onClick={() => setActiveVerifyTab("apl02")}
                  disabled={!isApl01Valid}
                  className={`px-6 py-2 rounded-lg text-sm font-bold transition-colors shadow-xs ${!isApl01Valid ? "bg-slate-200 text-slate-400 cursor-not-allowed" : "bg-[#008BE3] text-white hover:bg-[#0076C2]"}`}
                >
                  Approve Form 1 & Selanjutnya
                </button>
              ) : (
                <>
                  {!apl02FormData.ttdAsesor && userToVerify.role === "Asesi" ? (
                    <div className="flex items-center gap-3 min-w-0">
                      <select
                        value={selectedAsesorId}
                        onChange={(e) => setSelectedAsesorId(e.target.value)}
                        className="px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 outline-none focus:border-[#008BE3]"
                      >
                        <option value="">Pilih Asesor...</option>
                        {users
                          .filter((u) => u.role === "Asesor")
                          .map((asesor) => (
                            <option key={asesor.id} value={asesor.id}>
                              {asesor.name}
                            </option>
                          ))}
                      </select>
                      <button
                        onClick={handleAssignAsesor}
                        disabled={!selectedAsesorId}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-colors shadow-xs ${!selectedAsesorId ? "bg-slate-200 text-slate-400 cursor-not-allowed" : "bg-[#008BE3] text-white hover:bg-[#0076C2]"}`}
                      >
                        Tugaskan ke Asesor
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={confirmVerify}
                      disabled={
                        userToVerify?.role === "Asesi" &&
                        activeVerifyTab === "apl02" &&
                        (!apl01FormData.ttdAdmin || !apl02FormData.ttdAsesor)
                      }
                      className={`px-6 py-2 rounded-lg text-sm font-bold transition-colors shadow-xs ${userToVerify?.role === "Asesi" && activeVerifyTab === "apl02" && (!apl01FormData.ttdAdmin || !apl02FormData.ttdAsesor) ? "bg-slate-200 text-slate-400 cursor-not-allowed" : "bg-green-600 text-white hover:bg-green-700"}`}
                    >
                      Verifikasi Akun (Siap Ujian)
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Document Preview Modal */}
        {previewFile && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewFile(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-2xl h-[80vh] relative z-10 flex flex-col overflow-hidden"
            >
              <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                <h3 className="font-bold text-slate-900">{previewFile}</h3>
                <button
                  onClick={() => setPreviewFile(null)}
                  className="text-slate-400 hover:text-slate-600 font-bold text-sm bg-white border border-slate-200 px-3 py-1 rounded-md shadow-sm"
                >
                  Tutup
                </button>
              </div>
              <div className="flex-1 p-6 bg-slate-100 flex items-center justify-center">
                <div className="w-full h-full bg-white border border-slate-200 rounded shadow-sm flex flex-col items-center justify-center text-slate-400">
                  <div className="text-6xl mb-4">📄</div>
                  <p className="font-medium text-slate-500">
                    Pratinjau Dokumen PDF / Gambar
                  </p>
                  <p className="text-xs mt-2">
                    Ini adalah simulasi tampilan dokumen.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC] p-3 sm:p-6 md:p-8 space-y-4 sm:space-y-6 pb-24 text-sm text-gray-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-[#008BE3]/10 flex items-center justify-center text-[#008BE3] border border-[#008BE3]/20 shadow-xs shrink-0">
            <Users size={20} className="stroke-[2.5]" />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">
              Verifikasi Berkas
            </h2>
            <p className="text-xs text-gray-500 font-medium tracking-wider uppercase leading-[16px]">
              {mainTab === "asesi"
                ? "Daftar dokumen & berkas pendaftaran APL.01 & APL.02 Asesi."
                : "Daftar berkas & data kualifikasi Asesor."}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs: Asesi vs Asesor */}
      <div className="bg-white p-1 rounded-xl shadow-xs border border-gray-100 flex items-center w-full max-w-md">
        <button
          onClick={() => setMainTab("asesi")}
          className={`flex-1 py-2.5 px-3 text-xs md:text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
            mainTab === "asesi"
              ? "bg-[#008BE3] text-white shadow-xs"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <span>Asesi</span>
        </button>

        <button
          onClick={() => setMainTab("asesor")}
          className={`flex-1 py-2.5 px-3 text-xs md:text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
            mainTab === "asesor"
              ? "bg-[#008BE3] text-white shadow-xs"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <span>Asesor</span>
        </button>
      </div>

      <div className="bg-white p-3.5 sm:p-5 rounded-lg shadow-xs border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between items-stretch sm:items-center">
          <div className="relative w-full sm:max-w-md">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Cari nama, email atau peran..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3] outline-none text-sm transition-all placeholder:text-gray-400"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-xs border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0F172A] border-b border-[#0F172A]">
                <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider whitespace-nowrap">
                  Nama Pengguna
                </th>
                <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider whitespace-nowrap">
                  Email
                </th>
                <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider whitespace-nowrap">
                  Peran
                </th>
                <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider whitespace-nowrap">
                  Status Verifikasi
                </th>
                {mainTab === "asesi" && (
                  <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider whitespace-nowrap">
                    Status Pembayaran
                  </th>
                )}
                <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-left sticky right-0 bg-[#0F172A] z-10 border-l border-white/10 shadow-[-6px_0_15px_-4px_rgba(0,0,0,0.06)] whitespace-nowrap">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/60">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={mainTab === "asesi" ? 6 : 5}
                    className="px-6 py-12 text-center text-slate-400"
                  >
                    <div className="flex flex-col items-center justify-center gap-2.5">
                      {mainTab === "asesi" ? (
                        <>
                          <GraduationCap
                            size={38}
                            className="text-slate-300 stroke-[1.5]"
                          />
                          <p className="text-sm font-bold text-slate-700">
                            Tidak ada data Asesi ditemukan
                          </p>
                          <p className="text-xs text-slate-400">
                            Belum ada asesi terdaftar atau tidak ada data yang
                            cocok dengan pencarian.
                          </p>
                        </>
                      ) : (
                        <>
                          <Award
                            size={38}
                            className="text-slate-300 stroke-[1.5]"
                          />
                          <p className="text-sm font-bold text-slate-700">
                            Tidak ada data Asesor ditemukan
                          </p>
                          <p className="text-xs text-slate-400">
                            Belum ada asesor terdaftar atau tidak ada data yang
                            cocok dengan pencarian.
                          </p>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="group/row hover:bg-[#F9FAFC] transition-colors"
                  >
                    {/* Nama Pengguna */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-sky-50 text-[#008BE3] flex items-center justify-center font-bold text-xs border border-sky-100 shrink-0">
                          {user.initial}
                        </div>
                        <span className="text-sm font-bold text-slate-900 whitespace-nowrap">
                          {user.name}
                        </span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-xs text-slate-600 font-medium whitespace-nowrap">
                        {user.email}
                      </span>
                    </td>

                    {/* Peran */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`border px-2.5 py-1 rounded text-xs font-bold inline-block whitespace-nowrap ${
                          user.role === "Asesor"
                            ? "bg-[#E6F4FF] text-[#008BE3] border-[#BCE0FD]"
                            : "bg-slate-50 text-slate-700 border-slate-200 font-medium"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>

                    {/* Status Verifikasi */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 border whitespace-nowrap ${
                          user.status === "Terverifikasi" ||
                          user.status === "Siap Ujian Sertifikasi"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        {user.status === "Terverifikasi" ||
                        user.status === "Siap Ujian Sertifikasi" ? (
                          <CheckCircle
                            size={12}
                            className="stroke-[2.5] shrink-0"
                          />
                        ) : (
                          <Clock size={12} className="stroke-[2.5] shrink-0" />
                        )}
                        {user.status}
                      </span>
                    </td>

                    {/* Status Pembayaran Column for Asesi */}
                    {mainTab === "asesi" && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.verificationData?.statusPembayaran === "Sudah" ? (
                          <span className="px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
                            <CheckCircle
                              size={12}
                              className="stroke-[2.5] shrink-0"
                            />
                            Sudah Bayar
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200 whitespace-nowrap">
                            <XCircle
                              size={12}
                              className="stroke-[2.5] shrink-0"
                            />
                            Belum Bayar
                          </span>
                        )}
                      </td>
                    )}

                    <td className="px-6 py-4 text-left sticky right-0 bg-white group-hover/row:bg-[#F9FAFC] z-10 border-l border-gray-100 shadow-[-6px_0_15px_-4px_rgba(0,0,0,0.02)] whitespace-nowrap">
                      {readOnly ? (
                        <button
                          onClick={() => openVerifyModal(user)}
                          className="bg-sky-50 text-[#008BE3] border border-sky-200 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-sky-100 transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-2xs"
                          title="Lihat Detail Berkas & Data Pengguna"
                        >
                          <Eye size={14} /> Detail
                        </button>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setIsDeleteModalOpen(true);
                            }}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Hapus"
                          >
                            <Trash2 size={16} />
                          </button>
                          {mainTab === "asesi" && (
                            <button
                              onClick={() => openPaymentModal(user)}
                              className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors cursor-pointer"
                              title="Ubah Status Pembayaran & Sumber Anggaran"
                            >
                              <CreditCard size={16} />
                            </button>
                          )}
                          {user.status === "Menunggu Verifikasi" ? (
                            <button
                              onClick={() => openVerifyModal(user)}
                              className="bg-sky-50 text-[#008BE3] border border-sky-200 px-3 py-1 rounded text-xs font-bold hover:bg-[#008BE3] hover:text-white hover:border-[#008BE3] transition-colors ml-2 cursor-pointer inline-flex items-center gap-1"
                            >
                              <FileCheck size={14} />
                              Verifikasi
                            </button>
                          ) : (
                            <button
                              onClick={() => openVerifyModal(user)}
                              className="bg-slate-50 text-slate-700 border border-slate-200 px-3 py-1 rounded text-xs font-bold hover:bg-slate-100 hover:text-slate-900 transition-colors ml-2 cursor-pointer inline-flex items-center gap-1"
                            >
                              <Eye size={14} />
                              Lihat Berkas
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {(isModalOpen || isEditModalOpen) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-xl shadow-xl border border-slate-100 max-w-md w-full overflow-hidden"
            >
              <div className="p-5 border-b border-gray-100">
                <h3 className="text-lg font-black text-slate-900">
                  {isEditModalOpen ? "Edit Pengguna" : "Tambah Pengguna Baru"}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {isEditModalOpen
                    ? "Ubah data pengguna ini."
                    : "Tambahkan akun pengguna untuk Admin atau Asesor."}
                </p>
              </div>
              <div className="p-5 space-y-4">
                <div className="min-w-0">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    placeholder="Masukkan nama lengkap"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-slate-800 outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40"
                  />
                </div>
                <div className="min-w-0">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Email Aktif
                  </label>
                  <input
                    type="email"
                    placeholder="contoh@domain.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-slate-800 outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40"
                  />
                </div>
                <div className="min-w-0">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Peran
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-slate-800 outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40"
                  >
                    <option>Asesor</option>
                    <option>Admin</option>
                    <option>Asesi</option>
                  </select>
                </div>
              </div>
              <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setIsEditModalOpen(false);
                  }}
                  className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-sm font-bold transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={isEditModalOpen ? handleEditUser : handleAddUser}
                  className="px-4 py-2 bg-[#008BE3] text-white hover:bg-[#0076C2] rounded-lg text-sm font-bold transition-colors shadow-xs"
                >
                  Simpan
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Document Preview Modal */}
        {previewFile && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewFile(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-2xl h-[80vh] relative z-10 flex flex-col overflow-hidden"
            >
              <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                <h3 className="font-bold text-slate-900">{previewFile}</h3>
                <button
                  onClick={() => setPreviewFile(null)}
                  className="text-slate-400 hover:text-slate-600 font-bold text-sm bg-white border border-slate-200 px-3 py-1 rounded-md shadow-sm"
                >
                  Tutup
                </button>
              </div>
              <div className="flex-1 p-6 bg-slate-100 flex items-center justify-center">
                <div className="w-full h-full bg-white border border-slate-200 rounded shadow-sm flex flex-col items-center justify-center text-slate-400">
                  <div className="text-6xl mb-4">📄</div>
                  <p className="font-medium text-slate-500">
                    Pratinjau Dokumen PDF / Gambar
                  </p>
                  <p className="text-xs mt-2">
                    Ini adalah simulasi tampilan dokumen.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
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
                <h3 className="font-bold text-slate-900 mb-2">
                  Hapus Pengguna
                </h3>
                <p className="text-sm text-gray-500">
                  Apakah Anda yakin ingin menghapus {selectedUser?.name}?
                  Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>
              <div className="p-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleDeleteUser}
                  className="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                  Hapus
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Modal Status Pembayaran & Sumber Anggaran Asesi */}
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
              <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-sky-50 to-blue-50/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#008BE3]/10 text-[#008BE3] flex items-center justify-center font-bold">
                    <CreditCard size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      Ubah Status Pembayaran
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Asesi: {userToEditPayment.name}
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
                {/* Status Pembayaran */}
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
                      className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        paymentFormData.statusPembayaran === "Sudah"
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
                      className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        paymentFormData.statusPembayaran === "Belum"
                          ? "bg-amber-500 text-white border-amber-500 shadow-xs"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <XCircle size={16} />
                      Belum Bayar
                    </button>
                  </div>
                </div>

                {/* Sumber Anggaran */}
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
      </AnimatePresence>
    </div>
  );
}
