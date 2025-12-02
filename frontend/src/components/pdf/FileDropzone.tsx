"use client";

import { useCallback, useId, useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import { Button } from "../ui/button";

type Props = {
  onFile: (file: File) => void;
  accept?: string;
};

export default function FileDropzone({ onFile, accept = ".pdf,image/*" }: Props) {
  const [dragging, setDragging] = useState(false);
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (files && files[0]) onFile(files[0]);
    },
    [onFile]
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handleFiles(e.dataTransfer.files);
      }}
      className={`border-2 border-dashed rounded-xl p-6 text-center bg-white ${
        dragging ? "border-brand-500 bg-brand-50" : "border-slate-200"
      }`}
    >
      <div className="flex flex-col items-center gap-2">
        <UploadCloud className="text-brand-600" />
        <p className="text-sm text-slate-600">Drag & drop a file, or select</p>
        <input
          type="file"
          accept={accept}
          className="hidden"
          id={inputId}
          ref={inputRef}
          onChange={(e) => handleFiles(e.target.files)}
        />
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            if (inputRef.current) inputRef.current.click();
          }}
        >
          Browse Files
        </Button>
      </div>
    </div>
  );
}
