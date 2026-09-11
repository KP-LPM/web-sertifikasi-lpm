import { NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { sendResponse } from "@/lib/response";
import { authOptions } from "@/lib/auth-options";
import { rateLimitApi, RateLimitError } from "@/lib/rate-limit";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    rateLimitApi(request, {
      limit: 60,
      windowMs: 60 * 1000,
      key: "get-dashboard-admin-reports",
    });

    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return sendResponse(
        403,
        "Akses ditolak. Hanya admin yang dapat melihat dashboard laporan.",
      );
    }

    const hasilList = await db.hasil_asesmen.findMany({
      include: {
        pengajuan_skema: {
          include: {
            skema: true,
          },
        },
      },
    });

    const reportMap = new Map<string, any>();

    const monthNames = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];

    for (const h of hasilList) {
      if (!h.pengajuan_skema || !h.pengajuan_skema.skema) continue;

      const skemaName = h.pengajuan_skema.skema.namaSkema;
      const date = new Date(h.created_at);
      const year = date.getFullYear().toString();
      const monthIdx = date.getMonth();
      const month = monthNames[monthIdx];

      const key = `${skemaName}-${year}-${month}`;

      if (!reportMap.has(key)) {
        reportMap.set(key, {
          skema: skemaName,
          tahun: year,
          bulan: month,
          bulanIdx: monthIdx,
          kompeten: 0,
          belumKompeten: 0,
        });
      }

      const reportData = reportMap.get(key);
      const result = h.hasil?.toLowerCase() || "";
      if (result === "kompeten") {
        reportData.kompeten += 1;
      } else if (result === "belum kompeten" || result === "tidak kompeten") {
        reportData.belumKompeten += 1;
      } else {
        // You can handle other statuses if needed, maybe exclude them
      }
    }

    const data = Array.from(reportMap.values());
    data.sort((a, b) => a.tahun.localeCompare(b.tahun) || a.bulanIdx - b.bulanIdx);

    // Remove bulanIdx before returning
    const finalData = data.map(({ bulanIdx, ...rest }) => rest);

    return sendResponse(
      200,
      "Berhasil mengambil data laporan admin",
      finalData,
    );
  } catch (error) {
    if (error instanceof RateLimitError) {
      return sendResponse(error.status, "Terlalu banyak permintaan.");
    }
    console.error("[GET /api/dashboard/admin/reports]", error);
    return sendResponse(
      500,
      "Terjadi kesalahan saat mengambil data laporan admin",
    );
  }
}
