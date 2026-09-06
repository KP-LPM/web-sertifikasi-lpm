import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { getToken } from "next-auth/jwt";
import { penilaianApl02Schema } from "@/schemas/apl02.schema";
import { prosesPenilaianApl02 } from "@/services/apl02.service";
import { sendResponse } from "@/lib/response";
import { ClientError } from "@/error/index";
import { rateLimitApi, RateLimitError } from "@/lib/rate-limit";

type Context = {
  params: Promise<{ id: string }>;
};

// Tanpa caching karena penilaian bersifat transaksional dan dinamis

export async function PUT(req: NextRequest, context: Context) {
  try {
    // 1. Terapkan Rate Limiter (kategori Medium: 20 req/menit)
    rateLimitApi(req, {
      limit: 20,
      windowMs: 60 * 1000,
      key: "put-penilaian-apl02",
    });

    // 2. Autentikasi dan otorisasi role asesor / admin
    const token = await getToken({ req });
    if (!token || (token.role !== "asesor" && token.role !== "admin")) {
      return sendResponse(
        403,
        "Akses ditolak. Hanya asesor atau admin yang diizinkan.",
      );
    }

    // 3. Await dynamic params (Next.js 15+)
    const { id } = await context.params;
    const pengajuanId = parseInt(id, 10);

    if (isNaN(pengajuanId)) {
      return sendResponse(400, "ID pengajuan tidak valid.");
    }

    const body = await req.json();

    // 4. Validasi payload dengan Zod
    const validationResult = penilaianApl02Schema.safeParse(body);
    if (!validationResult.success) {
      return sendResponse(
        400,
        "Validasi data gagal.",
        validationResult.error.flatten().fieldErrors,
      );
    }

    // 5. Eksekusi Service
    const hasilApl02 = await prosesPenilaianApl02(
      pengajuanId,
      validationResult.data,
    );

    revalidatePath("/api/pengajuanskema");

    return sendResponse(
      200,
      "Data penilaian APL.02 berhasil disimpan.",
      hasilApl02,
    );
  } catch (error: unknown) {
    if (error instanceof RateLimitError) {
      return sendResponse(
        error.status,
        "Terlalu banyak permintaan. Silakan coba sesaat lagi.",
      );
    }
    if (error instanceof ClientError) {
      return sendResponse(error.statusCode, error.message);
    }

    console.error("[ERROR PUT PENILAIAN APL02]:", error);
    return sendResponse(500, "Terjadi kesalahan internal pada server.");
  }
}
