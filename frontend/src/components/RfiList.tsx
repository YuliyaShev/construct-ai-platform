"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { format } from "date-fns";

type RFI = {
  id: number;
  rfi_number: string;
  title: string;
  severity?: string;
  status: string;
  created_at?: string;
};

type Props = {
  rfis: RFI[];
  onOpen: (rfi: RFI) => void;
};

export function RfiList({ rfis, onOpen }: Props) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <THead>
          <TR>
            <TH>RFI #</TH>
            <TH>Title</TH>
            <TH>Severity</TH>
            <TH>Status</TH>
            <TH>Created</TH>
            <TH />
          </TR>
        </THead>
        <TBody>
          {rfis.length === 0 && (
            <TR>
              <TD colSpan={6} className="text-center py-4 text-slate-500">
                No RFIs yet.
              </TD>
            </TR>
          )}
          {rfis.map((rfi) => (
            <TR key={rfi.id} className="hover:bg-slate-50 dark:hover:bg-zinc-900">
              <TD className="font-semibold text-slate-900 dark:text-slate-100">{rfi.rfi_number}</TD>
              <TD className="text-slate-800 dark:text-slate-200">{rfi.title}</TD>
              <TD className="text-sm capitalize">{rfi.severity || "info"}</TD>
              <TD className="text-sm">{rfi.status}</TD>
              <TD className="text-sm text-slate-500">
                {rfi.created_at ? format(new Date(rfi.created_at), "yyyy-MM-dd HH:mm") : "—"}
              </TD>
              <TD className="text-right">
                <Button size="sm" variant="secondary" onClick={() => onOpen(rfi)}>
                  Open
                </Button>
              </TD>
            </TR>
          ))}
        </TBody>
      </Table>
    </div>
  );
}
