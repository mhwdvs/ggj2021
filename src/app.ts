import * as BABYLON from 'babylonjs';
import { BabylonFileParser, Vector3 } from 'babylonjs';

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
    // rotate down by 0.45, clockwise by 0.80 
    // (its not clear if these are radians, degrees or some other cursed shit 
    // [its definitely not a direction vector] - terrible docs)
    camera.cameraRotation = new BABYLON.Vector2(0.045, 0.080);
    // Put camera into orthographic mode
    //camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;

    // Create a basic light, aiming 0, 1, 0 - meaning, to the sky
    var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);
    // Create a built-in "sphere" shape; its constructor takes 6 params: name, segment, diameter, scene, updatable, sideOrientation
    var sphere = BABYLON.Mesh.CreateSphere('sphere1', 4, 1, scene, false, BABYLON.Mesh.FRONTSIDE);
    sphere.position.y = 1;
    var box1 = BABYLON.Mesh.CreateBox('box1', 1, scene, false, BABYLON.Mesh.FRONTSIDE);
    box1.position = new BABYLON.Vector3(2,0,0);
    var box2 = BABYLON.Mesh.CreateBox('box2', 1, scene, false, BABYLON.Mesh.FRONTSIDE);
    box2.position = new BABYLON.Vector3(0,2,0);
    var box3 = BABYLON.Mesh.CreateBox('box3', 1, scene, false, BABYLON.Mesh.FRONTSIDE);
    box3.position = new BABYLON.Vector3(0,0,2);
    //var line = BABYLON.Mesh.CreateLines('line', [new BABYLON.Vector3(0, 0, 0), new BABYLON.Vector3(0.5, 0.5, 0)], scene, false);
    var line2 = BABYLON.Mesh.CreateLines('line2', [new BABYLON.Vector3(0, 0, 0), new BABYLON.Vector3(5, 0, 0)], scene, false);
    var line2 = BABYLON.Mesh.CreateLines('line3', [new BABYLON.Vector3(0, 0, 0), new BABYLON.Vector3(0, 5, 0)], scene, false);
    var line2 = BABYLON.Mesh.CreateLines('line4', [new BABYLON.Vector3(0, 0, 0), new BABYLON.Vector3(0, 0, 5)], scene, false);
    var line2 = BABYLON.Mesh.CreateLines('line5', [new BABYLON.Vector3(5, 0, 0), new BABYLON.Vector3(0, 0, 5)], scene, false);
    var line2 = BABYLON.Mesh.CreateLines('line6', [new BABYLON.Vector3(0, 0, 0), new BABYLON.Vector3(-10, 0, 5)], scene, false);
    //var line2 = BABYLON.Mesh.CreateLines('line7', [new BABYLON.Vector3(0, 0, 0), new BABYLON.Vector3(10, 0, -5)], scene, false);
    var line2 = BABYLON.Mesh.CreateLines('line7', [new BABYLON.Vector3(100, 0, 0), new BABYLON.Vector3(0, 0, 100)], scene, false);
    var line2 = BABYLON.Mesh.CreateLines('line7', [new BABYLON.Vector3(100, 0, 100), new BABYLON.Vector3(-100, 0, -100)], scene, false);

    //var distance = 10;
    //var aspect = scene.getEngine().getRenderingCanvasClientRect().height / scene.getEngine().getRenderingCanvasClientRect().width; 
    //camera.orthoLeft = -distance/2;
    //camera.orthoRight = distance / 2;
    //camera.orthoBottom = camera.orthoLeft * aspect;
    //camera.orthoTop = camera.orthoRight * aspect;

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
        else{
            keyisdown["MouseLeft"] = false;
            keyisdown["MouseRight"] = false;
        }
        
        if(event.clientY === 0){ // up
            keyisdown["MouseDown"] = false;
            keyisdown["MouseUp"] = true;
        }
        else if(event.clientY === window.innerHeight - 1){ // down
            keyisdown["MouseUp"] = false;
            keyisdown["MouseDown"] = true;
        }
        else{ // neither
            keyisdown["MouseUp"] = false;
            keyisdown["MouseDown"] = false;
        }
    })

    scene.registerBeforeRender(function() {
        if(keyisdown["ArrowLeft"] || keyisdown["MouseLeft"]){
            //camera.position.x -= 1;
            //let {x, y} = translateScreenToScene(new BABYLON.Vector2(-1, 0), camera.cameraRotation);
            camera.position.x += -0.5;
            camera.position.z += 0.5;
        }
        if(keyisdown["ArrowRight"] || keyisdown["MouseRight"]){
            //camera.position.x += 1;
            //let {x, y} = translateScreenToScene(new BABYLON.Vector2(1, 0), camera.cameraRotation);
            camera.position.x += 0.5;
            camera.position.z += -0.5;
        }
        if(keyisdown["ArrowUp"] || keyisdown["MouseUp"]){
            //camera.position.z += 1;
            //let {x, y} = translateScreenToScene(new BABYLON.Vector2(0, 1), camera.cameraRotation);
            camera.position.x += 0.5;
            camera.position.z += 0.5;
        }
        if(keyisdown["ArrowDown"] || keyisdown["MouseDown"]){
            //camera.position.z -= 1;
            let {x, y} = translateScreenToScene(new BABYLON.Vector2(0, -1), camera.cameraRotation);
            camera.position.x += -0.5;
            camera.position.z += -0.5;
        }
    });

    return scene;
}

function fixCanvasSize(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function translateScreenToScene(inc: BABYLON.Vector2, cameraRotation: BABYLON.Vector2){
    // correct the direction of movement to be relative to the screen's coordinates rather than the games coordinates
    inc.x += (0.5);
    inc.y += (0.5);
    return inc;
}

function translateSceneToScreen(inc: BABYLON.Vector3){
    inc.x = inc.x * (-0.5);
    inc.y = inc.y * (-0.5);
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
