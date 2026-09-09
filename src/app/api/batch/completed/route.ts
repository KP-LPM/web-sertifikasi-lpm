import { NextRequest } from "next/server";
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
      key: "get-batch-completed",
    });
    const session = await getServerSession(authOptions);
    if (!session) {
      return sendResponse(401, "Anda harus login.");
    }

    const role = session.user?.role;
    if (role !== "admin" && role !== "asesor") {
      return sendResponse(403, "Akses ditolak.");
    }

    // Hanya ambil batch (jadwal_asesmen atau pleno_batch tergantung bisnis,
    // di sini kita gunakan pleno_batch dengan status "Selesai")
    const completedBatches = await db.pleno_batch.findMany({
      where: { status: "Selesai" },
      include: {
        pleno_asesi: {
          include: {
            pengajuan_skema: {
              include: {
                dataPribadi: { select: { namaLengkap: true } },
                skema: { select: { namaSkema: true } },
              },
            },
          },
        },
        pleno_batch_skema: {
          include: { master_skema: { select: { namaSkema: true } } },
        },
      },
      orderBy: { tanggal: "desc" },
    });

    const formatted = completedBatches.map((batch) => {
      let kompeten = 0;
      let belumKompeten = 0;

      batch.pleno_asesi.forEach((asesi) => {
        if (asesi.status_pleno === "Kompeten" || asesi.status_pleno === "K") {
          kompeten++;
        } else if (
          asesi.status_pleno === "Belum Kompeten" ||
          asesi.status_pleno === "BK"
        ) {
          belumKompeten++;
        }
      });

      return {
        id: batch.id,
        batchCode: batch.batch_code,
        title: batch.title,
        tanggal: batch.tanggal,
        waktu: batch.waktu,
        alamat: batch.alamat,
        skemaList: batch.pleno_batch_skema.map(
          (s) => s.master_skema.namaSkema,
        ),
        totalAsesi: batch.pleno_asesi.length,
        rekapHasil: { kompeten, belumKompeten },
      };
    });

    return sendResponse(
      200,
      "Berhasil mengambil daftar batch selesai",
      formatted,
    );
  } catch (error) {
    if (error instanceof RateLimitError) {
      return sendResponse(error.status, "Terlalu banyak permintaan.");
    }
    console.error("[GET /api/batch/completed]", error);
    return sendResponse(
      500,
      "Terjadi kesalahan saat mengambil daftar batch selesai",
    );
  }
}
