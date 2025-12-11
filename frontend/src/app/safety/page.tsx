"use client";

import { useEffect, useMemo, useState } from "react";
import { HazardList } from "@/components/safety/HazardList";
import { HazardCard } from "@/components/safety/HazardCard";
import { ComplianceSummary } from "@/components/safety/ComplianceSummary";
import { SafetyFilterPanel } from "@/components/safety/SafetyFilterPanel";
import { DownloadSafetyReport } from "@/components/safety/DownloadSafetyReport";

type SafetyResult = {
  hazards: any[];
  summary: any;
  pdf_report?: string | null;
};

export default function SafetyPage() {
  const [data, setData] = useState<SafetyResult | null>(null);
  const [selected, setSelected] = useState<any | null>(null);
  const [filters, setFilters] = useState<string[]>([]);

  const fetchData = async () => {
    const res = await fetch("/api/analysis/safety-detect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ region: "USA", hazard_types: [], confidence_threshold: 0.65 }),
    });
    const json = await res.json();
    setData(json);
    setSelected(json?.hazards?.[0] || null);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    if (!filters.length) return data?.hazards || [];
    return (data?.hazards || []).filter((h) => filters.includes((h.hazard_type || "").toLowerCase()));
  }, [data, filters]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">AI Safety Hazard Detector</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Detect OSHA/CSA hazards from BIM, logistics, and photos; generate corrective actions and references.
          </p>
        </div>
        <DownloadSafetyReport url={data?.pdf_report} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <ComplianceSummary summary={data?.summary} />
        <SafetyFilterPanel value={filters} onChange={setFilters} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <HazardList hazards={filtered} onSelect={(h) => setSelected(h)} />
        </div>
        <HazardCard hazard={selected} />
      </div>
    </div>
  );
}
