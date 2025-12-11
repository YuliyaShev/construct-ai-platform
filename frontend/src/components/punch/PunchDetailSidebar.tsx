"use client";

import { PunchItemCard } from "./PunchItemCard";
import { PunchPhotoViewer } from "./PunchPhotoViewer";

export function PunchDetailSidebar({ item }: { item?: any }) {
  return (
    <div className="space-y-3">
      <PunchItemCard item={item} />
      <PunchPhotoViewer photos={item?.photos || []} />
    </div>
  );
}
