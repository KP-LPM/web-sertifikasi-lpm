import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { sertifikatService } from "@/services/sertifikat.service";
import { sendResponse } from "@/lib/response";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await getToken({ req: request });
    if (!token || token.role !== "admin")
      return sendResponse(403, "Akses ditolak");

    const id = (await params).id;
    const pengajuanId = Number(id);

    if (isNaN(pengajuanId)) {
      return sendResponse(400, "ID pengajuan tidak valid");
    }

    await sertifikatService.delete(pengajuanId);
    return sendResponse(200, "Berhasil menghapus sertifikat");
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && (error as { code: string }).code === 'P2025') {
      return sendResponse(404, "Sertifikat tidak ditemukan");
    }
    console.error("Gagal menghapus sertifikat:", error);
    return sendResponse(500, "Internal server error");
  }
}
