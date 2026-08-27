import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { PengajuanPayload } from '@/types/types.ts';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as PengajuanPayload;
    const skema = await prisma.masterSkema.findFirst({
      where: { kodeSkema: body.code }
    });

    if (!skema) {
      return NextResponse.json(
        { message: `Skema dengan kode ${body.code} tidak ditemukan di database.` },
        { status: 404 }
      );
    }

    const pengajuanBaru = await prisma.pengajuanSkema.create({
      data: {
        nomorPengajuan: `PGJ-${Date.now()}`,
        userId: body.userId ? parseInt(body.userId, 10) : 0, 
        skemaId: skema.id, 
        tuk: body.tuk, 
        jenisAsesmen: 'Sertifikasi', 
        status: 'Draf',
        
        dataPribadi: {
          create: {
            nik: body.nik,
            namaLengkap: body.namaLengkap,
            tempatLahir: body.tempatLahir,
            tanggalLahir: new Date(body.tanggalLahir), 
            jenisKelamin: body.jenisKelamin === 'Laki-laki' ? 'Laki_laki' : 'Perempuan', 
            alamat: body.alamat,
            kodeProvinsi: body.provinsi,      
            kodeKota: body.kota,              
            kodePosAsesi: body.kodePos,       
            kewarganegaraan: body.kebangsaan, 
            noHp: body.noTelp,
            pendidikanTerakhir: body.pendidikanTerakhir,
            pekerjaan: body.pekerjaan,
            tandaTangan: body.tandaTangan || '-',
            
            // Kolom Detail Pekerjaan
            namaInstitusi: body.institusiPerusahaan,
            jabatan: body.jabatan,
            emailInstitusi: body.emailInstitusi,
            kodePosInstitusi: body.kodePosInstitusi,
            telpInstitusi: body.telpInstitusi,
            alamatInstitusi: body.alamatInstitusi,
            faxInstitusi: body.faxInstitusi,

            memerlukanPenyesuaianWajar: body.penyesuaianWajar || false,
            isBerpengalaman: body.berpengalaman || false,
          }
        },
        
        asesmenMandiri: (body.dataAsesmen && body.dataAsesmen.length > 0) ? {
          create: body.dataAsesmen.map(item => ({
            unitId: item.unitId, 
            penilaianAsesi: item.penilaianAsesi, 
          }))
        } : undefined
      }
    });

    return NextResponse.json(
      { message: 'Pengajuan berhasil disimpan!', data: pengajuanBaru },
      { status: 201 }
    );

  } catch (error: unknown) {
    console.error('Error saat submit:', error);
    
    let errorMessage = "Terjadi kesalahan saat memproses data.";
    if (error instanceof Error) {
        errorMessage = error.message;
    }

    return NextResponse.json(
      { message: 'Gagal menyimpan data pengajuan.', error: errorMessage },
      { status: 500 }
    );
  }
}