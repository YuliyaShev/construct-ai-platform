import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const res = await fetch(`${BACKEND_URL}/files/${params.id}/bim/clashes`);
  const body = await res.text();
  return new NextResponse(body, {
    status: res.status,
    headers: { "Content-Type": res.headers.get("content-type") || "application/json" },
  });
}
