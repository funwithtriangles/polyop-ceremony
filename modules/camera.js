var THREE = require('three');
var threeEnv = require('./threeEnv');
var guiFolder = require('./gui').addFolder('Camera');
var mask = require('./mask');

var camera = threeEnv.camera;
var target = mask.mask.mask;
var lookAt = target.position.clone();

var orbiting = false;
var orbitProgress = 0;

var zReset = 500;

lookAt.y += 100;

var radius = 250;
var constant = 0.0002;

var params = {
	x: 0,
	y: 0,
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
	
	} else {

		camera.position.x = params.x;
		camera.position.y = params.y;
		camera.position.z = zReset;
	
	}
	

	camera.lookAt( lookAt );


}


module.exports = {
	draw: draw,
	params: params
}