// http://bkcore.com/blog/3d/webgl-three-js-volumetric-light-godrays.html
// @author Thibaut 'BKcore' Despoulain <http://bkcore.com>

varying vec2 vUv;
uniform sampler2D tDiffuse;
uniform float fX;
uniform float fY;
uniform float fExposure;
uniform float fDecay;
uniform float fDensity;
uniform float fWeight;
uniform float fClamp;
uniform int iSampleLimit;
const int iSamples = 20;

void main()
{
	vec2 deltaTextCoord = vec2(vUv - vec2(fX,fY));
	deltaTextCoord *= 1.0 /  float(iSampleLimit) * fDensity;
	vec2 coord = vUv;
	float illuminationDecay = 1.0;
	vec4 FragColor = vec4(0.0);
	for(int i=0; i < iSamples ; i++)
	{
		if (i == iSampleLimit) break;
		coord -= deltaTextCoord;
		vec4 texel = texture2D(tDiffuse, coord);
		texel *= illuminationDecay * fWeight;
		FragColor += texel;
		illuminationDecay *= fDecay;
	}
	FragColor *= fExposure;
	FragColor = clamp(FragColor, 0.0, fClamp);
	gl_FragColor = FragColor;
}