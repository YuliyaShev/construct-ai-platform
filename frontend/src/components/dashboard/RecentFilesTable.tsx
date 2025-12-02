"use client";

import { Button } from "@/components/ui/button";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { Badge } from "@/components/analyze/Primitives";
import { format } from "date-fns";

type FileRow = {
  id: number;
  original_name: string;
  created_at?: string;
  status?: "uploaded" | "analyzed";
  severity?: "error" | "warning" | "info" | null;
};

type Props = {
  files: FileRow[];
  onPreview?: (file: FileRow) => void;
  onAnalyze?: (file: FileRow) => void;
  onDownload?: (file: FileRow) => void;
};

const severityTone = {
  error: "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-200",
  warning: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-200",
  info: "bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-200",
};

export function RecentFilesTable({ files, onPreview, onAnalyze, onDownload }: Props) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <THead>
          <TR>
            <TH>Filename</TH>
            <TH>Status</TH>
            <TH>Date</TH>
            <TH className="text-right">Actions</TH>
          </TR>
        </THead>
        <TBody>
          {files.length === 0 && (
            <TR>
              <TD colSpan={4} className="text-center text-slate-500 py-6">
                No recent files.
              </TD>
            </TR>
          )}
          {files.map((file) => (
            <TR key={file.id} className="hover:bg-slate-50 dark:hover:bg-zinc-900/50 transition">
              <TD className="font-semibold text-slate-900 dark:text-slate-100">{file.original_name}</TD>
              <TD>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-slate-200 capitalize">
                    {file.status || "uploaded"}
                  </span>
                  {file.severity && <span className={`text-[11px] px-2 py-0.5 rounded-full ${severityTone[file.severity]}`}>{file.severity}</span>}
                </div>
              </TD>
              <TD className="text-sm text-slate-600 dark:text-slate-300">
                {file.created_at ? format(new Date(file.created_at), "yyyy-MM-dd HH:mm") : "—"}
              </TD>
              <TD>
                <div className="flex justify-end gap-2">
                  <Button size="sm" variant="secondary" onClick={() => onPreview?.(file)}>
                    Preview
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => onAnalyze?.(file)}>
                    Analyze
                  </Button>
                  <Button size="sm" onClick={() => onDownload?.(file)}>
                    Download
                  </Button>
                </div>
              </TD>
            </TR>
          ))}
        </TBody>
      </Table>
    </div>
  );
}
