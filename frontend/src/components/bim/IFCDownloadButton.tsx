"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";

export function IFCDownloadButton({ fileId, version }: { fileId: number | string; version?: "IFC4" | "IFC2x3" }) {
  const [loading, setLoading] = useState(false);
  const ver = version || "IFC4";

  const handle = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/files/${fileId}/bom/ifc?version=${ver}`);
      if (!res.ok) throw new Error("Failed to download IFC");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "model.ifc";
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert("Failed to download IFC");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button variant="secondary" size="sm" className="gap-2" onClick={handle} disabled={loading}>
      <FileDown className="h-4 w-4" />
      {loading ? "Exporting..." : `Download ${ver}`}
    </Button>
  );
}
