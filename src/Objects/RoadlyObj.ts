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
}
