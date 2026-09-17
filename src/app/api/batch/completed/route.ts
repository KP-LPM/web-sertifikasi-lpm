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
                dataPribadi: { select: { namaLengkap: true, nik: true } },
                skema: { select: { namaSkema: true } },
                sertifikat: true,
                hasil_asesmen: true,
              },
            },
          },
        },
        pleno_batch_skema: {
          include: { master_skema: { select: { namaSkema: true } } },
        },
        pleno_attendee: {
          select: { id: true, nama: true, role: true, user_id: true }
        }
      },
      orderBy: { tanggal: "desc" },
    });

    const formatted = completedBatches.map((batch) => {
      let kompeten = 0;
      let belumKompeten = 0;

      batch.pleno_asesi.forEach((asesi) => {
        const finalStatus = asesi.status_pleno || asesi.rekomendasi_asesor || asesi.pengajuan_skema?.hasil_asesmen?.hasil;
        if (finalStatus === "Kompeten" || finalStatus === "K" || finalStatus === "KOMPETEN") {
          kompeten++;
        } else if (
          finalStatus === "Belum Kompeten" ||
          finalStatus === "BK" ||
          finalStatus === "BELUM KOMPETEN"
        ) {
          belumKompeten++;
        }
      });
      const asesiList = batch.pleno_asesi
        .filter((a) => {
          const finalStatus = a.status_pleno || a.rekomendasi_asesor || a.pengajuan_skema?.hasil_asesmen?.hasil;
          return finalStatus === "Kompeten" || finalStatus === "K" || finalStatus === "KOMPETEN" || !finalStatus; // Termasuk jika null untuk jaga-jaga apabila belum dinilai secara eksplisit
        })
        .map((a) => {
          const cert = a.pengajuan_skema?.sertifikat;
          // In Prisma, if it's one-to-one it's an object. If one-to-many, it's an array.
          // In schema it says `sertifikat sertifikat?`, so it's an object.
          
          const rek = a.rekomendasi_asesor || a.pengajuan_skema?.hasil_asesmen?.hasil || "BK";
          const pln = a.status_pleno || rek;
          const isRekK = rek === "K" || rek.toLowerCase() === "kompeten";
          const isPlnK = pln === "K" || pln.toLowerCase() === "kompeten";

          return {
            id: a.pengajuan_id,
            nama: a.pengajuan_skema?.dataPribadi?.namaLengkap || "Tanpa Nama",
            nik: a.pengajuan_skema?.dataPribadi?.nik || "-",
            skema: a.pengajuan_skema?.skema?.namaSkema || "-",
            asesor: "Asesor LSP", // Can fetch from jadwal_asesmen or user if available
            rekomendasiAsesor: isRekK ? "K" : "BK",
            statusPleno: isPlnK ? "K" : "BK",
            noSertifikat: cert?.no_sertifikat || "",
            issueDate: cert?.tanggal_terbit ? new Date(cert.tanggal_terbit).toISOString().split("T")[0] : "",
            gdriveUrl: cert?.gdrive_url || "",
            status: cert?.status || "Belum Upload",
            notes: "", // Add notes if needed, or cert?.catatan if available
          };
        });

      return {
        id: batch.id,
        batchCode: batch.no_sk || `BATCH-${batch.id}`,
        title: batch.title,
        skema: batch.pleno_batch_skema.map((s) => s.master_skema.namaSkema).join(", ") || "-",
        noSK: batch.no_sk || "-",
        tanggal: batch.tanggal || "-",
        waktu: "-",
        jenisTuk: "-",
        alamat: batch.alamat || "-",
        detailAlamat: batch.alamat || "-",
        linkSuratBeritaPleno: batch.link_surat_berita_pleno || "",
        linkSuratKeputusanDirektur: batch.link_surat_keputusan_direktur || "",
        linkSuratBlankoBNSP: batch.link_surat_blanko_bnsp || "",
        status: batch.status,
        skemaList: batch.pleno_batch_skema.map(
          (s) => s.master_skema.namaSkema,
        ),
        totalAsesi: batch.pleno_asesi.length,
        rekapHasil: { kompeten, belumKompeten },
        asesiList,
        plenoAttendees: batch.pleno_attendee.map(a => ({
          id: a.id,
          nama: a.nama,
          role: a.role,
        })),
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
