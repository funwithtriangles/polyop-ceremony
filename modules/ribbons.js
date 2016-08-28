var THREE = require('three');
var threeEnv = require('./threeEnv');
var gui = require('./gui').addFolder('Ribbons');
var clock = require('./clock');

var params = {
	ribbonCount: 3,
	ribbonFreq: 50,
	ribbonRot: 0.005,
	opacity: 1,
	ribbonsActive: false,
	waveActive: false,
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

var ribbon;

var mainTick = 0;

var y = 0;

var positions = [];

var group = new THREE.Object3D();

var ribbons = [];

var radius = 0;

threeEnv.scene.add(group);

group.position.z = -200;

var Ribbon = function(id) {

	this.container = new THREE.Object3D();

	var tick = 0;

	var length = 100;

	var positions = [];

	var width = 15;

	var speed = 3;



	var ry = width * 2;

	var x = 0;
	var y = 0;
	var z = 0;

	var sequenceLength = 3;
	var sequenceIndex = 0;
	var sequence = [];


	var geom = new THREE.PlaneGeometry(30, 30, 1, length);
	
	var material = new THREE.MeshLambertMaterial({
		//wireframe: true,
		side: THREE.DoubleSide,
		shading: THREE.FlatShading,
		transparent: true
	});
		
	var mesh = new THREE.Mesh(geom, material);

	mesh.position.x = radius;

	this.container.add(mesh);

	this.container.rotation.z = Math.random() * Math.PI * 2;

	for (var i=0; i<length*2; i++) {
		positions.push(0);
	}

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

		material.opacity = params.opacity;

		var sequenceItem = sequence[sequenceIndex];

		x += sequenceItem.dx * speed;
		y += sequenceItem.dy * speed;
		z += sequenceItem.dz * speed;

		tick++;

		// Remove last XYZ
		positions.pop();
		positions.pop();
		positions.pop();

		// Add new XYZ
		positions.unshift(x, y, z);

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

		if (sequenceItem.nextZ && z > sequenceItem.nextZ) {
			sequenceIndex++
		}

		// Destroy ribbons when almost certainly out of view
		if (z > 500 + length * speed) {
			this.destroy();
		}

	}

	// Remove object from scene and array
	this.destroy = function() {
		group.remove(this.container);
		ribbons.splice(ribbons.indexOf(this), 1);
	}

}

var fireRibbon = function() {

	var ribbon = new Ribbon();
	group.add(ribbon.container);

	ribbons.push(ribbon);

}

var updateRibbons = function() {

	for (var i = 0; i < ribbons.length; i++) {

		ribbons[i].update();

	}

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