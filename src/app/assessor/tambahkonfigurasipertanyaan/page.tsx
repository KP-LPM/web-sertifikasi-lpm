import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Trash2,
  Plus,
  Check,
  ChevronRight,
  ChevronLeft,
  CheckSquare,
  ListTodo,
  MessageSquare,
  Send,
  Save,
  AlertCircle,
  Settings,
  CheckCircle2,
  ShieldCheck,
  FileSpreadsheet,
} from "lucide-react";
import { useAppContext } from "@/context/context";
import {
  PersonItem,
  ConfigurationMetadata,
  Step1Question,
  Step2BlokA,
  Step2BlokB,
  Step3LingkupPenyajian,
  Step3SubPertanyaan,
  Step4Question,
  WizardFormState,
} from "@/types/types";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
const Select = dynamic(() => import("react-select"), { ssr: false });
// Options for Dropdowns
const skemaOptions = [
  {
    value: "pembukuan",
    label: "005/SKM/LSP-KJN/II/2023 - Pembukuan & Akuntansi",
  },
  {
    value: "teknisi_jaringan",
    label: "008/SKM/LSP-KJN/IV/2023 - Teknisi Muda Jaringan",
  },
  {
    value: "network_admin",
    label: "012/SKM/LSP-KJN/VI/2023 - Network Administrator",
  },
  {
    value: "pemrograman_web",
    label: "015/SKM/LSP-KJN/VIII/2023 - Pemrograman Web Specialist",
  },
];

const assessorOptions = [
  {
    value: "aditya_rahman",
    label: "Aditya Rahman Syach, M.Kom (Asesor Utama)",
  },
  { value: "made_jaya", label: "I Made Jaya Artana, S.T., M.T. (Asesor)" },
  {
    value: "budi_santoso",
    label: "Drs. Budi Santoso, M.Ak (Asesor Spesialis)",
  },
];

const availableKUKOptions = [
  "M.692000.001.01 E1/KUK 1.1",
  "M.692000.001.01 E1/KUK 1.2",
  "M.692000.001.01 E1/KUK 1.3",
  "M.692000.002.01 E2/KUK 2.1",
  "M.692000.002.01 E2/KUK 2.2",
  "J.611000.001.01 E1/KUK 1.1",
  "J.611000.001.01 E1/KUK 1.3",
  "J.611000.002.01 E2/KUK 2.1",
  "J.611000.002.01 E2/KUK 2.3",
];

// Initial Rich Default Data
const initialWizardState: WizardFormState = {
  metadata: {
    namaKonfigurasi:
      "Set Konfigurasi Pertanyaan Asesmen Komprehensif (FR.IA.04A & FR.IA.04B)",
    skemaSertifikasi: "network_admin",
    versi: "1.0",
    penyusun: [
      {
        value: "aditya_rahman",
        label: "Aditya Rahman Syach, M.Kom (Asesor Utama)",
      },
    ],
    validator: [
      { value: "made_jaya", label: "I Made Jaya Artana, S.T., M.T. (Asesor)" },
    ],
    isDefault: false,
  },
  step1: {
    type: "CHECKLIST_MULTIPLE_CHOICE",
    questions: [
      {
        id: "q1-step1",
        pertanyaanText:
          "Daftar Penyesuaian Wajar yang diperlukan Asesi saat pelaksanaan asesmen:",
        options: [
          {
            id: "opt-1-1",
            text: "Perpanjangan waktu pengerjaan (15-30 menit)",
            isValid: true,
          },
          {
            id: "opt-1-2",
            text: "Perangkat bantu visual / magnifier / layar kontras tinggi",
            isValid: true,
          },
          {
            id: "opt-1-3",
            text: "Ruangan pengerjaan tenang / khusus tanpa distraksi",
            isValid: true,
          },
          {
            id: "opt-1-4",
            text: "Pemberian instruksi tertulis khusus atau pendamping penerjemah",
            isValid: false,
          },
        ],
      },
    ],
  },
  step2: {
    type: "INSTRUCTION_SCENARIO",
    blokA: {
      skenarioStudiKasus:
        "PT Nusantara Media adalah perusahaan penyedia jasa media digital & infrastruktur IT enterprise. Anda diminta bertindak sebagai Network Specialist untuk merancang ulang arsitektur jaringan perusahaan agar mendukung ketersediaan tinggi (High Availability) dan isolasi keamanan data.",
      informasiYangDiberikan: [
        "Topologi fisik awal dan peta lokasi antargedung pusat & kantor cabang",
        "Skema alokasi IP Address V4/V6 dan struktur VLAN eksisting",
        "Daftar kebutuhan pengguna (200 host gedung A, 100 host gedung B, 20 server)",
        "Spesifikasi perangkat router core & switch distribution terinstal",
      ],
      lingkupBahasanStudiKasus: [
        "Topic 1: Perancangan Hirarki Topologi Jaringan Enterprise",
        "Topic 2: Skema Pengalamatan IP Subnetting & VLSM",
        "Topic 3: Konfigurasi Routing Dinamik OSPF & VLAN Trunking IEEE 802.1Q",
        "Topic 4: Menerapkan Kebijakan Keamanan Firewall & Access Control List (ACL)",
        "Topic 5: Pengujian Kinerja Network & Dokumentasi Laporan Asesmen",
      ],
      perlengkapanDanBahan:
        "Laptop terinstal Simulator Cisco Packet Tracer / GNS3, Kertas A4 HVS, Alat Tulis, dan Perangkat Slide Presentasi PPT.",
    },
    blokB: {
      fokusPresentasi: [
        "a. Demonstrasi Perancangan & Alasan Pemilihan Topologi Network",
        "b. Penjelasan Rincian Pengalamatan Subnetting & Pembagian VLAN",
        "c. Simulasi Routing OSPF & Penanganan Failover Redundansi",
        "d. Analisis Hasil Pengujian Latensi & Keamanan Akses Server",
      ],
      ketentuanAlokasiWaktu:
        "Total Waktu Asesmen: 60 Menit (30 Menit Sesi Demonstrasi Presentasi + 30 Menit Sesi Tanya Jawab & Klarifikasi Asesor).",
      kriteriaEvaluasiAsesor: [
        "Ketepatan rancangan topologi dan ketersediaan tinggi (High Availability)",
        "Penguasaan jawaban atas pertanyaan klarifikasi teknis",
        "Rasionalitas pemilihan perangkat dan kalkulasi alokasi IP Subnetting",
        "Sikap profesional dan kelengkapan dokumen laporan hasil studi kasus",
      ],
    },
  },
  step3: {
    type: "NESTED_ESSAY_PROYEK",
    lingkups: [
      {
        id: "lingkup-1",
        namaLingkup:
          "Lingkup 1: Perancangan Topologi & Pengalamatan IP Jaringan",
        subPertanyaans: [
          {
            id: "sub-1-1",
            skenarioPertanyaan:
              "Berdasarkan studi kasus PT Nusantara Media, jelaskan rancangan topologi core-distribution-access yang Anda pilih serta perhitungan subnetting IP VLSM secara mendetail!",
            kodeKUK: [
              "J.611000.001.01 E1/KUK 1.1",
              "J.611000.001.01 E1/KUK 1.3",
            ],
            ekspektasiTanggapan:
              "Asesi mampu menjelaskan pembagian 3 tier topologi, perhitungan VLSM, dan pengalokasian IP gateway dengan akurat.",
          },
          {
            id: "sub-1-2",
            skenarioPertanyaan:
              "Bagaimana Anda memisahkan lalu lintas data antar-departemen untuk menjaga keamanan dan isolasi subnet?",
            kodeKUK: ["J.611000.002.01 E2/KUK 2.1"],
            ekspektasiTanggapan:
              "Asesi menjelaskan pemetaan VLAN terpisah (VLAN 10 HRD, VLAN 20 Finance, VLAN 30 Server) dan konfigurasinya pada switch trunking.",
          },
        ],
      },
      {
        id: "lingkup-2",
        namaLingkup:
          "Lingkup 2: Konfigurasi Routing Dinamik & Keamanan Firewall",
        subPertanyaans: [
          {
            id: "sub-2-1",
            skenarioPertanyaan:
              "Demonstrasikan dan jelaskan prosedur konfigurasi OSPF area 0 beserta penerapan Access Control List (ACL) untuk membatasi akses ke Server Keuangan!",
            kodeKUK: ["J.611000.002.01 E2/KUK 2.3"],
            ekspektasiTanggapan:
              "Asesi menunjukkan command router OSPF, wildcard mask, dan Extended ACL yang memblokir subnet non-authorized secara presisi.",
          },
        ],
      },
    ],
  },
  step4: {
    type: "ESSAY_WITH_KEY_ANSWER",
    questions: [
      {
        id: "q1-step4",
        kodeKUKRef: "J.611000.001.01 E1/KUK 1.3",
        pertanyaanLisan:
          "Jelaskan fungsi dari protokol ARP (Address Resolution Protocol) dan bagaimana dampaknya jika terjadi ARP Spoofing dalam jaringan lokal!",
        kunciJawaban:
          "ARP berfungsi memetakan IP Address menjadi MAC Address fisik pada jaringan Ethernet. Jika terjadi ARP Spoofing, penyerang mengirimkan pesan ARP palsu sehingga lalu lintas data teralihkan ke perangkat penyerang (Man-In-The-Middle Attack).",
      },
      {
        id: "q2-step4",
        kodeKUKRef: "J.611000.002.01 E2/KUK 2.1",
        pertanyaanLisan:
          "Sebutkan perbedaan mendasar antara Switch Layer 2 dan Switch Layer 3!",
        kunciJawaban:
          "Switch Layer 2 hanya melakukan switching berdasarkan MAC address pada Data Link Layer, sedangkan Switch Layer 3 memiliki fungsi routing berdasarkan IP address pada Network Layer dan mendukung Inter-VLAN routing.",
      },
    ],
  },
};

// ============================================================================
// MAIN COMPONENT: TambahKonfigurasiPertanyaan Wizard
// ============================================================================

export function TambahKonfigurasiPertanyaan() {
  const {
    setCurrentView,
    addKonfigurasiPertanyaan,
    updateKonfigurasiPertanyaan,
    konfigurasiPertanyaan,
    selectedKonfigurasiId,
    currentView,
  } = useAppContext();
  const isReadOnly = currentView === "detail-konfigurasi-pertanyaan";
  const isEdit = currentView === "ubah-konfigurasi-pertanyaan";

  // Active step state (1 to 5)
  const [activeStep, setActiveStep] = useState<number>(1);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSuccessToast, setIsSuccessToast] = useState<string | null>(null);

  // Central Wizard Form State
  const [formData, setFormData] = useState<WizardFormState>(initialWizardState);

  // Load existing data if editing or viewing detail
  useEffect(() => {
    if ((isEdit || isReadOnly) && selectedKonfigurasiId) {
      const existing = konfigurasiPertanyaan.find(
        (k) => k.id === selectedKonfigurasiId,
      );
      if (existing) {
        const existingWithData = existing as unknown as {
          formData?: WizardFormState;
        };

        queueMicrotask(() => {
          if (existingWithData.formData) {
            setFormData(existingWithData.formData);
          } else {
            // Helper khusus untuk mengonversi ke tipe strict { value: string; label: string }[]
            const formatPersonList = (
              list?: PersonItem[] | string[],
            ): Array<{ value: string; label: string }> => {
              if (!list) return [];
              return list.map((item) => {
                if (typeof item === "string") {
                  return { value: item, label: item };
                }
                return {
                  value: String(item.value || item.id || item.nama || ""),
                  label: String(item.label || item.nama || item.value || ""),
                };
              });
            };

            setFormData((prev) => ({
              ...prev,
              metadata: {
                namaKonfigurasi: existing.nama || prev.metadata.namaKonfigurasi,
                skemaSertifikasi:
                  existing.skema || prev.metadata.skemaSertifikasi,
                versi: existing.versi || "1.0",
                penyusun: existing.penyusun
                  ? formatPersonList(existing.penyusun)
                  : prev.metadata.penyusun,
                validator: existing.validator
                  ? formatPersonList(existing.validator)
                  : prev.metadata.validator,
                isDefault: existing.isDefault ?? false,
              },
            }));
          }
        });
      }
    }
  }, [isEdit, isReadOnly, selectedKonfigurasiId, konfigurasiPertanyaan]);

  // Toast auto-hide
  useEffect(() => {
    if (validationError || isSuccessToast) {
      const timer = setTimeout(() => {
        setValidationError(null);
        setIsSuccessToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [validationError, isSuccessToast]);

  // Helper functions to update Metadata
  const updateMetadata = <K extends keyof ConfigurationMetadata>(
    field: K,
    value: ConfigurationMetadata[K],
  ) => {
    setFormData((prev) => ({
      ...prev,
      metadata: { ...prev.metadata, [field]: value },
    }));
  };

  // --------------------------------------------------------------------------
  // STEP 1 HANDLERS (CHECKLIST_MULTIPLE_CHOICE)
  // --------------------------------------------------------------------------
  const addStep1Question = () => {
    const newQ: Step1Question = {
      id: `q-${Date.now()}`,
      pertanyaanText: "",
      options: [
        { id: `opt-${Date.now()}-1`, text: "", isValid: false },
        { id: `opt-${Date.now()}-2`, text: "", isValid: false },
      ],
    };
    setFormData((prev) => ({
      ...prev,
      step1: { ...prev.step1, questions: [...prev.step1.questions, newQ] },
    }));
  };

  const removeStep1Question = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      step1: {
        ...prev.step1,
        questions: prev.step1.questions.filter((q) => q.id !== id),
      },
    }));
  };

  const updateStep1QuestionText = (id: string, text: string) => {
    setFormData((prev) => ({
      ...prev,
      step1: {
        ...prev.step1,
        questions: prev.step1.questions.map((q) =>
          q.id === id ? { ...q, pertanyaanText: text } : q,
        ),
      },
    }));
  };

  const addStep1Option = (qId: string) => {
    setFormData((prev) => ({
      ...prev,
      step1: {
        ...prev.step1,
        questions: prev.step1.questions.map((q) => {
          if (q.id === qId) {
            return {
              ...q,
              options: [
                ...q.options,
                { id: `opt-${Date.now()}`, text: "", isValid: false },
              ],
            };
          }
          return q;
        }),
      },
    }));
  };

  const removeStep1Option = (qId: string, optId: string) => {
    setFormData((prev) => ({
      ...prev,
      step1: {
        ...prev.step1,
        questions: prev.step1.questions.map((q) => {
          if (q.id === qId) {
            return { ...q, options: q.options.filter((o) => o.id !== optId) };
          }
          return q;
        }),
      },
    }));
  };

  const updateStep1Option = (
    qId: string,
    optId: string,
    text: string,
    isValid?: boolean,
  ) => {
    setFormData((prev) => ({
      ...prev,
      step1: {
        ...prev.step1,
        questions: prev.step1.questions.map((q) => {
          if (q.id === qId) {
            return {
              ...q,
              options: q.options.map((o) => {
                if (o.id === optId) {
                  return {
                    ...o,
                    text: text !== undefined ? text : o.text,
                    isValid: isValid !== undefined ? isValid : o.isValid,
                  };
                }
                return o;
              }),
            };
          }
          return q;
        }),
      },
    }));
  };

  // --------------------------------------------------------------------------
  // STEP 2 HANDLERS (FR.IA.04A: INSTRUCTION_SCENARIO BLOK A & BLOK B DYNAMIC LISTS)
  // --------------------------------------------------------------------------
  const updateStep2BlokAField = <K extends keyof Step2BlokA>(
    field: K,
    value: Step2BlokA[K],
  ) => {
    setFormData((prev) => ({
      ...prev,
      step2: {
        ...prev.step2,
        blokA: { ...prev.step2.blokA, [field]: value },
      },
    }));
  };

  const updateStep2BlokBField = <K extends keyof Step2BlokB>(
    field: K,
    value: Step2BlokB[K],
  ) => {
    setFormData((prev) => ({
      ...prev,
      step2: {
        ...prev.step2,
        blokB: { ...prev.step2.blokB, [field]: value },
      },
    }));
  };

  // Dynamic Array Helper for Step 2 Blok A (Informasi & Lingkup Bahasan)
  const addStep2BlokAArrayItem = (
    field: "informasiYangDiberikan" | "lingkupBahasanStudiKasus",
  ) => {
    setFormData((prev) => ({
      ...prev,
      step2: {
        ...prev.step2,
        blokA: {
          ...prev.step2.blokA,
          [field]: [...prev.step2.blokA[field], ""],
        },
      },
    }));
  };

  const removeStep2BlokAArrayItem = (
    field: "informasiYangDiberikan" | "lingkupBahasanStudiKasus",
    index: number,
  ) => {
    setFormData((prev) => ({
      ...prev,
      step2: {
        ...prev.step2,
        blokA: {
          ...prev.step2.blokA,
          [field]: prev.step2.blokA[field].filter((_, i) => i !== index),
        },
      },
    }));
  };

  const updateStep2BlokAArrayItem = (
    field: "informasiYangDiberikan" | "lingkupBahasanStudiKasus",
    index: number,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      step2: {
        ...prev.step2,
        blokA: {
          ...prev.step2.blokA,
          [field]: prev.step2.blokA[field].map((item, i) =>
            i === index ? value : item,
          ),
        },
      },
    }));
  };

  // Dynamic Array Helper for Step 2 Blok B (Fokus Presentasi & Kriteria Evaluasi)
  const addStep2BlokBArrayItem = (
    field: "fokusPresentasi" | "kriteriaEvaluasiAsesor",
  ) => {
    setFormData((prev) => ({
      ...prev,
      step2: {
        ...prev.step2,
        blokB: {
          ...prev.step2.blokB,
          [field]: [...prev.step2.blokB[field], ""],
        },
      },
    }));
  };

  const removeStep2BlokBArrayItem = (
    field: "fokusPresentasi" | "kriteriaEvaluasiAsesor",
    index: number,
  ) => {
    setFormData((prev) => ({
      ...prev,
      step2: {
        ...prev.step2,
        blokB: {
          ...prev.step2.blokB,
          [field]: prev.step2.blokB[field].filter((_, i) => i !== index),
        },
      },
    }));
  };

  const updateStep2BlokBArrayItem = (
    field: "fokusPresentasi" | "kriteriaEvaluasiAsesor",
    index: number,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      step2: {
        ...prev.step2,
        blokB: {
          ...prev.step2.blokB,
          [field]: prev.step2.blokB[field].map((item, i) =>
            i === index ? value : item,
          ),
        },
      },
    }));
  };

  // --------------------------------------------------------------------------
  // STEP 3 HANDLERS (FR.IA.04B: NESTED_ESSAY_PROYEK - Lingkup -> SubPertanyaan)
  // --------------------------------------------------------------------------
  const addStep3Lingkup = () => {
    const newLingkup: Step3LingkupPenyajian = {
      id: `lingkup-${Date.now()}`,
      namaLingkup: "",
      subPertanyaans: [
        {
          id: `sub-${Date.now()}-1`,
          skenarioPertanyaan: "",
          kodeKUK: [],
          ekspektasiTanggapan: "",
        },
      ],
    };
    setFormData((prev) => ({
      ...prev,
      step3: {
        ...prev.step3,
        lingkups: [...prev.step3.lingkups, newLingkup],
      },
    }));
  };

  const removeStep3Lingkup = (lingkupId: string) => {
    setFormData((prev) => ({
      ...prev,
      step3: {
        ...prev.step3,
        lingkups: prev.step3.lingkups.filter((l) => l.id !== lingkupId),
      },
    }));
  };

  const updateStep3LingkupNama = (lingkupId: string, nama: string) => {
    setFormData((prev) => ({
      ...prev,
      step3: {
        ...prev.step3,
        lingkups: prev.step3.lingkups.map((l) =>
          l.id === lingkupId ? { ...l, namaLingkup: nama } : l,
        ),
      },
    }));
  };

  const addStep3SubPertanyaan = (lingkupId: string) => {
    const newSub: Step3SubPertanyaan = {
      id: `sub-${Date.now()}`,
      skenarioPertanyaan: "",
      kodeKUK: [],
      ekspektasiTanggapan: "",
    };
    setFormData((prev) => ({
      ...prev,
      step3: {
        ...prev.step3,
        lingkups: prev.step3.lingkups.map((l) => {
          if (l.id === lingkupId) {
            return {
              ...l,
              subPertanyaans: [...l.subPertanyaans, newSub],
            };
          }
          return l;
        }),
      },
    }));
  };

  const removeStep3SubPertanyaan = (lingkupId: string, subId: string) => {
    setFormData((prev) => ({
      ...prev,
      step3: {
        ...prev.step3,
        lingkups: prev.step3.lingkups.map((l) => {
          if (l.id === lingkupId) {
            return {
              ...l,
              subPertanyaans: l.subPertanyaans.filter((sp) => sp.id !== subId),
            };
          }
          return l;
        }),
      },
    }));
  };

  const updateStep3SubPertanyaan = <K extends keyof Step3SubPertanyaan>(
    lingkupId: string,
    subId: string,
    field: K,
    value: Step3SubPertanyaan[K],
  ) => {
    setFormData((prev) => ({
      ...prev,
      step3: {
        ...prev.step3,
        lingkups: prev.step3.lingkups.map((l) => {
          if (l.id === lingkupId) {
            return {
              ...l,
              subPertanyaans: l.subPertanyaans.map((sp) => {
                if (sp.id === subId) {
                  return { ...sp, [field]: value };
                }
                return sp;
              }),
            };
          }
          return l;
        }),
      },
    }));
  };

  // --------------------------------------------------------------------------
  // STEP 4 HANDLERS (FR.IA.07: ESSAY_WITH_KEY_ANSWER)
  // --------------------------------------------------------------------------
  const addStep4Question = () => {
    const newQ: Step4Question = {
      id: `q4-${Date.now()}`,
      kodeKUKRef: "",
      pertanyaanLisan: "",
      kunciJawaban: "",
    };
    setFormData((prev) => ({
      ...prev,
      step4: { ...prev.step4, questions: [...prev.step4.questions, newQ] },
    }));
  };

  const removeStep4Question = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      step4: {
        ...prev.step4,
        questions: prev.step4.questions.filter((q) => q.id !== id),
      },
    }));
  };

  const updateStep4Question = (
    id: string,
    field: keyof Step4Question,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      step4: {
        ...prev.step4,
        questions: prev.step4.questions.map((q) =>
          q.id === id ? { ...q, [field]: value } : q,
        ),
      },
    }));
  };

  // --------------------------------------------------------------------------
  // STEP VALIDATION LOGIC BEFORE ADVANCING
  // --------------------------------------------------------------------------
  const validateCurrentStep = (step: number): boolean => {
    setValidationError(null);

    // Validate Metadata first
    if (!formData.metadata.namaKonfigurasi.trim()) {
      setValidationError("Nama Konfigurasi Pertanyaan wajib diisi.");
      return false;
    }
    if (!formData.metadata.skemaSertifikasi) {
      setValidationError("Pilih Skema Sertifikasi terlebih dahulu.");
      return false;
    }

    if (step === 1) {
      if (formData.step1.questions.length === 0) {
        setValidationError(
          "Step 1 minimal harus memiliki 1 pertanyaan Penyesuaian Wajar.",
        );
        return false;
      }
      for (let i = 0; i < formData.step1.questions.length; i++) {
        const q = formData.step1.questions[i];
        if (!q.pertanyaanText.trim()) {
          setValidationError(`Pertanyaan #${i + 1} di Step 1 belum diisi.`);
          return false;
        }
        if (q.options.length < 2) {
          setValidationError(
            `Pertanyaan #${i + 1} di Step 1 minimal harus memiliki 2 opsi jawaban.`,
          );
          return false;
        }
        for (const opt of q.options) {
          if (!opt.text.trim()) {
            setValidationError(
              `Opsi pada Pertanyaan #${i + 1} di Step 1 tidak boleh kosong.`,
            );
            return false;
          }
        }
      }
    }

    if (step === 2) {
      if (!formData.step2.blokA.skenarioStudiKasus.trim()) {
        setValidationError("Skenario Studi Kasus (Blok A) wajib diisi.");
        return false;
      }
      if (
        formData.step2.blokA.informasiYangDiberikan.length === 0 ||
        formData.step2.blokA.informasiYangDiberikan.some((i) => !i.trim())
      ) {
        setValidationError(
          "Informasi yang Diberikan (Blok A) tidak boleh ada item yang kosong.",
        );
        return false;
      }
      if (
        formData.step2.blokA.lingkupBahasanStudiKasus.length === 0 ||
        formData.step2.blokA.lingkupBahasanStudiKasus.some((l) => !l.trim())
      ) {
        setValidationError(
          "Lingkup Bahasan Studi Kasus (Blok A) tidak boleh ada item yang kosong.",
        );
        return false;
      }
      if (!formData.step2.blokA.perlengkapanDanBahan.trim()) {
        setValidationError("Perlengkapan & Bahan (Blok A) wajib diisi.");
        return false;
      }
      if (
        formData.step2.blokB.fokusPresentasi.length === 0 ||
        formData.step2.blokB.fokusPresentasi.some((f) => !f.trim())
      ) {
        setValidationError(
          "Fokus Presentasi (Blok B) tidak boleh ada item yang kosong.",
        );
        return false;
      }
      if (!formData.step2.blokB.ketentuanAlokasiWaktu.trim()) {
        setValidationError("Ketentuan Alokasi Waktu (Blok B) wajib diisi.");
        return false;
      }
      if (
        formData.step2.blokB.kriteriaEvaluasiAsesor.length === 0 ||
        formData.step2.blokB.kriteriaEvaluasiAsesor.some((k) => !k.trim())
      ) {
        setValidationError(
          "Kriteria Evaluasi Asesor (Blok B) tidak boleh ada item yang kosong.",
        );
        return false;
      }
    }

    if (step === 3) {
      if (formData.step3.lingkups.length === 0) {
        setValidationError(
          "Step 3 minimal harus memiliki 1 Lingkup Penyajian.",
        );
        return false;
      }
      for (let i = 0; i < formData.step3.lingkups.length; i++) {
        const lingkup = formData.step3.lingkups[i];
        if (!lingkup.namaLingkup.trim()) {
          setValidationError(
            `Nama Lingkup Penyajian #${i + 1} di Step 3 wajib diisi.`,
          );
          return false;
        }
        if (lingkup.subPertanyaans.length === 0) {
          setValidationError(
            `Lingkup Penyajian #${i + 1} minimal harus memiliki 1 pertanyaan.`,
          );
          return false;
        }
        for (let j = 0; j < lingkup.subPertanyaans.length; j++) {
          const sub = lingkup.subPertanyaans[j];
          if (!sub.skenarioPertanyaan.trim()) {
            setValidationError(
              `Skenario & Pertanyaan #${j + 1} pada Lingkup #${i + 1} wajib diisi.`,
            );
            return false;
          }
        }
      }
    }

    if (step === 4) {
      if (formData.step4.questions.length === 0) {
        setValidationError("Step 4 minimal harus memiliki 1 Pertanyaan Lisan.");
        return false;
      }
      for (let i = 0; i < formData.step4.questions.length; i++) {
        const q = formData.step4.questions[i];
        if (!q.pertanyaanLisan.trim()) {
          setValidationError(
            `Teks Pertanyaan Lisan #${i + 1} di Step 4 wajib diisi.`,
          );
          return false;
        }
        if (!q.kunciJawaban.trim()) {
          setValidationError(
            `KUNCI JAWABAN pada Pertanyaan Lisan #${i + 1} di Step 4 WAJIB diisi oleh Asesor.`,
          );
          return false;
        }
      }
    }

    return true;
  };

  const handleNextStep = () => {
    if (validateCurrentStep(activeStep)) {
      if (activeStep < 5) {
        setActiveStep((prev) => prev + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const handlePrevStep = () => {
    if (activeStep > 1) {
      setActiveStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSaveToContext = (publishStatus: "draft" | "published") => {
    // Re-validate all steps if publishing
    if (publishStatus === "published") {
      for (let s = 1; s <= 4; s++) {
        if (!validateCurrentStep(s)) {
          setActiveStep(s);
          return;
        }
      }
    }

    const configName =
      formData.metadata.namaKonfigurasi.trim() ||
      "Draft Konfigurasi Pertanyaan";

    const payload = {
      nama: configName,
      skema:
        skemaOptions.find((s) => s.value === formData.metadata.skemaSertifikasi)
          ?.label ||
        formData.metadata.skemaSertifikasi ||
        "Teknisi Muda Jaringan Komputer",
      tipeForm: "Multi-Step Wizard",
      versi: formData.metadata.versi,
      penyusun: formData.metadata.penyusun,
      validator: formData.metadata.validator,
      isDefault: formData.metadata.isDefault,
      status: publishStatus,
      formData: formData,
      subPertanyaans: [
        {
          id: "sp1",
          nama: "Penyesuaian Wajar",
          tipePertanyaan: "checkbox_multiple",
          questions: formData.step1.questions,
        },
        {
          id: "sp2",
          nama: "Penjelasan Singkat Proyek",
          tipePertanyaan: "skenario_fri4a",
          blokA: formData.step2.blokA,
          blokB: formData.step2.blokB,
        },
        {
          id: "sp3",
          nama: "Penilaian Proyek Singkat",
          tipePertanyaan: "nested_essay_proyek",
          lingkups: formData.step3.lingkups,
        },
        {
          id: "sp4",
          nama: "Pertanyaan Lisan",
          tipePertanyaan: "esai_kunci",
          questions: formData.step4.questions,
        },
      ],
    };

    if (isEdit && selectedKonfigurasiId) {
      updateKonfigurasiPertanyaan(selectedKonfigurasiId, payload);
    } else {
      addKonfigurasiPertanyaan(payload);
    }

    setIsSuccessToast(
      publishStatus === "published"
        ? "Konfigurasi Pertanyaan berhasil diterbitkan!"
        : "Draft Konfigurasi Pertanyaan berhasil disimpan.",
    );
    setTimeout(() => {
      setCurrentView("konfigurasi-pertanyaan");
    }, 1200);
  };

  // Steps Metainfo for Stepper Header
  const stepsInfo = [
    {
      number: 1,
      title: "Penyesuaian Wajar",
      code: "STEP 1",
      icon: CheckSquare,
      desc: "Checklist Pilihan Valid",
    },
    {
      number: 2,
      title: "Skenario",
      code: "STEP 2",
      icon: FileSpreadsheet,
      desc: "Blok A & Blok B",
    },
    {
      number: 3,
      title: "Nested",
      code: "STEP 3",
      icon: ListTodo,
      desc: "Nested Lingkup & Soal",
    },
    {
      number: 4,
      title: "Pertanyaan Lisan",
      code: "STEP 4",
      icon: MessageSquare,
      desc: "Pertanyaan + Kunci",
    },
    {
      number: 5,
      title: "Finalisasi & Review",
      code: "STEP 5",
      icon: ShieldCheck,
      desc: "Ringkasan & Terbit",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FC] p-4 md:p-8 space-y-6 pb-28 text-sm text-gray-700">
      {/* Toast Notification Alert */}
      <AnimatePresence>
        {validationError && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 right-5 z-50 bg-rose-600 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 font-semibold text-xs md:text-sm max-w-md border border-rose-500"
          >
            <AlertCircle size={20} className="shrink-0" />
            <div className="flex-1">{validationError}</div>
          </motion.div>
        )}
        {isSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 font-semibold text-xs md:text-sm max-w-md border border-emerald-500"
          >
            <CheckCircle2 size={20} className="shrink-0" />
            <div className="flex-1">{isSuccessToast}</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setCurrentView("konfigurasi-pertanyaan")}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-[#008BE3] bg-[#008BE3]/10 hover:bg-[#008BE3]/20 transition-colors cursor-pointer shrink-0"
            title="Kembali"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="min-w-0">
            <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">
              Wizard Konfigurasi Pertanyaan
            </h2>
            <p className="text-xs text-gray-400 font-bold tracking-wider uppercase leading-tight">
              Penyusunan Multi-Step Instrumen Asesmen (Step 1 - Step 5
              Berurutan)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => handleSaveToContext("draft")}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-xs md:text-sm font-bold transition-all shadow-xs flex items-center gap-2"
          >
            <Save size={16} /> Simpan Draft
          </button>
          {activeStep === 5 && (
            <button
              onClick={() => handleSaveToContext("published")}
              className="px-5 py-2 bg-[#008BE3] hover:bg-[#0076C2] text-white rounded-lg text-xs md:text-sm font-bold transition-all shadow-sm flex items-center gap-2"
            >
              <Send size={16} /> Terbitkan Konfigurasi
            </button>
          )}
        </div>
      </div>

      {/* GENERAL METADATA CARD */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-5 md:p-6 space-y-4 relative z-20">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2 font-black text-slate-900 text-sm md:text-base">
            <Settings size={18} className="text-[#008BE3]" />
            <span>Informasi General & Metadata Konfigurasi</span>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Versi {formData.metadata.versi}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 text-xs md:text-sm">
          <div className="md:col-span-2 space-y-1">
            <label className="font-bold text-slate-700 block">
              <span className="text-rose-500">*</span> Nama Konfigurasi
              Pertanyaan
            </label>
            <input
              type="text"
              value={formData.metadata.namaKonfigurasi}
              onChange={(e) =>
                updateMetadata("namaKonfigurasi", e.target.value)
              }
              disabled={isReadOnly}
              placeholder="Contoh: Set Konfigurasi Pertanyaan Asesmen Komprehensif"
              className="w-full px-3.5 py-2 border border-gray-300 rounded-lg outline-none focus:border-[#008BE3] font-semibold text-slate-800 bg-white"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">
              <span className="text-rose-500">*</span> Skema Sertifikasi
            </label>
            <select
              value={formData.metadata.skemaSertifikasi}
              onChange={(e) =>
                updateMetadata("skemaSertifikasi", e.target.value)
              }
              disabled={isReadOnly}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-[#008BE3] font-semibold text-slate-800 bg-white"
            >
              <option value="">-- Pilih Skema Sertifikasi --</option>
              {skemaOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">
              Versi Dokumen
            </label>
            <input
              type="text"
              value={formData.metadata.versi}
              onChange={(e) => updateMetadata("versi", e.target.value)}
              disabled={isReadOnly}
              className="w-full px-3.5 py-2 border border-gray-300 rounded-lg outline-none focus:border-[#008BE3] font-mono text-slate-800 bg-white"
            />
          </div>

          <div className="md:col-span-2 space-y-1">
            <label className="font-bold text-slate-700 block">
              Penyusun (Asesor)
            </label>
            <Select
              isDisabled={isReadOnly}
              isMulti
              options={assessorOptions}
              value={formData.metadata.penyusun}
              onChange={(val) =>
                updateMetadata(
                  "penyusun",
                  val as Array<{ value: string; label: string }>,
                )
              }
              className="basic-multi-select text-xs"
              placeholder="Pilih Penyusun..."
              menuPortalTarget={
                typeof document !== "undefined" ? document.body : null
              }
              styles={{
                menuPortal: (base: Record<string, unknown>) => ({
                  ...base,
                  zIndex: 9999,
                }),
              }}
            />
          </div>

          <div className="md:col-span-2 space-y-1">
            <label className="font-bold text-slate-700 block">Validator</label>
            <Select
              isDisabled={isReadOnly}
              isMulti
              options={assessorOptions}
              value={formData.metadata.validator}
              onChange={(val) =>
                updateMetadata(
                  "validator",
                  val as Array<{ value: string; label: string }>,
                )
              }
              className="basic-multi-select text-xs"
              placeholder="Pilih Validator..."
              menuPortalTarget={
                typeof document !== "undefined" ? document.body : null
              }
              styles={{
                menuPortal: (base: Record<string, unknown>) => ({
                  ...base,
                  zIndex: 9999,
                }),
              }}
            />
          </div>
        </div>
      </div>

      {/* STEPPER NAVIGATION BAR (STEP 1 -> STEP 5) */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-4 md:p-6 overflow-x-auto">
        <div className="min-w-175">
          <div className="grid grid-cols-5 gap-2 relative">
            {/* Connecting Progress Line */}
            <div className="absolute top-5 left-8 right-8 h-1 bg-gray-100 z-0">
              <div
                className="h-full bg-[#008BE3] transition-all duration-300"
                style={{ width: `${((activeStep - 1) / 4) * 100}%` }}
              />
            </div>

            {stepsInfo.map((st) => {
              const isActive = activeStep === st.number;
              const isCompleted = activeStep > st.number;

              return (
                <button
                  key={st.number}
                  onClick={() => {
                    if (st.number < activeStep) {
                      setActiveStep(st.number);
                    } else if (st.number === activeStep + 1) {
                      if (validateCurrentStep(activeStep)) {
                        setActiveStep(st.number);
                      }
                    }
                  }}
                  className={`flex flex-col items-center text-center group cursor-pointer relative z-10 transition-all ${
                    isActive ? "scale-105" : "opacity-85 hover:opacity-100"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-xs transition-all shadow-sm ${
                      isCompleted
                        ? "bg-emerald-600 text-white border-2 border-emerald-600"
                        : isActive
                          ? "bg-[#008BE3] text-white border-4 border-sky-100 shadow-md ring-2 ring-[#008BE3]"
                          : "bg-white text-slate-400 border-2 border-gray-300"
                    }`}
                  >
                    {isCompleted ? (
                      <Check size={18} strokeWidth={3} />
                    ) : (
                      st.number
                    )}
                  </div>

                  <div className="mt-2 space-y-0.5">
                    <span
                      className={`text-[10px] font-mono tracking-wider uppercase block font-bold ${
                        isActive
                          ? "text-[#008BE3]"
                          : isCompleted
                            ? "text-emerald-700"
                            : "text-slate-400"
                      }`}
                    >
                      {st.code}
                    </span>
                    <span
                      className={`text-xs font-black block leading-tight ${
                        isActive ? "text-slate-900" : "text-slate-600"
                      }`}
                    >
                      {st.title}
                    </span>
                    <span className="text-[10px] text-gray-400 hidden lg:block">
                      {st.desc}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* DYNAMIC WIZARD STEP CONTENT PANEL */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        {/* =================================================================== */}
        {/* STEP 1: Penyesuaian Wajar                                          */}
        {/* =================================================================== */}
        {activeStep === 1 && (
          <div className="p-6 md:p-8 space-y-6">
            <div className="bg-sky-50/80 border border-sky-200 rounded-xl p-4 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#008BE3] text-white flex items-center justify-center shrink-0 font-bold">
                1
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-black text-slate-900">
                  STEP 1: Penyesuaian Wajar
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Input daftar pertanyaan/pernyataan penyesuaian wajar dengan
                  opsi jawaban berupa <strong>Checklist Pilihan Ganda</strong>.
                  Centang opsi yang dikategorikan sebagai opsi valid.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {formData.step1.questions.map((q, qIdx) => (
                <div
                  key={q.id}
                  className="border border-slate-200 rounded-xl p-5 md:p-6 bg-slate-50/50 space-y-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                      <span className="w-7 h-7 rounded-lg bg-[#008BE3] text-white flex items-center justify-center font-mono text-xs">
                        P{qIdx + 1}
                      </span>
                      <span>Pertanyaan / Pernyataan Penyesuaian Wajar</span>
                    </div>

                    {formData.step1.questions.length > 1 && !isReadOnly && (
                      <button
                        onClick={() => removeStep1Question(q.id)}
                        className="text-rose-600 hover:text-rose-700 p-1.5 rounded-lg hover:bg-rose-50 transition-colors flex items-center gap-1 text-xs font-bold"
                      >
                        <Trash2 size={15} /> Hapus Pertanyaan
                      </button>
                    )}
                  </div>

                  <div className="space-y-1">
                    <textarea
                      value={q.pertanyaanText}
                      onChange={(e) =>
                        updateStep1QuestionText(q.id, e.target.value)
                      }
                      disabled={isReadOnly}
                      placeholder="Masukkan Teks Pertanyaan/Pernyataan Penyesuaian Wajar..."
                      rows={2}
                      className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-[#008BE3] text-sm bg-white font-medium text-slate-800"
                    />
                  </div>

                  {/* Options Array */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span>
                        Daftar Opsi Jawaban (Berikan centang jika opsi dianggap
                        Valid/Disetujui):
                      </span>
                      <span className="text-slate-400 font-normal">
                        {q.options.length} Opsi
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {q.options.map((opt, optIdx) => (
                        <div
                          key={opt.id}
                          className="flex items-center gap-3 bg-white p-2.5 border border-gray-200 rounded-lg"
                        >
                          <label className="flex items-center gap-2 cursor-pointer shrink-0">
                            <input
                              type="checkbox"
                              checked={opt.isValid}
                              onChange={(e) =>
                                updateStep1Option(
                                  q.id,
                                  opt.id,
                                  opt.text,
                                  e.target.checked,
                                )
                              }
                              disabled={isReadOnly}
                              className="w-4 h-4 rounded text-[#008BE3] focus:ring-[#008BE3] border-gray-300"
                            />
                            <span className="text-xs font-bold text-slate-600 font-mono">
                              Opsi {String.fromCharCode(65 + optIdx)}
                            </span>
                          </label>

                          <input
                            type="text"
                            value={opt.text}
                            onChange={(e) =>
                              updateStep1Option(q.id, opt.id, e.target.value)
                            }
                            disabled={isReadOnly}
                            placeholder={`Teks Opsi ${String.fromCharCode(65 + optIdx)}...`}
                            className="flex-1 px-3 py-1.5 border border-gray-200 rounded-md text-xs md:text-sm outline-none focus:border-[#008BE3]"
                          />

                          {opt.isValid && (
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded font-bold text-[10px] shrink-0">
                              Opsi Valid
                            </span>
                          )}

                          {q.options.length > 2 && !isReadOnly && (
                            <button
                              onClick={() => removeStep1Option(q.id, opt.id)}
                              className="text-gray-400 hover:text-rose-600 p-1 rounded transition-colors shrink-0"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    {!isReadOnly && (
                      <button
                        onClick={() => addStep1Option(q.id)}
                        className="mt-2 text-[#008BE3] hover:text-[#0076C2] text-xs font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#008BE3]/30 hover:bg-sky-50 transition-colors"
                      >
                        <Plus size={14} /> Tambah Opsi
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {!isReadOnly && (
                <button
                  onClick={addStep1Question}
                  className="w-full py-3 border-2 border-dashed border-[#008BE3]/40 text-[#008BE3] hover:bg-sky-50/50 rounded-xl font-bold text-xs md:text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <Plus size={18} /> Tambah Pertanyaan Penyesuaian Wajar
                </button>
              )}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* STEP 2: Penjelasan Singkat Proyek                                  */}
        {/* =================================================================== */}
        {activeStep === 2 && (
          <div className="p-6 md:p-8 space-y-8">
            <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 font-bold">
                2
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-black text-slate-900">
                  STEP 2: Penjelasan Singkat Proyek
                </h3>
                <p className="text-xs text-blue-900/90 mt-0.5">
                  Petunjuk Skenario Studi Kasus proyek Asesi. Terbagi menjadi{" "}
                  <strong>BLOK A (Hal yang Harus Disiapkan/Dihasilkan)</strong>{" "}
                  dan <strong>BLOK B (Hal yang Perlu Didemonstrasikan)</strong>.{" "}
                  <em>TIDAK ADA input jawaban Asesi pada step ini.</em>
                </p>
              </div>
            </div>

            {/* BLOK A: Hal yang Harus Disiapkan/Dihasilkan */}
            <div className="border border-blue-200 rounded-2xl p-6 bg-linear-to-b from-blue-50/30 to-white space-y-6">
              <div className="flex items-center gap-2.5 pb-3 border-b border-blue-100">
                <span className="px-3 py-1 bg-blue-600 text-white rounded-lg font-black text-xs font-mono">
                  BLOK A
                </span>
                <h4 className="text-base font-black text-slate-900">
                  Hal yang Harus Disiapkan / Dihasilkan oleh Asesi
                </h4>
              </div>

              {/* 1. Skenario Studi Kasus Textarea */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800 text-xs md:text-sm flex items-center gap-1.5">
                  <span className="text-rose-500">*</span> 1. Skenario Studi
                  Kasus (Latar Belakang Perusahaan)
                </label>
                <textarea
                  value={formData.step2.blokA.skenarioStudiKasus}
                  onChange={(e) =>
                    updateStep2BlokAField("skenarioStudiKasus", e.target.value)
                  }
                  disabled={isReadOnly}
                  rows={4}
                  placeholder="Jelaskan latar belakang perusahaan, konteks proyek, dan peran Asesi..."
                  className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-[#008BE3] text-sm bg-white font-medium text-slate-800"
                />
              </div>

              {/* 2. Dynamic List: Informasi yang Diberikan */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 text-xs md:text-sm flex items-center gap-1.5">
                    <span className="text-rose-500">*</span> 2. Informasi yang
                    Diberikan (Dynamic List)
                  </label>
                  <span className="text-xs text-slate-400 font-mono">
                    {formData.step2.blokA.informasiYangDiberikan.length} Item
                  </span>
                </div>
                <div className="space-y-2">
                  {formData.step2.blokA.informasiYangDiberikan.map(
                    (infoItem, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="w-6 text-center font-mono font-bold text-xs text-blue-600">
                          {String.fromCharCode(97 + idx)}.
                        </span>
                        <input
                          type="text"
                          value={infoItem}
                          onChange={(e) =>
                            updateStep2BlokAArrayItem(
                              "informasiYangDiberikan",
                              idx,
                              e.target.value,
                            )
                          }
                          disabled={isReadOnly}
                          placeholder="Contoh: Topologi fisik awal dan peta alokasi IP Address..."
                          className="flex-1 p-2.5 border border-gray-300 rounded-lg text-xs md:text-sm outline-none focus:border-[#008BE3] bg-white font-medium"
                        />
                        {formData.step2.blokA.informasiYangDiberikan.length >
                          1 &&
                          !isReadOnly && (
                            <button
                              onClick={() =>
                                removeStep2BlokAArrayItem(
                                  "informasiYangDiberikan",
                                  idx,
                                )
                              }
                              className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                      </div>
                    ),
                  )}
                  {!isReadOnly && (
                    <button
                      onClick={() =>
                        addStep2BlokAArrayItem("informasiYangDiberikan")
                      }
                      className="mt-1 text-[#008BE3] hover:text-[#0076C2] text-xs font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#008BE3]/30 hover:bg-sky-50 transition-colors"
                    >
                      <Plus size={14} /> Tambah Informasi
                    </button>
                  )}
                </div>
              </div>

              {/* 3. Dynamic List: Lingkup Bahasan Studi Kasus */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 text-xs md:text-sm flex items-center gap-1.5">
                    <span className="text-rose-500">*</span> 3. Lingkup Bahasan
                    Studi Kasus (Dynamic List Topik)
                  </label>
                  <span className="text-xs text-slate-400 font-mono">
                    {formData.step2.blokA.lingkupBahasanStudiKasus.length} Topik
                  </span>
                </div>
                <div className="space-y-2">
                  {formData.step2.blokA.lingkupBahasanStudiKasus.map(
                    (topicItem, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded font-mono font-bold text-[10px] shrink-0">
                          Topic {idx + 1}
                        </span>
                        <input
                          type="text"
                          value={topicItem}
                          onChange={(e) =>
                            updateStep2BlokAArrayItem(
                              "lingkupBahasanStudiKasus",
                              idx,
                              e.target.value,
                            )
                          }
                          disabled={isReadOnly}
                          placeholder="Contoh: Topic 1: Perancangan Hirarki Topologi Jaringan..."
                          className="flex-1 p-2.5 border border-gray-300 rounded-lg text-xs md:text-sm outline-none focus:border-[#008BE3] bg-white font-medium"
                        />
                        {formData.step2.blokA.lingkupBahasanStudiKasus.length >
                          1 &&
                          !isReadOnly && (
                            <button
                              onClick={() =>
                                removeStep2BlokAArrayItem(
                                  "lingkupBahasanStudiKasus",
                                  idx,
                                )
                              }
                              className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                      </div>
                    ),
                  )}
                  {!isReadOnly && (
                    <button
                      onClick={() =>
                        addStep2BlokAArrayItem("lingkupBahasanStudiKasus")
                      }
                      className="mt-1 text-[#008BE3] hover:text-[#0076C2] text-xs font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#008BE3]/30 hover:bg-sky-50 transition-colors"
                    >
                      <Plus size={14} /> Tambah Lingkup Bahasan
                    </button>
                  )}
                </div>
              </div>

              {/* 4. Textarea: Perlengkapan & Bahan */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800  text-xs md:text-sm flex items-center gap-1.5">
                  <span className="text-rose-500">*</span> 4. Perlengkapan &
                  Bahan (Peralatan, HVS, Format PPT)
                </label>
                <textarea
                  value={formData.step2.blokA.perlengkapanDanBahan}
                  onChange={(e) =>
                    updateStep2BlokAField(
                      "perlengkapanDanBahan",
                      e.target.value,
                    )
                  }
                  disabled={isReadOnly}
                  rows={2}
                  placeholder="Detail laptop, simulator software, kertas A4 HVS, alat tulis, lembar bukti..."
                  className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-[#008BE3] text-sm bg-white font-medium text-slate-800"
                />
              </div>
            </div>

            {/* BLOK B: Hal yang Perlu Didemonstrasikan */}
            <div className="border border-purple-200 rounded-2xl p-6 bg-linear-to-b from-purple-50/30 to-white space-y-6">
              <div className="flex items-center gap-2.5 pb-3 border-b border-purple-100">
                <span className="px-3 py-1 bg-purple-700 text-white rounded-lg font-black text-xs font-mono">
                  BLOK B
                </span>
                <h4 className="text-base font-black text-slate-900">
                  Hal yang Perlu Didemonstrasikan oleh Asesi
                </h4>
              </div>

              {/* 1. Dynamic List: Fokus Presentasi */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 text-xs md:text-sm flex items-center gap-1.5">
                    <span className="text-rose-500">*</span> 1. Fokus Presentasi
                    & Demonstrasi (Dynamic List)
                  </label>
                  <span className="text-xs text-slate-400 font-mono">
                    {formData.step2.blokB.fokusPresentasi.length} Poin
                  </span>
                </div>
                <div className="space-y-2">
                  {formData.step2.blokB.fokusPresentasi.map(
                    (fokusItem, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="w-6 text-center font-mono font-bold text-xs text-purple-700">
                          {String.fromCharCode(97 + idx)}.
                        </span>
                        <input
                          type="text"
                          value={fokusItem}
                          onChange={(e) =>
                            updateStep2BlokBArrayItem(
                              "fokusPresentasi",
                              idx,
                              e.target.value,
                            )
                          }
                          disabled={isReadOnly}
                          placeholder="Contoh: a. Demonstrasi Perancangan & Alasan Pemilihan Topologi..."
                          className="flex-1 p-2.5 border border-gray-300 rounded-lg text-xs md:text-sm outline-none focus:border-[#008BE3] bg-white font-medium"
                        />
                        {formData.step2.blokB.fokusPresentasi.length > 1 &&
                          !isReadOnly && (
                            <button
                              onClick={() =>
                                removeStep2BlokBArrayItem(
                                  "fokusPresentasi",
                                  idx,
                                )
                              }
                              className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                      </div>
                    ),
                  )}
                  {!isReadOnly && (
                    <button
                      onClick={() => addStep2BlokBArrayItem("fokusPresentasi")}
                      className="mt-1 text-purple-700 hover:text-purple-800 text-xs font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-purple-300 hover:bg-purple-50 transition-colors"
                    >
                      <Plus size={14} /> Tambah Fokus Presentasi
                    </button>
                  )}
                </div>
              </div>

              {/* 2. Textarea: Ketentuan Alokasi Waktu */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800  text-xs md:text-sm flex items-center gap-1.5">
                  <span className="text-rose-500">*</span> 2. Ketentuan Alokasi
                  Waktu (e.g. Total 60m: 30m penyajian + 30m tanya jawab)
                </label>
                <textarea
                  value={formData.step2.blokB.ketentuanAlokasiWaktu}
                  onChange={(e) =>
                    updateStep2BlokBField(
                      "ketentuanAlokasiWaktu",
                      e.target.value,
                    )
                  }
                  disabled={isReadOnly}
                  rows={2}
                  placeholder="Rincian alokasi waktu presentasi demonstrasi dan klarifikasi tanya jawab Asesor..."
                  className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-[#008BE3] text-sm bg-white font-medium text-slate-800"
                />
              </div>

              {/* 3. Dynamic List: Kriteria Evaluasi Asesor */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 text-xs md:text-sm flex items-center gap-1.5">
                    <span className="text-rose-500">*</span> 3. Kriteria
                    Evaluasi Asesor (Dynamic List Indikator)
                  </label>
                  <span className="text-xs text-slate-400 font-mono">
                    {formData.step2.blokB.kriteriaEvaluasiAsesor.length}{" "}
                    Indikator
                  </span>
                </div>
                <div className="space-y-2">
                  {formData.step2.blokB.kriteriaEvaluasiAsesor.map(
                    (kriteriaItem, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="w-6 text-center font-mono font-bold text-xs text-purple-700">
                          #{idx + 1}
                        </span>
                        <input
                          type="text"
                          value={kriteriaItem}
                          onChange={(e) =>
                            updateStep2BlokBArrayItem(
                              "kriteriaEvaluasiAsesor",
                              idx,
                              e.target.value,
                            )
                          }
                          disabled={isReadOnly}
                          placeholder="Contoh: Ketepatan rancangan topologi dan ketersediaan tinggi..."
                          className="flex-1 p-2.5 border border-gray-300 rounded-lg text-xs md:text-sm outline-none focus:border-[#008BE3] bg-white font-medium"
                        />
                        {formData.step2.blokB.kriteriaEvaluasiAsesor.length >
                          1 &&
                          !isReadOnly && (
                            <button
                              onClick={() =>
                                removeStep2BlokBArrayItem(
                                  "kriteriaEvaluasiAsesor",
                                  idx,
                                )
                              }
                              className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                      </div>
                    ),
                  )}
                  {!isReadOnly && (
                    <button
                      onClick={() =>
                        addStep2BlokBArrayItem("kriteriaEvaluasiAsesor")
                      }
                      className="mt-1 text-purple-700 hover:text-purple-800 text-xs font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-purple-300 hover:bg-purple-50 transition-colors"
                    >
                      <Plus size={14} /> Tambah Kriteria Evaluasi
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* STEP 3: Penilaian Proyek Singkat                                   */}
        {/* =================================================================== */}
        {activeStep === 3 && (
          <div className="p-6 md:p-8 space-y-6">
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 font-bold">
                3
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-black text-slate-900">
                  STEP 3: Penilaian Proyek Singkat
                </h3>
                <p className="text-xs text-emerald-900/90 mt-0.5">
                  Menggunakan <strong>Nested Array</strong> (Satu Lingkup
                  Penyajian dapat memiliki BANYAK Pertanyaan). Kelola Lingkup
                  Penyajian dan Sub-Pertanyaan studi kasus terkait KUK.
                </p>
              </div>
            </div>

            {/* NESTED LINGKUP PENYAJIAN ARRAY */}
            <div className="space-y-8">
              {formData.step3.lingkups.map((lingkup, lIdx) => (
                <div
                  key={lingkup.id}
                  className="border-2 border-emerald-200 rounded-2xl p-6 bg-slate-50/60 space-y-6 shadow-2xs"
                >
                  {/* Lingkup Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-emerald-200/80">
                    <div className="flex items-center gap-2 text-slate-900 font-black text-sm md:text-base flex-1">
                      <span className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-mono text-xs">
                        Lingkup #{lIdx + 1}
                      </span>
                      <input
                        type="text"
                        value={lingkup.namaLingkup}
                        onChange={(e) =>
                          updateStep3LingkupNama(lingkup.id, e.target.value)
                        }
                        disabled={isReadOnly}
                        placeholder={`Masukkan Nama Lingkup Penyajian #${lIdx + 1}...`}
                        className="flex-1 p-2.5 border border-gray-300 rounded-lg outline-none focus:border-[#008BE3] font-bold text-slate-900 bg-white text-sm"
                      />
                    </div>

                    {formData.step3.lingkups.length > 1 && !isReadOnly && (
                      <button
                        onClick={() => removeStep3Lingkup(lingkup.id)}
                        className="text-rose-600 hover:text-rose-700 px-3 py-1.5 rounded-lg hover:bg-rose-50 border border-rose-200 transition-colors flex items-center gap-1.5 text-xs font-bold shrink-0 self-start sm:self-auto"
                      >
                        <Trash2 size={15} /> Hapus Lingkup Ini
                      </button>
                    )}
                  </div>

                  {/* SUB-PERTANYAAN ARRAY IN THIS LINGKUP */}
                  <div className="space-y-5 pl-2 md:pl-4 border-l-2 border-emerald-300">
                    <div className="flex items-center justify-between text-xs font-extrabold text-slate-700">
                      <span>
                        Daftar Sub-Pertanyaan pada{" "}
                        {lingkup.namaLingkup || `Lingkup #${lIdx + 1}`}:
                      </span>
                      <span className="text-slate-400 font-mono">
                        {lingkup.subPertanyaans.length} Soal
                      </span>
                    </div>

                    {lingkup.subPertanyaans.map((sub, subIdx) => (
                      <div
                        key={sub.id}
                        className="bg-white border border-gray-200 rounded-xl p-4 md:p-5 space-y-4 shadow-2xs"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-xs font-black text-[#008BE3] bg-sky-50 border border-sky-200 px-2.5 py-1 rounded-md font-mono">
                            Sub-Pertanyaan #{subIdx + 1}
                          </span>
                          {lingkup.subPertanyaans.length > 1 && !isReadOnly && (
                            <button
                              onClick={() =>
                                removeStep3SubPertanyaan(lingkup.id, sub.id)
                              }
                              className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                              title="Hapus Sub-Pertanyaan"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>

                        {/* Skenario & Teks Pertanyaan */}
                        <div className="space-y-1">
                          <label className="font-bold text-slate-800 text-xs block">
                            <span className="text-rose-500">*</span> Skenario &
                            Teks Pertanyaan
                          </label>
                          <textarea
                            value={sub.skenarioPertanyaan}
                            onChange={(e) =>
                              updateStep3SubPertanyaan(
                                lingkup.id,
                                sub.id,
                                "skenarioPertanyaan",
                                e.target.value,
                              )
                            }
                            disabled={isReadOnly}
                            rows={3}
                            placeholder="Detail pertanyaan skenario / studi kasus..."
                            className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:border-[#008BE3] text-xs md:text-sm bg-white font-medium text-slate-800"
                          />
                        </div>

                        {/* Standar Kompetensi / KUK Terkait */}
                        <div className="space-y-1">
                          <label className="font-bold text-slate-800 text-xs block">
                            Standar Kompetensi / Kode KUK Terkait
                          </label>
                          <Select
                            isDisabled={isReadOnly}
                            isMulti
                            options={availableKUKOptions.map((k) => ({
                              value: k,
                              label: k,
                            }))}
                            value={sub.kodeKUK.map((k) => ({
                              value: k,
                              label: k,
                            }))}
                            onChange={(selected) => {
                              const selectedOptions = (selected ||
                                []) as Array<{
                                value: string;
                                label: string;
                              }>;
                              updateStep3SubPertanyaan(
                                lingkup.id,
                                sub.id,
                                "kodeKUK",
                                selectedOptions.map((s) => s.value),
                              );
                            }}
                            className="basic-multi-select text-xs font-mono"
                            placeholder="Pilih atau ketik Kode KUK..."
                            menuPortalTarget={
                              typeof document !== "undefined"
                                ? document.body
                                : null
                            }
                            styles={{
                              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                            }}
                          />
                        </div>

                        {/* Ekspektasi Tanggapan / Jawaban */}
                        <div className="space-y-1">
                          <label className="font-bold text-slate-800 text-xs block">
                            Ekspektasi Tanggapan / Jawaban Asesi
                          </label>
                          <textarea
                            value={sub.ekspektasiTanggapan}
                            onChange={(e) =>
                              updateStep3SubPertanyaan(
                                lingkup.id,
                                sub.id,
                                "ekspektasiTanggapan",
                                e.target.value,
                              )
                            }
                            disabled={isReadOnly}
                            rows={2}
                            placeholder="Tuliskan ekspektasi jawaban / solusi yang diharapkan dari Asesi..."
                            className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:border-[#008BE3] text-xs md:text-sm bg-white font-medium text-slate-800"
                          />
                        </div>
                      </div>
                    ))}

                    {!isReadOnly && (
                      <button
                        onClick={() => addStep3SubPertanyaan(lingkup.id)}
                        className="text-emerald-700 hover:text-emerald-800 text-xs font-bold flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-emerald-300 bg-white hover:bg-emerald-50 transition-colors shadow-2xs"
                      >
                        <Plus size={15} /> + Tambah Pertanyaan pada Lingkup Ini
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {!isReadOnly && (
                <button
                  onClick={addStep3Lingkup}
                  className="w-full py-3.5 border-2 border-dashed border-emerald-600/40 text-emerald-700 hover:bg-emerald-50/60 rounded-2xl font-bold text-xs md:text-sm flex items-center justify-center gap-2 transition-colors shadow-2xs"
                >
                  <Plus size={18} /> + Tambah Lingkup Penyajian Baru
                </button>
              )}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* STEP 4: Pertanyaan Lisan                                            */}
        {/* =================================================================== */}
        {activeStep === 4 && (
          <div className="p-6 md:p-8 space-y-6">
            <div className="bg-purple-50/80 border border-purple-200 rounded-xl p-4 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-700 text-white flex items-center justify-center shrink-0 font-bold">
                4
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-black text-slate-900">
                  STEP 4: Pertanyaan Lisan
                </h3>
                <p className="text-xs text-purple-900/90 mt-0.5">
                  Input daftar pertanyaan lisan beserta pemetaan KUK.{" "}
                  <strong>KUNCI JAWABAN WAJIB DIISI</strong> oleh Asesor sebagai
                  tolok ukur penilaian objektif.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {formData.step4.questions.map((q, qIdx) => (
                <div
                  key={q.id}
                  className="border border-purple-200 rounded-xl p-5 md:p-6 bg-purple-50/20 space-y-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                      <span className="w-7 h-7 rounded-lg bg-purple-700 text-white flex items-center justify-center font-mono text-xs">
                        P{qIdx + 1}
                      </span>
                      <span>Pertanyaan Lisan</span>
                    </div>

                    {formData.step4.questions.length > 1 && !isReadOnly && (
                      <button
                        onClick={() => removeStep4Question(q.id)}
                        className="text-rose-600 hover:text-rose-700 p-1.5 rounded-lg hover:bg-rose-50 transition-colors flex items-center gap-1 text-xs font-bold"
                      >
                        <Trash2 size={15} /> Hapus Pertanyaan
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5 md:col-span-1">
                      <label className="font-bold text-slate-700 block text-xs">
                        Kode Reference KUK
                      </label>
                      <input
                        type="text"
                        value={q.kodeKUKRef}
                        onChange={(e) =>
                          updateStep4Question(
                            q.id,
                            "kodeKUKRef",
                            e.target.value,
                          )
                        }
                        disabled={isReadOnly}
                        placeholder="e.g. J.611000.001.01 E1/KUK 1.3"
                        className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:border-[#008BE3] text-xs font-mono font-bold text-slate-800 bg-white"
                      />
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="font-bold text-slate-700 block text-xs">
                        <span className="text-rose-500">*</span> Pertanyaan
                        Lisan
                      </label>
                      <textarea
                        value={q.pertanyaanLisan}
                        onChange={(e) =>
                          updateStep4Question(
                            q.id,
                            "pertanyaanLisan",
                            e.target.value,
                          )
                        }
                        disabled={isReadOnly}
                        rows={2}
                        placeholder="Teks pertanyaan lisan yang disampaikan Asesor..."
                        className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:border-[#008BE3] text-xs md:text-sm bg-white font-medium text-slate-800"
                      />
                    </div>

                    {/* Key Answer Textarea (Required) */}
                    <div className="space-y-1.5 md:col-span-3 bg-purple-100/50 p-3.5 border border-purple-200 rounded-lg">
                      <label className="font-extrabold text-purple-900 text-xs flex items-center gap-1.5">
                        <KeyIcon size={14} className="text-purple-700" />
                        <span className="text-rose-500">*</span> KUNCI JAWABAN
                        (Wajib Diisi oleh Asesor)
                      </label>
                      <textarea
                        value={q.kunciJawaban}
                        onChange={(e) =>
                          updateStep4Question(
                            q.id,
                            "kunciJawaban",
                            e.target.value,
                          )
                        }
                        disabled={isReadOnly}
                        rows={3}
                        placeholder="Tuliskan kunci jawaban resmi/standar tolok ukur penilaian..."
                        className="w-full p-2.5 border border-purple-300 rounded-lg outline-none focus:border-purple-600 text-xs md:text-sm bg-white font-medium text-slate-900"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {!isReadOnly && (
                <button
                  onClick={addStep4Question}
                  className="w-full py-3 border-2 border-dashed border-purple-400/50 text-purple-700 hover:bg-purple-50/50 rounded-xl font-bold text-xs md:text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <Plus size={18} /> Tambah Pertanyaan Lisan
                </button>
              )}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* STEP 5: Finalisasi & Review Preview                                 */}
        {/* =================================================================== */}
        {activeStep === 5 && (
          <div className="p-6 md:p-8 space-y-8">
            <div className="bg-emerald-500/10 border border-emerald-300 rounded-2xl p-5 flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 font-bold shadow-xs">
                5
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-black text-slate-900">
                  STEP 5: Finalisasi & Review Preview
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Tinjau seluruh konfigurasi instrumen dari Step 1 hingga Step 4
                  sebelum diterbitkan.
                </p>
              </div>
            </div>

            {/* SUMMARY CARDS */}
            <div className="space-y-6">
              {/* Metadata Summary */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
                <h4 className="font-black text-slate-900 text-sm flex items-center gap-2">
                  <Settings size={16} className="text-[#008BE3]" />
                  Informasi Konfigurasi & Metadata
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="min-w-0">
                    <span className="text-slate-400">Nama:</span>{" "}
                    <strong className="text-slate-900">
                      {formData.metadata.namaKonfigurasi}
                    </strong>
                  </div>
                  <div className="min-w-0">
                    <span className="text-slate-400">Skema:</span>{" "}
                    <strong className="text-slate-900">
                      {
                        skemaOptions.find(
                          (s) => s.value === formData.metadata.skemaSertifikasi,
                        )?.label
                      }
                    </strong>
                  </div>
                  <div className="min-w-0">
                    <span className="text-slate-400">Versi:</span>{" "}
                    <span className="font-mono">{formData.metadata.versi}</span>
                  </div>
                  <div className="min-w-0">
                    <span className="text-slate-400">Default:</span>{" "}
                    <span className="font-bold">
                      {formData.metadata.isDefault ? "Ya" : "Tidak"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Step 1 Preview */}
              <div className="border border-sky-200 rounded-xl p-5 bg-sky-50/30 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-slate-900 text-sm flex items-center gap-2">
                    <CheckSquare size={16} className="text-[#008BE3]" />
                    Step 1: Penyesuaian Wajar ({
                      formData.step1.questions.length
                    }{" "}
                    Pertanyaan)
                  </h4>
                  <button
                    onClick={() => setActiveStep(1)}
                    className="text-xs font-bold text-[#008BE3] hover:underline"
                  >
                    Edit Step 1
                  </button>
                </div>
                {formData.step1.questions.map((q, idx) => (
                  <div
                    key={q.id}
                    className="bg-white p-3.5 border border-sky-100 rounded-lg text-xs space-y-2"
                  >
                    <p className="font-bold text-slate-900">
                      {idx + 1}. {q.pertanyaanText}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-3">
                      {q.options.map((opt, oIdx) => (
                        <div
                          key={opt.id}
                          className={`p-2 rounded border text-xs flex items-center gap-2 ${opt.isValid ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-gray-50 border-gray-200 text-gray-600"}`}
                        >
                          <input
                            type="checkbox"
                            checked={opt.isValid}
                            readOnly
                            className="rounded text-emerald-600"
                          />
                          <span>
                            {String.fromCharCode(65 + oIdx)}. {opt.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Step 2 Preview: FR.IA.04A */}
              <div className="border border-blue-200 rounded-xl p-5 bg-blue-50/30 space-y-4">
                <div className="flex items-center justify-between border-b border-blue-200 pb-2">
                  <h4 className="font-black text-slate-900 text-sm flex items-center gap-2">
                    <FileSpreadsheet size={16} className="text-blue-600" />
                    Step 2: Penjelasan Singkat Proyek (FR.IA.04A)
                  </h4>
                  <button
                    onClick={() => setActiveStep(2)}
                    className="text-xs font-bold text-blue-600 hover:underline"
                  >
                    Edit Step 2
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-white p-4 border border-blue-100 rounded-lg space-y-2">
                    <span className="font-black text-blue-700 block">
                      BLOK A: Hal yang Harus Disiapkan
                    </span>
                    <p>
                      <strong>Skenario:</strong>{" "}
                      {formData.step2.blokA.skenarioStudiKasus}
                    </p>
                    <p>
                      <strong>Informasi Diberikan:</strong>{" "}
                      {formData.step2.blokA.informasiYangDiberikan.length} Poin
                    </p>
                    <p>
                      <strong>Lingkup Bahasan:</strong>{" "}
                      {formData.step2.blokA.lingkupBahasanStudiKasus.length}{" "}
                      Topik
                    </p>
                    <p>
                      <strong>Perlengkapan:</strong>{" "}
                      {formData.step2.blokA.perlengkapanDanBahan}
                    </p>
                  </div>

                  <div className="bg-white p-4 border border-purple-100 rounded-lg space-y-2">
                    <span className="font-black text-purple-700 block">
                      BLOK B: Hal yang Didemonstrasikan
                    </span>
                    <p>
                      <strong>Fokus Presentasi:</strong>{" "}
                      {formData.step2.blokB.fokusPresentasi.length} Poin
                    </p>
                    <p>
                      <strong>Alokasi Waktu:</strong>{" "}
                      {formData.step2.blokB.ketentuanAlokasiWaktu}
                    </p>
                    <p>
                      <strong>Kriteria Evaluasi:</strong>{" "}
                      {formData.step2.blokB.kriteriaEvaluasiAsesor.length}{" "}
                      Indikator
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 3 Preview: FR.IA.04B */}
              <div className="border border-emerald-200 rounded-xl p-5 bg-emerald-50/30 space-y-4">
                <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                  <h4 className="font-black text-slate-900 text-sm flex items-center gap-2">
                    <ListTodo size={16} className="text-emerald-600" />
                    Step 3: Penilaian Proyek Singkat - FR.IA.04B (
                    {formData.step3.lingkups.length} Lingkup)
                  </h4>
                  <button
                    onClick={() => setActiveStep(3)}
                    className="text-xs font-bold text-emerald-600 hover:underline"
                  >
                    Edit Step 3
                  </button>
                </div>

                {formData.step3.lingkups.map((lingkup) => (
                  <div
                    key={lingkup.id}
                    className="bg-white p-4 border border-emerald-200 rounded-lg space-y-3"
                  >
                    <div className="font-black text-slate-900 text-xs bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-md">
                      {lingkup.namaLingkup}
                    </div>
                    <div className="space-y-2 pl-2">
                      {lingkup.subPertanyaans.map((sub, sIdx) => (
                        <div
                          key={sub.id}
                          className="text-xs p-3 border border-gray-100 rounded-md bg-slate-50 space-y-1"
                        >
                          <p className="font-bold text-slate-800">
                            Sub #{sIdx + 1}: {sub.skenarioPertanyaan}
                          </p>
                          {sub.kodeKUK.length > 0 && (
                            <p className="text-[11px] text-emerald-700 font-mono">
                              KUK: {sub.kodeKUK.join(", ")}
                            </p>
                          )}
                          <p className="text-[11px] text-slate-500">
                            Ekspektasi: {sub.ekspektasiTanggapan}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Step 4 Preview: FR.IA.07 */}
              <div className="border border-purple-200 rounded-xl p-5 bg-purple-50/30 space-y-3">
                <div className="flex items-center justify-between border-b border-purple-200 pb-2">
                  <h4 className="font-black text-slate-900 text-sm flex items-center gap-2">
                    <MessageSquare size={16} className="text-purple-700" />
                    Step 4: Pertanyaan Lisan - FR.IA.07 (
                    {formData.step4.questions.length} Pertanyaan)
                  </h4>
                  <button
                    onClick={() => setActiveStep(4)}
                    className="text-xs font-bold text-purple-700 hover:underline"
                  >
                    Edit Step 4
                  </button>
                </div>

                {formData.step4.questions.map((q, idx) => (
                  <div
                    key={q.id}
                    className="bg-white p-3.5 border border-purple-100 rounded-lg text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">
                        {idx + 1}. {q.pertanyaanLisan}
                      </span>
                      <span className="text-[10px] font-mono bg-purple-50 text-purple-700 px-2 py-0.5 rounded border border-purple-200">
                        {q.kodeKUKRef}
                      </span>
                    </div>
                    <div className="p-2 bg-purple-50 border border-purple-200 rounded text-purple-950 font-medium">
                      <strong>Kunci Jawaban:</strong> {q.kunciJawaban}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEPPER FOOTER BUTTONS (SEBELUMNYA / SELANJUTNYA) */}
        <div className="p-4 md:p-6 bg-slate-50 border-t border-gray-200 flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrevStep}
            disabled={activeStep === 1}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs md:text-sm flex items-center gap-2 transition-all ${
              activeStep === 1
                ? "opacity-40 cursor-not-allowed text-gray-400 bg-gray-100"
                : "bg-white border border-gray-300 text-slate-700 hover:bg-gray-100 shadow-2xs"
            }`}
          >
            <ChevronLeft size={18} /> Sebelumnya
          </button>

          <div className="text-xs font-bold text-slate-400 font-mono hidden sm:block">
            Step {activeStep} dari 5
          </div>

          {activeStep < 5 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="px-6 py-2.5 bg-[#008BE3] hover:bg-[#0076C2] text-white rounded-xl font-bold text-xs md:text-sm flex items-center gap-2 transition-all shadow-sm"
            >
              Selanjutnya <ChevronRight size={18} />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleSaveToContext("published")}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs md:text-sm flex items-center gap-2 transition-all shadow-sm"
            >
              <Send size={16} /> Publish Konfigurasi
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Small Icon Helper
function KeyIcon({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 2l-2 2m-1.5 1.5l-3 3m-1.5 1.5l-3 3M3 21l6.5-6.5" />
      <circle cx="16.5" cy="7.5" r="3.5" />
    </svg>
  );
}
