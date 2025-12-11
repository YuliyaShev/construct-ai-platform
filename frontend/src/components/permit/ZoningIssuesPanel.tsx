"use client";

type ZoningIssue = { issue: string; code_reference?: string; severity?: string };

export function ZoningIssuesPanel({ issues }: { issues: ZoningIssue[] }) {
  if (!issues?.length) return <div className="text-sm text-slate-500">No zoning violations detected.</div>;
  return (
    <div className="space-y-2">
      {issues.map((z, idx) => (
        <div
          key={idx}
          className="rounded-lg border border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800/40 dark:bg-amber-900/30 p-3 text-sm"
        >
          <div className="font-semibold">{z.severity?.toUpperCase() || "MEDIUM"}</div>
          <div>{z.issue}</div>
          {z.code_reference && <div className="text-xs text-amber-700">Ref: {z.code_reference}</div>}
        </div>
      ))}
    </div>
  );
}
