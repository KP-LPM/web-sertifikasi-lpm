import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { verifikasiApl01Schema } from "@/schemas/verifikasi.schema";
import { prosesVerifikasiApl01 } from "@/services/verifikasi.service";
import { rateLimitApi, RateLimitError } from "@/lib/rate-limit";

type Context = {
  params: Promise<{
    id: string;
  }>;
};

export async function PUT(req: NextRequest, context: Context) {
  try {
    rateLimitApi(req, {
      limit: 20,
      windowMs: 60 * 1000,
      key: "put-verifikasi-apl01",
    });

    const { id } = await context.params;
    const pengajuanId = parseInt(id, 10);

    // Cek apakah ID-nya valid angka
    if (isNaN(pengajuanId)) {
      return NextResponse.json(
        { success: false, message: "ID pengajuan tidak valid" },
        { status: 400 },
      );
    }

    const body = await req.json();

    // 1. Validasi Zod
    const validationResult = verifikasiApl01Schema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validasi data gagal.",
          errors: validationResult.error.format(),
        },
        { status: 400 },
      );
    }

    // 2. Eksekusi Service
    const dataValid = validationResult.data;
    const hasilVerifikasi = await prosesVerifikasiApl01(pengajuanId, dataValid);

    revalidatePath("/api/pengajuanskema");

    // 3. Response Sukses
    return NextResponse.json(
      {
        success: true,
        message: "Data verifikasi APL.01 berhasil disimpan.",
        data: hasilVerifikasi,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    if (error instanceof RateLimitError) {
      return NextResponse.json(
        { success: false, message: "Terlalu banyak permintaan." },
        { status: error.status },
      );
    }

    console.error("[ERROR PUT VERIFIKASI APL01]:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan internal pada server.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
