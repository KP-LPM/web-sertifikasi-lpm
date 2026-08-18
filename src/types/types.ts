import { DefaultSession } from "next-auth";

/* ==========================================================================
   NEXT-AUTH MODULE DECLARATIONS
   ========================================================================== */

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      role: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    username: string;
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
    role: string;
  }
}

/* ==========================================================================
   USER & SYSTEM TYPES
   ========================================================================== */

export type Role = "admin" | "asesor" | "asesi" | "direktur" | "manajer";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  tandaTangan?: string;
  status?: "Active" | "Inactive" | "Pending Verification";
}

export interface Scheme {
  id: string;
  code: string;
  name: string;
  category: string;
  status: "Active" | "Draft" | "Archived";
  applicantsCount: number;
}

export interface Candidate {
  id: string;
  name: string;
  scheme: string;
  submissionDate: string;
  status: "Pending Review" | "In Progress" | "Revision Required" | "Completed";
  avatar?: string;
}

export interface ExamSession {
  id: string;
  date: string;
  time: string;
  title: string;
  subtitle: string;
  type: "Interview" | "Viva Voce" | "Exam";
}

export interface PlenoSession {
  id: string;
  tanggal: string;
  waktu: string;
  skema: string;
  jumlahAsesi: number;
  status: string;
  lokasi: string;
  detailLokasi?: string;
  deskripsi?: string;
  asesiList?: string[];
}

export interface CrumbItem {
  label: string;
  path?: string;
}

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  theme?: "amber" | "emerald" | "sky" | string;
  subtext?: string;
}

export interface QueueItemProps {
  title: string;
  candidate: string;
  time: string;
  badge?: "Online" | "Mendesak" | string;
  onClick?: () => void;
}

export interface ConfigurationMetadata {
  namaKonfigurasi: string;
  skemaSertifikasi: string;
  versi: string;
  penyusun: Array<{ value: string; label: string }>;
  validator: Array<{ value: string; label: string }>;
  isDefault: boolean;
}

// STEP 1: Penyesuaian Wajar (CHECKLIST_MULTIPLE_CHOICE)
export interface ChecklistOption {
  id: string;
  text: string;
  isValid: boolean; // Checkbox pilihan opsi valid
}

export interface Step1Question {
  id: string;
  pertanyaanText: string;
  options: ChecklistOption[];
}

export interface Step1Data {
  type: "CHECKLIST_MULTIPLE_CHOICE";
  questions: Step1Question[];
}

// STEP 2: Penjelasan Singkat Proyek - FR.IA.04A (INSTRUCTION_SCENARIO)
export interface Step2BlokA {
  skenarioStudiKasus: string; // Textarea Latar belakang kasus perusahaan
  informasiYangDiberikan: string[]; // Dynamic List Array String
  lingkupBahasanStudiKasus: string[]; // Dynamic List Array String
  perlengkapanDanBahan: string; // Textarea
}

export interface Step2BlokB {
  fokusPresentasi: string[]; // Dynamic List Array String
  ketentuanAlokasiWaktu: string; // Textarea
  kriteriaEvaluasiAsesor: string[]; // Dynamic List Array String
}

export interface Step2Data {
  type: "INSTRUCTION_SCENARIO";
  blokA: Step2BlokA;
  blokB: Step2BlokB;
}

// STEP 3: Penilaian Proyek Singkat - FR.IA.04B (NESTED_ESSAY_PROYEK)
export interface Step3SubPertanyaan {
  id: string;
  skenarioPertanyaan: string; // Textarea Skenario & Teks Pertanyaan
  kodeKUK: string[]; // Input/Select Standar Kompetensi / KUK Terkait
  ekspektasiTanggapan: string; // Textarea
}

export interface Step3LingkupPenyajian {
  id: string;
  namaLingkup: string; // Input Nama Lingkup Penyajian
  subPertanyaans: Step3SubPertanyaan[]; // Nested Array Sub-Pertanyaan
}

export interface Step3Data {
  type: "NESTED_ESSAY_PROYEK";
  lingkups: Step3LingkupPenyajian[];
}

// STEP 4: Pertanyaan Lisan - FR.IA.07 (ESSAY_WITH_KEY_ANSWER)
export interface Step4Question {
  id: string;
  kodeKUKRef: string;
  pertanyaanLisan: string;
  kunciJawaban: string; // Wajib diisi oleh Asesor
}

export interface Step4Data {
  type: "ESSAY_WITH_KEY_ANSWER";
  questions: Step4Question[];
}

// Central Wizard Form State Schema
export interface WizardFormState {
  metadata: ConfigurationMetadata;
  step1: Step1Data;
  step2: Step2Data;
  step3: Step3Data;
  step4: Step4Data;
}

export interface PenyusunValidator {
  nama: string;
  noMet: string;
  ttdTanggal: string;
}

export interface EvidenceFileItem {
  id?: string;
  name?: string;
  url?: string;
  file?: File;
  [key: string]: unknown;
}

/* ==========================================================================
   QUESTION & ASSESSMENT CONFIGURATION INTERFACES
   ========================================================================== */

export interface Option {
  id: string;
  text: string;
  imageUrl?: string;
  isCorrect?: boolean;
}

export interface Question {
  id: string;
  text: string;
  options: Option[];
  answerKey?: string;
  imageUrl?: string;
}

export interface PersonItem {
  id?: string | number;
  nama?: string;
  role?: string;
  label?: string;
  value?: string;
  [key: string]: unknown;
}

export interface SubPertanyaanItem {
  id: string;
  nama?: string;
  tipePertanyaan?: string;
  penyusun?: PersonItem[] | string[];
  questions?: Question[];
  [key: string]: unknown; // Menampung blokA, blokB, lingkups, dll.
}

export interface PertanyaanAsesmenItem {
  id: number;
  nama: string;
  skema: string;
  tipeForm: string;
  tipePertanyaan: string;
  penyusun?: PersonItem[] | string[];
  questions?: Question[];
  subPertanyaan?: SubPertanyaanItem[];
}

export interface KonfigurasiPertanyaanItem {
  id: string;
  nama: string;
  skema: string;
  tipeForm: string;
  versi: string;
  status?: "draft" | "terbit" | string;
  penyusun?: PersonItem[] | string[] | Array<{ value: string; label: string }>;
  validator?: PersonItem[] | string[] | Array<{ value: string; label: string }>;
  isDefault: boolean;
  subPertanyaans?: SubPertanyaanItem[];
  formData?: WizardFormState;
  [key: string]: unknown;
}

/* ==========================================================================
   ASSESSMENT & BATCH INTERFACES
   ========================================================================== */

export type JenisMetode = "Offline" | "Online";

export interface Assessment {
  id: number;
  nama?: string;
  nik?: string;
  asesmen?: string;
  tuk?: string;
  hasil?: string;
  isBanding?: boolean;
  alasanBanding?: string;
  skema?: string;
  batchCode?: string;
  batchName?: string;
  alamat?: string;
  metode: string;
  tglPra?: string;
  tglAsesmen?: string;
  waktu?: string;
  linkVideo?: string;
  status: string;
  riwayat?: string;
  statusApl02?: string;
  [key: string]: unknown; // Opsi tambahan agar fleksibel
}

export interface BatchGroup {
  batchCode: string;
  batchName: string;
  skema: string;
  tuk: string;
  metode: JenisMetode;
  alamat: string;
  tglAsesmen: string;
  waktu: string;
  linkVideo: string;
  candidates: Assessment[];
}

export interface PortfolioItem {
  id: string;
  skema: string;
  namaDokumen: string;
  statusAsesor?: "Asesor dari UIN Bandung" | "Asesor dari Luar";
  alamatLsp?: string;
  deskripsi?: string;
  tanggal: string;
  fileName: string;
  filePeminjamanName?: string;
  fileJawabanName?: string;
  fileSize?: string;
  fileType?: string;
  status: "Menunggu Verifikasi" | "Terverifikasi" | "Ditolak";
  catatanAdmin?: string;
}
