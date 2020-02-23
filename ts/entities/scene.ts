import * as THREE from 'three';
import { BuildingPrimitive, generateComplexOfBuildings } from './complex-of-buildings-generator';
import { PointerLockControls } from '../lib/PointerLockControls';
import { ControlState } from '../lib/controls'

export const sceneInit = (): void => {
  const canvas = document.getElementById('canvas');
  const canvasWidth = canvas.clientWidth;
  const canvasHeight = canvas.clientHeight;
  const G = 9.8;
  const spectatorMass = 100; // 100 кг - масса наблюдателя
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xccffcc);
  scene.fog = new THREE.Fog(0xffffff, 0, 3000);
  
  const light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75);
  light.position.set(500, 500, 500);
  scene.add(light);
  
  const camera = new THREE.PerspectiveCamera(75, canvasWidth / canvasHeight, 0.1, 1000);

  const controls = new PointerLockControls(camera, document.body);
  scene.add(controls.getObject());

  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(canvasWidth, canvasHeight);
  canvas.appendChild(renderer.domElement);

  const objects = generateComplexOfBuildings();
  objects.forEach((object: BuildingPrimitive) => {
    scene.add(object);
  });
  const axesHelper = new THREE.AxesHelper(20);
  scene.add(axesHelper);
  const controlState = new ControlState();
  controlState.init();
  
  camera.position.y = 20;
  camera.position.z = 50;
  camera.rotation.x = 0.1;

  const animate = (): void => {
    requestAnimationFrame(animate);
    controlState.raycaster.ray.origin.copy(controls.getObject().position);
    controlState.raycaster.ray.origin.y -= 10;
    const intersections = controlState.raycaster.intersectObjects(objects);
    const onObject = intersections.length > 0;
    const time = performance.now();
    const delta = (time - controlState.prevTime) / 1000;

    controlState.velocity.x -= controlState.velocity.x * 10.0 * delta;
    controlState.velocity.z -= controlState.velocity.z * 10.0 * delta;

    controlState.velocity.y -= G * spectatorMass * delta;

    controlState.direction.z = Number(controlState.moveForward) - Number(controlState.moveBackward);
    controlState.direction.x = Number(controlState.moveRight) - Number(controlState.moveLeft);
    controlState.direction.normalize(); // обеспечение непрерывности движения во всех направлениях (фикс бага со скачками)

    if (controlState.moveForward || controlState.moveBackward) controlState.velocity.z -= controlState.direction.z * 400.0 * delta;
    if (controlState.moveLeft || controlState.moveRight) controlState.velocity.x -= controlState.direction.x * 400.0 * delta;

    if (onObject === true) {
      controlState.velocity.y = Math.max(0, controlState.velocity.y);
      controlState.canJump = true;
    };

    controls.moveRight(-controlState.velocity.x * delta);
    controls.moveForward(-controlState.velocity.z * delta);

    controls.getObject().position.y += controlState.velocity.y * delta;

    if (controls.getObject().position.y < 10) {
      controlState.velocity.y = 0;
      controls.getObject().position.y = 10;

      controlState.canJump = true;
    };
    controlState.prevTime = time;
    renderer.render(scene, camera);
  };

  animate();
};
