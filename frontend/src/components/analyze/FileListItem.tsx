"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/analyze/Primitives";
import { formatSize } from "@/components/analyze/format";
import { FileIcon, Eye, Wand2, Download, Loader2 } from "lucide-react";
import { cn } from "@/lib/helpers";
import { type FileRecord } from "@/components/analyze/types";

type Props = {
  file: FileRecord;
  selected: boolean;
  busy: boolean;
  onClick: () => void;
  onPreview: () => void;
  onAnalyze: () => void;
  onDownload: () => void;
};

export function FileListItem({ file, selected, busy, onClick, onPreview, onAnalyze, onDownload }: Props) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group cursor-pointer rounded-lg border border-transparent px-3 py-3 transition-all duration-200",
        "hover:border-slate-200 hover:bg-slate-50 dark:hover:bg-zinc-900/60",
        selected && "border-brand-500/50 bg-brand-50 dark:bg-brand-500/10"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="mt-1 rounded-md bg-slate-100 dark:bg-zinc-800 p-2">
          <FileIcon className="h-5 w-5 text-brand-600" />
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 line-clamp-1">
              {file.original_name}
            </div>
            <Badge>{formatSize(file.size)}</Badge>
          </div>
          <div className="text-xs text-slate-500">{file.created_at ? new Date(file.created_at).toLocaleString() : "—"}</div>
          <div className="flex items-center gap-2 pt-2">
            <Button size="xs" variant="secondary" onClick={(e) => { e.stopPropagation(); onPreview(); }} disabled={busy}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4" />}
              <span className="ml-1">Preview</span>
            </Button>
            <Button size="xs" variant="outline" onClick={(e) => { e.stopPropagation(); onAnalyze(); }} disabled={busy}>
              <Wand2 className="h-4 w-4" />
              <span className="ml-1">Analyze</span>
            </Button>
            <Button size="xs" onClick={(e) => { e.stopPropagation(); onDownload(); }} disabled={busy}>
              <Download className="h-4 w-4" />
              <span className="ml-1">Download</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
