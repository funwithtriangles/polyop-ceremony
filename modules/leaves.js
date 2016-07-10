var THREE = require('three');
var threeEnv = require('./threeEnv');

var loader = new THREE.JSONLoader();
var leafModel;
var particles = [];
var numLeafs = 100;

loader.load('leaf.js', function ( geometry ) {

		var material = new THREE.MeshLambertMaterial(
			{
				side: THREE.DoubleSide,
				color: 0x00ff00,
				fog: true
			});
		leafModel = new THREE.Mesh( geometry, material );
		leafModel.scale.set(5,5,5);

		init();

	}
);

var Leaf = function() {

	this.mesh = leafModel.clone();
	this.mesh.position.x = (Math.random() * 1000) - 500;
	this.mesh.position.y = (Math.random() * 1000) - 500;
	this.mesh.position.z = (Math.random() * 1000) - 500;

	this.mesh.rotation.x = Math.random() * Math.PI*2;
	this.mesh.rotation.y = Math.random() * Math.PI*2;
	this.mesh.rotation.z = Math.random() * Math.PI*2;

	threeEnv.scene.add(this.mesh);

}


var init = function() {

	for (var i = 0; i < numLeafs; i++) {

		particles.push(new Leaf());
		
	}

}

var draw = function() {

	for (var i = 0; i < particles.length; i++) {

		var particle = particles[i];

		particle.mesh.position.z += 1;
		particle.mesh.rotation.x += 0.01;
		particle.mesh.rotation.y += 0.01;
		particle.mesh.rotation.z += 0.01;

		if (particle.mesh.position.z > 500) {
			particle.mesh.position.z = -500;
		}
		
	}

}

module.exports = {
	draw: draw
}



