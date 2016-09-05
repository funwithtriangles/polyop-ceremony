var THREE = require("three");
var OrbitControls = require('three-orbit-controls')(THREE)

var renderer, scene, camera, controls, axes;
var box = {
	width: window.innerWidth,
	height: window.innerHeight,
	area: window.innerWidth * window.innerHeight * window.devicePixelRatio
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


bgCamera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
bgCamera.position.z = 500;

scene.add(camera);
bgScene.add(bgCamera);


// controls = new OrbitControls(camera);

// var axes = new THREE.AxisHelper(50);

// scene.add(axes);

module.exports = {
	renderer: renderer,
	scene: scene,
	bgScene: bgScene,
	oclScene: oclScene,
	camera: camera,
	bgCamera: bgCamera,
	box: box
}