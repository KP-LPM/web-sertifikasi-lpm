import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { authOptions } from "@/lib/auth-options";
import { sendResponse } from "@/lib/response";
import { rateLimitApi, RateLimitError } from "@/lib/rate-limit";
import { ClientError } from "@/error/index";
import { CreateTukInventarisSchema } from "@/schemas/tuk.schema";
import { tukService } from "@/services/tuk.service";

type Context = {
  params: Promise<{ id: string }>;
};

export async function POST(request: NextRequest, context: Context) {
  try {
    rateLimitApi(request, {
      limit: 20,
      windowMs: 60 * 1000,
      key: "post-tuk-inventaris",
    });

    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return sendResponse(
        403,
        "Akses ditolak. Hanya admin yang dapat menambah inventaris.",
      );
    }

    const { id } = await context.params;
    const tukId = parseInt(id, 10);
    if (isNaN(tukId)) return sendResponse(400, "ID TUK tidak valid.");

    const body = await request.json();
    const validatedData = CreateTukInventarisSchema.parse(body);

    const inventarisBaru = await tukService.createInventaris(
      tukId,
      validatedData,
    );

    revalidatePath("/api/tuk");

    return sendResponse(
      201,
      "Item inventaris berhasil ditambahkan",
      inventarisBaru,
    );
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
    console.error("[POST /api/tuk/:id/inventaris]", error);
    return sendResponse(500, "Terjadi kesalahan saat menambah inventaris");
  }
}
