import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const res = await fetch(`${BACKEND_URL}/rfi/${params.id}/report`);
  if (!res.ok) {
    const text = await res.text();
    return new NextResponse(text, { status: res.status });
  }
  const buf = Buffer.from(await res.arrayBuffer());
  return new NextResponse(buf, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="RFI_${params.id}_report.pdf"`,
    },
  });
}
