"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import {
  PlenoSession,
  Role,
  User,
  AssessmentItem,
  JenisMetode,
  JenisTUK,
  HasilAsesmen,
  StatusAsesmen,
  PertanyaanAsesmenItem,
  KonfigurasiPertanyaanItem,
  CrumbItem,
} from "@/types/types";
import { currentUser as mockAdmin } from "../app/data";

interface AppContextType {
  extraCrumbs: CrumbItem[];
  setExtraCrumbs: (crumbs: CrumbItem[]) => void;
  plenoSessions: PlenoSession[];
  addPlenoSession: (session: PlenoSession) => void;
  updatePlenoSession: (id: string, data: Partial<PlenoSession>) => void;
  deletePlenoSession: (id: string) => void;
  user: User | null;
  login: (role: Role) => void;
  logout: () => void;
  isLoggingOut: boolean;
  updateUser: (data: Partial<User>) => void;
  currentView: string;
  setCurrentView: (view: string) => void;
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
    id: string,
    item: Omit<KonfigurasiPertanyaanItem, "id">,
  ) => void;
  deleteKonfigurasiPertanyaan: (id: string) => void;
  selectedKonfigurasiId: string | null;
  setSelectedKonfigurasiId: (id: string | null) => void;
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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // --- NEXTAUTH SESSION INTEGRATION ---
  const { data: session } = useSession();

  // --- STATES ---
  const [extraCrumbs, setExtraCrumbs] = useState<CrumbItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<string>("login");
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(
    typeof window !== "undefined" ? window.innerWidth < 1024 : false,
  );
  const [selectedPertanyaanId, setSelectedPertanyaanId] = useState<
    number | null
  >(null);
  const [selectedKonfigurasiId, setSelectedKonfigurasiId] = useState<
    string | null
  >(null);
  const [registeredProfile, setRegisteredProfile] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [selectedAsesmen, setSelectedAsesmen] = useState<AssessmentItem | null>(
    null,
  );

  const [prevSession, setPrevSession] = useState(session);

  // Sinkronisasi state saat render jika session berubah
  if (session !== prevSession) {
    setPrevSession(session);
    if (session?.user) {
      setUser({
        id: session.user.name || "u1",
        name: session.user.name || "",
        email: session.user.email || "",
        role: session.user.role as Role,
        avatar: session.user.image || "",
      });
    }
  }

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
        setCurrentView(target);
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

  const [plenoSessions, setPlenoSessions] = useState<PlenoSession[]>([
    {
      id: "PLN-001",
      tanggal: "2026-10-15",
      waktu: "09:00",
      skema: "Pemrograman Web",
      jumlahAsesi: 24,
      status: "Terjadwal",
      lokasi: "Ruang Rapat Utama (Offline)",
      detailLokasi: "Gedung A, Lantai 2",
      deskripsi:
        "Sidang pleno penetapan kelulusan uji kompetensi skema Pemrograman Web gelombang 1.",
      asesiList: ["Ahmad Fauzi", "Budi Santoso", "Citra Kirana"],
    },
    {
      id: "PLN-002",
      tanggal: "2026-10-18",
      waktu: "13:00",
      skema: "Desain Grafis",
      jumlahAsesi: 15,
      status: "Menunggu Persetujuan",
      lokasi: "Zoom Meeting (Online)",
      detailLokasi: "https://zoom.us/j/123456789",
      deskripsi:
        "Sidang pleno penetapan kelulusan uji kompetensi skema Desain Grafis gelombang 2.",
      asesiList: ["Dewi Lestari", "Eko Prasetyo"],
    },
  ]);

  const addPlenoSession = (session: PlenoSession) => {
    setPlenoSessions((prev) => [session, ...prev]);
  };

  const deletePlenoSession = (id: string) => {
    setPlenoSessions((prev) => prev.filter((session) => session.id !== id));
  };

  const updatePlenoSession = (id: string, data: Partial<PlenoSession>) => {
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

          // 3. Perbaiki nama properti batch yang dipanggil
          batchCode: batch.batchCode,
          batchName: batch.batchName,

          asesmen: `Asesmen Reguler - ${idx + 1}`,
          tuk: batch.tuk as JenisTUK,
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

          // 4. Perbaiki nama properti tanggal yang dipanggil
          tglAsesmen: batch.tglAsesmen,

          waktu: batch.waktu,
          linkVideo: linkVideo,
          status: status,
          riwayat: idx % 3 === 0 ? "Belum ada" : "Tinjauan Awal",
        };
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
      { ...item, id: prev.length > 0 ? prev[prev.length - 1].id + 1 : 1 },
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
      { ...item, id: Date.now().toString() } as KonfigurasiPertanyaanItem,
    ]);
  };

  const updateKonfigurasiPertanyaan = (
    id: string,
    item: Omit<KonfigurasiPertanyaanItem, "id">,
  ) => {
    setKonfigurasiPertanyaan((prev) =>
      prev.map((p) =>
        p.id === id ? ({ ...item, id } as KonfigurasiPertanyaanItem) : p,
      ),
    );
  };

  const deleteKonfigurasiPertanyaan = (id: string) => {
    setKonfigurasiPertanyaan((prev) => prev.filter((p) => p.id !== id));
  };

  const updateUser = (data: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...data } : null));
  };

  const login = (role: Role) => {
    let mockUser: User;
    if (role === "admin") {
      mockUser = mockAdmin;
    } else if (role === "asesor") {
      mockUser = {
        id: "u2",
        name: "Dr. Aris Thorne",
        email: "aris@uin.ac.id",
        role: "asesor",
        avatar: "AT",
      };
    } else if (role === "direktur") {
      mockUser = {
        id: "u4",
        name: "Prof. Direktur",
        email: "direktur@lsp.com",
        role: "direktur",
        avatar: "DR",
      };
    } else if (role === "manajer") {
      mockUser = {
        id: "u5",
        name: "Bapak Manajer",
        email: "manajer@lsp.com",
        role: "manajer",
        avatar: "MN",
      };
    } else {
      mockUser = {
        id: "u3",
        name: "Ahmad Fauzi",
        email: "ahmad.fauzi@uin-suka.ac.id",
        role: "asesi",
        avatar: "AF",
      };
    }
    setUser(mockUser);
    setCurrentView("dashboard");
  };
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const logout = async () => {
    setIsLoggingOut(true);
    await signOut({ redirect: false });
    window.location.href = "/login";
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
        login,
        logout,
        isLoggingOut,
        updateUser,
        currentView,
        setCurrentView,
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
      }}
    >
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
