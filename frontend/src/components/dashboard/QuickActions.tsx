"use client";

import { Button } from "@/components/ui/button";
import { Upload, Scan, Files, FilePlus } from "lucide-react";

type Props = {
  onUpload?: () => void;
  onAnalyze?: () => void;
  onViewFiles?: () => void;
  onCreateRFI?: () => void;
};

export function QuickActions({ onUpload, onAnalyze, onViewFiles, onCreateRFI }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <Button variant="secondary" className="justify-start gap-2" onClick={onUpload}>
        <Upload className="h-4 w-4" /> Upload File
      </Button>
      <Button variant="outline" className="justify-start gap-2" onClick={onAnalyze}>
        <Scan className="h-4 w-4" /> Analyze Last
      </Button>
      <Button variant="secondary" className="justify-start gap-2" onClick={onViewFiles}>
        <Files className="h-4 w-4" /> View Files
      </Button>
      <Button className="justify-start gap-2" onClick={onCreateRFI}>
        <FilePlus className="h-4 w-4" /> Create RFI
      </Button>
    </div>
  );
}
