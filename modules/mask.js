var THREE = require('three');
var TWEEN = require('tween.js');
var threeEnv = require('./threeEnv');

var gui = require('./gui');
var guiFolder = gui.addFolder('Mask');

var loader = new THREE.XHRLoader();
loader.setResponseType( 'json' );

loader.load('mask.json', function (data) {

	var loader = new THREE.ObjectLoader();

	threeEnv.scene.add(loader.parse(data));
	// var material = new THREE.MultiMaterial( materials );
	// var object = new THREE.Mesh( geometry, material );

	// model.position.z = 300;

	// threeEnv.scene.add(object);
});

