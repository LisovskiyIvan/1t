import * as BABYLON from '@babylonjs/core';

export class Surroundings {
    private scene: BABYLON.Scene;
    private ground: BABYLON.Mesh;
    private groundAggregate: BABYLON.PhysicsAggregate;
    private groundBody: BABYLON.PhysicsBody;
    private backWall: BABYLON.PhysicsAggregate;
    private frontWall: BABYLON.PhysicsAggregate;
    private leftWall: BABYLON.PhysicsAggregate;
    private rightWall: BABYLON.PhysicsAggregate;

    constructor(scene: BABYLON.Scene) {
        this.scene = scene;
        this.createGround();
        this.createWalls();
    }

    private createGround() {
        this.ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 100, height: 100 }, this.scene);
        this.groundAggregate = new BABYLON.PhysicsAggregate(this.ground, BABYLON.PhysicsShapeType.MESH, { mass: 0 }, this.scene);
        this.groundBody = new BABYLON.PhysicsBody(this.ground, BABYLON.PhysicsMotionType.STATIC, true, this.scene);
        this.groundAggregate.material.friction = 10;
        const groundTexture = new BABYLON.Texture("walls.jpg", this.scene);
        const groundMaterial = new BABYLON.StandardMaterial("groundMaterial", this.scene);
        groundMaterial.diffuseTexture = groundTexture;
        this.ground.material = groundMaterial;
    }

    private createWalls() {
        const wallThickness = 1; 
        const wallHeight = 20;    
        const groundWidth = 100; 
        const wallMaterial = new BABYLON.StandardMaterial("wallMaterial", this.scene);
        const wallTexture = new BABYLON.Texture("walls.jpg", this.scene);
        wallMaterial.diffuseTexture = wallTexture;
        const createWall = (position: BABYLON.Vector3, rotation: BABYLON.Vector3) => {
            const wall = BABYLON.MeshBuilder.CreateBox("wall", { width: groundWidth, height: wallHeight, depth: wallThickness }, this.scene);
            wall.position = position;
            wall.rotation = rotation;
            wall.material = wallMaterial;
            return new BABYLON.PhysicsAggregate(wall, BABYLON.PhysicsShapeType.BOX, { mass: 0 }, this.scene);
        };

        this.backWall = createWall(new BABYLON.Vector3(0, wallHeight / 2, -groundWidth / 2), new BABYLON.Vector3(0, 0, 0));

        this.frontWall = createWall(new BABYLON.Vector3(0, wallHeight / 2, groundWidth / 2), new BABYLON.Vector3(0, 0, 0));

        this.leftWall = createWall(new BABYLON.Vector3(-groundWidth / 2, wallHeight / 2, 0), new BABYLON.Vector3(0, Math.PI / 2, 0));

        this.rightWall = createWall(new BABYLON.Vector3(groundWidth / 2, wallHeight / 2, 0), new BABYLON.Vector3(0, Math.PI / 2, 0));
    }

    public getGround() {
        return [this.ground, this.groundAggregate, this.groundBody];
    }
}

