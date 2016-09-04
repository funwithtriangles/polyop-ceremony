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
	  side: THREE.BackSide,
	  transparent: true,
	  opacity: 1
	  // wireframe: true
	});
	
	this.mesh = new THREE.Mesh(geometry, material);

	this.mesh.visible = false;

	this.mesh.scale.set(scale, scale, scale);

	threeEnv.scene.add(this.mesh);


	this.enter = function() {
		that.mesh.visible = true;
	}

	this.exit = function() {
		that.mesh.visible = false;
	}

	this.exitFancy = function(skip) {

		if (!skip) {

			var tween = new TWEEN.Tween(material)
		    .to({opacity: 0}, 5000)
		    .start()
		    .onComplete(function() {
		    	that.mesh.visible = false;
		    });

		} else {

			that.mesh.visible = false;
	
		}
		
	}

}

module.exports = {
	nudibranch: new TextMesh(paths.nudibranch, 5, 200),
	polyop: new TextMesh(paths.polyop, 3, 500)
}


