"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { fetchAISidebar, type AISidebarResponse } from "../api/aiSidebar";

type Options = {
  page: number;
  selectionId?: string;
  enabled?: boolean;
  debounceMs?: number;
};

type Result = {
  data: AISidebarResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

const cache = new Map<string, AISidebarResponse>();

function getKey(page: number, selectionId?: string) {
  return `${page}::${selectionId || "none"}`;
}

export function useAISidebar({ page, selectionId, enabled = true, debounceMs = 200 }: Options): Result {
  const [data, setData] = useState<AISidebarResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const key = useMemo(() => getKey(page, selectionId), [page, selectionId]);

  const fetchData = useCallback(async () => {
    if (!enabled) return;
    if (cache.has(key)) {
      setData(cache.get(key)!);
      setError(null);
      setLoading(false);
      return;
    }
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    setError(null);
    try {
      const res = await fetchAISidebar(page, selectionId);
      cache.set(key, res);
      setData(res);
    } catch (err) {
      if ((err as any)?.name === "AbortError") return;
      setError((err as Error).message || "Failed to load AI sidebar");
    } finally {
      setLoading(false);
    }
  }, [enabled, key, page, selectionId]);

  useEffect(() => {
    if (!enabled) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchData();
    }, debounceMs);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      abortRef.current?.abort();
    };
  }, [fetchData, debounceMs, enabled]);

  return { data, loading, error, refetch: fetchData };
}
