import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";
import {
  generateSertifikatHtml,
  SertifikatPayload,
} from "@/templates/Sertifikat";
import { rateLimitApi, RateLimitError } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    rateLimitApi(req, {
      limit: 15,
      windowMs: 60 * 1000,
      key: "post-surat-sertifikat-pdf",
    });
    const body = await req.json();
    let payload: SertifikatPayload;

    if (body.pengajuanId) {
      const { db } = await import("@/lib/db");
      let pengajuan = await db.pengajuanSkema.findUnique({
        where: { id: body.pengajuanId },
        include: {
          sertifikat: true,
          dataPribadi: true,
          user: {
            select: {
              profil: { select: { namaLengkap: true } },
            },
          },
          skema: { include: { unitKompetensi: { orderBy: { urutan: 'asc' } } } },
        },
      });

      if (!pengajuan) {
        return NextResponse.json({ error: "Pengajuan tidak ditemukan" }, { status: 404 });
      }

      // Check if sertifikat number is already generated
      let sertifikat = pengajuan.sertifikat;
      if (!sertifikat || !sertifikat.no_sertifikat) {
        const { sertifikatService } = await import("@/services/sertifikat.service");
        const reqTanggalTerbit = body.tanggalTerbit ? new Date(body.tanggalTerbit) : undefined;
        try {
          sertifikat = await sertifikatService.terbitkan(body.pengajuanId, reqTanggalTerbit);
        } catch (e) {
          console.error("Gagal men-generate nomor otomatis:", e);
        }
      }

      const bulanId = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
      const bulanEn = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

      const tglTerbit = sertifikat?.tanggal_terbit || (body.tanggalTerbit ? new Date(body.tanggalTerbit) : new Date());
      const day = tglTerbit.getDate();
      const monthIndex = tglTerbit.getMonth();
      const year = tglTerbit.getFullYear();

      payload = {
        nomorSertifikat: sertifikat?.no_sertifikat || body.nomorSertifikat || "-",
        nomorRegistrasi: sertifikat?.no_registrasi || body.nomorRegistrasi || "-",
        namaPemegang: pengajuan.user?.profil?.namaLengkap || "-",
        bidangId: pengajuan.skema?.kategori || body.bidangId || "-",
        bidangEn: body.bidangEn || "Public Relation",
        kualifikasiId: pengajuan.skema?.namaSkema || body.kualifikasiId || "-",
        kualifikasiEn: body.kualifikasiEn || "Cluster Implementing Communication with Stakeholders",
        kotaTerbit: "Bandung",
        tanggalTerbitId: `${day} ${bulanId[monthIndex]} ${year}`,
        tanggalTerbitEn: `${bulanEn[monthIndex]} ${day}, ${year}`,
        namaDirektur: "Prof. Dr. H. Ija Suntana, M.Ag., CLA.",
        namaManajerSertifikasi: "Ichsan Taufik, MT., CIQA",
        unitList: pengajuan.skema?.unitKompetensi.map((u, i) => ({
          no: i + 1,
          kodeUnit: u.kodeUnit,
          judulUnitId: u.judulUnit,
          judulUnitEn: "Implementing " + u.judulUnit,
        })) || [],
      };
    } else {
      payload = body as SertifikatPayload;
    }

    // Baca logo Garuda dari folder public menjadi Base64 Data URI
    const garudaPath = path.join(process.cwd(), "public", "logo-garuda.png");
    if (fs.existsSync(garudaPath)) {
      const garudaBuffer = fs.readFileSync(garudaPath);
      payload.logoGarudaBase64 = `data:image/png;base64,${garudaBuffer.toString("base64")}`;
    }

    // Render HTML dengan Base64
    const htmlContent = generateSertifikatHtml(payload);

    const browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--font-render-hinting=none",
      ],
    });

    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "domcontentloaded" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });

    await browser.close();

    return new NextResponse(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Sertifikat_${Date.now()}.pdf"`,
      },
    });
  } catch (error) {
    if (error instanceof RateLimitError) {
      return NextResponse.json(
        { error: "Terlalu banyak permintaan." },
        { status: error.status },
      );
    }
    console.error("Error generate Sertifikat PDF:", error);
    return NextResponse.json(
      { error: "Gagal membuat file Sertifikat PDF." },
      { status: 500 },
    );
  }
}
