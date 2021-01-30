import * as BABYLON from 'babylonjs';

// Get the canvas DOM element
var canvas = <HTMLCanvasElement>document.getElementById('renderCanvas');
// Load the 3D engine
var engine = new BABYLON.Engine(canvas, true, {preserveDrawingBuffer: true, stencil: true});

// CreateScene function that creates and return the scene
var createScene = function(){
    // Create a basic BJS Scene object
    var scene = new BABYLON.Scene(engine);
    // Create a UniversalCamera, and set its position to {x: 0, y: 5, z: -10}
    var camera = new BABYLON.UniversalCamera('camera1', new BABYLON.Vector3(0, 5, -10), scene);
    camera.rotation = new BABYLON.Vector3(0.5, 0.5, 0);
    // Put camera into orthographic mode
    camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;

    // Attach the camera to the canvas
    //camera.attachControl(canvas, false);
    // Create a basic light, aiming 0, 1, 0 - meaning, to the sky
    var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);
    // Create a built-in "sphere" shape; its constructor takes 6 params: name, segment, diameter, scene, updatable, sideOrientation
    var sphere = BABYLON.Mesh.CreateSphere('sphere1', 4, 1, scene, false, BABYLON.Mesh.FRONTSIDE);
    // Move the sphere upward 1/2 of its height
    sphere.position.y = 1;
    // Create a built-in "ground" shape; its constructor takes 6 params : name, width, height, subdivision, scene, updatable
    //var ground = BABYLON.Mesh.CreateGround('ground1', 2, 0, 1, scene, false);
    // Return the created scene
    var box1 = BABYLON.Mesh.CreateBox('box1', 1, scene, false, BABYLON.Mesh.FRONTSIDE);
    box1.position = new BABYLON.Vector3(2,0,0);
    var box2 = BABYLON.Mesh.CreateBox('box2', 1, scene, false, BABYLON.Mesh.FRONTSIDE);
    box2.position = new BABYLON.Vector3(0,2,0);
    var box3 = BABYLON.Mesh.CreateBox('box3', 1, scene, false, BABYLON.Mesh.FRONTSIDE);
    box3.position = new BABYLON.Vector3(0,0,2);

    var distance = 10;
    var aspect = scene.getEngine().getRenderingCanvasClientRect().height / scene.getEngine().getRenderingCanvasClientRect().width; 
    camera.orthoLeft = -distance/2;
    camera.orthoRight = distance / 2;
    camera.orthoBottom = camera.orthoLeft * aspect;
    camera.orthoTop = camera.orthoRight * aspect;

    // Keypress events
    let keyisdown = {};
    window.addEventListener('keydown', function (event) {
        keyisdown[event.code] = true;
    });
 
    window.addEventListener('keyup', function (event) {
        keyisdown[event.code] = false;
    });

    window.addEventListener('mousemove', function (event) {
        if(event.clientX === 0){ // left
            keyisdown["MouseLeft"] = true; // so camera can be moved without cursor moving at edge of screen
            keyisdown["MouseRight"] = false;
        }
        else if(event.clientX === window.innerWidth - 1){ // right
            keyisdown["MouseRight"] = true;
            keyisdown["MouseLeft"] = false;
        }
        else{ // neither
            keyisdown["MouseRight"] = false;
            keyisdown["MouseLeft"] = false;
        }

        if(event.clientY === 0){ // down
            keyisdown["MouseDown"] = true;
            keyisdown["MouseUp"] = false;
        }
        else if(event.clientY === window.innerHeight - 1){ // up
            keyisdown["MouseUp"] = true;
            keyisdown["MouseDown"] = false;
        }
        else{ // neither
            keyisdown["MouseUp"] = false;
            keyisdown["MouseDown"] = false;
        }
    })

    scene.registerBeforeRender(function() {
        if(keyisdown["ArrowLeft"]){
            camera.position.x -= 1;
        }
        if(keyisdown["ArrowRight"]){
            camera.position.x += 1;
        }
        if(keyisdown["ArrowUp"]){
            camera.position.z += 1;
        }
        if(keyisdown["ArrowDown"]){
            camera.position.z -= 1;
        }
        if(keyisdown["MouseLeft"]){
            camera.position.x -= 0.5;
        }
        if(keyisdown["MouseRight"]){
            camera.position.x += 0.5;
        }
        if(keyisdown["MouseUp"]){
            camera.position.z -= 0.5;
        }
        if(keyisdown["MouseDown"]){
            camera.position.z += 0.5;
        }
    });

    return scene;
}

function fixCanvasSize(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function main(){
    fixCanvasSize();
    addEventListener("resize", fixCanvasSize);

    // call the createScene function
    var scene = createScene();
    // run the render loop
    engine.runRenderLoop(function(){
        scene.render();
    });
    // the canvas/window resize event handler
    window.addEventListener('resize', function(){
        engine.resize();
    });
}

main();
