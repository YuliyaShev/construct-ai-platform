"use client";

import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";

const titles: Record<string, string> = {
  "/": "Dashboard",
  "/upload": "Upload & Analyze PDF",
  "/shop-drawing": "Shop Drawing Checker",
  "/bom": "BOM Extractor",
  "/compare": "Compare Revisions",
  "/rfi": "Auto RFI Generator",
  "/image": "Image Analyzer"
};

export default function Topbar() {
  const pathname = usePathname();
  const title = titles[pathname] ?? "Workspace";
  return (
    <header className="topbar px-6 py-4 flex items-center justify-between">
      <div className="text-lg font-semibold text-slate-800">{title}</div>
      <div className="flex items-center gap-3 text-slate-500">
        <button className="p-2 rounded-full hover:bg-slate-100">
          <Bell size={18} />
        </button>
      </div>
    </header>
  );
}
