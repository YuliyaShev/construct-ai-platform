"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Accordion } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import PdfHeatmapViewer from "@/components/pdf/PdfViewerNoSSR";
import PdfPreview from "@/components/pdf/PdfPreviewNoSSR";
import type { HeatmapIssue } from "@/components/PdfHeatmapViewer";

const SAMPLE_PDFS = [
  { id: "demo-1", name: "Structural Plans.pdf", url: "/sample.pdf" },
  { id: "demo-2", name: "MEP Layout.pdf", url: "/sample-mep.pdf" }
];

const ACTIONS = [
  { label: "BOM Extractor v1", endpoint: "/api/bom/extract" },
  { label: "BOM Extractor v2 (geometry)", endpoint: "/api/bom/extract-geometry" },
  { label: "BOM Extractor v3 (glass area)", endpoint: "/api/bom/extract-glass" },
  { label: "BOM Extractor v4 (angles & cuts)", endpoint: "/api/bom/extract-angles" },
  { label: "BOM Extractor v5 (3D reconstruction)", endpoint: "/api/bom/reconstruct" },
  { label: "Navigation AI", endpoint: "/api/navigation/ai" },
  { label: "Heatmap Issue Detector", endpoint: "/api/heatmap/issues" },
  { label: "Dimension Error Finder", endpoint: "/api/dimension/errors" },
  { label: "Clash Detection (Navisworks-style)", endpoint: "/api/clash/detect" },
  { label: "Structural Load Path Analyzer", endpoint: "/api/structural/load-path" },
  { label: "Code Compliance Checker", endpoint: "/api/code/check" },
  { label: "Permit Drawing Validator", endpoint: "/api/permit/validate" },
  { label: "Fire Egress Simulation", endpoint: "/api/egress/simulate" },
  { label: "Auto-Detail Generator", endpoint: "/api/details/generate" },
  { label: "Cost Estimator (5D BIM)", endpoint: "/api/cost/estimate" },
  { label: "Schedule Generator (4D BIM)", endpoint: "/api/schedule/generate" },
  { label: "Structural Failure Predictor", endpoint: "/api/structural/failure" },
  { label: "Tender/RFQ Generator", endpoint: "/api/rfq/generate" },
  { label: "Contract Analyzer", endpoint: "/api/contract/analyze" },
  { label: "Safety Hazard Detector", endpoint: "/api/safety/detect" },
  { label: "QA/QC Punchlist Generator", endpoint: "/api/punch/generate" },
  { label: "RFI Generator", endpoint: "/api/rfi/generate" },
  { label: "RFI PDF Export", endpoint: "/api/rfi/export" }
];

async function runAI(endpoint: string, body: any = {}) {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  return res.json();
}

export default function PlaygroundAIPage() {
  const [selectedPdf, setSelectedPdf] = useState(SAMPLE_PDFS[0]);
  const [jsonOutput, setJsonOutput] = useState<any>(null);
  const [issues, setIssues] = useState<HeatmapIssue[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const appendLog = (message: string) => setLogs((prev) => [`${new Date().toLocaleTimeString()} • ${message}`, ...prev]);

  const handleAction = async (label: string, endpoint: string) => {
    setLoadingAction(label);
    appendLog(`Running ${label} at ${endpoint}`);
    try {
      const data = await runAI(endpoint, { fileId: selectedPdf?.id });
      setJsonOutput(data);
      if (data?.issues) {
        setIssues(
          data.issues.map((i: any, idx: number) => ({
            page: i.page || 1,
            bbox: i.bbox || [0, 0, 10, 10],
            severity: (i.severity as any) || "info",
            message: i.title || i.message || `Issue ${idx + 1}`
          }))
        );
      }
      appendLog(`Completed ${label}`);
    } catch (error) {
      appendLog(`Error on ${label}: ${(error as Error).message}`);
    } finally {
      setLoadingAction(null);
    }
  };

  const accordionItems = [
    {
      id: "pdf-tools",
      trigger: "PDF Tools",
      content: (
        <div className="space-y-3">
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-600">Upload / Select</div>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm">
                Upload PDF
              </Button>
              <Button variant="outline" size="sm" onClick={() => setPreviewOpen(true)}>
                Preview thumbnail
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-600">Uploaded PDFs</div>
            <div className="flex flex-col gap-2">
              {SAMPLE_PDFS.map((pdf) => (
                <Button
                  key={pdf.id}
                  variant={selectedPdf?.id === pdf.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedPdf(pdf)}
                >
                  {pdf.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      id: "ai-analysis",
      trigger: "AI Analysis Tools",
      content: (
        <div className="grid grid-cols-1 gap-2">
          {ACTIONS.map((action) => (
            <Button
              key={action.label}
              variant="outline"
              size="sm"
              onClick={() => handleAction(action.label, action.endpoint)}
              disabled={!!loadingAction}
              className="justify-start"
            >
              {loadingAction === action.label ? "Running..." : action.label}
            </Button>
          ))}
        </div>
      )
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">AI Playground</h1>
          <p className="text-sm text-slate-600">Unified sandbox for PDF, BOM, heatmaps, navigation AI, clash detection, RFI, and 3D.</p>
        </div>
        <Button variant="outline" onClick={() => handleAction("Navigation AI", "/api/navigation/ai")} disabled={!!loadingAction}>
          {loadingAction === "Navigation AI" ? "Running..." : "Run Navigation AI"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4 border-slate-200 bg-white/80 shadow-sm">
          <div className="text-sm font-semibold text-slate-800 mb-3">Tools</div>
          <Accordion items={accordionItems} />
        </Card>

        <Card className="p-4 border-slate-200 bg-white/80 shadow-sm min-h-[600px]">
          <ScrollArea className="w-full whitespace-nowrap">
            <Tabs defaultValue="json">
              <TabsList className="flex w-max space-x-2 px-2">
                <TabsTrigger value="json">JSON Output</TabsTrigger>
                <TabsTrigger value="issues">Issues List</TabsTrigger>
                <TabsTrigger value="bom">BOM Table</TabsTrigger>
                <TabsTrigger value="heatmap">Heatmap Overlay</TabsTrigger>
                <TabsTrigger value="pdf">PDF Preview</TabsTrigger>
                <TabsTrigger value="viewer3d">3D Viewer</TabsTrigger>
                <TabsTrigger value="rfi">RFI Preview</TabsTrigger>
                <TabsTrigger value="logs">Logs</TabsTrigger>
              </TabsList>

              <TabsContent value="json">
                <pre className="bg-slate-950 text-slate-100 text-xs rounded-lg p-4 overflow-auto max-h-[480px]">
                  {jsonOutput ? JSON.stringify(jsonOutput, null, 2) : "Awaiting AI output..."}
                </pre>
              </TabsContent>

              <TabsContent value="issues">
                {issues.length ? (
                  <div className="space-y-3">
                    {issues.map((i, idx) => (
                      <Card key={idx} className="p-3 border-slate-200">
                        <div className="text-sm font-semibold text-slate-800">Page {i.page}</div>
                        <div className="text-xs text-slate-600">{i.message}</div>
                        <div className="text-[11px] text-slate-500 mt-1">Severity: {i.severity}</div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-sm text-slate-500">No issues detected yet.</div>
                )}
              </TabsContent>

              <TabsContent value="bom">
                {jsonOutput?.bom?.length ? (
                  <div className="overflow-auto">
                    <table className="min-w-full text-sm">
                      <thead className="text-left text-slate-500">
                        <tr>
                          <th className="py-2 pr-4">Item</th>
                          <th className="py-2 pr-4">Qty</th>
                          <th className="py-2 pr-4">Unit</th>
                        </tr>
                      </thead>
                      <tbody className="text-slate-800">
                        {jsonOutput.bom.map((row: any, idx: number) => (
                          <tr key={idx} className="border-t border-slate-200">
                            <td className="py-2 pr-4">{row.item || row.name}</td>
                            <td className="py-2 pr-4">{row.qty || row.quantity}</td>
                            <td className="py-2 pr-4">{row.unit || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-4 text-sm text-slate-500">No BOM data.</div>
                )}
              </TabsContent>

              <TabsContent value="heatmap">
                {selectedPdf ? (
                  <PdfHeatmapViewer fileUrl={selectedPdf.url} issues={issues} />
                ) : (
                  <div className="p-4 text-sm text-muted-foreground">No PDF selected.</div>
                )}
              </TabsContent>

              <TabsContent value="pdf">
                <div className="space-y-2">
                  <Button variant="outline" onClick={() => setPreviewOpen(true)}>
                    Open preview
                  </Button>
                  <div className="text-xs text-slate-500">Uses PdfPreview modal.</div>
                </div>
              </TabsContent>

              <TabsContent value="viewer3d">
                <div className="p-4 text-sm text-muted-foreground">Component not implemented yet</div>
              </TabsContent>

              <TabsContent value="rfi">
                <div className="p-4 text-sm text-muted-foreground">Component not implemented yet</div>
              </TabsContent>

              <TabsContent value="logs">
                <div className="space-y-2">
                  {logs.length ? (
                    logs.map((log, idx) => (
                      <div key={idx} className="text-xs text-slate-600 border-b border-slate-200 pb-1">
                        {log}
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-slate-500">No logs yet.</div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </Card>
      </div>

      <PdfPreview fileUrl={selectedPdf?.url || null} open={previewOpen} onClose={() => setPreviewOpen(false)} title={selectedPdf?.name} />
    </div>
  );
}
