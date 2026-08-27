"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Save,
  X,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/context";
import {
  FormFRAPL02,
  FormFRAK07,
  FormFRIA04A,
  FormFRIA04B,
  FormFRIA07,
} from "@/components/forms";
import { AssessmentItem } from "@/types/types";
import { AVAILABLE_SCHEMES } from "@/data/schemes";

type SignatureCanvasRef = {
  clear: () => void;
  fromDataURL: (dataURL: string) => void;
  toDataURL: () => string;
  isEmpty: () => boolean;
};

type SchemeWithUnits = {
  units?: Array<{
    kodeUnit?: string;
    judulUnit?: string;
    elemen?: Array<unknown>;
    [key: string]: unknown;
  }>;
};

type SignatureCanvasProps = {
  canvasProps?: React.CanvasHTMLAttributes<HTMLCanvasElement>;
  backgroundColor?: string;
};

const SignatureCanvas = dynamic(() => import("react-signature-canvas"), {
  ssr: false,
}) as React.ForwardRefExoticComponent<
  SignatureCanvasProps & React.RefAttributes<SignatureCanvasRef>
>;

export default function AssessmentForm() {
  const router = useRouter();
  const { selectedAsesmen, updateAssessmentItem } = useAppContext();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [asesiSignatureApl02, setAsesiSignatureApl02] = useState<string>("");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep]);

  // Data Asesmen
  const asesmenData = {
    nama: String(selectedAsesmen?.nama || "Kandidat Default"),
    skema: String(selectedAsesmen?.skema || "Teknisi Muda Jaringan Komputer"),
    noSkema: "04/SKM/LSP P1 UIN SGD/V/2022",
    tuk: String(selectedAsesmen?.tipeTuk || ""),
    metodeAsesmen: String(selectedAsesmen?.metode),
    tanggal: "11 Oktober 2024",
    asesor: "Ichsan Taufik",
  } as unknown as AssessmentItem;
  // Step 1: Form FR.APL.02 State
  const [rekomendasiApl02, setRekomendasiApl02] = useState<
    "Dapat dilanjutkan" | "Tidak dapat dilanjutkan" | ""
  >("Dapat dilanjutkan");
  const [asesorSignatureApl02, setAsesorSignatureApl02] = useState("");
  const [answersApl02, setAnswersApl02] = useState<Record<string, "K" | "BK">>({
    u0e0: "K",
    u0e1: "K",
    u1e0: "K",
  });

  // AK.07 Form State
  const [acuanPembanding, setAcuanPembanding] = useState("");
  const [metodeAsesmen, setMetodeAsesmen] = useState("");
  const [instrumenAsesmen, setInstrumenAsesmen] = useState("");
  const [asesorName, setAsesorName] = useState(asesmenData.asesor);
  const [asesorSignature, setAsesorSignature] = useState("");
  const [asesiName, setAsesiName] = useState(asesmenData.nama);
  const [asesiSignature, setAsesiSignature] = useState("");
  const [asesorDate, setAsesorDate] = useState("");
  const [asesiDate, setAsesiDate] = useState("");

  // Signature Modals
  const [isAsesorSigOpen, setIsAsesorSigOpen] = useState(false);
  const [isAsesiSigOpen, setIsAsesiSigOpen] = useState(false);
  const asesorSigRef = React.useRef<SignatureCanvasRef>(null);
  const asesiSigRef = React.useRef<SignatureCanvasRef>(null);
  const asesorFileRef = React.useRef<HTMLInputElement | null>(null);
  const asesiFileRef = React.useRef<HTMLInputElement | null>(null);

  const handleAsesorFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (asesorSigRef.current && result) {
          asesorSigRef.current.fromDataURL(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAsesiFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (asesiSigRef.current && result) {
          asesiSigRef.current.fromDataURL(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const saveAsesorSig = () => {
    if (asesorSigRef.current && !asesorSigRef.current.isEmpty()) {
      setAsesorSignature(asesorSigRef.current.toDataURL());
      setIsAsesorSigOpen(false);
    }
  };

  const saveAsesiSig = () => {
    if (asesiSigRef.current && !asesiSigRef.current.isEmpty()) {
      setAsesiSignature(asesiSigRef.current.toDataURL());
      setIsAsesiSigOpen(false);
    }
  };

  // Step 2 State
  const [umpanBalikStep2, setUmpanBalikStep2] = useState("");

  const [asesiSignatureStep2, setAsesiSignatureStep2] = useState("");
  const [asesorSignatureStep2, setAsesorSignatureStep2] = useState("");
  const [supervisorNameStep2, setSupervisorNameStep2] = useState("");
  const [supervisorSignatureStep2, setSupervisorSignatureStep2] = useState("");

  const [penyusun, setPenyusun] = useState([
    { nama: asesmenData.asesor, noMet: "", ttdTanggal: asesmenData.tglAsesmen },
    { nama: "", noMet: "", ttdTanggal: "" },
  ]);
  const [validator, setValidator] = useState([
    { nama: "", noMet: "", ttdTanggal: "" },
    { nama: "", noMet: "", ttdTanggal: "" },
  ]);

  const [isAsesiStep2SigOpen, setIsAsesiStep2SigOpen] = useState(false);
  const [isAsesorStep2SigOpen, setIsAsesorStep2SigOpen] = useState(false);
  const [isSupervisorSigOpen, setIsSupervisorSigOpen] = useState(false);

  const asesiStep2SigRef = React.useRef<SignatureCanvasRef>(null);
  const asesorStep2SigRef = React.useRef<SignatureCanvasRef>(null);
  const supervisorSigRef = React.useRef<SignatureCanvasRef>(null);
  const asesiStep2FileRef = React.useRef<HTMLInputElement | null>(null);
  const asesorStep2FileRef = React.useRef<HTMLInputElement | null>(null);
  const supervisorFileRef = React.useRef<HTMLInputElement | null>(null);

  const saveAsesiStep2Sig = () => {
    if (asesiStep2SigRef.current && !asesiStep2SigRef.current.isEmpty()) {
      setAsesiSignatureStep2(asesiStep2SigRef.current.toDataURL());
      setIsAsesiStep2SigOpen(false);
    }
  };
  const saveAsesorStep2Sig = () => {
    if (asesorStep2SigRef.current && !asesorStep2SigRef.current.isEmpty()) {
      setAsesorSignatureStep2(asesorStep2SigRef.current.toDataURL());
      setIsAsesorStep2SigOpen(false);
    }
  };
  const saveSupervisorSig = () => {
    if (supervisorSigRef.current && !supervisorSigRef.current.isEmpty()) {
      setSupervisorSignatureStep2(supervisorSigRef.current.toDataURL());
      setIsSupervisorSigOpen(false);
    }
  };

  const handleAsesiStep2FileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (asesiStep2SigRef.current && result)
          asesiStep2SigRef.current.fromDataURL(result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleAsesorStep2FileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (asesorStep2SigRef.current && result)
          asesorStep2SigRef.current.fromDataURL(result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSupervisorFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (supervisorSigRef.current && result)
          supervisorSigRef.current.fromDataURL(result);
      };
      reader.readAsDataURL(file);
    }
  };

  React.useEffect(() => {
    if (
      isAsesiStep2SigOpen &&
      asesiSignatureStep2 &&
      asesiStep2SigRef.current
    ) {
      setTimeout(
        () => asesiStep2SigRef.current?.fromDataURL(asesiSignatureStep2),
        50,
      );
    }
  }, [isAsesiStep2SigOpen, asesiSignatureStep2]);

  React.useEffect(() => {
    if (
      isAsesorStep2SigOpen &&
      asesorSignatureStep2 &&
      asesorStep2SigRef.current
    ) {
      setTimeout(
        () => asesorStep2SigRef.current?.fromDataURL(asesorSignatureStep2),
        50,
      );
    }
  }, [isAsesorStep2SigOpen, asesorSignatureStep2]);

  React.useEffect(() => {
    if (
      isSupervisorSigOpen &&
      supervisorSignatureStep2 &&
      supervisorSigRef.current
    ) {
      setTimeout(
        () => supervisorSigRef.current?.fromDataURL(supervisorSignatureStep2),
        50,
      );
    }
  }, [isSupervisorSigOpen, supervisorSignatureStep2]);

  // Step 3 State
  const [rekomendasiStep3, setRekomendasiStep3] = useState("");

  const [asesiNameStep3, setAsesiNameStep3] = useState(asesmenData.nama);
  const [asesiSignatureStep3, setAsesiSignatureStep3] = useState("");
  const [asesiDateStep3, setAsesiDateStep3] = useState("");

  const [asesorNameStep3, setAsesorNameStep3] = useState(asesmenData.asesor);
  const [asesorRegStep3, setAsesorRegStep3] = useState("");
  const [asesorSignatureStep3, setAsesorSignatureStep3] = useState("");
  const [asesorDateStep3, setAsesorDateStep3] = useState("");

  const [penyusunStep3, setPenyusunStep3] = useState([
    { nama: asesmenData.asesor, noMet: "", ttdTanggal: asesmenData.tglAsesmen },
    { nama: "", noMet: "", ttdTanggal: "" },
  ]);
  const [validatorStep3, setValidatorStep3] = useState([
    { nama: "", noMet: "", ttdTanggal: "" },
    { nama: "", noMet: "", ttdTanggal: "" },
  ]);

  const [isAsesiStep3SigOpen, setIsAsesiStep3SigOpen] = useState(false);
  const [isAsesorStep3SigOpen, setIsAsesorStep3SigOpen] = useState(false);

  const asesiStep3SigRef = React.useRef<SignatureCanvasRef>(null);
  const asesorStep3SigRef = React.useRef<SignatureCanvasRef>(null);
  const asesiStep3FileRef = React.useRef<HTMLInputElement | null>(null);
  const asesorStep3FileRef = React.useRef<HTMLInputElement | null>(null);

  const saveAsesiStep3Sig = () => {
    if (asesiStep3SigRef.current && !asesiStep3SigRef.current.isEmpty()) {
      setAsesiSignatureStep3(asesiStep3SigRef.current.toDataURL());
      setIsAsesiStep3SigOpen(false);
    }
  };
  const saveAsesorStep3Sig = () => {
    if (asesorStep3SigRef.current && !asesorStep3SigRef.current.isEmpty()) {
      setAsesorSignatureStep3(asesorStep3SigRef.current.toDataURL());
      setIsAsesorStep3SigOpen(false);
    }
  };

  const handleAsesiStep3FileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (asesiStep3SigRef.current && typeof result === "string") {
          asesiStep3SigRef.current.fromDataURL(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAsesorStep3FileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (asesorStep3SigRef.current && typeof result === "string") {
          asesorStep3SigRef.current.fromDataURL(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  React.useEffect(() => {
    if (
      isAsesiStep3SigOpen &&
      asesiSignatureStep3 &&
      asesiStep3SigRef.current
    ) {
      setTimeout(
        () => asesiStep3SigRef.current?.fromDataURL(asesiSignatureStep3),
        50,
      );
    }
  }, [isAsesiStep3SigOpen, asesiSignatureStep3]);

  React.useEffect(() => {
    if (
      isAsesorStep3SigOpen &&
      asesorSignatureStep3 &&
      asesorStep3SigRef.current
    ) {
      setTimeout(
        () => asesorStep3SigRef.current?.fromDataURL(asesorSignatureStep3),
        50,
      );
    }
  }, [isAsesorStep3SigOpen, asesorSignatureStep3]);

  // State Step 1
  const [potensiAsesi, setPotensiAsesi] = useState<string[]>([
    "Hasil pelatihan dan / atau pendidikan, dimana Kurikulum dan fasilitas praktek mampu telusur terhadap standar kompetensi",
  ]);
  const [noAdjustment, setNoAdjustment] = useState(false);
  const adjustmentOptions = [
    {
      id: "adj1",
      label:
        "Keterbatasan asesi terhadap persyaratan bahasa, literasi, numerasi",
      options: [
        "Memerlukan dukungan pembaca, penerjemah, pelayan, penulis. untuk merekam jawaban asesi.",
        "Melakukan asesmen verbal (gunakan pertanyaan lisan/pertanyaan wawancara) dengan dilengkapi gambar diagram dan bentuk-bentuk visual.",
        "Menggunakan Hasil produksi",
        "Menggunakan Ceklis observasi/demonstrasi.",
        "Menggunakan daftar instruksi terstruktur.",
      ],
    },
    {
      id: "adj2",
      label: "Penyediaan dukungan pembaca, penerjemah, pelayan, penulis",
      options: [
        "Menggunakan pertanyaan lisan dengan dilengkapi gambar diagram dan bentuk-bentuk visual.",
      ],
    },
    {
      id: "adj3",
      label: "Penggunaan teknologi adaptif atau peralatan khusus",
      options: [
        "Ceklis observasi/demonstrasi Demonstrasi.",
        "Pertanyaan lisan",
        "Pertanyaan tertulis.",
        "Pertanyaan wawancara.",
        "Daftar instruksi terstruktur.",
        "Ceklis verifikasi portofolio.",
        "Menggunakan dukungan operator komputer.",
      ],
    },
    {
      id: "adj4",
      label:
        "Pelaksanaan asesmen secara fleksibel karena alasan keletihan atau keperluan pengobatan",
      options: [
        "Menggunakan juru tulis.",
        "Menggunakan kamaramen perekam vidio/ataudio.",
        "Memperbolehkan periode waktu yang lebih panjang untuk menyelesaikan tugas pekerjaan dalam asesmen.",
        "Melakukan tugas pekerjaan dalam asesmen dengan waktu lebih pendek.",
        "Menggunakan instruksi-instruksi spesifik pada proyek yang dapat dilakukan pada berbagai tingkatan.",
      ],
    },
    {
      id: "adj5",
      label: "Penyediaan peralatan asesmen berupa braille, audio/video-tape",
      options: [
        "Menggunakan pertanyaan lisan.",
        "Menggunakan pertanyaan wawancara.",
      ],
    },
    {
      id: "adj6",
      label: "Penyesuaian tempat fisik/lingkungan asesmen",
      options: [
        "Pertanyaan lisan.",
        "Pertanyaan tulis.",
        "Pertanyaan wawancara.",
        "Ceklis Verifikasi portofolio.",
        "Ceklis reviu produk.",
        "Daftar instruksi terstruktur.",
      ],
    },
    {
      id: "adj7",
      label: "Pertimbangan umur/usia lanjut/gender asesi",
      options: [
        "Menggunakan studi kasus/daftar instruksi terstrukut",
        "Menggunakan instrumen asesmen dengan huruf normal jangan terlalu kecil.",
        "Menggunakan asesor dengan jenis kelamin yang sama dengan asesi.",
        "Menggunakan instrumen asesmen yang sama walaupun berbeda jenis kelamain (tidak boleh memberi tanda tambahan pada instrumen asesmen yang digunakan dengan tujuan untuk membedakan jenis kelamin).",
      ],
    },
    {
      id: "adj8",
      label: "Pertimbangan budaya/tradisi/agama",
      options: [
        "Menggunakan studi kasus daftar instruksi terstrukut",
        "Menggunakan asesor tanpa pertimbangan budaya/tradisi/agama.",
        "Menggunakan instrumen asesmen yang sama walaupun berbeda budaya/tradisi/agama).",
      ],
    },
  ];

  const [adjustments, setAdjustments] = useState<
    Record<
      string,
      { required: boolean | null; note: string; selectedOptions: string[] }
    >
  >({});

  const handleAdjChange = (
    id: string,
    field: "required" | "note" | "selectedOptions",
    value: boolean | string | string[] | null,
  ) => {
    setAdjustments((prev) => ({
      ...prev,
      [id]: {
        required: prev[id]?.required ?? null,
        note: prev[id]?.note || "",
        selectedOptions: prev[id]?.selectedOptions || [],
        [field]: value,
      },
    }));
  };

  // State Step 3 (IA.04B)
  const step3Questions = [
    {
      id: "s3_q1",
      skenario:
        "Selama proyek perencanaan jaringan, Anda menemui masalah yang tidak terduga di mana router saat ini tidak kompatibel dengan sistem VoIP yang baru.",
      pertanyaan:
        "Bagaimana Anda akan mendokumentasikan masalah ini dan mengusulkan solusi dalam laporan survei Anda?",
      elemen: "E1/KUK 1.3; E2/KUK 2.1",
    },
    {
      id: "s3_q2",
      skenario:
        "Setelah mengumpulkan data dari survei, Anda perlu merangkum hasilnya dan menyajikannya kepada manajemen.",
      pertanyaan:
        "Bagaimana Anda akan membuat tabel untuk merangkum hasil survei? Deskripsikan struktur tabel dan informasi utama yang harus dimasukkan.",
      elemen: "-",
    },
    {
      id: "s3_q3",
      skenario:
        "Saat melakukan inventarisasi perangkat jaringan yang ada, Anda menemukan bahwa beberapa perangkat sudah usang dan sering mengalami kegagalan.",
      pertanyaan:
        "Bagaimana Anda akan mendokumentasikan masalah ini dan mengusulkan solusi dalam daftar perangkat jaringan yang ada beserta kinerjanya?",
      elemen: "E1/KUK 1.1; E2/KUK 2.2",
    },
    {
      id: "s3_q4",
      skenario:
        "Setelah mengidentifikasi teknologi baru, Anda perlu menyusun daftar perangkat jaringan yang ada beserta kinerjanya dan menentukan teknologi yang berpotensi meningkatkan kinerja jaringan.",
      pertanyaan:
        "Bagaimana Anda akan menyusun daftar perangkat jaringan yang ada beserta kinerjanya dan menentukan teknologi baru yang akan digunakan? Deskripsikan langkah-langkah dan struktur tabel yang akan Anda buat.",
      elemen: "-",
    },
    {
      id: "s3_q5",
      skenario:
        "Saat menghitung kapasitas jaringan berdasarkan kebutuhan bisnis, Anda menyadari bahwa jumlah perangkat dan volume data yang diantisipasi untuk tahun depan jauh melebihi kapasitas jaringan yang telah direncanakan.",
      pertanyaan:
        "Bagaimana Anda akan mendokumentasikan masalah ini dan mengusulkan solusi untuk memastikan kapasitas jaringan mencukupi kebutuhan bisnis yang berkembang?",
      elemen: "E1/KUK 1.2; E2/KUK 2.2",
    },
    {
      id: "s3_q6",
      skenario:
        "Setelah melakukan analisis, Anda perlu merangkum hasil perhitungan kapasitas jaringan dan topologi yang dipilih dalam sebuah dokumen untuk dipresentasikan kepada manajemen.",
      pertanyaan:
        "Bagaimana Anda akan menyusun dokumen yang merangkum perhitungan kapasitas jaringan dan topologi yang dipilih? Deskripsikan langkah-langkah dan struktur tabel yang akan Anda buat.",
      elemen: "-",
    },
    {
      id: "s3_q7",
      skenario:
        "Anda diharuskan bekerja dengan tim IT untuk memberikan alamat jaringan ke semua perangkat yang baru ditambahkan ke jaringan.",
      pertanyaan:
        "Bagaimana Anda akan berkolaborasi dengan tim IT untuk memastikan semua node atau perangkat jaringan diberi alamat jaringan yang tepat? Jelaskan langkah-langkah yang akan Anda ambil.",
      elemen: "E2/KUK 2.3; E3/KUK 3.2",
    },
    {
      id: "s3_q8",
      skenario:
        "Setelah memberikan alamat jaringan kepada semua perangkat, Anda perlu membuat dokumentasi pengalamatan jaringan yang jelas dan terperinci.",
      pertanyaan:
        "Bagaimana Anda akan membuat dokumentasi pengalamatan jaringan? Deskripsikan langkah-langkah dan struktur tabel yang akan Anda buat.",
      elemen: "-",
    },
    {
      id: "s3_q9",
      skenario:
        "Saat menyusun daftar perangkat jaringan dari berbagai vendor yang dapat memenuhi kebutuhan, Anda menemukan bahwa beberapa perangkat yang sesuai tidak tersedia atau sulit didapat di pasaran.",
      pertanyaan:
        "Bagaimana Anda akan mendokumentasikan masalah ini dan mengusulkan solusi untuk memastikan ketersediaan perangkat jaringan yang diperlukan?",
      elemen: "E2/KUK 2.1; E2/KUK 2.2",
    },
    {
      id: "s3_q10",
      skenario:
        "Setelah membuat daftar perangkat jaringan, Anda perlu menuliskan rentang kapasitas yang mencakup perangkat jaringan yang ada di pasaran untuk referensi tim.",
      pertanyaan:
        "Bagaimana Anda akan menuliskan rentang kapasitas perangkat jaringan yang ada di pasaran? Deskripsikan langkah-langkah dan struktur tabel yang akan Anda buat.",
      elemen: "-",
    },
  ];
  const [step3Answers, setStep3Answers] = useState<
    Record<string, { answer: string; achievement: boolean | null }>
  >({});

  const handleStep3Change = (
    id: string,
    field: "answer" | "achievement",
    value: boolean | string | null,
  ) => {
    setStep3Answers((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  // State Step 4 (IA.07)
  const step4Questions = [
    {
      id: "s4_q1",
      pertanyaan:
        "Mengapa penting untuk merancang dokumen survei teknis mencakup semua informasi yang diperlukan?",
      elemen: "J.611000.001.01 E1/KUK 1.3; E2/KUK 2.1",
      kunci:
        "Merancang dokumen survei teknis dengan detail penting untuk mendukung perencanaan dan pengembangan jaringan yang efektif serta meminimalisir risiko dan kesalahan",
    },
    {
      id: "s4_q2",
      pertanyaan:
        "Bagaimana cara memastikan tabel hasil survei teknis mudah dipahami dan digunakan?",
      elemen: "-",
      kunci:
        "Memastikan tabel hasil survei teknis mudah dipahami dan digunakan dapat dilakukan dengan menggunakan format yang konsisten, menambahkan penjelasan atau catatan kaki jika perlu, dan melakukan review dengan tim.",
    },
    {
      id: "s4_q3",
      pertanyaan:
        "Mengapa penting untuk menyusun daftar teknologi yang saat ini digunakan dalam jaringan?",
      elemen: "J.611000.002.01 E1/KUK 1.1; E2/KUK 2.2",
      kunci:
        "Menyusun daftar teknologi yang saat ini digunakan penting untuk memahami infrastruktur jaringan, membantu dalam perencanaan peningkatan, dan memudahkan pemecahan masalah.",
    },
    {
      id: "s4_q4",
      pertanyaan:
        "Bagaimana cara menentukan teknologi mana yang dapat meningkatkan kinerja jaringan?",
      elemen: "-",
      kunci:
        "Menentukan teknologi yang dapat meningkatkan kinerja jaringan dilakukan dengan menilai kebutuhan jaringan saat ini, melakukan benchmark terhadap performa saat ini, dan membandingkan spesifikasi teknologi baru.",
    },
    {
      id: "s4_q5",
      pertanyaan:
        "Bagaimana cara menentukan jarak optimal untuk penempatan perangkat jaringan?",
      elemen: "J.611000.003.02 E2/KUK 2.2",
      kunci:
        "Menentukan jarak optimal dilakukan dengan survei lokasi untuk mengukur kekuatan sinyal di berbagai titik dan menyesuaikan penempatan perangkat agar sinyal tetap kuat dan stabil di seluruh area yang dicakup.",
    },
    {
      id: "s4_q6",
      pertanyaan:
        "Mengapa penting mempertimbangkan jumlah pengguna dalam penempatan perangkat jaringan?",
      elemen: "-",
      kunci:
        "Pertimbangan jumlah pengguna penting karena akan mempengaruhi distribusi bandwidth dan memastikan bahwa setiap pengguna memiliki akses yang memadai tanpa terjadinya kemacetan jaringan.",
    },
    {
      id: "s4_q7",
      pertanyaan:
        "Bagaimana cara menentukan alamat IP yang tepat untuk setiap perangkat?",
      elemen: "J.611000.004.01 E2/KUK 2.3; E3/KUK 3.2",
      kunci:
        "Menentukan alamat IP yang tepat untuk setiap perangkat dilakukan dengan mempertimbangkan skema subnetting, jumlah perangkat, dan kebutuhan spesifik jaringan.",
    },
    {
      id: "s4_q8",
      pertanyaan:
        "Apa saja komponen yang harus ada dalam dokumentasi pengalamatan jaringan dan bagaimana cara membuat dokumentasi pengalamatan jaringan yang efektif?",
      elemen: "-",
      kunci:
        "Komponen yang harus ada dalam dokumentasi pengalamatan jaringan meliputi: daftar perangkat dengan alamat IP, rentang subnet, skema DHCP, dan catatan perubahan alamat IP. Membuat dokumentasi pengalamatan jaringan yang efektif dilakukan dengan menggunakan format standar, menyimpan informasi dalam format terorganisir (misalnya, spreadsheet), dan memperbarui secara berkala.",
    },
    {
      id: "s4_q9",
      pertanyaan:
        "Perangkat jaringan apa saja yang diperlukan untuk memenuhi kebutuhan pengguna dan vendor mana saja yang menyediakan perangkat jaringan tersebut?",
      elemen: "J.611000.005.02 E2/KUK 2.1; 2.2",
      kunci:
        "Perangkat jaringan yang diperlukan meliputi router, switch, access point, server, kabel jaringan, dan firewall. Beberapa vendor yang menyediakan perangkat jaringan berkualitas tinggi termasuk Cisco, Juniper, TP-Link, D-Link, dan Huawei.",
    },
    {
      id: "s4_q10",
      pertanyaan:
        "Bagaimana cara menentukan rentang kapasitas perangkat jaringan yang sesuai dengan kebutuhan pengguna dan berikan contoh perangkat jaringan beserta rentang kapasitasnya dari beberapa vendor?",
      elemen: "-",
      kunci:
        "Menentukan rentang kapasitas perangkat jaringan melibatkan analisis kebutuhan pengguna, perkiraan jumlah pengguna, volume data yang akan ditransfer, dan jenis aplikasi yang akan digunakan. Contoh perangkat jaringan dan rentang kapasitasnya: Router Cisco 2901: Mendukung hingga 25 pengguna, throughput 25 Mbps. Switch TP-Link TL-SG1024: 24 port gigabit, kecepatan transfer hingga 1 Gbps per port. Access Point Ubiquiti UniFi UAP-AC-PRO: Mendukung hingga 200 pengguna, kecepatan Wi-Fi hingga 1300 Mbps di 5 GHz.",
    },
  ];
  const [step4Answers, setStep4Answers] = useState<
    Record<string, { answer: string; achievement: boolean | null }>
  >({});
  const [umpanBalikStep4, setUmpanBalikStep4] = useState("");

  const [asesiNameStep4, setAsesiNameStep4] = useState(asesmenData.nama);
  const [asesiSignatureStep4, setAsesiSignatureStep4] = useState("");
  const [asesiDateStep4, setAsesiDateStep4] = useState("");

  const [asesorNameStep4, setAsesorNameStep4] = useState(asesmenData.asesor);
  const [asesorSignatureStep4, setAsesorSignatureStep4] = useState("");
  const [asesorDateStep4, setAsesorDateStep4] = useState("");

  const [isAsesiStep4SigOpen, setIsAsesiStep4SigOpen] = useState(false);
  const [isAsesorStep4SigOpen, setIsAsesorStep4SigOpen] = useState(false);

  const asesiStep4SigRef = React.useRef<SignatureCanvasRef>(null);
  const asesiStep4FileRef = React.useRef<HTMLInputElement>(null);
  const asesorStep4SigRef = React.useRef<SignatureCanvasRef>(null);
  const asesorStep4FileRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (
      isAsesiStep4SigOpen &&
      asesiSignatureStep4 &&
      asesiStep4SigRef.current
    ) {
      setTimeout(
        () => asesiStep4SigRef.current?.fromDataURL(asesiSignatureStep4),
        50,
      );
    }
  }, [isAsesiStep4SigOpen, asesiSignatureStep4]);

  React.useEffect(() => {
    if (
      isAsesorStep4SigOpen &&
      asesorSignatureStep4 &&
      asesorStep4SigRef.current
    ) {
      setTimeout(
        () => asesorStep4SigRef.current?.fromDataURL(asesorSignatureStep4),
        50,
      );
    }
  }, [isAsesorStep4SigOpen, asesorSignatureStep4]);

  const handleAsesiStep4FileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (asesiStep4SigRef.current && event.target?.result) {
          asesiStep4SigRef.current.fromDataURL(event.target.result.toString());
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAsesorStep4FileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (asesorStep4SigRef.current && event.target?.result) {
          asesorStep4SigRef.current.fromDataURL(event.target.result.toString());
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const saveAsesiStep4Sig = () => {
    if (asesiStep4SigRef.current) {
      setAsesiSignatureStep4(asesiStep4SigRef.current.toDataURL());
      setIsAsesiStep4SigOpen(false);
    }
  };

  const saveAsesorStep4Sig = () => {
    if (asesorStep4SigRef.current) {
      setAsesorSignatureStep4(asesorStep4SigRef.current.toDataURL());
      setIsAsesorStep4SigOpen(false);
    }
  };

  const [penyusunStep4, setPenyusunStep4] = useState([
    { nama: asesmenData.asesor, noMet: "", ttdTanggal: asesmenData.tglAsesmen },
    { nama: "", noMet: "", ttdTanggal: "" },
  ]);
  const [validatorStep4, setValidatorStep4] = useState([
    { nama: "", noMet: "", ttdTanggal: "" },
    { nama: "", noMet: "", ttdTanggal: "" },
  ]);
  const [asesorRegStep4, setAsesorRegStep4] = useState("");

  const handleStep4Change = (
    id: string,
    field: "answer" | "achievement",
    value: boolean | string | null,
  ) => {
    setStep4Answers((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  // State Step 5
  const [finalDecision, setFinalDecision] = useState<
    "Kompeten" | "Belum Kompeten" | null
  >(null);
  const [catatanAsesor, setCatatanAsesor] = useState("");

  // Validation
  const isStep1Valid =
    (noAdjustment ||
      adjustmentOptions.every((opt) => {
        const adj = adjustments[opt.id];
        if (!adj || adj.required === undefined || adj.required === null)
          return false;
        if (adj.required === true && !adj.note?.trim()) return false;
        return true;
      })) &&
    !!String(asesorName || "").trim() &&
    !!String(asesiName || "").trim() &&
    !!asesorSignature &&
    !!asesiSignature &&
    !!String(asesorDate || "").trim() &&
    !!String(asesiDate || "").trim();
  const isStep2Valid =
    !!umpanBalikStep2?.trim() &&
    !!asesiSignatureStep2 &&
    !!asesorSignatureStep2;
  const isStep3Valid =
    step3Questions.every(
      (q) =>
        step3Answers[q.id]?.answer?.trim() &&
        step3Answers[q.id]?.achievement !== undefined &&
        step3Answers[q.id]?.achievement !== null,
    ) &&
    !!rekomendasiStep3?.trim() &&
    !!asesiSignatureStep3 &&
    !!asesorSignatureStep3;
  const isStep4Valid =
    step4Questions.every(
      (q) =>
        step4Answers[q.id]?.answer?.trim() &&
        step4Answers[q.id]?.achievement !== undefined &&
        step4Answers[q.id]?.achievement !== null,
    ) &&
    !!asesiSignatureStep4 &&
    !!asesorSignatureStep4;

  const handleSubmit = async () => {
    if (!finalDecision) return;
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);

    if (selectedAsesmen) {
      updateAssessmentItem(selectedAsesmen.id, {
        status: "Selesai",
        hasil: finalDecision,
      });
    }

    router.push("/assessor/candidates");
  };

  const renderHeader = (title: string, formCode: string) => (
    <div className="mb-8 border-b-2 border-slate-800 pb-4">
      <div className="flex justify-between items-start mb-4">
        <div className="min-w-0">
          <h1 className="font-serif text-xl font-bold text-slate-900">
            {formCode}
          </h1>
          <h2 className="font-serif text-lg font-bold text-slate-800 uppercase">
            {title}
          </h2>
        </div>
        <div className="text-right">
          <div className="font-serif text-2xl font-bold tracking-tighter text-slate-900">
            LSP
          </div>
          <div className="text-xs text-slate-500 font-sans">
            Lembaga Sertifikasi Profesi
          </div>
        </div>
      </div>
      <table className="w-full text-sm border-collapse border border-slate-300">
        <tbody>
          <tr>
            <td className="border border-slate-300 p-2 bg-white w-48 font-semibold">
              Skema Sertifikasi
            </td>
            <td className="border border-slate-300 p-2 font-bold">
              {asesmenData.skema}
            </td>
          </tr>
          <tr>
            <td className="border border-slate-300 p-2 bg-white font-semibold">
              Nomor Skema
            </td>
            <td className="border border-slate-300 p-2">
              {String(asesmenData.skema || "")}
            </td>
          </tr>
          <tr>
            <td className="border border-slate-300 p-2 bg-white font-semibold">
              Nama Asesi
            </td>
            <td className="border border-slate-300 p-2">{asesmenData.nama}</td>
          </tr>
          <tr>
            <td className="border border-slate-300 p-2 bg-white font-semibold">
              Nama Asesor
            </td>
            <td className="border border-slate-300 p-2">
              {String(asesmenData.asesor || "")}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  React.useEffect(() => {
    if (isAsesorSigOpen && asesorSignature && asesorSigRef.current) {
      setTimeout(() => asesorSigRef.current?.fromDataURL(asesorSignature), 50);
    }
  }, [isAsesorSigOpen, asesorSignature]);

  React.useEffect(() => {
    if (isAsesiSigOpen && asesiSignature && asesiSigRef.current) {
      setTimeout(() => asesiSigRef.current?.fromDataURL(asesiSignature), 50);
    }
  }, [isAsesiSigOpen, asesiSignature]);

  const [asesiDateApl02, setAsesiDateApl02] = useState<string>(
    String(asesmenData.tglAsesmen || ""),
  );

  const renderStep1 = () => {
    // 1. Simpan target nama skema ke variabel dengan fallback string kosong
    const targetSkemaName = (
      selectedAsesmen?.skema ||
      asesmenData?.skema ||
      ""
    ).toLowerCase();
    const targetSkemaCode = selectedAsesmen?.id || "";

    // 2. Pencarian skema yang aman dari error undefined
    const matchedSchemeApl02 =
      AVAILABLE_SCHEMES.find((s) => {
        const sName = (s.name || "").toLowerCase();
        const sCode = s.code || "";

        return (
          sName === targetSkemaName ||
          (targetSkemaCode && sCode === targetSkemaCode) ||
          (targetSkemaName && sName.includes(targetSkemaName)) ||
          (targetSkemaName && targetSkemaName.includes(sName))
        );
      }) || AVAILABLE_SCHEMES[0];

    // 3. Fallback unit list yang aman tanpa error 'Cannot find name'
    const unitsApl02: Array<{
      kodeUnit?: string;
      judulUnit?: string;
      elemen?: Array<unknown>;
      [key: string]: unknown;
    }> =
      (selectedAsesmen as { schemeDetail?: SchemeWithUnits } | undefined)
        ?.schemeDetail?.units ||
      (matchedSchemeApl02 as SchemeWithUnits | undefined)?.units ||
      [];
    // 4. Perulangan dengan tipe parameter yang jelas
    const allElementKeysApl02: string[] = [];
    unitsApl02.forEach((unit, idx: number) => {
      const elemenList = Array.isArray(unit.elemen) ? unit.elemen : [];
      elemenList.forEach((_, eIdx: number) => {
        allElementKeysApl02.push(`u${idx}e${eIdx}`);
      });
    });

    const totalElementsApl02 = allElementKeysApl02.length;
    const filledElementsCountApl02 = allElementKeysApl02.filter(
      (k) => answersApl02[k] === "K" || answersApl02[k] === "BK",
    ).length;
    const isAllKBKFilledApl02 =
      totalElementsApl02 > 0 && filledElementsCountApl02 === totalElementsApl02;

    return (
      <div className="space-y-6">
        <FormFRAPL02
          asesmenData={
            {
              nama: asesmenData.nama,
              skema: asesmenData.skema,
              tuk: asesmenData.tipeTuk,
              tanggal: asesmenData.tglAsesmen,
              asesor: asesmenData.asesor,
              asesorReg: "MET.000.001234 2021",
            } as unknown as AssessmentItem
          }
          answers={answersApl02}
          onAnswerChange={(key, val) =>
            setAnswersApl02((prev) => ({ ...prev, [key]: val }))
          }
          rekomendasi={rekomendasiApl02}
          onRekomendasiChange={setRekomendasiApl02}
          onFinishDirectly={() => {
            setFinalDecision("Belum Kompeten");
            setCurrentStep(6);
          }}
          asesiName={asesmenData.nama}
          asesiSignature={asesiSignatureApl02}
          onAsesiSignatureChange={setAsesiSignatureApl02}
          asesiDate={asesiDateApl02} // Hubungkan ke state
          onAsesiDateChange={setAsesiDateApl02} // Tambahkan fungsi handler
          asesorName={String(asesmenData.asesor || "")}
          asesorReg="MET.000.001234 2021"
          asesorSignature={asesorSignatureApl02}
          onAsesorSignatureChange={setAsesorSignatureApl02}
        />

        {rekomendasiApl02 !== "Tidak dapat dilanjutkan" && (
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
            <div>
              {!isAllKBKFilledApl02 ? (
                <div className="flex items-center gap-2 text-amber-700 bg-amber-50 px-3.5 py-2 rounded-xl border border-amber-200 text-xs sm:text-sm font-bold">
                  <AlertCircle size={18} className="shrink-0 text-amber-600" />
                  <span>
                    Status: {totalElementsApl02 - filledElementsCountApl02} dari{" "}
                    {totalElementsApl02} elemen K/BK belum dinilai.
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200 text-xs sm:text-sm font-bold">
                  <CheckCircle
                    size={18}
                    className="shrink-0 text-emerald-600"
                  />
                  <span>
                    Seluruh elemen K/BK telah dinilai (
                    {filledElementsCountApl02}/{totalElementsApl02}). Silakan
                    lanjut ke Step 2.
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={() => setCurrentStep(2)}
              disabled={!isAllKBKFilledApl02}
              title={
                !isAllKBKFilledApl02
                  ? "Semua status K/BK harus terisi terlebih dahulu"
                  : ""
              }
              className="bg-[#008BE3] hover:bg-[#0076C2] text-white px-6 py-2.5 font-bold text-sm rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              Lanjut ke Step 2 (AK.07) <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    );
  };
  const renderStep2 = () => (
    <FormFRAK07
      asesmenData={asesmenData}
      potensiAsesi={potensiAsesi}
      onPotensiAsesiChange={setPotensiAsesi}
      noAdjustment={noAdjustment}
      onNoAdjustmentChange={setNoAdjustment}
      adjustments={adjustments}
      onAdjustmentChange={handleAdjChange}
      acuanPembanding={acuanPembanding}
      onAcuanPembandingChange={setAcuanPembanding}
      metodeAsesmen={metodeAsesmen}
      onMetodeAsesmenChange={setMetodeAsesmen}
      instrumenAsesmen={instrumenAsesmen}
      onInstrumenAsesmenChange={setInstrumenAsesmen}
      asesorName={String(asesorName || "")}
      onAsesorNameChange={setAsesorName}
      asesorSignature={asesorSignature}
      onAsesorSignatureChange={setAsesorSignature}
      asesorDate={asesorDate}
      onAsesorDateChange={setAsesorDate}
      asesiName={asesiName}
      onAsesiNameChange={setAsesiName}
      asesiSignature={asesiSignature}
      onAsesiSignatureChange={setAsesiSignature}
      asesiDate={asesiDate}
      onAsesiDateChange={setAsesiDate}
      onPrev={() => setCurrentStep(1)}
      onNext={() => setCurrentStep(3)}
      isNextDisabled={!isStep1Valid}
    />
  );

  const renderStep3 = () => (
    <FormFRIA04A
      asesmenData={asesmenData}
      umpanBalik={umpanBalikStep2}
      onUmpanBalikChange={setUmpanBalikStep2}
      asesiSignature={asesiSignatureStep2}
      onAsesiSignatureChange={setAsesiSignatureStep2}
      asesorSignature={asesorSignatureStep2}
      onAsesorSignatureChange={setAsesorSignatureStep2}
      supervisorName={supervisorNameStep2}
      onSupervisorNameChange={setSupervisorNameStep2}
      supervisorSignature={supervisorSignatureStep2}
      onSupervisorSignatureChange={setSupervisorSignatureStep2}
      penyusun={
        penyusun as Array<{ nama: string; noMet: string; ttdTanggal: string }>
      }
      onPenyusunChange={setPenyusun}
      validator={validator}
      onValidatorChange={setValidator}
      onPrev={() => setCurrentStep(2)}
      onNext={() => setCurrentStep(4)}
      isNextDisabled={!isStep2Valid}
    />
  );

  const renderStep4 = () => (
    <FormFRIA04B
      asesmenData={asesmenData}
      step3Questions={step3Questions}
      step3Answers={step3Answers}
      onStep3Change={handleStep3Change}
      rekomendasiStep3={rekomendasiStep3}
      onRekomendasiStep3Change={setRekomendasiStep3}
      asesiNameStep3={asesiNameStep3}
      onAsesiNameStep3Change={setAsesiNameStep3}
      asesiSignatureStep3={asesiSignatureStep3}
      onAsesiSignatureStep3Change={setAsesiSignatureStep3}
      asesiDateStep3={asesiDateStep3}
      onAsesiDateStep3Change={setAsesiDateStep3}
      asesorNameStep3={String(asesorNameStep3 || "")}
      onAsesorNameStep3Change={setAsesorNameStep3}
      asesorRegStep3={asesorRegStep3}
      onAsesorRegStep3Change={setAsesorRegStep3}
      asesorSignatureStep3={asesorSignatureStep3}
      onAsesorSignatureStep3Change={setAsesorSignatureStep3}
      asesorDateStep3={asesorDateStep3}
      onAsesorDateStep3Change={setAsesorDateStep3}
      penyusunStep3={
        penyusunStep3 as Array<{
          nama: string;
          noMet: string;
          ttdTanggal: string;
        }>
      }
      onPenyusunStep3Change={setPenyusunStep3}
      validatorStep3={validatorStep3}
      onValidatorStep3Change={setValidatorStep3}
      onPrev={() => setCurrentStep(3)}
      onNext={() => setCurrentStep(5)}
      isNextDisabled={!isStep3Valid}
    />
  );

  const renderStep5 = () => (
    <FormFRIA07
      asesmenData={asesmenData}
      step4Questions={step4Questions}
      step4Answers={step4Answers}
      onStep4Change={handleStep4Change}
      umpanBalikStep4={umpanBalikStep4}
      onUmpanBalikStep4Change={setUmpanBalikStep4}
      asesiNameStep4={asesiNameStep4}
      onAsesiNameStep4Change={setAsesiNameStep4}
      asesiSignatureStep4={asesiSignatureStep4}
      onAsesiSignatureStep4Change={setAsesiSignatureStep4}
      asesiDateStep4={asesiDateStep4}
      onAsesiDateStep4Change={setAsesiDateStep4}
      asesorNameStep4={String(asesorNameStep4 || "")}
      onAsesorNameStep4Change={setAsesorNameStep4}
      asesorRegStep4={asesorRegStep4}
      onAsesorRegStep4Change={setAsesorRegStep4}
      asesorSignatureStep4={asesorSignatureStep4}
      onAsesorSignatureStep4Change={setAsesorSignatureStep4}
      asesorDateStep4={asesorDateStep4}
      onAsesorDateStep4Change={setAsesorDateStep4}
      penyusunStep4={
        penyusunStep4 as Array<{
          nama: string;
          noMet: string;
          ttdTanggal: string;
        }>
      }
      onPenyusunStep4Change={setPenyusunStep4}
      validatorStep4={validatorStep4}
      onValidatorStep4Change={setValidatorStep4}
      onPrev={() => setCurrentStep(4)}
      onNext={() => setCurrentStep(6)}
      isNextDisabled={!isStep4Valid}
    />
  );
  const renderStep6 = () => (
    <div className="animate-in fade-in duration-300">
      {renderHeader("RINGKASAN & FINALISASI", "REKAP")}

      <div className="space-y-6">
        <div className="border border-slate-300 p-4 sm:p-5 bg-white">
          <h3 className="font-bold text-sm uppercase tracking-wider mb-4 border-b border-slate-300 pb-2">
            Status Penilaian
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[320px]">
              <tbody>
                <tr>
                  <td className="py-2 text-slate-600">
                    FR.APL.02 - Verifikasi Berkas APL 02
                  </td>
                  <td className="py-2 text-right font-bold text-emerald-600 flex items-center justify-end gap-1">
                    <Check size={14} /> Terverifikasi
                  </td>
                </tr>
                <tr>
                  <td className="py-2 text-slate-600">
                    FR.AK.07 - Penyesuaian yang Wajar
                  </td>
                  <td className="py-2 text-right font-bold text-emerald-600 flex items-center justify-end gap-1">
                    <Check size={14} /> Selesai
                  </td>
                </tr>
                <tr>
                  <td className="py-2 text-slate-600">
                    FR.IA.04A - Penjelasan Proyek Singkat
                  </td>
                  <td className="py-2 text-right font-bold text-emerald-600 flex items-center justify-end gap-1">
                    <Check size={14} /> Selesai
                  </td>
                </tr>
                <tr>
                  <td className="py-2 text-slate-600">
                    FR.IA.04B - Penilaian Proyek Singkat
                  </td>
                  <td className="py-2 text-right font-bold text-emerald-600 flex items-center justify-end gap-1">
                    <Check size={14} /> {Object.keys(step3Answers).length} /{" "}
                    {step3Questions.length} Terjawab
                  </td>
                </tr>
                <tr>
                  <td className="py-2 text-slate-600">
                    FR.IA.07 - Pertanyaan Lisan
                  </td>
                  <td className="py-2 text-right font-bold text-emerald-600 flex items-center justify-end gap-1">
                    <Check size={14} /> {Object.keys(step4Answers).length} /{" "}
                    {step4Questions.length} Terjawab
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-200">
            <label className="block text-sm font-bold text-slate-800 mb-2">
              Catatan dari Asesor
            </label>
            <textarea
              rows={3}
              value={catatanAsesor}
              onChange={(e) => setCatatanAsesor(e.target.value)}
              placeholder="Tuliskan catatan dari asesor..."
              className="w-full p-3 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-slate-800 focus:outline-none bg-slate-50 focus:bg-white transition-colors"
            />
          </div>
        </div>

        <div className="border border-slate-300 p-4 sm:p-6">
          <h3 className="font-bold text-base text-center mb-6 uppercase">
            Hasil Penilaian
          </h3>
          <p className="text-sm text-slate-600 text-center mb-6">
            Asesi telah memenuhi/belum memenuhi pencapaian seluruh kriteria
            unjuk kerja, direkomendasikan:
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <label
              className={`flex items-center justify-center gap-3 p-3.5 sm:p-4 border-2 cursor-pointer transition-colors w-full sm:w-64 ${finalDecision === "Kompeten" ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-slate-300 hover:bg-slate-50"}`}
            >
              <input
                type="radio"
                name="decision"
                className="w-5 h-5 hidden"
                checked={finalDecision === "Kompeten"}
                onChange={() => setFinalDecision("Kompeten")}
              />
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center ${finalDecision === "Kompeten" ? "border-emerald-500 bg-emerald-500" : "border-slate-400"}`}
              >
                {finalDecision === "Kompeten" && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
              <span className="font-bold text-base">KOMPETEN</span>
            </label>
            <label
              className={`flex items-center justify-center gap-3 p-3.5 sm:p-4 border-2 cursor-pointer transition-colors w-full sm:w-64 ${finalDecision === "Belum Kompeten" ? "border-red-500 bg-red-50 text-red-700" : "border-slate-300 hover:bg-slate-50"}`}
            >
              <input
                type="radio"
                name="decision"
                className="w-5 h-5 hidden"
                checked={finalDecision === "Belum Kompeten"}
                onChange={() => setFinalDecision("Belum Kompeten")}
              />
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center ${finalDecision === "Belum Kompeten" ? "border-red-500 bg-red-500" : "border-slate-400"}`}
              >
                {finalDecision === "Belum Kompeten" && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
              <span className="font-bold text-base">BELUM KOMPETEN</span>
            </label>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-end items-center">
        <button
          onClick={handleSubmit}
          disabled={!finalDecision || isSubmitting}
          className="bg-slate-900 text-white px-8 py-2.5 font-bold text-sm hover:bg-slate-800 disabled:opacity-50 flex items-center justify-center gap-2 shadow-md w-full sm:w-auto cursor-pointer"
        >
          <Save size={16} />{" "}
          {isSubmitting ? "Menyimpan..." : "Finalisasi Asesmen"}
        </button>
      </div>
    </div>
  );

  const steps = [
    { num: 1, label: "Step 1" },
    { num: 2, label: "Step 2" },
    { num: 3, label: "Step 3" },
    { num: 4, label: "Step 4" },
    { num: 5, label: "Step 5" },
    { num: 6, label: "Finalisasi" },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FC] p-4 md:p-8 space-y-6 pb-24 text-sm text-gray-700">
      {/* Centered Step Indicators */}
      <div className="max-w-200 mx-auto mb-6 flex items-center justify-center">
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 text-xs md:text-sm font-semibold text-slate-500">
          {steps.map((s, i) => (
            <React.Fragment key={s.num}>
              <div
                className={`flex items-center gap-1.5 ${currentStep === s.num ? "text-slate-900 font-bold" : ""}`}
              >
                <span>{currentStep >= s.num ? "●" : "○"}</span>
                <span>{s.label}</span>
              </div>
              {i < steps.length - 1 && (
                <span className="hidden md:inline text-slate-300">→</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="max-w-200 mx-auto mb-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
        <button
          onClick={() => router.push("/assessor/candidates")}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-[#008BE3] bg-[#008BE3]/10 hover:bg-[#008BE3]/20 transition-colors cursor-pointer shrink-0"
          title="Kembali"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="min-w-0">
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            {asesmenData.nama}
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            {asesmenData.skema}
          </p>
        </div>
      </div>

      {/* Main Document Container */}
      <div className="max-w-200 mx-auto bg-white shadow-xl p-4 sm:p-8 md:p-12 min-h-280.75 relative mb-8 text-slate-900 text-sm">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
        {currentStep === 5 && renderStep5()}
        {currentStep === 6 && renderStep6()}
      </div>

      {/* Signature Modal Asesor */}
      {isAsesorSigOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Tanda Tangan Asesor</h3>
              <button
                onClick={() => setIsAsesorSigOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4">
              <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
                <SignatureCanvas
                  ref={asesorSigRef}
                  canvasProps={{
                    className: "w-full h-48 sm:h-64 cursor-crosshair",
                  }}
                  backgroundColor="white"
                />
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 flex flex-wrap gap-2 justify-between items-center bg-gray-50">
              <div className="flex gap-2">
                <button
                  onClick={() => setIsAsesorSigOpen(false)}
                  className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={() => asesorSigRef.current?.clear()}
                  className="px-4 py-2 border border-[#FF6B6B] text-[#FF6B6B] bg-white rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
                >
                  Hapus
                </button>
              </div>
              <div className="flex gap-2">
                <input
                  type="file"
                  ref={asesorFileRef}
                  onChange={handleAsesorFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={() => asesorFileRef.current?.click()}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg text-sm font-bold shadow-xs transition-colors"
                >
                  Upload
                </button>
                <button
                  onClick={saveAsesorSig}
                  className="px-4 py-2 bg-[#008BE3] hover:bg-[#0076C2] text-white rounded-lg text-sm font-bold shadow-sm transition-colors"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Signature Modal Asesi */}
      {isAsesiSigOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Tanda Tangan Asesi</h3>
              <button
                onClick={() => setIsAsesiSigOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4">
              <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
                <SignatureCanvas
                  ref={asesiSigRef}
                  canvasProps={{
                    className: "w-full h-48 sm:h-64 cursor-crosshair",
                  }}
                  backgroundColor="white"
                />
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 flex flex-wrap gap-2 justify-between items-center bg-gray-50">
              <div className="flex gap-2">
                <button
                  onClick={() => setIsAsesiSigOpen(false)}
                  className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={() => asesiSigRef.current?.clear()}
                  className="px-4 py-2 border border-[#FF6B6B] text-[#FF6B6B] bg-white rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
                >
                  Hapus
                </button>
              </div>
              <div className="flex gap-2">
                <input
                  type="file"
                  ref={asesiFileRef}
                  onChange={handleAsesiFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={() => asesiFileRef.current?.click()}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg text-sm font-bold shadow-xs transition-colors"
                >
                  Upload
                </button>
                <button
                  onClick={saveAsesiSig}
                  className="px-4 py-2 bg-[#008BE3] hover:bg-[#0076C2] text-white rounded-lg text-sm font-bold shadow-sm transition-colors"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Modal Asesi Step 2 */}
      {isAsesiStep2SigOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Tanda Tangan Asesi</h3>
              <button
                onClick={() => setIsAsesiStep2SigOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4">
              <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
                <SignatureCanvas
                  ref={asesiStep2SigRef}
                  canvasProps={{
                    className: "w-full h-48 sm:h-64 cursor-crosshair",
                  }}
                  backgroundColor="white"
                />
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 flex flex-wrap gap-2 justify-between items-center bg-gray-50">
              <div className="flex gap-2">
                <button
                  onClick={() => setIsAsesiStep2SigOpen(false)}
                  className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  onClick={() => asesiStep2SigRef.current?.clear()}
                  className="px-4 py-2 border border-[#FF6B6B] text-[#FF6B6B] bg-white rounded-lg text-sm font-medium hover:bg-red-50"
                >
                  Hapus
                </button>
              </div>
              <div className="flex gap-2">
                <input
                  type="file"
                  ref={asesiStep2FileRef}
                  onChange={handleAsesiStep2FileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={() => asesiStep2FileRef.current?.click()}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg text-sm font-bold shadow-xs"
                >
                  Upload
                </button>
                <button
                  onClick={saveAsesiStep2Sig}
                  className="px-4 py-2 bg-[#008BE3] hover:bg-[#0076C2] text-white rounded-lg text-sm font-bold shadow-sm"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Asesor Step 2 */}
      {isAsesorStep2SigOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Tanda Tangan Asesor</h3>
              <button
                onClick={() => setIsAsesorStep2SigOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4">
              <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
                <SignatureCanvas
                  ref={asesorStep2SigRef}
                  canvasProps={{
                    className: "w-full h-48 sm:h-64 cursor-crosshair",
                  }}
                  backgroundColor="white"
                />
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 flex flex-wrap gap-2 justify-between items-center bg-gray-50">
              <div className="flex gap-2">
                <button
                  onClick={() => setIsAsesorStep2SigOpen(false)}
                  className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  onClick={() => asesorStep2SigRef.current?.clear()}
                  className="px-4 py-2 border border-[#FF6B6B] text-[#FF6B6B] bg-white rounded-lg text-sm font-medium hover:bg-red-50"
                >
                  Hapus
                </button>
              </div>
              <div className="flex gap-2">
                <input
                  type="file"
                  ref={asesorStep2FileRef}
                  onChange={handleAsesorStep2FileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={() => asesorStep2FileRef.current?.click()}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg text-sm font-bold shadow-xs"
                >
                  Upload
                </button>
                <button
                  onClick={saveAsesorStep2Sig}
                  className="px-4 py-2 bg-[#008BE3] hover:bg-[#0076C2] text-white rounded-lg text-sm font-bold shadow-sm"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Supervisor Step 2 */}
      {isSupervisorSigOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">
                Tanda Tangan Supervisor
              </h3>
              <button
                onClick={() => setIsSupervisorSigOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4">
              <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
                <SignatureCanvas
                  ref={supervisorSigRef}
                  canvasProps={{
                    className: "w-full h-48 sm:h-64 cursor-crosshair",
                  }}
                  backgroundColor="white"
                />
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 flex flex-wrap gap-2 justify-between items-center bg-gray-50">
              <div className="flex gap-2">
                <button
                  onClick={() => setIsSupervisorSigOpen(false)}
                  className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  onClick={() => supervisorSigRef.current?.clear()}
                  className="px-4 py-2 border border-[#FF6B6B] text-[#FF6B6B] bg-white rounded-lg text-sm font-medium hover:bg-red-50"
                >
                  Hapus
                </button>
              </div>
              <div className="flex gap-2">
                <input
                  type="file"
                  ref={supervisorFileRef}
                  onChange={handleSupervisorFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={() => supervisorFileRef.current?.click()}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg text-sm font-bold shadow-xs"
                >
                  Upload
                </button>
                <button
                  onClick={saveSupervisorSig}
                  className="px-4 py-2 bg-[#008BE3] hover:bg-[#0076C2] text-white rounded-lg text-sm font-bold shadow-sm"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Asesi Step 4 */}
      {isAsesiStep4SigOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Tanda Tangan Asesi</h3>
              <button
                onClick={() => setIsAsesiStep4SigOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4">
              <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
                <SignatureCanvas
                  ref={asesiStep4SigRef}
                  canvasProps={{
                    className: "w-full h-48 sm:h-64 cursor-crosshair",
                  }}
                  backgroundColor="white"
                />
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 flex flex-wrap gap-2 justify-between items-center bg-gray-50">
              <div className="flex gap-2">
                <button
                  onClick={() => setIsAsesiStep4SigOpen(false)}
                  className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  onClick={() => asesiStep4SigRef.current?.clear()}
                  className="px-4 py-2 border border-[#FF6B6B] text-[#FF6B6B] bg-white rounded-lg text-sm font-medium hover:bg-red-50"
                >
                  Hapus
                </button>
              </div>
              <div className="flex gap-2">
                <input
                  type="file"
                  ref={asesiStep4FileRef}
                  onChange={handleAsesiStep4FileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={() => asesiStep4FileRef.current?.click()}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg text-sm font-bold shadow-xs"
                >
                  Upload
                </button>
                <button
                  onClick={saveAsesiStep4Sig}
                  className="px-4 py-2 bg-[#008BE3] hover:bg-[#0076C2] text-white rounded-lg text-sm font-bold shadow-sm"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Asesor Step 4 */}
      {isAsesorStep4SigOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Tanda Tangan Asesor</h3>
              <button
                onClick={() => setIsAsesorStep4SigOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4">
              <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
                <SignatureCanvas
                  ref={asesorStep4SigRef}
                  canvasProps={{
                    className: "w-full h-48 sm:h-64 cursor-crosshair",
                  }}
                  backgroundColor="white"
                />
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 flex flex-wrap gap-2 justify-between items-center bg-gray-50">
              <div className="flex gap-2">
                <button
                  onClick={() => setIsAsesorStep4SigOpen(false)}
                  className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  onClick={() => asesorStep4SigRef.current?.clear()}
                  className="px-4 py-2 border border-[#FF6B6B] text-[#FF6B6B] bg-white rounded-lg text-sm font-medium hover:bg-red-50"
                >
                  Hapus
                </button>
              </div>
              <div className="flex gap-2">
                <input
                  type="file"
                  ref={asesorStep4FileRef}
                  onChange={handleAsesorStep4FileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={() => asesorStep4FileRef.current?.click()}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg text-sm font-bold shadow-xs"
                >
                  Upload
                </button>
                <button
                  onClick={saveAsesorStep4Sig}
                  className="px-4 py-2 bg-[#008BE3] hover:bg-[#0076C2] text-white rounded-lg text-sm font-bold shadow-sm"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Asesi Step 3 */}
      {isAsesiStep3SigOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Tanda Tangan Asesi</h3>
              <button
                onClick={() => setIsAsesiStep3SigOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4">
              <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
                <SignatureCanvas
                  ref={asesiStep3SigRef}
                  canvasProps={{
                    className: "w-full h-48 sm:h-64 cursor-crosshair",
                  }}
                  backgroundColor="white"
                />
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 flex flex-wrap gap-2 justify-between items-center bg-gray-50">
              <div className="flex gap-2">
                <button
                  onClick={() => setIsAsesiStep3SigOpen(false)}
                  className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  onClick={() => asesiStep3SigRef.current?.clear()}
                  className="px-4 py-2 border border-[#FF6B6B] text-[#FF6B6B] bg-white rounded-lg text-sm font-medium hover:bg-red-50"
                >
                  Hapus
                </button>
              </div>
              <div className="flex gap-2">
                <input
                  type="file"
                  ref={asesiStep3FileRef}
                  onChange={handleAsesiStep3FileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={() => asesiStep3FileRef.current?.click()}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg text-sm font-bold shadow-xs"
                >
                  Upload
                </button>
                <button
                  onClick={saveAsesiStep3Sig}
                  className="px-4 py-2 bg-[#008BE3] hover:bg-[#0076C2] text-white rounded-lg text-sm font-bold shadow-sm"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Asesor Step 3 */}
      {isAsesorStep3SigOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Tanda Tangan Asesor</h3>
              <button
                onClick={() => setIsAsesorStep3SigOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4">
              <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
                <SignatureCanvas
                  ref={asesorStep3SigRef}
                  canvasProps={{
                    className: "w-full h-48 sm:h-64 cursor-crosshair",
                  }}
                  backgroundColor="white"
                />
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 flex flex-wrap gap-2 justify-between items-center bg-gray-50">
              <div className="flex gap-2">
                <button
                  onClick={() => setIsAsesorStep3SigOpen(false)}
                  className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  onClick={() => asesorStep3SigRef.current?.clear()}
                  className="px-4 py-2 border border-[#FF6B6B] text-[#FF6B6B] bg-white rounded-lg text-sm font-medium hover:bg-red-50"
                >
                  Hapus
                </button>
              </div>
              <div className="flex gap-2">
                <input
                  type="file"
                  ref={asesorStep3FileRef}
                  onChange={handleAsesorStep3FileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={() => asesorStep3FileRef.current?.click()}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg text-sm font-bold shadow-xs"
                >
                  Upload
                </button>
                <button
                  onClick={saveAsesorStep3Sig}
                  className="px-4 py-2 bg-[#008BE3] hover:bg-[#0076C2] text-white rounded-lg text-sm font-bold shadow-sm"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
