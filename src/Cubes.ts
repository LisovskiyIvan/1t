import * as BABYLON from "@babylonjs/core";
import { TextBlock } from "@babylonjs/gui";
import { v4 as uuidv4 } from "uuid";



class Cube {
    public mesh: BABYLON.Mesh;
    public body: BABYLON.PhysicsBody;
    private MASS = 1;
    private LINEAR_DAMPING = 0.8;
    private ANGULAR_DAMPING = 0.95;
   
    private CUBE_SIZE = { width: 5, height: 1.5, depth: 2 };
   


    constructor(index: number, scene: BABYLON.Scene) {
        this.mesh = BABYLON.MeshBuilder.CreateBox(`box${index}`, this.CUBE_SIZE, scene);
        this.mesh.position.set(-index * this.CUBE_SIZE.width, 2, 0);
        this.mesh.metadata = { index: index + 1, id: uuidv4().toString() };

        const aggregate = new BABYLON.PhysicsAggregate(this.mesh, BABYLON.PhysicsShapeType.BOX, { mass: this.MASS, restitution: 0.45 }, scene);
        this.body = aggregate.body;

        this.body.setMassProperties({
            mass: this.MASS,
            centerOfMass: new BABYLON.Vector3(0, 0, 0),
            inertia: new BABYLON.Vector3(10, 10, 10),
        });

        this.body.setLinearVelocity(BABYLON.Vector3.Zero());
        this.body.setAngularVelocity(BABYLON.Vector3.Zero());
        this.body.setLinearDamping(this.LINEAR_DAMPING);
        this.body.setAngularDamping(this.ANGULAR_DAMPING);
    }

    setTexture(scene: BABYLON.Scene, index: number) {
        const texture = new BABYLON.Texture(index === 0 ? "medusa.webp" : "snake.jpg", scene);
        const material = new BABYLON.StandardMaterial(index === 0 ? "medusaMaterial" : "boxMaterial", scene);
        material.diffuseTexture = texture;
        this.mesh.material = material;
    }

    setDragBehavior(scene: BABYLON.Scene, label: TextBlock, onDragCallback: (index: number) => void) {
        const dragBehavior = new BABYLON.PointerDragBehavior({ dragPlaneNormal: new BABYLON.Vector3(0, 1, 0) });
        this.mesh.addBehavior(dragBehavior);

        dragBehavior.onDragObservable.add((event) => {
            this.mesh.position = event.dragPlanePoint;
            this.body.disablePreStep = false;

            this.body.setAngularVelocity(BABYLON.Vector3.Zero());
            this.body.setLinearVelocity(BABYLON.Vector3.Zero());

            label.text = `Элемент ${this.mesh.metadata.index}`;
            onDragCallback(this.mesh.metadata.index);
        });
    }
}

class CubeManager {
    public cubes: Cube[] = [];
    private CONSTRAINT_MIN_LIMIT = 0;
    private CONSTRAINT_MAX_LIMIT = 0.5;
    private ANGULAR_LIMIT = Math.PI / 6;
    private DIRECTION_SCALE = 3.5;
    private LERP_SCALE = 0.5;
    private CUBE_SIZE = { width: 5, height: 1.5, depth: 2 };

    constructor(private scene: BABYLON.Scene, private label: TextBlock) {}

    createCubes(count: number) {
        this.disposeCubes();
        for (let i = 0; i < count; i++) {
            const cube = new Cube(i, this.scene);
            cube.setTexture(this.scene, i);
            cube.setDragBehavior(this.scene, this.label, this.updateLinkedSegments.bind(this));
            this.cubes.push(cube);
        }
        this.createConstraints();
    }

    private createConstraints() {
        for (let i = 0; i < this.cubes.length - 1; i++) {
            const constraint = new BABYLON.Physics6DoFConstraint(
                {
                    pivotA: new BABYLON.Vector3(-this.CUBE_SIZE.width, 0, 0),
                    pivotB: new BABYLON.Vector3(0, 0, 0),
                    axisA: new BABYLON.Vector3(1, 0, 0),
                    axisB: new BABYLON.Vector3(1, 0, 0),
                },
                [
                    {
                        axis: BABYLON.PhysicsConstraintAxis.LINEAR_DISTANCE,
                        minLimit: this.CONSTRAINT_MIN_LIMIT,
                        maxLimit: this.CONSTRAINT_MAX_LIMIT,
                    },
                    {
                        axis: BABYLON.PhysicsConstraintAxis.ANGULAR_X,
                        minLimit: -this.ANGULAR_LIMIT,
                        maxLimit: this.ANGULAR_LIMIT,
                    },
                    {
                        axis: BABYLON.PhysicsConstraintAxis.ANGULAR_Y,
                        minLimit: -this.ANGULAR_LIMIT,
                        maxLimit: this.ANGULAR_LIMIT,
                    },
                    {
                        axis: BABYLON.PhysicsConstraintAxis.ANGULAR_Z,
                        minLimit: -this.ANGULAR_LIMIT,
                        maxLimit: this.ANGULAR_LIMIT,
                    },
                ],
                this.scene
            );

            this.cubes[i].body.addConstraint(this.cubes[i + 1].body, constraint);
        }
    }

    private updateLinkedSegments(draggedIndex: number) {
        const cubes = this.cubes; 

    for (let i = draggedIndex + 1; i < cubes.length; i++) {
        const previousBox = cubes[i - 1];
        const currentBox = cubes[i];
        if (!previousBox || !currentBox) {
            console.warn(`Skipped update for cube ${i} due to missing cube`);
            continue;
        }

        const direction = previousBox.mesh.position.subtract(currentBox.mesh.position).normalize();
        const targetPosition = previousBox.mesh.position.subtract(direction.scale(this.DIRECTION_SCALE));
        currentBox.mesh.position = BABYLON.Vector3.Lerp(currentBox.mesh.position, targetPosition, this.LERP_SCALE);
    }

    for (let i = draggedIndex - 1; i >= 0; i--) {
        const nextBox = cubes[i + 1];
        const currentBox = cubes[i];

        if (!nextBox || !currentBox) {
            console.warn(`Skipped update for cube ${i} due to missing cube`);
            continue
        }

        const direction = nextBox.mesh.position.subtract(currentBox.mesh.position).normalize();
        const targetPosition = nextBox.mesh.position.subtract(direction.scale(this.DIRECTION_SCALE));
        currentBox.mesh.position = BABYLON.Vector3.Lerp(currentBox.mesh.position, targetPosition, this.LERP_SCALE);
        }   
    }

    private disposeCubes() {
        this.cubes.forEach((cube) => {
            cube.mesh.dispose();
            cube.body.dispose();
        });
        this.cubes = [];
    }

    changeColor(cube: Cube, scene: BABYLON.Scene, labelText?: string) {
        if (labelText && labelText.split(" ").length === 2) {
            const el = labelText.split(" ")
            const index = parseInt(el[1]) - 1
            const randomColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
            const material = new BABYLON.StandardMaterial("randomColor", scene);
            material.diffuseColor = randomColor;
            this.cubes[index].mesh.material = material;
            return
        }
        const randomColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
        const material = new BABYLON.StandardMaterial("randomColor", scene);
        material.diffuseColor = randomColor;
        cube.mesh.material = material;
    }
}

export { CubeManager };
