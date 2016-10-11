var THREE = require('three');
var threeEnv = require('./threeEnv');
var TWEEN = require('tween.js');
var gui = require('./gui').addFolder('Ribbons');
var clock = require('./clock');

var numFlashes = 0;
var flashing = false;
var numRibbons = 10;
var ribbonIndex = 0;

var params = {
	ribbonCount: 3,
	ribbonFreq: 100,
	ribbonRot: 0.005,
	opacity: 1,
	ribbonsActive: false,
	waveActive: false,
	randomFlash: function() {

	

		for (var i = numFlashes % 2; i < 10; i += 2) {

			var ribbon = ribbons[i];

			if (ribbon) {

				var material = ribbon.mesh.material;

				material.opacity = 1;


				var tween = new TWEEN.Tween(material)
			    .to({opacity: 0}, 500)
			    .easing(TWEEN.Easing.Quintic.Out)
			    .start()
			    .onStart(function() {
			    	flashing = true;
			    })
			    .onComplete(function() {
			    	flashing = false;
			    });

			}
			
			
		}


		numFlashes ++;

		
		


	},
	startRibbons: function(wave) {
		params.ribbonsActive = true;

		if (wave) {
			params.waveActive = true;
		} else {
			params.waveActive = false
		}
	},
	stopRibbons: function(wave) {
		params.ribbonsActive = false;
	}
}

gui.add(params, 'ribbonCount', 0, 20);
gui.add(params, 'waveActive');
gui.add(params, 'ribbonFreq', 0, 200);
gui.add(params, 'ribbonRot', 0, 0.03);
gui.add(params, 'opacity', 0, 1).name('Ribbon Opacity');
gui.add(params, 'ribbonsActive');
gui.add(params, 'randomFlash');

var ribbon;

var mainTick = 0;

var y = 0;

var positions = [];

var group = new THREE.Object3D();

var ribbons = [];

var radius = 0;

threeEnv.scene.add(group);

group.position.z = -170;

var Ribbon = function(id) {

	this.container = new THREE.Object3D()

	var length = 75;

	var positions, x, y, z;

	var width = 15;

	var speed = 3;

	var ry = width * 2;

	

	var sequenceLength = 3;
	var sequenceIndex = -1;
	var sequence = [];


	var geom = new THREE.PlaneGeometry(30, 30, 1, length);
	
	var material = new THREE.MeshBasicMaterial({
		//wireframe: true,
		side: THREE.DoubleSide,
		transparent: true,
		opacity: 0
	});
		
	this.mesh = new THREE.Mesh(geom, material);

	this.mesh.position.x = radius;

	this.container.add(this.mesh);

	this.container.rotation.z = Math.random() * Math.PI * 2;

	for (var i=0; i<sequenceLength; i++) {

		var isNegative = i % 2 ? -1 : 1;

		sequence.push({
			dx: (Math.random() * speed) * isNegative,
			dy: ((Math.random() * 2) - 1) * speed,
			dz: 2
		});

		// Ensure first part of ribbon is pointing away from center
		if (i == 0) {
			sequence[i].dy = 0;
			sequence[i].dz = 0.5;
			sequence[i].dx = 1.5;
		}

		if (i !== sequenceLength-1) {

			sequence[i].nextZ = 100 + (i * 100);
			
			
		}
	}

	this.update = function() {

		if (sequenceIndex < 0) {
			return
		}

		if (!flashing) {
			material.opacity = params.opacity;
		}
		
		var sequenceItem = sequence[sequenceIndex];

		x += sequenceItem.dx * speed;
		y += sequenceItem.dy * speed;
		z += sequenceItem.dz * speed;


		// Remove last XYZ
		positions.pop();
		positions.pop();
		positions.pop();

		// Add new XYZ
		positions.unshift(x, y, z);

		updateVertices(positions);


		if (sequenceItem.nextZ && z > sequenceItem.nextZ) {
			sequenceIndex++
		}

	}


	// Prime ribbon to be animated
	this.reset = function() {

		positions = [];

		for (var i=0; i<length*2; i++) {
			positions.push(0);
		}

		updateVertices(positions);

		sequenceIndex = 0;

		x = 0;
		y = 0;
		z = 0;

	}

	function updateVertices(positions) {

		for (var i = 0; i < length + 1; i++) {

			var v1	= geom.vertices[i*2];
			var v2	= geom.vertices[i*2+1];
		
			v1.x = positions[i*3] 	- width;
			v2.x = positions[i*3] 	+ width;
			v1.y = positions[i*3+1] - ry;
			v2.y = positions[i*3+1] + ry;
			v1.z = positions[i*3+2];
			v2.z = positions[i*3+2];

		}

		geom.computeFaceNormals();
		// geom.computeVertexNormals();
		geom.verticesNeedUpdate	= true;
		geom.normalsNeedUpdate 	= true;

	}

}

var fireRibbon = function() {

	ribbons[ribbonIndex].reset();
	ribbonIndex++;

	if (ribbonIndex >= numRibbons) {
		ribbonIndex = 0;
	}

}

var updateRibbons = function() {

	for (var i = 0; i < ribbons.length; i++) {

		ribbons[i].update();

	}

}



for (var i = 0; i < numRibbons; i++) {
	var ribbon = new Ribbon();
	group.add(ribbon.container);
	ribbons.push(ribbon);

}

var draw = function(timePassed) {

	mainTick++;

	if (params.ribbonsActive && mainTick > params.ribbonFreq) {

		for (var i = 0; i < params.ribbonCount; i++) {
			fireRibbon();
		}

		mainTick = 0;
	}

	updateRibbons();

	var wave = params.waveActive ? (clock.lfo.sine + 0.9) : 1; // Convert sine wave to between 0 and 1
	group.rotation.z += params.ribbonRot * wave;
	
}



module.exports = {
	draw: draw,
	params: params
}