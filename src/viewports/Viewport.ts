import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

export abstract class Viewport {
  // DOM
  protected divElement: HTMLElement;
  protected promptMessageElement: HTMLElement;
  protected viewportWidth: number;
  protected viewportHeight: number;
  protected aspect: number;
  protected rect: DOMRect;
  // SCENE
  public renderer: THREE.WebGLRenderer;
  public scene = new THREE.Scene();
  protected backgroundColor = new THREE.Color(0x202020);

  protected gridSize = 10;
  protected gridDivisions = 10;

  protected abstract camera: THREE.OrthographicCamera | THREE.PerspectiveCamera;
  protected abstract controller: OrbitControls;
  protected abstract gridHelper: THREE.GridHelper;

  constructor(divId: string) {
    this.divElement = document.getElementById(divId)!;
    this.promptMessageElement =
      this.divElement.querySelector(".prompt-message")!;
    this.viewportWidth = this.divElement.offsetWidth;
    this.viewportHeight = this.divElement.offsetHeight;
    this.aspect = this.viewportWidth / this.viewportHeight;
    this.rect = this.divElement.getBoundingClientRect();

    this.renderer = new THREE.WebGLRenderer({ antialias: false });
    this.renderer.setSize(this.viewportWidth, this.viewportHeight);
    this.scene = new THREE.Scene();
    this.scene.background = this.backgroundColor;

    this.divElement.appendChild(this.renderer.domElement);
  }

  public update(): void {
    this.renderer.render(this.scene, this.camera);
    this.controller.update();
  }

  resize(): void {
    this.viewportWidth = this.divElement.clientWidth;
    this.viewportHeight = this.divElement.clientHeight;
    this.aspect = this.viewportWidth / this.viewportHeight;
  }
  abstract mouseControl(): void;
}
