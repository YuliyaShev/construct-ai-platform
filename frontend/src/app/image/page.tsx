"use client";

import { useState } from "react";
import FileDropzone from "@/components/pdf/FileDropzone";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoadingState from "@/components/loaders/LoadingState";

export default function ImagePage() {
  const [result, setResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file (jpg, png, webp, heic).");
      return;
    }

    setLoading(true);
    setResult(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await api.post("/analyze-image", form, { headers: { "Content-Type": "multipart/form-data" } });
      setResult(res.data);
    } catch (e: any) {
      console.error(e);
      const msg = e?.response?.data?.detail || e?.message || "Image analysis failed.";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Image Analyzer</CardTitle>
        </CardHeader>
        <CardContent>
          <FileDropzone onFile={handleUpload} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Result</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && <LoadingState />}
          {!loading && result && <pre className="bg-slate-900 text-white p-3 rounded-lg text-xs overflow-auto">{JSON.stringify(result, null, 2)}</pre>}
          {!loading && !result && <div className="text-sm text-slate-500">Upload an image to analyze.</div>}
        </CardContent>
      </Card>
    </div>
  );
}
