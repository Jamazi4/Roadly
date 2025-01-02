import { LineObj } from "../Objects/LineObj";
import { RoadlyObj } from "../Objects/RoadlyObj";
import { Viewport } from "../viewports/Viewport";

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
      this.profLockEl?.classList.toggle("hidden");
      this.displayProf();
      console.log(this.profLockEl);
    }
  }

  lockProf() {
    if (!this.selectedPlan) {
      this.profLockEl?.classList.toggle("hidden");
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

  displayProf() {
    const currPlanId = this.selectedPlan?.primaryId;
    if (currPlanId) {
      this.profiles[currPlanId].forEach((obj: RoadlyObj) => {
        this.viewports["profile-view"].scene.add(obj.getPlanGroup());
      });
    }
  }
}
