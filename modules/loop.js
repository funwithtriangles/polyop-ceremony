var THREE = require('three');
var threeEnv = require('./threeEnv');
var audioAnalyser = require('./audioAnalyser');
var background = require('./background');

var renderer = new THREE.WebGLRenderer();
document.body.appendChild( renderer.domElement );
var start, timePassed;

function init() {

  renderer.setSize( window.innerWidth, window.innerHeight );
  start = Date.now();
  loop();
}

function loop() {

  timePassed = Date.now() - start;

  audioAnalyser.updateLevels();

  background.draw(timePassed);

  renderer.render( threeEnv.scene, threeEnv.camera );
  requestAnimationFrame( loop );
    
}

init();