import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { db } from "@/lib/db";
import { sendResponse } from "@/lib/response";
import { authOptions } from "@/lib/auth-options";
import { rateLimitApi, RateLimitError } from "@/lib/rate-limit";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    rateLimitApi(request, {
      limit: 20,
      windowMs: 60 * 1000,
      key: "post-tuk-inventaris",
    });

    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return sendResponse(403, "Akses ditolak. Hanya admin yang dapat menambah inventaris.");
    }

    const { id } = await params;
    const tukId = parseInt(id, 10);
    if (isNaN(tukId)) return sendResponse(400, "ID TUK tidak valid.");

    const tukExisting = await db.master_tuk.findUnique({ where: { id: tukId } });
    if (!tukExisting) return sendResponse(404, "TUK tidak ditemukan.");

    const body = await request.json();
    const { nama, jumlah } = body;

    if (!nama) {
      return sendResponse(400, "Field 'nama' wajib diisi.");
    }

    const inventarisBaru = await db.master_tuk_inventaris.create({
      data: {
        tuk_id: tukId,
        nama,
        jumlah: jumlah ? Number(jumlah) : 0,
      },
    });

    revalidatePath("/api/tuk");

    return sendResponse(201, "Item inventaris berhasil ditambahkan", inventarisBaru);
  } catch (error) {
    if (error instanceof RateLimitError) {
      return sendResponse(error.status, "Terlalu banyak permintaan.");
    }
    console.error("[POST /api/tuk/:id/inventaris]", error);
    return sendResponse(500, "Terjadi kesalahan saat menambah inventaris");
  }
}
