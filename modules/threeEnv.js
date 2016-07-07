var THREE = require("three");
var OrbitControls = require('three-orbit-controls')(THREE)

var renderer, scene, camera, controls;

renderer = new THREE.WebGLRenderer();
document.body.appendChild( renderer.domElement );

scene = new THREE.Scene();

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

//scene.fog = new THREE.FogExp2( 0x000000, 0.01 );

camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 30000 );
camera.position.z = 500;

controls = new OrbitControls(camera);

module.exports = {
	renderer: renderer,
	scene: scene,
	camera: camera
}