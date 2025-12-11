"use client";

import { Input } from "@/components/ui/input";

export function PdfReferencePicker({
  page,
  x,
  y,
  onChange,
}: {
  page: string;
  x: string;
  y: string;
  onChange: (field: "page" | "x" | "y", value: string) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <Input value={page} onChange={(e) => onChange("page", e.target.value)} placeholder="Page (e.g., A5.02)" />
      <Input value={x} onChange={(e) => onChange("x", e.target.value)} placeholder="X" />
      <Input value={y} onChange={(e) => onChange("y", e.target.value)} placeholder="Y" />
    </div>
  );
}
