"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DimensionErrorTable } from "@/components/dim/DimensionErrorTable";
import { DimensionErrorCard } from "@/components/dim/DimensionErrorCard";
import { DownloadDimReportButton } from "@/components/dim/DownloadDimReportButton";

type DimError = {
  id: string;
  type: string;
  expected?: string;
  actual?: string;
  difference_mm?: number;
  severity?: string;
  description?: string;
  suggestion?: string;
};

type DimResponse = {
  errors: DimError[];
  summary?: Record<string, number>;
};

export default function DimCheckPage() {
  const [fileId, setFileId] = useState("1");
  const [data, setData] = useState<DimResponse>({ errors: [] });
  const [loading, setLoading] = useState(false);

  const fetchData = async (id: string) => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/files/${id}/bim/dim-check`);
      const json = await res.json();
      setData(json);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(fileId);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Dimension Checker</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Detects cross-view dimension inconsistencies, unit errors, and missing critical dimensions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Input value={fileId} onChange={(e) => setFileId(e.target.value)} placeholder="File ID" className="w-28" />
          <Button onClick={() => fetchData(fileId)} disabled={loading}>
            {loading ? "Checking…" : "Run Dimension Check"}
          </Button>
          <DownloadDimReportButton fileId={fileId} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <div className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Summary</h2>
            <div className="text-sm text-slate-700 dark:text-slate-200 space-y-1">
              <div>Total: {data.summary?.total ?? 0}</div>
              <div>Critical: {data.summary?.critical ?? 0}</div>
              <div>High: {data.summary?.high ?? 0}</div>
              <div>Medium: {data.summary?.medium ?? 0}</div>
              <div>Low: {data.summary?.low ?? 0}</div>
              <div>Missing: {data.summary?.missing_dims ?? 0}</div>
            </div>
          </div>
          <DimensionErrorTable items={data.errors || []} />
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Highlighted Issues</h2>
          <div className="grid grid-cols-1 gap-3">
            {(data.errors || []).slice(0, 6).map((err) => (
              <DimensionErrorCard key={err.id} item={err} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
