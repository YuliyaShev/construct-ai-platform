"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/analyze/Primitives";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";

type RFI = {
  rfi_number: string;
  title: string;
  issue_type?: string;
  severity?: "error" | "warning" | "info";
  created_at?: string;
};

const tone = {
  error: "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-200",
  warning: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-200",
  info: "bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-200",
};

export function RecentRFIs({ rfis, onDownload }: { rfis: RFI[]; onDownload?: (rfi: RFI) => void }) {
  return (
    <div className="space-y-2">
      {rfis.length === 0 && <div className="text-sm text-slate-500">No RFIs yet.</div>}
      {rfis.map((rfi) => (
        <Card key={rfi.rfi_number} className="flex items-center justify-between px-4 py-3 border border-slate-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/50">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{rfi.title}</p>
              {rfi.severity && <span className={`text-[11px] px-2 py-0.5 rounded-full ${tone[rfi.severity]}`}>{rfi.severity}</span>}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-3">
              <span>RFI #{rfi.rfi_number}</span>
              {rfi.created_at && <span>{format(new Date(rfi.created_at), "yyyy-MM-dd HH:mm")}</span>}
              {rfi.issue_type && <Badge>{rfi.issue_type}</Badge>}
            </div>
          </div>
          <Button size="sm" variant="outline" onClick={() => onDownload?.(rfi)}>
            PDF
          </Button>
        </Card>
      ))}
    </div>
  );
}
