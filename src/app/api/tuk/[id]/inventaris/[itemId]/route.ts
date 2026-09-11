import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { authOptions } from "@/lib/auth-options";
import { sendResponse } from "@/lib/response";
import { rateLimitApi, RateLimitError } from "@/lib/rate-limit";
import { ClientError } from "@/error/index";
import { UpdateTukInventarisSchema } from "@/schemas/tuk.schema";
import { tukService } from "@/services/tuk.service";

type Context = {
  params: Promise<{ id: string; itemId: string }>;
};

export async function PATCH(request: NextRequest, context: Context) {
  try {
    rateLimitApi(request, {
      limit: 20,
      windowMs: 60 * 1000,
      key: "patch-tuk-inventaris",
    });

    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return sendResponse(
        403,
        "Akses ditolak. Hanya admin yang dapat mengubah inventaris.",
      );
    }

    const { id, itemId } = await context.params;
    const tukId = parseInt(id, 10);
    const invId = parseInt(itemId, 10);

    if (isNaN(tukId) || isNaN(invId)) {
      return sendResponse(400, "ID tidak valid.");
    }

    const body = await request.json();
    const validatedData = UpdateTukInventarisSchema.parse(body);

    const inventarisUpdated = await tukService.updateInventaris(
      tukId,
      invId,
      validatedData,
    );

    revalidatePath("/api/tuk");

    return sendResponse(
      200,
      "Item inventaris berhasil diperbarui",
      inventarisUpdated,
    );
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
    console.error("[PATCH /api/tuk/:id/inventaris/:itemId]", error);
    return sendResponse(500, "Terjadi kesalahan saat memperbarui inventaris");
  }
}

export async function DELETE(request: NextRequest, context: Context) {
  try {
    rateLimitApi(request, {
      limit: 20,
      windowMs: 60 * 1000,
      key: "delete-tuk-inventaris",
    });

    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return sendResponse(
        403,
        "Akses ditolak. Hanya admin yang dapat menghapus inventaris.",
      );
    }

    const { id, itemId } = await context.params;
    const tukId = parseInt(id, 10);
    const invId = parseInt(itemId, 10);

    if (isNaN(tukId) || isNaN(invId)) {
      return sendResponse(400, "ID tidak valid.");
    }

    await tukService.deleteInventaris(tukId, invId);

    revalidatePath("/api/tuk");

    return sendResponse(200, "Item inventaris berhasil dihapus");
  } catch (error) {
    if (error instanceof RateLimitError) {
      return sendResponse(error.status, "Terlalu banyak permintaan.");
    }
    if (error instanceof ClientError) {
      return sendResponse(error.statusCode, error.message);
    }
    console.error("[DELETE /api/tuk/:id/inventaris/:itemId]", error);
    return sendResponse(500, "Terjadi kesalahan saat menghapus inventaris");
  }
}
