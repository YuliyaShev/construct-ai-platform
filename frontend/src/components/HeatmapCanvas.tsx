"use client";

import { useMemo } from "react";
import { cn } from "@/lib/helpers";

type Point = { x: number; y: number; severity: string; color?: string; message?: string };

const severityColors: Record<string, string> = {
  high: "#ff4d4f",
  medium: "#faad14",
  low: "#52c41a",
};

type Props = {
  points: Point[];
  pdfWidth: number;
  pdfHeight: number;
  scale: number;
};

export function HeatmapCanvas({ points, pdfWidth, pdfHeight, scale }: Props) {
  const circles = useMemo(() => {
    return points.map((p, idx) => {
      const color = p.color || severityColors[p.severity] || severityColors.low;
      const radius = 20 * scale;
      const x = p.x * pdfWidth * scale;
      const y = (1 - p.y) * pdfHeight * scale; // flip Y for screen
      return (
        <div
          key={idx}
          className="absolute rounded-full opacity-70"
          title={p.message || p.severity}
          style={{
            width: radius * 2,
            height: radius * 2,
            left: x - radius,
            top: y - radius,
            background: color,
            boxShadow: `0 0 20px ${color}`,
          }}
        />
      );
    });
  }, [points, pdfWidth, pdfHeight, scale]);

  return <div className={cn("absolute inset-0 pointer-events-none", scale === 0 ? "hidden" : "block")}>{circles}</div>;
}
