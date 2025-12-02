"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import FileDropzone from "./FileDropzone";

type Props = {
  onUpload: (file: File) => Promise<void>;
  actions?: React.ReactNode;
  title?: string;
  accept?: string;
  buttonLabel?: string;
};

export default function PdfUploader({ onUpload, actions, title, accept = ".pdf", buttonLabel }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      await onUpload(file);
    } catch (e: any) {
      setError(e?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {title && <div className="text-sm font-semibold text-slate-700">{title}</div>}
      <FileDropzone onFile={setFile} accept={accept} />
      {file && (
        <div className="text-sm text-slate-700">
          Selected: <span className="font-medium">{file.name}</span>
        </div>
      )}
      <div className="flex gap-3">
        <Button onClick={handleUpload} disabled={!file || loading}>
          {loading ? "Processing..." : buttonLabel || "Upload PDF"}
        </Button>
        {actions}
      </div>
      {error && <div className="text-sm text-red-600">{error}</div>}
    </div>
  );
}
