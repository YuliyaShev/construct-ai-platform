"use client";

type Summary = { total?: number; critical?: number; high?: number; medium?: number; low?: number; osha_refs?: string[]; csa_refs?: string[] };

export function ComplianceSummary({ summary }: { summary?: Summary }) {
  if (!summary) return <div className="text-sm text-slate-500">No summary.</div>;
  return (
    <div className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-sm text-sm space-y-1">
      <div className="font-semibold text-slate-900 dark:text-white">Compliance Summary</div>
      <div>Total: {summary.total ?? 0}</div>
      <div>Critical: {summary.critical ?? 0}</div>
      <div>High: {summary.high ?? 0}</div>
      <div>Medium: {summary.medium ?? 0}</div>
      <div>Low: {summary.low ?? 0}</div>
      <div className="text-xs text-slate-500">OSHA refs: {(summary.osha_refs || []).join(", ")}</div>
      <div className="text-xs text-slate-500">CSA refs: {(summary.csa_refs || []).join(", ")}</div>
    </div>
  );
}
