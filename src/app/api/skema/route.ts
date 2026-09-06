import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { getToken } from "next-auth/jwt";
import { skemaService } from "@/services/skema.service";
import { sendResponse } from "@/lib/response";
import { ClientError } from "@/error/index";
import { rateLimitApi, RateLimitError } from "@/lib/rate-limit";

export const revalidate = 3600;

export async function GET(request: NextRequest) {
  try {
    rateLimitApi(request, {
      limit: 60,
      windowMs: 60 * 1000,
      key: "get-all-skema",
    });

    const skemaList = await skemaService.getSkema();
    return sendResponse(200, "Berhasil mengambil data skema", skemaList);
  } catch (error) {
    if (error instanceof RateLimitError) {
      return sendResponse(error.status, "Terlalu banyak permintaan.");
    }
    if (error instanceof ClientError) {
      return sendResponse(error.statusCode, error.message);
    }
    console.log(error);
    return sendResponse(500, "Internal server error");
  }
}

export async function POST(request: NextRequest) {
  try {
    rateLimitApi(request, {
      limit: 20,
      windowMs: 60 * 1000,
      key: "post-skema",
    });

    const token = await getToken({ req: request });
    if (!token || token.role !== "admin")
      return sendResponse(403, "Akses ditolak");

    const body = await request.json();
    const newSkema = await skemaService.createSkema(body);

    // PERBAIKAN 4: Hancurkan cache GET agar data langsung ter-update
    revalidatePath("/api/skema");

    return sendResponse(201, "Skema berhasil dibuat!", newSkema);
  } catch (error) {
    // PERBAIKAN 2: Tangkap RateLimitError
    if (error instanceof RateLimitError) {
      return sendResponse(error.status, "Terlalu banyak permintaan.");
    }
    if (error instanceof ClientError) {
      return sendResponse(error.statusCode, error.message);
    }
    console.log(error);
    return sendResponse(500, "Internal server error");
  }
}
