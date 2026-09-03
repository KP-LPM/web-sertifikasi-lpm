import { NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { db } from "@/lib/db";
import { sendResponse } from "@/lib/response";
import { authOptions } from "@/lib/auth-options";

interface RouteParams {
  params: Promise<{ id: string; itemId: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return sendResponse(
        403,
        "Akses ditolak. Hanya admin yang dapat mengubah inventaris.",
      );
    }

    const { id, itemId } = await params;
    const tukId = parseInt(id, 10);
    const invId = parseInt(itemId, 10);

    if (isNaN(tukId) || isNaN(invId)) {
      return sendResponse(400, "ID tidak valid.");
    }

    const inventarisExisting = await db.master_tuk_inventaris.findFirst({
      where: { id: invId, tuk_id: tukId },
    });

    if (!inventarisExisting) {
      return sendResponse(404, "Item inventaris tidak ditemukan.");
    }

    const body = await request.json();
    const { nama, jumlah } = body;

    const inventarisUpdated = await db.master_tuk_inventaris.update({
      where: { id: invId },
      data: {
        ...(nama !== undefined && { nama }),
        ...(jumlah !== undefined && { jumlah: Number(jumlah) }),
      },
    });

    return sendResponse(
      200,
      "Item inventaris berhasil diperbarui",
      inventarisUpdated,
    );
  } catch (error) {
    console.error("[PATCH /api/tuk/:id/inventaris/:itemId]", error);
    return sendResponse(500, "Terjadi kesalahan saat memperbarui inventaris");
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return sendResponse(
        403,
        "Akses ditolak. Hanya admin yang dapat menghapus inventaris.",
      );
    }

    const { id, itemId } = await params;
    const tukId = parseInt(id, 10);
    const invId = parseInt(itemId, 10);

    if (isNaN(tukId) || isNaN(invId)) {
      return sendResponse(400, "ID tidak valid.");
    }

    const inventarisExisting = await db.master_tuk_inventaris.findFirst({
      where: { id: invId, tuk_id: tukId },
    });

    if (!inventarisExisting) {
      return sendResponse(404, "Item inventaris tidak ditemukan.");
    }

    await db.master_tuk_inventaris.delete({
      where: { id: invId },
    });

    return sendResponse(200, "Item inventaris berhasil dihapus");
  } catch (error) {
    console.error("[DELETE /api/tuk/:id/inventaris/:itemId]", error);
    return sendResponse(500, "Terjadi kesalahan saat menghapus inventaris");
  }
}
