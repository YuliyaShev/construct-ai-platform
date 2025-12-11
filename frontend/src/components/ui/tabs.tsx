"use client";

import * as React from "react";
import { cn } from "@/lib/helpers";

type TabsContextValue = {
  active: string | undefined;
  setActive: (v: string) => void;
};

const TabsContext = React.createContext<TabsContextValue | null>(null);

type TabsProps = {
  defaultValue?: string;
  value?: string;
  onValueChange?: (val: string) => void;
  tabs?: { id: string; label: React.ReactNode; content: React.ReactNode }[];
  children?: React.ReactNode;
  className?: string;
};

export function Tabs({ defaultValue, value: controlledValue, onValueChange, tabs, children, className }: TabsProps) {
  const initialActive = defaultValue ?? controlledValue ?? tabs?.[0]?.id;
  const [uncontrolled, setUncontrolled] = React.useState<string | undefined>(initialActive);

  const active = controlledValue ?? uncontrolled;
  const setActive = React.useCallback(
    (next: string) => {
      if (controlledValue === undefined) setUncontrolled(next);
      onValueChange?.(next);
    },
    [controlledValue, onValueChange]
  );

  const value = React.useMemo(() => ({ active, setActive }), [active, setActive]);
  return (
    <TabsContext.Provider value={value}>
      <div className={className}>
        {tabs ? (
          <>
            <TabsList>
              {tabs.map((tab) => (
                <TabsTrigger key={tab.id} value={tab.id}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {tabs.map((tab) => (
              <TabsContent key={tab.id} value={tab.id}>
                {tab.content}
              </TabsContent>
            ))}
          </>
        ) : (
          children
        )}
      </div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex gap-2 border-b border-slate-200 mb-4", className)}>{children}</div>;
}

export function TabsTrigger({
  children,
  value,
  className
}: {
  children: React.ReactNode;
  value: string;
  className?: string;
}) {
  const ctx = React.useContext(TabsContext);
  if (!ctx) return null;
  const isActive = ctx.active === value || (!ctx.active && value);
  return (
    <button
      onClick={() => ctx.setActive(value)}
      className={cn(
        "px-3 py-2 text-sm font-medium rounded-t-md transition",
        isActive ? "text-brand-700 border-b-2 border-brand-600" : "text-slate-500 hover:text-slate-700",
        className
      )}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children }: { value: string; children: React.ReactNode }) {
  const ctx = React.useContext(TabsContext);
  if (!ctx) return null;
  if (ctx.active !== value && !(ctx.active === undefined && value === "")) return null;
  return <div className="mt-2">{children}</div>;
}
