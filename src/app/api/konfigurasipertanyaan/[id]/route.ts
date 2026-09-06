import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import z from "zod";
import { konfigurasiService } from "@/services/konfigurasipertanyaan.service";
import { UpdateKonfigurasiMainSchema } from "@/schemas/konfigurasipertanyaan.schema";
import { sendResponse } from "@/lib/response";
import { ClientError } from "@/error/index";
import { rateLimitApi, RateLimitError } from "@/lib/rate-limit";

type Context = { params: Promise<{ id: string }> };

export const revalidate = 3600;

export async function GET(request: NextRequest, context: Context) {
  try {
    rateLimitApi(request, {
      limit: 60,
      windowMs: 60 * 1000,
      key: "get-konfigurasi-soal-detail",
    });
    const { id } = await context.params;
    const config = await konfigurasiService.getById(Number(id));
    return sendResponse(200, "Detail konfigurasi berhasil diambil", config);
  } catch (error) {
    if (error instanceof RateLimitError) {
      return sendResponse(
        error.status,
        "Terlalu banyak permintaan. Silakan coba lagi nanti.",
      );
    }
    if (error instanceof ClientError)
      return sendResponse(error.statusCode, error.message);
    return sendResponse(500, "Internal server error");
  }
}

export async function PATCH(request: NextRequest, context: Context) {
  try {
    rateLimitApi(request, {
      limit: 20,
      windowMs: 60 * 1000,
      key: "update-konfigurasi-pertanyaan",
    });
    const { id } = await context.params;
    const body = await request.json();
    const validatedData = UpdateKonfigurasiMainSchema.parse(body);
    const result = await konfigurasiService.updateMain(
      Number(id),
      validatedData,
    );

    revalidatePath("/api/konfigurasipertanyaan");

    return sendResponse(200, "Konfigurasi utama berhasil diperbarui", result);
  } catch (error) {
    if (error instanceof RateLimitError) {
      return sendResponse(
        error.status,
        "Terlalu banyak permintaan. Silakan coba lagi nanti.",
      );
    }
    if (error instanceof z.ZodError)
      return sendResponse(400, "Validasi gagal", error.flatten());
    if (error instanceof ClientError)
      return sendResponse(error.statusCode, error.message);
    return sendResponse(500, "Internal server error");
  }
}

export async function DELETE(request: NextRequest, context: Context) {
  try {
    rateLimitApi(request, {
      limit: 20,
      windowMs: 60 * 1000,
      key: "delete-konfigurasi-pertanyaan",
    });

    const { id } = await context.params;
    await konfigurasiService.delete(Number(id));

    revalidatePath("/api/konfigurasipertanyaan");

    return sendResponse(200, "Konfigurasi berhasil dihapus");
  } catch (error) {
    if (error instanceof RateLimitError) {
      return sendResponse(
        error.status,
        "Terlalu banyak permintaan. Silakan coba lagi nanti.",
      );
    }
    if (error instanceof ClientError)
      return sendResponse(error.statusCode, error.message);
    return sendResponse(500, "Internal server error");
  }
}
