"use client";

type Props = {
  onChange: (category: string) => void;
};

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "structural", label: "Structural" },
  { id: "glass", label: "Glass" },
  { id: "hardware", label: "Hardware" },
  { id: "misc", label: "Misc" }
];

export function CategoryTabs({ onChange }: Props) {
  return (
    <div className="flex gap-2">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className="rounded-md border border-slate-200 px-3 py-1 text-sm hover:bg-slate-50"
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
