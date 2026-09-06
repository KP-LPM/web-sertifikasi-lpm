import { NextRequest, NextResponse } from "next/server";
import {
  authService,
  ValidationError,
  ConflictError,
} from "@/services/auth.service";
import type { RegisterPayload } from "@/types/types";
import { rateLimitApi, RateLimitError } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    rateLimitApi(req, {
      limit: 10,
      windowMs: 60 * 1000,
      key: "post-register",
    });

    const body = (await req.json()) as RegisterPayload;
    await authService.register(body);

    return NextResponse.json(
      { message: "Registrasi sukses!" },
      { status: 201 },
    );
  } catch (error: unknown) {
    if (error instanceof RateLimitError) {
      return NextResponse.json(
        { message: "Terlalu banyak permintaan." },
        { status: error.status },
      );
    }

    if (error instanceof ValidationError || error instanceof ConflictError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.statusCode },
      );
    }

    console.error("Registrasi Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Error server internal.";
    return NextResponse.json(
      { message: "Error server", error: errorMessage },
      { status: 500 },
    );
  }
}
