"use client";

import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { HeatmapCanvas } from "@/components/HeatmapCanvas";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

type Point = { x: number; y: number; severity: string; color?: string; message?: string };

type Props = {
  fileUrl: string;
  points: Point[];
  initialPage?: number;
};

export function PdfWithHeatmap({ fileUrl, points, initialPage = 1 }: Props) {
  const [numPages, setNumPages] = useState<number>(1);
  const [page, setPage] = useState(initialPage);
  const [scale, setScale] = useState(1);
  const [pdfDims, setPdfDims] = useState<{ width: number; height: number } | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const onPageLoadSuccess = (p: any) => {
    const w = p?.originalWidth || p?.width || 1000;
    const h = p?.originalHeight || p?.height || 1400;
    setPdfDims({ width: w, height: h });
  };

  useEffect(() => {
    if (!pdfDims || !containerRef.current) return;
    const fitWidthScale = containerRef.current.clientWidth / pdfDims.width;
    setScale(fitWidthScale * 0.98);
  }, [pdfDims]);

  return (
    <div className="relative bg-slate-50 dark:bg-zinc-950 p-4 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm">
      <div className="flex items-center justify-between mb-3 text-xs text-slate-600 dark:text-slate-300">
        <div>Page {page} of {numPages}</div>
        <div>Zoom {(scale * 100).toFixed(0)}%</div>
      </div>
      <div ref={containerRef} className="relative overflow-auto">
        <div className="relative inline-block">
          <Document file={fileUrl} onLoadSuccess={onDocumentLoadSuccess} loading={<div className="p-4">Loading PDF…</div>}>
            <Page
              pageNumber={page}
              scale={scale}
              renderAnnotationLayer={false}
              renderTextLayer={false}
              onLoadSuccess={onPageLoadSuccess}
              loading=""
            />
          </Document>
          {pdfDims && (
            <HeatmapCanvas points={points} pdfWidth={pdfDims.width} pdfHeight={pdfDims.height} scale={scale} />
          )}
        </div>
      </div>
    </div>
  );
}
