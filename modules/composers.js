var THREE = require('three');
var threeEnv = require('./threeEnv');
// var vLightGui = require('./gui').addFolder('vLight');
var shaderGui = require('./gui').addFolder('Shaders');
var vLight = require('./vLight');
var shaders = {
	vertex: require('../shaders/simple_vertex.glsl'),
	godRays: require('../shaders/god_rays.glsl'),
	hBlur: require('../shaders/h_blur.glsl'),
	vBlur: require('../shaders/v_blur.glsl'),
	additive: require('../shaders/additive.glsl')
}

var hBlur, vBlur;
var bluriness = 3;
var renderModel;
var renderModelOcl;
var oclComposer;
var renderTarget;

var grPass;
var finalPass;
var copyPass;

var renderTargetParams = {
	stencilBuffer: false
}


// Prepare the main and occlusion scene render pass
renderBg = new THREE.RenderPass( threeEnv.bgScene, threeEnv.bgCamera );
renderModelOcl = new THREE.RenderPass( threeEnv.oclScene, threeEnv.camera );
renderModel = new THREE.RenderPass( threeEnv.scene, threeEnv.camera );

// renderBg.clear = false;

 renderModel.clearDepth = true;
 renderModel.clear = false;

// Prepare the simple blur shader passes
hBlur = new THREE.ShaderPass({
	uniforms: {
		tDiffuse: { type: "t", value: null} ,
		h:  { type: "f", value: bluriness / threeEnv.box.width }
	},
	vertexShader: shaders.vertex,
	fragmentShader: shaders.hBlur 
});

vBlur = new THREE.ShaderPass({
	uniforms: {
		tDiffuse: { type: "t", value: null },
		v:  { type: "f", value: bluriness / threeEnv.box.height }
	},
	vertexShader: shaders.vertex,
	fragmentShader: shaders.hBlur 
});
 
// Prepare the godray shader pass
grPass = new THREE.ShaderPass({
	uniforms: {
		tDiffuse: {type: "t", value: null},
		fX: {type: "f", value: 0.5},
		fY: {type: "f", value: 0.5},
		fExposure: {type: "f", value: 0.0},
		fDecay: {type: "f", value: 0.93},
		fDensity: {type: "f", value: 0.96},
		fWeight: {type: "f", value: 0.4},
		fClamp: {type: "f", value: 1.0},
		iSampleLimit: {type: "i", value: 20}
	},
	vertexShader: shaders.vertex,
	fragmentShader: shaders.godRays
});

grPass.needsSwap = false;
grPass.renderToScreen = false;

// copyPass = new THREE.ShaderPass( THREE.CopyShader );
// copyPass.renderToScreen = true;

finalPass = new THREE.ShaderPass({
	uniforms: {
		tDiffuse: { type: "t", value: null },
		tAdd: { type: "t", value: null },
		fCoeff: { type: "f", value: 1.0 }
	},
	vertexShader: shaders.vertex,
	fragmentShader: shaders.additive
});

finalPass.needsSwap = true;
// finalPass.renderToScreen = true;

rgbPass = new THREE.ShaderPass(THREE.RGBShiftShader);

filmPass = new THREE.ShaderPass(THREE.FilmShader);

filmPass.uniforms.sCount.value = threeEnv.box.height;
filmPass.uniforms.nIntensity.value = 0.23;

filmPass.renderToScreen = true;
 
// Prepare the occlusion composer's render target
renderTargetOcl = new THREE.WebGLRenderTarget( 
	threeEnv.box.width/2, 
	threeEnv.box.height/2, 
	renderTargetParams
);

// Prepare the composer
oclComposer = new THREE.EffectComposer( threeEnv.renderer, renderTargetOcl );
oclComposer.addPass( renderModelOcl );
oclComposer.addPass( hBlur );
oclComposer.addPass( vBlur );
oclComposer.addPass( hBlur );
oclComposer.addPass( vBlur );
oclComposer.addPass( grPass );


finalPass.uniforms.tAdd.value = oclComposer.renderTarget1.texture;

renderTarget = new THREE.WebGLRenderTarget( 
	threeEnv.box.width, 
	threeEnv.box.height, 
	renderTargetParams 
);

finalComposer = new THREE.EffectComposer( threeEnv.renderer, renderTarget );
finalComposer.addPass( renderBg );
// finalComposer.addPass( copyPass );

finalComposer.addPass( renderModel );
finalComposer.addPass( finalPass );
finalComposer.addPass( rgbPass );
finalComposer.addPass( filmPass );

// Projects object origin into screen space coordinates using provided camera
var projectOnScreen = function(object, camera) {

	var mat = new THREE.Matrix4();
	mat.multiplyMatrices( camera.matrixWorldInverse, object.matrixWorld);
	mat.multiplyMatrices( camera.projectionMatrix , mat);

	var c = mat.n44;
	var lPos = new THREE.Vector3(mat.n14/c, mat.n24/c, mat.n34/c);
	lPos.multiplyScalar(0.5);
	lPos.addScalar(0.5);

	return lPos;
}

var draw = function(timePassed) {

	var lPos = projectOnScreen(vLight.mesh, threeEnv.camera);
	grPass.uniforms["fX"].value = lPos.x;
	grPass.uniforms["fY"].value = lPos.y;

	filmPass.uniforms[ 'time' ].value  = .00025 * ( timePassed );

	threeEnv.renderer.setClearColor(0x000000, 0);
 	oclComposer.render( 0.1 );
 	threeEnv.renderer.setClearColor(threeEnv.params.bgColor);
	finalComposer.render( 0.1 );

	grPass.uniforms.fExposure.value = vLight.params.exposure;
	grPass.uniforms.fDensity.value = vLight.params.fDensity;
	grPass.uniforms.fWeight.value = vLight.params.fWeight;
	grPass.uniforms.fClamp.value = vLight.params.fClamp;
	grPass.uniforms.iSampleLimit.value = vLight.params.iSampleLimit;

}

var changeQuality = function(quality) {
	renderTargetOcl.setSize(threeEnv.box.width/quality/2, threeEnv.box.height/quality/2);
	finalComposer.setSize(threeEnv.box.width/quality, threeEnv.box.height/quality);
}


// vLightGui.add(grPass.uniforms.fDecay, 'value').min(0.6).max(1.0).step(0.01).name("Decay");
// vLightGui.add(grPass.uniforms.fDensity, 'value').min(0.0).max(1.0).step(0.01).name("Density");
// vLightGui.add(grPass.uniforms.fWeight, 'value').min(0.0).max(1.0).step(0.01).name("Weight");
// vLightGui.add(grPass.uniforms.fClamp, 'value').min(0.0).max(1.0).step(0.01).name("Clamp");

shaderGui.add(filmPass.uniforms.grayscale, 'value').name("grayscale");
shaderGui.add(filmPass.uniforms.nIntensity, 'value').min(0.0).max(1.0).name("nIntensity");
shaderGui.add(filmPass.uniforms.sIntensity, 'value').min(0.0).max(1.0).name("sIntensity");
shaderGui.add(filmPass.uniforms.sCount, 'value').min(0).max(4096).name("sCount");

shaderGui.add(rgbPass.uniforms.amount, 'value').min(0).max(0.1).name("RGBAmount");
shaderGui.add(rgbPass.uniforms.angle, 'value').min(0).max(Math.PI*2).name("RGBAngle");


module.exports = {
	draw: draw,
	changeQuality: changeQuality,
	finalComposer: finalComposer
}
