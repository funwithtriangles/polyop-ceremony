var THREE = require('three');
var TWEEN = require('tween.js');
var Stats = require('stats.js');
var threeEnv = require('./threeEnv');
var lights = require('./lights');
var audioAnalyser = require('./audioAnalyser');
var background = require('./background');
var leaves = require('./leaves');
var mask = require('./mask');

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

	background.draw(timePassed);
	leaves.draw(timePassed);

	// Auto clear must be on for the cubemap to render (mask reflections)
	threeEnv.renderer.autoClear = true;

	mask.draw(timePassed);
	threeEnv.renderer.render( threeEnv.bgScene, threeEnv.bgCamera );

	// Turn autoclear back off again before rendering top layer
	threeEnv.renderer.autoClear = false;

	threeEnv.renderer.clearDepth();
	threeEnv.renderer.render( threeEnv.scene, threeEnv.camera );

	stats.end();

  	requestAnimationFrame( loop );
    
}

init();