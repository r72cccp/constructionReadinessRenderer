// Текущая версия вебпака не делает tree-shaking для three из коробки.
// Данный файл реализован как временное решение

import { AxesHelper } from 'three/src/helpers/AxesHelper';
import { BoxBufferGeometry } from 'three/src/geometries/BoxGeometry';
import { BufferGeometry } from 'three/src/core/BufferGeometry';
import { Camera } from 'three/src/cameras/Camera';
import { Color } from 'three/src/math/Color';
import { EdgesGeometry } from 'three/src/geometries/EdgesGeometry';
import { Euler } from 'three/src/math/Euler';
import { Font } from 'three/src/extras/core/Font';
// import { Geometry } from 'three/src/core/Geometry';
import { Group } from 'three/src/objects/Group';
import { HemisphereLight } from 'three/src/lights/HemisphereLight';
import { LineBasicMaterial } from 'three/src/materials/LineBasicMaterial';
import { LineSegments } from 'three/src/objects/LineSegments';
import { Matrix4 } from 'three/src/math/Matrix4';
import { Mesh } from 'three/src/objects/Mesh';
import { MeshBasicMaterial } from 'three/src/materials/MeshBasicMaterial';
import { MeshLambertMaterial } from 'three/src/materials/MeshLambertMaterial';
import { MeshPhongMaterial } from 'three/src/materials/MeshPhongMaterial';
import { Object3D } from 'three/src/core/Object3D';
import { PerspectiveCamera } from 'three/src/cameras/PerspectiveCamera';
import { PlaneGeometry } from 'three/src/geometries/PlaneGeometry';
import { Raycaster } from 'three/src/core/Raycaster';
import { Scene } from 'three/src/scenes/Scene';
import { TextGeometry } from 'three/src/geometries/TextGeometry';
import { Vector2 } from 'three/src/math/Vector2';
import { Vector3 } from 'three/src/math/Vector3';
import { WebGLRenderer } from 'three/src/renderers/WebGLRenderer';

export {
  AxesHelper,
  BoxBufferGeometry,
  BufferGeometry,
  Camera,
  Color,
  EdgesGeometry,
  Euler,
  // Geometry,
  Group,
  HemisphereLight,
  LineBasicMaterial,
  LineSegments,
  Font,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  MeshPhongMaterial,
  Object3D,
  PerspectiveCamera,
  PlaneGeometry,
  Raycaster,
  Scene,
  TextGeometry,
  Vector2,
  Vector3,
  WebGLRenderer,
};
