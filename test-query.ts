import { db } from './src/lib/db';

async function main() {
  try {
    const pengajuan = await db.pengajuanSkema.findUnique({
      where: { id: 27 },
      include: {
        user: { select: { id: true, username: true, email: true } },
        dataPribadi: true,
        dokumen: {
          orderBy: { createdAt: "asc" },
        },
        asesmenMandiri: {
          include: {
            unitKompetensi: {
              select: {
                id: true,
                kodeUnit: true,
                judulUnit: true,
                urutan: true,
              },
            },
          },
          orderBy: { unitId: "asc" },
        },
        skema: {
          select: {
            id: true,
            namaSkema: true,
            kodeSkema: true,
            kategori: true,
            deskripsi: true,
            persyaratanDasar: {
              orderBy: { urutan: "asc" },
            },
            master_bukti_administratif: {
              orderBy: { urutan: "asc" },
            },
            unitKompetensi: {
              include: {
                elemenKompetensi: true,
              },
              orderBy: { urutan: "asc" },
            },
          },
        },
        master_tuk: true,
        verifikasi_pengajuan: true,
        apl02_penilaian: true,
        hasil_asesmen: true,
        sertifikat: true,
        jadwal_asesmen_peserta: {
          include: {
            jadwal_asesmen: {
              include: {
                users: {
                  select: {
                    id: true,
                    username: true,
                    email: true,
                    profil: { select: { namaLengkap: true } },
                  },
                },
                master_tuk: true,
              },
            },
          },
        },
      },
    });
    console.log("Success:", !!pengajuan);
  } catch (error) {
    console.error("Prisma error:", error);
  } finally {
    await db.$disconnect();
  }
}

main();
