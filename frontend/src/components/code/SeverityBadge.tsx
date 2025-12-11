"use client";

const colors: Record<string, string> = {
  critical: "bg-red-600 text-white",
  high: "bg-red-500/15 text-red-600 border border-red-200",
  medium: "bg-amber-500/15 text-amber-600 border border-amber-200",
  low: "bg-sky-500/15 text-sky-600 border border-sky-200",
};

export function SeverityBadge({ severity }: { severity?: string }) {
  const cls = colors[severity || ""] || "bg-slate-200 text-slate-700";
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${cls}`}>
      {severity || "unknown"}
    </span>
  );
}
