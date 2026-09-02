import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getToken } from 'next-auth/jwt';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    
    if (!token) {
      return NextResponse.json({ message: 'Akses ditolak, silakan login.' }, { status: 401 });
    }

    const userId = Number(token.id || token.sub);

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

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    if (!token) {
      return NextResponse.json({ message: 'Akses ditolak, silakan login.' }, { status: 401 });
    }

    const userId = Number(token.id || token.sub);
    const body = await request.json();
    
    const dataProfil = {
        namaLengkap: body.nama_lengkap,
        tempatLahir: body.tempat_lahir,
        tanggalLahir: body.tanggal_lahir ? new Date(body.tanggal_lahir) : null,
        jenisKelamin: body.jenis_kelamin,
        alamat: body.alamat_rumah,
        kodeProvinsi: body.provinsi,
        kodeKota: body.kota,
        nik: body.nik,
        kewarganegaraan: body.kewarganegaraan,
        kodePos: body.kodePos || body.kode_pos, 
        noHp: body.noTelp || body.no_telp,
        nomorRegistrasiMet: body.no_registrasi,
        pekerjaan: body.pekerjaan,
        pendidikanTerakhir: body.pendidikan_terakhir,
        tandaTangan: body.tanda_tangan,
        avatar: body.avatar,
    };

    // Upsert pakai userId dinamis dari sesi login
    const profil = await prisma.profilPengguna.upsert({
      where: { userId: userId },
      update: dataProfil,
      create: {
        userId: userId,
        ...dataProfil
      }
    });

    return NextResponse.json({ message: 'Profil sukses disimpan!', profil }, { status: 200 });

  } catch (error) {
    console.error('Waduh, error simpan profil:', error);
    return NextResponse.json(
      { message: 'Gagal menyimpan data profil', error: String(error) }, 
      { status: 500 }
    );
  }
}