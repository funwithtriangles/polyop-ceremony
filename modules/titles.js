var THREE = require('three');
var TWEEN = require('tween.js');
var threeEnv = require('./threeEnv');
var paths = require('../assets/text_paths.json');

// our utility functions
var createGeometry = require('three-simplicial-complex')(THREE);
var svgMesh3d = require('svg-mesh-3d');

var tileSize = 500;
var tileSpace = 50;

var numTiles = 10;

var TextMesh = function(pathString, detail, scale) {

	var that = this;

	var meshData = svgMesh3d(pathString, {
		scale: detail
	});

	// convert the mesh data to THREE.Geometry
	var geometry = createGeometry(meshData);

	// wrap it in a mesh and material
	var material = new THREE.MeshBasicMaterial({
	  side: THREE.DoubleSide,
	  transparent: true,
	  opacity: 1
	  // wireframe: true
	});

	this.megaGroup = new THREE.Object3D();

	this.group = new THREE.Object3D();

	this.meshFront = new THREE.Mesh(geometry, material);
	this.meshFront.visible = false;

	this.meshFront.scale.set(scale, scale, scale);

	// Behind
	this.meshBack = this.meshFront.clone();
	this.meshBack.rotation.y = Math.PI;
	this.meshBack.position.z = (tileSize+tileSpace)*2;

	// Left
	this.meshLeft = this.meshFront.clone();
	this.meshLeft.position.x = -(tileSize+tileSpace);
	this.meshLeft.rotation.y = Math.PI/2;
	this.meshLeft.position.z = (tileSize+tileSpace);

	// Right
	this.meshRight = this.meshFront.clone();
	this.meshRight.position.x = (tileSize+tileSpace);
	this.meshRight.rotation.y = -Math.PI/2;
	this.meshRight.position.z = (tileSize+tileSpace);

	this.group.add(this.meshFront);
	this.group.add(this.meshBack);
	this.group.add(this.meshLeft);
	this.group.add(this.meshRight);

	this.megaGroup.add(this.group);

	for (var i = 0; i < numTiles/2; i++) {

		var groupTop = this.group.clone();
		var groupBottom = this.group.clone();

		groupTop.position.y = (tileSize+tileSpace) * i;
		groupBottom.position.y = -(tileSize+tileSpace) * i;

		this.megaGroup.add(groupTop);
		this.megaGroup.add(groupBottom);
	}

	threeEnv.scene.add(this.megaGroup);

	this.enter = function() {
		that.megaGroup.traverse( function ( object ) { object.visible = true; } );
	}

	this.exit = function() {
		that.megaGroup.traverse( function ( object ) { object.visible = false; } );
	}

	this.exitFancy = function(skip) {

		if (!skip) {

			var tween = new TWEEN.Tween(material)
		    .to({opacity: 0}, 5000)
		    .start()
		    .onComplete(function() {
		    	that.megaGroup.visible = false;
		    });

		} else {

			that.megaGroup.visible = false;
	
		}
		
	}

}

module.exports = {
	nudibranch: new TextMesh(paths.nudibranch, 5, 200),
	polyop: new TextMesh(paths.polyop, 3, tileSize)
}


