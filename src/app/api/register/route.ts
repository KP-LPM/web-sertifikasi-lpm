import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // 1. Tangkap semua data
    const { 
      username, email, password, role, 
      nik, nama_lengkap, tempat_lahir, tanggal_lahir, jenis_kelamin, no_hp, pekerjaan,
      kewarganegaraan, 
      nomor_registrasi_met, pendidikan_terakhir, alamat_wilayah, 
      tanda_tangan,
    } = body;

    // 2. Validasi Akun Utama
    if (!username || !email || !password || !role || !nik || !nama_lengkap) {
      return NextResponse.json({ message: "Data wajib belum lengkap!" }, { status: 400 });
    }

    // 3. Validasi Bersyarat Berdasarkan Role
    if (role === 'asesor') {
      if (!nomor_registrasi_met || !pendidikan_terakhir || !alamat_wilayah) {
        return NextResponse.json({ message: "Data khusus Asesor wajib diisi!" }, { status: 400 });
      }
    } else if (role === 'asesi') {
      if (!kewarganegaraan) {
        return NextResponse.json({ message: "Data khusus Asesi wajib diisi!" }, { status: 400 });
      }
    }

    // 4. Cek ketersediaan username/email
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ username }, { email }] }
    });
    if (existingUser) return NextResponse.json({ message: "Username/Email sudah terdaftar." }, { status: 409 });

    const hashedPassword = await bcrypt.hash(password, 10);

    const mappedJenisKelamin = jenis_kelamin === 'Laki-laki' ? 'Laki_laki' : 'Perempuan';

    // 5. Simpan ke database (Dua langkah berjenjang)
    // Langkah A: Buat User di tabel users
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role,
        // isVerified tidak perlu ditulis karena sudah otomatis @default(false) dari schema
      }
    });

    // Langkah B: Buat Profil di tabel profil_pengguna menggunakan id dari newUser
    await prisma.profilPengguna.create({
      data: {
        userId: newUser.id,
        nik: nik,
        namaLengkap: nama_lengkap, // Pakai camelCase untuk key Prisma
        tempatLahir: tempat_lahir, 
        tanggalLahir: new Date(tanggal_lahir), 
        jenisKelamin: mappedJenisKelamin,
        noHp: no_hp,
        pekerjaan: pekerjaan,
        
        // Data kondisional
        kewarganegaraan: role === 'asesi' ? kewarganegaraan : null,
        nomorRegistrasiMet: role === 'asesor' ? nomor_registrasi_met : null,
        pendidikanTerakhir: role === 'asesor' ? pendidikan_terakhir : null,
        alamatWilayah: role === 'asesor' ? alamat_wilayah : null,
        tandaTangan: tanda_tangan || null
      }
    });

    return NextResponse.json({ message: "Registrasi sukses!" }, { status: 201 });

  } catch (error) {
    console.error("Registrasi Error:", error);
    return NextResponse.json({ message: "Error server", error: String(error) }, { status: 500 });
  }
}