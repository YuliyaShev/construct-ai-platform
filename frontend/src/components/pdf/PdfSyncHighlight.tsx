"use client";

import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelectionStore } from "../sync/hooks/useSelectionStore";
import type { SyncMap } from "../sync/types/sync";
import type { PageMetrics } from "@/helpers/pdfViewport";

type Props = {
  syncMap: SyncMap;
  page: number;
  pageSize: PageMetrics | null;
  scale: number;
  translateX: number;
  translateY: number;
};

export function PdfSyncHighlight({ syncMap, page, pageSize, scale, translateX, translateY }: Props) {
  const { selectedElementId } = useSelectionStore();

  const bbox = useMemo(() => {
    if (!selectedElementId || !pageSize) return null;
    const item = syncMap[selectedElementId];
    if (!item || item.page !== page) return null;
    const { x, y, w, h } = item.bbox;
    return {
      left: x * scale + translateX,
      top: y * scale + translateY,
      width: w * scale,
      height: h * scale
    };
  }, [selectedElementId, syncMap, page, pageSize, scale, translateX, translateY]);

  return (
    <AnimatePresence>
      {bbox ? (
        <motion.div
          className="pdf-sync-highlight"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          style={{
            left: bbox.left,
            top: bbox.top,
            width: bbox.width,
            height: bbox.height
          }}
        >
          <motion.div
            className="pdf-sync-highlight__pulse"
            animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.35, 0.5] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
