import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { db } from "@/lib/db";
import { sendResponse } from "@/lib/response";
import { authOptions } from "@/lib/auth-options";
import { rateLimitApi, RateLimitError } from "@/lib/rate-limit";

export const revalidate = 3600;

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    rateLimitApi(request, {
      limit: 60,
      windowMs: 60 * 1000,
      key: "get-surat-detail",
    });
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return sendResponse(403, "Akses ditolak. Hanya admin yang dapat melihat detail surat.");
    }

    const { id } = await params;
    const suratId = parseInt(id, 10);
    if (isNaN(suratId)) return sendResponse(400, "ID surat tidak valid.");

    const suratDetail = await db.surat.findUnique({
      where: { id: suratId },
      include: {
        master_skema: {
          select: { namaSkema: true, kodeSkema: true },
        },
      },
    });

    if (!suratDetail) {
      return sendResponse(404, "Surat tidak ditemukan.");
    }

    return sendResponse(200, "Berhasil mengambil detail surat", suratDetail);
  } catch (error) {
    if (error instanceof RateLimitError) {
      return sendResponse(error.status, "Terlalu banyak permintaan.");
    }
    console.error("[GET /api/surat/:id]", error);
    return sendResponse(500, "Terjadi kesalahan saat mengambil detail surat");
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    rateLimitApi(request, {
      limit: 20,
      windowMs: 60 * 1000,
      key: "patch-surat",
    });

    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return sendResponse(403, "Akses ditolak. Hanya admin yang dapat mengubah surat.");
    }

    const { id } = await params;
    const suratId = parseInt(id, 10);
    if (isNaN(suratId)) return sendResponse(400, "ID surat tidak valid.");

    const suratExisting = await db.surat.findUnique({
      where: { id: suratId },
    });

    if (!suratExisting) {
      return sendResponse(404, "Surat tidak ditemukan.");
    }

    const body = await request.json();
    const { status, tanggal_terbit, url_dokumen, url_gdrive, catatan } = body;

    const suratUpdated = await db.surat.update({
      where: { id: suratId },
      data: {
        ...(status !== undefined && { status }),
        ...(tanggal_terbit !== undefined && { tanggal_terbit: tanggal_terbit ? new Date(tanggal_terbit) : null }),
        ...(url_dokumen !== undefined && { url_dokumen }),
        ...(url_gdrive !== undefined && { url_gdrive }),
        ...(catatan !== undefined && { catatan }),
      },
    });

    revalidatePath("/api/surat");

    return sendResponse(200, "Surat berhasil diperbarui", suratUpdated);
  } catch (error) {
    if (error instanceof RateLimitError) {
      return sendResponse(error.status, "Terlalu banyak permintaan.");
    }
    console.error("[PATCH /api/surat/:id]", error);
    return sendResponse(500, "Terjadi kesalahan saat memperbarui surat");
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    rateLimitApi(request, {
      limit: 20,
      windowMs: 60 * 1000,
      key: "delete-surat",
    });

    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return sendResponse(403, "Akses ditolak. Hanya admin yang dapat mengarsipkan surat.");
    }

    const { id } = await params;
    const suratId = parseInt(id, 10);
    if (isNaN(suratId)) return sendResponse(400, "ID surat tidak valid.");

    const suratExisting = await db.surat.findUnique({
      where: { id: suratId },
    });

    if (!suratExisting) {
      return sendResponse(404, "Surat tidak ditemukan.");
    }

    // Soft-delete: set status ke 'Arsip'
    await db.surat.update({
      where: { id: suratId },
      data: { status: "Arsip" },
    });

    revalidatePath("/api/surat");

    return sendResponse(200, "Surat berhasil diarsipkan");
  } catch (error) {
    if (error instanceof RateLimitError) {
      return sendResponse(error.status, "Terlalu banyak permintaan.");
    }
    console.error("[DELETE /api/surat/:id]", error);
    return sendResponse(500, "Terjadi kesalahan saat mengarsipkan surat");
  }
}
