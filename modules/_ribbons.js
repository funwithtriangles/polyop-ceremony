var THREE = require('three');
var threeEnv = require('./threeEnv');


var ribbons			= [];
var targets			= [];

var amount			= 10;
var counter			= 0;
var friction		= .01;
var spring			= .9;
var speed			= 10;
var movement		= 10;
var camPos			= new THREE.Vector3();

var px = py = pz	= 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var oldTime		= new Date().getTime();
var radius		= 7000;
var theta		= 0;

init();

function init()
{
	
	createRibbons();
	getNextRandomPosition();

}

function getNextRandomPosition()
{
	for (var i=0; i<amount; i++)
	{
		var dx		= Math.cos(ribbons[i].ax * theta) * speed;
		var dy		= Math.sin(ribbons[i].ay * theta) * speed;
		var dz		= Math.sin(ribbons[i].az * theta) * speed;

		// var dx		= Math.cos(theta) * speed;
		// var dy		= Math.sin(theta) * speed;
		// var dz		= Math.sin(theta) * speed;

		// var dx = Math.random() * speed;
		// var dy = Math.random() * speed;
		// var dz = Math.random() * speed;
		
		targets[i*3]	+= dx;
		targets[i*3+1]	+= dy;
		targets[i*3+2]	+= dz;

	}
}

function createRibbons()
{
	for (var i=0; i<amount; i++)
	{
		var ribbon = new Ribbon();
		ribbons.push(ribbon);
		targets.push(0, 0, 0);
		threeEnv.scene.add(ribbon.mesh);
	}
}


function Ribbon()
{
	this.positions			= [];
	this.rotations			= [];
	
	this.x					= 0;
	this.y					= 0;
	this.z					= 0;
	
	this.velX				= 1;
	this.velY				= 1;
	this.velZ				= 1;
	
	this.ax					= randomRange(-movement, movement);
	this.ay					= randomRange(-movement, movement);
	this.az					= randomRange(-movement, movement);


	// this.ax					= 1;
	// this.ay					= 1;
	// this.az					= 1;
	
	this.width				= randomRange(0, 30);
	this.length				= randomRange(80, 140);
	
	this.geom				= new THREE.PlaneGeometry(30, 30, 1, this.length);
	
	this.material			= new THREE.MeshLambertMaterial({ 
		color: Math.random()*0xFFFFFF,
		side: THREE.DoubleSide
	});
	
	this.mesh				= new THREE.Mesh(this.geom, this.material);
	
	this.mesh.rotation.x	= 90;
	this.mesh.doubleSided	= true;
	
	for (var i=0; i<this.length*2; i++)
	{
		this.positions.push(0);
		this.rotations.push(0);
	}
	
	this.update = function(x, y, z)
	{
		

		this.velX	+= (x - this.velX) * friction;
		this.velY	+= (y - this.velY) * friction;
		this.velZ	+= (z - this.velZ) * friction;
		
		this.x		+= this.velX	= (this.velX + (x - this.x) * friction) * spring;
		this.y		+= this.velY	= (this.velY + (y - this.y) * friction) * spring;
		this.z		+= this.velZ	= (this.velZ + (z - this.z) * friction) * spring;

		// this.x += x;
		// this.y += y;
		// this.z += z;
		
		this.positions.pop();
		this.positions.pop();
		this.positions.pop();
		
		this.rotations.pop();
		this.rotations.pop();
		this.rotations.pop();

		
		this.positions.unshift(this.x, this.y, this.z);
		// this.rotations.unshift(Math.cos(counter*.1)*this.width, Math.sin(counter*.25)*this.width, 0);
		this.rotations.unshift(this.width, this.width, 0);
		
		for (var i=0; i<this.length; i++)
		{
			var v1				= this.geom.vertices[i*2];
			var v2				= this.geom.vertices[i*2+1];
			
			v1.x		= this.positions[i*3]   + this.rotations[i*3];
			v1.y		= this.positions[i*3+1] + this.rotations[i*3+1];
			v1.z		= this.positions[i*3+2] + this.rotations[i*3+2];
			v2.x		= this.positions[i*3]   - this.rotations[i*3];
			v2.y		= this.positions[i*3+1] - this.rotations[i*3+1];
			v2.z		= this.positions[i*3+2] - this.rotations[i*3+2];

		}
		
		this.geom.computeFaceNormals();
		this.geom.computeVertexNormals();
		this.geom.verticesNeedUpdate	= true;
		this.geom.normalsNeedUpdate 	= true;
	}
}

function randomRange(min, max)
{
	return min + Math.random()*(max-min);
}

var draw = function() {

	for (var i=0; i<ribbons.length; i++)
	{
		px			= targets[i*3];
		py			= targets[i*3+1];
		pz			= targets[i*3+2];
		
		var ribbon	= ribbons[i];
		ribbon.update(px, py, pz);
		
		if (counter%30 == 0)	getNextRandomPosition();
	}

	theta += 1;
	
	counter++;

}

module.exports = {
	draw: draw
}