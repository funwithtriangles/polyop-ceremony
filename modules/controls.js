var THREE = require('three');
var threeEnv = require('./threeEnv');
var camera = require('./camera');
var audio = require('./audioAnalyser').audio;
// var effect = new THREE.VREffect( threeEnv.renderer );
var controls = new THREE.VRControls(threeEnv.camera);
//var WebVRManager = require('./webvr-manager');
//var composers = require('./composers');

//var manager = new WebVRManager(threeEnv.renderer, effect);


function launchIntoFullscreen(element) {
  if(element.requestFullscreen) {
    element.requestFullscreen();
  } else if(element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if(element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if(element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
}

threeEnv.renderer.domElement.addEventListener('click', function() {
	launchIntoFullscreen(threeEnv.renderer.domElement);
	audio.play();
})

var run = function(timePassed) {

	controls.update();
	//manager.render(threeEnv.scene, threeEnv.camera, composers.finalComposer.renderTarget2);

}

var onResize = function(e) {
  // effect.setSize(window.innerWidth, window.innerHeight);
  threeEnv.renderer.setSize( window.innerWidth, window.innerHeight )
  threeEnv.camera.aspect = window.innerWidth / window.innerHeight;
  threeEnv.camera.updateProjectionMatrix();
}

window.addEventListener('resize', onResize, true);
window.addEventListener('vrdisplaypresentchange', onResize, true);

module.exports = {
	run: run
}