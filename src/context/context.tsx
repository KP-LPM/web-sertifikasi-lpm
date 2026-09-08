"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { BadgeCheck, X } from "lucide-react";
import {
  UserItem,
  AssessmentItem,
  JenisMetode,
  TipeTuk,
  HasilAsesmen,
  StatusAsesmen,
  PertanyaanAsesmenItem,
  KonfigurasiPertanyaanItem,
  CrumbItem,
  User,
  PlenoSchedule,
} from "@/types/types";

interface AppContextType {
  extraCrumbs: CrumbItem[];
  setExtraCrumbs: (crumbs: CrumbItem[]) => void;
  plenoSessions: PlenoSchedule[];
  addPlenoSession: (session: PlenoSchedule) => void;
  updatePlenoSession: (id: number, data: Partial<PlenoSchedule>) => void;
  deletePlenoSession: (id: number) => void;
  user: User | null;
  logout: () => void;
  isLoggingOut: boolean;
  updateUser: (data: Partial<User>) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  pertanyaanAsesmen: PertanyaanAsesmenItem[];
  addPertanyaanAsesmen: (item: Omit<PertanyaanAsesmenItem, "id">) => void;
  updatePertanyaanAsesmen: (
    id: number,
    item: Omit<PertanyaanAsesmenItem, "id">,
  ) => void;
  deletePertanyaanAsesmen: (id: number) => void;
  selectedPertanyaanId: number | null;
  setSelectedPertanyaanId: (id: number | null) => void;
  konfigurasiPertanyaan: KonfigurasiPertanyaanItem[];
  addKonfigurasiPertanyaan: (
    item: Omit<KonfigurasiPertanyaanItem, "id">,
  ) => void;
  updateKonfigurasiPertanyaan: (
    id: number,
    item: Omit<KonfigurasiPertanyaanItem, "id">,
  ) => void;
  deleteKonfigurasiPertanyaan: (id: number) => void;
  selectedKonfigurasiId: number | null;
  setSelectedKonfigurasiId: (id: number | null) => void;
  registeredProfile: Record<string, unknown> | null;
  setRegisteredProfile: (val: Record<string, unknown> | null) => void;
  selectedAsesmen: AssessmentItem | null;
  setSelectedAsesmen: (val: AssessmentItem | null) => void;
  AssessmentItems: AssessmentItem[];
  updateAssessmentItem: (id: number, data: Partial<AssessmentItem>) => void;
  completedBatchCodes: string[];
  deleteBatchAssessmentItems: (batchCode: string) => void;
  // Fitur Konfirmasi Navigasi Form
  isFormDirty: boolean;
  setIsFormDirty: (dirty: boolean) => void;
  pendingNavigation: {
    type: "view" | "action";
    target: string | (() => void);
  } | null;
  setPendingNavigation: (
    nav: { type: "view" | "action"; target: string | (() => void) } | null,
  ) => void;
  requestNavigation: (target: string | (() => void)) => void;
  showNotification: (message: string, type?: "success" | "error") => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // --- NEXTAUTH SESSION INTEGRATION ---
  const router = useRouter();
  const { data: session } = useSession();

  // --- STATES ---
  const [extraCrumbs, setExtraCrumbs] = useState<CrumbItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(
    typeof window !== "undefined" ? window.innerWidth < 1024 : false,
  );
  const [selectedPertanyaanId, setSelectedPertanyaanId] = useState<
    number | null
  >(null);
  const [selectedKonfigurasiId, setSelectedKonfigurasiId] = useState<
    number | null
  >(null);
  const [registeredProfile, setRegisteredProfile] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [selectedAsesmen, setSelectedAsesmen] = useState<AssessmentItem | null>(
    null,
  );

  // --- NOTIFICATION STATE ---
  const [notification, setNotification] = useState<{
    show: boolean;
    type: "success" | "error";
    message: string;
  }>({ show: false, type: "success", message: "" });

  const showNotification = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  useEffect(() => {
    if (session?.user) {
      setUser({
        id: session.user.id || "",
        username: session.user.username,
        email: session.user.email || "",
        role: session.user.role,
        avatar: session.user.image || undefined,
      });
    }
  }, [session]);

  // State Konfirmasi Navigasi
  const [isFormDirty, setIsFormDirty] = useState<boolean>(false);
  const [pendingNavigation, setPendingNavigation] = useState<{
    type: "view" | "action";
    target: string | (() => void);
  } | null>(null);

  const requestNavigation = (target: string | (() => void)) => {
    if (isFormDirty) {
      if (typeof target === "string") {
        setPendingNavigation({ type: "view", target });
      } else {
        setPendingNavigation({ type: "action", target });
      }
    } else {
      if (typeof target === "string") {
        router.push(target);
      } else {
        target();
      }
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarCollapsed(false);
      } else {
        setSidebarCollapsed(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [plenoSessions, setPlenoSessions] = useState<PlenoSchedule[]>([
    {
      id: 1,
      batchCode: "PLN-001",
      tanggal: "2026-10-15",
      waktu: "09:00",
      skema: "Pemrograman Web",
      jumlahAsesi: 24,
      status: "Terjadwal",
      alamat: "Ruang Rapat Utama (Offline)",
      detailAlamat: "Gedung A, Lantai 2",
      deskripsi:
        "Sidang pleno penetapan kelulusan uji kompetensi skema Pemrograman Web gelombang 1.",
      asesiList: ["Ahmad Fauzi", "Budi Santoso", "Citra Kirana"],
    },
    {
      id: 2,
      batchCode: "PLN-002",
      tanggal: "2026-10-18",
      waktu: "13:00",
      skema: "Desain Grafis",
      jumlahAsesi: 15,
      status: "Menunggu Persetujuan",
      alamat: "Zoom Meeting (Online)",
      detailAlamat: "https://zoom.us/j/123456789",
      deskripsi:
        "Sidang pleno penetapan kelulusan uji kompetensi skema Desain Grafis gelombang 2.",
      asesiList: ["Dewi Lestari", "Eko Prasetyo"],
    },
  ]);

  const addPlenoSession = (session: PlenoSchedule) => {
    setPlenoSessions((prev) => [session, ...prev]);
  };

  const deletePlenoSession = (id: number) => {
    setPlenoSessions((prev) => prev.filter((session) => session.id !== id));
  };

  const updatePlenoSession = (id: number, data: Partial<PlenoSchedule>) => {
    setPlenoSessions((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...data } : p)),
    );
  };

  const [AssessmentItems, setAssessmentItems] = useState<AssessmentItem[]>(
    () => {
      // 1. UBAH BatchGroup[] menjadi AssessmentItem[]
      return Array.from({ length: 25 }).map((_, idx) => {
        const batchConfigs = [
          {
            batchCode: "BATCH-IT-2026-001",
            batchName: "Batch 1 - Teknisi Jaringan",
            skema: "Teknisi Muda Jaringan Komputer",
            tuk: "Sewaktu",
            metode: "Offline",
            alamat: "Gedung L PTIPD Lab 1",
            tglAsesmen: "05 Okt 2023",
            waktu: "09:00 WIB",
            linkVideo: "-",
          },
          {
            batchCode: "BATCH-NET-2026-002",
            batchName: "Batch 2 - Network Admin Online",
            skema: "Network Administrator",
            tuk: "Mandiri",
            metode: "Online",
            alamat: "Zoom Meeting",
            tglAsesmen: "06 Okt 2023",
            waktu: "13:00 WIB",
            linkVideo: "https://meet.google.com/abc-defg-hij",
          },
          {
            batchCode: "BATCH-PRG-2026-003",
            batchName: "Batch 3 - Pemangku Kepentingan",
            skema: "Melaksanakan Komunikasi Dengan Pemangku Kepentingan",
            tuk: "Sewaktu",
            metode: "Offline",
            alamat: "Ruang Rapat Utama",
            tglAsesmen: "08 Okt 2023",
            waktu: "09:00 WIB",
            linkVideo: "-",
          },
          {
            batchCode: "BATCH-SEC-2026-004",
            batchName: "Batch 4 - Cyber Security Online",
            skema: "Network Administrator",
            tuk: "Mandiri",
            metode: "Online",
            alamat: "Google Meet",
            tglAsesmen: "10 Okt 2023",
            waktu: "09:00 WIB",
            linkVideo: "https://meet.google.com/xyz-uvwx-rst",
          },
          {
            batchCode: "BATCH-DES-2026-005",
            batchName: "Batch 5 - Teknisi Jaringan Gel. 2",
            skema: "Teknisi Muda Jaringan Komputer",
            tuk: "Sewaktu",
            metode: "Offline",
            alamat: "Gedung H Lab Terpadu",
            tglAsesmen: "12 Okt 2023",
            waktu: "13:00 WIB",
            linkVideo: "-",
          },
        ];

        const batch = batchConfigs[idx % batchConfigs.length];

        // 2. Tambahkan as Type untuk keamanan TypeScript
        let metode = batch.metode as JenisMetode;
        let status = "Belum Selesai" as StatusAsesmen;

        if (metode === "Offline") {
          status = idx % 3 === 0 ? "Selesai" : "Belum Selesai";
        } else {
          if (idx % 3 === 0) status = "Selesai";
          else status = "Belum Selesai";
        }

        if (idx === 3) {
          metode = "Online";
          status = "Belum Selesai";
        }
        if (idx === 5) {
          metode = "Online";
          status = "Belum Selesai";
        }
        if (idx === 0) {
          metode = "Offline";
          status = "Belum Selesai";
        }

        if (idx === 3) status = "Belum Selesai";
        if (idx === 5) status = "Belum Selesai";
        if (idx === 0) status = "Belum Selesai";

        const linkVideo = batch.linkVideo;

        return {
          id: idx + 1,
          nama: `Kandidat ${idx + 1}`,
          nik: `32730128${(1000 + idx).toString()}0001`,
          aplStatus:
            idx % 4 === 3 ? "APL-01 Valid" : "APL-01 & APL-02 Terverifikasi",
          batchCode: batch.batchCode,
          batchName: batch.batchName,
          asesmen: `Asesmen Reguler - ${idx + 1}`,

          tipeTuk: batch.tuk as TipeTuk, // 2. Ganti 'tuk' menjadi 'tipeTuk'

          metode: metode,
          hasil: (idx % 2 === 0
            ? "Kompeten"
            : "Belum Kompeten") as HasilAsesmen,
          isBanding: idx % 2 !== 0 && idx % 3 === 0,
          alasanBanding:
            idx % 2 !== 0 && idx % 3 === 0
              ? "Saya merasa sudah menjawab semua pertanyaan dengan benar saat wawancara."
              : undefined,
          skema: batch.skema,
          alamat: batch.alamat,
          tglPra: `${(idx % 28) + 1} Okt 2023`,
          tglAsesmen: batch.tglAsesmen,
          waktu: batch.waktu,
          linkVideo: linkVideo,
          status: status,
          riwayat: idx % 3 === 0 ? "Belum ada" : "Tinjauan Awal",
        } as AssessmentItem;
      });
    },
  );

  const [completedBatchCodes, setCompletedBatchCodes] = useState<string[]>([]);

  const updateAssessmentItem = (id: number, data: Partial<AssessmentItem>) => {
    setAssessmentItems((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...data } : a)),
    );
  };

  const deleteBatchAssessmentItems = (batchCode: string) => {
    setCompletedBatchCodes((prev) => [...prev, batchCode]);
  };

  const [konfigurasiPertanyaan, setKonfigurasiPertanyaan] = useState<
    KonfigurasiPertanyaanItem[]
  >(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("konfigurasi_pertanyaan_data");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: "1",
        nama: "Set Konfigurasi Pertanyaan Asesmen Komprehensif",
        skema: "Teknisi Muda Jaringan Komputer",
        tipeForm: "Multi-Step Wizard",
        versi: "1.0",
        penyusun: [
          {
            value: "aditya_rahman",
            label: "Aditya Rahman Syach, M.Kom (Asesor Utama)",
          },
        ],
        validator: [
          {
            value: "made_jaya",
            label: "I Made Jaya Artana, S.T., M.T. (Asesor)",
          },
        ],
        isDefault: false,
        status: "published",
        subPertanyaans: [],
      },
    ];
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(
          "konfigurasi_pertanyaan_data",
          JSON.stringify(konfigurasiPertanyaan),
        );
      } catch (e) {
        console.error(e);
      }
    }
  }, [konfigurasiPertanyaan]);

  const [pertanyaanAsesmen, setPertanyaanAsesmen] = useState<
    PertanyaanAsesmenItem[]
  >([
    {
      id: 1,
      nama: "wadw",
      skema: "Pembukuan",
      tipeForm: "FR.IA-01",
      tipePertanyaan: "Esai",
      penyusun: [
        { value: "aditya_rahman", label: "Aditya Rahman Syach - Asesor" },
      ],
      questions: [
        { id: "q1", text: "easd", options: [] },
        { id: "q2", text: "wadsd", options: [] },
      ],
    },
    {
      id: 2,
      nama: "adwdasd",
      skema: "Pembukuan",
      tipeForm: "FR.IA-05A_MERGE",
      tipePertanyaan: "Pilihan Ganda",
      penyusun: [{ value: "aditya_rahman", label: "Aditya Rahman Syach" }],
      questions: [
        {
          id: "q1",
          text: "awdsadasdsdasd",
          options: [
            { id: "o1", text: "asdasdasd", isCorrect: true },
            { id: "o2", text: "wadsasd" },
            { id: "o3", text: "asdasd" },
            { id: "o4", text: "awdasdas" },
          ],
        },
        {
          id: "q2",
          text: "dasdadas",
          options: [
            { id: "o5", text: "sdadasd" },
            { id: "o6", text: "sdasdsada", isCorrect: true },
            { id: "o7", text: "asdadasd" },
          ],
        },
      ],
    },
  ]);

  const addPertanyaanAsesmen = (item: Omit<PertanyaanAsesmenItem, "id">) => {
    setPertanyaanAsesmen((prev) => [
      ...prev,
      { ...item, id: Date.now() },
    ]);
  };

  const updatePertanyaanAsesmen = (
    id: number,
    item: Omit<PertanyaanAsesmenItem, "id">,
  ) => {
    setPertanyaanAsesmen((prev) =>
      prev.map((p) => (p.id === id ? { ...item, id } : p)),
    );
  };

  const deletePertanyaanAsesmen = (id: number) => {
    setPertanyaanAsesmen((prev) => prev.filter((p) => p.id !== id));
  };

  const addKonfigurasiPertanyaan = (
    item: Omit<KonfigurasiPertanyaanItem, "id">,
  ) => {
    setKonfigurasiPertanyaan((prev) => [
      ...prev,
      { ...item, id: Date.now() } as KonfigurasiPertanyaanItem,
    ]);
  };

  const updateKonfigurasiPertanyaan = (
    id: number,
    item: Omit<KonfigurasiPertanyaanItem, "id">,
  ) => {
    setKonfigurasiPertanyaan((prev) =>
      prev.map((p) =>
        p.id === id ? ({ ...item, id } as KonfigurasiPertanyaanItem) : p,
      ),
    );
  };

  const deleteKonfigurasiPertanyaan = (id: number) => {
    setKonfigurasiPertanyaan((prev) => prev.filter((p) => p.id !== id));
  };

  const updateUser = (data: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...data } : null));
  };

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const logout = async () => {
    showNotification("Berhasil keluar dari akun.", "success");
    setIsLoggingOut(true);
    await signOut({ redirect: false });
    setTimeout(() => {
      window.location.href = "/login";
    }, 1500);
  };
  return (
    <AppContext.Provider
      value={{
        extraCrumbs,
        setExtraCrumbs,
        user,
        plenoSessions,
        addPlenoSession,
        updatePlenoSession,
        deletePlenoSession,
        logout,
        isLoggingOut,
        updateUser,
        sidebarCollapsed,
        setSidebarCollapsed,
        pertanyaanAsesmen,
        addPertanyaanAsesmen,
        updatePertanyaanAsesmen,
        deletePertanyaanAsesmen,
        selectedPertanyaanId,
        setSelectedPertanyaanId,
        konfigurasiPertanyaan,
        addKonfigurasiPertanyaan,
        updateKonfigurasiPertanyaan,
        deleteKonfigurasiPertanyaan,
        selectedKonfigurasiId,
        setSelectedKonfigurasiId,
        registeredProfile,
        setRegisteredProfile,
        selectedAsesmen,
        setSelectedAsesmen,
        AssessmentItems,
        updateAssessmentItem,
        deleteBatchAssessmentItems,
        completedBatchCodes,
        isFormDirty,
        setIsFormDirty,
        pendingNavigation,
        setPendingNavigation,
        requestNavigation,
        showNotification,
      }}
    >
      <AnimatePresence>
        {notification.show && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-9999 px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 border backdrop-blur-md ${
              notification.type === "success"
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
      </AnimatePresence>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context)
    throw new Error("useAppContext must be used within AppProvider");
  return context;
}
