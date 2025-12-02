"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/analyzeDetail/tooltip";
import { Minus, Plus, Maximize, Minimize, ChevronLeft, ChevronRight, RefreshCcw } from "lucide-react";
import { cn } from "@/lib/helpers";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export type HeatmapIssue = {
  page: number;
  bbox: [number, number, number, number];
  severity: "error" | "warning" | "info";
  message?: string;
  recommended_action?: string;
};

type Props = {
  fileUrl: string | null;
  issues: HeatmapIssue[];
};

const severityStyles = {
  error: { fill: "rgba(255,0,0,0.35)", border: "2px solid #ff0000" },
  warning: { fill: "rgba(255,165,0,0.35)", border: "2px solid #ff9900" },
  info: { fill: "rgba(0,128,255,0.35)", border: "2px solid #0090ff" },
};

export function PdfHeatmapViewer({ fileUrl, issues }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [numPages, setNumPages] = useState<number>(1);
  const [page, setPage] = useState(1);
  const [scale, setScale] = useState(1.1);
  const [pdfDims, setPdfDims] = useState<{ width: number; height: number } | null>(null);

  const renderWidth = pdfDims ? pdfDims.width * scale : undefined;
  const renderHeight = pdfDims ? pdfDims.height * scale : undefined;

  const pageIssues = useMemo(() => issues.filter((i) => i.page === page), [issues, page]);

  const scaledBoxes = useMemo(() => {
    if (!pdfDims || !renderWidth || !renderHeight) return [];
    const { width: pdfW, height: pdfH } = pdfDims;
    return pageIssues.map((issue) => {
      const [x1, y1, x2, y2] = issue.bbox;
      const left = (x1 / pdfW) * renderWidth;
      const top = (y1 / pdfH) * renderHeight;
      const width = ((x2 - x1) / pdfW) * renderWidth;
      const height = ((y2 - y1) / pdfH) * renderHeight;
      return { issue, style: { left, top, width, height } };
    });
  }, [pageIssues, pdfDims, renderWidth, renderHeight]);

  useEffect(() => {
    if (!pdfDims || !containerRef.current) return;
    const fitWidthScale = containerRef.current.clientWidth / pdfDims.width;
    setScale(fitWidthScale * 0.98);
  }, [pdfDims]);

  const onPageLoadSuccess = (pageProxy: any) => {
    const w = pageProxy?.originalWidth || pageProxy?.width || 1000;
    const h = pageProxy?.originalHeight || pageProxy?.height || 1400;
    setPdfDims({ width: w, height: h });
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/60 shadow-md backdrop-blur">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-200 dark:border-zinc-800">
        <TooltipProvider>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" onClick={() => setScale((s) => Math.max(0.5, s - 0.1))} disabled={!fileUrl}>
                  <Minus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom out</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" onClick={() => setScale((s) => Math.min(3, s + 0.1))} disabled={!fileUrl}>
                  <Plus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom in</TooltipContent>
            </Tooltip>
            <Separator orientation="vertical" className="h-6" />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" onClick={() => setScale(1)} disabled={!fileUrl}>
                  <RefreshCcw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Reset zoom</TooltipContent>
            </Tooltip>
            <Separator orientation="vertical" className="h-6" />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Previous page</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" onClick={() => setPage((p) => Math.min(numPages, p + 1))} disabled={page >= numPages}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Next page</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
        <div className="ml-auto text-xs text-slate-600 dark:text-slate-300">
          Page {page} of {numPages || 1} • {(scale * 100).toFixed(0)}%
        </div>
      </div>

      <div ref={containerRef} className="relative overflow-auto bg-slate-50 dark:bg-zinc-950 p-4 rounded-b-2xl min-h-[400px]">
        {!fileUrl ? (
          <div className="text-sm text-slate-500">No PDF loaded.</div>
        ) : (
          <div className="relative inline-block">
            <Document file={fileUrl} onLoadSuccess={({ numPages }) => setNumPages(numPages)} loading={<div className="p-4 text-sm text-slate-500">Loading PDF...</div>}>
              <Page
                pageNumber={page}
                scale={scale}
                renderAnnotationLayer={false}
                renderTextLayer={false}
                onLoadSuccess={onPageLoadSuccess}
                loading=""
              />
            </Document>
            {renderWidth && renderHeight && (
              <div className="absolute inset-0 pointer-events-none">
                {scaledBoxes.map(({ issue, style }, idx) => {
                  const sev = severityStyles[issue.severity] || severityStyles.info;
                  return (
                    <TooltipProvider key={idx}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className="absolute pointer-events-auto rounded-sm transition-all duration-150 hover:scale-[1.01]"
                            style={{
                              left: style.left,
                              top: style.top,
                              width: style.width,
                              height: style.height,
                              background: sev.fill,
                              border: sev.border,
                            }}
                          />
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs">
                          <div className="text-xs font-semibold text-slate-100">Severity: {issue.severity}</div>
                          {issue.message && <div className="text-xs text-slate-200">{issue.message}</div>}
                          {issue.recommended_action && <div className="text-[11px] text-slate-300 mt-1">{issue.recommended_action}</div>}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
