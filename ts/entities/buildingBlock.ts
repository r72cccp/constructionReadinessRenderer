import { BuildingPrimitive, Cube, Vertex } from '@lib/primitives';
import { CSS3DObject } from '@lib/CSS3DRenderer';
import { themeColors } from '@constants/colors';
import { lastArrayElement } from '@lib/arrayUtils';
import { mathConstants } from '@constants/mathematical';


const { PI_2 } = mathConstants;
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
  // const faceTexture = document.createElement('div');
  // const readinessPercentBlock = document.createElement('div');
  // readinessPercentBlock.textContent = `${readinessPercent}%`;
  // readinessPercentBlock.style.backgroundColor = 'yellow';
  // readinessPercentBlock.style.color = 'crimson';
  // faceTexture.appendChild(readinessPercentBlock);

  // const faceHTMLObject = new CSS3DObject(faceTexture);
  // faceHTMLObject.rotation.x = -PI_2;
  // faceHTMLObject.position.x = x + 100;
  // faceHTMLObject.position.y = y + 100;
  // faceHTMLObject.position.z = z + 10;
  // cube.push(faceHTMLObject);

  var element = document.createElement( 'div' );
  element.className = 'element';
  element.style.backgroundColor = 'rgba(0,127,127,' + ( Math.random() * 0.5 + 0.25 ) + ')';

  var number = document.createElement( 'div' );
  number.className = 'number';
  number.textContent = `${readinessPercent}%`;
  element.appendChild( number );

  var symbol = document.createElement( 'div' );
  symbol.className = 'symbol';
  symbol.textContent = 'test 52';
  element.appendChild( symbol );

  var details = document.createElement( 'div' );
  details.className = 'details';
  details.innerHTML = 'test57' + '<br>' + 'testolooloolool';
  element.appendChild( details );

  var object = new CSS3DObject( element );
  object.position.x = Math.random() * 4000 - 2000;
  object.position.y = Math.random() * 4000 - 2000;
  object.position.z = Math.random() * 4000 - 2000;
  cube.push( object );


  return cube;
};
