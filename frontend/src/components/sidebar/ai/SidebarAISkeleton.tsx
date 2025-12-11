"use client";

import React from "react";

export function SidebarAISkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div key={idx} className="border border-slate-200/80 rounded-lg bg-white">
          <div className="px-4 py-3 flex items-center gap-3">
            <div className="h-4 w-28 bg-slate-200 rounded" />
            <div className="h-4 w-6 bg-slate-200 rounded" />
          </div>
          <div className="px-4 pb-4 space-y-2">
            <div className="h-3 w-full bg-slate-200 rounded" />
            <div className="h-3 w-11/12 bg-slate-200 rounded" />
            <div className="h-3 w-4/5 bg-slate-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
