"use client";

import { useMemo } from "react";
import type { CommandItem } from "./useCommandBar";

function scoreLabel(label: string, query: string) {
  const lowerLabel = label.toLowerCase();
  const lowerQuery = query.toLowerCase();
  if (!lowerQuery) return 0;
  let score = 0;
  if (lowerLabel.startsWith(lowerQuery)) score += 5;
  if (lowerLabel.includes(lowerQuery)) score += 2;
  // Sequential match bonus
  let qi = 0;
  for (let i = 0; i < lowerLabel.length && qi < lowerQuery.length; i += 1) {
    if (lowerLabel[i] === lowerQuery[qi]) qi += 1;
  }
  score += qi === lowerQuery.length ? 3 : 0;
  return score;
}

function highlight(label: string, query: string) {
  if (!query) return label;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")})`, "ig");
  return label.replace(regex, "<mark>$1</mark>");
}

export function useFuzzySearch(query: string, items: CommandItem[]) {
  return useMemo(() => {
    if (!query.trim()) return items.map((item) => ({ ...item, highlighted: item.label }));
    return items
      .map((item) => ({
        ...item,
        _score: scoreLabel(item.label, query),
        highlighted: highlight(item.label, query)
      }))
      .filter((i) => i._score > 0)
      .sort((a, b) => b._score - a._score);
  }, [query, items]);
}
