var THREE = require('three');
var TWEEN = require('tween.js');
var threeEnv = require('./threeEnv');

var gui = require('./gui');
var guiFolder = gui.addFolder('Leaves');

var loader = new THREE.JSONLoader();
var leafModel;
var particles = [];
var numLeafs = 50;

var zLimit = 2000;

var radius = window.innerHeight/3;

var leafGroup = new THREE.Object3D();
threeEnv.scene.add(leafGroup);

var params = {
	groupRotX: 0,
	groupRotY: 0,
	groupRotZ: 0.005,
	speed: 0,
	leafOpacity: 1,
	active: true,
	gotoCircle: function() {
		gotoCircle();
	},
	resetLeaves: function() {
		resetAll();
	}
}

// gui.remember(params);

guiFolder.add(params, 'speed', -1, 1);
guiFolder.add(params, 'groupRotX', 0, 1);
guiFolder.add(params, 'groupRotY', 0, 1);
guiFolder.add(params, 'groupRotZ', 0, 1);
guiFolder.add(params, 'gotoCircle');
guiFolder.add(params, 'resetLeaves');
guiFolder.add(params, 'active');
guiFolder.add(params, 'leafOpacity', 0, 1);


loader.load('leaf.js', function ( geometry ) {

		var material = new THREE.MeshBasicMaterial(
			{
				side: THREE.DoubleSide,
				color: 0x73be73,
				// transparent: true,
				// blending: THREE.AdditiveBlending,
				shading: THREE.FlatShading,
				transparent: true
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
	
	leafGroup.add(this.mesh);

	this.reset = function() {

		that.mesh.position.x = (Math.random() * 2000) - 1000;
		that.mesh.position.y = (Math.random() * 2000) - 1000;
		that.mesh.position.z = (Math.random() * 2000) - 1000;

		that.vz = Math.random() + 0.5;

		that.mesh.rotation.x = Math.random() * Math.PI*2;
		that.mesh.rotation.y = Math.random() * Math.PI*2;
		that.mesh.rotation.z = Math.random() * Math.PI*2;

	}

	this.circleTween = function() {

		var rot = 2 * Math.PI * that.index / numLeafs;

		var params = {
			xPos: that.mesh.position.x,
			yPos: that.mesh.position.y,
			zPos: that.mesh.position.z,
			xRot: that.mesh.rotation.x,
			yRot: that.mesh.rotation.y,
			zRot: that.mesh.rotation.z
		}

		var target = {
			xPos: radius * Math.cos(rot),
			yPos: radius * Math.sin(rot),
			zPos: 0,
			xRot: 0,
			yRot: 0,
			zRot: rot - Math.PI/2,
		}

		var tween = new TWEEN.Tween(params)
	    .to(target, 800)
	    .easing(TWEEN.Easing.Quintic.InOut)
	    .start();



	    tween.onUpdate(function(){
		    that.mesh.position.x = params.xPos;
		    that.mesh.position.y = params.yPos;
		    that.mesh.position.z = params.zPos;
		    that.mesh.rotation.x = params.xRot;
		    that.mesh.rotation.y = params.yRot;
		    that.mesh.rotation.z = params.zRot;
		});

	}
	
}

var gotoCircle = function() {

	for (var i = 0; i < numLeafs; i++) {
		particles[i].circleTween();
	}

}

var init = function() {

	for (var i = 0; i < numLeafs; i++) {

		var leaf = new Leaf(i);

		particles.push(leaf);
		
	}

	resetAll();

}

var draw = function(timePassed) {

	// leafGroup.rotation.x += params.groupRotX * 0.1;
	// leafGroup.rotation.y += params.groupRotY * 0.1;
	leafGroup.rotation.z += params.groupRotZ * 0.1;

	for (var i = 0; i < particles.length; i++) {

		var particle = particles[i];

		particle.mesh.material.opacity = params.leafOpacity;
		particle.mesh.position.z += particle.vz * params.speed * 10;
		particle.mesh.rotation.x += 0.003;
		particle.mesh.rotation.y += 0.003;
		particle.mesh.rotation.z += 0.003;



		if (params.active && particle.mesh.position.z > 500 && params.speed > 0) {
			particle.mesh.position.z = -500;
		}
		
		if (params.active && particle.mesh.position.z < -500 && params.speed < 0) {
			particle.mesh.position.z = 500;
		}

	}

}

var resetAll = function() {

	for (var i = 0; i < numLeafs; i++) {
		particles[i].reset();
	}

}

module.exports = {
	draw: draw,
	params: params
}



