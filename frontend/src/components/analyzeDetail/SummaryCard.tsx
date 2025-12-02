"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  summary: string;
};

export function SummaryCard({ summary }: Props) {
  return (
    <Card className="bg-gradient-to-br from-purple-100/80 via-white to-slate-50 dark:from-purple-950/30 dark:via-zinc-900 dark:to-black border-slate-200 dark:border-zinc-800 shadow-sm">
      <CardHeader>
        <CardTitle className="text-sm text-slate-800 dark:text-slate-200">AI Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{summary}</p>
      </CardContent>
    </Card>
  );
}
