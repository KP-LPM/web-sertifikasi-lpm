import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { db } from "@/lib/db";
import { sendResponse } from "@/lib/response";
import { rateLimitApi, RateLimitError } from "@/lib/rate-limit";
import { ClientError } from "@/error/index";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    rateLimitApi(request, {
      limit: 60,
      windowMs: 60 * 1000,
      key: "get-banding-list",
    });

    const token = await getToken({ req: request });
    if (!token) {
      return sendResponse(401, "Anda harus login terlebih dahulu");
    }

    const userId = Number(token.id);
    const role = token.role as string;

    const whereClause: Record<string, unknown> = {};
    if (role === "asesi") {
      whereClause.hasil_asesmen = {
        pengajuan_skema: {
          userId: userId,
        },
      };
    }

    const list = await db.pengajuan_banding.findMany({
      where: whereClause,
      select: {
        id: true,
        tanggal_pengajuan: true,
        status: true,
        alasan: true,
        penjelasan: true,
        dijelaskan: true,
        didiskusikan: true,
        melibatkan_orang_lain: true,
        ttd_asesi: true,
        hasil_asesmen: {
          select: {
            pengajuan_id: true,
            hasil: true,
            pengajuan_skema: {
              select: {
                id: true,
                skema: { select: { id: true, namaSkema: true, kodeSkema: true } },
                dataPribadi: { select: { namaLengkap: true, nik: true } },
                user: { select: { id: true, username: true, email: true } },
                apl02_penilaian: { select: { nama_asesor: true } },
              },
            },
            jadwal_asesmen: {
              select: {
                tipe_tuk: true,
                metode: true,
                alamat: true,
                users: {
                  select: {
                    id: true,
                    username: true,
                    profil: { select: { namaLengkap: true } },
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { created_at: "desc" },
    });

    return sendResponse(200, "Berhasil mengambil daftar pengajuan banding", list);
  } catch (error) {
    if (error instanceof RateLimitError) {
      return sendResponse(error.status, "Terlalu banyak permintaan.");
    }
    if (error instanceof ClientError) {
      return sendResponse(error.statusCode, error.message);
    }
    console.error("[GET /api/banding]:", error);
    return sendResponse(500, "Terjadi kesalahan saat mengambil data banding");
  }
}

export async function POST(request: NextRequest) {
  try {
    rateLimitApi(request, {
      limit: 20,
      windowMs: 60 * 1000,
      key: "post-banding",
    });

    const token = await getToken({ req: request });
    if (!token) {
      return sendResponse(401, "Anda harus login terlebih dahulu");
    }

    const body = await request.json();
    const {
      pengajuanId,
      hasilAsesmenId,
      alasan,
      penjelasan,
      dijelaskan,
      didiskusikan,
      melibatkanOrangLain,
      ttdAsesi,
    } = body;

    if (!alasan) {
      return sendResponse(400, "Alasan pengajuan banding wajib diisi");
    }

    let targetHasilId = hasilAsesmenId ? Number(hasilAsesmenId) : null;

    if (!targetHasilId && pengajuanId) {
      const existingHasil = await db.hasil_asesmen.findUnique({
        where: { pengajuan_id: Number(pengajuanId) },
      });

      if (existingHasil) {
        targetHasilId = existingHasil.id;
      } else {
        const newHasil = await db.hasil_asesmen.create({
          data: {
            pengajuan_id: Number(pengajuanId),
            hasil: "Belum Kompeten",
            status: "Pengajuan Banding",
          },
        });
        targetHasilId = newHasil.id;
      }
    }

    if (!targetHasilId) {
      return sendResponse(
        400,
        "ID pengajuan atau ID hasil asesmen harus disertakan untuk mengajukan banding",
      );
    }

    const newBanding = await db.pengajuan_banding.create({
      data: {
        hasil_asesmen_id: targetHasilId,
        alasan: String(alasan),
        penjelasan: penjelasan ? String(penjelasan) : "",
        dijelaskan: Boolean(dijelaskan),
        didiskusikan: Boolean(didiskusikan),
        melibatkan_orang_lain: Boolean(melibatkanOrangLain),
        ttd_asesi: ttdAsesi ? String(ttdAsesi) : "",
        status: "Menunggu Verifikasi",
      },
    });

    return sendResponse(201, "Pengajuan banding berhasil dikirim", newBanding);
  } catch (error) {
    if (error instanceof RateLimitError) {
      return sendResponse(error.status, "Terlalu banyak permintaan.");
    }
    if (error instanceof ClientError) {
      return sendResponse(error.statusCode, error.message);
    }
    console.error("[POST /api/banding]:", error);
    return sendResponse(500, "Terjadi kesalahan saat menyimpan pengajuan banding");
  }
}
