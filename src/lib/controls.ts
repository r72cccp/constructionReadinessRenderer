import * as THREE from '@lib/three';
import { Logger } from '@lib/logger';

export class ControlState {
  private actions: Array<string>
  public canJump: boolean;
  public direction: THREE.Vector3;
  public INTERSECTED;
  private logger: Logger;
  public moveBackward: boolean;
  public moveForward: boolean;
  public moveLeft: boolean;
  public moveRight: boolean;
  public prevTime: number;
  public raycaster: THREE.Raycaster;
  private renderNeeded: boolean;
  public mouse: THREE.Vector2;
  public runMode: boolean;
  public velocity: THREE.Vector3;

  constructor() {
    this.canJump = false;
    this.direction = new THREE.Vector3();
    this.INTERSECTED = null;
    this.logger = new Logger();
    this.actions = ['moveBackward', 'moveForward', 'moveLeft', 'moveRight', 'canJump', 'runMode'];
    this.moveBackward = false;
    this.moveForward = false;
    this.moveLeft = false;
    this.moveRight = false;
    this.prevTime = performance.now();
    this.raycaster = new THREE.Raycaster();
    this.renderNeeded = true;
    this.mouse = new THREE.Vector2();
    this.runMode = false;
    this.velocity = new THREE.Vector3();
  };

  private onKeyDown = (event) => {
    switch (event.keyCode) {
      case 16: // shift
        this.registerAction('runMode', true);
        break;
      case 38: // up
      case 87: // w
        this.registerAction('moveForward', true);
        break;

      case 37: // left
      case 65: // a
        this.registerAction('moveLeft', true);
        break;

      case 40: // down
      case 83: // s
        this.registerAction('moveBackward', true);
        break;

      case 39: // right
      case 68: // d
        this.registerAction('moveRight', true);
        break;

      case 32: // space
        if (this.canJump === true) this.velocity.y += 350;
        this.registerAction('canJump', false);
        break;
    }
  };

  private onKeyUp = (event) => {
    // this.logger.log({ 'event.keyCode': event.keyCode });
    switch (event.keyCode) {
      case 16: // shift
        this.registerAction('runMode', false);
        break;
      case 38: // up
      case 87: // w
        this.registerAction('moveForward', false);
        break;

      case 37: // left
      case 65: // a
        this.registerAction('moveLeft', false);
        break;

      case 40: // down
      case 83: // s
        this.registerAction('moveBackward', false);
        break;

      case 39: // right
      case 68: // d
        this.registerAction('moveRight', false);
        break;
    }
  };

  private registerAction(to: string, value: boolean): void {
    this.renderNeeded = true;
    // this.logger.log(`#113, to: ${to} = ${value}`)
    this[to] = value;
  };

  private anyAction(): boolean {
    return this.actions.map((actionName) => this[actionName]).some((x) => x);
  };

  public registerRendering(): void {
    if (!this.anyAction()) {
      this.renderNeeded = false;
    };
  };

  public isRenderNeeded(): boolean {
    return this.renderNeeded;
  };

  private onMouseMove = (event) => {
    // Вычисление положения курсора мыши в нормализованных координатах монитора
    // (от -1 до +1) для обоих компонентов.
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    this.renderNeeded = true;
  };

  public init = () => {
    this.renderNeeded = true;
    document.addEventListener('mousemove', this.onMouseMove, false);
    document.addEventListener('keydown', this.onKeyDown, false);
    document.addEventListener('keyup', this.onKeyUp, false);
  };
}
