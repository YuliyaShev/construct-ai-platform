"use client";

import { useState } from "react";
import { api } from "@/lib/api";

export default function UploadPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const res = await api.post("/pdf/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setResult(res.data);
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 border rounded-xl bg-white shadow">
      <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="mb-4" />

      <button
        onClick={handleUpload}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
      >
        {loading ? "Uploading..." : "Upload"}
      </button>

      {result && (
        <pre className="mt-6 p-4 bg-slate-100 rounded text-sm overflow-auto whitespace-pre-wrap">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
