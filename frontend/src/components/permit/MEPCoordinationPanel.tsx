"use client";

type Issue = { message: string; severity?: string };

export function MEPCoordinationPanel({ issues }: { issues: Issue[] }) {
  if (!issues?.length) return <div className="text-sm text-slate-500">No coordination conflicts detected.</div>;
  return (
    <div className="space-y-2">
      {issues.map((i, idx) => (
        <div
          key={idx}
          className="rounded-lg border border-purple-200 bg-purple-50 text-purple-800 dark:border-purple-800/40 dark:bg-purple-900/30 p-3 text-sm"
        >
          <div className="font-semibold">{i.severity?.toUpperCase() || "MEDIUM"}</div>
          <div>{i.message}</div>
        </div>
      ))}
    </div>
  );
}
