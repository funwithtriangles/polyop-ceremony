var THREE = require('three');
var threeEnv = require('./threeEnv');
var guiFolder = require('./gui').addFolder('Camera');
var mask = require('./mask');

var camera = threeEnv.camera;
var target = mask.mask.mask;
var lookAt = target.position.clone();

var orbiting = false;
var orbitProgress = 0;

lookAt.y += 100;

var radius = 250;
var constant = 0.0002;

var params = {
	x: 0,
	y: 0,
	zReset: 500,
	positionObject: camera,
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

		params.positionObject.position.x = target.position.x + radius * Math.cos( constant * timePassed + orbitProgress );         
		params.positionObject.position.z = target.position.z + radius * Math.sin( constant * timePassed + orbitProgress );
		params.positionObject.position.y = target.position.y + radius * Math.cos( constant * timePassed + orbitProgress );
		params.positionObject.lookAt( lookAt );
	
	} else {

		params.positionObject.position.x = params.x;
		params.positionObject.position.y = params.y;
		params.positionObject.position.z = params.zReset;
	
	}
	

//	


}


module.exports = {
	draw: draw,
	params: params
}