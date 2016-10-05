var THREE = require('three');
var threeEnv = require('./threeEnv');
var TWEEN = require('tween.js');
var gui = require('./gui');
var mask = require('./mask');
var guiFolder = gui.addFolder('Crystals');
var audioAnalyser = require('./audioAnalyser');
var clock = require('./clock');
var controls = require('./controls');

var numCrystals = 5;
var crystals = [];

var orbitAngle = 0;



var params = {
	speed: 0.02,
	speedFlux: 0,
	opacity: 0,
	radius: 1,
	visible: true,
	scale: 1,
	lightIntensity: 1,
	pulseScale: function() {

		params.scale = 1.4;

		var tween = new TWEEN.Tween(params)
	    .to({scale: 1}, 200)
	    .easing(TWEEN.Easing.Quadratic.Out)
	    .start();

	},
	toggleVisible: function() {
		params.visible = !params.visible;
	},
	fadeIn: function(skip) {

		if (!skip) {

			var tween = new TWEEN.Tween(params)
		    .to({opacity: 1}, 30000)
		    .easing(TWEEN.Easing.Sinusoidal.Out)
		    .start();

		} else {

			params.opacity = 1;

		}
		
	},
	fadeOut: function(skip) {

		if (!skip) {

			var tween = new TWEEN.Tween(params)
		    .to({opacity: 0}, 5000)
		    .easing(TWEEN.Easing.Sinusoidal.Out)
		    .start();

		} else {

			params.opacity = 0;

		}

	},
	startSpeedFlux: function() {
		params.speedFlux = 1;
	},
	changeSpeed: function(skip, speed) {
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
guiFolder.add(params, 'toggleVisible');

var Crystal = function() {

	this.group = new THREE.Object3D();

	this.size = (Math.random() * 15) + 5;
	var geometry = new THREE.IcosahedronGeometry(this.size);
	this.mesh = new THREE.Mesh(geometry, crystalMaterial);

	this.light = new THREE.PointLight( 0xffffff, params.lightIntensity, 1000 );

	this.group.add(this.light);
	this.group.add(this.mesh);

	mask.mask.group.add(this.group);


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

		crystal.mesh.visible = params.visible;
		crystal.mesh.scale.set(params.scale, params.scale, params.scale);

		crystal.group.position.x = Math.sin( (orbitAngle + offset) * 0.5 ) * 200 * params.radius;
		crystal.group.position.y = Math.cos( (orbitAngle + offset) * 0.2 ) * 250 * params.radius;
		crystal.group.position.z = Math.cos( (orbitAngle + offset) * 0.5 ) * 250 * params.radius;

		if (controls.params.isPlaying) {
			crystal.mesh.rotation.x += levelsData[1].average * 0.5;
			crystal.mesh.rotation.y += levelsData[2].average * 0.5;
		}

		crystal.light.intensity = params.lightIntensity;

	}

}



module.exports = {
	draw: draw,
	params: params
}
