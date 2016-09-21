var THREE = require('three');
var TWEEN = require('tween.js');
var threeEnv = require('./threeEnv');
var paths = require('../assets/text_paths.json');

// our utility functions
var createGeometry = require('three-simplicial-complex')(THREE);
var svgMesh3d = require('svg-mesh-3d');

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

	this.group1 = new THREE.Object3D();

	
	this.mesh1 = new THREE.Mesh(geometry, material);
	this.mesh1.visible = false;

	//this.group.visible = false;

	this.mesh1.scale.set(scale, scale, scale);

	// Behind
	this.mesh2 = this.mesh1.clone();
	this.mesh2.rotation.y = Math.PI;
	this.mesh2.position.z = 1000;

	// Left
	this.mesh3 = this.mesh1.clone();
	this.mesh3.position.x = -500;
	this.mesh3.rotation.y = Math.PI/2;
	this.mesh3.position.z = 500;

	// Right
	this.mesh4 = this.mesh1.clone();
	this.mesh4.position.x = 500;
	this.mesh4.rotation.y = -Math.PI/2;
	this.mesh4.position.z = 500;


	this.group1.add(this.mesh1);
	this.group1.add(this.mesh2);
	this.group1.add(this.mesh3);
	this.group1.add(this.mesh4);

	this.group2 = this.group1.clone();
	this.group3 = this.group1.clone();

	this.group2.position.y = 500;
	this.group3.position.y = -500;

	this.megaGroup.add(this.group1);
	this.megaGroup.add(this.group2);
	this.megaGroup.add(this.group3);
	

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
	polyop: new TextMesh(paths.polyop, 3, 500)
}


