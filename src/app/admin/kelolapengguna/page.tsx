"use client";

import React, { useState } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  UserCog,
  X,
  Eye,
  EyeOff,
  RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAppContext } from "@/context/context";
import { Role, UserItem } from "@/types/types";
export type { UserItem };

export const ROLE_OPTIONS = [
  "admin",
  "asesor",
  "asesi",
  "direktur",
  "manajer",
  "dewan_pengarah",
  "komite_skema",
];

export default function KelolaPengguna() {
  const { user } = useAppContext();
  const readOnly = user?.role === "direktur" || user?.role === "manajer";

  // Data dummy sudah ditambahkan 'username'
  const [users, setUsers] = useState<UserItem[]>([
    {
      id: "usr-001",
      username: "mahmud_dr",
      namaLengkap: "Prof. Dr. H. Mahmud, M.Ag",
      email: "mahmud@uin.ac.id",
      role: "direktur",
      status: "Aktif",
    },
    {
      id: "usr-002",
      username: "bambang_s",
      namaLengkap: "Bambang Sugianto, M.M.",
      email: "bambang.s@lsp.uin.ac.id",
      role: "manajer",
      status: "Aktif",
    },
    {
      id: "usr-003",
      username: "mzaini",
      namaLengkap: "Dr. Ir. H. Muhammad Zaini, M.T.",
      email: "m.zaini@uin.ac.id",
      role: "manajer",
      status: "Aktif",
    },
    {
      id: "usr-004",
      username: "sitifatimah",
      namaLengkap: "Dra. Hj. Siti Fatimah, M.Si",
      email: "siti.fatimah@uin.ac.id",
      role: "manajer",
      status: "Aktif",
    },
    {
      id: "usr-005",
      username: "dian_w",
      namaLengkap: "Dr. Eng. Dian Wahyudi, S.T., M.T.",
      email: "dian.w@uin.ac.id",
      role: "manajer",
      status: "Aktif",
    },
    {
      id: "usr-006",
      username: "rahmat_h",
      namaLengkap: "Rahmat Hidayat, M.T.",
      email: "rahmat.h@uin.ac.id",
      role: "manajer",
      status: "Aktif",
    },
    {
      id: "usr-007",
      username: "aditya_admin",
      namaLengkap: "Aditya Rahman, S.Kom",
      email: "admin.lsp@uin.ac.id",
      role: "admin",
      status: "Aktif",
    },
    {
      id: "usr-008",
      username: "siti_rohmah",
      namaLengkap: "Dr. Siti Rohmah, M.Kom",
      email: "siti.r@lecturer.uin.ac.id",
      role: "asesor",
      status: "Aktif",
    },
    {
      id: "usr-009",
      username: "ahmad_hidayat",
      namaLengkap: "Ahmad Hidayat",
      email: "ahmad.h@student.uin.ac.id",
      role: "asesi",
      status: "Nonaktif",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>("Semua");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Form State ditambahkan 'username'
  const [formData, setFormData] = useState({
    username: "",
    namaLengkap: "",
    email: "",
    role: "asesi",
    status: "Aktif" as UserItem["status"],
    tempPassword: "",
  });

  const filteredUsers = users.filter((userItem) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      userItem.namaLengkap.toLowerCase().includes(term) ||
      userItem.username?.toLowerCase().includes(term) ||
      userItem.email.toLowerCase().includes(term);

    const matchesRole =
      selectedRoleFilter === "Semua" || userItem.role === selectedRoleFilter;

    return matchesSearch && matchesRole;
  });

  const handleOpenAddModal = () => {
    setFormData({
      username: "",
      namaLengkap: "",
      email: "",
      role: "asesi",
      status: "Aktif",
      tempPassword: "LSP" + Math.floor(100000 + Math.random() * 900000) + "!",
    });
    setShowPassword(true);
    setIsModalOpen(true);
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.namaLengkap.trim() ||
      !formData.email.trim() ||
      !formData.username.trim()
    )
      return;

    const newUser: UserItem = {
      id: `usr-${Date.now()}`,
      username: formData.username.trim(),
      namaLengkap: formData.namaLengkap.trim(),
      email: formData.email.trim(),
      role: formData.role as Role,
      status: formData.status,
      tempPassword: formData.tempPassword.trim() || undefined,
    };

    setUsers([newUser, ...users]);
    setIsModalOpen(false);
  };

  const handleOpenEditModal = (userItem: UserItem) => {
    setSelectedUser(userItem);
    setFormData({
      username: userItem.username || "",
      namaLengkap: userItem.namaLengkap,
      email: userItem.email,
      role: userItem.role as Role,
      status: userItem.status,
      tempPassword: userItem.tempPassword || "",
    });
    setShowPassword(false);
    setIsEditModalOpen(true);
  };

  const handleEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    setUsers(
      users.map((u) =>
        u.id === selectedUser.id
          ? {
              ...u,
              status: formData.status,
            }
          : u,
      ),
    );

    setIsEditModalOpen(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = () => {
    if (selectedUser) {
      setUsers(users.filter((u) => u.id !== selectedUser.id));
    }
    setIsDeleteModalOpen(false);
    setSelectedUser(null);
  };

  const getRoleBadgeStyle = (role: string) => {
    const roleLower = role.toLowerCase();
    if (roleLower.includes("direktur") || roleLower.includes("manajer")) {
      return "bg-purple-50 text-purple-700 border-purple-200";
    }
    if (roleLower.includes("dewan_pengarah")) {
      return "bg-indigo-50 text-indigo-700 border-indigo-200";
    }
    if (roleLower.includes("komite_skema")) {
      return "bg-teal-50 text-teal-700 border-teal-200";
    }
    if (roleLower.includes("admin")) {
      return "bg-rose-50 text-rose-700 border-rose-200";
    }
    if (roleLower.includes("asesor")) {
      return "bg-sky-50 text-[#008BE3] border-sky-200";
    }
    return "bg-slate-100 text-slate-700 border-slate-200"; // asesi
  };

  return (
    <div className="space-y-6 pb-24 text-sm text-gray-700">
      {/* Header Title Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-[#008BE3]/10 flex items-center justify-center text-[#008BE3] border border-[#008BE3]/20 shadow-xs shrink-0">
            <UserCog size={20} className="stroke-[2.5]" />
          </div>
          <div className="min-w-0">
            <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none mb-1 md:whitespace-nowrap">
              Kelola Pengguna
            </h2>
            <p className="text-xs text-gray-400 font-bold tracking-wider uppercase leading-4 md:whitespace-nowrap">
              Kelola daftar akun, hak akses, dan status pengguna sistem
            </p>
          </div>
        </div>

        {!readOnly && (
          <button
            onClick={handleOpenAddModal}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#008BE3] hover:bg-[#0076C2] text-white rounded-lg text-xs md:text-sm font-extrabold shadow-md hover:shadow-lg transition-all shrink-0"
          >
            <Plus size={16} className="stroke-3" />
            <span>Tambah Pengguna</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <section className="bg-white rounded-lg shadow-xs border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="min-w-0">
            <h3 className="text-base font-black text-slate-900">
              Cari Pengguna
            </h3>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 w-full lg:w-auto ml-auto">
            <div className="flex items-center gap-2 bg-gray-50/80 rounded-lg px-3 h-10.5 w-full sm:w-68 border border-gray-200/50 focus-within:border-[#008BE3]/40 transition-colors">
              <Search className="text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Cari nama.."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none focus:ring-0 text-[14px] w-full outline-none text-gray-700 placeholder-gray-400 font-semibold"
              />
            </div>

            <select
              value={selectedRoleFilter}
              onChange={(e) => setSelectedRoleFilter(e.target.value)}
              className="bg-gray-50 border border-gray-200/50 text-[14px] rounded-lg px-3 h-10.5 outline-none text-gray-700 cursor-pointer font-bold w-full sm:w-auto"
            >
              <option value="Semua">Semua Peran ({users.length})</option>
              {ROLE_OPTIONS.map((r, idx) => (
                <option key={idx} value={r} className="capitalize">
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table of Users */}
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
                  Peran (Role)
                </th>
                <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-center whitespace-nowrap sticky top-0 z-20 bg-[#0F172A]">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-center sticky right-0 bg-[#0F172A] z-30 border-l border-white/10 shadow-[-6px_0_15px_-4px_rgba(0,0,0,0.06)] min-w-32 top-0">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/60">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u, index) => (
                  <tr
                    key={u.id}
                    className="group/row hover:bg-[#F9FAFC] transition-colors"
                  >
                    {/* Kolom No */}
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

                    {/* Kolom Nama Pengguna (Gabungan Nama dan Username) */}
                    <td className="px-6 py-4 align-middle whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-xs md:text-sm font-bold text-slate-900 whitespace-nowrap">
                          {u.namaLengkap}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 align-middle whitespace-nowrap">
                      <span className="text-xs md:text-sm text-slate-600 font-medium whitespace-nowrap">
                        {u.email}
                      </span>
                    </td>
                    <td className="px-6 py-4 align-middle text-center whitespace-nowrap">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold border whitespace-nowrap ${getRoleBadgeStyle(u.role)}`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 align-middle text-center whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider font-bold inline-flex items-center gap-1.5 border whitespace-nowrap ${
                          u.status === "Aktif"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        {u.status === "Aktif" ? (
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                        ) : (
                          <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                        )}
                        {u.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 align-middle text-center sticky right-0 bg-white group-hover/row:bg-[#F9FAFC] z-10 border-l border-gray-100 shadow-[-6px_0_15px_-4px_rgba(0,0,0,0.06)] transition-colors whitespace-nowrap">
                      {readOnly ? (
                        <button
                          onClick={() => handleOpenEditModal(u)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-sky-50 text-[#008BE3] border border-slate-200 hover:border-[#008BE3]/30 rounded-lg text-xs font-bold transition-all shadow-2xs shrink-0 cursor-pointer"
                          title="Lihat Detail User"
                        >
                          <Eye size={14} /> <span>Detail</span>
                        </button>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenEditModal(u)}
                            className="p-1.5 text-slate-400 hover:text-[#008BE3] hover:bg-sky-50 rounded-lg transition-colors border border-transparent hover:border-sky-200 cursor-pointer"
                            title="Edit User"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedUser(u);
                              setIsDeleteModalOpen(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200 cursor-pointer"
                            title="Hapus User"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-xs md:text-sm text-gray-400 font-medium"
                  >
                    Tidak ada pengguna yang cocok dengan pencarian atau filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* MODAL ADD / EDIT USER */}
      <AnimatePresence>
        {(isModalOpen || isEditModalOpen) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-lg w-full overflow-hidden my-8"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50">
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    {readOnly
                      ? "Detail Pengguna"
                      : isEditModalOpen
                        ? "Ubah Status Pengguna"
                        : "Tambah Pengguna Baru"}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {readOnly
                      ? "Informasi detail akun pengguna."
                      : isEditModalOpen
                        ? "Pilih status akun pengguna yang baru."
                        : "Isi formulir untuk menambahkan akun pengguna baru."}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setIsEditModalOpen(false);
                  }}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!readOnly)
                    void (isEditModalOpen
                      ? handleEditUser(e)
                      : handleAddUser(e));
                  else {
                    setIsModalOpen(false);
                    setIsEditModalOpen(false);
                  }
                }}
                className="p-6 space-y-4"
              >
                {isEditModalOpen ? (
                  <>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                      <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                        Pengguna yang Dipilih
                      </div>
                      <div className="text-sm font-black text-slate-900">
                        {formData.namaLengkap || "Pengguna"}
                      </div>
                      <div className="text-xs text-slate-600 font-medium">
                        <span className="font-bold text-[#008BE3]">
                          {formData.role}
                        </span>
                      </div>
                    </div>

                    <div className="bg-sky-50/70 p-4 rounded-xl border border-sky-200">
                      <label className="block text-xs font-bold text-slate-800 mb-2">
                        Pilih Status Akun Baru{" "}
                        <span className="text-[#008BE3] font-semibold">*</span>
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            status: e.target.value as UserItem["status"],
                          })
                        }
                        className="w-full px-3.5 py-2.5 bg-white text-slate-900 border-2 border-[#008BE3] rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#008BE3]/20 cursor-pointer"
                      >
                        <option value="Aktif">Aktif</option>
                        <option value="Terverifikasi">Terverifikasi</option>
                        <option value="Menunggu Verifikasi">
                          Menunggu Verifikasi
                        </option>
                        <option value="Nonaktif">Nonaktif</option>
                      </select>
                      <p className="text-[11px] text-slate-500 mt-2">
                        Mengubah status akan memengaruhi hak akses login
                        pengguna ke portal.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Nama Lengkap{" "}
                        {!readOnly && <span className="text-rose-500">*</span>}
                      </label>
                      <input
                        type="text"
                        required={!readOnly}
                        readOnly={readOnly}
                        placeholder="Contoh: Dr. Ahmad Fauzi, M.Kom"
                        value={formData.namaLengkap}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            namaLengkap: e.target.value,
                          })
                        }
                        className={`w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold outline-none ${
                          readOnly
                            ? "bg-slate-100 text-slate-700 cursor-not-allowed"
                            : "bg-white text-slate-800 focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40"
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Email Aktif{" "}
                        {!readOnly && <span className="text-rose-500">*</span>}
                      </label>
                      <input
                        type="email"
                        required={!readOnly}
                        readOnly={readOnly}
                        placeholder="contoh@uin.ac.id"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className={`w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold outline-none ${
                          readOnly
                            ? "bg-slate-100 text-slate-700 cursor-not-allowed"
                            : "bg-white text-slate-800 focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40"
                        }`}
                      />
                    </div>

                    {!readOnly && (
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Password Sementara{" "}
                          <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            required
                            placeholder="Masukkan password sementara..."
                            value={formData.tempPassword}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                tempPassword: e.target.value,
                              })
                            }
                            className="w-full pl-3.5 pr-24 py-2.5 border border-gray-200 rounded-xl text-sm font-mono text-slate-800 outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40"
                          />
                          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                              title={
                                showPassword
                                  ? "Sembunyikan Password"
                                  : "Tampilkan Password"
                              }
                            >
                              {showPassword ? (
                                <EyeOff size={16} />
                              ) : (
                                <Eye size={16} />
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const randomPass =
                                  "LSP" +
                                  Math.floor(100000 + Math.random() * 900000) +
                                  "!";
                                setFormData((prev) => ({
                                  ...prev,
                                  tempPassword: randomPass,
                                }));
                                setShowPassword(true);
                              }}
                              className="px-2 py-1 text-[11px] font-bold text-[#008BE3] bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1"
                              title="Acak Password"
                            >
                              <RefreshCw size={12} /> Acak
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Peran (Role) Pengguna{" "}
                        {!readOnly && <span className="text-rose-500">*</span>}
                      </label>
                      <select
                        disabled={readOnly}
                        value={formData.role}
                        onChange={(e) =>
                          setFormData({ ...formData, role: e.target.value })
                        }
                        className={`w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold outline-none ${
                          readOnly
                            ? "bg-slate-100 text-slate-700 cursor-not-allowed"
                            : "bg-white text-slate-800 focus:border-[#008BE3] cursor-pointer"
                        }`}
                      >
                        {ROLE_OPTIONS.map((roleOption, idx) => (
                          <option key={idx} value={roleOption}>
                            {roleOption}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Status Akun
                      </label>
                      <select
                        disabled={readOnly}
                        value={formData.status}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            status: e.target.value as UserItem["status"],
                          })
                        }
                        className={`w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold outline-none ${
                          readOnly
                            ? "bg-slate-100 text-slate-700 cursor-not-allowed"
                            : "bg-white text-slate-800 focus:border-[#008BE3] cursor-pointer"
                        }`}
                      >
                        <option value="Aktif">Aktif</option>
                        <option value="Terverifikasi">Terverifikasi</option>
                        <option value="Menunggu Verifikasi">
                          Menunggu Verifikasi
                        </option>
                        <option value="Nonaktif">Nonaktif</option>
                      </select>
                    </div>
                  </>
                )}

                <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                  {readOnly ? (
                    <button
                      type="button"
                      onClick={() => {
                        setIsModalOpen(false);
                        setIsEditModalOpen(false);
                      }}
                      className="px-5 py-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl text-sm font-bold transition-colors cursor-pointer"
                    >
                      Tutup
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setIsModalOpen(false);
                          setIsEditModalOpen(false);
                        }}
                        className="px-4 py-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl text-sm font-bold transition-colors cursor-pointer"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-[#008BE3] text-white hover:bg-[#0076C2] rounded-xl text-sm font-bold transition-colors shadow-xs cursor-pointer"
                      >
                        {isEditModalOpen ? "Simpan Status" : "Simpan User"}
                      </button>
                    </>
                  )}
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* MODAL DELETE CONFIRMATION */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden"
            >
              <div className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
                  <Trash2 size={24} />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">
                  Hapus Pengguna
                </h3>
                <p className="text-xs text-gray-500">
                  Apakah Anda yakin ingin menghapus{" "}
                  <strong className="text-slate-800">
                    {selectedUser?.namaLengkap}
                  </strong>
                  ? Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>
              <div className="p-4 bg-gray-50 flex justify-end gap-2 border-t border-gray-100">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={handleDeleteUser}
                  className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors cursor-pointer"
                >
                  Hapus
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
