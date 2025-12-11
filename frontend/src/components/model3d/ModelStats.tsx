"use client";

type Props = {
  stats: { total_members?: number; total_mesh_faces?: number };
};

export function ModelStats({ stats }: Props) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/60 p-4 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-500">3D Model Stats</p>
        <div className="text-sm text-slate-700 dark:text-slate-200">
          Members: {stats?.total_members ?? 0} · Faces: {stats?.total_mesh_faces ?? 0}
        </div>
      </div>
    </div>
  );
}
