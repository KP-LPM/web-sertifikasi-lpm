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
    if (!session || session.user?.role !== "asesor") {
      return sendResponse(403, "Akses ditolak. Hanya asesor yang dapat mengubah portfolionya.");
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

    if (portfolioExisting.asesor_id !== parseInt(session.user.id, 10)) {
      return sendResponse(403, "Anda tidak berhak mengubah portfolio ini.");
    }

    // Hanya bisa diubah jika belum diverifikasi (status masih Menunggu Verifikasi)
    if (portfolioExisting.status !== "Menunggu Verifikasi") {
      return sendResponse(400, "Portfolio sudah diproses dan tidak dapat diubah.");
    }

    const body = await request.json();
    const { 
      skema_id, 
      nama_dokumen, 
      deskripsi, 
      tanggal, 
      file_name, 
      file_size, 
      file_type 
    } = body;

    const portfolioUpdated = await db.portfolio_asesor.update({
      where: { id: portfolioId },
      data: {
        ...(skema_id !== undefined && { skema_id: skema_id ? parseInt(skema_id, 10) : null }),
        ...(nama_dokumen !== undefined && { nama_dokumen }),
        ...(deskripsi !== undefined && { deskripsi }),
        ...(tanggal !== undefined && { tanggal: tanggal ? new Date(tanggal) : null }),
        ...(file_name !== undefined && { file_name }),
        ...(file_size !== undefined && { file_size }),
        ...(file_type !== undefined && { file_type }),
      },
    });

    return sendResponse(200, "Portfolio berhasil diperbarui", portfolioUpdated);
  } catch (error) {
    console.error("[PATCH /api/portfolio/:id]", error);
    return sendResponse(500, "Terjadi kesalahan saat memperbarui portfolio");
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return sendResponse(401, "Anda harus login.");
    }

    const role = session.user?.role;
    if (role !== "asesor" && role !== "admin") {
      return sendResponse(403, "Akses ditolak.");
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

    // Jika asesor, hanya boleh hapus miliknya sendiri dan jika belum diverifikasi
    if (role === "asesor") {
      if (portfolioExisting.asesor_id !== parseInt(session.user.id, 10)) {
        return sendResponse(403, "Anda tidak berhak menghapus portfolio ini.");
      }
      if (portfolioExisting.status !== "Menunggu Verifikasi") {
        return sendResponse(400, "Portfolio sudah diproses dan tidak dapat dihapus.");
      }
    }

    await db.portfolio_asesor.delete({
      where: { id: portfolioId },
    });

    return sendResponse(200, "Portfolio berhasil dihapus");
  } catch (error) {
    console.error("[DELETE /api/portfolio/:id]", error);
    return sendResponse(500, "Terjadi kesalahan saat menghapus portfolio");
  }
}
