const vert = glsl`#version 300 es

precision highp float;
layout(location = 0) in mat4 i_matrix;

uniform mat4 u_matrix;


    
void main() {
    
    vec4 pos = u_matrix * i_matrix * vec4(0.0, 0.0, 0.0, 1.0);
    
    gl_Position = pos;
    gl_PointSize = 50.0;
    
      
}`
const frag = glsl`#version 300 es
precision highp float;
 


uniform vec4 u_color;
out vec4 outColor;
void main() {
  
 
  outColor = u_color;
 
  
  
}
`
module.exports = {vert, frag}