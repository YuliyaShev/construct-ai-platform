"use client";

type Room = {
  id: string;
  name: string;
  vertices: number[][];
  gap_detected?: boolean;
};

type Props = {
  rooms: Room[];
  width?: number;
  height?: number;
};

export function RoomOverlay({ rooms, width = 800, height = 600 }: Props) {
  const colors = ["rgba(59,130,246,0.18)", "rgba(16,185,129,0.18)", "rgba(249,115,22,0.18)", "rgba(168,85,247,0.18)"];
  return (
    <svg width={width} height={height} className="w-full h-full border border-slate-200 dark:border-zinc-800 rounded-lg">
      {rooms.map((room, idx) => {
        const points = room.vertices?.map((p) => p.join(",")).join(" ");
        return (
          <g key={room.id}>
            <polygon points={points} fill={colors[idx % colors.length]} stroke="#0f172a" strokeWidth={1} />
            {room.gap_detected ? (
              <text x={room.vertices?.[0]?.[0] || 10} y={room.vertices?.[0]?.[1] || 20} fontSize={10} fill="red">
                Gap?
              </text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}
