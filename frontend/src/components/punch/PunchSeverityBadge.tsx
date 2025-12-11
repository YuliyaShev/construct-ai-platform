"use client";

const colorMap: Record<string, string> = {
  Critical: "bg-red-600 text-white",
  High: "bg-red-500/15 text-red-700 border border-red-200",
  Medium: "bg-amber-500/15 text-amber-700 border border-amber-200",
  Low: "bg-sky-500/15 text-sky-700 border border-sky-200",
};

export function PunchSeverityBadge({ level }: { level?: string }) {
  const cls = colorMap[level || ""] || "bg-slate-200 text-slate-700";
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${cls}`}>{level || "?"}</span>;
}
