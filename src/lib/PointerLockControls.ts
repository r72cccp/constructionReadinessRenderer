import * as THREE from '@lib/three';
import { mathConstants } from '@constants/mathematical';
import { Logger } from '@lib/logger';

const { PI_2 } = mathConstants;
const logger = new Logger();
type Movement = {
  x: number;
  y: number;
};

export class PointerLockControls {
  private camera: THREE.Camera;
  private euler: THREE.Euler;
  private previousPositionX: number;
  private previousPositionY: number;
  private vec: THREE.Vector3;

  constructor(camera: THREE.Camera/*, domElement: HTMLElement*/) {
    this.camera = camera;
    this.euler = new THREE.Euler(0, 0, 0, 'YXZ');
    this.previousPositionX = undefined;
    this.previousPositionY = undefined;
    this.vec = new THREE.Vector3();
    this.init();
  };

  private getMovement(event: MouseEvent): Movement {
    if (event.movementX || event.movementY) {
      // logger.log(`movement.x: ${event.movementX}, movement.y: ${event.movementY}`);
      return { x: event.movementX, y: event.movementY };
    };
    const { clientX: currentPositionX, clientY: currentPositionY } = event;
    let x = 0, y = 0;
    if (typeof this.previousPositionX !== 'undefined') {
      x = currentPositionX - this.previousPositionX;
    };
    if (typeof this.previousPositionY !== 'undefined') {
      y = currentPositionY - this.previousPositionY;
    };
    // logger.log(`movement.x: ${x}, movement.y: ${y}`);
    this.previousPositionX = currentPositionX;
    this.previousPositionY = currentPositionY;
    return { x, y };
  };

  private onMouseMove(event: MouseEvent): void {
    const buttonPressed = event.buttons === 1;
    if (!buttonPressed) {
      const { clientX: currentPositionX, clientY: currentPositionY } = event;
      this.previousPositionX = currentPositionX;
      this.previousPositionY = currentPositionY;
      return
    };

    const movement = this.getMovement(event);
    this.euler.setFromQuaternion(this.camera.quaternion);
    this.euler.y -= movement.x * 0.002;
    this.euler.x -= movement.y * 0.002;
    this.euler.x = Math.max(-PI_2, Math.min(PI_2, this.euler.x));
    // logger.log(`event.clientX: ${event.clientX}, event.clientY: ${event.clientY}`)
    // logger.log(`movementX: ${movement.x} movementY: ${movement.y} euler.x: ${this.euler.x}, euler.y: ${this.euler.y}, euler.z: ${this.euler.z}`);
    this.camera.quaternion.setFromEuler(this.euler);
  };

	public init(): void {
		document.addEventListener('mousemove', this.onMouseMove.bind(this), false);
	};

	// public getObject(): THREE.Camera {
	// 	return this.camera;
	// };

	public moveForward(distance) {
    // logger.log(`PointerLockControls.moveForward, distance = ${distance}`);
		this.vec.setFromMatrixColumn(this.camera.matrix, 0);
		this.vec.crossVectors(this.camera.up, this.vec);
		this.camera.position.addScaledVector(this.vec, distance);
	};

	public moveRight(distance) {
    // logger.log(`PointerLockControls.moveRight, distance = ${distance}`);
		this.vec.setFromMatrixColumn(this.camera.matrix, 0);
		this.camera.position.addScaledVector(this.vec, distance);
	};
};
