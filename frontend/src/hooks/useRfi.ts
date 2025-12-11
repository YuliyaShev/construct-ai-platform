"use client";

import { useEffect, useState } from "react";

export type IssuePayload = Record<string, any>;

export type RFI = {
  id: number;
  rfi_number: string;
  title: string;
  description?: string;
  question?: string;
  suggested_fix?: string;
  page?: number;
  x?: number;
  y?: number;
  severity?: string;
  status: string;
  created_at?: string;
  preview_path?: string;
};

export function useRfi(fileId?: number) {
  const [rfis, setRfis] = useState<RFI[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchList = async () => {
    if (!fileId) return;
    setLoading(true);
    try {
      const res = await fetch(`/rfi/list/${fileId}`);
      if (!res.ok) throw new Error("Failed to load RFIs");
      const data = await res.json();
      setRfis(data || []);
    } catch (e: any) {
      setError(e?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, [fileId]); // eslint-disable-line react-hooks/exhaustive-deps

  const create = async (issue: IssuePayload) => {
    if (!fileId) return;
    const res = await fetch("/rfi/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ file_id: fileId, issue }),
    });
    if (!res.ok) throw new Error("Failed to create RFI");
    await fetchList();
    return res.json();
  };

  const updateStatus = async (rfiId: number, status: string) => {
    const res = await fetch(`/rfi/${rfiId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error("Failed to update RFI status");
    await fetchList();
    return res.json();
  };

  return { rfis, loading, error, fetchList, create, updateStatus };
}
