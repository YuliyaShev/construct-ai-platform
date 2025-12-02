"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardList, FilePlus2, Ruler, Boxes, FileStack, Image as ImageIcon, Home } from "lucide-react";

const items = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/upload", label: "Upload PDF", icon: FilePlus2 },
  { href: "/shop-drawing", label: "Shop Drawing", icon: Ruler },
  { href: "/bom", label: "BOM Extractor", icon: Boxes },
  { href: "/rfi", label: "RFIs", icon: FileStack },
  { href: "/image", label: "Image AI", icon: ImageIcon }
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden md:flex flex-col border-r border-slate-200 bg-white px-4 py-6" style={{ width: "var(--sidebar-width)" }}>
      <div className="text-xl font-semibold text-brand-700 px-3 mb-8">Construct AI</div>
      <nav className="flex-1 space-y-2">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                active ? "bg-brand-50 text-brand-700 font-semibold" : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="text-xs text-slate-500 px-3">v1.0 · AI Construction Suite</div>
    </aside>
  );
}
