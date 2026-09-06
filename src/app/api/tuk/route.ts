import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { db } from "@/lib/db";
import { sendResponse } from "@/lib/response";
import { authOptions } from "@/lib/auth-options";
import { rateLimitApi, RateLimitError } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export async function GET(request: NextRequest) {
  try {
    rateLimitApi(request, {
      limit: 60,
      windowMs: 60 * 1000,
      key: "get-all-tuk",
    });
    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get("status");

    const where = statusParam === "all" ? {} : { status: "Aktif" };

    const tukList = await db.master_tuk.findMany({
      where,
      include: {
        master_tuk_inventaris: true,
      },
      orderBy: { id: "asc" },
    });

    return sendResponse(200, "Berhasil mengambil data TUK", tukList);
  } catch (error) {
    if (error instanceof RateLimitError) {
      return sendResponse(error.status, "Terlalu banyak permintaan.");
    }
    console.error("[GET /api/tuk]", error);
    return sendResponse(500, "Terjadi kesalahan saat mengambil data TUK");
  }
}

export async function POST(request: NextRequest) {
  try {
    rateLimitApi(request, {
      limit: 20,
      windowMs: 60 * 1000,
      key: "post-tuk",
    });

    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return sendResponse(
        403,
        "Akses ditolak. Hanya admin yang dapat menambah TUK.",
      );
    }

    const body = await request.json();
    const { nama, keterangan, tipe, alamat, kapasitas, penanggung_jawab } =
      body;

    if (!nama) {
      return sendResponse(400, "Field 'nama' wajib diisi.");
    }

    const tukBaru = await db.master_tuk.create({
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

    revalidatePath("/api/tuk");

    return sendResponse(201, "TUK berhasil ditambahkan", tukBaru);
  } catch (error) {
    if (error instanceof RateLimitError) {
      return sendResponse(error.status, "Terlalu banyak permintaan.");
    }
    console.error("[POST /api/tuk]", error);
    return sendResponse(500, "Terjadi kesalahan saat menambah TUK");
  }
}
