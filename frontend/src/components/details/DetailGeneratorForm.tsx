"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  onGenerate: (payload: any) => void;
};

export function DetailGeneratorForm({ onGenerate }: Props) {
  const [detailType, setDetailType] = useState("curtain_wall_head");
  const [page, setPage] = useState("A5.02");
  const [x, setX] = useState("200");
  const [y, setY] = useState("350");
  const [params, setParams] = useState('{"frame_thickness":50,"glass_thickness":28,"embed_depth":100}');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let parsedParams = {};
    try {
      parsedParams = JSON.parse(params);
    } catch {
      parsedParams = {};
    }
    onGenerate({
      type: detailType,
      reference_location: { page, x: Number(x), y: Number(y) },
      parameters: parsedParams,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-sm">
      <div className="text-sm font-semibold text-slate-900 dark:text-white">Generate Detail</div>
      <Select value={detailType} onValueChange={setDetailType}>
        <SelectTrigger>
          <SelectValue placeholder="Detail type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="curtain_wall_head">Curtain Wall Head</SelectItem>
          <SelectItem value="railing_post">Railing Post</SelectItem>
          <SelectItem value="slab_edge">Slab Edge</SelectItem>
          <SelectItem value="rebar">Rebar</SelectItem>
          <SelectItem value="custom">Custom</SelectItem>
        </SelectContent>
      </Select>
      <div className="grid grid-cols-3 gap-2">
        <Input value={page} onChange={(e) => setPage(e.target.value)} placeholder="Sheet" />
        <Input value={x} onChange={(e) => setX(e.target.value)} placeholder="X" />
        <Input value={y} onChange={(e) => setY(e.target.value)} placeholder="Y" />
      </div>
      <Textarea value={params} onChange={(e) => setParams(e.target.value)} rows={4} />
      <Button type="submit">Generate Detail</Button>
    </form>
  );
}
