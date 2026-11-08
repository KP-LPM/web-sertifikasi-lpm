import { NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { authOptions } from "@/lib/auth-options";
import { sendResponse } from "@/lib/response";
import { rateLimitApi, RateLimitError } from "@/lib/rate-limit";
import { ClientError } from "@/error/index";
import { UpsertUserGuideSchema } from "@/schemas/user-guide.schema";
import { userGuideService } from "@/services/user-guide.service";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    rateLimitApi(request, {
      limit: 60,
      windowMs: 60 * 1000,
      key: "get-user-guide",
    });

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return sendResponse(401, "Unauthorized");
    }

    const { searchParams } = new URL(request.url);
    const allParam = searchParams.get("all");
    const roleParam = searchParams.get("role") || session.user.role;

    if (allParam === "true") {
      const guides = await userGuideService.getAll();
      return sendResponse(200, "Berhasil mengambil daftar User Guide", guides);
    }

    const guide = await userGuideService.getByUserRole(roleParam);
    return sendResponse(200, "Berhasil mengambil data User Guide", guide);
  } catch (error) {
    if (error instanceof RateLimitError) {
      return sendResponse(error.status, "Terlalu banyak permintaan.");
    }
    if (error instanceof ClientError) {
      return sendResponse(error.statusCode, error.message);
    }
    console.error("[GET /api/user-guide]", error);
    return sendResponse(500, "Terjadi kesalahan saat mengambil User Guide");
  }
}

export async function PUT(request: NextRequest) {
  try {
    rateLimitApi(request, {
      limit: 20,
      windowMs: 60 * 1000,
      key: "put-user-guide",
    });

    const session = await getServerSession(authOptions);
    if (
      !session ||
      ![
        "admin",
        "direktur",
        "manajer",
        "komite_skema",
        "dewan_pengarah",
      ].includes(session.user?.role as string)
    ) {
      return sendResponse(
        403,
        "Akses ditolak. Hanya admin yang dapat mengubah User Guide.",
      );
    }

    const body = await request.json();
    const validatedData = UpsertUserGuideSchema.parse(body);

    const updated = await userGuideService.upsert(validatedData);

    return sendResponse(200, "User Guide berhasil diperbarui", updated);
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
    console.error("[PUT /api/user-guide]", error);
    return sendResponse(500, "Terjadi kesalahan saat menyimpan User Guide");
  }
}

