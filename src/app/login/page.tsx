"use client";
import React, { useState, useRef, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  LogIn,
  Mail,
  Lock,
  UserPlus,
  ArrowLeft,
  BadgeCheck,
  X,
  Trash2,
  Upload,
  Save,
  Eye,
  EyeOff,
} from "lucide-react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import {
  forgotPassword,
  registerUsers,
  resetPassword,
  verifyOtp,
} from "@/lib/api";
import { RegisterPayload } from "@/types/types";

type SignatureCanvasRef = {
  clear: () => void;
  fromDataURL: (dataURL: string) => void;
  toDataURL: () => string;
  isEmpty: () => boolean;
};

type SignatureCanvasProps = {
  canvasProps?: React.CanvasHTMLAttributes<HTMLCanvasElement>;
  backgroundColor?: string;
};

const SignatureCanvas = dynamic(() => import("react-signature-canvas"), {
  ssr: false,
}) as React.ForwardRefExoticComponent<
  React.PropsWithoutRef<SignatureCanvasProps> &
  React.RefAttributes<SignatureCanvasRef>
>;

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [mode, setMode] = useState<"asesi" | "asesor">("asesi");
  const [isLoginView, setIsLoginView] = useState(true);
  const [isForgotPasswordView, setIsForgotPasswordView] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpView, setIsOtpView] = useState(false);
  const [isNewPasswordView, setIsNewPasswordView] = useState(false);
  const [resetEmail, setResetEmail] = useState(""); // simpan email dari step 1, dipakai lagi di step 2
  const [resetToken, setResetToken] = useState("");
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(6).fill(""));
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  // State Signature
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const signatureRef = useRef<SignatureCanvasRef | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tandaTangan, setTandaTangan] = useState("");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          signatureRef.current?.fromDataURL(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveSignature = () => {
    if (signatureRef.current) {
      if (signatureRef.current.isEmpty()) {
        showNotification("Tanda tangan masih kosong!", "error");
        return;
      }
      const dataUrl = signatureRef.current.toDataURL();
      setTandaTangan(dataUrl);
      setIsSignatureModalOpen(false);
    }
  };

  useEffect(() => {
    if (isSignatureModalOpen && tandaTangan && signatureRef.current) {
      setTimeout(() => {
        signatureRef.current?.fromDataURL(tandaTangan);
      }, 50);
    }
  }, [isSignatureModalOpen, tandaTangan]);

  // --- FUNGSI LOGIN KE NEXTAUTH ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      username: username,
      password: password,
    });

    setIsLoading(false);

    if (res?.error) {
      showNotification("Gagal Masuk: Username atau Password salah!", "error");
    } else {
      showNotification("Berhasil Masuk! Mengalihkan...", "success");
      setTimeout(() => router.push("/"), 1000);
    }
  };

  // --- FUNGSI REGISTER KE API ---
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;

    if (!tandaTangan) {
      showNotification("Tanda tangan wajib diisi!", "error");
      return;
    }

    const formDataObj = new FormData(form);

    const password = String(formDataObj.get("password") || "");
    const confirmPassword = String(formDataObj.get("confirm_password") || "");

    // Validasi konfirmasi password
    if (password !== confirmPassword) {
      showNotification(
        "Password dan Konfirmasi Password tidak cocok!",
        "error",
      );
      return;
    }

    const payload: RegisterPayload = {
      role: mode as "asesi" | "asesor",
      username: String(formDataObj.get("username") || ""),
      email: String(formDataObj.get("email") || ""),
      password: password,
      nik: String(formDataObj.get("nik") || ""),
      nama_lengkap: String(formDataObj.get("nama_lengkap") || ""),
      tempat_lahir: String(formDataObj.get("tempat_lahir") || ""),
      tanggal_lahir: String(formDataObj.get("tanggal_lahir") || ""),
      jenis_kelamin: String(formDataObj.get("jenis_kelamin") || ""),
      no_hp: String(formDataObj.get("no_hp") || ""),
      pekerjaan: String(formDataObj.get("pekerjaan") || ""),
      kewarganegaraan:
        mode === "asesi"
          ? String(formDataObj.get("kewarganegaraan") || "")
          : undefined,
      nomor_registrasi_met:
        mode === "asesor"
          ? String(formDataObj.get("nomor_registrasi_met") || "")
          : undefined,
      pendidikan_terakhir:
        mode === "asesor"
          ? String(formDataObj.get("pendidikan_terakhir") || "")
          : undefined,
      alamat_wilayah:
        mode === "asesor"
          ? String(formDataObj.get("alamat_wilayah") || "")
          : undefined,
      tanda_tangan: tandaTangan,
    };

    setIsLoading(true);
    try {
      await registerUsers(payload);
      showNotification("Registrasi sukses! Silakan masuk.", "success");
      setTimeout(() => setIsLoginView(true), 1500);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat mendaftar.";
      showNotification("Gagal Daftar: " + errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const form = e.currentTarget as HTMLFormElement;
    const emailInput = form.querySelector(
      'input[type="email"]',
    ) as HTMLInputElement;
    const email = emailInput.value;

    try {
      const result = await forgotPassword(email);
      showNotification(result.message, "success");

      setResetEmail(email); // simpan buat dipakai di step verifikasi OTP
      setIsForgotPasswordView(false);
      setIsOtpView(true); // pindah ke tampilan input OTP
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Terjadi kesalahan.";
      showNotification(message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================================
  // Handler BARU — verifikasi OTP
  // ============================================================================

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    const otp = otpDigits.join("");
    if (otp.length !== 6) {
      showNotification("Masukkan 6 digit kode OTP", "error");
      return;
    }

    setIsLoading(true);
    try {
      const result = await verifyOtp(resetEmail, otp);
      showNotification(result.message, "success");

      setResetToken(result.resetToken);
      setIsOtpView(false);
      setIsNewPasswordView(true);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Kode OTP tidak valid.";
      showNotification(message, "error");
      setOtpDigits(Array(6).fill("")); // reset semua kotak kalau OTP salah
      otpInputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================================
  // Handler BARU — submit password baru
  // ============================================================================

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const form = e.currentTarget as HTMLFormElement;
    const passwordInput = form.querySelector(
      'input[name="newPassword"]',
    ) as HTMLInputElement;
    const newPassword = passwordInput.value;

    try {
      const result = await resetPassword(resetToken, newPassword);
      showNotification(result.message, "success");

      // Reset semua state, balik ke login
      setResetEmail("");
      setResetToken("");
      setTimeout(() => {
        setIsNewPasswordView(false);
        setIsLoginView(true);
      }, 2000);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Gagal mereset password.";
      showNotification(message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    // cuma terima 1 digit angka
    const digit = value.replace(/[^0-9]/g, "").slice(-1);

    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);

    // otomatis pindah fokus ke kotak berikutnya kalau baru diisi
    if (digit && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  // Handler backspace — pindah fokus ke kotak sebelumnya kalau kotak
  // sekarang sudah kosong
  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Handler paste — kalau user paste kode 6 digit sekaligus (misal dari
  // notifikasi email di HP), otomatis kesebar ke semua kotak
  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/[^0-9]/g, "")
      .slice(0, 6);
    if (!pasted) return;

    const newDigits = Array(6).fill("");
    pasted.split("").forEach((digit, i) => {
      newDigits[i] = digit;
    });
    setOtpDigits(newDigits);

    // fokus ke kotak terakhir yang keisi
    const lastIndex = Math.min(pasted.length, 6) - 1;
    otpInputRefs.current[lastIndex]?.focus();
  };

  // --- TAMPILAN LUPA PASSWORD ---
  if (isForgotPasswordView) {
    return (
      <div
        className="h-screen w-screen overflow-hidden flex items-center justify-center p-4 md:p-6 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.8)), url('/bg-lpm.jpeg')",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg bg-white rounded-xl border border-slate-200/90 shadow-sm p-6 md:p-10"
        >
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-lg bg-[#008BE3]/10 flex items-center justify-center text-[#008BE3] border border-[#008BE3]/20 shadow-xs">
              <Mail size={20} className="stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 leading-none">
                Lupa Kata Sandi
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Kami akan mengirimkan instruksi reset ke email Anda.
              </p>
            </div>
          </div>
          <form className="space-y-5" onSubmit={handleForgotPassword}>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Email Terdaftar
              </label>
              <input
                type="email"
                className="text-black w-full px-4 py-2 text-xs border rounded-lg outline-none focus:border-[#008BE3]"
                placeholder="contoh@domain.com"
                required
              />
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsForgotPasswordView(false)}
                className="text-black w-full px-5 py-2 border rounded-lg text-xs font-bold hover:bg-slate-50"
              >
                Kembali
              </button>
              <button
                type="submit"
                className="w-full bg-[#008BE3] text-white rounded-lg text-xs font-bold hover:bg-[#0076C2]"
              >
                Kirim Instruksi
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    );
  }

  // --- TAMPILAN REGISTRASI ---
  if (!isLoginView) {
    return (
      <div
        className="min-h-screen w-full overflow-y-auto flex items-center justify-center p-4 md:p-6 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.8)), url('/bg-lpm.jpeg')",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl border border-slate-200 shadow-sm w-full max-w-5xl my-auto"
        >
          <div className="p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
              <button
                type="button"
                onClick={() => setIsLoginView(true)}
                className="text-black p-1.5 hover:bg-slate-50 rounded-lg border border-slate-200"
              >
                <ArrowLeft size={16} />
              </button>
              <div>
                <h2 className="text-lg md:text-xl font-black text-slate-900 leading-none">
                  Registrasi Akun Baru
                </h2>
                <p className="text-xs text-gray-500 mt-1.5">
                  Lengkapi formulir pendaftaran di bawah ini
                </p>
              </div>
            </div>

            <form className="space-y-6" onSubmit={handleRegister}>
              {/* Tipe Pengguna */}
              <div className="space-y-3">
                <h3 className="text-xs font-black text-slate-800 uppercase border-b border-slate-100 pb-2">
                  Tipe Pengguna
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label
                    className={`flex items-center p-3.5 border rounded-lg cursor-pointer ${mode === "asesi" ? "border-[#008BE3] bg-sky-50/40" : "bg-white"}`}
                  >
                    <input
                      type="radio"
                      name="tipe"
                      checked={mode === "asesi"}
                      onChange={() => setMode("asesi")}
                      className="w-4 h-4 text-[#008BE3]"
                    />
                    <div className="ml-3">
                      <p className="font-bold text-xs text-slate-900">
                        Asesi (Peserta Sertifikasi)
                      </p>
                    </div>
                  </label>
                  <label
                    className={`flex items-center p-3.5 border rounded-lg cursor-pointer ${mode === "asesor" ? "border-[#008BE3] bg-sky-50/40" : "bg-white"}`}
                  >
                    <input
                      type="radio"
                      name="tipe"
                      checked={mode === "asesor"}
                      onChange={() => setMode("asesor")}
                      className="w-4 h-4 text-[#008BE3]"
                    />
                    <div className="ml-3">
                      <p className="font-bold text-xs text-slate-900">
                        Asesor (Penguji Kompetensi)
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Data Kredensial */}
              <div className="space-y-4">
                <h3 className="text-xs font-black text-slate-800 uppercase border-b border-slate-100 pb-2">
                  Data Kredensial Akun
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Nama Pengguna
                    </label>
                    <input
                      type="text"
                      name="username"
                      className="text-black w-full px-3 py-2 text-xs border rounded-lg outline-none focus:border-[#008BE3]"
                      placeholder="Masukkan nama pengguna"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Email Aktif
                    </label>
                    <input
                      type="email"
                      name="email"
                      className="text-black w-full px-3 py-2 text-xs border rounded-lg outline-none focus:border-[#008BE3]"
                      placeholder="Masukkan email aktif"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <Lock
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        size={14}
                      />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        className="text-black w-full pl-9 pr-10 py-2 text-xs border rounded-lg outline-none focus:border-[#008BE3]"
                        placeholder="Masukkan password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#008BE3]"
                      >
                        {showPassword ? (
                          <EyeOff size={14} />
                        ) : (
                          <Eye size={14} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Konfirmasi Password
                    </label>
                    <div className="relative">
                      <Lock
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        size={14}
                      />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirm_password"
                        className="text-black w-full pl-9 pr-10 py-2 text-xs border rounded-lg outline-none focus:border-[#008BE3]"
                        placeholder="Konfirmasi password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#008BE3]"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={14} />
                        ) : (
                          <Eye size={14} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Pribadi */}
              <div className="space-y-4">
                <h3 className="text-xs font-black text-slate-800 uppercase border-b border-slate-100 pb-2">
                  Data Profil Pribadi
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      NIK
                    </label>
                    <input
                      type="text"
                      name="nik"
                      className="text-black w-full px-3 py-2 text-xs border rounded-lg outline-none focus:border-[#008BE3]"
                      placeholder="Masukkan NIK"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      name="nama_lengkap"
                      className="text-black w-full px-3 py-2 text-xs border rounded-lg outline-none focus:border-[#008BE3]"
                      placeholder="Masukkan nama lengkap"
                      required
                    />
                  </div>

                  {mode === "asesor" && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Nomor Registrasi/MET
                      </label>
                      <input
                        type="text"
                        name="nomor_registrasi_met"
                        className="text-black w-full px-3 py-2 text-xs border rounded-lg outline-none focus:border-[#008BE3]"
                        placeholder="Masukkan nomor registrasi/MET"
                        required
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Tempat Lahir
                    </label>
                    <input
                      type="text"
                      name="tempat_lahir"
                      className="text-black w-full px-3 py-2 text-xs border rounded-lg outline-none focus:border-[#008BE3]"
                      placeholder="Masukkan tempat lahir"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Tanggal Lahir
                    </label>
                    <input
                      type="date"
                      name="tanggal_lahir"
                      className="text-black w-full px-3 py-2 text-xs border rounded-lg outline-none focus:border-[#008BE3]"
                      placeholder="Masukkan tanggal lahir"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      Jenis Kelamin
                    </label>
                    <div className="flex gap-6 py-1">
                      <label className="text-black flex items-center text-xs font-bold">
                        <input
                          type="radio"
                          name="jenis_kelamin"
                          value="Laki-laki"
                          className="w-4 h-4"
                          required
                        />
                        <span className="ml-2">Laki-laki</span>
                      </label>
                      <label className="text-black flex items-center text-xs font-bold">
                        <input
                          type="radio"
                          name="jenis_kelamin"
                          value="Perempuan"
                          className="w-4 h-4"
                          required
                        />
                        <span className="ml-2">Perempuan</span>
                      </label>
                    </div>
                  </div>

                  {mode === "asesi" && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Kewarganegaraan
                      </label>
                      <select
                        name="kewarganegaraan"
                        className="text-black w-full px-3 py-2 text-xs border rounded-lg outline-none focus:border-[#008BE3]"
                        required
                      >
                        <option value="">Pilih kewarganegaraan</option>
                        <option value="WNI">WNI</option>
                        <option value="WNA">WNA</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Nomor HP
                    </label>
                    <input
                      type="tel"
                      name="no_hp"
                      className="text-black w-full px-3 py-2 text-xs border rounded-lg outline-none focus:border-[#008BE3]"
                      placeholder="Masukkan nomor HP"
                      required
                    />
                  </div>

                  {mode === "asesor" && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Pendidikan Terakhir
                      </label>
                      <select
                        name="pendidikan_terakhir"
                        className="text-black w-full px-3 py-2 text-xs border rounded-lg outline-none focus:border-[#008BE3]"
                        required
                      >
                        <option value="">Pilih Pendidikan Terakhir</option>
                        <option value="S1">S1 (Sarjana)</option>
                        <option value="S2">S2 (Magister)</option>
                        <option value="S3">S3 (Doktor)</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Pekerjaan Utama
                    </label>
                    <select
                      name="pekerjaan"
                      className="text-black w-full px-3 py-2 text-xs border rounded-lg outline-none focus:border-[#008BE3]"
                      required
                    >
                      <option value="">Pilih Pekerjaan Utama</option>
                      <option value="Pelajar/Mahasiswa">
                        Pelajar/Mahasiswa
                      </option>
                      <option value="PNS">Pegawai Negeri Sipil (PNS)</option>
                      <option value="Swasta">Karyawan Swasta</option>
                      <option value="Lainnya">Lainnya / Professional</option>
                    </select>
                  </div>

                  {mode === "asesor" && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Alamat Wilayah/Kelurahan
                      </label>
                      <input
                        type="text"
                        name="alamat_wilayah"
                        className="text-black w-full px-3 py-2 text-xs border rounded-lg outline-none focus:border-[#008BE3]"
                        placeholder="Masukkan alamat wilayah/kelurahan"
                        required
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Tanda Tangan
                    </label>
                    {tandaTangan && (
                      <div className="mb-2 border border-slate-200 rounded-lg p-2 flex justify-center">
                        <img
                          src={tandaTangan}
                          alt="Tanda Tangan"
                          className="h-10 object-contain"
                        />
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => setIsSignatureModalOpen(true)}
                      className="w-full py-2.5 bg-[#008BE3] text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer"
                    >
                      {tandaTangan ? "Ubah Tanda Tangan" : "Buat Tanda Tangan"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-5 flex flex-col sm:flex-row gap-3 sm:justify-between items-center bg-slate-50/50 p-4 rounded-lg">
                <button
                  type="button"
                  onClick={() => setIsLoginView(true)}
                  className="text-black w-full sm:w-auto px-5 py-2 border border-slate-200 bg-white hover:bg-slate-100 rounded-lg text-xs font-bold shadow-2xs transition-all cursor-pointer"
                >
                  Kembali ke Login
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full sm:w-auto bg-[#008BE3] hover:bg-[#0076C2] active:scale-[0.99] text-white px-6 py-2 rounded-lg text-xs font-bold shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  {isLoading ? "Memproses..." : "Daftar Akun Baru"}
                </button>
              </div>
            </form>
          </div>
        </motion.div>

        {/* Modal Kanvas */}
        {isSignatureModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
              <div className="text-black p-4 border-b flex justify-between">
                <h3 className="font-bold text-sm">Buat Tanda Tangan</h3>
                <button onClick={() => setIsSignatureModalOpen(false)}>
                  <X size={18} />
                </button>
              </div>
              <div className="p-4">
                <div className="border rounded-lg bg-white">
                  <SignatureCanvas
                    ref={signatureRef}
                    canvasProps={{
                      className: "w-full h-48 sm:h-64 cursor-crosshair",
                    }}
                    backgroundColor="white"
                  />
                </div>
              </div>
              <div className="p-4 border-t flex flex-wrap gap-2 justify-between bg-slate-50">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsSignatureModalOpen(false)}
                    className="text-black px-4 py-2 border bg-white rounded-lg text-xs font-bold"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={() => signatureRef.current?.clear()}
                    className="px-3 py-2 border text-rose-500 bg-white rounded-lg text-xs"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="flex gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 border text-emerald-600 bg-white rounded-lg text-xs font-bold flex gap-2"
                  >
                    <Upload size={14} />
                    Upload
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveSignature}
                    className="px-4 py-2 bg-[#008BE3] text-white rounded-lg text-xs font-bold flex gap-2"
                  >
                    <Save size={14} />
                    Simpan
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (isOtpView) {
    return (
      <div
        className="h-screen w-screen overflow-hidden flex items-center justify-center p-4 md:p-6 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.8)), url('/bg-lpm.jpeg')",
        }}
      >
        {notification.show && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-100 px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 border backdrop-blur-md ${notification.type === "success"
                ? "bg-emerald-50/90 border-emerald-200 text-emerald-800"
                : "bg-rose-50/90 border-rose-200 text-rose-800"
              }`}
          >
            {notification.type === "success" ? (
              <BadgeCheck size={20} className="text-emerald-500" />
            ) : (
              <X
                size={20}
                className="text-rose-500 bg-rose-100 rounded-full p-0.5"
              />
            )}
            <p className="text-sm font-bold tracking-wide">
              {notification.message}
            </p>
          </motion.div>
        )}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg bg-white rounded-xl border border-slate-200/90 shadow-sm p-6 md:p-10"
        >
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-lg bg-[#008BE3]/10 flex items-center justify-center text-[#008BE3] border border-[#008BE3]/20 shadow-xs">
              <Mail size={20} className="stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 leading-none">
                Masukkan Kode OTP
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Kode 6 digit telah dikirim ke {resetEmail}
              </p>
            </div>
          </div>
          <form className="space-y-5" onSubmit={handleVerifyOtp}>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Kode OTP
              </label>
              <div className="flex gap-2 justify-between">
                {otpDigits.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      otpInputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    onPaste={index === 0 ? handleOtpPaste : undefined}
                    autoComplete="one-time-code" // penting — mencegah browser nyocokin autofill lain (email, dsb)
                    className="text-black w-11 h-12 md:w-12 md:h-14 text-center text-xl font-bold border rounded-lg outline-none focus:border-[#008BE3] focus:ring-2 focus:ring-[#008BE3]/20"
                    required
                  />
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsOtpView(false);
                  setIsForgotPasswordView(true);
                }}
                className="text-black w-full px-5 py-2 border rounded-lg text-xs font-bold hover:bg-slate-50"
              >
                Kembali
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#008BE3] text-white rounded-lg text-xs font-bold hover:bg-[#0076C2] disabled:opacity-50"
              >
                {isLoading ? "Memverifikasi..." : "Verifikasi"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    );
  }

  if (isNewPasswordView) {
    return (
      <div
        className="h-screen w-screen overflow-hidden flex items-center justify-center p-4 md:p-6 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.8)), url('/bg-lpm.jpeg')",
        }}
      >
        {notification.show && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-100 px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 border backdrop-blur-md ${notification.type === "success"
                ? "bg-emerald-50/90 border-emerald-200 text-emerald-800"
                : "bg-rose-50/90 border-rose-200 text-rose-800"
              }`}
          >
            {notification.type === "success" ? (
              <BadgeCheck size={20} className="text-emerald-500" />
            ) : (
              <X
                size={20}
                className="text-rose-500 bg-rose-100 rounded-full p-0.5"
              />
            )}
            <p className="text-sm font-bold tracking-wide">
              {notification.message}
            </p>
          </motion.div>
        )}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg bg-white rounded-xl border border-slate-200/90 shadow-sm p-6 md:p-10"
        >
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-lg bg-[#008BE3]/10 flex items-center justify-center text-[#008BE3] border border-[#008BE3]/20 shadow-xs">
              <Mail size={20} className="stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 leading-none">
                Buat Password Baru
              </h2>
              <p className="text-xs text-gray-500 mt-1">Minimal 8 karakter</p>
            </div>
          </div>
          <form className="space-y-5" onSubmit={handleResetPassword}>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Password Baru
              </label>
              <input
                type="password"
                name="newPassword"
                className="text-black w-full px-4 py-2 text-xs border rounded-lg outline-none focus:border-[#008BE3]"
                placeholder="Minimal 8 karakter"
                minLength={8}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#008BE3]"
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 bg-[#008BE3] text-white rounded-lg text-xs font-bold hover:bg-[#0076C2] disabled:opacity-50"
              >
                {isLoading ? "Menyimpan..." : "Simpan Password Baru"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    );
  }
  // --- TAMPILAN LOGIN ---
  return (
    <div
      className="h-screen w-screen overflow-hidden flex items-center justify-center p-4 md:p-6 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.8)), url('/bg-lpm.jpeg')",
      }}
    >
      {notification.show && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className={`fixed top-6 left-1/2 -translate-x-1/2 z-100 px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 border backdrop-blur-md ${notification.type === "success"
              ? "bg-emerald-50/90 border-emerald-200 text-emerald-800"
              : "bg-rose-50/90 border-rose-200 text-rose-800"
            }`}
        >
          {notification.type === "success" ? (
            <BadgeCheck size={20} className="text-emerald-500" />
          ) : (
            <X
              size={20}
              className="text-rose-500 bg-rose-100 rounded-full p-0.5"
            />
          )}
          <p className="text-sm font-bold tracking-wide">
            {notification.message}
          </p>
        </motion.div>
      )}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl bg-white rounded-xl border border-slate-200/90 shadow-sm flex overflow-hidden relative"
      >
        <div className="hidden md:flex md:w-6/12 relative bg-[#0F172A]">
          <div className="absolute inset-0 bg-linear-to-tr from-[#0F172A]/95 via-[#0F172A]/85 to-[#008BE3]/30 z-10" />
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80"
            alt="Professionals"
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40"
          />
          <div className="relative z-20 flex flex-col justify-between p-10 h-full text-white">
            <div className="flex items-center">
              <img
                src="/logo-lsp.png"
                alt="Logo LSP UIN SGD"
                className="h-12 w-auto object-contain"
              />
            </div>
            <div className="my-auto space-y-4">
              <span className="inline-flex items-center gap-1.5 bg-sky-500/10 text-sky-300 text-[10px] px-2.5 py-1 rounded-full font-bold border border-sky-400/20">
                <BadgeCheck size={11} />
                Terakreditasi BNSP
              </span>
              <h2 className="text-2xl font-black leading-snug">
                Ukur Kompetensi, Gapai Karir Terbaik Anda
              </h2>
              <p className="text-xs text-slate-300">
                Sistem pendaftaran dan evaluasi uji kompetensi digital
                terintegrasi.
              </p>
            </div>
            <div className="text-[10px] text-slate-400 font-semibold">
              © 2026 Lembaga Sertifikasi Profesi UIN Sunan Gunung Djati.
            </div>
          </div>
        </div>

        <div className="w-full md:w-6/12 flex flex-col">
          {/* --- HEADER LOGO KHUSUS MOBILE --- */}
          <div className="md:hidden w-full bg-[#0F172A] p-6 flex justify-center items-center">
            <img
              src="/logo-lsp.png"
              alt="Logo LSP UIN SGD"
              className="h-12 w-auto object-contain"
            />
          </div>
          {/* ---------------------------------- */}

          <div className="py-8 px-6 md:py-10 md:px-10 flex flex-col justify-center flex-1">
            <div className="mb-6">
              <h2 className="text-xl md:text-2xl font-black text-slate-900">
                Selamat Datang
              </h2>
            </div>
            <form className="space-y-4" onSubmit={handleLogin}>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Nama Pengguna/E-Mail
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={14}
                  />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="text-black w-full pl-9 pr-4 py-2 text-xs border rounded-lg outline-none focus:border-[#008BE3]"
                    placeholder="Masukkan nama pengguna/E-Mail"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Kata Sandi
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={14}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="text-black w-full pl-9 pr-10 py-2 text-xs border rounded-lg outline-none focus:border-[#008BE3]"
                    placeholder="Ketik kata sandi"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#008BE3]"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <div className="flex justify-between py-1">
                <label className="flex gap-1.5 text-xs font-bold text-slate-600">
                  <input type="checkbox" className="w-3.5 h-3.5" />
                  <span>Ingat Saya</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsForgotPasswordView(true)}
                  className="text-xs text-[#008BE3] font-bold"
                >
                  Lupa Kata Sandi?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#008BE3] hover:bg-[#0076C2] active:scale-[0.99] text-white font-bold py-2.5 rounded-lg text-xs flex justify-center gap-1.5 transition-all shadow-sm hover:shadow-md cursor-pointer"
              >
                <LogIn size={13} />
                {isLoading ? "Memproses..." : "Masuk ke Aplikasi"}
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t"></div>
                </div>
                <div className="relative flex justify-center text-[9px] font-bold">
                  <span className="bg-white px-2.5 text-slate-400">
                    Belum Memiliki Akun?
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsLoginView(false)}
                className="w-full bg-white border border-slate-200 hover:border-[#008BE3]/50 hover:bg-sky-50/30 text-slate-700 hover:text-[#008BE3] font-bold py-2.5 rounded-lg text-xs flex justify-center gap-1.5 transition-all shadow-2xs hover:shadow-sm cursor-pointer"
              >
                <UserPlus size={13} />
                Buat Akun
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
