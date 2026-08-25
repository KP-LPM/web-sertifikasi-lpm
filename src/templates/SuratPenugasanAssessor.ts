export interface SuratTugasPayload {
  nomorSurat: string;
  namaAsesor: string;
  noRegMet: string;
  bidangSkema: string;
  namaTuk: string;
  alamatTuk: string;
  hariTanggal: string;
  jam: string;
  jumlahPeserta: number | string;
  jumlahSkema: number | string;
  namaAsesi: string;
  spesifikasiRuangTuk: string;
  kegiatanPengujian?: string; // default: "witness"
  kotaSurat: string;
  tanggalSurat: string;
  namaDirektur: string;
  logoBase64?: string;
  signatureBase64?: string;
}

export function generateSuratTugasHtml(data: SuratTugasPayload): string {
  const logoSrc = data.logoBase64 || "/logo-lsp.png";

  return `
<!doctype html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Surat Perintah Tugas Asesor</title>
    <style>
      @page {
        size: A4;
        margin: 0;
      }
      body {
        font-family: Arial, Helvetica, sans-serif;
        font-size: 11pt;
        line-height: 1.45;
        color: #000;
        background-color: #fff;
        margin: 0;
        padding: 0;
      }
      .page {
        width: 210mm;
        min-height: 297mm;
        padding: 20mm;
        padding-top: 55mm;
        margin: auto;
        background: white;
        box-sizing: border-box;
        position: relative;
      }

      /* Kop Surat Fixed */
      .kop-surat-fixed {
        position: fixed;
        top: 15mm;
        left: 20mm;
        right: 20mm;
        background-color: #fff;
        z-index: 1000;
        border-bottom: 3px solid #000;
        padding-bottom: 8px;
        text-align: center;
      }
      .kop-top {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 16px;
        margin-bottom: 4px;
      }
      .kop-top img {
        width: 150px;
        height: auto;
        flex-shrink: 0;
      }
      .kop-judul {
        text-align: center;
      }
      .kop-judul h3 {
        margin: 0;
        font-size: 9pt;
        font-weight: bold;
        letter-spacing: 0.5px;
      }
      .kop-judul h2 {
        margin: 1px 0;
        font-size: 10pt;
        font-weight: bold;
      }
      .kop-judul h1 {
        margin: 0;
        font-size: 12pt;
        font-weight: bold;
      }
      .kop-bottom p {
        margin: 0;
        font-size: 8.5pt;
        line-height: 1.3;
        color: #000;
      }
      .kop-bottom a {
        color: #0000ee;
        text-decoration: underline;
      }

      /* Judul Surat */
      .judul-surat {
        text-align: center;
        margin-bottom: 18px;
      }
      .judul-surat h4 {
        margin: 0;
        font-size: 12pt;
        font-weight: bold;
        text-decoration: underline;
      }
      .judul-surat p {
        margin: 3px 0 0 0;
        font-size: 11pt;
      }

      .paragraf-pembuka {
        text-align: justify;
        margin-bottom: 15px;
      }

      /* Tabel Data Asesor & Pelaksanaan */
      table.tabel-tugas {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 15px;
        font-size: 10.5pt;
      }
      table.tabel-tugas td {
        border: 1px solid #000;
        padding: 5px 8px;
        vertical-align: top;
      }
      table.tabel-tugas .header-cell {
        font-weight: bold;
        text-align: center;
        background-color: #f7f7f7;
      }
      table.tabel-tugas .label-col {
        width: 25%;
        font-weight: normal;
      }
      table.tabel-tugas .val-col {
        width: 75%;
      }

      .paragraf-penutup {
        text-align: justify;
        margin-top: 15px;
        margin-bottom: 25px;
      }

    /* Tanda Tangan */
      .signature-container {
        display: flex;
        justify-content: center;
        margin-top: 30px;
      }
      .signature-box {
        text-align: center; /* Rata tengah agar teks, logo/stempel, dan nama direktur sejajar */
        width: 100%;
        max-width: 550px;
      }
      .signature-box p {
        margin: 0;
        line-height: 1.4;
      }
      .signature-instansi {
        white-space: nowrap; /* Memaksa teks nama LSP tetap 1 baris tanpa wrap */
        font-size: 10.5pt;
      }
      .nama-direktur {
        font-weight: bold;
        text-decoration: underline;
      }
    </style>
  </head>
  <body>
    <!-- KOP SURAT FIXED -->
    <div class="kop-surat-fixed">
      <div class="kop-top">
        <img src="${logoSrc}" alt="Logo LSP" />
        <div class="kop-judul">
          <h3>KEMENTERIAN AGAMA REPUBLIK INDONESIA</h3>
          <h3>UNIVERSITAS ISLAM NEGERI SUNAN GUNUNG DJATI BANDUNG</h3>
          <h1>LEMBAGA SERTIFIKASI PROFESI P1</h1>
          <div class="kop-bottom">
            <p>
              Jalan A. H. Nasution 105, Cibiru, Bandung 40614 Tlp. (022) 7800525 Fax (022) 7803936<br />
              Website: <a href="https://lsp.uinsgd.ac.id/">lsp.uinsgd.ac.id</a>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- HALAMAN SURAT TUGAS -->
    <div class="page">
      <div class="judul-surat">
        <h4>SURAT PERINTAH TUGAS</h4>
        <p>Nomor: ${data.nomorSurat || "-"}</p>
      </div>

      <p class="paragraf-pembuka">
        Yang bertanda tangan di bawah ini Direktur LSP P1 UIN Sunan Gunung Djati Bandung dengan ini memberi tugas kepada Asesor yang namanya tercantum sebagai berikut:
      </p>

      <!-- TABEL INFORMASI PENUGASAN -->
      <table class="tabel-tugas">
        <tr>
          <td class="header-cell" style="width: 50%;">Nama</td>
          <td class="header-cell" style="width: 50%;">No. Reg</td>
        </tr>
        <tr>
          <td style="text-align: center; font-weight: bold;">${data.namaAsesor || "-"}</td>
          <td style="text-align: center;">${data.noRegMet || "-"}</td>
        </tr>
      </table>

      <table class="tabel-tugas">
        <tr>
          <td class="label-col">Bidang</td>
          <td class="val-col">${data.bidangSkema || "-"}</td>
        </tr>
        <tr>
          <td class="label-col">Nama TUK</td>
          <td class="val-col">${data.namaTuk || "-"}</td>
        </tr>
        <tr>
          <td class="label-col">Alamat</td>
          <td class="val-col">${data.alamatTuk || "-"}</td>
        </tr>
        <tr>
          <td class="label-col">Hari/Tanggal</td>
          <td class="val-col">${data.hariTanggal || "-"}</td>
        </tr>
        <tr>
          <td class="label-col">Jumlah Peserta</td>
          <td class="val-col">${data.jumlahPeserta || "-"}</td>
        </tr>
        <tr>
          <td class="label-col">Skema Sertifikasi</td>
          <td class="val-col">${data.jumlahSkema || "-"}</td>
        </tr>
        <tr>
          <td class="label-col">Jam</td>
          <td class="val-col">${data.jam || "-"}</td>
        </tr>
        <tr>
          <td class="label-col">Nama Asesi</td>
          <td class="val-col">${data.namaAsesi || "-"}</td>
        </tr>
        <tr>
          <td class="label-col">Spesifikasi Ruang TUK</td>
          <td class="val-col">${data.spesifikasiRuangTuk || "-"}</td>
        </tr>
      </table>

      <p class="paragraf-penutup">
        Untuk melakukan pengujian pada kegiatan ${data.kegiatanPengujian || "uji kompetensi"} yang diselenggarakan pada tanggal dan waktu yang telah ditentukan. Demikian Surat Tugas ini diberikan untuk dilaksanakan dengan penuh tanggungjawab.
      </p>

      <!-- TANDA TANGAN -->
      <div class="signature-container">
        <div class="signature-box">
          <p>${data.kotaSurat || "Bandung"}, ${data.tanggalSurat || "-"}</p>
         <p class="signature-instansi" style="margin-top: 15px">LSP P1 UNIVERSITAS ISLAM NEGERI SUNAN GUNUNG DJATI BANDUNG</p>
          <img src="${logoSrc}" style="width: 170px; height: auto; margin-top: 15px" alt="Logo LSP" />
          <p class="nama-direktur">${data.namaDirektur || "-"}</p>
          <p>Direktur</p>
        </div>
      </div>
    </div>
  </body>
</html>
  `;
}
