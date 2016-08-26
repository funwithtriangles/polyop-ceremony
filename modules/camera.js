var THREE = require('three');
var threeEnv = require('./threeEnv');
var guiFolder = require('./gui').addFolder('Camera');
var mask = require('./mask');

var camera = threeEnv.camera;
var target = mask.mask;
var lookAt = target.position.clone();

var orbiting = false;
var orbitProgress = 0;

var zReset = 500;

lookAt.y += 100;

console.log(mask);

var radius = 250;
var constant = 0.0002;

var params = {
	startOrbit: function() {
		orbiting = true;
		orbitProgress ++;
	},
	stopOrbit: function() {
		orbiting = false;
	}
}


guiFolder.add(params, 'startOrbit');
guiFolder.add(params, 'stopOrbit');

var draw = function(timePassed) {


	if (orbiting) {
		camera.position.x = target.position.x + radius * Math.cos( constant * timePassed + orbitProgress );         
		camera.position.z = target.position.z + radius * Math.sin( constant * timePassed + orbitProgress );
		camera.position.y = target.position.y + radius * Math.cos( constant * timePassed + orbitProgress );
		camera.lookAt( lookAt );
	} else {

		camera.position.x = 0;
		camera.position.y = 0;
		camera.position.z = zReset;

		camera.lookAt( lookAt );
	}
	


}


module.exports = {
	draw: draw,
	params: params
}