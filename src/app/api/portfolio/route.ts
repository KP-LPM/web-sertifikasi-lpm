import { NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { sendResponse } from "@/lib/response";
import { authOptions } from "@/lib/auth-options";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "asesor") {
      return sendResponse(403, "Akses ditolak. Hanya asesor yang dapat mengunggah portfolio.");
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

    if (!nama_dokumen) {
      return sendResponse(400, "Field 'nama_dokumen' wajib diisi.");
    }

    const asesorId = parseInt(session.user.id, 10);

    const portfolioBaru = await prisma.portfolio_asesor.create({
      data: {
        asesor_id: asesorId,
        skema_id: skema_id ? parseInt(skema_id, 10) : null,
        nama_dokumen,
        deskripsi: deskripsi ?? null,
        tanggal: tanggal ? new Date(tanggal) : null,
        file_name: file_name ?? null,
        file_size: file_size ?? null,
        file_type: file_type ?? null,
        status: "Menunggu Verifikasi",
      },
    });

    return sendResponse(201, "Dokumen portfolio berhasil diunggah", portfolioBaru);
  } catch (error) {
    console.error("[POST /api/portfolio]", error);
    return sendResponse(500, "Terjadi kesalahan saat mengunggah portfolio");
  }
}
