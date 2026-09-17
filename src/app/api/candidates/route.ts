import { NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { Prisma } from "@prisma/client";
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
      key: "get-candidates",
    });
    const session = await getServerSession(authOptions);
    if (!session) {
      return sendResponse(401, "Anda harus login.");
    }

    const role = session.user?.role;
    if (role !== "admin" && role !== "asesor") {
      return sendResponse(
        403,
        "Akses ditolak. Hanya admin atau asesor yang dapat melihat daftar kandidat.",
      );
    }

    const { searchParams } = new URL(request.url);
    const jadwalId = searchParams.get("jadwal_id");
    const skemaId = searchParams.get("skema_id");

    const whereClause: Prisma.PengajuanSkemaWhereInput = {};
    if (jadwalId) {
      whereClause.jadwal_asesmen_peserta = {
        some: { jadwal_id: parseInt(jadwalId, 10) },
      };
    }
    if (skemaId) {
      whereClause.skemaId = parseInt(skemaId, 10);
    }

    // Jika asesor, hanya tampilkan kandidat yang dijadwalkan pada asesor tersebut
    if (role === "asesor") {
      const asesorId = parseInt(session.user.id, 10);
      whereClause.jadwal_asesmen_peserta = {
        some: {
          jadwal_asesmen: { asesor_id: asesorId },
        },
      };
    }

    const candidates = await db.pengajuanSkema.findMany({
      where: whereClause,
      include: {
        user: { 
          select: { 
            username: true, 
            email: true,
            profil: { select: { namaLengkap: true, nik: true } }
          } 
        },
        dataPribadi: {
          select: { nik: true, namaLengkap: true, noHp: true },
        },
        skema: { select: { kodeSkema: true, namaSkema: true } },
        hasil_asesmen: true,
        jadwal_asesmen_peserta: {
          include: {
            jadwal_asesmen: {
              select: {
                id: true,
                tanggal: true,
                waktu_mulai: true,
                tipe_tuk: true,
                metode: true,
                alamat: true,
                noRegMet: true,
                asesor_id: true,
                master_tuk: { select: { nama: true } },
                users: {
                  select: {
                    profil: {
                      select: { namaLengkap: true, nomorRegistrasiMet: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Format output (menyerupai v_candidate_list)
    const formattedCandidates = candidates.map((c) => {
      const jadwal = c.jadwal_asesmen_peserta[0]?.jadwal_asesmen;
      let formattedWaktu = "09:00 - 12:00 WIB";
      if (jadwal?.waktu_mulai) {
        try {
          const w = new Date(jadwal.waktu_mulai);
          if (!isNaN(w.getTime())) {
            const startHour = w.getUTCHours();
            const startMin = String(w.getUTCMinutes()).padStart(2, "0");
            const endHour = (startHour + 3) % 24;
            formattedWaktu = `${String(startHour).padStart(2, "0")}:${startMin} - ${String(endHour).padStart(2, "0")}:${startMin} WIB`;
          }
        } catch {
          // fallback
        }
      }

      return {
        pengajuanId: c.id,
        nomorPengajuan: c.nomorPengajuan,
        statusPengajuan: c.status,
        nik: c.dataPribadi?.nik || c.user?.profil?.nik || undefined,
        namaLengkap: c.dataPribadi?.namaLengkap || c.user?.profil?.namaLengkap || c.user?.username,
        email: c.user?.email,
        noHp: c.dataPribadi?.noHp,
        skemaId: c.skemaId,
        kodeSkema: c.skema?.kodeSkema,
        namaSkema: c.skema?.namaSkema,
        hasilAsesmen: c.hasil_asesmen?.hasil || "Belum Dinilai",
        jadwalId: jadwal?.id,
        tanggalJadwal: jadwal?.tanggal,
        waktuMulai: formattedWaktu,
        tipeTuk: jadwal?.tipe_tuk,
        metode: jadwal?.metode,
        alamat: jadwal?.alamat,
        namaTuk: jadwal?.master_tuk?.nama,
        asesorId: jadwal?.asesor_id,
        namaAsesor: jadwal?.users?.profil?.namaLengkap,
        asesorReg:
          jadwal?.noRegMet ||
          jadwal?.users?.profil?.nomorRegistrasiMet ||
          "",
      };
    });

    return sendResponse(
      200,
      "Berhasil mengambil daftar kandidat",
      formattedCandidates,
    );
  } catch (error) {
    if (error instanceof RateLimitError) {
      return sendResponse(error.status, "Terlalu banyak permintaan.");
    }
    console.error("[GET /api/candidates]", error);
    return sendResponse(
      500,
      "Terjadi kesalahan saat mengambil daftar kandidat",
    );
  }
}
