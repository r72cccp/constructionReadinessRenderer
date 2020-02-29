import * as THREE from '@lib/three';
import { CSS3DObject } from '@lib/CSS3DRenderer';

import { themeColors } from '@constants/colors';
import { themeSizes } from '@constants/primitiveSizes';
import { mathConstants } from '@constants/mathematical';
import { Logger } from './logger';

const logger = new Logger();
const { PI_2 } = mathConstants;
const { cubeEdgeLength } = themeSizes;
const cubeGeometry = new THREE.BoxBufferGeometry(cubeEdgeLength, cubeEdgeLength, cubeEdgeLength);

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

export class Vertex {
  public position?: Position;
  public rotation?: Rotation;

  constructor(x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0) {
    this.position = { x, y, z };
    this.rotation = { rx, ry, rz };
  };
};

export class Floor extends THREE.Mesh {
  constructor(width: number, length: number) {
    const geometry = new THREE.PlaneGeometry(width, length, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: themeColors.groundColor });
    super(geometry, material);
    this.rotation.x = -PI_2;
  };
};

export class Light extends THREE.HemisphereLight {
  constructor() {
    super(themeColors.skyColor, themeColors.groundColor, 0.75);
    this.position.set(500, 500, 500);
  };
};

export const axesHelper = (size = 20) => {
  return new THREE.AxesHelper(size);
};

export class Cube extends THREE.Group {
  constructor(objectPosition: Vertex, color: number) {
    const material = new THREE.MeshLambertMaterial({ color });
    const cube = new THREE.Mesh(cubeGeometry, material);
    const { x, y, z } = objectPosition.position || {};
    const { rx, ry, rz } = objectPosition.rotation || {};
    objectPosition.position && cube.position.set(x, y, z);
    objectPosition.rotation && cube.rotation.set(rx, ry, rz);
    const edges = new THREE.EdgesGeometry(cubeGeometry);
    const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x6699ff }));
    objectPosition.position && line.position.set(x, y, z);
    objectPosition.rotation && line.rotation.set(rx, ry, rz);
    super();
    this.add(cube);
    this.add(line);
  };
};

export class HTMLBlock extends CSS3DObject {
  constructor(objectPosition: Vertex, htmlDOMElement: HTMLElement) {
    const { x, y, z } = objectPosition.position || {};
    const { rx, ry, rz } = objectPosition.rotation || {};
    
    super(htmlDOMElement);
    this.position.x = x;
    this.position.y = y;
    this.position.z = z;
    this.rotation.x = rx;
    this.rotation.y = ry;
    this.rotation.z = rz;
  };
};

export type TextBlockOptions = {
  bevelEnabled?: boolean;
  bevelOffset?: number;
  bevelSegments?: number;
  bevelSize?: number;
  bevelThickness?: number;
  curveSegments?: number;
  color?: number;
  height?: number;
  size?: number;
};

const defaultTextOptions: TextBlockOptions = {
  bevelEnabled: false,
  bevelOffset: 0,
  bevelSegments: 0,
  bevelSize: 0,
  bevelThickness: 0,
  color: 0xff0000,
  curveSegments: 4,
  height: 0.3,
  size: 3,
};

export class TextBlock extends THREE.Mesh {
  // Функционал с загрузкой шрифта из файла более правильный, но в браузере 1С загрузка данных из файлов запрещена
  // private static fontLoader: THREE.FontLoader;
  private static font: THREE.Font;

  constructor(objectPosition: Vertex, text: string, textOptions = defaultTextOptions) {
    // if (!TextBlock.fontLoader) {
    //   TextBlock.fontLoader = new FontLoader();
    // };
    // TextBlock.fontLoader.load(path.resolve(__dirname, '@build/helvetiker_regular.typeface.json'));
    if (!TextBlock.font) {
      logger.log('Инициализация шрифта')
      TextBlock.font = new THREE.Font((window as any).Font);
    };
    const textGeometry = new THREE.TextGeometry(text, {
      font: TextBlock.font,
      ...defaultTextOptions,
      ...textOptions,
    });
    textGeometry.center();
    const textBufferGeometry = new THREE.BufferGeometry().fromGeometry(textGeometry);
    const materials = [
      new THREE.MeshBasicMaterial({ color: textOptions.color || 0xffff33, flatShading: true }),
      new THREE.MeshBasicMaterial({ color: textOptions.color >> 1 }),
    ];
    super(textBufferGeometry, materials);
    const { x, y, z } = objectPosition.position || {};
    const { rx, ry, rz } = objectPosition.rotation || {};
    
    this.position.x = x;
    this.position.y = y;
    this.position.z = z;
    this.rotation.x = rx;
    this.rotation.y = ry;
    this.rotation.z = rz;
  };
};
