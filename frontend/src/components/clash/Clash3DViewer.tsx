"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";

type MeshModel = { vertices: number[][]; faces: number[][] };

type Clash = {
  id: string;
  severity: string;
  location?: { x: number; y: number; z?: number };
};

type Props = {
  model?: MeshModel;
  clashes?: Clash[];
};

function MeshFromData({ model }: { model: MeshModel }) {
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

export function Clash3DViewer({ model, clashes = [] }: Props) {
  return (
    <div className="h-[420px] w-full rounded-xl border border-slate-200 dark:border-zinc-800 overflow-hidden">
      <Canvas camera={{ position: [0, 0, 250], near: 0.1, far: 5000 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[200, 200, 200]} intensity={0.9} />
        <gridHelper args={[500, 20]} />
        <OrbitControls />
        {model && model.vertices?.length ? <MeshFromData model={model} /> : null}
        {clashes.map((c) =>
          c.location ? (
            <mesh key={c.id} position={[c.location.x, c.location.y, c.location.z || 0]}>
              <sphereGeometry args={[4, 16, 16]} />
              <meshStandardMaterial color={c.severity === "high" ? "red" : c.severity === "medium" ? "orange" : "skyblue"} emissiveIntensity={0.6} />
            </mesh>
          ) : null
        )}
      </Canvas>
    </div>
  );
}
