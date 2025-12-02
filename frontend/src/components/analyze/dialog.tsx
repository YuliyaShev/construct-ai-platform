"use client";

import * as React from "react";
import { cn } from "@/lib/helpers";

type DialogProps = {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
};

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  if (!open) return null;
  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50" onClick={() => onOpenChange?.(false)}>
      {children}
    </div>
  );
}

export function DialogOverlay({ className }: { className?: string }) {
  return <div className={cn("fixed inset-0 z-40 bg-black/70", className)} />;
}

export function DialogContent({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 mx-auto my-10 max-h-[90vh] overflow-auto rounded-2xl bg-white p-6 shadow-2xl",
        className
      )}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  );
}
