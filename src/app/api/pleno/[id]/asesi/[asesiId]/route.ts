import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { getToken } from "next-auth/jwt";
import { plenoService } from "@/services/pleno.service";
import { UpdateAsesiPlenoSchema } from "@/schemas/pleno.schema";
import { sendResponse } from "@/lib/response";
import { ClientError } from "@/error/index";
import { rateLimitApi, RateLimitError } from "@/lib/rate-limit";
import z from "zod";

type Context = { params: Promise<{ id: string; asesiId: string }> };

export async function PATCH(request: NextRequest, context: Context) {
  try {
    rateLimitApi(request, {
      limit: 20,
      windowMs: 60 * 1000,
      key: "patch-pleno-asesi",
    });

    const token = await getToken({ req: request });
    if (!token || token.role !== "admin")
      return sendResponse(403, "Akses ditolak");

    const { asesiId } = await context.params;
    const body = await request.json();
    const validatedData = UpdateAsesiPlenoSchema.parse(body);
    const result = await plenoService.updateAsesi(
      Number(asesiId),
      validatedData,
    );

    revalidatePath("/api/pleno");

    return sendResponse(200, "Status pleno asesi berhasil diperbarui", result);
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
