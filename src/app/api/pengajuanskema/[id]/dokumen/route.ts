import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { getToken } from "next-auth/jwt";
import z from "zod";
import { pengajuanService } from "@/services/pengajuanskema.service";
import { uploadDokumenSchema } from "@/schemas/pengajuanskema.schema";
import { sendResponse } from "@/lib/response";
import { ClientError } from "@/error/index";
import { rateLimitApi, RateLimitError } from "@/lib/rate-limit";

type Context = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";

// POST /api/pengajuanskema/:id/dokumen [asesi]
// Upload dokumen tambahan
export async function POST(request: NextRequest, context: Context) {
  try {
    rateLimitApi(request, {
      limit: 20,
      windowMs: 60 * 1000,
      key: "post-pengajuan-dokumen",
    });

    const token = await getToken({ req: request });
    if (!token) {
      return sendResponse(401, "Anda harus login terlebih dahulu");
    }

    const user = {
      id: Number(token.id),
      role: token.role as string,
    };

    const { id } = await context.params;
    const pengajuanId = Number(id);
    if (isNaN(pengajuanId)) {
      return sendResponse(400, "ID pengajuan tidak valid");
    }

    const body = await request.json();
    const validatedData = uploadDokumenSchema.parse(body);

    const result = await pengajuanService.addDokumen(
      pengajuanId,
      validatedData,
      user
    );

    revalidatePath("/api/pengajuanskema");

    return sendResponse(201, "Dokumen berhasil ditambahkan", result);
  } catch (error) {
    if (error instanceof RateLimitError) {
      return sendResponse(error.status, "Terlalu banyak permintaan.");
    }
    if (error instanceof z.ZodError) {
      return sendResponse(400, "Validasi dokumen gagal", error.flatten());
    }
    if (error instanceof ClientError) {
      return sendResponse(error.statusCode, error.message);
    }
    console.error("[POST /api/pengajuanskema/:id/dokumen]:", error);
    return sendResponse(500, "Terjadi kesalahan internal pada server");
  }
}
