"use client";

import { Checkbox } from "@/components/ui/checkbox";

const TYPES = ["falls", "electrical", "crane", "excavation", "PPE", "fire", "structural"];

export function SafetyFilterPanel({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const toggle = (t: string) => {
    if (value.includes(t)) onChange(value.filter((v) => v !== t));
    else onChange([...value, t]);
  };
  return (
    <div className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-sm space-y-2 text-sm">
      <div className="font-semibold text-slate-900 dark:text-white">Filter Hazards</div>
      {TYPES.map((t) => (
        <label key={t} className="flex items-center gap-2">
          <Checkbox checked={value.includes(t)} onCheckedChange={() => toggle(t)} />
          <span className="capitalize">{t}</span>
        </label>
      ))}
    </div>
  );
}
