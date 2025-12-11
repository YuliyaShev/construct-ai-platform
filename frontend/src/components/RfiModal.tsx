"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type RFI = {
  id: number;
  rfi_number: string;
  title: string;
  description?: string;
  question?: string;
  suggested_fix?: string;
  page?: number;
  x?: number;
  y?: number;
  severity?: string;
  status: string;
  preview_path?: string;
};

type Props = {
  rfi: RFI | null;
  onClose: () => void;
  onStatusChange: (status: string) => void;
};

export function RfiModal({ rfi, onClose, onStatusChange }: Props) {
  if (!rfi) return null;
  const [status, setStatus] = useState(rfi.status);

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500">RFI #{rfi.rfi_number}</div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{rfi.title}</h2>
          </div>
          <Button variant="ghost" onClick={onClose}>Close</Button>
        </div>

        <div className="grid gap-3">
          <div>
            <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">Description</div>
            <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{rfi.description || "—"}</p>
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">Question</div>
            <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{rfi.question || "—"}</p>
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">Suggested Fix</div>
            <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{rfi.suggested_fix || "—"}</p>
          </div>
          <div className="text-xs text-slate-500">
            Location: page {rfi.page || "?"}, coords ({rfi.x?.toFixed(2)}, {rfi.y?.toFixed(2)})
          </div>
          {rfi.preview_path && (
            <div>
              <div className="text-sm font-semibold mb-2">Preview</div>
              <img src={rfi.preview_path} alt="RFI preview" className="rounded border border-slate-200" />
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border rounded px-3 py-2 text-sm bg-white dark:bg-zinc-800"
          >
            <option>Open</option>
            <option>Sent</option>
            <option>AwaitingResponse</option>
            <option>Closed</option>
          </select>
          <Button onClick={() => onStatusChange(status)}>Update Status</Button>
          <Button variant="outline" onClick={() => navigator.clipboard.writeText(JSON.stringify(rfi, null, 2))}>Copy JSON</Button>
          {rfi.page && (
            <Button variant="secondary" onClick={() => window.dispatchEvent(new CustomEvent("jump-to-rfi", { detail: rfi }))}>
              Jump to Issue
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
