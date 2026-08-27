"use client";

import React, { useState } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  MapPin,
  Building2,
  CheckCircle,
  XCircle,
  Eye,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAppContext } from "@/context/context";
import { TukItem, TukInventarisItem } from "@/types/types";

const UIN_BUILDINGS = [
  "Gedung C: Gedung Fak. Ilmu Sosial dan Ilmu Politik",
  "Gedung D: Gedung Abjan Soelaiman (Auditorium)",
  "Gedung E: Gedung Fak. Ekonomi dan Bisnis Islam Lama",
  "Gedung F: Gedung Fak. Ushuluddin Lama",
  "Gedung H: Gedung Solahuddin Sanusi (Lab. Terpadu)",
  "Gedung I: Gedung Anwar Musaddad (Aula Multipurpose)",
  "Gedung J: Gedung Fak. Sains dan Teknologi",
  "Gedung K: Gedung Language Centre",
  "Gedung L: Gedung PTIPD",
  "Gedung M: Gedung Fakultas Psikologi",
  "Gedung N: Gedung Fak. Adab dan Humaniora",
  "Gedung O: Gedung Fak. Dakwah dan Komunikasi",
  "Gedung P: Gedung Lab. Dakwah",
  "Gedung Q: Gedung Fak. Syariah dan Hukum",
  "Gedung R: Gedung Perkuliahan Fak. Dakwah dan Komunikasi",
  "Gedung S: Gedung Perkuliahan Fak. Syari'ah dan Hukum",
  "Gedung T: Gedung Perkuliahan Fak. Ushuluddin",
  "Gedung U: Gedung Perkuliahan Fak. Dakwah dan Komunikasi",
  "Gedung V: Gedung Perkuliahan Fak. Adab dan Humaniora",
  "Online Meeting",
];

const DEFAULT_ADDRESS =
  "UIN Sunan Gunung Djati, Jl. AH. Nasution No.105, Cipadung Wetan, Kec. Cibiru, Kota Bandung, Jawa Barat 40614";

const INITIAL_TUK_DATA = [
  {
    id: "GD-001",
    nama: "Gedung C: Gedung Fak. Ilmu Sosial dan Ilmu Politik",
    keterangan: "Ruang Aula Utama",
    tipe: "Sewaktu",
    alamat: DEFAULT_ADDRESS,
    status: "Aktif",
    kapasitas: 50,
    penanggungJawab: "Dr. Ahmad Solihin",
    inventaris: [
      { nama: "Meja", jumlah: 25 },
      { nama: "Kursi", jumlah: 50 },
      { nama: "Lemari", jumlah: 2 },
    ],
  },
  {
    id: "GD-002",
    nama: "Gedung D: Gedung Abjan Soelaiman (Auditorium)",
    keterangan: "Ruang Seminar 1",
    tipe: "Sewaktu",
    alamat: DEFAULT_ADDRESS,
    status: "Aktif",
    kapasitas: 200,
    penanggungJawab: "Budi Santoso, M.Ag.",
    inventaris: [
      { nama: "Meja", jumlah: 10 },
      { nama: "Kursi", jumlah: 200 },
      { nama: "Sound System", jumlah: 2 },
    ],
  },
];

export default function TukManagement() {
  const { user } = useAppContext();
  const readOnly = user?.role !== "admin";

  const [tukData, setTukData] = useState<TukItem[]>(INITIAL_TUK_DATA);
  const [searchTerm, setSearchTerm] = useState("");
  const [tipeFilter, settipeFilter] = useState("Semua tipe");
  const [statusFilter, setStatusFilter] = useState("Semua Status");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [selectedTuk, setSelectedTuk] = useState<TukItem | null>(null);

  const DEFAULT_FORM_DATA: TukItem = {
    id: "",
    nama: UIN_BUILDINGS[0],
    tipe: "Sewaktu",
    alamat: DEFAULT_ADDRESS,
    status: "Aktif",
    kapasitas: 0,
    penanggungJawab: "",
    keterangan: "",
    inventaris: [
      { nama: "Meja", jumlah: 0 },
      { nama: "Kursi", jumlah: 0 },
      { nama: "Lemari", jumlah: 0 },
    ],
  };

  const [formData, setFormData] = useState<TukItem>(DEFAULT_FORM_DATA);

  // Filter
  const filteredTuk = tukData.filter((tuk) => {
    const matchSearch =
      tuk.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tuk.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchtipe = tipeFilter === "Semua tipe" || tuk.tipe === tipeFilter;
    const matchStatus =
      statusFilter === "Semua Status" || tuk.status === statusFilter;
    return matchSearch && matchtipe && matchStatus;
  });

  const openEditModal = (tuk: TukItem) => {
    // Ensure legacy data has inventaris and penanggungJawab
    const fullTuk: TukItem = {
      ...tuk,
      penanggungJawab: tuk.penanggungJawab || "",
      keterangan: tuk.keterangan || "",
      inventaris: tuk.inventaris || DEFAULT_FORM_DATA.inventaris,
    };
    setSelectedTuk(fullTuk);
    setFormData(fullTuk);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (tuk: TukItem) => {
    setSelectedTuk(tuk);
    setIsDeleteModalOpen(true);
  };

  const openDetailModal = (tuk: TukItem) => {
    setSelectedTuk(tuk);
    setIsDetailModalOpen(true);
  };

  const saveEdit = () => {
    setTukData(tukData.map((t) => (t.id === formData.id ? formData : t)));
    setIsEditModalOpen(false);
  };

  const saveAdd = () => {
    const newTuk: TukItem = {
      ...formData,
      id: `GD-00${tukData.length + 1}`,
    };
    setTukData([...tukData, newTuk]);
    setIsModalOpen(false);
    setFormData(DEFAULT_FORM_DATA);
  };

  const confirmDelete = () => {
    if (selectedTuk) {
      setTukData(tukData.filter((t) => t.id !== selectedTuk.id));
      setIsDeleteModalOpen(false);
    }
  };

  const handleInventarisChange = (
    index: number,
    field: keyof TukInventarisItem,
    value: string | number,
  ) => {
    const newInventaris = [...(formData.inventaris || [])];
    newInventaris[index] = { ...newInventaris[index], [field]: value };
    setFormData({ ...formData, inventaris: newInventaris });
  };

  const addInventaris = () => {
    setFormData({
      ...formData,
      inventaris: [...(formData.inventaris || []), { nama: "", jumlah: 0 }],
    });
  };

  const removeInventaris = (index: number) => {
    const newInventaris = formData.inventaris?.filter((_, i) => i !== index);
    setFormData({ ...formData, inventaris: newInventaris });
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] p-4 md:p-8 space-y-6 pb-24 text-sm text-gray-700">
      {/* Header section... */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-[#008BE3]/10 flex items-center justify-center text-[#008BE3] border border-[#008BE3]/20 shadow-xs shrink-0">
            <MapPin size={20} className="stroke-[2.5]" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">
              Manajemen TUK
            </h1>
            <p className="text-xs text-gray-500 font-medium tracking-wider uppercase leading-4">
              Kelola Tempat Uji Kompetensi dan kapasitasnya
            </p>
          </div>
        </div>
        {!readOnly && (
          <button
            onClick={() => {
              setFormData(DEFAULT_FORM_DATA);
              setIsModalOpen(true);
            }}
            className="bg-[#008BE3] hover:bg-[#0076C2] text-white px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-sm w-full sm:w-auto justify-center"
          >
            <Plus size={18} />
            Tambah TUK Baru
          </button>
        )}
      </div>

      {/* Filters... */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Cari ID atau nama TUK..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40 transition-all font-medium"
          />
        </div>
        <div className="flex gap-3">
          <select
            value={tipeFilter}
            onChange={(e) => settipeFilter(e.target.value)}
            className="bg-gray-50 border border-gray-200 text-slate-700 text-sm rounded-lg px-4 py-2 outline-none focus:border-[#008BE3] font-medium min-w-35"
          >
            <option>Semua tipe</option>
            <option>Sewaktu</option>
            <option>Mandiri</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-50 border border-gray-200 text-slate-700 text-sm rounded-lg px-4 py-2 outline-none focus:border-[#008BE3] font-medium min-w-35"
          >
            <option>Semua Status</option>
            <option>Aktif</option>
            <option>Tidak Aktif</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredTuk.map((tuk) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              key={tuk.id}
              className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col group overflow-hidden"
            >
              <div className="p-5 border-b border-gray-50 flex-1">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-bold text-[#008BE3] bg-sky-50 px-2.5 py-1 rounded-md tracking-wide">
                    {tuk.id}
                  </span>
                  <div className="flex items-center gap-1.5 sm:opacity-0 group-hover:opacity-100 opacity-100 transition-opacity">
                    <button
                      onClick={() => openDetailModal(tuk)}
                      className="px-2.5 py-1 text-xs font-bold text-[#008BE3] bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer"
                      title="Lihat Detail"
                    >
                      <Eye size={14} />
                      <span>Detail</span>
                    </button>
                    {!readOnly && (
                      <>
                        <button
                          onClick={() => openEditModal(tuk)}
                          className="p-1.5 text-gray-400 hover:text-amber-500 hover:bg-amber-50 rounded-md transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => openDeleteModal(tuk)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <h3 className="font-bold text-slate-900 text-lg mb-1 leading-tight">
                  {tuk.nama}
                </h3>

                <div className="flex items-center gap-2 mt-4 text-sm text-gray-500 font-medium">
                  <MapPin size={16} className="text-gray-400 shrink-0" />
                  <span className="line-clamp-2">{tuk.alamat}</span>
                </div>
              </div>

              <div className="p-4 bg-gray-50/50 flex items-center justify-between mt-auto">
                <div className="flex items-center gap-4 text-xs font-bold">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Building2 size={14} className="text-slate-400" />
                    {tuk.kapasitas} Orang
                  </div>
                  <div className="flex items-center gap-1.5">
                    {tuk.status === "Aktif" ? (
                      <span className="text-emerald-600 flex items-center gap-1">
                        <CheckCircle size={14} /> Aktif
                      </span>
                    ) : (
                      <span className="text-red-500 flex items-center gap-1">
                        <XCircle size={14} /> Tidak Aktif
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-[10px] uppercase tracking-wider font-bold text-slate-500 bg-white border border-gray-200 px-2 py-1 rounded-md">
                  {tuk.tipe}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredTuk.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100 border-dashed">
          <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 size={24} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">
            Tidak ada TUK ditemukan
          </h3>
          <p className="text-gray-500 text-sm">
            Coba sesuaikan kata kunci pencarian atau filter Anda.
          </p>
        </div>
      )}

      {/* Add / Edit Modal */}
      <AnimatePresence>
        {(isModalOpen || isEditModalOpen) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsModalOpen(false);
                setIsEditModalOpen(false);
              }}
              className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-2xl relative z-10 overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <h3 className="font-bold text-slate-900 text-lg">
                  {isEditModalOpen ? "Edit TUK" : "Tambah TUK Baru"}
                </h3>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setIsEditModalOpen(false);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Plus size={20} className="rotate-45" />
                </button>
              </div>

              <div className="p-6 space-y-5 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Nama Gedung/Alamat
                    </label>
                    <select
                      value={formData.nama}
                      onChange={(e) =>
                        setFormData({ ...formData, nama: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40 bg-white"
                    >
                      {UIN_BUILDINGS.map((building) => (
                        <option key={building} value={building}>
                          {building}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="min-w-0">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Keterangan Ruangan/Link
                    </label>
                    <input
                      type="text"
                      placeholder="Misal: Aula Lantai 1"
                      value={formData.keterangan}
                      onChange={(e) =>
                        setFormData({ ...formData, keterangan: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40"
                    />
                  </div>
                  <div className="min-w-0">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Penanggung Jawab TUK
                    </label>
                    <input
                      type="text"
                      placeholder="Nama Penanggung Jawab"
                      value={formData.penanggungJawab}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          penanggungJawab: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40"
                    />
                  </div>

                  <div className="min-w-0">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Kapasitas Peserta
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      value={formData.kapasitas}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          kapasitas: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40"
                    />
                  </div>

                  <div className="min-w-0">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      tipe TUK
                    </label>
                    <select
                      value={formData.tipe}
                      onChange={(e) =>
                        setFormData({ ...formData, tipe: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40"
                    >
                      <option>Sewaktu</option>
                      <option>Mandiri</option>
                    </select>
                  </div>

                  <div className="min-w-0">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40"
                    >
                      <option>Aktif</option>
                      <option>Tidak Aktif</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Alamat Lengkap
                    </label>
                    <textarea
                      placeholder="Masukkan alamat lengkap TUK..."
                      rows={2}
                      value={formData.alamat}
                      onChange={(e) =>
                        setFormData({ ...formData, alamat: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40 resize-none"
                    ></textarea>
                  </div>

                  {/* Inventaris Section */}
                  <div className="md:col-span-2 border-t border-gray-100 pt-4 mt-2">
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-bold text-slate-800">
                        Inventaris / Fasilitas TUK
                      </label>
                      <button
                        type="button"
                        onClick={addInventaris}
                        className="text-xs font-bold text-[#008BE3] hover:text-[#0076C2] flex items-center gap-1 bg-sky-50 px-2 py-1 rounded"
                      >
                        <Plus size={14} /> Tambah
                      </button>
                    </div>

                    <div className="space-y-2">
                      {formData.inventaris?.map((inv, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <input
                            type="text"
                            placeholder="Nama Fasilitas (mis: Meja)"
                            value={inv.nama}
                            onChange={(e) =>
                              handleInventarisChange(
                                idx,
                                "nama",
                                e.target.value,
                              )
                            }
                            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40"
                          />
                          <input
                            type="number"
                            placeholder="Jml"
                            value={inv.jumlah}
                            onChange={(e) =>
                              handleInventarisChange(
                                idx,
                                "jumlah",
                                Number(e.target.value),
                              )
                            }
                            className="w-24 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40"
                          />
                          <button
                            type="button"
                            onClick={() => removeInventaris(idx)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                      {formData.inventaris?.length === 0 && (
                        <p className="text-sm text-gray-500 italic">
                          Belum ada inventaris ditambahkan.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50/50 mt-auto">
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setIsEditModalOpen(false);
                  }}
                  className="px-4 py-2 text-sm font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={isEditModalOpen ? saveEdit : saveAdd}
                  className="px-4 py-2 text-sm font-bold text-white bg-[#008BE3] hover:bg-[#0076C2] rounded-lg transition-colors shadow-xs"
                >
                  Simpan TUK
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Delete Modal */}
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
                <h3 className="font-bold text-slate-900 mb-2">Hapus TUK</h3>
                <p className="text-sm text-gray-500">
                  Apakah Anda yakin ingin menghapus{" "}
                  <strong>{selectedTuk?.nama}</strong>? Tindakan ini tidak dapat
                  dibatalkan.
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
                  onClick={confirmDelete}
                  className="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                  Hapus
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Detail Modal */}
        {isDetailModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDetailModalOpen(false)}
              className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-lg relative z-10 overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <h3 className="font-bold text-slate-900">Detail TUK</h3>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Plus size={20} className="rotate-45" />
                </button>
              </div>

              <div className="p-6 space-y-5 overflow-y-auto">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-[#E6F4FF] text-[#008BE3] flex items-center justify-center shrink-0 border border-[#BCE0FD]">
                    <Building2 size={32} className="stroke-[1.5]" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-lg font-black text-slate-900 leading-tight">
                      {selectedTuk?.nama}
                    </h4>
                    <p className="text-sm text-gray-500 font-medium mt-0.5">
                      ID: {selectedTuk?.id}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 col-span-2">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                      <User size={12} /> Penanggung Jawab
                    </p>
                    <p className="text-sm font-bold text-slate-700">
                      {selectedTuk?.penanggungJawab || "-"}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 col-span-2">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">
                      Keterangan (Ruangan)
                    </p>
                    <p className="text-sm font-bold text-slate-700">
                      {selectedTuk?.keterangan || "-"}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">
                      tipe TUK
                    </p>
                    <p className="text-sm font-bold text-slate-700">
                      {selectedTuk?.tipe}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">
                      Kapasitas
                    </p>
                    <p className="text-sm font-bold text-slate-700">
                      {selectedTuk?.kapasitas} Peserta
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 col-span-2">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">
                      Alamat
                    </p>
                    <p className="text-sm font-medium text-slate-700">
                      {selectedTuk?.alamat}
                    </p>
                  </div>
                </div>

                {/* Inventaris View */}
                {selectedTuk?.inventaris &&
                  selectedTuk.inventaris.length > 0 && (
                    <div className="min-w-0">
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">
                        Inventaris & Fasilitas
                      </p>
                      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                        <table className="w-full text-sm text-left">
                          <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                              <th className="px-4 py-2 font-bold text-slate-700">
                                Nama Fasilitas
                              </th>
                              <th className="px-4 py-2 font-bold text-slate-700 text-left w-24">
                                Jumlah
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {selectedTuk.inventaris.map(
                              (inv: TukInventarisItem, idx: number) => (
                                <tr key={idx}>
                                  <td className="px-4 py-2.5 font-medium text-slate-600">
                                    {inv.nama}
                                  </td>
                                  <td className="px-4 py-2.5 font-bold text-slate-800 text-center">
                                    {inv.jumlah}
                                  </td>
                                </tr>
                              ),
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
              </div>

              <div className="p-4 border-t border-gray-100 flex items-center justify-end bg-gray-50/50 mt-auto">
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="px-4 py-2 text-sm font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
