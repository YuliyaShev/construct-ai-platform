"use client";

import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";

export function DetailDownloadButtons({ svgUrl, pdfUrl }: { svgUrl?: string; pdfUrl?: string }) {
  const handleDownload = (url?: string) => {
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = url.split("/").pop() || "detail";
    a.click();
  };

  return (
    <div className="flex gap-2">
      <Button variant="secondary" onClick={() => handleDownload(svgUrl)} disabled={!svgUrl}>
        <FileDown className="mr-2 h-4 w-4" />
        SVG
      </Button>
      <Button variant="secondary" onClick={() => handleDownload(pdfUrl)} disabled={!pdfUrl}>
        <FileDown className="mr-2 h-4 w-4" />
        PDF
      </Button>
    </div>
  );
}
