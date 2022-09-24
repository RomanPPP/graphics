
import glsl from "./glsl"
const vert = glsl`#version 300 es
 
layout(location = 0) in vec4 a_position;

uniform mat4 u_matrix;


    
void main() {

    vec4 pos =   u_matrix * (a_position ) ;
    
    gl_Position = pos;
    
    
      
}`
const frag = glsl`#version 300 es
precision highp float;
 


uniform vec4 u_color;
out vec4 outColor;
void main() {
  
 
  outColor = u_color;
 
  
  
}
`
export {vert, frag}