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
var mask = require('./mask');
var crystals = require('./crystals');
var lines = require('./lines');
var ribbons = require('./ribbons');
var clock = require('./clock');
var sequencer = require('./sequencer');
var performanceTest = require('./performanceTest');

var lastLoop = new Date;


var stats;
var start, timePassed;

function init() {

	threeEnv.renderer.setSize( window.innerWidth, window.innerHeight );
	start = Date.now();

	stats = new Stats();
	stats.showPanel( 0 );
	document.body.appendChild( stats.dom );

	loop();
}

function loop() {

	var thisLoop = new Date;
    var fps = 1000 / (thisLoop - lastLoop);
    lastLoop = thisLoop;
   

	stats.begin();

	TWEEN.update();

	timePassed = Date.now() - start;

	 performanceTest.check(timePassed, fps);

	audioAnalyser.updateLevels();

	clock.run();
	sequencer.run();

	lights.draw(timePassed);
	background.draw(timePassed);
	leaves.draw(timePassed);
	mask.draw(timePassed);
	crystals.draw(timePassed);
	ribbons.draw(timePassed);
	lines.draw(timePassed);
	vLight.draw(timePassed);
	camera.draw(timePassed);

	composers.draw(timePassed);
	
	stats.end();

  	requestAnimationFrame( loop );
    
}

init();