"use client";

import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";

export function DownloadStructuralRiskReport({ url }: { url?: string | null }) {
  const handle = () => {
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = "structural_risk.pdf";
    a.click();
  };
  return (
    <Button variant="secondary" onClick={handle} disabled={!url}>
      <FileDown className="mr-2 h-4 w-4" />
      Download Risk Report
    </Button>
  );
}
