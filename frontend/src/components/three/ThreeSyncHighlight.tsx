"use client";

import { useEffect } from "react";
import { Color } from "three";
import { useFrame } from "@react-three/fiber";
import { useSelectionStore } from "../sync/hooks/useSelectionStore";
import { syncController } from "../sync/controllers/SyncController";

const glowColor = new Color("#3b82f6");

export function ThreeSyncHighlight() {
  const { selectedElementId } = useSelectionStore();

  useEffect(() => {
    if (!selectedElementId) return;
    syncController.highlightElement3D(selectedElementId);
  }, [selectedElementId]);

  useFrame(({ clock }) => {
    if (!selectedElementId) return;
    const obj = syncController.getObjectRef(selectedElementId);
    if (!obj || !obj.material) return;
    const t = (Math.sin(clock.elapsedTime * 3) + 1) / 2;
    if (obj.material.emissive) {
      obj.material.emissive.copy(glowColor).multiplyScalar(0.4 + t * 0.3);
    }
    obj.scale.setScalar(1.0 + t * 0.015);
  });

  return null;
}
