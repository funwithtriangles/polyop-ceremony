var THREE = require('three');
var Stats = require('stats.js');
var threeEnv = require('./threeEnv');
var lights = require('./lights');
var audioAnalyser = require('./audioAnalyser');
var background = require('./background');
var leaves = require('./leaves');

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

	timePassed = Date.now() - start;

	audioAnalyser.updateLevels();

	background.draw(timePassed);
	leaves.draw(timePassed);

	//threeEnv.renderer.clear();
	threeEnv.renderer.render( threeEnv.bgScene, threeEnv.bgCamera );
	threeEnv.renderer.clearDepth();
	threeEnv.renderer.render( threeEnv.scene, threeEnv.camera );

	stats.end();

  	requestAnimationFrame( loop );
    
}

init();