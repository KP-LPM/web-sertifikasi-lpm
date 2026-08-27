"use client";

import React, { useState } from "react";
import {
  Plus,
  Search,
  Code,
  BarChart2,
  Shield,
  PenTool,
  Edit,
  Archive,
  XCircle,
  Trash2,
  GraduationCap,
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

  // Remove "Draft" status from initial data and setup state
  const [schemes, setSchemes] = useState<SchemeItem[]>(() => {
    return initialSchemesData
      .filter((s) => s.status !== "Draft")
      .map((s) => {
        const detail = AVAILABLE_SCHEMES.find((d) => d.name === s.name);
        let mappedUnits: UnitKompetensiItem[] = detail?.units?.map(
          (u, idx) => ({
            kodeUnit: u.code || "",
            judulUnit: u.title || "",
            urutan: idx + 1, // Tambahkan urutan untuk UnitKompetensiItem
            elemen: u.elemen
              ? u.elemen.map((e, eIdx) => ({
                  namaElemen: e.title || "", // Ubah title menjadi namaElemen
                  kriteriaUnjukKerja: Array.isArray(e.kuk) ? e.kuk : [e.kuk], // Ubah kuk menjadi kriteriaUnjukKerja
                  urutan: eIdx + 1, // Tambahkan urutan untuk ElemenKompetensiItem
                  isWajib: true, // Tambahkan isWajib
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
            kodeUnit: "", // Ubah kode menjadi kodeUnit
            judulUnit: "", // Ubah judul menjadi judulUnit
            urutan: 1, // Tambahkan urutan
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

  // Form State
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
    // Tambahkan fallback string kosong (|| "") untuk mencegah undefined
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
                urutan: u.urutan || uIdx + 1, // Berikan nilai urutan
                elemen:
                  u.elemen?.map(
                    (e: MasterSkemaElemenPayload, eIdx: number) => ({
                      namaElemen: e.namaElemen, // Sesuaikan dengan interface ElemenKompetensiItem
                      kriteriaUnjukKerja: Array.isArray(e.kriteriaUnjukKerja) // Sesuaikan nama properti
                        ? e.kriteriaUnjukKerja
                        : e.kriteriaUnjukKerja
                          ? (e.kriteriaUnjukKerja as string).split("\n")
                          : e.kuk || [""],
                      urutan: e.urutan || eIdx + 1, // Wajib disertakan
                      isWajib: e.is_wajib ?? true, // Wajib disertakan
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
          namaDokumen: "Kartu Tadnda Penduduk (KTP)",
          deskripsi: "Scan KTP asli atau identitas resmi yang masih berlaku.",
          isWajib: true,
          isAktif: true,
        },
      ],
      unitKompetensi:
        selectedScheme.unitKompetensi?.map(
          (u: UnitKompetensiItem, idx: number) => ({
            kodeUnit: u.kodeUnit || "", // Gunakan kodeUnit (bukan kode)
            judulUnit: u.judulUnit || "", // Gunakan judulUnit (bukan judul)
            urutan: idx + 1,
            elemen:
              u.elemen?.map((e: ElemenKompetensiItem, eIdx: number) => ({
                namaElemen: e.namaElemen || "", // Gunakan namaElemen (bukan nama_elemen / judul)
                kriteriaUnjukKerja: Array.isArray(e.kriteriaUnjukKerja)
                  ? e.kriteriaUnjukKerja
                  : e.kriteriaUnjukKerja
                    ? [e.kriteriaUnjukKerja as unknown as string]
                    : [""],
                urutan: eIdx + 1,
                isWajib: true, // Gunakan isWajib (bukan is_wajib)
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
                    code: payload.kodeSkema,
                    nomorSertifikat: payload.nomorSertifikat,
                    nomorRegistrasi: payload.nomorRegistrasi,
                    status: payload.statusAktif ? "Active" : "Draft",
                    persyaratanDasar: payload.persyaratanDasar,
                    persyaratanAdministrasi: payload.persyaratanAdministrasi,
                    units: payload.unitKompetensi?.map(
                      (u: MasterSkemaUnitPayload) => ({
                        kode: u.kodeUnit,
                        judul: u.judulUnit,
                        unitDesc: "",
                        elemen: u.elemen?.map(
                          (e: MasterSkemaElemenPayload) => ({
                            title: e.namaElemen,
                            kuk: Array.isArray(e.kriteriaUnjukKerja)
                              ? e.kriteriaUnjukKerja
                              : e.kriteriaUnjukKerja
                                ? e.kriteriaUnjukKerja.split("\n")
                                : e.kuk || [],
                          }),
                        ),
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
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setIsPreviewModalOpen(false)}
                className="px-4 py-2 text-xs sm:text-sm font-bold text-[#008BE3] bg-[#008BE3]/10 hover:bg-[#008BE3]/20 border border-[#008BE3]/20 rounded-lg transition-colors cursor-pointer"
              >
                Kembali
              </button>
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
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 font-semibold"
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
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 font-semibold"
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
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 font-semibold"
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
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 font-semibold"
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
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 font-semibold"
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

            <div className="space-y-8">
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
                          className="w-full font-bold text-sm bg-white border border-slate-200 rounded-lg px-3 h-10.5"
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
                          className="w-full font-bold text-sm bg-white border border-slate-200 rounded-lg px-3 h-10.5"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-5 space-y-6">
                    {unit.elemen?.map((el, eIdx) => (
                      <div
                        key={eIdx}
                        className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs relative"
                      >
                        <div className="mb-4 pr-8">
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                            Elemen Kompetensi
                          </label>
                          <input
                            type="text"
                            disabled
                            value={el.namaElemen}
                            className="w-full text-sm border-b-2 border-slate-200 bg-transparent px-0 py-1.5 font-semibold text-slate-800"
                          />
                        </div>

                        <div className="min-w-0">
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                            Kriteria untuk Kerja
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
        {categoryModalNode}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC] p-4 md:p-8 space-y-6 pb-24 text-sm text-gray-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-[#008BE3]/10 flex items-center justify-center text-[#008BE3] border border-[#008BE3]/20 shadow-xs shrink-0">
            <GraduationCap size={20} className="stroke-[2.5]" />
          </div>
          <div className="min-w-0">
            <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">
              Skema Sertifikasi
            </h2>
            <p className="text-xs text-gray-500 font-medium tracking-wider uppercase leading-4">
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
            className="bg-[#008BE3] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm font-bold shadow-xs hover:bg-[#0076C2] transition-colors"
          >
            <Plus size={18} className="stroke-[2.5]" />
            Skema Baru
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard
          label="Total Skema"
          value={schemes.length}
          color="text-slate-900"
        />
        <StatCard label="Aktif" value={totalActive} color="text-[#008BE3]" />
        <StatCard
          label="Diarsipkan"
          value={totalArchived}
          color="text-gray-400"
        />
      </div>

      <div className="bg-white rounded-lg p-5 shadow-xs border border-gray-100 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Cari skema berdasarkan nama atau kode..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3] outline-none text-sm transition-all placeholder:text-gray-400"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-gray-200 px-4 py-2.5 rounded-lg text-sm text-slate-700 outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]"
          >
            <option>Semua Status</option>
            <option>Active</option>
            <option>Archived</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
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
      </div>

      {categoryModalNode}

      <AnimatePresence>
        {isArchiveModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsArchiveModalOpen(false)}
              className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-sm relative z-10 overflow-hidden"
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
                  {selectedScheme?.nama}?
                </p>
              </div>
              <div className="p-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
                <button
                  onClick={() => setIsArchiveModalOpen(false)}
                  className="px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleArchiveScheme}
                  className="px-4 py-2 text-sm font-bold text-white bg-slate-700 hover:bg-slate-800 rounded-lg transition-colors"
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
  return (
    <div className="bg-white p-5 rounded-lg shadow-xs border border-gray-100 flex flex-col justify-center">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className={`text-2xl font-black ${color}`}>{value}</p>
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
  const icons: Record<string, React.ElementType> = {
    "IT & Software": Code,
    "Data Science": BarChart2,
    Security: Shield,
    "Creative Design": PenTool,
  };

  const Icon = icons[scheme.kategori] || Code;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: (index as number) * 0.05 }}
      className="bg-white p-5 rounded-lg shadow-xs border border-gray-100 flex flex-col md:flex-row md:items-center justify-between hover:border-[#008BE3]/30 transition-colors group"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-[#E6F4FF] text-[#008BE3] flex items-center justify-center shrink-0 border border-[#BCE0FD]">
          <Icon size={24} className="stroke-[1.5]" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-slate-900">{scheme.nama}</h3>
            <span
              className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider border ${
                scheme.status === "Active"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-gray-50 text-gray-500 border-gray-200"
              }`}
            >
              {scheme.status}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
            <span className="bg-gray-100 px-2 py-0.5 rounded">
              {scheme.kode}
            </span>
            <span>{scheme.nama}</span>
            <span>{scheme.kategori}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 md:mt-0 flex items-center gap-6">
        <div className="text-center md:text-right">
          <p className="text-xl font-black text-slate-900 leading-none">
            {scheme.totalPendaftar}
          </p>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">
            Total Asesi
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onPreview}
            className="p-2 text-gray-400 hover:text-[#008BE3] hover:bg-sky-50 rounded-lg transition-colors border border-transparent hover:border-sky-100"
            title="Lihat"
          >
            <Eye size={16} />
          </button>
          {!readOnly && (
            <>
              <button
                onClick={onEdit}
                className="p-2 text-gray-400 hover:text-[#008BE3] hover:bg-sky-50 rounded-lg transition-colors border border-transparent hover:border-sky-100"
                title="Edit"
              >
                <Edit size={16} />
              </button>
              {scheme.status !== "Archived" && (
                <button
                  onClick={onArchive}
                  className="p-2 text-gray-400 hover:text-slate-700 hover:bg-gray-100 rounded-lg transition-colors border border-transparent hover:border-gray-200"
                  title="Arsip"
                >
                  <Archive size={16} />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
