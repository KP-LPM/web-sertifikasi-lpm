import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { sendResponse } from "@/lib/response";
import { authOptions } from "@/lib/auth-options";
import { rateLimitApi, RateLimitError } from "@/lib/rate-limit";
import { ClientError } from "@/error/index";
import { VerifikasiPortfolioSchema } from "@/schemas/portfolio.schema";
import { portfolioService } from "@/services/portfolio.service";

type Context = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: NextRequest, context: Context) {
  try {
    rateLimitApi(request, {
      limit: 20,
      windowMs: 60 * 1000,
      key: "patch-portfolio-verifikasi",
    });
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return sendResponse(
        403,
        "Akses ditolak. Hanya admin yang dapat memverifikasi portfolio.",
      );
    }

    const { id } = await context.params;
    const portfolioId = parseInt(id, 10);
    if (isNaN(portfolioId)) return sendResponse(400, "ID portfolio tidak valid.");

    const body = await request.json();
    const validatedData = VerifikasiPortfolioSchema.parse(body);

    const portfolioUpdated = await portfolioService.verify(
      portfolioId,
      validatedData,
    );

    revalidatePath("/api/portfolio");

    return sendResponse(
      200,
      "Portfolio berhasil diverifikasi",
      portfolioUpdated,
    );
  } catch (error) {
    if (error instanceof RateLimitError) {
      return sendResponse(error.status, "Terlalu banyak permintaan.");
    }
    if (error instanceof z.ZodError) {
      return sendResponse(
        400,
        "Status tidak valid. Gunakan 'Terverifikasi' atau 'Ditolak'.",
      );
    }
    if (error instanceof ClientError) {
      return sendResponse(error.statusCode, error.message);
    }
    console.error("[PATCH /api/portfolio/:id/verifikasi]", error);
    return sendResponse(
      500,
      "Terjadi kesalahan saat memverifikasi portfolio",
    );
  }
}
