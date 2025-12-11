"use client";

import * as React from "react";
import { cn } from "@/lib/helpers";

const ScrollArea = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { orientation?: "horizontal" | "vertical" }
>(({ className, children, orientation = "vertical", ...props }, ref) => {
  const overflow =
    orientation === "horizontal"
      ? "overflow-x-auto overflow-y-hidden"
      : "overflow-y-auto overflow-x-hidden";
  return (
    <div ref={ref} className={cn("relative", overflow, className)} {...props}>
      {children}
    </div>
  );
});
ScrollArea.displayName = "ScrollArea";

const ScrollBar = ({
  orientation = "vertical",
  className
}: {
  orientation?: "horizontal" | "vertical";
  className?: string;
}) => {
  const size = orientation === "horizontal" ? "h-2" : "w-2";
  return (
    <div
      className={cn(
        "pointer-events-none select-none rounded-full bg-slate-200/70",
        size,
        orientation === "horizontal" ? "w-full mt-1" : "h-full ml-1",
        className
      )}
    />
  );
};

export { ScrollArea, ScrollBar };
