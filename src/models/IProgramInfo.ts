import GLcontextWrapper from "../components/GLWrapper";
import IGLWrapper from "./IGLWrapper";
export default interface IProgramInfo {
  vertexShaderSource: string;
  fragmentShaderSource: string;
  uniformSetters: { [id: string]: (arg: Object) => void };
  textureSetters: { [id: string]: (arg: Object) => void };
  fragmentShader: WebGLShader;
  vertexShader: WebGLShader;
  program: WebGLProgram;
  glWrapper: IGLWrapper;
  gl: WebGL2RenderingContext;
  setUniforms(uniforms:{[key:string] : number | Iterable<Number>}):void
}
