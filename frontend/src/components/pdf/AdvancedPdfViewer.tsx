"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Document, pdfjs } from "react-pdf";
import type { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist";
import { version as pdfjsVersion } from "pdfjs-dist/package.json";
import { Loader2, Maximize2, Minus, Move, Plus, RotateCcw } from "lucide-react";
import { PdfCanvasRenderer } from "./PdfCanvasRenderer";
import { PdfLayerManager, type PdfAiBox, type PdfCommentMarker } from "./PdfLayerManager";
import { PdfThumbnailBar, type PdfThumbnail } from "./PdfThumbnailBar";
import { PdfMinimap } from "./PdfMinimap";
import type { HeatmapFilters, HeatmapPoint } from "./heatmap/types/heatmap";
import type { SyncMap } from "../sync/types/sync";
import { syncController } from "../sync/controllers/SyncController";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/helpers";
import {
  centerWithinContainer,
  clampScale,
  constrainTranslation,
  fitWidthScale,
  getDevicePixelRatioSafe,
  type ContainerSize,
  type PageMetrics,
  type ViewState
} from "@/helpers/pdfViewport";

// Configure worker from CDN to avoid bundler worker resolution issues
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsVersion}/pdf.worker.min.js`;

type Props = {
  fileUrl: string;
  initialPage?: number;
  aiBoxes?: PdfAiBox[];
  heatmapPoints?: HeatmapPoint[];
  heatmapFilters?: HeatmapFilters;
  heatmapOpacity?: number;
  heatmapDebug?: boolean;
  syncMap?: SyncMap;
  comments?: PdfCommentMarker[];
  className?: string;
  onBoxClick?: (box: PdfAiBox) => void;
  onCommentClick?: (comment: PdfCommentMarker) => void;
  onPageChange?: (page: number) => void;
};

export function AdvancedPdfViewer({
  fileUrl,
  initialPage = 1,
  aiBoxes = [],
  heatmapPoints = [],
  heatmapFilters,
  heatmapOpacity,
  heatmapDebug,
  syncMap,
  comments = [],
  className,
  onBoxClick,
  onCommentClick,
  onPageChange
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
  const [page, setPage] = useState<PDFPageProxy | null>(null);
  const [pageMetrics, setPageMetrics] = useState<PageMetrics | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [thumbnails, setThumbnails] = useState<PdfThumbnail[]>([]);
  const [thumbnailsLoading, setThumbnailsLoading] = useState(false);
  const [minimapPreview, setMinimapPreview] = useState<string | null>(null);
  const [documentLoading, setDocumentLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const [view, setView] = useState<ViewState>({ scale: 1, translateX: 0, translateY: 0 });
  const [containerSize, setContainerSize] = useState<ContainerSize>({ width: 0, height: 0 });
  const [isSpaceDown, setIsSpaceDown] = useState(false);
  const dragState = useRef({ active: false, lastX: 0, lastY: 0, deltaX: 0, deltaY: 0, raf: 0 });
  const initializedRef = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    setPdfDoc(null);
    setPage(null);
    setNumPages(0);
    setThumbnails([]);
    setMinimapPreview(null);
    setDocumentLoading(true);
    initializedRef.current = false;
    setCurrentPage(initialPage);
  }, [fileUrl, initialPage]);

  useEffect(() => {
    if (syncMap) {
      syncController.setSyncMap(syncMap);
    }
  }, [syncMap]);

  const registerContainerSize = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;
    const observer = new ResizeObserver((entries) => {
      const rect = entries[0].contentRect;
      setContainerSize({ width: rect.width, height: rect.height });
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    return registerContainerSize(element);
  }, [registerContainerSize]);

  const renderPreview = useCallback(async (pdfPage: PDFPageProxy, targetWidth: number) => {
    const viewport = pdfPage.getViewport({ scale: 1 });
    const scale = targetWidth / viewport.width;
    const scaledViewport = pdfPage.getViewport({ scale });

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Unable to acquire 2D context");

    canvas.width = scaledViewport.width;
    canvas.height = scaledViewport.height;

    await pdfPage.render({ canvasContext: context, viewport: scaledViewport }).promise;
    return {
      src: canvas.toDataURL("image/png"),
      width: scaledViewport.width,
      height: scaledViewport.height
    };
  }, []);

  const buildThumbnails = useCallback(
    async (doc: PDFDocumentProxy) => {
      setThumbnailsLoading(true);
      const results: PdfThumbnail[] = [];
      for (let i = 1; i <= doc.numPages; i += 1) {
        try {
          const page = await doc.getPage(i);
          const thumb = await renderPreview(page, 140);
          results.push({ pageNumber: i, ...thumb });
        } catch (error) {
          console.error("Failed to render thumbnail", error);
        }
      }
      if (!mountedRef.current) return;
      setThumbnails(results);
      setThumbnailsLoading(false);
    },
    [renderPreview]
  );

  const handleDocumentLoad = useCallback(
    (doc: PDFDocumentProxy) => {
      setDocumentLoading(false);
      setPdfDoc(doc);
      setNumPages(doc.numPages);
      void buildThumbnails(doc);
    },
    [buildThumbnails]
  );

  useEffect(() => {
    if (!pdfDoc) return;
    let cancelled = false;
    const loadPage = async () => {
      try {
        setPageLoading(true);
        const pdfPage = await pdfDoc.getPage(currentPage);
        if (cancelled) return;
        setPage(pdfPage);
        const viewport = pdfPage.getViewport({ scale: 1 });
        setPageMetrics({ width: viewport.width, height: viewport.height });
        const preview = await renderPreview(pdfPage, 240);
        if (cancelled) return;
        setMinimapPreview(preview.src);
      } catch (error) {
        if (!cancelled) console.error("Failed to load page", error);
      } finally {
        if (!cancelled) setPageLoading(false);
      }
    };
    loadPage();
    return () => {
      cancelled = true;
    };
  }, [pdfDoc, currentPage, renderPreview]);

  useEffect(() => {
    if (!pageMetrics || !containerSize.width || !containerSize.height) return;
    setView((prev) => {
      if (!initializedRef.current) {
        initializedRef.current = true;
        const initialScale = fitWidthScale(containerSize.width, pageMetrics.width);
        const centered = centerWithinContainer(containerSize, pageMetrics, initialScale);
        return { scale: initialScale, translateX: centered.translateX, translateY: centered.translateY };
      }
      return constrainTranslation(prev, containerSize, pageMetrics);
    });
  }, [containerSize, pageMetrics]);

  const zoomAround = useCallback(
    (factor: number, anchor?: { x: number; y: number }) => {
      setView((prev) => {
        const nextScale = clampScale(prev.scale * factor);
        if (!pageMetrics || !containerSize.width) return { ...prev, scale: nextScale };
        const originX = anchor?.x ?? containerSize.width / 2;
        const originY = anchor?.y ?? containerSize.height / 2;
        const scaledX = (originX - prev.translateX) / prev.scale;
        const scaledY = (originY - prev.translateY) / prev.scale;
        const translateX = originX - scaledX * nextScale;
        const translateY = originY - scaledY * nextScale;
        return constrainTranslation({ scale: nextScale, translateX, translateY }, containerSize, pageMetrics);
      });
    },
    [containerSize, pageMetrics]
  );

  const resetView = useCallback(() => {
    if (!pageMetrics) return;
    const nextScale = fitWidthScale(containerSize.width, pageMetrics.width);
    const centered = centerWithinContainer(containerSize, pageMetrics, nextScale);
    setView({ scale: nextScale, translateX: centered.translateX, translateY: centered.translateY });
  }, [containerSize, pageMetrics]);

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (!pageMetrics) return;
    if (event.ctrlKey || event.metaKey) {
      event.preventDefault();
      const rect = containerRef.current?.getBoundingClientRect();
      const anchor = rect
        ? {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
          }
        : undefined;
      zoomAround(event.deltaY > 0 ? 0.9 : 1.1, anchor);
      return;
    }

    setView((prev) => {
      const next = {
        ...prev,
        translateX: prev.translateX - event.deltaX,
        translateY: prev.translateY - event.deltaY
      };
      return pageMetrics ? constrainTranslation(next, containerSize, pageMetrics) : next;
    });
  };

  const stopDrag = useCallback(() => {
    dragState.current.active = false;
    dragState.current.deltaX = 0;
    dragState.current.deltaY = 0;
    if (dragState.current.raf) {
      cancelAnimationFrame(dragState.current.raf);
      dragState.current.raf = 0;
    }
  }, []);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isSpaceDown || !pageMetrics) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragState.current.active = true;
    dragState.current.lastX = event.clientX;
    dragState.current.lastY = event.clientY;
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState.current.active) return;
    dragState.current.deltaX += event.clientX - dragState.current.lastX;
    dragState.current.deltaY += event.clientY - dragState.current.lastY;
    dragState.current.lastX = event.clientX;
    dragState.current.lastY = event.clientY;

    if (!dragState.current.raf) {
      dragState.current.raf = window.requestAnimationFrame(() => {
        setView((prev) => {
          const next = {
            ...prev,
            translateX: prev.translateX + dragState.current.deltaX,
            translateY: prev.translateY + dragState.current.deltaY
          };
          const constrained = pageMetrics ? constrainTranslation(next, containerSize, pageMetrics) : next;
          dragState.current.deltaX = 0;
          dragState.current.deltaY = 0;
          dragState.current.raf = 0;
          return constrained;
        });
      });
    }
  };

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) return;
      if (event.code === "Space") {
        event.preventDefault();
        setIsSpaceDown(true);
      }
      if (event.key.toLowerCase() === "z") {
        zoomAround(1.1);
      }
    },
    [zoomAround]
  );

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    if (event.code === "Space") {
      setIsSpaceDown(false);
      stopDrag();
    }
  }, [stopDrag]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  useEffect(() => {
    syncController.setPdfScroller((pageNumber, bbox) => {
      setCurrentPage(pageNumber);
      setView((prev) => {
        if (!pageMetrics) return prev;
        const targetScale = prev.scale;
        const centerX = bbox.x + bbox.w / 2;
        const centerY = bbox.y + bbox.h / 2;
        const translateX = containerSize.width / 2 - centerX * targetScale;
        const translateY = containerSize.height / 2 - centerY * targetScale;
        return constrainTranslation({ scale: targetScale, translateX, translateY }, containerSize, pageMetrics);
      });
    });
  }, [containerSize, pageMetrics]);

  const onMinimapNavigate = (next: { translateX: number; translateY: number }) => {
    setView((prev) => {
      const merged = { ...prev, ...next };
      return pageMetrics ? constrainTranslation(merged, containerSize, pageMetrics) : merged;
    });
  };

  const scaledSize = useMemo(() => {
    if (!pageMetrics) return { width: 0, height: 0 };
    return {
      width: pageMetrics.width * view.scale,
      height: pageMetrics.height * view.scale
    };
  }, [pageMetrics, view.scale]);

  const handlePageSelect = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    onPageChange?.(pageNumber);
  };

  const viewerClass = cn(
    "advanced-pdf-viewer",
    isSpaceDown && "is-pannable",
    (documentLoading || pageLoading) && "is-loading",
    className
  );

  return (
    <div className={viewerClass}>
      <Document
        file={fileUrl}
        onLoadSuccess={(doc) => handleDocumentLoad(doc as unknown as PDFDocumentProxy)}
        onLoadError={(e) => {
          console.error("Failed to load PDF document", e);
          setDocumentLoading(false);
        }}
        loading={
          <div className="pdf-loading-state">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading document…</span>
          </div>
        }
        noData={<div className="pdf-loading-state">No PDF selected</div>}
      >
        <div className="pdf-shell">
          <PdfThumbnailBar
            thumbnails={thumbnails}
            loading={thumbnailsLoading}
            activePage={currentPage}
            onSelect={handlePageSelect}
          />

          <div className="pdf-main">
            <div className="pdf-toolbar">
              <div className="pdf-toolbar-left">
                <Button variant="outline" size="sm" onClick={() => zoomAround(0.9)}>
                  <Minus className="h-4 w-4 mr-1" />
                  Zoom out
                </Button>
                <Button variant="outline" size="sm" onClick={() => zoomAround(1.1)}>
                  <Plus className="h-4 w-4 mr-1" />
                  Zoom in
                </Button>
                <Button variant="secondary" size="sm" onClick={resetView}>
                  <Maximize2 className="h-4 w-4 mr-1" />
                  Fit width
                </Button>
              </div>
              <div className="pdf-toolbar-right">
                <div className="pdf-toolbar-meta">
                  <span className="pdf-pill">
                    Page {currentPage} / {numPages || "—"}
                  </span>
                  <span className="pdf-pill">{(view.scale * 100).toFixed(0)}%</span>
                </div>
                <div className="pdf-toolbar-keys">
                  <Move className="h-4 w-4" />
                  <span>Space to drag</span>
                  <RotateCcw className="h-4 w-4" />
                  <span>Z to zoom</span>
                </div>
              </div>
            </div>

            <div
              ref={containerRef}
              className="pdf-stage"
              onWheel={handleWheel}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={stopDrag}
              onPointerLeave={stopDrag}
            >
              {!page && (
                <div className="pdf-loading-overlay">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Loading page…</span>
                </div>
              )}
              {page && (
                <div
                  className="pdf-surface"
                  style={{
                    width: scaledSize.width,
                    height: scaledSize.height,
                    transform: `translate(${view.translateX}px, ${view.translateY}px)`
                  }}
                >
                  <PdfCanvasRenderer
                    page={page}
                    scale={view.scale}
                    translateX={0}
                    translateY={0}
                    devicePixelRatio={getDevicePixelRatioSafe()}
                    onRender={(size) => setPageMetrics(size)}
                  />
                  <PdfLayerManager
                    page={currentPage}
                    pageSize={pageMetrics}
                    scale={view.scale}
                    translateX={0}
                    translateY={0}
                    boxes={aiBoxes}
                    heatmapPoints={heatmapPoints}
                    heatmapFilters={heatmapFilters}
                    heatmapOpacity={heatmapOpacity}
                    heatmapDebug={heatmapDebug}
                    syncMap={syncMap}
                    comments={comments}
                    onBoxClick={onBoxClick}
                    onCommentClick={onCommentClick}
                  />
                </div>
              )}
            </div>
          </div>

          <PdfMinimap
            previewSrc={minimapPreview}
            pageSize={pageMetrics}
            view={view}
            container={containerSize}
            onNavigate={onMinimapNavigate}
          />
        </div>
      </Document>
    </div>
  );
}
