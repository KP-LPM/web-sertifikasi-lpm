// ============================================================================
// COMBINED TYPES & INTERFACES (Admin, asesor, Asesi)
// ============================================================================

// CONTEXT
export type Role =
  | "admin"
  | "asesor"
  | "asesi"
  | "direktur"
  | "manajer"
  | "dewan pengarah"
  | "komite skema"
  | string;

export interface CrumbItem {
  label: string;
  href?: string;
}

export type JenisMetode = "Offline" | "Online";
export type TipeTuk = "Sewaktu" | "Mandiri" | "Tempat Kerja" | string;
export type HasilAsesmen =
  | "Kompeten"
  | "Belum Kompeten"
  | "Belum Dinilai"
  | string;
export type StatusAsesmen = "Selesai" | "Belum Selesai" | string;

export interface PenyusunOption {
  value: string;
  label: string;
}

export interface QuestionOptionItem {
  id: string;
  text: string;
  isCorrect?: boolean;
}

export interface PertanyaanAsesmenQuestion {
  id: string;
  text: string;
  options: QuestionOptionItem[];
}

export interface PertanyaanAsesmenItem {
  id: string;
  nama: string;
  skema: string;
  tipeForm: string;
  tipePertanyaan: "Esai" | "Pilihan Ganda" | "Checkbox Multiple" | string;
  penyusun: PenyusunOption[];
  questions: PertanyaanAsesmenQuestion[];
}

export interface KonfigurasiPertanyaanItem {
  id: string;
  nama: string;
  skema: string;
  tipeForm: string;
  versi: string;
  penyusun: PenyusunOption[];
  validator: PenyusunOption[];
  isDefault: boolean;
  status: "Draft" | "published" | "Aktif" | "Arsip" | string;
  subPertanyaans: unknown[]; // sesuaikan tipenya sesuai struktur Sub Pertanyaan final
}

// ----------------------------------------------------------------------------
// 1. ADMIN TYPES & INTERFACES
// ----------------------------------------------------------------------------

export interface User {
  id: string; // NextAuth selalu string, walau Prisma Int — dikonversi saat sign-in callback
  username: string;
  email: string;
  role: Role; // samakan dengan Prisma enum Role
  avatar?: string;
}

export interface UserItem {
  id: string;
  inisial: string; // computed di backend dari namaLengkap
  namaLengkap: string | ""; // dari ProfilPengguna.namaLengkap
  email: string; // dari User.email
  role: Role;
  status: "Aktif" | "Terverifikasi" | "Nonaktif" | "Menunggu Verifikasi"; // computed
  nik?: string;
  tempPassword?: string;
  verificationData?: UserVerificationData;
}

export interface PenyusunValidatorItem {
  nama?: string;
  noMet?: string;
  ttdTanggal?: string;
  [key: string]: unknown;
}

export interface UserVerificationData {
  rekomendasi: string;
  catatan: string;
  adminSignatureUrl?: string | null;
  lspSignatureUrl?: string | null;
  rekomendasiApl02?: string;
  ttdAsesor?: string | null | Record<string, null> | unknown;
  asesorName?: string;
  asesorReg?: string;
  penyusun?: string | string[] | PenyusunValidatorItem[] | unknown;
  validator?: string | string[] | PenyusunValidatorItem[] | unknown;
  assignedAsesorId?: string;
  statusPembayaran?: "Sudah" | "Belum" | string;
  sumberAnggaran?: string;
  [key: string]: unknown;
}

export interface AsesiPlenoRecord {
  id: string;
  nama: string;
  nik: string;
  skema: string;
  noSertifikat: string;
  issueDate: string;
  gdriveUrl: string;
  status: "Terbit" | "Belum Upload";
  notes?: string;
}

export interface PlenoSchedule {
  id: string;
  tanggal: string;
  waktu: string;
  skema: string;
  jumlahAsesi: number;
  status: "Terjadwal" | "Menunggu Persetujuan" | "Selesai" | string;
  alamat: string;
  detailAlamat: string;
  deskripsi: string;
  asesiList: string[]; // cuma nama, sesuai kebutuhan tahap ini
  suratPlenoName?: string; // Tambahkan ini
  suratPlenoUrl?: string; // Tambahkan ini
}

// ============================================================
// 2. Untuk HASIL pleno + tracking sertifikat (state: plenoGroups)
//    asesiList berisi objek lengkap AsesiPlenoRecord
// ============================================================
export interface PlenoGroup {
  plenoId: string;
  plenoTitle: string;
  skemaList: string[];
  tanggal: string;
  waktu: string;
  lokasi: string;
  isOnline: boolean;
  status: "Terjadwal" | "Selesai" | string;
  asesiList: AsesiPlenoRecord[];
  plenoAttendees?: PlenoAttendee[];
}

export interface PlenoDetailData {
  id: string;
  batchCode?: string;
  title?: string;
  skema: string;
  noSK?: string;
  tanggal: string;
  waktu: string;
  alamat: string;
  detailAlamat?: string;
  suratPlenoUrl?: string;
  linkSuratHasil?: string;
  linkSuratBeritaPleno?: string;
  linkSuratKeputusanDirektur?: string;
  linkSuratBlankoBNSP?: string;
  status: "Draft" | "Belum Ditetapkan" | "Selesai" | string;
  asesiList: AsesiPlenoItem[];
  plenoAttendees?: PlenoAttendee[]; // opsional, tidak semua sesi lama punya data ini
  deskripsi?: string;
  suratPlenoName?: string;
}

export interface AsesiPlenoItem {
  id: string;
  nik: string;
  nama: string;
  skema: string;
  asesor: string;
  rekomendasiAsesor: "K" | "BK" | string;
  statusPleno: "K" | "BK" | string;
  catatan?: string;
}

export interface PlenoAttendee {
  role: Role;
  nama: string;
}

export type TukDetailItem = TukItem;

export interface PersyaratanDasar {
  id?: number;
  namaDokumen: string;
  deskripsi?: string;
  urutan?: number;
  is_wajib?: boolean;
}

export interface PersyaratanAdministrasi {
  id: string;
  namaDokumen: string;
  deskripsi?: string;
  isWajib: boolean;
  isAktif: boolean;
}

export interface ElemenKompetensiItem {
  id?: string;
  namaElemen: string; // sebelumnya ada 2 nama beda: "judul" & "nama" — disatukan
  kriteriaUnjukKerja: string[]; // sebelumnya "kuk" — disatukan penamaannya
  urutan: number;
  isWajib: boolean; // disamakan gaya penamaan camelCase (sebelumnya is_wajib)
}

export interface UnitKompetensiItem {
  id?: string;
  kodeUnit: string; // sebelumnya "kode" — disatukan jadi "kodeUnit"
  judulUnit: string; // sebelumnya "judul" — disatukan jadi "judulUnit"
  urutan: number;
  elemen: ElemenKompetensiItem[];
}

export interface MasterSkemaFormState {
  kodeSkema: string;
  namaSkema: string;
  nomorSertifikat?: string;
  nomorRegistrasi?: string;
  statusAktif: boolean;
  persyaratanDasar: PersyaratanDasar[];
  persyaratanAdministrasi: PersyaratanAdministrasi[];
  unitKompetensi: UnitKompetensiItem[];
  konfigurasiSoalId?: string;
}

export interface MasterSkemaElemenPayload {
  namaElemen: string;
  kriteriaUnjukKerja?: string | string[];
  kuk?: string[];
  urutan?: number;
  is_wajib?: boolean;
}

export interface MasterSkemaUnitPayload {
  kodeUnit: string;
  judulUnit: string;
  jenisUnit?: string;
  urutan?: number;
  elemen?: MasterSkemaElemenPayload[];
}

export interface MasterSkemaPayload {
  id?: string;
  kodeSkema: string;
  namaSkema: string;
  nomorSertifikat?: string;
  nomorRegistrasi?: string;
  statusAktif: boolean;
  persyaratanDasar?: PersyaratanDasar[];
  persyaratanAdministrasi?: PersyaratanAdministrasi[];
  unitKompetensi?: MasterSkemaUnitPayload[];
  konfigurasiSoalId?: string;
}

export interface ScheduleItem {
  id: string;
  namaBatch?: string;
  nomorSurat?: string;
  skema?: string;
  metode?: string;
  tanggal: string;
  waktuMulai?: string;
  waktuAkhir?: string;
  jam?: string;
  tipeTuk: TipeTuk;
  alamat?: string;
  totalKandidat?: number;
  namaAsesor?: string;
  inisialAsesor?: string;
  suratPenugasanName?: string;
  suratTugasName?: string;
  suratTugasUrl?: string;
  status: string;
  asesiList?: (number | string)[];
}

export interface TukInventarisItem {
  nama: string;
  jumlah: number;
}

export interface TukItem {
  id: string;
  nama?: string;
  keterangan?: string;
  tipe?: "Sewaktu" | "Mandiri" | "Terverifikasi" | string;
  alamat?: string;
  kapasitas?: number;
  penanggungJawab?: string;
  status: "Aktif" | "Nonaktif" | string;
  inventaris?: TukInventarisItem[];
}

export interface SchemeItem {
  id: string;
  kode: string;
  nama: string;
  kategori: string;
  totalPendaftar?: number;
  status: "Active" | "Aktif" | "Draft" | "Archived" | "Nonaktif" | string;
  nomorSertifikat?: string;
  nomorRegistrasi?: string;
  deskripsi?: string;
  persyaratan?: string[];
  unitKompetensi?: UnitKompetensiItem[];
  persyaratanDasar?: PersyaratanDasar[];
  persyaratanAdministrasi?: PersyaratanAdministrasi[];
}

export interface RequirementItem {
  namaDokumen?: string;
  deskripsi?: string;
  urutan?: number;
  is_wajib?: boolean;
  [key: string]: unknown;
}

export type RequirementType = string | RequirementItem;

export interface SchemeDetailInfo {
  id?: string;
  nama?: string;
  kode?: string;
  units?: UnitKompetensiItem[];
  persyaratanDasar?: PersyaratanDasar[];
  buktiAdministratif?: PersyaratanAdministrasi[];
  buktiKompetensi?: RequirementType[];
  [key: string]: unknown;
}

export interface FormDataType {
  readOnly?: boolean;
  isAdmin?: boolean;
  tujuan?: string;
  checklist?: Record<string, "memenuhi" | "tidak memenuhi">;
  nik?: string;
  tempatLahir?: string;
  tanggalLahir?: string;
  institusiPerusahaan?: string;
  schemeDetail?: SchemeDetailInfo;
  onPreview?: (req: string) => void;
  [key: string]: unknown;
}

export interface Apl01FormData {
  isAdmin?: boolean;
  hidePaymentFields?: boolean;
  ttdAdmin?: string | null;
  rekomendasi?: string;
  catatan?: string;
  statusPembayaran?: "Sudah" | "Belum" | string;
  sumberAnggaran?: string;
  persyaratanDasar?: PersyaratanDasar[] | unknown;
  buktiAdministratif?: PersyaratanAdministrasi[] | unknown;
  buktiKompetensi?: RequirementType[] | unknown;
  schemeDetail?: SchemeDetailInfo;
  checklist?: Record<string, "memenuhi" | "tidak memenuhi">;
  readOnly?: boolean;
  [key: string]: unknown;
}

export interface EFormApl02FormData extends Apl02FormData {
  id?: string | number;
  metode?: string;
  status?: string;
}

export interface EFormApl02Props {
  formData: EFormApl02FormData;
  onChange: (val: EFormApl02FormData) => void;
  allData?: Record<string, EvidenceFileItem | File | string>;
}

export interface EvidenceFileItem {
  id?: string;
  nama?: string;
  url?: string;
  file?: File;
  [key: string]: unknown;
}

export interface Apl02FormData {
  isAdmin?: boolean;
  rekomendasiApl02?: string;
  ttdAsesor?: string | null | Record<string, null> | unknown;
  ttdAsesi?: string | null | Record<string, null> | unknown;
  namaAsesor?: string;
  asesorReg?: string;
  penyusun?: string | PenyusunValidatorItem[] | unknown;
  validator?: string | PenyusunValidatorItem[] | unknown;
  kompetensi?: Record<string, "K" | "BK" | string>;
  namaLengkap?: string;
  skema?: string;
  nomorSkema?: string;
  tipeTuk?: TipeTuk;
  tanggal?: string;
  detailSkema?: SchemeDetailInfo;
  readOnly?: boolean;
  signature?: string;
  [key: string]: unknown;
}

export interface CompletedBatchAsesi {
  id?: string;
  nama: string;
  nik: string;
  hasil: string;
}

export interface CompletedBatchItem {
  kode: string;
  nama: string;
  skema: string;
  asesor: string;
  tipeTuk: TipeTuk;
  metode: JenisMetode;
  tanggal: string;
  waktu: string;
  totalAsesi: number;
  kompetenCount: number;
  belumKompetenCount: number;
  status: string;
  suratPenugasan: string;
  asesiList: CompletedBatchAsesi[];
}

export interface StatCardProps {
  label?: string;
  title?: string;
  value: string | number;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  color?: "blue" | "indigo" | "emerald" | "amber" | string;
  subtext?: string;
}

export interface SchemeCardProps {
  scheme: SchemeItem;
  index?: number;
  onSelect?: (scheme: SchemeItem) => void;
  onEdit?: () => void;
  onArchive?: () => void;
  onPreview?: () => void;
  readOnly?: boolean;
}

export interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  theme?: "amber" | "emerald" | "sky" | "slate" | "default";
  subtext?: string;
}

export interface ActivityItemProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: React.ReactNode;
  time: string;
  badge?: string;
}

export interface TooltipPayloadEntry {
  color?: string;
  name?: string;
  value?: number | string;
}

export interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  label?: string;
}

export interface PendingVerificationActivity {
  id: string;
  asesiName: string;
  email: string;
  skema: string;
  berkas: string[];
  waktu: string;
  status: string;
  pembayaran: string;
}

// ----------------------------------------------------------------------------
// 2. asesor TYPES & INTERFACES
// ----------------------------------------------------------------------------

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

export interface Candidate {
  id: string;
  nik?: string;
  nama: string;
  skema: string;
  status?: string;
  email?: string;
  metode?: string;
  tglAsesmen?: string;
  waktu?: string;
  tipeTuk?: string;
  statusAPL02?: "Terverifikasi" | "Belum Terverifikasi" | "Proses" | string;
  statusPortofolio?:
    | "Terverifikasi"
    | "Belum Terverifikasi"
    | "Proses"
    | string;
  statusAsesmen?:
    | "Kompeten"
    | "Belum Kompeten"
    | "Belum Dinilai"
    | "Proses"
    | string;
  linkVideo?: string;
}

export interface BatchGroup {
  kodaBatch: string;
  namaBatch: string;
  skema: string;
  metode: string;
  tglAsesmen: string;
  waktu: string;
  tipeTuk: TipeTuk;
  linkVideo: string;
  candidates: Candidate[];
}

export interface ConfigurationMetadata {
  namaKonfigurasi: string;
  skemaSertifikasi: string;
  versi: string;
  penyusun: User;
  validator: User;
  isDefault: boolean;
}

export interface ChecklistOption {
  id: string;
  text: string;
  isValid: boolean;
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

export interface Step2BlokA {
  skenarioStudiKasus: string;
  informasiYangDiberikan: string[];
  lingkupBahasanStudiKasus: string[];
  perlengkapanDanBahan: string;
}

export interface Step2BlokB {
  fokusPresentasi: string[];
  ketentuanAlokasiWaktu: string;
  kriteriaEvaluasiAsesor: string[];
}

export interface Step2Data {
  type: "INSTRUCTION_SCENARIO";
  blokA: Step2BlokA;
  blokB: Step2BlokB;
}

export interface Step3SubPertanyaan {
  id: string;
  skenarioPertanyaan: string;
  kodeKUK: string[];
  ekspektasiTanggapan: string;
}

export interface Step3LingkupPenyajian {
  id: string;
  namaLingkup: string;
  subPertanyaans: Step3SubPertanyaan[];
}

export interface Step3Data {
  type: "NESTED_ESSAY_PROYEK";
  lingkups: Step3LingkupPenyajian[];
}

export interface Step4Question {
  id: string;
  kodeKUKRef: string;
  pertanyaanLisan: string;
  kunciJawaban: string;
}

export interface Step4Data {
  type: "ESSAY_WITH_KEY_ANSWER";
  questions: Step4Question[];
}

export interface WizardFormState {
  metadata: ConfigurationMetadata;
  step1: Step1Data;
  step2: Step2Data;
  step3: Step3Data;
  step4: Step4Data;
}

export interface QuestionConfigItem {
  id: string;
  nama: string;
  skema: string;
  versi: string;
  tanggalDibuat: string;
  penyusun: string;
  validator: string;
  status: "Draft" | "Aktif" | "Arsip" | string;
}

export interface AssessmentItem {
  id: string;
  nik: string;
  nama: string;
  skema: string;
  tglAsesmen: string;
  waktu: string;
  tipeTuk: TipeTuk;
  hasil: "Kompeten" | "Belum Kompeten" | "Belum Dinilai" | string;
  status?: string;
  alamat?: string;
  asesor?: string;
  metode?: JenisMetode;
  catatan?: string;
  isBanding?: boolean;
  alasanBanding?: string;
  statusBanding?: "Menunggu" | "Disetujui" | "Ditolak" | string;
  catatanBanding?: string;
}

// ----------------------------------------------------------------------------
// 3. ASESI TYPES & INTERFACES
// ----------------------------------------------------------------------------

export interface RegisteredAssessment {
  id: string;
  asesmen: string;
  skemaSertifikasi: string;
  tipeTuk: TipeTuk;
  alamat: string;
  tanggalAsesmen: string;
  linkVirtualMeeting: string;
  asesor: string;
  jenisBukti: string;
  rekomendasi: string;
  statusAsesmen: string;
}

export interface AssessmentHistory {
  id: string;
  asesmen: string;
  skemaSertifikasi: string;
  tipeTuk: TipeTuk;
  metodePelaksanaan: "Online" | "Offline";
  jenisBukti: string;
  noSertifikat: string;
  tanggalBerlaku: string;
  rekomendasi: string;
  statusAsesmen: string;
  tanggalPenilaian?: string;
}

export interface AppealRecord {
  id: string;
  tanggalPengajuan: string;
  namaAsesi: string;
  asesmen: string;
  skemaSertifikasi: string;
  status:
    | "Menunggu Verifikasi"
    | "Disetujui"
    | "Ditolak"
    | "Dalam Penyelidikan";
  alasan: string;
  penjelasan: string;
  keputusanAdmin?: string;
  dijelaskan?: boolean;
  didiskusikan?: boolean;
  melibatkanOrangLain?: boolean;
  ttdAsesi?: boolean;
  namaAsesor?: string;
}

export interface Profile {
  id: string;
  name: string;
  kode: string;
  date: string;
  status: string;
  noHp?: string;
  telepon?: string;
  units?: UnitKompetensiItem[] | unknown;
  penyesuaianWajar?: boolean;
  namaLengkap?: string;
  tempatLahir?: string;
  tanggalLahir?: string;
  jenisKelamin?: string;
  alamat?: string;
  provinsi?: string;
  kota?: string;
  nik?: string;
  kewarganegaraan?: string;
  kodePos?: string;
  noTelp?: string;
  pendidikanTerakhir?: string;
  pekerjaan?: string;
  institusiPerusahaan?: string;
  jabatan?: string;
  emailInstitusi?: string;
  kodePosInstitusi?: string;
  alamatInstitusi?: string;
  telpInstitusi?: string;
  faxInstitusi?: string;
  tipeTuk?: string;
  berpengalaman?: boolean;
}

export interface KompetensiItem {
  id: string;
  unitTitle: string;
  unitCode: string;
  elemen: string;
  kuk: string[];
  idx: number;
}

export interface FormDocumentItem {
  id?: string | number;
  nama?: string;
  deskripsi?: string;
  tipe?: string;
  required?: boolean;
  isEForm?: boolean;
  isPreview?: boolean;
  [key: string]: unknown;
}

export interface FormKompetensiTableProps {
  title: string;
  infoText?: string;
  kompetensiList: KompetensiItem[];
  eFormData: Record<string, unknown>;
  onAction: (doc: unknown) => void;
}

export interface FormDocumentTableProps {
  title: string;
  infoText?: string;
  documents: FormDocumentItem[];
  eFormData: Record<string, unknown>;
  showErrors?: boolean;
  onAction: (doc: FormDocumentItem) => void;
}

export interface SignatureValue {
  type: "auto" | "upload" | "draw" | "manual";
  data?: string | null;
}

export interface DokumenPengajuan {
  namaDokumen: string;
  fileUrl: string;
}

export interface PengajuanPayload {
  userId?: string; 
  code: string;    
  tuk: string;
  
  nik: string;
  namaLengkap: string;
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: string;
  alamat: string;
  provinsi: string;
  kota: string;
  kodePos: string;
  kebangsaan: string; 
  noTelp: string;
  pendidikanTerakhir: string;
  pekerjaan: string;
  tandaTangan?: string;

  institusiPerusahaan: string;
  jabatan: string;
  emailInstitusi: string;
  kodePosInstitusi: string;
  telpInstitusi: string;
  alamatInstitusi: string;
  faxInstitusi: string;
  
  penyesuaianWajar: boolean;
  berpengalaman: boolean;
  
  dataAsesmen?: Array<{ unitId: number; penilaianAsesi: string }>;
  dokumen?: DokumenPengajuan[];
}

export interface RegisterPayload {
  username?: string;
  email?: string;
  password?: string;
  role?: string;
  nik?: string;
  nama_lengkap?: string;
  tempat_lahir?: string;
  tanggal_lahir?: string;
  jenis_kelamin?: string;
  no_hp?: string;
  pekerjaan?: string;
  kewarganegaraan?: string;
  nomor_registrasi_met?: string;
  pendidikan_terakhir?: string;
  alamat_wilayah?: string;
  tanda_tangan?: string;
}