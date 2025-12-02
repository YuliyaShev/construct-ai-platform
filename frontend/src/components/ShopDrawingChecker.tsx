"use client";

import { useMemo, useState } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import FileDropzone from "@/components/pdf/FileDropzone";

type IssueListProps = {
  title: string;
  items?: string[];
  color: string;
};

// Helper renderer for list items
function IssueList({ title, items, color }: IssueListProps) {
  if (!items || items.length === 0) return null;

  return (
    <Card className="border-l-4 mt-4" style={{ borderColor: color }}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.map((it, idx) => (
          <div key={idx} className="p-2 bg-slate-50 rounded border border-slate-200 text-sm">
            {it}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default function ShopDrawingChecker() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  // Submit file for backend processing
  const handleCheck = async () => {
    if (!file) return alert("Please select a PDF");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const res = await api.post("/shop-drawing/check", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setData(res.data);
    } catch (e) {
      console.error(e);
      alert("Error analyzing drawing");
    } finally {
      setLoading(false);
    }
  };

  // Export drawing analysis to PDF
  const handleExportPDF = async () => {
    if (!data) {
      return alert("No analysis data available.");
    }

    try {
      setLoading(true);

      const res = await api.post(
        "/shop-drawing/export-pdf",
        { data },
        { responseType: "blob" }
      );

      // Create download link
      const fileURL = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = fileURL;
      a.download = "ShopDrawingReport.pdf";
      a.click();
    } catch (e) {
      console.error(e);
      alert("Failed to export PDF");
    } finally {
      setLoading(false);
    }
  };

  const tabs = useMemo(() => {
    if (!data) return [];

    return [
      {
        id: "summary",
        label: "Summary",
        content: (
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-700 whitespace-pre-wrap">{data.summary || "No summary"}</CardContent>
          </Card>
        )
      },
      {
        id: "issues",
        label: "Issues",
        content: (
          <div className="space-y-4">
            <IssueList title="Critical Issues" items={data.critical_issues} color="#dc2626" />
            <IssueList title="Missing Information" items={data.missing_information} color="#ca8a04" />
            <IssueList title="Code Violations" items={data.code_violations} color="#b91c1c" />
            <IssueList title="Detailing Errors" items={data.detailing_errors} color="#ea580c" />
            <IssueList title="Structural Conflicts" items={data.structural_conflicts} color="#b45309" />
            <IssueList title="Issues" items={data.issues} color="#dc2626" />
          </div>
        )
      },
      {
        id: "dimensions",
        label: "Dimensions",
        content: <IssueList title="Dimension Conflicts" items={data.dimension_conflicts} color="#d97706" />
      },
      {
        id: "rfi",
        label: "RFIs",
        content: (
          <Card className="border-l-4" style={{ borderColor: "#0284c7" }}>
            <CardHeader>
              <CardTitle>Generated RFIs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {data.rfi_to_generate?.length ? (
                data.rfi_to_generate.map((rfi: any, idx: number) => (
                  <div key={idx} className="p-2 bg-blue-50 border border-blue-200 rounded text-sm">
                    {typeof rfi === "string" ? rfi : JSON.stringify(rfi)}
                  </div>
                ))
              ) : (
                <div className="text-sm text-slate-600">No RFIs generated</div>
              )}
            </CardContent>
          </Card>
        )
      },
      {
        id: "recom",
        label: "Recommendations",
        content: (
          <Card className="border-l-4" style={{ borderColor: "#16a34a" }}>
            <CardHeader>
              <CardTitle>AI Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {data.recommendations?.length ? (
                data.recommendations.map((rec: any, idx: number) => (
                  <div key={idx} className="p-2 bg-green-50 border border-green-200 rounded text-sm">
                    {typeof rec === "string" ? rec : JSON.stringify(rec)}
                  </div>
                ))
              ) : (
                <div className="text-sm text-slate-600">No recommendations</div>
              )}
            </CardContent>
          </Card>
        )
      }
    ];
  }, [data]);

  return (
    <div className="space-y-6">
      {/* PDF Upload Card */}
      <Card>
        <CardHeader>
          <CardTitle>Shop Drawing Checker</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FileDropzone onFile={setFile} />
          {file && (
            <div className="text-sm text-slate-700">
              Selected: <span className="font-medium">{file.name}</span>
            </div>
          )}
          <Button onClick={handleCheck} disabled={loading}>
            {loading ? "Analyzing..." : "Analyze PDF"}
          </Button>
        </CardContent>
      </Card>

      {/* Results output */}
      {data && tabs.length > 0 && (
        <div className="mt-2 space-y-4">
          {/* PDF Export Button */}
          <div className="flex justify-end mb-4">
            <button
              onClick={handleExportPDF}
              className="px-4 py-2 bg-slate-900 text-white rounded-md hover:bg-black transition"
            >
              Export to PDF
            </button>
          </div>
          <Tabs tabs={tabs} />
        </div>
      )}
    </div>
  );
}
