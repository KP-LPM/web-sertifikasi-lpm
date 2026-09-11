import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { sendResponse } from "@/lib/response";
import { authOptions } from "@/lib/auth-options";
import { rateLimitApi, RateLimitError } from "@/lib/rate-limit";
import { ClientError } from "@/error/index";
import { UpdatePortfolioSchema } from "@/schemas/portfolio.schema";
import { portfolioService } from "@/services/portfolio.service";

type Context = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: NextRequest, context: Context) {
  try {
    rateLimitApi(request, {
      limit: 20,
      windowMs: 60 * 1000,
      key: "patch-portfolio",
    });
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "asesor") {
      return sendResponse(
        403,
        "Akses ditolak. Hanya asesor yang dapat mengubah portfolionya.",
      );
    }

    const { id } = await context.params;
    const portfolioId = parseInt(id, 10);
    if (isNaN(portfolioId)) return sendResponse(400, "ID portfolio tidak valid.");

    const body = await request.json();
    const validatedData = UpdatePortfolioSchema.parse(body);
    const asesorId = parseInt(session.user.id, 10);

    const portfolioUpdated = await portfolioService.update(
      portfolioId,
      asesorId,
      validatedData,
    );

    revalidatePath("/api/portfolio");

    return sendResponse(200, "Portfolio berhasil diperbarui", portfolioUpdated);
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
    console.error("[PATCH /api/portfolio/:id]", error);
    return sendResponse(500, "Terjadi kesalahan saat memperbarui portfolio");
  }
}

export async function DELETE(request: NextRequest, context: Context) {
  try {
    rateLimitApi(request, {
      limit: 20,
      windowMs: 60 * 1000,
      key: "delete-portfolio",
    });

    const session = await getServerSession(authOptions);
    if (!session) {
      return sendResponse(401, "Anda harus login.");
    }

    const role = session.user?.role;
    if (role !== "asesor" && role !== "admin") {
      return sendResponse(403, "Akses ditolak.");
    }

    const { id } = await context.params;
    const portfolioId = parseInt(id, 10);
    if (isNaN(portfolioId)) return sendResponse(400, "ID portfolio tidak valid.");

    const userId = parseInt(session.user.id, 10);
    await portfolioService.delete(portfolioId, userId, role);

    revalidatePath("/api/portfolio");

    return sendResponse(200, "Portfolio berhasil dihapus");
  } catch (error) {
    if (error instanceof RateLimitError) {
      return sendResponse(error.status, "Terlalu banyak permintaan.");
    }
    if (error instanceof ClientError) {
      return sendResponse(error.statusCode, error.message);
    }
    console.error("[DELETE /api/portfolio/:id]", error);
    return sendResponse(500, "Terjadi kesalahan saat menghapus portfolio");
  }
}
