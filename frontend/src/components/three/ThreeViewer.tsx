"use client";

import React, { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Raycaster, Vector2 } from "three";
import { ThreeModelLoader } from "./ThreeModelLoader";
import { ThreeSyncHighlight } from "./ThreeSyncHighlight";
import { syncController } from "../sync/controllers/SyncController";
import { useSelectionStore } from "../sync/hooks/useSelectionStore";
import type { SyncMap } from "../sync/types/sync";

type Props = {
  modelUrl: string;
  syncMap: SyncMap;
  className?: string;
};

function ClickHandler({ syncMap }: { syncMap: SyncMap }) {
  const raycaster = useMemo(() => new Raycaster(), []);
  const mouse = useMemo(() => new Vector2(), []);
  const { camera, scene, gl } = useThree();
  const setSelectedElement = useSelectionStore((s) => s.setSelectedElement);

  const handleClick = React.useCallback(
    (event: MouseEvent) => {
      const rect = gl.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);
      const hit = intersects.find((i) => syncMap[i.object.name]);
      if (hit) {
        const id = hit.object.name;
        const el = syncMap[id];
        setSelectedElement(id, el?.page ?? null);
        syncController.handleThreeSelection(id);
      }
    },
    [camera, gl.domElement, mouse, raycaster, scene.children, setSelectedElement, syncMap]
  );

  useFrame(() => {
    gl.domElement.style.cursor = "auto";
  });

  React.useEffect(() => {
    gl.domElement.addEventListener("click", handleClick);
    return () => gl.domElement.removeEventListener("click", handleClick);
  }, [gl.domElement, handleClick]);

  return null;
}

export function ThreeViewer({ modelUrl, syncMap, className }: Props) {
  return (
    <div className={className}>
      <Canvas>
        <PerspectiveCamera makeDefault position={[6, 6, 10]} fov={50} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 10]} intensity={0.8} />
        <Suspense fallback={null}>
          <ThreeModelLoader url={modelUrl} syncMap={syncMap} />
        </Suspense>
        <OrbitControls enableDamping />
        <ClickHandler syncMap={syncMap} />
        <ThreeSyncHighlight />
      </Canvas>
    </div>
  );
}
