var threeEnv = require('./threeEnv');
var camera = require('./camera');

var posX = 0;
var posY = 0;
var width = threeEnv.box.width;
var height = threeEnv.box.height;

var shift = 0.1;

document.addEventListener('mousemove', function(e) {

	posX = (((e.clientX / width) - 0.5) * 2) * width * shift / 2;
	posY = (((e.clientY / height) - 0.5) * 2) * height * shift / 2;
})

var run = function() {

	camera.params.x = posX;
	camera.params.y = posY;

}

module.exports = {
	run: run
}