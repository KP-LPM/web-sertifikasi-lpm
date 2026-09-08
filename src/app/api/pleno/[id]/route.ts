import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { getToken } from "next-auth/jwt";
import { plenoService } from "@/services/pleno.service";
import { UpdatePlenoSchema } from "@/schemas/pleno.schema";
import { sendResponse } from "@/lib/response";
import { ClientError } from "@/error/index";
import { rateLimitApi, RateLimitError } from "@/lib/rate-limit";
import z from "zod";

type Context = { params: Promise<{ id: string }> };

export const revalidate = 3600;

export async function GET(request: NextRequest, context: Context) {
  try {
    rateLimitApi(request, {
      limit: 60,
      windowMs: 60 * 1000,
      key: "get-pleno-detail",
    });

    // const token = await getToken({ req: request });
    // if (!token || token.role !== "admin")
    //   return sendResponse(403, "Akses ditolak");

    const { id } = await context.params;
    const pleno = await plenoService.getById(Number(id));
    return sendResponse(200, "Detail pleno berhasil diambil", pleno);
  } catch (error) {
    if (error instanceof RateLimitError) {
      return sendResponse(error.status, "Terlalu banyak permintaan.");
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
      key: "patch-pleno",
    });

    const token = await getToken({ req: request });
    if (!token || token.role !== "admin")
      return sendResponse(403, "Akses ditolak");

    const { id } = await context.params;
    const body = await request.json();
    const validatedData = UpdatePlenoSchema.parse(body);
    const result = await plenoService.update(Number(id), validatedData);

    revalidatePath("/api/pleno");

    return sendResponse(200, "Jadwal pleno berhasil diperbarui", result);
  } catch (error) {
    if (error instanceof RateLimitError) {
      return sendResponse(error.status, "Terlalu banyak permintaan.");
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
      key: "delete-pleno",
    });

    const token = await getToken({ req: request });
    if (!token || token.role !== "admin")
      return sendResponse(403, "Akses ditolak");

    const { id } = await context.params;
    await plenoService.delete(Number(id));

    revalidatePath("/api/pleno");

    return sendResponse(200, "Jadwal pleno berhasil dibatalkan");
  } catch (error) {
    if (error instanceof RateLimitError) {
      return sendResponse(error.status, "Terlalu banyak permintaan.");
    }
    if (error instanceof ClientError)
      return sendResponse(error.statusCode, error.message);
    return sendResponse(500, "Internal server error");
  }
}
