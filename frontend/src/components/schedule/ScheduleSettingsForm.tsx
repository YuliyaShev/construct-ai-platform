"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Props = {
  onRun: (payload: any) => void;
};

export function ScheduleSettingsForm({ onRun }: Props) {
  const [startDate, setStartDate] = useState("2025-04-01");
  const [parallelism, setParallelism] = useState("medium");
  const [weather, setWeather] = useState("medium");

  return (
    <div className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-sm space-y-3">
      <div className="text-sm font-semibold text-slate-900 dark:text-white">Schedule Settings</div>
      <div className="grid grid-cols-2 gap-2">
        <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <Select value={parallelism} onValueChange={setParallelism}>
          <SelectTrigger>
            <SelectValue placeholder="Parallelism" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
        <Select value={weather} onValueChange={setWeather}>
          <SelectTrigger>
            <SelectValue placeholder="Weather risk" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button onClick={() => onRun({ start_date: startDate, parallelism, weather_risk: weather })}>Generate Schedule</Button>
    </div>
  );
}
