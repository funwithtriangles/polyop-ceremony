var THREE = require('three');
var threeEnv = require('./threeEnv');
var group = new THREE.Object3D();

var numGuys = 5;

threeEnv.scene.add(group);

group.position.z = 500;
group.rotation.y = THREE.Math.degToRad(180);

var trackLength = 500;
var wedge = THREE.Math.degToRad(220);

var wedgeSlice = wedge/(numGuys-1);

var params = {

}

var Guy = function(angle) {

	this.track = new THREE.Object3D();
//	this.track.position.z = trackLength;
	var geom = new THREE.OctahedronGeometry(100);
	var material = new THREE.MeshPhongMaterial({
		color: 0x4f6ab1,
		shading: THREE.FlatShading,
		//specular: 0x111111,
	 	shininess: 0,
		//wireframe: true
	});

	this.mesh = new THREE.Mesh(geom, material);

	

	this.track.add(this.mesh);

	group.add(this.track);

	this.mesh.position.z = -trackLength;

	this.track.rotation.y = angle;

}


for (var i = 0; i < numGuys; i++) {

	var angle = wedgeSlice * i;
	var guy = new Guy(angle - wedge/2);

	console.log(THREE.Math.radToDeg(angle));

}

var draw = function() {

//	group.rotation.y += 0.01;

	//guy.track.rotation.y += 0.01;

}

module.exports = {
	draw: draw,
	params: params
}