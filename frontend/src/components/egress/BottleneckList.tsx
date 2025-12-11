"use client";

export function BottleneckList({ items = [] as string[] }) {
  if (!items.length) return <div className="text-sm text-slate-500">No bottlenecks detected.</div>;
  return (
    <div className="space-y-1 text-sm">
      {items.map((b, idx) => (
        <div key={idx} className="rounded-lg border border-amber-200 bg-amber-50 text-amber-800 px-3 py-2">
          {b}
        </div>
      ))}
    </div>
  );
}
