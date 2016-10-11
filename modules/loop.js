require('webvr-polyfill');

var THREE = require('three');

// These will get added to the THREE namespace
require('../threeExtras/CopyShader');
require('../threeExtras/EffectComposer');
require('../threeExtras/ShaderPass');
require('../threeExtras/RenderPass');
require('../threeExtras/FilmShader');
require('../threeExtras/RGBShiftShader');
require('../threeExtras/ExplodeModifier');
require('../threeExtras/TessellateModifier');
require('../threeExtras/DeviceOrientationControls');
require('../threeExtras/VRControls');
require('../threeExtras/VREffect');
require('../threeExtras/PointerLockControls');


var TWEEN = require('tween.js');
var Stats = require('stats.js');
var threeEnv = require('./threeEnv');
var composers = require('./composers');
var lights = require('./lights');
var vLight = require('./vLight');
var camera = require('./camera');
var audioAnalyser = require('./audioAnalyser');
var background = require('./background');
var leaves = require('./leaves');
var tribe = require('./tribe');
var mask = require('./mask');
var crystals = require('./crystals');
var lines = require('./lines');
var ribbons = require('./ribbons');
var controls = require('./controls');
var clock = require('./clock');
var sequencer = require('./sequencer');
var performanceTest = require('./performanceTest');
var analytics = require('./analytics');

var lastLoop = new Date;


var stats;
var start, timePassed;

function init() {

	threeEnv.renderer.setSize( window.innerWidth, window.innerHeight );
	start = Date.now();

	// stats = new Stats();
	// stats.showPanel( 0 );
	// document.body.appendChild( stats.dom );

	loop();
}

function loop() {

	var thisLoop = new Date;
    var fps = 1000 / (thisLoop - lastLoop);
    lastLoop = thisLoop;
   

	// stats.begin();

	if (controls.params.isPlaying) {

		clock.run();
		TWEEN.update();
		audioAnalyser.updateLevels();
		sequencer.run();

	}
	

	timePassed = Date.now() - start;

	analytics.update(fps);
	performanceTest.check(timePassed, fps);



	
	
	controls.run(timePassed);
	threeEnv.run();

	lights.draw(timePassed);
	background.draw(timePassed);
	leaves.draw(timePassed);
	mask.draw(timePassed);
	tribe.draw(timePassed);
    crystals.draw(timePassed);
	ribbons.draw(timePassed);
	lines.draw(timePassed);
	vLight.draw(timePassed);
	camera.draw(timePassed);



	composers.draw(timePassed);
	
	// stats.end();

  	requestAnimationFrame( loop );
    
}

init();