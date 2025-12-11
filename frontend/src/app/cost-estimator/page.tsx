"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { LocationSelector } from "@/components/cost/LocationSelector";
import { EscalationSlider } from "@/components/cost/EscalationSlider";
import { QtoSummaryTable } from "@/components/cost/QtoSummaryTable";
import { CostItemTable } from "@/components/cost/CostItemTable";
import { CostBreakdownChart } from "@/components/cost/CostBreakdownChart";
import { ExportCostReportButton } from "@/components/cost/ExportCostReportButton";
import { CostScenarioSelector } from "@/components/cost/ScenarioSelector";
import { CostComparisonChart } from "@/components/cost/CostComparisonChart";

type CostResult = {
  summary: any;
  cost_items: any[];
  qto: any[];
  report_pdf?: string | null;
  excel_report?: string | null;
};

export default function CostEstimatorPage() {
  const [location, setLocation] = useState("Ontario");
  const [labor, setLabor] = useState("union");
  const [complexity, setComplexity] = useState("medium");
  const [escalationYears, setEscalationYears] = useState(0);
  const [contingency, setContingency] = useState(0.1);
  const [result, setResult] = useState<CostResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [scenario, setScenario] = useState("baseline");

  const runEstimate = async () => {
    setLoading(true);
    const res = await fetch("/api/cost/estimate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location,
        labor_type: labor,
        complexity,
        escalation_years: escalationYears,
        contingency,
      }),
    });
    const json = await res.json();
    setResult(json);
    setLoading(false);
  };

  useEffect(() => {
    runEstimate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scenarioData = useMemo(() => {
    if (!result?.summary) return [];
    const base = result.summary.total_cost || 0;
    return [
      { label: "Baseline", total_cost: base },
      { label: "Material +10%", total_cost: base * 1.1 },
      { label: "Union", total_cost: base * 1.05 },
      { label: "Escalation 3y", total_cost: base * 1.1 },
    ];
  }, [result]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">AI Cost Estimator (5D BIM)</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Automated QTO, CSI classification, regional factors, escalation, and scenario analysis.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ExportCostReportButton url={result?.report_pdf} />
          <Button onClick={runEstimate} disabled={loading}>
            {loading ? "Estimating…" : "Recalculate"}
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <LocationSelector value={location} onChange={setLocation} />
        <CostScenarioSelector value={scenario} onChange={setScenario} />
        <EscalationSlider value={escalationYears} onChange={setEscalationYears} />
        <div className="text-sm text-slate-700 dark:text-slate-200">
          Contingency: {(contingency * 100).toFixed(0)}%
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <CostBreakdownChart summary={result?.summary} />
        <div className="lg:col-span-2">
          <CostItemTable items={result?.cost_items || []} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <QtoSummaryTable items={result?.qto || []} />
        <div className="lg:col-span-2">
          <CostComparisonChart scenarios={scenarioData} />
        </div>
      </div>
    </div>
  );
}
