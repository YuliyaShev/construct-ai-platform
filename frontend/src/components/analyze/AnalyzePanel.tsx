"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSkeleton } from "@/components/analyze/LoadingSkeleton";
import { EmptyState } from "@/components/analyze/EmptyState";
import { type FileRecord } from "@/components/analyze/types";

type Props = {
  file: FileRecord | null;
  analysis: string;
  loading: boolean;
};

export function AnalyzePanel({ file, analysis, loading }: Props) {
  return (
    <Card className="sticky top-6 h-fit bg-gradient-to-b from-white to-slate-50 dark:from-zinc-950 dark:to-black border-slate-200 dark:border-zinc-800 shadow-lg">
      <CardHeader className="flex flex-col gap-1">
        <CardTitle className="flex items-center justify-between">
          <span>Analysis Result</span>
          {file && <span className="text-xs text-slate-500">{file.original_name}</span>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading && <LoadingSkeleton />}
        {!loading && !file && <EmptyState title="Select a file" description="Choose a file on the left and run Analyze to view results." />}
        {!loading && file && (
          <div className="space-y-3">
            <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
              {analysis || "No text extracted yet."}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
