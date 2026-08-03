import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // 1. Uji coba enkripsi password 'rahasia123'
    const hashedPassword = await bcrypt.hash("rahasia123", 10);

    // 2. Uji coba simpan user ke database Supabase
    const testUser = await prisma.user.create({
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
    return NextResponse.json({
      status: "Gagal",
      error: String(error),
    }, { status: 500 });
  }
}