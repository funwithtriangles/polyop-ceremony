var THREE = require("three");
var OrbitControls = require('three-orbit-controls')(THREE)

var scene, camera, controls;

scene = new THREE.Scene();

camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 30000 );
camera.position.z = 500;

// controls = new OrbitControls(camera);

module.exports = {
	scene: scene,
	camera: camera
}