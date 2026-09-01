/**
 * GET  /api/tuk  — List TUK (default: hanya yang aktif; ?status=all untuk semua)
 * POST /api/tuk  — [admin] Tambah TUK baru
 */
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { sendResponse } from "@/lib/response";
import { authOptions } from "@/lib/auth-options";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get("status");

    const where =
      statusParam === "all" ? {} : { status: "Aktif" };

    const tukList = await prisma.master_tuk.findMany({
      where,
      include: {
        master_tuk_inventaris: true,
      },
      orderBy: { id: "asc" },
    });

    return sendResponse(200, "Berhasil mengambil data TUK", tukList);
  } catch (error) {
    console.error("[GET /api/tuk]", error);
    return sendResponse(500, "Terjadi kesalahan saat mengambil data TUK");
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return sendResponse(403, "Akses ditolak. Hanya admin yang dapat menambah TUK.");
    }

    const body = await request.json();
    const { nama, keterangan, tipe, alamat, kapasitas, penanggung_jawab } = body;

    if (!nama) {
      return sendResponse(400, "Field 'nama' wajib diisi.");
    }

    const tukBaru = await prisma.master_tuk.create({
      data: {
        nama,
        keterangan: keterangan ?? null,
        tipe: tipe ?? null,
        alamat: alamat ?? null,
        kapasitas: kapasitas ? Number(kapasitas) : null,
        penanggung_jawab: penanggung_jawab ?? null,
        status: "Aktif",
      },
    });

    return sendResponse(201, "TUK berhasil ditambahkan", tukBaru);
  } catch (error) {
    console.error("[POST /api/tuk]", error);
    return sendResponse(500, "Terjadi kesalahan saat menambah TUK");
  }
}
