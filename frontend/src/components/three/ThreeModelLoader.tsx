"use client";

import React, { useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { syncController } from "../sync/controllers/SyncController";
import type { SyncMap } from "../sync/types/sync";

type Props = {
  url: string;
  syncMap: SyncMap;
};

/**
 * Loads a GLTF model and registers object references for sync highlighting.
 * (Extend with OBJ/IFC loaders if needed.)
 */
export function ThreeModelLoader({ url, syncMap }: Props) {
  const { scene, nodes } = useGLTF(url);

  useEffect(() => {
    Object.values(nodes).forEach((node: any) => {
      if (!node?.name) return;
      if (syncMap[node.name]) {
        syncController.setObjectRef(node.name, node);
      }
    });
  }, [nodes, syncMap]);

  return <primitive object={scene} />;
}
