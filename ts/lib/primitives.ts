import {
  AxesHelper,
  BoxBufferGeometry,
  EdgesGeometry,
  HemisphereLight,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  PlaneGeometry,
} from '@lib/three';
import { CSS3DObject } from '@lib/CSS3DRenderer';
import { themeColors } from '@constants/colors';
import { themeSizes } from '@constants/primitiveSizes';
import { lastArrayElement } from '@lib/arrayUtils';
import { mathConstants } from '@constants/mathematical';

const { PI_2 } = mathConstants;
const faceColors: Array<number> = themeColors.readinessColors;
const { cubeEdgeLength } = themeSizes;
const cubeGeometry = new BoxBufferGeometry(cubeEdgeLength, cubeEdgeLength, cubeEdgeLength);

const getFaceColor = (readinessPercent: number): number => {
  if (readinessPercent <= 0) return faceColors[0];
  if (readinessPercent === 100) return lastArrayElement(faceColors);
  const middleColorsCount = faceColors.length - 2;
  const colorIndex = Math.floor(readinessPercent / 100 * middleColorsCount) + 1;
  if (colorIndex < 1) return faceColors[1];
  if (colorIndex > faceColors.length - 1) return faceColors[faceColors.length - 1];
  return faceColors[colorIndex];
};

export type BuildingPrimitive = Mesh | LineSegments | CSS3DObject;

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

export const Floor = (width: number, length: number) => {
  const geometry = new PlaneGeometry(width, length, 1, 1);
	const material = new MeshBasicMaterial({ color: themeColors.groundColor });
	const floor = new Mesh(geometry, material);
  floor.rotation.x = -PI_2;
  return floor;
};

export const Light = () => {
  const light = new HemisphereLight(themeColors.skyColor, themeColors.groundColor, 0.75);
  light.position.set(500, 500, 500);
  return light;
}

export const axesHelper = (size = 20) => {
  return new AxesHelper(size);
};

export const Cube = (objectPosition: Vertex, readinessPercent: number): Array<BuildingPrimitive> => {
  const material = new MeshLambertMaterial({ color: getFaceColor(readinessPercent) });
  const cube = new Mesh(cubeGeometry, material);
  const { x, y, z } = objectPosition.position || {};
  const { rx, ry, rz } = objectPosition.rotation || {};
  objectPosition.position && cube.position.set(x, y, z);
  objectPosition.rotation && cube.rotation.set(rx, ry, rz);
  const edges = new EdgesGeometry(cubeGeometry);
  const line = new LineSegments(edges, new LineBasicMaterial({ color: 0x6699ff }));
  objectPosition.position && line.position.set(x, y, z);
  objectPosition.rotation && line.rotation.set(rx, ry, rz);
  return [cube, line];
};
