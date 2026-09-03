import { NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { db } from "@/lib/db";
import { sendResponse } from "@/lib/response";
import { authOptions } from "@/lib/auth-options";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return sendResponse(403, "Akses ditolak. Hanya admin yang dapat memverifikasi portfolio.");
    }

    const { id } = await params;
    const portfolioId = parseInt(id, 10);
    if (isNaN(portfolioId)) return sendResponse(400, "ID portfolio tidak valid.");

    const portfolioExisting = await db.portfolio_asesor.findUnique({
      where: { id: portfolioId },
    });

    if (!portfolioExisting) {
      return sendResponse(404, "Portfolio tidak ditemukan.");
    }

    const body = await request.json();
    const { status, catatan_admin } = body;

    if (!status || !["Terverifikasi", "Ditolak", "Menunggu Verifikasi"].includes(status)) {
      return sendResponse(400, "Status tidak valid. Gunakan 'Terverifikasi' atau 'Ditolak'.");
    }

    const portfolioUpdated = await db.portfolio_asesor.update({
      where: { id: portfolioId },
      data: {
        status,
        ...(catatan_admin !== undefined && { catatan_admin }),
      },
    });

    return sendResponse(200, "Portfolio berhasil diverifikasi", portfolioUpdated);
  } catch (error) {
    console.error("[PATCH /api/portfolio/:id/verifikasi]", error);
    return sendResponse(500, "Terjadi kesalahan saat memverifikasi portfolio");
  }
}
