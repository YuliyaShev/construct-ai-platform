"use client";

import { cn } from "@/lib/helpers";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-md bg-slate-200 dark:bg-zinc-800", className)} />;
}

export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-slate-100 dark:bg-zinc-800 px-2.5 py-0.5 text-[11px] font-medium text-slate-700 dark:text-slate-200",
        className
      )}
    >
      {children}
    </span>
  );
}
