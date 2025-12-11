"use client";

import type { CommandItem } from "../hooks/useCommandBar";

const normalize = (items: CommandItem[], group: CommandItem["group"]) =>
  items.map((item) => ({ ...item, group }));

export async function searchFiles(query: string): Promise<CommandItem[]> {
  const res = await fetch(`/api/files?search=${encodeURIComponent(query)}`);
  if (!res.ok) return [];
  const json = await res.json();
  return normalize(
    (json || []).map((f: any) => ({
      id: `file-${f.id || f.path}`,
      label: f.name || f.path || "File",
      route: f.url || `/files/${f.id || ""}`
    })),
    "Files"
  );
}

export async function searchIssues(query: string): Promise<CommandItem[]> {
  const res = await fetch(`/api/issues?search=${encodeURIComponent(query)}`);
  if (!res.ok) return [];
  const json = await res.json();
  return normalize(
    (json || []).map((i: any) => ({
      id: `issue-${i.id}`,
      label: i.title || "Issue",
      route: `/issues/${i.id || ""}`
    })),
    "Issues"
  );
}

export async function searchProjects(query: string): Promise<CommandItem[]> {
  const res = await fetch(`/api/projects?search=${encodeURIComponent(query)}`);
  if (!res.ok) return [];
  const json = await res.json();
  return normalize(
    (json || []).map((p: any) => ({
      id: `project-${p.id}`,
      label: p.name || "Project",
      route: `/projects/${p.id || ""}`
    })),
    "Navigation"
  );
}

export async function searchAI(query: string): Promise<CommandItem[]> {
  const res = await fetch(`/api/ai/search?query=${encodeURIComponent(query)}`);
  if (!res.ok) return [];
  const json = await res.json();
  return normalize(
    (json || []).map((a: any) => ({
      id: `ai-${a.id || a.type}`,
      label: a.label || "AI Action",
      action: () => {
        console.info("AI action run", a);
      }
    })),
    "AI"
  );
}
