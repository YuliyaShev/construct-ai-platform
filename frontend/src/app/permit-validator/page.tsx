"use client";

import { useMemo, useState } from "react";
import { PermitDropzone } from "@/components/permit/PermitDropzone";
import { PermitCategoryTabs } from "@/components/permit/PermitCategoryTabs";
import { PermitIssueTable } from "@/components/permit/PermitIssueTable";
import { PermitIssueCard } from "@/components/permit/PermitIssueCard";
import { MissingSheetsPanel } from "@/components/permit/MissingSheetsPanel";
import { ZoningIssuesPanel } from "@/components/permit/ZoningIssuesPanel";
import { MEPCoordinationPanel } from "@/components/permit/MEPCoordinationPanel";
import { PermitSummaryPanel } from "@/components/permit/PermitSummaryPanel";
import { DownloadPermitReport } from "@/components/permit/DownloadPermitReport";
import { Button } from "@/components/ui/button";

type Issue = {
  id: string;
  title: string;
  severity: string;
  category?: string;
  code_reference?: string;
  description?: string;
  recommendation?: string;
};

type PermitResult = {
  summary?: Record<string, number>;
  issues: Issue[];
  missing_sheets: string[];
  zoning: { issue: string; severity?: string; code_reference?: string }[];
  pdf_report?: string | null;
};

export default function PermitValidatorPage() {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<PermitResult>({ issues: [], missing_sheets: [], zoning: [] });
  const [tab, setTab] = useState("All");
  const [loading, setLoading] = useState(false);

  const filteredIssues = useMemo(() => {
    if (tab === "All") return data.issues;
    if (tab === "Sheets") return data.issues.filter((i) => i.category === "Sheets");
    if (tab === "Architectural") return data.issues.filter((i) => i.category === "Architectural");
    if (tab === "Structural") return data.issues.filter((i) => i.category === "Structural");
    if (tab === "MEP") return data.issues.filter((i) => i.category === "MEP");
    if (tab === "Coordination") return data.issues.filter((i) => i.category === "Coordination");
    if (tab === "Zoning") return data.issues.filter((i) => i.category === "Zoning");
    return data.issues;
  }, [tab, data.issues]);

  const runValidation = async () => {
    if (!file) return;
    setLoading(true);
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fetch("/api/permit/validate", { method: "POST", body: form });
      const json = await res.json();
      setData(json);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">AI Permit Drawing Validator</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Simulate municipal plan review: completeness, zoning, architectural, structural, MEP, and coordination checks.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DownloadPermitReport url={data.pdf_report} />
          <Button onClick={runValidation} disabled={loading || !file}>
            {loading ? "Validating…" : "Run Validation"}
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <PermitDropzone onFile={setFile} />
        {file && <div className="text-sm text-slate-600 dark:text-slate-200">Selected: {file.name}</div>}
      </div>

      <PermitCategoryTabs value={tab} onChange={setTab} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <PermitSummaryPanel summary={data.summary} />
        <div className="lg:col-span-2">
          <PermitIssueTable issues={filteredIssues} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Missing Sheets</h2>
          <MissingSheetsPanel sheets={data.missing_sheets} />
        </div>
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Zoning Issues</h2>
          <ZoningIssuesPanel issues={data.zoning} />
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Highlighted Issues</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {data.issues.slice(0, 6).map((iss) => (
            <PermitIssueCard key={iss.id} issue={iss} />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">MEP Coordination</h2>
        <MEPCoordinationPanel issues={[]} />
      </div>
    </div>
  );
}
