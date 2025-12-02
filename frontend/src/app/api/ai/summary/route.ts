import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest) {
  return NextResponse.json({ summary: "System is ready. Last analysis completed successfully." });
}
