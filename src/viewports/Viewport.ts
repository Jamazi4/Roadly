import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { ObjectManager } from "../components/ObjectManager";
import { ViewportManager } from "../components/ViewportManager";

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

  protected abstract camera: THREE.OrthographicCamera | THREE.PerspectiveCamera;
  public abstract controller: OrbitControls;

  protected baseHighlightDistance = 0.01;
  protected highlightDistance = this.baseHighlightDistance;

  protected initialFov = 75;

  objectManager: ObjectManager;
  viewportManager: ViewportManager;

  name: string;

  constructor(
    divId: string,
    objectManager: ObjectManager,
    viewportManager: ViewportManager
  ) {
    this.name = divId;
    this.viewportManager = viewportManager;
    this.viewportManager.addViewport(this);
    this.objectManager = objectManager;
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

  // overriden in 3D for fov/distance differences
  protected onZoomUpdate(): void {
    this.controller.addEventListener("change", () => {
      this.highlightDistance = this.baseHighlightDistance / this.camera.zoom;
      this.objectManager.updateOnZoom(this.camera.zoom);
    });
  }

  public update(): void {
    this.renderer.render(this.scene, this.camera);
    // this.controller.update();

    // console.log(this.highlightDistance);
  }

  resize(): void {
    this.viewportWidth = this.divElement.clientWidth;
    this.viewportHeight = this.divElement.clientHeight;
    this.aspect = this.viewportWidth / this.viewportHeight;
  }
  abstract mouseControl(): void;
}
