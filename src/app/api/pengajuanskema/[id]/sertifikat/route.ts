import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { getToken } from "next-auth/jwt";
import { z } from "zod";
import { sertifikatService } from "@/services/sertifikat.service";
import { UpdateSertifikatSchema } from "@/schemas/sertifikat.schema";
import { sendResponse } from "@/lib/response";
import { ClientError } from "@/error/index";
import { rateLimitApi, RateLimitError } from "@/lib/rate-limit";

type Context = {
  params: Promise<{ id: string }>;
};

export const revalidate = 3600;

export async function GET(request: NextRequest, context: Context) {
  try {
    rateLimitApi(request, {
      limit: 60,
      windowMs: 60 * 1000,
      key: "get-sertifikat-pengajuan",
    });

    const token = await getToken({ req: request });
    if (!token) return sendResponse(401, "Silakan login terlebih dahulu");

    const { id } = await context.params;
    const pengajuanId = Number(id);

    if (isNaN(pengajuanId)) {
      return sendResponse(400, "ID pengajuan tidak valid.");
    }

    const sertifikat = await sertifikatService.getByPengajuanId(
      pengajuanId,
      Number(token.id),
      token.role as string,
    );

    return sendResponse(200, "Berhasil mengambil data sertifikat", sertifikat);
  } catch (error) {
    if (error instanceof RateLimitError) {
      return sendResponse(error.status, "Terlalu banyak permintaan.");
    }
    if (error instanceof ClientError) {
      return sendResponse(error.statusCode, error.message);
    }

    console.error("[GET /api/pengajuan/[id]/sertifikat]", error);
    return sendResponse(500, "Internal server error");
  }
}

export async function PUT(request: NextRequest, context: Context) {
  try {
    rateLimitApi(request, {
      limit: 20,
      windowMs: 60 * 1000,
      key: "put-sertifikat-pengajuan",
    });

    const token = await getToken({ req: request });
    if (!token || token.role !== "admin") {
      return sendResponse(403, "Akses ditolak. Hanya admin yang diizinkan.");
    }

    const { id } = await context.params;
    const pengajuanId = Number(id);

    if (isNaN(pengajuanId)) {
      return sendResponse(400, "ID pengajuan tidak valid.");
    }

    const body = await request.json();
    const validatedData = UpdateSertifikatSchema.parse(body);

    const result = await sertifikatService.upsert(pengajuanId, validatedData);

    revalidatePath("/api/sertifikat");
    revalidatePath("/api/pengajuanskema");

    return sendResponse(200, "Data sertifikat berhasil disimpan", result);
  } catch (error) {
    if (error instanceof RateLimitError) {
      return sendResponse(error.status, "Terlalu banyak permintaan.");
    }
    if (error instanceof z.ZodError) {
      return sendResponse(400, "Validasi gagal", error.flatten());
    }
    if (error instanceof ClientError) {
      return sendResponse(error.statusCode, error.message);
    }

    console.error("[PUT /api/pengajuan/[id]/sertifikat]", error);
    return sendResponse(500, "Internal server error");
  }
}
