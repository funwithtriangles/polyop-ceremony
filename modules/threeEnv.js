var THREE = require("three");
var OrbitControls = require('three-orbit-controls')(THREE)

var renderer, scene, camera, controls;
var box = {
	width: window.innerWidth,
	height: window.innerHeight
}

renderer = new THREE.WebGLRenderer({
	preserveDrawingBuffer: true,
	// alpha: true,
	premultipliedAlpha: true
});



// renderer.autoClear = false;

document.body.appendChild( renderer.domElement );

scene = new THREE.Scene();
bgScene = new THREE.Scene();
oclScene = new THREE.Scene();

scene.fog = new THREE.FogExp2( 0x4f6ab1, 0.0015 );

camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
camera.position.z = 500;

bgCamera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
bgCamera.position.z = 500;

oclCamera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
oclCamera.position.z = 500;

scene.add(camera);
bgScene.add(bgCamera);
oclScene.add(oclCamera);

controls = new OrbitControls(camera);
controls = new OrbitControls(oclCamera);

module.exports = {
	renderer: renderer,
	scene: scene,
	bgScene: bgScene,
	oclScene: oclScene,
	camera: camera,
	bgCamera: bgCamera,
	oclCamera: oclCamera,
	box: box
}