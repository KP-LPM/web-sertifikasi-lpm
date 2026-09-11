/**
 * GET    /api/tuk/[id]  — Detail TUK beserta daftar inventaris
 * PATCH  /api/tuk/[id]  — [admin] Update data TUK
 * DELETE /api/tuk/[id]  — [admin] Nonaktifkan TUK (soft-delete)
 */
import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { authOptions } from "@/lib/auth-options";
import { sendResponse } from "@/lib/response";
import { rateLimitApi, RateLimitError } from "@/lib/rate-limit";
import { ClientError } from "@/error/index";
import { UpdateTukSchema } from "@/schemas/tuk.schema";
import { tukService } from "@/services/tuk.service";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

type Context = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: NextRequest, context: Context) {
  try {
    rateLimitApi(_request, {
      limit: 60,
      windowMs: 60 * 1000,
      key: "get-tuk-detail",
    });

    const { id } = await context.params;
    const tukId = parseInt(id, 10);
    if (isNaN(tukId)) return sendResponse(400, "ID TUK tidak valid.");

    const tuk = await tukService.getById(tukId);

    return sendResponse(200, "Berhasil mengambil detail TUK", tuk);
  } catch (error) {
    if (error instanceof RateLimitError) {
      return sendResponse(error.status, "Terlalu banyak permintaan.");
    }
    if (error instanceof ClientError) {
      return sendResponse(error.statusCode, error.message);
    }
    console.error("[GET /api/tuk/:id]", error);
    return sendResponse(500, "Terjadi kesalahan saat mengambil detail TUK");
  }
}

export async function PATCH(request: NextRequest, context: Context) {
  try {
    rateLimitApi(request, {
      limit: 20,
      windowMs: 60 * 1000,
      key: "patch-tuk",
    });

    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return sendResponse(
        403,
        "Akses ditolak. Hanya admin yang dapat mengubah TUK.",
      );
    }

    const { id } = await context.params;
    const tukId = parseInt(id, 10);
    if (isNaN(tukId)) return sendResponse(400, "ID TUK tidak valid.");

    const body = await request.json();
    const validatedData = UpdateTukSchema.parse(body);

    const tukUpdated = await tukService.update(tukId, validatedData);

    revalidatePath("/api/tuk");

    return sendResponse(200, "TUK berhasil diperbarui", tukUpdated);
  } catch (error) {
    if (error instanceof RateLimitError) {
      return sendResponse(error.status, "Terlalu banyak permintaan.");
    }
    if (error instanceof z.ZodError) {
      return sendResponse(400, "Validasi payload gagal", error.flatten());
    }
    if (error instanceof ClientError) {
      return sendResponse(error.statusCode, error.message);
    }
    console.error("[PATCH /api/tuk/:id]", error);
    return sendResponse(500, "Terjadi kesalahan saat memperbarui TUK");
  }
}

export async function DELETE(_request: NextRequest, context: Context) {
  try {
    rateLimitApi(_request, {
      limit: 20,
      windowMs: 60 * 1000,
      key: "delete-tuk",
    });

    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return sendResponse(
        403,
        "Akses ditolak. Hanya admin yang dapat menonaktifkan TUK.",
      );
    }

    const { id } = await context.params;
    const tukId = parseInt(id, 10);
    if (isNaN(tukId)) return sendResponse(400, "ID TUK tidak valid.");

    await tukService.softDelete(tukId);

    revalidatePath("/api/tuk");

    return sendResponse(200, "TUK berhasil dinonaktifkan");
  } catch (error) {
    if (error instanceof RateLimitError) {
      return sendResponse(error.status, "Terlalu banyak permintaan.");
    }
    if (error instanceof ClientError) {
      return sendResponse(error.statusCode, error.message);
    }
    console.error("[DELETE /api/tuk/:id]", error);
    return sendResponse(500, "Terjadi kesalahan saat menonaktifkan TUK");
  }
}
