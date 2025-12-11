"use client";

import { Button } from "@/components/ui/button";

export function PunchActionsPanel() {
  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm">Mark Resolved</Button>
      <Button variant="outline" size="sm">Assign</Button>
      <Button variant="outline" size="sm">Add Comment</Button>
    </div>
  );
}
