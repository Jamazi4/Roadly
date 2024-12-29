import * as THREE from "three";

export class VertexMarker {
  private markerMat = new THREE.MeshBasicMaterial({ color: 0xffa52b });
  private curve = new THREE.EllipseCurve(
    0,
    0,
    0.05,
    0.05,
    0,
    2 * Math.PI,
    false,
    0
  );
  private points = this.curve.getPoints(3);
  private geometry = new THREE.BufferGeometry().setFromPoints(this.points);
  private marker = new THREE.Line(this.geometry, this.markerMat);

  public getMarker() {
    return this.marker;
  }
}
