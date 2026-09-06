import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { getToken } from "next-auth/jwt";
import { hasilAsesmenSchema } from "@/schemas/hasil.schema";
import { prosesHasilAsesmen } from "@/services/hasil.service";
import { sendResponse } from "@/lib/response";
import { ClientError } from "@/error/index";
import { rateLimitApi, RateLimitError } from "@/lib/rate-limit";

type Context = {
  params: Promise<{ id: string }>;
};

export async function PUT(req: NextRequest, context: Context) {
  try {
    rateLimitApi(req, {
      limit: 20,
      windowMs: 60 * 1000,
      key: "put-hasil-asesmen",
    });

    const token = await getToken({ req });
    if (!token || (token.role !== "asesor" && token.role !== "admin")) {
      return sendResponse(
        403,
        "Akses ditolak. Hanya asesor atau admin yang diizinkan.",
      );
    }

    const { id } = await context.params;
    const pengajuanId = parseInt(id, 10);

    if (isNaN(pengajuanId)) {
      return sendResponse(400, "ID pengajuan tidak valid.");
    }

    const body = await req.json();

    const validationResult = hasilAsesmenSchema.safeParse(body);
    if (!validationResult.success) {
      return sendResponse(
        400,
        "Validasi data gagal.",
        validationResult.error.flatten().fieldErrors,
      );
    }

    const hasil = await prosesHasilAsesmen(pengajuanId, validationResult.data);

    revalidatePath("/api/pengajuanskema");

    return sendResponse(200, "Hasil asesmen berhasil disimpan.", hasil);
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

    console.error("[ERROR PUT HASIL ASESMEN]:", error);
    return sendResponse(500, "Terjadi kesalahan internal pada server.");
  }
}
