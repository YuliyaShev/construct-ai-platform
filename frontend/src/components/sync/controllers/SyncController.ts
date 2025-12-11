"use client";

import { Vector3 } from "three";
import { animate } from "framer-motion";
import { useSelectionStore } from "../hooks/useSelectionStore";
import type { SyncElement, SyncMap } from "../types/sync";

type PdfScroller = (page: number, bbox: SyncElement["bbox"]) => void;
type ThreeHighlighter = (id: string, position: [number, number, number]) => void;

/**
 * Central glue for 2D/3D selection sync.
 * Consumers register callbacks from PDF/3D viewers; controller relays selection updates.
 */
class SyncController {
  private syncMap: SyncMap = {};
  private objectRefs: Map<string, any> = new Map();
  private onScrollPdf?: PdfScroller;
  private onHighlight3D?: ThreeHighlighter;

  setSyncMap(map: SyncMap) {
    this.syncMap = map;
  }

  setPdfScroller(fn: PdfScroller) {
    this.onScrollPdf = fn;
  }

  setThreeHighlighter(fn: ThreeHighlighter) {
    this.onHighlight3D = fn;
  }

  highlightElement3D(id: string) {
    const el = this.syncMap[id];
    if (!el || !this.onHighlight3D) return;
    this.onHighlight3D(el.id, el.position3D);
  }

  highlightElement2D(id: string) {
    const el = this.syncMap[id];
    if (!el || !this.onScrollPdf) return;
    this.onScrollPdf(el.page, el.bbox);
  }

  handlePdfSelection(id: string) {
    const el = this.syncMap[id];
    if (!el) return;
    useSelectionStore.getState().setSelectedElement(id, el.page);
    this.highlightElement3D(id);
  }

  handleThreeSelection(id: string) {
    const el = this.syncMap[id];
    if (!el) return;
    useSelectionStore.getState().setSelectedElement(id, el.page);
    this.highlightElement2D(id);
  }

  scrollPdfToElement(page: number, bbox: SyncElement["bbox"]) {
    if (this.onScrollPdf) this.onScrollPdf(page, bbox);
  }

  setObjectRef(id: string, obj: any) {
    this.objectRefs.set(id, obj);
  }

  getObjectRef(id: string) {
    return this.objectRefs.get(id);
  }

  focusCameraTo(position: [number, number, number], lerpFn: (target: Vector3) => void) {
    const target = new Vector3(...position);
    const current = new Vector3();
    lerpFn(current); // populate current via passed closure
    animate(0, 1, {
      duration: 0.6,
      ease: "easeOut",
      onUpdate: (t) => {
        const next = current.clone().lerp(target, t);
        lerpFn(next);
      }
    });
  }
}

export const syncController = new SyncController();
