"use client";

import { Slider } from "@/components/ui/slider";

export function EscalationSlider({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="space-y-1">
      <div className="text-sm text-slate-700 dark:text-slate-200">Escalation Years: {value.toFixed(1)}</div>
      <Slider
        defaultValue={[value]}
        min={0}
        max={5}
        step={0.5}
        onValueChange={(v) => onChange(v[0])}
        className="w-60"
      />
    </div>
  );
}
