"use client";

import React from "react";

type Props = {
  title: string;
  children: React.ReactNode;
};

export function CommandBarSection({ title, children }: Props) {
  return (
    <div className="space-y-2">
      <div className="text-[11px] uppercase tracking-wide text-slate-500 px-1">{title}</div>
      {children}
    </div>
  );
}
