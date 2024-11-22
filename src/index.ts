import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import * as BABYLON from "@babylonjs/core";
import HavokPhysics from "@babylonjs/havok";
import { CubeManager } from "./Cubes";
import { Surroundings } from "./Surroundings";
import { GUIManager } from "./GUI";

class App {
    private engine: BABYLON.Engine;
    private scene: BABYLON.Scene;
    private camera: BABYLON.FreeCamera;
    private light: BABYLON.HemisphericLight;
    private cubeManager: CubeManager;
    private guiManager: GUIManager;
    private surroundings: Surroundings;

    constructor() {
        this.initializeEngine().then(() => {
            this.createScene();
            this.run();
        });
    }

    async initializeEngine() {
        const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        this.engine = new BABYLON.Engine(canvas, true);

        const havokInstance = await HavokPhysics();
        this.scene = new BABYLON.Scene(this.engine);
        this.scene.enablePhysics(
            new BABYLON.Vector3(0, -9.8, 0),
            new BABYLON.HavokPlugin(true, havokInstance)
        );
        this.scene.physicsEnabled = true;
        this.scene.collisionsEnabled = true;
    }

    createScene() {
        this.setupCameraAndLight();
        this.surroundings = new Surroundings(this.scene);
        this.guiManager = new GUIManager(this.scene);
        this.cubeManager = new CubeManager(this.scene, this.guiManager.getLabel());
        this.guiManager.setupCubes(this.cubeManager);
        this.guiManager.setupGUI();
        this.cubeManager.createCubes(4);
        
    }

    setupCameraAndLight() {
        this.camera = new BABYLON.FreeCamera(
            "camera1",
            new BABYLON.Vector3(0, 15, -45),
            this.scene
        );
        this.camera.setTarget(BABYLON.Vector3.Zero());
        this.camera.attachControl(this.engine.getRenderingCanvas(), true);

        this.light = new BABYLON.HemisphericLight(
            "light",
            new BABYLON.Vector3(0, 1, 0),
            this.scene
        );
        this.light.intensity = 0.7;
    }


    run() {
        this.engine.runRenderLoop(() => {
            this.scene.render();
        });

        window.addEventListener("resize", () => {
            this.engine.resize();
        });
    }
}

new App();