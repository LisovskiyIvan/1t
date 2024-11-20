import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import * as BABYLON from "@babylonjs/core";
import HavokPhysics from "@babylonjs/havok";
import { changeColor, createCubes, recreateCubes, setBoxTexture, setElementTrigger } from "./Cubes";
import { createGround } from "./Ground";
import * as GUI from "@babylonjs/gui"
import { createGUI } from "./GUI";



class App {
    constructor() {
        this.createScene();
    }

    async createScene(){
        var canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        var engine = new BABYLON.Engine(canvas, true);
        var scene = new BABYLON.Scene(engine);
        const havokInstance = await HavokPhysics();
        scene.enablePhysics(new BABYLON.Vector3(0, -9.8, 0), new BABYLON.HavokPlugin(true, havokInstance));
        scene.physicsEnabled = true;
        scene.collisionsEnabled = true;

        var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 10, -30), scene);
        

        camera.setTarget(BABYLON.Vector3.Zero());
      
        camera.attachControl(canvas, true);
      
        var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
      
        light.intensity = 0.7;
      
        const [ground, groundAggregate, groundBody] = createGround(scene);

       

        const { button, label, clearBtn, resetBtn } = createGUI()

        const [boxes, boxesBody] = createCubes(4, scene, label);

        const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("myUI");

        advancedTexture.addControl(button);
        advancedTexture.addControl(clearBtn);
        advancedTexture.addControl(label);
        advancedTexture.addControl(resetBtn);

        boxes.forEach((box) => {
            setElementTrigger(box, scene, label);
        });

        button.onPointerUpObservable.add(function() {
            changeColor(boxes, scene, label.text);
        });
        
        clearBtn.onPointerUpObservable.add(function() {
            label.text = "Элемент не выбран";
            setBoxTexture(boxes, scene);
        });
       
        resetBtn.onPointerUpObservable.add(function() {
            label.text = "Элемент не выбран";
            recreateCubes(scene, boxes, boxesBody, label);
        });


        window.addEventListener("keydown", (ev) => {
            if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.key === 'i') {
                if (scene.debugLayer.isVisible()) {
                    scene.debugLayer.hide();
                } else {
                    scene.debugLayer.show();
                }
            }
        });

        engine.runRenderLoop(() => {
            scene.render();
        });
    
        window.addEventListener("resize", function() {
            engine.resize();
        });
    }


}
new App();