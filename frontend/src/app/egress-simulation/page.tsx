"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScenarioSelector } from "@/components/egress/ScenarioSelector";
import { EgressFloorplanViewer } from "@/components/egress/EgressFloorplanViewer";
import { AgentAnimationLayer } from "@/components/egress/AgentAnimationLayer";
import { ExitStatsCard } from "@/components/egress/ExitStatsCard";
import { TimelineChart } from "@/components/egress/TimelineChart";
import { BottleneckList } from "@/components/egress/BottleneckList";
import { DownloadEgressReport } from "@/components/egress/DownloadEgressReport";

type SimResult = {
  summary: any;
  timeline: any[];
  trajectory: any[];
  bottlenecks: string[];
  violations?: any[];
  heatmap?: string | null;
  report?: string | null;
};

export default function EgressSimulationPage() {
  const [scenario, setScenario] = useState("default");
  const [result, setResult] = useState<SimResult | null>(null);
  const [loading, setLoading] = useState(false);

  const runSim = async () => {
    setLoading(true);
    const body = {
      geometry: {
        rooms: [{ id: "r1", occupants: 20, center: [100, 100] }],
        exits: [{ id: "ex1", center: [400, 100], exit: true }],
      },
      fire_start: { x: 0, y: 0 },
      agent_density: "normal",
      scenario,
    };
    const res = await fetch("/api/egress/simulate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    setResult(json);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">AI Fire Egress Simulation</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Agent-based evacuation modeling with congestion, queues, and exit performance.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ScenarioSelector value={scenario} onChange={setScenario} />
          <Button onClick={runSim} disabled={loading}>
            {loading ? "Simulating…" : "Run Simulation"}
          </Button>
          <DownloadEgressReport url={result?.report} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-3">
          <EgressFloorplanViewer nodes={result?.trajectory?.map((a) => ({ id: a.id, center: a.position, exit: false }))} />
          <AgentAnimationLayer agents={result?.trajectory} />
        </div>
        <div className="space-y-3">
          <ExitStatsCard summary={result?.summary} />
          <BottleneckList items={result?.bottlenecks || []} />
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Timeline</h2>
        <TimelineChart data={result?.timeline || []} />
      </div>
    </div>
  );
}
