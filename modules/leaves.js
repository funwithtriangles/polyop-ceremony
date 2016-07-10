var THREE = require('three');
var TWEEN = require('tween.js');
var threeEnv = require('./threeEnv');

var loader = new THREE.JSONLoader();
var leafModel;
var particles = [];
var numLeafs = 100;

var radius = threeEnv.box.height*0.3;

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

var Leaf = function(i) {

	var that = this;

	this.mesh = leafModel.clone();

	this.index = i;
	this.mesh.position.x = (Math.random() * 1000) - 500;
	this.mesh.position.y = (Math.random() * 1000) - 500;
	this.mesh.position.z = (Math.random() * 1000) - 500;

// //	this.vz = Math.random() + 0.5;

// 	this.mesh.rotation.x = Math.random() * Math.PI*2;
// 	this.mesh.rotation.y = Math.random() * Math.PI*2;
// 	this.mesh.rotation.z = Math.random() * Math.PI*2;

	threeEnv.scene.add(this.mesh);

	this.circleTween = function() {

		var rot = 2 * Math.PI * that.index / numLeafs;

		var params = {
			xPos: that.mesh.position.x,
			yPos: that.mesh.position.y,
			zPos: that.mesh.position.z,
			zRot: that.mesh.rotation.z
		}

		var target = {
			xPos: radius * Math.cos(rot),
			yPos: radius * Math.sin(rot),
			zPos: 0,
			zRot: rot - Math.PI/2
		}

		var tween = new TWEEN.Tween(params)
	    .to(target, 1000)
	    .easing(TWEEN.Easing.Quintic.InOut)
	    .start();



	    tween.onUpdate(function(){
		    that.mesh.position.x = params.xPos;
		    that.mesh.position.y = params.yPos;
		    that.mesh.position.z = params.zPos;
		    that.mesh.rotation.z = params.zRot;
		});

	}

	
}


var init = function() {

	for (var i = 0; i < numLeafs; i++) {

		var leaf = new Leaf(i);

		particles.push(leaf);
		
	}

	var t = setTimeout(function() {
		for (var i = 0; i < numLeafs; i++) {

			particles[i].circleTween();

		}

		
	}, 3000)



}

var draw = function(timePassed) {

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

	TWEEN.update();

}

module.exports = {
	draw: draw
}



