"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

type Props = { onFile: (file: File) => void };

export function PermitDropzone({ onFile }: Props) {
  const onDrop = useCallback(
    (accepted: File[]) => {
      if (accepted?.[0]) onFile(accepted[0]);
    },
    [onFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: false, accept: { "application/pdf": [] } });

  return (
    <div
      {...getRootProps()}
      className={`w-full cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition ${
        isDragActive ? "border-blue-500 bg-blue-50" : "border-slate-300 bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900/50"
      }`}
    >
      <input {...getInputProps()} />
      <p className="text-sm text-slate-700 dark:text-slate-200">
        {isDragActive ? "Drop the permit PDF here..." : "Drag & drop permit PDF, or click to browse"}
      </p>
    </div>
  );
}
