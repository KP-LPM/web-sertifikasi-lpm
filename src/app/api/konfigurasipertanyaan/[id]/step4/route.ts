import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import z from "zod";
import { konfigurasiService } from "@/services/konfigurasipertanyaan.service";
import { UpdateStep4Schema } from "@/schemas/konfigurasipertanyaan.schema";
import { sendResponse } from "@/lib/response";
import { ClientError } from "@/error/index";
import { rateLimitApi, RateLimitError } from "@/lib/rate-limit";

type Context = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, context: Context) {
  try {
    rateLimitApi(request, {
      limit: 20,
      windowMs: 60 * 1000,
      key: "update-konfigurasi-pertanyaan",
    });
    const { id } = await context.params;
    const body = await request.json();
    const validatedData = UpdateStep4Schema.parse(body);

    const result = await konfigurasiService.updateStep4(
      Number(id),
      validatedData.pertanyaan_lisan,
    );

    revalidatePath("/api/konfigurasipertanyaan");

    return sendResponse(200, "Skenario step 4 berhasil diperbarui", result);
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
