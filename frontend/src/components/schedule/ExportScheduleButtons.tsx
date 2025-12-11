"use client";

import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";

export function ExportScheduleButtons({ pdf }: { pdf?: string | null }) {
  const handle = () => {
    if (!pdf) return;
    const a = document.createElement("a");
    a.href = pdf;
    a.download = "gantt.pdf";
    a.click();
  };
  return (
    <Button variant="secondary" onClick={handle} disabled={!pdf}>
      <FileDown className="mr-2 h-4 w-4" />
      Download Gantt
    </Button>
  );
}
