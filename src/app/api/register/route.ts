import { NextResponse } from "next/server";
import {
  authService,
  ValidationError,
  ConflictError,
} from "@/services/auth.service";
import type { RegisterPayload } from "@/types/types";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RegisterPayload;
    await authService.register(body);

    return NextResponse.json(
      { message: "Registrasi sukses!" },
      { status: 201 },
    );
  } catch (error: unknown) {
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
