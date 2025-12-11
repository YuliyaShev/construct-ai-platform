"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ClashListTable } from "@/components/clash/ClashListTable";
import { Clash3DViewer } from "@/components/clash/Clash3DViewer";
import { DownloadClashReportButton } from "@/components/clash/DownloadClashReportButton";

type Clash = {
  id: string;
  type: string;
  severity: string;
  description?: string;
  recommendation?: string;
  elements?: string[];
  penetration_mm?: number;
  location?: { x: number; y: number; z?: number };
};

type ClashResponse = {
  clashes: Clash[];
  summary?: { total: number; high: number; medium: number; low: number };
  model?: { vertices: number[][]; faces: number[][] };
};

export default function ClashesPage() {
  const [fileId, setFileId] = useState("1");
  const [data, setData] = useState<ClashResponse>({ clashes: [] });
  const [loading, setLoading] = useState(false);

  const fetchClashes = async (id: string) => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/files/${id}/bim/clashes`);
      const json = await res.json();
      setData(json);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClashes(fileId);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Clash Detection</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Navisworks-style AI clash detection combining 3D geometry and rule checks.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            value={fileId}
            onChange={(e) => setFileId(e.target.value)}
            placeholder="File ID"
            className="w-28"
          />
          <Button onClick={() => fetchClashes(fileId)} disabled={loading}>
            {loading ? "Scanning…" : "Run Clash Detection"}
          </Button>
          <DownloadClashReportButton fileId={fileId} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <div className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Summary</h2>
                <p className="text-sm text-slate-600 dark:text-slate-300">Aggregated clash totals by severity</p>
              </div>
              <div className="text-right text-sm text-slate-700 dark:text-slate-200">
                <div>Total: {data.summary?.total ?? 0}</div>
                <div>High: {data.summary?.high ?? 0}</div>
                <div>Medium: {data.summary?.medium ?? 0}</div>
                <div>Low: {data.summary?.low ?? 0}</div>
              </div>
            </div>
          </div>
          <ClashListTable clashes={data.clashes || []} />
        </div>

        <div className="space-y-3">
          <div className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">3D Viewer</h2>
            <Clash3DViewer model={data.model} clashes={data.clashes} />
          </div>
        </div>
      </div>
    </div>
  );
}
