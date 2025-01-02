import * as THREE from "three";
import { VertexMarker } from "../utils/VertexMarker";
import { RoadlyObj } from "./RoadlyObj";

export class LineObj extends RoadlyObj {
  defaultMat = new THREE.LineBasicMaterial({ color: 0x4287f5 });

  planGeom = new THREE.BufferGeometry();
  planRepr: THREE.Line = new THREE.Line();
  planGroup: THREE.Group = new THREE.Group();

  constructor() {
    super();
  }

  createPlan(start: THREE.Vector3, end: THREE.Vector3) {
    this.planGeom.setFromPoints([start, end]);
    this.planRepr = new THREE.Line(this.planGeom, this.defaultMat);
    this.primaryId = this.planRepr.id;
    this.planRepr.name = "line";
    this.planGroup.add(this.planRepr);
    this.groupId = this.planGroup.id;
  }

  highlight() {
    this.planRepr.material = this.highlightMaterial();
  }

  unhighlight() {
    this.planRepr.material = this.defaultMat;
  }

  select() {
    this.planRepr.material = this.highlightMaterial(2);
    const positions = this.planRepr.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      const z = positions[i + 2];

      const marker = new VertexMarker();
      marker.getMarker().name = `marker${i}`;
      marker.getMarker().position.set(x, y, z);
      this.markers.push(marker);
      this.planGroup.add(marker.getMarker());
    }
  }

  deselect() {
    for (let i = this.planGroup.children.length - 1; i >= 0; i--) {
      const obj = this.planGroup.children[i];
      if (obj.name.includes("marker")) {
        this.planGroup.remove(obj);
      }
      if (obj instanceof THREE.Line) {
        obj.material = this.defaultMat;
      }
    }
  }

  getPlanGroup(): THREE.Group {
    return this.planGroup;
  }

  getPlanRepr(): THREE.Line {
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

    return new THREE.LineBasicMaterial({ color: brightenedColor });
  }
}
