var THREE = require('three');
var threeEnv = require('./threeEnv');
var gui = require('./gui').addFolder('Lights');


var params = {
	randomPositions: function() {
		randomPositions();
	}
}

gui.add(params, 'randomPositions');

var ambientLight = new THREE.AmbientLight( 0xffffff, 0.2 );

var lights = [];

lights[ 0 ] = new THREE.PointLight( 0xffffff, 1, 0 );
lights[ 1 ] = new THREE.PointLight( 0xffffff, 1, 0 );
lights[ 2 ] = new THREE.PointLight( 0xffffff, 1, 0 );

lights[ 0 ].position.set( 0, 20, 0 );
lights[ 1 ].position.set( 20, 20, 20 );
lights[ 2 ].position.set( - 20, - 20, - 20 );

threeEnv.scene.add( lights[ 0 ] );
threeEnv.scene.add( lights[ 1 ] );
threeEnv.scene.add( lights[ 2 ] );

threeEnv.scene.add( ambientLight );

var randomPositions = function() {

	console.log('l');

	lights[ 0 ].position.set( (Math.random() * 500) - 250, (Math.random() * 500) - 250, (Math.random() * 500) - 250 );
	lights[ 1 ].position.set( (Math.random() * 500) - 250, (Math.random() * 500) - 250, (Math.random() * 500) - 250 );
	lights[ 2 ].position.set( (Math.random() * 500) - 250, (Math.random() * 500) - 250, (Math.random() * 500) - 250 );

}