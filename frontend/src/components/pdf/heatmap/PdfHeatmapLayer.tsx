"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useHeatmapEngine, type HeatmapViewport } from "./useHeatmapEngine";
import type { HeatmapFilters, HeatmapPoint } from "./types/heatmap";
import type { PageMetrics } from "@/helpers/pdfViewport";

type Props = {
  points: HeatmapPoint[];
  pageSize: PageMetrics | null;
  scale: number;
  translateX: number;
  translateY: number;
  opacity?: number;
  filters?: HeatmapFilters;
  debug?: boolean;
};

const DEFAULT_FILTERS: HeatmapFilters = { high: true, medium: true, low: true };

export function PdfHeatmapLayer({
  points,
  pageSize,
  scale,
  translateX,
  translateY,
  opacity = 0.82,
  filters = DEFAULT_FILTERS,
  debug = false
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [fps, setFps] = useState(0);
  const [engineReady, setEngineReady] = useState(false);
  const { initWebGL, uploadPoints, render, resize, dispose } = useHeatmapEngine();
  const frameRef = useRef<number>(0);
  const lastFrameRef = useRef<number>(performance.now());

  const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;

  const filteredPoints = useMemo(() => {
    const enabled = { ...DEFAULT_FILTERS, ...filters };
    return points.filter((p) => enabled[p.severity]);
  }, [points, filters]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !pageSize) return;
    let cancelled = false;
    initWebGL(canvas).then(() => {
      if (cancelled) return;
      setEngineReady(true);
    });
    return () => {
      cancelled = true;
      setEngineReady(false);
      dispose();
    };
  }, [initWebGL, pageSize, dispose]);

  useEffect(() => {
    if (!pageSize || !engineReady) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const width = pageSize.width * scale;
    const height = pageSize.height * scale;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    canvas.width = Math.max(1, Math.floor(width * dpr));
    canvas.height = Math.max(1, Math.floor(height * dpr));
    resize(width, height, dpr);
  }, [pageSize, scale, dpr, resize, engineReady]);

  useEffect(() => {
    if (!pageSize || !engineReady) return;
    uploadPoints(filteredPoints, pageSize.width, pageSize.height);
  }, [filteredPoints, pageSize, uploadPoints, engineReady]);

  useEffect(() => {
    if (!pageSize || !engineReady) return;
    const animate = () => {
      const now = performance.now();
      const delta = now - lastFrameRef.current;
      lastFrameRef.current = now;
      if (debug && delta > 0) {
        setFps(Math.round(1000 / delta));
      }

      const viewport: HeatmapViewport = {
        scale,
        translateX,
        translateY,
        pageWidth: pageSize.width,
        pageHeight: pageSize.height,
        opacity,
        dpr
      };
      render(viewport);
      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(frameRef.current);
    };
  }, [pageSize, scale, translateX, translateY, opacity, dpr, debug, render]);

  if (!pageSize) return null;

  return (
    <div
      className="pdf-heatmap-layer"
      style={{
        width: pageSize.width * scale,
        height: pageSize.height * scale,
        transform: `translate(${translateX}px, ${translateY}px)`
      }}
    >
      <canvas ref={canvasRef} className="pdf-heatmap-canvas" />
      {debug ? (
        <div className="pdf-heatmap-debug">
          <div>FPS: {fps}</div>
          <div>Points: {filteredPoints.length}</div>
        </div>
      ) : null}
      {debug ? <div className="pdf-heatmap-bounds" /> : null}
    </div>
  );
}
