"use client";

import React, { forwardRef } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/helpers";

type Props = React.InputHTMLAttributes<HTMLInputElement>;

export const CommandBarInput = forwardRef<HTMLInputElement, Props>(({ className, ...props }, ref) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
      <input
        ref={ref}
        className={cn(
          "w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-500",
          className
        )}
        placeholder="Search files, actions, issues..."
        {...props}
      />
    </div>
  );
});
CommandBarInput.displayName = "CommandBarInput";
