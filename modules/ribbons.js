var THREE = require('three');
var threeEnv = require('./threeEnv');

var ribbon;

var y = 0;

var positions = [];



var Ribbon = function() {

	this.tick = 0;

	this.length = 100;

	this.positions = [];

	this.width = 100;

	this.dx = 0;
	this.dy = 1;
	this.dz = 0;

	this.x = 0;
	this.y = 0;
	this.z = 0;

	this.geom = new THREE.PlaneGeometry(30, 30, 1, this.length);
	
	this.material = new THREE.MeshNormalMaterial({
		wireframe: true,
		side: THREE.DoubleSide
	});
		
	this.mesh = new THREE.Mesh(this.geom, this.material);


	for (var i=0; i<this.length*2; i++) {
		this.positions.push(0);
	}

	this.update = function() {

		this.x += this.dx;
		this.y += this.dy;
		this.z += this.dz;

		this.tick++;

		// Remove last XYZ
		this.positions.pop();
		this.positions.pop();
		this.positions.pop();

		// Add new XYZ
		this.positions.unshift(this.x, this.y, this.z);

		for (var i = 0; i < this.length + 1; i++) {

			var v1	= this.geom.vertices[i*2];
			var v2	= this.geom.vertices[i*2+1];
		
			v1.x = this.positions[i*3] - this.width/2;
			v2.x = this.positions[i*3] + this.width/2;
			v1.y = this.positions[i*3+1];
			v2.y = this.positions[i*3+1];
			v1.z = this.positions[i*3+2];
			v2.z = this.positions[i*3+2];

		}

		//this.geom.computeFaceNormals();
		//this.geom.computeVertexNormals();
		this.geom.verticesNeedUpdate	= true;
		this.geom.normalsNeedUpdate 	= true;

		if (this.tick > 100) {
			this.dz = 1;
			this.dx = 1;
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