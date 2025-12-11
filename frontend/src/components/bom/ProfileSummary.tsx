"use client";

type Totals = Record<string, { count: number; total_length_mm: number }>;

export function ProfileSummary({ totals, unit }: { totals: Totals; unit: "imperial" | "metric" }) {
  const entries = Object.entries(totals || {});
  return (
    <div className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/60 p-4 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">Profile Totals</p>
      {entries.length === 0 && <div className="text-sm text-slate-500">No totals.</div>}
      <div className="space-y-2">
        {entries.map(([profile, data]) => (
          <div key={profile} className="flex items-center justify-between text-sm">
            <span className="font-semibold text-slate-900 dark:text-slate-100">{profile}</span>
            <span className="text-slate-700 dark:text-slate-200">
              {data.count} pcs · {unit === "metric" ? `${(data.total_length_mm / 1000).toFixed(2)} m` : `${(data.total_length_mm / 25.4 / 12).toFixed(2)} ft`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
