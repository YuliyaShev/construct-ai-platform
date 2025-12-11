"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";

type Props = {
  rfiId: number;
};

export function ExportReportButton({ rfiId }: Props) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/rfi/${rfiId}/report`);
      if (!res.ok) throw new Error("Failed to export PDF");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `RFI_${rfiId}_report.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Failed to export PDF");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button variant="secondary" size="sm" onClick={handleDownload} disabled={loading} className="gap-2">
      <FileDown className="h-4 w-4" />
      {loading ? "Exporting..." : "Export PDF Report"}
    </Button>
  );
}
