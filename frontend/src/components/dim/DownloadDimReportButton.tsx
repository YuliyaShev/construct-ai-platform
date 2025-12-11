"use client";

import { useState } from "react";
import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DownloadDimReportButton({ fileId }: { fileId: string }) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (!fileId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/files/${fileId}/bim/dim-check`);
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `dim_check_${fileId}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button variant="secondary" onClick={handleDownload} disabled={loading || !fileId}>
      <FileDown className="mr-2 h-4 w-4" />
      {loading ? "Preparing…" : "Download Dim Report"}
    </Button>
  );
}
