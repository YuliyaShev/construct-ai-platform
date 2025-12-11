"use client";

import React, { useMemo } from "react";
import { cn } from "@/lib/helpers";
import { type ContainerSize, type PageMetrics, type ViewState, viewportRect } from "@/helpers/pdfViewport";

type Props = {
  previewSrc?: string | null;
  pageSize: PageMetrics | null;
  view: ViewState;
  container: ContainerSize;
  minimapScale?: number;
  onNavigate?: (next: { translateX: number; translateY: number }) => void;
};

export function PdfMinimap({ previewSrc, pageSize, view, container, minimapScale = 0.15, onNavigate }: Props) {
  const dimensions = useMemo(() => {
    if (!pageSize) return { width: 0, height: 0 };
    return {
      width: pageSize.width * minimapScale,
      height: pageSize.height * minimapScale
    };
  }, [pageSize, minimapScale]);

  const viewport = useMemo(() => {
    if (!pageSize) return null;
    return viewportRect(view, container, pageSize);
  }, [container, pageSize, view]);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!pageSize || !onNavigate || dimensions.width === 0 || dimensions.height === 0) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;
    const normalizedX = offsetX / dimensions.width;
    const normalizedY = offsetY / dimensions.height;

    const targetX = normalizedX * pageSize.width;
    const targetY = normalizedY * pageSize.height;

    const translateX = container.width / 2 - targetX * view.scale;
    const translateY = container.height / 2 - targetY * view.scale;
    onNavigate({ translateX, translateY });
  };

  return (
    <div className="pdf-minimap-panel">
      <div className="pdf-minimap-header">Minimap</div>
      <div
        className={cn("pdf-minimap-body", !previewSrc && "pdf-skeleton")}
        style={{ width: dimensions.width, height: dimensions.height }}
        onClick={handleClick}
      >
        {previewSrc ? <img src={previewSrc} alt="Minimap" className="pdf-minimap-image" /> : null}
        {viewport && (
          <div
            className="pdf-minimap-viewport"
            style={{
              left: viewport.x * dimensions.width,
              top: viewport.y * dimensions.height,
              width: Math.min(viewport.width, 1) * dimensions.width,
              height: Math.min(viewport.height, 1) * dimensions.height
            }}
          />
        )}
      </div>
    </div>
  );
}
