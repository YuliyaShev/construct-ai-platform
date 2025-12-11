"use client";

type Photo = { url: string; caption?: string };

export function PunchPhotoViewer({ photos }: { photos: Photo[] }) {
  if (!photos?.length) return <div className="text-sm text-slate-500">No photos uploaded.</div>;
  return (
    <div className="grid grid-cols-2 gap-2">
      {photos.map((p, idx) => (
        <div key={idx} className="rounded-lg overflow-hidden border border-slate-200 dark:border-zinc-800">
          <img src={p.url} alt={p.caption || "photo"} className="w-full h-32 object-cover" />
          <div className="text-xs text-slate-600 dark:text-slate-300 px-2 py-1">{p.caption}</div>
        </div>
      ))}
    </div>
  );
}
