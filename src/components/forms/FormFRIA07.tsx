import React, { useState } from "react";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { FormHeader } from "./FormHeader";
import { SignatureModal } from "./SignatureModal";
import { Assessment, PenyusunValidator } from "@/types/types";
 

export const DEFAULT_STEP4_QUESTIONS = [
  {
    id: "s4_q1",
    pertanyaan:
      "Mengapa penting untuk merancang profil sasaran pembaca mencakup semua informasi yang diperlukan?",
    elemen: "M.74PEN01.008.1 E1/KUK 1.1; E1/KUK 1.2",
    kunci:
      "Merancang profil sasaran dengan detail penting untuk mendukung pemilihan metode dan gaya bahasa yang tepat.",
  },
  {
    id: "s4_q2",
    pertanyaan:
      "Bagaimana cara memastikan alat bantu penerjemahan nonkonvensional yang digunakan sudah tepat?",
    elemen: "-",
    kunci:
      "Memastikan alat bantu tepat dengan cara menguji akurasi terjemahan pada sebagian teks dan membandingkannya dengan referensi paralel.",
  },
  {
    id: "s4_q3",
    pertanyaan:
      "Mengapa penting untuk menyusun daftar glosarium sebelum menerjemahkan teks panjang?",
    elemen: "M.74PEN01.002.1 E1/KUK 1.1; E2/KUK 2.2",
    kunci:
      "Menyusun glosarium penting untuk menjaga konsistensi istilah teknis di seluruh dokumen terjemahan.",
  },
  {
    id: "s4_q4",
    pertanyaan:
      "Bagaimana cara menentukan teknik penerjemahan mana yang dapat meningkatkan kualitas terjemahan pada frasa idiomatis?",
    elemen: "-",
    kunci:
      "Menentukan teknik yang tepat dilakukan dengan menilai kesepadanan makna dan keluwesan dalam bahasa sasaran.",
  },
  {
    id: "s4_q5",
    pertanyaan: "Apa perbedaan antara metode adaptasi dan terjemahan bebas?",
    elemen: "M.74PEN01.008.1 E2/KUK 2.2",
    kunci:
      "Adaptasi paling jauh dari teks sumber dan sering digunakan pada puisi/drama, sedangkan terjemahan bebas mempertahankan makna tapi menulis ulang dengan cara yang luwes.",
  },
];

export interface FormFRIA07Props {
  asesmenData?: Assessment;
  questions?: typeof DEFAULT_STEP4_QUESTIONS;
  step4Questions?: typeof DEFAULT_STEP4_QUESTIONS;
  answers?: Record<string, { answer: string; achievement: boolean | null }>;
  step4Answers?: Record<
    string,
    { answer: string; achievement: boolean | null }
  >;
  onAnswerChange?: (
    id: string,
    field: "answer" | "achievement",
    value: string | boolean | null,
  ) => void;
  onStep4Change?: (
    id: string,
    field: "answer" | "achievement",
    value: string | boolean | null,
  ) => void;
  umpanBalik?: string;
  umpanBalikStep4?: string;
  onUmpanBalikChange?: (val: string) => void;
  onUmpanBalikStep4Change?: (val: string) => void;
  asesiName?: string;
  asesiNameStep4?: string;
  onAsesiNameChange?: (val: string) => void;
  onAsesiNameStep4Change?: (val: string) => void;
  asesiSignature?: string;
  asesiSignatureStep4?: string;
  onAsesiSignatureChange?: (val: string) => void;
  onAsesiSignatureStep4Change?: (val: string) => void;
  asesiDate?: string;
  asesiDateStep4?: string;
  onAsesiDateChange?: (val: string) => void;
  onAsesiDateStep4Change?: (val: string) => void;
  asesorName?: string;
  asesorNameStep4?: string;
  onAsesorNameChange?: (val: string) => void;
  onAsesorNameStep4Change?: (val: string) => void;
  asesorReg?: string;
  asesorRegStep4?: string;
  onAsesorRegChange?: (val: string) => void;
  onAsesorRegStep4Change?: (val: string) => void;
  asesorSignature?: string;
  asesorSignatureStep4?: string;
  onAsesorSignatureChange?: (val: string) => void;
  onAsesorSignatureStep4Change?: (val: string) => void;
  asesorDate?: string;
  asesorDateStep4?: string;
  onAsesorDateChange?: (val: string) => void;
  onAsesorDateStep4Change?: (val: string) => void;
  penyusun?: Array<{ nama: string; noMet: string; ttdTanggal: string }>;
  penyusunStep4?: Array<{ nama: string; noMet: string; ttdTanggal: string }>;
  onPenyusunChange?: (
    penyusun: Array<{ nama: string; noMet: string; ttdTanggal: string }>,
  ) => void;
  onPenyusunStep4Change?: (
    penyusun: Array<{ nama: string; noMet: string; ttdTanggal: string }>,
  ) => void;
  validator?: Array<{ nama: string; noMet: string; ttdTanggal: string }>;
  validatorStep4?: Array<{ nama: string; noMet: string; ttdTanggal: string }>;
  onValidatorChange?: (
    validator: Array<{ nama: string; noMet: string; ttdTanggal: string }>,
  ) => void;
  onValidatorStep4Change?: (
    validator: Array<{ nama: string; noMet: string; ttdTanggal: string }>,
  ) => void;
  readOnly?: boolean;
  isAsesi?: boolean;
  showHeader?: boolean;
  onNext?: () => void;
  onPrev?: () => void;
  isNextDisabled?: boolean;
  nextLabel?: string;
}

export function FormFRIA07(props: FormFRIA07Props) {
  const questions =
    props.step4Questions || props.questions || DEFAULT_STEP4_QUESTIONS;

  const [localAnswers, setLocalAnswers] = useState<
    Record<string, { answer: string; achievement: boolean | null }>
  >({});
  const [localUmpanBalik, setLocalUmpanBalik] = useState("");
  const [localAsesiName, setLocalAsesiName] = useState(
    props.asesmenData?.nama || "Ahmad Supriyadi",
  );
  const [localAsesiSig, setLocalAsesiSig] = useState("");
  const [localAsesiDate, setLocalAsesiDate] = useState("");
  const [localAsesorName, setLocalAsesorName] = useState(
    props.asesmenData?.asesor || "Ichsan Taufik",
  );
  const [localAsesorReg, setLocalAsesorReg] = useState("");
  const [localAsesorSig, setLocalAsesorSig] = useState("");
  const [localAsesorDate, setLocalAsesorDate] = useState("");

  const defaultPenyusun = [
    {
      nama: props.asesmenData?.asesor || "Ichsan Taufik",
      noMet: "",
      ttdTanggal: props.asesmenData?.tanggal || "11 Oktober 2024",
    },
    { nama: "", noMet: "", ttdTanggal: "" },
  ];
  const defaultValidator = [
    { nama: "", noMet: "", ttdTanggal: "" },
    { nama: "", noMet: "", ttdTanggal: "" },
  ];

  const [localPenyusun, setLocalPenyusun] = useState(defaultPenyusun);
  const [localValidator, setLocalValidator] = useState(defaultValidator);

  const [isAsesiSigModalOpen, setIsAsesiSigModalOpen] = useState(false);
  const [isAsesorSigModalOpen, setIsAsesorSigModalOpen] = useState(false);

  const answers = props.step4Answers || props.answers || localAnswers;
  const umpanBalik =
    props.umpanBalikStep4 !== undefined
      ? props.umpanBalikStep4
      : props.umpanBalik !== undefined
        ? props.umpanBalik
        : localUmpanBalik;
  const asesiName =
    props.asesiNameStep4 !== undefined
      ? props.asesiNameStep4
      : props.asesiName !== undefined
        ? props.asesiName
        : localAsesiName;
  const asesiSignature =
    props.asesiSignatureStep4 !== undefined
      ? props.asesiSignatureStep4
      : props.asesiSignature !== undefined
        ? props.asesiSignature
        : localAsesiSig;
  const asesiDate =
    props.asesiDateStep4 !== undefined
      ? props.asesiDateStep4
      : props.asesiDate !== undefined
        ? props.asesiDate
        : localAsesiDate;
  const asesorName =
    props.asesorNameStep4 !== undefined
      ? props.asesorNameStep4
      : props.asesorName !== undefined
        ? props.asesorName
        : localAsesorName;
  const asesorReg =
    props.asesorRegStep4 !== undefined
      ? props.asesorRegStep4
      : props.asesorReg !== undefined
        ? props.asesorReg
        : localAsesorReg;
  const asesorSignature =
    props.asesorSignatureStep4 !== undefined
      ? props.asesorSignatureStep4
      : props.asesorSignature !== undefined
        ? props.asesorSignature
        : localAsesorSig;
  const asesorDate =
    props.asesorDateStep4 !== undefined
      ? props.asesorDateStep4
      : props.asesorDate !== undefined
        ? props.asesorDate
        : localAsesorDate;
  const penyusun = props.penyusunStep4 || props.penyusun || localPenyusun;
  const validator = props.validatorStep4 || props.validator || localValidator;

  const handleAnswerChangeInternal = (
    id: string,
    field: "answer" | "achievement",
    val: string | boolean | null,
  ) => {
    if (props.onStep4Change) {
      props.onStep4Change(id, field, val);
    } else if (props.onAnswerChange) {
      props.onAnswerChange(id, field, val);
    } else {
      setLocalAnswers((prev) => ({
        ...prev,
        [id]: {
          answer: prev[id]?.answer || "",
          achievement: prev[id]?.achievement ?? null,
          [field]: val,
        },
      }));
    }
  };

  const handleUmpanBalikChange = (val: string) => {
    if (props.onUmpanBalikStep4Change) props.onUmpanBalikStep4Change(val);
    if (props.onUmpanBalikChange) props.onUmpanBalikChange(val);
    setLocalUmpanBalik(val);
  };

  const handleAsesiNameChange = (val: string) => {
    if (props.onAsesiNameStep4Change) props.onAsesiNameStep4Change(val);
    if (props.onAsesiNameChange) props.onAsesiNameChange(val);
    setLocalAsesiName(val);
  };

  const handleAsesiSignatureChange = (val: string) => {
    if (props.onAsesiSignatureStep4Change)
      props.onAsesiSignatureStep4Change(val);
    if (props.onAsesiSignatureChange) props.onAsesiSignatureChange(val);
    setLocalAsesiSig(val);
  };

  const handleAsesiDateChange = (val: string) => {
    if (props.onAsesiDateStep4Change) props.onAsesiDateStep4Change(val);
    if (props.onAsesiDateChange) props.onAsesiDateChange(val);
    setLocalAsesiDate(val);
  };

  const handleAsesorNameChange = (val: string) => {
    if (props.onAsesorNameStep4Change) props.onAsesorNameStep4Change(val);
    if (props.onAsesorNameChange) props.onAsesorNameChange(val);
    setLocalAsesorName(val);
  };

  const handleAsesorRegChange = (val: string) => {
    if (props.onAsesorRegStep4Change) props.onAsesorRegStep4Change(val);
    if (props.onAsesorRegChange) props.onAsesorRegChange(val);
    setLocalAsesorReg(val);
  };

  const handleAsesorSignatureChange = (val: string) => {
    if (props.onAsesorSignatureStep4Change)
      props.onAsesorSignatureStep4Change(val);
    if (props.onAsesorSignatureChange) props.onAsesorSignatureChange(val);
    setLocalAsesorSig(val);
  };

  const handleAsesorDateChange = (val: string) => {
    if (props.onAsesorDateStep4Change) props.onAsesorDateStep4Change(val);
    if (props.onAsesorDateChange) props.onAsesorDateChange(val);
    setLocalAsesorDate(val);
  };

  const handlePenyusunChangeInternal = (
    idx: number,
    field: string,
    val: string,
  ) => {
    const updated = [...(penyusun as PenyusunValidator[])];
    updated[idx] = { ...updated[idx], [field]: val };
    if (props.onPenyusunStep4Change) props.onPenyusunStep4Change(updated);
    if (props.onPenyusunChange) props.onPenyusunChange(updated);
    setLocalPenyusun(updated);
  };

  const handleValidatorChangeInternal = (
    idx: number,
    field: string,
    val: string,
  ) => {
    const updated = [...validator];
    updated[idx] = { ...updated[idx], [field]: val };
    if (props.onValidatorStep4Change) props.onValidatorStep4Change(updated);
    if (props.onValidatorChange) props.onValidatorChange(updated);
    setLocalValidator(updated);
  };

  const lingkupList = [
    {
      title:
        "1. Pengumpulan Kebutuhan Teknis Pengguna yang Menggunakan Jaringan",
      qs: [questions[0], questions[1]].filter(Boolean),
    },
    {
      title:
        "2. Pengumpulan Data Peralatan Jaringan Dengan Teknologi yang Sesuai",
      qs: [questions[2], questions[3]].filter(Boolean),
    },
    {
      title: "3. Perancangan Topologi Jaringan",
      qs: [questions[4], questions[5]].filter(Boolean),
    },
    {
      title: "4. Perancangan Pengalamatan Jaringan",
      qs: [questions[6], questions[7]].filter(Boolean),
    },
    {
      title: "5. Penentuan Spesifikasi Perangkat Jaringan",
      qs: [questions[8], questions[9]].filter(Boolean),
    },
  ].filter((l) => l.qs.length > 0);

  return (
    <div className="animate-in fade-in duration-300">
      {props.showHeader !== false && (
        <FormHeader
          title="DPL - DAFTAR PERTANYAAN LISAN"
          formCode="FR.IA.07"
          asesmenData={props.asesmenData}
        />
      )}

      {/* Panduan Bagi Asesor */}
      <div className="border border-slate-300 mb-6 bg-white text-sm">
        <div className="border-b border-slate-300 p-2 bg-white font-bold text-base">
          PANDUAN BAGI ASESOR
        </div>
        <div className="p-4 space-y-4">
          <div>
            <div className="font-bold mb-2">Instruksi:</div>
            <ul className="list-disc pl-5 space-y-1 text-slate-800">
              <li>
                Pertanyaan lisan merupakan jenis bukti tambahan untuk mendukung
                bukti-bukti yang sudah ada.
              </li>
              <li>
                Buatlah pertanyaan lisan yang dapat mencakupi penguatan
                informasi berdasarkan KUK, batasan variabel, pengetahuan dan
                keterampilan esensial, sikap dan aspek kritis.
              </li>
              <li>
                Perkiraan jawaban dapat diisikan pada baris kunci jawaban.
              </li>
              <li>
                Tanggapan/penilaian dapat diisi dengan centang pada kolom Asesi
                Ya atau Tidak.
              </li>
              <li>
                Dibutuhkan justifikasi profesional asesor untuk memutuskan hal
                ini.
              </li>
            </ul>
          </div>
          <div className="flex flex-col sm:flex-row border border-slate-300">
            <div className="w-full sm:w-1/4 p-2 font-bold border-b sm:border-b-0 sm:border-r border-slate-300 bg-white">
              Instruksi:
            </div>
            <div className="w-full sm:w-3/4 p-2">
              <ol className="list-decimal pl-5 space-y-1 text-slate-800">
                <li>
                  Ajukan pertanyaan kepada Asesi dari daftar pertanyaan di bawah
                  ini untuk mengonfirmasi pengetahuan, sebagaimana diperlukan.
                </li>
                <li>Tempatkan centang di kotak pencapaian Ya atau Tidak.</li>
                <li>
                  Tulis jawaban Asesi secara singkat di tempat yang disediakan
                  dan konfirmasi ulang untuk setiap jawaban.
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* Question Groups */}
      <div className="space-y-8">
        {lingkupList.map((lingkup, lIdx) => (
          <div key={lIdx} className="space-y-2">
            <h3 className="font-bold text-slate-900">{lingkup.title}</h3>
            <div className="border border-slate-300 overflow-x-auto text-sm">
              <table className="w-full border-collapse min-w-150">
                <thead>
                  <tr className="bg-white border-b border-slate-300 text-center">
                    <th
                      className="border border-slate-300 p-2 w-12"
                      rowSpan={2}
                    >
                      No.
                    </th>
                    <th className="border border-slate-300 p-2" rowSpan={2}>
                      Pertanyaan
                    </th>
                    <th
                      className="border border-slate-300 p-2 w-32"
                      colSpan={2}
                    >
                      Pencapaian
                    </th>
                  </tr>
                  <tr className="bg-white text-center">
                    <th className="border border-slate-300 p-2 w-16">Ya</th>
                    <th className="border border-slate-300 p-2 w-16">Tidak</th>
                  </tr>
                </thead>
                <tbody>
                  {lingkup.qs.map((q, qIdx) => (
                    <React.Fragment key={q.id}>
                      <tr>
                        <td
                          className="border border-slate-300 p-2 text-center align-top"
                          rowSpan={3}
                        >
                          {qIdx + 1}.
                        </td>
                        <td className="border border-slate-300 p-3 align-top space-y-1">
                          <div className="font-bold">Pertanyaan:</div>
                          {q.elemen !== "-" && (
                            <div className="text-slate-700 whitespace-pre-wrap">
                              {q.elemen.replace(";", "\n")}
                            </div>
                          )}
                          <div>{q.pertanyaan}</div>
                        </td>
                        <td
                          className="border border-slate-300 p-2 text-center align-top"
                          rowSpan={3}
                        >
                          <input
                            type="radio"
                            name={`ach4_${q.id}`}
                            className="w-4 h-4 cursor-pointer"
                            checked={answers[q.id]?.achievement === true}
                            onChange={() =>
                              handleAnswerChangeInternal(
                                q.id,
                                "achievement",
                                true,
                              )
                            }
                            disabled={props.readOnly || props.isAsesi}
                          />
                        </td>
                        <td
                          className="border border-slate-300 p-2 text-center align-top"
                          rowSpan={3}
                        >
                          <input
                            type="radio"
                            name={`ach4_${q.id}`}
                            className="w-4 h-4 cursor-pointer"
                            checked={answers[q.id]?.achievement === false}
                            onChange={() =>
                              handleAnswerChangeInternal(
                                q.id,
                                "achievement",
                                false,
                              )
                            }
                            disabled={props.readOnly || props.isAsesi}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 p-3 align-top">
                          <div className="font-bold mb-1">Kunci Jawaban:</div>
                          <div>{q.kunci}</div>
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 p-3 align-top">
                          <div className="font-bold mb-2">Jawaban Asesi:</div>
                          <textarea
                            disabled={props.readOnly || props.isAsesi}
                            className="w-full outline-none bg-transparent min-h-20 resize-y"
                            placeholder="Ketik jawaban asesi..."
                            value={answers[q.id]?.answer || ""}
                            onChange={(e) =>
                              handleAnswerChangeInternal(
                                q.id,
                                "answer",
                                e.target.value,
                              )
                            }
                          />
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {/* Umpan balik & TTD */}
      <div className="mt-8 border border-slate-300 bg-white text-sm">
        <table className="w-full border-collapse">
          <tbody>
            <tr>
              <td className="border border-slate-300 p-3 font-bold w-1/3 align-top">
                Umpan balik untuk asesi
              </td>
              <td className="border border-slate-300 p-3 align-top space-y-2">
                <div>
                  Aspek pengetahuan seluruh unit kompetensi yang diujikan
                  (tercapai/ belum tercapai)*
                </div>
                <div className="flex gap-2">
                  <span>:</span>
                  <textarea
                    disabled={props.readOnly || props.isAsesi}
                    className="w-full outline-none bg-transparent min-h-15"
                    placeholder="Tuliskan unit kompetensi /elemen/KUK jika belum tercapai: ...."
                    value={umpanBalik}
                    onChange={(e) => handleUmpanBalikChange(e.target.value)}
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <table className="w-full border-collapse">
          <tbody>
            <tr className="bg-white">
              <td className="border border-slate-300 p-2 font-bold" colSpan={3}>
                ASESI :
              </td>
            </tr>
            <tr>
              <td className="border border-slate-300 p-2 w-1/3">Nama</td>
              <td className="border border-slate-300 p-2 w-8 text-center">:</td>
              <td className="border border-slate-300 p-2">
                <input
                  type="text"
                  disabled={props.readOnly}
                  className="w-full outline-none bg-transparent"
                  value={asesiName}
                  onChange={(e) => handleAsesiNameChange(e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td className="border border-slate-300 p-2">
                Tanda tangan dan Tanggal
              </td>
              <td className="border border-slate-300 p-2 text-center">:</td>
              <td className="border border-slate-300 p-2">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
                  <div
                    id="signature-container"
                    className="flex-1 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() =>
                      !props.readOnly && setIsAsesiSigModalOpen(true)
                    }
                  >
                    {asesiSignature ? (
                      <img
                        src={asesiSignature}
                        alt="TTD Asesi"
                        className="h-full object-contain"
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">
                        Klik untuk tanda tangan
                      </span>
                    )}
                  </div>
                  <input
                    id="date-input"
                    type="date"
                    disabled={props.readOnly}
                    className="w-full sm:w-40 outline-none bg-transparent border-b border-slate-300 pb-1"
                    value={asesiDate}
                    onChange={(e) => handleAsesiDateChange(e.target.value)}
                  />
                </div>
              </td>
            </tr>
            <tr className="bg-white">
              <td className="border border-slate-300 p-2 font-bold" colSpan={3}>
                ASESOR :
              </td>
            </tr>
            <tr>
              <td className="border border-slate-300 p-2">Nama</td>
              <td className="border border-slate-300 p-2 text-center">:</td>
              <td className="border border-slate-300 p-2">
                <input
                  type="text"
                  disabled={props.readOnly || props.isAsesi}
                  className="w-full outline-none bg-transparent"
                  value={String(asesorName || "")}
                  onChange={(e) => handleAsesorNameChange(e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td className="border border-slate-300 p-2">No. Reg</td>
              <td className="border border-slate-300 p-2 text-center">:</td>
              <td className="border border-slate-300 p-2">
                <input
                  type="text"
                  disabled={props.readOnly || props.isAsesi}
                  className="w-full outline-none bg-transparent"
                  value={asesorReg}
                  onChange={(e) => handleAsesorRegChange(e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td className="border border-slate-300 p-2">
                Tanda tangan dan Tanggal
              </td>
              <td className="border border-slate-300 p-2 text-center">:</td>
              <td className="border border-slate-300 p-2">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
                  <div
                    className="flex-1 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() =>
                      !props.readOnly &&
                      !props.isAsesi &&
                      setIsAsesorSigModalOpen(true)
                    }
                  >
                    {asesorSignature ? (
                      <img
                        src={asesorSignature}
                        alt="TTD Asesor"
                        className="h-full object-contain"
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">
                        Klik untuk tanda tangan
                      </span>
                    )}
                  </div>
                  <input
                    type="date"
                    disabled={props.readOnly || props.isAsesi}
                    className="w-full sm:w-40 outline-none bg-transparent border-b border-slate-300 pb-1"
                    value={asesorDate}
                    onChange={(e) => handleAsesorDateChange(e.target.value)}
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Penyusun dan Validator */}
      <div className="mt-8 border border-slate-300 bg-white text-sm">
        <div className="font-bold p-2">PENYUSUN DAN VALIDATOR</div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-137.5">
            <thead>
              <tr className="bg-white border-b border-slate-300 text-center">
                <th className="border border-slate-300 p-2 w-1/4">STATUS</th>
                <th className="border border-slate-300 p-2 w-12">NO</th>
                <th className="border border-slate-300 p-2">NAMA</th>
                <th className="border border-slate-300 p-2 w-1/4">NOMOR MET</th>
                <th className="border border-slate-300 p-2 w-1/4">
                  TANDA TANGAN DAN TANGGAL
                </th>
              </tr>
            </thead>
            <tbody>
              {penyusun.map((p, idx) => (
                <tr key={"p4-" + idx}>
                  {idx === 0 && (
                    <td
                      className="border border-slate-300 p-2 text-center align-top font-bold"
                      rowSpan={penyusun.length}
                    >
                      PENYUSUN
                    </td>
                  )}
                  <td className="border border-slate-300 p-2 text-center">
                    {idx + 1}
                  </td>
                  <td className="border border-slate-300 p-2">
                    <input
                      type="text"
                      disabled={props.readOnly || props.isAsesi}
                      className="w-full outline-none bg-transparent"
                      value={String(p.nama || "")}
                      onChange={(e) =>
                        handlePenyusunChangeInternal(
                          idx,
                          "nama",
                          e.target.value,
                        )
                      }
                    />
                  </td>
                  <td className="border border-slate-300 p-2">
                    <input
                      type="text"
                      disabled={props.readOnly || props.isAsesi}
                      className="w-full outline-none bg-transparent text-center"
                      value={p.noMet}
                      onChange={(e) =>
                        handlePenyusunChangeInternal(
                          idx,
                          "noMet",
                          e.target.value,
                        )
                      }
                    />
                  </td>
                  <td className="border border-slate-300 p-2">
                    <input
                      type="text"
                      disabled={props.readOnly || props.isAsesi}
                      className="w-full outline-none bg-transparent text-center"
                      value={String(p.ttdTanggal || "")}
                      onChange={(e) =>
                        handlePenyusunChangeInternal(
                          idx,
                          "ttdTanggal",
                          e.target.value,
                        )
                      }
                    />
                  </td>
                </tr>
              ))}
              {validator.map((v, idx) => (
                <tr key={"v4-" + idx}>
                  {idx === 0 && (
                    <td
                      className="border border-slate-300 p-2 text-center align-top font-bold"
                      rowSpan={validator.length}
                    >
                      VALIDATOR
                    </td>
                  )}
                  <td className="border border-slate-300 p-2 text-center">
                    {idx + 1}
                  </td>
                  <td className="border border-slate-300 p-2">
                    <input
                      type="text"
                      disabled={props.readOnly || props.isAsesi}
                      className="w-full outline-none bg-transparent"
                      value={v.nama}
                      onChange={(e) =>
                        handleValidatorChangeInternal(
                          idx,
                          "nama",
                          e.target.value,
                        )
                      }
                    />
                  </td>
                  <td className="border border-slate-300 p-2">
                    <input
                      type="text"
                      disabled={props.readOnly || props.isAsesi}
                      className="w-full outline-none bg-transparent text-center"
                      value={v.noMet}
                      onChange={(e) =>
                        handleValidatorChangeInternal(
                          idx,
                          "noMet",
                          e.target.value,
                        )
                      }
                    />
                  </td>
                  <td className="border border-slate-300 p-2">
                    <input
                      type="text"
                      disabled={props.readOnly || props.isAsesi}
                      className="w-full outline-none bg-transparent text-center"
                      value={v.ttdTanggal}
                      onChange={(e) =>
                        handleValidatorChangeInternal(
                          idx,
                          "ttdTanggal",
                          e.target.value,
                        )
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Navigation */}
      {(props.onPrev || props.onNext) && (
        <div className="mt-8 flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center gap-3">
          {props.onPrev ? (
            <button
              type="button"
              onClick={props.onPrev}
              className="border border-slate-300 px-6 py-2.5 font-semibold text-sm hover:bg-slate-50 flex items-center gap-2"
            >
              <ArrowLeft size={16} /> Kembali
            </button>
          ) : (
            <div />
          )}
          {props.onNext && (
            <button
              type="button"
              onClick={props.onNext}
              disabled={props.isNextDisabled}
              className="bg-slate-900 text-white px-6 py-2.5 font-semibold text-sm hover:bg-slate-800 disabled:opacity-50 flex items-center gap-2"
            >
              {props.nextLabel || "Lanjut Finalisasi"}{" "}
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      )}

      {/* Signature Modals */}
      <SignatureModal
        isOpen={isAsesiSigModalOpen}
        onClose={() => setIsAsesiSigModalOpen(false)}
        title="Tanda Tangan Asesi"
        initialSignature={asesiSignature}
        onSave={(dataUrl) => {
          handleAsesiSignatureChange(dataUrl);
        }}
      />

      <SignatureModal
        isOpen={isAsesorSigModalOpen}
        onClose={() => setIsAsesorSigModalOpen(false)}
        title="Tanda Tangan Asesor"
        initialSignature={asesorSignature}
        onSave={(dataUrl) => {
          handleAsesorSignatureChange(dataUrl);
        }}
      />
    </div>
  );
}
