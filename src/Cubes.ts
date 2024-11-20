import * as BABYLON from "@babylonjs/core";
import { TextBlock } from "@babylonjs/gui";
import { v4 as uuidv4 } from "uuid";



export function createCubes(boxCount: number, scene: BABYLON.Scene, label: TextBlock): [BABYLON.Mesh[], BABYLON.PhysicsBody[]] {

    const boxes: BABYLON.Mesh[] = [];
    const boxBodies: BABYLON.PhysicsBody[] = [];
    const MASS = 100;
    for (let i = 0; i < boxCount; i++) {
        const box = BABYLON.MeshBuilder.CreateBox(`box${i}`, { width: 3.5, height: 1.5, depth: 2 }, scene);
        box.position.set(i * 3.5, 1.5, 0);
        box.metadata = { index: i, id: uuidv4().toString() };
        const boxAggregate = new BABYLON.PhysicsAggregate(box, BABYLON.PhysicsShapeType.BOX, { mass: MASS, restitution: 0.45 }, scene);
        const boxBody = boxAggregate.body;
        boxBody.setMassProperties({
            mass: MASS,
            centerOfMass: new BABYLON.Vector3(0.5, 0.5, 0.5),
            inertia: new BABYLON.Vector3(5, 5, 5),
            inertiaOrientation: new BABYLON.Quaternion(0, 0, 0, 1)
        });

       
        boxes.push(box);
        boxBodies.push(boxBody);
    }
    for (let i = 0; i < boxBodies.length - 1; i++) {
        const constraint = new BABYLON.DistanceConstraint(3.5, scene); 
        boxBodies[i].addConstraint(boxBodies[i + 1], constraint);
    }

    boxes.forEach((box, index) => {

        setBoxTexture(box, scene);



        box.actionManager = new BABYLON.ActionManager(scene);
        box.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, function () {
            changeColor(box, scene);
        }));

        const dragBehavior = new BABYLON.PointerDragBehavior({ dragPlaneNormal: new BABYLON.Vector3(0, 0.5, 0) });

        box.addBehavior(dragBehavior);
        
        dragBehavior.onDragStartObservable.add(() => {
            console.log(`Начало перетаскивания сегмента ${box.metadata.id}`);
            
            boxBodies[index].disablePreStep = true;
            boxBodies[index].setMassProperties({ mass: MASS }); 
            updateLabelText(box, label);
        });
        
        dragBehavior.onDragEndObservable.add(() => {
            console.log(`Конец перетаскивания сегмента ${box.metadata.id}`);
            
            boxBodies[index].disablePreStep = false;
            boxBodies[index].setMassProperties({ mass: MASS }); 
            updateLabelText(box, label);
        });
        
        dragBehavior.onDragObservable.add((event) => {
            box.position = event.dragPlanePoint;
              updateLabelText(box, label);
            boxBodies[index].setLinearVelocity(BABYLON.Vector3.Lerp(boxBodies[index].getLinearVelocity(), BABYLON.Vector3.Zero(), 0.5));
            boxBodies[index].setAngularVelocity(BABYLON.Vector3.Lerp(boxBodies[index].getAngularVelocity(), BABYLON.Vector3.Zero(), 0.5));
          
            updateLinkedSegments(box.metadata.index);
        });

        function updateLinkedSegments(draggedIndex: number) {
            const targetBox = boxes[draggedIndex];
        
            for (let i = draggedIndex + 1; i < boxes.length; i++) {
                const previousBox = boxes[i - 1];
                const currentBox = boxes[i];
                const direction = previousBox.position.subtract(currentBox.position).normalize();
                const targetPosition = previousBox.position.subtract(direction.scale(2)); 
                currentBox.position = BABYLON.Vector3.Lerp(currentBox.position, targetPosition, 0.5); 
                boxBodies[i].setLinearVelocity(BABYLON.Vector3.Lerp(boxBodies[i].getLinearVelocity(), BABYLON.Vector3.Zero(), 0.5));
            }
        
            for (let i = draggedIndex - 1; i >= 0; i--) {
                const nextBox = boxes[i + 1];
                const currentBox = boxes[i];
                const direction = nextBox.position.subtract(currentBox.position).normalize();
                const targetPosition = nextBox.position.subtract(direction.scale(2));
                currentBox.position = BABYLON.Vector3.Lerp(currentBox.position, targetPosition, 0.5); 
                boxBodies[i].setLinearVelocity(BABYLON.Vector3.Lerp(boxBodies[i].getLinearVelocity(), BABYLON.Vector3.Zero(), 0.5));
            }
        }
    });




    return [boxes, boxBodies];
}

export function changeColor(box: BABYLON.Mesh | BABYLON.Mesh[], scene: BABYLON.Scene, label?: string) {
    if (label && label.split(" ").length === 2) {
        const el = label.split(" ")
        const index = parseInt(el[1]) - 1
        const randomColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
        const material = new BABYLON.StandardMaterial("randomColor", scene);
        material.diffuseColor = randomColor;
        box[index].material = material;
        return
    }
    if (Array.isArray(box)) {
        box.forEach(b => {
            const randomColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
            const material = new BABYLON.StandardMaterial("randomColor", scene);
            material.diffuseColor = randomColor;
            b.material = material;
        });
        return
    } else {
        const randomColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
        const material = new BABYLON.StandardMaterial("randomColor", scene);
        material.diffuseColor = randomColor;
        box.material = material;
        return
    }
}

function updateLabelText(box: BABYLON.Mesh, label: TextBlock) {
    label.text = `Элемент ${box.metadata.index + 1}`;
}

export function setBoxTexture(box: BABYLON.Mesh[] | BABYLON.Mesh, scene: BABYLON.Scene) {
    const boxTexture = new BABYLON.Texture("snake.jpg", scene);
    const medusaTexture = new BABYLON.Texture("medusa.webp", scene);
    const boxMaterial = new BABYLON.StandardMaterial("boxMaterial", scene);
    boxMaterial.diffuseTexture = boxTexture;
    const medusaMaterial = new BABYLON.StandardMaterial("medusaMaterial", scene);
    medusaMaterial.diffuseTexture = medusaTexture;
    if (Array.isArray(box)) {
        box.forEach(b => {
            if (b.metadata.index === 0) b.material = medusaMaterial;
            else b.material = boxMaterial;
        });
    } else {
        if (box.metadata.index === 0) box.material = medusaMaterial;
        else box.material = boxMaterial;
    }
}


export function setElementTrigger(box: BABYLON.Mesh, scene: BABYLON.Scene, label?: TextBlock) {
    box.actionManager = new BABYLON.ActionManager(scene);
    box.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, () => {
            label.text = `Элемент ${box.metadata.index + 1}`;
        })
    );
}

export function recreateCubes(scene: BABYLON.Scene, boxes: BABYLON.Mesh[], boxesBody: BABYLON.PhysicsBody[], label: TextBlock) {
    boxes.forEach(box => {
        box.dispose();
    });

    boxesBody.forEach(body => {
        body.dispose();
    });

    const [newBoxes, newBoxesBody] = createCubes(4, scene, label);
   
    newBoxes.forEach((box) => {
        setElementTrigger(box, scene, label);
    });

    boxes.length = 0;
    boxes.push(...newBoxes);

    boxesBody.length = 0;
    boxesBody.push(...newBoxesBody);

   

   
}