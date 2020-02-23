import * as THREE from 'three';

export type ControlStateProps = {
  canJump?: boolean;
  direction?: THREE.Vector3;
  moveBackward?: boolean;
  moveForward?: boolean;
  moveLeft?: boolean;  
  moveRight?: boolean;
  prevTime?: number;
  raycaster?: THREE.Raycaster;
  velocity?: THREE.Vector3;
};

export class ControlState {
  public moveForward;
  public moveBackward;
  public moveLeft;
  public moveRight;
  public canJump;
  public prevTime;
  public velocity;
  public direction;
  public raycaster;

	constructor(props?: ControlStateProps) {
    this.moveForward = props && props.moveForward || false;
    this.moveBackward = props && props.moveBackward || false;
    this.moveLeft = props && props.moveLeft || false;
    this.moveRight = props && props.moveRight || false;
    this.canJump = props && props.canJump || false;
    this.prevTime = props && props.prevTime || performance.now();
    this.velocity = props && props.velocity || new THREE.Vector3();
    this.direction = props && props.direction || new THREE.Vector3();
    this.raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, - 1, 0), 0, 10);
  };


  private onKeyDown = (event) => {
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

  public init = () => {
    document.addEventListener( 'keydown', this.onKeyDown, false );
    document.addEventListener( 'keyup', this.onKeyUp, false );
  };
}
