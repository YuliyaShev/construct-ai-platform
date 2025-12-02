"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FileDropzone from "@/components/pdf/FileDropzone";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import LoadingState from "@/components/loaders/LoadingState";

export default function ComparePage() {
  const [revA, setRevA] = useState<File | null>(null);
  const [revB, setRevB] = useState<File | null>(null);
  const [result, setResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const runCompare = async () => {
    if (!revA || !revB) return;
    setLoading(true);
    const form = new FormData();
    form.append("file_a", revA);
    form.append("file_b", revB);
    const res = await api.post("/compare-revisions", form, { headers: { "Content-Type": "multipart/form-data" } });
    setResult(res.data);
    setLoading(false);
  };

  const exportExcel = async () => {
    if (!revA || !revB) return;
    const form = new FormData();
    form.append("file_a", revA);
    form.append("file_b", revB);
    const res = await api.post("/compare-revisions-export", form, { responseType: "blob" });
    const url = URL.createObjectURL(res.data);
    window.open(url, "_blank");
  };

  const overlay = async () => {
    if (!revA || !revB) return;
    const form = new FormData();
    form.append("file_a", revA);
    form.append("file_b", revB);
    const res = await api.post("/compare-revisions-overlay", form, { responseType: "blob" });
    const url = URL.createObjectURL(res.data);
    window.open(url, "_blank");
  };

  const renderSection = (key: string) => (
    <pre className="bg-slate-900 text-white p-3 rounded-lg text-xs overflow-auto">{JSON.stringify(result?.[key] || {}, null, 2)}</pre>
  );

  const tabs = result
    ? [
        { id: "text", label: "Text Changes", content: renderSection("text_changes") },
        { id: "dims", label: "Dimension Changes", content: renderSection("dimension_changes") },
        { id: "geom", label: "Geometry Changes", content: renderSection("geometry_changes") },
        { id: "bom", label: "BOM Changes", content: renderSection("bom_changes") },
        { id: "issues", label: "Issues", content: renderSection("issues_found") },
        { id: "rfi", label: "RFIs", content: renderSection("rfi_to_generate") }
      ]
    : [];

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Compare Revisions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="text-sm font-medium text-slate-700 mb-2">Revision A</div>
            <FileDropzone onFile={setRevA} />
          </div>
          <div>
            <div className="text-sm font-medium text-slate-700 mb-2">Revision B</div>
            <FileDropzone onFile={setRevB} />
          </div>
          <div className="flex gap-2">
            <Button onClick={runCompare} disabled={loading || !revA || !revB}>
              Compare
            </Button>
            <Button variant="secondary" onClick={exportExcel} disabled={!revA || !revB}>
              Export Excel
            </Button>
            <Button variant="secondary" onClick={overlay} disabled={!revA || !revB}>
              Visual Overlay
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Results</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && <LoadingState />}
          {!loading && result && <Tabs tabs={tabs} />}
          {!loading && !result && <div className="text-sm text-slate-500">Upload two PDFs to compare.</div>}
        </CardContent>
      </Card>
    </div>
  );
}
