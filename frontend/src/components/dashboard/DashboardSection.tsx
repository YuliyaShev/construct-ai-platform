"use client";

import { Card } from "@/components/ui/card";

type Props = {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
};

export function DashboardSection({ title, children, actions }: Props) {
  return (
    <Card className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/60 shadow-sm">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/80 dark:border-zinc-800/60">
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</p>
        </div>
        {actions}
      </div>
      <div className="p-5">{children}</div>
    </Card>
  );
}
