import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { getToken } from "next-auth/jwt";
import { z } from "zod";
import { konfigurasiService } from "@/services/konfigurasipertanyaan.service";
import { CreateKonfigurasiSchema } from "@/schemas/konfigurasipertanyaan.schema";
import { sendResponse } from "@/lib/response";
import { ClientError } from "@/error/index";
import { rateLimitApi, RateLimitError } from "@/lib/rate-limit";

export const revalidate = 3600;

export async function GET(request: NextRequest) {
  try {
    rateLimitApi(request, {
      limit: 60,
      windowMs: 60 * 1000,
      key: "get-konfigurasi-soal",
    });

    const { searchParams } = new URL(request.url);
    const skemaIdParam = searchParams.get("skema_id");
    const skemaId = skemaIdParam ? Number(skemaIdParam) : undefined;
    const status = searchParams.get("status") || undefined;

    const list = await konfigurasiService.getList(skemaId, status);
    return sendResponse(200, "Berhasil mengambil data konfigurasi", list);
  } catch (error) {
    if (error instanceof RateLimitError) {
      return sendResponse(error.status, "Terlalu banyak permintaan.");
    }
    if (error instanceof ClientError) {
      return sendResponse(error.statusCode, error.message);
    }
    console.error("[GET /api/konfigurasi-soal]", error);
    return sendResponse(500, "Internal server error");
  }
}

export async function POST(request: NextRequest) {
  try {
    rateLimitApi(request, {
      limit: 20,
      windowMs: 60 * 1000,
      key: "post-konfigurasi-soal",
    });

    const token = await getToken({ req: request });
    if (!token || (token.role !== "asesor" && token.role !== "admin")) {
      return sendResponse(
        403,
        "Akses ditolak. Hanya asesor atau admin yang diizinkan.",
      );
    }

    const body = await request.json();
    const validatedData = CreateKonfigurasiSchema.parse(body);
    const result = await konfigurasiService.create(validatedData);

    revalidatePath("/api/konfigurasipertanyaan");

    return sendResponse(201, "Konfigurasi berhasil dibuat", result);
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
    console.error("[POST /api/konfigurasi-soal]", error);
    return sendResponse(500, "Internal server error");
  }
}
