import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // SEMENTARA: Kita hardcode userId = 1.
    // Nanti setelah fitur login/auth kamu jadi, ini diganti dengan ID dari token/session
    const userId = 2;

    const profil = await prisma.profilPengguna.findUnique({
      where: { userId: userId },
    });

    if (!profil) {
      return NextResponse.json({ message: 'Profil belum ada' }, { status: 404 });
    }

    return NextResponse.json(profil, { status: 200 });

  } catch (error) {
    console.error('Waduh, error ambil profil:', error);
    return NextResponse.json(
      { message: 'Gagal mengambil data profil', error: String(error) }, 
      { status: 500 }
    );
  }
}