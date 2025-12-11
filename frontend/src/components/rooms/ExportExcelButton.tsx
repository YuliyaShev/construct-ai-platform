"use client";

import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";

type Room = {
  id: string;
  name: string;
  area_sqft: number;
  area_sqm: number;
  perimeter_ft: number;
};

export function ExportExcelButton({ rooms }: { rooms: Room[] }) {
  const handleExport = () => {
    const headers = ["ID", "Name", "Area (sq.ft)", "Area (sq.m)", "Perimeter (ft)"];
    const rows = rooms.map((r) => [r.id, r.name, r.area_sqft, r.area_sqm, r.perimeter_ft]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "rooms.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Button variant="secondary" onClick={handleExport} disabled={!rooms.length}>
      <FileDown className="mr-2 h-4 w-4" />
      Export to CSV
    </Button>
  );
}
