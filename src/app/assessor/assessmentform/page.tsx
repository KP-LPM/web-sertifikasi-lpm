
"use client";
import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Save,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useAppContext } from "@/context/context";
import { saveHasilAsesmen, getPengajuanDetail, createRiwayatAsesmen, upsertRiwayatAsesmen } from "@/lib/api";
import {
  FormFRAPL02,
  FormFRAK07,
  DEFAULT_ADJUSTMENT_OPTIONS,
  FormFRIA04A,
  FormFRIA04B,
  FormFRIA07,
} from "@/components/forms";

type AsesmenData = {
  nama: string;
  skema: string;
  noSkema: string;
  tuk: string;
  metodeAsesmen: string;
  tanggal: string;
  asesor: string;
  asesorReg?: string;
  [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
};

function AssessmentFormContent() {
  const router = useRouter();
  const { selectedAsesmen, updateAssessmentItem, setExtraCrumbs, user, registeredProfile } = useAppContext();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [asesiSignatureApl02, setAsesiSignatureApl02] = useState<string>("");
  const [asesiDateApl02, setAsesiDateApl02] = useState<string>("");
  const [evidenceFiles, setEvidenceFiles] = useState<Record<string, { name: string, url: string }[]>>({});
  const [formApl02Status, setFormApl02Status] = useState({
    total: 0,
    filled: 0,
    isAllFilled: false,
  });

  useEffect(() => {
    if (selectedAsesmen?.id) {
      getPengajuanDetail(Number(selectedAsesmen.id)).then((data) => {
        if (data?.dokumen && Array.isArray(data.dokumen)) {
          const files: Record<string, { name: string, url: string }[]> = {};
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data.dokumen.forEach((d: any) => {
            if (d.namaDokumen) {
              if (!files[d.namaDokumen]) files[d.namaDokumen] = [];
              files[d.namaDokumen].push({
                name: d.namaDokumen,
                url: d.fileUrl || d.url || "#",
              });
            }
          });
          setEvidenceFiles(files);
        }

        // Auto-fill Asesi Signature (from pengajuan dataPribadi)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const asesiSig = data?.dataPribadi?.tandaTangan || (data?.dataPribadi as any)?.tanda_tangan || "";
        if (asesiSig) {
          setAsesiSignatureApl02(asesiSig);
          setAsesiSignature(asesiSig);
          setAsesiSignatureStep2(asesiSig);
          setAsesiSignatureStep3(asesiSig);
          setAsesiSignatureStep4(asesiSig);
        }

        // Auto-fill dates to today
        const today = new Date().toISOString().split("T")[0];
        setAsesiDate(today);
        setAsesiDateStep3(today);
        setAsesiDateStep4(today);
        setAsesorDate(today);
        setAsesorDateStep3(today);
        setAsesorDateStep4(today);

        if (data?.tglPengajuan) {
          setAsesiDateApl02(data.tglPengajuan.toString().split("T")[0]);
        } else if (data?.createdAt) {
          setAsesiDateApl02(data.createdAt.toString().split("T")[0]);
        } else if (data?.dataPribadi?.createdAt) {
          setAsesiDateApl02(data.dataPribadi.createdAt.toString().split("T")[0]);
        } else {
          setAsesiDateApl02(today);
        }
      }).catch(err => console.error("Failed to load pengajuan detail:", err));
    }
  }, [selectedAsesmen, user]);

  // Sync asesor signature from registeredProfile whenever it loads
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const asesorSig = (registeredProfile as any)?.tanda_tangan || (registeredProfile as any)?.tandaTangan || "";
    if (asesorSig) {
      setAsesorSignatureApl02(asesorSig);
      setAsesorSignature(asesorSig);
      setAsesorSignatureStep2(asesorSig);
      setAsesorSignatureStep3(asesorSig);
      setAsesorSignatureStep4(asesorSig);
    }
  }, [registeredProfile]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep]);

  useEffect(() => {
    if (selectedAsesmen?.nama) {
      setExtraCrumbs([
        { label: selectedAsesmen.namaBatch || "Batch", href: "/assessor/candidates" },
        { label: selectedAsesmen.nama },
      ]);
    }
    return () => setExtraCrumbs([]);
  }, [selectedAsesmen, setExtraCrumbs]);

  // Data Asesmen
  const asesmenData = {
    nama: selectedAsesmen?.nama ? String(selectedAsesmen.nama) : "-",
    skema: selectedAsesmen?.skema ? String(selectedAsesmen.skema) : "-",
    noSkema: selectedAsesmen?.noSkema ? String(selectedAsesmen.noSkema) : "-",
    tuk: selectedAsesmen?.alamat ? String(selectedAsesmen.alamat) : selectedAsesmen?.tipeTuk ? String(selectedAsesmen.tipeTuk) : "-",
    metodeAsesmen: selectedAsesmen?.metode ? String(selectedAsesmen.metode) : "-",
    tanggal: selectedAsesmen?.tglAsesmen ? String(selectedAsesmen.tglAsesmen) : "-",
    asesor: selectedAsesmen?.asesor || "-",
    asesorReg: selectedAsesmen?.asesorReg || "-",
  } as AsesmenData;
  // Step 1: Form FR.APL.02 State
  const [rekomendasiApl02, setRekomendasiApl02] = useState<
    "Dapat dilanjutkan" | "Tidak dapat dilanjutkan" | ""
  >("Dapat dilanjutkan");
  const [asesorSignatureApl02, setAsesorSignatureApl02] = useState("");
  const [answersApl02, setAnswersApl02] = useState<Record<string, "K" | "BK">>({});

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
  // State Step 1
  const [potensiAsesi, setPotensiAsesi] = useState<string[]>([
    "Hasil pelatihan dan / atau pendidikan, dimana Kurikulum dan fasilitas praktek mampu telusur terhadap standar kompetensi",
  ]);
  const [noAdjustment, setNoAdjustment] = useState(false);

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
    "Kompeten" | "Belum Kompeten" | "Perlu Perbaikan" | null
  >(null);
  const [catatanAsesor, setCatatanAsesor] = useState("");

  // Validation
  const isStep1Valid =
    noAdjustment ||
    DEFAULT_ADJUSTMENT_OPTIONS.every((opt) => {
      const adj = adjustments[opt.id];
      if (!adj || adj.required === undefined || adj.required === null)
        return false;
      if (adj.required === true && !adj.note?.trim()) return false;
      return true;
    });
  const isStep2Valid =
    !!umpanBalikStep2?.trim();
  const isStep3Valid =
    (step3Questions.length === 0 ||
      step3Questions.every(
        (q) =>
          step3Answers[q.id]?.answer?.trim() &&
          step3Answers[q.id]?.achievement !== undefined &&
          step3Answers[q.id]?.achievement !== null,
      )) &&
    !!rekomendasiStep3?.trim();
  const isStep4Valid =
    step4Questions.length === 0 ||
    step4Questions.every(
      (q) =>
        step4Answers[q.id]?.answer?.trim() &&
        step4Answers[q.id]?.achievement !== undefined &&
        step4Answers[q.id]?.achievement !== null,
    );

  const searchParams = useSearchParams();
  const pengajuanIdParam = searchParams.get("pengajuanId");

  const handleSubmit = async () => {
    if (!finalDecision) return;
    setIsSubmitting(true);
    try {
      const targetId = Number(pengajuanIdParam || selectedAsesmen?.id);
      if (targetId) {
        await saveHasilAsesmen(targetId, {
          hasil: finalDecision,
          catatan: catatanAsesor || "Penilaian asesmen telah diselesaikan oleh asesor.",
        });

        // 1. Upsert APL-02
        await upsertRiwayatAsesmen(targetId, {
          form_type: "FR.APL.02",
          penilaian: { rekomendasi: rekomendasiApl02 },
        }).catch(e => console.error("Gagal upsert APL-02:", e));

        // 2. Create AK-07
        await createRiwayatAsesmen(targetId, {
          form_type: "FR.AK.07",
          form_data: {
            potensiAsesi,
            noAdjustment,
            adjustments,
            acuanPembanding,
            metodeAsesmen,
            instrumenAsesmen
          },
        }).catch(e => console.error("Gagal create AK-07:", e));

        // 3. Create IA-04A (Step 3)
        await createRiwayatAsesmen(targetId, {
          form_type: "FR.IA.04A",
          form_data: {
            umpanBalik: umpanBalikStep2,
            penyusun,
            validator
          },
        }).catch(e => console.error("Gagal create IA-04A:", e));

        // 4. Create IA-04B (Step 4)
        await createRiwayatAsesmen(targetId, {
          form_type: "FR.IA.04B",
          form_data: {
            questions: step3Questions,
            answers: step3Answers,
            rekomendasi: rekomendasiStep3,
            penyusun: penyusunStep3,
            validator: validatorStep3
          },
        }).catch(e => console.error("Gagal create IA-04B:", e));

        // 5. Create IA-07 (Step 5)
        await createRiwayatAsesmen(targetId, {
          form_type: "FR.IA.07",
          form_data: {
            questions: step4Questions,
            answers: step4Answers,
            umpanBalik: umpanBalikStep4,
            penyusun: penyusunStep4,
            validator: validatorStep4
          },
        }).catch(e => console.error("Gagal create IA-07:", e));
      }

      if (selectedAsesmen) {
        updateAssessmentItem(selectedAsesmen.id, {
          status: "Selesai",
          hasil: finalDecision,
        });
      }

      router.push("/assessor/candidates");
    } catch (err: unknown) {
      console.error("Gagal menyimpan hasil asesmen:", err);
      router.push("/assessor/candidates");
    } finally {
      setIsSubmitting(false);
    }
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



  const renderStep1 = () => {
    // Note: totalElementsApl02, filledElementsCountApl02, and isAllKBKFilledApl02
    // are now managed by formApl02Status state updated directly by FormFRAPL02.
    const { total: totalElementsApl02, filled: filledElementsCountApl02, isAllFilled: isAllKBKFilledApl02 } = formApl02Status;

    return (
      <div className="space-y-6">
        <FormFRAPL02
          pengajuanId={selectedAsesmen?.id}
          asesmenData={
            {
              nama: asesmenData.nama,
              skema: asesmenData.skema,
              noSkema: asesmenData.noSkema,
              tuk: asesmenData.tuk,
              tanggal: asesmenData.tanggal,
              tglAsesmen: asesmenData.tanggal,
              asesor: asesmenData.asesor,
              asesorReg: asesmenData.asesorReg,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any
          }
          answers={answersApl02}
          evidenceFiles={evidenceFiles}
          onAnswerChange={(key, val) =>
            setAnswersApl02((prev) => ({ ...prev, [key]: val }))
          }
          rekomendasi={rekomendasiApl02}
          onRekomendasiChange={setRekomendasiApl02}
          onFinishDirectly={() => {
            setFinalDecision("Perlu Perbaikan");
            setCurrentStep(6);
          }}
          asesiName={asesmenData.nama}
          asesiSignature={asesiSignatureApl02}
          onAsesiSignatureChange={setAsesiSignatureApl02}
          asesiDate={asesiDateApl02} // Hubungkan ke state
          onAsesiDateChange={setAsesiDateApl02} // Tambahkan fungsi handler
          asesorName={String(asesmenData.asesor || "")}
          asesorReg={asesmenData.asesorReg}
          asesorSignature={asesorSignatureApl02}
          onAsesorSignatureChange={setAsesorSignatureApl02}
          onFormStatusChange={(total, filled, isAllFilled) => {
            setFormApl02Status((prev) => {
              if (
                prev.total === total &&
                prev.filled === filled &&
                prev.isAllFilled === isAllFilled
              ) {
                return prev;
              }
              return { total, filled, isAllFilled };
            });
          }}
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
              onClick={() => { setCompletedSteps(p => new Set(p).add(1)); setCurrentStep(2); }}
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
      onNext={() => { setCompletedSteps(p => new Set(p).add(2)); setCurrentStep(3); }}
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
      onNext={() => { setCompletedSteps(p => new Set(p).add(3)); setCurrentStep(4); }}
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
      onNext={() => { setCompletedSteps(p => new Set(p).add(4)); setCurrentStep(5); }}
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
      onNext={() => { setCompletedSteps(p => new Set(p).add(5)); setCurrentStep(6); }}
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
              className={`flex items-center justify-center gap-3 p-3.5 sm:p-4 border-2 rounded-xl cursor-pointer transition-colors w-full sm:w-64 ${finalDecision === "Kompeten" ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-slate-300 hover:bg-slate-50"}`}
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
              className={`flex items-center justify-center gap-3 p-3.5 sm:p-4 border-2 rounded-xl cursor-pointer transition-colors w-full sm:w-64 ${finalDecision === "Belum Kompeten" ? "border-red-500 bg-red-50 text-red-700" : "border-slate-300 hover:bg-slate-50"}`}
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
          className="bg-[#008BE3] hover:bg-[#0076C2] text-white px-8 py-2.5 font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm w-full sm:w-auto cursor-pointer disabled:opacity-50 transition-colors"
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
    <div className="space-y-6 pb-24 text-sm text-gray-700">
      {/* Header Info: Nama Asesi, Skema, Back Button */}
      <div className="w-full max-w-full mx-auto px-4 md:px-8 mb-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
          <button
            onClick={() => router.push('/assessor/candidates')}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-[#008BE3] bg-[#008BE3]/10 hover:bg-[#008BE3]/20 transition-colors cursor-pointer shrink-0"
            title="Kembali ke Daftar Asesi"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="min-w-0">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              {asesmenData.nama}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Skema: {asesmenData.skema}
            </p>
          </div>
        </div>
      </div>

      {/* Steps Indicator */}
      <div className="w-full max-w-full mx-auto px-4 md:px-8 mb-6 flex items-center justify-center">
        <div className="flex flex-wrap items-center justify-center gap-1 md:gap-2">
          {steps.map((s, i) => {
            const isDone = completedSteps.has(s.num);
            const isCurrent = currentStep === s.num;
            const maxReached = Math.max(...Array.from(completedSteps), currentStep);
            const isClickable = s.num <= maxReached + 1;
            return (
              <React.Fragment key={s.num}>
                <button
                  type="button"
                  disabled={!isClickable}
                  onClick={() => isClickable && setCurrentStep(s.num)}
                  className={[
                    'flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl transition-colors text-xs font-semibold',
                    isCurrent ? 'bg-[#008BE3] text-white shadow-sm' : isDone ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 cursor-pointer' : isClickable ? 'hover:bg-slate-100 text-slate-500 cursor-pointer' : 'text-slate-300 cursor-not-allowed',
                  ].join(' ')}
                >
                  <span className={[
                    'w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black border',
                    isCurrent ? 'bg-white text-[#008BE3] border-white' : isDone ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-current',
                  ].join(' ')}>
                    {(isDone && !isCurrent) ? <Check size={8} /> : s.num}
                  </span>
                  <span>{s.label}</span>
                </button>
                {i < steps.length - 1 && (
                  <ChevronRight size={12} className="text-slate-300 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>


      {/* Main Document Container */}
      <div className="w-full max-w-full mx-auto px-4 md:px-8">
        <div className="w-full bg-white shadow-xl p-4 sm:p-8 md:p-12 min-h-280.75 relative mb-8 text-slate-900 text-sm">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
          {currentStep === 5 && renderStep5()}
          {currentStep === 6 && renderStep6()}
        </div>
      </div>
    </div>
  );
}

export default function AssessmentForm() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-slate-500 font-bold">
          Memuat formulir asesmen...
        </div>
      }
    >
      <AssessmentFormContent />
    </Suspense>
  );
}
