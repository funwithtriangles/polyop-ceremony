var THREE = require('three');
var threeEnv = require('./threeEnv');

var ribbon;

var y = 0;

var positions = [];



var Ribbon = function() {

	var tick = 0;

	var length = 100;

	var positions = [];

	var width = 15;

	var speed = 3;

	var dx = 1;
	var dy = 1;
	var dz = 1;
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
		
	this.mesh = new THREE.Mesh(geom, material);


	for (var i=0; i<length*2; i++) {
		positions.push(0);
	}

	for (var i=0; i<sequenceLength; i++) {

		var isNegative = i % 2 ? -1 : 1;

		sequence.push({
			dx: (Math.random() + 1 * speed) * isNegative,
			dy: ((Math.random() * 2) - 1) * speed,
			dz: 1
		});

		if (i !== sequenceLength-1) {
			sequence[i].nextZ = (i+1) * 50;
		}
	}

	console.log(sequence);

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

		// geom.computeFaceNormals();
		// geom.computeVertexNormals();
		geom.verticesNeedUpdate	= true;
		geom.normalsNeedUpdate 	= true;

		if (sequenceItem.nextZ && z > sequenceItem.nextZ) {
			sequenceIndex++
		}

	}

}

var createRibbons = function() {

	ribbon = new Ribbon();
	threeEnv.scene.add(ribbon.mesh);

}


var draw = function() {

	ribbon.update();

}

createRibbons();

module.exports = {
	draw: draw
}