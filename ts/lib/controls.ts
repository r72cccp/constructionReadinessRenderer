import * as THREE from 'three';

export type ControlStateProps = {
  canJump?: boolean;
  direction?: THREE.Vector3;
  moveBackward?: boolean;
  moveForward?: boolean;
  moveLeft?: boolean;  
  moveRight?: boolean;
  mouse?: THREE.Vector2;
  prevTime?: number;
  raycaster?: THREE.Raycaster;
  runMode?: boolean;
  velocity?: THREE.Vector3;
};

export class ControlState {
  public canJump;
  public direction;
  public INTERSECTED;
  public moveBackward;
  public moveForward;
  public moveLeft;
  public moveRight;
  public prevTime;
  public raycaster;
  public mouse;
  public runMode;
  public velocity;

	constructor(props?: ControlStateProps) {
    this.canJump = props && props.canJump || false;
    this.direction = props && props.direction || new THREE.Vector3();
    this.INTERSECTED = null;
    this.moveBackward = props && props.moveBackward || false;
    this.moveForward = props && props.moveForward || false;
    this.moveLeft = props && props.moveLeft || false;
    this.moveRight = props && props.moveRight || false;
    this.prevTime = props && props.prevTime || performance.now();
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.runMode = props && props.runMode || false;
    this.velocity = props && props.velocity || new THREE.Vector3();
  };

  private onKeyDown = (event) => {
    this.runMode = event.shiftKey;
    switch (event.keyCode) {
      case 38: // up
      case 87: // w
        this.moveForward = true;
        break;

      case 37: // left
      case 65: // a
        this.moveLeft = true;
        break;

      case 40: // down
      case 83: // s
        this.moveBackward = true;
        break;

      case 39: // right
      case 68: // d
        this.moveRight = true;
        break;

      case 32: // space
        if (this.canJump === true) this.velocity.y += 350;
        this.canJump = false;
        break;
    }
  };

  private onKeyUp = (event) => {
    this.runMode = event.shiftKey;
    switch (event.keyCode) {
      case 38: // up
      case 87: // w
        this.moveForward = false;
        break;

      case 37: // left
      case 65: // a
        this.moveLeft = false;
        break;

      case 40: // down
      case 83: // s
        this.moveBackward = false;
        break;

      case 39: // right
      case 68: // d
        this.moveRight = false;
        break;
    }
  };

  private onMouseMove = (event) => {
    // Вычисление положения курсора мыши в нормализованных координатах монитора
    // (от -1 до +1) для обоих компонентов.
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }    

  public init = () => {
    document.addEventListener('mousemove', this.onMouseMove, false);
    document.addEventListener('keydown', this.onKeyDown, false);
    document.addEventListener('keyup', this.onKeyUp, false);
  };
}
