"use client";

import React from "react";
import { CommandBarSection } from "./CommandBarSection";
import { CommandBarItem } from "./CommandBarItem";
import type { CommandItem } from "./hooks/useCommandBar";

type Props = {
  grouped: Record<string, CommandItem[]>;
  activeIndex: number;
  flatResults: CommandItem[];
  onSelect: (item: CommandItem) => void;
};

export function CommandBarList({ grouped, activeIndex, flatResults, onSelect }: Props) {
  let runningIndex = -1;
  return (
    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
      {Object.entries(grouped).map(([group, items]) => (
        <CommandBarSection key={group} title={group}>
          <div className="flex flex-col gap-1">
            {items.map((item) => {
              runningIndex += 1;
              const active = runningIndex === activeIndex;
              return (
                <CommandBarItem
                  key={item.id}
                  item={item}
                  active={active}
                  onClick={() => onSelect(item)}
                />
              );
            })}
          </div>
        </CommandBarSection>
      ))}
      {!flatResults.length ? <div className="text-sm text-slate-500 px-1">No results</div> : null}
    </div>
  );
}
