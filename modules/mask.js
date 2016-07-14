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
		mainMask.randomFlash('flash');
	},
	randomEdgeFlash: function() {
		mainMask.randomFlash('edges');
	}
}


guiFolder.add(params, 'randomFlash');
guiFolder.add(params, 'randomEdgeFlash');



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

// var coreMaterial = new THREE.MeshPhongMaterial( { 
// 	color: 0x111111,
// 	shininess: 100,
// 	envMap: cubeCamera.renderTarget.texture,
// 	combine: THREE.AddOperation,
// 	side: THREE.DoubleSide
// } );


var coreMaterial = new THREE.MeshPhongMaterial( { 
	//side: THREE.DoubleSide,
	shininess: 50,
	color: 0xffffff
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

	groupMesh.position.y -= 10;

	var mainMesh = mask.getObjectByName( 'head' );

	// Give main head material
	mainMesh.material = coreMaterial;


	for (var i = 0; i < modelIds.outer.length; i++) {

		var mesh = mask.getObjectByName( modelIds.outer[i] );

		// Give outer decorations materials
		mesh.material = outerMaterial;


		// Give each outer decoration a "flash" clone
		var flash = mesh.clone();

		flash.name = "flash";

		mesh.add(flash);

		flash.rotation.x = 0;
		flash.rotation.y = 0;
		flash.rotation.z = 0;
		flash.position.z = 0.1;
		flash.material = flashMaterial.clone();

		var edges = new THREE.EdgesHelper( flash, 0xffffff, 55 );

		edges.matrix = flash.matrix;
		edges.matrixAutoUpdate = true;
		edges.position.z = 0.2;
		edges.name = "edges";
		mesh.add(edges);

		edges.material.lineWidth = 10;
		edges.material.transparent = true;
		edges.material.opacity = 0;


		outerObjs.push(mesh);

	}

	groupMesh.position.z = 400;

	this.mesh = mainMesh;

	this.flashOuter = function(index, name) {

		if (!name) {
			name = 'flash';
		}

		var material = outerObjs[index].getObjectByName( name ).material;

		var target = {
			opacity: 1
		}

		material.opacity = target.opacity;

		var tween = new TWEEN.Tween(target)
	    .to({opacity: 0}, 800)
	    .easing(TWEEN.Easing.Quintic.Out)
	    .start();

	    tween.onUpdate(function(){
		    material.opacity = target.opacity;
		});

	}

	this.randomFlash = function(name) {
		that.flashOuter(parseInt(Math.random() * outerObjs.length), name);

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



