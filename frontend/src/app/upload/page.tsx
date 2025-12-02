"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import FileDropzone from "@/components/pdf/FileDropzone";
import PdfPreview from "@/components/pdf/PdfPreview";

type FileRecord = {
  id: number;
  original_name: string;
  filename: string;
  content_type: string;
  size: number;
  created_at: string;
};

const formatSize = (size: number) => {
  if (!size) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const idx = Math.min(Math.floor(Math.log(size) / Math.log(1024)), units.length - 1);
  const value = size / Math.pow(1024, idx);
  return `${value.toFixed(value >= 10 || idx === 0 ? 0 : 1)} ${units[idx]}`;
};

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewTitle, setPreviewTitle] = useState<string | undefined>(undefined);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  const fetchFiles = async () => {
    try {
      const res = await fetch("/api/files");
      if (!res.ok) throw new Error("Failed to load files");
      const data = await res.json();
      setFiles(data || []);
    } catch (err) {
      console.error(err);
      setMessage("Failed to load files.");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a PDF file.");
      return;
    }
    try {
      setUploading(true);
      setMessage(null);
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload-pdf", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      await res.json();
      setMessage(`Uploaded ${file.name}`);
      setFile(null);
      setAnalysis(null);
      await fetchFiles();
    } catch (err) {
      console.error(err);
      setMessage("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handlePreview = async (record: FileRecord) => {
    try {
      setBusyId(record.id);
      setMessage(null);
      const res = await fetch(`/api/files/${record.id}/download`);
      if (!res.ok) throw new Error("Preview failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setPreviewUrl((old) => {
        if (old) URL.revokeObjectURL(old);
        return url;
      });
      setPreviewTitle(record.original_name);
      setPreviewOpen(true);
    } catch (err) {
      console.error(err);
      setMessage("Failed to load preview.");
    } finally {
      setBusyId(null);
    }
  };

  const handleAnalyze = async (record: FileRecord) => {
    try {
      setBusyId(record.id);
      setMessage(`Analyzing ${record.original_name}...`);
      const res = await fetch(`/api/files/${record.id}/analyze`, { method: "POST" });
      if (!res.ok) throw new Error("Analyze failed");
      const data = await res.json();
      setAnalysis(data?.text || "No text extracted.");
      setMessage(`Analysis ready for ${record.original_name}`);
    } catch (err) {
      console.error(err);
      setMessage("Failed to analyze file.");
    } finally {
      setBusyId(null);
    }
  };

  const handleDownload = (record: FileRecord) => {
    setMessage(`Downloading ${record.original_name}...`);
    window.open(`/api/files/${record.id}/download`, "_blank");
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <div className="mx-auto max-w-6xl p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900">Upload & File Management</h1>
        <p className="text-sm text-slate-600">Drop PDFs, store them, preview, download, and run quick text extraction.</p>
      </div>

      <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm font-semibold text-slate-800">Upload a PDF</div>
            <div className="text-xs text-slate-500">Preferred format: PDF</div>
          </div>
          <Button onClick={handleUpload} disabled={uploading || !file}>
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </div>
        <FileDropzone accept=".pdf" onFile={(f) => setFile(f)} />
        {file && <div className="mt-2 text-sm text-slate-700">Selected: <span className="font-semibold">{file.name}</span></div>}
        {message && <div className="mt-2 text-xs text-emerald-600">{message}</div>}
      </div>

      <div className="rounded-xl border bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div>
            <div className="text-sm font-semibold text-slate-800">Files</div>
            <div className="text-xs text-slate-500">Showing {files.length} file(s)</div>
          </div>
          <Button variant="outline" size="sm" onClick={fetchFiles}>Refresh</Button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <THead>
              <TR>
                <TH>Name</TH>
                <TH>Size</TH>
                <TH>Created</TH>
                <TH className="text-right">Actions</TH>
              </TR>
            </THead>
            <TBody>
              {files.length === 0 && (
                <TR>
                  <TD colSpan={4} className="text-center text-slate-500 py-6">No files uploaded yet.</TD>
                </TR>
              )}
              {files.map((f) => (
                <TR key={f.id}>
                  <TD className="font-semibold text-slate-900">{f.original_name}</TD>
                  <TD>{formatSize(f.size)}</TD>
                  <TD>{f.created_at ? new Date(f.created_at).toLocaleString() : "—"}</TD>
                  <TD>
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="secondary" onClick={() => handlePreview(f)} disabled={busyId === f.id}>Preview</Button>
                      <Button size="sm" variant="outline" onClick={() => handleAnalyze(f)} disabled={busyId === f.id}>Analyze</Button>
                      <Button size="sm" onClick={() => handleDownload(f)}>Download</Button>
                    </div>
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </div>
      </div>

      {analysis && (
        <div className="rounded-xl border bg-white shadow-sm p-4">
          <div className="text-sm font-semibold text-slate-800 mb-2">Analysis Result</div>
          <pre className="text-xs text-slate-800 whitespace-pre-wrap max-h-96 overflow-auto">{analysis}</pre>
        </div>
      )}

      <PdfPreview
        open={previewOpen}
        fileUrl={previewUrl}
        onClose={() => setPreviewOpen(false)}
        title={previewTitle}
      />
    </div>
  );
}
