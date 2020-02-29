import { Cube, TextBlock, TextBlockOptions, Vertex } from '@lib/primitives';
import { themeColors } from '@constants/colors';
import { themeSizes } from '@constants/primitiveSizes';
import { lastArrayElement } from '@lib/arrayUtils';
import * as THREE from '@lib/three';


const { cubeEdgeLength } = themeSizes;
// const buildingReadinessLabelProps: TextBlockOptions = {};
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

  const textPosition = { ...cubePosition };
  textPosition.position.z = cubePosition.position.z + cubeEdgeLength / 2;
  const buildingReadinessLabelProps = {
    color: 0x77ffaa,
  };
  const TextObject = new TextBlock(textPosition, `${readinessPercent.toFixed(2)}%`, buildingReadinessLabelProps);
  cube.add(TextObject);

  return cube;
};
