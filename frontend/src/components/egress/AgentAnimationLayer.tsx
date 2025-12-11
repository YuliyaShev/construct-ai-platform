"use client";

type Agent = { id: string; position: [number, number]; state: string };

export function AgentAnimationLayer({ agents = [] }: { agents?: Agent[] }) {
  return (
    <div className="relative w-full h-full">
      <svg className="absolute inset-0 w-full h-full">
        {agents.map((a) => (
          <circle
            key={a.id}
            cx={a.position?.[0] || 0}
            cy={a.position?.[1] || 0}
            r={3}
            fill={a.state === "exited" ? "#16a34a" : "#f97316"}
          />
        ))}
      </svg>
    </div>
  );
}
