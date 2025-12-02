"use client";

import { cn } from "@/lib/helpers";

export function ScrollArea({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("overflow-y-auto custom-scrollbar", className)}>{children}</div>
  );
}
