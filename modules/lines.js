var THREE = require('three');
var TWEEN = require('tween.js');
var threeEnv = require('./threeEnv');
var gui = require('./gui').addFolder('Lines');

var numLines = 30;
var lineLength = 10000;
var lineWidth = 5;
var lines = [];

var group = new THREE.Object3D();
var oclGroup = new THREE.Object3D();

threeEnv.scene.add(group);
threeEnv.oclScene.add(oclGroup);


var params = {
	randomFlash: function() {

		for (var i = 0; i < numLines; i++) {
			if (Math.random() > 0.9) {
				lines[i].flash();
			}
		}

	}
}

gui.add(params, 'randomFlash');

var Line = function() {

	var material = new THREE.MeshBasicMaterial({
		color: 0x000000,
		transparent: true,
		opacity: 0
	});

	var geom = new THREE.BoxGeometry(lineWidth, lineLength, lineWidth, 1, 1);
	var mesh = new THREE.Mesh(geom, material);

	geom.translate(0, lineLength/2, 0);

	mesh.visible = false;
	mesh.rotation.x = Math.PI * 2 * Math.random();
	mesh.rotation.y = Math.PI * 2 * Math.random();
	mesh.rotation.z = Math.PI * 2 * Math.random();

	group.add(mesh);

	var oclMesh = mesh.clone();

	oclGroup.add(oclMesh);

	this.flash = function() {

		material.opacity = 1;
		mesh.visible = true;
		oclMesh.visible = true;

		var tween = new TWEEN.Tween(material)
	    .to({opacity: 0}, 500)
	    .easing(TWEEN.Easing.Quintic.Out)
	    .start()
	    .onComplete(function() {
	    	mesh.visible = false;
	    	oclMesh.visible = false;
	    })

	}

}


for (var i = 0; i < numLines; i++) {

	lines.push(new Line());

}

var draw = function() {
	group.rotation.x += 0.01;
	group.rotation.y += 0.01;
	group.rotation.z += 0.01;

	oclGroup.rotation.x += 0.01;
	oclGroup.rotation.y += 0.01;
	oclGroup.rotation.z += 0.01;
}

module.exports = {
	draw: draw,
	params: params
}