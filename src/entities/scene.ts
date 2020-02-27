import * as THREE from '@lib/three';
import { ComplexOfBuildings } from './complexOfBuildingsGenerator';
import { PointerLockControls } from '@lib/PointerLockControls';
import { ControlState } from '@lib/controls';
import { Floor, Light } from '@lib/primitives';
import { physicalConstants } from '@constants/physical';
import { CSS3DRenderer } from '@lib/CSS3DRenderer';
import { getPropInSafe } from '@lib/objectUtils';
import { Logger } from '@lib/logger';


export const sceneInit = (): void => {
  const logger = new Logger();
  logger.log('Begin scene initialization');
  const canvas = document.getElementById('canvas');
  const canvasWidth = canvas.clientWidth;
  const canvasHeight = canvas.clientHeight;
  const { G, SpectatorMass } = physicalConstants;
  const scene = new THREE.Scene();
  scene.position.y = 100;
  scene.background = new THREE.Color(0xccffcc);
  // scene.fog = new Fog(0xffffff, 0, 3000);

  const light = new Light();
  scene.add(light);
  logger.log(' - light added.');

  const floor = new Floor(10000, 10000);
  scene.add(floor);
  logger.log(' - floor added.');

  const camera = new THREE.PerspectiveCamera(25, canvasWidth / canvasHeight, 0.1, 10000);

  const controls = new PointerLockControls(camera, document.body);
  scene.add(controls.getObject());
  const complexOfBuildingObjects = ComplexOfBuildings();
  scene.add(complexOfBuildingObjects);
  logger.log(' - buildings added.');


  const controlState = new ControlState();
  controlState.init();
  logger.log(' - controls added.');

  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(canvasWidth, canvasHeight);
  canvas.appendChild(renderer.domElement);
  logger.log(' - WebGLRenderer added.');

  const css3DRenderer = new CSS3DRenderer();
  css3DRenderer.setSize(canvasWidth, canvasHeight);
  css3DRenderer.domElement.style.position = 'absolute';
  css3DRenderer.domElement.style.top = '0';
  css3DRenderer.domElement.style.left = '0';
  canvas.appendChild(css3DRenderer.domElement);
  logger.log(' - CSS3DRenderer added.');

  camera.position.y = 0;
  camera.position.z = 200;
  camera.rotation.x = 0.1;
  logger.log(' - camera position initialized.');
  logger.log('Begin animation cycle');
  let animationFrameIndex = 0;
  const animationFrameStartTime = Date.now();
  const animate = (): void => {
    animationFrameIndex++;
    const averageFps = Math.floor(animationFrameIndex / (Date.now() - animationFrameStartTime) * 1000);
    logger.log(`- animation #${animationFrameIndex} fps: ${averageFps}`);
    requestAnimationFrame(animate);
    controlState.raycaster.ray.origin.copy(controls.getObject().position);
    controlState.raycaster.ray.origin.y -= 10;
    const time = performance.now();
    const speed = controlState.runMode ? 4 : 1;
    const delta = (time - controlState.prevTime) / 1000;

    controlState.velocity.x -= controlState.velocity.x * G * delta;
    controlState.velocity.z -= controlState.velocity.z * G * delta;

    controlState.velocity.y -= G * SpectatorMass * delta;

    controlState.direction.z = Number(controlState.moveForward) - Number(controlState.moveBackward);
    controlState.direction.x = Number(controlState.moveRight) - Number(controlState.moveLeft);
    controlState.direction.normalize();

    if (controlState.moveForward || controlState.moveBackward) controlState.velocity.z -= controlState.direction.z * 400.0 * delta;
    if (controlState.moveLeft || controlState.moveRight) controlState.velocity.x -= controlState.direction.x * 400.0 * delta;

    controls.moveRight(-controlState.velocity.x * delta * speed);
    controls.moveForward(-controlState.velocity.z * delta * speed);

    controls.getObject().position.y += controlState.velocity.y * delta;

    if (controls.getObject().position.y < 10) {
      controlState.velocity.y = 0;
      controls.getObject().position.y = 10;

      controlState.canJump = true;
    };
    controlState.prevTime = time;

    controlState.raycaster.setFromCamera(controlState.mouse, camera);
    const intersects = controlState.raycaster.intersectObjects(scene.children, true);
    if (intersects.length > 0) {
      let intersectedObject = intersects.find((intersect) => getPropInSafe(intersect, (i) => i.object.material.emissive));
      if (intersectedObject && controlState.INTERSECTED != intersectedObject.object) {
        if (controlState.INTERSECTED) {
          controlState.INTERSECTED.material.emissive.setHex(controlState.INTERSECTED.currentHex);
        };
        controlState.INTERSECTED = intersectedObject.object;
        controlState.INTERSECTED.currentHex = controlState.INTERSECTED.material.emissive.getHex();
        controlState.INTERSECTED.material.emissive.setHex(0xff0000);
      };
    } else {
      if (controlState.INTERSECTED) {
        controlState.INTERSECTED.material.emissive.setHex(controlState.INTERSECTED.currentHex);
      };
      controlState.INTERSECTED = null;
    };

    css3DRenderer.render(scene, camera);
    renderer.render(scene, camera);
  };

  animate();
};
