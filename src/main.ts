import * as THREE from "three";
import { PlanViewport } from "./viewports/PlanViewport";
import { ThreeDViewport } from "./viewports/ThreeDViewport";

const btnLine = document.getElementById("btn-line")!;
btnLine.addEventListener("click", (e) => {
  e.stopPropagation();
  planViewport.createPlanLine();
});

// Init viewports
const planViewport = new PlanViewport("plan-view");
const threeDViewport = new ThreeDViewport("3d-view");

// BOX
const boxCol = new THREE.Color(0x4287f5);
const testBoxGeom = new THREE.BoxGeometry();
const testBoxMatPlan = new THREE.MeshBasicMaterial({
  color: boxCol,
  wireframe: true,
});
const testBoxMat3D = new THREE.MeshPhongMaterial({ color: boxCol });
const testBoxMesh3D = new THREE.Mesh(testBoxGeom, testBoxMat3D);
const testBoxMeshPlan = new THREE.Mesh(testBoxGeom, testBoxMatPlan);

// threeDViewport.scene.add(testBoxMesh3D);

// ANIM LOOP
function animate() {
  threeDViewport.update();
  planViewport.update();
}
planViewport.renderer.setAnimationLoop(animate);

// RESIZING
window.addEventListener("resize", () => {
  planViewport.resize();
  threeDViewport.resize();
});

planViewport.mouseControl();
