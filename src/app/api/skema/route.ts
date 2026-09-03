import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic'; 

export async function GET() {
  try {
    const skemaList = await prisma.masterSkema.findMany({
      where: {
        statusAktif: true, 
      },
      include: {
        unitKompetensi: true, 
        persyaratanDasar: true,         
        buktiAdministratif: true,
      }
    });

    return NextResponse.json(
      { message: 'Berhasil mengambil data skema', data: skemaList }, 
      { status: 200 }
    );
    
  } catch (error: unknown) {
    console.error('Error fetching skema:', error);
    
    let errorMessage = "Terjadi kesalahan saat mengambil data skema.";
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    
    return NextResponse.json(
      { message: 'Gagal mengambil data', error: errorMessage }, 
      { status: 500 }
    );
  }
}