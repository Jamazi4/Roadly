import { RoadlyObj } from "../Objects/RoadlyObj";
import * as THREE from "three";

export enum ObjectStates {
  default = "default",
  highlight = "highlight",
  selected = "selected",
}

export enum UtilityNames {
  marker = "marker",
}

export enum PrimaryNames {
  line = "line",
}

export class ObjectManager {
  container: RoadlyObj[] = [];

  constructor() {}

  add(obj: RoadlyObj, state: ObjectStates) {
    if (!this.container.includes(obj)) {
      this.container.push(obj);
      obj.setState(state);
    } else {
      if (obj.state === state) return;
      obj.setState(state);
    }
  }

  remove(obj: RoadlyObj) {
    if (this.container.includes(obj))
      this.container.splice(this.container.indexOf(obj), 1);
  }

  defaultAllHighlighted() {
    this.container.forEach((obj: RoadlyObj) => {
      if (obj.state === ObjectStates.highlight) {
        obj.setState(ObjectStates.default);
      }
    });
  }
  defaultAllSelected() {
    this.container.forEach((obj: RoadlyObj) => {
      if (obj.state === ObjectStates.selected) {
        obj.setState(ObjectStates.default);
      }
    });
  }
  // only deselected
  getPrimaryDeselectedObjects(): THREE.Object3D[] {
    const primaryItems: THREE.Object3D[] = [];
    this.container.forEach((obj: RoadlyObj) => {
      if (obj.state !== ObjectStates.selected) {
        obj.getPlanGroup().children.forEach((childObj) => {
          if (
            Object.values(PrimaryNames).some((primaryName) =>
              childObj.name.includes(primaryName)
            )
          ) {
            primaryItems.push(childObj);
          }
        });
      }
    });
    return primaryItems;
  }

  getByState(state: ObjectStates): RoadlyObj[] {
    const objects = this.container.filter((obj) => {
      return obj.state === state;
    });
    return objects;
  }

  getByPrimaryId(id: number): RoadlyObj {
    const obj = this.container.filter((obj) => {
      return obj.primaryId === id;
    });
    return obj[0];
  }

  updateOnZoom(zoomFactor: number) {
    this.container.forEach((object: RoadlyObj) => {
      object.updateMarkerSize(zoomFactor);
    });
  }
}
