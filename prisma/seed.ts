import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { AVAILABLE_SCHEMES } from '../src/data/schemes'; 

// Setup Driver Adapter untuk PostgreSQL
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Mulai memompa data (seeding) ke database...');


  // 1. Bersihkan data lama 
  await prisma.masterElemenKompetensi.deleteMany();
  await prisma.masterUnitKompetensi.deleteMany();
  await prisma.masterPersyaratanDasar.deleteMany();
  await prisma.masterBuktiAdministratif.deleteMany();
  await prisma.masterSkema.deleteMany();

  // Set untuk mengumpulkan bukti administratif
  const uniqueBuktiAdmin = new Set<string>();

  // 2. Looping memasukkan data skema
  for (const scheme of AVAILABLE_SCHEMES) {
    const createdSkema = await prisma.masterSkema.create({
      data: {
        kodeSkema: scheme.code || "",
        namaSkema: scheme.name || "",
        statusAktif: true,
      },
    });

    console.log(`[+] Skema dibuat: ${createdSkema.namaSkema}`);

    // 3. Masukkan Persyaratan Dasar (beserta deskripsinya)
    if (scheme.persyaratanDasar && scheme.persyaratanDasar.length > 0) {
      let urutan = 1;
      for (const req of scheme.persyaratanDasar) {
        await prisma.masterPersyaratanDasar.create({
          data: {
            skemaId: createdSkema.id,
            namaDokumen: req.name,
            deskripsi: req.description || '',
            urutan: urutan++,
          },
        });
      }
    }

    // Mengumpulkan bukti administratif unik dari setiap skema
    if (scheme.buktiAdministratif) {
      for (const bukti of scheme.buktiAdministratif) {
        uniqueBuktiAdmin.add(bukti);
      }
    }

    // 4. Masukkan Unit Kompetensi
    if (scheme.units && scheme.units.length > 0) {
      let urutanUnit = 1;
      for (const unit of scheme.units) {
        const createdUnit = await prisma.masterUnitKompetensi.create({
          data: {
            skemaId: createdSkema.id,
            kodeUnit: unit.code,
            judulUnit: unit.title,
            urutan: urutanUnit++,
          },
        });

        // 5. Masukkan Elemen & KUK
        if (unit.elemen && unit.elemen.length > 0) {
          let urutanElemen = 1;
          for (const el of unit.elemen) {
            // Menggabungkan array KUK menjadi satu string panjang dengan enter (\n)
            const gabunganKuk = el.kuk ? el.kuk.join('\n') : '';
            await prisma.masterElemenKompetensi.create({
              data: {
                unitId: createdUnit.id,
                namaElemen: el.title,
                kriteriaUnjukKerja: gabunganKuk,
                urutan: urutanElemen++,
              },
            });
          }
        }
      }
    }
  }

  // 6. Masukkan Bukti Administratif ke tabel global
  for (const namaDokumen of uniqueBuktiAdmin) {
    await prisma.masterBuktiAdministratif.create({
      data: {
        namaDokumen: namaDokumen,
        isWajib: true,
        isAktif: true,
      },
    });
  }
  console.log(`[+] ${uniqueBuktiAdmin.size} Bukti Administratif ditambahkan.`);

  console.log('🎉 Seeding sukses! Database sudah siap dipakai.');
}

main()
  .catch((e) => {
    console.error('Ada error saat seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });