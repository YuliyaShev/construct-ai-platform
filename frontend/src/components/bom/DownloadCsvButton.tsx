"use client";

type Item = Record<string, any>;

function toCsv(items: Item[]) {
  if (!items.length) return "";
  const headers = Object.keys(items[0]);
  const rows = items.map((item) => headers.map((h) => JSON.stringify(item[h] ?? "")).join(","));
  return [headers.join(","), ...rows].join("\n");
}

export function DownloadCsvButton({ items }: { items: Item[] }) {
  const download = () => {
    const csv = toCsv(items || []);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bom.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={download}
      className="rounded-md border border-slate-200 px-3 py-2 text-sm font-medium hover:bg-slate-50"
      disabled={!items?.length}
    >
      Download CSV
    </button>
  );
}
