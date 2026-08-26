import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  FileText,
  Layers,
  CheckSquare,
  ArrowLeft,
  Copy,
  Check,
  Eye,
  Briefcase,
  ClipboardCheck,
  HelpCircle,
  Settings,
} from "lucide-react";
import {
  MasterSkemaFormState,
  MasterSkemaPayload,
  PersyaratanDasar,
  UnitKompetensiItem,
  ElemenKompetensiItem,
} from "@/types/types";
import { useAppContext } from "@/context/context";
import { FormFRAK07 } from "../forms/FormFRAK07";
import { FormFRIA04A } from "../forms/FormFRIA04A";
import { FormFRIA04B } from "../forms/FormFRIA04B";
import { FormFRIA07 } from "../forms/FormFRIA07";

interface TambahSkemaFormProps {
  onCancel: () => void;
  onSaveSuccess?: (payload: MasterSkemaPayload) => void;
  initialData?: Partial<MasterSkemaFormState>;
}

export function TambahSkemaForm({
  onCancel,
  onSaveSuccess,
  initialData,
}: TambahSkemaFormProps) {
  const { setExtraCrumbs, konfigurasiPertanyaan } = useAppContext();

  useEffect(() => {
    setExtraCrumbs([
      { label: initialData?.kode_skema ? "EDIT SKEMA" : "TAMBAH SKEMA BARU" },
    ]);
    return () => {
      setExtraCrumbs([]);
    };
  }, [initialData, setExtraCrumbs]);

  // Form State initialized from props or default initial state
  const [formState, setFormState] = useState<MasterSkemaFormState>({
    kode_skema: initialData?.kode_skema || "",
    nama_skema: initialData?.nama_skema || "",
    nomor_sertifikat: initialData?.nomor_sertifikat || "",
    nomor_registrasi: initialData?.nomor_registrasi || "",
    status_aktif: initialData?.status_aktif ?? false, // Default false / Draft
    konfigurasi_soal_id:
      initialData?.konfigurasi_soal_id ||
      (konfigurasiPertanyaan.length > 0 ? konfigurasiPertanyaan[0].id : ""),
    persyaratan_dasar:
      initialData?.persyaratan_dasar && initialData.persyaratan_dasar.length > 0
        ? initialData.persyaratan_dasar
        : [
            {
              nama_dokumen: "Transkrip Nilai Semester 5",
              deskripsi:
                "Minimal semester 6 mahasiswa UIN SGD yang telah menyelesaikan matakuliah wajib skema.",
              urutan: 1,
              is_wajib: true,
            },
          ],
    persyaratan_administrasi:
      initialData?.persyaratan_administrasi &&
      initialData.persyaratan_administrasi.length > 0
        ? initialData.persyaratan_administrasi
        : [
            {
              nama_dokumen: "Kartu Tanda Penduduk (KTP)",
              deskripsi:
                "Scan KTP asli atau identitas resmi yang masih berlaku.",
              urutan: 1,
              is_wajib: true,
            },
          ],
    unit_kompetensi:
      initialData?.unit_kompetensi && initialData.unit_kompetensi.length > 0
        ? initialData.unit_kompetensi
        : [
            {
              kode_unit: "J.611000.001.01",
              judul_unit: "Merancang Topologi Jaringan",
              urutan: 1,
              elemen: [
                {
                  nama_elemen: "Menyiapkan perancangan topologi",
                  kriteria_unjuk_kerja: [
                    "1.1 Kebutuhan pengguna diidentifikasi.",
                    "1.2 Perangkat jaringan ditentukan.",
                  ],
                  urutan: 1,
                  is_wajib: true,
                },
              ],
            },
          ],
  });

  const [activeFormTab, setActiveFormTab] = useState<
    "frak07" | "fria04a" | "fria04b" | "fria07"
  >("frak07");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [submittedPayload, setSubmittedPayload] =
    useState<MasterSkemaPayload | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [copiedPayload, setCopiedPayload] = useState(false);

  const selectedConfig = konfigurasiPertanyaan.find(
    (k) => k.id === formState.konfigurasi_soal_id,
  );

  // --- Handlers: Card 1 (Informasi Utama) ---
  const handleMainInfoChange = (
    field:
      | "kode_skema"
      | "nama_skema"
      | "nomor_sertifikat"
      | "nomor_registrasi",
    value: string,
  ) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    if (validationError) setValidationError(null);
  };

  const handleStatusChange = (status_aktif: boolean) => {
    setFormState((prev) => ({ ...prev, status_aktif }));
  };

  // --- Handlers: Card 2 (Persyaratan Dasar) ---
  const handleAddPersyaratan = () => {
    setFormState((prev) => ({
      ...prev,
      persyaratan_dasar: [
        ...prev.persyaratan_dasar,
        {
          nama_dokumen: "",
          deskripsi: "",
          urutan: prev.persyaratan_dasar.length + 1,
          is_wajib: true,
        },
      ],
    }));
  };

  const handleUpdatePersyaratan = (
    index: number,
    field: keyof PersyaratanDasar,
    value: any,
  ) => {
    setFormState((prev) => {
      const updated = [...prev.persyaratan_dasar];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, persyaratan_dasar: updated };
    });
    if (validationError) setValidationError(null);
  };

  const handleRemovePersyaratan = (index: number) => {
    setFormState((prev) => {
      const updated = prev.persyaratan_dasar
        .filter((_, i) => i !== index)
        .map((item, idx) => ({ ...item, urutan: idx + 1 }));
      return { ...prev, persyaratan_dasar: updated };
    });
  };

  // --- Handlers: Card 3 (Persyaratan Administrasi) ---
  const handleAddPersyaratanAdministrasi = () => {
    setFormState((prev) => ({
      ...prev,
      persyaratan_administrasi: [
        ...prev.persyaratan_administrasi,
        {
          nama_dokumen: "",
          deskripsi: "",
          urutan: prev.persyaratan_administrasi.length + 1,
          is_wajib: true,
        },
      ],
    }));
  };

  const handleUpdatePersyaratanAdministrasi = (
    index: number,
    field: keyof PersyaratanDasar,
    value: any,
  ) => {
    setFormState((prev) => {
      const updated = [...prev.persyaratan_administrasi];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, persyaratan_administrasi: updated };
    });
    if (validationError) setValidationError(null);
  };

  const handleRemovePersyaratanAdministrasi = (index: number) => {
    setFormState((prev) => {
      const updated = prev.persyaratan_administrasi
        .filter((_, i) => i !== index)
        .map((item, idx) => ({ ...item, urutan: idx + 1 }));
      return { ...prev, persyaratan_administrasi: updated };
    });
  };

  // --- Handlers: Card 3 (Unit & Elemen Kompetensi) ---
  const handleAddUnit = () => {
    setFormState((prev) => ({
      ...prev,
      unit_kompetensi: [
        ...prev.unit_kompetensi,
        {
          kode_unit: "",
          judul_unit: "",
          urutan: prev.unit_kompetensi.length + 1,
          elemen: [
            {
              nama_elemen: "",
              kriteria_unjuk_kerja: [""],
              urutan: 1,
              is_wajib: true,
            },
          ],
        },
      ],
    }));
  };

  const handleUpdateUnit = (
    unitIndex: number,
    field: "kode_unit" | "judul_unit",
    value: string,
  ) => {
    setFormState((prev) => {
      const updatedUnits = [...prev.unit_kompetensi];
      updatedUnits[unitIndex] = { ...updatedUnits[unitIndex], [field]: value };
      return { ...prev, unit_kompetensi: updatedUnits };
    });
    if (validationError) setValidationError(null);
  };

  const handleRemoveUnit = (unitIndex: number) => {
    setFormState((prev) => {
      if (prev.unit_kompetensi.length <= 1) {
        setValidationError("Minimal 1 Unit Kompetensi harus tetap ada.");
        return prev;
      }
      const updatedUnits = prev.unit_kompetensi
        .filter((_, i) => i !== unitIndex)
        .map((u, idx) => ({ ...u, urutan: idx + 1 }));
      return { ...prev, unit_kompetensi: updatedUnits };
    });
  };

  const handleAddElemen = (unitIndex: number) => {
    setFormState((prev) => {
      const updatedUnits = [...prev.unit_kompetensi];
      const targetUnit = updatedUnits[unitIndex];
      const newElemenList = [
        ...targetUnit.elemen,
        {
          nama_elemen: "",
          kriteria_unjuk_kerja: [""],
          urutan: targetUnit.elemen.length + 1,
          is_wajib: true,
        },
      ];
      updatedUnits[unitIndex] = { ...targetUnit, elemen: newElemenList };
      return { ...prev, unit_kompetensi: updatedUnits };
    });
  };

  const handleUpdateElemen = (
    unitIndex: number,
    elemenIndex: number,
    field: keyof ElemenKompetensiItem,
    value: any,
  ) => {
    setFormState((prev) => {
      const updatedUnits = [...prev.unit_kompetensi];
      const targetUnit = updatedUnits[unitIndex];
      const updatedElemen = [...targetUnit.elemen];
      updatedElemen[elemenIndex] = {
        ...updatedElemen[elemenIndex],
        [field]: value,
      };
      updatedUnits[unitIndex] = { ...targetUnit, elemen: updatedElemen };
      return { ...prev, unit_kompetensi: updatedUnits };
    });
    if (validationError) setValidationError(null);
  };

  const handleRemoveElemen = (unitIndex: number, elemenIndex: number) => {
    setFormState((prev) => {
      const updatedUnits = [...prev.unit_kompetensi];
      const targetUnit = updatedUnits[unitIndex];
      if (targetUnit.elemen.length <= 1) {
        setValidationError(
          `Unit "${targetUnit.kode_unit || unitIndex + 1}" harus memiliki minimal 1 Elemen Kompetensi.`,
        );
        return prev;
      }
      const updatedElemen = targetUnit.elemen
        .filter((_, i) => i !== elemenIndex)
        .map((el, idx) => ({ ...el, urutan: idx + 1 }));
      updatedUnits[unitIndex] = { ...targetUnit, elemen: updatedElemen };
      return { ...prev, unit_kompetensi: updatedUnits };
    });
  };

  // --- Handlers: KUK (Kriteria Unjuk Kerja) ---
  const handleAddKUK = (unitIndex: number, elemenIndex: number) => {
    setFormState((prev) => {
      const updatedUnits = [...prev.unit_kompetensi];
      const targetUnit = updatedUnits[unitIndex];
      const targetElemen = targetUnit.elemen[elemenIndex];
      const newKUKList = [...targetElemen.kriteria_unjuk_kerja, ""];

      const updatedElemenList = [...targetUnit.elemen];
      updatedElemenList[elemenIndex] = {
        ...targetElemen,
        kriteria_unjuk_kerja: newKUKList,
      };
      updatedUnits[unitIndex] = { ...targetUnit, elemen: updatedElemenList };
      return { ...prev, unit_kompetensi: updatedUnits };
    });
  };

  const handleUpdateKUK = (
    unitIndex: number,
    elemenIndex: number,
    kukIndex: number,
    value: string,
  ) => {
    setFormState((prev) => {
      const updatedUnits = [...prev.unit_kompetensi];
      const targetUnit = updatedUnits[unitIndex];
      const targetElemen = targetUnit.elemen[elemenIndex];
      const newKUKList = [...targetElemen.kriteria_unjuk_kerja];
      newKUKList[kukIndex] = value;

      const updatedElemenList = [...targetUnit.elemen];
      updatedElemenList[elemenIndex] = {
        ...targetElemen,
        kriteria_unjuk_kerja: newKUKList,
      };
      updatedUnits[unitIndex] = { ...targetUnit, elemen: updatedElemenList };
      return { ...prev, unit_kompetensi: updatedUnits };
    });
    if (validationError) setValidationError(null);
  };

  const handleRemoveKUK = (
    unitIndex: number,
    elemenIndex: number,
    kukIndex: number,
  ) => {
    setFormState((prev) => {
      const updatedUnits = [...prev.unit_kompetensi];
      const targetUnit = updatedUnits[unitIndex];
      const targetElemen = targetUnit.elemen[elemenIndex];

      let newKUKList = targetElemen.kriteria_unjuk_kerja.filter(
        (_, i) => i !== kukIndex,
      );
      if (newKUKList.length === 0) {
        newKUKList = [""];
      }

      const updatedElemenList = [...targetUnit.elemen];
      updatedElemenList[elemenIndex] = {
        ...targetElemen,
        kriteria_unjuk_kerja: newKUKList,
      };
      updatedUnits[unitIndex] = { ...targetUnit, elemen: updatedElemenList };
      return { ...prev, unit_kompetensi: updatedUnits };
    });
  };

  // --- Validation & Submit Logic ---
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setValidationError(null);

    // 1. Kode Skema validation
    if (!formState.kode_skema.trim()) {
      setValidationError(
        'Kode Skema wajib diisi (Contoh: "06/LSPUINBdg/XI/2023").',
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // 2. Nama Skema validation
    if (!formState.nama_skema.trim()) {
      setValidationError(
        'Nama Skema wajib diisi (Contoh: "Network Administrator").',
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // 3. Unit Kompetensi validation
    if (formState.unit_kompetensi.length === 0) {
      setValidationError(
        "Minimal 1 Unit Kompetensi harus ditambahkan ke skema.",
      );
      return;
    }

    for (let uIdx = 0; uIdx < formState.unit_kompetensi.length; uIdx++) {
      const unit = formState.unit_kompetensi[uIdx];
      if (!unit.kode_unit.trim() || !unit.judul_unit.trim()) {
        setValidationError(
          `Unit Kompetensi #${uIdx + 1}: Kode Unit dan Judul Unit wajib diisi.`,
        );
        return;
      }

      if (unit.elemen.length === 0) {
        setValidationError(
          `Unit Kompetensi #${uIdx + 1} (${unit.kode_unit}): Minimal harus memiliki 1 Elemen Kompetensi.`,
        );
        return;
      }

      for (let eIdx = 0; eIdx < unit.elemen.length; eIdx++) {
        const el = unit.elemen[eIdx];
        if (!el.nama_elemen.trim()) {
          setValidationError(
            `Unit ${unit.kode_unit} - Elemen #${eIdx + 1}: Nama Elemen Kompetensi wajib diisi.`,
          );
          return;
        }
      }
    }

    // Construct Supabase-ready JSON payload
    const payload: MasterSkemaPayload = {
      kode_skema: formState.kode_skema.trim(),
      nama_skema: formState.nama_skema.trim(),
      nomor_sertifikat: formState.nomor_sertifikat?.trim() || undefined,
      nomor_registrasi: formState.nomor_registrasi?.trim() || undefined,
      status_aktif: formState.status_aktif,
      konfigurasi_soal_id: formState.konfigurasi_soal_id || undefined,
      persyaratan_dasar: formState.persyaratan_dasar
        .filter((p) => p.nama_dokumen.trim() !== "")
        .map((p, idx) => ({
          nama_dokumen: p.nama_dokumen.trim(),
          deskripsi: p.deskripsi.trim(),
          urutan: idx + 1,
          is_wajib: p.is_wajib,
        })),
      persyaratan_administrasi: formState.persyaratan_administrasi
        .filter((p) => p.nama_dokumen.trim() !== "")
        .map((p, idx) => ({
          nama_dokumen: p.nama_dokumen.trim(),
          deskripsi: p.deskripsi.trim(),
          urutan: idx + 1,
          is_wajib: p.is_wajib,
        })),
      unit_kompetensi: formState.unit_kompetensi.map((u, uIdx) => ({
        kode_unit: u.kode_unit.trim(),
        judul_unit: u.judul_unit.trim(),
        urutan: uIdx + 1,
        elemen: u.elemen.map((e, eIdx) => ({
          nama_elemen: e.nama_elemen.trim(),
          kriteria_unjuk_kerja: e.kriteria_unjuk_kerja
            .filter((k) => k.trim() !== "")
            .join("\n"),
          urutan: eIdx + 1,
          is_wajib: e.is_wajib ?? true,
        })),
      })),
    };

    setSubmittedPayload(payload);
    setIsSuccessModalOpen(true);

    if (onSaveSuccess) {
      onSaveSuccess(payload);
    }
  };

  const handleCopyPayload = () => {
    if (submittedPayload) {
      navigator.clipboard.writeText(JSON.stringify(submittedPayload, null, 2));
      setCopiedPayload(true);
      setTimeout(() => setCopiedPayload(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] p-3 sm:p-6 md:p-8 pb-24 text-sm text-gray-700">
      <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6">
        {/* Header Bar - Aligned with centered container */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={onCancel}
              className="w-10 h-10 rounded-lg flex items-center justify-center text-[#008BE3] bg-[#008BE3]/10 hover:bg-[#008BE3]/20 border border-[#008BE3]/20 transition-colors cursor-pointer shrink-0 shadow-xs"
              title="Kembali ke Kelola Skema"
            >
              <ArrowLeft size={20} className="stroke-[2.5]" />
            </button>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">
                {initialData?.kode_skema
                  ? "Edit Skema Sertifikasi"
                  : "Formulir Skema Sertifikasi Baru"}
              </h2>
              <p className="text-xs text-gray-500 font-medium tracking-wider uppercase leading-[16px]">
                Input data hierarkis skema, persyaratan dasar, unit, elemen, dan
                KUK
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-xs sm:text-sm font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors shadow-2xs cursor-pointer flex-1 sm:flex-none text-center"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={() => handleSubmit()}
              className="px-5 py-2 text-xs sm:text-sm font-bold text-white bg-[#008BE3] hover:bg-[#0076C2] rounded-lg transition-colors shadow-2xs flex items-center justify-center gap-2 cursor-pointer flex-1 sm:flex-none text-center"
            >
              Simpan Skema
            </button>
          </div>
        </div>

        {/* Error Alert Box */}
        {validationError && (
          <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-r-xl shadow-xs flex items-start gap-3 animate-shake">
            <AlertCircle size={20} className="text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-bold text-rose-900">
                Terdapat Kesalahan Input
              </h4>
              <p className="text-xs text-rose-700 mt-0.5">{validationError}</p>
            </div>
            <button
              onClick={() => setValidationError(null)}
              className="text-rose-400 hover:text-rose-600 text-xs font-bold"
            >
              Tutup
            </button>
          </div>
        )}

        {/* CARD 1: INFORMASI UTAMA SKEMA */}
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-xs border border-slate-200/80">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-sky-50 text-[#008BE3] flex items-center justify-center font-black text-sm shrink-0 border border-sky-100">
                1
              </span>
              Informasi Utama Skema
            </h2>
          </div>

          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Kode Skema */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Kode Skema <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="06/LSPUINBdg/XI/2023"
                  value={formState.kode_skema}
                  onChange={(e) =>
                    handleMainInfoChange("kode_skema", e.target.value)
                  }
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm font-semibold outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40 bg-slate-50/50 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Kode unik identitas skema sertifikasi (Contoh:
                  `06/LSPUINBdg/XI/2023`)
                </p>
              </div>

              {/* Nama Skema */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Nama Skema <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Masukkan nama skema"
                  value={formState.nama_skema}
                  onChange={(e) =>
                    handleMainInfoChange("nama_skema", e.target.value)
                  }
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm font-semibold outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40 bg-slate-50/50 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Nama lengkap skema kompetensi (Contoh: "Network
                  Administrator")
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Nomor Sertifikat */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Nomor Sertifikat
                </label>
                <input
                  type="text"
                  placeholder="Contoh: 00000 2431 0 0000000 2023"
                  value={formState.nomor_sertifikat || ""}
                  onChange={(e) =>
                    handleMainInfoChange("nomor_sertifikat", e.target.value)
                  }
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm font-semibold outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40 bg-slate-50/50 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Nomor sertifikat acuan lisensi BNSP
                </p>
              </div>

              {/* Nomor Registrasi */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Nomor Registrasi
                </label>
                <input
                  type="text"
                  placeholder="Contoh: MET.000.000000 2023"
                  value={formState.nomor_registrasi || ""}
                  onChange={(e) =>
                    handleMainInfoChange("nomor_registrasi", e.target.value)
                  }
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm font-semibold outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40 bg-slate-50/50 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Nomor registrasi skema pada BNSP
                </p>
              </div>
            </div>

            {/* Status Skema */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Status Skema
              </label>
              <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-200 max-w-md">
                <button
                  type="button"
                  onClick={() => handleStatusChange(false)}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    !formState.status_aktif
                      ? "bg-amber-100 text-amber-800 border border-amber-300 shadow-2xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${!formState.status_aktif ? "bg-amber-500" : "bg-slate-300"}`}
                  />
                  Draft (Nonaktif)
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange(true)}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    formState.status_aktif
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${formState.status_aktif ? "bg-emerald-500" : "bg-slate-300"}`}
                  />
                  Aktif
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 2: PERSYARATAN DASAR PEMOHON */}
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-xs border border-slate-200/80">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-sky-50 text-[#008BE3] flex items-center justify-center font-black text-sm shrink-0 border border-sky-100">
                2
              </span>
              Persyaratan Dasar Pemohon
            </h2>
          </div>
          <p className="text-xs text-slate-500 mb-6 ml-10">
            Mengelola daftar berkas dan bukti portofolio yang wajib diunggah
            oleh asesi saat mengajukan skema ini.
          </p>

          <div className="space-y-4">
            {formState.persyaratan_dasar.map((item, index) => (
              <div
                key={index}
                className="bg-slate-50/70 border border-slate-200 rounded-xl p-4 sm:p-5 relative group transition-all hover:border-slate-300"
              >
                <div className="flex items-center justify-between mb-3 border-b border-slate-200/80 pb-2">
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-[#008BE3]" />
                    <span className="text-xs font-bold text-slate-800">
                      Dokumen Persyaratan #{index + 1}
                    </span>
                  </div>
                  {formState.persyaratan_dasar.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePersyaratan(index)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold cursor-pointer"
                      title="Hapus Dokumen"
                    >
                      <Trash2 size={15} />
                      <span className="hidden sm:inline">Hapus</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  {/* Nama Dokumen */}
                  <div className="md:col-span-5">
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Nama Dokumen Persyaratan
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Transkrip Nilai Semester 5"
                      value={item.nama_dokumen}
                      onChange={(e) =>
                        handleUpdatePersyaratan(
                          index,
                          "nama_dokumen",
                          e.target.value,
                        )
                      }
                      className="w-full text-xs font-semibold bg-white border border-slate-300 rounded-lg px-3.5 py-2 outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40 text-slate-900"
                    />
                  </div>

                  {/* Deskripsi */}
                  <div className="md:col-span-5">
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Deskripsi / Ketentuan Dokumen
                    </label>
                    <textarea
                      placeholder="Contoh: Minimal semester 6 mahasiswa UIN SGD yang telah menyelesaikan matakuliah..."
                      value={item.deskripsi}
                      onChange={(e) =>
                        handleUpdatePersyaratan(
                          index,
                          "deskripsi",
                          e.target.value,
                        )
                      }
                      rows={2}
                      className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3.5 py-2 outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40 text-slate-800 resize-none"
                    />
                  </div>

                  {/* Toggle Checkbox is_wajib */}
                  <div className="md:col-span-2 flex items-center justify-start md:justify-center pt-2 md:pt-4">
                    <label className="flex items-center gap-2 cursor-pointer select-none bg-white p-2.5 rounded-lg border border-slate-200 w-full hover:bg-slate-50">
                      <input
                        type="checkbox"
                        checked={item.is_wajib}
                        onChange={(e) =>
                          handleUpdatePersyaratan(
                            index,
                            "is_wajib",
                            e.target.checked,
                          )
                        }
                        className="w-4 h-4 rounded text-[#008BE3] focus:ring-[#008BE3] cursor-pointer"
                      />
                      <span className="text-xs font-bold text-slate-700">
                        Wajib Diunggah
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddPersyaratan}
              className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-[#008BE3] font-bold text-xs hover:border-[#008BE3] hover:bg-sky-50/50 transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer"
            >
              <Plus size={16} /> Tambah Dokumen Persyaratan
            </button>
          </div>
        </div>

        {/* CARD 3: PERSYARATAN ADMINISTRASI */}
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-xs border border-slate-200/80">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-sky-50 text-[#008BE3] flex items-center justify-center font-black text-sm shrink-0 border border-sky-100">
                3
              </span>
              Persyaratan Administrasi
            </h2>
          </div>
          <p className="text-xs text-slate-500 mb-6 ml-10">
            Mengelola daftar berkas dan bukti administratif yang wajib diunggah
            oleh asesi saat pendaftaran awal.
          </p>

          <div className="space-y-4">
            {formState.persyaratan_administrasi.map((item, index) => (
              <div
                key={index}
                className="bg-slate-50/70 border border-slate-200 rounded-xl p-4 sm:p-5 relative group transition-all hover:border-slate-300"
              >
                <div className="flex items-center justify-between mb-3 border-b border-slate-200/80 pb-2">
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-[#008BE3]" />
                    <span className="text-xs font-bold text-slate-800">
                      Dokumen Administrasi #{index + 1}
                    </span>
                  </div>
                  {formState.persyaratan_administrasi.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePersyaratanAdministrasi(index)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold cursor-pointer"
                      title="Hapus Dokumen"
                    >
                      <Trash2 size={15} />
                      <span className="hidden sm:inline">Hapus</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  {/* Nama Dokumen */}
                  <div className="md:col-span-5">
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Nama Dokumen Administrasi
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Kartu Tanda Penduduk (KTP)"
                      value={item.nama_dokumen}
                      onChange={(e) =>
                        handleUpdatePersyaratanAdministrasi(
                          index,
                          "nama_dokumen",
                          e.target.value,
                        )
                      }
                      className="w-full text-xs font-semibold bg-white border border-slate-300 rounded-lg px-3.5 py-2 outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40 text-slate-900"
                    />
                  </div>

                  {/* Deskripsi */}
                  <div className="md:col-span-5">
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Deskripsi / Ketentuan Dokumen
                    </label>
                    <textarea
                      placeholder="Contoh: Scan KTP asli yang masih berlaku..."
                      value={item.deskripsi}
                      onChange={(e) =>
                        handleUpdatePersyaratanAdministrasi(
                          index,
                          "deskripsi",
                          e.target.value,
                        )
                      }
                      rows={2}
                      className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3.5 py-2 outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40 text-slate-800 resize-none"
                    />
                  </div>

                  {/* Toggle Checkbox is_wajib */}
                  <div className="md:col-span-2 flex items-center justify-start md:justify-center pt-2 md:pt-4">
                    <label className="flex items-center gap-2 cursor-pointer select-none bg-white p-2.5 rounded-lg border border-slate-200 w-full hover:bg-slate-50">
                      <input
                        type="checkbox"
                        checked={item.is_wajib}
                        onChange={(e) =>
                          handleUpdatePersyaratanAdministrasi(
                            index,
                            "is_wajib",
                            e.target.checked,
                          )
                        }
                        className="w-4 h-4 rounded text-[#008BE3] focus:ring-[#008BE3] cursor-pointer"
                      />
                      <span className="text-xs font-bold text-slate-700">
                        Wajib Diunggah
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddPersyaratanAdministrasi}
              className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-[#008BE3] font-bold text-xs hover:border-[#008BE3] hover:bg-sky-50/50 transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer"
            >
              <Plus size={16} /> Tambah Dokumen Administrasi
            </button>
          </div>
        </div>

        {/* CARD 4: UNIT & ELEMEN KOMPETENSI (NESTED DYNAMIC LIST UNTUK APL-02) */}
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-xs border border-slate-200/80">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-sky-50 text-[#008BE3] flex items-center justify-center font-black text-sm shrink-0 border border-sky-100">
                4
              </span>
              Unit & Elemen Kompetensi (APL-02)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mb-6 ml-10">
            Mengelola Unit Kompetensi bertingkat berserta Elemen dan daftar
            Kriteria Unjuk Kerja (KUK) untuk asesmen mandiri.
          </p>

          <div className="space-y-8">
            {formState.unit_kompetensi.map((unit, uIdx) => (
              <div
                key={uIdx}
                className="border-2 border-slate-200 rounded-2xl overflow-hidden shadow-xs bg-white"
              >
                {/* Header Unit */}
                <div className="bg-slate-100/80 p-4 sm:p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-3 w-full">
                    {/* Kode Unit */}
                    <div className="md:col-span-4">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                        Kode Unit <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: J.611000.001.01"
                        value={unit.kode_unit}
                        onChange={(e) =>
                          handleUpdateUnit(uIdx, "kode_unit", e.target.value)
                        }
                        className="w-full font-bold text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40 text-slate-900"
                      />
                    </div>

                    {/* Judul Unit */}
                    <div className="md:col-span-8">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                        Judul Unit Kompetensi{" "}
                        <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Merancang Topologi Jaringan"
                        value={unit.judul_unit}
                        onChange={(e) =>
                          handleUpdateUnit(uIdx, "judul_unit", e.target.value)
                        }
                        className="w-full font-bold text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40 text-slate-900"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveUnit(uIdx)}
                    className="p-2 text-rose-600 hover:bg-rose-100/80 rounded-lg transition-colors shrink-0 md:mt-5 self-end md:self-start flex items-center gap-1 text-xs font-bold"
                    title="Hapus Unit Kompetensi"
                  >
                    <Trash2 size={16} />
                    <span className="md:hidden">Hapus Unit</span>
                  </button>
                </div>

                {/* Sub-list Elemen Kompetensi */}
                <div className="p-4 sm:p-6 space-y-6 bg-slate-50/30">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
                      <Layers size={14} className="text-[#008BE3]" />
                      Sub-list Elemen Kompetensi (Unit #{uIdx + 1})
                    </span>
                  </div>

                  {unit.elemen.map((el, eIdx) => (
                    <div
                      key={eIdx}
                      className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-2xs relative group"
                    >
                      {/* Delete Elemen button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveElemen(uIdx, eIdx)}
                        className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-all flex items-center gap-1 text-xs font-semibold"
                        title="Hapus Elemen Kompetensi"
                      >
                        <Trash2 size={14} />
                        <span className="hidden sm:inline">Hapus Elemen</span>
                      </button>

                      {/* Nama Elemen & is_wajib toggle */}
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mb-4 pr-12">
                        <div className="sm:col-span-9">
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                            Nama Elemen Kompetensi #{eIdx + 1}
                          </label>
                          <input
                            type="text"
                            placeholder="Contoh: Menyiapkan perancangan topologi"
                            value={el.nama_elemen}
                            onChange={(e) =>
                              handleUpdateElemen(
                                uIdx,
                                eIdx,
                                "nama_elemen",
                                e.target.value,
                              )
                            }
                            className="w-full text-xs font-bold border-b-2 border-slate-300 bg-transparent px-1 py-1.5 focus:border-[#008BE3] outline-none transition-colors text-slate-900"
                          />
                        </div>

                        <div className="sm:col-span-3 flex items-end">
                          <label className="flex items-center gap-2 cursor-pointer select-none pb-1">
                            <input
                              type="checkbox"
                              checked={el.is_wajib}
                              onChange={(e) =>
                                handleUpdateElemen(
                                  uIdx,
                                  eIdx,
                                  "is_wajib",
                                  e.target.checked,
                                )
                              }
                              className="w-4 h-4 rounded text-[#008BE3] focus:ring-[#008BE3] cursor-pointer"
                            />
                            <span className="text-xs font-bold text-slate-700">
                              Elemen Wajib
                            </span>
                          </label>
                        </div>
                      </div>

                      {/* Daftar Kriteria Unjuk Kerja (KUK) */}
                      <div className="bg-slate-50/80 p-3.5 rounded-lg border border-slate-200/80">
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-2">
                          Daftar Kriteria Unjuk Kerja (KUK)
                        </label>

                        <div className="space-y-2">
                          {el.kriteria_unjuk_kerja.map((kukStr, kIdx) => (
                            <div key={kIdx} className="flex gap-2 items-center">
                              <span className="text-xs font-bold text-slate-400 w-6 shrink-0 text-right">
                                {kIdx + 1}.
                              </span>
                              <input
                                type="text"
                                placeholder={`Contoh: ${eIdx + 1}.${kIdx + 1} Kebutuhan pengguna diidentifikasi.`}
                                value={kukStr}
                                onChange={(e) =>
                                  handleUpdateKUK(
                                    uIdx,
                                    eIdx,
                                    kIdx,
                                    e.target.value,
                                  )
                                }
                                className="flex-1 text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40 text-slate-800"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  handleRemoveKUK(uIdx, eIdx, kIdx)
                                }
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0 cursor-pointer"
                                title="Hapus baris KUK"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}

                          <button
                            type="button"
                            onClick={() => handleAddKUK(uIdx, eIdx)}
                            className="text-[11px] font-bold text-[#008BE3] hover:text-[#0076C2] uppercase tracking-wider hover:underline ml-8 mt-1 flex items-center gap-1 cursor-pointer"
                          >
                            <Plus size={13} /> Tambah Kriteria
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => handleAddElemen(uIdx)}
                    className="w-full py-2.5 border-2 border-dashed border-slate-300 rounded-lg text-slate-600 font-bold text-xs hover:border-[#008BE3] hover:text-[#008BE3] hover:bg-sky-50/50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus size={15} /> Tambah Elemen Kompetensi
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddUnit}
              className="w-full py-4 border-2 border-dashed border-slate-300 rounded-2xl text-[#008BE3] font-bold text-sm hover:border-[#008BE3] hover:bg-sky-50 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
            >
              <Plus size={18} /> Tambah Unit Kompetensi Baru
            </button>
          </div>
        </div>

        {/* CARD 5: KONFIGURASI SOAL ASESMEN (BANK SOAL ASESOR) */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-slate-200/80 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#008BE3]/10 text-[#008BE3] flex items-center justify-center font-black shrink-0 text-sm">
                5
              </span>
              <div>
                <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                  Konfigurasi Soal Asesmen (Dibuat oleh Asesor)
                </h2>
                <p className="text-xs text-slate-500">
                  Pilih paket/konfigurasi pertanyaan yang dibuat oleh Asesor
                  untuk dihubungkan dengan skema ini.
                </p>
              </div>
            </div>
            {formState.konfigurasi_soal_id && (
              <span className="px-2.5 py-1 text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full flex items-center gap-1.5">
                <CheckCircle2 size={13} />
                Konfigurasi Terhubung
              </span>
            )}
          </div>

          {/* Selector Dropdown */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Pilih Paket Konfigurasi Soal Asesor
            </label>
            <select
              value={formState.konfigurasi_soal_id || ""}
              onChange={(e) =>
                setFormState((prev) => ({
                  ...prev,
                  konfigurasi_soal_id: e.target.value,
                }))
              }
              className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm font-semibold bg-white text-slate-800 outline-none focus:border-[#008BE3] focus:ring-2 focus:ring-[#008BE3]/20 transition-all cursor-pointer"
            >
              <option value="">-- Pilih Konfigurasi Soal Asesor --</option>
              {konfigurasiPertanyaan.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nama} ({item.skema || "Semua Skema"}) - Versi{" "}
                  {item.versi || "1.0"} [
                  {item.status === "published" ? "Published" : "Draft"}]
                </option>
              ))}
            </select>
          </div>

          {/* Display selected configuration info & form list */}
          {selectedConfig ? (
            <div className="space-y-6 pt-2">
              {/* Config Metadata Banner */}
              <div className="p-4 sm:p-5 bg-slate-50/80 border border-slate-200/80 rounded-2xl space-y-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-bold text-sm text-slate-900">
                    {selectedConfig.nama}
                  </span>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-extrabold rounded-md tracking-wider uppercase ${
                      selectedConfig.status === "published"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {selectedConfig.status
                      ? selectedConfig.status.toUpperCase()
                      : "DRAFT"}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Skema:{" "}
                  <strong className="text-slate-800 font-bold">
                    {selectedConfig.skema}
                  </strong>{" "}
                  | Versi:{" "}
                  <strong className="text-slate-800 font-bold">
                    {selectedConfig.versi}
                  </strong>
                </p>
                <p className="text-xs text-slate-500">
                  Penyusun:{" "}
                  <strong className="text-slate-800 font-bold">
                    {selectedConfig.penyusun?.[0]?.label ||
                      "Aditya Rahman Syach, M.Kom (Asesor Utama)"}
                  </strong>
                </p>
                <p className="text-xs text-slate-500">
                  Validator:{" "}
                  <strong className="text-slate-800 font-bold">
                    {selectedConfig.validator?.[0]?.label ||
                      "I Made Jaya Artana, S.T., M.T. (Asesor)"}
                  </strong>
                </p>
              </div>

              {/* Tabs / Selector for Form list */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600">
                    DAFTAR FORM ASESMEN TERHUBUNG (
                    {selectedConfig.nama.toUpperCase()})
                  </label>
                  <span className="text-xs font-semibold text-slate-400">
                    4 Form Tersedia
                  </span>
                </div>

                {/* Tab Buttons */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => setActiveFormTab("frak07")}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      activeFormTab === "frak07"
                        ? "bg-sky-50/80 border-[#008BE3] text-[#008BE3] ring-1 ring-[#008BE3]/30"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                        FR.AK.07
                      </span>
                      <FileText size={16} />
                    </div>
                    <span className="text-xs font-bold line-clamp-1">
                      Penyesuaian Wajar
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveFormTab("fria04a")}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      activeFormTab === "fria04a"
                        ? "bg-sky-50/80 border-[#008BE3] text-[#008BE3] ring-1 ring-[#008BE3]/30"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">
                        FR.IA.04A
                      </span>
                      <Briefcase size={16} />
                    </div>
                    <span className="text-xs font-bold line-clamp-1">
                      Penjelasan Singkat Proyek
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveFormTab("fria04b")}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      activeFormTab === "fria04b"
                        ? "bg-sky-50/80 border-[#008BE3] text-[#008BE3] ring-1 ring-[#008BE3]/30"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-700">
                        FR.IA.04B
                      </span>
                      <ClipboardCheck size={16} />
                    </div>
                    <span className="text-xs font-bold line-clamp-1">
                      Penilaian Singkat Proyek
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveFormTab("fria07")}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      activeFormTab === "fria07"
                        ? "bg-sky-50/80 border-[#008BE3] text-[#008BE3] ring-1 ring-[#008BE3]/30"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-purple-100 text-purple-700">
                        FR.IA.07
                      </span>
                      <HelpCircle size={16} />
                    </div>
                    <span className="text-xs font-bold line-clamp-1">
                      Pertanyaan Lisan
                    </span>
                  </button>
                </div>

                {/* Active Form Preview Box */}
                <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
                  <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold">
                      <Eye size={15} className="text-[#008BE3]" />
                      <span>
                        Pratinjau Tampilan Form:{" "}
                        {activeFormTab === "frak07" &&
                          "FR.AK.07 - Penyesuaian yang Wajar dan Beralasan"}
                        {activeFormTab === "fria04a" &&
                          "FR.IA.04A - Penjelasan Singkat Proyek"}
                        {activeFormTab === "fria04b" &&
                          "FR.IA.04B - Penilaian Singkat Proyek"}
                        {activeFormTab === "fria07" &&
                          "FR.IA.07 - Pertanyaan Lisan"}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 sm:p-6 max-h-[600px] overflow-y-auto bg-[#F8F9FC]">
                    {activeFormTab === "frak07" && (
                      <FormFRAK07 readOnly={true} showHeader={false} />
                    )}
                    {activeFormTab === "fria04a" && (
                      <FormFRIA04A readOnly={true} showHeader={false} />
                    )}
                    {activeFormTab === "fria04b" && (
                      <FormFRIA04B readOnly={true} showHeader={false} />
                    )}
                    {activeFormTab === "fria07" && (
                      <FormFRIA07 readOnly={true} showHeader={false} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-500 mx-auto flex items-center justify-center">
                <FileText size={20} />
              </div>
              <p className="text-xs font-bold text-slate-600">
                Belum ada Konfigurasi Soal yang dipilih
              </p>
              <p className="text-[11px] text-slate-400 max-w-md mx-auto">
                Silakan pilih salah satu paket konfigurasi soal yang telah
                dipublikasikan oleh Asesor di atas untuk melihat preview form
                asesmen.
              </p>
            </div>
          )}
        </div>

        {/* Bottom Actions Bar */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 text-sm font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors shadow-xs"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => handleSubmit()}
            className="px-6 py-2.5 text-sm font-bold text-white bg-[#008BE3] hover:bg-[#0076C2] rounded-xl transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <CheckSquare size={18} />
            Simpan Skema
          </button>
        </div>
      </div>

      {/* SUCCESS & JSON PAYLOAD PREVIEW MODAL */}
      {isSuccessModalOpen && submittedPayload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <CheckCircle2 size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">
                    Skema Berhasil Disimpan
                  </h3>
                  <p className="text-xs text-slate-400">
                    Payload JSON hierarkis siap diinsert ke Supabase Relational
                    Schema
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Content / JSON Code */}
            <div className="p-5 overflow-y-auto space-y-4 flex-1 bg-slate-950 text-slate-200 font-mono text-xs">
              <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800">
                <span>Payload JSON Output:</span>
                <button
                  onClick={handleCopyPayload}
                  className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-sans transition-colors cursor-pointer"
                >
                  {copiedPayload ? (
                    <>
                      <Check size={14} className="text-emerald-400" />
                      <span className="text-emerald-400">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>Salin JSON</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="p-4 bg-slate-900 rounded-xl overflow-x-auto text-emerald-400 leading-relaxed border border-slate-800">
                {JSON.stringify(submittedPayload, null, 2)}
              </pre>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setIsSuccessModalOpen(false);
                  onCancel();
                }}
                className="px-5 py-2.5 bg-[#008BE3] hover:bg-[#0076C2] text-white font-bold text-sm rounded-xl transition-colors cursor-pointer"
              >
                Kembali ke Daftar Skema
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
