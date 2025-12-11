"use client";

type Node = { id: string; center: [number, number]; exit?: boolean };

export function EgressFloorplanViewer({ nodes = [] }: { nodes?: Node[] }) {
  const width = 800;
  const height = 600;
  return (
    <svg width={width} height={height} className="w-full h-full border border-slate-200 dark:border-zinc-800 rounded-lg">
      {nodes.map((n) => (
        <circle
          key={n.id}
          cx={n.center[0]}
          cy={n.center[1]}
          r={6}
          fill={n.exit ? "#16a34a" : "#0ea5e9"}
          stroke="#0f172a"
          strokeWidth={1}
        />
      ))}
    </svg>
  );
}
