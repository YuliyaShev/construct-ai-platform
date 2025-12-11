"use client";

import { SeverityBadge } from "./SeverityBadge";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";

type Issue = {
  id: string;
  title: string;
  severity: string;
  code_reference?: string;
  expected?: string;
  actual?: string;
  recommendation?: string;
  description?: string;
};

export function CodeIssueTable({ issues }: { issues: Issue[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm">
      <Table className="bg-white dark:bg-zinc-900">
        <THead className="bg-slate-50 dark:bg-zinc-800">
          <TR>
            <TH>ID</TH>
            <TH>Severity</TH>
            <TH>Title</TH>
            <TH>Code Ref</TH>
            <TH>Expected</TH>
            <TH>Actual</TH>
            <TH>Recommendation</TH>
          </TR>
        </THead>
        <TBody>
          {issues.length === 0 && (
            <TR>
              <TD colSpan={7} className="py-4 text-center text-slate-500">
                No code issues detected.
              </TD>
            </TR>
          )}
          {issues.map((iss) => (
            <TR key={iss.id}>
              <TD className="font-semibold text-slate-900 dark:text-slate-100">{iss.id}</TD>
              <TD>
                <SeverityBadge severity={iss.severity} />
              </TD>
              <TD className="text-sm text-slate-800 dark:text-slate-200">{iss.title}</TD>
              <TD className="text-xs text-slate-600 dark:text-slate-300">{iss.code_reference || "—"}</TD>
              <TD className="text-sm">{iss.expected || "—"}</TD>
              <TD className="text-sm">{iss.actual || "—"}</TD>
              <TD className="text-sm">{iss.recommendation || "—"}</TD>
            </TR>
          ))}
        </TBody>
      </Table>
    </div>
  );
}
