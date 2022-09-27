const vert = glsl`#version 300 es
layout(location = 0) in vec4 a_position;
layout(location = 3) in vec2 a_texcoord;

out vec2 v_texcoord;
uniform mat4 u_matrix;


    
void main() {

    vec4 pos = u_matrix  * a_position;
    
    gl_Position = pos;
    v_texcoord = a_texcoord;  
}`
const frag = glsl`#version 300 es
precision highp float;
 
in vec2 v_texcoord;

uniform vec4 u_color;
uniform sampler2D u_texture;
out vec4 outColor;
void main() {
  outColor = texture(u_texture, v_texcoord);  
}
`
module.exports = {vert, frag}