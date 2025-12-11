"use client";

type Element = {
  id: string;
  type: string;
  coords?: number[][];
};

type Issue = {
  severity: string;
  message: string;
};

type Props = {
  beams?: Element[];
  columns?: Element[];
  issues?: Issue[];
  width?: number;
  height?: number;
};

export function LoadPathOverlay({ beams = [], columns = [], issues = [], width = 800, height = 600 }: Props) {
  return (
    <svg width={width} height={height} className="w-full h-full border border-slate-200 dark:border-zinc-800 rounded-lg">
      {beams.map((b) =>
        b.coords ? (
          <line
            key={b.id}
            x1={b.coords[0][0]}
            y1={b.coords[0][1]}
            x2={b.coords[1][0]}
            y2={b.coords[1][1]}
            stroke="#3b82f6"
            strokeWidth={3}
            strokeLinecap="round"
          />
        ) : null
      )}
      {columns.map((c) =>
        c.coords ? (
          <circle key={c.id} cx={c.coords[0][0]} cy={c.coords[0][1]} r={6} fill="#ef4444" stroke="#0f172a" strokeWidth={1} />
        ) : null
      )}
      {issues.map((iss, idx) => (
        <text key={idx} x={12} y={20 + idx * 16} fontSize={11} fill="#ca8a04">
          ⚠ {iss.message}
        </text>
      ))}
    </svg>
  );
}
