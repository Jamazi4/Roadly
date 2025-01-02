import { RoadlyObj } from "../Objects/RoadlyObj";
import { ProfileViewport } from "../viewports/ProfileViewport";
import { Viewport } from "../viewports/Viewport";
import * as THREE from "three";

export class ViewportManager {
  viewports: { [key: string]: Viewport } = {};
  selectedPlan: RoadlyObj | undefined;
  selectedProfile: RoadlyObj | undefined;

  profiles: { [key: number]: RoadlyObj[] } = {};

  profLockEl = document.querySelector(".prof-lock");

  constructor() {}

  addViewport(viewport: Viewport) {
    console.log(viewport.name);
    this.viewports[viewport.name] = viewport;
  }

  setSelectedPlan(obj: RoadlyObj) {
    this.selectedPlan = obj;
    this.unlockProf();
  }

  removeSelectedPlan() {
    if (this.selectedPlan) {
      this.selectedPlan = undefined;
      this.lockProf();
    }
  }

  setSelectedProfile(obj: RoadlyObj) {
    this.selectedProfile = obj;
  }

  removeSelectedProfile() {
    this.selectedProfile = undefined;
  }

  unlockProf() {
    if (this.selectedPlan) {
      const points = this.selectedPlan.Repr.geometry.attributes.position.array;
      const first = new THREE.Vector3(points[0], points[1], points[2]);
      const second = new THREE.Vector3(points[3], points[4], points[5]);
      const distance = first.distanceTo(second);
      console.log(distance);
      this.displayProf(distance);
      this.profLockEl?.classList.add("hidden");
    }
  }

  lockProf() {
    if (!this.selectedPlan) {
      this.profLockEl?.classList.remove("hidden");
      this.viewports["profile-view"].scene.children = [];
    }
  }

  addPlan(obj: RoadlyObj) {
    this.profiles[obj.primaryId] = [];
  }

  addProf(obj: RoadlyObj) {
    const currPlanId = this.selectedPlan?.primaryId;
    if (currPlanId) {
      this.profiles[currPlanId].push(obj);
    }
  }

  displayProf(lineDistance: number) {
    const currPlanId = this.selectedPlan?.primaryId;
    const profViewport = this.viewports["profile-view"] as ProfileViewport;
    if (currPlanId) {
      profViewport.createProfileGrid(lineDistance);
      this.profiles[currPlanId].forEach((obj: RoadlyObj) => {
        profViewport.scene.add(obj.getGroup());
      });
    }
  }
}
