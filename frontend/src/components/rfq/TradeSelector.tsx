"use client";

import { Checkbox } from "@/components/ui/checkbox";

const TRADE_OPTIONS = ["Concrete", "Steel", "Glazing", "Roofing"];

export function TradeSelector({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const toggle = (trade: string) => {
    if (value.includes(trade)) onChange(value.filter((t) => t !== trade));
    else onChange([...value, trade]);
  };
  return (
    <div className="space-y-2">
      <div className="text-sm font-semibold text-slate-900 dark:text-white">Select Trades</div>
      {TRADE_OPTIONS.map((t) => (
        <label key={t} className="flex items-center gap-2 text-sm">
          <Checkbox checked={value.includes(t)} onCheckedChange={() => toggle(t)} />
          {t}
        </label>
      ))}
    </div>
  );
}
