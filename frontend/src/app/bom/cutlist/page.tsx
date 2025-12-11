"use client";

import { useEffect, useState } from "react";
import { CutListTable } from "@/components/bom/CutListTable";
import { ProfileSummary } from "@/components/bom/ProfileSummary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/analyze/Primitives";

export default function CutlistPage() {
  const [fileId, setFileId] = useState<string>("1");
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [unit, setUnit] = useState<"imperial" | "metric">("metric");
  const [error, setError] = useState<string | null>(null);

  const fetchCutlist = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/files/${fileId}/bom/cutlist`);
      if (!res.ok) throw new Error("Failed to fetch cutlist");
      const body = await res.json();
      setData(body || {});
    } catch (e: any) {
      setError(e?.message || "Error");
      setData({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCutlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto max-w-6xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Construct AI</p>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Cut List</h1>
        </div>
        <div className="flex items-center gap-2">
          <select
            className="border rounded px-2 py-1 bg-white dark:bg-zinc-900 text-sm"
            value={unit}
            onChange={(e) => setUnit(e.target.value as "imperial" | "metric")}
          >
            <option value="imperial">Imperial</option>
            <option value="metric">Metric</option>
          </select>
          <Button onClick={fetchCutlist} disabled={loading}>Refresh</Button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Input value={fileId} onChange={(e) => setFileId(e.target.value)} className="w-32" placeholder="File ID" />
        <Button onClick={fetchCutlist} disabled={loading}>Load Cutlist</Button>
        {error && <div className="text-sm text-red-600">{error}</div>}
      </div>

      {loading ? (
        <Skeleton className="h-40 w-full rounded-xl" />
      ) : (
        <div className="space-y-4">
          <ProfileSummary totals={data?.totals_by_profile || {}} unit={unit} />
          <CutListTable members={data?.members || []} unit={unit} />
        </div>
      )}
    </div>
  );
}
