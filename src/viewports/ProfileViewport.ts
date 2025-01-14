import * as THREE from "three";
import { CSS2DObject, OrbitControls } from "three/examples/jsm/Addons.js";
import { Viewport } from "./Viewport";
import { CursorCrosshair } from "../utils/CursorCrosshair";
import { LineObj } from "../Objects/LineObj";
import { ObjectManager, ObjectStates } from "../components/ObjectManager";
import { ViewportManager } from "../components/ViewportManager";
import { CSS2DRenderer } from "three/examples/jsm/Addons.js";

export class ProfileViewport extends Viewport {
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
  public controller: OrbitControls;

  // Raycaster
  raycaster: THREE.Raycaster;

  // GRID
  labelRenderer: CSS2DRenderer;
  gridGroup = new THREE.Group();
  line0 = new THREE.Line();

  // CURSOR
  // TODO: ensure each viewport has some cursor
  private cursor = new CursorCrosshair();

  constructor(
    divId: string,
    objectManager: ObjectManager,
    viewportManager: ViewportManager
  ) {
    super(divId, objectManager, viewportManager);
    this.camera.position.set(0, 0, 10);
    this.camera.up.set(0, 0, 1);
    this.controller = new OrbitControls(this.camera, this.divElement);
    this.controller.enableRotate = false;
    this.controller.screenSpacePanning = true;
    this.controller.target.set(0, 0, 0);
    this.raycaster = new THREE.Raycaster();
    this.onZoomUpdate();

    this.labelRenderer = new CSS2DRenderer();
    this.labelRenderer.setSize(this.viewportWidth, this.viewportHeight);
    this.labelRenderer.domElement.style.position = "absolute";
    const menu = this.divElement.querySelector(".profile-view-menu")!;
    this.divElement.insertBefore(this.labelRenderer.domElement, menu);
  }

  createProfileGrid(lineDistance: number) {
    //grid
    const gridMat = new THREE.LineBasicMaterial({ color: 0x404040 });
    this.scene.children = [];
    this.labelRenderer.render(this.scene, this.camera);
    this.gridGroup = new THREE.Group();
    const line0points = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(lineDistance, 0, 0),
    ];
    const line0Geom = new THREE.BufferGeometry().setFromPoints(line0points);
    this.line0 = new THREE.Line(line0Geom, gridMat);

    this.gridGroup.add(this.line0);
    console.log(`profileviewport's recieved length: ${lineDistance}`);
    this.scene.add(this.gridGroup);

    // labels
    const startLabelDiv = document.createElement("div");
    startLabelDiv.className = "profile-label";
    startLabelDiv.textContent = `(${this.viewportManager.selectedPlan
      ?.getPoints()[0]
      .x!.toFixed(2)}, 
      ${this.viewportManager.selectedPlan?.getPoints()[0].y!.toFixed(2)})`;
    const endLabelDiv = document.createElement("div");
    endLabelDiv.textContent = `(${this.viewportManager.selectedPlan
      ?.getPoints()[1]
      .x!.toFixed(2)}, 
      ${this.viewportManager.selectedPlan?.getPoints()[1].y!.toFixed(2)})`;
    endLabelDiv.className = "profile-label";

    const startLabel = new CSS2DObject(startLabelDiv);
    startLabel.position.set(
      line0points[0].x,
      line0points[0].y,
      line0points[0].z
    );

    const endLabel = new CSS2DObject(endLabelDiv);
    endLabel.position.set(line0points[1].x, line0points[1].y, line0points[1].z);

    startLabel.center.set(0, 0);
    endLabel.center.set(0, 0);
    this.line0.add(startLabel);
    this.line0.add(endLabel);
  }

  update() {
    super.update();
    this.labelRenderer.render(this.scene, this.camera);
  }

  resize(): void {
    super.resize();

    this.camera.left = (-this.frustumSize * this.aspect) / 2;
    this.camera.right = (this.frustumSize * this.aspect) / 2;
    this.camera.top = this.frustumSize / 2;
    this.camera.bottom = -this.frustumSize / 2;

    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.viewportWidth, this.viewportHeight);

    this.labelRenderer.setSize(this.viewportWidth, this.viewportHeight);
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

      // moving the cursor
      this.cursor.setPosition(worldPosition.x, worldPosition.y, 0);

      // highlighting objects

      // Only cast rays to objects that are not selected
      let intersections = this.raycaster.intersectObjects(
        this.objectManager.getPrimaryDeselectedObjects()
      );
      if (this.creatingLine === true) return;
      // On each mousemove deselect all highlighted
      this.objectManager.defaultAllHighlighted();

      // If we have any intersections
      if (intersections.length > 0) {
        // find closest object from intersections list
        const intersection = intersections.reduce((closest, curr) => {
          return curr.point.distanceTo(worldPosition) <
            closest.point.distanceTo(worldPosition)
            ? curr
            : closest;
        });
        // find that object in all created lineObjs
        const intersectId = intersection.object.id;
        const intersectLineObj = this.objectManager.getByPrimaryId(intersectId);

        // Finally highlight if the distance is < 0.1
        if (
          intersection.point.distanceToSquared(worldPosition) <
          this.highlightDistance
        ) {
          intersectLineObj.setState(ObjectStates.highlight);
        } else if (
          intersection.point.distanceToSquared(worldPosition) >=
          this.highlightDistance
        ) {
          this.objectManager.defaultAllHighlighted();
        }
      }
    });

    const createLineClickListener = () => {
      const allHighlighted = this.objectManager.getByState(
        ObjectStates.highlight
      );
      // if there are highlighted objects
      if (allHighlighted.length > 0) {
        // change highlighted to selected
        this.objectManager.defaultAllSelected();
        const lineToSelect = this.objectManager.getByState(
          ObjectStates.highlight
        )[0];

        lineToSelect.setState(ObjectStates.selected);
        this.viewportManager.setSelectedProfile(lineToSelect);
      } else {
        // if there are no highlighted objects, clear selection
        this.objectManager.defaultAllSelected();
        this.viewportManager.removeSelectedProfile();
      }
    };
    // selecting highlighted object
    // TODO: remove this eventlistener when creating the line
    this.divElement.addEventListener("click", createLineClickListener);
  }

  createLineClickListener() {
    const allHighlighted = this.objectManager.getByState(
      ObjectStates.highlight
    );
    // if there are highlighted objects
    if (allHighlighted.length > 0) {
      // change highlighted to selected
      const lineToSelect = this.objectManager.getByState(
        ObjectStates.highlight
      )[0];

      lineToSelect.setState(ObjectStates.selected);
      this.viewportManager.setSelectedProfile(lineToSelect);
    } else {
      // if there are no highlighted objects, clear selection
      this.objectManager.defaultAllSelected();
      this.viewportManager.removeSelectedProfile();
    }
  }

  // Convert mouse client coords to world coords
  private getWorldCoorinates(mouseX: number, mouseY: number): THREE.Vector3 {
    const worldPosition = new THREE.Vector3();

    const ndcX = ((mouseX - this.rect.left) / this.rect.width) * 2 - 1;
    const ndcY = -((mouseY - this.rect.top) / this.rect.height) * 2 + 1;
    const ndcVec = new THREE.Vector2(ndcX, ndcY);

    this.raycaster.setFromCamera(ndcVec, this.camera);
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    this.raycaster.ray.intersectPlane(plane, worldPosition);

    return worldPosition;
  }

  createProfileLine(): LineObj {
    // Start prompt message
    this.creatingLine = true;
    this.promptMessageElement.classList.toggle("hidden");
    this.promptMessageElement.innerText = "Pick first point of the new line";

    const points: THREE.Vector3[] = [];

    // Material for the dynamic preview line
    const previewMat = new THREE.LineBasicMaterial({ color: 0x808080 });
    const previewGeom = new THREE.BufferGeometry();
    const previewLine = new THREE.Line(previewGeom, previewMat);
    previewLine.name = "previewLine";

    let dummyPoint = new THREE.Vector3();
    let newLine: LineObj = new LineObj();

    // For tracking end of preview line -> TODO: move preview to LineObj class
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

      // second point is under the mouse for rendering preview line
      if (points.length === 1) {
        // change prompt
        this.promptMessageElement.innerText = "Pick second point of the line";
        // Add preview line to the scene for dynamic updates
        // Initialize with the same point
        previewGeom.setFromPoints([points[0], points[0]]);
        this.scene.add(previewLine);

        // add this move
        this.divElement.addEventListener("mousemove", moveListener);
      }
      if (points.length == 2) {
        // hide prompt
        this.promptMessageElement.classList.toggle("hidden");

        // don't listen to move anymore
        this.divElement.removeEventListener("mousemove", moveListener);

        // create line, add to scene,
        // remove this listener and return geom buffer
        newLine.create(points[0], points[1]);
        this.scene.add(newLine.getGroup());

        // add to manager with default state
        this.objectManager.add(newLine, ObjectStates.default);
        this.viewportManager.addProf(newLine);

        this.scene.remove(previewLine);

        this.divElement.removeEventListener("click", clickListener);
        this.creatingLine = false;
      }
    };
    this.divElement.addEventListener("click", clickListener);
    return newLine;
  }
}
