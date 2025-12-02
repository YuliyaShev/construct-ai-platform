"use client";

import { useState } from "react";
import PdfUploader from "@/components/pdf/PdfUploader";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion } from "@/components/ui/accordion";
import LoadingState from "@/components/loaders/LoadingState";

export default function BomPage() {
  const [bom, setBom] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (file: File) => {
    setLoading(true);
    const form = new FormData();
    form.append("file", file);
    const res = await api.post("/extract-bom", form, { headers: { "Content-Type": "multipart/form-data" } });
    setBom(res.data);
    setLoading(false);
  };

  const sections =
    bom &&
    Object.entries(bom).map(([trade, items]: any) => ({
      id: trade,
      trigger: `${trade} (${items?.length || 0})`,
      content: (
        <div className="space-y-2">
          {items?.map((i: any, idx: number) => (
            <div key={idx} className="p-3 rounded-md bg-slate-50 border border-slate-200 text-sm">
              {Object.entries(i).map(([k, v]) => (
                <div key={k}>
                  <span className="font-semibold capitalize">{k}: </span>
                  <span>{String(v)}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )
    }));

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>BOM Extractor</CardTitle>
        </CardHeader>
        <CardContent>
          <PdfUploader onUpload={handleUpload} />
        </CardContent>
      </Card>
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>BOM Result</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && <LoadingState />}
          {!loading && bom && sections && <Accordion items={sections} />}
          {!loading && !bom && <div className="text-sm text-slate-500">Upload a PDF to extract BOM.</div>}
        </CardContent>
      </Card>
    </div>
  );
}
