import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { sendResponse } from "@/lib/response";
import { authOptions } from "@/lib/auth-options";
import { rateLimitApi, RateLimitError } from "@/lib/rate-limit";
import { ClientError } from "@/error/index";
import { UpdateSuratSchema } from "@/schemas/surat.schema";
import { suratService } from "@/services/surat.service";

export const revalidate = 3600;

type Context = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, context: Context) {
  try {
    rateLimitApi(request, {
      limit: 60,
      windowMs: 60 * 1000,
      key: "get-surat-detail",
    });
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return sendResponse(
        403,
        "Akses ditolak. Hanya admin yang dapat melihat detail surat.",
      );
    }

    const { id } = await context.params;
    const suratId = parseInt(id, 10);
    if (isNaN(suratId)) return sendResponse(400, "ID surat tidak valid.");

    const suratDetail = await suratService.getById(suratId);

    return sendResponse(200, "Berhasil mengambil detail surat", suratDetail);
  } catch (error) {
    if (error instanceof RateLimitError) {
      return sendResponse(error.status, "Terlalu banyak permintaan.");
    }
    if (error instanceof ClientError) {
      return sendResponse(error.statusCode, error.message);
    }
    console.error("[GET /api/surat/:id]", error);
    return sendResponse(500, "Terjadi kesalahan saat mengambil detail surat");
  }
}

export async function PATCH(request: NextRequest, context: Context) {
  try {
    rateLimitApi(request, {
      limit: 20,
      windowMs: 60 * 1000,
      key: "patch-surat",
    });

    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return sendResponse(
        403,
        "Akses ditolak. Hanya admin yang dapat mengubah surat.",
      );
    }

    const { id } = await context.params;
    const suratId = parseInt(id, 10);
    if (isNaN(suratId)) return sendResponse(400, "ID surat tidak valid.");

    const body = await request.json();
    const validatedData = UpdateSuratSchema.parse(body);

    const suratUpdated = await suratService.update(suratId, validatedData);

    revalidatePath("/api/surat");

    return sendResponse(200, "Surat berhasil diperbarui", suratUpdated);
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
    console.error("[PATCH /api/surat/:id]", error);
    return sendResponse(500, "Terjadi kesalahan saat memperbarui surat");
  }
}

export async function DELETE(request: NextRequest, context: Context) {
  try {
    rateLimitApi(request, {
      limit: 20,
      windowMs: 60 * 1000,
      key: "delete-surat",
    });

    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return sendResponse(
        403,
        "Akses ditolak. Hanya admin yang dapat mengarsipkan surat.",
      );
    }

    const { id } = await context.params;
    const suratId = parseInt(id, 10);
    if (isNaN(suratId)) return sendResponse(400, "ID surat tidak valid.");

    await suratService.archive(suratId);

    revalidatePath("/api/surat");

    return sendResponse(200, "Surat berhasil diarsipkan");
  } catch (error) {
    if (error instanceof RateLimitError) {
      return sendResponse(error.status, "Terlalu banyak permintaan.");
    }
    if (error instanceof ClientError) {
      return sendResponse(error.statusCode, error.message);
    }
    console.error("[DELETE /api/surat/:id]", error);
    return sendResponse(500, "Terjadi kesalahan saat mengarsipkan surat");
  }
}
