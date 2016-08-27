var THREE = require('three');
var threeEnv = require('./threeEnv');
var gui = require('./gui');
var mask = require('./mask');
var guiFolder = gui.addFolder('Crystals');
var audioAnalyser = require('./audioAnalyser');

var numCrystals = 3;
var crystals = [];

var orbitAngle = 0;

var crystalMaterial = new THREE.MeshBasicMaterial({
	wireframe: true
});

var params = {
	speed: 0.05
}

guiFolder.add(params, 'speed', 0, 1).name('Crystal Speed');

var Crystal = function() {

	this.size = (Math.random() * 15) + 5;
	var geometry = new THREE.IcosahedronGeometry(this.size);
	this.mesh = new THREE.Mesh(geometry, crystalMaterial);

	mask.mask.add(this.mesh);

	var light = new THREE.PointLight( 0xffffff, 1, 0 );

	this.mesh.add(light);


}

for (var i = 0; i < numCrystals; i++) {

	crystals.push(new Crystal());

}



var draw = function() {


	var levelsData = audioAnalyser.getLevels().bands;

	orbitAngle += params.speed;

	for (var i = 0; i < numCrystals; i++) {

		var crystal = crystals[i];
		var offset = i * 10;

		crystal.mesh.position.x = Math.sin( (orbitAngle + offset) * 0.5 ) * 200;
		crystal.mesh.position.y = Math.cos( (orbitAngle + offset) * 0.2 ) * 250;
		crystal.mesh.position.z = Math.cos( (orbitAngle + offset) * 0.5 ) * 250;

		crystal.mesh.rotation.x += levelsData[1].average * 0.5;
		crystal.mesh.rotation.y += levelsData[2].average * 0.5;

	}

}



module.exports = {
	draw: draw,
	params: params
}
