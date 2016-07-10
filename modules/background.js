var THREE = require('three');
var threeEnv = require('./threeEnv');
var audioAnalyser = require('./audioAnalyser');
var gui = require('./gui').addFolder('Background');
var shaders = {
	vertex: require('../shaders/simple_vertex.glsl'),
	fragment: require('../shaders/swamp_01.glsl')
}

var swampMaterial, swampGeometry, swampMesh;

var params = {
	bounceAmp: 0.5,
	pulseAmp: 0.5,
	scale: 1.0
}

gui.add(params, 'bounceAmp', 0, 1);
gui.add(params, 'pulseAmp', 0, 1);
gui.add(params, 'scale', 1, 10);

swampGeometry = new THREE.PlaneGeometry( window.innerWidth, window.innerHeight);

swampMaterial = new THREE.ShaderMaterial( {

	uniforms: {
		bounce: {
			type: "f",
			value: 0.5
		},
		pulse: {
			type: "f",
			value: 0.5
		},
		scale: {
			type: "f",
			value: 1.0
		},
		iGlobalTime: {
			type: "f",
			value: 0.0
		},
		iResolution: {
			type: "v2",
			value: new THREE.Vector2(window.innerWidth, window.innerHeight)
		}
	},
    vertexShader: shaders.vertex,
    fragmentShader: shaders.fragment
});

swampMesh = new THREE.Mesh( swampGeometry, swampMaterial );

threeEnv.scene.add( swampMesh );

exports.draw = function(timePassed) {

	var levelsData = audioAnalyser.getLevels();

    swampMaterial.uniforms[ 'iGlobalTime' ].value = .00025 * ( timePassed );
    // Twist and bounce should be modified slowly here
    // maybe iterations of shader too
    swampMaterial.uniforms[ 'bounce' ].value = levelsData[0] * params.bounceAmp * 10;
    swampMaterial.uniforms[ 'pulse' ].value = levelsData[1] * params.pulseAmp * 10;
    swampMaterial.uniforms[ 'scale' ].value = parseFloat(params.scale);

}