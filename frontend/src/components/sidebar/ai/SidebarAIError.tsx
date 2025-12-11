"use client";

import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  message?: string;
  onRetry?: () => void;
};

export function SidebarAIError({ message = "Something went wrong", onRetry }: Props) {
  return (
    <div className="border border-red-200 bg-red-50 text-red-700 rounded-lg p-4 flex items-start gap-3">
      <AlertTriangle className="h-5 w-5 mt-0.5" />
      <div className="space-y-2">
        <div className="text-sm font-semibold">AI panel unavailable</div>
        <div className="text-xs text-red-600/80">{message}</div>
        {onRetry ? (
          <Button size="sm" variant="outline" onClick={onRetry} className="mt-1 gap-1">
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        ) : null}
      </div>
    </div>
  );
}
