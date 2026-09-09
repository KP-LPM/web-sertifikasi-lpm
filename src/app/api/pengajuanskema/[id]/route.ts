import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { getToken } from "next-auth/jwt";
import z from "zod";
import { pengajuanService } from "@/services/pengajuanskema.service";
import { updatePengajuanSchema } from "@/schemas/pengajuanskema.schema";
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
      key: "get-pengajuan-detail",
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

    const pengajuan = await pengajuanService.getById(pengajuanId, user);
    return sendResponse(200, "Berhasil mengambil detail pengajuan", pengajuan);
  } catch (error) {
    if (error instanceof RateLimitError) {
      return sendResponse(error.status, "Terlalu banyak permintaan.");
    }
    if (error instanceof ClientError) {
      return sendResponse(error.statusCode, error.message);
    }
    console.error("[GET /api/pengajuanskema/:id]:", error);
    return sendResponse(500, "Terjadi kesalahan internal pada server");
  }
}

export async function PATCH(request: NextRequest, context: Context) {
  try {
    rateLimitApi(request, {
      limit: 20,
      windowMs: 60 * 1000,
      key: "patch-pengajuan",
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
    const validatedData = updatePengajuanSchema.parse(body);

    const updated = await pengajuanService.update(pengajuanId, validatedData, user);

    revalidatePath("/api/pengajuanskema");

    return sendResponse(200, "Pengajuan berhasil diperbarui", updated);
  } catch (error) {
    if (error instanceof RateLimitError) {
      return sendResponse(error.status, "Terlalu banyak permintaan.");
    }
    if (error instanceof z.ZodError) {
      return sendResponse(400, "Validasi data edit gagal", error.flatten());
    }
    if (error instanceof ClientError) {
      return sendResponse(error.statusCode, error.message);
    }
    console.error("[PATCH /api/pengajuanskema/:id]:", error);
    return sendResponse(500, "Terjadi kesalahan internal pada server");
  }
}

export async function DELETE(request: NextRequest, context: Context) {
  try {
    rateLimitApi(request, {
      limit: 20,
      windowMs: 60 * 1000,
      key: "delete-pengajuan",
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

    const result = await pengajuanService.delete(pengajuanId, user);

    revalidatePath("/api/pengajuanskema");

    return sendResponse(200, "Pengajuan berhasil dibatalkan", result);
  } catch (error) {
    if (error instanceof RateLimitError) {
      return sendResponse(error.status, "Terlalu banyak permintaan.");
    }
    if (error instanceof ClientError) {
      return sendResponse(error.statusCode, error.message);
    }
    console.error("[DELETE /api/pengajuanskema/:id]:", error);
    return sendResponse(500, "Terjadi kesalahan internal pada server");
  }
}
