import * as GUI from '@babylonjs/gui'

type GUIType = {
    button: GUI.Button,
    label: GUI.TextBlock,
    clearBtn: GUI.Button,
    resetBtn: GUI.Button
}

export function createGUI(): GUIType {
    // Создание GUI элементов
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



