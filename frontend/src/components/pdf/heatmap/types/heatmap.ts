export type HeatmapPoint = {
  x: number;
  y: number;
  severity: "high" | "medium" | "low";
  confidence: number;
  page?: number;
};

export type HeatmapFilters = {
  high: boolean;
  medium: boolean;
  low: boolean;
};
