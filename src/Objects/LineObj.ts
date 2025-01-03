import * as THREE from "three";
import { VertexMarker } from "../utils/VertexMarker";
import { RoadlyObj } from "./RoadlyObj";
import { CSS2DObject } from "three/examples/jsm/Addons.js";

export class LineObj extends RoadlyObj {
  defaultMat = new THREE.LineBasicMaterial({ color: 0x4287f5 });

  Geom = new THREE.BufferGeometry();
  Repr: THREE.Line = new THREE.Line();
  Group: THREE.Group = new THREE.Group();
  labelIds: number[] = [];
  inputEls: HTMLInputElement[] = [];
  points: THREE.Vector3[] = [];

  constructor() {
    super();
  }

  create(start: THREE.Vector3, end: THREE.Vector3) {
    this.Geom.setFromPoints([start, end]);
    this.Repr = new THREE.Line(this.Geom, this.defaultMat);
    this.primaryId = this.Repr.id;
    this.Repr.name = "line";
    this.Group.add(this.Repr);
    this.groupId = this.Group.id;
    this.points = this.getPoints();
  }

  highlight() {
    this.Repr.material = this.highlightMaterial();
  }

  unhighlight() {
    this.Repr.material = this.defaultMat;
  }

  select() {
    this.Repr.material = this.highlightMaterial(2);
    const positions = this.Repr.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      const z = positions[i + 2];

      const marker = new VertexMarker();
      marker.getMarker().name = `marker${i}`;
      marker.getMarker().position.set(x, y, z);
      this.markers.push(marker);
      this.Group.add(marker.getMarker());
    }

    const xInputEl1 = document.createElement("input");
    this.inputEls.push(xInputEl1);
    const xInput1 = new CSS2DObject(xInputEl1);
    xInputEl1.className = "input-label";
    this.labelIds.push(xInput1.id);

    xInput1.position.set(
      this.points[0].x,
      this.points[0].y + 0.5,
      this.points[0].z
    );
    xInputEl1.value = `${this.points[0].x}`;
    this.Repr.add(xInput1);

    const yInputEl1 = document.createElement("input");
    this.inputEls.push(yInputEl1);
    const yInput1 = new CSS2DObject(yInputEl1);
    yInputEl1.className = "input-label";
    this.labelIds.push(yInput1.id);

    yInput1.position.set(
      this.points[0].x,
      this.points[0].y - 0.5,
      this.points[0].z
    );
    yInputEl1.value = `${this.points[0].y}`;
    this.Repr.add(yInput1);

    const xInputEl2 = document.createElement("input");
    this.inputEls.push(xInputEl2);
    const xInput2 = new CSS2DObject(xInputEl2);
    xInputEl2.className = "input-label";
    this.labelIds.push(xInput2.id);

    xInput2.position.set(
      this.points[1].x,
      this.points[1].y + 0.5,
      this.points[1].z
    );
    xInputEl2.value = `${this.points[1].x}`;
    this.Repr.add(xInput2);

    const yInputEl2 = document.createElement("input");
    this.inputEls.push(yInputEl2);
    const yInput2 = new CSS2DObject(yInputEl2);
    yInputEl2.className = "input-label";
    this.labelIds.push(yInput2.id);

    yInput2.position.set(
      this.points[1].x,
      this.points[1].y - 0.5,
      this.points[1].z
    );
    yInputEl2.value = `${this.points[1].y}`;
    this.Repr.add(yInput2);

    // Prevent event propagation
    xInputEl1.addEventListener("mousedown", (event) => {
      event.stopPropagation();
    });

    xInputEl1.addEventListener("click", (event) => {
      event.stopPropagation();
    });

    this.inputEls.forEach((el: HTMLInputElement) => {
      el.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          const newPoint1 = new THREE.Vector3(
            +xInputEl1.value,
            +yInputEl1.value,
            0
          );
          const newPoint2 = new THREE.Vector3(
            +xInputEl2.value,
            +yInputEl2.value,
            0
          );

          this.Geom.setFromPoints([newPoint1, newPoint2]);
          this.points = [newPoint1, newPoint2];
          this.deselect();
          this.select();
        }
      });
    });
  }

  deselect() {
    for (let i = this.Group.children.length - 1; i >= 0; i--) {
      const obj = this.Group.children[i];
      if (obj.name.includes("marker")) {
        this.Group.remove(obj);
      }
      if (obj instanceof THREE.Line) {
        obj.material = this.defaultMat;
      }
    }
    this.labelIds.forEach((id: number) => {
      this.Repr.remove(this.Repr.getObjectById(id)!);
    });
  }

  getGroup(): THREE.Group {
    return this.Group;
  }

  getRepr(): THREE.Line {
    return this.Repr;
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
