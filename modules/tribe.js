var THREE = require('three');
var threeEnv = require('./threeEnv');
var group = new THREE.Object3D();
var loader = new THREE.ObjectLoader();
var maskModel = require('../assets/baby.json');
var numGuys = 5;

threeEnv.scene.add(group);

group.position.z = 500;
group.rotation.y = THREE.Math.degToRad(180);

var trackLength = 500;
var wedge = THREE.Math.degToRad(200);

var wedgeSlice = wedge/(numGuys-1);

var params = {

}

var maskGeom = loader.parse(maskModel).children[0].geometry;

function isEven(n) {
	return n % 2 == 0;
}

var Guy = function(angle, reversed) {

	this.track = new THREE.Object3D();
	this.mesh = new THREE.Object3D();

	var geom = maskGeom.clone();

	var material = new THREE.MeshPhongMaterial({
		color: 0x4f6ab1,
		shading: THREE.FlatShading,
		//specular: 0x111111,
	 	shininess: 0,
		//wireframe: true
	});

	var innerMesh = new THREE.Mesh(geom, material);

	if (reversed) {
		innerMesh.rotation.y = THREE.Math.degToRad(180);
	}
	
	this.mesh.add(innerMesh);

	this.track.add(this.mesh);

	group.add(this.track);

	this.mesh.position.z = -trackLength;

	this.track.rotation.y = angle;


}


for (var i = 0; i < numGuys; i++) {

	var angle = wedgeSlice * i;
	var guy = new Guy(angle - wedge/2, isEven(i));

}

var draw = function() {

//	group.rotation.y += 0.01;

	//guy.track.rotation.y += 0.01;

}

module.exports = {
	draw: draw,
	params: params
}