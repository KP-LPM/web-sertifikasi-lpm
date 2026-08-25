export interface AsesiBeritaAcaraItem {
  no: number;
  nama: string;
  skema: string;
  isKompeten: boolean;
}

export interface AnggotaKomiteItem {
  nama: string;
  ttdBase64?: string;
}

export interface BeritaAcaraPayload {
  tanggalPleno: string;
  tanggalPelaksanaan: string;
  totalAsesi: number;
  totalKompeten: number;
  totalBelumKompeten: number;
  kotaPleno: string;
  tanggalSurat: string;
  logoBase64?: string;  
  asesiList: AsesiBeritaAcaraItem[];
  anggotaKomiteList: AnggotaKomiteItem[];
}

// Fungsi helper untuk merender baris tabel dengan rowspan yang aman per halaman
function renderTableRows(
  items: AsesiBeritaAcaraItem[],
  startIndex: number,
): string {
  const skemaGroups = items.reduce<Record<string, AsesiBeritaAcaraItem[]>>(
    (acc, item) => {
      if (!acc[item.skema]) acc[item.skema] = [];
      acc[item.skema].push(item);
      return acc;
    },
    {},
  );

  let rowsHtml = "";
  let currentIndex = startIndex;

  for (const [skemaName, groupItems] of Object.entries(skemaGroups)) {
    groupItems.forEach((asesi, idx) => {
      rowsHtml += `
        <tr>
          <td class="center" style="width: 5%;">${currentIndex++}</td>
          <td style="width: 35%;">${asesi.nama}</td>
          ${idx === 0 ? `<td rowspan="${groupItems.length}" style="width: 40%;">${skemaName}</td>` : ""}
          <td class="center font-bold" style="width: 10%;">${asesi.isKompeten ? "V" : ""}</td>
          <td class="center font-bold" style="width: 10%;">${!asesi.isKompeten ? "V" : ""}</td>
        </tr>
      `;
    });
  }

  return rowsHtml;
}

export function generateBeritaAcaraHtml(data: BeritaAcaraPayload): string {
  const logoSrc = data.logoBase64 || "/logo-lsp.png";

  // Template Kop Surat Mandiri
  const kopSuratHtml = `
    <div class="kop-container">
      <div class="kop-top">
        <img src="${logoSrc}" class="kop-logo" alt="Logo LSP" />
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
  `;

  // Tanda tangan anggota komite teknis dengan jarak vertikal yang lebih longgar
  const komiteRowsHtml = (data.anggotaKomiteList || [])
    .map((anggota, index) => {
      const num = index + 1;
      return `
      <tr>
        <td style="border: none; padding: 10px 0; vertical-align: middle; width: 50%;">
          ${num}. ${anggota.nama}
        </td>
        <td style="border: none; padding: 10px 0; vertical-align: middle; width: 50%;">
          <div style="display: flex; align-items: center; height: 40px;">
            <span style="min-width: 20px;">${num}.</span>
            ${
              anggota.ttdBase64
                ? `<img src="${anggota.ttdBase64}" style="max-height: 38px; max-width: 100px; object-fit: contain; margin-left: 8px;" alt="TTD" />`
                : `<span style="display: inline-block; width: 120px; border-bottom: 1px dotted #555; height: 18px; margin-left: 8px;"></span>`
            }
          </div>
        </td>
      </tr>
    `;
    })
    .join("");

  // Pembagian data asesi: Halaman 1 memuat maks 18 asesi (karena ada pembuka), halaman selanjutnya memuat maks 25 asesi
  const asesiList = data.asesiList || [];
  const limitPage1 = 18;
  const page1Items = asesiList.slice(0, limitPage1);
  const page2Items = asesiList.slice(limitPage1);

  return `
<!doctype html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Berita Acara Pleno Komite Teknis</title>
    <style>
      @page {
        size: A4 portrait;
        margin: 0;
      }
      *, *::before, *::after {
        box-sizing: border-box;
      }
      body {
        font-family: Arial, Helvetica, sans-serif;
        font-size: 11pt;
        line-height: 1.4;
        color: #000;
        background-color: #fff;
        margin: 0;
        padding: 0;
        -webkit-print-color-adjust: exact;
      }
      .page {
        width: 210mm;
        min-height: 297mm;
        padding: 20mm;
        margin: 0 auto;
        background: white;
        box-sizing: border-box;
        page-break-after: always;
        position: relative;
      }
      .page:last-child {
        page-break-after: avoid;
      }

      /* Kop Surat */
      .kop-container {
        border-bottom: 3px solid #000;
        padding-bottom: 8px;
        margin-bottom: 16px;
        text-align: center;
      }
      .kop-top {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 16px;
        margin-bottom: 4px;
      }
      .kop-logo {
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
        margin-bottom: 14px;
      }
      .judul-surat h4 {
        margin: 0;
        font-size: 12pt;
        font-weight: bold;
      }

      .paragraf-pembuka {
        text-align: justify;
        margin-bottom: 12px;
        line-height: 1.45;
      }

      /* Tabel */
      table.tabel-data {
        width: 100%;
        border-collapse: collapse;
        margin-top: 6px;
        margin-bottom: 15px;
        font-size: 9.5pt;
      }
      table.tabel-data th,
      table.tabel-data td {
        border: 1px solid #000;
        padding: 5px 6px;
        vertical-align: middle;
      }
      table.tabel-data th {
        text-align: center;
        font-weight: bold;
        background-color:  rgb(124, 192, 236);;
      }
      .center {
        text-align: center !important;
      }
      .font-bold {
        font-weight: bold;
      }

      /* Tanda Tangan Komite */
      .tanda-tangan-section {
        margin-top: 50px;
      }
      table.tabel-komite {
        width: 100%;
        border-collapse: collapse;
        margin-top: 50px;
        margin-bot: 50px;
      }
    </style>
  </head>
  <body>
    <!-- HALAMAN 1 -->
    <div class="page">
      ${kopSuratHtml}

      <div class="judul-surat">
        <h4>Berita Acara Pleno Komite Teknis</h4>
      </div>

      <p class="paragraf-pembuka">
        Bahwa pada tanggal ${data.tanggalPleno || "-"} telah dilakukan rapat pleno Komite Teknis LSP P1 UIN Sunan Gunung Djati Bandung, setelah dilakukan verifikasi rekaman asesmen atau uji kompetensi yang dilaksanakan pada ${data.tanggalPelaksanaan || "-"}. Dinyatakan dari ${data.totalAsesi || 0} asesi ${data.totalKompeten || 0} asesi dinyatakan kompeten dan ${data.totalBelumKompeten || 0} asesi dinyatakan belum kompeten dengan daftar sebagaimana berikut.
      </p>

      <table class="tabel-data">
        <thead>
          <tr>
            <th rowspan="2" style="width: 5%">No.</th>
            <th rowspan="2" style="width: 35%">Nama Asesi (Peserta)</th>
            <th rowspan="2" style="width: 40%">Skema Sertifikasi</th>
            <th colspan="2" style="width: 20%">Keterangan</th>
          </tr>
          <tr>
            <th style="width: 10%">K</th>
            <th style="width: 10%">BK</th>
          </tr>
        </thead>
        <tbody>
          ${renderTableRows(page1Items, 1)}
        </tbody>
      </table>

      ${
        page2Items.length === 0
          ? `
          <div class="tanda-tangan-section">
            <p style="margin: 0; font-weight: normal;">${data.kotaPleno || "Bandung"}, ${data.tanggalSurat || "-"}</p>
            <p style="margin: 2px 0 0 0; font-weight: normal;">Peserta rapat pleno anggota Komite Teknis</p>

            <table class="tabel-komite" style="border: none;">
              <thead>
                <tr>
                  <th style="border: none; text-align: left; padding: 2px 0; width: 55%; font-weight: normal;"></th>
                  <th style="border: none; text-align: left; padding: 2px 0; width: 45%; font-weight: normal;">Tanda tangan</th>
                </tr>
              </thead>
              <tbody>
                ${komiteRowsHtml}
              </tbody>
            </table>
          </div>
          `
          : ""
      }
    </div>

    <!-- HALAMAN 2 (Jika data lebih dari 18 asesi) -->
    ${
      page2Items.length > 0
        ? `
      <div class="page">
        ${kopSuratHtml}

        <table class="tabel-data">
          <thead>
            <tr>
              <th rowspan="2" style="width: 5%">No.</th>
              <th rowspan="2" style="width: 35%">Nama Asesi (Peserta)</th>
              <th rowspan="2" style="width: 40%">Skema Sertifikasi</th>
              <th colspan="2" style="width: 20%">Keterangan</th>
            </tr>
            <tr>
              <th style="width: 10%">K</th>
              <th style="width: 10%">BK</th>
            </tr>
          </thead>
          <tbody>
            ${renderTableRows(page2Items, limitPage1 + 1)}
          </tbody>
        </table>

      <div class="tanda-tangan-section" style="margin-top: 50px;">
        <p style="margin: 0 0 10px 0; font-weight: normal;">${data.kotaPleno || "Bandung"}, ${data.tanggalSurat || "-"}</p>

        <table class="tabel-komite" style="border: none; width: 100%;">
          <thead>
            <tr>
              <th style="border: none; text-align: left; padding: 0 0 16px 0; width: 50%; font-weight: bold;">
                Peserta rapat pleno anggota Komite Teknis
              </th>
              <th style="border: none; text-align: left; padding: 0 0 16px 0; width: 50%; font-weight: bold;">
                Tanda tangan
              </th>
            </tr>
          </thead>
          <tbody>
            ${komiteRowsHtml}
          </tbody>
        </table>
      </div>
      `
        : ""
    }
  </body>
</html>
  `;
}
