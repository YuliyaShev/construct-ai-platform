"use client";

import { useEffect, useRef } from "react";
import type { PDFPageProxy } from "pdfjs-dist";
import { cn } from "@/lib/helpers";
import { getDevicePixelRatioSafe, type PageMetrics } from "@/helpers/pdfViewport";

type Props = {
  page: PDFPageProxy | null;
  scale: number;
  translateX: number;
  translateY: number;
  devicePixelRatio?: number;
  className?: string;
  onRender?: (size: PageMetrics) => void;
};

export function PdfCanvasRenderer({
  page,
  scale,
  translateX,
  translateY,
  devicePixelRatio,
  className,
  onRender
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!page || !canvasRef.current) return;
    let cancelled = false;
    let renderTask: any;

    const render = async () => {
      const viewport = page.getViewport({ scale });
      const canvas = canvasRef.current!;
      const context = canvas.getContext("2d");
      if (!context) return;

      const dpr = devicePixelRatio ?? getDevicePixelRatioSafe();
      canvas.width = viewport.width * dpr;
      canvas.height = viewport.height * dpr;
      canvas.style.width = `${viewport.width}px`;
      canvas.style.height = `${viewport.height}px`;

      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, canvas.width, canvas.height);
      renderTask = page.render({ canvasContext: context, viewport });

      try {
        await renderTask.promise;
        if (cancelled) return;
        onRender?.({ width: viewport.width, height: viewport.height });
      } catch (error) {
        if ((error as any)?.name !== "RenderingCancelledException") {
          console.error("Failed to render PDF page", error);
        }
      }
    };

    render();
    return () => {
      cancelled = true;
      if (renderTask?.cancel) {
        renderTask.cancel();
      }
    };
  }, [page, scale, devicePixelRatio, onRender]);

  return (
    <div
      className={cn("pdf-canvas-layer", className)}
      style={{ transform: `translate(${translateX}px, ${translateY}px)` }}
    >
      <canvas ref={canvasRef} className="pdf-canvas" />
    </div>
  );
}
