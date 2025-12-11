"use client";

type Panel = {
  id?: string | number;
  area_sqft?: number;
  area_sqm?: number;
  thickness?: string;
  notes?: string;
};

export function GlassBomTable({ panels, unit }: { panels: Panel[]; unit: "imperial" | "metric" }) {
  if (!panels?.length) {
    return <div className="text-sm text-slate-500 border rounded-lg p-4">No glass panels.</div>;
  }
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th className="px-3 py-2 text-left">Panel</th>
            <th className="px-3 py-2 text-left">Area</th>
            <th className="px-3 py-2 text-left">Thickness</th>
            <th className="px-3 py-2 text-left">Notes</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {panels.map((p, idx) => (
            <tr key={p.id ?? idx} className="odd:bg-white even:bg-slate-50/60">
              <td className="px-3 py-2 font-medium text-slate-900">{p.id ?? `#${idx + 1}`}</td>
              <td className="px-3 py-2">
                {unit === "imperial" ? `${p.area_sqft ?? 0} sqft` : `${p.area_sqm ?? 0} sqm`}
              </td>
              <td className="px-3 py-2">{p.thickness || "—"}</td>
              <td className="px-3 py-2 text-slate-600">{p.notes || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
