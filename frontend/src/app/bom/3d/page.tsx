"use client";

import { useEffect, useState } from "react";
import { ThreeViewer } from "@/components/model3d/ThreeViewer";
import { ModelStats } from "@/components/model3d/ModelStats";
import { DownloadButtons } from "@/components/model3d/DownloadButtons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/analyze/Primitives";

export default function Model3DPage() {
  const [fileId, setFileId] = useState<string>("1");
  const [model, setModel] = useState<any>(null);
  const [exportData, setExportData] = useState<{ gltf?: string; obj?: string }>({});
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchModel = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/files/${fileId}/bom/3d`);
      if (!res.ok) throw new Error("Failed to fetch 3D model");
      const data = await res.json();
      setModel(data?.model || null);
      setExportData({ gltf: data?.export?.gltf, obj: data?.export?.obj });
      setStats(data?.stats || {});
    } catch (e: any) {
      setError(e?.message || "Error");
      setModel(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto max-w-6xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Construct AI</p>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">3D Model</h1>
        </div>
        <DownloadButtons gltf={exportData.gltf} obj={exportData.obj} />
      </div>

      <div className="flex items-center gap-3">
        <Input value={fileId} onChange={(e) => setFileId(e.target.value)} className="w-32" placeholder="File ID" />
        <Button onClick={fetchModel} disabled={loading}>Load 3D Model</Button>
        {error && <div className="text-sm text-red-600">{error}</div>}
      </div>

      {loading ? <Skeleton className="h-80 w-full rounded-xl" /> : model ? <ThreeViewer model={model} /> : <div className="text-sm text-slate-500">No model.</div>}

      <ModelStats stats={stats} />
    </div>
  );
}
