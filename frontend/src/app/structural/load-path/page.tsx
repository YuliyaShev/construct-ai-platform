"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadPathOverlay } from "@/components/structural/LoadPathOverlay";
import { StructuralIssueList } from "@/components/structural/StructuralIssueList";
import { ElementDetails } from "@/components/structural/ElementDetails";
import { useLoadPath } from "@/hooks/useLoadPath";

export default function LoadPathPage() {
  const [file, setFile] = useState<File | null>(null);
  const { data, loading, run } = useLoadPath();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedNode = data?.nodes?.find((n) => n.id === selectedId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">AI Load Path Analyzer</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Detects beams, columns, and load transfer paths from structural PDFs.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <Button onClick={() => file && run(file)} disabled={loading || !file}>
            {loading ? "Analyzing…" : "Run Analysis"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-3">
          <LoadPathOverlay
            beams={data?.nodes?.filter((n) => n.type === "beam").map((b) => ({ id: b.id, type: b.type, coords: b.coords }))}
            columns={data?.nodes?.filter((n) => n.type === "column").map((c) => ({ id: c.id, type: c.type, coords: c.coords }))}
            issues={data?.issues}
          />
          <div className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Elements</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {data?.nodes?.map((n) => (
                <button
                  key={n.id}
                  onClick={() => setSelectedId(n.id)}
                  className={`rounded-lg border px-3 py-2 text-left text-sm transition ${
                    selectedId === n.id
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700"
                      : "border-slate-200 dark:border-zinc-800"
                  }`}
                >
                  <div className="font-semibold">{n.id}</div>
                  <div className="text-xs text-slate-500">{n.type}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Element Details</h2>
            <ElementDetails node={selectedNode} />
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Issues</h2>
            <StructuralIssueList issues={data?.issues || []} />
          </div>
        </div>
      </div>
    </div>
  );
}
