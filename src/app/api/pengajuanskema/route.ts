import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { getToken } from "next-auth/jwt";
import z from "zod";
import { pengajuanService } from "@/services/pengajuanskema.service";
import { createPengajuanSchema } from "@/schemas/pengajuanskema.schema";
import { sendResponse } from "@/lib/response";
import { ClientError } from "@/error/index";
import { rateLimitApi, RateLimitError } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

// GET /api/pengajuanskema
// List pengajuan (asesi: miliknya; admin: semua, filter status/skema)
export async function GET(request: NextRequest) {
  try {
    rateLimitApi(request, {
      limit: 60,
      windowMs: 60 * 1000,
      key: "get-pengajuan-list",
    });

    const token = await getToken({ req: request });
    if (!token) {
      return sendResponse(401, "Anda harus login terlebih dahulu");
    }

    const user = {
      id: Number(token.id),
      role: token.role as string,
    };

    const { searchParams } = new URL(request.url);
    const filters = {
      skemaId: searchParams.get("skema_id")
        ? Number(searchParams.get("skema_id"))
        : undefined,
      status: searchParams.get("status") || undefined,
      search: searchParams.get("search") || undefined,
      userId: searchParams.get("user_id")
        ? Number(searchParams.get("user_id"))
        : undefined,
    };

    const list = await pengajuanService.getList(user, filters);
    return sendResponse(200, "Berhasil mengambil daftar pengajuan skema", list);
  } catch (error) {
    if (error instanceof RateLimitError) {
      return sendResponse(error.status, "Terlalu banyak permintaan.");
    }
    if (error instanceof ClientError) {
      return sendResponse(error.statusCode, error.message);
    }
    console.error("[GET /api/pengajuanskema]:", error);
    return sendResponse(500, "Terjadi kesalahan internal pada server");
  }
}

// POST /api/pengajuanskema [asesi]
// Ajukan skema baru (payload: data pribadi + dokumen + asesmen mandiri sekaligus)
export async function POST(request: NextRequest) {
  try {
    rateLimitApi(request, {
      limit: 10,
      windowMs: 60 * 1000,
      key: "post-pengajuan-baru",
    });

    const token = await getToken({ req: request });
    if (!token) {
      return sendResponse(401, "Anda harus login terlebih dahulu");
    }

    const user = {
      id: Number(token.id),
      role: token.role as string,
    };

    const body = await request.json();
    const validatedData = createPengajuanSchema.parse(body);

    const pengajuanBaru = await pengajuanService.create(validatedData, user);

    revalidatePath("/api/pengajuanskema");

    return sendResponse(
      201,
      "Pengajuan skema sertifikasi berhasil diajukan",
      pengajuanBaru
    );
  } catch (error) {
    if (error instanceof RateLimitError) {
      return sendResponse(error.status, "Terlalu banyak permintaan.");
    }
    if (error instanceof z.ZodError) {
      return sendResponse(400, "Validasi payload pengajuan gagal", error.flatten());
    }
    if (error instanceof ClientError) {
      return sendResponse(error.statusCode, error.message);
    }
    console.error("[POST /api/pengajuanskema]:", error);
    return sendResponse(500, "Terjadi kesalahan internal pada server");
  }
}
