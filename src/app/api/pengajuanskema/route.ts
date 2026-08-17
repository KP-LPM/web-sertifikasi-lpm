import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Tangkap SEMUA data dari frontend
    const { userId, skemaId, tuk, dataPribadi, dataAsesmen } = body;

    const pengajuanBaru = await prisma.pengajuanSkema.create({
      data: {
        nomorPengajuan: `PGJ-${Date.now()}`,
        userId: userId,
        skemaId: skemaId,
        tuk: tuk, 
        jenisAsesmen: 'Sertifikasi', 
        status: 'Draf',
        
        dataPribadi: {
          create: {
            nik: dataPribadi.nik,
            namaLengkap: dataPribadi.namaLengkap,
            tempatLahir: dataPribadi.tempatLahir,
            tanggalLahir: new Date(dataPribadi.tanggalLahir), 
            jenisKelamin: dataPribadi.jenisKelamin, 
            alamat: dataPribadi.alamat,
            kodeProvinsi: dataPribadi.kodeProvinsi,
            kodeKota: dataPribadi.kodeKota,
            kodePosAsesi: dataPribadi.kodePosAsesi,
            kewarganegaraan: dataPribadi.kewarganegaraan,
            noHp: dataPribadi.noHp,
            pendidikanTerakhir: dataPribadi.pendidikanTerakhir,
            pekerjaan: dataPribadi.pekerjaan,
            tandaTangan: dataPribadi.tandaTangan || '-',
            
            // Kolom Detail Pekerjaan Baru
            namaInstitusi: dataPribadi.namaInstitusi,
            jabatan: dataPribadi.jabatan,
            emailInstitusi: dataPribadi.emailInstitusi,
            kodePosInstitusi: dataPribadi.kodePosInstitusi,
            telpInstitusi: dataPribadi.telpInstitusi,
            alamatInstitusi: dataPribadi.alamatInstitusi,
            faxInstitusi: dataPribadi.faxInstitusi,

            // Checkbox Bawah
            memerlukanPenyesuaianWajar: dataPribadi.memerlukanPenyesuaianWajar || false,
            isBerpengalaman: dataPribadi.isBerpengalaman || false,
          }
        },
        
        asesmenMandiri: {
          create: dataAsesmen.map((item: { unitId: number; penilaianAsesi: string }) => ({
            unitId: item.unitId, 
            penilaianAsesi: item.penilaianAsesi, 
          }))
        }
      }
    });

    return NextResponse.json(
      { message: 'Pengajuan berhasil disimpan!', data: pengajuanBaru },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error saat submit:', error);
    return NextResponse.json(
      { message: 'Gagal menyimpan data pengajuan.', error: String(error) },
      { status: 500 }
    );
  }
}