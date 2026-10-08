/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Trash2,
  Plus,
  Check,
  ChevronRight,
  ChevronLeft,
  ListTodo,
  MessageSquare,
  Send,
  Save,
  AlertCircle,
  Settings,
  CheckCircle2,
  ShieldCheck,
  FileSpreadsheet,
  Eye,
  X,
  FileText,
  Loader2,
} from "lucide-react";
import { useAppContext } from "@/context/context";
import { FormFRIA04A } from "@/components/forms/FormFRIA04A";
import { FormFRIA04B } from "@/components/forms/FormFRIA04B";
import { FormFRIA07 } from "@/components/forms/FormFRIA07";
import {
  ConfigurationMetadata,
  Step2BlokA,
  Step2BlokB,
  Step3LingkupPenyajian,
  Step3SubPertanyaan,
  Step4Question,
  WizardFormState,
} from "@/types/types";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import {
  createKonfigurasiPertanyaan,
  getSkemaList,
  getAllUsers,
  getKonfigurasiPertanyaanDetail,
  updateKonfigurasiPertanyaanAPI,
  updateKonfigurasiStep2API,
  updateKonfigurasiStep3API,
  updateKonfigurasiStep4API,
} from "@/lib/api";
const Select = dynamic(() => import("react-select"), { ssr: false });
// Dummy options removed. Skema options now loaded dynamically.

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

const initialWizardState: WizardFormState = {
  metadata: {
    namaKonfigurasi: "",
    skemaSertifikasi: "",
    versi: "1.0",
    isDefault: false,
  },
  step2: {
    type: "INSTRUCTION_SCENARIO",
    penyusun: [],
    validator: [],
    supervisor: [],
    blokA: {
      skenarioStudiKasus: "",
      informasiYangDiberikan: [""],
      lingkupBahasanStudiKasus: [""],
      perlengkapanDanBahan: "",
    },
    blokB: {
      fokusPresentasi: [""],
      ketentuanAlokasiWaktu: "",
      kriteriaEvaluasiAsesor: [""],
    },
  },
  step3: {
    type: "NESTED_ESSAY_PROYEK",
    penyusun: [],
    validator: [],
    lingkups: [],
  },
  step4: {
    type: "ESSAY_WITH_KEY_ANSWER",
    penyusun: [],
    validator: [],
    questions: [],
  },
};

// ============================================================================
// MAIN COMPONENT: TambahKonfigurasiPertanyaan Wizard
// ============================================================================

function TambahKonfigurasiPertanyaanContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    addKonfigurasiPertanyaan,
    updateKonfigurasiPertanyaan,
    konfigurasiPertanyaan,
  } = useAppContext();
  const [skemaOptions, setSkemaOptions] = useState<
    { value: string; label: string; kode?: string }[]
  >([]);
  const [assessorOptions, setAssessorOptions] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [skemaRes, usersRes] = await Promise.all([
          getSkemaList(true).catch(() => []),
          getAllUsers().catch(() => []),
        ]);

        if (Array.isArray(skemaRes)) {
          setSkemaOptions(
            skemaRes.map((s: Record<string, string | number | undefined>) => ({
              value: String(
                s.id?.toString() ||
                s.kodeSkema ||
                s.namaSkema ||
                s.name ||
                s.id ||
                "",
              ),
              label: String(
                `${s.kodeSkema || s.kode || s.code || ""} - ${s.namaSkema || s.nama || s.name || ""}`
                  .replace(/^- | -$/g, "")
                  .trim() ||
                s.name ||
                "",
              ),
              kode: String(s.kodeSkema || s.kode || s.code || ""),
            })),
          );
        }

        const usersList = Array.isArray(usersRes)
          ? usersRes
          : usersRes &&
            typeof usersRes === "object" &&
            "data" in usersRes &&
            Array.isArray((usersRes as { data: unknown[] }).data)
            ? (usersRes as { data: unknown[] }).data
            : [];

        type UserItem = {
          role?: string;
          id?: string | number;
          username?: string;
          profil?: { namaLengkap?: string };
        };
        const assessors = (usersList as UserItem[]).filter(
          (u) => u.role?.toLowerCase() === "asesor",
        );
        setAssessorOptions(
          assessors.map((a) => ({
            value: a.id?.toString() || a.username || "",
            label: `${a.profil?.namaLengkap || a.username || "Unknown"} (Asesor)`,
          })),
        );
      } catch (e) {
        console.error(e);
      }
    }
    fetchData();
  }, []);

  // Active step state (1 to 5)s
  const [activeStep, setActiveStep] = useState<number>(1);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSuccessToast, setIsSuccessToast] = useState<string | null>(null);
  const konfigurasiId = searchParams.get("id");
  const mode = searchParams.get("mode")?.trim();
  const isReadOnly = mode === "view";
  const isEdit = mode === "edit" || (!!konfigurasiId && !isReadOnly);
  const [savingStep, setSavingStep] = useState<number | null>(null);
  // Central Wizard Form State
  const [formData, setFormData] = useState<WizardFormState>(initialWizardState);

  // Preview Modal State
  const [previewForm, setPreviewForm] = useState<string | null>(null);
  const [isPreviewMenuOpen, setIsPreviewMenuOpen] = useState(false);

  const currentPreviewData = {
    step2: {
      skenario_studi_kasus: formData.step2.blokA.skenarioStudiKasus,
      informasi_yang_diberikan: formData.step2.blokA.informasiYangDiberikan,
      lingkup_bahasan_studi_kasus:
        formData.step2.blokA.lingkupBahasanStudiKasus,
      perlengkapan_dan_bahan: formData.step2.blokA.perlengkapanDanBahan,
      fokus_presentasi: formData.step2.blokB.fokusPresentasi,
      ketentuan_alokasi_waktu: formData.step2.blokB.ketentuanAlokasiWaktu,
    },
    step3: formData.step3.lingkups.map((l) => ({
      nama_lingkup: l.namaLingkup,
      sub_pertanyaan: l.subPertanyaans.map((sp) => ({
        skenario_pertanyaan: sp.skenarioPertanyaan,
        kode_kuk: sp.kodeKUK,
        ekspektasi_tanggapan: sp.ekspektasiTanggapan,
      })),
    })),
    step4: formData.step4.questions.map((q) => ({
      pertanyaan_lisan: q.pertanyaanLisan,
      kode_kuk_ref: q.kodeKUKRef,
      kunci_jawaban: q.kunciJawaban,
    })),
  };

  // Load existing data if editing or viewing detail
  useEffect(() => {
    if ((isEdit || isReadOnly) && konfigurasiId) {
      async function loadExistingData() {
        try {
          const detail = await getKonfigurasiPertanyaanDetail(
            Number(konfigurasiId),
          );
          if (detail) {
            setFormData((prev) => {
              const formatPenyusun = (
                list: {
                  user_id?: string | number;
                  nama?: string;
                  users?: any;
                }[],
              ) => {
                if (!list) return [];
                return list.map((item) => ({
                  value: String(item.user_id || item.nama || ""),
                  label: String(
                    item.users?.profil?.namaLengkap ||
                    item.users?.username ||
                    item.nama ||
                    "",
                  ),
                  no_met: item.users?.profil?.nomorRegistrasiMet || "-",
                  tanda_tangan: item.users?.profil?.tandaTangan || undefined,
                }));
              };

              const newMetadata = {
                namaKonfigurasi: detail.nama || prev.metadata.namaKonfigurasi,
                skemaSertifikasi: String(
                  detail.skema_id ||
                  detail.skema ||
                  prev.metadata.skemaSertifikasi,
                ),
                versi: detail.versi || "1.0",
                // penyusun and validator loaded per step if available

                isDefault: detail.is_default ?? false,
              };

              const step2Data = detail.konfigurasi_step2_skenario;
              const step2BlokA = step2Data
                ? {
                  skenarioStudiKasus: step2Data.skenario_studi_kasus || "",
                  informasiYangDiberikan:
                    Array.isArray(step2Data.informasi_yang_diberikan) &&
                      step2Data.informasi_yang_diberikan.length > 0
                      ? step2Data.informasi_yang_diberikan
                      : [""],
                  lingkupBahasanStudiKasus:
                    Array.isArray(step2Data.lingkup_bahasan_studi_kasus) &&
                      step2Data.lingkup_bahasan_studi_kasus.length > 0
                      ? step2Data.lingkup_bahasan_studi_kasus
                      : [""],
                  perlengkapanDanBahan:
                    step2Data.perlengkapan_dan_bahan || "",
                }
                : prev.step2.blokA;

              const step2BlokB = step2Data
                ? {
                  fokusPresentasi:
                    Array.isArray(step2Data.fokus_presentasi) &&
                      step2Data.fokus_presentasi.length > 0
                      ? step2Data.fokus_presentasi
                      : [""],
                  ketentuanAlokasiWaktu:
                    step2Data.ketentuan_alokasi_waktu || "",
                  kriteriaEvaluasiAsesor:
                    Array.isArray(step2Data.kriteria_evaluasi_asesor) &&
                      step2Data.kriteria_evaluasi_asesor.length > 0
                      ? step2Data.kriteria_evaluasi_asesor
                      : [""],
                }
                : prev.step2.blokB;

              const step3Lingkups =
                detail.konfigurasi_step3_lingkup?.length > 0
                  ? detail.konfigurasi_step3_lingkup.map(
                    (l: {
                      id?: string | number;
                      nama_lingkup?: string;
                      konfigurasi_step3_sub_pertanyaan?: {
                        id?: string | number;
                        skenario_pertanyaan?: string;
                        kode_kuk?: string[];
                        ekspektasi_tanggapan?: string;
                      }[];
                    }) => ({
                      id: `lingkup-${l.id || Math.random()}`,
                      namaLingkup: l.nama_lingkup || "",
                      subPertanyaans:
                        l.konfigurasi_step3_sub_pertanyaan?.map(
                          (sub: {
                            id?: string | number;
                            skenario_pertanyaan?: string;
                            kode_kuk?: string[];
                            ekspektasi_tanggapan?: string;
                          }) => ({
                            id: `sub-${sub.id || Math.random()}`,
                            skenarioPertanyaan: sub.skenario_pertanyaan || "",
                            kodeKUK: Array.isArray(sub.kode_kuk)
                              ? sub.kode_kuk
                              : [],
                            ekspektasiTanggapan:
                              sub.ekspektasi_tanggapan || "",
                          }),
                        ) || [],
                    }),
                  )
                  : prev.step3.lingkups;

              const step4Questions =
                detail.konfigurasi_step4_pertanyaan?.length > 0
                  ? detail.konfigurasi_step4_pertanyaan.map(
                    (q: {
                      id?: string | number;
                      kode_kuk_ref?: string;
                      pertanyaan_lisan?: string;
                      kunci_jawaban?: string;
                    }) => ({
                      id: `q4-${q.id || Math.random()}`,
                      kodeKUKRef: q.kode_kuk_ref || "",
                      pertanyaanLisan: q.pertanyaan_lisan || "",
                      kunciJawaban: q.kunci_jawaban || "",
                    }),
                  )
                  : prev.step4.questions;

              const getAsesors = (type: string, peran: string) => {
                if (!detail.form_asesor || !Array.isArray(detail.form_asesor))
                  return [];
                return formatPenyusun(
                  detail.form_asesor.filter(
                    (a: any) => a.form_type === type && a.peran === peran,
                  ),
                );
              };

              return {
                ...prev,
                metadata: newMetadata,

                step2: {
                  ...prev.step2,
                  blokA: step2BlokA,
                  blokB: step2BlokB,
                  penyusun: getAsesors("step2", "Penyusun"),
                  validator: getAsesors("step2", "Validator"),
                  supervisor: getAsesors("step2", "Supervisor"),
                },
                step3: {
                  ...prev.step3,
                  lingkups: step3Lingkups,
                  penyusun: getAsesors("step3", "Penyusun"),
                  validator: getAsesors("step3", "Validator"),
                },
                step4: {
                  ...prev.step4,
                  questions: step4Questions,
                  penyusun: getAsesors("step4", "Penyusun"),
                  validator: getAsesors("step4", "Validator"),
                },
              };
            });
          }
        } catch (error) {
          console.error("Gagal memuat detail konfigurasi:", error);
          // Fallback reading from context if backend fetch fails
          const existing = konfigurasiPertanyaan.find(
            (k) => k.id === Number(konfigurasiId),
          );
          if (existing) {
            const existingWithData = existing as unknown as {
              formData?: WizardFormState;
            };
            if (existingWithData.formData) {
              setFormData(existingWithData.formData);
            }
          }
        }
      }
      loadExistingData();
    }
  }, [isEdit, isReadOnly, konfigurasiId, konfigurasiPertanyaan]);

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

    if (step === 2) {
      if (formData.step3.lingkups.length === 0) {
        setValidationError(
          "Form pertanyaan lisan minimal harus memiliki 1 Lingkup Penyajian.",
        );
        return false;
      }
      for (let i = 0; i < formData.step3.lingkups.length; i++) {
        const lingkup = formData.step3.lingkups[i];
        if (!lingkup.namaLingkup.trim()) {
          setValidationError(
            `Nama Lingkup Penyajian #${i + 1} di Form Pertanyaan Lisan wajib diisi.`,
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

    if (step === 3) {
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

  const extractPenyusun = (
    list: any[] | undefined,
    peran: string,
    type: string,
  ) => {
    if (!list) return [];
    return list.map((item) => ({
      peran: peran,
      form_type: type,
      user_id: !isNaN(Number(item.value)) ? Number(item.value) : undefined,
    }));
  };

  const handleSaveSingleForm = async (stepNumber: number) => {
    if (!validateCurrentStep(stepNumber)) {
      return;
    }

    setSavingStep(stepNumber);
    try {
      const configName =
        formData.metadata.namaKonfigurasi.trim() ||
        "Draft Konfigurasi Pertanyaan";
      const skemaId = Number(formData.metadata.skemaSertifikasi) || 1;

      let currentId = konfigurasiId ? Number(konfigurasiId) : null;

      // Jika form baru dan belum ada ID, buat data induk konfigurasi terlebih dahulu
      if (!currentId) {
        const initialCreatePayload = {
          nama: configName,
          skema_id: skemaId,
          tipe_form: "Multi-Step Wizard",
          versi: formData.metadata.versi || "1.0",
          is_default: formData.metadata.isDefault,
          status: "Draft",
          penyusun: [],
          step1: [],
          step2: null,
          step3: [],
          step4: [],
        };
        const created = await createKonfigurasiPertanyaan(initialCreatePayload);
        currentId = created?.id;

        if (currentId) {
          // Update URL query params agar halaman beralih ke mode edit dengan id
          router.replace(
            `/assessor/tambahkonfigurasipertanyaan?id=${currentId}&mode=edit`,
          );
        }
      }

      if (!currentId) {
        throw new Error("Gagal memperoleh ID konfigurasi untuk menyimpan form.");
      }

      if (stepNumber === 1) {
        // Simpan Form FR.IA.04A
        const step2Penyusun = [
          ...extractPenyusun(formData.step2.penyusun, "Penyusun", "step2"),
          ...extractPenyusun(formData.step2.validator, "Validator", "step2"),
          ...extractPenyusun(formData.step2.supervisor, "Supervisor", "step2"),
        ];
        await updateKonfigurasiStep2API(currentId, {
          skenario_studi_kasus: formData.step2.blokA.skenarioStudiKasus,
          informasi_yang_diberikan: formData.step2.blokA.informasiYangDiberikan,
          lingkup_bahasan_studi_kasus:
            formData.step2.blokA.lingkupBahasanStudiKasus,
          perlengkapan_dan_bahan: formData.step2.blokA.perlengkapanDanBahan,
          fokus_presentasi: formData.step2.blokB.fokusPresentasi,
          ketentuan_alokasi_waktu: formData.step2.blokB.ketentuanAlokasiWaktu,
          kriteria_evaluasi_asesor: formData.step2.blokB.kriteriaEvaluasiAsesor,
          penyusun: step2Penyusun,
        });
        setIsSuccessToast("Form FR.IA.04A berhasil disimpan!");
      } else if (stepNumber === 2) {
        // Simpan Form FR.IA.04B
        const step3Penyusun = [
          ...extractPenyusun(formData.step3.penyusun, "Penyusun", "step3"),
          ...extractPenyusun(formData.step3.validator, "Validator", "step3"),
        ];
        await updateKonfigurasiStep3API(currentId, {
          lingkup: formData.step3.lingkups.map((l) => ({
            nama_lingkup: l.namaLingkup,
            sub_pertanyaan: l.subPertanyaans.map((sp) => ({
              skenario_pertanyaan: sp.skenarioPertanyaan,
              kode_kuk: sp.kodeKUK,
              ekspektasi_tanggapan: sp.ekspektasiTanggapan,
            })),
          })),
          penyusun: step3Penyusun,
        });
        setIsSuccessToast("Form FR.IA.04B berhasil disimpan!");
      } else if (stepNumber === 3) {
        // Simpan Form FR.IA.07
        const step4Penyusun = [
          ...extractPenyusun(formData.step4.penyusun, "Penyusun", "step4"),
          ...extractPenyusun(formData.step4.validator, "Validator", "step4"),
        ];
        await updateKonfigurasiStep4API(currentId, {
          pertanyaan_lisan: formData.step4.questions.map((q) => ({
            pertanyaan_lisan: q.pertanyaanLisan,
            kode_kuk_ref: q.kodeKUKRef,
            kunci_jawaban: q.kunciJawaban,
          })),
          penyusun: step4Penyusun,
        });
        setIsSuccessToast("Form FR.IA.07 berhasil disimpan!");
      }

      // Update local context
      const contextPayload = {
        nama: configName,
        skema:
          skemaOptions.find((s) => s.value === formData.metadata.skemaSertifikasi)
            ?.label ||
          formData.metadata.skemaSertifikasi ||
          "Skema Sertifikasi",
        tipeForm: "Multi-Step Wizard",
        versi: formData.metadata.versi,
        isDefault: formData.metadata.isDefault,
        status: "Tidak Aktif" as "Aktif" | "Tidak Aktif",
        formData: formData,
        subPertanyaans: [
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
      updateKonfigurasiPertanyaan(currentId, contextPayload);
    } catch (err: unknown) {
      console.error("Gagal menyimpan form:", err);
      setValidationError(
        err instanceof Error ? err.message : "Gagal menyimpan form ke server.",
      );
    } finally {
      setSavingStep(null);
    }
  };

  const handleSaveToContext = async (publishStatus: "draft" | "published") => {
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
      isDefault: formData.metadata.isDefault,
      status: (publishStatus === "published" ? "Aktif" : "Tidak Aktif") as
        "Aktif" | "Tidak Aktif",
      formData: formData,
      subPertanyaans: [
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

    const apiPayload = {
      nama: configName,
      skema_id: Number(formData.metadata.skemaSertifikasi) || 1,
      tipe_form: "Multi-Step Wizard",
      versi: formData.metadata.versi || "1.0",
      is_default: formData.metadata.isDefault,
      status: publishStatus === "published" ? "published" : "Draft",
      penyusun: [
        ...extractPenyusun(formData.step2.penyusun, "Penyusun", "step2"),
        ...extractPenyusun(formData.step2.validator, "Validator", "step2"),
        ...extractPenyusun(formData.step2.supervisor, "Supervisor", "step2"),
        ...extractPenyusun(formData.step3.penyusun, "Penyusun", "step3"),
        ...extractPenyusun(formData.step3.validator, "Validator", "step3"),
        ...extractPenyusun(formData.step4.penyusun, "Penyusun", "step4"),
        ...extractPenyusun(formData.step4.validator, "Validator", "step4"),
      ],
      step1: [],
      step2: {
        skenario_studi_kasus: formData.step2.blokA.skenarioStudiKasus,
        informasi_yang_diberikan: formData.step2.blokA.informasiYangDiberikan,
        lingkup_bahasan_studi_kasus:
          formData.step2.blokA.lingkupBahasanStudiKasus,
        perlengkapan_dan_bahan: formData.step2.blokA.perlengkapanDanBahan,
        fokus_presentasi: formData.step2.blokB.fokusPresentasi,
        ketentuan_alokasi_waktu: formData.step2.blokB.ketentuanAlokasiWaktu,
        kriteria_evaluasi_asesor: formData.step2.blokB.kriteriaEvaluasiAsesor,
      },
      step3: formData.step3.lingkups.map((l) => ({
        nama_lingkup: l.namaLingkup,
        sub_pertanyaan: l.subPertanyaans.map((sp) => ({
          skenario_pertanyaan: sp.skenarioPertanyaan,
          kode_kuk: sp.kodeKUK,
          ekspektasi_tanggapan: sp.ekspektasiTanggapan,
        })),
      })),
      step4: formData.step4.questions.map((q) => ({
        pertanyaan_lisan: q.pertanyaanLisan,
        kode_kuk_ref: q.kodeKUKRef,
        kunci_jawaban: q.kunciJawaban,
      })),
    };

    try {
      if (isEdit && konfigurasiId) {
        updateKonfigurasiPertanyaan(Number(konfigurasiId), payload);
        await updateKonfigurasiPertanyaanAPI(Number(konfigurasiId), apiPayload);
      } else {
        addKonfigurasiPertanyaan(payload);
        await createKonfigurasiPertanyaan(apiPayload);
      }

      setIsSuccessToast(
        publishStatus === "published"
          ? "Konfigurasi Pertanyaan berhasil diterbitkan!"
          : "Draft Konfigurasi Pertanyaan berhasil disimpan.",
      );
      setTimeout(() => {
        router.push("/assessor/konfigurasipertanyaan");
      }, 1200);
    } catch (err) {
      console.warn("Gagal simpan konfigurasi ke backend:", err);
    }
  };

  // Steps Metainfo for Stepper Header
  const stepsInfo = [
    {
      number: 1,
      title: "Penjelasan Singkat Proyek",
      code: "FORM FR.IA.04A",
      icon: FileSpreadsheet,
      desc: "",
    },
    {
      number: 2,
      title: "Penilaian Proyek Singkat",
      code: "FORM FR.IA.04B",
      icon: ListTodo,
      desc: "",
    },
    {
      number: 3,
      title: "Pertanyaan Lisan",
      code: "FORM FR.IA.07",
      icon: MessageSquare,
      desc: "",
    },
    {
      number: 4,
      title: "Finalisasi",
      code: "Review",
      icon: ShieldCheck,
      desc: "",
    },
  ];

  return (
    <div className="space-y-6 pb-28 text-sm text-gray-700">
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
            onClick={() => router.push("/assessor/konfigurasipertanyaan")}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-[#008BE3] bg-[#008BE3]/10 hover:bg-[#008BE3]/20 transition-colors cursor-pointer shrink-0"
            title="Kembali"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="min-w-0">
            <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">
              Konfigurasi Pertanyaan
            </h2>
            <p className="text-xs text-gray-400 font-bold tracking-wider uppercase leading-tight">
              Penyusunan Form Asesmen
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="relative mr-2">
            <button
              onClick={() => setIsPreviewMenuOpen(!isPreviewMenuOpen)}
              onBlur={() => setTimeout(() => setIsPreviewMenuOpen(false), 200)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs md:text-sm font-bold transition-all shadow-xs flex items-center gap-2"
            >
              <Eye size={16} /> Pratinjau Form
            </button>
            <div
              className={`absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 shadow-xl rounded-xl p-2 z-50 ${isPreviewMenuOpen ? "block" : "hidden"}`}
            >
              <button
                onClick={() => {
                  setPreviewForm("FR.IA.04A");
                  setIsPreviewMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 rounded-lg text-slate-700 font-medium transition-colors"
              >
                FR.IA.04A (Proyek)
              </button>
              <button
                onClick={() => {
                  setPreviewForm("FR.IA.04B");
                  setIsPreviewMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 rounded-lg text-slate-700 font-medium transition-colors"
              >
                FR.IA.04B (Penilaian)
              </button>
              <button
                onClick={() => {
                  setPreviewForm("FR.IA.07");
                  setIsPreviewMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 rounded-lg text-slate-700 font-medium transition-colors"
              >
                FR.IA.07 (Pertanyaan Lisan)
              </button>
            </div>
          </div>
          <button
            onClick={() => handleSaveToContext("draft")}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-xs md:text-sm font-bold transition-all shadow-xs flex items-center gap-2"
          >
            <Save size={16} /> Simpan Draft
          </button>
          {activeStep === 4 && (
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
            <span>Informasi General</span>
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
        </div>
      </div>

      {/* STEPPER NAVIGATION BAR (STEP 1 -> STEP 5) */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-4 md:p-6 overflow-x-auto">
        <div className="min-w-175">
          <div className="grid grid-cols-4 gap-2 relative">
            {/* Connecting Progress Line */}
            {!isEdit && (
              <div className="absolute top-5 left-[10%] right-[10%] h-1 bg-gray-100 z-0">
                <div
                  className="h-full bg-[#008BE3] transition-all duration-300"
                  style={{
                    width: `${((activeStep - 1) / (stepsInfo.length - 1)) * 100}%`,
                  }}
                />
              </div>
            )}

            {stepsInfo.map((st) => {
              const isActive = activeStep === st.number;
              const isCompleted = !isEdit && st.number < activeStep;

              return (
                <button
                  key={st.number}
                  onClick={() => {
                    setActiveStep(st.number);
                  }}
                  className={`flex flex-col items-center text-center group cursor-pointer relative z-10 transition-all ${isActive ? "scale-105" : "opacity-75 hover:opacity-100"
                    }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-xs transition-all shadow-sm ${isActive
                      ? "bg-[#008BE3] text-white border-4 border-sky-100 shadow-md ring-2 ring-[#008BE3]"
                      : isCompleted
                        ? "bg-emerald-500 text-white border-2 border-emerald-500"
                        : "bg-white text-slate-600 border-2 border-slate-300 hover:border-[#008BE3]"
                      }`}
                  >
                    {isCompleted ? <Check size={18} strokeWidth={3} /> : st.number}
                  </div>

                  <div className="mt-2 space-y-0.5">
                    <span
                      className={`text-[10px] font-mono tracking-wider uppercase block font-bold ${isActive
                        ? "text-[#008BE3]"
                        : "text-slate-400 group-hover:text-slate-600"
                        }`}
                    >
                      {st.code}
                    </span>
                    <span
                      className={`text-xs font-black block leading-tight ${isActive ? "text-slate-900" : "text-slate-600"
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
        {/* STEP 1: Skenario Studi Kasus                                  */}
        {/* =================================================================== */}
        {activeStep === 1 && (
          <div className="p-6 md:p-8 space-y-8">
            <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 font-bold">
                1
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-black text-slate-900">
                  Penjelasan Singkat Proyek
                </h3>
                <p className="text-xs text-blue-900/90 mt-0.5">
                  Terbagi menjadi{" "}
                  <strong>BLOK A (Hal yang Harus Disiapkan/Dihasilkan)</strong>{" "}
                  dan <strong>BLOK B (Hal yang Perlu Didemonstrasikan)</strong>
                  .{" "}
                </p>
              </div>
            </div>

            {/* PENYUSUN, VALIDATOR, SUPERVISOR */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border border-blue-200 rounded-2xl p-6 bg-linear-to-b from-blue-50/30 to-white">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block text-xs">
                  Penyusun (Asesor)
                </label>
                <Select
                  isDisabled={isReadOnly}
                  isMulti
                  options={assessorOptions}
                  value={formData.step2.penyusun}
                  onChange={(val) =>
                    setFormData((p) => ({
                      ...p,
                      step2: { ...p.step2, penyusun: val as any },
                    }))
                  }
                  className="basic-multi-select text-xs"
                  placeholder="Pilih Penyusun..."
                  menuPortalTarget={
                    typeof document !== "undefined" ? document.body : null
                  }
                  styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block text-xs">
                  Validator
                </label>
                <Select
                  isDisabled={isReadOnly}
                  isMulti
                  options={assessorOptions}
                  value={formData.step2.validator}
                  onChange={(val) =>
                    setFormData((p) => ({
                      ...p,
                      step2: { ...p.step2, validator: val as any },
                    }))
                  }
                  className="basic-multi-select text-xs"
                  placeholder="Pilih Validator..."
                  menuPortalTarget={
                    typeof document !== "undefined" ? document.body : null
                  }
                  styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block text-xs">
                  Supervisor
                </label>
                <Select
                  isDisabled={isReadOnly}
                  isMulti
                  options={assessorOptions}
                  value={formData.step2.supervisor}
                  onChange={(val) =>
                    setFormData((p) => ({
                      ...p,
                      step2: { ...p.step2, supervisor: val as any },
                    }))
                  }
                  className="basic-multi-select text-xs"
                  placeholder="Pilih Supervisor..."
                  menuPortalTarget={
                    typeof document !== "undefined" ? document.body : null
                  }
                  styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                />
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
        {activeStep === 2 && (
          <div className="p-6 md:p-8 space-y-6">
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 font-bold">
                2
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-black text-slate-900">
                  Penilaian Proyek Singkat
                </h3>
                <p className="text-xs text-emerald-900/90 mt-0.5">
                  Satu Lingkup Penyajian dapat memiliki banyak Pertanyaan.
                  Kelola Lingkup Penyajian dan Sub-Pertanyaan studi kasus
                  terkait KUK.
                </p>
              </div>
            </div>

            {/* PENYUSUN, VALIDATOR */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-emerald-200 rounded-2xl p-6 bg-linear-to-b from-emerald-50/30 to-white">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block text-xs">
                  Penyusun (Asesor)
                </label>
                <Select
                  isDisabled={isReadOnly}
                  isMulti
                  options={assessorOptions}
                  value={formData.step3.penyusun}
                  onChange={(val) =>
                    setFormData((p) => ({
                      ...p,
                      step3: { ...p.step3, penyusun: val as any },
                    }))
                  }
                  className="basic-multi-select text-xs"
                  placeholder="Pilih Penyusun..."
                  menuPortalTarget={
                    typeof document !== "undefined" ? document.body : null
                  }
                  styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block text-xs">
                  Validator
                </label>
                <Select
                  isDisabled={isReadOnly}
                  isMulti
                  options={assessorOptions}
                  value={formData.step3.validator}
                  onChange={(val) =>
                    setFormData((p) => ({
                      ...p,
                      step3: { ...p.step3, validator: val as any },
                    }))
                  }
                  className="basic-multi-select text-xs"
                  placeholder="Pilih Validator..."
                  menuPortalTarget={
                    typeof document !== "undefined" ? document.body : null
                  }
                  styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                />
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
                        <Plus size={15} /> Tambah Pertanyaan pada Lingkup Ini
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
                  <Plus size={18} /> Tambah Lingkup Penyajian Baru
                </button>
              )}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* STEP 3: Pertanyaan Lisan                                            */}
        {/* =================================================================== */}
        {activeStep === 3 && (
          <div className="p-6 md:p-8 space-y-6">
            <div className="bg-purple-50/80 border border-purple-200 rounded-xl p-4 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-700 text-white flex items-center justify-center shrink-0 font-bold">
                3
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-black text-slate-900">
                  Pertanyaan Lisan
                </h3>
                <p className="text-xs text-purple-900/90 mt-0.5">
                  Input daftar pertanyaan lisan beserta pemetaan KUK.{" "}
                  <strong>KUNCI JAWABAN WAJIB DIISI</strong> oleh Asesor.
                </p>
              </div>
            </div>

            {/* PENYUSUN, VALIDATOR */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-purple-200 rounded-2xl p-6 bg-linear-to-b from-purple-50/30 to-white">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block text-xs">
                  Penyusun (Asesor)
                </label>
                <Select
                  isDisabled={isReadOnly}
                  isMulti
                  options={assessorOptions}
                  value={formData.step4.penyusun}
                  onChange={(val) =>
                    setFormData((p) => ({
                      ...p,
                      step4: { ...p.step4, penyusun: val as any },
                    }))
                  }
                  className="basic-multi-select text-xs"
                  placeholder="Pilih Penyusun..."
                  menuPortalTarget={
                    typeof document !== "undefined" ? document.body : null
                  }
                  styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block text-xs">
                  Validator
                </label>
                <Select
                  isDisabled={isReadOnly}
                  isMulti
                  options={assessorOptions}
                  value={formData.step4.validator}
                  onChange={(val) =>
                    setFormData((p) => ({
                      ...p,
                      step4: { ...p.step4, validator: val as any },
                    }))
                  }
                  className="basic-multi-select text-xs"
                  placeholder="Pilih Validator..."
                  menuPortalTarget={
                    typeof document !== "undefined" ? document.body : null
                  }
                  styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                />
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

                  <div className="flex flex-col gap-4">
                    <div className="space-y-1.5">
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

                    <div className="space-y-1.5">
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
                    <div className="space-y-1.5 bg-purple-100/50 p-3.5 border border-purple-200 rounded-lg">
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
        {/* STEP 4: Finalisasi & Review Preview                                 */}
        {/* =================================================================== */}
        {activeStep === 4 && (
          <div className="p-6 md:p-8 space-y-8">
            <div className="bg-emerald-500/10 border border-emerald-300 rounded-2xl p-5 flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 font-bold shadow-xs">
                4
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-black text-slate-900">
                  Finalisasi & Review
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Tinjau seluruh konfigurasi pertanyaan sebelum diterbitkan.
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

              {/* Step 2 Preview: FR.IA.04A */}
              <div className="border border-blue-200 rounded-xl p-5 bg-blue-50/30 space-y-4">
                <div className="flex items-center justify-between border-b border-blue-200 pb-2">
                  <h4 className="font-black text-slate-900 text-sm flex items-center gap-2">
                    <FileSpreadsheet size={16} className="text-blue-600" />
                    Penjelasan Singkat Proyek (FR.IA.04A)
                  </h4>
                  <button
                    onClick={() => setActiveStep(1)}
                    className="text-xs font-bold text-blue-600 hover:underline"
                  >
                    Edit Penjelasan Singkat Proyek
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
                    Penilaian Proyek Singkat - FR.IA.04B (
                    {formData.step3.lingkups.length} Lingkup)
                  </h4>
                  <button
                    onClick={() => setActiveStep(2)}
                    className="text-xs font-bold text-emerald-600 hover:underline"
                  >
                    Edit Penilaian Proyek Singkat
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
                    Pertanyaan Lisan - FR.IA.07 (
                    {formData.step4.questions.length} Pertanyaan)
                  </h4>
                  <button
                    onClick={() => setActiveStep(3)}
                    className="text-xs font-bold text-purple-700 hover:underline"
                  >
                    Edit Pertanyaan Lisan
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

        {/* STEPPER FOOTER BUTTONS (SEBELUMNYA / STATUS STEP / SELANJUTNYA ATAU SIMPAN) */}
        <div className="p-4 md:p-6 bg-slate-50 border-t border-gray-200 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={handlePrevStep}
            disabled={activeStep === 1}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs md:text-sm flex items-center gap-2 transition-all ${activeStep === 1
              ? "opacity-40 cursor-not-allowed text-gray-400 bg-gray-100"
              : "bg-white border border-gray-300 text-slate-700 hover:bg-gray-100 shadow-2xs"
              }`}
          >
            <ChevronLeft size={18} /> Sebelumnya
          </button>

          <div className="text-xs font-bold text-slate-400 font-mono hidden sm:block px-2">
            Step {activeStep} dari {stepsInfo.length}
          </div>

          <div className="flex items-center gap-2">
            {activeStep < stepsInfo.length ? (
              isEdit ? (
                <button
                  type="button"
                  onClick={() => handleSaveSingleForm(activeStep)}
                  disabled={savingStep !== null || isReadOnly}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-xl font-bold text-xs md:text-sm flex items-center gap-2 transition-all shadow-sm"
                >
                  {savingStep === activeStep ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      <span>Simpan</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-6 py-2.5 bg-[#008BE3] hover:bg-[#0076C2] text-white rounded-xl font-bold text-xs md:text-sm flex items-center gap-2 transition-all shadow-sm"
                >
                  Selanjutnya <ChevronRight size={18} />
                </button>
              )
            ) : (
              <button
                type="button"
                onClick={() => handleSaveToContext("published")}
                disabled={isReadOnly}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs md:text-sm flex items-center gap-2 transition-all shadow-sm"
              >
                <Send size={16} /> Publish Konfigurasi
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Preview Modal Overlay */}
      <AnimatePresence>
        {previewForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 bg-slate-900/70 backdrop-blur-xs flex flex-col items-center justify-start p-2 sm:p-6 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl my-auto overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]"
            >
              <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0 border-b border-slate-800">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-[#008BE3] flex items-center justify-center text-white font-black text-sm">
                    <FileText size={18} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-extrabold text-base leading-tight text-white flex items-center gap-2">
                      Pratinjau Form:{" "}
                      <span className="text-[#008BE3]">{previewForm}</span>
                    </h3>
                    <p className="text-xs text-slate-300 font-medium">
                      Preview Data Konfigurasi Saat Ini
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 min-w-0">
                  <button
                    onClick={() => setPreviewForm(null)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600/90 hover:bg-red-600 text-white rounded-lg text-xs font-bold transition-colors shadow-sm cursor-pointer"
                  >
                    <X size={16} />{" "}
                    <span className="hidden sm:inline">Tutup</span>
                  </button>
                </div>
              </div>

              <div className="p-4 sm:p-8 overflow-y-auto bg-slate-50/50 flex-1">
                <div className="bg-white p-4 sm:p-8 rounded-xl border border-slate-200 shadow-xs">
                  {previewForm === "FR.IA.04A" && (
                    <FormFRIA04A
                      readOnly={true}
                      asesmenData={
                        {
                          nama: "Nama Asesi",
                          skema:
                            skemaOptions.find(
                              (s) =>
                                s.value ===
                                String(formData.metadata.skemaSertifikasi),
                            )?.label || "Skema Sertifikasi",
                          noSkema:
                            skemaOptions.find(
                              (s) =>
                                s.value ===
                                String(formData.metadata.skemaSertifikasi),
                            )?.kode || "00/LSP/0000",
                          tuk: "Sewaktu",
                          metodeAsesmen: "Offline",
                          tanggal: new Date().toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }),
                          asesor: formData.step2.penyusun[0]?.label || "Asesor",
                          asesorReg: formData.step2.penyusun[0]?.no_met || "-",
                        } as any
                      }
                      supervisorName="Nama Supervisor"
                      supervisorSignature="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='150' height='50'><text x='10' y='30' font-family='cursive' font-size='20'>TTD Supervisor</text></svg>"
                      previewData={currentPreviewData}
                      penyusun={formData.step2.penyusun.map((p) => ({
                        nama: p.label,
                        noMet: p.no_met || "-",
                        tandaTangan: p.tanda_tangan,
                        ttdTanggal: "-",
                      }))}
                      validator={formData.step2.validator.map((v) => ({
                        nama: v.label,
                        noMet: v.no_met || "-",
                        tandaTangan: v.tanda_tangan,
                        ttdTanggal: "-",
                      }))}
                    />
                  )}
                  {previewForm === "FR.IA.04B" && (
                    <FormFRIA04B
                      readOnly={true}
                      asesmenData={
                        {
                          nama: "Nama Asesi",
                          skema:
                            skemaOptions.find(
                              (s) =>
                                s.value ===
                                String(formData.metadata.skemaSertifikasi),
                            )?.label || "Skema Sertifikasi",
                          noSkema:
                            skemaOptions.find(
                              (s) =>
                                s.value ===
                                String(formData.metadata.skemaSertifikasi),
                            )?.kode || "00/LSP/0000",
                          tuk: "Sewaktu",
                          metodeAsesmen: "Offline",
                          tanggal: new Date().toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }),
                          asesor: formData.step2.penyusun[0]?.label || "Asesor",
                          asesorReg: formData.step2.penyusun[0]?.no_met || "-",
                        } as any
                      }
                      previewData={currentPreviewData}
                      penyusun={formData.step2.penyusun.map((p) => ({
                        nama: p.label,
                        noMet: p.no_met || "-",
                        tandaTangan: p.tanda_tangan,
                        ttdTanggal: "-",
                      }))}
                      validator={formData.step2.validator.map((v) => ({
                        nama: v.label,
                        noMet: v.no_met || "-",
                        tandaTangan: v.tanda_tangan,
                        ttdTanggal: "-",
                      }))}
                    />
                  )}
                  {previewForm === "FR.IA.07" && (
                    <FormFRIA07
                      readOnly={true}
                      asesmenData={
                        {
                          nama: "Nama Asesi",
                          skema:
                            skemaOptions.find(
                              (s) =>
                                s.value ===
                                String(formData.metadata.skemaSertifikasi),
                            )?.label || "Skema Sertifikasi",
                          noSkema:
                            skemaOptions.find(
                              (s) =>
                                s.value ===
                                String(formData.metadata.skemaSertifikasi),
                            )?.kode || "00/LSP/0000",
                          tuk: "Sewaktu",
                          metodeAsesmen: "Offline",
                          tanggal: new Date().toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }),
                          asesor: formData.step3.penyusun[0]?.label || "Asesor",
                          asesorReg: formData.step3.penyusun[0]?.no_met || "-",
                        } as any
                      }
                      previewData={currentPreviewData}
                      penyusun={formData.step3.penyusun.map((p) => ({
                        nama: p.label,
                        noMet: p.no_met || "-",
                        tandaTangan: p.tanda_tangan,
                        ttdTanggal: "-",
                      }))}
                      validator={formData.step3.validator.map((v) => ({
                        nama: v.label,
                        noMet: v.no_met || "-",
                        tandaTangan: v.tanda_tangan,
                        ttdTanggal: "-",
                      }))}
                    />
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function TambahKonfigurasiPertanyaan() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-100 flex items-center justify-center text-slate-500 font-medium">
          Memuat konfigurasi pertanyaan...
        </div>
      }
    >
      <TambahKonfigurasiPertanyaanContent />
    </React.Suspense>
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
