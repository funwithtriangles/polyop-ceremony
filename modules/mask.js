var THREE = require('three');
var TWEEN = require('tween.js');
var threeEnv = require('./threeEnv');

var gui = require('./gui');
var guiFolder = gui.addFolder('Mask');

var loader = new THREE.XHRLoader();
loader.setResponseType( 'json' );

var mainMask;

var cubeCamera = new THREE.CubeCamera( 1, 1000, 1024 );

threeEnv.scene.add(cubeCamera);

var outerMaterial = new THREE.MeshPhongMaterial({
	transparent: true,
	opacity: 0.8,
	side: THREE.DoubleSide,
	color: 0x2F8582
});

var coreMaterial = new THREE.MeshPhongMaterial( { 
	color: 0x111111,
	shininess: 100,
	envMap: cubeCamera.renderTarget.texture,
	combine: THREE.AddOperation
} );

var modelIds = {
	outer: [
		'feather_1',
		'feather_2',
		'feather_3',
		'feather_4',
		'feather_5',
		'feather_6',
		'paint_1',
		'paint_2',
		'paint_3',
		'paint_4',
		'paint_5',
		'paint_6',
		'nose'
	]
}

loader.load('mask.json', function (data) {

	var loader = new THREE.ObjectLoader();

	var mask = loader.parse(data)

	threeEnv.scene.add(mask);

	mainMask = new Mask(mask)

});


var Mask = function(mask) {

	var outerObjs = [];

	var mesh;
	var mainMesh = mask.getObjectByName( 'head', true );

	mainMesh.material = coreMaterial;

	for (var i = 0; i < modelIds.outer.length; i++) {

		mesh = mask.getObjectByName( modelIds.outer[i], true );

		mesh.material = outerMaterial;
		outerObjs.push(mesh);

	}

	return mainMesh;

}


var draw = function() {

	if (mainMask) {

		mainMask.visible = false;



		cubeCamera.position.copy( mainMask.position );

		cubeCamera.updateCubeMap( threeEnv.renderer, threeEnv.scene );

		mainMask.visible = true;

	}
	
}

module.exports = {
	draw: draw
}



