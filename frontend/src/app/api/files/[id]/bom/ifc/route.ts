import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const version = req.nextUrl.searchParams.get("version") || "IFC4";
  const res = await fetch(`${BACKEND_URL}/files/${params.id}/bom/ifc?version=${version}`);
  if (!res.ok) {
    const text = await res.text();
    return new NextResponse(text, { status: res.status });
  }
  const buf = Buffer.from(await res.arrayBuffer());
  return new NextResponse(buf, {
    status: 200,
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename="model.ifc"`,
    },
  });
}
