import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import {
  generateSuratTugasHtml,
  SuratTugasPayload,
} from "@/templates/SuratPenugasanAssessor";
import { rateLimitApi, RateLimitError } from "@/lib/rate-limit";
import { generatePdfFromHtml } from "@/lib/pdf-browser";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    rateLimitApi(req, {
      limit: 15,
      windowMs: 60 * 1000,
      key: "post-surat-penugasan-asesor",
    });
    const payload: SuratTugasPayload = await req.json();

    // Membaca logo dari folder public menjadi Base64
    const logoPath = path.join(process.cwd(), "public", "logo-lsp.png");
    if (fs.existsSync(logoPath)) {
      const logoBuffer = fs.readFileSync(logoPath);
      payload.logoBase64 = `data:image/png;base64,${logoBuffer.toString("base64")}`;
    }

    // Generate string HTML
    const htmlContent = generateSuratTugasHtml(payload);

    // Cetak ke format PDF A4 menggunakan helper yang kompatibel dengan Vercel & lokal
    const pdfBuffer = await generatePdfFromHtml(htmlContent, {
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });

    const sanitizedNama = (payload.namaAsesor || "Asesor").replace(
      /[^a-zA-Z0-9]/g,
      "_",
    );

    return new NextResponse(pdfBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Surat_Tugas_${sanitizedNama}_${Date.now()}.pdf"`,
      },
    });
  } catch (error) {
    if (error instanceof RateLimitError) {
      return NextResponse.json(
        { error: "Terlalu banyak permintaan." },
        { status: error.status },
      );
    }
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error saat generate Surat Tugas PDF:", error);
    return NextResponse.json(
      { error: "Gagal membuat file Surat Tugas PDF.", details: errorMessage },
      { status: 500 },
    );
  }
}
