"use client";

import { Badge } from "@/components/analyze/Primitives";
import { cn } from "@/lib/helpers";

type Props = {
  severity: "error" | "warning" | "info";
};

const colors = {
  error: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-200",
  warning: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200",
  info: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200"
};

export function SeverityBadge({ severity }: Props) {
  return <Badge className={cn(colors[severity])}>{severity}</Badge>;
}
