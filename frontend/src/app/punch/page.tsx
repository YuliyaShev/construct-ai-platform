"use client";

import { useEffect, useMemo, useState } from "react";
import { PunchListTable } from "@/components/punch/PunchListTable";
import { PunchDetailSidebar } from "@/components/punch/PunchDetailSidebar";
import { PunchActionsPanel } from "@/components/punch/PunchActionsPanel";
import { PunchReportDownload } from "@/components/punch/PunchReportDownload";
import { PunchSeverityBadge } from "@/components/punch/PunchSeverityBadge";

type PunchResult = {
  punch_list: any[];
  summary: any;
  pdf_report?: string | null;
};

export default function PunchPage() {
  const [data, setData] = useState<PunchResult | null>(null);
  const [selected, setSelected] = useState<any | null>(null);
  const [tradeFilter, setTradeFilter] = useState<string>("all");
  const [severityFilter, setSeverityFilter] = useState<string>("all");

  const fetchData = async () => {
    const res = await fetch("/api/analysis/punch", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ photos: [] }) });
    const json = await res.json();
    setData(json);
    setSelected(json?.punch_list?.[0] || null);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    return (data?.punch_list || []).filter((i) => {
        const tradeMatch = tradeFilter === "all" || i.trade === tradeFilter;
        const sevMatch = severityFilter === "all" || i.severity === severityFilter;
        return tradeMatch && sevMatch;
    });
  }, [data, tradeFilter, severityFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">AI QA/QC Punch List Generator</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">Detect defects from photos, BIM, and drawings; generate punch list with fixes and priorities.</p>
        </div>
        <PunchReportDownload url={data?.pdf_report} />
      </div>

      <div className="flex gap-2 text-sm">
        <select value={tradeFilter} onChange={(e) => setTradeFilter(e.target.value)} className="rounded border border-slate-200 dark:border-zinc-800 px-2 py-1">
          <option value="all">All Trades</option>
          {(data?.summary?.trades || []).map((t: string) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <select value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)} className="rounded border border-slate-200 dark:border-zinc-800 px-2 py-1">
          <option value="all">All Severity</option>
          {["Critical", "High", "Medium", "Low"].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-2">
          <PunchListTable items={filtered} onSelect={(i) => setSelected(i)} />
        </div>
        <div className="space-y-3">
          <PunchDetailSidebar item={selected} />
          <PunchActionsPanel />
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-sm text-sm space-y-2">
        <div className="font-semibold text-slate-900 dark:text-white">Summary</div>
        <div>Total: {data?.summary?.total ?? 0}</div>
        <div>High: {data?.summary?.high ?? 0}</div>
        <div>Medium: {data?.summary?.medium ?? 0}</div>
        <div>Low: {data?.summary?.low ?? 0}</div>
        <div className="flex gap-2 items-center">
          <span>Critical:</span>
          <PunchSeverityBadge level="Critical" />
        </div>
      </div>
    </div>
  );
}
