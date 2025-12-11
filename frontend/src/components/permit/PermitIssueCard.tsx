"use client";

import { SeverityBadge } from "@/components/code/SeverityBadge";

type Issue = {
  id: string;
  title: string;
  severity: string;
  code_reference?: string;
  description?: string;
  recommendation?: string;
};

export function PermitIssueCard({ issue }: { issue: Issue }) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-sm space-y-2">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">{issue.id}</div>
        <SeverityBadge severity={issue.severity} />
      </div>
      <div className="text-sm font-medium text-slate-800 dark:text-slate-200">{issue.title}</div>
      {issue.code_reference && <div className="text-xs text-slate-500">Ref: {issue.code_reference}</div>}
      {issue.description && <p className="text-sm text-slate-700 dark:text-slate-200">{issue.description}</p>}
      {issue.recommendation && (
        <div className="text-sm text-slate-800 dark:text-slate-100 font-medium">Fix: {issue.recommendation}</div>
      )}
    </div>
  );
}
