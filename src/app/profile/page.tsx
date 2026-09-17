"use client";

import React, { useState, useRef } from "react";
import { Save, User as UserIcon, Trash2, Upload, ArrowLeft, PenTool, X } from "lucide-react";
import { useAppContext } from "@/context/context";
import { supabase } from "@/lib/supabase";
import SignatureCanvas from "react-signature-canvas";
import { useRouter } from "next/navigation";
import { forgotPassword, getUsersProfile } from "@/lib/api";

type SessionUser = {
  id?: string | number;
  name?: string | null;
  email?: string | null;
  username?: string;
  role?: string;
  avatar?: string;
};

export default function Profile() {
  const { user, registeredProfile, setRegisteredProfile, updateUser, showNotification } = useAppContext();
  const router = useRouter();

  // State untuk modal tanda tangan
  const fileInputRef = useRef<HTMLInputElement>(null);
  const signaturePadRef = useRef<SignatureCanvas>(null);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);

  const handleSaveSignature = () => {
    if (signaturePadRef.current && !signaturePadRef.current.isEmpty()) {
      const dataURL = signaturePadRef.current.getCanvas().toDataURL("image/png");
      setFormData((prev) => ({ ...prev, tandaTangan: dataURL }));
      setIsSignatureModalOpen(false);
    } else {
      showNotification("Tanda tangan masih kosong!", "error");
    }
  };

  // State untuk upload foto profil ke Supabase
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const fileAvatarRef = useRef<HTMLInputElement>(null);
  const [isSendingReset, setIsSendingReset] = useState(false);

  const [formData, setFormData] = useState({
    peran:
      (user as SessionUser)?.role === "asesor"
        ? "asesor"
        : (user as SessionUser)?.role === "admin"
          ? "admin"
          : "asesi",
    username:
      (user as SessionUser)?.username ||
      (user?.email ? user.email.split("@")[0] : ""),
    email: user?.email || "",
    namaLengkap: (registeredProfile?.nama as string) || user?.username || "",
    tempatLahir: (registeredProfile?.tempatLahir as string) || "",
    tanggalLahir: (registeredProfile?.tanggalLahir as string) || "",
    jenisKelamin: (registeredProfile?.jenisKelamin as string) || "",
    alamat: (registeredProfile?.alamatRumah as string) || "",
    kodePos: (registeredProfile?.kodePos as string) || "",
    nik: (registeredProfile?.nik as string) || "",
    noRegistrasi: (registeredProfile?.noRegistrasi as string) || "",
    noTelp: (registeredProfile?.noTelp as string) || "",
    pekerjaan: (registeredProfile?.pekerjaan as string) || "",
    pendidikanTerakhir: (registeredProfile?.pendidikanTerakhir as string) || "",
    tandaTangan: (registeredProfile?.tandaTangan as string) || "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "radio" ? value : value,
    }));
  };

  // 1. Fungsi Kompresi Foto
  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 500;
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          canvas.toBlob(
            (blob) => {
              if (blob)
                resolve(new File([blob], file.name, { type: "image/jpeg" }));
            },
            "image/jpeg",

            0.8,
          );
        };
      };
    });
  };

  // 2. Fungsi Saat User Memilih Foto Profil
  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormData({ ...formData, tandaTangan: event.target.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGantiPassword = async () => {
    const email = (user as SessionUser)?.email;

    if (!email) {
      alert("Email tidak ditemukan, silakan login ulang.");
      return;
    }

    setIsSendingReset(true);
    try {
      const result = await forgotPassword(email);
      alert(result.message); // ganti dengan showNotification kalau ada di halaman ini
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Gagal mengirim tautan reset password.";
      alert(message);
    } finally {
      setIsSendingReset(false);
    }
  };



  React.useEffect(() => {
    if (registeredProfile) {
      const data = registeredProfile as unknown as Record<
        string,
        string | undefined
      >;
      const namaAsli = data.namaLengkap || data.nama_lengkap || data.nama || user?.username || "";
      setFormData((prev) => ({
        ...prev,
        username:
          (user as SessionUser)?.username ||
          (user?.email ? user.email.split("@")[0] : "") ||
          prev.username,
        email: data.email || user?.email || prev.email,
        namaLengkap: namaAsli,
        tempatLahir: data.tempatLahir || data.tempat_lahir || "",
        tanggalLahir: data.tanggalLahir || data.tanggal_lahir || "",
        jenisKelamin: data.jenisKelamin || data.jenis_kelamin || "",
        alamat: data.alamat || data.alamat_rumah || prev.alamat,
        kodePos: data.kodePos || data.kode_pos || "",
        nik: data.nik || "",
        noRegistrasi: data.nomorRegistrasiMet || data.no_registrasi || data.noRegistrasi || "",
        noTelp: data.noHp || data.no_telp || data.noTelp || "",
        pekerjaan: data.pekerjaan || "",
        pendidikanTerakhir:
          data.pendidikanTerakhir || data.pendidikan_terakhir || "",
        tandaTangan: data.tandaTangan || data.tanda_tangan || "",
      }));
    }
  }, [registeredProfile, user]);

  React.useEffect(() => {
    const fetchProfil = async () => {
      const userId = Number((user as SessionUser)?.id);
      if (!userId) return;

      try {
        const response = await getUsersProfile(userId);
        const data = (Array.isArray(response) ? response[0] : response) as
          Record<string, unknown> | undefined;

        if (!data) return;

        setRegisteredProfile?.(data);

        if (data.avatar && typeof data.avatar === "string") {
          setAvatarPreview(data.avatar);
        }

        setFormData((prev) => ({
          ...prev,
          namaLengkap:
            (data.namaLengkap as string) ||
            (data.nama as string) ||
            prev.namaLengkap,
          username: (user as SessionUser)?.username || prev.username,
          email: (user as SessionUser)?.email || prev.email,
          tempatLahir:
            (data.tempatLahir as string) ||
            (data.tempat_lahir as string) ||
            prev.tempatLahir,
          tanggalLahir:
            data.tanggalLahir || data.tanggal_lahir
              ? new Date(String(data.tanggalLahir || data.tanggal_lahir))
                .toISOString()
                .split("T")[0]
              : prev.tanggalLahir,
          jenisKelamin:
            (data.jenisKelamin as string) ||
            (data.jenis_kelamin as string) ||
            prev.jenisKelamin,
          alamat:
            (data.alamat as string) ||
            (data.alamat_rumah as string) ||
            prev.alamat,
          kodePos:
            (data.kodePos as string) ||
            (data.kode_pos as string) ||
            prev.kodePos,
          nik: (data.nik as string) || prev.nik,
          noTelp:
            (data.noHp as string) || (data.no_telp as string) || prev.noTelp,
          pekerjaan: (data.pekerjaan as string) || prev.pekerjaan,
          pendidikanTerakhir:
            (data.pendidikanTerakhir as string) ||
            (data.pendidikan_terakhir as string) ||
            prev.pendidikanTerakhir,
          tandaTangan:
            (data.tandaTangan as string) ||
            (data.tanda_tangan as string) ||
            prev.tandaTangan,
          noRegistrasi:
            (data.nomorRegistrasiMet as string) ||
            (data.no_registrasi as string) ||
            prev.noRegistrasi,
        }));
      } catch (error) {
        console.error("Gagal mengambil data profil langsung:", error);
      }
    };

    fetchProfil();
  }, [user]);

  // 3. Fungsi Utama Simpan Perubahan (Termasuk Upload Foto)

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // --- 1. PROSES UPLOAD AVATAR ---
      let finalAvatarUrl = (user as SessionUser)?.avatar || "";

      if (avatarFile) {
        const compressedFile = await compressImage(avatarFile);
        const fileName = `avatar-${(user as SessionUser)?.id || Date.now()}-${Date.now()}.jpg`;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(fileName, compressedFile, { upsert: true });

        if (uploadError)
          throw new Error("Gagal upload foto: " + uploadError.message);

        const { data: publicUrlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(fileName);
        finalAvatarUrl = publicUrlData.publicUrl;
      }

      // --- 2. PROSES UPLOAD TANDA TANGAN (BARU) ---
      let finalSignatureUrl = formData.tandaTangan;

      if (formData.tandaTangan && formData.tandaTangan.startsWith("data:image")) {
        const fetchResponse = await fetch(formData.tandaTangan);
        const blob = await fetchResponse.blob();
        const signatureFileName = `signature-${(user as SessionUser)?.id || Date.now()}-${Date.now()}.png`;

        const { error: signatureUploadError } = await supabase.storage
          .from("avatars")
          .upload(signatureFileName, blob);

        if (signatureUploadError)
          throw new Error("Gagal upload tanda tangan: " + signatureUploadError.message);

        const { data: signatureUrlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(signatureFileName);

        finalSignatureUrl = signatureUrlData.publicUrl;
      }

      // --- 3. PAYLOAD KE DATABASE ---
      const payload = {
        name: formData.namaLengkap,
        email: formData.email,
        nama_lengkap: formData.namaLengkap,
        tempat_lahir: formData.tempatLahir,
        tanggal_lahir: formData.tanggalLahir,
        jenis_kelamin: formData.jenisKelamin,
        alamat_rumah: formData.alamat,
        kode_pos: formData.kodePos,
        nik: formData.nik,
        no_registrasi: formData.noRegistrasi,
        no_telp: formData.noTelp,
        pekerjaan: formData.pekerjaan,
        pendidikan_terakhir: formData.pendidikanTerakhir,
        // Masukkan URL tanda tangan yang sudah diupload ke database
        tanda_tangan: finalSignatureUrl,
        avatar: finalAvatarUrl,
      };

      const response = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log("Response dari backend:", result);

      if (!response.ok) {
        throw new Error(result.message || "Gagal menyimpan profil ke database");
      }

      updateUser({
        ...payload,
        email: result.user?.email || payload.email,
      });

      setRegisteredProfile?.({
        ...(registeredProfile || {}),
        ...payload,
        tandaTangan: finalSignatureUrl,
        tanda_tangan: finalSignatureUrl,
      });

      // Update state formData agar pas disave nggak reload pakai base64 lagi
      setFormData(prev => ({ ...prev, tandaTangan: finalSignatureUrl }));

      showNotification("Profil berhasil disimpan!", "success");

      setTimeout(() => {
        router.back();
      }, 1000);
    } catch (error) {
      if (error instanceof Error) {
        showNotification(error.message, "error");
      } else {
        showNotification("Terjadi kesalahan saat menyimpan profil.", "error");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="space-y-6 pb-24 text-sm text-gray-700">
        {/* Header Title Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 rounded-lg flex items-center justify-center text-[#008BE3] bg-[#008BE3]/10 hover:bg-[#008BE3]/20 border border-[#008BE3]/20 transition-colors cursor-pointer shrink-0 shadow-xs"
              title="Kembali"
            >
              <ArrowLeft size={20} className="stroke-[2.5]" />
            </button>
            <div className="min-w-0">
              <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none mb-1 md:whitespace-nowrap">
                Profil Pengguna
              </h2>
              <p className="text-xs text-gray-400 font-bold tracking-wider uppercase leading-4 md:whitespace-nowrap">
                Kelola data diri dan informasi akun Anda
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-xs border border-gray-100 overflow-hidden">
          <div className="p-6 space-y-6">
            {/* Avatar Section */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-white shadow-sm shrink-0">
                {avatarPreview || user?.avatar ? (
                  <img
                    src={avatarPreview || (user?.avatar as string)}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserIcon size={48} className="text-gray-400" />
                )}
              </div>
              <button
                onClick={() => fileAvatarRef.current?.click()}
                className="bg-[#008BE3] hover:bg-[#0076C2] text-white px-4 py-2 rounded-xl text-sm font-bold shadow-xs transition-colors"
              >
                Ubah Gambar
              </button>
              <input
                type="file"
                ref={fileAvatarRef}
                onChange={handleAvatarSelect}
                accept="image/jpeg, image/png, image/webp"
                className="hidden"
              />
            </div>

            {/* Detail Akun */}
            <section className="space-y-3">
              <h3 className="text-sm font-black text-slate-900 border-b border-gray-100 pb-2">
                Detail Akun
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Peran
                  </label>
                  <input
                    type="text"
                    name="peran"
                    value={formData.peran}
                    readOnly
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500 outline-none cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    <span className="text-red-500">*</span> Nama Pengguna
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40 transition-all"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">
                    Username tidak boleh mengandung spasi dan karakter spesial
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    <span className="text-red-500">*</span> Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40 transition-all"
                  />
                </div>
              </div>
            </section>

            {/* Data Pribadi */}
            <section className="space-y-3">
              <h3 className="text-sm font-black text-slate-900 border-b border-gray-100 pb-2">
                Data Pribadi
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    <span className="text-red-500">*</span> Nama Lengkap
                  </label>
                  <input
                    type="text"
                    name="namaLengkap"
                    value={formData.namaLengkap}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    <span className="text-red-500">*</span> Tempat Lahir
                  </label>
                  <input
                    type="text"
                    name="tempatLahir"
                    value={formData.tempatLahir}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    <span className="text-red-500">*</span> Tanggal Lahir
                  </label>
                  <input
                    type="date"
                    name="tanggalLahir"
                    value={formData.tanggalLahir}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2.5">
                    <span className="text-red-500">*</span> Jenis Kelamin
                  </label>
                  <div className="flex items-center gap-4 mt-1.5">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="jenisKelamin"
                        value="Laki_laki"
                        checked={formData.jenisKelamin === "Laki_laki"}
                        onChange={handleChange}
                        className="w-4 h-4 text-[#008BE3] focus:ring-[#008BE3] border-gray-300"
                      />
                      <span className="text-sm text-slate-700">Laki-laki</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="jenisKelamin"
                        value="Perempuan"
                        checked={formData.jenisKelamin === "Perempuan"}
                        onChange={handleChange}
                        className="w-4 h-4 text-[#008BE3] focus:ring-[#008BE3] border-gray-300"
                      />
                      <span className="text-sm text-slate-700">Perempuan</span>
                    </label>
                  </div>
                </div>

                <div className="md:col-span-2 lg:col-span-3">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    <span className="text-red-500">*</span> {formData.peran === "asesor" ? "Alamat / Wilayah" : "Alamat"}
                  </label>
                  <textarea
                    name="alamat"
                    value={formData.alamat}
                    onChange={handleChange}
                    placeholder="Masukkan alamat"
                    rows={4}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40 transition-all resize-none"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    <span className="text-red-500">*</span> NIK
                  </label>
                  <input
                    type="text"
                    name="nik"
                    value={formData.nik}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    <span className="text-red-500">*</span> Kode Pos
                  </label>
                  <input
                    type="text"
                    name="kodePos"
                    value={formData.kodePos}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40 transition-all"
                  />
                </div>
                {formData.peran === "asesor" && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      <span className="text-red-500">*</span> Nomor Registrasi/MET
                    </label>
                    <input
                      type="text"
                      name="noRegistrasi"
                      value={formData.noRegistrasi}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40 transition-all"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    <span className="text-red-500">*</span> No.Telp/Handphone
                  </label>
                  <input
                    type="text"
                    name="noTelp"
                    value={formData.noTelp}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    <span className="text-red-500">*</span> Pekerjaan
                  </label>
                  <select
                    name="pekerjaan"
                    value={formData.pekerjaan}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40 transition-all"
                  >
                    <option value="" disabled>
                      Pilih Pekerjaan
                    </option>
                    <option value="Pelajar/Mahasiswa">Pelajar/Mahasiswa</option>
                    <option value="Karyawan Swasta">Karyawan Swasta</option>
                    <option value="PNS">PNS</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    <span className="text-red-500">*</span> Pendidikan Terakhir
                  </label>
                  <select
                    name="pendidikanTerakhir"
                    value={formData.pendidikanTerakhir}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40 transition-all"
                  >
                    <option value="" disabled>
                      Pilih Pendidikan
                    </option>
                    <option value="SMA">SMA/SMK</option>
                    <option value="D3">D3</option>
                    <option value="S1">S1/D4</option>
                    <option value="S2">S2</option>
                  </select>
                </div>
                <div className="md:col-span-2 lg:col-span-3">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    <span className="text-red-500">*</span> Tanda Tangan
                  </label>
                  {formData.tandaTangan && (
                    <div className="mb-2 border border-gray-200 rounded-lg p-2 bg-white flex justify-center w-full sm:w-auto sm:inline-block">
                      <img
                        src={formData.tandaTangan}
                        alt="Tanda Tangan"
                        className="h-16 object-contain"
                      />
                    </div>
                  )}
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        type="button"
                        onClick={() => setIsSignatureModalOpen(true)}
                        className="px-4 py-2.5 border border-[#008BE3] text-[#008BE3] hover:bg-sky-50 rounded-xl text-sm font-bold shadow-xs transition-colors flex gap-2 items-center justify-center cursor-pointer"
                      >
                        <PenTool size={14} />
                        Gambar
                      </button>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2.5 bg-[#008BE3] hover:bg-[#0076C2] text-white rounded-xl text-sm font-bold shadow-xs transition-colors flex gap-2 items-center justify-center cursor-pointer"
                      >
                        <Upload size={14} />
                        Upload
                      </button>
                      {formData.tandaTangan && (
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, tandaTangan: "" })}
                          className="px-3 py-2.5 border border-[#FF6B6B] text-[#FF6B6B] hover:bg-red-50 rounded-xl text-sm font-bold transition-colors flex items-center justify-center cursor-pointer"
                          title="Hapus Tanda Tangan"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">
                    Tanda tangan ini akan digunakan dalam perangkat asesmen.
                  </p>
                </div>
              </div>
            </section>

            {/* Pengaturan Akun */}
            <section className="space-y-3">
              <h3 className="text-sm font-black text-slate-900 border-b border-gray-100 pb-2">
                Pengaturan Akun
              </h3>
              <div>
                <p className="text-sm text-slate-700 font-medium mb-3">
                  Ganti Kata Sandi
                </p>
                <button
                  onClick={() => {
                    handleGantiPassword();
                    showNotification("Tautan reset password telah dikirim ke email Anda!", "success");
                  }}
                  disabled={isSendingReset}
                  className="bg-[#008BE3] hover:bg-[#0076C2] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSendingReset ? "Mengirim..." : "Ganti Kata Sandi"}
                </button>
              </div>
            </section>

            <div className="pt-6 border-t border-gray-100 flex justify-end">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 bg-[#008BE3] hover:bg-[#0076C2] text-white px-8 py-3 rounded-xl text-sm font-bold shadow-xs transition-colors w-full sm:w-auto justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={18} className="stroke-[2.5]" />
                {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Signature Canvas Modal */}
      {
        isSignatureModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="font-black text-slate-800 text-sm">
                  Gambar Tanda Tangan
                </h3>
                <button
                  type="button"
                  onClick={() => setIsSignatureModalOpen(false)}
                  className="p-1 hover:bg-slate-200 rounded-md text-slate-500 transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="p-4">
                <div className="border border-slate-200 rounded-lg overflow-hidden bg-white mb-4">
                  <SignatureCanvas
                    ref={signaturePadRef}
                    penColor="blue"
                    canvasProps={{
                      className: "w-full h-48 cursor-crosshair bg-slate-50",
                    }}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => signaturePadRef.current?.clear()}
                    className="flex-1 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    Hapus Ulang
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveSignature}
                    className="flex-1 py-2 bg-[#008BE3] hover:bg-[#0076C2] text-white rounded-lg text-xs font-bold transition-colors flex justify-center items-center gap-2 cursor-pointer"
                  >
                    <Save size={14} />
                    Simpan
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      }
    </>
  );
}
