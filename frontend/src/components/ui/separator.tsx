import * as React from "react";
import { cn } from "@/lib/helpers";

interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
}

export function Separator({ className, orientation = "horizontal", ...props }: SeparatorProps) {
  return (
    <div
      role="separator"
      className={cn(
        "bg-slate-200 dark:bg-zinc-800",
        orientation === "vertical" ? "h-full w-px" : "h-px w-full",
        className
      )}
      {...props}
    />
  );
}
