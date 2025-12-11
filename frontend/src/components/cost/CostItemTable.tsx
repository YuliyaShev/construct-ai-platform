"use client";

import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";

type CostItem = {
  csi: string;
  description: string;
  quantity: number;
  unit: string;
  unit_cost: number;
  total_cost: number;
};

export function CostItemTable({ items }: { items: CostItem[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm">
      <Table className="bg-white dark:bg-zinc-900">
        <THead className="bg-slate-50 dark:bg-zinc-800">
          <TR>
            <TH>CSI</TH>
            <TH>Description</TH>
            <TH>Qty</TH>
            <TH>Unit</TH>
            <TH>Unit Cost</TH>
            <TH>Total</TH>
          </TR>
        </THead>
        <TBody>
          {items.length === 0 && (
            <TR>
              <TD colSpan={6} className="py-4 text-center text-slate-500">
                No cost items.
              </TD>
            </TR>
          )}
          {items.map((c, idx) => (
            <TR key={idx}>
              <TD className="font-semibold text-slate-900 dark:text-slate-100">{c.csi}</TD>
              <TD className="text-sm text-slate-700 dark:text-slate-200">{c.description}</TD>
              <TD>{c.quantity}</TD>
              <TD>{c.unit}</TD>
              <TD>${c.unit_cost.toFixed(2)}</TD>
              <TD>${c.total_cost.toFixed(2)}</TD>
            </TR>
          ))}
        </TBody>
      </Table>
    </div>
  );
}
