"use client";

import { Button } from "@/components/ui/button";

export function TimelineControls() {
  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm">1×</Button>
      <Button variant="outline" size="sm">2×</Button>
      <Button variant="outline" size="sm">4×</Button>
    </div>
  );
}
