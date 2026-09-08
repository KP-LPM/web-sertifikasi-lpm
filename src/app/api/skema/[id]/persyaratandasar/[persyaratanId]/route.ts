import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { getToken } from "next-auth/jwt";
import { skemaService } from "@/services/skema.service";
import { sendResponse } from "@/lib/response";
import { ClientError } from "@/error/index";
import { rateLimitApi, RateLimitError } from "@/lib/rate-limit";

type Context = { params: Promise<{ id: string; persyaratanId: string }> };

export async function PATCH(request: NextRequest, context: Context) {
  try {
    rateLimitApi(request, {
      limit: 20,
      windowMs: 60 * 1000,
      key: "update-persyaratan-dasar",
    });
    const token = await getToken({ req: request });
    if (!token || token.role !== "admin")
      return sendResponse(403, "Akses ditolak");
    const { persyaratanId } = await context.params;

    const body = await request.json();
    const result = await skemaService.updatePersyaratanDasar(
      Number(persyaratanId),
      body,
    );

    revalidatePath("/api/skema");

    return sendResponse(200, "Persyaratan dasar berhasil diperbarui", result);
  } catch (error) {
    if (error instanceof RateLimitError) {
      return sendResponse(
        error.status,
        "Terlalu banyak permintaan. Silakan coba lagi nanti.",
      );
    }
    if (error instanceof ClientError)
      return sendResponse(error.statusCode, error.message);
    console.log(error);
    return sendResponse(500, "Internal server error");
  }
}

export async function DELETE(request: NextRequest, context: Context) {
  try {
    rateLimitApi(request, {
      limit: 20,
      windowMs: 60 * 1000,
      key: "delete-persyaratan-dasar",
    });

    const token = await getToken({ req: request });
    if (!token || token.role !== "admin")
      return sendResponse(403, "Akses ditolak");

    const { persyaratanId } = await context.params;
    await skemaService.deletePersyaratanDasar(Number(persyaratanId));

    revalidatePath("/api/skema");

    return sendResponse(200, "Persyaratan dasar berhasil dihapus");
  } catch (error) {
    if (error instanceof RateLimitError) {
      return sendResponse(
        error.status,
        "Terlalu banyak permintaan. Silakan coba lagi nanti.",
      );
    }
    if (error instanceof ClientError)
      return sendResponse(error.statusCode, error.message);
    console.log(error);
    return sendResponse(500, "Internal server error");
  }
}
