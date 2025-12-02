"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/analyze/Primitives";
import { Sparkles } from "lucide-react";

export function AISummaryCard({ summary, status, lastActivity }: { summary: string; status: string; lastActivity: string }) {
  const statusTone =
    status === "ready"
      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-200"
      : status === "scanning"
      ? "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-200"
      : "bg-slate-100 text-slate-700 dark:bg-zinc-800/70 dark:text-slate-200";

  return (
    <Card className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-gradient-to-br from-white to-slate-50 dark:from-zinc-950 dark:to-black p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">AI System Summary</p>
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{summary || "No recent analysis yet."}</p>
          <p className="text-xs text-slate-500">Last activity: {lastActivity || "—"}</p>
        </div>
        <span className={`text-[11px] px-2 py-0.5 rounded-full ${statusTone}`}>{status || "idle"}</span>
      </div>
    </Card>
  );
}
