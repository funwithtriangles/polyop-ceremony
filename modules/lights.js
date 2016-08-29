var THREE = require('three');
var TWEEN = require('tween.js');
var threeEnv = require('./threeEnv');
var gui = require('./gui').addFolder('Lights');


var params = {
	randomPositions: function() {
		randomPositions();
	}
}

gui.add(params, 'randomPositions');

var ambientLight = new THREE.AmbientLight( 0xffffff, 0.5 );
var directionalLight = new THREE.DirectionalLight( 0x333333 );

directionalLight.position.set( 0, 0.5, -0.5 );


var lights = [];

lights[ 0 ] = new THREE.PointLight( 0xffffff, 1, 0 );
lights[ 1 ] = new THREE.PointLight( 0xffffff, 1, 0 );
lights[ 2 ] = new THREE.PointLight( 0xffffff, 1, 0 );

threeEnv.scene.add( lights[ 0 ] );
threeEnv.scene.add( lights[ 1 ] );
threeEnv.scene.add( lights[ 2 ] );

threeEnv.scene.add( ambientLight );
threeEnv.scene.add( directionalLight );

var randomPositions = function() {

	lights[ 0 ].position.set( (Math.random() * 500) - 250, (Math.random() * 500) - 250, (Math.random() * 500) - 250 );
	lights[ 1 ].position.set( (Math.random() * 500) - 250, (Math.random() * 500) - 250, (Math.random() * 500) - 250 );
	lights[ 2 ].position.set( (Math.random() * 500) - 250, (Math.random() * 500) - 250, (Math.random() * 500) - 250 );

}


var draw = function(timePassed) {

	//vLight.position.y = 250 * (Math.sin(timePassed / 1000)) + 250;

}

randomPositions();

module.exports = {
	draw: draw
}