import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

import { Viewport } from "./Viewport";

export class ThreeDViewport extends Viewport {
  // Camera
  protected camera = new THREE.PerspectiveCamera(75, this.aspect, 0.1, 1000);

  // Lights
  private hemiSphereLight = new THREE.HemisphereLight(0xffffff, 0x888888, 1);
  private directionalLight = new THREE.DirectionalLight(0xffffff, 3);

  // Controller
  protected controller: OrbitControls;

  // GRID
  protected gridHelper = new THREE.GridHelper(
    this.gridSize,
    this.gridDivisions
  );

  constructor(divId: string) {
    super(divId);
    this.camera.lookAt(0, 0, 0);
    this.camera.position.set(5, 5, 5);
    this.camera.up.set(0, 0, 1);
    this.controller = new OrbitControls(this.camera, this.renderer.domElement);

    this.gridHelper.rotateX(1.5807);

    this.scene.add(this.hemiSphereLight);
    this.scene.add(this.directionalLight);
    this.scene.add(this.gridHelper);
  }

  resize(): void {
    super.resize();
    this.camera.aspect = this.aspect;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.viewportWidth, this.viewportHeight);
  }

  mouseControl(): void {}
}
