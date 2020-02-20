export type Vertex = {
  x: number;
  y: number;
  z: number;
};

export type Face = Array<Vertex>;

export type Vertex2D = {
  x: number;
  y: number;
};

// Конструктор 3d 'пикселя' - координаты точки в 3d пространстве
const createVertex = (x: number, y: number, z: number): Vertex => {
  return {
    x: Number(x),
    y: Number(y),
    z: Number(z),
  }
};

// Конструктор проекции точки на канвас
const createVertex2D = (x: number, y: number): Vertex2D => {
  return {
    x: Number(x),
    y: Number(y),
  }
};

export const rendererUtils = {
  createVertex,
  createVertex2D,
}