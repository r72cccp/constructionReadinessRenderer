import { BuildingPrimitive, Cube, Vertex } from '@lib/primitives';
import { CSS3DObject } from '@lib/CSS3DRenderer';
import { themeColors } from '@constants/colors';
import { themeSizes } from '@constants/primitiveSizes';
import { lastArrayElement } from '@lib/arrayUtils';
import { mathConstants } from '@constants/mathematical';


const { PI_2 } = mathConstants;
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


export const BuildingBlock = (readinessPercent: number, x: number, y: number, z: number): Array<BuildingPrimitive> => {
  const cubePosition: Vertex = {
    position: { x, y, z },
  };
  const color = getBuildingBlockColor(readinessPercent)
  const cube = Cube(cubePosition, color);
  const faceTexture = document.createElement('div');
  const readinessPercentBlock = document.createElement('div');
  readinessPercentBlock.textContent = `${readinessPercent}%`;
  readinessPercentBlock.className = 'face-texture';
  faceTexture.appendChild(readinessPercentBlock);

  const faceHTMLObject = new CSS3DObject(faceTexture);
  faceHTMLObject.position.x = x;
  faceHTMLObject.position.y = y;
  faceHTMLObject.position.z = z + cubeEdgeLength / 2;
  cube.push(faceHTMLObject);

  return cube;
};
