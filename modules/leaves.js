var THREE = require('three');
var TWEEN = require('tween.js');
var threeEnv = require('./threeEnv');

var gui = require('./gui');
var guiFolder = gui.addFolder('Leaves');


var leafData = require('../assets/leaf.json');
var loader = new THREE.JSONLoader();

var particles = [];
var numLeafs = 50;

var zLimit = 1000;

var radius = 320;

var leafGroup = new THREE.Object3D();
threeEnv.scene.add(leafGroup);

var material = new THREE.MeshBasicMaterial(
{
	side: THREE.DoubleSide,
	color: 0x73be73,
	// transparent: true,
	// blending: THREE.AdditiveBlending,
	shading: THREE.FlatShading,
	transparent: true
});

var params = {
	groupRotX: 0,
	groupRotY: 0,
	groupRotZ: 0.005,
	particleRot: 0.003,
	speed: -0.02,
	opacity: 1,
	masterOpacity: 1,
	active: true,
	fadeOut: function() {
		var tween = new TWEEN.Tween(params)
	    .to({masterOpacity: 0}, 10000)
	    .easing(TWEEN.Easing.Quintic.Out)
	    .start()
	    .onComplete(function() {
	    	leafGroup.traverse( function ( object ) { object.visible = false; } );
	    });
	},
	allFade: function() {

		params.opacity = 0;
		var tween = new TWEEN.Tween(params)
	    .to({opacity: 1}, 500)
	    .easing(TWEEN.Easing.Quintic.Out)
	    .start();

	},
	slowDown: function() {

		var tween = new TWEEN.Tween(params)
	    .to({speed: 0, groupRotZ: 0.005}, 15000)
	    .easing(TWEEN.Easing.Quadratic.Out)
	    .start();

	},
	gotoCircle: function(duration, tween) {

		gotoCircle(duration, tween);
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
guiFolder.add(params, 'allFade');
guiFolder.add(params, 'active');


var leafModel = new THREE.Mesh( loader.parse(leafData).geometry, material );
leafModel.scale.set(10,10,10);

function posNeg() {
	return Math.random() > 0.5 ? 1 : -1;
}

var Leaf = function(i) {

	var that = this;

	this.mesh = leafModel.clone();

	this.index = i;
	
	leafGroup.add(this.mesh);

	this.reset = function() {



		that.mesh.position.x = (((Math.random() + 1.1) * 1000) - 1000) * posNeg();
		that.mesh.position.y = (((Math.random() + 1.1) * 1000) - 1000) * posNeg();
		that.mesh.position.z = ((Math.random() * zLimit * 2) - zLimit) + 500;


		that.vz = Math.random() + 0.5;

		that.mesh.rotation.x = Math.random() * Math.PI*2;
		that.mesh.rotation.y = Math.random() * Math.PI*2;
		that.mesh.rotation.z = Math.random() * Math.PI*2;

	}

	this.circleTween = function(duration, tween) {

		if (!duration) {
			var duration = 800;
		}

		if (!tween) {
			var tween = TWEEN.Easing.Quintic.InOut;
		}

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
	    .to(target, duration)
	    .easing(tween)
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

var gotoCircle = function(duration, tween) {

	for (var i = 0; i < numLeafs; i++) {
		particles[i].circleTween(duration, tween);
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

	leafGroup.rotation.z += params.groupRotZ * 0.1;
	material.opacity = params.opacity * params.masterOpacity;

	for (var i = 0; i < particles.length; i++) {

		var particle = particles[i];

		particle.mesh.position.z += particle.vz * params.speed * 10;
		particle.mesh.rotation.x += params.particleRot;
		particle.mesh.rotation.y += params.particleRot;
		particle.mesh.rotation.z += params.particleRot;



		if (params.active && particle.mesh.position.z > zLimit + 500 && params.speed > 0) {
			particle.mesh.position.z = -zLimit;
		}
		
		if (params.active && particle.mesh.position.z < -zLimit && params.speed < 0) {
			particle.mesh.position.z = zLimit + 500;
		}

	}

}

var resetAll = function() {

	for (var i = 0; i < numLeafs; i++) {
		particles[i].reset();
	}

}


init();

module.exports = {
	draw: draw,
	params: params
}



