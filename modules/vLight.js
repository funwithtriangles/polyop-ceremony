var THREE = require('three');
var TWEEN = require('tween.js');
var threeEnv = require('./threeEnv');
var clock = require('./clock');
var gui = require('./gui').addFolder('vLight');

var pulsing = false;

var params = {
	exposure: 0,
	fDensity: 1,
	fWeight: 0.3,
	fClamp: 1,
	iSampleLimit: 20,
	startPulsing: function() {

		pulsing = true;

	},
	stopPulsing: function() {
		pulsing = false;

		var tween = new TWEEN.Tween(params)
		    .to({exposure: 1}, 500)
		    .easing(TWEEN.Easing.Quadratic.In)
		    .start();
	},
	fadeIn: function(skip) {

		if (!skip) {
			
			var tween = new TWEEN.Tween(params)
		    .to({exposure: 1}, 30000)
		    .easing(TWEEN.Easing.Quadratic.In)
		    .start();

		} else {

			params.exposure = 1;

		}
		

	},
	fadeOut: function() {

		var tween = new TWEEN.Tween(params)
		    .to({exposure: 0}, 5000)
		    .easing(TWEEN.Easing.Quadratic.In)
		    .start();

	}
}

var mesh = new THREE.Mesh(
    new THREE.IcosahedronGeometry(70, 3),
    new THREE.MeshBasicMaterial({
        color: 0xffffff
    })
);

gui.add(params, 'exposure', 0, 1);

gui.add(params, 'fDensity', 0, 1);
gui.add(params, 'fClamp', 0, 1);
gui.add(params, 'fWeight', 0, 1);
gui.add(params, 'iSampleLimit', 0, 20);
gui.add(params, 'fadeIn');

var draw = function() {

	if (pulsing) {
		params.fDensity = 1 - ((clock.lfo.sineBar + 1 ) * 0.3);
	}
	
}


// mesh.position.y = 150;

threeEnv.oclScene.add( mesh );

module.exports = {
	params: params,
	mesh: mesh,
	draw: draw
}