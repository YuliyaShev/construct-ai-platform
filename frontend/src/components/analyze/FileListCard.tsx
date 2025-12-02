"use client";

import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/analyze/ScrollArea";
import { FileListItem } from "@/components/analyze/FileListItem";
import { type FileRecord } from "@/components/analyze/types";

type Props = {
  files: FileRecord[];
  search: string;
  onSearch: (v: string) => void;
  onSelect: (file: FileRecord) => void;
  onPreview: (file: FileRecord) => void;
  onAnalyze: (file: FileRecord) => void;
  onDownload: (file: FileRecord) => void;
  selectedId: number | null;
  busyId: number | null;
};

export function FileListCard({
  files,
  search,
  onSearch,
  onSelect,
  onPreview,
  onAnalyze,
  onDownload,
  selectedId,
  busyId
}: Props) {
  const filtered = files.filter((f) => f.original_name.toLowerCase().includes(search.toLowerCase()));

  return (
    <Card className="bg-gradient-to-b from-purple-50/60 to-white dark:from-zinc-900 dark:to-black border-slate-200/70 dark:border-zinc-800">
      <CardHeader className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <CardTitle>Uploaded Files</CardTitle>
          <span className="text-xs text-slate-500">{filtered.length} items</span>
        </div>
        <Input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search files..."
          className="bg-white/70 dark:bg-zinc-900"
        />
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[70vh] px-3">
          <div className="space-y-2 pb-3">
            {filtered.length === 0 && (
              <div className="text-sm text-slate-500 px-2 py-4">No files match your search.</div>
            )}
            {filtered.map((file) => (
              <FileListItem
                key={file.id}
                file={file}
                selected={selectedId === file.id}
                busy={busyId === file.id}
                onClick={() => onSelect(file)}
                onPreview={() => onPreview(file)}
                onAnalyze={() => onAnalyze(file)}
                onDownload={() => onDownload(file)}
              />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
