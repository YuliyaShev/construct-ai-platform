import { useEffect, useState } from "react";

type HeatmapPoint = { x: number; y: number; severity: string; color?: string; message?: string };

export function useHeatmap(analysisId: number) {
  const [heatmap, setHeatmap] = useState<HeatmapPoint[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/analysis/${analysisId}/heatmap`);
        if (!res.ok) throw new Error("Failed to fetch heatmap");
        const data = await res.json();
        setHeatmap(data.heatmap || []);
        setPage(data.page || 1);
      } catch (e: any) {
        setError(e?.message || "Error");
      } finally {
        setLoading(false);
      }
    };
    if (analysisId) load();
  }, [analysisId]);

  return { heatmap, page, loading, error };
}
