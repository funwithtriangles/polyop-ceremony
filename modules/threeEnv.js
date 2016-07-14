var THREE = require("three");
var OrbitControls = require('three-orbit-controls')(THREE)

var renderer, scene, camera, controls;
var box = {
	width: window.innerWidth,
	height: window.innerHeight
}

renderer = new THREE.WebGLRenderer({ preserveDrawingBuffer: true });

renderer.autoClear = false;

document.body.appendChild( renderer.domElement );

scene = new THREE.Scene();
bgScene = new THREE.Scene();

scene.fog = new THREE.FogExp2( 0x000000, 0.0025 );

camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
camera.position.z = 500;

bgCamera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
bgCamera.position.z = 500;

bgScene.add(bgCamera);
scene.add(camera);

controls = new OrbitControls(camera);

module.exports = {
	renderer: renderer,
	scene: scene,
	bgScene: bgScene,
	camera: camera,
	bgCamera: bgCamera,
	box: box
}