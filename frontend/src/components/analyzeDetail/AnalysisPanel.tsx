"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/analyzeDetail/accordion";
import { SummaryCard } from "@/components/analyzeDetail/SummaryCard";
import { IssueItem } from "@/components/analyzeDetail/IssueItem";
import { LoadingSkeleton } from "@/components/analyzeDetail/LoadingSkeleton";
import { EmptyState } from "@/components/analyze/EmptyState";
import { type FileRecord } from "@/components/analyze/types";

type Props = {
  file: FileRecord | null;
  analysisText: string;
  issues?: { title: string; description?: string; severity: "error" | "warning" | "info" }[];
  loading: boolean;
};

export function AnalysisPanel({ file, analysisText, issues = [], loading }: Props) {
  return (
    <Card className="bg-gradient-to-b from-white/80 to-slate-50 dark:from-zinc-950 dark:to-black border-slate-200 dark:border-zinc-800 shadow-md rounded-2xl">
      <CardHeader className="border-b border-slate-100 dark:border-zinc-800">
        <CardTitle className="flex items-center justify-between">
          <span>AI Analysis Results</span>
          {file && <span className="text-xs text-slate-500">{file.original_name}</span>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading && <LoadingSkeleton />}
        {!loading && !file && <EmptyState title="No file selected" description="Select a file to view analysis output." />}

        {!loading && file && (
          <div className="space-y-4">
            <SummaryCard summary={analysisText || "Generated from MVP"} />

            <Accordion type="single" collapsible defaultValue="issues" className="rounded-xl border border-slate-200 dark:border-zinc-800">
              <AccordionItem value="issues" className="border-b border-slate-200 dark:border-zinc-800">
                <AccordionTrigger className="px-4">Detected Issues</AccordionTrigger>
                <AccordionContent className="space-y-3 px-4 pb-4">
                  {issues.length === 0 && <div className="text-sm text-slate-500">No issues detected.</div>}
                  {issues.map((issue, idx) => (
                    <IssueItem key={idx} title={issue.title} description={issue.description} severity={issue.severity} />
                  ))}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="materials" className="border-b border-slate-200 dark:border-zinc-800">
                <AccordionTrigger className="px-4">Materials</AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-sm text-slate-600 dark:text-slate-300">
                  (Coming soon) Material insights will appear here.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="dimensions" className="border-b border-slate-200 dark:border-zinc-800">
                <AccordionTrigger className="px-4">Dimensions</AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-sm text-slate-600 dark:text-slate-300">
                  (Coming soon) Dimension checks and conflicts.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="notes">
                <AccordionTrigger className="px-4">Notes</AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-sm text-slate-600 dark:text-slate-300">
                  (Coming soon) Additional AI notes.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
