import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { getToken } from "next-auth/jwt";
import { skemaService } from "@/services/skema.service";
import { sendResponse } from "@/lib/response";
import { ClientError } from "@/error/index";
import { rateLimitApi, RateLimitError } from "@/lib/rate-limit";

type Context = { params: Promise<{ id: string; buktiId: string }> };

export async function PATCH(request: NextRequest, context: Context) {
  try {
    rateLimitApi(request, {
      limit: 20,
      windowMs: 60 * 1000,
      key: "update-bukti-administratif",
    });
    const token = await getToken({ req: request });
    if (!token || token.role !== "admin")
      return sendResponse(403, "Akses ditolak");
    const { buktiId } = await context.params;

    const body = await request.json();
    const result = await skemaService.updateBuktiAdministratif(
      Number(buktiId),
      body,
    );

    revalidatePath("/api/skema");

    return sendResponse(200, "Bukti administratif berhasil diperbarui", result);
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
      key: "delete-bukti-administratif",
    });
    const token = await getToken({ req: request });
    if (!token || token.role !== "admin")
      return sendResponse(403, "Akses ditolak");
    const { buktiId } = await context.params;
    await skemaService.deleteBuktiAdministratif(Number(buktiId));

    revalidatePath("/api/skema");

    return sendResponse(200, "Bukti administratif berhasil dihapus");
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
