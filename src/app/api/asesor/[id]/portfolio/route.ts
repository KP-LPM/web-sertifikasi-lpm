import { NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { db } from "@/lib/db";
import { sendResponse } from "@/lib/response";
import { authOptions } from "@/lib/auth-options";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return sendResponse(401, "Anda harus login.");
    }

    const { id } = await params;
    const asesorId = parseInt(id, 10);
    if (isNaN(asesorId)) return sendResponse(400, "ID asesor tidak valid.");

    // Hanya admin atau asesor yang bersangkutan yang boleh melihat portfolionya
    if (session.user?.role !== "admin" && session.user?.id !== id) {
      return sendResponse(403, "Akses ditolak. Anda tidak dapat melihat portfolio asesor lain.");
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
    console.error("[GET /api/asesor/:id/portfolio]", error);
    return sendResponse(500, "Terjadi kesalahan saat mengambil portfolio");
  }
}
