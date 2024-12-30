import * as THREE from "three";

export interface ConstantScreenSize {
  updateSize(zoomFactor: number): void;
}

export class VertexMarker implements ConstantScreenSize {
  private markerMat = new THREE.MeshBasicMaterial({ color: 0xffa52b });
  private markerSize = 0.1;
  private curve = new THREE.EllipseCurve(
    0,
    0,
    this.markerSize,
    this.markerSize,
    0,
    2 * Math.PI,
    false,
    0
  );
  private points = this.curve.getPoints(5);
  private geometry = new THREE.BufferGeometry().setFromPoints(this.points);
  private marker = new THREE.Line(this.geometry, this.markerMat);

  public getMarker() {
    return this.marker;
  }

  public updateSize(zoomFactor: number) {
    this.curve.xRadius = this.markerSize / zoomFactor;
    this.curve.yRadius = this.markerSize / zoomFactor;
    const updatedPoints = this.curve.getPoints(5);
    this.geometry.setFromPoints(updatedPoints);
    this.marker.geometry = this.geometry;
  }
}
