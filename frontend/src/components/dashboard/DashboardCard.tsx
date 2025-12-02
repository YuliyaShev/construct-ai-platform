"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/helpers";
import { LucideIcon } from "lucide-react";

type Props = {
  title: string;
  value: string | number;
  icon: LucideIcon;
  tone?: "default" | "success" | "warning" | "danger";
};

const toneStyles: Record<NonNullable<Props["tone"]>, string> = {
  default: "bg-slate-100 text-slate-700 dark:bg-zinc-800/70 dark:text-slate-100",
  success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200",
  warning: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200",
  danger: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-200",
};

export function DashboardCard({ title, value, icon: Icon, tone = "default" }: Props) {
  return (
    <Card className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/60 px-4 py-3 shadow-sm">
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-wide text-slate-500">{title}</p>
        <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{value}</p>
      </div>
      <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center", toneStyles[tone])}>
        <Icon className="h-5 w-5" />
      </div>
    </Card>
  );
}
