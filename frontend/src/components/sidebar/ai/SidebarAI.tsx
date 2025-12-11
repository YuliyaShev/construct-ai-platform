"use client";

import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Sparkles, Target, ShieldCheck } from "lucide-react";
import { SidebarAISection } from "./SidebarAISection";
import { SidebarAISkeleton } from "./SidebarAISkeleton";
import { SidebarAIError } from "./SidebarAIError";
import { useAISidebar } from "./hooks/useAISidebar";
import type { AISidebarAction, AISidebarIssue } from "./api/aiSidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/helpers";
import { useSelectionStore } from "../../sync/hooks/useSelectionStore";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  currentPage: number;
  selectedElementId?: string;
};

const panelVariants = {
  hidden: { x: 360, opacity: 0 },
  visible: { x: 0, opacity: 1 }
};

const badgeColors: Record<AISidebarIssue["severity"], string> = {
  high: "bg-red-100 text-red-700 border border-red-200",
  medium: "bg-orange-100 text-orange-700 border border-orange-200",
  low: "bg-amber-100 text-amber-700 border border-amber-200"
};

export function SidebarAI({ isOpen, onClose, currentPage, selectedElementId }: Props) {
  const storeSelected = useSelectionStore((s) => s.selectedElementId);
  const effectiveSelection = selectedElementId ?? storeSelected ?? undefined;
  const { data, loading, error, refetch } = useAISidebar({ page: currentPage, selectionId: effectiveSelection });

  const headerLabel = useMemo(() => {
    if (effectiveSelection) return `AI for Element ${effectiveSelection}`;
    return `AI for Page ${currentPage}`;
  }, [currentPage, effectiveSelection]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.aside
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={panelVariants}
          transition={{ type: "spring", stiffness: 140, damping: 18 }}
          className="fixed right-0 top-0 h-full w-[360px] max-w-full bg-white border-l border-slate-200 shadow-2xl z-40 flex flex-col"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-gradient-to-l from-slate-50 to-white sticky top-0 z-10">
            <div>
              <div className="text-xs uppercase tracking-wide text-slate-500">AI Sidebar</div>
              <div className="text-sm font-semibold text-slate-800">{headerLabel}</div>
            </div>
            <Button size="icon" variant="ghost" onClick={onClose} aria-label="Close AI sidebar">
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {loading && !data ? <SidebarAISkeleton /> : null}
            {error && !loading ? <SidebarAIError message={error} onRetry={refetch} /> : null}

            {data ? (
              <>
                <SidebarAISection title="AI Summary of Page">
                  <div className="text-sm text-slate-700 leading-relaxed">{data.summary}</div>
                </SidebarAISection>

                <SidebarAISection title="Key Issues">
                  <div className="space-y-3">
                    {data.issues?.length ? (
                      data.issues.map((issue) => (
                        <div
                          key={issue.id}
                          className="border border-slate-200 rounded-lg p-3 hover:border-slate-300 transition shadow-[0_3px_10px_rgba(15,23,42,0.04)]"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="text-sm font-semibold text-slate-800">{issue.title}</div>
                            <span className={cn("px-2 py-1 text-[11px] rounded-full", badgeColors[issue.severity])}>
                              {issue.severity.toUpperCase()}
                            </span>
                          </div>
                          {issue.description ? (
                            <p className="text-xs text-slate-600 mt-1 leading-relaxed">{issue.description}</p>
                          ) : null}
                          <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-500">
                            <ShieldCheck className="h-3.5 w-3.5" />
                            Confidence {(issue.confidence * 100).toFixed(0)}%
                          </div>
                          {issue.related_details?.length ? (
                            <div className="mt-2 text-[11px] text-slate-500 flex flex-wrap gap-1">
                              {issue.related_details.map((ref) => (
                                <span key={ref} className="bg-slate-100 text-slate-700 px-2 py-1 rounded-full">
                                  {ref}
                                </span>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-slate-500">No issues detected on this page.</div>
                    )}
                  </div>
                </SidebarAISection>

                <SidebarAISection title="Recommended Fixes">
                  <ul className="space-y-2 list-disc list-inside text-sm text-slate-700">
                    {data.recommendations?.length ? (
                      data.recommendations.map((rec, idx) => <li key={idx}>{rec}</li>)
                    ) : (
                      <li className="text-xs text-slate-500">No recommendations available.</li>
                    )}
                  </ul>
                </SidebarAISection>

                <SidebarAISection title="AI Actions">
                  <div className="grid grid-cols-1 gap-2">
                    {data.actions?.length ? (
                      data.actions.map((action) => (
                        <ActionButton key={action.type} action={action} selectionId={selectedElementId} />
                      ))
                    ) : (
                      <div className="text-xs text-slate-500">No actions available.</div>
                    )}
                  </div>
                </SidebarAISection>
              </>
            ) : null}
          </div>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}

function ActionButton({ action, selectionId }: { action: AISidebarAction; selectionId?: string }) {
  const icon = {
    rfi: <Target className="h-4 w-4" />,
    explain: <Sparkles className="h-4 w-4" />,
    code: <ShieldCheck className="h-4 w-4" />,
    similar: <Sparkles className="h-4 w-4" />
  }[action.type] || <Sparkles className="h-4 w-4" />;

  const handleClick = () => {
    // Placeholder: hook into global action dispatcher / navigation.
    if (action.endpoint) {
      window.open(action.endpoint, "_blank");
    } else {
      console.info("AI action clicked", action.type, { selectionId });
    }
  };

  return (
    <Button
      variant="secondary"
      className="w-full justify-between text-sm group"
      onClick={handleClick}
      title={action.label}
    >
      <span className="flex items-center gap-2">
        {icon}
        {action.label}
      </span>
      <Loader2 className="h-4 w-4 opacity-0 group-hover:opacity-100 transition" />
    </Button>
  );
}
