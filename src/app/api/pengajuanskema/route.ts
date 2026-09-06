import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { getToken } from "next-auth/jwt";
import { prosesPengajuanBaru } from "@/services/pengajuanskema.service";
import { createPengajuanSchema } from "@/schemas/pengajuanskema.schema";
import { sendResponse } from "@/lib/response";
import { ClientError } from "@/error/index";
import { rateLimitApi, RateLimitError } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    rateLimitApi(req, {
      limit: 5,
      windowMs: 60 * 1000,
      key: "post-pengajuan-baru",
    });

    const token = await getToken({ req });
    if (!token || token.role !== "asesi") {
      return sendResponse(
        403,
        "Akses ditolak. Hanya asesi yang dapat membuat pengajuan.",
      );
    }

    const body = await req.json();

    const validationResult = createPengajuanSchema.safeParse(body);
    if (!validationResult.success) {
      return sendResponse(
        400,
        "Validasi data gagal. Periksa kembali form anda.",
        validationResult.error.flatten().fieldErrors,
      );
    }

    const pengajuanBaru = await prosesPengajuanBaru(validationResult.data);

    revalidatePath("/api/pengajuanskema");

    return sendResponse(
      201,
      "Pengajuan sertifikasi berhasil disubmit.",
      pengajuanBaru,
    );
  } catch (error: unknown) {
    if (error instanceof RateLimitError) {
      return sendResponse(
        error.status,
        "Terlalu banyak permintaan submit. Silakan coba sesaat lagi.",
      );
    }
    if (error instanceof ClientError) {
      return sendResponse(error.statusCode, error.message);
    }

    console.error("[ERROR POST PENGAJUAN]:", error);
    return sendResponse(500, "Terjadi kesalahan internal pada server.");
  }
}
