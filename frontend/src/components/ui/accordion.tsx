"use client";

import * as React from "react";
import { cn } from "@/lib/helpers";
import { ChevronDown } from "lucide-react";

type Item = { id: string; trigger: React.ReactNode; content: React.ReactNode };

export function Accordion({ items }: { items: Item[] }) {
  const [open, setOpen] = React.useState<string | null>(null);
  return (
    <div className="space-y-2">
      {items.map((item) => {
        const isOpen = open === item.id;
        return (
          <div key={item.id} className="border border-slate-200 rounded-lg bg-white">
            <button
              className="w-full flex items-center justify-between px-4 py-3 text-left"
              onClick={() => setOpen(isOpen ? null : item.id)}
            >
              <div className="font-medium text-slate-800">{item.trigger}</div>
              <ChevronDown className={cn("h-4 w-4 transition", isOpen && "rotate-180")} />
            </button>
            {isOpen && <div className="px-4 pb-4 text-sm text-slate-700">{item.content}</div>}
          </div>
        );
      })}
    </div>
  );
}
