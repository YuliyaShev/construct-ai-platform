"use client";

import { useEffect, useRef, useState } from "react";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import { version as pdfjsVersion } from "pdfjs-dist/package.json";
import { X, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/helpers";

// Configure worker from CDN to avoid bundler worker resolution issues
GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsVersion}/pdf.worker.min.js`;

type Props = {
  fileUrl: string | null;
  open: boolean;
  onClose: () => void;
  title?: string;
};

export default function PdfPreview({ fileUrl, open, onClose, title }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [scale, setScale] = useState(1.0);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    const render = async () => {
      if (!fileUrl || !canvasRef.current) return;
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
        if (!cancelled) {
          console.error("Failed to render PDF preview", e);
        }
      }
    };
    render();
    return () => {
      cancelled = true;
    };
  }, [fileUrl, open, scale, page]);

  useEffect(() => {
    if (!open) {
      setScale(1.0);
      setPage(1);
      setPageCount(null);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div>
            <div className="text-sm uppercase tracking-wide text-slate-500">PDF Preview</div>
            <div className="text-lg font-semibold text-slate-900 line-clamp-1">{title || "Selected PDF"}</div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="icon" variant="outline" onClick={() => setScale((s) => Math.max(0.5, s - 0.1))}>
              <Minus className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="outline" onClick={() => setScale((s) => Math.min(3, s + 0.1))}>
              <Plus className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={onClose} aria-label="Close preview">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <div className="flex-1 overflow-auto bg-slate-50">
          {!fileUrl ? (
            <div className="h-full flex items-center justify-center text-slate-500 text-sm">No file selected.</div>
          ) : (
            <div className={cn("flex justify-center py-4")}>
              <canvas ref={canvasRef} className="shadow-sm border" />
            </div>
          )}
        </div>
        <div className="px-4 py-2 border-t text-xs text-slate-500 flex items-center justify-between">
          <div>Scale: {(scale * 100).toFixed(0)}%</div>
          <div>
            Page {page} {pageCount ? `of ${pageCount}` : ""}
          </div>
        </div>
      </div>
    </div>
  );
}
