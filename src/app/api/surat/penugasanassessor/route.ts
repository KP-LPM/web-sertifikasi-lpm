import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";
import {
  generateSuratTugasHtml,
  SuratTugasPayload,
} from "@/templates/SuratPenugasanAssessor";

export async function POST(req: NextRequest) {
  try {
    const payload: SuratTugasPayload = await req.json();

    // Membaca logo dari folder public menjadi Base64
    const logoPath = path.join(process.cwd(), "public", "logo-lsp.png");
    if (fs.existsSync(logoPath)) {
      const logoBuffer = fs.readFileSync(logoPath);
      payload.logoBase64 = `data:image/png;base64,${logoBuffer.toString("base64")}`;
    }

    // Generate string HTML
    const htmlContent = generateSuratTugasHtml(payload);

    // Jalankan Puppeteer
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

    // Cetak ke format PDF A4
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });

    await browser.close();

    const sanitizedNama = (payload.namaAsesor || "Asesor").replace(
      /[^a-zA-Z0-9]/g,
      "_",
    );

    return new NextResponse(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Surat_Tugas_${sanitizedNama}_${Date.now()}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error saat generate Surat Tugas PDF:", error);
    return NextResponse.json(
      { error: "Gagal membuat file Surat Tugas PDF." },
      { status: 500 },
    );
  }
}
