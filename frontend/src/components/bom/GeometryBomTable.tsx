"use client";

type Profile = {
  name?: string;
  length?: number;
  quantity?: number;
  material?: string;
};

export function GeometryBomTable({ profiles }: { profiles: Profile[] }) {
  if (!profiles?.length) {
    return <div className="text-sm text-slate-500 border rounded-lg p-4">No geometry profiles.</div>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th className="px-3 py-2 text-left">Profile</th>
            <th className="px-3 py-2 text-left">Length</th>
            <th className="px-3 py-2 text-left">Qty</th>
            <th className="px-3 py-2 text-left">Material</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {profiles.map((p, idx) => (
            <tr key={idx} className="odd:bg-white even:bg-slate-50/60">
              <td className="px-3 py-2 font-medium text-slate-900">{p.name || "—"}</td>
              <td className="px-3 py-2">{p.length ?? "—"}</td>
              <td className="px-3 py-2">{p.quantity ?? "—"}</td>
              <td className="px-3 py-2">{p.material || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
