"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Props = {
  value: string;
  onChange: (v: string) => void;
};

export function PermitCategoryTabs({ value, onChange }: Props) {
  return (
    <Tabs value={value} onValueChange={onChange} className="w-full">
      <TabsList className="flex flex-wrap">
        {["Sheets", "Zoning", "Architectural", "Structural", "MEP", "Coordination", "All"].map((t) => (
          <TabsTrigger key={t} value={t}>
            {t}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
