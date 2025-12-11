"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

type Element = { id: string; location?: { x: number; y: number; level?: number }; risk?: string; type?: string };

function ElementMesh({ element }: { element: Element }) {
  const color = element.risk === "high" ? "red" : element.risk === "medium" ? "orange" : "green";
  const x = element.location?.x || 0;
  const y = element.location?.y || 0;
  const z = (element.location?.level || 0) * 3;
  return (
    <mesh position={[x, z, y]}>
      <boxGeometry args={[0.5, 3, 0.5]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

export function Structural3DViewer({ elements }: { elements?: Element[] }) {
  return (
    <div className="h-[360px] w-full rounded-xl border border-slate-200 dark:border-zinc-800 overflow-hidden">
      <Canvas camera={{ position: [8, 8, 8], near: 0.1, far: 1000 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={0.8} />
        <OrbitControls />
        <gridHelper args={[20, 20]} />
        {elements?.map((e) => (
          <ElementMesh key={e.id} element={e} />
        ))}
      </Canvas>
    </div>
  );
}
