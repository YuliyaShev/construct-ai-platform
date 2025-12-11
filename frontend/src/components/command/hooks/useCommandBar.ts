"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useFuzzySearch } from "./useFuzzySearch";
import { searchFiles, searchIssues, searchProjects, searchAI } from "../api/search";

export type CommandItem = {
  id: string;
  label: string;
  group: "AI" | "Navigation" | "Files" | "Issues" | "Recent";
  action?: () => void;
  route?: string;
  highlighted?: string;
};

const NAV_ITEMS: CommandItem[] = [
  { id: "nav-dashboard", label: "Dashboard", group: "Navigation", route: "/dashboard" },
  { id: "nav-files", label: "Files", group: "Navigation", route: "/files" },
  { id: "nav-analysis", label: "Analysis", group: "Navigation", route: "/analysis" },
  { id: "nav-pdf", label: "PDF Viewer", group: "Navigation", route: "/upload" },
  { id: "nav-bim", label: "BIM 3D Viewer", group: "Navigation", route: "/bim" },
  { id: "nav-rfi", label: "RFI Manager", group: "Navigation", route: "/rfi" },
  { id: "nav-punch", label: "Punch List", group: "Navigation", route: "/punch" },
  { id: "nav-bom", label: "BOM Extractor", group: "Navigation", route: "/bom" },
  { id: "nav-settings", label: "Settings", group: "Navigation", route: "/settings" }
];

const AI_SUGGESTIONS: CommandItem[] = [
  { id: "ai-sum-page", label: "Summarize current page", group: "AI" },
  { id: "ai-explain-issue", label: "Explain selected issue", group: "AI" },
  { id: "ai-find-code", label: "Find code violations", group: "AI" },
  { id: "ai-create-rfi", label: "Create RFI for detected issues", group: "AI" }
];

const STORAGE_KEY = "recentCommands";

function loadRecent(): CommandItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored) as CommandItem[];
    return parsed.slice(0, 10);
  } catch {
    return [];
  }
}

function saveRecent(item: CommandItem) {
  if (typeof window === "undefined") return;
  const existing = loadRecent().filter((i) => i.id !== item.id);
  const next = [item, ...existing].slice(0, 10);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function useCommandBar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<CommandItem[]>([...AI_SUGGESTIONS, ...NAV_ITEMS, ...loadRecent()]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const results = useFuzzySearch(query, items);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    setActiveIndex(0);
  }, []);

  const handleGlobalKeys = useCallback(
    (e: KeyboardEvent) => {
      const metaK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
      if (metaK) {
        e.preventDefault();
        setIsOpen((v) => !v);
      }
      if (!isOpen) return;
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, Math.max(results.length - 1, 0)));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const item = results[activeIndex];
        if (item) runCommand(item);
      }
    },
    [close, isOpen, results, activeIndex]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleGlobalKeys);
    return () => window.removeEventListener("keydown", handleGlobalKeys);
  }, [handleGlobalKeys]);

  const runCommand = useCallback(
    (item: CommandItem) => {
      if (item.route) router.push(item.route);
      if (item.action) item.action();
      saveRecent(item);
      close();
    },
    [router, close]
  );

  useEffect(() => {
    if (!query.trim()) {
      setItems([...AI_SUGGESTIONS, ...NAV_ITEMS, ...loadRecent()]);
      return;
    }
    let cancelled = false;
    const fetchData = async () => {
      setLoading(true);
      try {
        const [files, issues, projects, ai] = await Promise.all([
          searchFiles(query),
          searchIssues(query),
          searchProjects(query),
          searchAI(query)
        ]);
        if (cancelled) return;
        setItems([...AI_SUGGESTIONS, ...NAV_ITEMS, ...loadRecent(), ...files, ...issues, ...projects, ...ai]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchData();
    return () => {
      cancelled = true;
    };
  }, [query]);

  const grouped = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {};
    results.forEach((item) => {
      if (!groups[item.group]) groups[item.group] = [];
      groups[item.group].push(item);
    });
    return groups;
  }, [results]);

  return {
    isOpen,
    open,
    close,
    query,
    setQuery,
    results,
    grouped,
    loading,
    activeIndex,
    setActiveIndex,
    runCommand
  };
}
