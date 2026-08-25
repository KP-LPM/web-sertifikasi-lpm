import React, { useState } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  UserCog,
  X,
  Eye,
  EyeOff,
  RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAppContext } from "@/context/context";
import { ManagedUser } from "@/types/types";
export type { ManagedUser };

export const ROLE_OPTIONS = [
  "Admin",
  "Asesor",
  "Asesi",
  "Manajer",
  "Direktur",
  "Ketua Dewan Pengarah",
  "Anggota Dewan Pengarah",
  "Ketua Komite Skema",
  "Anggota Komite Skema",
];

export function KelolaPengguna() {
  const { user } = useAppContext();
  const readOnly = user?.role === "direktur" || user?.role === "manajer";

  const [users, setUsers] = useState<ManagedUser[]>([
    {
      id: "usr-001",
      initial: "DR",
      name: "Prof. Dr. H. Mahmud, M.Ag",
      email: "mahmud@uin.ac.id",
      role: "Direktur",
      status: "Aktif",
      nipNim: "196204151990031002",
    },
    {
      id: "usr-002",
      initial: "MN",
      name: "Bambang Sugianto, M.M.",
      email: "bambang.s@lsp.uin.ac.id",
      role: "Manajer",
      status: "Aktif",
      nipNim: "197508122002121001",
    },
    {
      id: "usr-003",
      initial: "KP",
      name: "Dr. Ir. H. Muhammad Zaini, M.T.",
      email: "m.zaini@uin.ac.id",
      role: "Ketua Dewan Pengarah",
      status: "Aktif",
      nipNim: "196811051994031004",
    },
    {
      id: "usr-004",
      initial: "AP",
      name: "Dra. Hj. Siti Fatimah, M.Si",
      email: "siti.fatimah@uin.ac.id",
      role: "Anggota Dewan Pengarah",
      status: "Aktif",
      nipNim: "197103201998022001",
    },
    {
      id: "usr-005",
      initial: "KS",
      name: "Dr. Eng. Dian Wahyudi, S.T., M.T.",
      email: "dian.w@uin.ac.id",
      role: "Ketua Komite Skema",
      status: "Aktif",
      nipNim: "198006142006041003",
    },
    {
      id: "usr-006",
      initial: "AS",
      name: "Rahmat Hidayat, M.T.",
      email: "rahmat.h@uin.ac.id",
      role: "Anggota Komite Skema",
      status: "Aktif",
      nipNim: "198502102010121002",
    },
    {
      id: "usr-007",
      initial: "AD",
      name: "Aditya Rahman, S.Kom",
      email: "admin.lsp@uin.ac.id",
      role: "Admin",
      status: "Aktif",
      nipNim: "199505122020011005",
    },
    {
      id: "usr-008",
      initial: "SR",
      name: "Dr. Siti Rohmah, M.Kom",
      email: "siti.r@lecturer.uin.ac.id",
      role: "Asesor",
      status: "Terverifikasi",
      nipNim: "198209152008012006",
    },
    {
      id: "asr-1",
      initial: "IT",
      name: "Ichsan Taufik",
      email: "ichsan.taufik@lsp.uin.ac.id",
      role: "Asesor",
      status: "Terverifikasi",
      nipNim: "198103152006041001",
    },
    {
      id: "asr-2",
      initial: "AK",
      name: "Aceng Abdul Kodir",
      email: "aceng.kodir@lsp.uin.ac.id",
      role: "Asesor",
      status: "Terverifikasi",
      nipNim: "198205202008011002",
    },
    {
      id: "asr-3",
      initial: "SF",
      name: "Susanti Ainul Fitri",
      email: "susanti.fitri@lsp.uin.ac.id",
      role: "Asesor",
      status: "Terverifikasi",
      nipNim: "198507112010122003",
    },
    {
      id: "asr-4",
      initial: "SM",
      name: "M Sandi Marta",
      email: "sandi.marta@lsp.uin.ac.id",
      role: "Asesor",
      status: "Terverifikasi",
      nipNim: "198409022009021004",
    },
    {
      id: "asr-5",
      initial: "GS",
      name: "Gina Sakinah",
      email: "gina.sakinah@lsp.uin.ac.id",
      role: "Asesor",
      status: "Terverifikasi",
      nipNim: "198812182014032005",
    },
    {
      id: "asr-6",
      initial: "EW",
      name: "Elis Ratna Wulan",
      email: "elis.wulan@lsp.uin.ac.id",
      role: "Asesor",
      status: "Terverifikasi",
      nipNim: "198304252008042006",
    },
    {
      id: "asr-7",
      initial: "AS",
      name: "Asep Abdul Sahid",
      email: "asep.sahid@lsp.uin.ac.id",
      role: "Asesor",
      status: "Terverifikasi",
      nipNim: "198011082005011007",
    },
    {
      id: "asr-8",
      initial: "SA",
      name: "Siti Alia",
      email: "siti.alia@lsp.uin.ac.id",
      role: "Asesor",
      status: "Terverifikasi",
      nipNim: "198901302015022008",
    },
    {
      id: "asr-9",
      initial: "AF",
      name: "Azmi Fasa",
      email: "azmi.fasa@lsp.uin.ac.id",
      role: "Asesor",
      status: "Terverifikasi",
      nipNim: "198606142011011009",
    },
    {
      id: "asr-10",
      initial: "CS",
      name: "Cucu Susilawati",
      email: "cucu.susilawati@lsp.uin.ac.id",
      role: "Asesor",
      status: "Terverifikasi",
      nipNim: "198408222010022010",
    },
    {
      id: "asr-11",
      initial: "FW",
      name: "Fitri Pebriani Wahyu",
      email: "fitri.wahyu@lsp.uin.ac.id",
      role: "Asesor",
      status: "Terverifikasi",
      nipNim: "198702102012032011",
    },
    {
      id: "asr-12",
      initial: "TR",
      name: "Tina Dewi Rosahdi",
      email: "tina.rosahdi@lsp.uin.ac.id",
      role: "Asesor",
      status: "Terverifikasi",
      nipNim: "198110052007012012",
    },
    {
      id: "asr-13",
      initial: "UJ",
      name: "Ucu Julita",
      email: "ucu.julita@lsp.uin.ac.id",
      role: "Asesor",
      status: "Terverifikasi",
      nipNim: "198503192009042013",
    },
    {
      id: "asr-14",
      initial: "AM",
      name: "Acep Muslim",
      email: "acep.muslim@lsp.uin.ac.id",
      role: "Asesor",
      status: "Terverifikasi",
      nipNim: "198307122008021014",
    },
    {
      id: "asr-15",
      initial: "IK",
      name: "Izzah Faizah Siti Rusydati Khaerani",
      email: "izzah.faizah@lsp.uin.ac.id",
      role: "Asesor",
      status: "Terverifikasi",
      nipNim: "198605282011022015",
    },
    {
      id: "asr-16",
      initial: "MA",
      name: "Muhammad Alfan",
      email: "muhammad.alfan@lsp.uin.ac.id",
      role: "Asesor",
      status: "Terverifikasi",
      nipNim: "198412012009031016",
    },
    {
      id: "asr-17",
      initial: "EA",
      name: "Erlan Aditya Ardiansyah",
      email: "erlan.ardiansyah@lsp.uin.ac.id",
      role: "Asesor",
      status: "Terverifikasi",
      nipNim: "198904172015041017",
    },
    {
      id: "asr-18",
      initial: "DG",
      name: "Dian Rachmat Gumelar",
      email: "dian.gumelar@lsp.uin.ac.id",
      role: "Asesor",
      status: "Terverifikasi",
      nipNim: "198208092007021018",
    },
    {
      id: "asr-19",
      initial: "RN",
      name: "Reza Fauzi Nazar",
      email: "reza.nazar@lsp.uin.ac.id",
      role: "Asesor",
      status: "Terverifikasi",
      nipNim: "198810232014011019",
    },
    {
      id: "asr-20",
      initial: "RS",
      name: "Rini Sulastri",
      email: "rini.sulastri@lsp.uin.ac.id",
      role: "Asesor",
      status: "Terverifikasi",
      nipNim: "198501142010032020",
    },
    {
      id: "asr-21",
      initial: "YM",
      name: "Yadi Mardiansyah",
      email: "yadi.mardiansyah@lsp.uin.ac.id",
      role: "Asesor",
      status: "Terverifikasi",
      nipNim: "198309052008031021",
    },
    {
      id: "asr-22",
      initial: "DY",
      name: "Dayudin",
      email: "dayudin@lsp.uin.ac.id",
      role: "Asesor",
      status: "Terverifikasi",
      nipNim: "198002282005021022",
    },
    {
      id: "asr-23",
      initial: "WU",
      name: "Wisnu Uriawan",
      email: "wisnu.uriawan@lsp.uin.ac.id",
      role: "Asesor",
      status: "Terverifikasi",
      nipNim: "198106162006031023",
    },
    {
      id: "asr-24",
      initial: "MR",
      name: "M. Ridha Taufiq Rahman",
      email: "ridha.rahman@lsp.uin.ac.id",
      role: "Asesor",
      status: "Terverifikasi",
      nipNim: "198711042012021024",
    },
    {
      id: "usr-009",
      initial: "AH",
      name: "Ahmad Hidayat",
      email: "ahmad.h@student.uin.ac.id",
      role: "Asesi",
      status: "Menunggu Verifikasi",
      nipNim: "1197050001",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>("Semua");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ManagedUser | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    nipNim: "",
    role: "Asesor",
    status: "Aktif" as ManagedUser["status"],
    tempPassword: "",
  });

  const filteredUsers = users.filter((userItem) => {
    const matchesSearch =
      userItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userItem.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (userItem.nipNim &&
        userItem.nipNim.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRole =
      selectedRoleFilter === "Semua" || userItem.role === selectedRoleFilter;

    return matchesSearch && matchesRole;
  });

  const handleOpenAddModal = () => {
    setFormData({
      name: "",
      email: "",
      nipNim: "",
      role: "Asesor",
      status: "Aktif",
      tempPassword: "LSP" + Math.floor(100000 + Math.random() * 900000) + "!",
    });
    setShowPassword(true);
    setIsModalOpen(true);
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) return;

    const newUser: ManagedUser = {
      id: `usr-${Date.now()}`,
      initial: formData.name.substring(0, 2).toUpperCase() || "US",
      name: formData.name.trim(),
      email: formData.email.trim(),
      nipNim: formData.nipNim.trim(),
      role: formData.role,
      status: formData.status,
      tempPassword: formData.tempPassword.trim() || undefined,
    };

    setUsers([newUser, ...users]);
    setIsModalOpen(false);
  };

  const handleOpenEditModal = (userItem: ManagedUser) => {
    setSelectedUser(userItem);
    setFormData({
      name: userItem.name,
      email: userItem.email,
      nipNim: userItem.nipNim || "",
      role: userItem.role,
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
              name: formData.name,
              email: formData.email,
              nipNim: formData.nipNim,
              role: formData.role,
              status: formData.status,
              tempPassword: formData.tempPassword.trim() || u.tempPassword,
              initial: formData.name.substring(0, 2).toUpperCase() || "US",
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
    switch (role) {
      case "Direktur":
      case "Manajer":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "Ketua Dewan Pengarah":
      case "Anggota Dewan Pengarah":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "Ketua Komite Skema":
      case "Anggota Komite Skema":
        return "bg-teal-50 text-teal-700 border-teal-200";
      case "Admin":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "Asesor":
        return "bg-sky-50 text-[#008BE3] border-sky-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] p-3 sm:p-6 md:p-8 space-y-4 sm:space-y-6 pb-24 text-sm text-gray-700">
      {/* Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-[#008BE3]/10 flex items-center justify-center text-[#008BE3] border border-[#008BE3]/20 shadow-xs shrink-0">
            <UserCog size={20} className="stroke-[2.5]" />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">
              Kelola Pengguna
            </h2>
            <p className="text-xs text-gray-500 font-medium tracking-wider uppercase leading-4">
              Kelola daftar akun pengguna, penugasan peran (role), dan status
              hak akses sistem.
            </p>
          </div>
        </div>

        {!readOnly && (
          <button
            onClick={handleOpenAddModal}
            className="flex items-center justify-center gap-2 bg-[#008BE3] hover:bg-[#0076C2] text-white px-4 sm:px-5 py-2.5 rounded-lg text-sm font-bold shadow-xs transition-colors shrink-0 cursor-pointer w-full sm:w-auto"
          >
            <Plus size={18} className="stroke-[2.5]" />{" "}
            <span>Tambah Pengguna</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 sm:p-5 rounded-lg shadow-xs border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between items-stretch sm:items-center">
          <div className="relative w-full sm:max-w-md">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Cari nama, email, NIP/NIM..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3] outline-none text-sm transition-all placeholder:text-gray-400"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-bold text-slate-500 whitespace-nowrap">
              Filter Peran:
            </span>
            <select
              value={selectedRoleFilter}
              onChange={(e) => setSelectedRoleFilter(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 border border-gray-200 rounded-lg text-xs font-bold text-slate-800 outline-none focus:border-[#008BE3] bg-white cursor-pointer"
            >
              <option value="Semua">Semua Peran ({users.length})</option>
              {ROLE_OPTIONS.map((r, idx) => (
                <option key={idx} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table of Users */}
      <div className="bg-white rounded-lg shadow-xs border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-212.5">
            <thead>
              <tr className="bg-[#0F172A] border-b border-[#0F172A]">
                <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider whitespace-nowrap">
                  Nama Pengguna
                </th>
                <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider whitespace-nowrap">
                  Email
                </th>
                <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider whitespace-nowrap">
                  NIP / NIM / NIK
                </th>
                <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider whitespace-nowrap">
                  Peran (Role)
                </th>
                <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider whitespace-nowrap">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-center sticky right-0 bg-[#0F172A] z-10 border-l border-white/10 w-28 whitespace-nowrap">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <tr
                    key={u.id}
                    className="group/row hover:bg-[#F9FAFC] transition-colors"
                  >
                    <td className="px-6 py-4 align-middle whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-sky-50 text-[#008BE3] flex items-center justify-center font-bold text-xs border border-sky-100 shrink-0">
                          {u.initial}
                        </div>
                        <span className="text-sm font-bold text-slate-900 whitespace-nowrap">
                          {u.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 align-middle whitespace-nowrap">
                      <span className="text-xs text-slate-600 font-medium whitespace-nowrap">
                        {u.email}
                      </span>
                    </td>
                    <td className="px-6 py-4 align-middle whitespace-nowrap">
                      <p className="text-xs font-semibold text-slate-700 whitespace-nowrap">
                        {u.nipNim || "-"}
                      </p>
                    </td>
                    <td className="px-6 py-4 align-middle whitespace-nowrap">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-bold border whitespace-nowrap ${getRoleBadgeStyle(u.role)}`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 align-middle whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1.5 border whitespace-nowrap ${
                          u.status === "Aktif" || u.status === "Terverifikasi"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        {u.status === "Aktif" ||
                        u.status === "Terverifikasi" ? (
                          <CheckCircle
                            size={12}
                            className="stroke-[2.5] shrink-0"
                          />
                        ) : (
                          <Clock size={12} className="stroke-[2.5] shrink-0" />
                        )}
                        {u.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 align-middle text-center sticky right-0 bg-white group-hover/row:bg-[#F9FAFC] z-10 border-l border-gray-100 whitespace-nowrap">
                      {readOnly ? (
                        <button
                          onClick={() => handleOpenEditModal(u)}
                          className="px-3 py-1.5 text-xs font-bold text-[#008BE3] bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
                          title="Lihat Detail User"
                        >
                          <Eye size={14} /> Detail
                        </button>
                      ) : (
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleOpenEditModal(u)}
                            className="p-1.5 text-gray-400 hover:text-[#008BE3] hover:bg-sky-50 rounded transition-colors cursor-pointer"
                            title="Edit User"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedUser(u);
                              setIsDeleteModalOpen(true);
                            }}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
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
                    colSpan={6}
                    className="px-6 py-12 text-center text-slate-400 font-medium"
                  >
                    Tidak ada pengguna yang cocok dengan pencarian atau filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

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
                        ? "Edit Pengguna"
                        : "Tambah Pengguna Baru"}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {readOnly
                      ? "Informasi detail akun pengguna."
                      : isEditModalOpen
                        ? "Perbarui data dan peran pengguna."
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
                  if (isEditModalOpen) {
                    handleEditUser(e);
                  } else {
                    handleAddUser(e);
                  }
                }}
                className="p-6 space-y-4"
              >
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
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
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

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    NIP / NIM / NIK
                  </label>
                  <input
                    type="text"
                    readOnly={readOnly}
                    placeholder="Contoh: 198001012005011001"
                    value={formData.nipNim}
                    onChange={(e) =>
                      setFormData({ ...formData, nipNim: e.target.value })
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
                        required={!isEditModalOpen}
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
                        status: e.target.value as ManagedUser["status"],
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
                        Simpan User
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
                    {selectedUser?.name}
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
