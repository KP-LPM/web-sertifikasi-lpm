import { NextResponse } from "next/server";
import { hasilAsesmenSchema } from "@/schema/hasil.schema";
import { prosesHasilAsesmen } from "@/services/hasil.service";

interface Params {
  params: {
    id: string;
  };
}

export async function PUT(req: Request, { params }: Params) {
  try {
    const pengajuanId = parseInt(params.id, 10);

    if (isNaN(pengajuanId)) {
      return NextResponse.json(
        { success: false, message: "ID pengajuan tidak valid" },
        { status: 400 }
      );
    }

    const body = await req.json();

    // 1. Validasi Zod
    const validationResult = hasilAsesmenSchema.safeParse(body);

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
    const hasil = await prosesHasilAsesmen(pengajuanId, dataValid);

    // 3. Response Sukses
    return NextResponse.json(
      {
        success: true,
        message: "Hasil asesmen berhasil disimpan.",
        data: hasil,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("[ERROR PUT HASIL ASESMEN]:", error);
    
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