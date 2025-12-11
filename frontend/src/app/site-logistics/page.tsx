"use client";

import { useEffect, useState } from "react";
import { LogisticsViewer } from "@/components/logistics/LogisticsViewer";
import { LogisticsTimeline } from "@/components/logistics/LogisticsTimeline";
import { LogisticsScenarioSelector } from "@/components/logistics/LogisticsScenarioSelector";
import { DownloadLogisticsReport } from "@/components/logistics/DownloadLogisticsReport";
import { Button } from "@/components/ui/button";

type LogisticsResult = {
  summary: any;
  svg_map?: string | null;
  pdf_report?: string | null;
  laydown_areas?: any[];
  truck_routes?: any[];
  crane?: any;
  safety_zones?: any[];
  timeline?: any[];
};

export default function SiteLogisticsPage() {
  const [data, setData] = useState<LogisticsResult | null>(null);
  const [svgContent, setSvgContent] = useState<string | undefined>(undefined);
  const [scenario, setScenario] = useState("baseline");
  const [loading, setLoading] = useState(false);

  const run = async (payload?: any) => {
    setLoading(true);
    const res = await fetch("/api/logistics/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload || {}),
    });
    const json = await res.json();
    setData(json);
    if (json?.svg_map) {
      try {
        const svgRes = await fetch(json.svg_map);
        const text = await svgRes.text();
        setSvgContent(text);
      } catch {
        setSvgContent(undefined);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    run();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">AI Site Logistics Planner</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Crane placement, laydown, routing, and safety zones with 4D logistics timeline.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <LogisticsScenarioSelector value={scenario} onChange={setScenario} />
          <Button onClick={() => run({ scenario })} disabled={loading}>
            {loading ? "Planning…" : "Recalculate"}
          </Button>
          <DownloadLogisticsReport url={data?.pdf_report} />
        </div>
      </div>

      <LogisticsViewer svg={svgContent} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <LogisticsTimeline items={data?.timeline || []} />
        <div className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-sm text-sm space-y-1">
          <div className="font-semibold text-slate-900 dark:text-white">Summary</div>
          <div>Crane: {data?.summary?.crane_type}</div>
          <div>Radius: {data?.summary?.max_radius_m} m</div>
          <div>Score: {data?.summary?.logistics_score}</div>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            {data?.summary?.recommendations?.join("; ")}
          </div>
        </div>
      </div>
    </div>
  );
}
