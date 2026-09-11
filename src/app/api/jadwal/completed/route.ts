import { NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { db } from "@/lib/db";
import { sendResponse } from "@/lib/response";
import { authOptions } from "@/lib/auth-options";
import { rateLimitApi, RateLimitError } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    rateLimitApi(request, {
      limit: 60,
      windowMs: 60 * 1000,
      key: "get-jadwal-completed",
    });
    
    const session = await getServerSession(authOptions);
    if (!session) {
      return sendResponse(401, "Anda harus login.");
    }

    const role = session.user?.role;
    if (role !== "admin" && role !== "asesor") {
      return sendResponse(403, "Akses ditolak.");
    }

    const completedBatches = await db.jadwal_asesmen.findMany({
      where: { status: "Selesai" },
      include: {
        users: { select: { username: true, profil: { select: { namaLengkap: true } } } },
        master_skema: { select: { namaSkema: true } },
        hasil_asesmen: {
          include: {
            pengajuan_skema: {
              include: {
                dataPribadi: { select: { namaLengkap: true, nik: true } },
              },
            },
          },
        },
      },
      orderBy: { tanggal: "desc" },
    });

    const formatted = completedBatches.map((batch) => {
      let kompetenCount = 0;
      let belumKompetenCount = 0;

      const asesiList = batch.hasil_asesmen.map((hasil: any) => {
        const h = hasil.hasil || "";
        if (h.toLowerCase() === "kompeten") kompetenCount++;
        else if (h.toLowerCase() === "belum kompeten" || h.toLowerCase() === "tidak kompeten") belumKompetenCount++;

        return {
          nama: hasil.pengajuan_skema?.dataPribadi?.namaLengkap || "Asesi",
          nik: hasil.pengajuan_skema?.dataPribadi?.nik || "-",
          hasil: h || "Belum Dinilai",
        };
      });

      return {
        id: batch.id,
        kode: batch.kode_batch,
        nama: batch.nama_batch || batch.kode_batch,
        skema: batch.master_skema?.namaSkema || "-",
        asesor: batch.users?.profil?.namaLengkap || batch.users?.username || "-",
        tipeTuk: batch.tipe_tuk,
        metode: batch.metode,
        tanggal: batch.tanggal,
        waktu: batch.waktu_mulai ? new Date(batch.waktu_mulai).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "-",
        totalAsesi: asesiList.length,
        kompetenCount,
        belumKompetenCount,
        status: batch.status,
        suratPenugasan: batch.surat_tugas_name || "",
        suratTugasUrl: batch.surat_tugas_url || "",
        asesiList,
      };
    });

    return sendResponse(
      200,
      "Berhasil mengambil daftar asesmen selesai",
      formatted,
    );
  } catch (error) {
    if (error instanceof RateLimitError) {
      return sendResponse(error.status, "Terlalu banyak permintaan.");
    }
    console.error("[GET /api/jadwal/completed]", error);
    return sendResponse(
      500,
      "Terjadi kesalahan saat mengambil daftar asesmen selesai",
    );
  }
}
