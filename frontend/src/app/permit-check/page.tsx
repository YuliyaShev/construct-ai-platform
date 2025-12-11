"use client";

import { useState } from "react";
import { PermitUploader } from "@/components/permit/PermitUploader";
import { PermitIssueTable } from "@/components/permit/PermitIssueTable";
import { PermitIssueCard } from "@/components/permit/PermitIssueCard";
import { PermitSummaryPanel } from "@/components/permit/PermitSummaryPanel";
import { DownloadCodeReportButton } from "@/components/code/DownloadCodeReportButton";

type Issue = {
  id: string;
  title: string;
  severity: string;
  code_reference?: string;
  description?: string;
  recommendation?: string;
};

type PermitResult = {
  issues: Issue[];
  summary?: Record<string, number>;
  pdf_report?: string | null;
};

export default function PermitCheckPage() {
  const [data, setData] = useState<PermitResult>({ issues: [] });
  const critical = data.issues.filter((i) => i.severity === "high" || i.severity === "critical");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">AI Permit Drawing Validator</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Simulates permit intake review: completeness, required notes, zoning, life-safety, and cross-discipline checks.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <PermitUploader onResult={(res) => setData(res)} />
          <DownloadCodeReportButton url={data.pdf_report} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <PermitSummaryPanel summary={data.summary} />
        <div className="lg:col-span-2">
          <PermitIssueTable issues={data.issues || []} />
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Highlighted Issues</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {critical.slice(0, 6).map((iss) => (
            <PermitIssueCard key={iss.id} issue={iss} />
          ))}
        </div>
      </div>
    </div>
  );
}
