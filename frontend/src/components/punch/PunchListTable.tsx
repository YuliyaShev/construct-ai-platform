"use client";

import { PunchSeverityBadge } from "./PunchSeverityBadge";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";

type Item = { description: string; trade?: string; severity?: string; priority?: string; drawing_reference?: string };

export function PunchListTable({ items, onSelect }: { items: Item[]; onSelect?: (i: Item) => void }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm">
      <Table className="bg-white dark:bg-zinc-900">
        <THead className="bg-slate-50 dark:bg-zinc-800">
          <TR>
            <TH>Trade</TH>
            <TH>Description</TH>
            <TH>Severity</TH>
            <TH>Priority</TH>
            <TH>Ref</TH>
          </TR>
        </THead>
        <TBody>
          {items.length === 0 && (
            <TR>
              <TD colSpan={5} className="py-4 text-center text-slate-500">
                No punch items.
              </TD>
            </TR>
          )}
          {items.map((i, idx) => (
            <TR key={idx} onClick={() => onSelect?.(i)} className="cursor-pointer">
              <TD className="font-semibold text-slate-900 dark:text-slate-100">{i.trade}</TD>
              <TD className="text-sm text-slate-700 dark:text-slate-200">{i.description}</TD>
              <TD>
                <PunchSeverityBadge level={i.severity} />
              </TD>
              <TD className="text-xs text-slate-500">{i.priority}</TD>
              <TD className="text-xs text-slate-500">{i.drawing_reference}</TD>
            </TR>
          ))}
        </TBody>
      </Table>
    </div>
  );
}
