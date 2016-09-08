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

var numSpins = 0;

threeEnv.scene.add(group);

group.position.z = 500;
group.rotation.y = THREE.Math.degToRad(180);

var trackLength = 500;
var wedge = THREE.Math.degToRad(200);

var wedgeSlice = wedge/(numGuys-1);

var params = {
	dancePower: 0,
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
		

	}
}

gui.add(params, 'enterMasks');
gui.add(params, 'alternateSpins');
gui.add(params, 'dancePower', 1, 20).name('Baby Dance Power');

var maskGeom = loader.parse(maskModel).children[0].geometry;

function isEven(n) {
	return n % 2 == 0;
}

var Guy = function(angle, index) {

	var that = this;

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




}


for (var i = 0; i < numGuys; i++) {

	var angle = wedgeSlice * i;
	guys.push(new Guy(angle - wedge/2, i));

}

var draw = function() {

	for (var i = 0; i < numGuys; i++) {
		guys[i].draw();
	}

}

module.exports = {
	draw: draw,
	params: params
}