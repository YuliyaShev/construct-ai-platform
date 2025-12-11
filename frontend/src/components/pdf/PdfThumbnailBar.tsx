"use client";

import React from "react";
import { cn } from "@/lib/helpers";

export type PdfThumbnail = {
  pageNumber: number;
  src: string;
  width: number;
  height: number;
};

type Props = {
  thumbnails: PdfThumbnail[];
  loading?: boolean;
  activePage: number;
  onSelect: (page: number) => void;
};

export function PdfThumbnailBar({ thumbnails, loading = false, activePage, onSelect }: Props) {
  return (
    <div className="pdf-thumbnail-bar">
      <div className="pdf-thumbnail-header">Pages</div>
      <div className="pdf-thumbnail-list">
        {loading && !thumbnails.length
          ? Array.from({ length: 4 }).map((_, idx) => <div key={idx} className="pdf-thumbnail-card pdf-skeleton" />)
          : thumbnails.map((thumb) => (
              <button
                key={thumb.pageNumber}
                className={cn("pdf-thumbnail-card", activePage === thumb.pageNumber && "is-active")}
                type="button"
                onClick={() => onSelect(thumb.pageNumber)}
              >
                <img
                  src={thumb.src}
                  alt={`Page ${thumb.pageNumber}`}
                  className="pdf-thumbnail-image"
                  width={thumb.width}
                  height={thumb.height}
                />
                <div className="pdf-thumbnail-label">Page {thumb.pageNumber}</div>
              </button>
            ))}
      </div>
    </div>
  );
}
