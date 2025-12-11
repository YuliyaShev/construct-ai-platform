"use client";

type RiskPoint = { id: string; D_C_ratio: number; risk: string; location?: { x: number; y: number } };

export function RiskHeatmapOverlay({ points }: { points: RiskPoint[] }) {
  const width = 800;
  const height = 500;
  const color = (r: string) => (r === "high" ? "rgba(255,0,0,0.4)" : r === "medium" ? "rgba(255,165,0,0.4)" : "rgba(0,200,0,0.3)");
  return (
    <svg width={width} height={height} className="w-full h-full border border-slate-200 dark:border-zinc-800 rounded-lg">
      {points.map((p) => (
        <circle
          key={p.id}
          cx={p.location?.x || Math.random() * width}
          cy={p.location?.y || Math.random() * height}
          r={8}
          fill={color(p.risk)}
          stroke="#0f172a"
          strokeWidth={0.5}
        >
          <title>
            {p.id} D/C {p.D_C_ratio}
          </title>
        </circle>
      ))}
    </svg>
  );
}
