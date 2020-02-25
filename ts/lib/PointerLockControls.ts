import * as THREE from '@lib/three';
import { mathConstants } from '@constants/mathematical';

const { PI_2 } = mathConstants;

export const PointerLockControls = function(camera, domElement) {
	this.domElement = domElement;

	const euler = new THREE.Euler(0, 0, 0, 'YXZ');
	const vec = new THREE.Vector3();

	const onMouseMove = (event) => {
    const buttonPressed = event.buttons === 1;
    if (!buttonPressed) return;
		const movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
    const movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
		euler.setFromQuaternion(camera.quaternion);
		euler.y -= movementX * 0.002;
		euler.x -= movementY * 0.002;
		euler.x = Math.max(-PI_2, Math.min(PI_2, euler.x));
		camera.quaternion.setFromEuler(euler);
	};

	this.connect = () => {
		document.addEventListener('mousemove', onMouseMove, false);
	};

	this.disconnect = () => {
		document.removeEventListener('mousemove', onMouseMove, false);
	};

	this.dispose = () => {
		this.disconnect();
	};

	this.getObject = () => {
		return camera;
	};

	this.getDirection = () => {
		var direction = new THREE.Vector3(0, 0, - 1);
		return function (v) {
			return v.copy(direction).applyQuaternion(camera.quaternion);
		};
	};

	this.moveForward = (distance) => {
		vec.setFromMatrixColumn(camera.matrix, 0);
		vec.crossVectors(camera.up, vec);
		camera.position.addScaledVector(vec, distance);
	};

	this.moveRight = (distance) => {
		vec.setFromMatrixColumn(camera.matrix, 0);
		camera.position.addScaledVector(vec, distance);
	};

	this.lock = () => {
		this.domElement.requestPointerLock();
	};

	this.unlock = () => {
		document.exitPointerLock();
  };
  this.getDirection();
	this.connect();
};
