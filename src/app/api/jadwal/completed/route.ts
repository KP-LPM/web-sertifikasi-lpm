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
        users: {
          select: {
            username: true,
            profil: { select: { namaLengkap: true, nomorRegistrasiMet: true } },
          },
        },
        master_skema: { select: { namaSkema: true, kodeSkema: true } },
        jadwal_asesmen_peserta: {
          include: {
            pengajuan_skema: {
              include: {
                dataPribadi: { select: { namaLengkap: true, nik: true } },
                hasil_asesmen: { select: { hasil: true } }
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

      const asesiList = batch.jadwal_asesmen_peserta.map((peserta) => {
        const h = peserta.pengajuan_skema?.hasil_asesmen?.hasil || "";
        if (h.toLowerCase() === "kompeten") kompetenCount++;
        else if (
          h.toLowerCase() === "belum kompeten" ||
          h.toLowerCase() === "tidak kompeten"
        )
          belumKompetenCount++;

        return {
          id: peserta.pengajuan_id,
          nama: peserta.pengajuan_skema?.dataPribadi?.namaLengkap || "Asesi",
          nik: peserta.pengajuan_skema?.dataPribadi?.nik || "-",
          hasil: h || "Belum Dinilai",
        };
      });

      return {
        id: batch.id,
        kode: batch.nama_batch || `BATCH-${batch.id}`, // Add kode for the UI
        nama: batch.nama_batch,
        skema: batch.master_skema?.namaSkema || "-",
        noSkema: batch.master_skema?.kodeSkema || "-",
        asesor:
          batch.users?.profil?.namaLengkap || batch.users?.username || "-",
        asesorReg: batch.users?.profil?.nomorRegistrasiMet || "-",
        tipeTuk: batch.tipe_tuk,
        metode: batch.metode,
        tanggal: batch.tanggal,
        waktu: batch.waktu_mulai
          ? new Date(batch.waktu_mulai).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "-",
        totalAsesi: asesiList.length,
        kompetenCount,
        belumKompetenCount,
        status: batch.status,
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
