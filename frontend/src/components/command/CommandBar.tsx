"use client";

import React, { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CommandBarInput } from "./CommandBarInput";
import { CommandBarList } from "./CommandBarList";
import { useCommandBar } from "./hooks/useCommandBar";
import { cn } from "@/lib/helpers";

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

const panelVariants = {
  hidden: { opacity: 0, scale: 0.98, y: 10 },
  visible: { opacity: 1, scale: 1, y: 0 }
};

export function CommandBar() {
  const { isOpen, close, query, setQuery, grouped, results, loading, activeIndex, setActiveIndex, runCommand } =
    useCommandBar();
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center pt-20"
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.div
            className="absolute inset-0 bg-black/30 backdrop-blur-lg"
            variants={backdropVariants}
            transition={{ duration: 0.18 }}
            onClick={close}
          />

          <motion.div
            className={cn(
              "relative w-full max-w-2xl mx-auto bg-white border border-slate-200 shadow-2xl rounded-2xl p-4 space-y-3",
              "overflow-hidden"
            )}
            variants={panelVariants}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <CommandBarInput
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setActiveIndex((i) => Math.min(i + 1, Math.max(results.length - 1, 0)));
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setActiveIndex((i) => Math.max(i - 1, 0));
                } else if (e.key === "Enter") {
                  e.preventDefault();
                  const item = results[activeIndex];
                  if (item) runCommand(item);
                } else if (e.key === "Escape") {
                  e.preventDefault();
                  close();
                }
              }}
            />

            <CommandBarList grouped={grouped} activeIndex={activeIndex} flatResults={results} onSelect={runCommand} />

            <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
              <div className="flex items-center gap-2">
                <kbd className="px-1.5 py-0.5 rounded border bg-slate-50">↑↓</kbd>
                to navigate
                <kbd className="px-1.5 py-0.5 rounded border bg-slate-50">Enter</kbd>
                to run
              </div>
              <div>{loading ? "Searching…" : `${results.length} results`}</div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
