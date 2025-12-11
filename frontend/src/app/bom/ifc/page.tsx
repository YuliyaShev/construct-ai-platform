"use client";

import { useEffect, useState } from "react";
import { IFCDownloadButton } from "@/components/bim/IFCDownloadButton";
import { IFCInfoPanel } from "@/components/bim/IFCInfoPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function IFCPage() {
  const [fileId, setFileId] = useState<string>("1");
  const [counts, setCounts] = useState<any>({});
  const [version, setVersion] = useState<"IFC4" | "IFC2x3">("IFC4");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      // Hit IFC endpoint just to validate; discard body
      const res = await fetch(`/api/files/${fileId}/bom/ifc?version=${version}`);
      if (!res.ok) throw new Error("Failed to generate IFC");
      setCounts({}); // Placeholder: counts come from backend if extended
    } catch (e: any) {
      setError(e?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto max-w-5xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Construct AI</p>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">BIM / IFC Export</h1>
        </div>
        <div className="flex gap-2">
          <IFCDownloadButton fileId={fileId} version="IFC4" />
          <IFCDownloadButton fileId={fileId} version="IFC2x3" />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Input value={fileId} onChange={(e) => setFileId(e.target.value)} className="w-32" placeholder="File ID" />
        <select
          className="border rounded px-2 py-1 bg-white dark:bg-zinc-900 text-sm"
          value={version}
          onChange={(e) => setVersion(e.target.value as "IFC4" | "IFC2x3")}
        >
          <option value="IFC4">IFC4</option>
          <option value="IFC2x3">IFC2x3</option>
        </select>
        <Button onClick={fetchInfo} disabled={loading}>Generate</Button>
        {error && <div className="text-sm text-red-600">{error}</div>}
      </div>

      <IFCInfoPanel counts={counts} version={version} />
    </div>
  );
}
