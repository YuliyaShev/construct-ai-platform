"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";
import type { CommandItem } from "./hooks/useCommandBar";
import { cn } from "@/lib/helpers";

type Props = {
  item: CommandItem & { highlighted?: string };
  active: boolean;
  onClick: () => void;
};

export function CommandBarItem({ item, active, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full flex items-center justify-between px-3 py-2 rounded-md text-left text-sm transition",
        active ? "bg-brand-50 border border-brand-200 text-brand-900" : "hover:bg-slate-50"
      )}
    >
      <span
        className="text-sm text-slate-800"
        dangerouslySetInnerHTML={{ __html: item.highlighted || item.label }}
      />
      <ArrowUpRight className="h-4 w-4 text-slate-400" />
    </button>
  );
}
