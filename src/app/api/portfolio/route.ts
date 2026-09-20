import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { sendResponse } from "@/lib/response";
import { authOptions } from "@/lib/auth-options";
import { rateLimitApi, RateLimitError } from "@/lib/rate-limit";
import { ClientError } from "@/error/index";
import { CreatePortfolioSchema } from "@/schemas/portfolio.schema";
import { portfolioService } from "@/services/portfolio.service";
import { supabase } from "@/lib/supabase";

async function uploadToSupabase(file: File, folder: string): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  const extension = file.name.split('.').pop() || "bin";
  const filename = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${extension}`;
  
  const { error } = await supabase.storage
    .from("portfolio-asesor")
    .upload(filename, buffer, {
      contentType: file.type,
      upsert: false,
    });
    
  if (error) {
    throw new Error(`Gagal mengunggah file ${file.name}: ${error.message}`);
  }
  
  const { data: publicUrlData } = supabase.storage
    .from("portfolio-asesor")
    .getPublicUrl(filename);
    
  return publicUrlData.publicUrl;
}

export async function GET(request: NextRequest) {
  try {
    rateLimitApi(request, {
      limit: 60,
      windowMs: 60 * 1000,
      key: "get-portfolio-list",
    });

    const session = await getServerSession(authOptions);
    if (!session) {
      return sendResponse(401, "Anda harus login.");
    }

    const { searchParams } = new URL(request.url);
    const asesorIdParam = searchParams.get("asesor_id");
    let targetAsesorId = asesorIdParam ? parseInt(asesorIdParam, 10) : undefined;

    if (session.user?.role === "asesor") {
      targetAsesorId = parseInt(session.user.id, 10);
    }

    if (!targetAsesorId && session.user?.role !== "admin") {
      targetAsesorId = parseInt(session.user.id, 10);
    }

    const portfolios = targetAsesorId
      ? await portfolioService.getByAsesorId(targetAsesorId)
      : await portfolioService.getByAsesorId(parseInt(session.user.id, 10));

    return sendResponse(200, "Berhasil mengambil portfolio", portfolios);
  } catch (error) {
    if (error instanceof RateLimitError) {
      return sendResponse(error.status, "Terlalu banyak permintaan.");
    }
    if (error instanceof ClientError) {
      return sendResponse(error.statusCode, error.message);
    }
    console.error("[GET /api/portfolio]", error);
    return sendResponse(500, "Terjadi kesalahan saat mengambil portfolio");
  }
}

export async function POST(request: NextRequest) {
  try {
    rateLimitApi(request, {
      limit: 20,
      windowMs: 60 * 1000,
      key: "post-portfolio",
    });
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "asesor") {
      return sendResponse(
        403,
        "Akses ditolak. Hanya asesor yang dapat mengunggah portfolio.",
      );
    }

    const formData = await request.formData();
    const nama_dokumen = formData.get("nama_dokumen") as string;
    
    if (!nama_dokumen) {
      return sendResponse(400, "Field 'nama_dokumen' wajib diisi.");
    }
    
    const skema_id_raw = formData.get("skema_id");
    const skema_id = skema_id_raw && skema_id_raw !== "null" ? parseInt(skema_id_raw as string, 10) : null;
    const status_asesor = formData.get("status_asesor") as string | null;
    const alamat_lsp = formData.get("alamat_lsp") as string | null;
    const tanggal_raw = formData.get("tanggal") as string | null;
    const tanggal = tanggal_raw ? new Date(tanggal_raw) : null;

    const file_portfolio = formData.get("file_portfolio") as File | null;
    const file_peminjaman = formData.get("file_peminjaman") as File | null;
    const file_jawaban = formData.get("file_jawaban") as File | null;
    
    let link_portfolio = null;
    let link_surat_peminjaman = null;
    let link_surat_jawaban = null;
    
    const asesorId = parseInt(session.user.id, 10);

    if (file_portfolio && file_portfolio.size > 0) {
      link_portfolio = await uploadToSupabase(file_portfolio, `portfolio/${asesorId}`);
    }
    
    if (file_peminjaman && file_peminjaman.size > 0) {
      link_surat_peminjaman = await uploadToSupabase(file_peminjaman, `peminjaman/${asesorId}`);
    }
    
    if (file_jawaban && file_jawaban.size > 0) {
      link_surat_jawaban = await uploadToSupabase(file_jawaban, `jawaban/${asesorId}`);
    }

    const payloadToValidate = {
      nama_dokumen,
      skema_id,
      status_asesor,
      alamat_lsp,
      tanggal,
      link_portfolio,
      link_surat_peminjaman,
      link_surat_jawaban,
    };

    const validatedData = CreatePortfolioSchema.parse(payloadToValidate);
    const portfolioBaru = await portfolioService.create(asesorId, validatedData);

    revalidatePath("/api/portfolio");

    return sendResponse(
      201,
      "Dokumen portfolio berhasil diunggah",
      portfolioBaru,
    );
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
    console.error("[POST /api/portfolio]", error);
    return sendResponse(500, "Terjadi kesalahan saat mengunggah portfolio: " + (error instanceof Error ? error.message : ""));
  }
}
