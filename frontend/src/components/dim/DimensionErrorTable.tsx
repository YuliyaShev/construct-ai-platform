"use client";

import { DimensionSeverityBadge } from "./DimensionSeverityBadge";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";

type DimError = {
  id: string;
  type: string;
  expected?: string;
  actual?: string;
  difference_mm?: number;
  severity?: string;
  description?: string;
  suggestion?: string;
};

type Props = {
  items: DimError[];
};

export function DimensionErrorTable({ items }: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm">
      <Table className="bg-white dark:bg-zinc-900">
        <THead className="bg-slate-50 dark:bg-zinc-800">
          <TR>
            <TH>ID</TH>
            <TH>Severity</TH>
            <TH>Type</TH>
            <TH>Expected</TH>
            <TH>Actual</TH>
            <TH>Diff (mm)</TH>
            <TH>Suggestion</TH>
          </TR>
        </THead>
        <TBody>
          {items.length === 0 && (
            <TR>
              <TD colSpan={7} className="py-4 text-center text-slate-500">
                No dimension errors found.
              </TD>
            </TR>
          )}
          {items.map((err) => (
            <TR key={err.id}>
              <TD className="font-semibold text-slate-900 dark:text-slate-100">{err.id}</TD>
              <TD>
                <DimensionSeverityBadge severity={err.severity} />
              </TD>
              <TD className="text-sm text-slate-700 dark:text-slate-200">{err.type}</TD>
              <TD className="text-sm text-slate-700 dark:text-slate-200">{err.expected || "—"}</TD>
              <TD className="text-sm text-slate-700 dark:text-slate-200">{err.actual || "—"}</TD>
              <TD className="text-sm text-slate-700 dark:text-slate-200">{err.difference_mm ?? "—"}</TD>
              <TD className="text-sm text-slate-700 dark:text-slate-200">{err.suggestion || "—"}</TD>
            </TR>
          ))}
        </TBody>
      </Table>
    </div>
  );
}
