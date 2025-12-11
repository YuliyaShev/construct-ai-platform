"use client";

type Point = { time: number; exited: number };

export function TimelineChart({ data = [] as Point[] }) {
  const maxTime = Math.max(...data.map((d) => d.time), 1);
  const maxExited = Math.max(...data.map((d) => d.exited), 1);
  return (
    <svg className="w-full h-48 border border-slate-200 dark:border-zinc-800 rounded-lg">
      {data.map((d, idx) => {
        const x = (d.time / maxTime) * 100 + "%";
        const y = (1 - d.exited / maxExited) * 100 + "%";
        const next = data[idx + 1];
        if (next) {
          const x2 = (next.time / maxTime) * 100 + "%";
          const y2 = (1 - next.exited / maxExited) * 100 + "%";
          return <line key={idx} x1={x} y1={y} x2={x2} y2={y2} stroke="#0ea5e9" strokeWidth={2} />;
        }
        return null;
      })}
    </svg>
  );
}
