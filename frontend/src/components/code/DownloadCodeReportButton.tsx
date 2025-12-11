"use client";

import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";

export function DownloadCodeReportButton({ url }: { url?: string | null }) {
  const handleDownload = () => {
    if (!url) return;
    const link = document.createElement("a");
    link.href = url;
    link.download = "code_report.pdf";
    link.click();
  };

  return (
    <Button variant="secondary" onClick={handleDownload} disabled={!url}>
      <FileDown className="mr-2 h-4 w-4" />
      Download PDF Report
    </Button>
  );
}
