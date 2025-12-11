"use client";

import { useEffect, useMemo, useState } from "react";
import { CategoryTabs } from "@/components/bom/CategoryTabs";
import { BomTable } from "@/components/bom/BomTable";
import { GeometryBomTable } from "@/components/bom/GeometryBomTable";
import { DownloadCsvButton } from "@/components/bom/DownloadCsvButton";
import { GlassBomTable } from "@/components/bom/GlassBomTable";
import { GlassStatsCard } from "@/components/bom/GlassStatsCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/analyze/Primitives";

type Item = {
  name?: string;
  qty?: number;
  unit?: string;
  location?: string;
  notes?: string;
  group?: string;
};

export default function BomPage() {
  const [fileId, setFileId] = useState<string>("1");
  const [items, setItems] = useState<Item[]>([]);
  const [geomProfiles, setGeomProfiles] = useState<any[]>([]);
  const [glassPanels, setGlassPanels] = useState<any[]>([]);
  const [glassTotals, setGlassTotals] = useState<{ sqft: number; sqm: number }>({ sqft: 0, sqm: 0 });
  const [loading, setLoading] = useState(false);
  const [loadingGeom, setLoadingGeom] = useState(false);
  const [loadingGlass, setLoadingGlass] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unit, setUnit] = useState<"imperial" | "metric">("imperial");
  const [category, setCategory] = useState("all");

  const filtered = useMemo(() => {
    if (category === "all") return items;
    return items.filter((i) => (i.group || "misc") === category);
  }, [items, category]);

  const fetchBom = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/files/${fileId}/bom`);
      if (!res.ok) throw new Error("Failed to fetch BOM");
      const data = await res.json();
      setItems(data?.materials || []);
    } catch (e: any) {
      setError(e?.message || "Error");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchGeomBom = async () => {
    try {
      setLoadingGeom(true);
      const res = await fetch(`/api/files/${fileId}/bom/geometry`);
      if (!res.ok) throw new Error("Failed to fetch geometry BOM");
      const data = await res.json();
      setGeomProfiles(data?.profiles || []);
    } catch (e: any) {
      setError(e?.message || "Error");
      setGeomProfiles([]);
    } finally {
      setLoadingGeom(false);
    }
  };

  const fetchGlassBom = async () => {
    try {
      setLoadingGlass(true);
      const res = await fetch(`/api/files/${fileId}/bom/glass`);
      if (!res.ok) throw new Error("Failed to fetch glass BOM");
      const data = await res.json();
      setGlassPanels(data?.glass_panels || []);
      setGlassTotals({
        sqft: data?.total_area_sqft || 0,
        sqm: data?.total_area_sqm || 0,
      });
    } catch (e: any) {
      setError(e?.message || "Error");
      setGlassPanels([]);
      setGlassTotals({ sqft: 0, sqm: 0 });
    } finally {
      setLoadingGlass(false);
    }
  };

  useEffect(() => {
    fetchBom();
    fetchGeomBom();
    fetchGlassBom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto max-w-6xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Construct AI</p>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Bill of Materials</h1>
        </div>
        <DownloadCsvButton items={filtered} />
      </div>

      <div className="flex items-center gap-3">
        <Input value={fileId} onChange={(e) => setFileId(e.target.value)} className="w-32" placeholder="File ID" />
        <Button onClick={fetchBom} disabled={loading}>Extract BOM</Button>
        {error && <div className="text-sm text-red-600">{error}</div>}
      </div>

      <CategoryTabs onChange={setCategory} />
      <div className="grid gap-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Text BOM</h2>
            <Button size="sm" variant="outline" onClick={fetchBom} disabled={loading}>Refresh</Button>
          </div>
          {loading ? <Skeleton className="h-40 w-full rounded-xl" /> : <BomTable items={filtered} />}
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Geometry BOM</h2>
            <Button size="sm" variant="outline" onClick={fetchGeomBom} disabled={loadingGeom}>Refresh</Button>
          </div>
          {loadingGeom ? <Skeleton className="h-40 w-full rounded-xl" /> : <GeometryBomTable profiles={geomProfiles} />}
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Glass BOM</h2>
              <div className="flex items-center gap-2 text-sm">
                <span>Units:</span>
                <select
                  className="border rounded px-2 py-1 bg-white dark:bg-zinc-900 text-sm"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value as "imperial" | "metric")}
                >
                  <option value="imperial">Imperial</option>
                  <option value="metric">Metric</option>
                </select>
              </div>
            </div>
            <Button size="sm" variant="outline" onClick={fetchGlassBom} disabled={loadingGlass}>Refresh</Button>
          </div>
          {loadingGlass ? (
            <Skeleton className="h-40 w-full rounded-xl" />
          ) : (
            <div className="space-y-3">
              <GlassStatsCard totalSqft={glassTotals.sqft} totalSqm={glassTotals.sqm} />
              <GlassBomTable panels={glassPanels} unit={unit} />
            </div>
          )}
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Cut List</h2>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => window.location.href = "/bom/cutlist"}>Open Cut List</Button>
              <Button size="sm" variant="outline" onClick={() => window.location.href = "/bom/3d"}>Open 3D Model</Button>
              <Button size="sm" variant="outline" onClick={() => window.location.href = "/bom/ifc"}>BIM / IFC</Button>
            </div>
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-300">
            View detailed cut list with lengths and angles on the Cut List tab, 3D reconstruction on the 3D Model tab, and BIM-ready IFC export on the BIM / IFC tab.
          </div>
        </div>
      </div>
    </div>
  );
}
