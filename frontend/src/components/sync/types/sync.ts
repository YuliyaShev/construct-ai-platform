export type SyncBBox = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export type SyncElement = {
  id: string;
  page: number;
  bbox: SyncBBox;
  position3D: [number, number, number];
};

export type SyncMap = Record<string, SyncElement>;
