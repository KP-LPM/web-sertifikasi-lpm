import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

const NextResponse = {
  json: (data: unknown, init?: ResponseInit) => {
    const headers = new Headers(init?.headers);
    headers.set("Content-Type", "application/json");
    return new Response(JSON.stringify(data), { ...init, headers });
  }
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // 1. Tangkap semua data
    const { 
      username, email, password, role, 
      nik, nama_lengkap, tempat_lahir, tanggal_lahir, jenis_kelamin, no_hp, pekerjaan, // Data Umum
      kewarganegaraan, // Data Asesi
      nomor_registrasi_met, pendidikan_terakhir, alamat_wilayah, // Data Asesor
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

    // 5. Simpan ke database (Dua langkah berjenjang)
    // Langkah A: Buat User di tabel users
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role,
        is_verified: false
      }
    });

    // Langkah B: Buat Profil di tabel profil_pengguna menggunakan id dari newUser
    await prisma.profilPengguna.create({
      data: {
        userId: newUser.id,
        nik: nik,
        namaLengkap: nama_lengkap,
        tempat_lahir: tempat_lahir,
        // Konversi string ke Date ISO-8601 jika di schema tipenya DateTime
        tanggal_lahir: new Date(tanggal_lahir), 
        jenis_kelamin: jenis_kelamin,
        no_hp: no_hp,
        pekerjaan: pekerjaan,
        
        // Data kondisional (kalau null tidak akan error jika di schema bolong/opsional)
        kewarganegaraan: role === 'asesi' ? kewarganegaraan : null,
        nomor_registrasi_met: role === 'asesor' ? nomor_registrasi_met : null,
        pendidikan_terakhir: role === 'asesor' ? pendidikan_terakhir : null,
        alamat_wilayah: role === 'asesor' ? alamat_wilayah : null,
        tanda_tangan: tanda_tangan || null
      }
    });

    return NextResponse.json({ message: "Registrasi sukses!" }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ message: "Error server", error: String(error) }, { status: 500 });
  }
}