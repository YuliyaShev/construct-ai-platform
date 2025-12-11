"use client";

import { useState } from "react";

export type LoadPathResult = {
  nodes: any[];
  edges: any[];
  issues: { severity: string; message: string }[];
};

export function useLoadPath() {
  const [data, setData] = useState<LoadPathResult | null>(null);
  const [loading, setLoading] = useState(false);

  const run = async (file: File) => {
    setLoading(true);
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fetch("/api/structural/load-path", { method: "POST", body: form });
      const json = await res.json();
      setData(json);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, run };
}
