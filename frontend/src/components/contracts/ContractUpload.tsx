"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function ContractUpload({ onResult }: { onResult: (data: any) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    if (!file) return;
    setLoading(true);
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/contracts/analyze", { method: "POST", body: form });
    const json = await res.json();
    onResult(json);
    setLoading(false);
  };

  return (
    <div className="flex items-center gap-2">
      <input type="file" accept=".pdf,.doc,.docx,.txt" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <Button onClick={handle} disabled={loading || !file}>
        {loading ? "Analyzing…" : "Analyze Contract"}
      </Button>
    </div>
  );
}
