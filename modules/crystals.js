var THREE = require('three');
var threeEnv = require('./threeEnv');
var mask = require('./mask');

var crystalMaterial = new THREE.MeshLambertMaterial({
	wireframe: true
});

var params = {

}

var Crystal = function() {

	var geometry = new THREE.IcosahedronGeometry(20);
	var mesh = new THREE.Mesh(geometry, crystalMaterial);
	mesh.position.x = 300;

	mask.mask.add(mesh);

	return mesh;

}

var cystal = new Crystal();

var draw = function(time) {

	var time = time * 0.001;


	cystal.position.x = Math.sin( time * 0.7 ) * 150;
	cystal.position.y = Math.cos( time * 0.5 ) * 150;
	cystal.position.z = Math.cos( time * 0.3 ) * 150;

}



module.exports = {
	draw: draw,
	params: params
}
