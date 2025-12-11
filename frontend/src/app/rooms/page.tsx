"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RoomList } from "@/components/rooms/RoomList";
import { RoomOverlay } from "@/components/rooms/RoomOverlay";
import { ExportExcelButton } from "@/components/rooms/ExportExcelButton";

type Room = {
  id: string;
  name: string;
  area_sqft: number;
  area_sqm: number;
  perimeter_ft: number;
  vertices: number[][];
  gap_detected?: boolean;
};

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const onRename = (id: string, name: string) => {
    setRooms((prev) => prev.map((r) => (r.id === id ? { ...r, name } : r)));
  };

  const handleDetect = async () => {
    if (!file) return;
    setLoading(true);
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fetch("/api/rooms/detect", { method: "POST", body: form });
      const json = await res.json();
      setRooms(json.rooms || []);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">AI Room & Space Detection</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Detect closed polygons, compute area/perimeter, and classify room types from PDF floor plans.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <Button onClick={handleDetect} disabled={loading || !file}>
            {loading ? "Analyzing…" : "Detect Rooms"}
          </Button>
          <ExportExcelButton rooms={rooms} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <RoomOverlay rooms={rooms} />
        </div>
        <div className="space-y-3">
          <RoomList rooms={rooms} onRename={onRename} />
        </div>
      </div>
    </div>
  );
}
