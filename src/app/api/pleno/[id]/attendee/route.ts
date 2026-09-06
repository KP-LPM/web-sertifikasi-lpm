import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { getToken } from "next-auth/jwt";
import { plenoService } from "@/services/pleno.service";
import { AddAttendeeSchema } from "@/schemas/pleno.schema";
import { sendResponse } from "@/lib/response";
import z from "zod";
import { ClientError } from "@/error/index";
import { rateLimitApi, RateLimitError } from "@/lib/rate-limit";

type Context = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, context: Context) {
  try {
    rateLimitApi(request, {
      limit: 20,
      windowMs: 60 * 1000,
      key: "post-pleno-attendee",
    });

    const token = await getToken({ req: request });
    if (!token || token.role !== "admin")
      return sendResponse(403, "Akses ditolak");

    const { id } = await context.params;
    const body = await request.json();
    const validatedData = AddAttendeeSchema.parse(body);
    const result = await plenoService.addAttendee(
      Number(id),
      validatedData,
    );

    revalidatePath("/api/pleno");

    return sendResponse(201, "Peserta rapat berhasil ditambahkan", result);
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
