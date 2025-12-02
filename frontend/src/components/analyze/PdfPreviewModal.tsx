"use client";

import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogOverlay } from "@/components/analyze/dialog";
import { Button } from "@/components/ui/button";
import { Minus, Plus, X } from "lucide-react";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import { version as pdfjsVersion } from "pdfjs-dist/package.json";
import { cn } from "@/lib/helpers";

GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsVersion}/pdf.worker.min.js`;

type Props = {
  open: boolean;
  fileUrl: string | null;
  title?: string;
  onClose: () => void;
};

export function PdfPreviewModal({ open, fileUrl, title, onClose }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!open || !fileUrl || !canvasRef.current) return;
    let cancelled = false;

    const render = async () => {
      try {
        const loadingTask = getDocument(fileUrl);
        const pdf = await loadingTask.promise;
        if (cancelled) return;
        const page = await pdf.getPage(1);
        if (cancelled) return;
        const viewport = page.getViewport({ scale });
        const canvas = canvasRef.current!;
        const context = canvas.getContext("2d");
        if (!context) return;

        canvas.height = viewport.height;
        canvas.width = viewport.width;
        await page.render({ canvasContext: context, viewport }).promise;
      } catch (e) {
        if (!cancelled) console.error("PDF render failed", e);
      }
    };

    render();
    return () => {
      cancelled = true;
    };
  }, [open, fileUrl, scale]);

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogOverlay className="backdrop-blur-xl bg-black/70" />
      <DialogContent className="max-w-6xl w-full bg-gradient-to-b from-slate-900 to-black border border-slate-800 text-white">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <div className="text-xs uppercase tracking-wide text-white/60">PDF Preview</div>
            <div className="text-lg font-semibold text-white">{title || "Selected PDF"}</div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="icon" variant="secondary" onClick={() => setScale((s) => Math.max(0.5, s - 0.1))}>
              <Minus className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="secondary" onClick={() => setScale((s) => Math.min(3, s + 0.1))}>
              <Plus className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <div className={cn("mt-4 flex justify-center bg-slate-900/60 rounded-lg border border-slate-800 p-3")}>
          {fileUrl ? <canvas ref={canvasRef} className="shadow-lg" /> : <div className="text-sm text-white/60">No file selected.</div>}
        </div>
      </DialogContent>
    </Dialog>
  );
}
