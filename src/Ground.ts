import * as BABYLON from '@babylonjs/core';

export function createGround(scene: BABYLON.Scene) {
    const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 100, height: 100 }, scene);
    const groundAggregate = new BABYLON.PhysicsAggregate(ground, BABYLON.PhysicsShapeType.MESH, { mass: 0 }, scene);
    const groundBody = new BABYLON.PhysicsBody(ground, BABYLON.PhysicsMotionType.STATIC, true, scene);
    groundAggregate.material.friction = 10;
    
    const wallThickness = 1; 
    const wallHeight = 20;    
    const groundWidth = 100; 


    const wallMaterial = new BABYLON.StandardMaterial("wallMaterial", scene);
    wallMaterial.diffuseColor = new BABYLON.Color3(0.8, 0.8, 0.8); 
    
    // создание стен
    const createWall = (position: BABYLON.Vector3, rotation: BABYLON.Vector3) => {
        const wall = BABYLON.MeshBuilder.CreateBox("wall", { width: groundWidth, height: wallHeight, depth: wallThickness }, scene);
        wall.position = position;
        wall.rotation = rotation;
        wall.material = wallMaterial;
        return new BABYLON.PhysicsAggregate(wall, BABYLON.PhysicsShapeType.BOX, { mass: 0 }, scene);
    };

    const backWall = createWall(new BABYLON.Vector3(0, wallHeight / 2, -groundWidth / 2), new BABYLON.Vector3(0, 0, 0));

    const frontWall = createWall(new BABYLON.Vector3(0, wallHeight / 2, groundWidth / 2), new BABYLON.Vector3(0, 0, 0));

    const leftWall = createWall(new BABYLON.Vector3(-groundWidth / 2, wallHeight / 2, 0), new BABYLON.Vector3(0, Math.PI / 2, 0));

    const rightWall = createWall(new BABYLON.Vector3(groundWidth / 2, wallHeight / 2, 0), new BABYLON.Vector3(0, Math.PI / 2, 0));

    // Добавление текстуры к земле и стенам
    const groundTexture = new BABYLON.Texture("walls.jpg", scene);
    const groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
    groundMaterial.diffuseTexture = groundTexture;
    ground.material = groundMaterial;

    const wallTexture = new BABYLON.Texture("walls.jpg", scene);
    wallMaterial.diffuseTexture = wallTexture;

    return [ground, groundAggregate, groundBody];
}
