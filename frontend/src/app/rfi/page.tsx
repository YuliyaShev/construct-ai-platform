"use client";

import { useState } from "react";
import PdfUploader from "@/components/pdf/PdfUploader";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoadingState from "@/components/loaders/LoadingState";
import { Button } from "@/components/ui/button";

export default function RfiPage() {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (file: File) => {
    setLoading(true);
    const form = new FormData();
    form.append("file", file);
    const res = await api.post("/generate-rfi-auto", form, { headers: { "Content-Type": "multipart/form-data" } });
    setData(res.data);
    setLoading(false);
  };

  const downloadRfi = async () => {
    if (!data?.rfi_number) return;
    // Assuming backend returns path, we just inform user to use backend download.
    alert("Download generated RFI PDF from backend path if provided.");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Auto RFI Generator</CardTitle>
        </CardHeader>
        <CardContent>
          <PdfUploader onUpload={handleUpload} />
        </CardContent>
      </Card>
      <Card className="lg:col-span-2">
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Generated RFIs</CardTitle>
          <Button variant="secondary" size="sm" onClick={downloadRfi} disabled={!data}>
            Download RFI PDF
          </Button>
        </CardHeader>
        <CardContent>
          {loading && <LoadingState />}
          {!loading && data && <pre className="bg-slate-900 text-white p-3 rounded-lg text-xs overflow-auto">{JSON.stringify(data, null, 2)}</pre>}
          {!loading && !data && <div className="text-sm text-slate-500">Upload a PDF to generate RFIs.</div>}
        </CardContent>
      </Card>
    </div>
  );
}
