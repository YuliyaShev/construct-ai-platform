"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/helpers";

type Props = {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
};

export function SidebarAISection({ title, defaultOpen = true, children }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-slate-200/80 rounded-lg bg-white/60 backdrop-blur-sm shadow-sm">
      <button
        type="button"
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-slate-800"
        onClick={() => setOpen((v) => !v)}
      >
        <span>{title}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-slate-500 transition-transform duration-200",
            open ? "rotate-0" : "-rotate-90"
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="px-4 pb-4"
          >
            {children}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
