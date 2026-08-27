"use client";

import React, { useState, ReactNode } from "react";
import {
  Trash2,
  FileText,
  Plus,
  Search,
  Calendar,
  ArrowLeft,
  ArrowRight,
  Upload,
  BadgeCheck,
  CheckCircle,
  AlertTriangle,
  Download,
  X,
} from "lucide-react";

import { FormDocumentTable } from "@/components/forms/asesi/FormDocumentTable";
import { FormKompetensiTable } from "@/components/forms/asesi/FormKompetensiTable";
import { EFormApl01 } from "@/components/forms/asesi/FormFRAPL01";
import { EFormApl02 } from "@/components/forms/asesi/FormFRAPL02";
import { useAppContext } from "@/context/context";
import { supabase } from "@/lib/supabase";

import type { 
  SchemeItem, 
  Submission, 
  SchemeUnit, 
  SchemeElemen, 
  RequirementType,
  SchemeDetailInfo
} from "@/types/types";

import {
  DATA_PROVINSI,
  DATA_KOTA,
  DATA_PEKERJAAN,
  DATA_PENDIDIKAN,
  DATA_INSTANSI,
} from "@/data/rujukan";

// --- INTERFACE UNTUK DATA RUJUKAN ---
interface RujukanItem {
  id: string;
  label: string;
}

interface KotaItem extends RujukanItem {
  provId: string;
}

const provinsis = DATA_PROVINSI as RujukanItem[];
const kotas = DATA_KOTA as KotaItem[];
const pekerjaans = DATA_PEKERJAAN as RujukanItem[];
const pendidikans = DATA_PENDIDIKAN as RujukanItem[];
const instansis = DATA_INSTANSI as RujukanItem[];
// ------------------------------------

interface Breadcrumb {
  label: string;
  onClick?: () => void;
}

// Interface sementara untuk membaca bentuk JSON dari API Skema
interface ApiSkemaResponse {
  id: string | number;
  kode_skema?: string;
  kodeSkema?: string;
  nama_skema?: string;
  namaSkema?: string;
  persyaratanDasar?: RequirementType[];
  persyaratan_dasar?: RequirementType[];
  persyaratanAdministrasi?: RequirementType[];
  persyaratan_administrasi?: RequirementType[];
  unitKompetensi?: Array<{
    kodeUnit?: string;
    kode_unit?: string;
    judulUnit?: string;
    judul_unit?: string;
    elemen?: SchemeElemen[];
  }>;
  [key: string]: unknown;
}

export default function PengajuanSkemaPage() {
  const { user, setExtraCrumbs } = useAppContext();

  const [subView, setSubView] = useState<
    "list" | "choose-scheme" | "apply-form"
  >("list");
  
  // STATE BARU: Untuk menyimpan data Skema dari Supabase API
  const [schemesData, setSchemesData] = useState<SchemeItem[]>([]);
  const [isLoadingSchemes, setIsLoadingSchemes] = useState(true);

  const [selectedScheme, setSelectedScheme] = useState<SchemeItem | null>(null);

  const [showExitWarning, setShowExitWarning] = useState(false);
  const [exitDestination, setExitDestination] = useState<
    "list" | "choose-scheme" | null
  >(null);

  const handleExitRequest = React.useCallback(
    (destination: "list" | "choose-scheme") => {
      if (subView === "apply-form") {
        setExitDestination(destination);
        setShowExitWarning(true);
      } else {
        setSubView(destination);
      }
    },
    [subView],
  );

  const [selectedDetailSubmission, setSelectedDetailSubmission] =
    useState<Profile | null>(null);

  React.useEffect(() => {
    const handleReset = () => setSubView("list");
    window.addEventListener("reset-eform", handleReset);
    return () => {
      window.removeEventListener("reset-eform", handleReset);
      setExtraCrumbs([]);
    };
  }, [setExtraCrumbs]);

  React.useEffect(() => {
    if (selectedDetailSubmission) {
      setExtraCrumbs([
        { label: "Pengajuan Skema", onClick: () => handleExitRequest("list") },
        { label: "Detail Pengajuan" },
      ] as Breadcrumb[]);
    } else if (subView === "list") {
      setExtraCrumbs([{ label: "Pengajuan Skema" }] as Breadcrumb[]);
    } else if (subView === "choose-scheme") {
      setExtraCrumbs([
        { label: "Pengajuan Skema", onClick: () => handleExitRequest("list") },
        { label: "Daftar Skema" },
      ] as Breadcrumb[]);
    } else if (subView === "apply-form") {
      setExtraCrumbs([
        { label: "Pengajuan Skema", onClick: () => handleExitRequest("list") },
        {
          label: "Daftar Skema",
          onClick: () => handleExitRequest("choose-scheme"),
        },
        { label: "Ajukan Skema" },
      ] as Breadcrumb[]);
    }
  }, [subView, selectedDetailSubmission, handleExitRequest]);

  const [step, setStep] = useState<number>(1);
  const [showStep2Errors, setShowStep2Errors] = useState(false);
  const [showStep3Errors, setShowStep3Errors] = useState(false);

  interface ActiveModalDoc {
    isEForm?: boolean;
    isPreview?: boolean;
    name?: string;
    [key: string]: unknown;
  }

  const [activeModalDoc, setActiveModalDoc] = useState<ActiveModalDoc | null>(
    null,
  );
  const [tempFiles, setTempFiles] = useState<File[]>([]);
  const [eFormData, setEFormData] = useState<Record<string, unknown>>({});
  const [tempEFormData, setTempEFormData] = useState<Record<string, unknown>>(
    {},
  );
  const [alertMsg, setAlertMsg] = useState("");

  const showAlert = (msg: string) => {
    setAlertMsg(msg);
    setTimeout(() => setAlertMsg(""), 3000);
  };

  React.useEffect(() => {
    if (
      activeModalDoc &&
      !activeModalDoc.isEForm &&
      !activeModalDoc.isPreview
    ) {
      const key =
        typeof activeModalDoc.name === "string"
          ? activeModalDoc.name
          : undefined;
      setTempFiles((key ? (eFormData[key] as File[]) : []) || []);
    }
  }, [activeModalDoc, eFormData]);

  const [expandedSchemes, setExpandedSchemes] = useState<string[]>([]);

  const [submissions] = useState<Profile[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("lsp_submissions");
      if (saved) {
        const parsed = JSON.parse(saved) as Profile[];
        const filtered = parsed.filter(
          (p: Profile) => p.name !== "Pelayanan Pelanggan",
        );
        if (filtered.length !== parsed.length) {
          localStorage.setItem("lsp_submissions", JSON.stringify(filtered));
          return filtered;
        }
        return parsed;
      }
    }
    return [];
  });

  const [searchSub, setSearchSub] = useState("");
  const [statusSubFilter, setStatusSubFilter] = useState("Semua");
  const [dateSubFilter, setDateSubFilter] = useState("");
  const [subPage, setSubPage] = useState(1);

  const [searchScheme, setSearchScheme] = useState("");
  const [schemePage, setSchemePage] = useState(1);

  const [namaLengkap, setNamaLengkap] = useState(user?.username || "");
  const [tempatLahir, setTempatLahir] = useState("");
  const [tanggalLahir, setTanggalLahir] = useState("");
  const [jenisKelamin, setJenisKelamin] = useState("");
  const [alamat, setAlamat] = useState("");
  const [provinsi, setProvinsi] = useState("");
  const [kota, setKota] = useState("");

  const namaProvinsi = provinsis.find((p) => p.id === provinsi)?.label || "";
  const namaKota = kotas.find((k) => k.id === kota)?.label || "";
  const alamatWilayah = [namaKota, namaProvinsi].filter(Boolean).join(", ");

  const [nik, setNik] = useState("");
  const [kewarganegaraan, setKewarganegaraan] = useState("WNI");
  const [kodePos, setKodePos] = useState("");
  const [noTelp, setNoTelp] = useState("");

  const [pendidikanTerakhir, setPendidikanTerakhir] = useState("");
  const [pekerjaan, setPekerjaan] = useState("");
  const [institusiPerusahaan, setInstitusiPerusahaan] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [emailInstitusi, setEmailInstitusi] = useState("");
  const [kodePosInstitusi, setKodePosInstitusi] = useState("");
  const [alamatInstitusi, setAlamatInstitusi] = useState("");
  const [telpInstitusi, setTelpInstitusi] = useState("");
  const [faxInstitusi, setFaxInstitusi] = useState("");
  const [tuk, setTuk] = useState("");
  const [metode, setMetode] = useState("");
  const [berpengalaman, setBerpengalaman] = useState(false);
  const [penyesuaianWajar, setPenyesuaianWajar] = useState(false);

  // FETCH PROFIL USER
  React.useEffect(() => {
    const fetchProfil = async () => {
      try {
        const response = await fetch("/api/profil");

        if (response.ok) {
          const dataProfil = await response.json();

          if (dataProfil.namaLengkap) setNamaLengkap(dataProfil.namaLengkap);
          if (dataProfil.nik) setNik(dataProfil.nik);
          if (dataProfil.tempatLahir) setTempatLahir(dataProfil.tempatLahir);

          if (dataProfil.tanggalLahir) {
            const dateObj = new Date(dataProfil.tanggalLahir);
            setTanggalLahir(dateObj.toISOString().split("T")[0]);
          }

          if (dataProfil.jenisKelamin) setJenisKelamin(dataProfil.jenisKelamin);
          if (dataProfil.kewarganegaraan)
            setKewarganegaraan(dataProfil.kewarganegaraan);

          if (dataProfil.noHp) setNoTelp(dataProfil.noHp);
          if (dataProfil.alamat) setAlamat(dataProfil.alamat);
          if (dataProfil.kodeProvinsi) setProvinsi(dataProfil.kodeProvinsi);
          if (dataProfil.kodeKota) setKota(dataProfil.kodeKota);
          if (dataProfil.kodePos) setKodePos(dataProfil.kodePos);
          if (dataProfil.pendidikanTerakhir)
            setPendidikanTerakhir(dataProfil.pendidikanTerakhir);
          if (dataProfil.pekerjaan) setPekerjaan(dataProfil.pekerjaan);
          if (dataProfil.namaInstitusi)
            setInstitusiPerusahaan(dataProfil.namaInstitusi);
          if (dataProfil.jabatan) setJabatan(dataProfil.jabatan);
          if (dataProfil.emailInstitusi)
            setEmailInstitusi(dataProfil.emailInstitusi);
          if (dataProfil.kodePosInstitusi)
            setKodePosInstitusi(dataProfil.kodePosInstitusi);
          if (dataProfil.telpInstitusi)
            setTelpInstitusi(dataProfil.telpInstitusi);
          if (dataProfil.alamatInstitusi)
            setAlamatInstitusi(dataProfil.alamatInstitusi);
          if (dataProfil.faxInstitusi) setFaxInstitusi(dataProfil.faxInstitusi);
        }
      } catch (error) {
        console.error("Gagal mengambil data profil:", error);
      }
    };

    fetchProfil();
  }, []);

  // FETCH MASTER SKEMA DARI BACKEND
  React.useEffect(() => {
    const fetchSchemes = async () => {
      setIsLoadingSchemes(true);
      try {
        const response = await fetch('/api/skema');
        if (response.ok) {
          const result = await response.json();
          // MAPPING DATA: Merapikan data agar cocok dengan struktur `SchemeItem`
          const mappedSchemes: SchemeItem[] = result.data.map((skema: ApiSkemaResponse) => ({
            ...skema,
            id: String(skema.id),
            code: skema.kode_skema || skema.kodeSkema || "-",
            name: skema.nama_skema || skema.namaSkema || "-",
            status: "Active",
            kategori: "-",
            unitKompetensi: Array.isArray(skema.unitKompetensi) 
              ? skema.unitKompetensi.map((unit) => ({
                  kode: unit.kodeUnit || unit.kode_unit || "-",
                  judul: unit.judulUnit || unit.judul_unit || "-",
                  elemen: unit.elemen || []
                }))
              : [],
            persyaratan_dasar: skema.persyaratanDasar || skema.persyaratan_dasar || [],
            persyaratan_administrasi: skema.persyaratanAdministrasi || skema.persyaratan_administrasi || []
          }));
          
          setSchemesData(mappedSchemes);
        }
      } catch (error) {
        console.error("Gagal memuat skema:", error);
      } finally {
        setIsLoadingSchemes(false);
      }
    };

    fetchSchemes();
  }, []);

  interface Step1Errors {
    namaLengkap: boolean;
    tempatLahir: boolean;
    tanggalLahir: boolean;
    jenisKelamin: boolean;
    provinsi: boolean;
    kota: boolean;
    alamat: boolean;
    nik: boolean;
    kodePos: boolean;
    noTelp: boolean;
    pendidikanTerakhir: boolean;
    pekerjaan: boolean;
    institusiPerusahaan: boolean;
    jabatan: boolean;
    emailInstitusi: boolean;
    telpInstitusi: boolean;
    alamatInstitusi: boolean;
    tuk: boolean;
    metode: boolean;
  }

  const scrollToTopMobile = () => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const [errors, setErrors] = useState<Step1Errors>({
    namaLengkap: false,
    tempatLahir: false,
    tanggalLahir: false,
    jenisKelamin: false,
    provinsi: false,
    kota: false,
    alamat: false,
    nik: false,
    kodePos: false,
    noTelp: false,
    pendidikanTerakhir: false,
    pekerjaan: false,
    institusiPerusahaan: false,
    jabatan: false,
    emailInstitusi: false,
    telpInstitusi: false,
    alamatInstitusi: false,
    tuk: false,
    metode: false,
  });

  const handleNext = () => {
    if (step === 1) {
      const newErrors: Step1Errors = {
        namaLengkap: namaLengkap.trim() === "",
        tempatLahir: tempatLahir.trim() === "",
        tanggalLahir: tanggalLahir === "",
        jenisKelamin: jenisKelamin === "",
        provinsi: provinsi === "",
        kota: kota === "",
        alamat: alamat.trim() === "",
        nik: nik.trim() === "",
        kodePos: kodePos.trim() === "",
        noTelp: noTelp.trim() === "",
        pendidikanTerakhir: pendidikanTerakhir === "",
        pekerjaan: pekerjaan === "",
        institusiPerusahaan: institusiPerusahaan.trim() === "",
        jabatan: jabatan.trim() === "",
        emailInstitusi: emailInstitusi.trim() === "",
        telpInstitusi: telpInstitusi.trim() === "",
        alamatInstitusi: alamatInstitusi.trim() === "",
        tuk: tuk === "",
        metode: metode === "",
      };
      setErrors(newErrors);

      const hasErrors = Object.values(newErrors).some((isError) => isError);

      if (!hasErrors) {
        setStep(2);
        scrollToTopMobile();
      }
    } else if (step === 2) {
      const reqs = selectedScheme?.persyaratanDasar || [];
      const valid = reqs.every((req) => {
        const key = typeof req === "string" ? req : req.namaDokumen;
        return Boolean(key && eFormData[key]);
      });
      if (!valid) {
        setShowStep2Errors(true);
      } else {
        setShowStep2Errors(false);
        setStep(3);
        scrollToTopMobile();
      }
    } else if (step === 3) {
      const reqs = selectedScheme?.persyaratanAdministrasi || [];
      const valid = reqs.every((req) => {
        const key = typeof req === "string" ? req : req.namaDokumen;
        return Boolean(key && eFormData[key]);
      });
      if (!valid) {
        setShowStep3Errors(true);
      } else {
        setShowStep3Errors(false);
        setStep(4);
        scrollToTopMobile();
      }
    } else if (step === 5) {
      handleSubmitForm();
    } else {
      setStep(step + 1);
      scrollToTopMobile();
    }
  };

  const handleSubmitForm = async () => {
    try {
      showAlert("Mengunggah dokumen dan memproses pengajuan...");
      
      const uploadedDokumen: Array<{namaDokumen: string; fileUrl: string}> = [];

      for (const [namaDokumen, value] of Object.entries(eFormData)) {
        const files: unknown[] = Array.isArray(value) ? value : [value];

        for (const file of files) {
          if (file instanceof File) {
            const fileExt = file.name.split(".").pop() || "pdf";
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
              .from("dokumen-pengajuan")
              .upload(fileName, file);

            if (uploadError) {
              throw new Error(
                `Gagal mengunggah ${namaDokumen}: ${uploadError.message}`,
              );
            }

            const { data: urlData } = supabase.storage
              .from("dokumen-pengajuan")
              .getPublicUrl(fileName);

            uploadedDokumen.push({
              namaDokumen: namaDokumen,
              fileUrl: urlData.publicUrl,
            });
          }
        }
      }

      const payloadData = {
        userId: user?.id, // Jangan lupa kirim userId!
        name: selectedScheme?.name || "Uji Kompetensi Mandiri",
        code: selectedScheme?.code || "001/SKM/LSP-KJN/II/2023",
        namaLengkap, tempatLahir, tanggalLahir, jenisKelamin, alamat,
        provinsi, kota, nik, kewarganegaraan, kodePos, noTelp,
        pendidikanTerakhir, pekerjaan, institusiPerusahaan, jabatan,
        emailInstitusi, kodePosInstitusi, alamatInstitusi, telpInstitusi,
        faxInstitusi, tuk, metode, penyesuaianWajar, berpengalaman,
        dokumen: uploadedDokumen, 
      };

      const response = await fetch("/api/pengajuan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadData),
      });

      if (!response.ok) {
        const errData = (await response.json()) as { message?: string };
        throw new Error(
          errData.message || "Gagal ngirim data ke server database",
        );
      }

      showAlert(`Pengajuan Skema ${payloadData.name} Berhasil Diajukan!`);

      setTempatLahir("");
      setAlamat("");
      setNik("");
      setKodePos("");
      setTuk("");
      setMetode("");
      setBerpengalaman(false);
      setStep(1);
      setSubView("list");
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error) {
        showAlert(error.message);
      } else {
        showAlert("Yah, terjadi kesalahan saat mengirim pengajuan.");
      }
    }
  };

  const filteredSubmissions = submissions.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchSub.toLowerCase()) ||
      item.kode.toLowerCase().includes(searchSub.toLowerCase());
    const matchesStatus =
      statusSubFilter === "Semua" || item.status === statusSubFilter;
    const matchesDate =
      !dateSubFilter ||
      (() => {
        const [year, month, day] = dateSubFilter.split("-");
        const formattedFilter = `${day}/${month}/${year}`;
        return (
          item.date === formattedFilter ||
          item.date === `${day}-${month}-${year}`
        );
      })();
    return matchesSearch && matchesStatus && matchesDate;
  });

  const formatTanggal = (tanggal: string) => {
    if (!tanggal) return "-";
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(tanggal)) return tanggal;
    const parts = tanggal.split(" ");
    if (parts.length === 3) {
      const months: Record<string, string> = {
        jan: "01",
        feb: "02",
        mar: "03",
        apr: "04",
        mei: "05",
        may: "05",
        jun: "06",
        jul: "07",
        agt: "08",
        aug: "08",
        sep: "09",
        okt: "10",
        oct: "10",
        nov: "11",
        des: "12",
        dec: "12",
      };
      const d = parts[0].padStart(2, "0");
      const m = months[parts[1].toLowerCase()] || "01";
      const y = parts[2];
      return `${d}/${m}/${y}`;
    }
    const dateObj = new Date(tanggal);
    if (!isNaN(dateObj.getTime())) return dateObj.toLocaleDateString("en-GB");
    return tanggal;
  };

  // MENGGUNAKAN DATA API SCHEMES DATA
  const filteredSchemes = schemesData.filter((item) => {
    const name = item.name?.toLowerCase() ?? "";
    const code = item.code?.toLowerCase() ?? "";
    return (
      name.includes(searchScheme.toLowerCase()) ||
      code.includes(searchScheme.toLowerCase())
    );
  });

  const [itemsPerPage, setItemsPerPage] = useState(5);
  const paginatedSubmissions = filteredSubmissions.slice(
    (subPage - 1) * itemsPerPage,
    subPage * itemsPerPage,
  );
  const paginatedSchemes = filteredSchemes.slice(
    (schemePage - 1) * itemsPerPage,
    schemePage * itemsPerPage,
  );

  const totalSubPages =
    Math.ceil(filteredSubmissions.length / itemsPerPage) || 1;
  const totalSchemePages =
    Math.ceil(filteredSchemes.length / itemsPerPage) || 1;

  const currentSchemeDetail: SchemeDetailInfo | undefined = selectedScheme ? {
    ...selectedScheme,
    nama: selectedScheme.name,
    units: selectedScheme.unitKompetensi,
    persyaratanDasar: selectedScheme.persyaratan_dasar,
    buktiAdministratif: selectedScheme.persyaratan_administrasi,
  } : undefined;

  return (
    <>
      {alertMsg && (
        <div className="fixed top-4 right-4 bg-slate-900 text-white p-4 rounded-lg shadow-2xl z-9999 font-medium text-sm max-w-sm animate-in fade-in slide-in-from-top-4">
          {alertMsg}
        </div>
      )}

      {/* VIEW 1: LIST SUBMISSIONS */}
      {subView === "list" && (
        <div className="w-full space-y-6 pb-12 text-sm text-gray-700">
          {!selectedDetailSubmission && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-[#008BE3]/10 flex items-center justify-center text-[#008BE3] border border-[#008BE3]/20 shadow-sm shrink-0">
                    <FileText size={20} className="stroke-[2.5]" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none mb-1 md:whitespace-nowrap">
                      Pengajuan Skema
                    </h2>
                    <p className="text-xs text-gray-400 font-bold tracking-wider uppercase leading-4 md:whitespace-nowrap">
                      Daftar permohonan sertifikasi skema Anda
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSubView("choose-scheme");
                    setSchemePage(1);
                    setSearchScheme("");
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#008BE3] hover:bg-[#0076C2] text-white rounded-lg text-xs md:text-sm font-extrabold shadow-md hover:shadow-lg transition-all shrink-0 cursor-pointer"
                >
                  <Plus size={16} className="stroke-3" />
                  <span>Ajukan Skema</span>
                </button>
              </div>

              <section className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div className="min-w-0">
                    <h3 className="text-base font-black text-slate-900">
                      Daftar Permohonan Sertifikasi
                    </h3>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 w-full lg:w-auto ml-auto">
                    <div className="flex items-center gap-2 bg-gray-50/80 rounded-lg px-3 h-10 w-full sm:w-64 border border-gray-200/50 focus-within:border-[#008BE3]/40 transition-colors">
                      <Search className="text-gray-400" size={16} />
                      <input
                        type="text"
                        placeholder="Cari Skema Sertifikasi..."
                        value={searchSub}
                        onChange={(e) => {
                          setSearchSub(e.target.value);
                          setSubPage(1);
                          setSchemePage(1);
                        }}
                        className="bg-transparent border-none focus:ring-0 text-[14px] w-full outline-none text-gray-700 placeholder-gray-400 font-semibold"
                      />
                    </div>

                    <select
                      value={statusSubFilter}
                      onChange={(e) => {
                        setStatusSubFilter(e.target.value);
                        setSubPage(1);
                        setSchemePage(1);
                      }}
                      className="bg-gray-50 border border-gray-200/50 text-[14px] rounded-lg px-3 h-10 outline-none text-gray-700 cursor-pointer font-bold"
                    >
                      <option value="Semua">Semua Status</option>
                      <option value="Menunggu Persetujuan">
                        Menunggu Persetujuan
                      </option>
                      <option value="Disetujui">Disetujui</option>
                      <option value="Ditolak">Ditolak</option>
                    </select>

                    <div className="flex items-center gap-2 bg-gray-50/80 rounded-lg px-3 h-10 w-full sm:w-48 border border-gray-200/50 focus-within:border-[#008BE3]/40 transition-colors">
                      <input
                        type="date"
                        value={dateSubFilter}
                        onChange={(e) => {
                          setDateSubFilter(e.target.value);
                          setSubPage(1);
                          setSchemePage(1);
                        }}
                        className="bg-transparent border-none focus:ring-0 text-xs md:text-sm w-full outline-none text-gray-700 font-semibold"
                      />
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto relative ">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#0F172A] border-b border-[#0F172A]">
                        <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-left whitespace-nowrap w-16 sticky top-0 z-20 bg-[#0F172A]">
                          No
                        </th>
                        <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-left whitespace-nowrap min-w-87.5 max-w-125 sticky top-0 z-20 bg-[#0F172A]">
                          Skema Sertifikasi
                        </th>
                        <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-left whitespace-nowrap min-w-45 sticky top-0 z-20 bg-[#0F172A]">
                          Tanggal Pengajuan
                        </th>
                        <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-left whitespace-nowrap sticky top-0 z-20 bg-[#0F172A]">
                          Status
                        </th>
                        <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-center whitespace-nowrap w-44 sticky right-0 bg-[#0F172A] shadow-[-6px_0_15px_-4px_rgba(0,0,0,0.06)] z-30 border-l border-white/10 top-0">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100/60 font-medium">
                      {paginatedSubmissions.length > 0 ? (
                        paginatedSubmissions.map((item, idx) => (
                          <tr
                            key={item.id}
                            className="group/row hover:bg-[#F9FAFC] transition-colors"
                          >
                            <td className="px-6 py-4 text-xs md:text-sm font-semibold text-slate-700 w-16">
                              <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm font-bold text-xs ${
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
                            <td className="px-6 py-4 min-w-87.5 max-w-125">
                              <div className="flex items-center gap-4 text-xs md:text-sm font-bold text-gray-900">
                                <div className="min-w-0">
                                  <div className="font-bold text-[#008BE3] text-sm line-clamp-2 leading-tight">
                                    {item.name}
                                  </div>
                                  <div className="text-[10px] text-gray-400 font-mono mt-0.5 truncate">
                                    {item.kode}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-xs md:text-sm text-gray-600 font-medium">
                              <span className="inline-flex items-center gap-1.5">
                                <Calendar size={14} className="text-gray-400" />
                                {formatTanggal(item.date)}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-xs md:text-sm whitespace-nowrap">
                              {item.status === "Disetujui" ? (
                                <span className="inline-flex items-center gap-1.5 text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full text-[10px] uppercase tracking-wider font-bold">
                                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                  Disetujui
                                </span>
                              ) : item.status === "Ditolak" ? (
                                <span className="inline-flex items-center gap-1.5 text-red-700 bg-red-50 border border-red-200 px-3 py-1.5 rounded-full text-[10px] uppercase tracking-wider font-bold">
                                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                                  Ditolak
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full text-[10px] uppercase tracking-wider font-bold">
                                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>
                                  {item.status}
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-center sticky right-0 bg-white z-10 border-l border-gray-100 shadow-[-6px_0_15px_-4px_rgba(0,0,0,0.06)] group-hover/row:bg-[#F9FAFC] transition-colors whitespace-nowrap">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedDetailSubmission(item);
                                }}
                                className="bg-white hover:bg-slate-50 text-[#008BE3] border border-[#008BE3]/30 px-3 py-1.5 rounded-md text-xs font-bold transition-colors cursor-pointer"
                              >
                                Detail
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-6 py-8 text-center text-gray-500 font-medium"
                          >
                            Belum ada permohonan sertifikasi.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 font-medium bg-gray-50/50">
                  <div className="min-w-0">
                    Menampilkan{" "}
                    {submissions.length > 0
                      ? (subPage - 1) * itemsPerPage + 1
                      : 0}{" "}
                    - {Math.min(subPage * itemsPerPage, submissions.length)}{" "}
                    dari {submissions.length} permohonan
                  </div>
                  <div className="flex gap-2">
                    <button
                      disabled={subPage === 1}
                      onClick={() => setSubPage((p) => Math.max(1, p - 1))}
                      className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors cursor-pointer"
                    >
                      Sebelumnya
                    </button>
                    <div className="hidden items-center gap-1 sm:flex">
                      {Array.from(
                        { length: totalSubPages },
                        (_, i) => i + 1,
                      ).map((page) => (
                        <button
                          key={page}
                          onClick={() => setSubPage(page)}
                          className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                            subPage === page
                              ? "bg-[#008BE3] text-white border border-[#008BE3]"
                              : "text-slate-700 bg-white border border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                    <button
                      disabled={subPage === totalSubPages}
                      onClick={() =>
                        setSubPage((p) => Math.min(totalSubPages, p + 1))
                      }
                      className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors cursor-pointer"
                    >
                      Selanjutnya
                    </button>
                  </div>
                </div>
              </section>
            </div>
          )}

          {selectedDetailSubmission && (
            <div className="w-full pt-2 animate-in fade-in zoom-in-95 duration-200">
              <div className="max-w-225 mx-auto">
                <div className="mb-4">
                  <button
                    onClick={() => setSelectedDetailSubmission(null)}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-[#008BE3] bg-[#008BE3]/10 hover:bg-[#008BE3]/20 transition-colors cursor-pointer shrink-0 mb-4 mt-0.5 shadow-sm"
                    title="Kembali ke Daftar Pengajuan"
                  >
                    <ArrowLeft size={18} />
                  </button>
                </div>

                <div className="bg-white shadow-sm border border-slate-200 rounded-2xl relative mb-8 text-slate-800 text-sm flex flex-col overflow-hidden">
                  <div className="p-8 md:p-10 border-b border-slate-200 flex flex-col gap-4 bg-slate-50/50">
                    <div className="flex justify-between items-start">
                      <div className="min-w-0">
                        <h1 className="font-serif text-xl font-bold text-slate-900">
                          DETAIL PENGAJUAN
                        </h1>
                        <h2 className="font-serif text-lg font-bold text-slate-800 uppercase">
                          {selectedDetailSubmission.name}
                        </h2>
                      </div>
                      <div className="text-right">
                        <div className="font-serif text-2xl font-bold tracking-tighter text-slate-900">
                          LSP
                        </div>
                        <div className="text-xs text-slate-500 font-sans">
                          Lembaga Sertifikasi Profesi
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                        Status:
                      </span>
                      {selectedDetailSubmission.status === "Disetujui" ? (
                        <span className="inline-flex items-center gap-1.5 text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full text-[10px] uppercase tracking-wider font-bold">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          {selectedDetailSubmission.status}
                        </span>
                      ) : selectedDetailSubmission.status === "Ditolak" ? (
                        <span className="inline-flex items-center gap-1.5 text-red-700 bg-red-50 border border-red-200 px-3 py-1.5 rounded-full text-[10px] uppercase tracking-wider font-bold">
                          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                          {selectedDetailSubmission.status}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full text-[10px] uppercase tracking-wider font-bold">
                          <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
                          {selectedDetailSubmission.status}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-8 md:p-10 space-y-8 flex-1 bg-white">
                    <div className="min-w-0">
                      <h4 className="font-bold text-sm mb-4 uppercase tracking-wider border-b border-slate-200 pb-2 text-[#008BE3]">
                        Data Pribadi & Kontak
                      </h4>
                      <table className="w-full border-collapse border border-slate-200 text-sm rounded-lg overflow-hidden">
                        <tbody className="divide-y divide-slate-200">
                          <tr className="hover:bg-slate-50 transition-colors">
                            <td className="border-r border-slate-200 p-3 bg-slate-50/50 font-semibold w-1/3">
                              Nama Lengkap
                            </td>
                            <td className="p-3 font-bold">
                              {selectedDetailSubmission.namaLengkap || "-"}
                            </td>
                          </tr>
                          <tr className="hover:bg-slate-50 transition-colors">
                            <td className="border-r border-slate-200 p-3 bg-slate-50/50 font-semibold">
                              NIK
                            </td>
                            <td className="p-3">
                              {selectedDetailSubmission.nik || "-"}
                            </td>
                          </tr>
                          <tr className="hover:bg-slate-50 transition-colors">
                            <td className="border-r border-slate-200 p-3 bg-slate-50/50 font-semibold">
                              Tempat, Tanggal Lahir
                            </td>
                            <td className="p-3">
                              {selectedDetailSubmission.tempatLahir
                                ? `${selectedDetailSubmission.tempatLahir}, ${selectedDetailSubmission.tanggalLahir ? formatTanggal(selectedDetailSubmission.tanggalLahir) : "-"}`
                                : "-"}
                            </td>
                          </tr>
                          <tr className="hover:bg-slate-50 transition-colors">
                            <td className="border-r border-slate-200 p-3 bg-slate-50/50 font-semibold">
                              Jenis Kelamin
                            </td>
                            <td className="p-3">
                              {selectedDetailSubmission.jenisKelamin || "-"}
                            </td>
                          </tr>
                          <tr className="hover:bg-slate-50 transition-colors">
                            <td className="border-r border-slate-200 p-3 bg-slate-50/50 font-semibold">
                              Provinsi & Kota
                            </td>
                            <td className="p-3">
                              {/* Menggabungkan kota dan provinsi secara dinamis */}
                              {[
                                selectedDetailSubmission.kota,
                                selectedDetailSubmission.provinsi,
                              ]
                                .filter(Boolean)
                                .join(", ") || "-"}
                            </td>
                          </tr>
                          <tr className="hover:bg-slate-50 transition-colors">
                            <td className="border-r border-slate-200 p-3 bg-slate-50/50 font-semibold">
                              Kontak
                            </td>
                            <td className="p-3">
                              {selectedDetailSubmission.noHp
                                ? `HP: ${selectedDetailSubmission.noHp}`
                                : ""}
                              {selectedDetailSubmission.telepon
                                ? ` | Telp: ${selectedDetailSubmission.telepon}`
                                : ""}
                              {!selectedDetailSubmission.noHp &&
                              !selectedDetailSubmission.telepon
                                ? "-"
                                : ""}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="min-w-0">
                      <h4 className="font-bold text-sm mb-4 uppercase tracking-wider border-b border-slate-200 pb-2 text-[#008BE3]">
                        Data Pekerjaan
                      </h4>
                      <table className="w-full border-collapse border border-slate-200 text-sm rounded-lg overflow-hidden">
                        <tbody className="divide-y divide-slate-200">
                          <tr className="hover:bg-slate-50 transition-colors">
                            <td className="border-r border-slate-200 p-3 bg-slate-50/50 font-semibold w-1/3">
                              Institusi / Perusahaan
                            </td>
                            <td className="p-3 font-bold">
                              {selectedDetailSubmission.institusiPerusahaan ||
                                "-"}
                            </td>
                          </tr>
                          <tr className="hover:bg-slate-50 transition-colors">
                            <td className="border-r border-slate-200 p-3 bg-slate-50/50 font-semibold">
                              Jabatan
                            </td>
                            <td className="p-3">
                              {selectedDetailSubmission.jabatan || "-"}
                            </td>
                          </tr>
                          <tr className="hover:bg-slate-50 transition-colors">
                            <td className="border-r border-slate-200 p-3 bg-slate-50/50 font-semibold">
                              Alamat Institusi
                            </td>
                            <td className="p-3">
                              {selectedDetailSubmission.alamatInstitusi || "-"}
                            </td>
                          </tr>
                          <tr className="hover:bg-slate-50 transition-colors">
                            <td className="border-r border-slate-200 p-3 bg-slate-50/50 font-semibold">
                              Kontak Institusi
                            </td>
                            <td className="p-3">
                              {selectedDetailSubmission.kodePosInstitusi
                                ? `Pos: ${selectedDetailSubmission.kodePosInstitusi}`
                                : ""}
                              {selectedDetailSubmission.faxInstitusi
                                ? ` | Fax: ${selectedDetailSubmission.faxInstitusi}`
                                : ""}
                              {!selectedDetailSubmission.kodePosInstitusi &&
                              !selectedDetailSubmission.faxInstitusi
                                ? "-"
                                : ""}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="min-w-0">
                      <h4 className="font-bold text-sm mb-4 uppercase tracking-wider border-b border-slate-200 pb-2 text-[#008BE3]">
                        Detail Pelaksanaan Ujian
                      </h4>
                      <table className="w-full border-collapse border border-slate-200 text-sm rounded-lg overflow-hidden">
                        <tbody className="divide-y divide-slate-200">
                          <tr className="hover:bg-slate-50 transition-colors">
                            <td className="border-r border-slate-200 p-3 bg-slate-50/50 font-semibold w-1/3">
                              Kode Skema
                            </td>
                            <td className="p-3 font-mono break-all font-semibold text-slate-600">
                              {selectedDetailSubmission.kode}
                            </td>
                          </tr>
                          <tr className="hover:bg-slate-50 transition-colors">
                            <td className="border-r border-slate-200 p-3 bg-slate-50/50 font-semibold">
                              Tanggal Pengajuan
                            </td>
                            <td className="p-3">
                              {formatTanggal(selectedDetailSubmission.date)}
                            </td>
                          </tr>
                          <tr className="hover:bg-slate-50 transition-colors">
                            <td className="border-r border-slate-200 p-3 bg-slate-50/50 font-semibold">
                              TUK
                            </td>
                            <td className="p-3">
                              {selectedDetailSubmission.tipeTuk ||
                                "Mandiri (Online)"}
                            </td>
                          </tr>
                          <tr className="hover:bg-slate-50 transition-colors">
                            <td className="border-r border-slate-200 p-3 bg-slate-50/50 font-semibold">
                              Penyesuaian Wajar
                            </td>
                            <td className="p-3">
                              {selectedDetailSubmission.penyesuaianWajar
                                ? "Ya"
                                : "Tidak"}
                            </td>
                          </tr>
                          <tr className="hover:bg-slate-50 transition-colors">
                            <td className="border-r border-slate-200 p-3 bg-slate-50/50 font-semibold">
                              Berpengalaman
                            </td>
                            <td className="p-3">
                              {selectedDetailSubmission.berpengalaman
                                ? "Ya"
                                : "Belum"}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="min-w-0">
                      <h4 className="font-bold text-sm mb-4 uppercase tracking-wider border-b border-slate-200 pb-2 text-[#008BE3]">
                        Lampiran Dokumen & Persyaratan
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <a
                          href="#"
                          className="p-4 border border-slate-200 rounded-lg flex flex-col justify-between cursor-pointer hover:border-[#008BE3] hover:bg-slate-50 transition-all group shadow-sm"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded bg-[#008BE3]/10 text-[#008BE3] flex items-center justify-center font-bold shrink-0">
                              <BadgeCheck size={20} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-slate-800 mb-1 group-hover:text-[#008BE3] transition-colors">
                                FR.APL.01 Permohonan Sertifikasi
                              </p>
                              <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                                Lengkap
                              </span>
                            </div>
                          </div>
                        </a>
                        <a
                          href="#"
                          className="p-4 border border-slate-200 rounded-lg flex flex-col justify-between cursor-pointer hover:border-[#008BE3] hover:bg-slate-50 transition-all group shadow-sm"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded bg-[#008BE3]/10 text-[#008BE3] flex items-center justify-center font-bold shrink-0">
                              <BadgeCheck size={20} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-slate-800 mb-1 group-hover:text-[#008BE3] transition-colors">
                                FR.APL.02 Asesmen Mandiri
                              </p>
                              <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                                Lengkap
                              </span>
                            </div>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 md:p-8 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 mt-auto">
                    <button
                      onClick={() =>
                        showAlert(`Simulasi Cetak Bukti Pendaftaran`)
                      }
                      className="bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-extrabold text-sm px-4 py-2.5 rounded-lg transition-all shadow-sm cursor-pointer"
                    >
                      Cetak Bukti
                    </button>
                    <button
                      onClick={() => setSelectedDetailSubmission(null)}
                      className="bg-[#008BE3] hover:bg-[#0076C2] text-white font-extrabold text-sm px-5 py-2.5 rounded-lg transition-all shadow-sm cursor-pointer"
                    >
                      Tutup Detail
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: CHOOSE SCHEME */}
      {subView === "choose-scheme" && (
        <div className="w-full space-y-6 pb-12 text-sm text-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setSubView("list")}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-[#008BE3] bg-[#008BE3]/10 hover:bg-[#008BE3]/20 transition-colors cursor-pointer shrink-0 mt-0.5"
                title="Kembali"
              >
                <ArrowLeft size={18} />
              </button>

              <div className="min-w-0">
                <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none mb-1 md:whitespace-nowrap">
                  Daftar Skema Sertifikasi
                </h2>
                <p className="text-xs text-gray-400 font-bold tracking-wider uppercase leading-4 md:whitespace-nowrap">
                  Pilih skema yang tersedia
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 w-full lg:w-auto ml-auto">
              <div className="flex items-center gap-2 bg-gray-50/80 rounded-lg px-3 h-10 w-full sm:w-64 border border-gray-200/50 focus-within:border-[#008BE3]/40 transition-colors">
                <Search className="text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Cari Skema Sertifikasi..."
                  value={searchScheme}
                  onChange={(e) => {
                    setSearchScheme(e.target.value);
                    setSchemePage(1);
                  }}
                  className="bg-transparent border-none focus:ring-0 text-[14px] w-full outline-none text-gray-700 placeholder-gray-400 font-semibold"
                />
              </div>
            </div>
          </div>

          <section className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto relative ">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#0F172A] border-b border-[#0F172A]">
                    <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-left whitespace-nowrap w-16 sticky top-0 z-20 bg-[#0F172A]">
                      No
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-left whitespace-nowrap min-w-87.5 max-w-125 sticky top-0 z-20 bg-[#0F172A]">
                      Skema Sertifikasi
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-left whitespace-nowrap sticky top-0 z-20 bg-[#0F172A]">
                      Kode Skema
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-center whitespace-nowrap w-36 sticky right-0 bg-[#0F172A] shadow-[-6px_0_15px_-4px_rgba(0,0,0,0.06)] z-30 border-l border-white/10 top-0">
                      Ajukan
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100/60 font-medium">
                  {isLoadingSchemes ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center gap-3 text-slate-500">
                          <div className="w-6 h-6 rounded-full border-2 border-[#008BE3] border-t-transparent animate-spin"></div>
                          <span className="font-bold text-sm">Memuat data skema dari server...</span>
                        </div>
                      </td>
                    </tr>
                  ) : paginatedSchemes.length > 0 ? (
                    paginatedSchemes.map((scheme, idx) => {
                      const schemeKey = scheme.kode ?? `scheme-${idx}`;
                      return (
                        <React.Fragment key={schemeKey}>
                          <tr
                            className="hover:bg-[#F9FAFC] transition-colors cursor-pointer group/row"
                            onClick={() => {
                              setExpandedSchemes((prev) =>
                                prev.includes(schemeKey)
                                  ? prev.filter((c) => c !== schemeKey)
                                  : [...prev, schemeKey],
                              );
                            }}
                          >
                            <td className="px-6 py-4 text-xs md:text-sm font-semibold text-slate-700 w-16">
                              <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm font-bold text-xs ${
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
                            <td className="px-6 py-4 flex items-center gap-3 min-w-87.5 max-w-125">
                              <button className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-[#008BE3] transition-colors shrink-0">
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className={`transition-transform duration-200 ${expandedSchemes.includes(schemeKey) ? "rotate-90" : ""}`}
                                >
                                  <path d="M9 18l6-6-6-6" />
                                </svg>
                              </button>
                              <span className="font-bold text-[#008BE3] text-sm line-clamp-2 leading-tight">
                                {scheme.nama}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-gray-400 font-mono text-xs">
                              {scheme.kode}
                            </td>
                            <td className="px-6 py-4 text-center sticky right-0 bg-white z-10 border-l border-gray-100 shadow-[-6px_0_15px_-4px_rgba(0,0,0,0.06)] group-hover/row:bg-[#F9FAFC] transition-colors whitespace-nowrap">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedScheme(scheme);
                                  setSubView("apply-form");
                                  setStep(1);
                                }}
                                className="bg-white hover:bg-sky-50 text-[#008BE3] border border-[#008BE3] px-5 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer"
                              >
                                Ajukan
                              </button>
                            </td>
                          </tr>
                          {expandedSchemes.includes(schemeKey) && (
                            <tr className="bg-slate-50/50 border-t border-b border-gray-100">
                              <td colSpan={4} className="px-6 py-4">
                                <div className="pl-10">
                                  <table className="w-full border-collapse text-xs text-slate-600 font-medium">
                                    <tbody>
                                      {(scheme.unitKompetensi ?? []).map(
                                        (unit, unitIdx) => (
                                          <tr
                                            key={`${unit.kodeUnit}-${unitIdx}`}
                                            className="border-b border-slate-100 last:border-0"
                                          >
                                            <td className="py-2 font-mono text-slate-500 w-32">
                                              {unit.kodeUnit}
                                            </td>
                                            <td className="py-2">
                                              {unit.judulUnit}
                                            </td>
                                          </tr>
                                        ),
                                      )}
                                      {!scheme.unitKompetensi?.length && (
                                        <tr>
                                          <td
                                            colSpan={2}
                                            className="py-2 italic text-slate-400 font-bold"
                                          >
                                            Tidak ada unit untuk skema ini.
                                          </td>
                                        </tr>
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-8 text-center text-gray-400 font-medium"
                      >
                        Tidak ada skema sertifikasi yang ditemukan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-slate-200 flex flex-col sm:flex-row justify-end items-center gap-4 text-xs font-medium text-slate-500 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <button
                  disabled={schemePage === 1}
                  onClick={() => setSchemePage(schemePage - 1)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-50 transition-all font-bold text-slate-700 cursor-pointer"
                >
                  Sebelumnya
                </button>
                {Array.from({ length: totalSchemePages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSchemePage(idx + 1)}
                    className={`px-3.5 py-1.5 rounded-lg transition-all font-bold cursor-pointer ${
                      schemePage === idx + 1
                        ? "bg-[#008BE3] text-white"
                        : "border border-slate-200 hover:bg-slate-100 text-slate-700 bg-white"
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
                <button
                  disabled={schemePage === totalSchemePages}
                  onClick={() => setSchemePage(schemePage + 1)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-50 transition-all font-bold text-slate-700 cursor-pointer"
                >
                  Selanjutnya
                </button>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setSubPage(1);
                    setSchemePage(1);
                  }}
                  className="border border-slate-200 rounded-lg px-2.5 py-1.5 outline-none font-bold text-slate-600 bg-white ml-2 cursor-pointer"
                >
                  <option value={5}>5 / halaman</option>
                  <option value={10}>10 / halaman</option>
                  <option value={20}>20 / halaman</option>
                  <option value={50}>50 / halaman</option>
                </select>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* VIEW 3: MULTI-STEP FORM (APPLY FORM) */}
      {subView === "apply-form" && !activeModalDoc && (
        <div className="w-full space-y-6 pb-12 text-sm text-gray-700">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3">
                <button
                  onClick={() => handleExitRequest("choose-scheme")}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-[#008BE3] bg-[#008BE3]/10 hover:bg-[#008BE3]/20 transition-colors cursor-pointer shrink-0 mt-1 sm:mt-0"
                  title="Kembali ke Daftar Skema"
                >
                  <ArrowLeft size={18} />
                </button>
                <div className="flex flex-col gap-1.5">
                  <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none">
                    {selectedScheme?.nama}
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 font-mono uppercase tracking-wider font-bold leading-none">
                      {selectedScheme?.kode}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 md:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-slate-200 mb-6 pb-2 lg:pb-0 gap-4">
              <div className="flex items-center gap-1 overflow-x-auto pb-px scrollbar-thin">
                {[
                  "Data Pribadi",
                  "Persyaratan Dasar",
                  "Bukti Administratif",
                  "Bukti Kompetensi",
                  "Persyaratan Pendaftaran",
                ].map((tabLabel, idx) => {
                  const tabStep = idx + 1;
                  const isActive = step === tabStep;
                  return (
                    <button
                      key={tabLabel}
                      onClick={() => {
                        if (step === 1 && tabStep > 1) {
                          const newErrors: Step1Errors = {
                            namaLengkap: namaLengkap.trim() === "",
                            tempatLahir: tempatLahir.trim() === "",
                            tanggalLahir: tanggalLahir === "",
                            jenisKelamin: jenisKelamin === "",
                            provinsi: provinsi === "",
                            kota: kota === "",
                            alamat: alamat.trim() === "",
                            nik: nik.trim() === "",
                            kodePos: kodePos.trim() === "",
                            noTelp: noTelp.trim() === "",
                            pendidikanTerakhir: pendidikanTerakhir === "",
                            pekerjaan: pekerjaan === "",
                            institusiPerusahaan:
                              institusiPerusahaan.trim() === "",
                            jabatan: jabatan.trim() === "",
                            emailInstitusi: emailInstitusi.trim() === "",
                            telpInstitusi: telpInstitusi.trim() === "",
                            alamatInstitusi: alamatInstitusi.trim() === "",
                            tuk: tuk === "",
                            metode: metode === "",
                          };
                          setErrors(newErrors);
                          if (
                            !newErrors.namaLengkap &&
                            !newErrors.tempatLahir &&
                            !newErrors.tanggalLahir &&
                            !newErrors.jenisKelamin &&
                            !newErrors.provinsi &&
                            !newErrors.kota &&
                            !newErrors.alamat &&
                            !newErrors.nik &&
                            !newErrors.kodePos &&
                            !newErrors.noTelp &&
                            !newErrors.pendidikanTerakhir &&
                            !newErrors.pekerjaan &&
                            !newErrors.institusiPerusahaan &&
                            !newErrors.jabatan &&
                            !newErrors.emailInstitusi &&
                            !newErrors.telpInstitusi &&
                            !newErrors.alamatInstitusi &&
                            !newErrors.tuk
                          ) {
                            setStep(tabStep);
                            if (window.innerWidth < 1024)
                              window.scrollTo({ top: 0, behavior: "smooth" });
                          }
                        } else if (step === 2 && tabStep > 2) {
                          const reqs = selectedScheme?.persyaratanDasar || [];
                          const valid = reqs.every((req) => {
                            const key =
                              typeof req === "string" ? req : req.namaDokumen;
                            return Boolean(key && eFormData[key]);
                          });
                          if (!valid) setShowStep2Errors(true);
                          else {
                            setShowStep2Errors(false);
                            setStep(tabStep);
                          }
                        } else if (step === 3 && tabStep > 3) {
                          const reqs =
                            selectedScheme?.persyaratanAdministrasi || [];
                          const valid = reqs.every((req) => {
                            const key =
                              typeof req === "string" ? req : req.namaDokumen;
                            return Boolean(key && eFormData[key]);
                          });
                          if (!valid) setShowStep3Errors(true);
                          else {
                            setShowStep3Errors(false);
                            setStep(tabStep);
                          }
                        } else {
                          setStep(tabStep);
                        }
                      }}
                      className={`px-4 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition-all cursor-pointer ${
                        isActive
                          ? "border-[#008BE3] text-[#008BE3] bg-sky-50/40"
                          : "border-transparent text-gray-400 hover:text-slate-800 hover:bg-slate-50/50"
                      }`}
                    >
                      {tabLabel}
                    </button>
                  );
                })}
              </div>
            </div>

            {step === 1 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                    Data Pribadi
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="min-w-0">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      <span className="text-red-500">*</span> Nama Lengkap
                    </label>
                    <input
                      type="text"
                      value={namaLengkap}
                      onChange={(e) => setNamaLengkap(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 outline-none focus:border-[#008BE3] font-semibold text-slate-800"
                    />
                  </div>
                  <div className="min-w-0">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      <span className="text-red-500">*</span> Tempat Lahir
                    </label>
                    <input
                      type="text"
                      value={tempatLahir}
                      onChange={(e) => {
                        setTempatLahir(e.target.value);
                        if (errors.tempatLahir)
                          setErrors({ ...errors, tempatLahir: false });
                      }}
                      className={`w-full px-3 py-2 text-xs rounded-lg border outline-none font-semibold text-slate-800 ${errors.tempatLahir ? "border-red-400 bg-red-50/10 focus:border-red-500" : "border-slate-300 focus:border-[#008BE3]"}`}
                    />
                    {errors.tempatLahir ? (
                      <p className="text-[10px] text-red-500 mt-1 font-bold">
                        Masukkan tempat lahir
                      </p>
                    ) : (
                      <p className="text-[10px] text-slate-400 mt-1 font-medium">
                        Masukkan tempat lahir
                      </p>
                    )}
                  </div>
                  <div className="min-w-0">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      <span className="text-red-500">*</span> Tanggal Lahir
                    </label>
                    <input
                      type="date"
                      value={tanggalLahir}
                      onChange={(e) => {
                        setTanggalLahir(e.target.value);
                        if (errors.tanggalLahir)
                          setErrors({ ...errors, tanggalLahir: false });
                      }}
                      className={`w-full px-3 py-2 text-xs rounded-lg border outline-none bg-white font-semibold text-slate-800 ${errors.tanggalLahir ? "border-red-400 bg-red-50/10 focus:border-red-500" : "border-slate-300 focus:border-[#008BE3]"}`}
                    />
                    {errors.tanggalLahir && (
                      <p className="text-[10px] text-red-500 mt-1 font-bold">
                        Masukkan tanggal lahir
                      </p>
                    )}
                  </div>
                  <div className="min-w-0">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      <span className="text-red-500">*</span> Jenis Kelamin
                    </label>
                    <div
                      className={`flex items-center gap-6 py-2 px-3 rounded-lg border ${errors.jenisKelamin ? "border-red-400 bg-red-50/10" : "border-transparent"}`}
                    >
                      <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-slate-700">
                        <input
                          type="radio"
                          name="jenisKelamin"
                          value="Laki-laki"
                          checked={jenisKelamin === "Laki-laki"}
                          onChange={() => {
                            setJenisKelamin("Laki-laki");
                            if (errors.jenisKelamin)
                              setErrors({ ...errors, jenisKelamin: false });
                          }}
                          className="text-[#008BE3] w-4 h-4 cursor-pointer"
                        />{" "}
                        Laki-laki
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-slate-700">
                        <input
                          type="radio"
                          name="jenisKelamin"
                          value="Perempuan"
                          checked={jenisKelamin === "Perempuan"}
                          onChange={() => {
                            setJenisKelamin("Perempuan");
                            if (errors.jenisKelamin)
                              setErrors({ ...errors, jenisKelamin: false });
                          }}
                          className="text-[#008BE3] w-4 h-4 cursor-pointer"
                        />{" "}
                        Perempuan
                      </label>
                    </div>
                    {errors.jenisKelamin && (
                      <p className="text-[10px] text-red-500 mt-1 font-bold">
                        Pilih jenis kelamin
                      </p>
                    )}
                  </div>
                  <div className="min-w-0">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      <span className="text-red-500">*</span> Provinsi
                    </label>
                    <select
                      value={provinsi}
                      onChange={(e) => {
                        setProvinsi(e.target.value);
                        setKota("");
                        if (errors.provinsi)
                          setErrors({ ...errors, provinsi: false });
                      }}
                      className={`w-full px-3 py-2 text-xs rounded-lg border outline-none font-semibold text-slate-800 ${errors.provinsi ? "border-red-400 bg-red-50/10 focus:border-red-500" : "border-slate-300 focus:border-[#008BE3] bg-white"} cursor-pointer`}
                    >
                      <option value="">Pilih Provinsi</option>
                      {provinsis.map((prov) => (
                        <option key={prov.id} value={prov.id}>
                          {prov.label}
                        </option>
                      ))}
                    </select>
                    {errors.provinsi && (
                      <p className="text-[10px] text-red-500 mt-1 font-bold">
                        Pilih provinsi
                      </p>
                    )}
                  </div>
                  <div className="min-w-0">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      <span className="text-red-500">*</span> Kota / Kabupaten
                    </label>
                    <select
                      value={kota}
                      onChange={(e) => {
                        setKota(e.target.value);
                        if (errors.kota) setErrors({ ...errors, kota: false });
                      }}
                      disabled={!provinsi}
                      className={`w-full px-3 py-2 text-xs rounded-lg border outline-none font-semibold text-slate-800 ${!provinsi ? "bg-slate-100 cursor-not-allowed" : "bg-white cursor-pointer"} ${errors.kota ? "border-red-400 bg-red-50/10 focus:border-red-500" : "border-slate-300 focus:border-[#008BE3]"}`}
                    >
                      <option value="">Pilih Kota/Kabupaten</option>
                      {kotas
                        .filter((k) => k.provId === provinsi)
                        .map((k) => (
                          <option key={k.id} value={k.id}>
                            {k.label}
                          </option>
                        ))}
                    </select>
                    {errors.kota && (
                      <p className="text-[10px] text-red-500 mt-1 font-bold">
                        Pilih kota/kabupaten
                      </p>
                    )}
                  </div>
                </div>

                <div className="col-span-full">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    <span className="text-red-500">*</span> Alamat Lengkap Rumah
                    (Jalan, RT/RW, Kel/Desa, Kec)
                  </label>
                  <input
                    type="text"
                    value={alamat}
                    onChange={(e) => {
                      setAlamat(e.target.value);
                      if (errors.alamat)
                        setErrors({ ...errors, alamat: false });
                    }}
                    placeholder="Masukkan alamat lengkap"
                    className={`w-full px-3 py-2 text-xs rounded-lg border outline-none font-semibold text-slate-800 ${
                      errors.alamat
                        ? "border-red-400 bg-red-50/10 focus:border-red-500"
                        : "border-slate-300 focus:border-[#008BE3] bg-white"
                    }`}
                  />
                  {errors.alamat && (
                    <p className="text-[10px] text-red-500 mt-1 font-bold">
                      Masukkan alamat lengkap rumah
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="min-w-0">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      <span className="text-red-500">*</span> NIK
                    </label>
                    <input
                      type="text"
                      value={nik}
                      onChange={(e) => {
                        setNik(e.target.value.replace(/[^0-9]/g, ""));
                        if (errors.nik) setErrors({ ...errors, nik: false });
                      }}
                      className={`w-full px-3 py-2 text-xs rounded-lg border outline-none font-semibold text-slate-800 ${errors.nik ? "border-red-400 bg-red-50/10 focus:border-red-500" : "border-slate-300 focus:border-[#008BE3]"}`}
                    />
                    {errors.nik ? (
                      <p className="text-[10px] text-red-500 mt-1 font-bold">
                        Nik tidak boleh kosong
                      </p>
                    ) : (
                      <p className="text-[10px] text-slate-400 mt-1 font-medium">
                        Masukkan NIK
                      </p>
                    )}
                  </div>
                  <div className="min-w-0">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      <span className="text-red-500">*</span> Kewarganegaraan
                    </label>
                    <select
                      value={kewarganegaraan}
                      onChange={(e) => setKewarganegaraan(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 outline-none focus:border-[#008BE3] bg-white font-semibold text-slate-800 cursor-pointer"
                    >
                      <option value="WNI">WNI</option>
                      <option value="WNA">WNA</option>
                    </select>
                  </div>
                  <div className="min-w-0">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      <span className="text-red-500">*</span> Kode POS
                    </label>
                    <input
                      type="text"
                      value={kodePos}
                      onChange={(e) => {
                        setKodePos(e.target.value.replace(/[^0-9]/g, ""));
                        if (errors.kodePos)
                          setErrors({ ...errors, kodePos: false });
                      }}
                      className={`w-full px-3 py-2 text-xs rounded-lg border outline-none font-semibold text-slate-800 ${errors.kodePos ? "border-red-400 bg-red-50/10 focus:border-red-500" : "border-slate-300 focus:border-[#008BE3]"}`}
                    />
                    {errors.kodePos ? (
                      <p className="text-[10px] text-red-500 mt-1 font-bold">
                        Masukkan kode pos
                      </p>
                    ) : (
                      <p className="text-[10px] text-slate-400 mt-1 font-medium">
                        Masukkan kode pos
                      </p>
                    )}
                  </div>
                  <div className="min-w-0">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      <span className="text-red-500">*</span> No HP / Telepon
                    </label>
                    <input
                      type="text"
                      value={noTelp}
                      onChange={(e) => {
                        setNoTelp(e.target.value.replace(/[^0-9]/g, ""));
                        if (errors.noTelp)
                          setErrors({ ...errors, noTelp: false });
                      }}
                      className={`w-full px-3 py-2 text-xs rounded-lg border outline-none font-semibold text-slate-800 ${errors.noTelp ? "border-red-400 bg-red-50/10 focus:border-red-500" : "border-slate-300 focus:border-[#008BE3] bg-white"}`}
                    />
                    {errors.noTelp && (
                      <p className="text-[10px] text-red-500 mt-1 font-bold">
                        Wajib diisi
                      </p>
                    )}
                  </div>
                </div>

                <div className="relative flex py-2 items-center">
                  <div className="grow border-t border-slate-200"></div>
                  <span className="shrink mx-4 text-xs font-black text-slate-800 uppercase tracking-wider">
                    Detail Pendidikan
                  </span>
                  <div className="grow border-t border-slate-200"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="min-w-0">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      <span className="text-red-500">*</span> Pendidikan
                      Terakhir
                    </label>
                    <select
                      value={pendidikanTerakhir}
                      onChange={(e) => {
                        setPendidikanTerakhir(e.target.value);
                        if (errors.pendidikanTerakhir)
                          setErrors({ ...errors, pendidikanTerakhir: false });
                      }}
                      className={`w-full px-3 py-2 text-xs rounded-lg border outline-none font-semibold text-slate-800 cursor-pointer ${errors.pendidikanTerakhir ? "border-red-400 bg-red-50/10 focus:border-red-500" : "border-slate-300 focus:border-[#008BE3] bg-white"}`}
                    >
                      <option value="" disabled>
                        Pilih Pendidikan
                      </option>
                      {pendidikans.map((pend) => (
                        <option key={pend.id} value={pend.label}>
                          {pend.label}
                        </option>
                      ))}
                    </select>
                    {errors.pendidikanTerakhir && (
                      <p className="text-[10px] text-red-500 mt-1 font-bold">
                        Pilih pendidikan
                      </p>
                    )}
                  </div>
                </div>

                <div className="relative flex py-2 items-center">
                  <div className="grow border-t border-slate-200"></div>
                  <span className="shrink mx-4 text-xs font-black text-slate-800 uppercase tracking-wider">
                    Detail Pekerjaan
                  </span>
                  <div className="grow border-t border-slate-200"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="min-w-0">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      <span className="text-red-500">*</span> Pekerjaan
                    </label>
                    <select
                      value={pekerjaan}
                      onChange={(e) => {
                        setPekerjaan(e.target.value);
                        if (errors.pekerjaan)
                          setErrors({ ...errors, pekerjaan: false });
                      }}
                      className={`w-full px-3 py-2 text-xs rounded-lg border outline-none font-semibold text-slate-800 cursor-pointer ${errors.pekerjaan ? "border-red-400 bg-red-50/10 focus:border-red-500" : "border-slate-300 focus:border-[#008BE3] bg-white"}`}
                    >
                      <option value="" disabled>
                        Pilih Pekerjaan
                      </option>
                      {pekerjaans.map((pek) => (
                        <option key={pek.id} value={pek.label}>
                          {pek.label}
                        </option>
                      ))}
                    </select>
                    {errors.pekerjaan && (
                      <p className="text-[10px] text-red-500 mt-1 font-bold">
                        Pilih pekerjaan
                      </p>
                    )}
                  </div>
                  <div className="min-w-0">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      <span className="text-red-500">*</span>{" "}
                      Institusi/Perusahaan
                    </label>
                    <select
                      value={institusiPerusahaan}
                      onChange={(e) => {
                        setInstitusiPerusahaan(e.target.value);
                        if (errors.institusiPerusahaan)
                          setErrors({ ...errors, institusiPerusahaan: false });
                      }}
                      className={`w-full px-3 py-2 text-xs rounded-lg border outline-none font-semibold text-slate-800 cursor-pointer ${errors.institusiPerusahaan ? "border-red-400 bg-red-50/10 focus:border-red-500" : "border-slate-300 focus:border-[#008BE3] bg-white"}`}
                    >
                      <option value="" disabled>
                        Pilih Institusi/Perusahaan
                      </option>
                      {instansis.map((inst) => (
                        <option key={inst.id} value={inst.label}>
                          {inst.label}
                        </option>
                      ))}
                    </select>
                    {errors.institusiPerusahaan && (
                      <p className="text-[10px] text-red-500 mt-1 font-bold">
                        Pilih institusi
                      </p>
                    )}
                  </div> 
                  <div className="min-w-0">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      <span className="text-red-500">*</span> Jabatan
                    </label>
                    <input
                      type="text"
                      value={jabatan}
                      onChange={(e) => {
                        setJabatan(e.target.value);
                        if (errors.jabatan)
                          setErrors({ ...errors, jabatan: false });
                      }}
                      className={`w-full px-3 py-2 text-xs rounded-lg border outline-none font-semibold text-slate-800 ${errors.jabatan ? "border-red-400 bg-red-50/10 focus:border-red-500" : "border-slate-300 focus:border-[#008BE3] bg-white"}`}
                    />
                    {errors.jabatan && (
                      <p className="text-[10px] text-red-500 mt-1 font-bold">
                        Wajib diisi
                      </p>
                    )}
                  </div>
                  <div className="min-w-0">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      <span className="text-red-500">*</span> Email
                      Institusi/Perusahaan
                    </label>
                    <input
                      type="email"
                      value={emailInstitusi}
                      onChange={(e) => {
                        setEmailInstitusi(e.target.value);
                        if (errors.emailInstitusi)
                          setErrors({ ...errors, emailInstitusi: false });
                      }}
                      className={`w-full px-3 py-2 text-xs rounded-lg border outline-none font-semibold text-slate-800 ${errors.emailInstitusi ? "border-red-400 bg-red-50/10 focus:border-red-500" : "border-slate-300 focus:border-[#008BE3] bg-white"}`}
                    />
                    {errors.emailInstitusi && (
                      <p className="text-[10px] text-red-500 mt-1 font-bold">
                        Wajib diisi
                      </p>
                    )}
                  </div>
                  <div className="min-w-0">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Kode Pos Institusi
                    </label>
                    <input
                      type="text"
                      value={kodePosInstitusi}
                      onChange={(e) =>
                        setKodePosInstitusi(
                          e.target.value.replace(/[^0-9]/g, ""),
                        )
                      }
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 outline-none focus:border-[#008BE3] bg-white font-semibold text-slate-800"
                    />
                  </div>
                  <div className="min-w-0">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      <span className="text-red-500">*</span> No Telepon
                      Institusi
                    </label>
                    <input
                      type="text"
                      value={telpInstitusi}
                      onChange={(e) => {
                        setTelpInstitusi(e.target.value.replace(/[^0-9]/g, ""));
                        if (errors.telpInstitusi)
                          setErrors({ ...errors, telpInstitusi: false });
                      }}
                      className={`w-full px-3 py-2 text-xs rounded-lg border outline-none font-semibold text-slate-800 ${errors.telpInstitusi ? "border-red-400 bg-red-50/10 focus:border-red-500" : "border-slate-300 focus:border-[#008BE3] bg-white"}`}
                    />
                    {errors.telpInstitusi && (
                      <p className="text-[10px] text-red-500 mt-1 font-bold">
                        Wajib diisi
                      </p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      <span className="text-red-500">*</span> Alamat
                      Institusi/Perusahaan
                    </label>
                    <textarea
                      value={alamatInstitusi}
                      onChange={(e) => {
                        setAlamatInstitusi(e.target.value);
                        if (errors.alamatInstitusi)
                          setErrors({ ...errors, alamatInstitusi: false });
                      }}
                      className={`w-full px-3 py-2 text-xs rounded-lg border outline-none font-semibold text-slate-800 h-9.5 resize-none ${errors.alamatInstitusi ? "border-red-400 bg-red-50/10 focus:border-red-500" : "border-slate-300 focus:border-[#008BE3] bg-white"}`}
                    />
                    {errors.alamatInstitusi && (
                      <p className="text-[10px] text-red-500 mt-1 font-bold">
                        Wajib diisi
                      </p>
                    )}
                  </div>
                  <div className="min-w-0">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Fax Institusi/Perusahaan
                    </label>
                    <input
                      type="text"
                      value={faxInstitusi}
                      onChange={(e) =>
                        setFaxInstitusi(e.target.value.replace(/[^0-9]/g, ""))
                      }
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 outline-none focus:border-[#008BE3] bg-white font-semibold text-slate-800"
                    />
                  </div>
                </div>

                <div className="relative flex py-2 items-center">
                  <div className="grow border-t border-slate-200"></div>
                  <span className="shrink mx-4 text-xs font-black text-slate-800 uppercase tracking-wider">
                    Lainnya
                  </span>
                  <div className="grow border-t border-slate-200"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Dropdown TUK */}
                  <div className="min-w-0">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      <span className="text-red-500">*</span> Klasifikasi TUK
                    </label>
                    <select
                      value={tuk}
                      onChange={(e) => {
                        setTuk(e.target.value);
                        if (errors.tuk) setErrors({ ...errors, tuk: false });
                      }}
                      className={`w-full px-3 py-2 text-xs rounded-lg border outline-none font-semibold text-slate-800 cursor-pointer ${errors.tuk ? "border-red-400 bg-red-50/10 focus:border-red-500" : "border-slate-300 focus:border-[#008BE3] bg-white"}`}
                    >
                      <option value="" disabled>
                        Pilih TUK
                      </option>
                      <option value="Sewaktu">Sewaktu</option>
                      <option value="Mandiri">Mandiri</option>
                      <option value="Tempat Kerja">Tempat Kerja</option>
                    </select>
                    {errors.tuk && (
                      <p className="text-[10px] text-red-500 mt-1 font-bold">
                        Pilih klasifikasi TUK
                      </p>
                    )}
                  </div>

                  {/* Dropdown METODE */}
                  <div className="min-w-0">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      <span className="text-red-500">*</span> Metode Ujian
                    </label>
                    <select
                      value={metode}
                      onChange={(e) => {
                        setMetode(e.target.value);
                        if (errors.metode)
                          setErrors({ ...errors, metode: false });
                      }}
                      className={`w-full px-3 py-2 text-xs rounded-lg border outline-none font-semibold text-slate-800 cursor-pointer ${errors.metode ? "border-red-400 bg-red-50/10 focus:border-red-500" : "border-slate-300 focus:border-[#008BE3] bg-white"}`}
                    >
                      <option value="" disabled>
                        Pilih Metode
                      </option>
                      <option value="Offline">Offline (Tatap Muka)</option>
                      <option value="Online">Online (Daring)</option>
                    </select>
                    {errors.metode && (
                      <p className="text-[10px] text-red-500 mt-1 font-bold">
                        Pilih metode ujian
                      </p>
                    )}
                  </div>

                  <div className="col-span-full">
                    <label className="flex items-start gap-3 cursor-pointer p-4 border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                      <input
                        type="checkbox"
                        checked={penyesuaianWajar}
                        onChange={(e) => setPenyesuaianWajar(e.target.checked)}
                        className="mt-0.5 w-4 h-4 text-[#008BE3] rounded border-slate-300 cursor-pointer"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800">
                          Memerlukan Penyesuaian Wajar (FR.AK.07)
                        </p>
                        <p className="text-[11px] text-slate-500 mt-1">
                          Centang jika Anda memiliki kondisi tertentu yang
                          memerlukan penyesuaian saat asesmen.
                        </p>
                      </div>
                    </label>
                  </div>

                  <div className="col-span-full flex flex-col gap-2">
                    <label className="block text-xs font-bold text-slate-700">
                      Berpengalaman pada Skema yang Diajukan
                    </label>
                    <button
                      type="button"
                      onClick={() => setBerpengalaman(!berpengalaman)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${berpengalaman ? "bg-[#005C46]" : "bg-slate-200"}`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${berpengalaman ? "translate-x-5" : "translate-x-0"}`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <FormDocumentTable
                onAction={(doc: ActiveModalDoc) => {
                  setActiveModalDoc(doc);
                  if (doc.isEForm && doc.name)
                    setTempEFormData(
                      (eFormData[doc.name] as
                        | Record<string, unknown>
                        | undefined) ?? ({} as Record<string, unknown>),
                    );
                }}
                title="Persyaratan Dasar"
                infoText="File Persyaratan Dasar akan ditampilkan pada Form APL - 01"
                documents={(selectedScheme?.persyaratanDasar || []).map(
                  (req) => ({
                    required: true,
                    name: typeof req === "string" ? req : req.namaDokumen,
                    description:
                      typeof req === "string"
                        ? ""
                        : "deskripsi" in req
                          ? req.deskripsi
                          : "",
                    type: "File Upload",
                  }),
                )}
                eFormData={eFormData}
                showErrors={showStep2Errors}
              />
            )}

            {step === 3 && (
              <FormDocumentTable
                onAction={(doc: ActiveModalDoc) => {
                  setActiveModalDoc(doc);
                  if (doc.isEForm && doc.name)
                    setTempEFormData(
                      (eFormData[doc.name] as
                        | Record<string, unknown>
                        | undefined) || ({} as Record<string, unknown>),
                    );
                }}
                title="Bukti Administratif"
                infoText="File Bukti Administratif akan ditampilkan pada Form APL - 01"
                documents={(selectedScheme?.persyaratanAdministrasi || []).map(
                  (req) => ({
                    required: true,
                    name: typeof req === "string" ? req : req.namaDokumen,
                    type: "File Upload",
                  }),
                )}
                eFormData={eFormData}
                showErrors={showStep3Errors}
              />
            )}

            {step === 4 && (
              <FormKompetensiTable
                onAction={(doc: ActiveModalDoc) => {
                  setActiveModalDoc(doc);
                  if (doc.isEForm && doc.name)
                    setTempEFormData(
                      (eFormData[doc.name] as
                        | Record<string, unknown>
                        | undefined) || ({} as Record<string, unknown>),
                    );
                }}
                eFormData={eFormData}
                title="Bukti Kompetensi"
                infoText="File Bukti Kompetensi akan ditampilkan pada Form APL - 02"
                kompetensiList={(selectedScheme?.unitKompetensi || []).flatMap(
                  (unit: UnitKompetensiItem, uIdx: number) =>
                    (unit.elemen || []).map(
                      (el: ElemenKompetensiItem, eIdx: number) => ({
                        id: `u${uIdx}e${eIdx}`,
                        unitTitle: unit.judulUnit || "",
                        unitCode: unit.kodeUnit || "",
                        elemen: el.namaElemen || "",
                        kuk: el.kriteriaUnjukKerja || [],
                        idx: eIdx + 1,
                      }),
                    ),
                )}
              />
            )}

            {step === 5 && (
              <div className="space-y-4">
                <FormDocumentTable
                  onAction={(doc: ActiveModalDoc) => {
                    setActiveModalDoc(doc);
                    if (doc.isEForm && doc.name)
                      setTempEFormData(
                        (eFormData[doc.name] as
                          | Record<string, unknown>
                          | undefined) || ({} as Record<string, unknown>),
                      );
                  }}
                  title="Persyaratan Pendaftaran"
                  infoText="Lengkapi formulir permohonan sertifikasi mandiri di bawah ini"
                  documents={[
                    {
                      required: true,
                      name: "01. FR.APL.01 Permohonan Sertifikasi",
                      type: "E-Form",
                      isEForm: true,
                    },
                    {
                      required: true,
                      name: "02. FR.APL.02 Asesmen Mandiri",
                      type: "E-Form",
                      isEForm: true,
                    },
                  ]}
                  eFormData={eFormData}
                />

                {(!eFormData["01. FR.APL.01 Permohonan Sertifikasi"] ||
                  !eFormData["02. FR.APL.02 Asesmen Mandiri"]) && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex gap-3 text-amber-800 text-xs shadow-sm">
                    <AlertTriangle
                      size={16}
                      className="shrink-0 text-amber-500 mt-0.5"
                    />
                    <div className="min-w-0">
                      <span className="font-bold block mb-1">Perhatian</span>
                      Anda harus mengisi dan menyimpan (
                      <span className="font-semibold text-amber-900">
                        Simpan Data
                      </span>
                      ) kedua E-Form di atas sebelum dapat men-submit pengajuan
                      skema ini.
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="mt-6 flex justify-end border-t border-slate-200 pt-4">
              <button
                onClick={handleNext}
                disabled={
                  step === 5 &&
                  (!eFormData["01. FR.APL.01 Permohonan Sertifikasi"] ||
                    !eFormData["02. FR.APL.02 Asesmen Mandiri"])
                }
                className={`px-5 py-2.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs w-full justify-center sm:w-auto cursor-pointer ${
                  step === 5 &&
                  (!eFormData["01. FR.APL.01 Permohonan Sertifikasi"] ||
                    !eFormData["02. FR.APL.02 Asesmen Mandiri"])
                    ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                    : "bg-[#008BE3] hover:bg-[#0076C2] text-white"
                }`}
              >
                {step === 5 ? "Ajukan" : "Selanjutnya"}
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: E-FORM MODAL */}
      {activeModalDoc?.isEForm && (
        <div className="min-h-screen bg-slate-100 p-4 md:p-8 pb-24 w-full z-50">
          <div className="max-w-250 mx-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="mb-4">
              <button
                onClick={() => setActiveModalDoc(null)}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-[#008BE3] bg-[#008BE3]/10 hover:bg-[#008BE3]/20 transition-colors cursor-pointer shrink-0 mb-4 mt-0.5"
                title="Kembali ke Pengajuan Skema"
              >
                <ArrowLeft size={18} />
              </button>
            </div>

            <div className="max-w-250 mx-auto bg-white shadow-xl p-8 md:p-12 min-h-200 space-y-8 relative mb-0 text-slate-800 text-sm rounded-t-lg">
              {activeModalDoc?.name?.includes("APL.01") ? (
                <EFormApl01
                  formData={{
                    namaLengkap,
                    tempatLahir,
                    tanggalLahir,
                    jenisKelamin,
                    alamat: alamatWilayah,
                    nik,
                    pendidikanTerakhir,
                    institusiPerusahaan,
                    jabatan,
                    skema: selectedScheme?.nama || "",
                    nomorSkema: selectedScheme?.kode || "",
                    schemeDetail: currentSchemeDetail,
                    signature: user?.avatar,
                    readOnly: activeModalDoc?.isPreview,
                    ...(tempEFormData || {}),
                  }}
                  onChange={(val) => setTempEFormData(val)}
                />
              ) : activeModalDoc?.name?.includes("APL.02") ? (
                <EFormApl02
                  allData={eFormData as Record<string, File | string>}
                  formData={{
                    namaLengkap,
                    skema: selectedScheme?.nama || "",
                    nomorSkema: selectedScheme?.kode || "",
                    schemeDetail: currentSchemeDetail,
                    signature: user?.avatar,
                    readOnly: activeModalDoc?.isPreview,
                    ...(tempEFormData || {}),
                  }}
                  onChange={(val) => setTempEFormData(val)}
                />
              ) : (
                <>
                  <div className="bg-sky-50 border border-sky-100 text-sky-800 text-xs p-3 rounded-lg mb-4 font-medium">
                    Silakan isi form elektronik ini dengan data yang benar.
                  </div>
                  <div className="min-w-0">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Keterangan <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      className="w-full text-xs p-3 border border-slate-200 rounded-lg outline-none focus:border-[#008BE3] min-h-25"
                      value={
                        (eFormData[activeModalDoc?.name ?? ""] as string) || ""
                      }
                      onChange={(e) =>
                        setEFormData({
                          ...eFormData,
                          [activeModalDoc?.name ?? ""]: e.target.value,
                        })
                      }
                    ></textarea>
                  </div>
                </>
              )}
            </div>

            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 shadow-xl max-w-250 mx-auto rounded-b-lg mb-8">
              <button
                onClick={() => {
                  setActiveModalDoc(null);
                  setTempFiles([]);
                }}
                className="px-4 py-2 bg-white text-slate-700 border border-slate-300 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors cursor-pointer"
              >
                {activeModalDoc?.isPreview ? "Tutup" : "Batal"}
              </button>
              {!activeModalDoc?.isPreview && (
                <button
                  onClick={() => {
                    if (activeModalDoc?.name?.includes("APL.01")) {
                      if (!tempEFormData.tujuan) {
                        showAlert("Harap isi Tujuan Asesmen");
                        window.dispatchEvent(
                          new CustomEvent("scroll-to-apl01-error"),
                        );
                        return;
                      }
                    } else if (activeModalDoc?.name?.includes("APL.02")) {
                      let firstUnfilled: string | null = null;
                      const elements: string[] =
                        selectedScheme?.unitKompetensi?.flatMap(
                          (u: UnitKompetensiItem, uIdx: number) =>
                            (u.elemen || []).map(
                              (e: ElemenKompetensiItem, eIdx: number) => {
                                const key = `u${uIdx}e${eIdx}`;
                                if (
                                  !(
                                    tempEFormData.kompetensi as Record<
                                      string,
                                      unknown
                                    >
                                  )?.[key] &&
                                  !firstUnfilled
                                ) {
                                  firstUnfilled = key;
                                }
                                return key;
                              },
                            ),
                        ) || [];
                      const isAllChecked: boolean = elements.every(
                        (k: string) =>
                          (
                            tempEFormData.kompetensi as Record<string, unknown>
                          )?.[k],
                      );
                      if (!isAllChecked) {
                        showAlert(
                          "Harap beri tanda K atau BK pada seluruh kriteria!",
                        );
                        if (firstUnfilled) {
                          window.dispatchEvent(
                            new CustomEvent("scroll-to-unfilled", {
                              detail: firstUnfilled,
                            }),
                          );
                        }
                        return;
                      }
                    }
                    const key = String(activeModalDoc?.name ?? "");
                    setEFormData({ ...eFormData, [key]: tempEFormData });
                    showAlert("Data berhasil disimpan!");
                    setActiveModalDoc(null);
                    setTempFiles([]);
                  }}
                  className="px-5 py-2 bg-[#008BE3] text-white rounded-lg text-sm font-bold hover:bg-[#0076C2] transition-colors shadow-xs cursor-pointer"
                >
                  Simpan Data
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 5: DOCUMENT / UPLOAD MODAL */}
      {activeModalDoc && !activeModalDoc?.isEForm && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-sm">
                {activeModalDoc?.isPreview
                  ? "Pratinjau Dokumen: "
                  : "Lampirkan File: "}
                {(activeModalDoc?.name as ReactNode) ||
                  (activeModalDoc?.unit as ReactNode)}
              </h3>
              <button
                onClick={() => {
                  setActiveModalDoc(null);
                  setTempFiles([]);
                }}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              {activeModalDoc?.isPreview ? (
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="w-full rounded-lg overflow-hidden border border-slate-200 shadow-sm bg-slate-50 relative aspect-4/3 flex items-center justify-center">
                    <div className="text-center p-6 opacity-60">
                      <FileText
                        size={48}
                        className="mx-auto text-slate-400 mb-3"
                      />
                      <p className="font-bold text-slate-500">
                        Pratinjau Dokumen
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {activeModalDoc?.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 justify-center mt-2 w-full">
                    <button
                      onClick={() => showAlert("Mengunduh dokumen...")}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 font-bold rounded-lg text-sm hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
                    >
                      <Download size={16} /> Unduh
                    </button>
                    <button
                      onClick={() => {
                        const newEFormData = { ...eFormData };
                        if (typeof activeModalDoc?.name === "string") {
                          delete newEFormData[activeModalDoc?.name];
                        }
                        setEFormData(newEFormData);
                        setActiveModalDoc(null);
                        setTempFiles([]);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-500 font-bold rounded-lg text-sm hover:bg-red-50 transition-colors shadow-xs cursor-pointer"
                    >
                      <Trash2 size={16} /> Hapus File
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {activeModalDoc?.isBuktiKompetensi && (
                    <div className="mb-4">
                      <p className="text-sm font-bold text-slate-800 mb-2">
                        Pilih dari Dokumen Persyaratan Dasar:
                      </p>
                      <select
                        className="w-full text-sm border border-slate-300 rounded-lg p-2.5 bg-white text-slate-700 cursor-pointer"
                        onChange={(e) => {
                          if (e.target.value) {
                            const docName = e.target.value;
                            const files = (eFormData[docName] as File[]) || [];
                            setTempFiles([
                              ...tempFiles,
                              ...(Array.isArray(files) ? files : []),
                            ]);
                            e.target.value = "";
                          }
                        }}
                      >
                        <option value="">-- Pilih Dokumen --</option>
                        {(
                          [
                            ...(selectedScheme?.persyaratanDasar || []).map(
                              (req) =>
                                typeof req === "string" ? req : req.namaDokumen,
                            ),
                            ...(
                              selectedScheme?.persyaratanAdministrasi || []
                            ).map((req) =>
                              typeof req === "string" ? req : req.namaDokumen,
                            ),
                          ].filter(Boolean) as string[]
                        )
                          .filter(
                            (docName: string) =>
                              (eFormData[docName] as File[]) &&
                              (eFormData[docName] as File[]).length > 0,
                          )
                          .map((docName: string, idx: number) => (
                            <option key={idx} value={docName}>
                              {docName}
                            </option>
                          ))}
                      </select>
                      <div className="flex items-center gap-3 my-4">
                        <div className="h-px bg-slate-200 flex-1"></div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                          Atau
                        </span>
                        <div className="h-px bg-slate-200 flex-1"></div>
                      </div>
                    </div>
                  )}
                  <label className="relative bg-slate-50 border border-slate-200 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-100 transition-colors">
                    <Upload size={32} className="text-[#008BE3] mb-3" />
                    <p className="text-sm font-bold text-slate-800 mb-1">
                      Klik atau seret file ke sini
                    </p>
                    <p className="text-xs text-slate-500 font-medium">
                      Mendukung file PDF, JPG, PNG (Maks 5MB)
                    </p>
                    <input
                      type="file"
                      multiple
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          const newFiles = Array.from(e.target.files);
                          setTempFiles([...tempFiles, ...newFiles]);
                        }
                      }}
                    />
                  </label>
                  {tempFiles.length > 0 && (
                    <div className="mt-4 space-y-2 max-h-40 overflow-y-auto pr-2">
                      {tempFiles.map((file, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold">
                            <CheckCircle
                              size={16}
                              className="text-emerald-600 shrink-0"
                            />
                            <span className="truncate max-w-50 sm:max-w-xs">
                              {file.name || "Telah diunggah"}
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              const newFiles = tempFiles.filter(
                                (_, i) => i !== idx,
                              );
                              setTempFiles(newFiles);
                            }}
                            className="p-1.5 text-red-500 hover:bg-red-100 rounded-md transition-colors cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 rounded-b-xl">
              <button
                onClick={() => {
                  setActiveModalDoc(null);
                  setTempFiles([]);
                }}
                className="px-4 py-2 bg-white text-slate-700 border border-slate-300 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors cursor-pointer"
              >
                {activeModalDoc?.isPreview ? "Tutup" : "Batal"}
              </button>
              {!activeModalDoc?.isPreview && (
                <button
                  onClick={() => {
                    if (tempFiles.length === 0) {
                      showAlert("Harap pilih file terlebih dahulu.");
                      return;
                    }
                    if (typeof activeModalDoc?.name === "string") {
                      setEFormData({
                        ...eFormData,
                        [activeModalDoc.name]: tempFiles,
                      });
                      showAlert("Data berhasil disimpan!");
                      setActiveModalDoc(null);
                      setTempFiles([]);
                    }
                  }}
                  className="px-4 py-2 bg-[#008BE3] text-white rounded-lg text-sm font-bold hover:bg-[#0076C2] transition-colors cursor-pointer"
                >
                  Simpan File
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 6: EXIT WARNING MODAL */}
      {showExitWarning && (
        <div className="fixed inset-0 z-200 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-black text-slate-800 text-lg">Peringatan</h3>
              <button
                onClick={() => setShowExitWarning(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-5 flex flex-col items-center justify-center text-center bg-white">
              <AlertTriangle size={48} className="text-orange-500 mb-4" />
              <p className="text-slate-600 font-medium">
                Apakah Anda yakin ingin kembali? Draf pengajuan skema Anda akan
                hilang dan tidak dapat dikembalikan.
              </p>
            </div>
            <div className="p-5 border-t border-slate-100 flex justify-end gap-3 bg-gray-50">
              <button
                onClick={() => setShowExitWarning(false)}
                className="px-4 py-2 font-bold text-sm text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  setShowExitWarning(false);
                  if (exitDestination) setSubView(exitDestination);
                }}
                className="px-4 py-2 font-bold text-sm text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                Ya, Kembali
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
