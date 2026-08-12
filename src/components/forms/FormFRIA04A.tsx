import React, { useState } from "react";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { FormHeader } from "./FormHeader";
import { SignatureModal } from "./SignatureModal";
import { Assessment, PenyusunValidator } from "@/types/types";

export interface FormFRIA04AProps {
  asesmenData?: Assessment;
  umpanBalik?: string;
  onUmpanBalikChange?: (val: string) => void;
  asesiSignature?: string;
  onAsesiSignatureChange?: (val: string) => void;
  asesorSignature?: string;
  onAsesorSignatureChange?: (val: string) => void;
  supervisorName?: string;
  onSupervisorNameChange?: (val: string) => void;
  supervisorSignature?: string;
  onSupervisorSignatureChange?: (val: string) => void;
  penyusun?: Array<{ nama: string; noMet: string; ttdTanggal: string }>;
  onPenyusunChange?: (
    penyusun: Array<{ nama: string; noMet: string; ttdTanggal: string }>,
  ) => void;
  validator?: Array<{ nama: string; noMet: string; ttdTanggal: string }>;
  onValidatorChange?: (
    validator: Array<{ nama: string; noMet: string; ttdTanggal: string }>,
  ) => void;
  readOnly?: boolean;
  isAsesi?: boolean;
  showHeader?: boolean;
  onNext?: () => void;
  onPrev?: () => void;
  isNextDisabled?: boolean;
}

export function FormFRIA04A(props: FormFRIA04AProps) {
  const [localUmpanBalik, setLocalUmpanBalik] = useState("");
  const [localAsesiSig, setLocalAsesiSig] = useState("");
  const [localAsesorSig, setLocalAsesorSig] = useState("");
  const [localSupervisorName, setLocalSupervisorName] = useState("");
  const [localSupervisorSig, setLocalSupervisorSig] = useState("");

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
  const [isSupervisorSigModalOpen, setIsSupervisorSigModalOpen] =
    useState(false);

  const umpanBalik =
    props.umpanBalik !== undefined ? props.umpanBalik : localUmpanBalik;
  const asesiSignature =
    props.asesiSignature !== undefined ? props.asesiSignature : localAsesiSig;
  const asesorSignature =
    props.asesorSignature !== undefined
      ? props.asesorSignature
      : localAsesorSig;
  const supervisorName =
    props.supervisorName !== undefined
      ? props.supervisorName
      : localSupervisorName;
  const supervisorSignature =
    props.supervisorSignature !== undefined
      ? props.supervisorSignature
      : localSupervisorSig;
  const penyusun = props.penyusun || localPenyusun;
  const validator = props.validator || localValidator;

  const handlePenyusunChangeInternal = (
    idx: number,
    field: string,
    val: string,
  ) => {
    const updated = [...(penyusun as PenyusunValidator[])];
    updated[idx] = { ...updated[idx], [field]: val };
    if (props.onPenyusunChange) {
      props.onPenyusunChange(updated);
    } else {
      setLocalPenyusun(updated);
    }
  };

  const handleValidatorChangeInternal = (
    idx: number,
    field: string,
    val: string,
  ) => {
    const updated = [...validator];
    updated[idx] = { ...updated[idx], [field]: val };
    if (props.onValidatorChange) {
      props.onValidatorChange(updated);
    } else {
      setLocalValidator(updated);
    }
  };

  return (
    <div className="animate-in fade-in duration-300">
      {props.showHeader !== false && (
        <FormHeader
          title="DAFTAR INSTRUKSI TERSTRUKTUR (PENJELASAN PROYEK SINGKAT/ KEGIATAN TERSTRUKTUR LAINNYA*)"
          formCode="FR.IA.04A"
          asesmenData={props.asesmenData}
        />
      )}

      {/* Guide Box */}
      <div className="border border-slate-300 mb-6 bg-white">
        <div className="border-b border-slate-300 p-2 bg-white font-bold text-sm">
          PANDUAN BAGI ASESOR
        </div>
        <div className="p-4 text-xs md:text-sm space-y-2">
          <ul className="list-disc pl-5 space-y-1 text-slate-800 font-medium">
            <li>
              Tentukan proyek singkat atau kegiatan terstruktur lainnya yang
              harus dipersiapkan dan dipresentasikan oleh asesi.
            </li>
            <li>
              Proyek singkat atau kegiatan terstruktur lainnya dibuat untuk
              keseluruhan unit kompetensi dalam Skema Sertifikasi atau untuk
              masing-masing kelompok pekerjaan.
            </li>
            <li>
              Kumpulkan hasil proyek singkat atau kegiatan terstruktur lainnya
              sesuai dengan hasil keluaran yang telah ditetapkan.
            </li>
          </ul>
        </div>
      </div>

      <div className="space-y-6 text-sm">
        {/* Table Kelompok Pekerjaan */}
        <div className="border border-slate-300 overflow-x-auto">
          <table className="w-full border-collapse min-w-150">
            <thead>
              <tr className="bg-white border-b border-slate-300">
                <th className="border border-slate-300 p-3">
                  Kelompok Pekerjaan 1
                </th>
                <th className="border border-slate-300 p-3">Kode Unit</th>
                <th className="border border-slate-300 p-3 text-left">
                  Judul Unit
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  className="border border-slate-300 p-3 text-center align-top font-bold"
                  rowSpan={5}
                >
                  Kelompok Pekerjaan 1
                </td>
                <td className="border border-slate-300 p-3 text-center font-mono text-xs">
                  M.74PEN01.002.1
                </td>
                <td className="border border-slate-300 p-3">
                  Mencari Makna Kata dan Ungkapan dalam Teks Bahasa Asal
                  Menggunakan Alat Bantu Penerjemahan Konvensional dan
                  Nonkonvensional
                </td>
              </tr>
              <tr>
                <td className="border border-slate-300 p-3 text-center font-mono text-xs">
                  M.74PEN01.008.1
                </td>
                <td className="border border-slate-300 p-3">
                  Memilih Metode yang Tepat Sesuai dengan Teks atau Bagian Teks
                  yang Sedang Diterjemahkan
                </td>
              </tr>
              <tr>
                <td className="border border-slate-300 p-3 text-center font-mono text-xs">
                  M.74PEN01.009.1
                </td>
                <td className="border border-slate-300 p-3">
                  Memilih Teknik Penerjemahan Untuk Kata, Frasa, Klausa, dan
                  Kalimat dalam Teks Asal
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Instructions & Study Case */}
        <div className="border border-slate-300 overflow-x-auto">
          <table className="w-full border-collapse">
            <tbody>
              <tr>
                <td className="border border-slate-300 p-4 font-bold w-1/3 align-top">
                  Hal yang harus disiapkan atau dilakukan atau dihasilkan untuk
                  suatu proyek singkat/ kegiatan terstruktur lainnya
                </td>
                <td className="border border-slate-300 p-4 align-top space-y-3">
                  <p>
                    Anda seorang asesi mengajukan permohonan uji kompetensi
                    untuk skema Penerjemah Teks Umum dengan persyaratan telah
                    menyelesaikan magang atau memiliki pengalaman kerja di
                    bidang penerjemahan. Sebagai penerjemah, Anda harus memiliki
                    kompetensi untuk menerjemahkan teks dari bahasa sumber ke
                    bahasa sasaran dengan akurat dan berterima.
                  </p>
                  <p>
                    Sebuah penerbit buku di Jakarta berencana untuk
                    menerjemahkan sebuah buku panduan teknis dan artikel ilmiah
                    populer dari Bahasa Inggris ke Bahasa Indonesia. Proyek ini
                    membutuhkan akurasi tinggi dan metode penerjemahan yang
                    sesuai dengan target pembaca umum dan akademisi. Anda
                    diminta untuk membuat presentasi singkat dalam bentuk studi
                    kasus terkait proyek penerjemahan ini sebagai Penerjemah
                    Teks Umum.
                  </p>
                  <div>
                    <span className="font-bold">
                      Informasi yang diberikan kepada anda berupa:
                    </span>
                    <ul className="list-[lower-alpha] list-inside font-normal mt-1 space-y-1 mb-4">
                      <li>Teks sumber (Bahasa Inggris)</li>
                      <li>Profil pembaca sasaran</li>
                      <li>Instruksi penerjemahan dari klien</li>
                      <li>Glosarium istilah teknis</li>
                      <li>
                        Referensi alat bantu penerjemahan (konvensional &
                        nonkonvensional)
                      </li>
                    </ul>
                  </div>
                  <div>
                    <span className="font-bold">
                      Lingkup bahasan studi kasus ini meliputi:
                    </span>
                    <ol className="list-decimal list-inside font-normal mt-1 space-y-1 mb-4">
                      <li>
                        Mencari Makna Kata dan Ungkapan menggunakan alat bantu
                      </li>
                      <li>Memilih Metode Penerjemahan yang Tepat</li>
                      <li>
                        Memilih Teknik Penerjemahan (kata, frasa, klausa,
                        kalimat)
                      </li>
                    </ol>
                  </div>
                  <p>
                    Karya tulis studi kasus ini dipresentasikan didepan tim
                    asesor yang ditugaskan LSP. Dalam mempresentasikan karya
                    tulis terkait kasus di atas, anda dilengkapi dengan:
                  </p>
                  <ol className="list-decimal list-inside font-normal mt-1 space-y-1 mb-4">
                    <li>
                      Peralatan : Laptop, LCD dan layar, microphone untuk asesor
                      dan peserta uji, alat penghitung waktu (Stop watch,
                      ponsel)
                    </li>
                    <li>
                      Bahan-bahan yang diperlukan untuk presentasi: kertas HVS,
                      Balpoin, lembar asesmen studi kasus.
                    </li>
                  </ol>
                  <p>
                    Anda diberikan waktu 60 menit untuk mengerjakan studi kasus
                    di atas dalam bentuk bahan presentasi dalam bentuk power
                    point (ppt) maksimal 10 halaman
                  </p>
                  <p>
                    Hasil dari presentasi adalah penilaian hasil terjemahan,
                    metode yang digunakan, dan justifikasi pemilihan teknik
                    penerjemahan.
                  </p>
                </td>
              </tr>
              <tr>
                <td className="border border-slate-300 p-4 font-bold align-top">
                  Hal yang perlu didemonstrasikan /dipresentasikan
                </td>
                <td className="border border-slate-300 p-4 align-top">
                  <ol className="list-decimal list-inside space-y-2">
                    <li>
                      Presentasikanlah pekerjaan saudara berupa studi kasus di
                      hadapan tim asesor.
                    </li>
                    <li>
                      Fokus presentasi saudara adalah:
                      <ul className="list-[lower-alpha] list-inside ml-4 mt-1">
                        <li>
                          Pencarian makna kata dan ungkapan dengan alat bantu
                        </li>
                        <li>Pemilihan metode penerjemahan berdasarkan teks</li>
                        <li>Penerapan teknik penerjemahan yang tepat</li>
                      </ul>
                    </li>
                    <li>
                      Presentasi terbagi atas 2 bagian, yaitu penyajian dan
                      tanya jawab. Waktu presentasi adalah 30 menit, yang
                      diikuti dengan tanya jawab 30 menit. Total waktu bagi
                      seorang peserta uji dalam presentasi adalah 60 menit.
                    </li>
                    <li>
                      Jawablah pertanyaan-pertanyan yang dikemukakan oleh tim
                      asesmen yang meliputi:
                      <ul className="list-[lower-alpha] list-inside ml-4 mt-1">
                        <li>Ketepatan jawaban</li>
                        <li>Penguasaan solusi kasus</li>
                        <li>Rasionalitas penyelesaian kasus</li>
                        <li>
                          Cara menjawab (Argumentasi, Kesantunan, Bahasa Tutur)
                        </li>
                      </ul>
                    </li>
                  </ol>
                </td>
              </tr>
              <tr>
                <td
                  className="border border-slate-300 p-4 align-top"
                  colSpan={2}
                >
                  <div className="flex flex-col h-full">
                    <span className="mb-2 font-bold">
                      Umpan Balik Untuk Asesi:
                    </span>
                    <textarea
                      disabled={props.readOnly || props.isAsesi}
                      className="w-full border border-slate-300 outline-none focus:border-slate-800 p-2 text-sm bg-transparent flex-1 min-h-20"
                      placeholder="Masukkan umpan balik..."
                      value={umpanBalik}
                      onChange={(e) =>
                        props.onUmpanBalikChange
                          ? props.onUmpanBalikChange(e.target.value)
                          : setLocalUmpanBalik(e.target.value)
                      }
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td colSpan={2} className="p-0 border border-slate-300">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse min-w-137.5">
                      <tbody>
                        <tr>
                          <td className="border-r border-slate-300 p-4 w-1/3 align-top">
                            <div className="font-bold mb-2">
                              Tanda Tangan Asesi
                            </div>
                            {asesiSignature ? (
                              <img
                                src={asesiSignature}
                                alt="Tanda Tangan Asesi"
                                className="h-20 object-contain cursor-pointer"
                                onClick={() =>
                                  !props.readOnly &&
                                  setIsAsesiSigModalOpen(true)
                                }
                              />
                            ) : (
                              <button
                                type="button"
                                disabled={props.readOnly}
                                onClick={() => setIsAsesiSigModalOpen(true)}
                                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 text-xs font-bold rounded"
                              >
                                Tanda Tangan Asesi
                              </button>
                            )}
                          </td>
                          <td className="border-r border-slate-300 p-4 w-1/3 align-top">
                            <div className="font-bold mb-2">
                              Tanda Tangan Asesor
                            </div>
                            {asesorSignature ? (
                              <img
                                src={asesorSignature}
                                alt="Tanda Tangan Asesor"
                                className="h-20 object-contain cursor-pointer"
                                onClick={() =>
                                  !props.readOnly &&
                                  !props.isAsesi &&
                                  setIsAsesorSigModalOpen(true)
                                }
                              />
                            ) : (
                              <button
                                type="button"
                                disabled={props.readOnly || props.isAsesi}
                                onClick={() => setIsAsesorSigModalOpen(true)}
                                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 text-xs font-bold rounded"
                              >
                                Tanda Tangan Asesor
                              </button>
                            )}
                          </td>
                          <td className="p-4 w-1/3 align-top">
                            <div className="font-bold mb-2">
                              Nama & Tanda Tangan Supervisor (Jika ada)
                            </div>
                            <input
                              type="text"
                              disabled={props.readOnly || props.isAsesi}
                              className="w-full border-b border-slate-300 outline-none focus:border-slate-800 text-sm mb-2 bg-transparent py-1"
                              placeholder="Nama Supervisor..."
                              value={supervisorName}
                              onChange={(e) =>
                                props.onSupervisorNameChange
                                  ? props.onSupervisorNameChange(e.target.value)
                                  : setLocalSupervisorName(e.target.value)
                              }
                            />
                            {supervisorSignature ? (
                              <img
                                src={supervisorSignature}
                                alt="Tanda Tangan Supervisor"
                                className="h-20 object-contain cursor-pointer"
                                onClick={() =>
                                  !props.readOnly &&
                                  setIsSupervisorSigModalOpen(true)
                                }
                              />
                            ) : (
                              <button
                                type="button"
                                disabled={props.readOnly || props.isAsesi}
                                onClick={() =>
                                  setIsSupervisorSigModalOpen(true)
                                }
                                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 text-xs font-bold rounded"
                              >
                                Tanda Tangan Supervisor
                              </button>
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-700 italic">
          *) Apabila asesi pada Level 4 ke atas, berikan tugas proyek yang
          meliputi tentang pemecahan masalah dan analisa
        </p>

        {/* Penyusun & Validator */}
        <div>
          <h3 className="font-bold mb-2">PENYUSUN DAN VALIDATOR</h3>
          <div className="border border-slate-300 overflow-x-auto">
            <table className="w-full border-collapse text-center min-w-137.5">
              <thead>
                <tr className="bg-white border-b border-slate-300">
                  <th className="border-r border-slate-300 p-2">STATUS</th>
                  <th className="border-r border-slate-300 p-2 w-12">NO</th>
                  <th className="border-r border-slate-300 p-2">NAMA</th>
                  <th className="border-r border-slate-300 p-2">NOMOR MET</th>
                  <th className="p-2">TANDA TANGAN DAN TANGGAL</th>
                </tr>
              </thead>
              <tbody>
                {penyusun.map((p, idx) => (
                  <tr key={"p2-" + idx} className="border-b border-slate-300">
                    {idx === 0 && (
                      <td
                        className="border-r border-slate-300 p-2 font-bold"
                        rowSpan={penyusun.length}
                      >
                        PENYUSUN
                      </td>
                    )}
                    <td className="border-r border-slate-300 p-2">{idx + 1}</td>
                    <td className="border-r border-slate-300 p-2">
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
                    <td className="border-r border-slate-300 p-2">
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
                    <td className="p-2 text-center">
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
                  <tr
                    key={"v2-" + idx}
                    className={
                      idx === validator.length - 1
                        ? ""
                        : "border-b border-slate-300"
                    }
                  >
                    {idx === 0 && (
                      <td
                        className="border-r border-slate-300 p-2 font-bold"
                        rowSpan={validator.length}
                      >
                        VALIDATOR
                      </td>
                    )}
                    <td className="border-r border-slate-300 p-2">{idx + 1}</td>
                    <td className="border-r border-slate-300 p-2">
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
                    <td className="border-r border-slate-300 p-2">
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
                    <td className="p-2 text-center">
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
              Lanjut ke Step 3 <ChevronRight size={16} />
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
          if (props.onAsesiSignatureChange)
            props.onAsesiSignatureChange(dataUrl);
          else setLocalAsesiSig(dataUrl);
        }}
      />

      <SignatureModal
        isOpen={isAsesorSigModalOpen}
        onClose={() => setIsAsesorSigModalOpen(false)}
        title="Tanda Tangan Asesor"
        initialSignature={asesorSignature}
        onSave={(dataUrl) => {
          if (props.onAsesorSignatureChange)
            props.onAsesorSignatureChange(dataUrl);
          else setLocalAsesorSig(dataUrl);
        }}
      />

      <SignatureModal
        isOpen={isSupervisorSigModalOpen}
        onClose={() => setIsSupervisorSigModalOpen(false)}
        title="Tanda Tangan Supervisor"
        initialSignature={supervisorSignature}
        onSave={(dataUrl) => {
          if (props.onSupervisorSignatureChange)
            props.onSupervisorSignatureChange(dataUrl);
          else setLocalSupervisorSig(dataUrl);
        }}
      />
    </div>
  );
}
