import { NextResponse, NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getToken } from "next-auth/jwt";
import { profileService, UpdateProfileInput } from "@/services/profile.service";
import { InvariantError, NotFoundError } from "@/error";
import { rateLimitApi, RateLimitError } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export async function GET(request: NextRequest) {
  try {
    rateLimitApi(request, {
      limit: 60,
      windowMs: 60 * 1000,
      key: "get-profile",
    });
    const token = await getToken({ req: request });

    if (!token) {
      return NextResponse.json(
        { message: "Akses ditolak, silakan login." },
        { status: 401 },
      );
    }

    const userId = Number(token.id || token.sub);

    const profil = await db.profilPengguna.findUnique({
      where: { userId: userId },
    });

    if (!profil) {
      return NextResponse.json(
        { message: "Profil belum ada" },
        { status: 404 },
      );
    }

    return NextResponse.json(profil, { status: 200 });
  } catch (error) {
    if (error instanceof RateLimitError) {
      return NextResponse.json(
        { message: "Terlalu banyak permintaan." },
        { status: error.status },
      );
    }
    console.error("Waduh, error ambil profil:", error);
    return NextResponse.json(
      { message: "Gagal mengambil data profil", error: String(error) },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    rateLimitApi(request, {
      limit: 20,
      windowMs: 60 * 1000,
      key: "post-profile",
    });

    const token = await getToken({ req: request });
    if (!token) {
      return NextResponse.json(
        { message: "Akses ditolak, silakan login." },
        { status: 401 },
      );
    }

    const userId = Number(token.id || token.sub);
    const body = await request.json();

    const dataProfil: UpdateProfileInput & { email?: string } = {
      namaLengkap: body.nama_lengkap,
      tempatLahir: body.tempat_lahir,
      tanggalLahir: body.tanggal_lahir
        ? new Date(body.tanggal_lahir)
        : undefined,
      jenisKelamin: body.jenis_kelamin,
      alamat: body.alamat_rumah,
      kodeProvinsi: body.provinsi,
      kodeKota: body.kota,
      kewarganegaraan: body.kewarganegaraan,
      kodePos: body.kodePos || body.kode_pos,
      noHp: body.noTelp || body.no_telp,
      nomorRegistrasiMet: body.no_registrasi,
      pekerjaan: body.pekerjaan,
      pendidikanTerakhir: body.pendidikan_terakhir,
      tandaTangan: body.tanda_tangan,
      avatar: body.avatar,
      email: body.email,
    };

    const result = await profileService.updateProfileUsers(userId, dataProfil);

    revalidatePath("/api/profile");

    return NextResponse.json(
      { message: "Profil sukses disimpan!", ...result },
      { status: 200 },
    );
  } catch (error: unknown) {
    if (error instanceof RateLimitError) {
      return NextResponse.json(
        { message: "Terlalu banyak permintaan." },
        { status: error.status },
      );
    }

    if (error instanceof NotFoundError) {
      return NextResponse.json({ message: error.message }, { status: 404 });
    }

    if (error instanceof InvariantError) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    console.error("Waduh, error simpan profil:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Error server internal.";
    return NextResponse.json(
      { message: "Gagal menyimpan data profil", error: errorMessage },
      { status: 500 },
    );
  }
}
