import { ObjectManager } from "./components/ObjectManager";
import { ViewportManager } from "./components/ViewportManager";
import { PlanViewport } from "./viewports/PlanViewport";
import { ProfileViewport } from "./viewports/ProfileViewport";

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

// Init viewports
const viewportManager = new ViewportManager();

const planObjectManager = new ObjectManager();
const profileObjectManager = new ObjectManager();

const planViewport = new PlanViewport(
  "plan-view",
  planObjectManager,
  viewportManager
);

// const threeDViewport = new ThreeDViewport("3d-view", objectManager);

const profileViewport = new ProfileViewport(
  "profile-view",
  profileObjectManager,
  viewportManager
);

// BOX
// const boxCol = new THREE.Color(0x4287f5);
// const testBoxGeom = new THREE.BoxGeometry();
// const testBoxMatPlan = new THREE.MeshBasicMaterial({
//   color: boxCol,
//   wireframe: true,
// });
// const testBoxMat3D = new THREE.MeshPhongMaterial({ color: boxCol });
// const testBoxMesh3D = new THREE.Mesh(testBoxGeom, testBoxMat3D);
// const testBoxMeshPlan = new THREE.Mesh(testBoxGeom, testBoxMatPlan);

// threeDViewport.scene.add(testBoxMesh3D);

// ANIM LOOP
function animate() {
  // threeDViewport.update();
  planViewport.update();
  profileViewport.update();
}
planViewport.renderer.setAnimationLoop(animate);

// RESIZING
// TODO: Cursor is offsetted from mouse after resize
window.addEventListener("resize", () => {
  planViewport.resize();
  // threeDViewport.resize();
  profileViewport.resize();
});

planViewport.mouseControl();
profileViewport.mouseControl();
