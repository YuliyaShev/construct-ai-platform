"use client";

import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";

type Room = {
  id: string;
  name: string;
  area_sqft: number;
  area_sqm: number;
  perimeter_ft: number;
  gap_detected?: boolean;
};

export function RoomList({ rooms, onRename }: { rooms: Room[]; onRename: (id: string, name: string) => void }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm">
      <Table className="bg-white dark:bg-zinc-900">
        <THead className="bg-slate-50 dark:bg-zinc-800">
          <TR>
            <TH>ID</TH>
            <TH>Name</TH>
            <TH>Area (sq.ft)</TH>
            <TH>Area (sq.m)</TH>
            <TH>Perimeter (ft)</TH>
            <TH>Gap</TH>
          </TR>
        </THead>
        <TBody>
          {rooms.length === 0 && (
            <TR>
              <TD colSpan={6} className="py-4 text-center text-slate-500">
                No rooms detected.
              </TD>
            </TR>
          )}
          {rooms.map((room) => (
            <TR key={room.id}>
              <TD className="font-semibold text-slate-900 dark:text-slate-100">{room.id}</TD>
              <TD>
                <input
                  className="w-full rounded border border-slate-200 bg-transparent px-2 py-1 text-sm"
                  value={room.name}
                  onChange={(e) => onRename(room.id, e.target.value)}
                />
              </TD>
              <TD>{room.area_sqft}</TD>
              <TD>{room.area_sqm}</TD>
              <TD>{room.perimeter_ft}</TD>
              <TD className="text-sm">{room.gap_detected ? "Yes" : "No"}</TD>
            </TR>
          ))}
        </TBody>
      </Table>
    </div>
  );
}
