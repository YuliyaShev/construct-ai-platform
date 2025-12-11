"use client";

import React from "react";
import { cn } from "@/lib/helpers";
import type { PageMetrics } from "@/helpers/pdfViewport";
import { useSelectionStore } from "../sync/hooks/useSelectionStore";
import type { SyncMap } from "../sync/types/sync";
import { PdfSyncHighlight } from "./PdfSyncHighlight";
import { PdfHeatmapLayer } from "./heatmap/PdfHeatmapLayer";
import type { HeatmapFilters, HeatmapPoint } from "./heatmap/types/heatmap";

export type PdfAiBox = {
  id: string;
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
  label?: string;
  score?: number;
  color?: string;
};

export type PdfCommentMarker = {
  id: string;
  page: number;
  x: number;
  y: number;
  text: string;
  author?: string;
  color?: string;
};

type Props = {
  page: number;
  pageSize: PageMetrics | null;
  scale: number;
  translateX: number;
  translateY: number;
  boxes?: PdfAiBox[];
  heatmapPoints?: HeatmapPoint[];
  heatmapFilters?: HeatmapFilters;
  heatmapOpacity?: number;
  heatmapDebug?: boolean;
  syncMap?: SyncMap;
  comments?: PdfCommentMarker[];
  onBoxClick?: (box: PdfAiBox) => void;
  onCommentClick?: (comment: PdfCommentMarker) => void;
};

export function PdfLayerManager({
  page,
  pageSize,
  scale,
  translateX,
  translateY,
  boxes = [],
  heatmapPoints = [],
  heatmapFilters,
  heatmapOpacity,
  heatmapDebug,
  syncMap = {},
  comments = [],
  onBoxClick,
  onCommentClick
}: Props) {
  if (!pageSize) return null;

  const width = pageSize.width * scale;
  const height = pageSize.height * scale;

  const filteredBoxes = boxes.filter((b) => b.page === page);
  const filteredHeatmap = heatmapPoints.filter((p) => !p.page || p.page === page);
  const filteredComments = comments.filter((c) => c.page === page);
  const setSelectedElement = useSelectionStore((s) => s.setSelectedElement);

  return (
    <div
      className="pdf-layer-manager"
      style={{
        width,
        height,
        transform: `translate(${translateX}px, ${translateY}px)`
      }}
    >
      <div className="pdf-layer pdf-layer-boxes">
        {filteredBoxes.map((box) => {
          const left = box.x * pageSize.width * scale;
          const top = box.y * pageSize.height * scale;
          const w = box.width * pageSize.width * scale;
          const h = box.height * pageSize.height * scale;
          const color = box.color || "rgba(79, 70, 229, 0.85)";
          return (
            <div
              key={box.id}
              className="pdf-ai-box"
              style={{
                left,
                top,
                width: w,
                height: h,
                borderColor: color,
                boxShadow: `0 0 0 1px ${color}`
              }}
              onClick={() => {
                setSelectedElement(box.id, box.page);
                onBoxClick?.(box);
              }}
            >
              {(box.label || box.score) && (
                <div className="pdf-ai-box__label" style={{ background: color }}>
                  {box.label}
                  {typeof box.score === "number" ? ` ${(box.score * 100).toFixed(0)}%` : ""}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <PdfHeatmapLayer
        points={filteredHeatmap}
        pageSize={pageSize}
        scale={scale}
        translateX={0}
        translateY={0}
        opacity={heatmapOpacity}
        filters={heatmapFilters}
        debug={heatmapDebug}
      />
      <PdfSyncHighlight
        syncMap={syncMap}
        page={page}
        pageSize={pageSize}
        scale={scale}
        translateX={0}
        translateY={0}
      />

      <div className="pdf-layer pdf-layer-comments">
        {filteredComments.map((comment) => {
          const x = comment.x * pageSize.width * scale;
          const y = comment.y * pageSize.height * scale;
          return (
            <div
              key={comment.id}
              className={cn("pdf-comment-pin")}
              style={{
                left: x - 10,
                top: y - 10,
                backgroundColor: comment.color || "#0EA5E9"
              }}
              title={comment.text}
              onClick={() => onCommentClick?.(comment)}
            >
              <span className="pdf-comment-pin__dot" />
              <span className="pdf-comment-pin__text">{comment.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
