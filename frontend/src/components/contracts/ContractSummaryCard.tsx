"use client";

export function ContractSummaryCard({ summary }: { summary?: any }) {
  if (!summary) return <div className="text-sm text-slate-500">No summary.</div>;
  return (
    <div className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-sm text-sm space-y-1">
      <div className="text-sm font-semibold text-slate-900 dark:text-white">Contract Summary</div>
      <div>Risk Score: {summary.risk_score}</div>
      <div>Type: {summary.contract_type}</div>
    </div>
  );
}
