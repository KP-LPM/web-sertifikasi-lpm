import { NextResponse } from "next/server";
import { prosesPengajuanBaru } from "@/services/pengajuanskema.service";
import { createPengajuanSchema } from "@/schema/pengajuanskema.schema";

export async function POST(req: Request) {
  try {
    // Tangkap data dari frontend
    const body = await req.json();

    // 1. Validasi data
    const validationResult = createPengajuanSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validasi data gagal. Periksa kembali form anda.",
          errors: validationResult.error.format(), 
        },
        { status: 400 }
      );
    }

    // 2. Berikan ke Service
    const dataValid = validationResult.data;
    const pengajuanBaru = await prosesPengajuanBaru(dataValid);

    // 3. Kembalikan Response Sukses
    return NextResponse.json(
      {
        success: true,
        message: "Pengajuan sertifikasi berhasil disubmit.",
        data: pengajuanBaru,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("[ERROR POST PENGAJUAN]:", error);
    
    // Tangkap error server
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