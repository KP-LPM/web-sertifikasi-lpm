import z from "zod";
import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { getToken } from "next-auth/jwt";
import { jadwalService } from "@/services/jadwal.service";
import { UpdateJadwalSchema } from "@/schemas/jadwal.schema";
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
      key: "get-jadwal-detail",
    });

    const { id } = await context.params;
    const jadwal = await jadwalService.getById(Number(id));
    return sendResponse(200, "Berhasil mengambil detail jadwal", jadwal);
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

export async function PATCH(request: NextRequest, context: Context) {
  try {
    rateLimitApi(request, {
      limit: 20,
      windowMs: 60 * 1000,
      key: "patch-jadwal",
    });

    const token = await getToken({ req: request });
    if (!token || (token.role !== "admin" && token.role !== "asesor")) {
      return sendResponse(403, "Akses ditolak");
    }

    const { id } = await context.params;
    const body = await request.json();
    const validatedData = UpdateJadwalSchema.parse(body);
    const updatedJadwal = await jadwalService.update(
      Number(id),
      validatedData,
    );

    revalidatePath("/api/jadwal");

    return sendResponse(200, "Jadwal berhasil diperbarui", updatedJadwal);
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

export async function DELETE(request: NextRequest, context: Context) {
  try {
    rateLimitApi(request, {
      limit: 20,
      windowMs: 60 * 1000,
      key: "delete-jadwal",
    });

    const token = await getToken({ req: request });
    if (!token || (token.role !== "admin" && token.role !== "asesor")) {
      return sendResponse(403, "Akses ditolak");
    }

    const { id } = await context.params;
    await jadwalService.delete(Number(id));

    revalidatePath("/api/jadwal");

    return sendResponse(200, "Jadwal berhasil dibatalkan");
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
