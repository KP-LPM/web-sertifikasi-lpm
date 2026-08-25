// ============================================================================
// COMBINED TYPES & INTERFACES (Admin, Assessor, Asesi)
// ============================================================================

// ----------------------------------------------------------------------------
// 1. ADMIN TYPES & INTERFACES
// ----------------------------------------------------------------------------

export interface ManagedUser {
  id: string;
  initial: string;
  name: string;
  email: string;
  role: string;
  status: "Aktif" | "Terverifikasi" | "Nonaktif" | "Menunggu Verifikasi";
  nipNim?: string;
  tempPassword?: string;
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

export interface UserItem {
  id: string;
  initial: string;
  name: string;
  email: string;
  role: string;
  status: string;
  verificationData?: UserVerificationData;
}

export interface AsesiPlenoRecord {
  id: string;
  asesiName: string;
  nimNik: string;
  scheme: string;
  certificateNo: string;
  issueDate: string;
  gdriveUrl: string;
  status: "Terbit" | "Belum Upload";
  notes?: string;
}

export interface PlenoGroupRecord {
  plenoId: string;
  plenoTitle: string;
  skemaList: string[];
  tanggal: string;
  waktu: string;
  lokasi: string;
  isOnline: boolean;
  status: string;
  asesiList: AsesiPlenoRecord[];
}

export interface AsesiPlenoItem {
  id: string;
  nim: string;
  nama: string;
  skema: string;
  asesor: string;
  rekomendasiAsesor: "K" | "BK" | string;
  statusPleno: "K" | "BK" | string;
  catatan?: string;
}

export interface PlenoAttendee {
  role: string;
  nama: string;
}

export interface PlenoDetailData {
  id: string;
  batchCode?: string;
  title?: string;
  skema: string;
  noSK?: string;
  pimpinanSidang?: string;
  notulis?: string;
  tanggal: string;
  waktu: string;
  lokasi: string;
  detailLokasi?: string;
  suratPlenoUrl?: string;
  linkSuratHasil?: string;
  linkSuratBeritaPleno?: string;
  linkSuratKeputusanDirektur?: string;
  linkSuratBlankoBNSP?: string;
  status: "Draft" | "Belum Ditetapkan" | "Selesai" | string;
  asesiList?: (AsesiPlenoItem | string | number)[];
  plenoAttendees?: PlenoAttendee[];
  deskripsi?: string;
  suratPlenoName?: string;
  jumlahAsesi?: number;
}

export type PlenoSession = PlenoDetailData;
export type TukDetailItem = TukItem;

export interface PersyaratanDasar {
  id?: string;
  nama_dokumen: string;
  deskripsi?: string;
  urutan?: number;
  is_wajib?: boolean;
}

export interface ElemenKompetensiItem {
  id?: string;
  nama_elemen: string;
  kriteria_unjuk_kerja: string[];
  urutan: number;
  is_wajib: boolean;
}

export interface UnitKompetensiItem {
  id?: string;
  kode_unit: string;
  judul_unit: string;
  urutan: number;
  elemen: ElemenKompetensiItem[];
}

export interface MasterSkemaFormState {
  kode_skema: string;
  nama_skema: string;
  nomor_sertifikat?: string;
  nomor_registrasi?: string;
  status_aktif: boolean;
  persyaratan_dasar: PersyaratanDasar[];
  persyaratan_administrasi: PersyaratanDasar[];
  unit_kompetensi: UnitKompetensiItem[];
  konfigurasi_soal_id?: string;
}

export interface MasterSkemaElemenPayload {
  nama_elemen: string;
  kriteria_unjuk_kerja?: string | string[];
  kuk?: string[];
  urutan?: number;
  is_wajib?: boolean;
}

export interface MasterSkemaUnitPayload {
  kode_unit: string;
  judul_unit: string;
  jenis_unit?: string;
  urutan?: number;
  elemen?: MasterSkemaElemenPayload[];
}

export interface MasterSkemaPayload {
  id?: string;
  kode_skema: string;
  nama_skema: string;
  nomor_sertifikat?: string;
  nomor_registrasi?: string;
  status_aktif: boolean;
  persyaratan_dasar?: Array<{
    nama_dokumen: string;
    deskripsi?: string;
    urutan?: number;
    is_wajib?: boolean;
  }>;
  persyaratan_administrasi?: Array<{
    nama_dokumen: string;
    deskripsi?: string;
    urutan?: number;
    is_wajib?: boolean;
  }>;
  unit_kompetensi?: MasterSkemaUnitPayload[];
  konfigurasi_soal_id?: string;
}

export interface ScheduleItem {
  id: string | number;
  batchCode?: string;
  batchName?: string;
  nomorSurat?: string;
  title?: string;
  skema?: string;
  scheme?: string;
  method?: string;
  metode?: string;
  date: string;
  startTime?: string;
  endTime?: string;
  jam?: string;
  tuk: string;
  tukType?: string;
  alamat?: string;
  candidatesCount?: number;
  assessorName?: string;
  assessorInitial?: string;
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
  code?: string;
  name?: string;
  nama?: string;
  type?: "Sewaktu" | "Mandiri" | "Terverifikasi" | string;
  jenis?: string;
  address?: string;
  alamat?: string;
  capacity?: number;
  kapasitas?: number;
  picName?: string;
  picPhone?: string;
  penanggungJawab?: string;
  status: "Aktif" | "Nonaktif" | string;
  keterangan?: string;
  inventaris?: TukInventarisItem[];
}

export interface SchemeElemen {
  title?: string;
  nama?: string;
  kuk: string[];
}

export interface SchemeUnit {
  unitCode?: string;
  kode?: string;
  unitTitle?: string;
  judul?: string;
  unitDesc?: string;
  jenis?: string;
  elemen?: SchemeElemen[];
}

export interface SchemeItem {
  id: string;
  code: string;
  name: string;
  category: string;
  level?: string;
  unitsCount?: number;
  applicantsCount?: number;
  status: "Active" | "Aktif" | "Draft" | "Archived" | "Nonaktif" | string;
  nomor_sertifikat?: string;
  nomor_registrasi?: string;
  deskripsi?: string;
  persyaratan?: string[];
  unitKompetensi?: SchemeUnit[];
  units?: SchemeUnit[];
  persyaratan_dasar?: Array<{
    nama_dokumen: string;
    deskripsi?: string;
    urutan?: number;
    is_wajib?: boolean;
  }>;
  persyaratan_administrasi?: Array<{
    nama_dokumen: string;
    deskripsi?: string;
    urutan?: number;
    is_wajib?: boolean;
  }>;
}

export interface AdminScheme extends SchemeItem {
  applicantsCount?: number;
}

export interface RequirementItem {
  nama_dokumen?: string;
  deskripsi?: string;
  urutan?: number;
  is_wajib?: boolean;
  [key: string]: unknown;
}

export type RequirementType = string | RequirementItem;

export interface SchemeDetailInfo {
  id?: string;
  name?: string;
  code?: string;
  units?: SchemeUnit[];
  persyaratanDasar?: RequirementType[];
  buktiAdministratif?: RequirementType[];
  buktiKompetensi?: RequirementType[];
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
  persyaratanDasar?: RequirementType[] | unknown;
  buktiAdministratif?: RequirementType[] | unknown;
  buktiKompetensi?: RequirementType[] | unknown;
  schemeDetail?: SchemeDetailInfo;
  checklist?: Record<string, "memenuhi" | "tidak_memenuhi" | boolean>;
  readOnly?: boolean;
  [key: string]: unknown;
}

export interface Apl02FormData {
  isAdmin?: boolean;
  rekomendasiApl02?: string;
  ttdAsesor?: string | null | Record<string, null> | unknown;
  ttdAsesi?: string | null | Record<string, null> | unknown;
  asesorName?: string;
  asesorReg?: string;
  penyusun?: string | PenyusunValidatorItem[] | unknown;
  validator?: string | PenyusunValidatorItem[] | unknown;
  kompetensi?: Record<string, "K" | "BK" | string>;
  namaLengkap?: string;
  skema?: string;
  nomorSkema?: string;
  tuk?: string;
  tanggal?: string;
  schemeDetail?: SchemeDetailInfo;
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
  code: string;
  name: string;
  skema: string;
  asesor: string;
  tuk: string;
  jenis: "Offline" | "Online" | string;
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
// 2. ASSESSOR TYPES & INTERFACES
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
  nim: string;
  nik?: string;
  nama: string;
  skema: string;
  status?: string;
  email?: string;
  jenis_asesmen?: string;
  metode_pelaksanaan?: string;
  tglAsesmen?: string;
  waktu?: string;
  tuk?: string;
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
  batchCode: string;
  batchName: string;
  skema: string;
  jenis_asesmen: string;
  tglAsesmen: string;
  waktu: string;
  tuk: string;
  linkVideo: string;
  candidates: Candidate[];
}

export interface ConfigurationMetadata {
  namaKonfigurasi: string;
  skemaSertifikasi: string;
  versi: string;
  penyusun: Array<{ value: string; label: string }>;
  validator: Array<{ value: string; label: string }>;
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
  nim: string;
  nama: string;
  skema: string;
  tglAsesmen: string;
  waktu: string;
  tuk: string;
  hasil: "Kompeten" | "Belum Kompeten" | "Belum Dinilai" | string;
  status?: string;
  asesor?: string;
  jenis_asesmen?: string;
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
  tuk: string;
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
  tuk: string;
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

export interface Submission {
  id: string;
  name: string;
  code: string;
  date: string;
  status: string;
  noHp?: string;
  telepon?: string;
  units?: SchemeUnit[] | unknown;
  penyesuaianWajar?: boolean;
  namaLengkap?: string;
  tempatLahir?: string;
  tanggalLahir?: string;
  jenisKelamin?: string;
  alamat?: string;
  provinsi?: string;
  kota?: string;
  nik?: string;
  kebangsaan?: string;
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
  tuk?: string;
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
  name?: string;
  description?: string;
  type?: string;
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
