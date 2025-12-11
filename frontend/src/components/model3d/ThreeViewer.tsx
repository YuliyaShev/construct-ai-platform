"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useMemo, useState } from "react";
import * as THREE from "three";

type Props = {
  model: { vertices: number[][]; faces: number[][] };
};

function MeshFromData({ model }: Props) {
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(model.vertices.flat());
    const indices = new Uint32Array(model.faces.flat());
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setIndex(new THREE.BufferAttribute(indices, 1));
    geo.computeVertexNormals();
    return geo;
  }, [model]);

  return (
    <mesh geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial color="#8ab4f8" metalness={0.2} roughness={0.7} />
    </mesh>
  );
}

export function ThreeViewer({ model }: Props) {
  return (
    <div className="h-[480px] w-full rounded-xl border border-slate-200 dark:border-zinc-800 overflow-hidden">
      <Canvas camera={{ position: [0, 0, 200], near: 0.1, far: 5000 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[200, 200, 200]} intensity={0.8} />
        <OrbitControls />
        <gridHelper args={[500, 20]} />
        {model?.vertices?.length ? <MeshFromData model={model} /> : null}
      </Canvas>
    </div>
  );
}
