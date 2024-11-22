import * as GUI from '@babylonjs/gui'
import { CubeManager } from './Cubes';
import { Scene } from '@babylonjs/core';

type GUIType = {
    button: GUI.Button,
    label: GUI.TextBlock,
    clearBtn: GUI.Button,
    resetBtn: GUI.Button
}

export class GUIManager {
    private advancedTexture: GUI.AdvancedDynamicTexture;
    private cubeManager: CubeManager;
    private guiElements: GUIType;
    private scene: Scene;
    constructor(scene: Scene) {
        this.advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("myUI");
        this.guiElements = this.createGUI();
        this.scene = scene;
    }

    public setupGUI() {
        const { button, label, clearBtn, resetBtn } = this.guiElements;

        this.advancedTexture.addControl(button);    
        this.advancedTexture.addControl(clearBtn);
        this.advancedTexture.addControl(label);
        this.advancedTexture.addControl(resetBtn);

        button.onPointerUpObservable.add(() => {
            this.cubeManager.cubes.forEach((cube) => this.cubeManager.changeColor(cube, this.scene, label.text));
        });

        clearBtn.onPointerUpObservable.add(() => {
            this.guiElements.label.text = "Элемент не выбран";
            this.cubeManager.cubes.forEach((cube, index) => cube.setTexture(this.scene, index));
        });

        resetBtn.onPointerUpObservable.add(() => {
            this.guiElements.label.text = "Элемент не выбран";
            this.cubeManager.createCubes(4);
        });
    }
    public setupCubes(manager: CubeManager) {
        this.cubeManager = manager;
    }

    createGUI(): GUIType {

        const button = GUI.Button.CreateSimpleButton("but1", "Изменить цвет");
        button.width = 0.07;
        button.height = 0.07;
        button.cornerRadius = 20;
        button.color = "white";
        button.fontSize = 22;
        button.background = "green";
        button.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        button.paddingLeft = 0.1;
        button.left = "25px";

        const label = new GUI.TextBlock("label", "Элемент не выбран");
        label.width = 0.12;
        label.height = 0.07;
        label.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        label.paddingLeft = 0.1;
        label.left = "25px";
        label.top = "100px";
        label.fontSize = 22;

        const clearBtn = GUI.Button.CreateSimpleButton("clearBtn", "Очистить");
        clearBtn.width = 0.07;
        clearBtn.height = 0.07;
        clearBtn.cornerRadius = 20;
        clearBtn.color = "white";
        clearBtn.fontSize = 22;
        clearBtn.background = "red";
        clearBtn.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        clearBtn.left = "25px";
        clearBtn.top = "200px";

        const resetBtn = GUI.Button.CreateSimpleButton("resetBtn", "Сбросить кубы");
        resetBtn.width = 0.07;
        resetBtn.height = 0.07;
        resetBtn.cornerRadius = 20;
        resetBtn.color = "white";
        resetBtn.fontSize = 22;
        resetBtn.background = "blue";
        resetBtn.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        resetBtn.left = "25px";
        resetBtn.top = "-100px";

        return { button, label, clearBtn, resetBtn };
    }



    getLabel(): GUI.TextBlock {
        return this.guiElements.label;
    }
}

