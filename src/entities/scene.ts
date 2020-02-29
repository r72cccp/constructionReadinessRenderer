import * as THREE from '@lib/three';
import { ComplexOfBuildings } from './complexOfBuildingsGenerator';
import { PointerLockControls } from '@lib/PointerLockControls';
import { ControlState } from '@lib/controls';
import { Floor, Light } from '@lib/primitives';
import { physicalConstants } from '@constants/physical';
// import { CSS3DRenderer } from '@lib/CSS3DRenderer';
import { getPropInSafe } from '@lib/objectUtils';
import { Logger } from '@lib/logger';


export const sceneInit = (): void => {
  const logger = new Logger();
  // logger.log('Begin scene initialization');
  const canvas = document.getElementById('canvas');
  let canvasWidth = canvas.clientWidth;
  let canvasHeight = canvas.clientHeight;
  const { G, SpectatorMass } = physicalConstants;
  const scene = new THREE.Scene();
  scene.position.y = 100;
  scene.background = new THREE.Color(0xccffcc);

  const light = new Light();
  scene.add(light);
  // logger.log(' - light added.');

  const floor = new Floor(10000, 10000);
  scene.add(floor);
  // logger.log(' - floor added.');

  const camera = new THREE.PerspectiveCamera(25, canvasWidth / canvasHeight, 0.1, 10000);

  const controlledCamera = new PointerLockControls(camera/*, document.body*/);
  scene.add(camera);
  // logger.log(' - controlledCamera added.');
  
  
  const complexOfBuildingObjects = ComplexOfBuildings();
  scene.add(complexOfBuildingObjects);
  // logger.log(' - buildings added.');

  const controlState = new ControlState();
  controlState.init();
  // logger.log(' - controlledCamera added.');

  const webGLRenderer = new THREE.WebGLRenderer({ alpha: true });
  webGLRenderer.setSize(canvasWidth, canvasHeight);
  canvas.appendChild(webGLRenderer.domElement);
  // logger.log(' - WebGLRenderer added.');

  // const css3DRenderer = new CSS3DRenderer();
  // css3DRenderer.setSize(canvasWidth, canvasHeight);
  // css3DRenderer.domElement.style.position = 'absolute';
  // css3DRenderer.domElement.style.top = '0';
  // css3DRenderer.domElement.style.left = '0';
  // canvas.appendChild(css3DRenderer.domElement);
  // logger.log(' - CSS3DRenderer added.');

  // logger.log(`canvasWidth: ${canvasWidth}, canvasHeight: ${canvasHeight}`);
  const canvasResize = (): void => {
    const canvas = document.getElementById('canvas');
    canvasWidth = canvas.clientWidth;
    canvasHeight = canvas.clientHeight;
    camera.aspect = canvasWidth / canvasHeight;
    camera.updateProjectionMatrix();

    webGLRenderer.setSize(canvasWidth, canvasHeight);
    // css3DRenderer.setSize(canvasWidth, canvasHeight);
  };

  camera.position.y = 0;
  camera.position.z = 200;
  camera.rotation.x = 0.1;
  
  // logger.log(' - camera position initialized.');
  // logger.log('Begin animation cycle');

  window.addEventListener('resize', canvasResize, false);

  const animate = (): void => {
    requestAnimationFrame(animate);
    if (!controlState.isRenderNeeded()) {
      controlState.prevTime = performance.now();
      return;
    };
    controlState.raycaster.ray.origin.copy(camera.position);
    controlState.raycaster.ray.origin.y -= 10;
    const time = performance.now();
    const speed = controlState.runMode ? 4 : 1;
    const delta = (time - controlState.prevTime) / 1000;

    // logger.log('#89 time:', { 'controlState.prevTime': controlState.prevTime, time, speed, delta, 'controlState.velocity': controlState.velocity });

    controlState.velocity.x -= controlState.velocity.x * G * delta;
    controlState.velocity.z -= controlState.velocity.z * G * delta;

    controlState.velocity.y -= G * SpectatorMass * delta;

    controlState.direction.z = Number(controlState.moveForward) - Number(controlState.moveBackward);
    controlState.direction.x = Number(controlState.moveRight) - Number(controlState.moveLeft);
    controlState.direction.normalize();

    if (controlState.moveForward || controlState.moveBackward) controlState.velocity.z -= controlState.direction.z * 400.0 * delta;
    if (controlState.moveLeft || controlState.moveRight) controlState.velocity.x -= controlState.direction.x * 400.0 * delta;

    controlledCamera.moveRight(-controlState.velocity.x * delta * speed);
    controlledCamera.moveForward(-controlState.velocity.z * delta * speed);

    camera.position.y += controlState.velocity.y * delta;

    if (camera.position.y < 10) {
      controlState.velocity.y = 0;
      camera.position.y = 10;

      controlState.canJump = true;
    };
    controlState.prevTime = time;

    controlState.raycaster.setFromCamera(controlState.mouse, camera);
    const intersects = controlState.raycaster.intersectObjects(scene.children, true);
    if (intersects.length > 0) {
      let intersectedObject = intersects.find((intersect) => getPropInSafe(intersect, (i) => (i.object as any).material.emissive));
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

    // css3DRenderer.render(scene, camera);
    webGLRenderer.render(scene, camera);
    controlState.registerRendering();
  };

  animate();
};
