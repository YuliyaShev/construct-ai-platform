"use client";

import * as React from "react";
import { cn } from "@/lib/helpers";

type TabsProps = {
  tabs: { id: string; label: string; content: React.ReactNode }[];
  defaultTab?: string;
};

export function Tabs({ tabs, defaultTab }: TabsProps) {
  const [active, setActive] = React.useState(defaultTab ?? tabs[0]?.id);
  return (
    <div>
      <div className="flex gap-2 border-b border-slate-200 mb-4">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={cn(
              "px-3 py-2 text-sm font-medium rounded-t-md",
              active === t.id ? "text-brand-700 border-b-2 border-brand-600" : "text-slate-500 hover:text-slate-700"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div>{tabs.find((t) => t.id === active)?.content}</div>
    </div>
  );
}
