import * as THREE from "three";
import { ObjectStates } from "../components/ObjectManager";
import { VertexMarker } from "../utils/VertexMarker";

export abstract class RoadlyObj {
  abstract highlight(): void;
  abstract unhighlight(): void;
  abstract select(): void;
  abstract deselect(): void;
  abstract Geom: THREE.BufferGeometry;
  abstract Repr: THREE.Line; // TODO: extend for other types as well
  abstract Group: THREE.Group;
  abstract defaultMat: THREE.LineBasicMaterial;

  markers: VertexMarker[] = [];

  highlighted = false;
  selected = false;
  state: ObjectStates = ObjectStates.default;

  primaryId: number = 0;
  groupId: number = 0;

  getGroup(): THREE.Group {
    return this.Group;
  }

  setState(state: ObjectStates) {
    this.state = state;
    // DEFAULT
    if (state === ObjectStates.default) {
      if (this.highlighted === true) {
        this.unhighlight();
        this.highlighted = false;
      }

      if (this.selected === true) {
        this.deselect();
        this.selected = false;
      }

      // HIGHLIGHT
    } else if (state === ObjectStates.highlight) {
      if (this.selected === true) {
        return;
      }

      if (this.highlighted === false) {
        this.highlight();
        this.highlighted = true;
      }

      // SELECT
    } else if (state === ObjectStates.selected) {
      if (this.highlighted === true) {
        this.unhighlight();
        this.highlighted = false;
      }

      if (this.selected === false) {
        this.select();
        this.selected = true;
      }
    }
  }
  updateMarkerSize(zoomFactor: number) {
    this.markers.forEach((marker: VertexMarker): void => {
      marker.updateSize(zoomFactor);
    });
  }

  getLength(): number {
    const points = this.getPoints();
    return points[0].distanceTo(points[1]);
  }

  getPoints(): THREE.Vector3[] {
    const points = this.Geom.attributes.position.array;

    const [first, second] =
      points[0] < points[1]
        ? [
            new THREE.Vector3(points[0], points[1], points[2]),
            new THREE.Vector3(points[3], points[4], points[5]),
          ]
        : [
            new THREE.Vector3(points[3], points[4], points[5]),
            new THREE.Vector3(points[0], points[1], points[2]),
          ];

    return [first, second];
  }

  getHeightAtOrigin(x: number = 0): number {
    const [first, second] = this.getPoints();

    if (first.x === second.x) {
      throw new Error("Line is vertical");
    }

    if (x < first.x || x > second.x) {
      throw new Error("X is outside of the line extent");
    }

    const slope = (second.y - first.y) / (second.x - first.x);

    return first.y + slope * (x - first.x);
  }
}
