import { Cube, HTMLBlock, Vertex } from '@lib/primitives';
import { themeColors } from '@constants/colors';
import { themeSizes } from '@constants/primitiveSizes';
import { lastArrayElement } from '@lib/arrayUtils';
import * as THREE from '@lib/three';


const { cubeEdgeLength } = themeSizes;
const faceColors: Array<number> = themeColors.readinessColors;
const getBuildingBlockColor = (readinessPercent: number): number => {
  if (readinessPercent <= 0) return faceColors[0];
  if (readinessPercent === 100) return lastArrayElement(faceColors);
  const middleColorsCount = faceColors.length - 2;
  const colorIndex = Math.floor(readinessPercent / 100 * middleColorsCount) + 1;
  if (colorIndex < 1) return faceColors[1];
  if (colorIndex > faceColors.length - 1) return faceColors[faceColors.length - 1];
  return faceColors[colorIndex];
};


export const BuildingBlock = (readinessPercent: number, cubePosition: Vertex): THREE.Group => {
  const color = getBuildingBlockColor(readinessPercent)
  const cube = new Cube(cubePosition, color);

  const faceTexture = document.createElement('div');
  faceTexture.textContent = `${readinessPercent.toFixed(2)}%`;
  faceTexture.className = 'face-texture';

  const textPosition = { ...cubePosition };
  textPosition.position.z = cubePosition.position.z + cubeEdgeLength / 2;
  const faceHTMLObject = new HTMLBlock(textPosition, faceTexture);
  cube.add(faceHTMLObject);

  return cube;
};
