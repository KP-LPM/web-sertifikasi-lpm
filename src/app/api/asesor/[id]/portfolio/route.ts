import { NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { db } from "@/lib/db";
import { sendResponse } from "@/lib/response";
import { authOptions } from "@/lib/auth-options";
import { rateLimitApi, RateLimitError } from "@/lib/rate-limit";

type Context = { params: Promise<{ id: string }> };

export const revalidate = 3600;

export async function GET(request: NextRequest, context: Context) {
  try {
    rateLimitApi(request, {
      limit: 60,
      windowMs: 60 * 1000,
      key: "get-asesor-portfolio",
    });

    const session = await getServerSession(authOptions);
    if (!session) {
      return sendResponse(401, "Anda harus login.");
    }

    const { id } = await context.params;
    const asesorId = parseInt(id, 10);
    if (isNaN(asesorId)) return sendResponse(400, "ID asesor tidak valid.");

    // Hanya admin atau asesor yang bersangkutan yang boleh melihat portfolionya
    if (session.user?.role !== "admin" && session.user?.id !== id) {
      return sendResponse(
        403,
        "Akses ditolak. Anda tidak dapat melihat portfolio asesor lain.",
      );
    }

    const portfolios = await db.portfolio_asesor.findMany({
      where: { asesor_id: asesorId },
      include: {
        master_skema: {
          select: { namaSkema: true, kodeSkema: true },
        },
      },
      orderBy: { created_at: "desc" },
    });

    return sendResponse(200, "Berhasil mengambil portfolio asesor", portfolios);
  } catch (error) {
    if (error instanceof RateLimitError) {
      return sendResponse(
        error.status,
        "Terlalu banyak permintaan. Silakan coba lagi nanti.",
      );
    }
    console.error("[GET /api/asesor/:id/portfolio]", error);
    return sendResponse(500, "Terjadi kesalahan saat mengambil portfolio");
  }
}
