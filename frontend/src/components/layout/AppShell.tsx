"use client";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="layout-shell">
      <Sidebar />
      <div className="flex flex-col min-h-screen">
        <Topbar />
        <main className="p-6 bg-slate-50 flex-1">{children}</main>
      </div>
    </div>
  );
}
