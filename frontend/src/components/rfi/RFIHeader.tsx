"use client";

import { ExportReportButton } from "./ExportReportButton";

type Props = {
  title: string;
  rfiId: number;
};

export function RFIHeader({ title, rfiId }: Props) {
  return (
    <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-3 mb-4">
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-500">RFI</p>
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{title}</h1>
      </div>
      <ExportReportButton rfiId={rfiId} />
    </div>
  );
}
