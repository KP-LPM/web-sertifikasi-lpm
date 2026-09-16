import { NextResponse } from "next/server";
import { pengajuanService } from "@/services/pengajuanskema.service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const list = await pengajuanService.getList({ id: 1, role: "asesi" }, {});
    return NextResponse.json({ success: true, data: list });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error), stack: error instanceof Error ? error.stack : undefined });
  }
}
