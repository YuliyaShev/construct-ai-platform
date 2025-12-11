"use client";

import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";

type Activity = {
  id: string;
  name: string;
  duration_days: number;
  start: string;
  finish: string;
  critical?: boolean;
};

export function ActivityTable({ activities }: { activities: Activity[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm">
      <Table className="bg-white dark:bg-zinc-900">
        <THead className="bg-slate-50 dark:bg-zinc-800">
          <TR>
            <TH>ID</TH>
            <TH>Activity</TH>
            <TH>Duration (d)</TH>
            <TH>Start</TH>
            <TH>Finish</TH>
            <TH>Critical</TH>
          </TR>
        </THead>
        <TBody>
          {activities.length === 0 && (
            <TR>
              <TD colSpan={6} className="py-4 text-center text-slate-500">
                No activities.
              </TD>
            </TR>
          )}
          {activities.map((a) => (
            <TR key={a.id}>
              <TD className="font-semibold text-slate-900 dark:text-slate-100">{a.id}</TD>
              <TD className="text-sm text-slate-700 dark:text-slate-200">{a.name}</TD>
              <TD>{a.duration_days}</TD>
              <TD className="text-xs text-slate-500">{a.start}</TD>
              <TD className="text-xs text-slate-500">{a.finish}</TD>
              <TD className="text-xs text-red-600 font-semibold">{a.critical ? "Yes" : "No"}</TD>
            </TR>
          ))}
        </TBody>
      </Table>
    </div>
  );
}
