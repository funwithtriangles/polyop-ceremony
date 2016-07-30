var THREE = require('three');
var threeEnv = require('./threeEnv');

var ribbon;

var mainTick = 0;

var y = 0;

var positions = [];

var group = new THREE.Object3D();

var ribbons = [];

threeEnv.scene.add(group);

var Ribbon = function(id) {

	this.container = new THREE.Object3D();

	var tick = 0;

	var length = 100;

	var positions = [];

	var width = 15;

	var speed = 3;

	var radius = 100;

	var ry = width * 2;

	var x = 0;
	var y = 0;
	var z = 0;

	var sequenceLength = 3;
	var sequenceIndex = 0;
	var sequence = [];


	var geom = new THREE.PlaneGeometry(30, 30, 1, length);
	
	var material = new THREE.MeshPhongMaterial({
		//wireframe: true,
		side: THREE.DoubleSide,
		shading: THREE.FlatShading
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
		}

		if (i !== sequenceLength-1) {
			sequence[i].nextZ = (i+1) * 100;
		}
	}

	this.update = function() {

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

	if (mainTick > 100) {
		fireRibbon();

		mainTick = 0;
	}

	updateRibbons();
	group.rotation.z += 0.005;
	
}

module.exports = {
	draw: draw
}