import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file");
  const res = await fetch(`${BACKEND_URL}/rooms/detect`, {
    method: "POST",
    body: formData,
  });
  const body = await res.text();
  return new NextResponse(body, {
    status: res.status,
    headers: { "Content-Type": res.headers.get("content-type") || "application/json" },
  });
}
