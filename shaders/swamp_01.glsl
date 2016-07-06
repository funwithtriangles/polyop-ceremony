
uniform float iGlobalTime;
uniform vec2 iResolution;
uniform float bounce;
uniform float pulse;
uniform float scale;
float ltime;

@import ./includes/perlin_noise;

varying vec2 vUv;

void main() {
  vec2 p = gl_FragCoord.xy / iResolution.xy * scale;
  ltime = iGlobalTime;
  ltime = ltime*6.;

 
  float f = cnoise(vec3(p, ltime + bounce)) * pulse;

  // vignette
  float vig = 1. - pow(4.*(p.x - .5)*(p.x - .5), 2.);
  vig *= 1. - pow(4.*(p.y - .5)*(p.y - .5), 10.);

  gl_FragColor = vec4(vec3(0., 0.1 + f, 0.),.1);
}