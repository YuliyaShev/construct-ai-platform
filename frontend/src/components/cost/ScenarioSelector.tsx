"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const scenarios = [
  { id: "baseline", label: "Baseline" },
  { id: "material_up_10", label: "Material +10%" },
  { id: "union", label: "Union Labor" },
  { id: "escalation_3yr", label: "Escalation 3 years" },
];

export function CostScenarioSelector({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Scenario" />
      </SelectTrigger>
      <SelectContent>
        {scenarios.map((s) => (
          <SelectItem key={s.id} value={s.id}>
            {s.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
