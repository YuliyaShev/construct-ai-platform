"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const locations = ["BC", "Ontario", "California", "Texas", "Florida"];

export function LocationSelector({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Location" />
      </SelectTrigger>
      <SelectContent>
        {locations.map((l) => (
          <SelectItem key={l} value={l}>
            {l}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
