"use client";

import { useState } from "react";
import { DetailGeneratorForm } from "@/components/details/DetailGeneratorForm";
import { DetailViewer } from "@/components/details/DetailViewer";
import { DetailParameterPanel } from "@/components/details/DetailParameterPanel";
import { DetailLibraryGrid } from "@/components/details/DetailLibraryGrid";
import { DetailDownloadButtons } from "@/components/details/DetailDownloadButtons";
import { MaterialTagLegend } from "@/components/details/MaterialTagLegend";
import { Button } from "@/components/ui/button";

type DetailResponse = {
  detail_id: string;
  type: string;
  svg_url: string;
  pdf_url: string;
  metadata: any;
};

export default function AutoDetailsPage() {
  const [detail, setDetail] = useState<DetailResponse | null>(null);
  const [svgContent, setSvgContent] = useState<string | undefined>(undefined);

  const generate = async (payload: any) => {
    const res = await fetch("/api/details/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    setDetail(json);
    // fetch svg content to display
    if (json?.svg_url) {
      try {
        const svgRes = await fetch(json.svg_url);
        const text = await svgRes.text();
        setSvgContent(text);
      } catch {
        setSvgContent(undefined);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">AI Auto-Detail Generator</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Generate architectural and structural details (A4.x / S3.x) with parametric controls and downloads.
          </p>
        </div>
        <DetailDownloadButtons svgUrl={detail?.svg_url} pdfUrl={detail?.pdf_url} />
      </div>

      <DetailLibraryGrid onSelect={(id) => generate({ type: id })} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-1">
          <DetailGeneratorForm onGenerate={generate} />
          <MaterialTagLegend />
        </div>
        <div className="space-y-3 lg:col-span-2">
          <DetailViewer svg={svgContent} />
          <DetailParameterPanel metadata={detail?.metadata} />
        </div>
      </div>
    </div>
  );
}
