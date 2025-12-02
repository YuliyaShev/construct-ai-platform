import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function POST(req: NextRequest) {
  const form = await req.formData();

  const backendRes = await fetch(`${BACKEND_URL}/files/upload`, {
    method: "POST",
    body: form,
  });

  const body = await backendRes.text();
  return new NextResponse(body, {
    status: backendRes.status,
    headers: { "Content-Type": backendRes.headers.get("content-type") || "application/json" },
  });
}
