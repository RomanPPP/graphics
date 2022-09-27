
import glsl from "./glsl"
const vert = glsl`#version 300 es
  layout(location = 0) in vec4 a_position;
  layout(location = 1) in vec3 a_normal;
  layout(location = 5) in mat4 i_matrix;
  uniform mat4 u_matrix;
  uniform mat4 u_world;
  out vec3 v_normal;
  uniform vec3 u_lightWorldPosition;
  out vec3 v_surfaceToLight;
  uniform mat4 u_worldInverseTranspose;
    
  void main() {
      vec3 surfaceWorldPosition = (u_world * a_position).xyz;
      gl_Position = u_matrix * i_matrix * a_position;
    
      v_normal  = mat3(u_worldInverseTranspose) * a_normal;
      v_surfaceToLight = u_lightWorldPosition - surfaceWorldPosition;
}
`
const frag = glsl`#version 300 es
precision mediump float;
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
export {vert, frag}