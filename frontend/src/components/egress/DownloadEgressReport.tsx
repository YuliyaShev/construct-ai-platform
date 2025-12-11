"use client";

import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";

export function DownloadEgressReport({ url }: { url?: string | null }) {
  const handleDownload = () => {
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = "egress_report.pdf";
    a.click();
  };
  return (
    <Button variant="secondary" onClick={handleDownload} disabled={!url}>
      <FileDown className="mr-2 h-4 w-4" />
      Download Egress Report
    </Button>
  );
}
