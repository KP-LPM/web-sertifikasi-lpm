import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { getToken } from "next-auth/jwt";
import { plenoService } from "@/services/pleno.service";
import { AddAsesiPlenoSchema } from "@/schemas/pleno.schema";
import { sendResponse } from "@/lib/response";
import z from "zod";
import { ClientError } from "@/error/index";
import { rateLimitApi, RateLimitError } from "@/lib/rate-limit";

type Context = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: Context) {
  try {
    rateLimitApi(request, {
      limit: 60,
      windowMs: 60 * 1000,
      key: "get-pleno-asesi",
    });

    const token = await getToken({ req: request });
    if (!token || token.role !== "admin") {
      return sendResponse(403, "Akses ditolak");
    }

    const { id } = await context.params;
    const plenoBatchId = Number(id);
    if (isNaN(plenoBatchId)) {
      return sendResponse(400, "ID pleno batch tidak valid");
    }

    const { searchParams } = new URL(request.url);
    const availableOnly = searchParams.get("available") === "true";

    if (availableOnly) {
      const data = await plenoService.getAvailablePengajuan(plenoBatchId);
      return sendResponse(
        200,
        "Berhasil mengambil daftar pengajuan yang berstatus selesai untuk sidang pleno",
        data,
      );
    }

    const asesi = await plenoService.getAsesiByPlenoBatchId(plenoBatchId);
    return sendResponse(200, "Berhasil mengambil asesi sidang pleno", asesi);
  } catch (error) {
    if (error instanceof RateLimitError) {
      return sendResponse(error.status, "Terlalu banyak permintaan.");
    }
    if (error instanceof ClientError)
      return sendResponse(error.statusCode, error.message);
    console.error(error);
    return sendResponse(500, "Internal server error");
  }
}

export async function POST(request: NextRequest, context: Context) {
  try {
    rateLimitApi(request, {
      limit: 20,
      windowMs: 60 * 1000,
      key: "post-pleno-asesi",
    });

    const token = await getToken({ req: request });
    if (!token || token.role !== "admin")
      return sendResponse(403, "Akses ditolak");

    const { id } = await context.params;
    const plenoBatchId = Number(id);
    if (isNaN(plenoBatchId)) {
      return sendResponse(400, "ID pleno batch tidak valid");
    }

    const body = await request.json().catch(() => ({}));
    const validatedData = AddAsesiPlenoSchema.parse(body);

    const result = await plenoService.addAsesiBulk(
      plenoBatchId,
      validatedData.pengajuan_ids,
    );

    revalidatePath("/api/pleno");

    return sendResponse(
      201,
      "Asesi berstatus selesai berhasil ditambahkan ke batch pleno",
      result,
    );
  } catch (error) {
    if (error instanceof RateLimitError) {
      return sendResponse(error.status, "Terlalu banyak permintaan.");
    }
    if (error instanceof z.ZodError)
      return sendResponse(400, "Validasi gagal", error.flatten());
    if (error instanceof ClientError)
      return sendResponse(error.statusCode, error.message);
    console.error(error);
    return sendResponse(500, "Internal server error");
  }
}
