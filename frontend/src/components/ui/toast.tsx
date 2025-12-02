"use client";
import * as React from "react";
import { cn } from "@/lib/helpers";

type Toast = { id: number; title: string; description?: string };
const ToastContext = React.createContext<{ add: (t: Omit<Toast, "id">) => void } | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<Toast[]>([]);
  const add = (t: Omit<Toast, "id">) => {
    const id = Date.now();
    setItems((prev) => [...prev, { ...t, id }]);
    setTimeout(() => setItems((prev) => prev.filter((i) => i.id !== id)), 3500);
  };
  return (
    <ToastContext.Provider value={{ add }}>
      {children}
      <div className="fixed bottom-4 right-4 space-y-2">
        {items.map((item) => (
          <div key={item.id} className="rounded-lg bg-slate-900 text-white px-4 py-3 shadow-lg">
            <div className="font-semibold">{item.title}</div>
            {item.description && <div className="text-sm text-slate-200">{item.description}</div>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToastContext() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("ToastProvider missing");
  return ctx;
}
