"use client";

import * as React from "react";

type SelectContextValue = {
  value: string;
  setValue: (val: string) => void;
  items: { value: string; label: React.ReactNode }[];
  registerItem: (item: { value: string; label: React.ReactNode }) => void;
  placeholder?: string;
  setPlaceholder: (text?: string) => void;
};

const SelectContext = React.createContext<SelectContextValue | null>(null);

function useSelectContext() {
  const ctx = React.useContext<SelectContextValue | null>(SelectContext);
  if (!ctx) throw new Error("Select components must be used within <Select>");
  return ctx;
}

type SelectProps = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (val: string) => void;
  children: React.ReactNode;
};

export function Select({ value, defaultValue, onValueChange, children }: SelectProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? "");
  const [items, setItems] = React.useState<{ value: string; label: React.ReactNode }[]>([]);
  const [placeholder, setPlaceholder] = React.useState<string | undefined>();

  const currentValue = value ?? internalValue;
  const setValue = React.useCallback(
    (val: string) => {
      if (onValueChange) onValueChange(val);
      if (value === undefined) setInternalValue(val);
    },
    [onValueChange, value]
  );

  const registerItem = React.useCallback((item: { value: string; label: React.ReactNode }) => {
    setItems((prev) => {
      if (prev.find((i) => i.value === item.value)) return prev;
      return [...prev, item];
    });
  }, []);

  return (
    <SelectContext.Provider value={{ value: currentValue, setValue, items, registerItem, placeholder, setPlaceholder }}>
      <div className="inline-block">{children}</div>
    </SelectContext.Provider>
  );
}

type SelectTriggerProps = React.HTMLAttributes<HTMLSelectElement>;

export function SelectTrigger({ className = "", ...props }: SelectTriggerProps) {
  const { items, value, setValue, placeholder } = useSelectContext();

  return (
    <select
      className={`border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 ${className}`}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      {...props}
    >
      {placeholder ? (
        <option value="" disabled={!!value} hidden={!!value}>
          {placeholder}
        </option>
      ) : null}
      {items.map((item) => (
        <option key={item.value} value={item.value}>
          {item.label}
        </option>
      ))}
    </select>
  );
}

type SelectValueProps = {
  placeholder?: string;
};

export function SelectValue({ placeholder }: SelectValueProps) {
  const { setPlaceholder } = useSelectContext();
  React.useEffect(() => {
    setPlaceholder(placeholder);
  }, [placeholder, setPlaceholder]);
  return null;
}

type SelectContentProps = {
  children: React.ReactNode;
};

export function SelectContent({ children }: SelectContentProps) {
  return <div className="hidden">{children}</div>;
}

type SelectItemProps = {
  value: string;
  children: React.ReactNode;
};

export function SelectItem({ value, children }: SelectItemProps) {
  const { registerItem } = useSelectContext();
  React.useEffect(() => {
    registerItem({ value, label: children });
  }, [value, children, registerItem]);
  return null;
}
