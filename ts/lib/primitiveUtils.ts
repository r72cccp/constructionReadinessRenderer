import { Vertex, Face, rendererUtils } from './3dUtils';

export type Cube = {
  vertices: Array<Vertex>;
  faces: Array<Face>;
};

// Конструктор "кубика"
const createCube = (center: Vertex, side: number): Cube => {
  // Генерация вершин куба (8 штук)
  const d = side / 2;

  const vertices = [
    rendererUtils.createVertex(center.x - d, center.y - d, center.z + d),
    rendererUtils.createVertex(center.x - d, center.y - d, center.z - d),
    rendererUtils.createVertex(center.x + d, center.y - d, center.z - d),
    rendererUtils.createVertex(center.x + d, center.y - d, center.z + d),
    rendererUtils.createVertex(center.x + d, center.y + d, center.z + d),
    rendererUtils.createVertex(center.x + d, center.y + d, center.z - d),
    rendererUtils.createVertex(center.x - d, center.y + d, center.z - d),
    rendererUtils.createVertex(center.x - d, center.y + d, center.z + d)
  ];

  return {
    vertices,
    faces: [
      [vertices[0], vertices[1], vertices[2], vertices[3]],
      [vertices[3], vertices[2], vertices[5], vertices[4]],
      [vertices[4], vertices[5], vertices[6], vertices[7]],
      [vertices[7], vertices[6], vertices[1], vertices[0]],
      [vertices[7], vertices[0], vertices[3], vertices[4]],
      [vertices[1], vertices[6], vertices[5], vertices[2]]
    ],
  }
};

export const primitiveUtils = {
  createCube,
};
