import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { sendResponse } from "@/lib/response";
import { authOptions } from "@/lib/auth-options";
import { rateLimitApi, RateLimitError } from "@/lib/rate-limit";
import { ClientError } from "@/error/index";
import { CreateSuratSchema } from "@/schemas/surat.schema";
import { suratService } from "@/services/surat.service";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export async function GET(request: NextRequest) {
  try {
    rateLimitApi(request, {
      limit: 60,
      windowMs: 60 * 1000,
      key: "get-all-surat",
    });
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return sendResponse(
        403,
        "Akses ditolak. Hanya admin yang dapat melihat daftar surat.",
      );
    }

    const { searchParams } = new URL(request.url);
    const kategori = searchParams.get("kategori") ?? undefined;
    const jenisSurat = searchParams.get("jenis_surat") ?? undefined;
    const status = searchParams.get("status") ?? undefined;
    const skemaId = searchParams.get("skema_id");

    const filters = {
      kategori,
      jenis_surat: jenisSurat,
      status,
      skema_id: skemaId ? parseInt(skemaId, 10) : undefined,
    };

    const suratList = await suratService.getAll(filters);

    return sendResponse(200, "Berhasil mengambil daftar surat", suratList);
  } catch (error) {
    if (error instanceof RateLimitError) {
      return sendResponse(error.status, "Terlalu banyak permintaan.");
    }
    if (error instanceof ClientError) {
      return sendResponse(error.statusCode, error.message);
    }
    console.error("[GET /api/surat]", error);
    return sendResponse(500, "Terjadi kesalahan saat mengambil daftar surat");
  }
}

export async function POST(request: NextRequest) {
  try {
    rateLimitApi(request, {
      limit: 20,
      windowMs: 60 * 1000,
      key: "post-surat",
    });

    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return sendResponse(
        403,
        "Akses ditolak. Hanya admin yang dapat membuat surat.",
      );
    }

    const body = await request.json();
    const { nomor_surat, judul, kategori, jenis_surat } = body;

    if (!nomor_surat || !judul || !kategori || !jenis_surat) {
      return sendResponse(
        400,
        "Field 'nomor_surat', 'judul', 'kategori', dan 'jenis_surat' wajib diisi.",
      );
    }

    const validatedData = CreateSuratSchema.parse(body);
    const suratBaru = await suratService.create(validatedData);

    revalidatePath("/api/surat");

    return sendResponse(201, "Surat berhasil dibuat", suratBaru);
  } catch (error) {
    if (error instanceof RateLimitError) {
      return sendResponse(error.status, "Terlalu banyak permintaan.");
    }
    if (error instanceof z.ZodError) {
      return sendResponse(400, "Validasi payload gagal", error.flatten());
    }
    if (error instanceof ClientError) {
      return sendResponse(error.statusCode, error.message);
    }
    console.error("[POST /api/surat]", error);
    return sendResponse(500, "Terjadi kesalahan saat membuat surat");
  }
}
