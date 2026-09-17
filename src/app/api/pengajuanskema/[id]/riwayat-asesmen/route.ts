import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { getToken } from "next-auth/jwt";
import z from "zod";
import { riwayatAsesmenService } from "@/services/riwayat-asesmen.service";
import { pengajuanService } from "@/services/pengajuanskema.service";
import { CreateRiwayatAsesmenSchema } from "@/schemas/riwayat-asesmen.schema";
import { sendResponse } from "@/lib/response";
import { ClientError } from "@/error/index";
import { rateLimitApi, RateLimitError } from "@/lib/rate-limit";

type Context = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, context: Context) {
  try {
    rateLimitApi(request, {
      limit: 60,
      windowMs: 60 * 1000,
      key: "get-riwayat-asesmen",
    });

    const token = await getToken({ req: request });
    if (!token) {
      return sendResponse(401, "Anda harus login terlebih dahulu");
    }

    const { id } = await context.params;
    const pengajuanId = Number(id);
    if (isNaN(pengajuanId)) {
      return sendResponse(400, "ID pengajuan tidak valid");
    }

    const riwayat = await riwayatAsesmenService.getByPengajuanId(pengajuanId);
    return sendResponse(
      200,
      "Berhasil mengambil detail riwayat asesmen",
      riwayat,
    );
  } catch (error) {
    if (error instanceof RateLimitError) {
      return sendResponse(error.status, "Terlalu banyak permintaan.");
    }
    if (error instanceof ClientError) {
      return sendResponse(error.statusCode, error.message);
    }
    console.error("[GET /api/pengajuanskema/:id/riwayat-asesmen]:", error);
    return sendResponse(500, "Internal server error");
  }
}

export async function POST(request: NextRequest, context: Context) {
  try {
    rateLimitApi(request, {
      limit: 30,
      windowMs: 60 * 1000,
      key: "post-riwayat-asesmen",
    });

    const token = await getToken({ req: request });
    if (!token) {
      return sendResponse(401, "Anda harus login terlebih dahulu");
    }

    const { id } = await context.params;
    const pengajuanId = Number(id);
    if (isNaN(pengajuanId)) {
      return sendResponse(400, "ID pengajuan tidak valid");
    }

    // Verifikasi kepemilikan atau hak akses pengajuan
    await pengajuanService.getById(pengajuanId, {
      id: Number(token.id),
      role: token.role as string,
    });

    const body = await request.json();
    const validatedData = CreateRiwayatAsesmenSchema.parse({
      ...body,
      asesor_id: token.role === "asesor" ? Number(token.id) : body.asesor_id,
    });

    const result = await riwayatAsesmenService.create(
      pengajuanId,
      validatedData,
    );

    revalidatePath("/api/pengajuanskema");
    revalidatePath(`/api/pengajuanskema/${pengajuanId}`);

    return sendResponse(201, "Riwayat asesmen berhasil ditambahkan", result);
  } catch (error) {
    if (error instanceof RateLimitError) {
      return sendResponse(error.status, "Terlalu banyak permintaan.");
    }
    if (error instanceof z.ZodError) {
      const errorMsg =
        "Validasi gagal: " + JSON.stringify(error.flatten().fieldErrors);
      return sendResponse(400, errorMsg, error.flatten());
    }
    if (error instanceof ClientError) {
      return sendResponse(error.statusCode, error.message);
    }
    console.error("[POST /api/pengajuanskema/:id/riwayat-asesmen]:", error);
    return sendResponse(500, "Internal server error");
  }
}
