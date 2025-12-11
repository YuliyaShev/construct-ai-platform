"use client";

export function StructuralRecommendationsPanel({ recommendations }: { recommendations?: string[] }) {
  if (!recommendations?.length) return <div className="text-sm text-slate-500">No recommendations.</div>;
  return (
    <div className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-sm space-y-2 text-sm">
      <div className="font-semibold text-slate-900 dark:text-white">Recommendations</div>
      <ul className="list-disc pl-4 space-y-1">
        {recommendations.map((r, idx) => (
          <li key={idx} className="text-xs text-slate-700 dark:text-slate-200">
            {r}
          </li>
        ))}
      </ul>
    </div>
  );
}
