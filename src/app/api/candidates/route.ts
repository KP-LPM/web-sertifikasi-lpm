import { NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { db } from "@/lib/db";
import { sendResponse } from "@/lib/response";
import { authOptions } from "@/lib/auth-options";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return sendResponse(401, "Anda harus login.");
    }
    
    const role = session.user?.role;
    if (role !== "admin" && role !== "asesor") {
      return sendResponse(403, "Akses ditolak. Hanya admin atau asesor yang dapat melihat daftar kandidat.");
    }

    const { searchParams } = new URL(request.url);
    const jadwalId = searchParams.get("jadwal_id");
    const skemaId = searchParams.get("skema_id");

    const whereClause: any = {};
    if (jadwalId) {
      whereClause.jadwal_asesmen_peserta = {
        some: { jadwal_id: parseInt(jadwalId, 10) }
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
          jadwal_asesmen: { asesor_id: asesorId }
        }
      };
    }

    const candidates = await db.pengajuanSkema.findMany({
      where: whereClause,
      include: {
        user: { select: { username: true, email: true } },
        dataPribadi: {
          select: { nik: true, namaLengkap: true, noHp: true }
        },
        skema: { select: { kodeSkema: true, namaSkema: true } },
        hasil_asesmen: true,
        jadwal_asesmen_peserta: {
          include: {
            jadwal_asesmen: {
              select: {
                id: true,
                tanggal: true,
                asesor_id: true,
                users: { select: { profil: { select: { namaLengkap: true } } } }
              }
            }
          }
        },
      },
      orderBy: { created_at: "desc" },
    });

    // Format output (menyerupai v_candidate_list)
    const formattedCandidates = candidates.map((c: any) => {
      const jadwal = c.jadwal_asesmen_peserta[0]?.jadwal_asesmen;
      return {
        pengajuanId: c.id,
        nomorPengajuan: c.nomorPengajuan,
        statusPengajuan: c.status,
        nik: c.dataPribadi?.nik,
        namaLengkap: c.dataPribadi?.namaLengkap,
        email: c.user?.email,
        noHp: c.dataPribadi?.noHp,
        skemaId: c.skemaId,
        kodeSkema: c.skema?.kodeSkema,
        namaSkema: c.skema?.namaSkema,
        hasilAsesmen: c.hasil_asesmen?.hasil || "Belum Dinilai",
        jadwalId: jadwal?.id,
        tanggalJadwal: jadwal?.tanggal,
        asesorId: jadwal?.asesor_id,
        namaAsesor: jadwal?.users?.profil?.namaLengkap,
      };
    });

    return sendResponse(200, "Berhasil mengambil daftar kandidat", formattedCandidates);
  } catch (error) {
    console.error("[GET /api/candidates]", error);
    return sendResponse(500, "Terjadi kesalahan saat mengambil daftar kandidat");
  }
}
