// varying vec3 vNormal;

// void main() {

// 	vNormal = normal;

// 	vec3 newPosition = position + normal * 10.0;
// 	gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );

// }


#define PHONG
#define USE_ENVMAP
#define ENVMAP_TYPE_CUBE

attribute vec3 displacement;

varying vec3 vViewPosition;
varying vec3 tempPosition;
varying float noise;

uniform float explodeAmount;
uniform float rumble;
uniform float time;

#ifndef FLAT_SHADED

	varying vec3 vNormal;

#endif

#include <common>
#include <uv_pars_vertex>
#include <uv2_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

@import ./includes/perlin_noise;

float turbulence( vec3 p ) {
    float w = 100.0;
    float t = -.5;
    for (float f = 1.0 ; f <= 10.0 ; f++ ){
        float power = pow( 2.0, f );
        t += abs( pnoise( vec3( power * p ), vec3( 10.0, 10.0, 10.0 ) ) / power );
    }
    return t;
}




void main() {

	#include <uv_vertex>
	#include <uv2_vertex>
	#include <color_vertex>

	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>

#ifndef FLAT_SHADED // Normal computed with derivatives when FLAT_SHADED

	vNormal = normalize( transformedNormal );

#endif

	#include <begin_vertex>
	#include <displacementmap_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>

	vViewPosition = - mvPosition.xyz;

	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>

	 // get a turbulent 3d noise using the normal, normal to high freq
	noise = 1.0 * .1 * turbulence( .5 * normal + time);

	float b = pnoise( 0.05 * position, vec3( 1.0 ) );

//	tempPosition = position + normal * b * noise * displacement * 10.;

	vec3 newPosition = position + normal * displacement * ((noise * 100. * rumble) + 1.) * explodeAmount;
	//vec3 newPosition = tempPosition;

	gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );

}