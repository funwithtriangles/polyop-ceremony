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

group.position.z = 500;
group.rotation.y = THREE.Math.degToRad(180);

setWedge(THREE.Math.degToRad(200));

var params = {
	rotSpeed: 0,
	dancePower: 0,
	waveStrength: 0,
	enterMasks: function() {

		for (var i = 0; i < numGuys; i++) {

			guys[i].enterScene();

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


		var tween = new TWEEN.Tween(group.position)
	    .to({z: 0}, 10000)
	    .easing(TWEEN.Easing.Quadratic.InOut)
	    .start();

		setWedge(Math.PI*2, true);

		for (var i = 0; i < numGuys; i++) {

			guys[i].reposition();

		}

	},
	slowDown: function() {

		var tween = new TWEEN.Tween(params)
	    .to({rotSpeed: 0}, 30000)
	    .easing(TWEEN.Easing.Quadratic.Out)
	    .start();

	},
	slowWaves: function() {

		var tween = new TWEEN.Tween(params)
	    .to({waveStrength: 0}, 10000)
	    .easing(TWEEN.Easing.Quadratic.Out)
	    .start();

	}

}

gui.add(params, 'enterMasks');
gui.add(params, 'alternateSpins');
gui.add(params, 'dancePower', 1, 20).name('Baby Dance Power');
gui.add(params, 'gotoCircle');

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

	this.track = new THREE.Object3D();
	this.posMesh = new THREE.Object3D();
	this.danceMesh = new THREE.Object3D();

	group.add(this.track);
	this.track.add(this.posMesh);
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

	this.track.rotation.y = angle;

	this.enterScene = function() {

		tween = new TWEEN.Tween(that.posMesh.position)
	    .to({z: -trackLength}, 25000)
	    .easing(TWEEN.Easing.Sinusoidal.Out)
	    .start();
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

	}

	this.reposition = function() {

		calcAngle();

		var tween = new TWEEN.Tween(that.track.rotation)
	    .to({y: angle}, 10000)
	    .easing(TWEEN.Easing.Quadratic.InOut)
	    .start();

	}

}


for (var i = 0; i < numGuys; i++) {

	guys.push(new Guy(i));

}

var draw = function() {

	var wave = ((clock.lfo.sine + 1)/2) * params.waveStrength;


	for (var i = 0; i < numGuys; i++) {
		guys[i].draw();
	}

	group.rotation.y += params.rotSpeed + wave;

}

module.exports = {
	draw: draw,
	params: params
}