import { BuildingPrimitive, Cube, Vertex } from '@lib/primitives';
import { CSS3DObject } from '@lib/CSS3DRenderer';


export const BuildingBlock = (readinessPercent: number, x: number, y: number, z: number): Array<BuildingPrimitive> => {
  const cubePosition: Vertex = {
    position: { x, y, z },
  };
  const cube = Cube(cubePosition, readinessPercent);

  const faceTexture = document.createElement('div');
  const readinessPercentBlock = document.createElement('div');
  readinessPercentBlock.textContent = `${readinessPercentBlock}%`;
  faceTexture.appendChild(readinessPercentBlock);

  const faceHTMLObject = new CSS3DObject(faceTexture);
  faceHTMLObject.position.x = x + 100;
  faceHTMLObject.position.y = y + 100;
  faceHTMLObject.position.z = z + 10;
  cube.push(faceHTMLObject);
  return cube;
};
