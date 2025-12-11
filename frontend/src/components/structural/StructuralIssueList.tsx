"use client";

type Issue = { severity: string; message: string };

export function StructuralIssueList({ issues }: { issues: Issue[] }) {
  if (!issues?.length) return <div className="text-sm text-slate-500">No issues detected.</div>;
  return (
    <div className="space-y-2">
      {issues.map((iss, idx) => (
        <div
          key={idx}
          className="rounded-lg border border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800/40 dark:bg-amber-900/30 p-3 text-sm"
        >
          <div className="font-semibold">{iss.severity?.toUpperCase()}</div>
          <div>{iss.message}</div>
        </div>
      ))}
    </div>
  );
}
