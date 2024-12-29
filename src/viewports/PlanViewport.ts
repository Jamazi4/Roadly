import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { Viewport } from "./Viewport";
import { CursorCrosshair } from "../components/CursorCrosshair";

export class PlanViewport extends Viewport {
  // Camera
  private frustumSize = 10;
  protected camera = new THREE.OrthographicCamera(
    (-this.frustumSize * this.aspect) / 2,
    (this.frustumSize * this.aspect) / 2,
    this.frustumSize / 2,
    -this.frustumSize / 2,
    0.1,
    1000
  );

  // Controller
  protected controller: OrbitControls;

  // GRID
  protected gridHelper = new THREE.GridHelper(
    this.gridSize,
    this.gridDivisions
  );

  // CURSOR
  private cursor = new CursorCrosshair();

  constructor(divId: string) {
    super(divId);
    this.cursor.get().name = "2dcursor";
    this.camera.position.set(0, 0, 10);
    this.camera.up.set(0, 0, 1);
    this.controller = new OrbitControls(this.camera, this.renderer.domElement);
    this.controller.enableRotate = false;
    this.controller.screenSpacePanning = true;
    this.controller.target.set(0, 0, 0);
    this.gridHelper.rotation.set(Math.PI / 2, 0, 0);
    this.scene.add(this.gridHelper);
  }

  resize(): void {
    super.resize();

    this.camera.left = (-this.frustumSize * this.aspect) / 2;
    this.camera.right = (this.frustumSize * this.aspect) / 2;
    this.camera.top = this.frustumSize / 2;
    this.camera.bottom = -this.frustumSize / 2;

    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.viewportWidth, this.viewportHeight);
  }

  // Move to parent class after ensuring each viewport has some cursor
  mouseControl(): void {
    // Cursor disappearing and appearing
    this.divElement.addEventListener("mouseenter", () => {
      this.scene.add(this.cursor.get());
    });
    this.divElement.addEventListener("mouseleave", () => {
      const curCursor = this.scene.getObjectByName("2dcursor");
      if (curCursor) {
        this.scene.remove(curCursor);
      }
    });

    // General mousetracking
    this.divElement.addEventListener("pointermove", (e) => {
      const worldPosition = this.getWorldCoorinates(e.x, e.y);

      this.cursor.get().position.set(worldPosition.x, worldPosition.y, 0);
    });
  }

  // Convert mouse client coords to world coords
  private getWorldCoorinates(mouseX: number, mouseY: number): THREE.Vector3 {
    const raycaster = new THREE.Raycaster();
    const worldPosition = new THREE.Vector3();

    const ndcX = ((mouseX - this.rect.left) / this.rect.width) * 2 - 1;
    const ndcY = -((mouseY - this.rect.top) / this.rect.height) * 2 + 1;
    const ndcVec = new THREE.Vector2(ndcX, ndcY);

    raycaster.setFromCamera(ndcVec, this.camera);
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    raycaster.ray.intersectPlane(plane, worldPosition);

    return worldPosition;
  }

  createPlanLine(): THREE.BufferGeometry {
    // Start prompt message
    this.promptMessageElement.classList.toggle("hidden");
    this.promptMessageElement.innerText = "Pick first point of the new line";

    const points: THREE.Vector3[] = [];
    const lineGeom: THREE.BufferGeometry = new THREE.BufferGeometry();

    // Material for the dynamic preview line
    const previewMat = new THREE.LineBasicMaterial({ color: 0x808080 });
    const previewGeom = new THREE.BufferGeometry();
    const previewLine = new THREE.Line(previewGeom, previewMat);

    let dummyPoint = new THREE.Vector3();

    // For tracking end of dummyline
    const moveListener = (e: MouseEvent) => {
      const mouseCoords = this.getWorldCoorinates(e.clientX, e.clientY);
      dummyPoint.set(mouseCoords.x, mouseCoords.y, 0);

      // Update the preview line's geometry
      const previewPoints = [points[0], dummyPoint];
      previewGeom.setFromPoints(previewPoints);
    };

    // For picking points
    const clickListener = (e: MouseEvent) => {
      const mouseCoords = this.getWorldCoorinates(e.clientX, e.clientY);
      points.push(new THREE.Vector3(mouseCoords.x, mouseCoords.y, 0));

      if (points.length === 1) {
        // change prompt
        this.promptMessageElement.innerText = "Pick second point of the line";
        // Add preview line to the scene for dynamic updates
        previewGeom.setFromPoints([points[0], points[0]]); // Initialize with the same point
        this.scene.add(previewLine);
        this.divElement.addEventListener("mousemove", moveListener);
      }
      if (points.length == 2) {
        // hide prompt
        this.promptMessageElement.classList.toggle("hidden");

        // don't listen to move anymore
        this.divElement.removeEventListener("mousemove", moveListener);

        // create line, add to scene, remove this listener and return geom buffer
        lineGeom.setFromPoints(points);
        const lineMat = new THREE.MeshBasicMaterial({ color: 0x4287f5 });
        const line = new THREE.Line(lineGeom, lineMat);
        this.scene.add(line);
        this.divElement.removeEventListener("click", clickListener);
        return lineGeom;
      }
    };

    this.divElement.addEventListener("click", clickListener);
    return lineGeom;
  }
}
