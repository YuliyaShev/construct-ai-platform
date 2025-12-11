"use client";

export type AISidebarIssue = {
  id: string;
  title: string;
  severity: "high" | "medium" | "low";
  confidence: number;
  description?: string;
  related_details?: string[];
};

export type AISidebarAction = {
  type: "rfi" | "explain" | "similar" | "code" | "compare" | string;
  label: string;
  endpoint?: string;
};

export type AISidebarResponse = {
  summary: string;
  issues: AISidebarIssue[];
  recommendations: string[];
  actions: AISidebarAction[];
};

export async function fetchAISidebar(page: number, selectionId?: string): Promise<AISidebarResponse> {
  const params = new URLSearchParams();
  params.set("page", String(page));
  if (selectionId) params.set("selection", selectionId);

  const res = await fetch(`/api/ai/sidebar?${params.toString()}`, { method: "GET" });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed with ${res.status}`);
  }
  return res.json();
}
