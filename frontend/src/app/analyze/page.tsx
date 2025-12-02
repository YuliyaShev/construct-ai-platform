"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { FileListCard } from "@/components/analyze/FileListCard";
import { AnalyzePanel } from "@/components/analyze/AnalyzePanel";
import { PdfPreviewModal } from "@/components/analyze/PdfPreviewModal";
import { type FileRecord } from "@/components/analyze/types";

export default function AnalyzePage() {
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<FileRecord | null>(null);
  const [analysis, setAnalysis] = useState("");
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const loadFiles = useMemo(() => async () => {
    try {
      const res = await fetch("/api/files");
      if (!res.ok) throw new Error("Failed to load files");
      const data = await res.json();
      setFiles(data || []);
    } catch (err) {
      console.error(err);
      setMessage("Failed to load files.");
    }
  }, []);

  const handlePreview = async (record: FileRecord) => {
    try {
      setLoadingId(record.id);
      setMessage(null);
      const res = await fetch(`/api/download/${record.id}`);
      if (!res.ok) throw new Error("Preview failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setPreviewUrl((old) => {
        if (old) URL.revokeObjectURL(old);
        return url;
      });
      setPreviewOpen(true);
    } catch (err) {
      console.error(err);
      setMessage("Failed to preview file.");
    } finally {
      setLoadingId(null);
    }
  };

  const handleAnalyze = async (record: FileRecord) => {
    try {
      setSelected(record);
      setLoadingId(record.id);
      setMessage(`Analyzing ${record.original_name}...`);
      setAnalysis("");
      const res = await fetch(`/api/analyze/${record.id}`, { method: "POST" });
      if (!res.ok) throw new Error("Analyze failed");
      const data = await res.json();
      setAnalysis(data?.text || "No text extracted.");
      setMessage(`Analysis ready for ${record.original_name}`);
    } catch (err) {
      console.error(err);
      setMessage("Failed to analyze file.");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDownload = (record: FileRecord) => {
    setMessage(`Downloading ${record.original_name}...`);
    window.open(`/api/download/${record.id}`, "_blank");
  };

  useEffect(() => {
    loadFiles();
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [loadFiles, previewUrl]);

  return (
    <div className="mx-auto max-w-7xl p-6 lg:p-10 grid gap-6 lg:grid-cols-[320px_1fr]">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Workspace</p>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Analyze Files</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">Preview, analyze, and download uploaded shop drawings.</p>
          </div>
          <Button variant="outline" size="sm" onClick={loadFiles}>Refresh</Button>
        </div>

        <FileListCard
          files={files}
          search={search}
          onSearch={setSearch}
          onSelect={setSelected}
          onPreview={handlePreview}
          onAnalyze={handleAnalyze}
          onDownload={handleDownload}
          selectedId={selected?.id ?? null}
          busyId={loadingId}
        />
        {message && <div className="text-xs text-emerald-600">{message}</div>}
      </div>

      <AnalyzePanel file={selected} analysis={analysis} loading={!!loadingId && selected?.id === loadingId} />

      <PdfPreviewModal
        open={previewOpen}
        fileUrl={previewUrl}
        onClose={() => setPreviewOpen(false)}
        title={selected?.original_name || "Selected PDF"}
      />
    </div>
  );
}
