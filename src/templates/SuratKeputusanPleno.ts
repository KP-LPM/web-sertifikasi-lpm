export interface AsesiSKItem {
  no: number;
  nama: string;
  skema: string;
  isKompeten: boolean;
}

export interface SkPdfPayload {
  nomorSk: string;
  tanggalPelaksanaan: string;
  tempatUji: string;
  lokasiDitetapkan: string;
  tanggalDitetapkan: string;
  namaDirektur: string;
  logoBase64?: string;
  signatureBase64?: string;
  asesiList: AsesiSKItem[];
}

export function generateSkHtml(data: SkPdfPayload): string {
  // Kelompokkan asesi berdasarkan skema untuk menyatukan baris (rowspan)
  const skemaGroups = (data.asesiList || []).reduce<
    Record<string, AsesiSKItem[]>
  >((acc, item) => {
    if (!acc[item.skema]) acc[item.skema] = [];
    acc[item.skema].push(item);
    return acc;
  }, {});

  let rowsHtml = "";
  let globalIndex = 1;

  for (const [skemaName, items] of Object.entries(skemaGroups)) {
    items.forEach((asesi, idx) => {
      rowsHtml += `
        <tr>
          <td class="center">${globalIndex++}</td>
          <td>${asesi.nama}</td>
          ${idx === 0 ? `<td rowspan="${items.length}">${skemaName}</td>` : ""}
          <td class="center">${asesi.isKompeten ? "V" : ""}</td>
          <td class="center">${!asesi.isKompeten ? "V" : ""}</td>
        </tr>
      `;
    });
  }

  const logoSrc = data.logoBase64 || "/logo-lsp.png";

  return `
<!doctype html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SK Hasil Uji Kompetensi</title>
    <style>
      /* Pengaturan Kertas dan Font Utama */
      @page {
        size: A4;
        margin: 0;
      }
      body {
        font-family: Arial, Helvetica, sans-serif;
        font-size: 12pt;
        line-height: 1.5;
        color: #000;
        background-color: #fff;
        margin: 0;
        padding: 0;
      }
      .page {
        width: 210mm;
        min-height: 297mm;
        padding: 20mm;
        /* Ruang aman atas agar isi surat tidak tertimpa header kop surat yang fixed */
        padding-top: 55mm;
        margin: auto;
        background: white;
        box-sizing: border-box;
        position: relative;
        page-break-after: always;
      }
      .page:last-child {
        page-break-after: avoid;
      }

      /* Kop Surat Fixed (Otomatis muncul di tiap halaman cetak) */
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

      /* Bagian Atas: Menjaga Logo Selalu Berada di Samping Judul */
      .kop-top {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 16px;
        margin-bottom: 4px;
      }

      .kop-top img {
        width: 160px; /* Ukuran proporsional sesuai dokumen asli */
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

      /* Bagian Bawah: Alamat */
      .kop-bottom p {
        margin: 0;
        font-size: 8.5pt;
        line-height: 1.3;
        color: #000;
      }

      .kop-bottom a {
        text-decoration: underline;
      }
      /* Judul Surat */
      .judul-surat {
        text-align: center;
        margin-bottom: 20px;
      }
      .judul-surat h4 {
        margin: 0;
        font-size: 12pt;
      }
      .judul-surat p {
        margin: 0;
      }

      /* Isi Surat */
      .isi-surat {
        width: 100%;
      }
      .isi-row {
        display: flex;
        margin-bottom: 10px;
      }
      .isi-label {
        width: 110px;
        font-weight: bold;
      }
      .isi-content {
        flex: 1;
        text-align: justify;
      }
      .isi-content ol {
        margin: 0;
        padding-left: 20px;
      }
      .isi-content ul {
        margin: 0;
        padding-left: 20px;
        list-style-type: lower-alpha;
      }
      .isi-content li {
        margin-bottom: 5px;
      }

      /* Tanda Tangan */
      .signature-container {
        margin-top: 40px;
        display: flex;
        justify-content: flex-start;
      }
      .signature-box {
        text-align: left;
        width: 500px;
      }
      .signature-box p {
        margin: 0;
      }
      .nama-direktur {
        font-weight: bold;
        text-decoration: underline;
      }

      /* Tabel Lampiran */
      table.tabel-data {
        width: 100%;
        border-collapse: collapse;
        margin-top: 15px;
        font-size: 11pt;
      }
      table.tabel-data th,
      table.tabel-data td {
        border: 1px solid #000;
        padding: 6px;
        text-align: left;
        vertical-align: middle;
      }
      table.tabel-data th {
        text-align: center;
        font-weight: bold;
        background-color: rgb(124, 192, 236);
      }
      .center {
        text-align: center !important;
      }

      /* Legenda */
      .keterangan {
        margin-top: 20px;
        font-size: 11pt;
      }
    </style>
  </head>
  <body>
    <!-- KOP SURAT FIXED (Berulang di setiap halaman) -->
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
              Website: <a style="color: #0000E8" href="https://lsp.uinsgd.ac.id/">lsp.uinsgd.ac.id</a>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- HALAMAN 1: SURAT KEPUTUSAN (Menimbang, Mengingat, Memutuskan: Menetapkan & Pertama) -->
    <div class="page">
      <div class="judul-surat">
        <h4>
          SURAT KEPUTUSAN<br />
          DIREKTUR LEMBAGA SERTIFIKASI PROFESI P1<br />
          UIN SUNAN GUNUNG DJATI BANDUNG
        </h4>
        <p>Nomor ${data.nomorSk}</p>
        <p style="margin-top: 15px; font-weight: bold">
          TENTANG<br />
          HASIL UJI KOMPETENSI<br />
          LEMBAGA SERTIFIKASI PROFESI P1 UIN<br />
          SUNAN GUNUNG DJATI BANDUNG
        </p>
      </div>

      <p style="text-align: justify; margin-bottom: 15px">
        Direktur Lembaga Sertifikasi Profesi (LSP) P1 UIN Sunan Gunung Djati Bandung
      </p>

      <div class="isi-surat">
        <div class="isi-label">Menimbang:</div>
        <div class="isi-row">
          <div class="isi-content">
            <ul>
              <li>
                Bahwa dalam rangka menetapkan hasil uji kompetensi yang
                ditetapkan dalam pleno oleh Komite Teknis Hasil Uji Kompetensi
                sebagai Tim Pengambil Keputusan Sertifikasi yang dikeluarkan
                oleh Lembaga Sertifikasi P1 UIN Sunan Gunung Djati Bandung;
              </li>
              <li>
                Bahwa hasil dari keputusan pleno Komite Teknis Hasil Uji
                Kompetensi perlu ditetapkan dalam surat keputusan;
              </li>
            </ul>
          </div>
        </div>

        <div class="isi-label">Mengingat:</div>
        <div class="isi-row">
          <div class="isi-content">
            <ol>
              <li>
                Pedoman Badan Nasional Sertifikasi Profesi (BNSP) 301 Nomor:
                09/BNSP.301/XI/2013 tentang Pedoman Pelaksanaan Uji Kompetensi;
              </li>
              <li>
                Standar Operasional Prosedur (SOP) LSP P1 UIN Sunan Gunung Djati
                Bandung tentang Sertifikasi Kompetensi;
              </li>
              <li>
                Pelaksanaan Uji Kompetensi pada ${data.tanggalPelaksanaan} dengan
                Tempat Uji Kompetensi (TUK) Sewaktu ${data.tempatUji}.
              </li>
            </ol>
          </div>
        </div>

        <div style="text-align: center; font-weight: bold; margin: 15px 0">
          MEMUTUSKAN
        </div>

        <div class="isi-label">Menetapkan:</div>
        <div class="isi-row">
          <div class="isi-content"></div>
        </div>

        <div class="isi-label">Pertama:</div>
        <div class="isi-row">
          <div class="isi-content">
            Hasil uji kompetensi LSP P1 UIN Sunan Gunung Djati Bandung Pada
            tanggal ${data.tanggalPelaksanaan} dengan Tempat Uji Kompetensi (TUK)
            Sewaktu ${data.tempatUji} sebagaimana tercantum dalam lampiran yang
            tidak terpisahkan dari surat keputusan Ketua LSP P1 UIN Sunan Gunung
            Djati Bandung ini;
          </div>
        </div>
      </div>
    </div>

    <!-- HALAMAN 2: LANJUTAN MEMUTUSKAN (Kedua & Ketiga) & TANDA TANGAN -->
    <div class="page">
      <div class="isi-surat">
        <div class="isi-label">Kedua:</div>
        <div class="isi-row">
          <div class="isi-content">
            Menetapkan Kompeten atau Belum Kompeten terhadap nama-nama peserta
            uji kompetensi sebagaimana tercantum dalam lampiran surat keputusan
            ini.
          </div>
        </div>

        <div class="isi-label">Ketiga:</div>
        <div class="isi-row">
          <div class="isi-content">
            Keputusan ini mulai berlaku sejak tanggal ditetapkan.
          </div>
        </div>
      </div>

      <div class="signature-container">
        <div class="signature-box">
          <p>Ditetapkan di: ${data.lokasiDitetapkan}</p>
          <p>Pada tanggal: ${data.tanggalDitetapkan}</p>
          <p style="margin-top: 5px">
            Direktur LSP P1 UIN Sunan Gunung Djati Bandung.
          </p>
          <img src="${logoSrc}" style="width: 220px; height: auto; margin-top: 25px" alt="Logo LSP" />
          <p class="nama-direktur">${data.namaDirektur}</p>
        </div>
      </div>
    </div>

    <!-- HALAMAN 3: LAMPIRAN -->
    <div class="page">
      <div style="vertical-align: top; width: 80px; font-weight: bold">
        Lampiran:
      </div>
      <div style="text-align: center">
        <p style="font-weight: bold; margin: 0">
          SURAT KEPUTUSAN<br />
          DIREKTUR LEMBAGA SERTIFIKASI PROFESI (LSP) P1<br />
          UIN Sunan Gunung Djati Bandung<br />
          <span>
            <p style="font-weight: normal; margin: 0">Nomor ${data.nomorSk}</p>
          </span>
        </p>
      </div>

      <table class="tabel-data">
        <thead>
          <tr>
            <th rowspan="2" style="width: 5%">No.</th>
            <th rowspan="2" style="width: 35%">Nama Asesi (Peserta)</th>
            <th rowspan="2" style="width: 40%">Skema Sertifikasi</th>
            <th colspan="2" style="width: 20%">Keterangan</th>
          </tr>
          <tr>
            <th>K</th>
            <th>BK</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>

      <div class="keterangan">
        <p><strong>Keterangan:</strong></p>
        <table style="border: none">
          <tr>
            <td style="width: 30px; font-weight: bold">K</td>
            <td>: Kompeten</td>
          </tr>
          <tr>
            <td style="font-weight: bold">BK</td>
            <td>: Belum Kompeten</td>
          </tr>
        </table>
      </div>
    </div>
  </body>
</html>
  `;
}
