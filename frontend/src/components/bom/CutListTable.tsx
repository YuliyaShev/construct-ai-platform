"use client";

import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { cn } from "@/lib/helpers";

type Member = {
  profile: string;
  length_mm: number;
  angle_start_deg: number;
  angle_end_deg: number;
  page: string;
  source?: string;
};

export function CutListTable({ members, unit }: { members: Member[]; unit: "imperial" | "metric" }) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <THead>
          <TR>
            <TH>Profile</TH>
            <TH>Length</TH>
            <TH>Start Angle</TH>
            <TH>End Angle</TH>
            <TH>Page</TH>
            <TH>Source</TH>
          </TR>
        </THead>
        <TBody>
          {members.length === 0 && (
            <TR>
              <TD colSpan={6} className="py-4 text-center text-slate-500">
                No members found.
              </TD>
            </TR>
          )}
          {members.map((m, idx) => (
            <TR key={idx}>
              <TD className="font-semibold text-slate-900 dark:text-slate-100">{m.profile}</TD>
              <TD>{unit === "metric" ? `${m.length_mm.toFixed(1)} mm` : `${(m.length_mm / 25.4).toFixed(2)} in`}</TD>
              <TD className={cn(isUncommon(m.angle_start_deg) && "text-amber-600 font-semibold")}>{m.angle_start_deg}°</TD>
              <TD className={cn(isUncommon(m.angle_end_deg) && "text-amber-600 font-semibold")}>{m.angle_end_deg}°</TD>
              <TD>{m.page}</TD>
              <TD className="text-sm text-slate-600 dark:text-slate-300">{m.source || "geometry"}</TD>
            </TR>
          ))}
        </TBody>
      </Table>
    </div>
  );
}

const isUncommon = (a: number) => ![180, 90, 45, 22.5].includes(a);
