/**
 * GET    /api/tuk/[id]  — Detail TUK beserta daftar inventaris
 * PATCH  /api/tuk/[id]  — [admin] Update data TUK
 * DELETE /api/tuk/[id]  — [admin] Nonaktifkan TUK (soft-delete)
 */
import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { db } from "@/lib/db";
import { sendResponse } from "@/lib/response";
import { authOptions } from "@/lib/auth-options";
import { rateLimitApi, RateLimitError } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    rateLimitApi(_request, {
      limit: 60,
      windowMs: 60 * 1000,
      key: "get-tuk-detail",
    });
    const { id } = await params;
    const tukId = parseInt(id, 10);
    if (isNaN(tukId)) return sendResponse(400, "ID TUK tidak valid.");

    const tuk = await db.master_tuk.findUnique({
      where: { id: tukId },
      include: { master_tuk_inventaris: true },
    });

    if (!tuk) return sendResponse(404, "TUK tidak ditemukan.");

    return sendResponse(200, "Berhasil mengambil detail TUK", tuk);
  } catch (error) {
    if (error instanceof RateLimitError) {
      return sendResponse(error.status, "Terlalu banyak permintaan.");
    }
    console.error("[GET /api/tuk/:id]", error);
    return sendResponse(500, "Terjadi kesalahan saat mengambil detail TUK");
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    rateLimitApi(request, {
      limit: 20,
      windowMs: 60 * 1000,
      key: "patch-tuk",
    });

    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return sendResponse(403, "Akses ditolak. Hanya admin yang dapat mengubah TUK.");
    }

    const { id } = await params;
    const tukId = parseInt(id, 10);
    if (isNaN(tukId)) return sendResponse(400, "ID TUK tidak valid.");

    const tukExisting = await db.master_tuk.findUnique({ where: { id: tukId } });
    if (!tukExisting) return sendResponse(404, "TUK tidak ditemukan.");

    const body = await request.json();
    const { nama, keterangan, tipe, alamat, kapasitas, penanggung_jawab, status } = body;

    const tukUpdated = await db.master_tuk.update({
      where: { id: tukId },
      data: {
        ...(nama !== undefined && { nama }),
        ...(keterangan !== undefined && { keterangan }),
        ...(tipe !== undefined && { tipe }),
        ...(alamat !== undefined && { alamat }),
        ...(kapasitas !== undefined && { kapasitas: Number(kapasitas) }),
        ...(penanggung_jawab !== undefined && { penanggung_jawab }),
        ...(status !== undefined && { status }),
      },
    });

    revalidatePath("/api/tuk");

    return sendResponse(200, "TUK berhasil diperbarui", tukUpdated);
  } catch (error) {
    if (error instanceof RateLimitError) {
      return sendResponse(error.status, "Terlalu banyak permintaan.");
    }
    console.error("[PATCH /api/tuk/:id]", error);
    return sendResponse(500, "Terjadi kesalahan saat memperbarui TUK");
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    rateLimitApi(_request, {
      limit: 20,
      windowMs: 60 * 1000,
      key: "delete-tuk",
    });

    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return sendResponse(403, "Akses ditolak. Hanya admin yang dapat menonaktifkan TUK.");
    }

    const { id } = await params;
    const tukId = parseInt(id, 10);
    if (isNaN(tukId)) return sendResponse(400, "ID TUK tidak valid.");

    const tukExisting = await db.master_tuk.findUnique({ where: { id: tukId } });
    if (!tukExisting) return sendResponse(404, "TUK tidak ditemukan.");

    // Soft-delete: ubah status menjadi Nonaktif
    await db.master_tuk.update({
      where: { id: tukId },
      data: { status: "Nonaktif" },
    });

    revalidatePath("/api/tuk");

    return sendResponse(200, "TUK berhasil dinonaktifkan");
  } catch (error) {
    if (error instanceof RateLimitError) {
      return sendResponse(error.status, "Terlalu banyak permintaan.");
    }
    console.error("[DELETE /api/tuk/:id]", error);
    return sendResponse(500, "Terjadi kesalahan saat menonaktifkan TUK");
  }
}
