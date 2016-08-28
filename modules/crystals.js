var THREE = require('three');
var threeEnv = require('./threeEnv');
var TWEEN = require('tween.js');
var gui = require('./gui');
var mask = require('./mask');
var guiFolder = gui.addFolder('Crystals');
var audioAnalyser = require('./audioAnalyser');
var clock = require('./clock');

var numCrystals = 5;
var crystals = [];

var orbitAngle = 0;



var params = {
	speed: 0.02,
	speedFlux: 0,
	opacity: 0,
	radius: 1,
	fadeIn: function() {
		var tween = new TWEEN.Tween(params)
	    .to({opacity: 1}, 30000)
	    .easing(TWEEN.Easing.Sinusoidal.Out)
	    .start();
	},
	startSpeedFlux: function() {
		params.speedFlux = 1;
	},
	changeSpeed: function(speed) {
		params.speed = speed;
	}
}

var crystalMaterial = new THREE.MeshBasicMaterial({
	wireframe: true,
	transparent: true,
	opacity: params.opacity
});

guiFolder.add(params, 'radius', 0, 10).name('Crystal Radius');
guiFolder.add(params, 'speed', 0, 1).name('Crystal Speed');
guiFolder.add(params, 'speedFlux', 0, 1).name('Speed Flux');

var Crystal = function() {

	this.size = (Math.random() * 15) + 5;
	var geometry = new THREE.IcosahedronGeometry(this.size);
	this.mesh = new THREE.Mesh(geometry, crystalMaterial);

	mask.mask.group.add(this.mesh);

	var light = new THREE.PointLight( 0xffffff, 1, 0 );

	this.mesh.add(light);


}

for (var i = 0; i < numCrystals; i++) {

	crystals.push(new Crystal());

}



var draw = function() {


	var levelsData = audioAnalyser.getLevels().bands;



	crystalMaterial.opacity = params.opacity;

	// params.radius = ((clock.lfo.sineTwo + 2) / 4) + 1;

	var speed = ((clock.lfo.sine * params.speedFlux) + 0.8) * params.speed;

	orbitAngle += speed;

	for (var i = 0; i < numCrystals; i++) {

		var crystal = crystals[i];
		var offset = i * 10;

		crystal.mesh.position.x = Math.sin( (orbitAngle + offset) * 0.5 ) * 200 * params.radius;
		crystal.mesh.position.y = Math.cos( (orbitAngle + offset) * 0.2 ) * 250 * params.radius;
		crystal.mesh.position.z = Math.cos( (orbitAngle + offset) * 0.5 ) * 250 * params.radius;

		crystal.mesh.rotation.x += levelsData[1].average * 0.5;
		crystal.mesh.rotation.y += levelsData[2].average * 0.5;

	}

}



module.exports = {
	draw: draw,
	params: params
}
