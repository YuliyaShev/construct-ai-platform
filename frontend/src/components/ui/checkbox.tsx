"use client";

import * as React from "react";

type CheckboxProps = {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
};

export function Checkbox({ checked, defaultChecked, onCheckedChange, className = "" }: CheckboxProps) {
  const [internal, setInternal] = React.useState(defaultChecked ?? false);
  const isChecked = checked ?? internal;

  const toggle = () => {
    const next = !isChecked;
    if (checked === undefined) setInternal(next);
    if (onCheckedChange) onCheckedChange(next);
  };

  return (
    <input
      type="checkbox"
      checked={isChecked}
      onChange={toggle}
      className={`h-4 w-4 rounded border border-slate-300 text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 ${className}`}
    />
  );
}
