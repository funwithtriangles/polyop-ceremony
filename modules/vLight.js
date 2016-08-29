var THREE = require('three');
var TWEEN = require('tween.js');
var threeEnv = require('./threeEnv');
var gui = require('./gui').addFolder('vLight');

var params = {
	exposure: 0,
	fadeIn: function() {

		var tween = new TWEEN.Tween(params)
	    .to({exposure: 1}, 30000)
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
gui.add(params, 'fadeIn');

// mesh.position.y = 150;

threeEnv.oclScene.add( mesh );

module.exports = {
	params: params,
	mesh: mesh
}