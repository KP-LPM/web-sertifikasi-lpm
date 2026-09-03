import { NextResponse } from "next/server";
import { verifikasiApl01Schema } from "@/schema/verifikasi.schema";
import { prosesVerifikasiApl01 } from "@/services/verifikasi.service";

// Tipe untuk parameter URL [id]
interface Params {
  params: {
    id: string;
  };
}

export async function PUT(req: Request, { params }: Params) {
  try {
    const pengajuanId = parseInt(params.id, 10);

    // Cek apakah ID-nya valid angka
    if (isNaN(pengajuanId)) {
      return NextResponse.json(
        { success: false, message: "ID pengajuan tidak valid" },
        { status: 400 }
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
        { status: 400 }
      );
    }

    // 2. Eksekusi Service
    const dataValid = validationResult.data;
    const hasilVerifikasi = await prosesVerifikasiApl01(pengajuanId, dataValid);

    // 3. Response Sukses
    return NextResponse.json(
      {
        success: true,
        message: "Data verifikasi APL.01 berhasil disimpan.",
        data: hasilVerifikasi,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("[ERROR PUT VERIFIKASI APL01]:", error);
    
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan internal pada server.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}