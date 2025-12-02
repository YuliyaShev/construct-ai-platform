"use client";

import { useEffect, useState } from "react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { RecentFilesTable } from "@/components/dashboard/RecentFilesTable";
import { RecentRFIs } from "@/components/dashboard/RecentRFIs";
import { AISummaryCard } from "@/components/dashboard/AISummaryCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/analyze/Primitives";
import { FileStack, Layers, AlertTriangle, MessageSquare } from "lucide-react";

type FileRow = {
  id: number;
  original_name: string;
  created_at?: string;
  status?: "uploaded" | "analyzed";
  severity?: "error" | "warning" | "info" | null;
};

type RFI = {
  rfi_number: string;
  title: string;
  issue_type?: string;
  severity?: "error" | "warning" | "info";
  created_at?: string;
};

type Stats = {
  total_files: number;
  analyzed_files: number;
  total_issues: number;
  total_rfis: number;
};

export default function DashboardPage() {
  const [files, setFiles] = useState<FileRow[]>([]);
  const [rfis, setRFIs] = useState<RFI[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [aiSummary, setAiSummary] = useState("");
  const [aiStatus, setAiStatus] = useState("ready");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [filesRes, rfiRes, statusRes, summaryRes] = await Promise.all([
          fetch("/api/files"),
          fetch("/api/rfi"),
          fetch("/api/ai/status"),
          fetch("/api/ai/summary"),
        ]);
        if (filesRes.ok) {
          const data = await filesRes.json();
          setFiles(data || []);
          setStats((prev) => ({
            total_files: data.length,
            analyzed_files: data.filter((f: any) => f.status === "analyzed").length,
            total_issues: prev?.total_issues ?? 0,
            total_rfis: prev?.total_rfis ?? 0,
          }));
        }
        if (rfiRes.ok) {
          const r = await rfiRes.json();
          setRFIs(r || []);
          setStats((prev) => ({
            total_files: prev?.total_files ?? 0,
            analyzed_files: prev?.analyzed_files ?? 0,
            total_issues: prev?.total_issues ?? 0,
            total_rfis: r.length,
          }));
        }
        if (statusRes.ok) {
          const s = await statusRes.json();
          setAiStatus(s?.status || "ready");
        }
        if (summaryRes.ok) {
          const s = await summaryRes.json();
          setAiSummary(s?.summary || "");
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="mx-auto max-w-7xl p-6 lg:p-10 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Construct AI</p>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Dashboard</h1>
        </div>
        <Button>New Upload</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {loading ? (
          <>
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </>
        ) : (
          <>
            <DashboardCard title="Total Files" value={stats?.total_files ?? 0} icon={FileStack} />
            <DashboardCard title="Analyzed Files" value={stats?.analyzed_files ?? 0} icon={Layers} tone="success" />
            <DashboardCard title="Issues Detected" value={stats?.total_issues ?? 0} icon={AlertTriangle} tone="warning" />
            <DashboardCard title="RFIs Generated" value={stats?.total_rfis ?? 0} icon={MessageSquare} tone="danger" />
          </>
        )}
      </div>

      <DashboardSection title="AI System Summary">
        {loading ? <Skeleton className="h-20 w-full rounded-lg" /> : <AISummaryCard summary={aiSummary} status={aiStatus} lastActivity="just now" />}
      </DashboardSection>

      <DashboardSection title="Quick Actions">
        <QuickActions
          onUpload={() => (window.location.href = "/upload")}
          onAnalyze={() => (window.location.href = "/analyze")}
          onViewFiles={() => (window.location.href = "/upload")}
          onCreateRFI={() => (window.location.href = "/analyze")}
        />
      </DashboardSection>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <DashboardSection title="Recent Files">
          {loading ? (
            <Skeleton className="h-40 w-full rounded-xl" />
          ) : (
            <RecentFilesTable
              files={files}
              onPreview={(f) => window.open(`/api/files/${f.id}/download`, "_blank")}
              onAnalyze={(f) => (window.location.href = `/analyze/${f.id}`)}
              onDownload={(f) => window.open(`/api/files/${f.id}/download`, "_blank")}
            />
          )}
        </DashboardSection>
        <DashboardSection title="Recent RFIs">
          {loading ? <Skeleton className="h-40 w-full rounded-xl" /> : <RecentRFIs rfis={rfis} onDownload={(r) => window.open(`/api/rfi/${r.rfi_number}/pdf`, "_blank")} />}
        </DashboardSection>
      </div>
    </div>
  );
}
