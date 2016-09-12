var THREE = require("three");
var TWEEN = require('tween.js');
var gui = require('./gui');
var guiFolder = gui.addFolder('Env');

var renderer, scene, camera, controls, axes;
var box = {
	width: window.innerWidth,
	height: window.innerHeight,
	area: window.innerWidth * window.innerHeight * window.devicePixelRatio
}

var bgColor = new THREE.Color("hsl(223,39%,50%)");
var bgHSL = bgColor.getHSL();

var params = {
	bgColor: bgColor,
	bgBrightness: 1,
	fadeToBlack: function() {
		var tween = new TWEEN.Tween(params)
	    .to({bgBrightness: 0}, 20000)
	    .easing(TWEEN.Easing.Quadratic.In)
	    .start();
	},
	fadeBack: function() {
		var tween = new TWEEN.Tween(params)
	    .to({bgBrightness: 1}, 1000)
	    .easing(TWEEN.Easing.Quadratic.Out)
	    .start();
	}
}

guiFolder.add(params, 'bgBrightness', 0, 1);
guiFolder.add(params, 'fadeToBlack', 0, 1);

renderer = new THREE.WebGLRenderer({
	preserveDrawingBuffer: true,
	// alpha: true,
	premultipliedAlpha: true
});



// renderer.autoClear = false;

document.body.appendChild( renderer.domElement );

scene = new THREE.Scene();
bgScene = new THREE.Scene();
oclScene = new THREE.Scene();

scene.fog = new THREE.FogExp2( bgColor, 0.0015 );

camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );


bgCamera = new THREE.OrthographicCamera(box.width / - 2, box.width / 2, box.height / 2, box.height / - 2, 1, 1000 );
bgCamera.position.z = 500;

scene.add(camera);
bgScene.add(bgCamera);

var run = function() {

	var l = bgHSL.l * params.bgBrightness;

	params.bgColor.setHSL(bgHSL.h, bgHSL.s, l);

}

// controls = new OrbitControls(camera);

// var axes = new THREE.AxisHelper(50);

// scene.add(axes);

module.exports = {
	renderer: renderer,
	scene: scene,
	bgScene: bgScene,
	oclScene: oclScene,
	camera: camera,
	bgCamera: bgCamera,
	box: box,
	params: params,
	run: run
}