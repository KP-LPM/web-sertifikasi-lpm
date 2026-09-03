import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { z } from "zod";
import { Role } from "@prisma/client";
import { ProfileService } from "@/services/profile.service";
import { ClientError } from "@/error/index";
import { sendResponse } from "@/lib/response";
import {
  profilAsesiUpdateSchema,
  profilAsesorUpdateSchema,
  profilAdminUpdateSchema,
} from "@/schema/profile.schema";

export const dynamic = "force-dynamic";

const profileService = new ProfileService();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const token = await getToken({ req: request });
    if (!token) {
      return sendResponse(401, "Akses ditolak, silakan login.");
    }

    const { id } = await params;
    const targetId = Number(id);
    if (isNaN(targetId)) {
      return sendResponse(400, "ID tidak valid");
    }

    const requesterId = Number(token.id || token.sub);
    const isAdmin = token.role === "admin";
    if (!isAdmin && requesterId !== targetId) {
      return sendResponse(403, "Tidak diizinkan mengakses profil ini");
    }

    const user = await profileService.getProfileUsers(targetId);
    return sendResponse(200, "User retrieved successfully", user);
  } catch (error) {
    if (error instanceof ClientError) {
      return sendResponse(error.statusCode, error.message);
    }
    console.log(error);
    return sendResponse(500, "Internal server error");
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    if (!token) {
      return sendResponse(401, "Akses ditolak, silakan login.");
    }

    const userId = Number(token.id || token.sub);
    const role = token.role as Role;
    const body = await request.json();

    const schema =
      role === "asesi"
        ? profilAsesiUpdateSchema
        : role === "asesor"
          ? profilAsesorUpdateSchema
          : profilAdminUpdateSchema;

    const validatedData = schema.parse(body);

    const updatedProfil = await profileService.updateProfileUsers(
      userId,
      validatedData,
    );

    return sendResponse(200, "Profil sukses disimpan!", updatedProfil);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return sendResponse(400, "Validasi gagal", error.flatten().fieldErrors);
    }

    if (error instanceof ClientError) {
      return sendResponse(error.statusCode, error.message);
    }

    console.error("Waduh, error simpan profil:", error);
    return sendResponse(500, "Gagal menyimpan data profil");
  }
}
