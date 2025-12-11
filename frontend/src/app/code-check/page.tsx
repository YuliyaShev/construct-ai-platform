"use client";

import { useState } from "react";
import { CodeCheckUploader } from "@/components/code/CodeCheckUploader";
import { CodeIssueTable } from "@/components/code/CodeIssueTable";
import { CodeIssueCard } from "@/components/code/CodeIssueCard";
import { CodeSummaryPanel } from "@/components/code/CodeSummaryPanel";
import { DownloadCodeReportButton } from "@/components/code/DownloadCodeReportButton";

type Issue = {
  id: string;
  title: string;
  severity: string;
  code_reference?: string;
  expected?: string;
  actual?: string;
  recommendation?: string;
  description?: string;
};

type CodeResult = {
  issues: Issue[];
  summary?: Record<string, number>;
  pdf_report?: string | null;
};

export default function CodeCheckPage() {
  const [data, setData] = useState<CodeResult>({ issues: [] });
  const critical = data.issues.filter((i) => i.severity === "critical" || i.severity === "high");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">AI Code Compliance Checker</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Automated IBC / NBC / NFPA / ADA checks for egress, fire rating, accessibility, and structural alignment.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CodeCheckUploader onResult={(res) => setData(res)} />
          <DownloadCodeReportButton url={data.pdf_report} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <CodeSummaryPanel summary={data.summary} />
        <div className="lg:col-span-2">
          <CodeIssueTable issues={data.issues || []} />
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Highlighted Issues</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {critical.slice(0, 6).map((iss) => (
            <CodeIssueCard key={iss.id} issue={iss} />
          ))}
        </div>
      </div>
    </div>
  );
}
