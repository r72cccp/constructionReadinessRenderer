import {
  Color,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from '@lib/three';
import { ComplexOfBuildings } from './complexOfBuildingsGenerator';
import { PointerLockControls } from '@lib/PointerLockControls';
import { ControlState } from '@lib/controls';
import { BuildingPrimitive, Floor, Light } from '@lib/primitives';
import { physicalConstants } from '@constants/physical';
import { getPropInSafe } from '@lib/objectUtils';


export const sceneInit = (): void => {
  const canvas = document.getElementById('canvas');
  const canvasWidth = canvas.clientWidth;
  const canvasHeight = canvas.clientHeight;
  const { G, SpectatorMass } = physicalConstants;
  const scene = new Scene();
  scene.position.y = 100;
  scene.background = new Color(0xccffcc);
  // scene.fog = new Fog(0xffffff, 0, 3000);

  const light = Light();
  scene.add(light);

  const floor = Floor(1000, 1000);
  scene.add(floor);

  const camera = new PerspectiveCamera(25, canvasWidth / canvasHeight, 0.1, 10000);

  const controls = new PointerLockControls(camera, document.body);
  scene.add(controls.getObject());
  const objects = ComplexOfBuildings();
  objects.forEach((object: BuildingPrimitive) => scene.add(object));

  const controlState = new ControlState();
  controlState.init();

  const renderer = new WebGLRenderer({ alpha: true });
  renderer.setSize(canvasWidth, canvasHeight);
  canvas.appendChild(renderer.domElement);

  camera.position.y = 0;
  camera.position.z = 200;
  camera.rotation.x = 0.1;

  const animate = (): void => {
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
    const intersects = controlState.raycaster.intersectObjects(scene.children);
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

    renderer.render(scene, camera);
  };

  animate();
};
