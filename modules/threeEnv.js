var THREE = require("three");
var OrbitControls = require('three-orbit-controls')(THREE)

var renderer, scene, camera, controls;
var box = {
	width: window.innerWidth,
	height: window.innerHeight
}

renderer = new THREE.WebGLRenderer({
//	alpha: true,
});

renderer.autoClear = false;

document.body.appendChild( renderer.domElement );

scene = new THREE.Scene();
bgScene = new THREE.Scene();


var lights = [];
lights[ 0 ] = new THREE.PointLight( 0xffffff, 1, 0 );
lights[ 1 ] = new THREE.PointLight( 0xffffff, 1, 0 );
lights[ 2 ] = new THREE.PointLight( 0xffffff, 1, 0 );

lights[ 0 ].position.set( 0, 20, 0 );
lights[ 1 ].position.set( 20, 20, 20 );
lights[ 2 ].position.set( - 20, - 20, - 20 );

scene.add( lights[ 0 ] );
scene.add( lights[ 1 ] );
scene.add( lights[ 2 ] );


var ambientLight = new THREE.AmbientLight( 0xffffff, 0.5 );

scene.add( ambientLight );
scene.fog = new THREE.FogExp2( 0x000000, 0.0025 );

camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 30000 );
camera.position.z = 500;

bgCamera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 30000 );
bgCamera.position.z = 500;

bgScene.add(bgCamera);
scene.add(camera);

// controls = new OrbitControls(camera);

module.exports = {
	renderer: renderer,
	scene: scene,
	bgScene: bgScene,
	camera: camera,
	bgCamera: bgCamera,
	box: box
}