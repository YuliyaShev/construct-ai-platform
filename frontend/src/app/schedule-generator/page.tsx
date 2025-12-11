"use client";

import { useEffect, useState } from "react";
import { ScheduleSettingsForm } from "@/components/schedule/ScheduleSettingsForm";
import { ActivityTable } from "@/components/schedule/ActivityTable";
import { GanttChart } from "@/components/schedule/GanttChart";
import { CriticalPathHighlight } from "@/components/schedule/CriticalPathHighlight";
import { ResourceLoadingChart } from "@/components/schedule/ResourceLoadingChart";
import { TimelineControls } from "@/components/schedule/TimelineControls";
import { ExportScheduleButtons } from "@/components/schedule/ExportScheduleButtons";

type ScheduleResult = {
  summary: { total_duration_days: number; critical_path: string[] };
  activities: any[];
  gantt_pdf?: string | null;
};

export default function ScheduleGeneratorPage() {
  const [result, setResult] = useState<ScheduleResult | null>(null);

  const run = async (payload?: any) => {
    const res = await fetch("/api/schedule/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload || {}),
    });
    const json = await res.json();
    setResult(json);
  };

  useEffect(() => {
    run({ start_date: "2025-04-01" });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">AI Construction Schedule Generator (4D BIM)</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Auto-build activities, durations, logic, CPM critical path, and Gantt visualization.
          </p>
        </div>
        <ExportScheduleButtons pdf={result?.gantt_pdf} />
      </div>

      <ScheduleSettingsForm onRun={run} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-3">
          <TimelineControls />
          <GanttChart activities={result?.activities || []} />
        </div>
        <div className="space-y-3">
          <CriticalPathHighlight activities={result?.summary?.critical_path || []} />
          <ResourceLoadingChart activities={result?.activities || []} />
        </div>
      </div>

      <ActivityTable activities={result?.activities || []} />
    </div>
  );
}
