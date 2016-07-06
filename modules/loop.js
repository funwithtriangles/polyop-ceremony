var THREE = require('three');
var threeEnv = require('./threeEnv');
var audioAnalyser = require('./audioAnalyser');
var background = require('./background');

var renderer = new THREE.WebGLRenderer();
document.body.appendChild( renderer.domElement );
var start, timePassed;

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
  navigator.getUserMedia(
    {audio:true},
    init,
    function(err) {
      console.log("The following error occured: " + err);
    } 
);

function init(stream) {

  renderer.setSize( window.innerWidth, window.innerHeight );
  start = Date.now();
  audioAnalyser.gotStream(stream);
  loop();
}

function loop() {

  timePassed = Date.now() - start;

  audioAnalyser.updateLevels();

  background.draw(timePassed);

  renderer.render( threeEnv.scene, threeEnv.camera );
  requestAnimationFrame( loop );
    
}
