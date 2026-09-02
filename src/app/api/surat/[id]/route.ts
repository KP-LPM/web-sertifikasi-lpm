import { NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { sendResponse } from "@/lib/response";
import { authOptions } from "@/lib/auth-options";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return sendResponse(403, "Akses ditolak. Hanya admin yang dapat melihat detail surat.");
    }

    const { id } = await params;
    const suratId = parseInt(id, 10);
    if (isNaN(suratId)) return sendResponse(400, "ID surat tidak valid.");

    const suratDetail = await prisma.surat.findUnique({
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
    console.error("[GET /api/surat/:id]", error);
    return sendResponse(500, "Terjadi kesalahan saat mengambil detail surat");
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return sendResponse(403, "Akses ditolak. Hanya admin yang dapat mengubah surat.");
    }

    const { id } = await params;
    const suratId = parseInt(id, 10);
    if (isNaN(suratId)) return sendResponse(400, "ID surat tidak valid.");

    const suratExisting = await prisma.surat.findUnique({
      where: { id: suratId },
    });

    if (!suratExisting) {
      return sendResponse(404, "Surat tidak ditemukan.");
    }

    const body = await request.json();
    const { status, tanggal_terbit, url_dokumen, url_gdrive, catatan } = body;

    const suratUpdated = await prisma.surat.update({
      where: { id: suratId },
      data: {
        ...(status !== undefined && { status }),
        ...(tanggal_terbit !== undefined && { tanggal_terbit: tanggal_terbit ? new Date(tanggal_terbit) : null }),
        ...(url_dokumen !== undefined && { url_dokumen }),
        ...(url_gdrive !== undefined && { url_gdrive }),
        ...(catatan !== undefined && { catatan }),
      },
    });

    return sendResponse(200, "Surat berhasil diperbarui", suratUpdated);
  } catch (error) {
    console.error("[PATCH /api/surat/:id]", error);
    return sendResponse(500, "Terjadi kesalahan saat memperbarui surat");
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return sendResponse(403, "Akses ditolak. Hanya admin yang dapat mengarsipkan surat.");
    }

    const { id } = await params;
    const suratId = parseInt(id, 10);
    if (isNaN(suratId)) return sendResponse(400, "ID surat tidak valid.");

    const suratExisting = await prisma.surat.findUnique({
      where: { id: suratId },
    });

    if (!suratExisting) {
      return sendResponse(404, "Surat tidak ditemukan.");
    }

    // Soft-delete: set status ke 'Arsip'
    await prisma.surat.update({
      where: { id: suratId },
      data: { status: "Arsip" },
    });

    return sendResponse(200, "Surat berhasil diarsipkan");
  } catch (error) {
    console.error("[DELETE /api/surat/:id]", error);
    return sendResponse(500, "Terjadi kesalahan saat mengarsipkan surat");
  }
}
