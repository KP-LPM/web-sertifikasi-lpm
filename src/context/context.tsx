"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { BadgeCheck, X, AlertTriangle } from "lucide-react";
import {
  AssessmentItem,
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

  // --- GLOBAL CONFIRMATION MODAL STATE ---
  const [globalConfirm, setGlobalConfirm] = useState<{
    isOpen: boolean;
    type: "save" | "delete";
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const button = target.closest("button") || target.closest("input[type='submit']") || target.closest("input[type='button']");
      if (!button) return;
      if ((button as HTMLButtonElement | HTMLInputElement).disabled) return;

      if (button.dataset.bypassConfirm === "true") return;
      if (button.dataset.confirmed === "true") return;

      const text = button instanceof HTMLInputElement
        ? (button.value || "").toLowerCase()
        : (button.innerText || button.getAttribute("aria-label") || button.title || "").toLowerCase();

      const isDelete = (text.includes("hapus") || text.includes("delete")) && !text.includes("batal");

      if (isDelete) {
        e.preventDefault();
        e.stopPropagation();

        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }

        setGlobalConfirm({
          isOpen: true,
          type: "delete",
          title: "Konfirmasi Hapus",
          message: "Apakah Anda yakin ingin menghapus data ini?",
          onConfirm: () => {
            setGlobalConfirm(null);

            setTimeout(() => {
              button.dataset.confirmed = "true";
              button.click();

              setTimeout(() => {
                button.dataset.confirmed = "false";
              }, 1000);
            }, 100);
          }
        });
      }
    };

    document.addEventListener("click", handleGlobalClick, { capture: true });

    return () => {
      document.removeEventListener("click", handleGlobalClick, { capture: true });
    };
  }, []);

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

  const [plenoSessions, setPlenoSessions] = useState<PlenoSchedule[]>([]);

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

  const [AssessmentItems, setAssessmentItems] = useState<AssessmentItem[]>([]);

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
    setPertanyaanAsesmen((prev) => [...prev, { ...item, id: Date.now() }]);
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
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-9999 px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 border backdrop-blur-md ${notification.type === "success"
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

        {globalConfirm?.isOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden"
            >
              <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white">
                <h3 className="font-bold text-gray-900">{globalConfirm.title}</h3>
                <button
                  onClick={() => setGlobalConfirm(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-5 flex gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${globalConfirm.type === 'delete' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-[#008BE3]'}`}>
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                    {globalConfirm.message}
                  </p>
                </div>
              </div>
              <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
                <button
                  onClick={() => setGlobalConfirm(null)}
                  className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                  data-bypass-confirm="true"
                >
                  Batal
                </button>
                <button
                  onClick={globalConfirm.onConfirm}
                  className={`px-4 py-2 text-white rounded-lg text-sm font-bold shadow-xs transition-colors ${globalConfirm.type === "delete"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-[#008BE3] hover:bg-[#0076C2]"
                    }`}
                  data-bypass-confirm="true"
                >
                  Ya, Lanjutkan
                </button>
              </div>
            </motion.div>
          </div>
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
