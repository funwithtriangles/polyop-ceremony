var THREE = require('three');
var TWEEN = require('tween.js');
var threeEnv = require('./threeEnv');

var gui = require('./gui');
var guiFolder = gui.addFolder('Mask');

var loader = new THREE.XHRLoader();
loader.setResponseType( 'json' );

var shaders = {
	explode: require('../shaders/explode.glsl'),
	simple: require('../shaders/simple_fragment.glsl'),
	phong: require('../shaders/phong_fragment.glsl')
}

var explodeModifier = new THREE.ExplodeModifier();

var tessellateModifier = new THREE.TessellateModifier( 8 );

var mainMask, oclMask;

var light;

var cubeCamera = new THREE.CubeCamera( 1, 1000, 1024 );

threeEnv.scene.add(cubeCamera);

var params = {
	zPos: 0,
	sweep: function() {
		mainMask.sweepFlash(modelIds.paintLeft, 'flash', true);
		mainMask.sweepFlash(modelIds.paintRight, 'flash', true);
	},
	randomFlash: function() {
		mainMask.randomFlash('flash');
	},
	randomEdgeFlash: function() {
		mainMask.randomFlash('edges');
	}
}

guiFolder.add(params, 'zPos').min(-800).max(800);
guiFolder.add(params, 'randomFlash');
guiFolder.add(params, 'randomEdgeFlash');
guiFolder.add(params, 'sweep');



var outerMaterial = new THREE.MeshPhongMaterial({
	transparent: true,
	opacity: 0.0,
	shininess: 50,
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


var shader = THREE.ShaderLib[ "phong" ];

var uniforms = THREE.UniformsUtils.clone( shader.uniforms );

console.log(uniforms);

uniforms.diffuse.value = new THREE.Color( 0x555555 );
uniforms.specular.value = new THREE.Color( 0x111111 );
uniforms.shininess.value = 50;
uniforms.envMap.value = cubeCamera.renderTarget.texture;
uniforms.explodeAmount = {type: "f", value: 0.0};
uniforms.time = {type: "f", value: 0.0};

guiFolder.add(uniforms.explodeAmount, 'value').min(0.0).max(10.0).name("explodeAmount");

var coreMaterial = new THREE.ShaderMaterial( {

	uniforms: uniforms,
	lights: true,
	fog: true,
	shading: THREE.FlatShading,
	side: THREE.DoubleSide,
	vertexShader:   shaders.explode,
	fragmentShader: shaders.phong

});


// var coreMaterial = new THREE.MeshPhongMaterial( { 
// 	color: 0x555555, 
// 	specular: 0x111111,
// 	shininess: 50,
// 	shading: THREE.FlatShading,
// 	envMap: cubeCamera.renderTarget.texture,
// 	//combine: THREE.AddOperation
// } );

var oclMaterial = new THREE.ShaderMaterial( {

	uniforms:     uniforms,
	// color: 0x555555,
//	lights: true,
	vertexShader:   shaders.explode,
	fragmentShader: shaders.phong

});


//var oclMaterial = new THREE.MeshLambertMaterial( { color: 0x000000, fog: false } );


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
	],
	paintLeft: [
		'paint_1',
		'paint_2',
		'paint_3'
	],
	paintRight: [
		'paint_4',
		'paint_5',
		'paint_6'
	]
}

loader.load('mask.json', function (data) {

	var loader = new THREE.ObjectLoader();

	var mask = loader.parse(data)

	mainMask = new Mask(mask)

});


var Mask = function(mask) {

	var that = this;

	

	oclMask = new THREE.Object3D();

	var outerObjs = [];

	mask.position.y = -100;
	oclMask.position.y = -100;

	var headTop = mask.getObjectByName( 'head_top' );
	var headBottom = mask.getObjectByName( 'head_bottom' );

	explodeModifier.modify( headTop.geometry );

	for ( var i = 0; i < 3; i ++ ) {

		tessellateModifier.modify( headTop.geometry );

	}

	var numFaces = headTop.geometry.faces.length;
	var displacement = new Float32Array( numFaces * 3 * 3 );

	headTop.geometry = new THREE.BufferGeometry().fromGeometry( headTop.geometry );

	for ( var f = 0; f < numFaces; f ++ ) {

		var index = 9 * f;

		var d = Math.random();

		for ( var i = 0; i < 3; i ++ ) {

			displacement[ index + ( 3 * i )     ] = d;
			displacement[ index + ( 3 * i ) + 1 ] = d;
			displacement[ index + ( 3 * i ) + 2 ] = d;

		}


	}

	console.log(displacement);
	headTop.geometry.addAttribute( 'displacement', new THREE.BufferAttribute( displacement, 3 ) );


	// Give main head material
	headTop.material = coreMaterial;
	headBottom.material = coreMaterial;

	var oclHeadTop = headTop.clone();
	oclHeadTop.material = oclMaterial;

	var oclHeadBottom = headBottom.clone();
	oclHeadBottom.material = oclMaterial;

	oclMask.add(oclHeadTop);
	oclMask.add(oclHeadBottom);


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

	}


	var sphere = new THREE.SphereGeometry( 0.5, 16, 8 );

	light = new THREE.PointLight( 0xffffff, 1, 0 );

	light.position.set(20,40,50);

	mask.add(light);

	light.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xff0040 } ) ) );

	this.flashOuter = function(name, type) {

		if (!type) {
			type = 'flash';
		}

		var mesh = mask.getObjectByName( name );

		var material = mesh.getObjectByName( type ).material;

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

	this.randomFlash = function(type) {
		that.flashOuter(modelIds.outer[parseInt(Math.random() * modelIds.outer.length)], type);
	}

	this.sweepFlash = function(array, type, reverse) {

		if (reverse) {
			var array = array.slice().reverse();
		}

		function timedFlash(i) {

			setTimeout(function() {

				that.flashOuter(array[i], type);

			}, 50 * i);

		}

		for (var i = 0; i < array.length; i++) {

			timedFlash(i);

		}


	}

	threeEnv.scene.add(mask);
	threeEnv.oclScene.add(oclMask);

	return mask;
}


var draw = function(time) {

	if (mainMask) {


		uniforms.time.value = time;

		var time = time * 0.001;

	//	mainMask.mesh.visible = false;

		mainMask.position.z = params.zPos;
		oclMask.position.z = params.zPos;

		light.position.x = Math.sin( time * 0.7 ) * 150;
		light.position.y = Math.cos( time * 0.5 ) * 150;
		light.position.z = Math.cos( time * 0.3 ) * 150;

		cubeCamera.position.copy( mainMask.position );

		cubeCamera.updateCubeMap( threeEnv.renderer, threeEnv.scene );



	//	mainMask.mesh.visible = true;

	}
	
}

module.exports = {
	draw: draw
}



