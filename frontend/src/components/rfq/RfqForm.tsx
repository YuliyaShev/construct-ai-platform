"use client";

import { useState } from "react";
import { TradeSelector } from "./TradeSelector";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Props = {
  onGenerate: (payload: any) => void;
};

export function RfqForm({ onGenerate }: Props) {
  const [trades, setTrades] = useState<string[]>(["Concrete"]);
  const [contractType, setContractType] = useState("lump_sum");
  const [location, setLocation] = useState("Ontario");
  const [delivery, setDelivery] = useState("DBB");

  const submit = () => {
    onGenerate({
      trades,
      contract_type: contractType,
      project_location: location,
      delivery_method: delivery,
      include_safety_requirements: true,
      include_submittals: true,
    });
  };

  return (
    <div className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-sm space-y-3">
      <TradeSelector value={trades} onChange={setTrades} />
      <div className="grid grid-cols-3 gap-2">
        <Select value={contractType} onValueChange={setContractType}>
          <SelectTrigger><SelectValue placeholder="Contract type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="lump_sum">Lump Sum</SelectItem>
            <SelectItem value="unit_price">Unit Price</SelectItem>
            <SelectItem value="cost_plus">Cost Plus</SelectItem>
          </SelectContent>
        </Select>
        <Select value={delivery} onValueChange={setDelivery}>
          <SelectTrigger><SelectValue placeholder="Delivery" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="DBB">DBB</SelectItem>
            <SelectItem value="CM">CM</SelectItem>
            <SelectItem value="DB">DB</SelectItem>
            <SelectItem value="IPD">IPD</SelectItem>
          </SelectContent>
        </Select>
        <Select value={location} onValueChange={setLocation}>
          <SelectTrigger><SelectValue placeholder="Location" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="BC">BC</SelectItem>
            <SelectItem value="Ontario">Ontario</SelectItem>
            <SelectItem value="California">California</SelectItem>
            <SelectItem value="Texas">Texas</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button onClick={submit}>Generate RFQ Package</Button>
    </div>
  );
}
