var THREE = require('three');
var threeEnv = require('./threeEnv');
var lights = require('./lights');
var audioAnalyser = require('./audioAnalyser');
var background = require('./background');
var leaves = require('./leaves');


var start, timePassed;

function init() {

  threeEnv.renderer.setSize( window.innerWidth, window.innerHeight );
  start = Date.now();
  loop();
}

function loop() {

	timePassed = Date.now() - start;

	audioAnalyser.updateLevels();

	background.draw(timePassed);
	leaves.draw(timePassed);

	//threeEnv.renderer.clear();
	threeEnv.renderer.render( threeEnv.bgScene, threeEnv.bgCamera );
	threeEnv.renderer.clearDepth();
	threeEnv.renderer.render( threeEnv.scene, threeEnv.camera );


  requestAnimationFrame( loop );
    
}

init();