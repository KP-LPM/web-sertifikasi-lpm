import React, { useState, useEffect } from "react";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { FormHeader } from "./FormHeader";
import { SignatureModal } from "./SignatureModal";
import { Apl02FormData, PenyusunValidatorItem } from "@/types/types";
import {
  getKonfigurasiPertanyaanList,
  getKonfigurasiPertanyaanDetail,
  getSkemaDetail,
} from "@/lib/api";

export interface FormFRIA04AProps {
  asesmenData?: Apl02FormData;
  skemaId?: number;
  konfigurasiId?: number;
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
  penyusun?: PenyusunValidatorItem[];
  onPenyusunChange?: (penyusun: PenyusunValidatorItem[]) => void;
  validator?: PenyusunValidatorItem[];
  onValidatorChange?: (validator: PenyusunValidatorItem[]) => void;
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

  const [localPenyusun, setLocalPenyusun] = useState<PenyusunValidatorItem[]>(
    [],
  );
  const [localValidator, setLocalValidator] = useState<PenyusunValidatorItem[]>(
    [],
  );
  const [isAsesiSigModalOpen, setIsAsesiSigModalOpen] = useState(false);
  const [isAsesorSigModalOpen, setIsAsesorSigModalOpen] = useState(false);
  const [isSupervisorSigModalOpen, setIsSupervisorSigModalOpen] =
    useState(false);

  const [apiStep2, setApiStep2] = useState<{
    skenario?: string;
    informasi?: string[];
    lingkup?: string[];
    perlengkapan?: string;
    fokus?: string[];
    waktu?: string;
  } | null>(null);
  const [apiUnits, setApiUnits] = useState<{ code: string; title: string }[]>(
    [],
  );

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        let conf = null;
        if (props.konfigurasiId) {
          conf = await getKonfigurasiPertanyaanDetail(props.konfigurasiId);
        } else if (props.skemaId) {
          const list = await getKonfigurasiPertanyaanList({
            skemaId: props.skemaId,
          });
          if (Array.isArray(list) && list.length > 0) conf = list[0];
        }

        if (isMounted && conf && conf.step2) {
          const s2 = conf.step2;
          setApiStep2({
            skenario: s2.skenario_studi_kasus || undefined,
            informasi: Array.isArray(s2.informasi_yang_diberikan)
              ? s2.informasi_yang_diberikan
              : [],
            lingkup: Array.isArray(s2.lingkup_bahasan_studi_kasus)
              ? s2.lingkup_bahasan_studi_kasus
              : [],
            perlengkapan: s2.perlengkapan_dan_bahan || undefined,
            fokus: Array.isArray(s2.fokus_presentasi)
              ? s2.fokus_presentasi
              : [],
            waktu: s2.ketentuan_alokasi_waktu || undefined,
          });
        }
      } catch (err) {
        console.warn("Using fallback step2 scenario:", err);
      }

      if (props.skemaId) {
        try {
          const skemaRes = await getSkemaDetail(props.skemaId);
          if (
            isMounted &&
            skemaRes?.unitKompetensi &&
            Array.isArray(skemaRes.unitKompetensi)
          ) {
            setApiUnits(
              skemaRes.unitKompetensi.map((u: Record<string, unknown>) => ({
                code: (u.kodeUnit as string) || (u.kode as string) || "",
                title: (u.judulUnit as string) || (u.judul as string) || "",
              })),
            );
          }
        } catch (err) {
          console.warn("Using fallback units:", err);
        }
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, [props.konfigurasiId, props.skemaId]);

  const displayUnits =
    apiUnits.length > 0
      ? apiUnits
      : props.asesmenData?.schemeDetail?.units &&
          props.asesmenData.schemeDetail.units.length > 0
        ? props.asesmenData.schemeDetail.units.map((u) => {
            const item = u as Record<string, unknown>;
            return {
              code:
                (item.code as string) ||
                (item.unitCode as string) ||
                (item.kodeUnit as string) ||
                "",
              title:
                (item.title as string) ||
                (item.unitTitle as string) ||
                (item.judulUnit as string) ||
                "",
            };
          })
        : [
            {
              code: "M.74PEN01.002.1",
              title:
                "Mencari Makna Kata dan Ungkapan dalam Teks Bahasa Asal Menggunakan Alat Bantu Penerjemahan Konvensional dan Nonkonvensional",
            },
            {
              code: "M.74PEN01.008.1",
              title:
                "Memilih Metode yang Tepat Sesuai dengan Teks atau Bagian Teks yang Sedang Diterjemahkan",
            },
            {
              code: "M.74PEN01.009.1",
              title:
                "Memilih Teknik Penerjemahan Untuk Kata, Frasa, Klausa, dan Kalimat dalam Teks Asal",
            },
          ];

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
    const updated = [...penyusun];
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
              {displayUnits.map((u, idx) => (
                <tr key={idx}>
                  {idx === 0 && (
                    <td
                      className="border border-slate-300 p-3 text-center align-top font-bold"
                      rowSpan={displayUnits.length}
                    >
                      Kelompok Pekerjaan 1
                    </td>
                  )}
                  <td className="border border-slate-300 p-3 text-center font-mono text-xs">
                    {u.code}
                  </td>
                  <td className="border border-slate-300 p-3">{u.title}</td>
                </tr>
              ))}
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
                  {apiStep2?.skenario ? (
                    <p className="whitespace-pre-line leading-relaxed text-slate-800">
                      {apiStep2.skenario}
                    </p>
                  ) : (
                    <>
                      <p>
                        Anda seorang asesi mengajukan permohonan uji kompetensi
                        untuk skema Sertifikasi dengan persyaratan telah
                        menyelesaikan magang atau memiliki pengalaman kerja di
                        bidang terkait. Sebagai praktisi, Anda harus memiliki
                        kompetensi untuk menyelesaikan pekerjaan secara terstruktur,
                        akurat, dan berterima sesuai standar kompetensi.
                      </p>
                      <p>
                        Sebuah proyek implementasi memerlukan analisis mendalam
                        dan metode kerja yang sesuai dengan target pengguna dan
                        kebutuhan operasional. Anda diminta untuk membuat
                        presentasi singkat dalam bentuk studi kasus terkait proyek
                        ini di hadapan tim asesor.
                      </p>
                    </>
                  )}

                  <div>
                    <span className="font-bold">
                      Informasi yang diberikan kepada anda berupa:
                    </span>
                    <ul className="list-[lower-alpha] list-inside font-normal mt-1 space-y-1 mb-4">
                      {apiStep2?.informasi && apiStep2.informasi.length > 0 ? (
                        apiStep2.informasi.map((info, idx) => (
                          <li key={idx}>{info}</li>
                        ))
                      ) : (
                        <>
                          <li>Dokumen acuan dan spesifikasi kerja</li>
                          <li>Profil pemangku kepentingan / sasaran</li>
                          <li>Instruksi pelaksanaan dari pengguna jasa/klien</li>
                          <li>Glosarium dan referensi standar industri</li>
                          <li>Referensi perangkat lunak / alat bantu</li>
                        </>
                      )}
                    </ul>
                  </div>

                  <div>
                    <span className="font-bold">
                      Lingkup bahasan studi kasus ini meliputi:
                    </span>
                    <ol className="list-decimal list-inside font-normal mt-1 space-y-1 mb-4">
                      {apiStep2?.lingkup && apiStep2.lingkup.length > 0 ? (
                        apiStep2.lingkup.map((lng, idx) => (
                          <li key={idx}>{lng}</li>
                        ))
                      ) : (
                        <>
                          <li>
                            Identifikasi kebutuhan dan alat bantu kerja
                          </li>
                          <li>Pemilihan metode pelaksanaan yang tepat</li>
                          <li>
                            Penerapan teknik pemecahan masalah dan standardisasi
                          </li>
                        </>
                      )}
                    </ol>
                  </div>

                  <p>
                    Karya tulis studi kasus ini dipresentasikan didepan tim
                    asesor yang ditugaskan LSP. Dalam mempresentasikan karya
                    tulis terkait kasus di atas, anda dilengkapi dengan:
                  </p>
                  {apiStep2?.perlengkapan ? (
                    <div className="whitespace-pre-line text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200">
                      {apiStep2.perlengkapan}
                    </div>
                  ) : (
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
                  )}

                  <p>
                    {apiStep2?.waktu ||
                      "Anda diberikan waktu 60 menit untuk mengerjakan studi kasus di atas dalam bentuk bahan presentasi dalam bentuk power point (ppt) maksimal 10 halaman"}
                  </p>
                  <p>
                    Hasil dari presentasi adalah penilaian hasil kerja, metode
                    yang digunakan, dan justifikasi teknik penyelesaian.
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
                        {apiStep2?.fokus && apiStep2.fokus.length > 0 ? (
                          apiStep2.fokus.map((fok, idx) => (
                            <li key={idx}>{fok}</li>
                          ))
                        ) : (
                          <>
                            <li>
                              Pemahaman terhadap kebutuhan masalah dan alat kerja
                            </li>
                            <li>Pemilihan metode yang relevan</li>
                            <li>Penerapan teknik yang tepat dan akurat</li>
                          </>
                        )}
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
