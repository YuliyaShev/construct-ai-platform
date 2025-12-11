"use client";

import { useState } from "react";
import { ContractUpload } from "@/components/contracts/ContractUpload";
import { ClauseList } from "@/components/contracts/ClauseList";
import { RiskHeatmap } from "@/components/contracts/RiskHeatmap";
import { ClauseViewer } from "@/components/contracts/ClauseViewer";
import { RedlineSuggestions } from "@/components/contracts/RedlineSuggestions";
import { ContractSummaryCard } from "@/components/contracts/ContractSummaryCard";
import { DownloadContractReport } from "@/components/contracts/DownloadContractReport";

type ContractResult = {
  summary: any;
  risk_map: any[];
  recommendations?: string[];
  report_pdf?: string | null;
};

export default function ContractAnalyzerPage() {
  const [data, setData] = useState<ContractResult | null>(null);
  const [selected, setSelected] = useState<any | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">AI Contracts Analyzer</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Detect risks, payment terms, indemnities, termination, and dispute clauses with redline recommendations.
          </p>
        </div>
        <DownloadContractReport url={data?.report_pdf} />
      </div>

      <ContractUpload
        onResult={(res) => {
          setData(res);
          setSelected(res?.risk_map?.[0]);
        }}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <ContractSummaryCard summary={data?.summary} />
        <RiskHeatmap risks={data?.risk_map || []} />
        <RedlineSuggestions items={data?.recommendations} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ClauseList items={data?.risk_map || []} onSelect={(c) => setSelected(c)} />
        </div>
        <ClauseViewer clause={selected} />
      </div>
    </div>
  );
}
