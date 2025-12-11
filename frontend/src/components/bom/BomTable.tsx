"use client";

type Item = {
  name?: string;
  qty?: number;
  unit?: string;
  location?: string;
  notes?: string;
  group?: string;
};

export function BomTable({ items }: { items: Item[] }) {
  if (!items?.length) {
    return <div className="text-sm text-slate-500 border rounded-lg p-4">No BOM items.</div>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th className="px-3 py-2 text-left">Item</th>
            <th className="px-3 py-2 text-left">Qty</th>
            <th className="px-3 py-2 text-left">Unit</th>
            <th className="px-3 py-2 text-left">Location</th>
            <th className="px-3 py-2 text-left">Notes</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {items.map((item, idx) => (
            <tr key={idx} className="odd:bg-white even:bg-slate-50/60">
              <td className="px-3 py-2 font-medium text-slate-900">{item.name || "—"}</td>
              <td className="px-3 py-2">{item.qty ?? "—"}</td>
              <td className="px-3 py-2">{item.unit || "—"}</td>
              <td className="px-3 py-2">{item.location || "—"}</td>
              <td className="px-3 py-2 text-slate-600">{item.notes || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
