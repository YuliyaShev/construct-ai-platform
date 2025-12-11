"use client";

import { useState } from "react";
import { RfqForm } from "@/components/rfq/RfqForm";
import { ScopePreview } from "@/components/rfq/ScopePreview";
import { RfqLetterPreview } from "@/components/rfq/RfqLetterPreview";
import { BidFormTable } from "@/components/rfq/BidFormTable";
import { DownloadTenderPackage } from "@/components/rfq/DownloadTenderPackage";
import { TenderPackageViewer } from "@/components/rfq/TenderPackageViewer";

type TenderResult = {
  tender_id: string;
  trades: any[];
  full_package_pdf?: string | null;
};

export default function RfqGeneratorPage() {
  const [data, setData] = useState<TenderResult | null>(null);
  const [selectedTrade, setSelectedTrade] = useState<any | null>(null);

  const generate = async (payload: any) => {
    const res = await fetch("/api/tender/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    setData(json);
    setSelectedTrade(json.trades?.[0] || null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">AI Tender / RFQ / Scope Generator</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Generate trade-specific RFQ letters, scopes, and bid forms automatically from project data.
          </p>
        </div>
        <DownloadTenderPackage url={data?.full_package_pdf || data?.trades?.[0]?.pdf} />
      </div>

      <RfqForm onGenerate={generate} />

      {data?.trades?.length ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-3">
            <TenderPackageViewer packages={data.trades} />
          </div>
          <div className="space-y-3 lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <ScopePreview scope={selectedTrade?.scope_of_work} />
              <RfqLetterPreview letter={selectedTrade?.rfq_letter} />
            </div>
            <BidFormTable form={selectedTrade?.bid_form} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
