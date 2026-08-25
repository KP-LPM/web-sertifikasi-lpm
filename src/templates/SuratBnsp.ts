export interface PermohonanBlankoPayload {
  kotaSurat: string;
  tanggalSurat: string;
  nomorSurat: string;
  lampiran?: string;
  tujuanYth?: string;
  kotaTujuan?: string;
  jumlahPeserta: number;
  kompetenBnsp?: number | string;
  kompetenKementerian?: number | string;
  kompetenMandiri: number | string;
  kompetenRcc?: number | string;
  belumKompeten: number | string;
  totalJumlah: number;
  jumlahLembarBlanko: number;
  terbilangLembarBlanko: string; // contoh: "empat puluh tiga"
  namaKetua: string;
  logoBase64?: string;
  signatureBase64?: string;
}

export function generatePermohonanBlankoHtml(
  data: PermohonanBlankoPayload,
): string {
  const logoSrc = data.logoBase64 || "/logo-lsp.png";

  return `
<!doctype html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Surat Permohonan Blanko Sertifikat Kompetensi</title>
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

      /* Header Tanggal & Info Surat */
      .tanggal-surat {
        text-align: right;
        margin-bottom: 12px;
      }
      table.meta-surat {
        border-collapse: collapse;
        margin-bottom: 18px;
      }
      table.meta-surat td {
        padding: 1px 0;
        vertical-align: top;
      }

      /* Tujuan */
      .tujuan-surat {
        margin-bottom: 16px;
      }
      .tujuan-surat p {
        margin: 0;
      }

      .paragraf {
        text-align: justify;
        margin-bottom: 12px;
      }

      /* Tabel Rincian Jumlah Peserta */
      table.tabel-rincian {
        width: 90%;
        margin-left: 20px;
        margin-bottom: 14px;
        border-collapse: collapse;
      }
      table.tabel-rincian td {
        padding: 2px 4px;
        vertical-align: top;
      }

      .signature-container {
        margin-top: 30px;
        display: flex;
        justify-content: flex-end; /* Memaksa seluruh blok tanda tangan ke pojok kanan */
      }
      .signature-box {
        text-align: left;
        width: 320px; /* Lebar standar penampung tanda tangan */
      }
      .signature-box p {
        margin: 0;
        line-height: 1.35;
      }
      .nama-ketua {
        font-weight: bold;
        margin-top: 4px;
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

    <!-- HALAMAN SURAT -->
    <div class="page">
      <div class="tanggal-surat">
        ${data.kotaSurat || "Bandung"}, ${data.tanggalSurat || "-"}
      </div>

      <table class="meta-surat">
        <tr>
          <td style="width: 80px;">Nomor</td>
          <td style="width: 15px;">:</td>
          <td>${data.nomorSurat || "-"}</td>
        </tr>
        <tr>
          <td>Lampiran</td>
          <td>:</td>
          <td>${data.lampiran || "1 (Satu) berkas"}</td>
        </tr>
        <tr>
          <td>Perihal</td>
          <td>:</td>
          <td><strong>Permohonan Blanko Sertifikat Kompetensi</strong></td>
        </tr>
      </table>

      <div class="tujuan-surat">
        <p>Yth. ${data.tujuanYth || "Ketua Badan Nasional Sertifikasi Profesi (BNSP)"}</p>
        <br/>
        <p>di</p>
        <br/>
        <p>${data.kotaTujuan || "Jakarta"}</p>
      </div>

      <p class="paragraf">
        Bersama ini kami melaporkan bahwa LSP P1 UIN Sunan Gunung Djati Bandung telah melaksanakan uji kompetensi dengan rincian (terlampir) sebagai berikut:
      </p>

      <table class="tabel-rincian">
        <tr>
          <td style="width: 48%;"><strong>Jumlah Peserta</strong></td>
          <td style="width: 5%;">:</td>
          <td style="width: 12%; text-align: right;">${data.jumlahPeserta}</td>
          <td style="padding-left: 10px;">Orang;</td>
        </tr>
        <tr>
          <td>1. Kompeten Anggaran BNSP</td>
          <td>:</td>
          <td style="text-align: right;">${data.kompetenBnsp || "-"}</td>
          <td style="padding-left: 10px;">Orang</td>
        </tr>
        <tr>
          <td>2. Kompeten Anggaran Kementerian</td>
          <td>:</td>
          <td style="text-align: right;">${data.kompetenKementerian || "-"}</td>
          <td style="padding-left: 10px;">Orang</td>
        </tr>
        <tr>
          <td>3. Kompeten Anggaran Mandiri</td>
          <td>:</td>
          <td style="text-align: right;">${data.kompetenMandiri || "-"}</td>
          <td style="padding-left: 10px;">Orang</td>
        </tr>
        <tr>
          <td>4. Kompeten RCC</td>
          <td>:</td>
          <td style="text-align: right;">${data.kompetenRcc || "-"}</td>
          <td style="padding-left: 10px;">Orang</td>
        </tr>
        <tr>
          <td>5. Belum Kompeten 1+2+3+4</td>
          <td>:</td>
          <td style="text-align: right;">${data.belumKompeten || "-"}</td>
          <td style="padding-left: 10px;">Orang</td>
        </tr>
        <tr style="border-top: 1px solid #000; font-weight: bold;">
          <td>Jumlah</td>
          <td>:</td>
          <td style="text-align: right;">${data.totalJumlah}</td>
          <td style="padding-left: 10px;">Orang</td>
        </tr>
      </table>

      <p class="paragraf">
        Sehubungan dengan hal tersebut diatas, kami membutuhkan blanko sertifikat sesuai jumlah peserta yang kompeten sebanyak ${data.jumlahLembarBlanko} (${data.terbilangLembarBlanko}) lembar. Blanko sertifikat kompetensi yang diberikan oleh BNSP akan kami pertanggungjawabkan sesuai dengan keperuntukannya.
      </p>

      <p class="paragraf">
        Demikian permohonan kami, atas perhatiannya diucapkan terima kasih.
      </p>

      <div class="signature-container">
        <div class="signature-box">
          <p style="text-align: right">Ketua</p>
          <p style="text-align: right">LSP P1 UIN Sunan Gunung Djati Bandung</p>
          <img
            src="${logoSrc}"
            style="
              width: 160px;
              height: auto;
              margin: 10px 20px 20px -20px;
              display: block;
            "
            alt="Logo LSP"
          />
          <p class="nama-ketua" style="text-align: right">
            (${data.namaKetua || "-"})
          </p>
        </div>
      </div>
    </div>
  </body>
</html>
  `;
}
