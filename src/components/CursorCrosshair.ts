import * as THREE from "three";

export class CursorCrosshair {
  points1 = [
    new THREE.Vector3(-1, 0, 0), // Start point
    new THREE.Vector3(1, 0, 0), // End point
  ];
  geometry1 = new THREE.BufferGeometry().setFromPoints(this.points1);
  material = new THREE.LineBasicMaterial({ color: 0xff0000 }); // Red line
  line1 = new THREE.Line(this.geometry1, this.material);
  points2 = [
    new THREE.Vector3(0, -1, 0), // Start point
    new THREE.Vector3(0, 1, 0), // End point
  ];
  geometry2 = new THREE.BufferGeometry().setFromPoints(this.points2);
  line2 = new THREE.Line(this.geometry2, this.material);
  lineGroup = new THREE.Group();

  constructor() {
    this.lineGroup.add(this.line1);
    this.lineGroup.add(this.line2);
  }
}
