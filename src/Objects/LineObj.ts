import * as THREE from "three";
import { color } from "three/tsl";

export class LineObj {
  defaultMat = new THREE.MeshBasicMaterial({ color: 0x4287f5 });
  selectedMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  planGeom = new THREE.BufferGeometry();
  planRepr: THREE.Line = new THREE.Line();

  constructor() {}

  createPlan(start: THREE.Vector3, end: THREE.Vector3) {
    this.planGeom.setFromPoints([start, end]);
    this.planRepr = new THREE.Line(this.planGeom, this.defaultMat);
  }

  highlight() {
    this.planRepr.material = this.highlightMaterial();
  }

  select() {}

  getPlan(): THREE.Line {
    return this.planRepr;
  }

  highlightMaterial(factor = 1.5) {
    const hexColor = this.defaultMat.color.getHex();
    // Step 1: Convert hex color to RGB components
    let r = (hexColor >> 16) & 0xff; // Extract red component
    let g = (hexColor >> 8) & 0xff; // Extract green component
    let b = hexColor & 0xff; // Extract blue component

    // Step 2: Apply the brightness factor to each RGB component
    r = Math.min(Math.floor(r * factor), 255); // Increase red
    g = Math.min(Math.floor(g * factor), 255); // Increase green
    b = Math.min(Math.floor(b * factor), 255); // Increase blue

    // Step 3: Convert RGB back to hex
    const brightenedColor = (r << 16) | (g << 8) | b;

    return new THREE.MeshBasicMaterial({ color: brightenedColor });
  }
}
