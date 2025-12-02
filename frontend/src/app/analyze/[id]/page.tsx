"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AnalysisPanel } from "@/components/analyzeDetail/AnalysisPanel";
import { type FileRecord } from "@/components/analyze/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/analyze/Primitives";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { PdfHeatmapViewer } from "@/components/PdfHeatmapViewer";
import type { HeatmapIssue } from "@/components/PdfHeatmapViewer";

export default function AnalyzeDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [file, setFile] = useState<FileRecord | null>(null);
  const [analysisText, setAnalysisText] = useState("Generated from MVP");
  const [issues] = useState<{ title: string; description?: string; severity: "error" | "warning" | "info" }[]>([]);
  const [loading, setLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [heatmap, setHeatmap] = useState<HeatmapIssue[]>([]);

  const loadData = async () => {
    try {
      setLoading(true);
      const metaRes = await fetch(`/api/file/${id}`);
      if (metaRes.ok) {
        const meta = await metaRes.json();
        setFile(meta);
      }
      const analyzeRes = await fetch(`/api/analyze/${id}`, { method: "POST" });
      if (analyzeRes.ok) {
        const data = await analyzeRes.json();
        setAnalysisText(data?.text || "Generated from MVP");
        setHeatmap(data?.heatmap || []);
      }
      const pdfRes = await fetch(`/api/download/${id}`);
      if (pdfRes.ok) {
        const blob = await pdfRes.blob();
        const url = URL.createObjectURL(blob);
        setPdfUrl((old) => {
          if (old) URL.revokeObjectURL(old);
          return url;
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) loadData();
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div className="mx-auto max-w-7xl p-6 lg:p-10 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">File</p>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
              {file?.original_name || "Loading file..."}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">Review the PDF and AI-generated insights.</p>
          </div>
          {file && (
            <Button onClick={() => window.open(`/api/download/${id}`, "_blank")} variant="secondary" className="gap-2">
              <Download className="h-4 w-4" />
              Download
            </Button>
          )}
        </div>

        <Card className="border-slate-200 dark:border-zinc-800 bg-gradient-to-br from-white to-slate-50 dark:from-zinc-950 dark:to-black shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>PDF Preview</CardTitle>
            {file && <Badge>{file.content_type || "application/pdf"}</Badge>}
          </CardHeader>
          <CardContent>
            <PdfHeatmapViewer fileUrl={pdfUrl} issues={heatmap} />
          </CardContent>
        </Card>
      </div>

      <AnalysisPanel file={file} analysisText={analysisText} issues={issues} loading={loading} />
    </div>
  );
}
