"use client";

import React, { useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Archive,
  XCircle,
  Trash2,
  FolderTree,
  Eye,
  ArrowLeft,
} from "lucide-react";
import { schemesData as initialSchemesData } from "../../data";
import { AVAILABLE_SCHEMES } from "@/data/schemes";
import { motion, AnimatePresence } from "motion/react";
import {
  MasterSkemaPayload,
  MasterSkemaUnitPayload,
  MasterSkemaElemenPayload,
  MasterSkemaFormState,
  ElemenKompetensiItem,
  UnitKompetensiItem,
  SchemeItem,
  StatCardProps,
  SchemeCardProps,
} from "@/types/types";
import { useAppContext } from "@/context/context";
import { TambahSkemaForm } from "@/components/forms/TambahSkemaForm";

export default function ManageSchemes() {
  const { user } = useAppContext();
  const readOnly = user?.role !== "admin";

  const [schemes, setSchemes] = useState<SchemeItem[]>(() => {
    return initialSchemesData
      .filter((s) => s.status !== "Draft")
      .map((s) => {
        const detail = AVAILABLE_SCHEMES.find((d) => d.name === s.name);
        let mappedUnits: UnitKompetensiItem[] = detail?.units?.map(
          (u, idx) => ({
            kodeUnit: u.code || "",
            judulUnit: u.title || "",
            urutan: idx + 1,
            elemen: u.elemen
              ? u.elemen.map((e, eIdx) => ({
                  namaElemen: e.title || "",
                  kriteriaUnjukKerja: Array.isArray(e.kuk) ? e.kuk : [e.kuk],
                  urutan: eIdx + 1,
                  isWajib: true,
                }))
              : [
                  {
                    namaElemen: "",
                    kriteriaUnjukKerja: [""],
                    urutan: 1,
                    isWajib: true,
                  },
                ],
          }),
        ) || [
          {
            kodeUnit: "",
            judulUnit: "",
            urutan: 1,
            elemen: [
              {
                namaElemen: "",
                kriteriaUnjukKerja: [""],
                urutan: 1,
                isWajib: true,
              },
            ],
          },
        ];

        if (s.name === "Penyelia Halal" && mappedUnits.length > 0) {
          mappedUnits = mappedUnits.map((u) => {
            let desc = "";
            if (u.kodeUnit === "M.74PHI00.001.2")
              desc =
                "Unit kompetensi ini berhubungan dengan pengetahuan, keterampilan, dan sikap kerja yang dibutuhkan dalam menyusun dokumen SJPH sesuai persyaratan standar.";
            else if (u.kodeUnit === "M.74PHI00.002.2")
              desc =
                "Unit kompetensi ini berhubungan dengan pengetahuan, keterampilan, dan sikap kerja yang berkaitan dengan penyiapan daftar bahan halal dan dokumen pendukungnya.";
            else if (u.kodeUnit === "M.74PHI00.003.2")
              desc =
                "Unit kompetensi ini berhubungan dengan pengetahuan, keterampilan, dan sikap kerja yang dibutuhkan dalam mengawasi bahan, proses, dan produk halal sesuai persyaratan standar.";
            else if (u.kodeUnit === "M.74PHI00.004.2")
              desc =
                "Unit kompetensi ini berhubungan dengan pengetahuan, keterampilan, dan sikap kerja yang dibutuhkan dalam melakukan penanganan produk yang tidak memenuhi kriteria halal sesuai persyaratan standar.";
            else if (u.kodeUnit === "M.74PHI00.005.2")
              desc =
                "Unit kompetensi ini berhubungan dengan pengetahuan, keterampilan, dan sikap kerja yang dibutuhkan dalam melakukan audit internal penerapan Sistem Jaminan Produk Halal (SJPH).";
            else if (u.kodeUnit === "M.74PHI00.006.2")
              desc =
                "Unit kompetensi ini berhubungan dengan pengetahuan, keterampilan dan sikap kerja yang dibutuhkan dalam melakukan evaluasi tindak lanjut hasil audit internal Sistem Jaminan Produk Halal (SJPH).";

            return { ...u, unitDesc: desc };
          });
        }

        return {
          ...s,
          nama: s.nama ?? s.name,
          kode: s.kode ?? s.code,
          kategori: s.kategori ?? "IT & Software",
          totalPendaftar: s.totalPendaftar ?? 0,
          unitKompetensi: mappedUnits,
        };
      });
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua Status");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState<SchemeItem | null>(null);

  const [categories, setCategories] = useState([
    "IT & Software",
    "Data Science",
    "Security",
    "Creative Design",
  ]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [editingCategoryIndex, setEditingCategoryIndex] = useState<
    number | null
  >(null);
  const [editCategoryName, setEditCategoryName] = useState("");

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory("");
    }
  };

  const handleUpdateCategory = (idx: number) => {
    if (
      editCategoryName.trim() &&
      !categories.includes(editCategoryName.trim())
    ) {
      const updated = [...categories];
      updated[idx] = editCategoryName.trim();
      setCategories(updated);
    }
    setEditingCategoryIndex(null);
  };

  const handleDeleteCategory = (idx: number) => {
    setCategories(categories.filter((_, i) => i !== idx));
  };

  const [formData, setFormData] = useState({
    nama: "",
    kode: "KKNI",
    nomorSertifikat: "",
    nomorRegistrasi: "",
    kategori: "IT & Software",
    status: "Active",
  });
  
  const [units, setUnits] = useState<UnitKompetensiItem[]>([
    {
      kodeUnit: "",
      judulUnit: "",
      urutan: 1,
      elemen: [
        { namaElemen: "", kriteriaUnjukKerja: [""], urutan: 1, isWajib: true },
      ],
    },
  ]);

  const filteredSchemes = schemes.filter((scheme) => {
    const matchesSearch =
      (scheme.nama || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (scheme.kode || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "Semua Status" || scheme.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalActive = schemes.filter((s) => s.status === "Active").length;
  const totalArchived = schemes.filter((s) => s.status === "Archived").length;

  const openPreviewModal = (scheme: SchemeItem) => {
    setSelectedScheme(scheme);
    setFormData({
      nama: scheme.nama,
      kode: scheme.kode,
      nomorSertifikat: scheme.nomorSertifikat || "",
      nomorRegistrasi: scheme.nomorRegistrasi || "",
      kategori: scheme.kategori,
      status: scheme.status,
    });
    setUnits(
      scheme.unitKompetensi || [
        {
          kodeUnit: "",
          judulUnit: "",
          urutan: 1,
          elemen: [
            {
              namaElemen: "",
              kriteriaUnjukKerja: [""],
              urutan: 1,
              isWajib: true,
            },
          ],
        },
      ],
    );
    setIsPreviewModalOpen(true);
  };

  const openEditModal = (scheme: SchemeItem) => {
    setSelectedScheme(scheme);
    setFormData({
      nama: scheme.nama,
      kode: scheme.kode,
      nomorSertifikat: scheme.nomorSertifikat || "",
      nomorRegistrasi: scheme.nomorRegistrasi || "",
      kategori: scheme.kategori,
      status: scheme.status,
    });
    setUnits(
      scheme.unitKompetensi || [
        {
          kodeUnit: "",
          judulUnit: "",
          urutan: 1,
          elemen: [
            {
              namaElemen: "",
              kriteriaUnjukKerja: [""],
              urutan: 1,
              isWajib: true,
            },
          ],
        },
      ],
    );
    setIsEditModalOpen(true);
  };

  const openArchiveModal = (scheme: SchemeItem) => {
    setSelectedScheme(scheme);
    setIsArchiveModalOpen(true);
  };

  const handleArchiveScheme = () => {
    if (selectedScheme) {
      setSchemes(
        schemes.map((s) =>
          s.id === selectedScheme.id ? { ...s, status: "Archived" } : s,
        ),
      );
    }
    setIsArchiveModalOpen(false);
    setSelectedScheme(null);
  };

  const categoryModalNode = (
    <AnimatePresence>
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCategoryModalOpen(false)}
            className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-md relative z-10 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-5">
                <h3 className="font-bold text-slate-900">Manajemen Kategori</h3>
                <button
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <XCircle size={20} />
                </button>
              </div>

              <div className="flex gap-2 mb-6">
                <input
                  type="text"
                  placeholder="Nama kategori baru..."
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40"
                />
                <button
                  onClick={handleAddCategory}
                  disabled={
                    !newCategory.trim() ||
                    categories.includes(newCategory.trim())
                  }
                  className="px-4 py-2 bg-[#008BE3] text-white text-sm font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#0076C2] transition-colors"
                >
                  Tambah
                </button>
              </div>

              <div className="space-y-2 max-h-75 overflow-y-auto pr-2">
                {categories.map((cat, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 border border-slate-100 bg-slate-50 rounded-lg group"
                  >
                    {editingCategoryIndex === idx ? (
                      <div className="flex gap-2 flex-1">
                        <input
                          type="text"
                          value={editCategoryName}
                          onChange={(e) => setEditCategoryName(e.target.value)}
                          className="flex-1 px-2 py-1 text-sm border border-slate-300 rounded outline-none"
                          autoFocus
                        />
                        <button
                          onClick={() => handleUpdateCategory(idx)}
                          className="text-xs font-bold text-emerald-600 px-2 hover:underline"
                        >
                          Simpan
                        </button>
                        <button
                          onClick={() => setEditingCategoryIndex(null)}
                          className="text-xs font-bold text-slate-500 px-2 hover:underline"
                        >
                          Batal
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="text-sm font-medium text-slate-700">
                          {cat}
                        </span>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => {
                              setEditingCategoryIndex(idx);
                              setEditCategoryName(cat);
                            }}
                            className="p-1.5 text-slate-400 hover:text-[#008BE3] rounded"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(idx)}
                            className="p-1.5 text-slate-400 hover:text-red-500 rounded"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  if (isModalOpen) {
    return (
      <TambahSkemaForm
        onCancel={() => setIsModalOpen(false)}
        onSaveSuccess={(payload: MasterSkemaPayload) => {
          const newScheme: SchemeItem = {
            id: Date.now().toString(),
            nama: payload.namaSkema,
            kode: payload.kodeSkema,
            nomorSertifikat: payload.nomorSertifikat,
            nomorRegistrasi: payload.nomorRegistrasi,
            kategori: "IT & Software",
            status: payload.statusAktif ? "Active" : "Draft",
            totalPendaftar: 0,
            unitKompetensi: payload.unitKompetensi?.map(
              (u: MasterSkemaUnitPayload, uIdx: number) => ({
                kodeUnit: u.kodeUnit,
                judulUnit: u.judulUnit,
                urutan: u.urutan || uIdx + 1,
                elemen:
                  u.elemen?.map(
                    (e: MasterSkemaElemenPayload, eIdx: number) => ({
                      namaElemen: e.namaElemen,
                      kriteriaUnjukKerja: Array.isArray(e.kriteriaUnjukKerja)
                        ? e.kriteriaUnjukKerja
                        : e.kriteriaUnjukKerja
                          ? (e.kriteriaUnjukKerja as string).split("\n")
                          : e.kuk || [""],
                      urutan: e.urutan || eIdx + 1,
                      isWajib: e.is_wajib ?? true,
                    }),
                  ) || [],
              }),
            ),
            persyaratanDasar: payload.persyaratanDasar,
          };
          setSchemes((prev) => [newScheme, ...prev]);
          setIsModalOpen(false);
        }}
      />
    );
  }

  if (isEditModalOpen && selectedScheme) {
    const initialData: Partial<MasterSkemaFormState> = {
      kodeSkema: selectedScheme.kode || "",
      namaSkema: selectedScheme.nama || "",
      nomorSertifikat: selectedScheme.nomorSertifikat || "",
      nomorRegistrasi: selectedScheme.nomorRegistrasi || "",
      statusAktif: selectedScheme.status === "Active",
      persyaratanDasar: selectedScheme.persyaratanDasar || [
        {
          namaDokumen: "Transkrip Nilai Semester 5",
          deskripsi:
            "Minimal semester 6 mahasiswa UIN SGD yang telah menyelesaikan matakuliah wajib skema.",
          urutan: 1,
          is_wajib: true,
        },
      ],
      persyaratanAdministrasi: selectedScheme.persyaratanAdministrasi || [
        {
          id: selectedScheme.id,
          namaDokumen: "Kartu Tanda Penduduk (KTP)",
          deskripsi: "Scan KTP asli atau identitas resmi yang masih berlaku.",
          isWajib: true,
          isAktif: true,
        },
      ],
      unitKompetensi:
        selectedScheme.unitKompetensi?.map(
          (u: UnitKompetensiItem, idx: number) => ({
            kodeUnit: u.kodeUnit || "",
            judulUnit: u.judulUnit || "",
            urutan: idx + 1,
            elemen:
              u.elemen?.map((e: ElemenKompetensiItem, eIdx: number) => ({
                namaElemen: e.namaElemen || "",
                kriteriaUnjukKerja: Array.isArray(e.kriteriaUnjukKerja)
                  ? e.kriteriaUnjukKerja
                  : e.kriteriaUnjukKerja
                    ? [e.kriteriaUnjukKerja as unknown as string]
                    : [""],
                urutan: eIdx + 1,
                isWajib: true,
              })) || [],
          }),
        ) || [],
    };

    return (
      <TambahSkemaForm
        onCancel={() => {
          setIsEditModalOpen(false);
          setSelectedScheme(null);
        }}
        initialData={initialData}
        onSaveSuccess={(payload: MasterSkemaPayload) => {
          setSchemes(
            schemes.map((s) =>
              s.id === selectedScheme.id
                ? {
                    ...s,
                    nama: payload.namaSkema,
                    kode: payload.kodeSkema,
                    nomorSertifikat: payload.nomorSertifikat,
                    nomorRegistrasi: payload.nomorRegistrasi,
                    status: payload.statusAktif ? "Active" : "Draft",
                    persyaratanDasar: payload.persyaratanDasar,
                    persyaratanAdministrasi: payload.persyaratanAdministrasi,
                    unitKompetensi: payload.unitKompetensi?.map(
                      (u: MasterSkemaUnitPayload, uIdx: number) => ({
                        kodeUnit: u.kodeUnit,
                        judulUnit: u.judulUnit,
                        urutan: u.urutan || uIdx + 1,
                        elemen: u.elemen?.map(
                          (e: MasterSkemaElemenPayload, eIdx: number) => ({
                            namaElemen: e.namaElemen,
                            kriteriaUnjukKerja: Array.isArray(e.kriteriaUnjukKerja)
                              ? e.kriteriaUnjukKerja
                              : e.kriteriaUnjukKerja
                                ? (e.kriteriaUnjukKerja as string).split("\n")
                                : e.kuk || [""],
                            urutan: e.urutan || eIdx + 1,
                            isWajib: e.is_wajib ?? true,
                          }),
                        ) || [],
                      }),
                    ),
                  }
                : s,
            ),
          );
          setIsEditModalOpen(false);
          setSelectedScheme(null);
        }}
      />
    );
  }

  if (isPreviewModalOpen) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] p-3 sm:p-6 md:p-8 pb-24 text-sm text-gray-700">
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setIsPreviewModalOpen(false)}
                className="w-10 h-10 rounded-lg flex items-center justify-center text-[#008BE3] bg-[#008BE3]/10 hover:bg-[#008BE3]/20 border border-[#008BE3]/20 transition-colors cursor-pointer shrink-0 shadow-xs"
                title="Kembali"
              >
                <ArrowLeft size={20} className="stroke-[2.5]" />
              </button>
              <div className="min-w-0">
                <h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">
                  Detail Skema Sertifikasi
                </h2>
                <p className="text-xs text-gray-500 font-medium tracking-wider uppercase leading-4">
                  Preview Informasi Utama, Persyaratan & Unit Kompetensi
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-xl shadow-xs border border-gray-100">
            <h2 className="text-base font-black text-slate-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-sky-50 text-[#008BE3] flex items-center justify-center shrink-0">
                1
              </span>
              Informasi Utama
            </h2>
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="min-w-0">
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    Kode Skema
                  </label>
                  <input
                    type="text"
                    disabled
                    value={formData.kode}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 font-semibold text-slate-800"
                  />
                </div>
                <div className="min-w-0">
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    Nama Skema
                  </label>
                  <input
                    type="text"
                    disabled
                    value={formData.nama}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 font-semibold text-slate-800"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="min-w-0">
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    Nomor Sertifikat
                  </label>
                  <input
                    type="text"
                    disabled
                    value={formData.nomorSertifikat || "-"}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 font-semibold text-slate-800"
                  />
                </div>
                <div className="min-w-0">
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    Nomor Registrasi
                  </label>
                  <input
                    type="text"
                    disabled
                    value={formData.nomorRegistrasi || "-"}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 font-semibold text-slate-800"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="min-w-0">
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    Status
                  </label>
                  <input
                    type="text"
                    disabled
                    value={formData.status}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 font-semibold text-slate-800"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-xl shadow-xs border border-gray-100">
            <h2 className="text-base font-black text-slate-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-sky-50 text-[#008BE3] flex items-center justify-center shrink-0">
                2
              </span>
              Unit & Elemen Kompetensi
            </h2>

            <div className="space-y-6">
              {units.map((unit, uIdx) => (
                <div
                  key={uIdx}
                  className="border border-slate-200 rounded-xl overflow-hidden shadow-xs"
                >
                  <div className="bg-slate-50 px-5 py-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1 flex flex-col gap-4 w-full">
                      <div className="min-w-0">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                          Kode Unit
                        </label>
                        <input
                          type="text"
                          disabled
                          value={unit.kodeUnit || ""}
                          className="w-full font-bold text-sm bg-white border border-slate-200 rounded-lg px-3 h-10.5 text-slate-800"
                        />
                      </div>
                      <div className="min-w-0">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                          Judul Unit
                        </label>
                        <input
                          type="text"
                          disabled
                          value={unit.judulUnit}
                          className="w-full font-bold text-sm bg-white border border-slate-200 rounded-lg px-3 h-10.5 text-slate-800"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-5 space-y-5 bg-white">
                    {unit.elemen?.map((el, eIdx) => (
                      <div
                        key={eIdx}
                        className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs relative"
                      >
                        <div className="mb-4">
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                            Elemen Kompetensi
                          </label>
                          <input
                            type="text"
                            disabled
                            value={el.namaElemen}
                            className="w-full text-sm border-b-2 border-slate-200 bg-transparent px-0 py-1.5 font-semibold text-slate-800 outline-none"
                          />
                        </div>

                        <div className="min-w-0">
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                            Kriteria Unjuk Kerja
                          </label>
                          <div className="space-y-2">
                            {el.kriteriaUnjukKerja.map((kukStr, kIdx) => (
                              <div
                                key={kIdx}
                                className="flex gap-2 items-start"
                              >
                                <span className="text-xs font-bold text-slate-400 mt-2.5 w-4 shrink-0 text-right">
                                  {kIdx + 1}.
                                </span>
                                <textarea
                                  disabled
                                  value={kukStr}
                                  className="flex-1 text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 resize-none min-h-11"
                                  rows={1}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24 text-sm text-gray-700">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-[#008BE3]/10 flex items-center justify-center text-[#008BE3] border border-[#008BE3]/20 shadow-xs shrink-0">
            <FolderTree size={20} className="stroke-[2.5]" />
          </div>
          <div className="min-w-0">
            <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none mb-1 md:whitespace-nowrap">
              Skema Sertifikasi
            </h2>
            <p className="text-xs text-gray-400 font-bold tracking-wider uppercase leading-4 md:whitespace-nowrap">
              Konfigurasi dan pantau daftar skema kompetensi BNSP.
            </p>
          </div>
        </div>
        {!readOnly && (
          <button
            onClick={() => {
              setFormData({
                nama: "",
                kode: "KKNI",
                nomorSertifikat: "",
                nomorRegistrasi: "",
                kategori: "IT & Software",
                status: "Active",
              });
              setIsModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#008BE3] hover:bg-[#0076C2] text-white rounded-lg text-xs md:text-sm font-extrabold shadow-md hover:shadow-lg transition-all shrink-0 cursor-pointer"
          >
            <Plus size={16} className="stroke-3" />
            <span>Skema Baru</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard label="Total Skema" value={schemes.length} color="text-slate-900" />
        <StatCard label="Aktif" value={totalActive} color="text-[#008BE3]" />
        <StatCard label="Diarsipkan" value={totalArchived} color="text-gray-400" />
      </div>

      <section className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-slate-50/50">
          <div className="min-w-0">
            <h3 className="text-base font-black text-slate-900">
              Daftar Skema
            </h3>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 w-full lg:w-auto ml-auto">
            <div className="flex items-center gap-2 bg-white rounded-lg px-3 h-10.5 w-full sm:w-68 border border-gray-200/80 focus-within:border-[#008BE3]/40 transition-colors shadow-sm">
              <Search className="text-gray-400 shrink-0" size={16} />
              <input
                type="text"
                placeholder="Cari nama atau kode skema..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none focus:ring-0 text-[14px] w-full outline-none text-gray-700 placeholder-gray-400 font-semibold"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-gray-200/80 text-[14px] rounded-lg px-3 h-10.5 outline-none text-gray-700 cursor-pointer font-bold w-full sm:w-auto shadow-sm"
            >
              <option>Semua Status</option>
              <option>Active</option>
              <option>Archived</option>
            </select>
          </div>
        </div>

        <div className="p-6 space-y-4 bg-slate-50/30">
          {filteredSchemes.map((scheme, i) => (
            <SchemeCard
              key={scheme.id}
              scheme={scheme}
              index={i}
              onEdit={() => openEditModal(scheme)}
              onPreview={() => openPreviewModal(scheme)}
              onArchive={() => openArchiveModal(scheme)}
              readOnly={readOnly}
            />
          ))}
          
          {filteredSchemes.length === 0 && (
            <div className="text-center py-12">
              <FolderTree size={38} className="mx-auto text-slate-300 mb-3" />
              <p className="text-sm font-bold text-slate-700">Skema tidak ditemukan</p>
              <p className="text-xs text-slate-400 mt-1">Coba ubah kata kunci pencarian atau filter status.</p>
            </div>
          )}
        </div>
      </section>

      {categoryModalNode}

      <AnimatePresence>
        {isArchiveModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsArchiveModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-sm relative z-10 overflow-hidden"
            >
              <div className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center mx-auto mb-4">
                  <Archive size={24} />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">
                  Arsipkan Skema
                </h3>
                <p className="text-sm text-gray-500">
                  Apakah Anda yakin ingin mengarsipkan skema{" "}
                  <span className="font-bold text-slate-700">{selectedScheme?.nama}</span>?
                </p>
              </div>
              <div className="p-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
                <button
                  onClick={() => setIsArchiveModalOpen(false)}
                  className="px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={handleArchiveScheme}
                  className="px-4 py-2 text-sm font-bold text-white bg-slate-700 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  Arsipkan
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ label, value, color = "text-[#008BE3]" }: StatCardProps) {
  let bgColor = "bg-white";
  let borderColor = "border-gray-100";
  let textColor = color;
  let labelColor = "text-gray-400";

  if (label === "Total Skema") {
    bgColor = "bg-[#E6F4FF]";
    borderColor = "border-[#BCE0FD]";
    textColor = "text-sky-800";
    labelColor = "text-sky-600";
  } else if (label === "Aktif") {
    bgColor = "bg-[#F4FBF7]";
    borderColor = "border-[#A7F3D0]";
    textColor = "text-emerald-700";
    labelColor = "text-emerald-600";
  } else if (label === "Diarsipkan") {
    bgColor = "bg-[#F1F5F9]";
    borderColor = "border-[#CBD5E1]";
    textColor = "text-slate-700";
    labelColor = "text-slate-500";
  }

  return (
    <div
      className={`${bgColor} p-5 rounded-xl shadow-sm border ${borderColor} flex flex-col justify-center relative overflow-hidden group hover:scale-[1.01] transition-transform duration-200 cursor-pointer`}
    >
      <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 z-10 ${labelColor}`}>
        {label}
      </p>
      <p className={`text-2xl font-black z-10 ${textColor}`}>{value}</p>
    </div>
  );
}

function SchemeCard({
  scheme,
  index,
  onEdit,
  onArchive,
  onPreview,
  readOnly,
}: SchemeCardProps) {
  const Icon = FolderTree; 

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: (index as number) * 0.05 }}
      className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between hover:border-[#008BE3]/40 hover:shadow-md transition-all group"
    >
      <div className="flex items-start md:items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-sky-50 text-[#008BE3] flex items-center justify-center shrink-0 border border-sky-100 shadow-xs">
          <Icon size={22} className="stroke-2" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <h3 className="font-extrabold text-slate-900 text-base">{scheme.nama}</h3>
            <span
              className={`px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider font-bold inline-flex items-center gap-1.5 border whitespace-nowrap shrink-0 ${
                scheme.status === "Active"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-slate-50 text-slate-600 border-slate-200"
              }`}
            >
              {scheme.status === "Active" && <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>}
              {scheme.status}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 font-semibold">
            {/* Tampilan Kode Skema */}
            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200">
              {scheme.kode}
            </span>
            {/* Jumlah Unit Kompetensi (Kategori sudah dibuang) */}
            {scheme.unitKompetensi && (
              <span className="flex items-center gap-1.5">
                <span className="w-1 h-1 bg-slate-300 rounded-full"></span> 
                {scheme.unitKompetensi.length} Unit Kompetensi
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-5 md:mt-0 flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
        <div className="text-left md:text-right">
          <p className="text-xl font-black text-slate-800 leading-none">
            {scheme.totalPendaftar}
          </p>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1.5">
            Total Asesi
          </p>
        </div>
        <div className="flex items-center gap-2 border-l border-slate-100 pl-6">
          <button
            onClick={onPreview}
            className="p-2 text-slate-400 hover:text-[#008BE3] hover:bg-sky-50 rounded-lg transition-colors border border-transparent hover:border-sky-200 cursor-pointer"
            title="Lihat Detail"
          >
            <Eye size={18} />
          </button>
          {!readOnly && (
            <>
              <button
                onClick={onEdit}
                className="p-2 text-slate-400 hover:text-[#008BE3] hover:bg-sky-50 rounded-lg transition-colors border border-transparent hover:border-sky-200 cursor-pointer"
                title="Edit Skema"
              >
                <Edit size={18} />
              </button>
              {scheme.status !== "Archived" && (
                <button
                  onClick={onArchive}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-200 cursor-pointer"
                  title="Arsipkan"
                >
                  <Archive size={18} />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}