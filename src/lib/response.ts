import { NextResponse } from "next/server";

export const sendResponse = <T>(
  statusCode: number,
  message: string,
  data?: T,
) => {
  return NextResponse.json(
    {
      code: statusCode,
      status: statusCode < 400 ? "success" : "failed",
      message,
      data: data ?? null,
    },
    { status: statusCode },
  );
};
