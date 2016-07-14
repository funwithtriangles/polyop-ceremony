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


var params = {
	randomFlash: function() {
		mainMask.randomFlash();
	}
}

guiFolder.add(params, 'randomFlash');


var outerMaterial = new THREE.MeshPhongMaterial({
	transparent: true,
	opacity: 0.8,
	side: THREE.DoubleSide,
	color: 0x2F8582
});

var flashMaterial = new THREE.MeshBasicMaterial({
	transparent: true,
	opacity: 0,
	side: THREE.DoubleSide,
	color: 0xffffff,
	fog: false
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

	var that = this;

	var outerObjs = [];

	var groupMesh = mask.children[0];

	var mainMesh = mask.getObjectByName( 'head', true );

	// Give main head material
	mainMesh.material = coreMaterial;


	for (var i = 0; i < modelIds.outer.length; i++) {

		var mesh = mask.getObjectByName( modelIds.outer[i], true );

		// Give outer decorations materials
		mesh.material = outerMaterial;
		outerObjs.push(mesh);

		// Give each outer decoration a "flash" clone
		var flash = mesh.clone();

		mesh.add(flash);

		flash.rotation.x = 0;
		flash.rotation.y = 0;
		flash.rotation.z = 0;
		flash.position.z = 0.1;
		flash.material = flashMaterial.clone();

	}

	groupMesh.position.z = 400;

	this.mesh = mainMesh;

	this.flashOuter = function(index) {

		console.log(index);

		console.log(outerObjs[index]);

		outerObjs[index].children[0].material.opacity = 1;

	}

	this.randomFlash = function() {
		that.flashOuter(parseInt(Math.random() * outerObjs.length));
	}

}


var draw = function() {

	if (mainMask) {

		mainMask.mesh.visible = false;

		cubeCamera.position.copy( mainMask.mesh.position );

		cubeCamera.updateCubeMap( threeEnv.renderer, threeEnv.scene );

		mainMask.mesh.visible = true;

	}
	
}

module.exports = {
	draw: draw
}



