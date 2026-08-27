import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { JenisKelamin, Role } from "@prisma/client"; 
import type { RegisterPayload } from "@/types/types";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RegisterPayload;
    
    const { 
      username, email, password, role, 
      nik, nama_lengkap, tempat_lahir, tanggal_lahir, jenis_kelamin, no_hp, pekerjaan,
      kewarganegaraan, 
      nomor_registrasi_met, pendidikan_terakhir, alamat_wilayah, 
      tanda_tangan,
    } = body;

    if (!username || !email || !password || !role || !nik || !nama_lengkap) {
      return NextResponse.json({ message: "Data wajib belum lengkap!" }, { status: 400 });
    }

    if (role === 'asesor') {
      if (!nomor_registrasi_met || !pendidikan_terakhir || !alamat_wilayah) {
        return NextResponse.json({ message: "Data khusus Asesor wajib diisi!" }, { status: 400 });
      }
    } else if (role === 'asesi') {
      if (!kewarganegaraan) {
        return NextResponse.json({ message: "Data khusus Asesi wajib diisi!" }, { status: 400 });
      }
    }

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ username }, { email }] }
    });
    
    if (existingUser) {
      return NextResponse.json({ message: "Username/Email sudah terdaftar." }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const mappedJenisKelamin = (jenis_kelamin === 'Laki-laki' ? 'Laki_laki' : 'Perempuan') as JenisKelamin;

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: role as Role,
      }
    });

    if (tanggal_lahir) {
      await prisma.profilPengguna.create({
        data: {
          userId: newUser.id,
          nik: nik,
          namaLengkap: nama_lengkap, 
          tempatLahir: tempat_lahir || '-', 
          tanggalLahir: new Date(tanggal_lahir), 
          jenisKelamin: mappedJenisKelamin,
          noHp: no_hp || '-',
          pekerjaan: pekerjaan || '-',
          
          kewarganegaraan: role === 'asesi' ? kewarganegaraan : null,
          nomorRegistrasiMet: role === 'asesor' ? nomor_registrasi_met : null,
          pendidikanTerakhir: role === 'asesor' ? pendidikan_terakhir : null,
          alamatWilayah: role === 'asesor' ? alamat_wilayah : null,
          tandaTangan: tanda_tangan || null
        }
      });
    }

    return NextResponse.json({ message: "Registrasi sukses!" }, { status: 201 });

  } catch (error: unknown) {
    console.error("Registrasi Error:", error);
    
    let errorMessage = "Error server internal.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ message: "Error server", error: errorMessage }, { status: 500 });
  }
}