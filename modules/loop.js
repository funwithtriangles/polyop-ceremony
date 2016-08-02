var THREE = require('three');

// These will get added to the THREE namespace
require('../threeExtras/CopyShader');
require('../threeExtras/EffectComposer');
require('../threeExtras/ShaderPass');
require('../threeExtras/RenderPass');


var TWEEN = require('tween.js');
var Stats = require('stats.js');
var threeEnv = require('./threeEnv');
var composers = require('./composers');
var lights = require('./lights');
var audioAnalyser = require('./audioAnalyser');
var background = require('./background');
var leaves = require('./leaves');
var mask = require('./mask');
var ribbons = require('./ribbons');
var sequencer = require('./sequencer');

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

	stats.begin();

	TWEEN.update();

	timePassed = Date.now() - start;

	audioAnalyser.updateLevels();

	sequencer.run();

	lights.draw(timePassed);
	background.draw(timePassed);
	leaves.draw(timePassed);
	mask.draw(timePassed);
	ribbons.draw(timePassed);

	// Auto clear must be on for the cubemap to render (mask reflections)
//	threeEnv.renderer.render( threeEnv.bgScene, threeEnv.bgCamera );

	// Turn autoclear back off again before rendering top layer
	// threeEnv.renderer.autoClear = false;

	composers.draw();

//	threeEnv.renderer.clearDepth();
	
	stats.end();

  	requestAnimationFrame( loop );
    
}

init();