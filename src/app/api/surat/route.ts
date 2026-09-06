import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { db } from "@/lib/db";
import { sendResponse } from "@/lib/response";
import { authOptions } from "@/lib/auth-options";
import { Prisma } from "@prisma/client";
import { rateLimitApi, RateLimitError } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export async function GET(request: NextRequest) {
  try {
    rateLimitApi(request, {
      limit: 60,
      windowMs: 60 * 1000,
      key: "get-all-surat",
    });
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return sendResponse(403, "Akses ditolak. Hanya admin yang dapat melihat daftar surat.");
    }

    const { searchParams } = new URL(request.url);
    const kategori = searchParams.get("kategori");
    const jenisSurat = searchParams.get("jenis_surat");
    const status = searchParams.get("status");
    const skemaId = searchParams.get("skema_id");

    const where: Prisma.suratWhereInput = {
      ...(kategori && { kategori }),
      ...(jenisSurat && { jenis_surat: jenisSurat }),
      ...(status && { status }),
      ...(skemaId && { skema_id: parseInt(skemaId, 10) }),
    };

    const suratList = await db.surat.findMany({
      where,
      include: {
        master_skema: {
          select: { namaSkema: true, kodeSkema: true },
        },
      },
      orderBy: { created_at: "desc" },
    });

    return sendResponse(200, "Berhasil mengambil daftar surat", suratList);
  } catch (error) {
    if (error instanceof RateLimitError) {
      return sendResponse(error.status, "Terlalu banyak permintaan.");
    }
    console.error("[GET /api/surat]", error);
    return sendResponse(500, "Terjadi kesalahan saat mengambil daftar surat");
  }
}

export async function POST(request: NextRequest) {
  try {
    rateLimitApi(request, {
      limit: 20,
      windowMs: 60 * 1000,
      key: "post-surat",
    });

    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return sendResponse(403, "Akses ditolak. Hanya admin yang dapat membuat surat.");
    }

    const body = await request.json();
    const { 
      nomor_surat, 
      judul, 
      kategori, 
      jenis_surat, 
      nama_jenis_surat,
      tanggal_terbit,
      penerbit,
      penerima,
      skema_id,
      jumlah_asesi,
      status,
      url_dokumen,
      url_gdrive,
      catatan,
      no_sk,
      pimpinan_sidang,
      notulis,
      nama_asesor,
      no_met_asesor,
      lokasi,
      detail_payload
    } = body;

    if (!nomor_surat || !judul || !kategori || !jenis_surat) {
      return sendResponse(400, "Field 'nomor_surat', 'judul', 'kategori', dan 'jenis_surat' wajib diisi.");
    }

    const existingSurat = await db.surat.findUnique({
      where: { nomor_surat },
    });

    if (existingSurat) {
      return sendResponse(400, "Nomor surat sudah terdaftar.");
    }

    const suratBaru = await db.surat.create({
      data: {
        nomor_surat,
        judul,
        kategori,
        jenis_surat,
        nama_jenis_surat: nama_jenis_surat ?? null,
        tanggal_terbit: tanggal_terbit ? new Date(tanggal_terbit) : null,
        penerbit: penerbit ?? null,
        penerima: penerima ?? null,
        skema_id: skema_id ? parseInt(skema_id, 10) : null,
        jumlah_asesi: jumlah_asesi ? parseInt(jumlah_asesi, 10) : null,
        status: status ?? "Draft",
        url_dokumen: url_dokumen ?? null,
        url_gdrive: url_gdrive ?? null,
        catatan: catatan ?? null,
        no_sk: no_sk ?? null,
        pimpinan_sidang: pimpinan_sidang ?? null,
        notulis: notulis ?? null,
        nama_asesor: nama_asesor ?? null,
        no_met_asesor: no_met_asesor ?? null,
        lokasi: lokasi ?? null,
        detail_payload: detail_payload ?? null,
      },
    });

    revalidatePath("/api/surat");

    return sendResponse(201, "Surat berhasil dibuat", suratBaru);
  } catch (error) {
    if (error instanceof RateLimitError) {
      return sendResponse(error.status, "Terlalu banyak permintaan.");
    }
    console.error("[POST /api/surat]", error);
    return sendResponse(500, "Terjadi kesalahan saat membuat surat");
  }
}
