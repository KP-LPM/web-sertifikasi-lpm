import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { getToken } from "next-auth/jwt";
import z from "zod";
import { riwayatAsesmenService } from "@/services/riwayat-asesmen.service";
import { CreateRiwayatAsesmenSchema } from "@/schemas/riwayat-asesmen.schema";
import { sendResponse } from "@/lib/response";
import { ClientError } from "@/error/index";
import { rateLimitApi, RateLimitError } from "@/lib/rate-limit";

type Context = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";

export async function PUT(request: NextRequest, context: Context) {
  try {
    rateLimitApi(request, {
      limit: 30,
      windowMs: 60 * 1000,
      key: "put-upsert-riwayat-asesmen",
    });

    const token = await getToken({ req: request });
    if (!token) {
      return sendResponse(401, "Anda harus login terlebih dahulu");
    }

    const { id } = await context.params;
    const pengajuanId = Number(id);
    if (isNaN(pengajuanId)) {
      return sendResponse(400, "ID pengajuan tidak valid");
    }

    const body = await request.json();
    const validatedData = CreateRiwayatAsesmenSchema.parse({
      ...body,
      asesor_id: token.role === "asesor" ? Number(token.id) : body.asesor_id,
    });

    const result = await riwayatAsesmenService.upsert(
      pengajuanId,
      validatedData,
    );

    revalidatePath("/api/pengajuanskema");
    revalidatePath(`/api/pengajuanskema/${pengajuanId}`);

    return sendResponse(200, "Riwayat asesmen berhasil di-upsert", result);
  } catch (error) {
    if (error instanceof RateLimitError) {
      return sendResponse(error.status, "Terlalu banyak permintaan.");
    }
    if (error instanceof z.ZodError) {
      const errorMsg =
        "Validasi gagal: " + JSON.stringify(error.flatten().fieldErrors);
      return sendResponse(400, errorMsg, error.flatten());
    }
    if (error instanceof ClientError) {
      return sendResponse(error.statusCode, error.message);
    }
    console.error("[PUT /api/pengajuanskema/:id/riwayat-asesmen/upsert]:", error);
    return sendResponse(500, "Internal server error");
  }
}
