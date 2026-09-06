import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { getToken } from "next-auth/jwt";
import z from "zod";
import { jadwalService } from "@/services/jadwal.service";
import { AddPesertaBulkSchema } from "@/schemas/jadwal.schema";
import { sendResponse } from "@/lib/response";
import { ClientError } from "@/error/index";
import { rateLimitApi, RateLimitError } from "@/lib/rate-limit";

type Context = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, context: Context) {
  try {
    rateLimitApi(request, {
      limit: 20,
      windowMs: 60 * 1000,
      key: "post-jadwal-peserta",
    });

    const token = await getToken({ req: request });
    if (!token || (token.role !== "admin" && token.role !== "asesor")) {
      return sendResponse(403, "Akses ditolak");
    }

    const { id } = await context.params;
    const body = await request.json();
    const validatedData = AddPesertaBulkSchema.parse(body);

    await jadwalService.addPesertaBulk(
      Number(id),
      validatedData.pengajuan_ids,
    );

    revalidatePath("/api/jadwal");

    return sendResponse(201, "Peserta berhasil ditambahkan ke jadwal ini");
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
