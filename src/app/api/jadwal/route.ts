import z from "zod";
import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { getToken } from "next-auth/jwt";
import { jadwalService } from "@/services/jadwal.service";
import { CreateJadwalSchema } from "@/schemas/jadwal.schema";
import { sendResponse } from "@/lib/response";
import { ClientError } from "@/error/index";
import { rateLimitApi, RateLimitError } from "@/lib/rate-limit";

export const revalidate = 3600;

export async function GET(request: NextRequest) {
  try {
    rateLimitApi(request, {
      limit: 60,
      windowMs: 60 * 1000,
      key: "get-all-jadwal",
    });

    const { searchParams } = new URL(request.url);
    const filters = {
      asesorId: searchParams.get("asesor_id")
        ? Number(searchParams.get("asesor_id"))
        : undefined,
      skemaId: searchParams.get("skema_id")
        ? Number(searchParams.get("skema_id"))
        : undefined,
      status: searchParams.get("status") || undefined,
      tanggal: searchParams.get("tanggal")
        ? new Date(searchParams.get("tanggal") as string)
        : undefined,
    };

    const jadwalList = await jadwalService.getList(filters);
    return sendResponse(200, "Berhasil mengambil data jadwal", jadwalList);
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

export async function POST(request: NextRequest) {
  try {
    rateLimitApi(request, {
      limit: 20,
      windowMs: 60 * 1000,
      key: "post-jadwal",
    });

    const token = await getToken({ req: request });
    if (!token || (token.role !== "admin" && token.role !== "asesor")) {
      return sendResponse(403, "Akses ditolak");
    }

    const body = await request.json();
    const validatedData = CreateJadwalSchema.parse(body);
    const newJadwal = await jadwalService.create(validatedData);

    revalidatePath("/api/jadwal");

    return sendResponse(201, "Jadwal asesmen berhasil dibuat", newJadwal);
  } catch (error) {
    if (error instanceof RateLimitError) {
      return sendResponse(error.status, "Terlalu banyak permintaan.");
    }
    if (error instanceof z.ZodError)
      return sendResponse(400, "Validasi payload gagal", error.flatten());
    if (error instanceof ClientError)
      return sendResponse(error.statusCode, error.message);
    console.error(error);
    return sendResponse(500, "Internal server error");
  }
}
