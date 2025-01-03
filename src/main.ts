import { ObjectManager } from "./components/ObjectManager";
import { ViewportManager } from "./components/ViewportManager";
import { PlanViewport } from "./viewports/PlanViewport";
import { ProfileViewport } from "./viewports/ProfileViewport";
import { ThreeDViewport } from "./viewports/ThreeDViewport";

const btnLinePlan = document.getElementById("btn-line-plan")!;
btnLinePlan.addEventListener("click", (e) => {
  e.stopPropagation();
  planViewport.createPlanLine();
});
const btnLineProfile = document.getElementById("btn-line-profile")!;
btnLineProfile.addEventListener("click", (e) => {
  e.stopPropagation();
  profileViewport.createProfileLine();
});
const btnActivateProfile = document.getElementById("btn-activate-profile")!;
btnActivateProfile.addEventListener("click", (e) => {
  e.stopPropagation();
  viewportManager.create3D();
});

// Init viewports
const viewportManager = new ViewportManager();

const planObjectManager = new ObjectManager();
const profileObjectManager = new ObjectManager();
const threeDObjectManager = new ObjectManager();

const planViewport = new PlanViewport(
  "plan-view",
  planObjectManager,
  viewportManager
);

const threeDViewport = new ThreeDViewport(
  "3d-view",
  threeDObjectManager,
  viewportManager
);

const profileViewport = new ProfileViewport(
  "profile-view",
  profileObjectManager,
  viewportManager
);

// ANIM LOOP
function animate() {
  requestAnimationFrame(animate);
  threeDViewport.update();
  planViewport.update();
  profileViewport.update();
}
animate();

// RESIZING
// TODO: Cursor is offsetted from mouse after resize
window.addEventListener("resize", () => {
  planViewport.resize();
  threeDViewport.resize();
  profileViewport.resize();
});

planViewport.mouseControl();
profileViewport.mouseControl();
