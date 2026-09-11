import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { sendResponse } from "@/lib/response";
import { authOptions } from "@/lib/auth-options";
import { rateLimitApi, RateLimitError } from "@/lib/rate-limit";
import { ClientError } from "@/error/index";
import { CreatePortfolioSchema } from "@/schemas/portfolio.schema";
import { portfolioService } from "@/services/portfolio.service";

export async function GET(request: NextRequest) {
  try {
    rateLimitApi(request, {
      limit: 60,
      windowMs: 60 * 1000,
      key: "get-portfolio-list",
    });

    const session = await getServerSession(authOptions);
    if (!session) {
      return sendResponse(401, "Anda harus login.");
    }

    const { searchParams } = new URL(request.url);
    const asesorIdParam = searchParams.get("asesor_id");
    let targetAsesorId = asesorIdParam ? parseInt(asesorIdParam, 10) : undefined;

    if (session.user?.role === "asesor") {
      targetAsesorId = parseInt(session.user.id, 10);
    }

    if (!targetAsesorId && session.user?.role !== "admin") {
      targetAsesorId = parseInt(session.user.id, 10);
    }

    const portfolios = targetAsesorId
      ? await portfolioService.getByAsesorId(targetAsesorId)
      : await portfolioService.getByAsesorId(parseInt(session.user.id, 10));

    return sendResponse(200, "Berhasil mengambil portfolio", portfolios);
  } catch (error) {
    if (error instanceof RateLimitError) {
      return sendResponse(error.status, "Terlalu banyak permintaan.");
    }
    if (error instanceof ClientError) {
      return sendResponse(error.statusCode, error.message);
    }
    console.error("[GET /api/portfolio]", error);
    return sendResponse(500, "Terjadi kesalahan saat mengambil portfolio");
  }
}

export async function POST(request: NextRequest) {
  try {
    rateLimitApi(request, {
      limit: 20,
      windowMs: 60 * 1000,
      key: "post-portfolio",
    });
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "asesor") {
      return sendResponse(
        403,
        "Akses ditolak. Hanya asesor yang dapat mengunggah portfolio.",
      );
    }

    const body = await request.json();
    if (!body.nama_dokumen) {
      return sendResponse(400, "Field 'nama_dokumen' wajib diisi.");
    }

    const validatedData = CreatePortfolioSchema.parse(body);
    const asesorId = parseInt(session.user.id, 10);

    const portfolioBaru = await portfolioService.create(asesorId, validatedData);

    revalidatePath("/api/portfolio");

    return sendResponse(
      201,
      "Dokumen portfolio berhasil diunggah",
      portfolioBaru,
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
    console.error("[POST /api/portfolio]", error);
    return sendResponse(500, "Terjadi kesalahan saat mengunggah portfolio");
  }
}
