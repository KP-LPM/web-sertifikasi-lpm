"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { EFormApl01 } from "@/components/forms/asesi/FormFRAPL01";
import { EFormApl02 } from "@/components/forms/asesi/FormFRAPL02";
import { useAppContext } from "@/context/context";
import { UserItem, Apl01FormData, Apl02FormData } from "@/types/types";

export default function UsersManagement() {
  const { user } = useAppContext();
  const readOnly = user?.role === "direktur" || user?.role === "manajer";

  const [mainTab, setMainTab] = useState<"asesi" | "asesor">("asesi");

  const [users, setUsers] = useState<UserItem[]>([
    {
      id: "1",
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
      id: "2",
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
      id: "3",
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
      id: "4",
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
      id: "5",
      username: "siti_r",
      namaLengkap: "Dr. Siti Rohmah",
      email: "siti.r@lecturer.uin.ac.id",
      role: "asesor",
      status: "Terverifikasi",
    },
    {
      id: "asr-1",
      username: "ichsan_t",
      namaLengkap: "Ichsan Taufik",
      email: "ichsan.taufik@lsp.uin.ac.id",
      role: "asesor",
      status: "Terverifikasi",
    },
    {
      id: "asr-2",
      username: "aceng_k",
      namaLengkap: "Aceng Abdul Kodir",
      email: "aceng.kodir@lsp.uin.ac.id",
      role: "asesor",
      status: "Terverifikasi",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [userToVerify, setUserToVerify] = useState<UserItem | null>(null);
  const [activeVerifyTab, setActiveVerifyTab] = useState<"apl01" | "apl02">("apl01");

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

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [userToEditPayment, setUserToEditPayment] = useState<UserItem | null>(null);
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

  const asesiUsers = users.filter((user) => user.role === "asesi");
  const asesorUsers = users.filter((user) => user.role === "asesor");

  const currentList = mainTab === "asesi" ? asesiUsers : asesorUsers;

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

  const confirmVerify = () => {
    if (userToVerify) {
      let currentAdminUrl = userToVerify.verificationData?.adminSignatureUrl || null;
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

  const handleAssignAsesor = () => {
    if (!userToVerify || !selectedAsesorId) return;

    let currentAdminUrl = userToVerify.verificationData?.adminSignatureUrl || null;
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
              status: "Terverifikasi",
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
      namaLengkap: user.namaLengkap,
      rekomendasi: user.verificationData?.rekomendasi || "Diterima",
      catatan: user.verificationData?.catatan || "",
      statusPembayaran: user.verificationData?.statusPembayaran || "Sudah",
      sumberAnggaran: user.verificationData?.sumberAnggaran || "Sumber Anggaran Biaya Mandiri",
      ttdAdmin: user.verificationData?.adminSignatureUrl,
      tujuan: "Sertifikasi",
      ttdAsesi: { type: "auto" },
      onPreview: (fileName: string) => setPreviewFile(fileName),
      schemeDetail: {
        persyaratanDasar: [
          { id: 1, namaDokumen: "Scan KTP", is_wajib: true },
          { id: 2, namaDokumen: "Ijazah Terakhir", is_wajib: true },
          { id: 3, namaDokumen: "Transkrip Nilai", is_wajib: true },
          { id: 4, namaDokumen: "Pasfoto", is_wajib: true },
        ],
        buktiAdministratif: [
          { id: "adm-1", namaDokumen: "Sertifikat Pelatihan Tambahan", isWajib: true, isAktif: true },
          { id: "adm-2", namaDokumen: "Surat Keterangan Kerja", isWajib: true, isAktif: true },
        ],
        buktiKompetensi: [
          { id: "komp-1", namaDokumen: "Portofolio Proyek", isWajib: true, isAktif: true },
          { id: "komp-2", namaDokumen: "Sertifikat Kompetensi Sebelumnya", isWajib: true, isAktif: true },
        ],
      },
    });
    
    setApl02FormData({
      isAdmin: true,
      namaLengkap: user.namaLengkap,
      rekomendasiApl02: user.verificationData?.rekomendasiApl02 || "Dapat dilanjutkan",
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
    } else {
      setVerificationForm({ rekomendasi: "Diterima", catatan: "" });
    }
    
    setIsVerifyModalOpen(true);
  };

  const handleSaveVerifyDraft = () => {
    if (!userToVerify) return;

    let currentAdminUrl = userToVerify.verificationData?.adminSignatureUrl || null;
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

  if (isVerifyModalOpen && userToVerify) {
    const totalReqs = [
      ...(apl01FormData.schemeDetail?.persyaratanDasar || []),
      ...(apl01FormData.schemeDetail?.buktiAdministratif || []),
      ...(apl01FormData.schemeDetail?.buktiKompetensi || []),
    ].length;
    const checkedReqs = Object.keys(apl01FormData.checklist || {}).length;
    const isApl01Valid =
      !!apl01FormData.ttdAdmin && (totalReqs === 0 || checkedReqs === totalReqs);

    return (
      <div className="space-y-6 pb-24 text-sm text-gray-700">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setIsVerifyModalOpen(false);
                setUserToVerify(null);
              }}
              className="w-10 h-10 rounded-lg flex items-center justify-center text-[#008BE3] bg-[#008BE3]/10 hover:bg-[#008BE3]/20 transition-colors cursor-pointer shrink-0"
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

          <div className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden flex flex-col">
            {userToVerify.role === "asesi" && (
              <div className="border-b border-gray-100 bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-sky-50 text-[#008BE3] flex items-center justify-center font-bold text-sm border border-sky-100">
                      {userToVerify.namaLengkap.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900">
                        {userToVerify.namaLengkap}
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
              {userToVerify.role === "asesi" ? (
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

              {userToVerify.role === "asesi" && activeVerifyTab === "apl01" ? (
                <button
                  onClick={() => setActiveVerifyTab("apl02")}
                  disabled={!isApl01Valid}
                  className={`px-6 py-2 rounded-lg text-sm font-bold transition-colors shadow-xs ${!isApl01Valid ? "bg-slate-200 text-slate-400 cursor-not-allowed" : "bg-[#008BE3] text-white hover:bg-[#0076C2]"}`}
                >
                  Approve Form 1 & Selanjutnya
                </button>
              ) : (
                <>
                  {!apl02FormData.ttdAsesor && userToVerify.role === "asesi" ? (
                    <div className="flex items-center gap-3 min-w-0">
                      <select
                        value={selectedAsesorId}
                        onChange={(e) => setSelectedAsesorId(e.target.value)}
                        className="px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 outline-none focus:border-[#008BE3]"
                      >
                        <option value="">Pilih Asesor...</option>
                        {users
                          .filter((u) => u.role === "asesor")
                          .map((asesor) => (
                            <option key={asesor.id} value={asesor.id}>
                              {asesor.namaLengkap}
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
                        userToVerify?.role === "asesi" &&
                        activeVerifyTab === "apl02" &&
                        (!apl01FormData.ttdAdmin || !apl02FormData.ttdAsesor)
                      }
                      className={`px-6 py-2 rounded-lg text-sm font-bold transition-colors shadow-xs ${userToVerify?.role === "asesi" && activeVerifyTab === "apl02" && (!apl01FormData.ttdAdmin || !apl02FormData.ttdAsesor) ? "bg-slate-200 text-slate-400 cursor-not-allowed" : "bg-green-600 text-white hover:bg-green-700"}`}
                    >
                      Verifikasi Akun (Siap Ujian)
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {previewFile && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setPreviewFile(null)}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              />
            </AnimatePresence>
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
                : "Daftar berkas & data kualifikasi Asesor."}
            </p>
          </div>
        </div>
      </div>

      <section className="bg-white rounded-lg shadow-xs border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="bg-slate-100 p-1 rounded-lg flex items-center w-full lg:w-64 shrink-0">
            <button
              onClick={() => setMainTab("asesi")}
              className={`flex-1 py-2 px-3 text-xs md:text-sm font-bold rounded-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                mainTab === "asesi"
                  ? "bg-white text-[#008BE3] shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Asesi
            </button>
            <button
              onClick={() => setMainTab("asesor")}
              className={`flex-1 py-2 px-3 text-xs md:text-sm font-bold rounded-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                mainTab === "asesor"
                  ? "bg-white text-[#008BE3] shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Asesor
            </button>
          </div>

          <div className="flex items-center gap-2 bg-gray-50/80 rounded-lg px-3 h-10.5 w-full lg:w-72 border border-gray-200/50 focus-within:border-[#008BE3]/40 transition-colors ml-auto">
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
                  Status Verifikasi
                </th>
                {mainTab === "asesi" && (
                  <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-center whitespace-nowrap sticky top-0 z-20 bg-[#0F172A]">
                    Status Pembayaran
                  </th>
                )}
                <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-center sticky right-0 bg-[#0F172A] z-30 border-l border-white/10 shadow-[-6px_0_15px_-4px_rgba(0,0,0,0.06)] min-w-32 top-0">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/60">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={mainTab === "asesi" ? 7 : 6}
                    className="px-6 py-12 text-center text-slate-400"
                  >
                    <div className="flex flex-col items-center justify-center gap-2.5">
                      {mainTab === "asesi" ? (
                        <>
                          <GraduationCap size={38} className="text-slate-300 stroke-[1.5]" />
                          <p className="text-sm font-bold text-slate-700">Tidak ada data Asesi ditemukan</p>
                          <p className="text-xs text-slate-400">Belum ada asesi terdaftar atau tidak ada data pencarian yang cocok.</p>
                        </>
                      ) : (
                        <>
                          <Award size={38} className="text-slate-300 stroke-[1.5]" />
                          <p className="text-sm font-bold text-slate-700">Tidak ada data Asesor ditemukan</p>
                          <p className="text-xs text-slate-400">Belum ada asesor terdaftar atau tidak ada data pencarian yang cocok.</p>
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
                        className={`mx-auto w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-xs font-bold text-xs ${
                          index % 3 === 0
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
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-sky-50 text-[#008BE3] flex items-center justify-center font-bold text-xs border border-sky-100 shrink-0 shadow-xs">
                          {user.namaLengkap.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="text-xs md:text-sm font-bold text-slate-900 whitespace-nowrap">
                          {user.namaLengkap}
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

                    <td className="px-6 py-4 align-middle text-center whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider font-bold inline-flex items-center gap-1.5 border whitespace-nowrap ${
                          user.status === "Terverifikasi"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        {user.status === "Terverifikasi" ? (
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                        ) : (
                          <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                        )}
                        {user.status}
                      </span>
                    </td>

                    {mainTab === "asesi" && (
                      <td className="px-6 py-4 align-middle text-center whitespace-nowrap">
                        {user.verificationData?.statusPembayaran === "Sudah" ? (
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                            Sudah Bayar
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 bg-rose-50 text-rose-700 border border-rose-200 whitespace-nowrap">
                            <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
                            Belum Bayar
                          </span>
                        )}
                      </td>
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
                              onClick={() => {
                                setSelectedUser(user);
                                setIsDeleteModalOpen(true);
                              }}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200 cursor-pointer"
                              title="Hapus"
                            >
                              <Trash2 size={16} />
                            </button>

                            {mainTab === "asesi" && (
                              <button
                                onClick={() => openPaymentModal(user)}
                                className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-transparent hover:border-indigo-200 cursor-pointer"
                                title="Ubah Status Pembayaran"
                              >
                                <CreditCard size={16} />
                              </button>
                            )}

                            {user.status === "Menunggu Verifikasi" ? (
                              <button
                                onClick={() => openVerifyModal(user)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#008BE3] text-white hover:bg-[#0076C2] rounded-lg text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
                              >
                                <FileCheck size={14} /> Verifikasi
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