"use client";

import { ClashSeverityBadge } from "./ClashSeverityBadge";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";

type Clash = {
  id: string;
  type: string;
  severity: string;
  description?: string;
  recommendation?: string;
  elements?: string[];
  penetration_mm?: number;
  location?: { x: number; y: number; z?: number };
};

type Props = {
  clashes: Clash[];
};

export function ClashListTable({ clashes }: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm">
      <Table className="bg-white dark:bg-zinc-900">
        <THead className="bg-slate-50 dark:bg-zinc-800">
          <TR>
            <TH>ID</TH>
            <TH>Severity</TH>
            <TH>Type</TH>
            <TH>Elements</TH>
            <TH>Description</TH>
            <TH>Recommendation</TH>
          </TR>
        </THead>
        <TBody>
          {clashes.length === 0 && (
            <TR>
              <TD colSpan={6} className="py-4 text-center text-slate-500">
                No clashes detected.
              </TD>
            </TR>
          )}
          {clashes.map((clash) => (
            <TR key={clash.id}>
              <TD className="font-semibold text-slate-900 dark:text-slate-100">{clash.id}</TD>
              <TD>
                <ClashSeverityBadge severity={clash.severity} />
              </TD>
              <TD className="text-sm text-slate-700 dark:text-slate-200">{clash.type}</TD>
              <TD className="text-xs text-slate-600 dark:text-slate-300">
                {clash.elements?.join(", ") || "—"}
              </TD>
              <TD className="text-sm text-slate-700 dark:text-slate-200 max-w-xs">{clash.description || "—"}</TD>
              <TD className="text-sm text-slate-700 dark:text-slate-200 max-w-xs">
                {clash.recommendation || "—"}
              </TD>
            </TR>
          ))}
        </TBody>
      </Table>
    </div>
  );
}
