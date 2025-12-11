"use client";

import { useEffect, useMemo, useState } from "react";
import { Structural3DViewer } from "@/components/structural/Structural3DViewer";
import { RiskHeatmapOverlay } from "@/components/structural/RiskHeatmapOverlay";
import { ElementInspector } from "@/components/structural/ElementInspector";
import { FailureModeList } from "@/components/structural/FailureModeList";
import { ProgressiveCollapseSimulator } from "@/components/structural/ProgressiveCollapseSimulator";
import { RiskScoreGauge } from "@/components/structural/RiskScoreGauge";
import { StructuralRecommendationsPanel } from "@/components/structural/StructuralRecommendationsPanel";
import { DownloadStructuralRiskReport } from "@/components/structural/DownloadStructuralRiskReport";

type RiskResult = {
  summary: any;
  risk_map: any[];
  critical_path_of_failure: string[];
  risk_score: number;
  progressive_collapse?: { removed?: string; failed?: string[] };
  report_pdf?: string | null;
};

export default function StructuralRiskPage() {
  const [data, setData] = useState<RiskResult | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedElement = useMemo(() => data?.risk_map?.find((r) => r.id === selectedId), [data, selectedId]);

  const run = async () => {
    const res = await fetch("/api/structural/risk", { method: "POST", body: JSON.stringify({}), headers: { "Content-Type": "application/json" } });
    const json = await res.json();
    setData(json);
    if (json?.risk_map?.length) setSelectedId(json.risk_map[0].id);
  };

  useEffect(() => {
    run();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">AI Structural Failure Predictor</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            D/C analysis, progressive collapse simulation, and risk visualization for structural systems.
          </p>
        </div>
        <DownloadStructuralRiskReport url={data?.report_pdf} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-3">
          <Structural3DViewer elements={data?.risk_map} />
          <RiskHeatmapOverlay points={data?.risk_map || []} />
        </div>
        <div className="space-y-3">
          <RiskScoreGauge score={data?.risk_score} />
          <ElementInspector element={selectedElement} />
          <StructuralRecommendationsPanel recommendations={data?.summary?.recommendations} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <FailureModeList elements={data?.risk_map || []} onSelect={setSelectedId} />
        </div>
        <ProgressiveCollapseSimulator removed={data?.progressive_collapse?.removed} failed={data?.progressive_collapse?.failed} />
      </div>
    </div>
  );
}
