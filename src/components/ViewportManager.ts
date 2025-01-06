import { LineObj } from "../Objects/LineObj";
import { RoadlyObj } from "../Objects/RoadlyObj";
import { ProfileViewport } from "../viewports/ProfileViewport";
import { Viewport } from "../viewports/Viewport";
import * as THREE from "three";
import { ObjectStates } from "./ObjectManager";

export class ViewportManager {
  viewports: { [key: string]: Viewport } = {};
  selectedPlan: RoadlyObj | undefined;
  selectedProfile: RoadlyObj | undefined;

  profiles: { [key: number]: RoadlyObj[] } = {};

  profLockEl = document.querySelector(".prof-lock");

  constructor() {}

  addViewport(viewport: Viewport) {
    this.viewports[viewport.name] = viewport;
  }

  setSelectedPlan(obj: RoadlyObj) {
    this.selectedPlan = obj;
    this.lockProf();
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
      const distance = this.selectedPlan.getLength();
      this.displayProf(distance);
      this.profLockEl?.classList.add("hidden");
    }
  }

  lockProf() {
    const profViewport = this.viewports["profile-view"];
    this.profLockEl?.classList.remove("hidden");
    profViewport.scene.children = [];
    this.selectedProfile?.deselect();
    this.removeLabels();
  }

  removeLabels() {
    const labelElements = document.querySelectorAll(".profile-label");

    labelElements.forEach((label) => {
      if (label && label.parentElement) {
        label.parentElement.removeChild(label);
      }
    });
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

  create3D() {
    const activeMat = new THREE.LineBasicMaterial({ color: 0xa83256 });
    const planLength = this.selectedPlan!.getLength();
    const threeDviewport = this.viewports["3d-view"];
    if (this.selectedPlan && this.selectedProfile) {
      const [l1, l2] = this.selectedProfile.getPoints();
      const [p1, p2] = this.selectedPlan.getPoints();

      if (l1.x > 0 || l2.x < 0) {
        throw new Error("Profile has to be full length");
      }
      this.selectedProfile.defaultMat = activeMat;
      this.selectedProfile.select();
      let t1 = new THREE.Vector3();
      let t2 = new THREE.Vector3();

      if (l1.x <= 0) {
        t1.x = p1.x;
        t1.y = p1.y;
        t1.z = this.selectedProfile.getHeightAtOrigin();
      }
      if (l2.x >= planLength) {
        t2.x = p2.x;
        t2.y = p2.y;
        t2.z = this.selectedProfile.getHeightAtOrigin(planLength);
      }

      const threeLine = new LineObj();
      threeLine.create(t1, t2);
      threeDviewport.objectManager.add(threeLine, ObjectStates.default);
      threeDviewport.scene.add(threeLine.getGroup());
      // console.log(this.selectedProfile.getYfromX(2));
    }
  }
}
