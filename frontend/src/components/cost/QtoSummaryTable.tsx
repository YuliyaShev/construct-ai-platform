"use client";

import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";

type QtoItem = { item: string; unit: string; quantity: number; source?: string };

export function QtoSummaryTable({ items }: { items: QtoItem[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm">
      <Table className="bg-white dark:bg-zinc-900">
        <THead className="bg-slate-50 dark:bg-zinc-800">
          <TR>
            <TH>Item</TH>
            <TH>Qty</TH>
            <TH>Unit</TH>
            <TH>Source</TH>
          </TR>
        </THead>
        <TBody>
          {items.length === 0 && (
            <TR>
              <TD colSpan={4} className="py-4 text-center text-slate-500">
                No QTO items.
              </TD>
            </TR>
          )}
          {items.map((q, idx) => (
            <TR key={idx}>
              <TD className="font-semibold text-slate-900 dark:text-slate-100">{q.item}</TD>
              <TD>{q.quantity}</TD>
              <TD>{q.unit}</TD>
              <TD className="text-xs text-slate-500">{q.source || "—"}</TD>
            </TR>
          ))}
        </TBody>
      </Table>
    </div>
  );
}
