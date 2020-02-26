import * as THREE from '@lib/three';

export class CSS3DObject extends THREE.Object3D {

	constructor( element: HTMLElement );
	element: HTMLElement;

	onBeforeRender: ( renderer: unknown, scene: THREE.Scene, camera: THREE.Camera ) => void;
	onAfterRender: ( renderer: unknown, scene: THREE.Scene, camera: THREE.Camera ) => void;

}

export class CSS3DSprite extends CSS3DObject {

	constructor( element: HTMLElement );

}

export class CSS3DRenderer {

	constructor();
	domElement: HTMLElement;

	getSize(): { width: number, height: number };
	setSize( width: number, height: number ): void;
	render( scene: THREE.Scene, camera: THREE.Camera ): void;

}
