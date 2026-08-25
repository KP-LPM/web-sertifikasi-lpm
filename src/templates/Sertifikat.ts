export interface UnitKompetensiItem {
  no: number;
  kodeUnit: string;
  judulUnitId: string;
  judulUnitEn: string;
}

export interface SertifikatPayload {
  nomorSertifikat: string;
  nomorRegistrasi: string;
  namaPemegang: string;
  bidangId: string;
  bidangEn: string;
  kualifikasiId: string;
  kualifikasiEn: string;
  kotaTerbit: string;
  tanggalTerbitId: string;
  tanggalTerbitEn: string;
  namaDirektur: string;
  namaManajerSertifikasi: string;
  logoGarudaBase64?: string;
  fotoAsesiBase64?: string;
  ttdAsesiBase64?: string;
  ttdDirekturBase64?: string;
  ttdManajerBase64?: string;
  unitList: UnitKompetensiItem[];
}

export function generateSertifikatHtml(data: SertifikatPayload): string {
  const garudaSrc = data.logoGarudaBase64 || "/logo-garuda.png";

  const unitRowsHtml = (data.unitList || [])
    .map(
      (u) => `
    <tr>
      <td class="center" style="width: 6%;">${u.no}.</td>
      <td class="center" style="width: 25%; font-weight: bold;">${u.kodeUnit}</td>
      <td style="width: 69%;">
        <div style="font-weight: bold; font-size: 9pt;">${u.judulUnitId}</div>
        <div style="font-style: italic; color: #333; font-size: 9pt;">${u.judulUnitEn}</div>
      </td>
    </tr>
  `,
    )
    .join("");

  return `
<!doctype html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <title>Sertifikat Kompetensi - ${data.namaPemegang}</title>
    <style>
      @page {
        size: A4 portrait;
        margin: 0;
      }
      *,
      *::before,
      *::after {
        box-sizing: border-box;
      }
      body {
        font-family: "Times New Roman", Times, serif;
        color: #000;
        background-color: #fff;
        margin: 0;
        padding: 0;
        -webkit-print-color-adjust: exact;
      }
      p {
        margin: 0;
      }
      .cert-page {
        width: 210mm;
        height: 297mm;
        padding: 16mm 22mm 14mm 22mm;
        margin: 0 auto;
        background: white;
        box-sizing: border-box;
        page-break-after: always;
        position: relative;
        display: block;
      }
      .cert-page:last-child {
        page-break-after: avoid;
      }

      .center {
        text-align: center;
      }
      .italic {
        font-style: italic;
      }
      .bold {
        font-weight: bold;
      }

      /* Top Section (Header BNSP) */
      .top-section {
        text-align: center;
        margin-bottom: 0;
      }
      .logo-garuda {
        width: 70px;
        height: auto;
        margin-bottom: 6px;
      }
      .header-bnsp h2 {
        font-size: 12pt;
        margin: 0;
        letter-spacing: 0.5px;
        font-weight: normal;
      }
      .header-bnsp h3 {
        font-size: 10.5pt;
        margin: 2px 0 0 0;
        font-style: italic;
        font-weight: normal;
      }

      .cert-title h1 {
        font-size: 16pt;
        margin: 18px 0 0 0;
        font-weight: bold;
        letter-spacing: 0.5px;
      }
      .cert-title h2 {
        font-size: 14pt;
        margin: 2px 0 0 0;
        font-style: italic;
        letter-spacing: 0.5px;
        font-weight: normal;
      }
      .cert-title .cert-no {
        font-family: "Times New Roman", Times, serif;
        font-size: 12pt;
        margin-top: 14px;
      }

      /* Middle Section */
      .middle-section {
        text-align: center;
        margin-top: 26px;
      }
      .statement-id {
        font-size: 12pt;
        margin: 0;
      }
      .statement-en {
        font-size: 12pt;
        font-style: italic;
        color: #333;
        margin: 2px 0 0 0;
      }

      .holder-box {
        margin-top: 34px;
        margin-bottom: 34px;
      }
      .holder-name {
        font-size: 17pt;
        font-weight: bold;
        margin: 0 0 15px 0;
      }
      .holder-reg {
        font-size: 12pt;
        margin: 0;
      }

      .competence-box {
        margin-top: 28px;
        margin-bottom: 28px;
      }
      .competence-val-id {
        font-size: 12pt;
        font-weight: bold;
        margin-top: 25px;
      }
      .competence-val-en {
        font-size: 12pt;
        font-weight: bold;
        font-style: italic;
        color: #333;
        margin: 0;
      }

      .validity-text {
        margin-top: 32px;
      }
      .validity-text p {
        margin: 0;
        font-size: 12pt;
      }

      /* Bottom Sign Front */
      .bottom-section {
        position: absolute;
        bottom: 15mm;
        left: 20mm;
        right: 20mm;
        text-align: center;
      }
      .date-row {
        margin-top: 20px;
        margin-bottom: 20px;
        font-size: 12pt;
      }
      .sign-instansi {
        line-height: 1.35;
      }
      .sign-instansi .instansi-id {
        font-size: 12pt;
        margin: 2px 0 0 0;
      }
      .sign-space {
        height: 52px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 6px 0;
      }
      .sign-space img {
        max-height: 48px;
        width: auto;
      }
      .director-name {
        font-weight: bold;
        font-size: 10.5pt;
        margin: 0;
      }

      /* --- HALAMAN BELAKANG --- */
      .back-title {
        text-align: center;
        margin-bottom: 16px;
      }
      .back-title h2 {
        margin: 0;
        font-size: 13pt;
        font-weight: bold;
      }
      .back-title h3 {
        margin: 2px 0 0 0;
        font-size: 10pt;
        font-style: italic;
        font-weight: normal;
      }

      table.unit-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 9.5pt;
      }
      table.unit-table th,
      table.unit-table td {
        border: 1px solid #000;
        padding: 5px 7px;
        vertical-align: middle;
      }
      table.unit-table th {
        text-align: center;
        font-weight: bold;
        background-color: #f7f7f7;
      }

      /* FOOTER BELAKANG RAPAT & PROPORSIONAL */
      .back-footer-wrapper {
        position: absolute;
        bottom: 14mm;
        right: 15mm;
        display: flex;
        justify-content: flex-end;
        align-items: stretch;
        gap: 32px; /* Jarak proporsional antara kotak foto dan teks tanda tangan */
      }
      .photo-holder {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        width: 44mm;
      }
      .photo-box {
        width: 32mm;
        height: 45mm;
        border: 1.5px solid #000; /* Garis tepi tegas solid sesuai dokumen asli */
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 150px;
        background-color: #fff;
      }
      .photo-box img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .holder-sign-area {
        text-align: center;
        width: 100%;
      }
      .holder-sign-space {
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .sign-manager {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        text-align: center;
        width: 105mm;
      }
      .sign-manager-top {
        margin-top: 0;
      }
      .sign-manager-bottom {
        width: 100%;
      }
      .sign-manager-space {
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    </style>
  </head>
  <body>
    <!-- HALAMAN 1: DEPAN SERTIFIKAT -->
    <div class="cert-page">
      <div class="top-section">
        ${garudaSrc ? `<img src="${garudaSrc}" class="logo-garuda" alt="Garuda" />` : ""}
        <div class="header-bnsp">
          <h2>BADAN NASIONAL SERTIFIKASI PROFESI</h2>
          <h3>INDONESIAN PROFESSIONAL CERTIFICATION AUTHORITY</h3>
        </div>
        <div class="cert-title">
          <h1>SERTIFIKAT KOMPETENSI</h1>
          <h2>CERTIFICATE OF COMPETENCE</h2>
          <div class="cert-no">No. ${data.nomorSertifikat}</div>
        </div>
      </div>

      <div class="middle-section">
        <p class="statement-id">Dengan ini menyatakan bahwa,</p>
        <p class="statement-en">This is to certify that,</p>

        <div class="holder-box">
          <div class="holder-name">${data.namaPemegang}</div>
          <div class="holder-reg">No. Reg. ${data.nomorRegistrasi}</div>
        </div>

        <div class="competence-box">
          <p class="statement-id">Telah kompeten pada bidang:</p>
          <p class="statement-en">is competent in the area of:</p>
          <div class="competence-val-id">${data.bidangId}</div>
          <div class="competence-val-en">${data.bidangEn}</div>
        </div>

        <div class="competence-box">
          <p class="statement-id">Dengan Kualifikasi / Kompetensi:</p>
          <p class="statement-en">With Qualification / Competency:</p>
          <div class="competence-val-id">${data.kualifikasiId}</div>
          <div class="competence-val-en">${data.kualifikasiEn}</div>
        </div>

        <div class="validity-text">
          <p>Sertifikat ini berlaku untuk 3 (tiga) tahun</p>
          <p class="italic">This certificate is valid for 3 (three) years</p>
        </div>
        <div class="date-row">${data.kotaTerbit}, ${data.tanggalTerbitId}</div>

        <div class="sign-instansi">
          <p style="margin: 0; font-size: 12pt">
            Atas nama Badan Nasional Sertifikasi Profesi
          </p>
          <p
            class="italic"
            style="margin: 1px 0 0 0; font-size: 12pt; color: #222"
          >
            On Behalf of Indonesian Professional Certification Authority
          </p>
          <p class="instansi-id">
            Lembaga Sertifikasi Profesi UIN Sunan Gunung Djati Bandung
          </p>
          <p
            class="italic"
            style="font-size: 12pt; text-decoration: underline; color: #222"
          >
            Professional Certification Body of UIN Sunan Gunung Djati Bandung
          </p>
        </div>
      </div>

      <div class="bottom-section">
        <div class="sign-space">
          ${data.ttdDirekturBase64 ? `<img src="${data.ttdDirekturBase64}" alt="TTD Direktur" />` : ""}
        </div>

        <p class="director-name">${data.namaDirektur}</p>
        <p class="bold" style="margin: 2px 0 0 0; font-size: 12pt">Direktur</p>
        <p class="italic" style="margin: 0; font-size: 12pt; font-weight: bold; color: #222">
          Director
        </p>
      </div>
    </div>

    <!-- HALAMAN 2: BELAKANG SERTIFIKAT -->
    <div class="cert-page">
      <div>
        <div class="back-title">
          <h2>Daftar Unit Kompetensi</h2>
          <h3>List of Unit(s) of Competency</h3>
        </div>

        <table class="unit-table">
          <thead>
            <tr>
              <th style="width: 6%">No.</th>
              <th style="width: 25%">
                Kode Unit Kompetensi<br />
                <span
                  style="
                    font-weight: normal;
                    font-style: italic;
                    font-size: 9pt;
                  "
                  >Code of Competency Unit</span
                >
              </th>
              <th style="width: 69%">
                Judul Unit Kompetensi<br />
                <span
                  style="
                    font-weight: normal;
                    font-style: italic;
                    font-size: 9pt;
                  "
                  >Title of Competency Unit</span
                >
              </th>
            </tr>
          </thead>
          <tbody>
            ${unitRowsHtml}
          </tbody>
        </table>
      </div>

      <!-- FOOTER BELAKANG SEJAJAR & RAPAT -->
      <div class="back-footer-wrapper">
        <!-- KOLOM KIRI: FOTO & TTD PEMEGANG -->
        <div class="photo-holder">
          <div class="photo-box">
            ${data.fotoAsesiBase64 ? `<img src="${data.fotoAsesiBase64}" alt="Foto 4x6" />` : '<span style="font-size: 10pt; color: #333; line-height: 1.3; text-align: center;">Foto<br />4x6</span>'}
          </div>
          <div class="holder-sign-area">
            <div class="holder-sign-space">
              ${data.ttdAsesiBase64 ? `<img src="${data.ttdAsesiBase64}" style="max-height: 28px" alt="TTD Asesi" />` : ""}
            </div>
            <p class="bold" style="margin: 0; font-size: 10.5pt; text-decoration: underline">
              ${data.namaPemegang}
            </p>
            <p style="margin: 0; font-size: 9.5pt">Tanda tangan pemilik</p>
            <p class="italic" style="margin: 0; font-size: 9.5pt; color: #222">
              signature of holder
            </p>
          </div>
        </div>

        <!-- KOLOM KANAN: TTD MANAJER SERTIFIKASI -->
        <div class="sign-manager">
          <div class="sign-manager-top">
            <p style="margin: 0; font-size: 10.5pt">
              ${data.kotaTerbit}, ${data.tanggalTerbitId}
            </p>
            <p class="bold" style="margin: 1px 0 0 0; font-size: 10.5pt">
              Atas Nama Badan Nasional Sertifikasi Profesi
            </p>
            <p class="italic" style="margin: 0; font-size: 10pt; color: #222">
              On Behalf of Indonesian Professional Certificate Authority
            </p>
            <p class="bold" style="margin: 0; font-size: 10.5pt">
              Lembaga Sertifikasi Profesi UIN Sunan Gunung Djati Bandung
            </p>
            <p class="italic" style="margin: 0; font-size: 10pt; color: #222">
              Professional Certification Body UIN Sunan Gunung Djati Bandung
            </p>
          </div>

          <div class="sign-manager-bottom">
            <div class="sign-manager-space">
              ${data.ttdManajerBase64 ? `<img src="${data.ttdManajerBase64}" style="max-height: 32px" alt="TTD Manajer" />` : ""}
            </div>
            <p class="bold" style="margin: 0; font-size: 10.5pt; text-decoration: underline">
              ${data.namaManajerSertifikasi}
            </p>
            <p class="bold" style="margin: 0; font-size: 10pt">
              Manajer Sertifikasi
            </p>
            <p class="italic" style="margin: 0; font-size: 10pt; font-weight: bold; color: #222">
              Manager of Certification
            </p>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>
  `;
}
