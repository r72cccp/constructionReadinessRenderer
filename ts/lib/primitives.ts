export type Position = {
  x?: number;
  y?: number;
  z?: number;
};

export type Rotation = {
  rx?: number;
  ry?: number;
  rz?: number;
};

export type Vertex = {
  position?: Position;
  rotation?: Rotation;
};
