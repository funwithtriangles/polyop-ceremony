var THREE = require('three');
var TWEEN = require('tween.js');
var threeEnv = require('./threeEnv');
var gui = require('./gui').addFolder('vLight');

var params = {
	exposure: 0,
	fDensity: 1,
	fWeight: 0.3,
	fClamp: 1,
	pulse: function() {

		params.exposure = 0.4;

		var tween = new TWEEN.Tween(params)
	    .to({exposure: 1}, 800)
	    .easing(TWEEN.Easing.Quadratic.Out)
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
gui.add(params, 'fadeIn');




// mesh.position.y = 150;

threeEnv.oclScene.add( mesh );

module.exports = {
	params: params,
	mesh: mesh
}