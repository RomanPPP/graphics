const vert = glsl`#version 300 es

layout(location = 0) in vec4 a_POSITION;
layout(location = 1) in vec3 a_NORMAL;
layout(location = 2) in vec4 a_WEIGHTS_0;
layout(location = 3) in uvec4 a_JOINTS_0;


uniform mat4 u_matrix;
uniform sampler2D u_jointTexture;
uniform float u_numJoints;
uniform mat4 u_world;
out vec3 v_normal;
uniform vec3 u_lightWorldPosition;
out vec3 v_surfaceToLight;
mat4 getBoneMatrix(uint jointNdx) {
  return mat4(
    texelFetch(u_jointTexture, ivec2(0, jointNdx), 0),
    texelFetch(u_jointTexture, ivec2(1, jointNdx), 0),
    texelFetch(u_jointTexture, ivec2(2, jointNdx), 0),
    texelFetch(u_jointTexture, ivec2(3, jointNdx), 0));
}
 
void main() {
  mat4 skinMatrix = getBoneMatrix(a_JOINTS_0[0]) * a_WEIGHTS_0[0] +
                    getBoneMatrix(a_JOINTS_0[1]) * a_WEIGHTS_0[1] +
                    getBoneMatrix(a_JOINTS_0[2]) * a_WEIGHTS_0[2] +
                    getBoneMatrix(a_JOINTS_0[3]) * a_WEIGHTS_0[3];
  mat4 world = u_matrix * skinMatrix;
  vec3 surfaceWorldPosition = (u_world * a_POSITION).xyz;
  gl_Position =  world * a_POSITION;
  v_normal = mat3(world) * a_NORMAL;
  v_surfaceToLight = u_lightWorldPosition - surfaceWorldPosition;
}
`
const frag = glsl`#version 300 es
precision highp float;
in vec3 v_normal;
in vec3 v_surfaceToLight;
 
uniform vec4 u_ambientLight;
uniform vec4 u_color;
out vec4 outColor;
void main() {
  vec3 normal = normalize(v_normal);
 
  vec3 surfaceToLightDirection = normalize(v_surfaceToLight);
 
 
  float light = dot(normal, surfaceToLightDirection);
 
  outColor = u_color;
 
  
  outColor.rgb *= light + u_ambientLight.rgb;
}
`
module.exports = {vert, frag}