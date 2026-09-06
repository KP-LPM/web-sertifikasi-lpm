import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { rateLimitApi, RateLimitError } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export async function GET(request: NextRequest) {
  try {
    rateLimitApi(request, {
      limit: 10,
      windowMs: 60 * 1000,
      key: "get-test-db",
    });

    // 1. Uji coba enkripsi password 'rahasia123'
    const hashedPassword = await bcrypt.hash("rahasia123", 10);

    // 2. Uji coba simpan user ke database Supabase
    const testUser = await db.user.create({
      data: {
        username: "testos",
        password: hashedPassword,
        role: "admin", 
        email: "test@lpm.com",
      },
    });

    return NextResponse.json({
      status: "Sukses!",
      message: "Koneksi backend aman, fungsi enkripsi berjalan, dan user percobaan berhasil dibuat.",
      data: testUser,
    });
  } catch (error) {
    if (error instanceof RateLimitError) {
      return NextResponse.json(
        { status: "Gagal", message: "Terlalu banyak permintaan." },
        { status: error.status }
      );
    }
    return NextResponse.json({
      status: "Gagal",
      error: String(error),
    }, { status: 500 });
  }
}