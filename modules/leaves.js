var THREE = require('three');
var threeEnv = require('./threeEnv');

var loader = new THREE.JSONLoader();

loader.load('leaf.js', function ( geometry ) {

		console.log(geometry);
		var material = new THREE.MeshNormalMaterial({side: THREE.DoubleSide});
		var object = new THREE.Mesh( geometry, material );
		threeEnv.scene.add( object );

		object.position.z = 100;

		console.log(object);
	}
);