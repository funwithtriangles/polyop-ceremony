var THREE = require('three');
var TWEEN = require('tween.js');
var threeEnv = require('./threeEnv');
var clock = require('./clock');

var gui = require('./gui').addFolder('Mask');


var shaders = {
	explode: require('../shaders/explode.glsl'),
	simple: require('../shaders/simple_fragment.glsl'),
	phong: require('../shaders/phong_fragment.glsl')
}

var maskModel = require('../assets/mask.json');

var loader = new THREE.ObjectLoader();

var mainMask;

var maskYOffset = -100;

var explodeModifier = new THREE.ExplodeModifier();

var tessellateModifier = new THREE.TessellateModifier( 8 );


var cubeCamera = new THREE.CubeCamera( 1, 10000, 512 );

threeEnv.scene.add(cubeCamera);

var params = {
	zGroupPos: -800,
	//zGroupPos: 0,
	xRotSpeed: 0,
	yRotSpeed: 0,
	zRotSpeed: 0,
	xRot: 0,
	yRot: 0,
	zRot: 0,
	dancing: false,
	dancePower: 1,
	rumble: 0,
	explodeAmount: 0,
	explodeSpeed: 0,
	rumbling: false,
	enterScene: function(skip) {

		if (!skip) {

			var tween = new TWEEN.Tween(params)
		    .to({zGroupPos: 100}, 25000)
		    .easing(TWEEN.Easing.Sinusoidal.Out)
		    .start();

		} else {

			params.zGroupPos = 100;

		}

	},
	spin: function() {

		params.yRot = 0;
		var tween = new TWEEN.Tween(params)
	    .to({yRot: Math.PI*2}, 500)
	    .easing(TWEEN.Easing.Quadratic.Out)
	    .start();
	    
	},
	startRumble: function(skip) {

		if (!skip) {

			var tween = new TWEEN.Tween(params)
		    .to({rumble: 1, explodeAmount: 15}, 30000)
		    .easing(TWEEN.Easing.Quadratic.In)
		    .start();

		} else {

			params.rumble = 1;
			params.explodeAmount = 15;

		}
		
	},
	explode: function(skip) {

		params.rumble = 0;
		params.dancing = false;

		if (!skip) {

			params.yRotSpeed = 0.2;
			params.xRotSpeed = 0.004;
			params.zRotSpeed = 0.004;

			// This will result in explodeAmount = 766
			var tween = new TWEEN.Tween(params)
		    .to({explodeAmount: 800}, 1000)
		    .easing(TWEEN.Easing.Exponential.Out)
		    .start();

		    var tween = new TWEEN.Tween(params)
		    .to({yRotSpeed: 0.004}, 1500)
		    .easing(TWEEN.Easing.Exponential.Out)
		    .start();

		} else {

			params.explodeAmount = 800;
			params.yRotSpeed = 0.004;
		}
		

	},
	explodePulse: function() {

		params.explodeAmount = 800;

		var tween = new TWEEN.Tween(params)
		    .to({explodeAmount: 760}, 100)
		    .easing(TWEEN.Easing.Sinusoidal.InOut)
		    .repeat(1)
		    .yoyo(true)
		    .start();
	},
	spinPulse: function() {

		params.yRotSpeed = 0.1;
		params.xRotSpeed = 0.1;
		params.zRotSpeed = 0.1;

		var tween = new TWEEN.Tween(params)
	    .to({yRotSpeed: 0.004, xRotSpeed: 0.004, zRotSpeed: 0.004}, 200)
	    .easing(TWEEN.Easing.Quadratic.Out)
	    .start();

	},
	implode: function(skip) {

		params.yRotSpeed = 0;
		params.xRotSpeed = 0;
		params.zRotSpeed = 0;

		if (!skip) {

			var tweenRot = new TWEEN.Tween(params)
		    .to({xRot: 0, yRot: 0, zRot: 0}, 1000)
		    .easing(TWEEN.Easing.Quadratic.InOut);

			var tweenImp = new TWEEN.Tween(params)
		    .to({explodeAmount: 0}, 500)
		    .easing(TWEEN.Easing.Elastic.Out);

		    tweenRot.start();
		    tweenImp.delay(800);
		    tweenImp.start();

		    

		} else {

			params.xRot = 0;
			params.yRot = 0;
			params.zRot = 0;
			params.explodeAmount = 0;

		}

	},
	startDancing: function(skip, power) {

		params.dancing = true;
		params.dancePower = power;

	},
	defaultPos: function() {
		params.zGroupPos = 0;
	},
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

gui.add(params, 'zGroupPos', -800, 800);
gui.add(params, 'enterScene');
gui.add(params, 'randomEdgeFlash');
gui.add(params, 'sweep');
gui.add(params, 'dancing');
gui.add(params, 'dancePower', 1, 20);
gui.add(params, 'explode');
gui.add(params, 'explodePulse');
gui.add(params, 'spinPulse');
gui.add(params, 'implode');
gui.add(params, 'spin');
gui.add(params, 'startRumble');
gui.add(params, 'explodeAmount', 0, 1500);
gui.add(params, 'rumble', 0, 3);



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


uniforms.diffuse.value = new THREE.Color( 0x555555 );
uniforms.specular.value = new THREE.Color( 0x111111 );
uniforms.shininess.value = 50;
uniforms.envMap.value = cubeCamera.renderTarget.texture;
uniforms.explodeAmount = {type: "f", value: 0.0};
uniforms.rumble = {type: "f", value: 0.0};
uniforms.time = {type: "f", value: 0.0};
uniforms.flipEnvMap.value = 1;



var coreMaterial = new THREE.ShaderMaterial( {

	uniforms: uniforms,
	lights: true,
	fog: true,
	shading: THREE.FlatShading,
	side: THREE.DoubleSide,
	vertexShader:   shaders.explode,
	fragmentShader: shaders.phong

});


// var coreMaterial = new THREE.MeshLambertMaterial( { 
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

var makeExplodable = function(geometry) {

	explodeModifier.modify( geometry );

	for ( var i = 0; i < 3; i ++ ) {

		tessellateModifier.modify( geometry );

	}

	var numFaces = geometry.faces.length;
	var displacement = new Float32Array( numFaces * 3 * 3 );

	geometry = new THREE.BufferGeometry().fromGeometry( geometry );

	for ( var f = 0; f < numFaces; f ++ ) {

		var index = 9 * f;

		var d = Math.random();

		for ( var i = 0; i < 3; i ++ ) {

			displacement[ index + ( 3 * i )     ] = d;
			displacement[ index + ( 3 * i ) + 1 ] = d;
			displacement[ index + ( 3 * i ) + 2 ] = d;

		}


	}

	geometry.addAttribute( 'displacement', new THREE.BufferAttribute( displacement, 3 ) );

	return geometry;
}


var Mask = function(mask) {

	var that = this;


	that.group = new THREE.Object3D();
	that.oclGroup = new THREE.Object3D();
	that.mask = mask;

	that.oclMask = new THREE.Object3D();

	var outerObjs = [];

	mask.position.y = maskYOffset;
	that.oclMask.position.y = maskYOffset;

	that.headTop = mask.getObjectByName( 'head_top' );
	that.headBottom = mask.getObjectByName( 'head_bottom' );

	that.headTop.geometry = makeExplodable(that.headTop.geometry);
	that.headBottom.geometry = makeExplodable(that.headBottom.geometry);


	// Give main head material
	that.headTop.material = coreMaterial;
	that.headBottom.material = coreMaterial;

	that.oclHeadTop = that.headTop.clone();
	that.oclHeadTop.material = oclMaterial;

	that.oclHeadBottom = that.headBottom.clone();
	that.oclHeadBottom.material = oclMaterial;

	that.oclMask.add(that.oclHeadTop);
	that.oclMask.add(that.oclHeadBottom);


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

	that.group.add(mask);
	that.oclGroup.add(that.oclMask);
	threeEnv.scene.add(that.group);
	threeEnv.oclScene.add(that.oclGroup);

}


var draw = function(time) {


	var wave = clock.lfo.sine; 
	var waveHalf = clock.lfo.sineHalf;

	if (params.dancing) {
		var xMaskPos = 2.5 * wave * params.dancePower;
		var yMaskPos = (1.5 * waveHalf) * params.dancePower + maskYOffset;
		var zMaskPos =  waveHalf * params.dancePower;
	} else {
		var xMaskPos = 0;
		var yMaskPos = maskYOffset;
		var zMaskPos = 0;
	}
	

	if (mainMask) {

		var mask = mainMask.mask;
		var oclMask = mainMask.oclMask;
		var maskGroup = mainMask.group;
		var oclMaskGroup = mainMask.oclGroup;

		// mainMask.headTop.rotation.y += 0.01;

		uniforms.time.value = time;

		params.explodeAmount += params.explodeSpeed;

		uniforms.explodeAmount.value = params.explodeAmount;
		uniforms.rumble.value = params.rumble;

		var time = time * 0.001;

		maskGroup.position.z = params.zGroupPos;
		oclMaskGroup.position.z = params.zGroupPos;

		params.xRot += params.xRotSpeed;
		params.yRot += params.yRotSpeed;
		params.zRot += params.zRotSpeed;

		mask.position.x = xMaskPos;
		oclMask.position.x = xMaskPos;

		mask.position.y = yMaskPos;
		oclMask.position.y = yMaskPos;

		mask.position.z = zMaskPos;
		oclMask.position.z = zMaskPos;

		mask.rotation.x = params.xRot;
		oclMask.rotation.x = params.xRot;

		mask.rotation.y = params.yRot;
		oclMask.rotation.y = params.yRot;

		mask.rotation.z = params.zRot;
		oclMask.rotation.z = params.zRot;

		

		if (params.rumbling) {
			//params.rumble += 0.001;
			// params.explodeAmount += 0.02;
		}


		cubeCamera.position.copy( mainMask.mask.position );
		cubeCamera.position.y += 150;

		cubeCamera.updateCubeMap( threeEnv.renderer, threeEnv.scene );

	


	}
	
}


mainMask = new Mask(loader.parse(maskModel))


module.exports = {
	draw: draw,
	mask: mainMask,
	params: params
}



