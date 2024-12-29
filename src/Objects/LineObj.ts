import * as THREE from "three";

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
    this.planRepr.material = this.selectedMat;
  }

  select() {}

  getPlan(): THREE.Line {
    return this.planRepr;
  }
}
