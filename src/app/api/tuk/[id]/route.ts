/**
 * GET    /api/tuk/[id]  — Detail TUK beserta daftar inventaris
 * PATCH  /api/tuk/[id]  — [admin] Update data TUK
 * DELETE /api/tuk/[id]  — [admin] Nonaktifkan TUK (soft-delete)
 */
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { sendResponse } from "@/lib/response";
import { authOptions } from "@/lib/auth-options";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const tukId = parseInt(id, 10);
    if (isNaN(tukId)) return sendResponse(400, "ID TUK tidak valid.");

    const tuk = await prisma.master_tuk.findUnique({
      where: { id: tukId },
      include: { master_tuk_inventaris: true },
    });

    if (!tuk) return sendResponse(404, "TUK tidak ditemukan.");

    return sendResponse(200, "Berhasil mengambil detail TUK", tuk);
  } catch (error) {
    console.error("[GET /api/tuk/:id]", error);
    return sendResponse(500, "Terjadi kesalahan saat mengambil detail TUK");
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return sendResponse(403, "Akses ditolak. Hanya admin yang dapat mengubah TUK.");
    }

    const { id } = await params;
    const tukId = parseInt(id, 10);
    if (isNaN(tukId)) return sendResponse(400, "ID TUK tidak valid.");

    const tukExisting = await prisma.master_tuk.findUnique({ where: { id: tukId } });
    if (!tukExisting) return sendResponse(404, "TUK tidak ditemukan.");

    const body = await request.json();
    const { nama, keterangan, tipe, alamat, kapasitas, penanggung_jawab, status } = body;

    const tukUpdated = await prisma.master_tuk.update({
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

    return sendResponse(200, "TUK berhasil diperbarui", tukUpdated);
  } catch (error) {
    console.error("[PATCH /api/tuk/:id]", error);
    return sendResponse(500, "Terjadi kesalahan saat memperbarui TUK");
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return sendResponse(403, "Akses ditolak. Hanya admin yang dapat menonaktifkan TUK.");
    }

    const { id } = await params;
    const tukId = parseInt(id, 10);
    if (isNaN(tukId)) return sendResponse(400, "ID TUK tidak valid.");

    const tukExisting = await prisma.master_tuk.findUnique({ where: { id: tukId } });
    if (!tukExisting) return sendResponse(404, "TUK tidak ditemukan.");

    // Soft-delete: ubah status menjadi Nonaktif
    await prisma.master_tuk.update({
      where: { id: tukId },
      data: { status: "Nonaktif" },
    });

    return sendResponse(200, "TUK berhasil dinonaktifkan");
  } catch (error) {
    console.error("[DELETE /api/tuk/:id]", error);
    return sendResponse(500, "Terjadi kesalahan saat menonaktifkan TUK");
  }
}
