import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const res = await fetch(`${BACKEND_URL}/files/${params.id}/download`);
  const headers = new Headers(res.headers);
  return new NextResponse(res.body, {
    status: res.status,
    headers,
  });
}
