"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function ScenarioSelector({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Scenario" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="default">Default</SelectItem>
        <SelectItem value="blocked_exit">Blocked Exit</SelectItem>
        <SelectItem value="smoke_spread">Smoke Spread</SelectItem>
      </SelectContent>
    </Select>
  );
}
