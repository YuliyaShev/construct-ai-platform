"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function PermitUploader({ onResult }: { onResult: (data: any) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRun = async () => {
    if (!file) return;
    setLoading(true);
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fetch("/api/permit/check", { method: "POST", body: form });
      const json = await res.json();
      onResult(json);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center">
      <Input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <Button onClick={handleRun} disabled={loading || !file}>
        {loading ? "Validating…" : "Run Permit Validation"}
      </Button>
    </div>
  );
}
