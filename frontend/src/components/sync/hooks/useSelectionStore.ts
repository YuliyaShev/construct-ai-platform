"use client";

import { create } from "zustand";

export type SelectionState = {
  selectedElementId: string | null;
  selectedPage: number | null;
  setSelectedElement: (id: string, page?: number | null) => void;
  clearSelection: () => void;
};

export const useSelectionStore = create<SelectionState>((set) => ({
  selectedElementId: null,
  selectedPage: null,
  setSelectedElement: (id, page = null) => set({ selectedElementId: id, selectedPage: page }),
  clearSelection: () => set({ selectedElementId: null, selectedPage: null })
}));
