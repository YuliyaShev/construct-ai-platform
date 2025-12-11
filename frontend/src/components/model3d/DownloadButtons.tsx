"use client";

import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";

export function DownloadButtons({ gltf, obj }: { gltf?: string; obj?: string }) {
  const download = (data: string | undefined, name: string) => {
    if (!data) return;
    const blob = new Blob([data], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex gap-2">
      <Button size="sm" variant="secondary" className="gap-2" onClick={() => download(gltf, "model.gltf")} disabled={!gltf}>
        <FileDown className="h-4 w-4" /> glTF
      </Button>
      <Button size="sm" variant="outline" className="gap-2" onClick={() => download(obj, "model.obj")} disabled={!obj}>
        <FileDown className="h-4 w-4" /> OBJ
      </Button>
    </div>
  );
}
