"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/analyzeDetail/tooltip";
import { Minus, Plus, Maximize, Minimize, ChevronLeft, ChevronRight, RefreshCcw } from "lucide-react";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import { version as pdfjsVersion } from "pdfjs-dist/package.json";
import { cn } from "@/lib/helpers";

GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsVersion}/pdf.worker.min.js`;

type Props = {
  fileUrl: string | null;
};

export function PdfViewer({ fileUrl }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [scale, setScale] = useState(1);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [fitMode, setFitMode] = useState<"width" | "page">("width");

  useEffect(() => {
    setPage(1);
    setScale(fitMode === "width" ? 1.2 : 1);
  }, [fileUrl, fitMode]);

  useEffect(() => {
    if (!fileUrl || !canvasRef.current) return;
    let cancelled = false;

    const render = async () => {
      try {
        const loadingTask = getDocument(fileUrl);
        const pdf = await loadingTask.promise;
        if (cancelled) return;
        setPageCount(pdf.numPages);
        const pdfPage = await pdf.getPage(page);
        if (cancelled) return;

        const viewport = pdfPage.getViewport({ scale });
        const canvas = canvasRef.current!;
        const context = canvas.getContext("2d");
        if (!context) return;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await pdfPage.render({ canvasContext: context, viewport }).promise;
      } catch (e) {
        if (!cancelled) console.error("Failed to render PDF", e);
      }
    };

    render();
    return () => {
      cancelled = true;
    };
  }, [fileUrl, scale, page]);

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/70 shadow-md backdrop-blur">
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
                <Button size="icon" variant={fitMode === "width" ? "secondary" : "ghost"} onClick={() => setFitMode("width")} disabled={!fileUrl}>
                  <Maximize className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Fit width</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant={fitMode === "page" ? "secondary" : "ghost"} onClick={() => setFitMode("page")} disabled={!fileUrl}>
                  <Minimize className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Fit page</TooltipContent>
            </Tooltip>
            <Separator orientation="vertical" className="h-6" />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={!fileUrl || page <= 1}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Previous page</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setPage((p) => (pageCount ? Math.min(pageCount, p + 1) : p + 1))}
                  disabled={!fileUrl || (pageCount !== null && page >= pageCount)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Next page</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" onClick={() => setScale(1)} disabled={!fileUrl}>
                  <RefreshCcw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Reset zoom</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
        <div className="ml-auto text-xs text-slate-600 dark:text-slate-300">
          Page {page} {pageCount ? `of ${pageCount}` : ""} • {(scale * 100).toFixed(0)}%
        </div>
      </div>
      <div className={cn("flex justify-center bg-slate-50 dark:bg-zinc-950 p-4 rounded-b-2xl min-h-[400px]", !fileUrl && "items-center")}>
        {fileUrl ? <canvas ref={canvasRef} className="shadow-lg" /> : <div className="text-sm text-slate-500">No PDF loaded.</div>}
      </div>
    </div>
  );
}
