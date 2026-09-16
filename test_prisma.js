const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const res = await prisma.pengajuanSkema.findMany({
      include: {
        user: { select: { id: true, username: true, email: true } },
        dataPribadi: true,
        skema: { select: { id: true, namaSkema: true, kodeSkema: true } },
        master_tuk: true,
        hasil_asesmen: true,
        sertifikat: true,
        apl02_penilaian: true,
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
        _count: {
          select: {
            dokumen: true,
            asesmenMandiri: true,
          },
        },
        dokumen: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    console.log('Success:', res.length);
  } catch (e) {
    console.error('Error:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
