import React from 'react';
import { FormFRAPL02 } from '@/components/forms/FormFRAPL02';
import { EvidenceFileItem } from '@/types/types';

export interface EFormApl02FormData {
  id?: string | number;
  isAdmin?: boolean;
  kompetensi?: Record<string, string>;
  metode?: string;
  status?: string;
  namaLengkap?: string;
  skema?: string;
  nomorSkema?: string;
  tuk?: string;
  tanggal?: string;
  schemeDetail?: {
    name?: string;
    code?: string;
    units?: Array<{
      code: string;
      title: string;
      elemen?: Array<{
        title: string;
        kuk: string[];
      }>;
    }>;
  };
  asesorName?: string;
  asesorReg?: string;
  readOnly?: boolean;
  ttdAsesi?: string;
  signature?: string;
  ttdAsesor?: string;
  rekomendasiApl02?: "Dapat dilanjutkan" | "Tidak dapat dilanjutkan" | "";
  penyusun?: Array<{ nama: string; noMet: string; ttdTanggal: string }>;
  validator?: Array<{ nama: string; noMet: string; ttdTanggal: string }>;
  [key: string]: unknown;
}

export interface EFormApl02Props {
  formData: EFormApl02FormData;
  onChange: (val: EFormApl02FormData) => void;
  allData?: Record<string, EvidenceFileItem | File | string>;
}

export function EFormApl02({ formData, onChange, allData = {} }: EFormApl02Props) {
  const toggleK = (id: string, isK: boolean) => {
    if (formData.isAdmin) return; // Prevent changing competencies if admin
    const kData = formData.kompetensi || {};
    onChange({
      ...formData,
      kompetensi: {
        ...kData,
        [id]: isK ? 'K' : 'BK'
      }
    });
  };

  return (
    <div className="w-full bg-white">
      <FormFRAPL02
        asesmenData={{
          id: Number(formData.id) || 0,
          metode: formData.metode || '',
          status: formData.status || '',
          nama: formData.namaLengkap || 'AHMAD FAUZI',
          skema: formData.skema || formData.schemeDetail?.name || 'Pengelolaan Pinjaman / Pembiayaan',
          noSkema: formData.nomorSkema || formData.schemeDetail?.code || '006/SKM/LSP-KJN/II/2023',
          tuk: formData.tuk || 'Mandiri',
          tanggal: formData.tanggal || new Date().toLocaleDateString('en-GB'),
          schemeDetail: formData.schemeDetail,
          asesor: formData.asesorName,
          asesorReg: formData.asesorReg
        }}
        units={formData.schemeDetail?.units?.map(u => ({ ...u, elemen: u.elemen || [] }))}
        answers={(formData.kompetensi as Record<string, "K" | "BK">) || {}}
        onAnswerChange={(key, val) => toggleK(key, val === 'K')}
        evidenceFiles={allData}
        readOnly={formData.readOnly || formData.isAdmin}
        isAsesi={!formData.isAdmin}
        asesiName={formData.namaLengkap || 'AHMAD FAUZI'}
        asesiSignature={typeof formData.ttdAsesi === 'string' ? formData.ttdAsesi : (formData.signature || formData.namaLengkap)}
        onAsesiSignatureChange={(sig) => !formData.isAdmin && onChange({ ...formData, ttdAsesi: sig })}
        asesorName={formData.asesorName}
        asesorReg={formData.asesorReg}
        asesorSignature={formData.ttdAsesor}
        onAsesorSignatureChange={(sig) => formData.isAdmin && onChange({ ...formData, ttdAsesor: sig })}
        rekomendasi={formData.rekomendasiApl02}
        onRekomendasiChange={(val) => formData.isAdmin && onChange({ ...formData, rekomendasiApl02: val })}
        penyusun={formData.penyusun}
        onPenyusunChange={(val) => formData.isAdmin && onChange({ ...formData, penyusun: val })}
        validator={formData.validator}
        onValidatorChange={(val) => formData.isAdmin && onChange({ ...formData, validator: val })}
      />
    </div>
  );
}
