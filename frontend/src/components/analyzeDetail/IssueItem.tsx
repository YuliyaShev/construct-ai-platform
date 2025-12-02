"use client";

import { Card } from "@/components/ui/card";
import { SeverityBadge } from "@/components/analyzeDetail/SeverityBadge";
import { cn } from "@/lib/helpers";
import { AlertTriangle, Info, Ban } from "lucide-react";

type Props = {
  title: string;
  description?: string;
  severity: "error" | "warning" | "info";
};

const icons = {
  error: Ban,
  warning: AlertTriangle,
  info: Info
};

export function IssueItem({ title, description, severity }: Props) {
  const Icon = icons[severity];
  const borderColor =
    severity === "error" ? "border-red-300 dark:border-red-800" : severity === "warning" ? "border-amber-300 dark:border-amber-800" : "border-blue-300 dark:border-blue-800";

  return (
    <Card
      className={cn(
        "flex items-start gap-3 rounded-xl border-l-4 p-4 transition-all duration-200 hover:shadow-sm hover:bg-slate-50 dark:hover:bg-zinc-900/60",
        borderColor
      )}
    >
      <div className="mt-0.5 rounded-md bg-slate-100 dark:bg-zinc-800 p-2">
        <Icon className="h-4 w-4 text-slate-700 dark:text-slate-200" />
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</p>
          <SeverityBadge severity={severity} />
        </div>
        {description && <p className="text-xs text-slate-600 dark:text-slate-400">{description}</p>}
      </div>
    </Card>
  );
}
