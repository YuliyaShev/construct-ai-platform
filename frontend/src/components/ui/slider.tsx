"use client";

import * as React from "react";

type SliderProps = {
  defaultValue?: number[];
  value?: number[];
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  onValueChange?: (value: number[]) => void;
};

export function Slider({ defaultValue, value, min = 0, max = 100, step = 1, className = "", onValueChange }: SliderProps) {
  const [internal, setInternal] = React.useState(defaultValue?.[0] ?? min);
  const current = value?.[0] ?? internal;

  const handleChange = (next: number) => {
    if (value === undefined) setInternal(next);
    if (onValueChange) onValueChange([next]);
  };

  React.useEffect(() => {
    if (value && value[0] !== internal) {
      setInternal(value[0]);
    }
  }, [value, internal]);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={current}
        onChange={(e) => handleChange(Number(e.target.value))}
        className="w-full h-2 rounded-lg bg-slate-200 dark:bg-slate-800 accent-slate-700"
      />
      <span className="text-xs text-slate-600 dark:text-slate-300 w-10 text-right">{current}</span>
    </div>
  );
}
