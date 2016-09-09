var THREE = require('three');
var threeEnv = require('./threeEnv');
var clock = require('./clock');
var TWEEN = require('tween.js');
var gui = require('./gui').addFolder('Tribe');

var group = new THREE.Object3D();
var loader = new THREE.ObjectLoader();
var maskModel = require('../assets/baby.json');
var numGuys = 5;
var guys = [];
var trackLength = 500;
var wedge, wedgeSlice;

var numSpins = 0;

threeEnv.scene.add(group);

group.rotation.y = THREE.Math.degToRad(180);

setWedge(THREE.Math.degToRad(200));

var params = {
	rotSpeed: 0,
	dancePower: 0,
	waveStrength: 0,
	trackLift: 0,
	groupZPos: 500,
	enterMasks: function() {

		for (var i = 0; i < numGuys; i++) {

			guys[i].enterScene();

		}

	},
	shootMasks: function() {

		for (var i = 0; i < numGuys; i++) {

			guys[i].shootInwards();

		}

	},
	alternateSpins: function() {

		for (var i = numSpins % 2; i < numGuys; i+=2) {

			if (guys[i]) {
				guys[i].spin();
			}
			
		}

		numSpins ++;
		
	},
	gotoCircle: function() {


		var tween = new TWEEN.Tween(params)
	    .to({groupZPos: 250}, 10000)
	    .easing(TWEEN.Easing.Quadratic.InOut)
	    .start();

		setWedge(Math.PI*2, true);

		for (var i = 0; i < numGuys; i++) {

			guys[i].reposition();

		}

	},
	slowDown: function() {

		var tween = new TWEEN.Tween(params)
	    .to({rotSpeed: 0.005}, 30000)
	    .easing(TWEEN.Easing.Quadratic.Out)
	    .start();

	},
	slowWaves: function() {

		var tween = new TWEEN.Tween(params)
	    .to({waveStrength: 0}, 10000)
	    .easing(TWEEN.Easing.Quadratic.Out)
	    .start();

	},
	slowReset: function() {

		group.rotation.y = group.rotation.y % (Math.PI * 2);

		var tween = new TWEEN.Tween(group.rotation)
	    .to({y: Math.PI * 4}, 30000)
	    .easing(TWEEN.Easing.Quadratic.Out)
	    .start();

	},
	rise: function() {
		var tween = new TWEEN.Tween(params)
	    .to({groupZPos: 0, trackLift: Math.PI/3}, 30000)
	    .easing(TWEEN.Easing.Quadratic.Out)
	    .start();
	}

}

gui.add(params, 'enterMasks');
gui.add(params, 'alternateSpins');
gui.add(params, 'dancePower', 1, 20).name('Baby Dance Power');
gui.add(params, 'gotoCircle');
gui.add(params, 'trackLift', 0, Math.PI);

var maskGeom = loader.parse(maskModel).children[0].geometry;

function setWedge(angle, full) {

	if (full) {
		adjust = 0;
	} else {
		adjust = 1;
	}

	wedge = angle;
	wedgeSlice = wedge/(numGuys-adjust);

}

function isEven(n) {
	return n % 2 == 0;
}

var Guy = function(index) {

	var that = this;

	var angle;

	function calcAngle() {
		angle = (wedgeSlice * index) - (wedge/2);
	}

	calcAngle();

	this.yTrack = new THREE.Object3D(); // Rotate on Y (carousel)
	this.xTrack = new THREE.Object3D(); // Rotate on X (lift up)
	this.posMesh = new THREE.Object3D(); // Move along track (in and out)
	this.danceMesh = new THREE.Object3D(); // Intricate moves

	group.add(this.yTrack);
	this.yTrack.add(this.xTrack);
	this.xTrack.add(this.posMesh);
	this.posMesh.add(this.danceMesh);

	var geom = maskGeom.clone();

	var reversed = isEven(index);

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
	
	this.danceMesh.add(innerMesh);

	this.posMesh.position.z = -trackLength*2;

	this.yTrack.rotation.y = angle;

	this.enterScene = function() {

		tween = new TWEEN.Tween(that.posMesh.position)
	    .to({z: -trackLength}, 25000)
	    .easing(TWEEN.Easing.Sinusoidal.Out)
	    .start();
	}

	this.shootInwards = function() {

		tween = new TWEEN.Tween(that.posMesh.position)
	    .to({z: 0}, 1000)
	    .easing(TWEEN.Easing.Elastic.In)
	    .start()
	    .onComplete(function() {
	    	innerMesh.visible = false;
	    })
	}

	this.spin = function() {

		that.danceMesh.rotation.y = 0;
		var tween = new TWEEN.Tween(that.danceMesh.rotation)
	    .to({y: Math.PI*2}, 500)
	    .easing(TWEEN.Easing.Quadratic.Out)
	    .start();
	    
	};

	this.draw = function() {

		if (reversed) {
			posNeg = 1;
		} else {
			posNeg = -1;
		}

		var wave = clock.lfo.sine * posNeg; 
		var waveHalf = clock.lfo.sineHalf * posNeg;

		var xMaskPos = 2.5 * wave * params.dancePower;
		var yMaskPos = (1.5 * waveHalf) * params.dancePower;
		var zMaskPos =  waveHalf * params.dancePower;
	
		that.danceMesh.position.x = xMaskPos;
		that.danceMesh.position.y = yMaskPos;
		that.danceMesh.position.z = zMaskPos;

		that.xTrack.rotation.x = params.trackLift;

	}

	this.reposition = function() {

		calcAngle();

		var tween = new TWEEN.Tween(that.yTrack.rotation)
	    .to({y: angle}, 10000)
	    .easing(TWEEN.Easing.Quadratic.InOut)
	    .start();

	}

}


for (var i = 0; i < numGuys; i++) {

	guys.push(new Guy(i));

}

var draw = function() {

	var wave = ((clock.lfo.sine + 0.9)/2) * params.waveStrength;


	for (var i = 0; i < numGuys; i++) {
		guys[i].draw();
	}

	group.rotation.y += params.rotSpeed + wave;
	group.position.z = params.groupZPos;

}

module.exports = {
	draw: draw,
	params: params
}